"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg"
  redirectTo?: string
  children?: React.ReactNode
}

export function LogoutButton({ 
  className = "", 
  variant = "outline",
  size = "default",
  redirectTo = "/",
  children 
}: LogoutButtonProps) {

  const handleLogout = () => {
    signOut({ callbackUrl: redirectTo })
  }

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {children || "Cerrar Sesión"}
    </Button>
  )
}