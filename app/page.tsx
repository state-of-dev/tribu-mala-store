"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import { HoodieCard } from "@/components/hoodie-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

// Dynamic import for better performance
const AutoSliderBanner = dynamic(() => import("@/components/auto-slider-banner").then(mod => ({ default: mod.AutoSliderBanner })), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse-fast rounded-lg" />
})

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image1: string
  image2: string | null
  image3: string | null
  category: string | null
  sizes: string[]
  colors: string[]
  slug: string | null
  isFeatured: boolean
  isActive: boolean
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceRange, setPriceRange] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      
      // Construir parámetros de búsqueda
      const params = new URLSearchParams()
      params.append('limit', '50') // Más productos para tener mejor filtrado
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (priceRange && priceRange !== 'all-prices') {
        const [min, max] = priceRange.split('-').map(Number)
        if (min) params.append('minPrice', min.toString())
        if (max) params.append('maxPrice', max.toString())
      }
      
      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, priceRange])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/products?limit=1000') // Obtener todos los productos para extraer categorías
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const categories = [...new Set(data.products.map((p: Product) => p.category).filter(Boolean))] as string[]
          setAllCategories(categories)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Debounce para la búsqueda en tiempo real
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        fetchProducts()
      }, 300) // 300ms delay

      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm])

  // Fetch inmediato para filtros de categoría y precio
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, priceRange])

  // Los productos ya vienen filtrados desde la API
  const filteredProducts = products

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange("all-prices")
  }

  const getUniqueCategories = () => {
    return allCategories
  }

  const hasActiveFilters = searchTerm || (selectedCategory && selectedCategory !== 'all') || (priceRange && priceRange !== 'all-prices')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Full-screen Auto-sliding Banner */}
      <AutoSliderBanner />

      {/* Product Section */}
      <section id="product-section" className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Nuestra Colección</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubre nuestra colección completa con diseños exclusivos y materiales de alta calidad
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {[searchTerm, selectedCategory, priceRange].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Category Filter */}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Categoría</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {getUniqueCategories().map((category) => (
                          <SelectItem key={category} value={category || "unknown"}>
                            {category || "Sin categoría"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Rango de precio</label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los precios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-prices">Todos los precios</SelectItem>
                        <SelectItem value="0-500">$0 - $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                        <SelectItem value="2000">$2,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2 flex-wrap">
                      {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Búsqueda: "{searchTerm}"
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                        </Badge>
                      )}
                      {selectedCategory && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Categoría: {selectedCategory}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                        </Badge>
                      )}
                      {priceRange && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Precio: ${priceRange.replace('-', ' - $')}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange("")} />
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {hasActiveFilters ? (
                `Encontrados ${filteredProducts.length} productos${searchTerm ? ` para "${searchTerm}"` : ''}`
              ) : (
                `Mostrando ${filteredProducts.length} productos`
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando productos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <HoodieCard 
                  key={product.id} 
                  id={product.id}
                  title={product.name}
                  price={product.price}
                  image={product.image1}
                  description={product.description || ''}
                  sizes={product.sizes}
                  colors={product.colors}
                  stock={product.stock}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No se encontraron productos con los filtros aplicados</p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
