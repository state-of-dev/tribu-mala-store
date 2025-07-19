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
  apiVersion: "2024-11-20.acacia",
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
      items_count: items.length.toString(),
      order_number: orderNumber,
      user_id: user.id,
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
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

    // Create pending order in database with correct field names
    const order = await prisma.order.create({
      data: {
        orderNumber,
        user: {
          connect: { id: user.id }
        },
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal: totalAmount,
        shippingCost: 0,
        tax: 0,
        total: totalAmount,
        stripeSessionId: session.id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        shippingAddress: customerInfo.address,
        shippingCity: customerInfo.city,
        shippingZip: customerInfo.zip,
        shippingCountry: customerInfo.country,
        items: {
          create: items.map(item => ({
            productId: item.id,
            productName: item.name,
            productPrice: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          }))
        }
      },
      include: {
        items: true
      }
    })

    console.log("✅ Order created in database:", order.id, "Number:", orderNumber)

    return NextResponse.json({ 
      url: session.url,
      orderNumber,
      orderId: order.id 
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
