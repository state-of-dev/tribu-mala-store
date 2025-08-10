"use client"

import { useEffect } from "react"
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
  Package
} from "lucide-react"
import Link from "next/link"
import { useAdminData, useAdminNavigation, useAdminFilters } from "@/store/hooks"

export default function OrdersPage() {
  const { setCurrentView } = useAdminNavigation()
  const { data: adminData, error, isLoading } = useAdminData()
  const {
    orders: filteredOrders,
    updateOrdersFilter,
    updateOrdersPagination,
    ordersPagination,
    ordersFilters
  } = useAdminFilters()

  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: adminData?.orders,
    minLoadingTime: 500
  })

  // Set current view to orders on mount
  useEffect(() => {
    setCurrentView('orders')
  }, [setCurrentView])

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

  const handleFilterChange = (key: string, value: string) => {
    updateOrdersFilter(key, value)
  }

  const handlePageChange = (page: number) => {
    updateOrdersPagination({ page, limit: ordersPagination.limit })
  }

  if (error) {
    return (
      <div className="dark">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error?.message || 'Error desconocido'}</p>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  const totalOrders = adminData?.orders?.length || 0
  const totalPages = Math.ceil(filteredOrders.length / ordersPagination.limit)

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
                    <BreadcrumbPage>Pedidos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Pedidos</h1>
                <p className="text-muted-foreground">
                  {totalOrders} {totalOrders === 1 ? 'pedido total' : 'pedidos totales'}
                </p>
              </div>
            </div>

            {/* Filters Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <Input 
                      placeholder="Buscar por número de pedido o email..."
                      value={ordersFilters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Select
                      value={ordersFilters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                        <SelectItem value="PROCESSING">Procesando</SelectItem>
                        <SelectItem value="SHIPPED">Enviado</SelectItem>
                        <SelectItem value="DELIVERED">Entregado</SelectItem>
                        <SelectItem value="CANCELLED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado de Pago</label>
                    <Select
                      value={ordersFilters.paymentStatus}
                      onValueChange={(value) => handleFilterChange('paymentStatus', value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Todos los pagos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los pagos</SelectItem>
                        <SelectItem value="PAID">Pagado</SelectItem>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="FAILED">Fallido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ordenar por</label>
                    <Select
                      value={ordersFilters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Fecha (más reciente)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Fecha (más reciente)</SelectItem>
                        <SelectItem value="oldest">Fecha (más antiguo)</SelectItem>
                        <SelectItem value="amount_high">Monto (mayor)</SelectItem>
                        <SelectItem value="amount_low">Monto (menor)</SelectItem>
                        <SelectItem value="status">Estado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Grid */}
            <div className="grid gap-4">
              {showSkeleton ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <OrderSkeleton key={i} />
                  ))}
                </>
              ) : showContent ? (
                filteredOrders.length > 0 ? (
                  <FadeIn>
                    <StaggerContainer>
                      {filteredOrders
                        .slice(
                          (ordersPagination.page - 1) * ordersPagination.limit,
                          ordersPagination.page * ordersPagination.limit
                        )
                        .map((order: any) => (
                          <AnimatedOrderCard
                            key={order.id}
                            order={order}
                            formatCurrency={formatCurrency}
                            getStatusColor={getStatusColor}
                            onViewOrder={(id) => {
                              // Navigation will be instant with Redux
                              window.location.href = `/admin/orders/${id}`
                            }}
                          />
                        ))}
                    </StaggerContainer>
                  </FadeIn>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No se encontraron pedidos</h3>
                      <p className="text-muted-foreground text-center max-w-sm">
                        No hay pedidos que coincidan con los filtros seleccionados.
                      </p>
                    </CardContent>
                  </Card>
                )
              ) : null}
            </div>

            {/* Pagination */}
            {showContent && filteredOrders.length > ordersPagination.limit && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {Math.min(filteredOrders.length, ordersPagination.limit)} de {filteredOrders.length} pedidos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(ordersPagination.page - 1)}
                    disabled={ordersPagination.page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {ordersPagination.page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(ordersPagination.page + 1)}
                    disabled={ordersPagination.page === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}