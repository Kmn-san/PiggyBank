import express from "express"
import cors from "cors";
import path from "path"

import authRoutes from "./src/route/authRoutes.js"
import dashboardRoutes from "./src/route/dashboardRoutes.js"
import savingsRoutes from "./src/route/savingsRoute.js"
import expensesRoutes from "./src/route/expensesRoutes.js"
import transactionsRoutes from "./src/route/transactionsRoutes.js"

import { ENV } from "./src/config/env.js"

const app = express()
const PORT = ENV.PORT

const __dirname = path.resolve();

app.use(express.json())

const allowedOrigins = [
    "http://localhost:5173",
    ENV.CLIENT_URL
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/savings", savingsRoutes)
app.use("/api/expenses", expensesRoutes)
app.use("/api/transactions", transactionsRoutes)

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(
        __dirname, "web", "dist"
    )))
    app.get("/{*splat}", (req, res, next) => {
        if (req.path.startsWith("/api/")) {
            return next()
        }
        res.sendFile(path.join(__dirname, "web", "dist", "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);

})