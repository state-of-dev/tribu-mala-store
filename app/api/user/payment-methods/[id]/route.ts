export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
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

    console.log("🗑️ Eliminando método de pago:", paymentMethodId)

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

    // Delete from Stripe first (if stripeMethodId exists)
    if (paymentMethod.stripeMethodId) {
      try {
        // TODO: Implement Stripe payment method deletion
        // await stripe.paymentMethods.detach(paymentMethod.stripeMethodId)
        console.log("🔄 Stripe payment method would be deleted:", paymentMethod.stripeMethodId)
      } catch (stripeError) {
        console.error("❌ Error deleting from Stripe:", stripeError)
        // Continue with database deletion even if Stripe fails
      }
    }

    // Delete from database
    await prisma.paymentMethod.delete({
      where: {
        id: paymentMethodId
      }
    })

    console.log("✅ Método de pago eliminado exitosamente")

    return NextResponse.json({
      success: true,
      message: "Método de pago eliminado exitosamente"
    })

  } catch (error) {
    console.error("❌ Error eliminando método de pago:", error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}