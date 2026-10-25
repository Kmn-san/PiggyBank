import * as savingsService from "../service/savingsService.js"

export const getSavings = async (req, res) => {
    try {
        const { userId } = req.user;

        const data = await savingsService.getSavings(userId)
        return res.status(200).json({ success: true, data })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in getSavings controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const transferSavings = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount, fromAccount, toAccount } = req.body;
        if (!amount || !fromAccount || !toAccount) {
            return res.status(400).json({ success: false, message: "Fill in required fields." })
        }
        const result = await savingsService.transferSavings(userId, amount, fromAccount, toAccount)

        return res.status(200).json({ success: true, message: "Transfer successfully", result })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in transferSavings controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const createGoal = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, message: "Goal name can't be empty." })
        }

        const result = await savingsService.createGoal(userId, name.trim())

        return res.status(201).json({
            success: true, message: "Create goal account successfully!",
            result
        })

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in createGoal controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const editGoal = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name } = req.body;
        const { goalId } = req.params
        if (!goalId) {
            return res.status(400).json({ success: false, message: "Goal id can't be empty." })
        }
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, message: "Goal name can't be empty." })
        }

        const result = await savingsService.editGoal(userId, goalId, name)

        return res.status(201).json({
            success: true, message: "Update successfully!",
            result
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in editGoal controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const archiveGoal = async (req, res) => {
    try {
        const { userId } = req.user
        const { goalId } = req.params
        if (!goalId) {
            return res.status(400).json({ success: false, message: "Missing goal id." })
        }

        const result = await savingsService.archiveGoal(userId, goalId)

        return res.status(200).json({ success: true, message: "Goal archived.", result })

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in archiveGoal controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}