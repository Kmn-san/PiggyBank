import express from "express"
import { protectRoute } from "../middleware/authMiddleware.js";
import { archiveGoal, createGoal, deleteGoal, editGoal, getSavings } from "../controller/savingsController.js";

const router = express.Router()

router.get("/", protectRoute, getSavings)
router.post('/createGoal', protectRoute, createGoal)
router.patch("/:goalId", protectRoute, editGoal)
router.patch("/:goalId/archived", protectRoute, archiveGoal)

router.patch("/:goalId/delete", protectRoute, deleteGoal)
export default router;