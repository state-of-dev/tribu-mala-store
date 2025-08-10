"use client"

import { useEffect, useState } from "react"
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
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserPlus,
  Crown,
  ShoppingCart,
  DollarSign,
  Calendar,
  AlertTriangle,
  Shield,
  User
} from "lucide-react"
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

interface UserStats {
  totalOrders: number
  totalSpent: number
  paidOrders: number
  lastOrder: {
    date: string
    total: number
    status: string
  } | null
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  address: string | null
  city: string | null
  country: string | null
  createdAt: string
  updatedAt: string
  stats: UserStats
}

interface UsersData {
  users: User[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function AdminUsers() {
  const [usersData, setUsersData] = useState<UsersData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: usersData,
    minLoadingTime: 600
  })

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.set('role', roleFilter)
      
      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios')
      }
      
      const data = await response.json()
      setUsersData(data)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX')
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
            <Crown className="h-2.5 w-2.5 mr-1" />
            Super Admin
          </Badge>
        )
      case 'ADMIN':
        return (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
            <Shield className="h-2.5 w-2.5 mr-1" />
            Admin
          </Badge>
        )
      case 'CUSTOMER':
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
            <User className="h-2.5 w-2.5 mr-1" />
            Cliente
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
            {role}
          </Badge>
        )
    }
  }

  const filteredUsers = usersData?.users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Usuarios</BreadcrumbPage>
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
                  <Button onClick={fetchUsers}>
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
                    <BreadcrumbPage>Usuarios</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="mb-2">
              {showSkeleton ? (
                <>
                  <div className="h-9 w-64 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-5 w-96 bg-muted rounded animate-pulse" />
                </>
              ) : showContent ? (
                <>
                  <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                  <p className="text-muted-foreground">
                    Administra todos los usuarios registrados en tu tienda
                  </p>
                </>
              ) : null}
            </div>

            {/* Búsqueda y Filtro */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CUSTOMER">Clientes</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">{usersData?.pagination.total || 0}</div>
                    )}
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total usuarios</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {usersData?.users.filter(u => u.role === 'CUSTOMER').length || 0}
                      </div>
                    )}
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {usersData?.users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length || 0}
                      </div>
                    )}
                    <Crown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {usersData?.users.filter(u => u.stats.totalOrders > 0).length || 0}
                      </div>
                    )}
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Con compras</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de usuarios */}
            <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
              
              <CardHeader className="flex flex-row items-center justify-between">
                {showSkeleton ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-28 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Lista de Usuarios ({filteredUsers.length})
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Añadir Usuario
                    </Button>
                  </>
                )}
              </CardHeader>
              
              <CardContent>
                {showSkeleton ? (
                  // Skeleton para lista de usuarios
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 animate-pulse mb-4">
                        <div className="flex-1 space-y-3">
                          {/* Header skeleton */}
                          <div className="flex items-center gap-3">
                            <div className="h-6 w-32 bg-muted rounded" />
                            <div className="h-5 w-16 bg-muted rounded" />
                          </div>
                          
                          {/* Email skeleton */}
                          <div className="h-4 w-48 bg-muted rounded" />
                          
                          {/* Stats skeleton */}
                          <div className="flex items-center gap-4">
                            <div className="h-4 w-28 bg-muted rounded" />
                            <div className="h-4 w-20 bg-muted rounded" />
                            <div className="h-4 w-24 bg-muted rounded" />
                          </div>
                        </div>
                        
                        {/* Button skeleton */}
                        <div className="h-9 w-28 bg-muted rounded" />
                      </div>
                    ))}
                  </>
                ) : showContent && filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      {searchTerm || roleFilter !== 'all' 
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Los usuarios aparecerán aquí cuando se registren en la tienda'
                      }
                    </p>
                  </div>
                ) : showContent ? (
                  <FadeIn>
                    <StaggerContainer>
                      <div className="space-y-4">
                        {filteredUsers.map((user) => (
                          <div 
                            key={user.id} 
                            className="relative overflow-hidden flex items-center justify-between p-4 rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm hover:translate-y-[-1px] hover:scale-[1.002] group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transition-transform duration-400 ease-out -translate-x-full group-hover:translate-x-full" />
                            
                            <div className="flex-1 relative z-10">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="font-medium transition-colors duration-200 group-hover:text-accent-foreground">{user.name || 'Sin nombre'}</p>
                                {getRoleBadge(user.role)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1 transition-colors duration-200 group-hover:text-muted-foreground/80">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1 transition-all duration-200 group-hover:text-accent-foreground/80">
                                  <Calendar className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                                  Registro: {formatDate(user.createdAt)}
                                </div>
                                <div className="flex items-center gap-1 transition-all duration-200 group-hover:text-accent-foreground/80">
                                  <ShoppingCart className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                                  {user.stats.totalOrders} pedidos
                                </div>
                                <div className="flex items-center gap-1 transition-all duration-200 group-hover:text-accent-foreground/80">
                                  <DollarSign className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                                  {formatCurrency(user.stats.totalSpent)}
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="relative z-10 transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-md"
                            >
                              <Eye className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                              Ver Perfil
                            </Button>
                          </div>
                        ))}
                      </div>
                    </StaggerContainer>
                  </FadeIn>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}