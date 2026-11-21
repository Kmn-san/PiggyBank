import express from "express"
import { fetchData, getParticipants } from "../controller/adminController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router()


router.get("/dashboard", protectRoute, adminMiddleware, fetchData)
router.get("/participants", protectRoute, adminMiddleware, getParticipants)

export default router;