export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de orden requerido" },
        { status: 400 }
      )
    }

    console.log("🔍 Buscando orden:", id)

    // Determinar si es ID (CUID) o orderNumber (SDM-*)
    const isOrderNumber = id.startsWith('SDM-')
    
    let whereClause: any = {}
    
    if (isOrderNumber) {
      // Si es orderNumber, buscar por orderNumber (acceso público para éxito de pago)
      whereClause = { orderNumber: id }
    } else {
      // Si es ID, requiere autenticación y verificar que pertenezca al usuario
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        )
      }
      whereClause = { 
        id: id,
        userId: session.user.id 
      }
    }

    // Buscar la orden
    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image1: true
              }
            }
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
        { success: false, error: "Orden no encontrada o no autorizada" },
        { status: 404 }
      )
    }

    console.log("✅ Orden encontrada:", {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      accessType: isOrderNumber ? 'orderNumber' : 'userID'
    })

    // Formatear la orden para el frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      createdAt: order.createdAt.toISOString(),
      shippedAt: order.shippedAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString(),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        productPrice: item.productPrice,
        total: item.total,
        size: item.size,
        color: item.color
      })),
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingZip: order.shippingZip,
      shippingCountry: order.shippingCountry,
      stripeSessionId: order.stripeSessionId,
      customerNotes: order.customerNotes
    }

    return NextResponse.json({
      success: true,
      order: formattedOrder
    })

  } catch (error) {
    console.error("❌ Error obteniendo orden:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}