import express from "express"
import authRoutes from "./src/route/authRoutes.js"
import dashboardRoutes from "./src/route/dashboardRoutes.js"
import savingsRoutes from "./src/route/savingsRoute.js"
import expensesRoutes from "./src/route/expensesRoutes.js"
import transactionsRoutes from "./src/route/transactionsRoutes.js"

import { ENV } from "./src/config/env.js"

const app = express()
const PORT = ENV.PORT

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/savings", savingsRoutes)
app.use("/api/expenses", expensesRoutes)
app.use("/api/transactions", transactionsRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);

})