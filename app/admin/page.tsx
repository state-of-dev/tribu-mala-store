"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

interface DashboardData {
  metrics: {
    orders: {
      total: number
      today: number
      pending: number
      thisMonth: number
    }
    revenue: {
      total: number
      today: number
      thisMonth: number
    }
    products: {
      total: number
      lowStock: number
      inactive: number
    }
    users: {
      total: number
      newThisMonth: number
    }
  }
  recentOrders: Array<{
    id: string
    orderNumber: string
    customerName: string | null
    customerEmail: string
    total: number
    status: string
    paymentStatus: string
    itemCount: number
    createdAt: string
  }>
  topProducts: Array<{
    name: string
    image1: string
    price: number
    totalSold: number
    orderCount: number
  }>
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error('Error al cargar datos del dashboard')
      }
      
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'CONFIRMED': return 'bg-blue-500'
      case 'PROCESSING': return 'bg-orange-500'
      case 'SHIPPED': return 'bg-purple-500'
      case 'DELIVERED': return 'bg-green-500'
      case 'CANCELLED': return 'bg-red-500'
      default: return 'bg-black'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido, {session?.user?.name || session?.user?.email}</p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Órdenes Totales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{dashboardData.metrics.orders.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.metrics.orders.today} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {formatCurrency(dashboardData.metrics.revenue.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(dashboardData.metrics.revenue.today)} hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{dashboardData.metrics.products.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.metrics.products.lowStock} con poco stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{dashboardData.metrics.users.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.metrics.users.newThisMonth} este mes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Órdenes recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                Órdenes Recientes
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm">Ver todas</Button>
                </Link>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName || order.customerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.itemCount} productos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          {/* Productos más vendidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                Productos Más Vendidos
                <Link href="/admin/products">
                  <Button variant="outline" size="sm">Ver todos</Button>
                </Link>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <img 
                    src={product.image1} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{product.totalSold} vendidos</p>
                    <p className="text-xs text-muted-foreground">
                      {product.orderCount} órdenes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
            </Card>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/orders">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    Gestionar Órdenes
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dashboardData.metrics.orders.pending} órdenes pendientes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/products">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Package className="h-5 w-5" />
                    Gestionar Productos
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dashboardData.metrics.products.lowStock} productos con poco stock
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="h-5 w-5" />
                    Gestionar Usuarios
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dashboardData.metrics.users.total} usuarios registrados
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
    </div>
  )
}