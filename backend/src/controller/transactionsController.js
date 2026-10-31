import * as transactionsService from "../service/transactionsService.js"

export const fetchTransactions = async (req, res) => {
    try {
        const { userId } = req.user
        const { month } = req.query;

        const data = await transactionsService.fetchTransactions(userId, month)

        return res.status(200).json({ success: true, data })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in fetchTransactions controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const transferIncome = async (req, res) => {
    try {
        const { userId } = req.user
        const { amount, transactionDate, note } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Fill in amount." })
        }
        const result = await transactionsService.transferIncome(userId, amount, transactionDate
            , note)

        return res.status(200).json({
            success: true, result
        })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in transferIncome controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}

export const transferAccount = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount, fromAccount, toAccount, note, transactionDate } = req.body;

        if (!amount || !fromAccount || !toAccount) {
            return res.status(400).json({ success: false, message: "Fill in required fields." })
        }
        const result = await transactionsService.transferAccount(userId, amount, fromAccount, toAccount, note, transactionDate)

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