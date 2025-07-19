# 📋 PLAN DE COMMITS ESTRUCTURADOS - TRIBUMALA MVP

## 🎯 **OBJETIVO**
Convertir el 15% restante del MVP de hardcoded a dinámico usando commits separados por tipo de cambio.

---

## 🚀 **COMMITS PROGRAMADOS (8-12 horas total)**

### **COMMIT 1: [feat] API productos dinámicos** ⭐⭐⭐⭐⭐
```bash
git commit -m "[feat] crear API /api/products para listar productos desde DB

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Tiempo estimado:** 2-3 horas  
**Archivos modificados:**
- `app/api/products/route.ts` (nuevo)

**Qué se hizo:**
- Endpoint GET para listar productos desde PostgreSQL
- Filtros básicos por categoría y disponibilidad  
- Response JSON optimizada para frontend
- Validación y error handling

**Dependencias:** Ninguna nueva  
**Motivo:** Crear base para eliminar hardcode de productos  
**Impacto:** API lista para consumo desde frontend  
**Testing:** GET /api/products debe retornar 4 productos SDFM

**Qué sigue:** Consumir esta API desde página principal

---

### **COMMIT 2: [refactor] página principal dinámica** ⭐⭐⭐⭐⭐
```bash
git commit -m "[refactor] eliminar productos hardcoded de página principal

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Tiempo estimado:** 2-3 horas  
**Archivos modificados:**
- `app/page.tsx` - fetch desde API
- `app/config.ts` - remover productos array

**Qué se hizo:**
- Reemplazar `storeConfig.products` con fetch('/api/products')
- Implementar loading states durante carga
- Error handling para productos no disponibles
- Mantener UX responsiva

**Dependencias:** Commit 1 completado  
**Motivo:** Eliminar completamente productos hardcoded  
**Impacto:** Página principal 100% dinámica desde DB  
**Testing:** Página debe cargar productos desde base de datos

**Qué sigue:** Hacer carrito compatible con IDs reales

---

### **COMMIT 3: [feat] carrito dinámico con IDs reales** ⭐⭐⭐⭐⭐
```bash
git commit -m "[feat] implementar carrito con productIds de base de datos

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Tiempo estimado:** 1-2 horas  
**Archivos modificados:**
- `context/cart-context.tsx` - usar productId
- `components/hoodie-card.tsx` - pasar ID real

**Qué se hizo:**
- Cambiar de objetos producto a productId + quantity
- Fetch detalles del producto al agregar carrito
- Validar existencia antes de agregar
- Mantener performance con cache local

**Dependencias:** Commits 1 y 2 completados  
**Motivo:** Validar productos contra DB en tiempo real  
**Impacto:** Carrito usa referencias reales, previene errores  
**Testing:** Agregar/remover productos debe usar IDs de DB

**Qué sigue:** Pre-llenar checkout con datos usuario

---

### **COMMIT 4: [feat] checkout pre-llenado usuario** ⭐⭐⭐⭐⭐
```bash
git commit -m "[feat] pre-llenar checkout con datos de perfil usuario

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Tiempo estimado:** 1-2 horas  
**Archivos modificados:**
- `app/checkout/page.tsx` - useSession + pre-llenar

**Qué se hizo:**
- useSession para obtener datos usuario autenticado
- Pre-llenar formulario con address, city, zip, country
- Permitir edición pero conservar datos como default
- Validar campos requeridos

**Dependencias:** Sistema auth funcionando  
**Motivo:** Mejorar UX para usuarios registrados  
**Impacto:** Checkout más rápido y menos errores  
**Testing:** Usuario loggeado debe ver datos pre-llenados

**Qué sigue:** Conectar "Mis Pedidos" con órdenes reales

---

### **COMMIT 5: [feat] órdenes reales dashboard** ⭐⭐⭐⭐⭐
```bash
git commit -m "[feat] conectar página órdenes con pedidos reales de DB

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Tiempo estimado:** 1-2 horas  
**Archivos modificados:**
- `app/orders/page.tsx` - fetch órdenes reales
- `app/orders/[id]/page.tsx` - detalles dinámicos

**Qué se hizo:**
- Fetch órdenes del usuario autenticado desde DB
- Mostrar productos reales comprados (no hardcoded)
- Estados de orden en tiempo real
- Navegación entre lista y detalles

**Dependencias:** Commits anteriores + sistema órdenes  
**Motivo:** Dashboard usuario 100% funcional  
**Impacto:** "Mis Pedidos" muestra historial real  
**Testing:** Usuario debe ver sus órdenes reales con productos

**Qué sigue:** MVP COMPLETO - Testing final

---

## 📊 **RESUMEN FINAL**

### **Después de estos 5 commits:**
- ✅ 0% código hardcoded
- ✅ 100% datos desde PostgreSQL
- ✅ Carrito con productIds reales
- ✅ Checkout pre-llenado automático
- ✅ "Mis Pedidos" con órdenes reales
- ✅ MVP funcional completo

### **Estado del repository:**
- 5 commits feature-based claros
- Historial limpio y organizado
- Cada commit es independiente y funcional
- Preparado para GitHub y deploy

### **Testing final requerido:**
1. Flujo completo: registro → navegación → carrito → checkout → pago → confirmación → "mis pedidos"
2. Validar que no hay productos hardcoded
3. Verificar emails de confirmación
4. Comprobar persistencia en base de datos

---

## 🎉 **MVP LISTO PARA PRODUCCIÓN**

**Una vez completados estos commits, el MVP estará 100% funcional y listo para:**
- Deploy en Vercel
- Publicación en GitHub
- Testing con usuarios reales
- Venta de productos SDFM

---

*Documento creado: Julio 2025*  
*Enfoque: Commits estructurados y feature-based*