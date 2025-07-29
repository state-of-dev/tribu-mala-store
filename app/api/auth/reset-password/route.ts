import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const validate = searchParams.get("validate")

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 })
  }

  if (validate === "true") {
    try {
      const resetRecord = await prisma.passwordReset.findUnique({
        where: { token }
      })

      if (!resetRecord || resetRecord.used || resetRecord.expires < new Date()) {
        return NextResponse.json({ valid: false, error: "Token inválido o expirado" })
      }

      return NextResponse.json({ valid: true })
    } catch (error) {
      console.error("❌ Error validating token:", error)
      return NextResponse.json({ valid: false, error: "Error del servidor" })
    }
  }

  return NextResponse.json({ error: "Parámetro validate requerido" }, { status: 400 })
}

export async function POST(request: Request) {
  console.log("🔐 RESET PASSWORD API CALLED")
  
  try {
    const { token, password } = await request.json()
    console.log("🔑 Password reset attempt with token")

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y contraseña son requeridos" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Buscar el token de reset
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token }
    })

    if (!resetRecord) {
      console.log("❌ Token not found")
      return NextResponse.json(
        { error: "Token de recuperación no válido" },
        { status: 400 }
      )
    }

    if (resetRecord.used) {
      console.log("❌ Token already used")
      return NextResponse.json(
        { error: "Este enlace ya ha sido utilizado" },
        { status: 400 }
      )
    }

    if (resetRecord.expires < new Date()) {
      console.log("❌ Token expired")
      return NextResponse.json(
        { error: "El enlace de recuperación ha expirado" },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email }
    })

    if (!user) {
      console.log("❌ User not found for email:", resetRecord.email)
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 400 }
      )
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(password, 12)

    // Actualizar la contraseña del usuario y marcar el token como usado
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetRecord.email },
        data: { password: hashedPassword }
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { used: true }
      })
    ])

    console.log("✅ Password reset successful for:", resetRecord.email)

    return NextResponse.json({
      message: "Contraseña restablecida exitosamente"
    })

  } catch (error) {
    console.error("❌ Error in reset password:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}