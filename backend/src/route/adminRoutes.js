import express from "express"
import { adminRoute } from "../middleware/adminMiddleware.js";
import { fetchData } from "../controller/adminController.js";

const router = express.Router()


router.get("/", adminRoute, fetchData)

export default router;