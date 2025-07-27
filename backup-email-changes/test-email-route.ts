import { NextRequest, NextResponse } from 'next/server'
import { 
  sendEmail, 
  generateOrderConfirmationEmail, 
  generateWelcomeEmail, 
  generatePasswordResetEmail 
} from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const template = searchParams.get('template') || 'all'
    
    const results = []
    
    // 1. ORDER CONFIRMATION EMAIL
    if (template === 'order' || template === 'all') {
      const orderData = {
        orderNumber: 'ORD-2025-001',
        customerName: 'Francisco Garcia',
        customerEmail: 'fg.dev.desk@gmail.com',
        items: [
          {
            productName: 'Hoodie Premium Black',
            quantity: 2,
            productPrice: 79.99,
            total: 159.98,
            size: 'L',
            color: 'Negro'
          },
          {
            productName: 'Camiseta Oversized White',
            quantity: 1,
            productPrice: 45.00,
            total: 45.00,
            size: 'M'
          }
        ],
        total: 204.98,
        shippingAddress: {
          street: 'Calle Principal 123',
          city: 'Madrid',
          state: 'Madrid',
          zipCode: '28001'
        }
      }
      
      const orderResult = await sendEmail({
        to: 'fg.dev.desk@gmail.com',
        subject: 'TEST: Confirmacion de Pedido #ORD-2025-001 - Tribu Mala Store',
        html: generateOrderConfirmationEmail(orderData)
      })
      
      console.log('📧 ORDER email sent:', orderResult)
      
      results.push({ type: 'order_confirmation', result: orderResult })
    }
    
    // 2. WELCOME EMAIL
    if (template === 'welcome' || template === 'all') {
      const welcomeData = {
        userName: 'Francisco Garcia',
        userEmail: 'fg.dev.desk@gmail.com'
      }
      
      const welcomeResult = await sendEmail({
        to: 'fg.dev.desk@gmail.com',
        subject: 'TEST: Bienvenido a Tribu Mala Store - Tu cuenta ha sido creada',
        html: generateWelcomeEmail(welcomeData)
      })
      
      console.log('📧 WELCOME email sent:', welcomeResult)
      
      results.push({ type: 'welcome', result: welcomeResult })
    }
    
    // 3. PASSWORD RESET EMAIL
    if (template === 'reset' || template === 'all') {
      const resetData = {
        userName: 'Francisco Garcia',
        resetToken: 'abc123-def456-ghi789-sample-token',
        expirationTime: '15 minutos'
      }
      
      const resetResult = await sendEmail({
        to: 'fg.dev.desk@gmail.com',
        subject: 'TEST: Restablecer Contraseña - Tribu Mala Store',
        html: generatePasswordResetEmail(resetData)
      })
      
      console.log('📧 RESET email sent:', resetResult)
      
      results.push({ type: 'password_reset', result: resetResult })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Emails de prueba enviados: ${template}`,
      results,
      usage: {
        'order': 'POST /api/test-email?template=order',
        'welcome': 'POST /api/test-email?template=welcome', 
        'reset': 'POST /api/test-email?template=reset',
        'all': 'POST /api/test-email?template=all (default)'
      }
    })

  } catch (error) {
    console.error('Error al enviar emails de prueba:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar emails' },
      { status: 500 }
    )
  }
}