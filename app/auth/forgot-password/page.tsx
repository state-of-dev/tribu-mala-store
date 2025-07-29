"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email")
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg text-center">
          <div className="text-blue-400 text-6xl mb-4">
            <Mail className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white">Email Enviado</h1>
          <p className="text-gray-400 mb-6">
            Si existe una cuenta con el email <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            El enlace expirará en 15 minutos.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al login
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto bg-dark-800 p-8 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Recuperar Contraseña</h1>
          <p className="text-gray-400">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar enlace de recuperación
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