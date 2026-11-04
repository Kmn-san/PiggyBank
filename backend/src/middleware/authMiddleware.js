import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"

export const protectRoute = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            code: "NO_ACCESS_TOKEN",
            message: "Authentication required."
        });
    }
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        req.user = { userId: decoded.userId, role: decoded.role };

        next();
    } catch (error) {
        const isExpired = error.name === "TokenExpiredError";

        return res.status(401).json({
            success: false,
            code: isExpired
                ? "ACCESS_TOKEN_EXPIRED"
                : "INVALID_ACCESS_TOKEN",
            message: isExpired
                ? "Access token expired."
                : "Access token is invalid."
        });
    }
};