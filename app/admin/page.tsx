"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Activity,
  Calendar,
  Eye,
  Plus
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
      <div className="dark">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/admin">
                        Admin Panel
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min animate-pulse" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dark">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/admin">
                        Admin Panel
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchDashboardData}>
                    Reintentar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (!dashboardData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'PROCESSING': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'CANCELLED': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">
                      Admin Panel
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Welcome Section */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Bienvenido, {session?.user?.name || 'Admin'}
              </h1>
              <p className="text-muted-foreground">
                Aquí tienes un resumen de lo que está pasando en tu tienda hoy.
              </p>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              {/* Total Revenue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dashboardData.metrics.revenue.total)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatCurrency(dashboardData.metrics.revenue.today)} hoy
                  </p>
                </CardContent>
              </Card>

              {/* Total Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.metrics.orders.total}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Activity className="h-3 w-3 mr-1" />
                    {dashboardData.metrics.orders.today} hoy
                  </p>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.metrics.products.total}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {dashboardData.metrics.products.lowStock} poco stock
                  </p>
                </CardContent>
              </Card>

              {/* Customers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData.metrics.users.total}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    {dashboardData.metrics.users.newThisMonth} este mes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Grid */}
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Pedidos Recientes
                    </CardTitle>
                    <Link href="/admin/orders">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Todos
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recentOrders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-medium">{order.orderNumber}</p>
                                <Badge className={`${getStatusColor(order.status)} text-xs font-medium border`}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.customerName || order.customerEmail}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{formatCurrency(order.total)}</p>
                              <p className="text-xs text-muted-foreground flex items-center justify-end">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(order.createdAt).toLocaleDateString('es-MX')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay pedidos aún</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                          Los pedidos aparecerán aquí cuando los clientes empiecen a comprar
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Productos Más Vendidos
                    </CardTitle>
                    <Link href="/admin/products">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Todos
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.topProducts.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                            <img 
                              src={product.image1 || '/placeholder.svg'} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg'
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{product.totalSold}</p>
                              <p className="text-xs text-muted-foreground">vendidos</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Package className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay ventas aún</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                          Los productos más vendidos aparecerán aquí después de las primeras ventas
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/admin/orders">
                    <Card className="hover:bg-accent transition-colors cursor-pointer group">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors">
                          <ShoppingCart className="h-6 w-6" />
                          Gestionar Pedidos
                        </CardTitle>
                        <CardDescription>
                          {dashboardData.metrics.orders.pending > 0 
                            ? `${dashboardData.metrics.orders.pending} pedidos pendientes`
                            : 'No hay pedidos pendientes'
                          }
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/admin/products">
                    <Card className="hover:bg-accent transition-colors cursor-pointer group">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors">
                          <Package className="h-6 w-6" />
                          Gestionar Productos
                        </CardTitle>
                        <CardDescription>
                          {dashboardData.metrics.products.lowStock > 0 
                            ? `${dashboardData.metrics.products.lowStock} productos con poco stock`
                            : 'Stock en buen estado'
                          }
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>

                  <Link href="/admin/users">
                    <Card className="hover:bg-accent transition-colors cursor-pointer group">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors">
                          <Users className="h-6 w-6" />
                          Gestionar Usuarios
                        </CardTitle>
                        <CardDescription>
                          {dashboardData.metrics.users.total} {dashboardData.metrics.users.total === 1 ? 'cliente total' : 'clientes totales'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}