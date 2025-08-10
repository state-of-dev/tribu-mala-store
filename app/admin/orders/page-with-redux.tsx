"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Calendar,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Package,
  TrendingUp
} from "lucide-react"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

// Redux imports
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/adminApi"
import { useAdminState, useAdminFilters, useAdminNotifications } from "@/store/hooks"
import { useAppDispatch } from "@/store/hooks"
import { setCurrentView, setOrdersPage } from "@/store/slices/adminSlice"

export default function AdminOrdersWithRedux() {
  const dispatch = useAppDispatch()
  const { orderFilters, ordersPagination } = useAdminState()
  const { setOrderFilters, clearOrderFilters } = useAdminFilters()
  const { showSuccess, showError } = useAdminNotifications()

  // RTK Query - Automáticamente maneja loading, error, refetch, cache
  const {
    data: ordersData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetOrdersQuery({
    ...orderFilters,
    limit: ordersPagination.limit,
    offset: (ordersPagination.page - 1) * ordersPagination.limit
  }, {
    // Configuración de cache y refetch
    pollingInterval: 30000, // Poll cada 30 segundos para actualizaciones
    refetchOnFocus: true, // Refetch cuando regresa al tab
    refetchOnReconnect: true, // Refetch cuando se reconecta internet
  })

  const [updateOrderStatus] = useUpdateOrderStatusMutation()

  // Set current view on mount
  useEffect(() => {
    dispatch(setCurrentView('orders'))
  }, [dispatch])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap()
      showSuccess(`Estado actualizado a ${newStatus}`)
    } catch (error) {
      showError('Error al actualizar estado', error?.message)
    }
  }

  const handleFilterChange = (filterName: string, value: string) => {
    setOrderFilters({ [filterName]: value })
  }

  const handlePageChange = (page: number) => {
    dispatch(setOrdersPage(page))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX')
  }

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

  const orders = ordersData?.orders || []
  const pagination = ordersData?.pagination

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
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Pedidos</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Error al cargar pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {error?.message || 'Error desconocido'}
                  </p>
                  <Button 
                    onClick={() => refetch()}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
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
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Pedidos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Header con loading indicator */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                  Gestión de Pedidos
                  {isFetching && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                </h1>
                <p className="text-muted-foreground">
                  Administra todos los pedidos de tu tienda
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {orderFilters && Object.keys(orderFilters).length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearOrderFilters}
                    className="transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Limpiar Filtros
                  </Button>
                )}
                <Button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isFetching ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por número de orden, email..."
                    value={orderFilters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 transition-all duration-200 focus:scale-[1.02] hover:border-accent-foreground/30"
                  />
                </div>
              </div>
              
              <Select value={orderFilters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[200px] transition-all duration-200 hover:border-accent-foreground/30 focus:scale-[1.02]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado del pedido" />
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

              <Select value={orderFilters.paymentStatus || 'all'} onValueChange={(value) => handleFilterChange('paymentStatus', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[200px] transition-all duration-200 hover:border-accent-foreground/30 focus:scale-[1.02]">
                  <SelectValue placeholder="Estado del pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los pagos</SelectItem>
                  <SelectItem value="PAID">Pagado</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="FAILED">Fallido</SelectItem>
                  <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
              
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                  Pedidos ({pagination?.total || orders.length})
                </CardTitle>
                {pagination && (
                  <p className="text-sm text-muted-foreground">
                    Página {ordersPagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  // Skeleton loading
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 animate-pulse">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-32 bg-muted rounded" />
                            <div className="h-5 w-16 bg-muted rounded" />
                            <div className="h-5 w-12 bg-muted rounded" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="h-4 w-40 bg-muted rounded" />
                            <div className="h-4 w-24 bg-muted rounded" />
                            <div className="h-4 w-28 bg-muted rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-1">
                            <div className="h-6 w-20 bg-muted rounded" />
                          </div>
                          <div className="h-9 w-28 bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay pedidos</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      {Object.keys(orderFilters).length > 0 
                        ? 'No se encontraron pedidos con los filtros aplicados'
                        : 'Los pedidos aparecerán aquí cuando los clientes empiecen a comprar'
                      }
                    </p>
                  </div>
                ) : (
                  <FadeIn>
                    <StaggerContainer>
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div 
                            key={order.id}
                            className="relative overflow-hidden flex items-center justify-between p-4 rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm hover:translate-y-[-1px] hover:scale-[1.002] group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transition-transform duration-400 ease-out -translate-x-full group-hover:translate-x-full" />
                            
                            <div className="flex-1 relative z-10">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-medium transition-colors duration-200 group-hover:text-accent-foreground">
                                  {order.orderNumber}
                                </p>
                                <Badge className={`${getStatusColor(order.status)} text-xs font-medium border transition-transform duration-200 group-hover:scale-105`}>
                                  {order.status}
                                </Badge>
                                <Badge 
                                  className={`${getStatusColor(order.paymentStatus)} text-xs font-medium border transition-transform duration-200 group-hover:scale-105`}
                                  variant="outline"
                                >
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 transition-colors duration-200 group-hover:text-muted-foreground/80">
                                  <span>Cliente:</span>
                                  <span>{order.customerName || order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-1 transition-colors duration-200 group-hover:text-muted-foreground/80">
                                  <Calendar className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                                  <span>{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1 transition-colors duration-200 group-hover:text-muted-foreground/80">
                                  <Package className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                                  <span>{order.items?.length || 0} artículos</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 relative z-10">
                              <div className="text-right">
                                <p className="font-semibold text-lg transition-colors duration-200 group-hover:text-accent-foreground">
                                  {formatCurrency(order.total)}
                                </p>
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `/admin/orders/${order.id}`}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </StaggerContainer>
                  </FadeIn>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {pagination && pagination.total > pagination.limit && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(ordersPagination.page - 1)}
                  disabled={ordersPagination.page <= 1 || isFetching}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Anterior
                </Button>
                
                <span className="px-4 py-2 text-sm">
                  Página {ordersPagination.page} de {Math.ceil(pagination.total / pagination.limit)}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(ordersPagination.page + 1)}
                  disabled={ordersPagination.page >= Math.ceil(pagination.total / pagination.limit) || isFetching}
                  className="transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}