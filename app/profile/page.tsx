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
import { User, Mail, MapPin, Phone, Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    // Shipping Address
    street: "",
    number: "",
    interior: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
    country: "México",
    // Billing Address
    billingStreet: "",
    billingNumber: "",
    billingInterior: "",
    billingNeighborhood: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "México",
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


  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Administra tu información personal y direcciones de envío</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
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
                <Input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
                <Input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellidos"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  disabled
                />
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Teléfono"
                />
              </div>
            </CardContent>
          </Card>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Calle"
                  />
                </div>
                <Input
                  name="number"
                  type="text"
                  value={formData.number}
                  onChange={handleChange}
                  placeholder="Número"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="interior"
                  type="text"
                  value={formData.interior}
                  onChange={handleChange}
                  placeholder="Interior (opcional)"
                />
                <Input
                  name="neighborhood"
                  type="text"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  placeholder="Colonia"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                />
                <Input
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Estado"
                />
                <Input
                  name="zip"
                  type="text"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="Código Postal"
                />
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <span className="text-gray-300 text-sm font-medium">País: México</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        name="billingStreet"
                        type="text"
                        value={formData.billingStreet}
                        onChange={handleChange}
                        placeholder="Calle"
                      />
                    </div>
                    <Input
                      name="billingNumber"
                      type="text"
                      value={formData.billingNumber}
                      onChange={handleChange}
                      placeholder="Número"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="billingInterior"
                      type="text"
                      value={formData.billingInterior}
                      onChange={handleChange}
                      placeholder="Interior (opcional)"
                    />
                    <Input
                      name="billingNeighborhood"
                      type="text"
                      value={formData.billingNeighborhood}
                      onChange={handleChange}
                      placeholder="Colonia"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      name="billingCity"
                      type="text"
                      value={formData.billingCity}
                      onChange={handleChange}
                      placeholder="Ciudad"
                    />
                    <Input
                      name="billingState"
                      type="text"
                      value={formData.billingState}
                      onChange={handleChange}
                      placeholder="Estado"
                    />
                    <Input
                      name="billingZip"
                      type="text"
                      value={formData.billingZip}
                      onChange={handleChange}
                      placeholder="Código Postal"
                    />
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-300 text-sm font-medium">País: México</span>
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
                  Guardar Perfil
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}