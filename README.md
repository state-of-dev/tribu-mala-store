# 🛍️ Tribu Mala Store

**E-commerce completo de streetwear premium con sistema avanzado de gestión**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## 🚀 Características Principales

### ✅ **E-commerce Completo**
- **Catálogo de productos** con búsqueda y filtros avanzados
- **Carrito de compras** con persistencia en localStorage
- **Checkout seguro** integrado con Stripe
- **Gestión de inventario** en tiempo real
- **Responsive design** optimizado para mobile y desktop

### ✅ **Sistema de Usuarios Avanzado**
- **Autenticación completa** con NextAuth.js
- **Perfiles de usuario** con información personal y direcciones
- **Sistema de roles** (Customer, Admin, Super Admin)
- **Recuperación de contraseñas** con tokens seguros
- **Métodos de pago guardados** para checkout rápido

### ✅ **Panel de Administración**
- **Dashboard completo** con métricas y analytics
- **Gestión de productos** (crear, editar, eliminar)
- **Gestión de órdenes** con cambios de estado
- **Gestión de usuarios** y roles
- **Timeline visual** de estados de pedidos

### ✅ **Sistema de Emails Robusto**
- **Confirmación de compras** con detalles completos
- **Cambios de estado** de pedidos con timeline visual
- **Emails de bienvenida** para nuevos usuarios
- **Recuperación de contraseñas** con enlaces seguros
- **Templates HTML responsivos** con branding consistente

### ✅ **Pagos y Finanzas**
- **Integración Stripe completa** con webhooks
- **Soporte para MXN** (pesos mexicanos)
- **Estados duales** (Payment Status + Order Status)
- **Reintentos de pago** para transacciones fallidas
- **Reportes financieros** básicos

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Componentes UI consistentes
- **Lucide React** - Iconografía moderna

### **Backend**
- **Next.js API Routes** - Endpoints REST
- **Prisma ORM** - Base de datos type-safe
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js** - Autenticación y sesiones

### **Servicios Externos**
- **Stripe** - Procesamiento de pagos
- **Gmail SMTP** - Envío de emails
- **Vercel** - Deployment y hosting
- **Neon** - Base de datos PostgreSQL en la nube

## 📦 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+
- npm o yarn
- Base de datos PostgreSQL

### **1. Clonar el repositorio**
```bash
git clone https://github.com/state-of-dev/tribu-mala-store.git
cd tribu-mala-store
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crear archivo `.env.local`:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Gmail SMTP)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# App
NEXT_PUBLIC_URL="http://localhost:3000"
```

### **4. Configurar base de datos**
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### **5. Ejecutar en desarrollo**
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
tribu-mala-store/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   ├── auth/              # Páginas de autenticación
│   ├── checkout/          # Proceso de compra
│   ├── orders/            # Gestión de pedidos
│   ├── profile/           # Perfil de usuario
│   └── products/          # Catálogo de productos
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── admin/            # Componentes del admin
│   ├── auth/             # Componentes de autenticación
│   └── navigation/       # Navegación y menús
├── lib/                  # Librerías y utilidades
├── prisma/               # Schema y migraciones
├── context/              # Context providers
└── types/                # Definiciones TypeScript
```

## 🔐 Roles y Permisos

### **Customer (Usuario)**
- Navegar catálogo de productos
- Realizar compras
- Ver historial de pedidos
- Gestionar perfil personal

### **Admin**
- Todo lo de Customer +
- Gestionar productos
- Gestionar pedidos y estados
- Ver analytics básicos

### **Super Admin**
- Todo lo anterior +
- Gestionar usuarios y roles
- Acceso completo al sistema

## 📧 Sistema de Emails

### **Templates Disponibles**
1. **Confirmación de compra** - Enviado después del pago exitoso
2. **Cambio de estado** - Cuando cambia el estado del pedido
3. **Bienvenida** - Para nuevos usuarios registrados
4. **Recuperación de contraseña** - Con enlace seguro de reset

### **Configuración SMTP**
El sistema usa Gmail SMTP para envío de emails. Configurar:
- Email de Gmail con autenticación de 2 factores
- App Password generada en configuración de Google
- Variables `GMAIL_USER` y `GMAIL_APP_PASSWORD`

## 💳 Configuración de Stripe

### **1. Crear cuenta Stripe**
- Registrarse en [Stripe Dashboard](https://dashboard.stripe.com)
- Obtener claves de API (test y live)

### **2. Configurar webhooks**
Endpoint: `https://your-domain.com/api/webhook`
Eventos necesarios:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### **3. Configurar productos**
- Los productos se sincronizan automáticamente
- Precios en MXN (pesos mexicanos)

## 🚀 Deployment

### **Vercel (Recomendado)**
1. Conectar repositorio con Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### **Variables de Entorno en Producción**
- Usar claves live de Stripe
- Configurar base de datos PostgreSQL
- Actualizar `NEXTAUTH_URL` y `NEXT_PUBLIC_URL`

## 📊 Monitoreo y Analytics

### **Logs Disponibles**
- Webhooks de Stripe
- Errores de API
- Envío de emails
- Actividad de usuarios

### **Métricas Básicas**
- Ventas por período
- Productos más vendidos
- Estados de pedidos
- Usuarios registrados

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run type-check   # Verificación de tipos
npm run db:migrate   # Migraciones de BD
npm run db:seed      # Semilla de datos
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear branch de feature
3. Commit de cambios
4. Push al branch
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y propietario de Tribu Mala Store.

## 📞 Soporte

Para soporte técnico o consultas:
- Email: soporte@tribumala.com
- Horario: Lunes a Viernes 9:00 AM - 6:00 PM

---

**Tribu Mala Store** - Premium Streetwear E-commerce Platform  
*Desarrollado con ❤️ usando Next.js y tecnologías modernas*