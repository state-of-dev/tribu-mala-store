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
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/lib/order-status"

interface OrderStatusManagerProps {
  orderId: string
  orderNumber: string
  currentStatus: string
  onStatusUpdate: (newStatus: string) => Promise<void>
}

export function OrderStatusManager({
  orderId,
  orderNumber,
  currentStatus,
  onStatusUpdate
}: OrderStatusManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  // Usar las opciones simplificadas
  const orderStatuses = ORDER_STATUS_OPTIONS

  const getCurrentStatus = () => {
    return orderStatuses.find(s => s.value === currentStatus) || orderStatuses[0]
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

  const orderStatus = getCurrentStatus()
  const StatusIcon = orderStatus.icon

  return (
    <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4" />
          Estado del Pedido
        </CardTitle>
        <CardDescription>
          Gestiona el estado de la orden #{orderNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={`${orderStatus.color} border flex items-center gap-1 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
            <StatusIcon className="h-3 w-3" />
            {orderStatus.label}
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
              <SelectTrigger className="flex-1 transition-all duration-200 hover:border-accent-foreground/30">
                {isUpdating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  <SelectValue />
                )}
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => {
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
              {orderStatuses.map((status, index) => {
                const StatusIcon = status.icon
                const isCurrent = status.value === currentStatus
                const isPast = orderStatuses.findIndex(s => s.value === currentStatus) > index
                const isActive = isCurrent || isPast
                
                return (
                  <div 
                    key={status.value}
                    className={`flex items-center gap-2 text-sm transition-all duration-200 hover:scale-105 hover:bg-accent/20 rounded p-1 -m-1 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <StatusIcon className={`h-3 w-3 transition-all duration-200 ${
                      isActive ? 'text-green-500' : 'text-muted-foreground'
                    }`} />
                    <span className={`transition-all duration-200 ${isCurrent ? 'font-medium' : ''}`}>{status.label}</span>
                    {isCurrent && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )
}