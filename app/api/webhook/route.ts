import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set")
}

if (!webhookSecret) {
  console.warn("STRIPE_WEBHOOK_SECRET not set - webhook verification will be skipped")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
})

export async function POST(request: Request) {
  console.log("Webhook received at:", new Date().toISOString())
  
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    console.log("Body length:", body.length)
    console.log("Signature present:", !!signature)

    if (!signature) {
      console.error("Missing stripe-signature header")
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    if (!webhookSecret) {
      console.log("Webhook secret not configured - skipping signature verification")
      return NextResponse.json({ received: true })
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("Webhook signature verified successfully")
      console.log("Event type:", event.type)
      console.log("Event id:", event.id)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log(`Payment successful for session: ${session.id}`)
        console.log(`Customer email: ${session.customer_details?.email}`)
        console.log(`Session data:`, JSON.stringify(session, null, 2))
        
        try {
          console.log(`Looking for order with session ID: ${session.id}`)
          
          // First check if order exists
          const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: session.id }
          })
          
          if (!existingOrder) {
            console.error(`No order found with session ID: ${session.id}`)
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
          }
          
          console.log(`Found order: ${existingOrder.orderNumber}`)
          console.log(`Order customer email: ${existingOrder.customerEmail}`)
          
          // Update order status to PAID
          const updatedOrder = await prisma.order.update({
            where: { stripeSessionId: session.id },
            data: { 
              status: 'CONFIRMED',
              paymentStatus: 'PAID'
            },
            include: {
              user: true,
              items: {
                include: {
                  product: true
                }
              }
            }
          })
          
          console.log(`Order ${updatedOrder.orderNumber} updated to PAID status`)
          
          // Send confirmation email using order data
          const customerEmail = updatedOrder.customerEmail || updatedOrder.user?.email
          const customerName = updatedOrder.customerName || updatedOrder.user?.name || 'Cliente'
          
          console.log(`Sending emails for order: ${updatedOrder.orderNumber}`)
          
          if (customerEmail) {
            // Preparar datos comunes para ambos emails
            const emailData = {
              orderNumber: updatedOrder.orderNumber,
              customerName: customerName,
              customerEmail: customerEmail,
              items: updatedOrder.items.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                productPrice: item.product.price,
                total: item.quantity * item.product.price
              })),
              total: updatedOrder.total,
              shippingAddress: updatedOrder.shippingAddress ? {
                street: updatedOrder.shippingAddress,
                city: updatedOrder.shippingCity,
                state: updatedOrder.shippingCountry, 
                zipCode: updatedOrder.shippingZip
              } : undefined
            }
            
            // 1. Enviar email de confirmación al cliente
            try {
              console.log(`Sending confirmation email to customer: ${customerEmail}`)
              const customerEmailResult = await sendOrderConfirmationEmail(emailData)
              
              if (customerEmailResult.success) {
                console.log(`Confirmation email sent successfully to customer: ${customerEmail}`)
              } else {
                console.error(`Failed to send confirmation email to customer:`, customerEmailResult.error)
              }
            } catch (emailError) {
              console.error(`Error sending confirmation email to customer:`, emailError)
            }
            
            // 2. Enviar email de notificación al admin
            try {
              console.log(`Sending admin notification email to: fg.dev.desk@gmail.com`)
              const adminEmailResult = await sendAdminNotificationEmail({
                ...emailData,
                orderDate: new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Mexico_City'
                }),
                paymentMethod: 'Stripe (Tarjeta de crédito/débito)'
              })
              
              if (adminEmailResult.success) {
                console.log(`Admin notification email sent successfully to: fg.dev.desk@gmail.com`)
              } else {
                console.error(`Failed to send admin notification email:`, adminEmailResult.error)
              }
            } catch (emailError) {
              console.error(`Error sending admin notification email:`, emailError)
            }
          } else {
            console.error(`No customer email found for order: ${updatedOrder.orderNumber}`)
          }
          
        } catch (error) {
          console.error(`Error updating order for session ${session.id}:`, error)
        }
        
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
        console.log(`Amount: ${paymentIntent.amount} ${paymentIntent.currency}`)
        
        // Get order number from metadata
        const orderNumber = paymentIntent.metadata?.orderNumber
        if (orderNumber) {
          console.log(`Looking for order: ${orderNumber}`)
          
          try {
            const updatedOrder = await prisma.order.update({
              where: { orderNumber: orderNumber },
              data: { 
                paymentStatus: 'PAID'
              }
            })
            
            console.log(`Order ${orderNumber} payment status updated to PAID`)
          } catch (error) {
            console.error(`Error updating payment status for order ${orderNumber}:`, error)
          }
        } else {
          console.log(`No orderNumber found in PaymentIntent metadata`)
        }
        break

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`)
        
        // Get order number from metadata
        const failedOrderNumber = failedPaymentIntent.metadata?.orderNumber
        if (failedOrderNumber) {
          console.log(`Marking order as failed: ${failedOrderNumber}`)
          
          try {
            await prisma.order.update({
              where: { orderNumber: failedOrderNumber },
              data: { 
                paymentStatus: 'FAILED'
              }
            })
            
            console.log(`Order ${failedOrderNumber} payment status updated to FAILED`)
          } catch (error) {
            console.error(`Error updating failed payment status for order ${failedOrderNumber}:`, error)
          }
        }
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
        console.log(`Event data:`, JSON.stringify(event.data.object, null, 2))
    }

    console.log("Webhook processed successfully")
    return NextResponse.json({ received: true, eventType: event.type })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}