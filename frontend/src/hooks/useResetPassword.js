"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "../lib/api"

const useResetPassword = (token) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [validationError, setValidationError] = useState("")

  const resetPasswordMutation = useMutation({
    mutationFn: (newPassword) => resetPassword(token, newPassword),
    onSuccess: (data) => {
      setSuccessMessage(data.message)
    },
  })

  const handleSubmit = () => {
    // Clear previous errors
    setValidationError("")

    // Validate passwords
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return
    }

    // Submit the reset request
    resetPasswordMutation.mutate(password)
  }

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    successMessage,
    validationError,
    isPending: resetPasswordMutation.isPending,
    error: resetPasswordMutation.error,
    handleSubmit,
  }
}

export default useResetPassword