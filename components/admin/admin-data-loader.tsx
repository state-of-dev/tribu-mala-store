'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAdminData } from '@/store/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2, Database, TrendingUp } from 'lucide-react'
import { AdminSplashScreen } from './admin-splash-screen'

interface AdminDataLoaderProps {
  children: React.ReactNode
}

export function AdminDataLoader({ children }: AdminDataLoaderProps) {
  const pathname = usePathname()
  const { isLoading, error, refetch, meta, orders, products, users, isEmpty, data } = useAdminData()
  
  // Solo se ejecuta en rutas admin principales, no en detalles
  const isAdminRoute = pathname.startsWith('/admin')
  const isDetailPage = pathname.includes('/admin/') && pathname.split('/').length > 3
  
  // Si es una página de detalle y ya tenemos datos, renderizar directamente
  if (isDetailPage && data && !isLoading) {
    return <>{children}</>
  }
  
  // Solo mostrar loader en carga inicial (cuando no hay datos previos)
  const isInitialLoad = isLoading && !data
  
  // 🚨 ERROR STATE
  if (error && isAdminRoute && !isDetailPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error al cargar datos del admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error?.data?.error || error?.message || 'Error desconocido al cargar los datos'}
            </p>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => refetch()}
                className="w-full"
                variant="default"
              >
                <Database className="h-4 w-4 mr-2" />
                Reintentar Carga
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="w-full"
              >
                Ir al Dashboard
              </Button>
            </div>
            
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>Si el problema persiste, contacta al administrador del sistema.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // ⏳ LOADING STATE - Usar el splash screen existente de Tribu Mala
  if (isInitialLoad && isAdminRoute && !isDetailPage) {
    return <AdminSplashScreen />
  }
  
  // ✅ DATOS CARGADOS - Mostrar estadísticas rápidas si está vacío
  if (isEmpty && isAdminRoute && !isDetailPage && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Panel Admin Vacío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No hay datos aún en el sistema. Esto es normal para una instalación nueva.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium">Para empezar:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Agrega algunos productos</li>
                <li>• Configura categorías</li>
                <li>• Los pedidos aparecerán cuando los clientes compren</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/admin/products'}
              className="w-full"
            >
              Ir a Productos
            </Button>
            
            {meta && (
              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>Datos cargados: {meta.timestamp}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // 🎯 DATOS LISTOS - Renderizar children (admin pages)
  if (isAdminRoute && !isLoading) {
    // Log de performance (solo en desarrollo)
    if (process.env.NODE_ENV === 'development' && meta) {
      console.log('🚀 Admin data loaded:', {
        orders: orders.length,
        products: products.length, 
        users: users.length,
        loadedAt: meta.timestamp,
        totalRecords: meta.totalRecords
      })
    }
  }
  
  // Renderizar contenido normal
  return <>{children}</>
}

// 📊 Hook para mostrar estadísticas de carga en DevTools
export const useAdminLoadStats = () => {
  const { meta, orders, products, users, isLoading } = useAdminData()
  
  return {
    isLoaded: !isLoading && !!meta,
    stats: meta ? {
      loadTime: meta.timestamp,
      records: {
        orders: orders.length,
        products: products.length,
        users: users.length,
        total: orders.length + products.length + users.length
      },
      cacheSize: JSON.stringify({ orders, products, users }).length / 1024, // KB aproximados
    } : null
  }
}