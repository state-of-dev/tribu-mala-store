"use client"

import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginIcon() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/auth/signin")
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-dark-400 hover:bg-dark-300 transition-colors duration-200"
    >
      <LogIn className="w-6 h-6 text-gray-100" />
    </button>
  )
}