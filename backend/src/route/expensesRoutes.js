import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { getExpenses, transferExpenses } from "../controller/expensesController.js";

const router = express.Router()

router.get("/", protectRoute, getExpenses)
router.post("/", protectRoute, transferExpenses)

export default router;