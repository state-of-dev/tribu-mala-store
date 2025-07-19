"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Eye } from "lucide-react"
import Link from "next/link"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'CONFIRMED': return 'bg-blue-500'
      case 'PROCESSING': return 'bg-orange-500'
      case 'SHIPPED': return 'bg-purple-500'
      case 'DELIVERED': return 'bg-green-500'
      case 'CANCELLED': return 'bg-red-500'
      case 'RETURNED': return 'bg-black'
      default: return 'bg-black'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-500'
      case 'PENDING': return 'bg-yellow-500'
      case 'FAILED': return 'bg-red-500'
      case 'REFUNDED': return 'bg-blue-500'
      default: return 'bg-black'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const filteredOrders = ordersData?.orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Cargando órdenes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-red-400">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{error}</p>
              <Button onClick={fetchOrders} className="mt-4 bg-white text-black hover:bg-gray-200">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Gestión de Órdenes</h1>
          </div>
        
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número de orden, email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">Todos los estados</SelectItem>
                <SelectItem value="PENDING" className="text-gray-300 hover:bg-gray-700">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED" className="text-gray-300 hover:bg-gray-700">Confirmado</SelectItem>
                <SelectItem value="PROCESSING" className="text-gray-300 hover:bg-gray-700">Procesando</SelectItem>
                <SelectItem value="SHIPPED" className="text-gray-300 hover:bg-gray-700">Enviado</SelectItem>
                <SelectItem value="DELIVERED" className="text-gray-300 hover:bg-gray-700">Entregado</SelectItem>
                <SelectItem value="CANCELLED" className="text-gray-300 hover:bg-gray-700">Cancelado</SelectItem>
                <SelectItem value="RETURNED" className="text-gray-300 hover:bg-gray-700">Devuelto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{ordersData?.pagination.total || 0}</div>
              <p className="text-sm text-gray-400">Total órdenes</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {ordersData?.orders.filter(o => o.status === 'PENDING').length || 0}
              </div>
              <p className="text-sm text-gray-400">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-400">
                {ordersData?.orders.filter(o => o.status === 'PROCESSING').length || 0}
              </div>
              <p className="text-sm text-gray-400">Procesando</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">
                {ordersData?.orders.filter(o => o.status === 'DELIVERED').length || 0}
              </div>
              <p className="text-sm text-gray-400">Entregadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de órdenes */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Órdenes ({filteredOrders.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona todas las órdenes de la tienda
            </CardDescription>
          </CardHeader>
          <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No se encontraron órdenes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{order.orderNumber}</h3>
                      <Badge 
                        variant="secondary" 
                        className={`text-white ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-white ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-400">
                      <div>
                        <span className="font-medium text-gray-300">Cliente:</span> {order.customerName || order.customerEmail}
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Productos:</span> {order.itemCount}
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Fecha:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{formatCurrency(order.total)}</div>
                    </div>
                    
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}