import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { pool } from "../src/utlis/db.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const run = async () => {
    const sql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8")
    try {
        await pool.query(sql)
        console.log("Seed completed")
    } catch (error) {
        console.error("Seed failed:", error.message)
        process.exitCode = 1
    } finally {
        await pool.end()
    }
}

run()