import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: "Sin permisos de administrador" }, { status: 403 })
    }

    // Obtener fechas para métricas
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Ejecutar consultas en paralelo para mejor performance
    const [
      // Métricas de órdenes
      totalOrders,
      todayOrders,
      pendingOrders,
      thisMonthOrders,
      
      // Métricas de ventas
      totalRevenue,
      todayRevenue,
      thisMonthRevenue,
      
      // Métricas de productos
      totalProducts,
      lowStockProducts,
      inactiveProducts,
      
      // Métricas de usuarios
      totalUsers,
      newUsersThisMonth,
      
      // Órdenes recientes
      recentOrders,
      
      // Top productos (más vendidos)
      topProducts
    ] = await Promise.all([
      // Órdenes
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonth }
        }
      }),
      
      // Ventas
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: today }
        },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: thisMonth }
        },
        _sum: { total: true }
      }),
      
      // Productos
      prisma.product.count(),
      prisma.product.count({
        where: { stock: { lte: 5 } }
      }),
      prisma.product.count({
        where: { isActive: false }
      }),
      
      // Usuarios
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: thisMonth }
        }
      }),
      
      // Órdenes recientes
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            select: { quantity: true }
          }
        }
      }),
      
      // Productos más vendidos
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { productId: true },
        orderBy: {
          _sum: { quantity: 'desc' }
        },
        take: 5
      })
    ])

    // Obtener detalles de productos más vendidos
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, image1: true, price: true }
        })
        return {
          ...product,
          totalSold: item._sum.quantity,
          orderCount: item._count.productId
        }
      })
    )

    // Preparar respuesta
    const dashboardData = {
      // Métricas principales
      metrics: {
        orders: {
          total: totalOrders,
          today: todayOrders,
          pending: pendingOrders,
          thisMonth: thisMonthOrders
        },
        revenue: {
          total: totalRevenue._sum.total || 0,
          today: todayRevenue._sum.total || 0,
          thisMonth: thisMonthRevenue._sum.total || 0
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
          inactive: inactiveProducts
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth
        }
      },
      
      // Datos para gráficos y tablas
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.user?.name || order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        createdAt: order.createdAt
      })),
      
      topProducts: topProductsDetails.filter(Boolean),
      
      // Metadata
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error("❌ Error en GET /api/admin/dashboard:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}