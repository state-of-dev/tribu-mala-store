"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, Loader2 } from "lucide-react"

interface LoginButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  redirectTo?: string
  children?: React.ReactNode
}

export function LoginButton({ 
  className = "", 
  variant = "default",
  size = "default",
  redirectTo = "/",
  children 
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Use current pathname or custom redirectTo
      const callbackUrl = encodeURIComponent(redirectTo === "/" ? pathname : redirectTo)
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`)
    } catch (error) {
      console.error("Error navigating to login:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          {children || "Iniciar Sesión"}
        </>
      )}
    </Button>
  )
}