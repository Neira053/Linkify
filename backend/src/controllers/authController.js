import { upsertStreamUser } from "../lib/stream.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendPasswordResetEmail } from "../utils/emailService.js"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  // Set JWT as HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export async function signup(req, res) {
  const { email, password, fullName } = req.body

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a different one" })
    }

    const idx = Math.floor(Math.random() * 100) + 1
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    })

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      })
      console.log(`Stream user created for ${newUser.fullName}`)
    } catch (error) {
      console.log("Error creating Stream user:", error)
    }

    const token = generateToken(newUser._id)

    // Set secure HTTP-only cookie
    setTokenCookie(res, token)

    // Also return token in response for frontend storage
    res.status(201).json({
      success: true,
      user: newUser,
      token: token,
    })
  } catch (error) {
    console.log("Error in signup controller", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = generateToken(user._id)

    // Set secure HTTP-only cookie
    setTokenCookie(res, token)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      // Don't include token in response body for better security
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export async function logout(req, res) {
  try {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    res.status(200).json({ success: true, message: "Logout successful" })
  } catch (error) {
    console.error("Error in logout controller:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiration (1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();

    // Send email with reset link
    try {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetToken, resetUrl);
      
      res.status(200).json({
        success: true,
        message: "Password reset link has been sent to your email"
      });
    } catch (emailError) {
      // If email sending fails, reset the token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      console.error("Error sending reset email:", emailError);
      return res.status(500).json({ message: "Error sending password reset email" });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user with the given token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    // Set the new password
    user.password = newPassword;
    
    // Clear the reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true },
    )

    if (!updatedUser) return res.status(404).json({ message: "User not found" })

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      })
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message)
    }

    res.status(200).json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Onboarding error:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
