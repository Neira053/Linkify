import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
})

// Helper function to get cookie value
function getCookieValue(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

// Request Interceptor: Attach token to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenFromLocalStorage = localStorage.getItem("token")
    const tokenFromCookie = getCookieValue("jwt")

    const tokenToSend = tokenFromLocalStorage || tokenFromCookie

    if (tokenToSend) {
      config.headers.Authorization = `Bearer ${tokenToSend}`
      console.log(`[Axios Request] Token found: ${tokenToSend.substring(0, 10)}...`)
    } else {
      console.log("[Axios Request] No token found in localStorage or cookie for Authorization header.")
    }

    console.log(
      `[Axios Request] Preparing request to ${config.url}. Headers: ${JSON.stringify(config.headers)}. Cookies: ${document.cookie}`,
    )
    return config
  },
  (error) => {
    console.error("[Axios Request] Interceptor Error:", error)
    return Promise.reject(error)
  },
)

// Response Interceptor: Handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("[Axios Response] 401 Unauthorized received. Clearing auth data.")
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Clear the 'jwt' cookie

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    console.error("[Axios Response] Interceptor Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)
