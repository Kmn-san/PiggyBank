import { pool } from "../utlis/db.js"

export const fetchData = async (startDate, endDate) => {
    const { rows: expensesTotal } = await pool.query(`
           SELECT
                t.category,
                SUM(t.amount) AS total_expenses
            FROM transactions t
            JOIN users u ON u.id = t.user_id
            WHERE
                t.type = 'expense'
                AND t.category IS NOT NULL
                AND t.deleted_at IS NULL
                AND u.is_deleted = FALSE
                AND u.deleted_at IS NULL
                AND u.role <> 'admin'
                AND t.transaction_date >=
                    ($1::date)::timestamp AT TIME ZONE 'Asia/Tokyo'
                AND t.transaction_date <
                    (($2::date + 1)::timestamp AT TIME ZONE 'Asia/Tokyo')
            GROUP BY t.category
            ORDER BY total_expenses DESC;
        `, [startDate, endDate])

    const grand = expensesTotal.reduce((sum, r) => sum + Number(r.total_expenses), 0)
    const expensesChart = expensesTotal.map((r) => ({
        category: r.category,
        amount: r.total_expenses,
        percent: grand ? Math.round((Number(r.total_expenses) / grand) * 1000) / 10 : 0
    }))

    const { rows: DailyExpenses } = await pool.query(`
           WITH participants AS (
            SELECT COUNT(*) AS user_count
            FROM users
            WHERE is_deleted = FALSE
                AND deleted_at IS NULL
                AND role <> 'admin'
        ),
        calendar AS (
            SELECT generate_series(
                $1::date,
                $2::date,
                INTERVAL '1 day'
            )::date AS day
        ),
        daily_totals AS (
            SELECT
                (t.transaction_date AT TIME ZONE 'Asia/Tokyo')::date AS day,
                SUM(t.amount) AS total_expense
            FROM transactions t
            JOIN users u ON u.id = t.user_id
            WHERE t.type = 'expense'
                AND t.category IS NOT NULL
                AND t.deleted_at IS NULL
                AND u.deleted_at IS NULL
                AND u.role <> 'admin'
                AND t.transaction_date >=
                    ($1::date)::timestamp AT TIME ZONE 'Asia/Tokyo'
                AND t.transaction_date <
                    (($2::date + 1)::timestamp AT TIME ZONE 'Asia/Tokyo')
            GROUP BY
                (t.transaction_date AT TIME ZONE 'Asia/Tokyo')::date
        )
        SELECT
            calendar.day AS date,
            COALESCE(daily_totals.total_expense, 0) AS total_expense,
            ROUND(
                COALESCE(daily_totals.total_expense, 0)::numeric /
                NULLIF(participants.user_count, 0),
                2
            ) AS average_expense_per_user
        FROM calendar
        CROSS JOIN participants
        LEFT JOIN daily_totals
            ON daily_totals.day = calendar.day
        ORDER BY calendar.day;
        `, [startDate, endDate])

    const totalAverageExpenses = DailyExpenses.length
        ? DailyExpenses.reduce(
            (sum, r) => sum + Number(r.average_expense_per_user),
            0
        ) / DailyExpenses.length
        : 0;

    return { totalAverageExpenses, DailyExpenses, expensesChart }
}