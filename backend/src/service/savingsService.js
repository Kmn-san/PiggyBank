import { pool } from "../utlis/db.js"

export const getSavings = async (userId) => {
    const { rows } = await pool.query(`
        SELECT id,name,type,current_amount AS "currentAmount"
        FROM accounts
        WHERE user_id = $1
            AND is_archived = FALSE
            AND (name ='Working Account'
            OR type = 'savings')
        `, [userId])
    return rows
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