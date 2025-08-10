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
import { getOrderStatusColor, getOrderStatusText } from "@/lib/order-status"
import Link from "next/link"
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

interface DashboardData {
  metrics: {
    orders: {
      total: number
      today: number
      confirmed: number  // Cambiado de pending a confirmed
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
  const [error, setError] = useState<string | null>(null)
  
  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: dashboardData,
    minLoadingTime: 500
  })

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
    }
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
              {showSkeleton ? (
                <>
                  <div className="h-9 w-72 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-5 w-96 bg-muted rounded animate-pulse" />
                </>
              ) : showContent ? (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Bienvenido, {session?.user?.name || 'Admin'}
                  </h1>
                  <p className="text-muted-foreground">
                    Aquí tienes un resumen de lo que está pasando en tu tienda hoy.
                  </p>
                </>
              ) : null}
            </div>

            {/* Main Metrics Grid */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              {showSkeleton ? (
                // Skeleton para métricas
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : showContent ? (
                <>
                  {/* Total Revenue */}
                  <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-accent-foreground">
                        {formatCurrency(dashboardData.metrics.revenue.total)}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center transition-colors duration-200 group-hover:text-muted-foreground/80">
                        <TrendingUp className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                        {formatCurrency(dashboardData.metrics.revenue.today)} hoy
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Orders */}
                  <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-accent-foreground">
                        {dashboardData.metrics.orders.total}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center transition-colors duration-200 group-hover:text-muted-foreground/80">
                        <Activity className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                        {dashboardData.metrics.orders.today} hoy
                      </p>
                    </CardContent>
                  </Card>

                  {/* Products */}
                  <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Productos</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-accent-foreground">
                        {dashboardData.metrics.products.total}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center transition-colors duration-200 group-hover:text-muted-foreground/80">
                        <AlertTriangle className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                        {dashboardData.metrics.products.lowStock} poco stock
                      </p>
                    </CardContent>
                  </Card>

                  {/* Customers */}
                  <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-accent-foreground">
                        {dashboardData.metrics.users.total}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center transition-colors duration-200 group-hover:text-muted-foreground/80">
                        <Plus className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                        {dashboardData.metrics.users.newThisMonth} este mes
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </div>

            {/* Content Grid */}
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
              {showSkeleton ? (
                // Skeleton para content grid
                <div className="grid gap-6 lg:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="h-6 w-32 bg-muted rounded" />
                          <div className="h-8 w-24 bg-muted rounded" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-3 w-32 bg-muted rounded" />
                              <div className="h-3 w-20 bg-muted rounded" />
                            </div>
                            <div className="space-y-1 text-right">
                              <div className="h-5 w-16 bg-muted rounded" />
                              <div className="h-3 w-12 bg-muted rounded" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : showContent ? (
                <FadeIn>
                  <StaggerContainer>
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Recent Orders */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            Pedidos Recientes
                          </CardTitle>
                          <Link href="/admin/orders">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Todos
                            </Button>
                          </Link>
                        </CardHeader>
                        <CardContent>
                          {dashboardData.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                              {dashboardData.recentOrders.slice(0, 5).map((order) => (
                                <div 
                                  key={order.id} 
                                  className="relative overflow-hidden flex items-center justify-between p-4 rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm hover:translate-y-[-1px] hover:scale-[1.002] group"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transition-transform duration-400 ease-out -translate-x-full group-hover:translate-x-full" />
                                  
                                  <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                      <p className="font-medium transition-colors duration-200 group-hover:text-accent-foreground">{order.orderNumber}</p>
                                      <Badge className={`${getOrderStatusColor(order.status)} text-xs font-medium border transition-transform duration-200 group-hover:scale-105 relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                                        {getOrderStatusText(order.status)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                                      {order.customerName || order.customerEmail}
                                    </p>
                                    <p className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                                      {order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'}
                                    </p>
                                  </div>
                                  
                                  <div className="text-right relative z-10">
                                    <p className="font-semibold text-lg transition-colors duration-200 group-hover:text-accent-foreground">{formatCurrency(order.total)}</p>
                                    <p className="text-xs text-muted-foreground flex items-center justify-end transition-colors duration-200 group-hover:text-muted-foreground/80">
                                      <Calendar className="h-3 w-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
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
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            Productos Más Vendidos
                          </CardTitle>
                          <Link href="/admin/products">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Todos
                            </Button>
                          </Link>
                        </CardHeader>
                        <CardContent>
                          {dashboardData.topProducts.length > 0 ? (
                            <div className="space-y-4">
                              {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                                <div 
                                  key={index} 
                                  className="relative overflow-hidden flex items-center gap-4 p-4 rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm hover:translate-y-[-1px] hover:scale-[1.002] group"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transition-transform duration-400 ease-out -translate-x-full group-hover:translate-x-full" />
                                  
                                  <img 
                                    src={product.image1 || '/placeholder.svg'} 
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-lg border transition-transform duration-200 hover:scale-105 relative z-10"
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder.svg'
                                    }}
                                  />
                                  
                                  <div className="flex-1 relative z-10">
                                    <p className="font-medium text-sm transition-colors duration-200 group-hover:text-accent-foreground">{product.name}</p>
                                    <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                                      {formatCurrency(product.price)}
                                    </p>
                                  </div>
                                  
                                  <div className="text-right relative z-10">
                                    <p className="font-semibold transition-colors duration-200 group-hover:text-accent-foreground">{product.totalSold}</p>
                                    <p className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">vendidos</p>
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
                  </StaggerContainer>
                </FadeIn>
              ) : null}
              
              {/* Quick Actions */}
              {showContent && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
                  <FadeIn>
                    <StaggerContainer>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/orders">
                          <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] hover:bg-accent cursor-pointer group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-all duration-200">
                                <ShoppingCart className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                                Gestionar Pedidos
                              </CardTitle>
                              <CardDescription>
                                {dashboardData.metrics.orders.confirmed > 0 
                                  ? `${dashboardData.metrics.orders.confirmed} pedidos confirmados`
                                  : 'No hay pedidos confirmados'
                                }
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>

                        <Link href="/admin/products">
                          <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] hover:bg-accent cursor-pointer group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-all duration-200">
                                <Package className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
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
                          <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] hover:bg-accent cursor-pointer group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-all duration-200">
                                <Users className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                                Gestionar Usuarios
                              </CardTitle>
                              <CardDescription>
                                {dashboardData.metrics.users.total} {dashboardData.metrics.users.total === 1 ? 'cliente total' : 'clientes totales'}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      </div>
                    </StaggerContainer>
                  </FadeIn>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}