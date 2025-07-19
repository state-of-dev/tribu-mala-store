"use client"

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
  Filter
} from "lucide-react"

const mockPayments = [
  {
    id: "PAY-001",
    orderNumber: "TM-2024-001",
    customerName: "Ana García",
    amount: 125.50,
    status: "PAID",
    method: "Tarjeta de Crédito",
    date: "2024-07-19",
    transactionId: "txn_1234567890"
  },
  {
    id: "PAY-002", 
    orderNumber: "TM-2024-002",
    customerName: "Carlos López",
    amount: 89.99,
    status: "PENDING",
    method: "PayPal",
    date: "2024-07-19",
    transactionId: "txn_0987654321"
  },
  {
    id: "PAY-003",
    orderNumber: "TM-2024-003", 
    customerName: "María Rodríguez",
    amount: 234.75,
    status: "FAILED",
    method: "Tarjeta de Débito",
    date: "2024-07-18",
    transactionId: "txn_1122334455"
  },
  {
    id: "PAY-004",
    orderNumber: "TM-2024-004",
    customerName: "José Martín",
    amount: 67.50,
    status: "REFUNDED",
    method: "Tarjeta de Crédito", 
    date: "2024-07-18",
    transactionId: "txn_5566778899"
  }
]

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
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function PaymentsPage() {
  const totalRevenue = mockPayments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)
    
  const pendingPayments = mockPayments.filter(p => p.status === 'PENDING').length
  const failedPayments = mockPayments.filter(p => p.status === 'FAILED').length

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
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% del mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Procesados</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockPayments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockPayments.filter(p => p.status === 'PAID').length} completados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    Requieren atención
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Fallidos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{failedPayments}</div>
                  <p className="text-xs text-muted-foreground">
                    Este mes
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
                <div className="space-y-4">
                  {mockPayments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium">{payment.orderNumber}</p>
                          <Badge className={`${getStatusColor(payment.status)} text-xs font-medium border`}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.customerName} • {payment.method}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {payment.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}