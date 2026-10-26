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

    const { rows: transactions } = await pool.query(
        `
            SELECT id,type,category,amount,note,transaction_date
            FROM transactions
            WHERE user_id = $1
                AND deleted_at IS NULL
            ORDER BY transaction_date DESC, created_at DESC
            LIMIT 5
        `, [userId]
    )

    const result = {
        month: selectedMonth,
        accounts,
        expenses,
        transactions
    }

    return result
}