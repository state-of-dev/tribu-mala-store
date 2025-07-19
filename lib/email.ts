import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SDFM 2520 <noreply@resend.dev>', // Usar dominio de Resend por ahora
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('❌ Error sending email:', error)
      return { success: false, error }
    }

    console.log('✅ Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error }
  }
}

interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  items: Array<{
    productName: string
    quantity: number
    productPrice: number
    total: number
    size?: string
    color?: string
  }>
  total: number
}

export function generateOrderConfirmationEmail(data: OrderConfirmationData) {
  const { orderNumber, customerName, items, total } = data
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Pedido - SDFM 2520</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 0; 
          background-color: #f8f9fa;
        }
        .container { background: #ffffff; margin: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); 
          color: #ffffff; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .order-info { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 20px 0; 
          border-left: 4px solid #000000;
        }
        .order-info h3 { margin: 0 0 15px 0; color: #333; font-size: 18px; }
        .order-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .meta-item { }
        .meta-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .meta-value { font-weight: 600; color: #333; font-size: 14px; }
        .items-section { margin: 25px 0; }
        .items-section h4 { color: #333; margin: 0 0 15px 0; font-size: 16px; }
        .item { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          padding: 15px 0; 
          border-bottom: 1px solid #e9ecef; 
        }
        .item:last-child { border-bottom: none; }
        .item-details { flex: 1; }
        .item-name { font-weight: 600; color: #333; margin-bottom: 4px; }
        .item-specs { font-size: 13px; color: #666; }
        .item-price { font-weight: 600; color: #333; text-align: right; }
        .total-section { 
          background: #000000; 
          color: #ffffff; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 25px 0; 
          text-align: center;
        }
        .total-label { font-size: 14px; margin-bottom: 5px; opacity: 0.8; }
        .total-amount { font-size: 24px; font-weight: 700; }
        .next-steps { 
          background: #e3f2fd; 
          padding: 20px; 
          border-radius: 6px; 
          margin: 25px 0; 
          border-left: 4px solid #2196f3;
        }
        .next-steps h4 { margin: 0 0 10px 0; color: #1976d2; }
        .footer { 
          text-align: center; 
          padding: 30px; 
          color: #666; 
          background: #f8f9fa; 
          border-top: 1px solid #e9ecef;
        }
        .footer p { margin: 5px 0; }
        .brand { font-weight: 700; color: #000; }
        @media (max-width: 600px) {
          .container { margin: 10px; }
          .content { padding: 20px; }
          .order-meta { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SDFM 2520</h1>
          <p>Confirmación de Pedido</p>
        </div>
        
        <div class="content">
          <p>Hola <strong>${customerName}</strong>,</p>
          <p>¡Gracias por tu pedido! Tu pago ha sido procesado exitosamente y estamos preparando tu orden para el envío.</p>
          
          <div class="order-info">
            <h3>Detalles del Pedido</h3>
            <div class="order-meta">
              <div class="meta-item">
                <div class="meta-label">Número de Pedido</div>
                <div class="meta-value">${orderNumber}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Fecha del Pedido</div>
                <div class="meta-value">${new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</div>
              </div>
            </div>
          </div>
          
          <div class="items-section">
            <h4>Productos Ordenados:</h4>
            ${items.map(item => `
              <div class="item">
                <div class="item-details">
                  <div class="item-name">${item.productName}</div>
                  <div class="item-specs">
                    Cantidad: ${item.quantity}
                    ${item.size ? ` • Talla: ${item.size}` : ''}
                    ${item.color ? ` • Color: ${item.color}` : ''}
                  </div>
                </div>
                <div class="item-price">$${item.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="total-section">
            <div class="total-label">Total del Pedido</div>
            <div class="total-amount">$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          </div>
          
          <div class="next-steps">
            <h4>🚚 Próximos Pasos</h4>
            <p>Recibirás un email de confirmación de envío con información de rastreo una vez que tu pedido sea despachado.</p>
            <p>El tiempo estimado de entrega es de 3-5 días hábiles.</p>
          </div>
          
          <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        </div>
        
        <div class="footer">
          <p class="brand">SDFM 2520 Premium Streetwear</p>
          <p>¡Gracias por elegirnos!</p>
          <p style="font-size: 12px; margin-top: 15px;">
            Este es un email automático, por favor no respondas a este mensaje.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}