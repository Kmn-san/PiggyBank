import { pool } from "../utlis/db.js"
import bcrypt from "bcrypt"
import { ACCESS_EXPIRED, generateAccessToken, generateRefreshToken, hashToken } from "./tokenService.js"

export const registerUser = async (user_code, password) => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        const { rows: existUser } = await client.query(`
            SELECT id FROM users
            WHERE user_code = $1`
            , [user_code])
        if (existUser.length > 0) {
            const error = new Error("This user code had been taken.Try a new one.")
            error.statusCode = 409
            throw error
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const { rows } = await client.query(
            `INSERT INTO users
                (user_code,hash_password)
            VALUES
                ($1,$2)
            RETURNING id`,
            [user_code, hashedPassword]
        )

        await client.query(`
            INSERT INTO accounts
                (user_id,name,type,current_amount)
            VALUES
                ($1,'Emergency Account','savings',0),
                ($1,'Working Account','spending',0),
                ($1,'Daily Expenses','spending',0)`,
            [rows[0].id])

        await client.query("COMMIT")
        return rows[0]
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

export const loginUser = async (user_code, password) => {
    const { rows } = await pool.query(`
    SELECT id,hash_password
    FROM users 
    WHERE user_code = $1`,
        [user_code])

    const existUser = rows[0]
    if (!existUser) {
        const error = new Error("Invalid user code or password.")
        error.statusCode = 401
        throw error
    }

    const comparePassword = await bcrypt.compare(password, existUser.hash_password)
    if (!comparePassword) {
        const error = new Error("Invalid user code or password.")
        error.statusCode = 401
        throw error
    }

    const accessToken = generateAccessToken(existUser.id)
    const refresh = generateRefreshToken()

    await pool.query(`
        UPDATE users
        SET 
            hash_token = $1,
            token_expires_at = $2
        WHERE id = $3`,
        [refresh.hash, refresh.expiredAt, existUser.id])

    return {
        accessToken,
        refreshToken: refresh.token,
        expiresIn: ACCESS_EXPIRED
    }
}

export const logoutUser = async (refreshToken) => {
    const result = await pool.query(`
        UPDATE users
        SET hash_token = NULL,
            token_expires_at = NULL
        WHERE hash_token = $1`,
        [hashToken(refreshToken)])
    return result.rowCount > 0
}

export const refresh = async (refreshToken) => {
    const { rows } = await pool.query(`
         SELECT id
    FROM users 
    WHERE hash_token = $1`,
        [hashToken(refreshToken)])

    const user = rows[0]
    if (!user) {
        const error = new Error("Invalid token.")
        error.statusCode = 401
        throw error
    }

    const accessToken = generateAccessToken(user.id)
    const refresh = generateRefreshToken()

    await pool.query(`
        UPDATE users
        SET 
            hash_token = $1,
            token_expires_at = $2
        WHERE id = $3`,
        [refresh.hash, refresh.expiredAt, user.id])

    return {
        accessToken,
        refreshToken: refresh.token,
        expiresIn: ACCESS_EXPIRED
    }
}