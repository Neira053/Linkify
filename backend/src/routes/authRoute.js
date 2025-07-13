import express from "express"
import { login, logout, onboard, signup } from "../controllers/authController.js"
import { protectRoute } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

// Check if user is logged in - with better error handling
router.get("/me", protectRoute, (req, res) => {
  try {
    console.log("Auth check successful for user:", req.user._id)
    res.status(200).json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    console.error("Error in /me route:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

export default router
