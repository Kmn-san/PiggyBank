import express from "express"
import { loginUser, logoutUser, refreshToken, registerUser } from "../controller/authController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/refresh", refreshToken)

export default router;