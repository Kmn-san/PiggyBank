import { pool } from "../utlis/db.js"
import { getMonthRange } from "../utlis/monthFormat.js";

export const getDashboard = async (userId, month) => {
    const { selectedMonth, monthStart, nextMonthStart } = getMonthRange(month);

    const { rows: accounts } = await pool.query(`
            SELECT name,type,current_amount AS currentAmount
            FROM accounts
            WHERE user_id = $1
                AND is_archived = FALSE
                AND name IN(
                    'Emergency Account',
                    'Working Account',
                    'Daily Expenses'
                )
        `, [userId])

    const { rows: expenses } = await pool.query(`
            SELECT category,SUM(amount) AS amount
            FROM transactions
            WHERE user_id = $1
                AND type = 'expense'
                AND deleted_at IS NULL
                AND transaction_date >= $2::date
                AND transaction_date < $3::date
            GROUP BY category

        `, [userId, monthStart, nextMonthStart])

    const { rows: transactions } = await pool.query(`
        SELECT 
            t.id,
            t.type,
            t.category,
            t.amount,
            t.transaction_date AS "transactionDate",
            from_account.name AS "fromAccountName",
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
        LIMIT 5
        `, [userId, monthStart, nextMonthStart])


    const result = {
        month: selectedMonth,
        accounts,
        expenses,
        transactions
    }

    return result
}