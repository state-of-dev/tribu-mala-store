"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Edit, Eye, Plus } from "lucide-react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image1: string
  image2: string | null
  category: string | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

interface ProductsData {
  products: Product[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function AdminProducts() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [activeFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeFilter !== 'all') params.set('isActive', activeFilter)
      
      const response = await fetch(`/api/admin/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      
      const data = await response.json()
      setProductsData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const filteredProducts = productsData?.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-black">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchProducts} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-black">Gestión de Productos</h1>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, descripción o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 placeholder:text-black"
              />
            </div>
          </div>
          
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{productsData?.pagination.total || 0}</div>
            <p className="text-sm text-black">Total productos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {productsData?.products.filter(p => p.isActive).length || 0}
            </div>
            <p className="text-sm text-black">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {productsData?.products.filter(p => !p.isActive).length || 0}
            </div>
            <p className="text-sm text-black">Inactivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {productsData?.products.filter(p => p.stock <= 5).length || 0}
            </div>
            <p className="text-sm text-black">Poco stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredProducts.length})</CardTitle>
          <CardDescription className="text-black">
            Gestiona todos los productos de la tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square mb-4">
                    <img 
                      src={product.image1} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-black">{product.name}</h3>
                      <div className="flex gap-1">
                        {product.isActive ? (
                          <Badge variant="default" className="bg-green-500">Activo</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-500 text-white">Inactivo</Badge>
                        )}
                        {product.isFeatured && (
                          <Badge variant="outline" className="bg-yellow-500 text-white">Destacado</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-lg font-bold text-black">{formatCurrency(product.price)}</p>
                    
                    <div className="flex justify-between text-sm text-black">
                      <span>Stock: {product.stock}</span>
                      <span>Categoría: {product.category || 'Sin categoría'}</span>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-black line-clamp-2">{product.description}</p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}