"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, CreditCard, Eye, Loader2 } from "lucide-react"
import Link from "next/link"

// Tipos para las órdenes
interface OrderItem {
  id: string
  productName: string
  quantity: number
  productPrice: number
  total: number
  size?: string
  color?: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        throw new Error('Error al cargar órdenes')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
        console.log(`✅ ${data.count} órdenes cargadas`)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error("❌ Error al obtener órdenes:", error)
      // En caso de error, mostrar array vacío en lugar de crash
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-900 text-yellow-300"
      case "CONFIRMED": return "bg-blue-900 text-blue-300"
      case "PROCESSING": return "bg-orange-900 text-orange-300"
      case "SHIPPED": return "bg-purple-900 text-purple-300"
      case "DELIVERED": return "bg-green-900 text-green-300"
      case "CANCELLED": return "bg-red-900 text-red-300"
      default: return "bg-gray-900 text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Pendiente"
      case "CONFIRMED": return "Confirmado"
      case "PROCESSING": return "Procesando"
      case "SHIPPED": return "Enviado"
      case "DELIVERED": return "Entregado"
      case "CANCELLED": return "Cancelado"
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Pedidos</h1>
          <p className="text-gray-400">Historial completo de tus compras</p>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No tienes pedidos aún</h3>
              <p className="text-gray-400 mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
              <Button asChild>
                <Link href="/">
                  Explorar Productos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        Pedido #{order.orderNumber}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          {formatCurrency(order.total)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{item.productName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>Cantidad: {item.quantity}</span>
                            {item.size && <span>Talla: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {formatCurrency(item.total)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatCurrency(item.productPrice)} c/u
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4 bg-dark-600" />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Envío a: {order.shippingCity}, {order.shippingZip}
                    </div>
                    <div className="text-lg font-bold text-white">
                      Total: {formatCurrency(order.total)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}