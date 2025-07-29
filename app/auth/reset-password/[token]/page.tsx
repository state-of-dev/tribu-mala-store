"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2, ArrowLeft, Shield, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/auth/reset-password?token=${token}&validate=true`)
      const data = await response.json()
      
      if (response.ok && data.valid) {
        setTokenValid(true)
      } else {
        setError(data.error || "El enlace de recuperación no es válido o ha expirado")
      }
    } catch (error) {
      setError("Error al validar el enlace")
    } finally {
      setIsValidating(false)
    }
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
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña")
      }

      setSuccess(true)
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Validando enlace de recuperación...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-white">Enlace No Válido</h1>
          <p className="text-gray-400 mb-6">
            El enlace de recuperación no es válido o ha expirado.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">
                Solicitar nuevo enlace
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg text-center">
          <div className="text-green-400 text-6xl mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-green-400">¡Contraseña Actualizada!</h1>
          <p className="text-gray-400 mb-6">
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login...
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
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Nueva Contraseña</h1>
          <p className="text-gray-400">
            Ingresa tu nueva contraseña para completar la recuperación
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando contraseña...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Restablecer contraseña
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link 
            href="/auth/signin" 
            className="text-sm text-gray-400 hover:text-white flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}