import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import chatRoutes from "./routes/chatRoute.js"

import { connectDB } from "./lib/db.js"

const app = express()
const PORT = process.env.PORT || 5001

const __dirname = path.resolve()

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000","https://linkif-llp.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())
app.use(cookieParser())

// --- Keep this debugging middleware ---
app.use((req, res, next) => {
  console.log(`[DEBUG] Incoming request: ${req.method} ${req.url}`)
  next()
})
// --- End debugging middleware ---

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

// --- IMPORTANT: Add a callback to app.listen to catch binding errors ---
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server on port ${PORT}:`, err)
    // If the error is EADDRINUSE, it means the port is already in use
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Please free up the port or choose a different one.`)
    }
    process.exit(1) // Exit the process if server fails to start
  } else {
    console.log(`Server is running on port ${PORT}`)
    // --- IMPORTANT: Call connectDB *after* the server starts successfully ---
    connectDB().catch((dbErr) => {
      console.error("Failed to connect to MongoDB:", dbErr)
      // Optionally, you might want to exit here if DB connection is critical
      // process.exit(1);
    })
  }
})

