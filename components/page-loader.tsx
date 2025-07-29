"use client"

import { useEffect, useState, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

function PageLoaderInner() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Show loader for 500ms on any page change

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div 
        className={cn(
          "h-full bg-gradient-to-r from-black via-gray-600 to-white transition-all duration-300 ease-out",
          isLoading ? "w-full" : "w-0"
        )}
        style={{
          animation: isLoading ? "progress 300ms ease-out" : undefined
        }}
      />
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

export function PageLoader() {
  return (
    <Suspense fallback={null}>
      <PageLoaderInner />
    </Suspense>
  )
}