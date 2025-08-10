# 🎨 Efectos Estándar UI - Hover, Shine, Spinner y Más

Este archivo documenta todos los efectos estándar implementados en el admin de Tribu Mala Store para mantener consistencia visual en toda la aplicación.

## 📦 **Card Effects (Efectos de Tarjetas)**

### **Card con Hover + Shine Effect**
```jsx
<Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
  {/* Subtle shine effect on hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
  
  <CardHeader>
    <CardTitle>Título de la Card</CardTitle>
  </CardHeader>
  
  <CardContent>
    {/* Contenido de la card */}
  </CardContent>
</Card>
```

### **Item Individual con Hover (para listas)**
```jsx
<div className="flex items-center gap-4 p-4 border rounded-lg transition-all duration-200 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm">
  {/* Contenido del item */}
</div>
```

## 🔘 **Button Effects (Efectos de Botones)**

### **Botón Estándar con Hover + Scale**
```jsx
<Button 
  variant="outline" 
  size="sm"
  onClick={() => window.location.href = "/ruta"}
  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
>
  <Icon className="h-4 w-4 mr-2" />
  Texto del Botón
</Button>
```

### **Botón con Spinner Loading**
```jsx
<Button 
  onClick={handleAction} 
  disabled={isLoading}
  className="transition-all duration-200 hover:scale-105 active:scale-95"
>
  {isLoading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Cargando...</span>
    </div>
  ) : (
    <>
      <Icon className="h-4 w-4 mr-2" />
      Texto del Botón
    </>
  )}
</Button>
```

### **Botón Ghost con Hover Suave**
```jsx
<Button 
  variant="ghost"
  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-accent/50"
>
  <Icon className="h-3 w-3 mr-1" />
  Acción
</Button>
```

## 💫 **Loading States (Estados de Carga)**

### **Skeleton Loading para Cards**
```jsx
{showSkeleton ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="rounded-lg border bg-card/50 overflow-hidden animate-pulse">
        <div className="aspect-square bg-muted" />
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-4 w-16 bg-muted rounded" />
            </div>
            <div className="h-6 w-20 bg-muted rounded" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded" />
            </div>
            <div className="h-8 w-8 bg-muted rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
) : /* contenido real */}
```

### **Skeleton Loading para Lista (Orders/Users)**
```jsx
{showSkeleton ? (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 animate-pulse">
        <div className="flex-1 space-y-3">
          {/* Header skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="h-5 w-12 bg-muted rounded" />
          </div>
          
          {/* Details skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-28 bg-muted rounded" />
          </div>
        </div>
        
        {/* Right side skeleton */}
        <div className="flex items-center gap-4">
          <div className="text-right space-y-1">
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
          <div className="h-9 w-28 bg-muted rounded" />
        </div>
      </div>
    ))}
  </>
) : /* contenido real */}
```

### **Skeleton para Métricas**
```jsx
{showSkeleton ? (
  <>
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    ))}
  </>
) : /* métricas reales */}
```

## 🎯 **Interactive Elements (Elementos Interactivos)**

### **Select con Loading State**
```jsx
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
```

### **Progress Timeline con Hover**
```jsx
<div 
  className="flex items-center gap-2 text-sm transition-all duration-200 hover:scale-105 hover:bg-accent/20 rounded p-1 -m-1"
>
  <StatusIcon className="h-3 w-3 transition-all duration-200 text-green-500" />
  <span className="transition-all duration-200 font-medium">Estado Actual</span>
  {isCurrent && (
    <div className="ml-auto">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    </div>
  )}
</div>
```

### **Imagen con Hover Scale**
```jsx
<img 
  src={imageUrl} 
  alt={altText}
  className="w-16 h-16 object-cover rounded transition-transform duration-200 hover:scale-105"
/>
```

## 🎨 **Animation Components (Componentes de Animación)**

### **FadeIn + StaggerContainer**
```jsx
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

{showContent ? (
  <FadeIn>
    <StaggerContainer>
      {items.map((item) => (
        <div key={item.id}>
          {/* Contenido que aparecerá con stagger */}
        </div>
      ))}
    </StaggerContainer>
  </FadeIn>
) : null}
```

### **Hook useSmoothLoading**
```jsx
import { useSmoothLoading } from "@/hooks/use-smooth-loading"

const { showSkeleton, showContent } = useSmoothLoading({ 
  data: apiData,
  minLoadingTime: 300
})

// Uso:
{showSkeleton ? (
  // Skeleton components
) : showContent && data.length === 0 ? (
  // Empty state
) : showContent ? (
  // Real content with FadeIn
) : null}
```

## 🌟 **Spinner Variations (Variaciones de Spinner)**

### **Spinner Pequeño (3x3)**
```jsx
<div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
```

### **Spinner Estándar (4x4)**
```jsx
<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
```

### **Spinner Grande (6x6)**
```jsx
<div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
```

### **Spinner con Texto**
```jsx
<div className="flex items-center gap-2">
  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  <span>Cargando...</span>
</div>
```

## 🎭 **Hover States Específicos**

### **Card Header con Skeleton**
```jsx
{showSkeleton ? (
  <>
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
    </div>
    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
  </>
) : (
  <>
    <CardTitle className="flex items-center gap-2">
      <Icon className="h-5 w-5" />
      Título Real
    </CardTitle>
    <CardDescription>
      Descripción real del contenido
    </CardDescription>
  </>
)}
```

## 📱 **Responsive Considerations**

### **Grid Responsivo con Efectos**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <div 
      key={item.id}
      className="relative overflow-hidden rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
      
      {/* Contenido */}
    </div>
  ))}
</div>
```

## 🔧 **CSS Classes Utilities**

### **Clases Reutilizables**
```css
/* Card con efectos completos */
.card-hover-effects {
  @apply relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group;
}

/* Shine effect */
.shine-effect {
  @apply absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full;
}

/* Button con hover */
.button-hover-effects {
  @apply transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10;
}

/* Spinner estándar */
.spinner {
  @apply w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin;
}

/* Item con hover suave */
.item-hover {
  @apply transition-all duration-200 ease-out hover:bg-accent/30 hover:border-accent-foreground/30 hover:shadow-sm;
}
```

## 🚀 **Implementación Rápida**

### **Para nueva página admin:**
1. Importar hooks y componentes necesarios
2. Usar `useSmoothLoading` para manejar estados
3. Aplicar skeleton loading con `showSkeleton`
4. Usar `FadeIn + StaggerContainer` para contenido real
5. Aplicar classes de hover effects a cards
6. Agregar spinners a botones de acción

### **Ejemplo completo mínimo:**
```jsx
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

export default function AdminPage() {
  const { data, error } = useApiData()
  const { showSkeleton, showContent } = useSmoothLoading({ 
    data,
    minLoadingTime: 300
  })

  return (
    <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
      
      <CardContent>
        {showSkeleton ? (
          // Skeleton components aquí
        ) : showContent ? (
          <FadeIn>
            <StaggerContainer>
              // Contenido real aquí
            </StaggerContainer>
          </FadeIn>
        ) : null}
      </CardContent>
    </Card>
  )
}
```

---

**💡 Nota:** Todos estos efectos están optimizados para performance usando `transform3d` y `will-change` cuando es necesario. Los efectos son sutiles pero profesionales, manteniendo la usabilidad mientras mejoran la experiencia visual.