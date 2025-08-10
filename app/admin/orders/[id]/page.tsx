"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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
  ArrowLeft, 
  Save, 
  Package, 
  User, 
  CreditCard, 
  MapPin,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { OrderStatusManager } from "@/components/admin/order-status-manager"
import { 
  getOrderStatusText, 
  getOrderStatusColor,
  getOrderStatusIcon 
} from "@/lib/order-status"

interface OrderItem {
  id: string
  productName: string
  productPrice: number
  quantity: number
  size?: string
  color?: string
  total: number
}

interface OrderData {
  order: {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    total: number
    subtotal: number
    shippingCost: number
    tax: number
    createdAt: string
    updatedAt: string
    customerNotes?: string
    adminNotes?: string
    stripeSessionId?: string
    user: {
      id: string
      email: string
      name?: string
      address?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
      phone?: string
    }
    items: OrderItem[]
  }
}

export default function AdminOrderDetail() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar los detalles del pedido')
      }
      
      const data = await response.json()
      setOrderData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      // Refresh order data
      await fetchOrderDetails()
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar el estado')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-MX')
  }

  // Show loading state
  if (isLoading) {
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
                      <BreadcrumbLink href="/admin/orders">Pedidos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Cargando...</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Cargando detalles del pedido...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  // Show error state
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
                      <BreadcrumbLink href="/admin/orders">Pedidos</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Error</BreadcrumbPage>
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
                  <div className="flex gap-2">
                    <Button onClick={fetchOrderDetails}>
                      Reintentar
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                      Volver a Pedidos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (!orderData?.order) return null
  const order = orderData.order

  // Main component content
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
                    <BreadcrumbLink href="/admin/orders">Pedidos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{order.orderNumber}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pedido #{order.orderNumber}</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={`${getOrderStatusColor(order.status)} text-xs font-medium border transition-transform duration-200 hover:scale-105 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                        {(() => {
                          const StatusIcon = getOrderStatusIcon(order.status)
                          return <StatusIcon className="h-3 w-3 mr-1" />
                        })()}
                        {getOrderStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/orders')}
                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información del Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{order.user?.email || 'No disponible'}</p>
                      </div>
                      {order.user?.name && (
                        <div>
                          <p className="text-sm font-medium">Nombre</p>
                          <p className="text-sm text-muted-foreground">{order.user.name}</p>
                        </div>
                      )}
                      {order.user?.phone && (
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm text-muted-foreground">{order.user.phone}</p>
                        </div>
                      )}
                    </div>
                    
                    {(order.user?.address || order.user?.city) && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Dirección de Envío
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {order.user.address && <p>{order.user.address}</p>}
                          {order.user.city && (
                            <p>{order.user.city}, {order.user.state} {order.user.zipCode}</p>
                          )}
                          {order.user.country && <p>{order.user.country}</p>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Productos ({order.items?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>Cantidad: {item.quantity}</span>
                              {item.size && <span>Talla: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.productPrice)} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(item.total)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />
                    
                    {/* Order Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Envío:</span>
                          <span>{formatCurrency(order.shippingCost)}</span>
                        </div>
                      )}
                      {order.tax > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Impuestos:</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order Status Manager */}
                <OrderStatusManager
                  orderId={orderId}
                  orderNumber={order.orderNumber}
                  currentStatus={order.status}
                  onStatusUpdate={handleStatusUpdate}
                />

                {/* Order Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Información del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Creado</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Última actualización</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.updatedAt)}</p>
                    </div>
                    {order.customerNotes && (
                      <div>
                        <p className="text-sm font-medium">Notas del cliente</p>
                        <p className="text-sm text-muted-foreground">{order.customerNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}