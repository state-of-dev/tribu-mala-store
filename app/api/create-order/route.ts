export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    console.log("🚫 Este endpoint ya no crea órdenes directamente")
    console.log("ℹ️ Las órdenes ahora se crean solo después de pagos exitosos via webhook")
    console.log("🔄 Redirigiendo a create-checkout para usar Stripe Checkout")

    // Redirigir al cliente para que use el flujo correcto
    return NextResponse.json({
      error: "Este endpoint ha sido actualizado. Las órdenes ahora se crean solo después de pagos confirmados.",
      suggestion: "Usa /api/create-checkout para crear una sesión de pago de Stripe",
      redirectTo: "/api/create-checkout"
    }, { status: 400 })

  } catch (error) {
    console.error("❌ Error:", error)
    return NextResponse.json(
      { error: "Endpoint discontinuado" },
      { status: 400 }
    )
  }
}