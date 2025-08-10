import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el usuario sea admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // **CARGA PARALELA DE TODOS LOS DATOS** 
    const [
      ordersResult,
      productsResult,
      usersResult,
      dashboardMetrics,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Orders con detalles completos
      prisma.order.findMany({
        take: 100, // Límite inicial
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  image1: true,
                  price: true
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
      }),

      // Products con stock y estado
      prisma.product.findMany({
        take: 200, // Límite inicial  
        orderBy: { updatedAt: 'desc' }
      }),

      // Users con estadísticas
      prisma.user.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              paymentStatus: true
            }
          }
        }
      }),

      // Dashboard metrics
      Promise.all([
        // Orders metrics
        prisma.order.aggregate({
          _count: { id: true },
          _sum: { total: true }
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.order.count({
          where: { status: 'CONFIRMED' }  // Nuevas órdenes confirmadas
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),

        // Products metrics
        prisma.product.count(),
        prisma.product.count({
          where: { stock: { lte: 5 } }
        }),
        prisma.product.count({
          where: { isActive: false }
        }),

        // Users metrics
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ]),

      // Recent orders para dashboard
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: { quantity: true }
          },
          user: {
            select: { name: true, email: true }
          }
        }
      }),

      // Top products para dashboard
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        _count: { orderId: true },
        take: 10,
        orderBy: {
          _sum: { quantity: 'desc' }
        }
      })
    ])

    // Procesar métricas
    const [
      totalOrdersData,
      todayOrders,
      pendingOrders,
      monthOrders,
      totalProducts,
      lowStockProducts,
      inactiveProducts,
      totalUsers,
      newUsersThisMonth
    ] = dashboardMetrics

    // Obtener detalles de top products
    const topProductIds = topProducts.map(tp => tp.productId)
    const topProductsDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: {
        id: true,
        name: true,
        image1: true,
        price: true
      }
    })

    // Combinar top products con sus detalles
    const topProductsWithDetails = topProducts.map(tp => {
      const product = topProductsDetails.find(p => p.id === tp.productId)
      return {
        ...product,
        totalSold: tp._sum.quantity || 0,
        orderCount: tp._count.orderId || 0
      }
    })

    // Procesar users con estadísticas
    const usersWithStats = usersResult.map(user => {
      const paidOrders = user.orders.filter(o => o.paymentStatus === 'PAID')
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        address: user.address,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        stats: {
          totalOrders: user.orders.length,
          totalSpent: paidOrders.reduce((sum, o) => sum + o.total, 0),
          paidOrders: paidOrders.length
        }
      }
    })

    // Formatear orders
    const formattedOrders = ordersResult.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user?.name || order.customerName,
      customerEmail: order.user?.email || order.customerEmail,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      city: order.shippingCity,
      country: order.shippingCountry,
      phone: order.phone,
      notes: order.customerNotes,
      adminNotes: order.adminNotes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.productPrice,
        productName: item.productName,
        size: item.size,
        color: item.color,
        total: item.quantity * item.productPrice,
        product: item.product
      }))
    }))

    // Formatear products
    const formattedProducts = productsResult.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image1: product.image1,
      image2: product.image2,
      image3: product.image3,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      slug: product.slug,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))

    // Revenue del mes actual
    const currentMonthRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { total: true }
    })

    // Revenue de hoy
    const todayRevenue = await prisma.order.aggregate({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      _sum: { total: true }
    })

    // **RESPUESTA ÚNICA CON TODOS LOS DATOS**
    const allAdminData = {
      // Datos principales
      orders: formattedOrders,
      products: formattedProducts,
      users: usersWithStats,
      
      // Dashboard completo
      dashboard: {
        metrics: {
          orders: {
            total: totalOrdersData._count.id,
            today: todayOrders,
            confirmed: pendingOrders,  // Ahora son órdenes confirmadas
            thisMonth: monthOrders
          },
          revenue: {
            total: totalOrdersData._sum.total || 0,
            today: todayRevenue._sum.total || 0,
            thisMonth: currentMonthRevenue._sum.total || 0
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
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.user?.name || order.customerName,
          customerEmail: order.user?.email || order.customerEmail,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: order.createdAt.toISOString()
        })),
        topProducts: topProductsWithDetails
      },
      
      // Metadata
      meta: {
        timestamp: new Date().toISOString(),
        totalRecords: {
          orders: ordersResult.length,
          products: productsResult.length,
          users: usersResult.length
        }
      }
    }

    return NextResponse.json(allAdminData)

  } catch (error) {
    console.error('❌ Error loading admin data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}