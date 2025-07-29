import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("🔍 Debug: Testing database connection...")
    
    // Test database connection
    const orderCount = await prisma.order.count()
    console.log(`📊 Found ${orderCount} orders in database`)
    
    // Test specific order
    const testOrderId = "cmdm7kf280001lf044p4wd479"
    const testOrder = await prisma.order.findUnique({
      where: { id: testOrderId },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    console.log(`🔍 Test order found:`, !!testOrder)
    if (testOrder) {
      console.log(`📄 Order details:`, {
        id: testOrder.id,
        orderNumber: testOrder.orderNumber,
        status: testOrder.status,
        customerEmail: testOrder.customerEmail,
        userEmail: testOrder.user?.email,
        itemsCount: testOrder.items.length
      })
    }
    
    // Test environment variables
    const envCheck = {
      NEXT_PUBLIC_URL: !!process.env.NEXT_PUBLIC_URL,
      GMAIL_USER: !!process.env.GMAIL_USER,
      GMAIL_APP_PASSWORD: !!process.env.GMAIL_APP_PASSWORD,
      DATABASE_URL: !!process.env.DATABASE_URL
    }
    
    console.log(`🔑 Environment variables:`, envCheck)
    
    return NextResponse.json({
      success: true,
      debug: {
        orderCount,
        testOrderExists: !!testOrder,
        testOrderDetails: testOrder ? {
          id: testOrder.id,
          orderNumber: testOrder.orderNumber,
          status: testOrder.status,
          customerEmail: testOrder.customerEmail,
          userEmail: testOrder.user?.email,
          itemsCount: testOrder.items.length
        } : null,
        environment: envCheck,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error("❌ Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { orderId, newStatus } = await request.json()
    
    console.log(`🧪 Debug: Testing status update for order ${orderId} to ${newStatus}`)
    
    // Test finding the order
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
      return NextResponse.json({
        success: false,
        error: "Order not found",
        orderId
      }, { status: 404 })
    }
    
    console.log(`✅ Order found: ${order.orderNumber}`)
    
    // Test the update (dry run)
    const updateData = {
      status: newStatus,
      ...(newStatus === 'SHIPPED' && { shippedAt: new Date() }),
      ...(newStatus === 'DELIVERED' && { deliveredAt: new Date() })
    }
    
    console.log(`📝 Would update with:`, updateData)
    
    // Actually perform the update
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    
    console.log(`✅ Order updated successfully to: ${updatedOrder.status}`)
    
    return NextResponse.json({
      success: true,
      debug: {
        orderId,
        oldStatus: order.status,
        newStatus: updatedOrder.status,
        updateData,
        orderNumber: updatedOrder.orderNumber,
        customerEmail: updatedOrder.customerEmail,
        userEmail: updatedOrder.user?.email,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error("❌ Debug update error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}