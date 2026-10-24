import * as dashboardService from "../service/dashbaordService.js"
export const getDashboard = async (req, res) => {
    try {
        const { userId } = req.user;
        const { month } = req.query;

        if (
            month !== undefined &&
            (
                typeof month !== "string" ||
                !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid month format. Use YYYY-MM."
            });
        }

        const data = await dashboardService.getDashboard(userId, month)

        return res.status(200).json({
            success: true, data
        })

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in getDashboard controller: ", error.message);
        return res.status(500).json({
            success: false, message: "Internal Server Error"
        })
    }
}