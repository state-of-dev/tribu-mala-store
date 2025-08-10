import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderStatusChangeEmail } from "@/lib/email"

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
    const validStatuses = ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']  // Incluye cancelado
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Check if order exists first
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, orderNumber: true }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log(`🔄 Updating order ${existingOrder.orderNumber} to status: ${status}`)

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        // Add timestamps for specific statuses
        ...(status === 'SHIPPED' && { shippedAt: new Date() }),
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() })
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

    // Send email notification for status change (don't let email errors fail the whole operation)
    const customerEmail = updatedOrder.customerEmail || updatedOrder.user?.email
    const customerName = updatedOrder.customerName || updatedOrder.user?.name || 'Cliente'

    let emailSent = false
    let emailError = null

    if (customerEmail) {
      try {
        console.log(`📧 Sending status change email to: ${customerEmail}`)
        console.log(`📧 Customer name: ${customerName}`)
        console.log(`📧 New status: ${status}`)
        
        const emailResult = await sendOrderStatusChangeEmail({
          orderNumber: updatedOrder.orderNumber,
          customerName: customerName,
          newStatus: status,
          orderUrl: `${process.env.NEXT_PUBLIC_URL}/orders/${updatedOrder.id}`,
          orderDetails: {
            items: updatedOrder.items.map(item => ({
              productName: item.productName,
              quantity: item.quantity,
              productPrice: item.productPrice,
              total: item.total,
              size: item.size || '',
              color: item.color || ''
            })),
            subtotal: updatedOrder.subtotal,
            shippingCost: updatedOrder.shippingCost,
            tax: updatedOrder.tax,
            total: updatedOrder.total,
            shippingAddress: updatedOrder.shippingAddress || '',
            shippingCity: updatedOrder.shippingCity || '',
            shippingZip: updatedOrder.shippingZip || '',
            shippingCountry: updatedOrder.shippingCountry || 'México'
          }
        }, customerEmail)

        if (emailResult.success) {
          console.log(`✅ Status change email sent successfully to: ${customerEmail}`)
          emailSent = true
        } else {
          console.error(`❌ Failed to send status change email:`, emailResult.error)
          emailError = emailResult.error
        }
      } catch (error) {
        console.error(`❌ Error sending status change email:`, error)
        emailError = error instanceof Error ? error.message : 'Unknown email error'
      }
    } else {
      console.log(`⚠️ No customer email found for order: ${updatedOrder.orderNumber}`)
      emailError = 'No customer email found'
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        shippedAt: updatedOrder.shippedAt,
        deliveredAt: updatedOrder.deliveredAt,
        cancelledAt: updatedOrder.cancelledAt
      },
      email: {
        sent: emailSent,
        error: emailError,
        recipient: customerEmail
      }
    })

  } catch (error) {
    console.error('❌ Error updating order status:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      orderId: params.id
    })
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}