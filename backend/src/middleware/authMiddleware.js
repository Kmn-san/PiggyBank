import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"

export const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            code: "ACCESS_TOKEN_MISSING",
            message: "Access token is required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        req.user = { userId: decoded.userId };
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