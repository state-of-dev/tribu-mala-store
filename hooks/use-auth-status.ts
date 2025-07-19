"use client"

import { useSession } from "next-auth/react"

export interface AuthStatus {
  isAuthenticated: boolean
  isLoading: boolean
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  } | null
  error: string | null
}

export function useAuthStatus(): AuthStatus {
  const { data: session, status } = useSession()
  
  return {
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    user: session?.user || null,
    error: status === "unauthenticated" ? null : null
  }
}