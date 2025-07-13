"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api" // Ensure this path is correct
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const useSignUp = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Store token in localStorage after successful signup
      if (data.token) {
        localStorage.setItem("token", data.token)
        console.log(`[useSignUp] Signup successful. Token stored: ${data.token.substring(0, 10)}...`)
      } else {
        console.warn("[useSignUp] Signup successful, but no token received in response body.")
      }

      queryClient.invalidateQueries({ queryKey: ["authUser"] }) // Invalidate to refetch user data
      toast.success("Account created successfully!")
      // Navigate based on onboarding status
      if (data.user?.isOnboarded) {
        navigate("/")
      } else {
        navigate("/onboarding")
      }
    },
    onError: (err) => {
      console.error("[useSignUp] Signup failed:", err)
      const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again."
      toast.error(errorMessage)
    },
  })

  return { isPending, error, signupMutation: mutate }
}
export default useSignUp
