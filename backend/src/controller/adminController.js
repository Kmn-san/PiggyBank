import * as adminService from "../service/adminService.js"
import { isRealDate } from "../utlis/dateFormat.js";
import { pool } from "../utlis/db.js";

export const getParticipants = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, LEFT(user_code, 1) AS participant_label
            FROM users
            WHERE is_deleted = FALSE
                AND deleted_at IS NULL
                AND role <> 'admin'
            ORDER BY created_at ASC
        `)

        return res.status(200).json({
            success: true,
            participants: result.rows,
        })
    } catch (error) {
        console.error("Get participants error:", error)

        return res.status(500).json({
            success: false,
            message: "Failed to fetch participants",
        })
    }
}

export const fetchData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const participantIds = req.query.participantIds
            ? JSON.parse(req.query.participantIds)
            : []

        if (!isRealDate(startDate) || !isRealDate(endDate)) {
            return res.status(400).json({ success: false, message: 'Insert with the format of YYYY-MM-DD' })
        }
        if (startDate > endDate) {
            return res.status(400).json({ success: false, message: "End date can't be early then start date." })
        }

        const data = await adminService.fetchData(startDate, endDate, participantIds)
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

