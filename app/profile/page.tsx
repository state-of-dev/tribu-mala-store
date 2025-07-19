"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Phone, Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "México"
  })

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
      // Aquí iría la lógica para actualizar el perfil
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular API call
      console.log("✅ Perfil actualizado:", formData)
      
      // Mostrar notificación de éxito
      alert("Perfil actualizado exitosamente")
      
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error)
      alert("Error al actualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Administra tu información personal y datos de envío</p>
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
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-dark-700 border-dark-600"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-dark-700 border-dark-600"
                    placeholder="tu@email.com"
                    disabled
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
                  onChange={handleChange}
                  className="bg-dark-700 border-dark-600"
                  placeholder="+52 55 1234 5678"
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
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="bg-dark-700 border-dark-600"
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
                    className="bg-dark-700 border-dark-600"
                    placeholder="Ciudad"
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
                    className="bg-dark-700 border-dark-600"
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-dark-700 border-dark-600"
                    placeholder="México"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón de Guardar */}
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
      </div>
    </div>
  )
}