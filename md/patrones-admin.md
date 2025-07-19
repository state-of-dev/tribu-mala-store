# 🏗️ PATRONES DE DISEÑO - TRIBU MALA STORE ADMIN

## 📋 **PATRONES ESPECÍFICOS DEL PROYECTO**

### **🎯 Estructura Base del Admin**

```tsx
// 🔧 TEMPLATE BASE PARA PÁGINAS ADMIN
function AdminPageTemplate({ 
  title, 
  description, 
  breadcrumbs, 
  children 
}) {
  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header Pattern */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          {/* Content Pattern */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
            
            {/* Page Content */}
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

---

## 🏷️ **SISTEMA DE BADGES PARA ESTADOS**

```tsx
// 🎨 STATUS BADGE SYSTEM
const STATUS_VARIANTS = {
  // Order Status
  'PENDING': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'CONFIRMED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'PROCESSING': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'SHIPPED': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'DELIVERED': 'bg-green-500/10 text-green-500 border-green-500/20',
  'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
  
  // Payment Status
  'PAID': 'bg-green-500/10 text-green-500 border-green-500/20',
  'UNPAID': 'bg-red-500/10 text-red-500 border-red-500/20',
  'REFUNDED': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  
  // User Roles
  'ADMIN': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'SUPER_ADMIN': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'CUSTOMER': 'bg-green-500/10 text-green-500 border-green-500/20',
  
  // Product Status
  'ACTIVE': 'bg-green-500/10 text-green-500 border-green-500/20',
  'INACTIVE': 'bg-red-500/10 text-red-500 border-red-500/20',
  'LOW_STOCK': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'OUT_OF_STOCK': 'bg-red-500/10 text-red-500 border-red-500/20'
}

function StatusBadge({ status, children }) {
  const variant = STATUS_VARIANTS[status] || 'bg-muted text-muted-foreground'
  
  return (
    <Badge className={`${variant} text-xs font-medium border`}>
      {children || status}
    </Badge>
  )
}

// Uso:
<StatusBadge status="PENDING">Pending</StatusBadge>
<StatusBadge status="DELIVERED">Delivered</StatusBadge>
```

---

## 📊 **CARDS DE MÉTRICAS STANDARDIZADAS**

```tsx
// 📈 METRIC CARD COMPONENT
interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
}

function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center">
            {trend.positive !== false ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.value}% {trend.label}
          </p>
        )}
        {description && !trend && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Ejemplos de uso:
<MetricCard
  title="Total Revenue"
  value={formatCurrency(totalRevenue)}
  icon={DollarSign}
  trend={{ value: 12.5, label: "from last month", positive: true }}
/>

<MetricCard
  title="Total Orders"
  value={totalOrders}
  icon={ShoppingCart}
  description={`${todayOrders} today`}
/>
```

---

## 📋 **TABLAS DE DATOS STANDARDIZADAS**

```tsx
// 🗃️ DATA TABLE PATTERN
function DataTable({ title, data, actions, columns }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {title.icon && <title.icon className="h-5 w-5" />}
          {title.text}
        </CardTitle>
        {actions && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button key={index} {...action.props}>
                {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div 
              key={item.id || index}
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
            >
              {/* Renderizar columnas dinámicamente */}
              {columns.map((column, colIndex) => (
                <div key={colIndex} className={column.className}>
                  {column.render ? column.render(item) : item[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Ejemplo de configuración:
const orderColumns = [
  {
    key: 'orderNumber',
    className: 'flex-1',
    render: (order) => (
      <div>
        <p className="font-medium">{order.orderNumber}</p>
        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
      </div>
    )
  },
  {
    key: 'status',
    className: 'flex-none',
    render: (order) => <StatusBadge status={order.status} />
  },
  {
    key: 'total',
    className: 'text-right',
    render: (order) => (
      <div>
        <p className="font-semibold">{formatCurrency(order.total)}</p>
        <p className="text-xs text-muted-foreground">{order.date}</p>
      </div>
    )
  }
]
```

---

## 🔍 **ESTADOS DE CARGA Y VACÍO**

```tsx
// ⏳ LOADING STATES
function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingGrid({ count = 4 }) {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
      ))}
    </div>
  )
}

// 📭 EMPTY STATES
function EmptyState({ 
  title, 
  description, 
  icon: Icon, 
  action 
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center mb-4 max-w-sm">
          {description}
        </p>
        {action && (
          <Button {...action.props}>
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Uso:
<EmptyState
  title="No orders found"
  description="There are no orders to display. Orders will appear here once customers start purchasing."
  icon={ShoppingCart}
  action={{
    label: "View All Products",
    props: { variant: "outline", asChild: true },
    icon: Package
  }}
/>
```

---

## 🎨 **PALETA DE COLORES PARA ICONOS**

```tsx
// 🌈 ICON COLOR SYSTEM
const ICON_COLORS = {
  // Status Colors
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  
  // Category Colors
  revenue: 'text-green-400',
  orders: 'text-blue-400',
  products: 'text-purple-400',
  users: 'text-cyan-400',
  analytics: 'text-orange-400',
  
  // Default
  muted: 'text-muted-foreground',
  primary: 'text-primary'
}

// Ejemplos de uso en métricas:
<DollarSign className={`h-4 w-4 ${ICON_COLORS.revenue}`} />
<ShoppingCart className={`h-4 w-4 ${ICON_COLORS.orders}`} />
<Package className={`h-4 w-4 ${ICON_COLORS.products}`} />
<Users className={`h-4 w-4 ${ICON_COLORS.users}`} />
```

---

## ⚡ **HELPERS Y UTILIDADES**

```tsx
// 🛠️ UTILITY FUNCTIONS
// Format currency consistently
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Format dates consistently
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format relative time
export const formatRelativeTime = (date: string | Date) => {
  const rtf = new Intl.RelativeTimeFormat('es-ES', { numeric: 'auto' })
  const diffInDays = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return rtf.format(-diffInDays, 'day')
  if (diffInDays < 30) return rtf.format(-Math.floor(diffInDays / 7), 'week')
  return rtf.format(-Math.floor(diffInDays / 30), 'month')
}

// Generate status badge classes
export const getStatusColor = (status: string) => {
  return STATUS_VARIANTS[status] || 'bg-muted text-muted-foreground'
}

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
```

---

## 🎯 **QUICK REFERENCE - CHEAT SHEET**

```tsx
// 🚀 COMPONENTES MÁS USADOS

// Card básica
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>

// Botón con icono
<Button variant="outline" size="sm">
  <Eye className="h-4 w-4 mr-2" />
  Ver Todo
</Button>

// Badge de estado
<Badge className={getStatusColor(status)}>
  {status}
</Badge>

// Grid responsive
<div className="grid auto-rows-min gap-4 md:grid-cols-4">

// Layout con spacing
<div className="flex flex-1 flex-col gap-4 p-4 pt-0">

// Lista con hover
<div className="space-y-4">
  <div className="p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">

// Texto con jerarquía
<h1 className="text-3xl font-bold tracking-tight">
<p className="text-muted-foreground">
<p className="text-xs text-muted-foreground">
```

---

*🎨 Estos patrones garantizan consistencia visual y funcional en todo el admin panel, siguiendo las mejores prácticas de shadcn/ui.*