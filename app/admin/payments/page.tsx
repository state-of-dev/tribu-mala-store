"use client"

import { useEffect, useState } from "react"
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
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Eye,
  Filter,
  AlertTriangle,
  RefreshCcw,
  ExternalLink
} from "lucide-react"

interface Payment {
  id: string
  orderNumber: string
  customerName: string | null
  customerEmail: string
  total: number
  paymentStatus: string
  paymentMethod?: string
  createdAt: string
  stripeSessionId?: string
}

interface PaymentsData {
  payments: Payment[]
  metrics: {
    totalRevenue: number
    paidPayments: number
    pendingPayments: number
    failedPayments: number
  }
}

export default function PaymentsPage() {
  const [paymentsData, setPaymentsData] = useState<PaymentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      // Obtener todas las órdenes para calcular métricas de pagos
      const response = await fetch('/api/admin/orders')
      
      if (!response.ok) {
        throw new Error('Error al cargar datos de pagos')
      }
      
      const data = await response.json()
      const orders = data.orders || []
      
      // Transformar órdenes a formato de pagos
      const payments: Payment[] = orders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user?.name || order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod || 'Stripe',
        createdAt: order.createdAt,
        stripeSessionId: order.stripeSessionId
      }))

      // Calcular métricas
      const paidPayments = payments.filter(p => p.paymentStatus === 'PAID')
      const metrics = {
        totalRevenue: paidPayments.reduce((sum, p) => sum + p.total, 0),
        paidPayments: paidPayments.length,
        pendingPayments: payments.filter(p => p.paymentStatus === 'PENDING').length,
        failedPayments: payments.filter(p => p.paymentStatus === 'FAILED').length
      }

      setPaymentsData({
        payments: payments, // Mostrar TODOS los pagos
        metrics
      })
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'REFUNDED': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const handleRetryPayment = async (orderId: string) => {
    try {
      // Crear nueva sesión de checkout para retry
      const response = await fetch('/api/admin/retry-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      
      const data = await response.json()
      
      if (data.success && data.checkoutUrl) {
        // Abrir nueva ventana con checkout
        window.open(data.checkoutUrl, '_blank')
      } else {
        alert('Error al crear nueva sesión de pago')
      }
    } catch (error) {
      console.error('Error retrying payment:', error)
      alert('Error al reintentar el pago')
    }
  }

  const openStripePayment = (stripeSessionId: string) => {
    if (stripeSessionId) {
      const stripeUrl = `https://dashboard.stripe.com/payments/${stripeSessionId.replace('cs_', 'pi_')}`
      window.open(stripeUrl, '_blank')
    }
  }

  if (loading) {
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
                      <BreadcrumbPage>Pagos</BreadcrumbPage>
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
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Pagos</BreadcrumbPage>
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
                  <Button onClick={fetchPayments}>
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

  if (!paymentsData) return null

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
                    <BreadcrumbPage>Pagos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Gestión de Pagos</h1>
              <p className="text-muted-foreground">
                Administra los pagos y transacciones de tu tienda
              </p>
            </div>

            {/* Métricas de Pagos */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(paymentsData.metrics.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Pagos completados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Procesados</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentsData.payments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {paymentsData.metrics.paidPayments} completados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentsData.metrics.pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    {paymentsData.metrics.pendingPayments > 0 ? 'Requieren atención' : 'Todo al día'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Fallidos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{paymentsData.metrics.failedPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    {paymentsData.metrics.failedPayments > 0 ? 'Revisar urgente' : 'Sin problemas'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Pagos */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transacciones Recientes
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Todo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {paymentsData.payments.length > 0 ? (
                  <div className="space-y-4">
                    {paymentsData.payments.map((payment) => (
                      <div 
                        key={payment.id} 
                        className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-medium">{payment.orderNumber}</p>
                            <Badge className={`${getStatusColor(payment.paymentStatus)} text-xs font-medium border`}>
                              {payment.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {payment.customerName || payment.customerEmail} • {payment.paymentMethod}
                          </p>
                          {payment.stripeSessionId && (
                            <p className="text-xs text-muted-foreground">
                              ID: {payment.stripeSessionId.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-semibold text-lg">{formatCurrency(payment.total)}</p>
                          <p className="text-xs text-muted-foreground flex items-center justify-end">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(payment.createdAt).toLocaleDateString('es-MX')}
                          </p>
                          <div className="flex gap-1 justify-end">
                            {payment.paymentStatus === 'FAILED' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRetryPayment(payment.id)}
                                className="text-xs"
                              >
                                <RefreshCcw className="h-3 w-3 mr-1" />
                                Reintentar
                              </Button>
                            )}
                            {payment.stripeSessionId && (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => openStripePayment(payment.stripeSessionId!)}
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Stripe
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay pagos aún</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Los pagos aparecerán aquí cuando los clientes completen sus compras
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}