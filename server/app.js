import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import router from "./routes/router.js"
import { errorHandler } from "./errors/errorHandler.js"
import { notFoundHandler } from "./errors/notFoundHandler.js"

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)
app.use(notFoundHandler)

export default app