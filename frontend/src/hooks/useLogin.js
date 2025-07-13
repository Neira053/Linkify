"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login } from "../lib/api" // Ensure this path is correct
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token in localStorage after successful login
      if (data.token) {
        localStorage.setItem("token", data.token)
        console.log(`[useLogin] Login successful. Token stored: ${data.token.substring(0, 10)}...`)
      } else {
        console.warn("[useLogin] Login successful, but no token received in response body.")
      }

      queryClient.invalidateQueries({ queryKey: ["authUser"] }) // Invalidate to refetch user data
      toast.success("Login successful!")

      // Navigate based on onboarding status
      if (data.user?.isOnboarded) {
        navigate("/")
      } else {
        navigate("/onboarding")
      }
    },
    onError: (err) => {
      console.error("[useLogin] Login failed:", err)
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again."
      toast.error(errorMessage)
    },
  })

  return { loginMutation, isPending, error }
}
export default useLogin
