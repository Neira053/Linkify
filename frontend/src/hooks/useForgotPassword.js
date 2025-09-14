"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "../lib/api"

const useForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const forgotPasswordMutation = useMutation({
    mutationFn: (email) => forgotPassword(email),
    onSuccess: (data) => {
      setSuccessMessage(data.message)
    },
  })

  return {
    email,
    setEmail,
    successMessage,
    isPending: forgotPasswordMutation.isPending,
    error: forgotPasswordMutation.error,
    submitForgotPassword: () => forgotPasswordMutation.mutate(email),
  }
}

export default useForgotPassword