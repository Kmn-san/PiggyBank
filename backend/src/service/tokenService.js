import jwt from "jsonwebtoken"
import crypto from "crypto"
import { ENV } from "../config/env.js"

export const REFRESH_EXPIRED_DAYS = 30
export const ACCESS_EXPIRED = 15 * 60

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: ACCESS_EXPIRED })
}

export const generateRefreshToken = () => {
    const token = crypto.randomBytes(32).toString("hex")
    const hash = hashToken(token)
    const expiredAt = new Date(Date.now() + REFRESH_EXPIRED_DAYS * 24 * 60 * 60 * 1000)
    return { token, hash, expiredAt }
}

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}