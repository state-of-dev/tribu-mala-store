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
          console.log(`Creating order for successful payment: ${session.id}`)
          
          // Check if order already exists to prevent duplicates
          const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: session.id }
          })
          
          if (existingOrder) {
            console.log(`Order already exists: ${existingOrder.orderNumber}`)
            return NextResponse.json({ received: true })
          }

          // Extract data from session metadata
          const orderNumber = session.metadata?.order_number
          const userId = session.metadata?.user_id
          const customerName = session.metadata?.customer_name
          const customerEmail = session.metadata?.customer_email
          const customerAddress = session.metadata?.customer_address
          const customerCity = session.metadata?.customer_city
          const customerZip = session.metadata?.customer_zip
          const customerCountry = session.metadata?.customer_country
          const totalAmount = parseFloat(session.metadata?.total_amount || '0')
          const itemsData = JSON.parse(session.metadata?.items_data || '[]')

          if (!orderNumber || !customerEmail || itemsData.length === 0) {
            console.error(`Missing required metadata in session ${session.id}`)
            return NextResponse.json({ error: "Invalid session metadata" }, { status: 400 })
          }

          console.log(`Creating new order: ${orderNumber}`)

          // Create the order in database only after successful payment
          const newOrder = await prisma.order.create({
            data: {
              orderNumber,
              ...(userId && {
                user: {
                  connect: { id: userId }
                }
              }),
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              subtotal: totalAmount,
              shippingCost: 0,
              tax: 0,
              total: totalAmount,
              stripeSessionId: session.id,
              customerName,
              customerEmail,
              shippingAddress: customerAddress,
              shippingCity: customerCity,
              shippingZip: customerZip,
              shippingCountry: customerCountry,
              items: {
                create: itemsData.map((item: any) => ({
                  productId: item.id,
                  productName: item.name,
                  productPrice: item.price,
                  quantity: item.quantity,
                  total: item.price * item.quantity,
                }))
              }
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

          const updatedOrder = newOrder
          
          console.log(`Order ${updatedOrder.orderNumber} updated to PAID status`)
          
          // Send confirmation email using order data
          const orderCustomerEmail = updatedOrder.customerEmail || updatedOrder.user?.email
          const orderCustomerName = updatedOrder.customerName || updatedOrder.user?.name || 'Cliente'
          
          console.log(`Sending emails for order: ${updatedOrder.orderNumber}`)
          
          if (orderCustomerEmail) {
            // Preparar datos comunes para ambos emails
            const emailData = {
              orderNumber: updatedOrder.orderNumber,
              customerName: orderCustomerName,
              customerEmail: orderCustomerEmail,
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
              console.log(`Sending confirmation email to customer: ${orderCustomerEmail}`)
              const customerEmailResult = await sendOrderConfirmationEmail(emailData)
              
              if (customerEmailResult.success) {
                console.log(`Confirmation email sent successfully to customer: ${orderCustomerEmail}`)
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