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