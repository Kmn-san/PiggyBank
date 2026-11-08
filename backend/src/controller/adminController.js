import * as adminService from "../service/adminService.js"
import { isRealDate } from "../utlis/dateFormat.js";

export const fetchData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!isRealDate(startDate) || !isRealDate(endDate)) {
            return res.status(400).json({ success: false, message: 'Insert with the fromat of YYYY-MM_DD' })
        }
        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "End date can't be early then start date." })
        }

        const data = await adminService.fetchData(startDate, endDate);
        return res.status(200).json({ success: true, data })
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false, message: error.message
            })
        }
        console.error("Error in fetchData controller: ", error.message);
        return res.status(500).json({
            success: false, message: "サーバーエラー"
        })
    }
}

