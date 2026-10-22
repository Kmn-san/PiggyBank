import express from "express"
import authRoutes from "./src/route/authRoutes.js"
import { ENV } from "./src/config/env.js"

const app = express()
const PORT = ENV.PORT

app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);

})