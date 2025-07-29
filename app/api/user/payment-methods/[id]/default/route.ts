export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      )
    }

    const paymentMethodId = params.id

    console.log("⭐ Estableciendo método de pago predeterminado:", paymentMethodId)

    // Verify the payment method belongs to the user
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: {
        id: paymentMethodId,
        userId: session.user.id
      }
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: "Método de pago no encontrado" },
        { status: 404 }
      )
    }

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // First, set all user's payment methods to non-default
      await tx.paymentMethod.updateMany({
        where: {
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      })

      // Then set the selected one as default
      await tx.paymentMethod.update({
        where: {
          id: paymentMethodId
        },
        data: {
          isDefault: true
        }
      })
    })

    console.log("✅ Método de pago predeterminado actualizado")

    return NextResponse.json({
      success: true,
      message: "Método de pago predeterminado actualizado"
    })

  } catch (error) {
    console.error("❌ Error actualizando método de pago predeterminado:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}