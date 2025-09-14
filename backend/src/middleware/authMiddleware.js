import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
  try {
    // Check for token in Authorization header or cookies
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    // Get token from cookie
    token = req.cookies.jwt;
  }

    if (!token) {
      console.log("No token found in request")
      return res.status(401).json({ message: "Not authorized, no token provided" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      console.log("Token decoded successfully for user:", decoded.userId)

      // Get user from database
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        console.log("User not found for token:", decoded.userId)
        return res.status(401).json({ message: "Not authorized, user not found" })
      }

      req.user = user
      next()
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError.message)
      return res.status(401).json({ message: "Not authorized, invalid token" })
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error in authentication" })
  }
}
