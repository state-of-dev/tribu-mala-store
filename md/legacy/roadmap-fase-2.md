# 📅 TRIBU MALA STORE - ROADMAP FASE 2

## 🎯 **PLAN DE IMPLEMENTACIÓN DETALLADO**
**Período:** 4-6 semanas post-MVP  
**Objetivo:** Sistema completo de autenticación, emails y gestión de usuarios

---

## 🗓️ **SEMANA 1: GOOGLE OAUTH & FUNDAMENTOS**

### **🔥 DÍA 1-2: Configuración Google OAuth**
- [ ] **Crear proyecto en Google Cloud Console**
  - Ir a https://console.cloud.google.com
  - Crear nuevo proyecto "Tribu Mala Store"
  - Habilitar Google+ API
- [ ] **Configurar OAuth 2.0 credentials**
  - Crear OAuth 2.0 Client ID
  - Agregar authorized domains
  - Configurar redirect URIs
- [ ] **Variables de entorno**
  ```bash
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  ```

### **🔥 DÍA 3-4: Integración NextAuth**
- [ ] **Actualizar auth.ts configuration**
  ```typescript
  import GoogleProvider from "next-auth/providers/google"
  ```
- [ ] **Modificar Prisma schema**
  - Agregar campos OAuth a User model
  - Migración de base de datos
- [ ] **Testing básico de OAuth**
  - Flujo de login con Google
  - Creación automática de usuarios

### **🔥 DÍA 5-7: UI para Google Login**
- [ ] **Componente GoogleLoginButton**
- [ ] **Integrar en páginas signin/signup**
- [ ] **Manejo de errores OAuth**
- [ ] **Testing completo del flujo**
- [ ] **Deploy y pruebas en producción**

---

## 🗓️ **SEMANA 2: RECUPERACIÓN DE CONTRASEÑAS**

### **🔥 DÍA 1-2: Base de Datos**
- [ ] **Agregar modelo PasswordReset a schema.prisma**
  ```prisma
  model PasswordReset {
    id        String   @id @default(cuid())
    email     String
    token     String   @unique
    expiresAt DateTime
    used      Boolean  @default(false)
    createdAt DateTime @default(now())
  }
  ```
- [ ] **Ejecutar migración**
- [ ] **Generar Prisma client**

### **🔥 DÍA 3-4: APIs de Reset**
- [ ] **API /api/auth/forgot-password**
  - Validar email
  - Generar token único
  - Enviar email con link
  - Rate limiting
- [ ] **API /api/auth/reset-password**
  - Validar token
  - Verificar expiración
  - Cambiar contraseña
  - Marcar token como usado

### **🔥 DÍA 5-7: UI Pages**
- [ ] **Página /auth/forgot-password**
  - Formulario de email
  - Validación con react-hook-form
  - Estados de loading/success/error
- [ ] **Página /auth/reset-password**
  - Formulario de nueva contraseña
  - Validación de strength
  - Confirmación de contraseña
- [ ] **Email template para reset**
  - HTML responsive
  - Botón call-to-action
  - Branding consistente

---

## 🗓️ **SEMANA 3: SISTEMA DE EMAILS COMPLETO**

### **🔥 DÍA 1-2: EmailService Infrastructure**
- [ ] **Crear EmailService class**
  ```typescript
  class EmailService {
    async sendWelcomeEmail(user: User)
    async sendPasswordReset(email: string, token: string)
    async sendOrderStatusUpdate(order: Order)
    async sendPasswordChanged(user: User)
  }
  ```
- [ ] **Template engine básico**
- [ ] **Configuración de Resend avanzada**

### **🔥 DÍA 3-4: Templates HTML**
- [ ] **Template base unificado**
  - Header con logo
  - Footer con links
  - Responsive design
  - Dark/light theme support
- [ ] **Email de bienvenida**
  - Saludo personalizado
  - Información de la cuenta
  - Links útiles
- [ ] **Email de cambio de estado**
  - Detalles de la orden
  - Timeline visual
  - Tracking information

### **🔥 DÍA 5-7: Integración y Testing**
- [ ] **Integrar emails en webhooks**
  - Orden PAID → Email de confirmación
  - Orden SHIPPED → Email de envío
  - Orden DELIVERED → Email de entrega
- [ ] **Integrar email de bienvenida en registro**
- [ ] **Testing completo de emails**
- [ ] **Email analytics setup**

---

## 🗓️ **SEMANA 4: GESTIÓN DE PERFIL AVANZADA**

### **🔥 DÍA 1-2: Profile Edit Page**
- [ ] **Página /profile/edit**
  - Formulario completo de usuario
  - Campos: nombre, email, dirección, teléfono
  - Validación con zod
  - Auto-save functionality
- [ ] **API /api/user/update-profile**
  - Validación server-side
  - Actualización en Prisma
  - Response con datos actualizados

### **🔥 DÍA 3-4: Cambio de Contraseña**
- [ ] **Sección en profile para cambio de contraseña**
  - Contraseña actual (verificación)
  - Nueva contraseña (con strength meter)
  - Confirmación de nueva contraseña
- [ ] **API /api/auth/change-password**
  - Verificar contraseña actual
  - Hash nueva contraseña
  - Enviar email de notificación
- [ ] **Password strength component**
  - Validación visual en tiempo real
  - Requisitos claros

### **🔥 DÍA 5-7: Avatar y Preferencias**
- [ ] **Upload de avatar**
  - Componente de drag & drop
  - Resize automático
  - Storage (Vercel Blob o Cloudinary)
- [ ] **Preferencias de email**
  - Checkboxes para tipos de emails
  - Opt-out de marketing
  - Configuración granular
- [ ] **OAuth account linking**
  - Mostrar cuentas vinculadas
  - Botón para vincular/desvincular Google

---

## 🗓️ **SEMANA 5: NOTIFICACIONES Y SEGURIDAD**

### **🔥 DÍA 1-2: Sistema de Notificaciones**
- [ ] **Modelo Notification en Prisma**
  ```prisma
  model Notification {
    id        String   @id @default(cuid())
    userId    String
    type      NotificationType
    title     String
    message   String
    read      Boolean  @default(false)
    createdAt DateTime @default(now())
    user      User     @relation(fields: [userId], references: [id])
  }
  ```
- [ ] **API /api/notifications**
  - GET: obtener notificaciones del usuario
  - POST: marcar como leídas
- [ ] **NotificationCenter component**

### **🔥 DÍA 3-4: Features de Seguridad**
- [ ] **Session management**
  - Mostrar sesiones activas
  - Cerrar sesiones remotas
  - Información de dispositivo/IP
- [ ] **Login history**
  - Registro de accesos
  - IP addresses y timestamps
  - Detección de actividad sospechosa
- [ ] **Rate limiting avanzado**
  - Por IP y por usuario
  - Diferentes límites para diferentes endpoints
  - Account lockout temporal

### **🔥 DÍA 5-7: Testing y Security Audit**
- [ ] **Testing completo de seguridad**
  - Penetration testing básico
  - Verificar rate limiting
  - Test de session management
- [ ] **Performance optimization**
  - Optimizar queries de base de datos
  - Caching strategies
  - Email delivery optimization
- [ ] **Error handling robusto**
  - Logs estructurados
  - Error boundaries
  - Fallback mechanisms

---

## 🗓️ **SEMANA 6: POLISH Y DEPLOYMENT**

### **🔥 DÍA 1-2: Analytics y Monitoring**
- [ ] **Email analytics dashboard**
  - Open rates
  - Click rates
  - Bounce rates
- [ ] **User engagement metrics**
  - Login frequency
  - Feature usage
  - Conversion funnels
- [ ] **Performance monitoring**
  - API response times
  - Error rates
  - Database query performance

### **🔥 DÍA 3-4: Final Testing**
- [ ] **End-to-end testing**
  - Flujo completo de registro con Google
  - Reset de contraseña end-to-end
  - Todos los tipos de emails
  - Gestión de perfil completa
- [ ] **Cross-browser testing**
- [ ] **Mobile responsiveness**
- [ ] **Accessibility audit**

### **🔥 DÍA 5-7: Documentation y Deploy**
- [ ] **Documentación técnica**
  - API documentation
  - Email templates guide
  - Security features overview
- [ ] **User documentation**
  - Help articles
  - FAQ updates
  - Feature announcements
- [ ] **Production deployment**
  - Environment variables
  - Database migrations
  - Monitoring setup
  - Rollback plan

---

## 🎯 **CRITERIOS DE ACEPTACIÓN**

### **✅ Google OAuth:**
- [ ] Usuario puede hacer login con Google en un click
- [ ] Datos se sincronizan correctamente (nombre, email, avatar)
- [ ] Manejo correcto de cuentas existentes
- [ ] Error handling para fallos de OAuth

### **✅ Password Reset:**
- [ ] Usuario puede solicitar reset por email
- [ ] Email llega en menos de 2 minutos
- [ ] Token expira en 15 minutos
- [ ] Reset exitoso cambia contraseña
- [ ] Rate limiting previene spam

### **✅ Sistema de Emails:**
- [ ] Email de bienvenida se envía automáticamente
- [ ] Emails de estado de orden son automáticos
- [ ] Templates son responsive y profesionales
- [ ] Analytics funcionan correctamente
- [ ] Unsubscribe funciona

### **✅ Gestión de Perfil:**
- [ ] Usuario puede editar toda su información
- [ ] Cambio de contraseña requiere contraseña actual
- [ ] Avatar se actualiza en toda la aplicación
- [ ] Preferencias de email se respetan
- [ ] OAuth linking/unlinking funciona

### **✅ Seguridad:**
- [ ] Rate limiting está activo en todos los endpoints críticos
- [ ] Session management funciona correctamente
- [ ] Login history se registra
- [ ] Actividad sospechosa se detecta
- [ ] No hay vulnerabilidades conocidas

---

## 📊 **MÉTRICAS DE ÉXITO**

### **🎯 Objetivos Cuantitativos:**
- **+50% usuarios registran con Google** (vs email manual)
- **+80% usuarios completan password reset** (vs abandono)
- **+60% open rate en emails** (vs industry average)
- **+30% user retention** (mejores funcionalidades)
- **<2 segundos response time** en todas las APIs
- **99.5% uptime** en funcionalidades críticas

### **🔒 Objetivos de Seguridad:**
- **0 vulnerabilidades críticas** en security audit
- **<1% false positives** en rate limiting
- **100% emails enviados** sin bounces por errores técnicos
- **<5 minutes recovery time** para issues de email

---

## 🚀 **PRÓXIMOS PASOS INMEDIATOS**

### **🔥 Para empezar HOY:**
1. **Crear proyecto en Google Cloud Console**
2. **Configurar OAuth 2.0 credentials**
3. **Agregar variables de entorno**
4. **Backup de base de datos antes de migraciones**

### **📋 Preparación necesaria:**
- [ ] **Vercel Pro account** (para mejor performance)
- [ ] **Resend account upgrade** (para más emails)
- [ ] **Cloudinary account** (para avatar uploads)
- [ ] **Testing devices** (mobile, tablet, desktop)

---

*🚀 Roadmap Fase 2 - Implementación completa de autenticación y emails*
*Actualizado: Julio 2025*