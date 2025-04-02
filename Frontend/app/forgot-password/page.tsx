"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      // This will be replaced with your actual API call to the C# backend
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // })

      // if (!response.ok) {
      //   const data = await response.json()
      //   throw new Error(data.message || 'Failed to send reset email')
      // }

      // For now, just simulate a delay
      setTimeout(() => {
        setIsLoading(false)
        setSuccess(true)
      }, 1500)
    } catch (error) {
      setIsLoading(false)
      setError(error instanceof Error ? error.message : "Failed to send reset email")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-950 to-black">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="bg-gradient-to-br from-red-600 to-red-700 text-white h-10 w-10 rounded-md flex items-center justify-center font-bold text-xl">
                  F
                </div>
                <span className="font-bold text-2xl">FootballX</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
            <p className="text-zinc-400">Enter your email and we'll send you a link to reset your password</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">{error}</div>
          )}

          {success ? (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Reset link sent!</p>
              <p className="text-sm mt-1">Check your email for instructions to reset your password.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-zinc-800/50 border-zinc-700/50 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium py-3"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center text-sm text-zinc-400">
                Remember your password?{" "}
                <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-zinc-500">
        <p>© 2024 FootballX. All rights reserved.</p>
      </footer>
    </div>
  )
}

