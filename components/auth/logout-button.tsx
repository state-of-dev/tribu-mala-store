"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg"
  showConfirmation?: boolean
  redirectTo?: string
  children?: React.ReactNode
}

export function LogoutButton({ 
  className = "", 
  variant = "outline",
  size = "default",
  showConfirmation = false,
  redirectTo = "/",
  children 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (showConfirmation && !confirm("¿Estás seguro que deseas cerrar sesión?")) {
      return
    }

    setIsLoading(true)
    try {
      console.log("🚪 Usuario cerrando sesión...")
      
      await signOut({ 
        redirect: false 
      })
      
      // Clear any stored redirect URLs
      sessionStorage.removeItem("redirectAfterLogin")
      
      console.log("✅ Sesión cerrada exitosamente")
      
      // Manual redirect to avoid NextAuth redirect issues
      router.push(redirectTo)
      router.refresh()
      
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cerrando...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          {children || "Cerrar Sesión"}
        </>
      )}
    </Button>
  )
}