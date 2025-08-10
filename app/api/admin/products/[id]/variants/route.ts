import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Obtener variantes de un producto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    }

    const productId = parseInt(params.id)

    const variants = await prisma.productVariant.findMany({
      where: {
        productId
      },
      orderBy: [
        { size: 'asc' },
        { color: 'asc' }
      ]
    })

    return NextResponse.json({ 
      success: true, 
      variants 
    })

  } catch (error) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { error: 'Error al obtener variantes' }, 
      { status: 500 }
    )
  }
}

// POST - Crear/actualizar variantes de un producto
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    }

    const productId = parseInt(params.id)
    const { variants } = await request.json()

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' }, 
        { status: 404 }
      )
    }

    // Eliminar variantes existentes
    await prisma.productVariant.deleteMany({
      where: { productId }
    })

    // Crear nuevas variantes
    if (variants && variants.length > 0) {
      const variantsToCreate = variants.map((variant: any) => ({
        productId,
        size: variant.size,
        color: variant.color,
        stock: parseInt(variant.stock) || 0,
        sku: variant.sku || null
      }))

      await prisma.productVariant.createMany({
        data: variantsToCreate
      })

      // Actualizar el stock total del producto
      const totalStock = variants.reduce((sum: number, variant: any) => 
        sum + (parseInt(variant.stock) || 0), 0
      )

      await prisma.product.update({
        where: { id: productId },
        data: { stock: totalStock }
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Variantes guardadas exitosamente' 
    })

  } catch (error) {
    console.error('Error saving variants:', error)
    return NextResponse.json(
      { error: 'Error al guardar variantes' }, 
      { status: 500 }
    )
  }
}