import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"

export const protectRoute = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            })
        }
        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, ENV.JWT_SECRET)

        req.user = {
            userId: decoded.userId
        }
        next()
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            success: false,
            message: "Access denied. Invalid or expired token."
        })
    }
}