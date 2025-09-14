import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
})

// Helper function to get cookie value
const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

// Request Interceptor: Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie only - more secure than localStorage
    const tokenToSend = getCookieValue("jwt");

    if (tokenToSend) {
      config.headers.Authorization = `Bearer ${tokenToSend}`
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log(`[Axios Request] Token found: ${tokenToSend.substring(0, 10)}...`)
      }
    }
    return config
  },
  (error) => {
    console.error("[Axios Request] Interceptor Error:", error)
    return Promise.reject(error)
  },
)

// Response Interceptor: Handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log(`[Axios Response] Response from ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log("[Axios Response] 401 Unauthorized error. Clearing auth data.")
      }
      // Clear auth data
      localStorage.removeItem("token")
      sessionStorage.removeItem("token")
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      // Redirect to login page if not already there
      const currentPath = window.location.pathname
      if (currentPath !== "/login" && currentPath !== "/signup") {
        window.location.href = "/login"
      }
    } else if (import.meta.env.DEV) {
      // Only log detailed errors in development mode
      console.error("[Axios Response] Error:", error.response?.data || error.message)
    }
    return Promise.reject(error)
  },
)
