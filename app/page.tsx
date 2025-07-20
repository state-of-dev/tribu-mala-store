"use client"

import { useEffect, useState } from "react"
import { HoodieCard } from "@/components/hoodie-card"
import { AutoSliderBanner } from "@/components/auto-slider-banner"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?featured=true&limit=8')
      
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
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Full-screen Auto-sliding Banner */}
      <AutoSliderBanner />

      {/* Product Section */}
      <section id="product-section" className="w-full py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Últimas Novedades</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubre nuestra colección más reciente con diseños exclusivos y materiales de alta calidad
            </p>
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
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
