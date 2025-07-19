import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto inválido' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
        isActive: true // Solo productos activos
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        image1: true,
        image2: true,
        image3: true,
        category: true,
        sizes: true,
        colors: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        isFeatured: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Producto encontrado'
    })

  } catch (error) {
    console.error('❌ Error al obtener producto:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}