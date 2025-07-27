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
  BarChart3, 
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download
} from "lucide-react"

const mockAnalytics = {
  visitors: {
    total: 24847,
    growth: 12.5,
    today: 847
  },
  sales: {
    conversion: 3.2,
    averageOrder: 89.50,
    topCategories: ["Ropa", "Accesorios", "Calzado"]
  },
  performance: {
    pageViews: 98420,
    bounceRate: 32.1,
    sessionDuration: "4m 23s"
  }
}

export default function AnalyticsPage() {
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
                    <BreadcrumbPage>Analytics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Analiza el rendimiento y estadísticas de tu tienda
              </p>
            </div>

            {/* Métricas Principales */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visitantes Totales</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.visitors.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{mockAnalytics.visitors.growth}% del mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.sales.conversion}%</div>
                  <p className="text-xs text-muted-foreground">
                    Visitantes que compran
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN'
                    }).format(mockAnalytics.sales.averageOrder)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por pedido
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Páginas Vistas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockAnalytics.performance.pageViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Este mes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contenido Principal */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Categorías */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Categorías Más Vendidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.sales.topCategories.map((category, index) => (
                      <div key={category} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">#{index + 1}</span>
                          </div>
                          <p className="font-medium">{category}</p>
                        </div>
                        <Badge variant="secondary">
                          {Math.floor(Math.random() * 50) + 20}% ventas
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Métricas de Rendimiento */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Rendimiento del Sitio
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div>
                        <p className="font-medium">Tasa de Rebote</p>
                        <p className="text-sm text-muted-foreground">Visitantes que salen sin interactuar</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{mockAnalytics.performance.bounceRate}%</p>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Bueno
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div>
                        <p className="font-medium">Duración de Sesión</p>
                        <p className="text-sm text-muted-foreground">Tiempo promedio en el sitio</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{mockAnalytics.performance.sessionDuration}</p>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Excelente
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div>
                        <p className="font-medium">Visitantes Hoy</p>
                        <p className="text-sm text-muted-foreground">Tráfico en tiempo real</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{mockAnalytics.visitors.today}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end">
                          <Calendar className="h-3 w-3 mr-1" />
                          Último update hace 5 min
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}