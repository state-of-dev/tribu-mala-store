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
      stock,
      image1,
      image2,
      image3,
      category,
      sizes,
      colors,
      slug,
      metaTitle,
      metaDescription,
      isActive,
      isFeatured
    } = body

    // Validar campos requeridos
    if (!name || !price || !image1) {
      return NextResponse.json(
        { error: "Nombre, precio e imagen principal son requeridos" },
        { status: 400 }
      )
    }

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image1,
        image2,
        image3,
        category,
        sizes: sizes || [],
        colors: colors || [],
        slug,
        metaTitle,
        metaDescription,
        isActive: isActive !== false,
        isFeatured: isFeatured === true
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