import * as authService from "../service/authService.js"

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

        return res.status(200).json({
            success: true,
            message: "ログインしました。",
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresIn: token.expiresIn
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
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(400).json({
                success: false, message: "Refresh token is required."
            })
        }

        await authService.logoutUser(refreshToken)

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
        const { refreshToken } = req.body;

        const result = await authService.refresh(refreshToken)

        return res.status(200).json({
            success: true,
            message: "Token refresh successfully.",
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn
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