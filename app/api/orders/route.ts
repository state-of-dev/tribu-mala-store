import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    console.log("🔍 Obteniendo órdenes para usuario:", session.user.email)

    // Obtener órdenes del usuario autenticado
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Encontradas ${orders.length} órdenes`)

    // Formatear las órdenes para el frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
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
      shippingCountry: order.shippingCountry
    }))

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
      count: formattedOrders.length
    })

  } catch (error) {
    console.error("❌ Error obteniendo órdenes:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}