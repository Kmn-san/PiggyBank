import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { getDashboard } from "../controller/dashboardController.js";

const router = express.Router()

router.get("/", protectRoute, getDashboard)
export default router;