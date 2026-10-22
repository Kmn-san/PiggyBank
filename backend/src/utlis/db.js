import pg from "pg"
import { ENV } from "../config/env.js"

const isProduction = ENV.NODE_ENV === 'production'

export const pool = new pg.Pool({
    connectionString: ENV.DATABASE_URL,
    ssl: isProduction ? {
        rejectUnauthorized: false
    } : false
})

pool.connect((error, client, release) => {
    if (error) {
        console.error("Error connecting with database: ", error);
    } else {
        console.log("Connect to database successfully.");
        release()
    }
})

pool.on("error", (err) => {
    console.error("Unexpected error on idle databse client: ", err);
    process.exit(-1)
})