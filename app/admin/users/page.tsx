"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Eye, UserPlus } from "lucide-react"
import Link from "next/link"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES')
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-purple-500 text-white">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-500 text-white">Admin</Badge>
      case 'CUSTOMER':
        return <Badge variant="outline">Cliente</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const filteredUsers = usersData?.users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-black">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchUsers} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black">Gestión de Usuarios</h1>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input
                placeholder="Buscar por email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 placeholder:text-black"
              />
            </div>
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="CUSTOMER">Clientes</SelectItem>
              <SelectItem value="ADMIN">Administradores</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{usersData?.pagination.total || 0}</div>
            <p className="text-sm text-black">Total usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {usersData?.users.filter(u => u.role === 'CUSTOMER').length || 0}
            </div>
            <p className="text-sm text-black">Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {usersData?.users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length || 0}
            </div>
            <p className="text-sm text-black">Administradores</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {usersData?.users.filter(u => u.stats.totalOrders > 0).length || 0}
            </div>
            <p className="text-sm text-black">Con compras</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-black">
            Gestiona todos los usuarios registrados en la tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-black">{user.name || 'Sin nombre'}</h3>
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-black">
                        <div>
                          <span className="font-medium">Email:</span>
                          <br />
                          {user.email}
                        </div>
                        <div>
                          <span className="font-medium">Ubicación:</span>
                          <br />
                          {user.city && user.country ? `${user.city}, ${user.country}` : 'No especificada'}
                        </div>
                        <div>
                          <span className="font-medium">Registro:</span>
                          <br />
                          {formatDate(user.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Última actividad:</span>
                          <br />
                          {formatDate(user.updatedAt)}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Perfil
                    </Button>
                  </div>
                  
                  {/* Estadísticas de compras */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-black mb-2">Estadísticas de Compras</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-3 border border-black rounded">
                        <div className="text-lg font-bold text-blue-600">{user.stats.totalOrders}</div>
                        <div className="text-black">Órdenes totales</div>
                      </div>
                      <div className="text-center p-3 border border-black rounded">
                        <div className="text-lg font-bold text-green-600">{user.stats.paidOrders}</div>
                        <div className="text-black">Órdenes pagadas</div>
                      </div>
                      <div className="text-center p-3 border border-black rounded">
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(user.stats.totalSpent)}</div>
                        <div className="text-black">Total gastado</div>
                      </div>
                      <div className="text-center p-3 border border-black rounded">
                        <div className="text-lg font-bold text-orange-600">
                          {user.stats.lastOrder ? formatDate(user.stats.lastOrder.date) : 'Nunca'}
                        </div>
                        <div className="text-black">Última compra</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}