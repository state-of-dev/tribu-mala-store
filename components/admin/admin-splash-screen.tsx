"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function AdminSplashScreen() {
  const [progress, setProgress] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [loadingPhase, setLoadingPhase] = useState(0)

  const loadingPhases = [
    "ADMIN_INIT",
    "LOAD_ORDERS", 
    "LOAD_PRODUCTS",
    "LOAD_USERS",
    "GEN_METRICS",
    "OPTIMIZE_CACHE",
    "READY"
  ]

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%"
    let matrixInterval: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    // Matrix text effect
    matrixInterval = setInterval(() => {
      const randomText = Array(10)
        .fill(0)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("")
      setMatrixText(randomText)
    }, 80)

    // Progress bar animation with phases
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        
        // Update loading phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * loadingPhases.length)
        setLoadingPhase(Math.min(phaseIndex, loadingPhases.length - 1))
        
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          clearInterval(matrixInterval)
          return 100
        }
        return newProgress
      })
    }, 50) // Más rápido que el splash normal

    return () => {
      clearInterval(progressInterval)
      clearInterval(matrixInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-dark-900">
      <div className="relative w-48 h-48 mb-8">
        <Image
          src="/logo-tribu.png"
          alt="Tribu Mala"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Admin-specific matrix text */}
      <div className="font-mono text-white mb-2 h-6 text-lg">
        {`ADMIN_PANEL: ${matrixText}`}
      </div>
      
      {/* Loading phase indicator */}
      <div className="font-mono text-sm text-gray-400 mb-6 h-5">
        {`> ${loadingPhases[loadingPhase]}...`}
      </div>

      {/* Progress bar container - mismo estilo que el original */}
      <div className="w-64 h-1 bg-dark-400 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-100 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Progress percentage */}
      <div className="mt-2 font-mono text-sm text-white">{`${Math.floor(progress)}%`}</div>
      
      {/* Subtle admin hint */}
      <div className="mt-8 text-xs text-gray-500 text-center max-w-sm">
        <p>Cargando datos del panel de administración...</p>
        <p className="text-gray-600 mt-1">Esta carga ocurre solo una vez</p>
      </div>
    </div>
  )
}