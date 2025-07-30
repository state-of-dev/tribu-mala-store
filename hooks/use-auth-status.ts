"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export interface AuthStatus {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: string | null
  } | null
  error: string | null
}

export function useAuthStatus(): AuthStatus {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar flash durante la hidratación
  if (!mounted) {
    return {
      isAuthenticated: false,
      isLoading: true,
      user: null,
      error: null
    }
  }

  // Mantener estado de loading si NextAuth aún está inicializando
  if (status === "loading") {
    return {
      isAuthenticated: false,
      isLoading: true,
      user: null,
      error: null
    }
  }
  
  return {
    isAuthenticated: !!session?.user,
    isLoading: false,
    user: session?.user ? {
      id: session.user.id || '',
      email: session.user.email || '',
      name: session.user.name,
      image: session.user.image,
      role: session.user.role
    } : null,
    error: null
  }
}