"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la cuenta")
      }

      console.log("✅ Usuario registrado:", data.user)
      setSuccess(true)
      
      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        router.push("/auth/signin")
      }, 2000)

    } catch (error: any) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg text-center">
          <div className="text-green-400 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2 text-green-400">¡Cuenta creada!</h1>
          <p className="text-gray-400 mb-4">
            Tu cuenta ha sido creada exitosamente. Serás redirigido al login...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Crear Cuenta</h1>
          <p className="text-gray-400">Únete a la comunidad SDFM 2520</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-dark-700"
              placeholder="Tu nombre"
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
              required
              className="bg-dark-700"
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-dark-700"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-dark-700"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}