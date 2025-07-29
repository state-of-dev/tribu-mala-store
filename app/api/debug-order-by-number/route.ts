import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get("orderNumber")
  
  if (!orderNumber) {
    return NextResponse.json({ error: "Missing orderNumber parameter" }, { status: 400 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber },
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
    console.error("Error fetching order by number:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}