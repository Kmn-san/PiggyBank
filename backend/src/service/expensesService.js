import { pool } from "../utlis/db.js";

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