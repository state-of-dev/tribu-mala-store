import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")
  
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId parameter" }, { status: 400 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
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

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        stripeSessionId: order.stripeSessionId,
        total: order.total,
        customerEmail: order.customerEmail,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Ruta para actualizar manualmente el estado (solo para debugging)
export async function POST(request: Request) {
  try {
    const { orderId, status, paymentStatus } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      }
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus
      }
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}