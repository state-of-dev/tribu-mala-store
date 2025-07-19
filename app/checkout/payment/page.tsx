"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ clientSecret, orderNumber }: { clientSecret: string, orderNumber: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setMessage("")

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      },
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Error al procesar el pago")
      } else {
        setMessage("Error inesperado. Intenta de nuevo.")
      }
    } else {
      // Payment succeeded - clear cart and redirect
      clearCart()
      router.push(`/checkout/success?order=${orderNumber}`)
    }

    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: "tabs" as const,
    defaultValues: {
      billingDetails: {
        name: '',
        email: ''
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-dark-800 border-dark-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement options={paymentElementOptions} />
        </CardContent>
      </Card>

      {message && (
        <div className="bg-red-900/20 border border-red-500/50 rounded p-3">
          <div className="flex items-center text-red-400 text-sm">
            <XCircle className="h-4 w-4 mr-2" />
            {message}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-lg font-semibold"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Procesando pago...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Confirmar Pago
          </>
        )}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
        <Lock className="h-4 w-4" />
        <span>Transacción segura con cifrado SSL</span>
      </div>
    </form>
  )
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get("client_secret")
  const orderNumber = searchParams.get("order")
  const [paymentIntentId, setPaymentIntentId] = useState("")

  useEffect(() => {
    const pi = searchParams.get("pi")
    if (pi) {
      setPaymentIntentId(pi)
    }
  }, [searchParams])

  if (!clientSecret || !orderNumber) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-dark-800 border-dark-600">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">Error en el Pago</h1>
              <p className="text-gray-400 mb-6">
                No se encontró la información de pago. Por favor intenta de nuevo.
              </p>
              <Button asChild>
                <Link href="/checkout">
                  Volver al Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/checkout">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al checkout
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Completar Pago</h1>
          <p className="text-gray-400">Orden: {orderNumber}</p>
        </div>

        {/* Payment Form */}
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm clientSecret={clientSecret} orderNumber={orderNumber} />
        </Elements>

        {/* Order Info */}
        <Card className="bg-dark-800 border-dark-600 mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Payment Intent ID:</span>
              <span className="text-white font-mono text-xs">{paymentIntentId}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}