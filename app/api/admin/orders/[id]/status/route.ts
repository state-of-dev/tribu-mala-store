import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: "Missing status" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        // Add timestamps for specific statuses
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() })
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    console.log(`✅ Order ${updatedOrder.orderNumber} status updated to ${status}`)

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        shippedAt: updatedOrder.shippedAt,
        deliveredAt: updatedOrder.deliveredAt
      }
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}