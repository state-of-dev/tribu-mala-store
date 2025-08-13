# 🤖 Información para Claude Code

Este archivo contiene contexto importante para trabajar eficientemente en el proyecto **Tribu Mala Store**.

## 🏗️ Arquitectura del Proyecto

### **Stack Principal**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL con Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **Emails**: Resend

### **Estructura de Directorios**
```
app/
├── api/                 # Endpoints de API
├── admin/               # Panel de administración
├── auth/                # Autenticación
├── checkout/            # Proceso de compra
├── orders/              # Gestión de pedidos
├── products/            # Catálogo
└── profile/             # Perfil de usuario

components/
├── ui/                  # Componentes shadcn/ui
├── admin/               # Componentes del admin
├── auth/                # Componentes de auth
└── navigation/          # Navegación

lib/
├── auth.ts              # Configuración NextAuth
├── prisma.ts            # Cliente Prisma
└── email.ts             # Sistema de emails
```

## 🎨 Estilo y Diseño

### **Colores Principales**
- **Fondo oscuro**: `bg-dark-900` (#0a0a0a)
- **Cards/Contenedores**: `bg-dark-800` (#1a1a1a)
- **Bordes**: `border-dark-600` (#404040)
- **Texto primario**: `text-white`
- **Texto secundario**: `text-gray-400`

### **Componentes UI**
- Usar **shadcn/ui** para todos los componentes base
- Inputs con estilo moderno: `h-12`, `rounded-lg`, padding generoso
- Botones con estados de loading y iconos de Lucide
- Cards con bordes redondeados y fondo oscuro

### **Responsive**
- Mobile-first approach
- Breakpoints estándar de Tailwind
- Navegación adaptativa (sidebar en desktop, móvil optimizado)

## 🛠️ Comandos Útiles

### **Desarrollo**
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run lint             # Linting
npm run type-check       # Verificación de tipos
```

### **Base de Datos**
```bash
npx prisma generate      # Generar cliente
npx prisma db push       # Aplicar cambios al schema
npx prisma studio        # GUI para la BD
```

### **Testing**
- Usar el navegador para testing manual
- Verificar responsive en diferentes dispositivos
- Probar flujos completos de compra

## 📊 Funcionalidades Clave

### **E-commerce**
- Catálogo de productos con filtros
- Carrito persistente (localStorage)
- Checkout con pre-llenado de perfil
- Integración completa con Stripe

### **Usuarios**
- Registro/login con NextAuth
- Perfiles con direcciones detalladas
- Sistema de roles (Customer, Admin, Super Admin)
- Pre-llenado automático en checkout

### **Admin Panel**
- Dashboard con métricas
- Gestión de productos (CRUD)
- Gestión de pedidos con estados
- Timeline visual de pedidos

### **Emails**
- Templates HTML responsivos
- Confirmaciones de compra
- Cambios de estado de pedidos
- Sistema de recovery de passwords

## 🔧 Convenciones de Código

### **Naming**
- Componentes: PascalCase (`UserProfile`)
- Archivos: kebab-case (`user-profile.tsx`)
- Variables: camelCase (`isLoading`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE_URL`)

### **Imports**
```typescript
// Librerías externas primero
import { useState } from "react"
import { useRouter } from "next/navigation"

// Componentes UI
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Componentes internos
import { UserAvatar } from "@/components/auth/user-avatar"

// Hooks y utilidades
import { useAuthStatus } from "@/hooks/use-auth-status"
import { cn } from "@/lib/utils"

// Tipos
import type { User } from "@/types"
```

### **Componentes**
- Usar TypeScript con interfaces claras
- Props con destructuring
- Estados con tipos explícitos
- Error handling con try/catch

## 🚨 Problemas Conocidos

### **Development vs Production**
- **Stripe autofill**: En desarrollo (HTTP) puede mostrar advertencias de seguridad
- **Emails**: En desarrollo usar Resend test mode
- **Variables de entorno**: Diferentes claves para test/live

### **Base de Datos**
- Schema changes requieren `npx prisma db push`
- En producción puede requerir migraciones manuales
- Backup antes de cambios estructurales

## 📝 Patrones Comunes

### **Manejo de Estados**
```typescript
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

try {
  setIsLoading(true)
  const result = await apiCall()
  // manejar éxito
} catch (error) {
  setError(error.message)
} finally {
  setIsLoading(false)
}
```

### **Componentes de Formulario**
- Usar shadcn/ui Input components
- Validación con estado local
- Estados de loading en botones
- Manejo de errores con AlertModal

### **API Routes**
```typescript
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    
    const body = await request.json()
    // lógica de negocio
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

## 🔄 Flujos Importantes

### **Checkout Process**
1. **Cart** → Productos en localStorage
2. **Checkout** → Pre-llenado con perfil de usuario
3. **Payment** → Stripe Elements (nativo, sin interferir)
4. **Success** → Confirmación y email automático

### **Order Management**
1. **Creation** → Estado inicial "pending"
2. **Payment** → Webhook actualiza a "paid"
3. **Processing** → Admin cambia estados manualmente
4. **Email notifications** → Enviados en cada cambio

### **User Profile**
1. **Registration** → Datos básicos
2. **Profile completion** → Direcciones detalladas
3. **Checkout integration** → Pre-llenado automático

## 💡 Tips para Desarrollo

### **Performance**
- Usar `dynamic` imports para componentes pesados
- Optimizar imágenes con Next.js Image
- Lazy loading en componentes no críticos

### **UX**
- Estados de loading siempre visibles
- Error messages informativos
- Confirmaciones para acciones destructivas
- Modales en lugar de alerts nativos

### **Debugging**
- Console logs estructurados con emojis
- Network tab para API calls
- React DevTools para estado
- Prisma Studio para datos

---

**Última actualización**: Enero 2025  
**Versión del proyecto**: 2.0  
**Estado**: Producción activa en Vercel