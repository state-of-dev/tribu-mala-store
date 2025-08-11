import { NextResponse } from "next/server"
import type { CartItem } from "@/lib/types"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

// Validate that we have the required environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
})

interface CheckoutRequestBody {
  items: CartItem[]
  customerInfo: {
    name: string
    email: string
    address: string
    city: string
    zip: string
    country: string
  }
}

// Helper function to ensure URL has proper protocol
function ensureHttps(url: string): string {
  if (!url) return "http://localhost:3000" // Default to localhost for development

  // If URL doesn't start with http:// or https://, add http:// for local development
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`
  }

  return url
}

export async function POST(request: Request) {
  try {
    console.log("=== CREATE CHECKOUT API CALLED ===")
    
    // Check if Stripe is properly initialized
    if (!stripe) {
      console.error("Stripe not initialized - missing API key")
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    const body: CheckoutRequestBody = await request.json()
    const { items, customerInfo } = body

    // Validate request body
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    if (!customerInfo.email) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 })
    }

    // Get base URL with protocol - using localhost:3000 for development
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"

    console.log("Using base URL:", baseUrl) // Debug log
    console.log("Creating checkout session for:", customerInfo.email) // Debug log
    console.log("Items:", items.length) // Debug log

    // Generate unique order number
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderNumber = `SDM-${timestamp}-${random}`

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    console.log("Generated order number:", orderNumber)

    // Create or find user in database
    const user = await prisma.user.upsert({
      where: { email: customerInfo.email },
      update: {
        name: customerInfo.name,
      },
      create: {
        email: customerInfo.email,
        name: customerInfo.name,
      },
    })

    console.log("User found/created:", user.id)

    // Create metadata with order details for webhook processing
    const metadata = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_address: customerInfo.address,
      customer_city: customerInfo.city,
      customer_zip: customerInfo.zip,
      customer_country: customerInfo.country,
      items_count: items.length.toString(),
      items_data: JSON.stringify(items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image1: item.image1
      }))),
      order_number: orderNumber,
      user_id: user.id,
      total_amount: totalAmount.toString(),
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.name,
            images: [item.image1],
            metadata: { product_id: item.id.toString() },
          },
          unit_amount: Math.round(item.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: customerInfo.email,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX"], // Add countries you ship to
      },
    })

    console.log("Checkout session created:", session.id) // Debug log
    console.log("🔄 Order will be created by webhook after successful payment")

    return NextResponse.json({ 
      url: session.url,
      orderNumber,
      sessionId: session.id 
    })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)

    // Provide more specific error messages
    if (error.type === "StripeAuthenticationError") {
      return NextResponse.json({ error: "Stripe authentication failed - check API key" }, { status: 500 })
    }

    return NextResponse.json(
      {
        error: "Error creating checkout session",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
