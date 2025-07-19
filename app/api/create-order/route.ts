import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

interface CreateOrderRequest {
  // Información personal
  email: string
  name: string
  phone: string
  
  // Dirección de envío
  address: string
  city: string
  state: string
  zip: string
  country: string
  
  // Notas adicionales
  notes: string
  
  // Items del carrito
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image1: string
  }>
  
  total: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body: CreateOrderRequest = await request.json()

    console.log("🛒 Creando orden:", { 
      user: session?.user?.email, 
      total: body.total,
      itemCount: body.items.length 
    })

    // Validar datos requeridos
    if (!body.email || !body.name || !body.address || !body.city || !body.state || !body.zip) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      )
    }

    // Generar número de orden único
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const orderNumber = `SDM-${timestamp}-${randomNum}`

    // Calcular totales
    const subtotal = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = 0 // Envío gratis por ahora
    const tax = 0
    const total = subtotal + shippingCost + tax

    // Verificar que el total coincida
    if (Math.abs(total - body.total) > 0.01) {
      return NextResponse.json(
        { error: "Error en el cálculo del total" },
        { status: 400 }
      )
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: 'mxn',
      metadata: {
        orderNumber,
        customerEmail: body.email,
        customerName: body.name,
      },
    })

    console.log("💳 Payment Intent creado:", paymentIntent.id)

    // Crear la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        orderNumber,
        // Conectar usuario si está autenticado
        ...(session?.user?.id && {
          user: {
            connect: { id: session.user.id }
          }
        }),
        // Información del cliente
        customerName: body.name,
        customerEmail: body.email,
        // Dirección de envío
        shippingAddress: body.address,
        shippingCity: body.city,
        shippingZip: body.zip,
        shippingCountry: body.country,
        // Totales
        subtotal,
        shippingCost,
        tax,
        total,
        // Payment info
        stripePaymentId: paymentIntent.id,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        // Notas
        customerNotes: body.notes || undefined,
        // Items
        items: {
          create: body.items.map(item => ({
            product: {
              connect: { id: item.id }
            },
            productName: item.name,
            productPrice: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })

    console.log("✅ Orden creada en DB:", order.orderNumber)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total
      },
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret
      }
    })

  } catch (error) {
    console.error("❌ Error creando orden:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}