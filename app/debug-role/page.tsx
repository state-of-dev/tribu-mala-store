"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugRole() {
  const { data: session, status } = useSession()
  const [debugResult, setDebugResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAuthAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug-auth')
      const data = await response.json()
      setDebugResult(data)
    } catch (error) {
      setDebugResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🐛 Debug de Sesión y Rol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {session ? (
              <div className="space-y-2">
                <div>
                  <strong>Email:</strong> {session.user?.email}
                </div>
                <div>
                  <strong>Nombre:</strong> {session.user?.name}
                </div>
                <div>
                  <strong>ID:</strong> {session.user?.id}
                </div>
                <div>
                  <strong>Rol:</strong> {session.user?.role || 'NO ROLE DEFINED'}
                </div>
                
                <div className="mt-4 p-4 bg-gray-100 rounded">
                  <strong>¿Puede acceder a admin?</strong>
                  <br />
                  {session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN' 
                    ? '✅ SÍ - Puede acceder' 
                    : '❌ NO - Sin permisos'}
                </div>
                
                <div className="space-y-2 mt-4">
                  <Button 
                    onClick={testAuthAPI} 
                    disabled={loading}
                    className="w-full"
                    variant="secondary"
                  >
                    {loading ? 'Probando...' : '🔍 Probar API Auth'}
                  </Button>
                  
                  <Button asChild className="w-full">
                    <a href="/admin">Ir a Dashboard Admin</a>
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <a href="/api/auth/signout">Cerrar Sesión</a>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                No hay sesión activa
                <br />
                <Button asChild className="mt-2">
                  <a href="/auth/signin">Iniciar Sesión</a>
                </Button>
              </div>
            )}
            
            {debugResult && (
              <div className="mt-4 p-4 bg-gray-900 text-white rounded text-xs">
                <strong>🔍 Resultado Debug API:</strong>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(debugResult, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-blue-50 rounded text-sm">
              <strong>🔍 Instrucciones:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Asegúrate de haber cerrado sesión completamente</li>
                <li>Inicia sesión con: admin@tribumala.com / admin123</li>
                <li>Verifica que el rol aparezca como "SUPER_ADMIN"</li>
                <li>Haz clic en "🔍 Probar API Auth" para verificar APIs</li>
                <li>Si no aparece el rol, hay un problema en NextAuth</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}