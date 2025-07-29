import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  console.log("🔑 FORGOT PASSWORD API CALLED")
  
  try {
    const { email } = await request.json()
    console.log("📧 Password reset requested for:", email)

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      )
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Por seguridad, siempre devolvemos éxito aunque el usuario no exista
    // para no revelar qué emails están registrados
    if (!user) {
      console.log("⚠️ User not found, but returning success for security")
      return NextResponse.json({
        message: "Si el email existe, recibirás un enlace de recuperación"
      })
    }

    // Generar token seguro
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    console.log("🔐 Generated reset token for:", email)

    // Guardar token en la base de datos
    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expires: expiresAt,
        used: false
      }
    })

    // Enviar email de reset
    try {
      console.log("📧 Sending password reset email to:", email)
      
      const emailResult = await sendPasswordResetEmail({
        userName: user.name || 'Usuario',
        resetToken,
        expirationTime: '15 minutos'
      }, email)

      if (emailResult.success) {
        console.log("✅ Password reset email sent successfully to:", email)
      } else {
        console.error("❌ Failed to send password reset email:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Password reset email error:", emailError)
      // No fallar la respuesta si el email falla
    }

    return NextResponse.json({
      message: "Si el email existe, recibirás un enlace de recuperación"
    })

  } catch (error) {
    console.error("❌ Error in forgot password:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}