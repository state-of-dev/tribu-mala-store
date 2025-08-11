export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 })
    }

    console.log("Verifying session:", sessionId) // Debug log

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log("Session status:", session.payment_status) // Debug log

    // Check if the payment was successful
    if (session.payment_status === "paid") {
      // Find the order in our database
      const order = await prisma.order.findUnique({
        where: { stripeSessionId: sessionId },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true
        }
      })

      if (!order) {
        // The webhook might not have processed yet, wait a moment and try again
        console.log("Order not found yet, webhook might still be processing...")
        return NextResponse.json({
          success: false,
          message: "Order is being processed, please wait...",
          status: "processing"
        })
      }

      return NextResponse.json({
        success: true,
        order: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment not completed",
        paymentStatus: session.payment_status,
      })
    }
  } catch (error: any) {
    console.error("Error verifying session:", error)

    if (error.type === "StripeAuthenticationError") {
      return NextResponse.json({ error: "Stripe authentication failed - check API key" }, { status: 500 })
    }

    return NextResponse.json(
      {
        error: "Error verifying session",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
