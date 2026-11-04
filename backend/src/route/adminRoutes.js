import express from "express"
import { fetchData } from "../controller/adminController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router()


router.get("/", protectRoute, adminMiddleware, fetchData)

export default router;