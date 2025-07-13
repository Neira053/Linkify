"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../lib/api" // Ensure this path is correct
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] }) // Invalidate to clear user data
      localStorage.removeItem("token") // Ensure token is cleared from localStorage
      toast.success("Logged out successfully!")
      navigate("/login") // Redirect to login page
    },
    onError: (err) => {
      console.error("[useLogout] Logout failed:", err)
      const errorMessage = err.response?.data?.message || err.message || "Logout failed. Please try again."
      toast.error(errorMessage)
    },
  })

  return { logoutMutation, isPending, error }
}
export default useLogout
