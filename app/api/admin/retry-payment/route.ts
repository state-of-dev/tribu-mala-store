import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Create new Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      customer_email: order.customerEmail,
      metadata: {
        orderNumber: order.orderNumber,
        customerName: order.customerName || '',
        customerEmail: order.customerEmail,
        originalOrderId: orderId
      }
    })

    // Update order with new session ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
        paymentStatus: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url
    })

  } catch (error) {
    console.error('Error creating retry payment session:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}