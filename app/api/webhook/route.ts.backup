import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set")
}

if (!webhookSecret) {
  console.warn("STRIPE_WEBHOOK_SECRET not set - webhook verification will be skipped")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    if (!signature) {
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
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session

        // Here you would typically:
        // 1. Update your database with the order
        // 2. Send confirmation emails
        // 3. Update inventory
        console.log(`Payment successful for session: ${session.id}`)
        console.log(`Customer email: ${session.customer_details?.email}`)

        // Example: Update order status in your database
        // await db.order.update({
        //   where: { stripeSessionId: session.id },
        //   data: { status: 'paid' }
        // })

        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 })
  }
}
