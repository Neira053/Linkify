"use client"

import { ShipWheelIcon } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import useResetPassword from "../hooks/useResetPassword"
import { useEffect } from "react"

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    successMessage,
    validationError,
    isPending,
    error,
    handleSubmit,
  } = useResetPassword(token)

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token, navigate])

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
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

          {/* VALIDATION ERROR */}
          {validationError && (
            <div className="alert alert-warning mb-4">
              <span>{validationError}</span>
            </div>
          )}

          <div className="w-full">
            {!successMessage ? (
              <form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Reset Password</h2>
                    <p className="text-sm opacity-70">
                      Enter your new password below
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isPending}
                        minLength={6}
                      />
                    </div>

                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="••••••"
                        className="input input-bordered w-full"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isPending}
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPending || !password || !confirmPassword}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p>Your password has been reset successfully.</p>
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

export default ResetPasswordPage