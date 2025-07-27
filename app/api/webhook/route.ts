import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { sendOrderConfirmationEmail } from "@/lib/email"

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
  console.log("🔔 Webhook received at:", new Date().toISOString())
  
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    console.log("📝 Body length:", body.length)
    console.log("🔐 Signature present:", !!signature)

    if (!signature) {
      console.error("❌ Missing stripe-signature header")
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    if (!webhookSecret) {
      console.log("⚠️ Webhook secret not configured - skipping signature verification")
      return NextResponse.json({ received: true })
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("✅ Webhook signature verified successfully")
      console.log("📧 Event type:", event.type)
      console.log("🆔 Event id:", event.id)
    } catch (err: any) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log(`🎉 Payment successful for session: ${session.id}`)
        console.log(`📧 Customer email: ${session.customer_details?.email}`)
        
        try {
          console.log(`🔍 Looking for order with session ID: ${session.id}`)
          
          // First check if order exists
          const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: session.id }
          })
          
          if (!existingOrder) {
            console.error(`❌ No order found with session ID: ${session.id}`)
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
          }
          
          console.log(`📦 Found order: ${existingOrder.orderNumber}`)
          
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
          
          console.log(`✅ Order ${updatedOrder.orderNumber} updated to PAID status`)
          
          // Send confirmation email
          await sendOrderConfirmationEmail({
            orderNumber: updatedOrder.orderNumber,
            customerName: updatedOrder.user.name || 'Cliente',
            customerEmail: updatedOrder.user.email,
            items: updatedOrder.items.map(item => ({
              productName: item.product.name,
              quantity: item.quantity,
              productPrice: item.product.price,
              total: item.quantity * item.product.price
            })),
            total: updatedOrder.total,
            shippingAddress: updatedOrder.shippingAddress ? {
              street: updatedOrder.shippingAddress,
              city: 'Madrid',
              state: 'Madrid', 
              zipCode: '28001'
            } : undefined
          })
          
          console.log(`📧 Confirmation email sent to ${updatedOrder.user.email}`)
          
        } catch (error) {
          console.error(`❌ Error updating order for session ${session.id}:`, error)
        }
        
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`💳 PaymentIntent succeeded: ${paymentIntent.id}`)
        console.log(`💰 Amount: ${paymentIntent.amount} ${paymentIntent.currency}`)
        
        // Get order number from metadata
        const orderNumber = paymentIntent.metadata?.orderNumber
        if (orderNumber) {
          console.log(`📦 Looking for order: ${orderNumber}`)
          
          try {
            const updatedOrder = await prisma.order.update({
              where: { orderNumber: orderNumber },
              data: { 
                paymentStatus: 'PAID'
              }
            })
            
            console.log(`✅ Order ${orderNumber} payment status updated to PAID`)
          } catch (error) {
            console.error(`❌ Error updating payment status for order ${orderNumber}:`, error)
          }
        } else {
          console.log(`⚠️ No orderNumber found in PaymentIntent metadata`)
        }
        break

      default:
        console.log(`🔄 Unhandled event type ${event.type}`)
        console.log(`📄 Event data:`, JSON.stringify(event.data.object, null, 2))
    }

    console.log("✅ Webhook processed successfully")
    return NextResponse.json({ received: true, eventType: event.type })
  } catch (error) {
    console.error("❌ Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}