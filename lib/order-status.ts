import {
  CheckCircle,
  Package,
  Truck,
  type LucideIcon
} from "lucide-react"

// Order Status Types (Simplificado - solo 3 estados)
export type OrderStatus = 
  | 'CONFIRMED'  // Pedido pagado y confirmado (estado inicial)
  | 'SHIPPED'    // Enviado por paquetería
  | 'DELIVERED'  // Entregado por paquetería

// Payment Status ya no es necesario (todos los pedidos están pagados)

// Order Status Translation (Simplificado)
export const getOrderStatusText = (status: string): string => {
  switch (status as OrderStatus) {
    case 'CONFIRMED': return 'Confirmado'
    case 'SHIPPED': return 'Enviado'
    case 'DELIVERED': return 'Entregado'
    default: return status
  }
}

// Order Status Colors (Simplificado)
export const getOrderStatusColor = (status: string): string => {
  switch (status as OrderStatus) {
    case 'CONFIRMED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'    // Azul para confirmado
    case 'SHIPPED': return 'bg-orange-500/10 text-orange-500 border-orange-500/20' // Naranja para enviado
    case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20'  // Verde para entregado
    default: return 'bg-muted text-muted-foreground'
  }
}

// Order Status Icons (Simplificado)
export const getOrderStatusIcon = (status: string): LucideIcon => {
  switch (status as OrderStatus) {
    case 'CONFIRMED': return CheckCircle  // Círculo check para confirmado
    case 'SHIPPED': return Truck         // Camión para enviado
    case 'DELIVERED': return Package     // Paquete para entregado
    default: return CheckCircle
  }
}

// Order Status Options for Selects/Dropdowns (Simplificado)
export const ORDER_STATUS_OPTIONS = [
  { value: 'CONFIRMED', label: 'Confirmado', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle },
  { value: 'SHIPPED', label: 'Enviado', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: Truck },
  { value: 'DELIVERED', label: 'Entregado', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: Package }
]