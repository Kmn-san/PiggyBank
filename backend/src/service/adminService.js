import { pool } from "../utlis/db.js"

const PARTICIPANT = `
    u.is_deleted = FALSE
    AND u.deleted_at IS NULL
    AND u.role <> 'admin'`

const FROM = `($1::date)::timestamp AT TIME ZONE 'Asia/Tokyo'`
const TO = `(($2::date + 1)::timestamp AT TIME ZONE 'Asia/Tokyo')`

export const fetchData = async (startDate, endDate) => {
    const params = [startDate, endDate]

    const [categoryResult, dailyResult, dayCategoryResult] = await Promise.all([
        // 1. Share of each category over the whole period
        pool.query(`
            SELECT t.category, SUM(t.amount) AS total_expenses
            FROM transactions t
            JOIN users u ON u.id = t.user_id
            WHERE t.type = 'expense'
                AND t.category IS NOT NULL
                AND t.deleted_at IS NULL
                AND ${PARTICIPANT}
                AND t.transaction_date >= ${FROM}
                AND t.transaction_date <  ${TO}
            GROUP BY t.category
            ORDER BY total_expenses DESC
        `, params),

        // 2. One row for EVERY day in the range, including days with no spending
        pool.query(`
            WITH participants AS (
                SELECT COUNT(*) AS user_count
                FROM users u
                WHERE ${PARTICIPANT}
            ),
            calendar AS (
                SELECT generate_series($1::date, $2::date, INTERVAL '1 day')::date AS day
            ),
            daily_totals AS (
                SELECT (t.transaction_date AT TIME ZONE 'Asia/Tokyo')::date AS day,
                       SUM(t.amount) AS total_expense
                FROM transactions t
                JOIN users u ON u.id = t.user_id
                WHERE t.type = 'expense'
                    AND t.category IS NOT NULL
                    AND t.deleted_at IS NULL
                    AND ${PARTICIPANT}
                    AND t.transaction_date >= ${FROM}
                    AND t.transaction_date <  ${TO}
                GROUP BY 1
            )
            SELECT
                calendar.day::text AS date,        -- plain "YYYY-MM-DD", so the server timezone cannot shift it
                COALESCE(daily_totals.total_expense, 0) AS total_expense,
                ROUND(
                    COALESCE(daily_totals.total_expense, 0)::numeric / NULLIF(participants.user_count, 0),
                    2
                ) AS average_expense_per_user
            FROM calendar
            CROSS JOIN participants
            LEFT JOIN daily_totals ON daily_totals.day = calendar.day
            ORDER BY calendar.day
        `, params),

        // 3. Category totals for each day (shown when the admin taps a day)
        pool.query(`
            SELECT (t.transaction_date AT TIME ZONE 'Asia/Tokyo')::date::text AS date,
                   t.category,
                   SUM(t.amount) AS amount
            FROM transactions t
            JOIN users u ON u.id = t.user_id
            WHERE t.type = 'expense'
                AND t.category IS NOT NULL
                AND t.deleted_at IS NULL
                AND ${PARTICIPANT}
                AND t.transaction_date >= ${FROM}
                AND t.transaction_date <  ${TO}
            GROUP BY 1, t.category
            ORDER BY 1, amount DESC
        `, params),
    ])

    const grand = categoryResult.rows.reduce((sum, r) => sum + Number(r.total_expenses), 0)
    const expensesChart = categoryResult.rows.map((r) => ({
        category: r.category,
        amount: r.total_expenses,
        percent: grand ? Math.round((Number(r.total_expenses) / grand) * 1000) / 10 : 0,
    }))

    const DailyExpenses = dailyResult.rows
    const totalAverageExpenses = DailyExpenses.length
        ? Math.round(
            DailyExpenses.reduce((sum, r) => sum + Number(r.average_expense_per_user), 0) / DailyExpenses.length
        )
        : 0

    return {
        totalAverageExpenses,
        DailyExpenses,
        expensesChart,
        DailyCategoryExpenses: dayCategoryResult.rows,
    }
}