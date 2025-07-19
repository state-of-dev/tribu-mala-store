"use client"

import { useAuthStatus } from "@/hooks/use-auth-status"
import { Loader2 } from "lucide-react"

interface AuthStatusProps {
  className?: string
  showLoading?: boolean
}

export function AuthStatus({ className = "", showLoading = true }: AuthStatusProps) {
  const { isAuthenticated, isLoading, user } = useAuthStatus()

  if (isLoading && showLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-400">Cargando...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <span className="text-sm text-gray-400">No autenticado</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="h-2 w-2 rounded-full bg-green-500"></div>
      <span className="text-sm text-gray-300">
        {user?.name || user?.email || "Usuario"}
      </span>
    </div>
  )
}