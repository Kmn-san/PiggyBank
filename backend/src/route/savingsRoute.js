import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/", protectRoute,getSavings)
export default router;