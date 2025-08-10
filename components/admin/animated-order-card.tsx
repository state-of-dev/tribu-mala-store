"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSmoothNavigation } from "@/hooks/use-smooth-navigation"
import { 
  getOrderStatusText, 
  getOrderStatusIcon 
} from "@/lib/order-status"

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

interface AnimatedOrderCardProps {
  order: Order
  getStatusColor: (status: string) => string
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
}

export function AnimatedOrderCard({
  order,
  getStatusColor,
  getStatusText,
  getPaymentStatusColor,
  getPaymentStatusText,
  formatCurrency,
  formatDate
}: AnimatedOrderCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const { navigateWithTransition, isNavigating, clickedId } = useSmoothNavigation()

  const isThisCardNavigating = isNavigating && clickedId === order.id

  const handleClick = () => {
    setIsPressed(true)
    // Navegar directamente sin el loader TRIBU_MALA
    window.location.href = `/admin/orders/${order.id}`
    
    // Reset pressed state after animation
    setTimeout(() => {
      setIsPressed(false)
    }, 200)
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card/50 transition-all duration-300 ease-out",
        "hover:bg-accent/50 hover:shadow-md hover:border-accent-foreground/20",
        isHovered && "transform translate-y-[-2px] scale-[1.01]",
        isPressed && "transform translate-y-[1px] scale-[0.99]",
        isThisCardNavigating && "opacity-75 scale-[0.98] bg-accent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Subtle shine effect on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent",
          "transition-transform duration-500 ease-out -translate-x-full",
          isHovered && "translate-x-full"
        )}
      />
      
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            {/* Header with badges */}
            <div className="flex items-center gap-3">
              <p className={cn(
                "font-semibold text-lg transition-colors duration-200",
                isThisCardNavigating && "text-muted-foreground"
              )}>
                {order.orderNumber}
              </p>
              <Badge className={cn(
                `${getStatusColor(order.status)} text-xs font-medium border relative overflow-hidden`,
                "transition-all duration-200",
                isThisCardNavigating && "opacity-60"
              )}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                {(() => {
                  const StatusIcon = getOrderStatusIcon(order.status)
                  return <StatusIcon className="h-2.5 w-2.5 mr-1" />
                })()}
                {getOrderStatusText(order.status)}
              </Badge>
            </div>
            
            {/* Order details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="font-medium">{order.customerName || order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>{order.itemCount} artículos</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Right side with price and button */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={cn(
                "font-bold text-xl transition-all duration-200",
                isThisCardNavigating && "text-muted-foreground"
              )}>
                {formatCurrency(order.total)}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClick}
              disabled={isThisCardNavigating}
              className={cn(
                "transition-all duration-200 hover:scale-105 active:scale-95",
                isThisCardNavigating && "opacity-50 cursor-not-allowed",
                isHovered && "border-primary text-primary hover:bg-primary/10"
              )}
            >
              {isThisCardNavigating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Cargando...</span>
                </div>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}