export const dynamic = 'force-dynamic'

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

    // Obtener producto por ID con variantes
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        variants: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ product })

  } catch (error) {
    console.error("❌ Error en GET /api/admin/products/[id]:", error)
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
    const {
      name,
      description,
      price,
      images,
      category,
      variants,
      isActive
    } = body

    // Calcular stock total de las variantes
    const totalStock = variants?.reduce((total: number, variant: any) => total + (variant.stock || 0), 0) || 0

    // Preparar datos de actualización
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (images !== undefined) {
      updateData.image1 = images[0] || ''
      updateData.image2 = images[1] || null
      updateData.image3 = images[2] || null
    }
    if (category !== undefined) updateData.category = category
    if (isActive !== undefined) updateData.isActive = isActive
    if (variants !== undefined) updateData.stock = totalStock

    // Actualizar producto
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        variants: true
      }
    })

    // Actualizar variantes si se proporcionaron
    if (variants !== undefined) {
      // Eliminar variantes existentes
      await prisma.productVariant.deleteMany({
        where: { productId: parseInt(params.id) }
      })

      // Crear nuevas variantes
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((variant: any) => ({
            productId: parseInt(params.id),
            size: variant.size,
            color: variant.color,
            stock: parseInt(variant.stock) || 0
          }))
        })
      }

      // Obtener producto actualizado con variantes
      const finalProduct = await prisma.product.findUnique({
        where: { id: parseInt(params.id) },
        include: {
          variants: true
        }
      })

      return NextResponse.json({
        message: "Producto actualizado exitosamente",
        product: finalProduct
      })
    }

    return NextResponse.json({
      message: "Producto actualizado exitosamente",
      product: updatedProduct
    })

  } catch (error) {
    console.error("❌ Error en PATCH /api/admin/products/[id]:", error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "El slug ya existe" },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verificar si el producto tiene órdenes asociadas
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: parseInt(params.id) }
    })

    if (orderItems) {
      // En lugar de eliminar, desactivar el producto
      const deactivatedProduct = await prisma.product.update({
        where: { id: parseInt(params.id) },
        data: { isActive: false }
      })

      return NextResponse.json({
        message: "Producto desactivado (tiene órdenes asociadas)",
        product: deactivatedProduct
      })
    }

    // Eliminar producto si no tiene órdenes
    await prisma.product.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({
      message: "Producto eliminado exitosamente"
    })

  } catch (error) {
    console.error("❌ Error en DELETE /api/admin/products/[id]:", error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}