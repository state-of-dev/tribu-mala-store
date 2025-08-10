"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AdminTransitionLoaderProps {
  isVisible: boolean
  onComplete?: () => void
}

export function AdminTransitionLoader({ isVisible, onComplete }: AdminTransitionLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setMatrixText("")
      setIsComplete(false)
      return
    }

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%"
    let interval: NodeJS.Timeout
    let matrixInterval: NodeJS.Timeout

    // Matrix text effect - más rápido que el original
    matrixInterval = setInterval(() => {
      const randomText = Array(8)
        .fill(0)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("")
      setMatrixText(randomText)
    }, 30) // Más rápido que los 50ms originales

    // Progress bar animation - 3x más rápido (10ms vs 30ms original)
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          clearInterval(matrixInterval)
          setTimeout(() => {
            setIsComplete(true)
            onComplete?.()
          }, 200) // Delay más corto antes de completar
          return 100
        }
        return prev + 2 // Incremento más grande para mayor velocidad
      })
    }, 10) // 3x más rápido que los 30ms originales

    return () => {
      clearInterval(interval)
      clearInterval(matrixInterval)
    }
  }, [isVisible, onComplete])

  if (!isVisible && !isComplete) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex flex-col items-center justify-center bg-dark-900 transition-all duration-300 ease-out",
        isComplete || !isVisible ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100",
      )}
    >
      <div className="relative w-32 h-32 mb-6">
        <Image
          src="/logo-tribu.png"
          alt="Tribu Mala"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Matrix-style loading text */}
      <div className="font-mono text-white mb-4 h-6 text-lg font-medium">
        {`TRIBU_MALA: ${matrixText}`}
      </div>

      {/* Progress bar container - más compacto */}
      <div className="w-48 h-1 bg-dark-400 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-white via-gray-200 to-white transition-all duration-75 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Progress percentage */}
      <div className="mt-3 font-mono text-sm text-white font-medium">{`${progress}%`}</div>
      
      {/* Subtle loading indicator */}
      <div className="mt-4 text-xs text-gray-400 animate-pulse">
        Cargando página...
      </div>
    </div>
  )
}