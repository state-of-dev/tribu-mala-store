"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Loader2, Truck } from "lucide-react"
import Link from "next/link"

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
  subtotal: number
  shippingCost: number
  tax: number
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
  items: OrderItem[]
  customerName: string
  customerEmail: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
  stripeSessionId?: string
  customerNotes?: string
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
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
    fetchOrderDetail()
  }, [params.id])

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/orders/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("❌ Orden no encontrada")
          setOrder(null)
          return
        }
        throw new Error('Error al cargar orden')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.order)
        console.log("✅ Orden cargada:", data.order.orderNumber)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error("❌ Error al obtener detalle de orden:", error)
      setOrder(null)
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (!order) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Orden no encontrada</h3>
              <p className="text-gray-400 mb-6">La orden que buscas no existe o no tienes permisos para verla</p>
              <Button asChild>
                <Link href="/orders">
                  Volver a Mis Pedidos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Mis Pedidos
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-gray-400">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Package className="mr-2 h-5 w-5" />
                  Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3">
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
              </CardContent>
            </Card>

            {/* Timeline de Estado */}
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Truck className="mr-2 h-5 w-5" />
                  Estado del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Pedido realizado</p>
                      <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.shippedAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-white">Pedido enviado</p>
                        <p className="text-sm text-gray-400">{formatDate(order.shippedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.deliveredAt && (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-white">Pedido entregado</p>
                        <p className="text-sm text-gray-400">{formatDate(order.deliveredAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Resumen de Pago */}
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Resumen de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Envío</span>
                  <span className="text-white">{formatCurrency(order.shippingCost)}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Impuestos</span>
                    <span className="text-white">{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <Separator className="bg-dark-600" />
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Dirección de Envío */}
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MapPin className="mr-2 h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-300 space-y-1">
                  <p className="font-medium text-white">{order.customerName}</p>
                  <p>{order.shippingAddress}</p>
                  <p>{order.shippingCity}, {order.shippingZip}</p>
                  <p>{order.shippingCountry}</p>
                </div>
                {order.customerNotes && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <p className="text-sm text-gray-400 mb-1">Notas del pedido:</p>
                    <p className="text-sm text-gray-300">{order.customerNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}