"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"
import { OrderSkeleton } from "@/components/ui/skeleton-smooth"
import { AnimatedOrderCard } from "@/components/admin/animated-order-card"
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  Calendar,
  Package,
  Clock,
  Loader,
  CheckCircle
} from "lucide-react"
import { 
  getOrderStatusText, 
  getPaymentStatusText, 
  getOrderStatusColor, 
  getPaymentStatusColor 
} from "@/lib/order-status"

interface Order {
  id: string
  orderNumber: string
  customerName: string | null
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  itemCount: number
  createdAt: string
}

interface OrdersData {
  orders: Order[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function AdminOrders() {
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: ordersData,
    minLoadingTime: 300
  })

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      
      const response = await fetch(`/api/admin/orders?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar órdenes')
      }
      
      const data = await response.json()
      setOrdersData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    }
  }


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const filteredOrders = ordersData?.orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []


  if (error) {
    return (
      <div className="dark">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Órdenes</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={fetchOrders}>Reintentar</Button>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
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
                    <BreadcrumbPage>Órdenes</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Gestión de Órdenes</h1>
              <p className="text-muted-foreground">
                Administra y supervisa todas las órdenes de la tienda
              </p>
            </div>

            {/* Búsqueda y Filtro */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="SHIPPED">Enviado</SelectItem>
                  <SelectItem value="DELIVERED">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Métricas Rápidas */}
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
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold">{ordersData?.pagination.total || 0}</div>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Total órdenes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold">
                          {ordersData?.orders.filter(o => o.status === 'CONFIRMED').length || 0}
                        </div>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Confirmadas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold">
                          {ordersData?.orders.filter(o => o.status === 'SHIPPED').length || 0}
                        </div>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Enviadas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold">
                          {ordersData?.orders.filter(o => o.status === 'DELIVERED').length || 0}
                        </div>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Entregadas</p>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </div>

            {/* Tabla de Órdenes */}
            <Card>
              <CardHeader>
                {showSkeleton ? (
                  <>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Órdenes ({filteredOrders.length})
                    </CardTitle>
                    <CardDescription>
                      Lista de todas las órdenes con estado y detalles de pago
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {showSkeleton ? (
                    // Skeleton loading para órdenes
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 animate-pulse">
                          <div className="flex-1 space-y-3">
                            {/* Header skeleton */}
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-32 bg-muted rounded" />
                              <div className="h-5 w-16 bg-muted rounded" />
                              <div className="h-5 w-12 bg-muted rounded" />
                            </div>
                            
                            {/* Details skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="h-4 w-40 bg-muted rounded" />
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-4 w-28 bg-muted rounded" />
                            </div>
                          </div>
                          
                          {/* Right side skeleton */}
                          <div className="flex items-center gap-4">
                            <div className="text-right space-y-1">
                              <div className="h-6 w-20 bg-muted rounded" />
                            </div>
                            <div className="h-9 w-28 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : showContent && filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No se encontraron órdenes</h3>
                      <p className="text-muted-foreground">
                        No hay órdenes que coincidan con los filtros aplicados.
                      </p>
                    </div>
                  ) : showContent ? (
                    <FadeIn>
                      <StaggerContainer>
                        {filteredOrders.map((order) => (
                          <AnimatedOrderCard
                            key={order.id}
                            order={order}
                            getStatusColor={getOrderStatusColor}
                            formatCurrency={formatCurrency}
                            formatDate={(date) => new Date(date).toLocaleDateString('es-MX')}
                          />
                        ))}
                      </StaggerContainer>
                    </FadeIn>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}