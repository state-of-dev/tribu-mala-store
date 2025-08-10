"use client"

import { useAdminNavigation, useAdminData } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, BarChart3, Clock } from "lucide-react"

export function InstantNavDemo() {
  const { currentView, setCurrentView } = useAdminNavigation()
  const { data: adminData, isLoading } = useAdminData()

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { key: 'products', label: 'Productos', icon: Package },
    { key: 'users', label: 'Usuarios', icon: Users }
  ]

  const getCurrentDataSummary = () => {
    if (!adminData) return "Cargando..."

    switch (currentView) {
      case 'dashboard':
        return `${adminData.dashboard.metrics.orders.total} pedidos, ${adminData.dashboard.metrics.revenue.total.toFixed(0)} MXN ingresos`
      case 'orders':
        return `${adminData.orders.length} pedidos totales`
      case 'products':
        return `${adminData.products.length} productos en catálogo`
      case 'users':
        return `${adminData.users.length} usuarios registrados`
      default:
        return "Vista desconocida"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Demo de Navegación Instantánea Redux
        </CardTitle>
        <CardDescription>
          Haz clic en cualquier sección para ver navegación instantánea sin recargas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.key
            
            return (
              <Button
                key={item.key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView(item.key as any)}
                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </div>

        {/* Current View Info */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Vista Actual:</h3>
            <Badge variant={isLoading ? "secondary" : "default"}>
              {currentView}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {getCurrentDataSummary()}
          </p>
        </div>

        {/* Performance Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>✅ Datos cargados en Redux: {adminData ? "Sí" : "No"}</p>
          <p>✅ Navegación sin recargas: Instantánea</p>
          <p>✅ Filtros locales: En memoria</p>
          <p>✅ Cache: 1 hora</p>
        </div>
      </CardContent>
    </Card>
  )
}