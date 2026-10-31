import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { fetchTransactions, transferAccount, transferIncome } from "../controller/transactionsController.js";

const router = express.Router()

router.get("/", protectRoute, fetchTransactions)
router.post('/transfer', protectRoute, transferAccount)
router.post("/income", protectRoute, transferIncome)

export default router;