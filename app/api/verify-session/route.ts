import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
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
      // Here you would typically:
      // 1. Update your database with the order status
      // 2. Return order details to the client

      return NextResponse.json({
        success: true,
        orderId: session.id,
        customerEmail: session.customer_details?.email,
        paymentStatus: session.payment_status,
        shippingDetails: session.shipping_details,
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
