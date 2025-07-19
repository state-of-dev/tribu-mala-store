"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Package, User, CreditCard, MapPin } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface OrderItem {
  id: string
  productName: string
  productPrice: number
  quantity: number
  size?: string
  color?: string
  total: number
  product: {
    id: number
    name: string
    image1: string
    price: number
    stock: number
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string | null
  customerEmail: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  customerNotes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
  shippedAt?: string
  deliveredAt?: string
  items: OrderItem[]
  user?: {
    name: string | null
    email: string
    address?: string
    city?: string
    zip?: string
    country?: string
  }
}

interface OrderData {
  order: Order
}

export default function AdminOrderDetail() {
  const params = useParams()
  const orderId = params.id as string
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [adminNotes, setAdminNotes] = useState<string>('')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  useEffect(() => {
    if (orderData) {
      setNewStatus(orderData.order.status)
      setAdminNotes(orderData.order.adminNotes || '')
    }
  }, [orderData])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar detalles de la orden')
      }
      
      const data = await response.json()
      setOrderData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async () => {
    if (!orderData) return
    
    try {
      setSaving(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      })
      
      if (!response.ok) {
        throw new Error('Error al actualizar la orden')
      }
      
      const data = await response.json()
      setOrderData({ order: data.order })
      toast.success('Orden actualizada exitosamente')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar')
    } finally {
      setSaving(false)
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-ES')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-black">Cargando detalles de la orden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Orden no encontrada'}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={fetchOrderDetails}>Reintentar</Button>
              <Link href="/admin/orders">
                <Button variant="outline">Volver a Órdenes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const order = orderData.order

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Órdenes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-black">Orden {order.orderNumber}</h1>
            <p className="text-black">Creada el {formatDate(order.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={item.product.image1} 
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      <div className="text-sm text-black">
                        {item.size && <span>Talla: {item.size} </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-sm text-black">
                        Precio unitario: {formatCurrency(item.productPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Cantidad: {item.quantity}</p>
                      <p className="text-lg font-bold">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-black">Nombre</Label>
                  <p>{order.customerName || 'No especificado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-black">Email</Label>
                  <p>{order.customerEmail}</p>
                </div>
              </div>
              
              {order.customerNotes && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-black">Notas del cliente</Label>
                  <p className="mt-1 p-3 bg-black text-white rounded">{order.customerNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingZip}</p>
                <p>{order.shippingCountry}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Gestión y resumen */}
        <div className="space-y-6">
          {/* Gestión de estado */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Estado de la orden</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                    <SelectItem value="PROCESSING">Procesando</SelectItem>
                    <SelectItem value="SHIPPED">Enviado</SelectItem>
                    <SelectItem value="DELIVERED">Entregado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    <SelectItem value="RETURNED">Devuelto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adminNotes">Notas administrativas</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Agregar notas internas sobre esta orden..."
                  rows={4}
                  className="placeholder:text-black"
                />
              </div>

              <Button 
                onClick={updateOrder} 
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Guardando...' : 'Actualizar Orden'}
              </Button>
            </CardContent>
          </Card>

          {/* Resumen financiero */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Resumen de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Creada:</span>
                  <br />
                  {formatDate(order.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Última actualización:</span>
                  <br />
                  {formatDate(order.updatedAt)}
                </div>
                {order.shippedAt && (
                  <div>
                    <span className="font-medium">Enviada:</span>
                    <br />
                    {formatDate(order.shippedAt)}
                  </div>
                )}
                {order.deliveredAt && (
                  <div>
                    <span className="font-medium">Entregada:</span>
                    <br />
                    {formatDate(order.deliveredAt)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}