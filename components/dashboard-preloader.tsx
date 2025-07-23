"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Rutas del dashboard para precargar
const DASHBOARD_ROUTES = [
  '/admin',
  '/admin/products',
  '/admin/orders',
  '/admin/users',
  '/admin/analytics',
  '/admin/payments',
  '/admin/settings'
]

export function DashboardPreloader() {
  const router = useRouter()

  useEffect(() => {
    // Precargar rutas del dashboard de forma asíncrona
    const preloadRoutes = async () => {
      // Esperar un poco para no interferir con la carga inicial
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Precargar rutas una por una con delay para evitar sobrecarga
      for (const route of DASHBOARD_ROUTES) {
        try {
          router.prefetch(route)
          // Pequeño delay entre prefetches
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.warn(`Failed to prefetch ${route}:`, error)
        }
      }
    }

    preloadRoutes()
  }, [router])

  return null // Este componente no renderiza nada
}