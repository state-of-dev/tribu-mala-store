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

    // Create a Stripe checkout session with advanced options
    const session = await stripe.checkout.sessions.create({
      // 1. MÉTODOS DE PAGO - Solo métodos soportados en México
      payment_method_types: [
        "card",           // Tarjetas de crédito/débito
        "oxxo",          // OXXO (México)
      ],

      // 2. PRODUCTOS CON INFORMACIÓN COMPLETA
      line_items: items.map((item) => ({
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.name,
            description: `Producto de alta calidad - ${item.name}`, // Descripción
            images: [item.image1],
            metadata: { 
              product_id: item.id.toString(),
              category: "streetwear", // Categoría
              brand: "Tribu Mala"     // Marca
            },
          },
          unit_amount: Math.round(item.price * 100),
          tax_behavior: "inclusive", // IVA incluido
        },
        quantity: item.quantity,
      })),

      // 3. CONFIGURACIÓN BÁSICA
      mode: "payment",
      
      // 4. URLs DE REDIRECCIÓN MEJORADAS
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,

      // 5. INFORMACIÓN DEL CLIENTE
      customer_email: customerInfo.email,
      customer_creation: "always", // Crear cliente en Stripe siempre
      
      // 6. RECOLECCIÓN DE DIRECCIONES
      shipping_address_collection: {
        allowed_countries: [
          "MX", // México
          "US", // Estados Unidos  
          "CA", // Canadá
          "ES", // España
          "AR", // Argentina
          "CO", // Colombia
          "PE", // Perú
          "CL", // Chile
        ],
      },
      billing_address_collection: "required", // Requerir dirección de facturación
      
      // 7. CONFIGURACIÓN DE ENVÍO
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0, // Envío gratis
              currency: "mxn",
            },
            display_name: "Envío Gratuito",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day", 
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 15000, // $150 MXN express
              currency: "mxn",
            },
            display_name: "Envío Express",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],

      // 8. CONFIGURACIONES AVANZADAS DE UX
      allow_promotion_codes: true, // Permitir códigos de descuento
      automatic_tax: {
        enabled: false, // Desactivar cálculo automático de impuestos
      },
      payment_intent_data: {
        capture_method: "automatic", // Capturar pago inmediatamente
        // setup_future_usage: "on_session", // ❌ No compatible con OXXO - removido
        statement_descriptor: "TRIBU MALA STORE", // Aparece en estado de cuenta
        statement_descriptor_suffix: orderNumber.slice(-8), // Sufijo con número de orden
      },

      // 9. CONFIGURACIÓN DE IDIOMA Y REGIÓN  
      locale: "es", // Español

      // 10. PERSONALIZACIÓN VISUAL
      custom_text: {
        shipping_address: {
          message: "🚚 Selecciona donde quieres recibir tu pedido"
        },
        submit: {
          message: "🔒 Pago 100% seguro con cifrado SSL"
        },
      },

      // 11. CONFIGURACIÓN DE EXPIRACIÓN
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutos

      // 12. METADATOS EXTENDIDOS
      metadata: {
        ...metadata,
        store_name: "Tribu Mala Store",
        order_type: "online_purchase",
        checkout_version: "v2.0",
        customer_country: customerInfo.country,
        items_total: items.length.toString(),
      },

      // 13. CONFIGURACIÓN ADICIONAL DE EXPERIENCIA
      // consent_collection: {
      //   terms_of_service: "required", // Requiere configurar URL de términos en Stripe Dashboard
      // },
      
      // 14. CONFIGURACIÓN DE MÉTODOS DE PAGO POR PAÍS
      payment_method_configuration: undefined, // Usar configuración por defecto optimizada
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
