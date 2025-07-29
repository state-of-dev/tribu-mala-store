"use client"

import { LogIn } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginIcon() {
  const [isClicked, setIsClicked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsClicked(true)
    setIsLoading(true)
    
    try {
      router.push("/auth/signin")
    } catch (error) {
      console.error("Error navigating to login:", error)
    } finally {
      setTimeout(() => {
        setIsClicked(false)
        setIsLoading(false)
      }, 300)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`p-2 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors duration-200 ${
        isClicked ? "animate-click" : ""
      }`}
    >
      <LogIn className={`w-6 h-6 text-gray-100 ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  )
}