export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache por 60 segundos

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
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Construir filtros
    const where: any = {}
    if (category && category !== 'all') {
      where.category = category
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Obtener productos con filtros
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error("❌ Error en GET /api/admin/products:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Validar campos requeridos
    if (!name || !price || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Nombre, precio e imagen principal son requeridos" },
        { status: 400 }
      )
    }

    // Calcular stock total de las variantes
    const totalStock = variants?.reduce((total: number, variant: any) => total + (variant.stock || 0), 0) || 0

    // Crear producto con variantes
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: totalStock,
        image1: images[0] || '',
        image2: images[1] || null,
        image3: images[2] || null,
        category,
        isActive: isActive !== false,
        variants: {
          create: variants?.map((variant: any) => ({
            size: variant.size,
            color: variant.color,
            stock: parseInt(variant.stock) || 0
          })) || []
        }
      },
      include: {
        variants: true
      }
    })

    return NextResponse.json({
      message: "Producto creado exitosamente",
      product
    }, { status: 201 })

  } catch (error) {
    console.error("❌ Error en POST /api/admin/products:", error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "El slug ya existe" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}