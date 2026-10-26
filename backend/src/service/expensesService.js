import { pool } from "../utlis/db.js";
import { getMonthRange } from "../utlis/monthFormat.js"

export const getExpenses = async (userId, month) => {

    const { monthStart, nextMonthStart } = getMonthRange(month);

    const { rows: accounts } = await pool.query(`
        SELECT name,current_amount
        FROM accounts
        WHERE user_id = $1
            AND name = 'Daily Expenses'
            AND is_archived IS FALSE
            `, [userId])

    const { rows } = await pool.query(`
        SELECT 
        category, SUM(amount) AS amount
        FROM transactions
        WHERE user_id = $1
            AND type = 'expense'
            AND transaction_date >= $2::date
            AND transaction_date < $3::date
            AND deleted_at IS NULL
        GROUP BY category
        `, [userId, monthStart, nextMonthStart])
    return {
        account: accounts[0] ?? null,
        expenses: rows.map(row => ({
            ...row,
            amount: Number(row.amount)
        }))
    }
}

export const transferExpenses = async (userId, amount, category, note) => {
    const client = await pool.connect()
    try {

        await client.query("BEGIN")

        const { rows } = await client.query(`
         SELECT id 
         FROM accounts
         WHERE name = 'Daily Expenses'
         AND is_archived = FALSE
         AND user_id = $1
         FOR UPDATE
         `, [userId])

        if (rows.length === 0) {
            const error = new Error("User or account not found.");
            error.statusCode = 404;
            throw error;
        }

        const accountId = rows[0].id

        const { rows: transaction } = await client.query(
            `
        INSERT INTO transactions
             (user_id,type,from_account_id,category,amount,note)
         VALUES
             ($1,'expense',$2,$3,$4,$5)
         RETURNING  id,
                type,
                from_account_id AS "fromAccountId",
                category,
                amount,
                note,
                transaction_date AS "transactionDate"
         `, [userId, accountId, category, amount, note ?? null]
        )

        await client.query(`
         UPDATE accounts
         SET 
            current_amount = current_amount - $1,
            updated_at = NOW()
         WHERE id = $2
             AND user_id = $3
             AND is_archived = FALSE
             AND current_amount >= $1
         `, [amount, accountId, userId])

        await client.query("COMMIT")
        return transaction
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}