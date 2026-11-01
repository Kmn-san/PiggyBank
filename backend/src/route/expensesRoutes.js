import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { transferExpenses } from "../controller/expensesController.js";

const router = express.Router()

router.post("/", protectRoute, transferExpenses)

export default router;