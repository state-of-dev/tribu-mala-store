import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = {
      isActive: true, // Solo productos activos
    }

    // Filtros opcionales
    if (category) {
      where.category = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: [
        { isFeatured: 'desc' }, // Productos destacados primero
        { createdAt: 'desc' }   // Luego los más recientes
      ],
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
        isFeatured: true,
        isActive: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      message: `${products.length} productos encontrados`
    })

  } catch (error) {
    console.error('❌ Error al obtener productos:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}