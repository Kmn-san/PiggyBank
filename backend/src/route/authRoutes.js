import express from "express"
import { deleteAccount, fetchUser, loginUser, logoutUser, refreshToken, registerUser } from "../controller/authController.js"
import { protectRoute } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/me", protectRoute, fetchUser)

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/refresh", refreshToken)
router.delete("/delete", protectRoute, deleteAccount)

export default router;