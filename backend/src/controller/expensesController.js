import * as expensesService from "../service/expensesService.js"

export const getExpenses = async (req, res) => {
    try {
        const { userId } = req.user;
        const { month } = req.query;

        const result = await expensesService.getExpenses(userId, month)

        return res.status(200).json({ success: true, result })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in getExpenses controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const transferExpenses = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount, category, note } = req.body
        console.log(amount);

        if (!amount || !category) {
            return res.status(400).json({ success: false, message: "Missing required data." })
        }

        if (!Number(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be a positive number." })
        }

        const result = await expensesService.transferExpenses(userId, amount, category, note)

        return res.status(200).json({ success: true, message: "Transfer successfully!", result })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in transferExpenses controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}