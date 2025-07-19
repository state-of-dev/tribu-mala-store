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
      <section id="product-section" className="w-full py-12 md:py-24 bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-100">Latest Collection</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-gray-100">Cargando productos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <p className="text-gray-400">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
