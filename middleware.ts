import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Proteger rutas de administración
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Si no hay token, redirigir a login
    if (!token) {
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar rol de administrador
    if (token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      // Redirigir a página de acceso denegado o home
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger APIs de administración
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Si no hay token, retornar 401
    if (!token) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    // Verificar rol de administrador
    if (token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: "Sin permisos de administrador" },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}