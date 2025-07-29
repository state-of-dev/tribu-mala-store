import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(request: Request) {
  console.log("🎯 REGISTER API ROUTE CALLED")
  try {
    const { name, email, password } = await request.json()
    console.log("📝 Registration data received:", { name, email, passwordLength: password?.length })

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 12)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    console.log("🎉 Nuevo usuario registrado:", {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    })

    // Enviar email de bienvenida
    try {
      console.log("🚀 STARTING EMAIL PROCESS")
      console.log("📧 Sending welcome email to:", user.email)
      console.log("🔑 RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
      console.log("🔑 RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length || 0)
      
      const emailResult = await sendWelcomeEmail({
        userName: user.name || 'Usuario',
        userEmail: user.email
      })
      
      console.log("📧 Email result:", JSON.stringify(emailResult, null, 2))
      
      if (emailResult.success) {
        console.log("✅ Welcome email sent successfully to:", user.email)
      } else {
        console.error("❌ Failed to send welcome email:", emailResult.error)
      }
    } catch (emailError) {
      console.error("❌ Welcome email error:", emailError)
      console.error("❌ Error stack:", emailError instanceof Error ? emailError.stack : 'No stack trace')
      // No fallar el registro si el email falla
    }

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.error("❌ Error al registrar usuario:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}