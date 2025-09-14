import { axiosInstance } from "./axios"

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData)
  return response.data
}

export const login = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData)
    // Token is now handled by HTTP-only cookies set by the server
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout")
    // Server will clear the HTTP-only cookie
    return { success: true }
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")
    return res.data
  } catch (error) {
    console.error("Error in getAuthUser:", error) // Changed from console.log to console.error
    throw error // CRITICAL: Re-throw the error so useAuthUser can catch it
  }
}

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData)
  return response.data
}

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", { token, newPassword })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: error.message }
  }
}

// Friend-related API functions
export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends")
  return response.data
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users")
  return response.data
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests")
  return response.data
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`)
  return response.data
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests")
  return response.data
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
  return response.data
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token")
  return response.data
}
