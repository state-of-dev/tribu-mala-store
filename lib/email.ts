import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Crear el transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log(`📧 Attempting to send email to: ${to}`)
  console.log(`📧 Subject: ${subject}`)
  console.log(`🔑 Gmail User present: ${!!process.env.GMAIL_USER}`)
  console.log(`🔑 Gmail App Password present: ${!!process.env.GMAIL_APP_PASSWORD}`)
  
  try {
    const mailOptions = {
      from: `"Tribu Mala Store" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html
    }

    console.log(`📧 Sending email from: ${process.env.GMAIL_USER}`)
    console.log(`📧 Mail options:`, JSON.stringify(mailOptions, null, 2))

    const result = await transporter.sendMail(mailOptions)

    console.log('✅ Email sent successfully:', JSON.stringify(result, null, 2))
    return { success: true, data: result }
  } catch (error) {
    console.error('❌ Nodemailer Error:', error)
    return { success: false, error }
  }
}

// Base HTML template - Shadcn style
function getBaseTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tribu Mala Store</title>
      <style>
        body { 
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          max-width: 600px; 
          margin: 0 auto; 
          padding: 0; 
          background-color: #ffffff;
          line-height: 1.5;
          color: #020817;
        }
        .container { 
          background: #ffffff; 
          margin: 16px; 
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .header { 
          background: #000000;
          color: #ffffff; 
          padding: 32px 24px; 
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: 600; 
          letter-spacing: -0.025em;
        }
        .header p { 
          margin: 8px 0 0 0; 
          font-size: 14px; 
          color: #94a3b8;
        }
        .content { 
          padding: 24px;
          color: #020817;
        }
        .content h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #020817;
        }
        .content h3 {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 12px 0;
          color: #020817;
        }
        .content h4 {
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 8px 0;
          color: #020817;
        }
        .content p {
          margin: 0 0 16px 0;
          color: #475569;
        }
        .button {
          display: inline-block;
          background: #020817;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 14px;
          margin: 16px 0;
        }
        .card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
        .card-highlight {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          padding: 16px;
          border-radius: 6px;
          margin: 16px 0;
        }
        .divider {
          height: 1px;
          background: #e2e8f0;
          margin: 16px 0;
        }
        .text-sm {
          font-size: 14px;
        }
        .text-xs {
          font-size: 12px;
        }
        .text-muted {
          color: #64748b;
        }
        .font-medium {
          font-weight: 500;
        }
        .font-semibold {
          font-weight: 600;
        }
        .grid {
          display: grid;
          gap: 16px;
        }
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr;
        }
        .flex {
          display: flex;
        }
        .justify-between {
          justify-content: space-between;
        }
        .items-center {
          align-items: center;
        }
        .space-y-2 > * + * {
          margin-top: 8px;
        }
        .space-y-4 > * + * {
          margin-top: 16px;
        }
        .footer {
          text-align: center;
          padding: 24px;
          color: #64748b;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-radius: 0 0 8px 8px;
        }
        .footer p { 
          margin: 4px 0; 
          font-size: 14px;
        }
        .brand { 
          font-weight: 600; 
          color: #020817; 
        }
        @media (max-width: 600px) {
          .container { margin: 8px; }
          .content { padding: 16px; }
          .grid-cols-2 { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TRIBU MALA STORE</h1>
          <p>Premium Streetwear</p>
        </div>
        
        <div class="content">
          ${content}
        </div>
        
        <div class="footer">
          <p class="brand">TRIBU MALA STORE</p>
          <p>Gracias por elegirnos</p>
          <p class="text-xs text-muted" style="margin-top: 12px;">
            Este es un email automatico, por favor no respondas a este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// 1. ORDER CONFIRMATION EMAIL
interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    productName: string
    quantity: number
    productPrice: number
    total: number
    size?: string
    color?: string
  }>
  total: number
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export function generateOrderConfirmationEmail(data: OrderConfirmationData) {
  const { orderNumber, customerName, items, total, shippingAddress } = data
  
  const content = `
    <h2>Confirmacion de Compra</h2>
    
    <p>Hola <strong>${customerName}</strong>,</p>
    <p>Gracias por tu compra. Tu pago ha sido procesado exitosamente y estamos preparando tu pedido.</p>
    
    <div class="card-highlight">
      <h3>Pedido Confirmado</h3>
      <div class="grid grid-cols-2">
        <div>
          <p class="text-sm text-muted">Numero de Pedido</p>
          <p class="font-semibold">${orderNumber}</p>
        </div>
        <div>
          <p class="text-sm text-muted">Fecha</p>
          <p class="font-semibold">${new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h4>Productos Ordenados</h4>
      <div class="space-y-4">
        ${items.map(item => `
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">${item.productName}</div>
              <div class="text-sm text-muted">
                Cantidad: ${item.quantity}
                ${item.size ? ` • Talla: ${item.size}` : ''}
                ${item.color ? ` • Color: ${item.color}` : ''}
              </div>
            </div>
            <div class="font-semibold">${item.total.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="divider"></div>
      <div class="flex justify-between items-center">
        <div class="font-semibold">Total</div>
        <div class="font-semibold" style="font-size: 18px;">${total.toFixed(2)}</div>
      </div>
    </div>
    
    ${shippingAddress ? `
    <div class="card">
      <h4>Direccion de Envio</h4>
      <p class="text-sm">
        ${shippingAddress.street}<br>
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
      </p>
    </div>
    ` : ''}
    
    <div class="card">
      <h4>Proximos Pasos</h4>
      <p class="text-sm">Recibiras un email de confirmacion de envio con informacion de rastreo una vez que tu pedido sea despachado.</p>
      <p class="text-sm">Tiempo estimado de entrega: 3-5 dias habiles.</p>
    </div>
    
    <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
  `
  
  return getBaseTemplate(content)
}

// 2. WELCOME EMAIL
interface WelcomeEmailData {
  userName: string
  userEmail: string
}

export function generateWelcomeEmail(data: WelcomeEmailData) {
  const { userName } = data
  
  const content = `
    <h2>Bienvenido a Tribu Mala Store</h2>
    
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Bienvenido a Tribu Mala Store, tu destino para streetwear premium y moda urbana autentica.</p>
    
    <div class="card-highlight">
      <h3>Cuenta Creada Exitosamente</h3>
      <p class="text-sm">Tu cuenta ha sido creada y ya puedes empezar a explorar nuestros productos.</p>
    </div>
    
    <div class="card">
      <h4>Que puedes hacer ahora</h4>
      <div class="space-y-2">
        <p class="text-sm">• Explorar nuestro catalogo de productos premium</p>
        <p class="text-sm">• Agregar productos a tu carrito</p>
        <p class="text-sm">• Realizar compras seguras con Stripe</p>
        <p class="text-sm">• Seguir el estado de tus pedidos</p>
        <p class="text-sm">• Actualizar tu perfil y direcciones de envio</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_URL}" class="button">
        Empezar a Comprar
      </a>
    </div>
    
    <div class="card">
      <h4>Sobre Tribu Mala Store</h4>
      <p class="text-sm">Ofrecemos streetwear de alta calidad con diseños unicos y autenticos. Cada pieza esta cuidadosamente seleccionada para reflejar el estilo urbano contemporaneo.</p>
    </div>
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos. Estamos aqui para ayudarte.</p>
  `
  
  return getBaseTemplate(content)
}

// 3. PASSWORD RESET EMAIL
interface PasswordResetData {
  userName: string
  resetToken: string
  expirationTime: string
}

export function generatePasswordResetEmail(data: PasswordResetData) {
  const { userName, resetToken, expirationTime } = data
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password/${resetToken}`
  
  const content = `
    <h2>Restablecer Contraseña</h2>
    
    <p>Hola <strong>${userName}</strong>,</p>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Tribu Mala Store.</p>
    
    <div class="card-highlight">
      <h3>Solicitud de Cambio de Contraseña</h3>
      <p class="text-sm">Si tu solicitaste este cambio, haz clic en el boton de abajo para crear una nueva contraseña.</p>
      <p class="text-sm font-medium">Este enlace expira en: ${expirationTime}</p>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" class="button">
        Restablecer Contraseña
      </a>
    </div>
    
    <div class="card">
      <h4>Instrucciones de Seguridad</h4>
      <div class="space-y-2">
        <p class="text-sm">1. Haz clic en el boton "Restablecer Contraseña"</p>
        <p class="text-sm">2. Seras redirigido a una pagina segura</p>
        <p class="text-sm">3. Ingresa tu nueva contraseña</p>
        <p class="text-sm">4. Confirma los cambios</p>
      </div>
    </div>
    
    <div class="card-highlight">
      <h4>Importante</h4>
      <p class="text-sm">Si NO solicitaste este cambio de contraseña, ignora este email. Tu cuenta permanecera segura.</p>
      <p class="text-sm">Nunca compartas este enlace con nadie. Nuestro equipo nunca te pedira tu contraseña por email.</p>
    </div>
    
    <p>Si tienes problemas con el enlace, contactanos inmediatamente.</p>
  `
  
  return getBaseTemplate(content)
}

// Helper function to send specific emails
export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  return await sendEmail({
    to: data.customerEmail,
    subject: `Confirmacion de Pedido #${data.orderNumber} - Tribu Mala Store`,
    html: generateOrderConfirmationEmail(data)
  })
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  return await sendEmail({
    to: data.userEmail,
    subject: 'Bienvenido a Tribu Mala Store - Tu cuenta ha sido creada',
    html: generateWelcomeEmail(data)
  })
}

export async function sendPasswordResetEmail(data: PasswordResetData, email: string) {
  return await sendEmail({
    to: email,
    subject: 'Restablecer Contraseña - Tribu Mala Store',
    html: generatePasswordResetEmail(data)
  })
}

// 4. ORDER STATUS CHANGE EMAIL
interface OrderStatusChangeData {
  orderNumber: string
  customerName: string
  newStatus: string
  orderUrl?: string
  orderDetails?: {
    items: Array<{
      productName: string
      quantity: number
      productPrice: number
      total: number
      size?: string
      color?: string
    }>
    subtotal: number
    shippingCost: number
    tax: number
    total: number
    shippingAddress?: string
    shippingCity?: string
    shippingZip?: string
    shippingCountry?: string
  }
}

export function generateOrderStatusChangeEmail(data: OrderStatusChangeData) {
  const { orderNumber, customerName, newStatus, orderUrl, orderDetails } = data
  
  // Configuración de colores y textos por estado
  const statusConfig = {
    'CONFIRMED': {
      color: '#3b82f6', // blue
      bgColor: '#eff6ff',
      title: 'CONFIRMADO',
      message: 'Tu pedido ha sido confirmado y está siendo preparado.',
      nextStep: 'Tu pedido será enviado en las próximas 24-48 horas.'
    },
    'SHIPPED': {
      color: '#8b5cf6', // purple
      bgColor: '#f5f3ff',
      title: 'ENVIADO',
      message: 'Tu pedido está en camino.',
      nextStep: 'Recibirás tu pedido en 2-3 días hábiles.'
    },
    'DELIVERED': {
      color: '#10b981', // green
      bgColor: '#ecfdf5',
      title: 'ENTREGADO',
      message: 'Tu pedido ha sido entregado exitosamente.',
      nextStep: 'Esperamos que disfrutes tu compra. ¡Gracias por elegirnos!'
    },
    'CANCELLED': {
      color: '#ef4444', // red
      bgColor: '#fef2f2',
      title: 'CANCELADO',
      message: 'Tu pedido ha sido cancelado y los fondos han sido devueltos.',
      nextStep: 'Los fondos serán reintegrados a tu tarjeta en 3-5 días hábiles. Si tienes preguntas, contáctanos.'
    }
  }

  // Definir todos los estados para el timeline
  const allStatuses = [
    { key: 'CONFIRMED', title: 'CONFIRMADO', color: '#3b82f6' },
    { key: 'SHIPPED', title: 'ENVIADO', color: '#8b5cf6' },
    { key: 'DELIVERED', title: 'ENTREGADO', color: '#10b981' },
    { key: 'CANCELLED', title: 'CANCELADO', color: '#ef4444' }
  ]

  const config = statusConfig[newStatus as keyof typeof statusConfig] || statusConfig['CONFIRMED']
  
  // Generar timeline - siempre mostrar los 3 estados principales
  const generateTimeline = () => {
    // Solo mostrar los 3 estados principales del flujo normal
    const mainStatuses = allStatuses.filter(s => s.key !== 'CANCELLED')
    
    // Si está cancelado, mostrar flujo de cancelación
    if (newStatus === 'CANCELLED') {
      return `
        <div style="display: flex; align-items: center; margin: 12px 0; line-height: 1;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; margin-right: 12px; flex-shrink: 0;"></div>
          <span style="color: #000000; font-weight: normal; font-size: 14px; line-height: 14px;">CONFIRMADO</span>
        </div>
        <div style="display: flex; align-items: center; margin: 12px 0; line-height: 1;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: #ef4444; margin-right: 12px; flex-shrink: 0;"></div>
          <span style="color: #000000; font-weight: bold; font-size: 14px; line-height: 14px;">CANCELADO</span>
          <span style="color: #ef4444; font-weight: bold; margin-left: 8px; font-size: 12px; line-height: 12px;">(ESTADO ACTUAL)</span>
        </div>
      `
    }
    
    // Flujo normal - siempre mostrar los 3 estados
    const currentStatusIndex = mainStatuses.findIndex(s => s.key === newStatus)
    
    return mainStatuses.map((status, index) => {
      const isCompleted = index < currentStatusIndex
      const isCurrent = status.key === newStatus
      const isPending = index > currentStatusIndex
      
      let statusColor = '#cbd5e1' // pending color
      let textColor = '#64748b'   // pending text
      let fontWeight = 'normal'
      
      if (isCompleted) {
        statusColor = status.color
        textColor = '#000000'
        fontWeight = 'normal'
      } else if (isCurrent) {
        statusColor = status.color
        textColor = '#000000'
        fontWeight = 'bold'
      }
      
      return `
        <div style="display: flex; align-items: center; margin: 12px 0; line-height: 1;">
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${statusColor}; margin-right: 12px; flex-shrink: 0;"></div>
          <span style="color: ${textColor}; font-weight: ${fontWeight}; font-size: 14px; line-height: 14px;">${status.title}</span>
          ${isCurrent ? `<span style="color: ${status.color}; font-weight: bold; margin-left: 8px; font-size: 12px; line-height: 12px;">(ESTADO ACTUAL)</span>` : ''}
        </div>
      `
    }).join('')
  }
  
  const content = `
    <div style="background: ${config.bgColor}; border: 1px solid ${config.color}20; padding: 24px; border-radius: 8px; margin: 16px 0; text-align: center;">
      <h2 style="color: ${config.color}; margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">${config.title}</h2>
      <p style="color: #374151; margin: 0; font-size: 16px;">${config.message}</p>
    </div>
    
    <p>Hola <strong>${customerName}</strong>,</p>
    <p>Te informamos que el estado de tu pedido ha cambiado.</p>
    
    <div class="card">
      <h3>Detalles del Pedido</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Número de Pedido</p>
          <p style="font-weight: 600; margin: 0;">${orderNumber}</p>
        </div>
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Estado Actual</p>
          <p style="font-weight: 600; color: ${config.color}; margin: 0;">${config.title}</p>
        </div>
      </div>
      <div style="margin: 16px 0;">
        <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Fecha de Actualización</p>
        <p style="font-weight: 600; margin: 0;">${new Date().toLocaleDateString('es-MX', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    </div>
    
    ${orderDetails ? `
    <div class="card">
      <h4>Productos Comprados</h4>
      <div style="margin: 16px 0;">
        ${orderDetails.items.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <div style="flex: 1;">
              <p style="font-weight: 600; margin: 0 0 4px 0;">${item.productName}</p>
              <p style="font-size: 14px; color: #64748b; margin: 0;">
                Cantidad: ${item.quantity}
                ${item.size ? ` • Talla: ${item.size}` : ''}
                ${item.color ? ` • Color: ${item.color}` : ''}
              </p>
              <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">
                Precio unitario: $${item.productPrice.toFixed(2)}
              </p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 600; margin: 0;">$${item.total.toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
        
        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span>Subtotal:</span>
            <span>$${orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span>Envío:</span>
            <span>$${orderDetails.shippingCost.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span>Impuestos:</span>
            <span>$${orderDetails.tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #e2e8f0;">
            <span style="font-weight: bold; font-size: 18px;">Total:</span>
            <span style="font-weight: bold; font-size: 18px;">$${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
    
    ${orderDetails.shippingAddress ? `
    <div class="card">
      <h4>Dirección de Envío</h4>
      <div style="margin: 16px 0;">
        <p style="margin: 0; line-height: 1.5;">
          ${orderDetails.shippingAddress}<br>
          ${orderDetails.shippingCity}, ${orderDetails.shippingZip}<br>
          ${orderDetails.shippingCountry}
        </p>
      </div>
    </div>
    ` : ''}
    ` : ''}
    
    <div class="card">
      <h4>Progreso del Pedido</h4>
      <div style="margin: 16px 0;">
        ${generateTimeline()}
      </div>
    </div>
    
    <div class="card">
      <h4>Próximos Pasos</h4>
      <p style="font-size: 14px; margin: 8px 0;">${config.nextStep}</p>
      ${orderUrl ? `
        <div style="text-align: center; margin: 16px 0;">
          <a href="${orderUrl}" class="button">Ver Detalles del Pedido</a>
        </div>
      ` : ''}
    </div>
    
    <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
    
    <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 6px; border-left: 4px solid ${config.color};">
      <p style="margin: 0; font-size: 14px; color: #475569;">
        <strong>Información de contacto:</strong><br>
        Email: soporte@tribumala.com<br>
        Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM
      </p>
    </div>
  `
  
  return getBaseTemplate(content)
}

export async function sendOrderStatusChangeEmail(data: OrderStatusChangeData, email: string) {
  const statusTitles = {
    'CONFIRMED': 'Confirmado',
    'SHIPPED': 'Enviado',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado'
  }
  
  const statusTitle = statusTitles[data.newStatus as keyof typeof statusTitles] || data.newStatus
  
  return await sendEmail({
    to: email,
    subject: `Pedido ${statusTitle} #${data.orderNumber} - Tribu Mala Store`,
    html: generateOrderStatusChangeEmail(data)
  })
}

// 5. ADMIN NOTIFICATION EMAIL (Nueva funcionalidad)
interface AdminNotificationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    productName: string
    quantity: number
    productPrice: number
    total: number
    size?: string
    color?: string
  }>
  total: number
  shippingAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod?: string
  orderDate: string
}

export function generateAdminNotificationEmail(data: AdminNotificationData) {
  const { orderNumber, customerName, customerEmail, items, total, shippingAddress, paymentMethod, orderDate } = data
  
  const content = `
    <div style="background: #10b981; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 8px; margin: 16px 0; text-align: center;">
      <h2 style="color: white; margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">🎉 NUEVA VENTA CONFIRMADA</h2>
      <p style="color: white; margin: 0; font-size: 16px; opacity: 0.9;">¡Tienes un nuevo pedido pagado exitosamente!</p>
    </div>
    
    <div class="card-highlight">
      <h3>Resumen del Pedido</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Número de Pedido</p>
          <p style="font-weight: 600; margin: 0; color: #10b981;">${orderNumber}</p>
        </div>
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Total de la Venta</p>
          <p style="font-weight: 600; margin: 0; font-size: 18px; color: #10b981;">$${total.toFixed(2)}</p>
        </div>
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Fecha y Hora</p>
          <p style="font-weight: 600; margin: 0;">${orderDate}</p>
        </div>
        <div>
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Estado del Pago</p>
          <p style="font-weight: 600; margin: 0; color: #10b981;">✅ PAGADO</p>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h4>Información del Cliente</h4>
      <div style="margin: 16px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Nombre</p>
            <p style="font-weight: 600; margin: 0;">${customerName}</p>
          </div>
          <div>
            <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Email</p>
            <p style="font-weight: 600; margin: 0;">${customerEmail}</p>
          </div>
        </div>
        ${paymentMethod ? `
        <div style="margin-top: 12px;">
          <p style="font-size: 14px; color: #64748b; margin: 0 0 4px 0;">Método de Pago</p>
          <p style="font-weight: 600; margin: 0;">${paymentMethod}</p>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div class="card">
      <h4>Productos Vendidos</h4>
      <div style="margin: 16px 0;">
        ${items.map(item => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
            <div style="flex: 1;">
              <p style="font-weight: 600; margin: 0 0 4px 0;">${item.productName}</p>
              <p style="font-size: 14px; color: #64748b; margin: 0;">
                Cantidad: ${item.quantity}
                ${item.size ? ` • Talla: ${item.size}` : ''}
                ${item.color ? ` • Color: ${item.color}` : ''}
              </p>
              <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">
                Precio unitario: $${item.productPrice.toFixed(2)}
              </p>
            </div>
            <div style="text-align: right;">
              <p style="font-weight: 600; margin: 0; color: #10b981;">$${item.total.toFixed(2)}</p>
            </div>
          </div>
        `).join('')}
        
        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #10b981;">
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: bold; font-size: 20px;">TOTAL DE LA VENTA:</span>
            <span style="font-weight: bold; font-size: 20px; color: #10b981;">$${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
    
    ${shippingAddress ? `
    <div class="card">
      <h4>Dirección de Envío</h4>
      <div style="margin: 16px 0;">
        <p style="margin: 0; line-height: 1.5;">
          <strong>${customerName}</strong><br>
          ${shippingAddress.street}<br>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}
        </p>
      </div>
    </div>
    ` : ''}
    
    <div class="card-highlight">
      <h4>🚚 Próximos Pasos</h4>
      <div style="margin: 16px 0;">
        <p style="font-size: 14px; margin: 8px 0;">
          ✅ <strong>Paso 1:</strong> El pago ha sido procesado exitosamente por Stripe
        </p>
        <p style="font-size: 14px; margin: 8px 0;">
          📦 <strong>Paso 2:</strong> Preparar el pedido para envío
        </p>
        <p style="font-size: 14px; margin: 8px 0;">
          🏷️ <strong>Paso 3:</strong> Actualizar el estado a "SHIPPED" cuando sea enviado
        </p>
        <p style="font-size: 14px; margin: 8px 0;">
          📧 <strong>Paso 4:</strong> El cliente recibirá notificación automática de cada cambio
        </p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_URL}/admin/orders" class="button">
        Ver Pedido en Admin Panel
      </a>
    </div>
    
    <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 6px; border-left: 4px solid #10b981;">
      <p style="margin: 0; font-size: 14px; color: #065f46;">
        <strong>💰 Resumen Financiero:</strong><br>
        • Ingreso bruto: $${total.toFixed(2)}<br>
        • Comisión Stripe (~3%): $${(total * 0.03).toFixed(2)}<br>
        • Ingreso neto estimado: $${(total * 0.97).toFixed(2)}
      </p>
    </div>
  `
  
  return getBaseTemplate(content)
}

export async function sendAdminNotificationEmail(data: AdminNotificationData) {
  const adminEmail = 'fg.dev.desk@gmail.com'
  
  return await sendEmail({
    to: adminEmail,
    subject: `🎉 Nueva Venta: $${data.total.toFixed(2)} - Pedido #${data.orderNumber}`,
    html: generateAdminNotificationEmail(data)
  })
}