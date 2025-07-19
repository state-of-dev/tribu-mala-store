import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener orden por ID
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true, address: true, city: true, zip: true, country: true }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error("❌ Error en GET /api/admin/orders/[id]:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { status, adminNotes } = body

    // Validar estado
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    // Preparar datos de actualización
    const updateData: any = {}
    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes

    // Agregar timestamps según el estado
    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date()
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date()
    }

    // Actualizar orden
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: { name: true, email: true }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: "Orden actualizada exitosamente",
      order: updatedOrder 
    })

  } catch (error) {
    console.error("❌ Error en PATCH /api/admin/orders/[id]:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}