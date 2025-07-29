"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Lock, ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

interface CheckoutForm {
  // Información personal
  email: string
  name: string
  phone: string
  
  // Dirección de envío
  address: string
  city: string
  state: string
  zip: string
  country: string
  
  // Notas adicionales
  notes: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, totalPrice: total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
    notes: ""
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/")
    }
  }, [items, router])

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      
      if (response.ok) {
        const data = await response.json()
        console.log("📡 Respuesta del API:", data)
        
        if (data.success) {
          const user = data
          const fullName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.name || ""
            
          // Construir dirección completa desde campos separados
          const fullAddress = [
            user.street,
            user.number,
            user.interior,
            user.neighborhood
          ].filter(Boolean).join(" ")
          
          const newFormData = {
            email: user.email || "",
            name: fullName,
            phone: user.phone || "", 
            address: fullAddress || "",
            city: user.city || "",
            state: user.state || "",
            zip: user.zip || "",
            country: user.country || "México"
          }
          
          console.log("🏠 Datos a pre-llenar:", newFormData)
          
          setFormData(prev => ({
            ...prev,
            ...newFormData
          }))
          console.log("✅ Datos completos de perfil pre-llenados")
        }
      }
    } catch (error) {
      console.error("❌ Error cargando perfil:", error)
      // Fallback a datos básicos de sesión
      setFormData(prev => ({
        ...prev,
        email: session?.user?.email || "",
        name: session?.user?.name || ""
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    const required = ['email', 'name', 'address', 'city', 'state', 'zip']
    return required.every(field => formData[field as keyof CheckoutForm].trim() !== '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)
    
    try {
      console.log("🛒 Procesando checkout:", { formData, items, total })
      
      // Crear orden y Payment Intent
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items,
          total
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la orden')
      }

      console.log("✅ Orden creada:", data.order)
      console.log("💳 Payment Intent:", data.paymentIntent.id)

      // Redirigir a página de pago con el Payment Intent
      router.push(`/checkout/payment?pi=${data.paymentIntent.id}&client_secret=${data.paymentIntent.clientSecret}&order=${data.order.orderNumber}`)
      
    } catch (error: any) {
      console.error("❌ Error en checkout:", error)
      alert(error.message || "Error al procesar el pedido")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  if (items.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-dark-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la tienda
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Finalizar Compra</h1>
          <p className="text-gray-400">Completa tu información para procesar el pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Checkout */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dirección de Envío */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white">Dirección de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                      placeholder="Calle, número, colonia"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="Estado"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zip">Código Postal *</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-500 text-white placeholder-gray-400"
                        placeholder="México"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instrucciones especiales de entrega..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botón de Procesar Pago */}
              <Button
                type="submit"
                className={`w-full h-12 text-lg font-semibold transition-all ${
                  !validateForm() && !isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : !validateForm() ? (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Completa los campos requeridos
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceder al Pago {formatCurrency(total)}
                  </>
                )}
              </Button>

              {/* Seguridad */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Lock className="h-4 w-4" />
                <span>Transacción segura encriptada</span>
              </div>
            </form>
          </div>

          {/* Resumen del Pedido */}
          <div className="space-y-6">
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Package className="mr-2 h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image1}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-white text-sm">{item.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              Cantidad: {item.quantity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-dark-600" />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Envío</span>
                    <span className="text-white">Gratis</span>
                  </div>
                  <Separator className="bg-dark-600" />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Auth Status */}
                {status === "loading" ? (
                  <div className="text-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : session ? (
                  <div className="bg-green-900/20 border border-green-500/50 rounded p-3">
                    <div className="text-green-400 text-sm font-medium">
                      Conectado como {session.user?.name || session.user?.email}
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-900/20 border border-blue-500/50 rounded p-3">
                    <div className="text-blue-400 text-sm">
                      💡 <Link href="/auth/signin" className="underline">Inicia sesión</Link> para pre-llenar tus datos
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
