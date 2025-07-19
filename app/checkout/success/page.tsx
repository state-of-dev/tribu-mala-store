"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2, Package, Mail, Home } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Link from "next/link"

interface OrderDetails {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
}

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderNumber) {
      router.push("/")
      return
    }

    async function fetchOrderDetails() {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        const data = await response.json()

        if (data.success) {
          setOrderDetails(data.order)
          
          // Clear cart on successful payment
          if (data.order.paymentStatus === 'PAID') {
            clearCart()
          }
        } else {
          setError(data.error || "No se pudo obtener la información de la orden")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        setError("Error al verificar la orden")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderNumber, router, clearCart])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-white mb-2">Verificando tu orden...</h1>
              <p className="text-gray-400">Espera mientras confirmamos tu pago y procesamos la orden.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Error al verificar la orden</h1>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Volver a la tienda
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <Card className="bg-dark-800 border-dark-600 mb-6">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
            <p className="text-gray-400">
              Tu orden ha sido procesada correctamente
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderDetails && (
          <Card className="bg-dark-800 border-dark-600 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Detalles de la Orden</h2>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Número de orden:</span>
                  <span className="text-white font-mono">{orderDetails.orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Cliente:</span>
                  <span className="text-white">{orderDetails.customerName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{orderDetails.customerEmail}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-semibold">{formatCurrency(orderDetails.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado de pago:</span>
                  <span className={`font-medium ${
                    orderDetails.paymentStatus === 'PAID' ? 'text-green-400' : 
                    orderDetails.paymentStatus === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {orderDetails.paymentStatus === 'PAID' ? 'Pagado' :
                     orderDetails.paymentStatus === 'PENDING' ? 'Pendiente' : 'Fallido'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Estado de orden:</span>
                  <span className="text-blue-400 font-medium">
                    {orderDetails.status === 'PENDING' ? 'En proceso' :
                     orderDetails.status === 'PAID' ? 'Confirmada' : orderDetails.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Confirmation */}
        <Card className="bg-dark-800 border-dark-600 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Mail className="h-5 w-5 text-green-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Confirmación por Email</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Se ha enviado un email de confirmación a tu dirección de correo con todos los detalles de tu orden.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/orders">
              <Package className="mr-2 h-4 w-4" />
              Ver mis órdenes
            </Link>
          </Button>
          
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Seguir comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
