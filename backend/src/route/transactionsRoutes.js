import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { fetchTransactions } from "../controller/transactionsController.js";

const router = express.Router()

router.get("/", protectRoute, fetchTransactions)

export default router;