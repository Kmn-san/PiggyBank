import { pool } from "../utlis/db.js"
import { getMonthRange } from "../utlis/monthFormat.js"

export const fetchTransactions = async (userId, month) => {
    const { monthStart, nextMonthStart } = getMonthRange(month)

    const { rows: transactions } = await pool.query(`
        SELECT 
            t.id,
            t.type,
            t.category,
            t.amount,
            t.note,
            t.transaction_date AS "transactionDate",
            t.from_account_id AS "fromAccountId",
            from_account.name AS "fromAccountName",
            t.to_account_id AS "toAccountId",
            to_account.name AS "toAccountName"
        FROM transactions t
        LEFT JOIN accounts from_account
            ON t.from_account_id = from_account.id
            AND from_account.user_id = t.user_id
        LEFT JOIN accounts to_account
            ON t.to_account_id = to_account.id
            AND to_account.user_id = t.user_id
        WHERE t.user_id = $1
            AND t.deleted_at IS NULL
            AND t.transaction_date >= $2::date
            AND t.transaction_date < $3::date
        ORDER BY t.transaction_date DESC,t.created_at DESC
        `, [userId, monthStart, nextMonthStart])

    return transactions
}

export const transferAccount = async (userId, amount, fromAccount, toAccount, note, transactionDate) => {

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
        const { rows: accounts } = await client.query(`
            SELECT id,name,current_amount
            FROM accounts
            WHERE user_id = $1
            FOR UPDATE
        `, [userId])

        if (accounts.length === 0) {
            const error = new Error("No Such User.")
            error.statusCode = 404
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
            ,note,transaction_date)
            VALUES
            (
            $1,'transfer',$2,$3,NULL,$4,$5,$6
            )
            `, [userId, fromAccount, toAccount, amount, note ?? null, transactionDate])

        await client.query("COMMIT")
        return transferAccount
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

export const transferIncome = async (userId, amount, transactionDate, note) => {

    const client = await pool.connect()
    try {

        await client.query("BEGIN")

        const { rows: account } = await client.query(`
        SELECT id FROM accounts
        WHERE user_id = $1
        AND name = 'Working Account'
        FOR UPDATE
        `, [userId])

        if (account.length === 0) {
            const error = new Error("No such user.");
            error.statusCode = 400;
            throw error;
        }

        const workingAccountId = account[0].id

        const { rows: transaction } = await client.query(
            `
        INSERT INTO transactions
             (user_id,type,to_account_id,amount,note,transaction_date)
         VALUES
             ($1,'income',$2,$3,$4,$5)
         RETURNING  
                id,
                type,
                to_account_id AS "ToAccountId",
                amount,
                note,
                transaction_date AS "transactionDate"
         `, [userId, workingAccountId, amount, note ?? null, transactionDate
        ]
        )

        await client.query(`
         UPDATE accounts
         SET 
            current_amount = current_amount + $1,
            updated_at = NOW()
         WHERE id = $2
             AND user_id = $3
             AND is_archived = FALSE
         `, [amount, workingAccountId, userId])

        await client.query("COMMIT")
        return transaction
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}