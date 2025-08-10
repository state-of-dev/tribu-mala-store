import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Obtener variantes de un producto (público)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' }, 
        { status: 400 }
      )
    }

    // Verificar que el producto existe y esté activo
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' }, 
        { status: 404 }
      )
    }

    // Obtener variantes del producto
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