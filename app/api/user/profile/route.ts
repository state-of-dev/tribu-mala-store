export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    console.log("🔍 Obteniendo perfil para usuario:", session.user.email)

    // Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        birthDate: true,
        // Shipping Address
        address: true,
        city: true,
        state: true,
        zip: true,
        country: true,
        // Billing Address  
        billingAddress: true,
        billingCity: true,
        billingState: true,
        billingZip: true,
        billingCountry: true,
        // Preferences
        savePaymentMethods: true,
        defaultShipping: true,
        // Stripe
        stripeCustomerId: true,
        // Payment Methods
        paymentMethods: {
          select: {
            id: true,
            last4: true,
            brand: true,
            expiryMonth: true,
            expiryYear: true,
            isDefault: true,
            nickname: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    console.log("✅ Perfil obtenido")

    return NextResponse.json({
      success: true,
      ...user,
      // Format birthDate for date input
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : ""
    })

  } catch (error) {
    console.error("❌ Error obteniendo perfil:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      birthDate,
      // Shipping Address
      address,
      city,
      state,
      zip,
      country,
      // Billing Address
      billingAddress,
      billingCity,
      billingState,
      billingZip,
      billingCountry,
      // Preferences
      savePaymentMethods,
      defaultShipping
    } = body

    console.log("🔄 Actualizando perfil para usuario:", session.user.email)

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        // Shipping Address
        address: address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        country: country || null,
        // Billing Address
        billingAddress: billingAddress || null,
        billingCity: billingCity || null,
        billingState: billingState || null,
        billingZip: billingZip || null,
        billingCountry: billingCountry || null,
        // Preferences
        savePaymentMethods: savePaymentMethods || false,
        defaultShipping: defaultShipping !== false // default to true
      }
    })

    console.log("✅ Perfil actualizado exitosamente")

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado exitosamente"
    })

  } catch (error) {
    console.error("❌ Error actualizando perfil:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}