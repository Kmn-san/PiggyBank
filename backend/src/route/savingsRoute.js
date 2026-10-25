import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { archiveGoal, createGoal, editGoal, getSavings, transferSavings } from "../controller/savingsController.js";

const router = express.Router()

router.get("/", protectRoute, getSavings)
router.post('/transfer', protectRoute, transferSavings)
router.post('/createGoal', protectRoute, createGoal)
router.patch("/:goalId", protectRoute, editGoal)
router.patch("/:goalId/archived", protectRoute, archiveGoal)
export default router;