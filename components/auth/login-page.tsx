"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface LoginPageProps {
  onLogin: (user: { username: string; role: 'teacher' | 'student'; noAi?: boolean }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Welcome, ${data.user.username}!`)
        onLogin(data.user)
      } else {
        toast.error(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed, please try again")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-200 via-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 border-2 border-purple-200 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block p-5 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full mb-6 shadow-xl animate-pulse">
              <span className="text-5xl">✨</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Story Writer
            </h1>
            <p className="text-gray-600 font-medium">Login to start your creative journey</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-purple-700">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin()
                }}
                className="text-base py-3 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-pink-700">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin()
                }}
                className="text-base py-3 border-2 border-pink-200 focus:border-pink-500 rounded-xl"
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0 shadow-xl py-6 text-lg font-bold disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "🚀 Login"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

