import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { editTransaction, fetchTransaction, fetchTransactions, transferAccount, transferIncome } from "../controller/transactionsController.js";

const router = express.Router()

router.get("/", protectRoute, fetchTransactions)
router.get("/:transactionId", protectRoute, fetchTransaction)
router.post('/transfer', protectRoute, transferAccount)
router.post("/income", protectRoute, transferIncome)

router.patch('/:transactionId', protectRoute, editTransaction)

export default router;