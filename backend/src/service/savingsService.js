import { pool } from "../utlis/db.js"

export const getSavings = async (userId) => {
    const { rows } = await pool.query(`
        SELECT id,name,current_amount AS "currentAmount"
        FROM accounts
        WHERE user_id = $1
            AND is_archived = FALSE
            AND (name ='Working Account'
            OR type = 'savings')
        `, [userId])
    return rows
}

export const transferSavings = async (userId, amount, fromAccount, toAccount) => {

    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        if (fromAccount === toAccount) {
            const error = new Error("Source and destination accounts must be different.");
            error.statusCode = 400;
            throw error;
        }

        if (!Number.isInteger(amount) || amount <= 0) {
            const error = new Error("Transfer amount must be a positive integer.");
            error.statusCode = 400;
            throw error;
        }
        const { rows } = await client.query(`
            SELECT id,name,current_amount
            FROM accounts
            WHERE user_id = $1
                AND (name= 'Working Account' 
                OR type = 'savings')
            FOR UPDATE
        `, [userId])

        const accountIds = rows.map((account) => account.id)
        if (
            !accountIds.includes(fromAccount) ||
            !accountIds.includes(toAccount)
        ) {
            const error = new Error("Select savings account only.")
            error.statusCode = 400
            throw error
        }

        const { rows: transferAccount } = await client.query(
            `
            UPDATE accounts AS a
            SET 
                updated_at = NOW(),
                current_amount = current_amount +  
                    CASE 
                        WHEN a.id = $2 THEN $3
                        WHEN a.id = $1 THEN -$3
                    END
            WHERE a.id IN ($1,$2)
                AND user_id = $4
                AND (
                    a.id = $2
                    OR (a.id = $1 AND a.current_amount >= $3))
                AND (a.name = 'Working Account'
                OR a.type = 'savings')
                AND is_archived = FALSE
            RETURNING a.id,a.name,a.current_amount
            `, [fromAccount, toAccount, amount, userId]
        )

        if (transferAccount.length !== 2) {
            const error = new Error(
                "Invalid accounts or insufficient balance."
            );
            error.statusCode = 400;
            throw error;
        }

        await client.query(`
            INSERT INTO transactions
            (
            user_id,type,from_account_id,to_account_id,category,amount
            )
            VALUES
            (
            $1,'transfer',$2,$3,NULL,$4
            )
            `, [userId, fromAccount, toAccount, amount])

        await client.query("COMMIT")
        return transferAccount
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

export const createGoal = async (userId, name) => {
    const { rows } = await pool.query(`
        INSERT INTO accounts
            (user_id,name,type)
        VALUES
            ($1,$2,$3)
        RETURNING id,name,type,current_amount AS "currentAmount"`,
        [userId, name, 'savings'])
    return rows[0]
}

export const archiveGoal = async (userId, goalId) => {
    const { rows } = await pool.query(`
        UPDATE accounts
        SET is_archived = NOT is_archived,
            updated_at  = NOW()
        WHERE id = $1
                AND user_id = $2
                AND type = 'savings'
                AND current_amount = 0
        RETURNING id,name,type,current_amount AS "currentAmount",is_archived AS "isArchived"
            `, [goalId, userId])

    if (rows.length === 0) {
        const error = new Error(
            "Goal not found or already archived."
        );
        error.statusCode = 404;
        throw error;
    }
    return rows[0]
}

export const editGoal = async (userId, goalId, name) => {
    const { rows } = await pool.query(`
        UPDATE accounts
        SET name = $1
        WHERE user_id = $2
            AND id = $3
            AND is_archived = FALSE
        RETURNING id,name,type,current_amount AS "currentAmount",is_archived AS "isArchived"`, [name, userId, goalId])
    if (rows.length === 0) {
        const error = new Error(
            "Goal not found or already archived."
        );
        error.statusCode = 404;
        throw error;
    }
    return rows[0]
}