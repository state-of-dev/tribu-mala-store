"use client"

import { LogIn } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function LoginIcon() {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = () => {
    const callbackUrl = encodeURIComponent(pathname)
    router.push(`/auth/signin?callbackUrl=${callbackUrl}`)
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