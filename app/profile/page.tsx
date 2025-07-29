"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, MapPin, Phone, Save, Loader2, CreditCard, Plus, Trash2, Calendar } from "lucide-react"

interface PaymentMethod {
  id: string
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
  nickname?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    birthDate: "",
    // Shipping Address
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
    // Billing Address
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "",
    // Preferences
    savePaymentMethods: false,
    defaultShipping: true
  })

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return
      
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const userData = await response.json()
          setFormData(prev => ({
            ...prev,
            ...userData
          }))
          setPaymentMethods(userData.paymentMethods || [])
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session?.user?.id])

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        alert("Perfil actualizado exitosamente")
      } else {
        throw new Error('Error al actualizar perfil')
      }
      
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error)
      alert("Error al actualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const addPaymentMethod = async () => {
    // This would integrate with Stripe to add a new payment method
    console.log('Adding payment method...')
  }

  const removePaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${methodId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== methodId))
      }
    } catch (error) {
      console.error('Error removing payment method:', error)
    }
  }

  const setDefaultPaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/user/payment-methods/${methodId}/default`, {
        method: 'PUT',
      })
      
      if (response.ok) {
        setPaymentMethods(prev => prev.map(pm => ({
          ...pm,
          isDefault: pm.id === methodId
        })))
      }
    } catch (error) {
      console.error('Error setting default payment method:', error)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Administra tu información personal, direcciones y métodos de pago</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Información Personal</TabsTrigger>
            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
            <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <User className="mr-2 h-5 w-5" />
                    Información Personal
                  </CardTitle>
                  <CardDescription>
                    Datos básicos de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Tus apellidos"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+52 55 1234 5678"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="addresses">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dirección de Envío */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <MapPin className="mr-2 h-5 w-5" />
                    Dirección de Envío
                  </CardTitle>
                  <CardDescription>
                    Dirección predeterminada para tus pedidos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle, número, colonia"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Código Postal</Label>
                      <Input
                        id="zip"
                        name="zip"
                        type="text"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="México"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dirección de Facturación */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Mail className="mr-2 h-5 w-5" />
                    Dirección de Facturación
                  </CardTitle>
                  <CardDescription>
                    Dirección para facturación (opcional si es diferente al envío)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="defaultShipping"
                      name="defaultShipping"
                      checked={formData.defaultShipping}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultShipping: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="defaultShipping">Usar dirección de envío como facturación</Label>
                  </div>
                  
                  {!formData.defaultShipping && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Dirección de facturación</Label>
                        <Input
                          id="billingAddress"
                          name="billingAddress"
                          type="text"
                          value={formData.billingAddress}
                          onChange={handleChange}
                            placeholder="Calle, número, colonia"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">Ciudad</Label>
                          <Input
                            id="billingCity"
                            name="billingCity"
                            type="text"
                            value={formData.billingCity}
                            onChange={handleChange}
                                placeholder="Ciudad"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingState">Estado</Label>
                          <Input
                            id="billingState"
                            name="billingState"
                            type="text"
                            value={formData.billingState}
                            onChange={handleChange}
                                placeholder="Estado"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingZip">Código Postal</Label>
                          <Input
                            id="billingZip"
                            name="billingZip"
                            type="text"
                            value={formData.billingZip}
                            onChange={handleChange}
                                placeholder="12345"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">País</Label>
                        <Input
                          id="billingCountry"
                          name="billingCountry"
                          type="text"
                          value={formData.billingCountry}
                          onChange={handleChange}
                            placeholder="México"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[150px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Direcciones
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              {/* Métodos de Pago Guardados */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Métodos de Pago
                    </div>
                    <Button onClick={addPaymentMethod} size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Tarjeta
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Administra tus métodos de pago para compras rápidas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border border-dark-600 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">
                                  {method.brand.toUpperCase()} •••• {method.last4}
                                </span>
                                {method.isDefault && (
                                  <Badge variant="secondary">Predeterminada</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400">
                                Expira {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                                {method.nickname && ` • ${method.nickname}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!method.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDefaultPaymentMethod(method.id)}
                              >
                                Hacer predeterminada
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePaymentMethod(method.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400 mb-4">No tienes métodos de pago guardados</p>
                      <Button onClick={addPaymentMethod}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar tu primera tarjeta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferencias de Pago */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="text-white">Preferencias</CardTitle>
                  <CardDescription>
                    Configura tus preferencias de pago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="savePaymentMethods"
                      name="savePaymentMethods"
                      checked={formData.savePaymentMethods}
                      onChange={(e) => setFormData(prev => ({ ...prev, savePaymentMethods: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="savePaymentMethods">
                      Guardar automáticamente nuevos métodos de pago para compras futuras
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}