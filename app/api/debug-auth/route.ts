import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 DEBUG AUTH API - Iniciando verificación...")
    
    // Obtener sesión del servidor
    const session = await getServerSession(authOptions)
    
    console.log("📋 Datos de sesión:", {
      exists: !!session,
      user: session?.user,
      email: session?.user?.email,
      role: session?.user?.role
    })

    if (!session) {
      return NextResponse.json({
        error: "No hay sesión",
        authenticated: false,
        session: null
      })
    }

    if (!session.user?.email) {
      return NextResponse.json({
        error: "Sesión sin email",
        authenticated: false,
        session: session
      })
    }

    // Verificar en base de datos
    const { prisma } = await import("@/lib/prisma")
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true,
        email: true, 
        name: true, 
        role: true 
      }
    })

    console.log("👤 Usuario en DB:", user)

    return NextResponse.json({
      authenticated: true,
      session: {
        user: session.user,
        expires: session.expires
      },
      userFromDB: user,
      canAccessAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
      debug: {
        sessionRole: session.user.role,
        dbRole: user?.role,
        rolesMatch: session.user.role === user?.role
      }
    })

  } catch (error) {
    console.error("❌ Error en debug auth:", error)
    return NextResponse.json({
      error: "Error interno",
      message: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 })
  }
}