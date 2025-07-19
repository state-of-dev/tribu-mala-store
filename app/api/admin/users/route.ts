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

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Construir filtros
    const where: any = {}
    
    if (role && role !== 'all') {
      where.role = role
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Obtener usuarios con estadísticas
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          address: true,
          city: true,
          country: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.user.count({ where })
    ])

    // Obtener estadísticas adicionales para cada usuario
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await prisma.order.aggregate({
          where: {
            userId: user.id,
            paymentStatus: 'PAID'
          },
          _sum: { total: true },
          _count: true
        })

        const lastOrder = await prisma.order.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true, total: true, status: true }
        })

        return {
          ...user,
          stats: {
            totalOrders: user._count.orders,
            totalSpent: orderStats._sum.total || 0,
            paidOrders: orderStats._count,
            lastOrder: lastOrder ? {
              date: lastOrder.createdAt,
              total: lastOrder.total,
              status: lastOrder.status
            } : null
          }
        }
      })
    )

    return NextResponse.json({
      users: usersWithStats,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("❌ Error en GET /api/admin/users:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}