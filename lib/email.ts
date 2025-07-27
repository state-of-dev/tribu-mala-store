import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  console.log(`📧 Attempting to send email to: ${to}`)
  console.log(`📧 Subject: ${subject}`)
  console.log(`🔑 Resend API Key present: ${!!process.env.RESEND_API_KEY}`)
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Tribu Mala Store <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('❌ Resend API Error:', JSON.stringify(error, null, 2))
      return { success: false, error }
    }

    console.log('✅ Email sent successfully:', JSON.stringify(data, null, 2))
    return { success: true, data }
  } catch (error) {
    console.error('❌ Catch block error:', error)
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