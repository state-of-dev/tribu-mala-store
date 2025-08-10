"use client"

import { useState, useEffect } from "react"

interface UseSmoothLoadingProps {
  data: any
  minLoadingTime?: number
}

export function useSmoothLoading({ data, minLoadingTime = 200 }: UseSmoothLoadingProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (data) {
      // Always show skeleton for at least minLoadingTime for smooth experience
      const timer = setTimeout(() => {
        setShowSkeleton(false)
        // Small delay before showing content for smooth transition
        setTimeout(() => {
          setShowContent(true)
        }, 50)
      }, minLoadingTime)

      return () => clearTimeout(timer)
    }
  }, [data, minLoadingTime])

  // Reset states when data changes
  useEffect(() => {
    if (!data) {
      setShowSkeleton(true)
      setShowContent(false)
    }
  }, [data])

  return {
    showSkeleton: showSkeleton && !showContent,
    showContent,
    isReady: data && showContent
  }
}