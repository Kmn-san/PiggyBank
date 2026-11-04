import { ENV } from "../config/env.js";
import * as authService from "../service/authService.js"

export const fetchUser = async (req, res) => {
    try {
        const { userId } = req.user

        const userData = await authService.fetchUser(userId)

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({ success: true, userData })
    } catch (error) {
        console.error("Error in fetchUser controller:", error.message);

        return res.status(500).json({
            success: false,
            message: "サーバーエラー"
        });
    }
}

export const registerUser = async (req, res) => {
    try {
        const { user_code, password } = req.body;
        if (!user_code || !password) {
            return res.status(400).json({
                success: false, message: "必要なところを埋めてください。"
            })
        }
        await authService.registerUser(user_code, password)
        return res.status(201).json({ success: true, message: "登録済みです。ログインしてください。" })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in registerUser controller: ", error.message);
        return res.status(500).json({
            success: false, message: "サーバーエラー"
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { user_code, password } = req.body

        if (!user_code || !password) {
            return res.status(400).json({
                success: false, message: "必要なところを埋めてください。"
            })
        }

        const token = await authService.loginUser(user_code, password)

        res.cookie("accessToken", token.accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/"
        })

        res.cookie("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/api/auth"
        })

        return res.status(200).json({
            success: true,
            message: "ログインしました。"
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in loginUser controller: ", error.message);
        return res.status(500).json({
            success: false, message: "サーバーエラー"
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await authService.logoutUser(refreshToken)
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/api/auth"
        })

        return res.status(200).json({ success: true, message: "ログアウトしました。" })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in logoutUser controller: ", error.message);
        return res.status(500).json({
            success: false, message: "サーバーエラー"
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                code: "NO_REFRESH_TOKEN",
                message: "Refresh token is required."
            });
        }

        const result = await authService.refresh(refreshToken)

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
            path: "/"
        })

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/api/auth"
        })

        return res.status(200).json({
            success: true,
            message: "Token refresh successfully."
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in refreshToken controller: ", error.message);
        return res.status(500).json({
            success: false, message: "サーバーエラー"
        })
    }
}