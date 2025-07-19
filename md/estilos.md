# 🎨 GUÍA COMPLETA DE ESTILOS SHADCN/UI

## 📚 **ÍNDICE**
1. [Filosofía de shadcn/ui](#filosofía)
2. [Arquitectura y Composición](#arquitectura)
3. [Variables CSS y Sistema de Colores](#variables-css)
4. [Sistema de Theming Avanzado](#theming-avanzado)
5. [Componentes Core](#componentes-core)
6. [Componentes Avanzados](#componentes-avanzados)
7. [Patrones de Layout](#layout)
8. [Sistema de Spacing](#spacing)
9. [Tema Dark/Light](#temas)
10. [Forms y Validación](#forms)
11. [Data Tables](#data-tables)
12. [Notificaciones](#notificaciones)
13. [Reglas de Oro](#reglas)
14. [Ejemplos Prácticos](#ejemplos)
15. [Cheat Sheet Final](#cheat-sheet)

---

## 🎯 **FILOSOFÍA DE SHADCN/UI** {#filosofía}

### **💡 Principio Core: "No es una librería de componentes, es cómo construyes tu librería de componentes"**

### **Principios Fundamentales:**
1. **🔓 Open Code** - Transparencia total sobre la implementación de componentes
2. **📋 Copy & Paste** - No es una librería, son componentes que copias y modificas
3. **🧩 Composition** - Interfaz consistente y predictible entre componentes
4. **📦 Distribution** - Schema flat-file para distribución cross-framework
5. **✨ Beautiful Defaults** - Estilos cuidadosamente elegidos out-of-the-box
6. **🤖 AI-Ready** - Código abierto fácil de leer por IA
7. **♿ Accessibility First** - Todos los componentes son accesibles por defecto
8. **🔧 Framework Agnostic** - Funciona con cualquier framework React

### **🎯 Target Audience:**
- Desarrolladores que quieren control granular sobre componentes UI
- Proyectos que requieren customización extensiva  
- Equipos interesados en un sistema de diseño flexible y composable

### **¿Qué NO hacer?**
```tsx
// ❌ INCORRECTO - Hardcodear colores
<Card className="bg-gray-900 border-gray-800 text-white">

// ❌ INCORRECTO - Usar clases específicas de color
<div className="bg-slate-800 text-gray-100">

// ❌ INCORRECTO - Spacing inconsistente
<div className="p-3 gap-5 mb-7">
```

### **¿Qué SÍ hacer?**
```tsx
// ✅ CORRECTO - Usar variables semánticas
<Card className="bg-card border-border text-card-foreground">

// ✅ CORRECTO - Usar tokens de diseño
<div className="bg-muted text-muted-foreground">

// ✅ CORRECTO - Spacing consistente del sistema
<div className="p-4 gap-4 mb-4">
```

---

## 🏗️ **ARQUITECTURA Y COMPOSICIÓN** {#arquitectura}

### **📁 Estructura de Archivos**
```
src/
├── components/
│   └── ui/           # Componentes de shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── ...
├── components.json   # Configuración de shadcn/ui
├── tailwind.config.js
└── app/globals.css   # Variables CSS
```

### **⚙️ Configuración components.json**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### **🧩 Patrón de Composición**
```tsx
// 🔧 ESTRUCTURA TÍPICA DE COMPONENTE
// 1. Importaciones
import * as React from "react"
import { cn } from "@/lib/utils"

// 2. Definición de Props
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary"
  size?: "sm" | "md" | "lg"
}

// 3. Implementación
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Estilos base
          "base-styles",
          // Variantes
          variant === "default" && "default-styles",
          variant === "secondary" && "secondary-styles",
          // Tamaños
          size === "sm" && "size-sm",
          size === "md" && "size-md",
          size === "lg" && "size-lg",
          // Clases customizadas
          className
        )}
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

export { Component }
```

### **🎯 Instalación y Gestión**
```bash
# Instalar componentes específicos
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card badge input

# Actualizar componentes existentes
pnpm dlx shadcn@latest add button --overwrite

# Ver todos los componentes disponibles
pnpm dlx shadcn@latest add

# Inicializar proyecto nuevo
pnpm dlx shadcn@latest init
```

---

## 🎨 **VARIABLES CSS Y SISTEMA DE COLORES** {#variables-css}

### **Variables Principales (Light/Dark)**

```css
/* 🌟 VARIABLES CORE - globals.css */
:root {
  /* Background & Foreground */
  --background: 0 0% 100%;           /* Fondo principal */
  --foreground: 240 10% 3.9%;       /* Texto principal */
  
  /* Cards & Containers */
  --card: 0 0% 100%;                 /* Fondo de cards */
  --card-foreground: 240 10% 3.9%;  /* Texto en cards */
  
  /* Elementos Mutados (menos prominentes) */
  --muted: 240 4.8% 95.9%;           /* Fondos sutiles */
  --muted-foreground: 240 3.8% 46.1%; /* Texto secundario */
  
  /* Elementos de Acento */
  --accent: 240 4.8% 95.9%;          /* Hover states */
  --accent-foreground: 240 5.9% 10%; /* Texto en acentos */
  
  /* Primario (Marca) */
  --primary: 240 5.9% 10%;           /* Color principal */
  --primary-foreground: 0 0% 98%;    /* Texto en primario */
  
  /* Destructivo (Errores) */
  --destructive: 0 84.2% 60.2%;      /* Colores de error */
  --destructive-foreground: 0 0% 98%; /* Texto en errores */
  
  /* Bordes & Inputs */
  --border: 240 5.9% 90%;            /* Bordes generales */
  --input: 240 5.9% 90%;             /* Bordes de inputs */
  --ring: 240 5.9% 10%;              /* Focus rings */
  
  /* Radius Global */
  --radius: 0.75rem;                 /* Border radius base */
}

.dark {
  --background: 240 10% 3.9%;        /* Fondo oscuro */
  --foreground: 0 0% 98%;            /* Texto claro */
  --card: 240 10% 3.9%;             /* Cards oscuras */
  --card-foreground: 0 0% 98%;       /* Texto en cards */
  --muted: 240 3.7% 15.9%;          /* Elementos sutiles */
  --muted-foreground: 240 5% 64.9%;  /* Texto secundario */
  /* ... resto de variables dark */
}
```

### **Cómo Usar las Variables**

```tsx
// 🎯 ESTRUCTURA BÁSICA DE COMPONENTE
function MyComponent() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">
          Título Principal
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Descripción secundaria
        </CardDescription>
      </CardHeader>
      <CardContent className="text-card-foreground">
        Contenido principal
      </CardContent>
    </Card>
  )
}
```

---

## 🧩 **COMPONENTES CORE** {#componentes-core}

### **Card - El Componente Base**

```tsx
// 📦 ANATOMÍA DEL CARD
<Card>                    {/* bg-card border-border rounded-lg */}
  <CardHeader>            {/* p-6 flex flex-col space-y-1.5 */}
    <CardTitle>           {/* text-2xl font-semibold leading-none */}
      Título
    </CardTitle>
    <CardDescription>     {/* text-sm text-muted-foreground */}
      Descripción
    </CardDescription>
  </CardHeader>
  <CardContent>           {/* p-6 pt-0 */}
    Contenido
  </CardContent>
  <CardFooter>            {/* p-6 pt-0 flex items-center */}
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

### **Button - Estados y Variantes**

```tsx
// 🔘 VARIANTES DE BUTTON
<Button variant="default">   {/* bg-primary text-primary-foreground */}
<Button variant="destructive"> {/* bg-destructive text-destructive-foreground */}
<Button variant="outline">   {/* border border-input bg-background */}
<Button variant="secondary"> {/* bg-secondary text-secondary-foreground */}
<Button variant="ghost">     {/* hover:bg-accent hover:text-accent-foreground */}
<Button variant="link">      {/* text-primary underline-offset-4 */}

// 📏 TAMAÑOS
<Button size="default">      {/* h-10 px-4 py-2 */}
<Button size="sm">          {/* h-9 rounded-md px-3 */}
<Button size="lg">          {/* h-11 rounded-md px-8 */}
<Button size="icon">        {/* h-10 w-10 */}
```

### **Badge - Estados de Información**

```tsx
// 🏷️ BADGES SEMÁNTICOS
<Badge variant="default">    {/* bg-primary text-primary-foreground */}
<Badge variant="secondary">  {/* bg-secondary text-secondary-foreground */}
<Badge variant="destructive"> {/* bg-destructive text-destructive-foreground */}
<Badge variant="outline">    {/* text-foreground border */}

// 🎯 BADGES PARA ESTADOS (Nuestro sistema)
const getStatusBadge = (status: string) => {
  const variants = {
    'PENDING': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'CONFIRMED': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'DELIVERED': 'bg-green-500/10 text-green-500 border-green-500/20',
    'CANCELLED': 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return variants[status] || 'bg-muted text-muted-foreground'
}
```

---

## 📐 **PATRONES DE LAYOUT** {#layout}

### **Grid Systems**

```tsx
// 🔲 GRIDS RESPONSIVOS
// Dashboard metrics - 4 columnas en desktop
<div className="grid auto-rows-min gap-4 md:grid-cols-4">
  <Card>Métrica 1</Card>
  <Card>Métrica 2</Card>
  <Card>Métrica 3</Card>
  <Card>Métrica 4</Card>
</div>

// Content layout - 2 columnas en desktop
<div className="grid gap-6 lg:grid-cols-2">
  <Card>Contenido A</Card>
  <Card>Contenido B</Card>
</div>

// Actions - 3 columnas adaptables
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card>Acción 1</Card>
  <Card>Acción 2</Card>
  <Card>Acción 3</Card>
</div>
```

### **Sidebar Layout Pattern**

```tsx
// 🔧 ESTRUCTURA SIDEBAR COMPLETA
function AdminLayout({ children }) {
  return (
    <div className="dark"> {/* Forzar tema dark */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header fijo */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          {/* Contenido principal */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
```

---

## 📏 **SISTEMA DE SPACING** {#spacing}

### **Escala de Spacing Consistent**

```css
/* 📐 ESCALA RECOMENDADA (Tailwind) */
gap-1    /* 0.25rem = 4px */
gap-2    /* 0.5rem = 8px */
gap-3    /* 0.75rem = 12px */
gap-4    /* 1rem = 16px */    ⭐ MÁS USADO
gap-6    /* 1.5rem = 24px */  ⭐ MÁS USADO
gap-8    /* 2rem = 32px */

p-2      /* 0.5rem = 8px */
p-4      /* 1rem = 16px */    ⭐ MÁS USADO
p-6      /* 1.5rem = 24px */  ⭐ MÁS USADO
p-8      /* 2rem = 32px */

mb-2     /* 0.5rem = 8px */
mb-4     /* 1rem = 16px */    ⭐ MÁS USADO
mb-6     /* 1.5rem = 24px */
mb-8     /* 2rem = 32px */
```

### **Patrones de Spacing Recomendados**

```tsx
// 🎯 SPACING PATTERNS
// Container principal
<div className="flex flex-1 flex-col gap-4 p-4 pt-0">

// Grid con spacing consistente
<div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">

// Card content
<CardContent className="space-y-4">
  <div className="space-y-2">  {/* Grupos relacionados */}
    <Label>Campo</Label>
    <Input />
  </div>
</CardContent>

// Lista de elementos
<div className="space-y-4">
  {items.map(item => (
    <div key={item.id} className="p-4 rounded-lg border">
      {item.content}
    </div>
  ))}
</div>
```

---

## 🌓 **TEMA DARK/LIGHT** {#temas}

### **Implementación de Temas**

```tsx
// 🔄 THEME PROVIDER SETUP
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// 🎨 THEME TOGGLE COMPONENT
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### **Forzar Tema Específico**

```tsx
// 🌙 FORZAR DARK MODE (Para Admin)
function AdminPage() {
  return (
    <div className="dark">  {/* Fuerza dark mode localmente */}
      <SidebarProvider>
        {/* El resto del contenido usará dark mode */}
      </SidebarProvider>
    </div>
  )
}

// ☀️ FORZAR LIGHT MODE
function PublicPage() {
  return (
    <div className="light">  {/* Fuerza light mode localmente */}
      {/* Contenido en light mode */}
    </div>
  )
}
```

---

## ⚡ **REGLAS DE ORO** {#reglas}

### **✅ DO's - Qué SÍ hacer**

1. **Usar Variables Semánticas**
   ```tsx
   <Card className="bg-card border-border text-card-foreground">
   ```

2. **Spacing Consistente**
   ```tsx
   <div className="space-y-4 p-4 gap-4">
   ```

3. **Composición de Componentes**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Título</CardTitle>
       <CardDescription>Descripción</CardDescription>
     </CardHeader>
     <CardContent>Contenido</CardContent>
   </Card>
   ```

4. **Hover States Semánticos**
   ```tsx
   <Button className="hover:bg-accent hover:text-accent-foreground">
   ```

5. **Responsive Design**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
   ```

### **❌ DON'Ts - Qué NO hacer**

1. **Hardcodear Colores**
   ```tsx
   // ❌ NO hacer esto
   <div className="bg-gray-900 text-white border-gray-800">
   ```

2. **Spacing Inconsistente**
   ```tsx
   // ❌ NO hacer esto
   <div className="p-3 gap-5 mb-7 ml-2">
   ```

3. **Sobrescribir Estilos Core**
   ```tsx
   // ❌ NO hacer esto
   <Card className="bg-red-500 border-blue-300">
   ```

4. **Ignorar Estados de Accesibilidad**
   ```tsx
   // ❌ NO hacer esto
   <button className="bg-blue-500 text-white">
   ```

---

## 💡 **EJEMPLOS PRÁCTICOS** {#ejemplos}

### **Dashboard Card Completa**

```tsx
// 🎯 EJEMPLO COMPLETO - MÉTRICA CARD
function MetricCard({ title, value, change, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          {change}% from last month
        </p>
      </CardContent>
    </Card>
  )
}

// Uso:
<MetricCard 
  title="Total Revenue" 
  value="$15,231.89" 
  change={20.1}
  icon={DollarSign}
/>
```

### **Lista con Estados**

```tsx
// 📋 EJEMPLO - LISTA CON ESTADOS
function OrdersList({ orders }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-medium">{order.number}</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customer}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{order.total}</p>
                <p className="text-xs text-muted-foreground">
                  {order.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### **Form con Validación**

```tsx
// 📝 EJEMPLO - FORM COMPONENT
function ContactForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Update your contact details here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            placeholder="Enter your name"
            className="bg-background border-input" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
```

---

## 📝 **FORMS Y VALIDACIÓN** {#forms}

### **Form Architecture con React Hook Form + Zod**

```tsx
// 🔧 FORM SETUP COMPLETO
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Schema de validación
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  active: z.boolean()
})

function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      description: "",
      price: 0,
      active: true
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Add a new product to your store inventory.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Text Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="supplier@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Select Input */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your product..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number Input */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (€)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
```

### **Estados de Validación Visual**

```tsx
// 🎨 FORM STATES VISUALIZATION
function FormStatesExample() {
  return (
    <div className="space-y-4">
      {/* Estado Normal */}
      <div className="space-y-2">
        <Label htmlFor="normal">Normal State</Label>
        <Input id="normal" placeholder="Enter text..." />
      </div>

      {/* Estado de Error */}
      <div className="space-y-2">
        <Label htmlFor="error">Error State</Label>
        <Input 
          id="error" 
          placeholder="Enter text..."
          className="border-destructive focus-visible:ring-destructive" 
        />
        <p className="text-sm text-destructive">This field is required</p>
      </div>

      {/* Estado de Éxito */}
      <div className="space-y-2">
        <Label htmlFor="success">Success State</Label>
        <Input 
          id="success" 
          value="Valid input"
          className="border-green-500 focus-visible:ring-green-500" 
        />
        <p className="text-sm text-green-600">Looks good!</p>
      </div>

      {/* Estado Deshabilitado */}
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled State</Label>
        <Input id="disabled" disabled placeholder="Cannot edit..." />
      </div>
    </div>
  )
}
```

---

## 🗃️ **DATA TABLES** {#data-tables}

### **TanStack Table con shadcn/ui**

```tsx
// 📊 ADVANCED DATA TABLE SETUP
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

// Tipo de datos
type Product = {
  id: string
  name: string
  status: "active" | "inactive" | "archived"
  price: number
  category: string
  stock: number
  createdAt: string
}

// Definición de columnas
const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variants = {
        active: "bg-green-500/10 text-green-500 border-green-500/20",
        inactive: "bg-red-500/10 text-red-500 border-red-500/20",
        archived: "bg-gray-500/10 text-gray-500 border-gray-500/20"
      }
      
      return (
        <Badge className={`${variants[status]} text-xs font-medium border`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(price)
      
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      return (
        <div className={`text-sm ${stock < 10 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
          {stock} units
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit product</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Componente DataTable
function DataTable<TData, TValue>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex items-center py-4">
          <Input
            placeholder="Search products..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
        
        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Paginación */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 🔔 **NOTIFICACIONES** {#notificaciones}

### **Sonner Toast System**

```tsx
// 🍞 SONNER TOAST SETUP
import { toast } from "sonner"
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"

// Configuración en layout.tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </body>
    </html>
  )
}

// 🎯 TOAST VARIANTS
function ToastExamples() {
  const showSuccess = () => {
    toast.success("Product created successfully!", {
      description: "The product has been added to your inventory.",
      action: {
        label: "View",
        onClick: () => console.log("View product"),
      },
    })
  }

  const showError = () => {
    toast.error("Failed to create product", {
      description: "Please check your input and try again.",
      action: {
        label: "Retry",
        onClick: () => console.log("Retry action"),
      },
    })
  }

  const showWarning = () => {
    toast.warning("Low stock alert", {
      description: "5 products are running low on stock.",
      action: {
        label: "Manage Inventory",
        onClick: () => console.log("Go to inventory"),
      },
    })
  }

  const showInfo = () => {
    toast.info("System update available", {
      description: "A new version is ready to install.",
      action: {
        label: "Update",
        onClick: () => console.log("Update system"),
      },
    })
  }

  const showPromise = () => {
    const promise = new Promise((resolve) => 
      setTimeout(() => resolve({ name: "Product A" }), 2000)
    )

    toast.promise(promise, {
      loading: "Creating product...",
      success: (data) => `${data.name} has been created!`,
      error: "Failed to create product",
    })
  }

  return (
    <div className="space-x-2">
      <Button onClick={showSuccess} variant="default">
        Success Toast
      </Button>
      <Button onClick={showError} variant="destructive">
        Error Toast
      </Button>
      <Button onClick={showWarning} variant="outline">
        Warning Toast
      </Button>
      <Button onClick={showInfo} variant="secondary">
        Info Toast
      </Button>
      <Button onClick={showPromise} variant="outline">
        Promise Toast
      </Button>
    </div>
  )
}
```

### **Custom Toast con Icons**

```tsx
// 🎨 CUSTOM TOAST FUNCTIONS
export const showToast = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      icon: <CheckCircle className="h-4 w-4" />,
      className: "border-green-500/20 bg-green-500/10",
    })
  },

  error: (title: string, description?: string) => {
    toast.error(title, {
      description,
      icon: <XCircle className="h-4 w-4" />,
      className: "border-red-500/20 bg-red-500/10",
    })
  },

  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description,
      icon: <AlertCircle className="h-4 w-4" />,
      className: "border-yellow-500/20 bg-yellow-500/10",
    })
  },

  info: (title: string, description?: string) => {
    toast.info(title, {
      description,
      icon: <Info className="h-4 w-4" />,
      className: "border-blue-500/20 bg-blue-500/10",
    })
  },
}

// Uso en componentes:
const handleSave = async () => {
  try {
    await saveProduct(productData)
    showToast.success("Product saved", "Your changes have been saved successfully.")
  } catch (error) {
    showToast.error("Save failed", "Unable to save product. Please try again.")
  }
}
```

---

## 🚀 **COMANDOS ÚTILES**

```bash
# Instalar un componente específico
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge

# Ver todos los componentes disponibles
npx shadcn@latest add

# Actualizar componentes existentes
npx shadcn@latest add button --overwrite
```

---

## 📋 **CHEAT SHEET FINAL** {#cheat-sheet}

### **🎯 Componentes Más Usados**

```tsx
// 🚀 COPY-PASTE READY COMPONENTS

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

### **🎨 Variables CSS Esenciales**

```css
/* Más usadas */
bg-card text-card-foreground
bg-muted text-muted-foreground
border-border
hover:bg-accent hover:text-accent-foreground

/* Spacing */
gap-4 p-4 space-y-4 mb-4

/* Estados */
text-destructive border-destructive
text-green-500 border-green-500/20
```

### **⚡ Comandos Rápidos**

```bash
# Componentes básicos
npx shadcn@latest add button card badge input

# Componentes avanzados
npx shadcn@latest add form select textarea table

# Layout y navegación
npx shadcn@latest add sidebar breadcrumb separator

# Notificaciones
npx shadcn@latest add sonner

# Ver todos disponibles
npx shadcn@latest add
```

---

## 🔗 **RECURSOS ADICIONALES**

- **Documentación:** https://ui.shadcn.com/docs
- **Componentes:** https://ui.shadcn.com/docs/components
- **Blocks:** https://ui.shadcn.com/blocks
- **Themes:** https://ui.shadcn.com/themes
- **Examples:** https://ui.shadcn.com/examples
- **GitHub:** https://github.com/shadcn-ui/ui
- **Discord:** https://discord.gg/shadcn-ui

---

## 🏁 **RESUMEN EJECUTIVO**

**Para usar shadcn/ui correctamente:**

1. **🎯 Usa variables semánticas** - `bg-card`, `text-muted-foreground`, etc.
2. **📐 Mantén spacing consistente** - `gap-4`, `p-4`, `space-y-4`
3. **🧩 Compón componentes** - Card + CardHeader + CardContent
4. **🌓 Respeta temas** - `.dark` class para forzar dark mode
5. **♿ Mantén accesibilidad** - Labels, roles, estados focus
6. **📱 Diseña responsive** - `md:grid-cols-4`, `lg:grid-cols-2`

**Nunca hardcodees colores** - Usa el sistema de variables CSS siempre.

---

*✨ Esta guía completa te ayudará a dominar shadcn/ui y crear interfaces consistentes, accesibles y hermosas siguiendo las mejores prácticas del sistema de diseño.*