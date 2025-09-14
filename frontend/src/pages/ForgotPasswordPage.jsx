"use client"

import { ShipWheelIcon } from "lucide-react"
import { Link } from "react-router-dom"
import useForgotPassword from "../hooks/useForgotPassword"

const ForgotPasswordPage = () => {
  const { email, setEmail, successMessage, isPending, error, submitForgotPassword } = useForgotPassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    submitForgotPassword()
  }

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col w-full max-w-md mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Linkify
            </span>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="alert alert-success mb-4">
              <span>{successMessage}</span>
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.message || "An error occurred. Please try again."}</span>
            </div>
          )}

          <div className="w-full">
            {!successMessage ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Forgot Password</h2>
                    <p className="text-sm opacity-70">
                      Enter your email address and we'll send you a link to reset your password
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        placeholder="hello@example.com"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isPending}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPending || !email}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>

                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Remember your password?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p>Please check your email for the password reset link.</p>
                <Link to="/login" className="btn btn-primary w-full">
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage