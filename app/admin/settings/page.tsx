"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  Settings, 
  Store,
  Mail,
  Bell,
  Shield,
  Palette,
  Save
} from "lucide-react"

export default function SettingsPage() {
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
                    <BreadcrumbPage>Configuración</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
              <p className="text-muted-foreground">
                Administra la configuración general de tu tienda
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Configuración de Tienda */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Store className="h-5 w-5" />
                  <div>
                    <CardTitle>Información de la Tienda</CardTitle>
                    <CardDescription>
                      Configuración básica de tu tienda
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nombre de la Tienda</Label>
                    <Input id="storeName" defaultValue="Tribu Mala Store" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Descripción</Label>
                    <Textarea 
                      id="storeDescription" 
                      defaultValue="Tu tienda de moda alternativa favorita"
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email de Contacto</Label>
                    <Input id="storeEmail" type="email" defaultValue="contact@tribumala.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Teléfono</Label>
                    <Input id="storePhone" defaultValue="+34 123 456 789" />
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de Notificaciones */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <div>
                    <CardTitle>Notificaciones</CardTitle>
                    <CardDescription>
                      Gestiona las notificaciones del sistema
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir emails sobre nuevos pedidos
                      </p>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowStockAlerts">Alertas de Stock Bajo</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando los productos tengan poco stock
                      </p>
                    </div>
                    <Switch id="lowStockAlerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderAlerts">Alertas de Pedidos</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre cambios en pedidos
                      </p>
                    </div>
                    <Switch id="orderAlerts" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyReports">Reportes Semanales</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir resumen semanal de ventas
                      </p>
                    </div>
                    <Switch id="weeklyReports" />
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de Seguridad */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <div>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>
                      Configuración de seguridad y acceso
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Autenticación de Dos Factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad
                      </p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="loginAlerts">Alertas de Inicio de Sesión</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre inicios de sesión sospechosos
                      </p>
                    </div>
                    <Switch id="loginAlerts" defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                    <Input id="sessionTimeout" type="number" defaultValue="60" />
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de Apariencia */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <div>
                    <CardTitle>Apariencia</CardTitle>
                    <CardDescription>
                      Personaliza la apariencia del admin
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Modo Oscuro</Label>
                      <p className="text-sm text-muted-foreground">
                        Usar tema oscuro en el panel admin
                      </p>
                    </div>
                    <Switch id="darkMode" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compactMode">Modo Compacto</Label>
                      <p className="text-sm text-muted-foreground">
                        Reducir espaciado entre elementos
                      </p>
                    </div>
                    <Switch id="compactMode" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Input id="language" defaultValue="Español" disabled />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botón de Guardar */}
            <div className="flex justify-end mt-6">
              <Button size="lg" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}