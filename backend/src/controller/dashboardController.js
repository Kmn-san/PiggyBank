export const getDashboard = async (req, res) => {
    try {
        const { userId } = req.user;
        const result = await dashboardService.getDashboard(userId)

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