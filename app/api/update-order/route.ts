import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { orderId, paymentStatus } = await request.json()
    
    console.log(`🔄 Manual update request for order: ${orderId}, status: ${paymentStatus}`)
    
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus || 'PAID',
        status: 'CONFIRMED'
      }
    })

    console.log(`✅ Order ${orderId} updated successfully`)

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
    console.error("❌ Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}