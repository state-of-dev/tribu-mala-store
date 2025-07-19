import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Número de orden requerido" },
        { status: 400 }
      )
    }

    console.log("🔍 Buscando orden:", orderNumber)

    // Buscar la orden en la base de datos
    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Orden no encontrada" },
        { status: 404 }
      )
    }

    console.log("✅ Orden encontrada:", {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          id: item.id,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
          total: item.total,
          product: item.product
        })),
        user: order.user
      }
    })

  } catch (error) {
    console.error("❌ Error obteniendo orden:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}