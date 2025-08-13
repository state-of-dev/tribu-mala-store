# Flujo de Prueba de Compra - Tribu Mala Store

## Pasos para probar el flujo completo:

### 1. Acceder a la tienda
```
http://localhost:3001
```

### 2. Login/Registro
- Si no tienes usuario, crea uno en `/auth/signup`
- O usa un usuario existente en `/auth/signin`

### 3. Agregar productos al carrito
- Ir a la homepage
- Seleccionar productos y añadir al carrito
- Verificar que aparezcan en el carrito (drawer derecho)

### 4. Checkout
- Hacer clic en "Checkout" desde el carrito
- Completar datos de envío
- Proceder al pago

### 5. Pago con Stripe
- Usar tarjeta de prueba: `4242 4242 4242 4242`
- Fecha: cualquier fecha futura
- CVC: cualquier 3 dígitos
- Completar el pago

### 6. Verificaciones
- Email de confirmación enviado a tu dirección
- Orden aparece en "Mis Pedidos" (`/orders`)
- Orden aparece en Admin Dashboard (`/admin/orders`)
- Estado de la orden es "PAID"

## Tarjetas de prueba Stripe:

**Exitosas:**
- `4242 4242 4242 4242` - Visa
- `4000 0566 5566 5556` - Visa (debit)
- `5555 5555 5555 4444` - Mastercard

**Fallidas:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

## URLs importantes:
- Tienda: `http://localhost:3001`
- Admin: `http://localhost:3001/admin`
- Mis Pedidos: `http://localhost:3001/orders`
- API Test Emails: `http://localhost:3001/api/test-email?template=order`

## Logs a revisar:
- Console del servidor (emails enviados)
- Webhook logs (órdenes actualizadas)
- Base de datos (nuevas órdenes creadas)