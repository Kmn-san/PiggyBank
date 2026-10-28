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
        LIMIT 10
        `, [userId, monthStart, nextMonthStart])

    return transactions
}