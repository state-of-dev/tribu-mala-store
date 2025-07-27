"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  CreditCard,
  XCircle,
  RefreshCcw,
  ExternalLink
} from "lucide-react"

interface OrderStatusManagerProps {
  orderId: string
  orderNumber: string
  currentStatus: string
  currentPaymentStatus: string
  stripeSessionId?: string
  onStatusUpdate: (newStatus: string) => Promise<void>
  onPaymentRetry?: () => Promise<void>
}

export function OrderStatusManager({
  orderId,
  orderNumber,
  currentStatus,
  currentPaymentStatus,
  stripeSessionId,
  onStatusUpdate,
  onPaymentRetry
}: OrderStatusManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const paymentStatuses = [
    { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
    { value: 'PAID', label: 'Pagado', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
    { value: 'FAILED', label: 'Fallido', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
    { value: 'REFUNDED', label: 'Reembolsado', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: RefreshCcw }
  ]

  const fulfillmentStatuses = [
    { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Clock },
    { value: 'CONFIRMED', label: 'Confirmado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle },
    { value: 'PROCESSING', label: 'Procesando', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: Package },
    { value: 'SHIPPED', label: 'Enviado', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', icon: Truck },
    { value: 'DELIVERED', label: 'Entregado', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle },
    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle }
  ]

  const getCurrentPaymentStatus = () => {
    return paymentStatuses.find(s => s.value === currentPaymentStatus) || paymentStatuses[0]
  }

  const getCurrentFulfillmentStatus = () => {
    return fulfillmentStatuses.find(s => s.value === currentStatus) || fulfillmentStatuses[0]
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const openStripePayment = () => {
    if (stripeSessionId) {
      const stripeUrl = `https://dashboard.stripe.com/payments/${stripeSessionId.replace('cs_', 'pi_')}`
      window.open(stripeUrl, '_blank')
    }
  }

  const paymentStatus = getCurrentPaymentStatus()
  const PaymentIcon = paymentStatus.icon
  
  const fulfillmentStatus = getCurrentFulfillmentStatus()
  const FulfillmentIcon = fulfillmentStatus.icon

  return (
    <div className="space-y-4">
      {/* Payment Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4" />
            Estado del Pago
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={`${paymentStatus.color} border flex items-center gap-1`}>
              <PaymentIcon className="h-3 w-3" />
              {paymentStatus.label}
            </Badge>
            <div className="flex gap-1">
              {currentPaymentStatus === 'FAILED' && onPaymentRetry && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onPaymentRetry}
                  className="text-xs"
                >
                  <RefreshCcw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              )}
              {stripeSessionId && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={openStripePayment}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Stripe
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Fulfillment Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" />
            Estado del Pedido
          </CardTitle>
          <CardDescription>
            Gestiona el estado de fulfillment de la orden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={`${fulfillmentStatus.color} border flex items-center gap-1`}>
              <FulfillmentIcon className="h-3 w-3" />
              {fulfillmentStatus.label}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cambiar estado:</label>
            <div className="flex gap-2">
              <Select
                defaultValue={currentStatus}
                onValueChange={handleStatusUpdate}
                disabled={isUpdating}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fulfillmentStatuses.map((status) => {
                    const StatusIcon = status.icon
                    return (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Progreso:</label>
            <div className="space-y-2">
              {fulfillmentStatuses.slice(0, 5).map((status, index) => {
                const StatusIcon = status.icon
                const isCurrent = status.value === currentStatus
                const isPast = fulfillmentStatuses.findIndex(s => s.value === currentStatus) > index
                const isActive = isCurrent || isPast
                
                return (
                  <div 
                    key={status.value}
                    className={`flex items-center gap-2 text-sm ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <StatusIcon className={`h-3 w-3 ${
                      isActive ? 'text-green-500' : 'text-muted-foreground'
                    }`} />
                    <span className={isCurrent ? 'font-medium' : ''}>{status.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}