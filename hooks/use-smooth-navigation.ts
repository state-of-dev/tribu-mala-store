"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"

export function useSmoothNavigation() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [clickedId, setClickedId] = useState<string | null>(null)
  const [showLoader, setShowLoader] = useState(false)
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const loaderTimeoutRef = useRef<NodeJS.Timeout>()

  const navigateWithTransition = useCallback((url: string, itemId?: string) => {
    // Set visual states immediately
    setIsNavigating(true)
    setShowLoader(true)
    if (itemId) setClickedId(itemId)

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current)
    }

    // Start navigation after loader completes (~1 second)
    timeoutRef.current = setTimeout(() => {
      router.push(url)
    }, 1000) // Wait for loader to complete

  }, [router])

  const resetNavigation = useCallback(() => {
    setIsNavigating(false)
    setClickedId(null)
    setShowLoader(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current)
    }
  }, [])

  const handleLoaderComplete = useCallback(() => {
    // Hide loader when animation completes
    setShowLoader(false)
  }, [])

  return {
    isNavigating,
    clickedId,
    showLoader,
    navigateWithTransition,
    resetNavigation,
    handleLoaderComplete
  }
}