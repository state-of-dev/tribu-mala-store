"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { 
  Star, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
  Check
} from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image1: string
  image2: string | null
  image3: string | null
  category: string | null
  stock: number
  sizes: string[]
  colors: string[]
  slug: string | null
  metaTitle: string | null
  metaDescription: string | null
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProductDetail() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Producto no encontrado')
      }
      
      const data = await response.json()
      
      if (data.success && data.product) {
        setProduct(data.product)
        setSelectedImage(data.product.image1)
      } else {
        throw new Error(data.error || 'Producto no encontrado')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image1: product.image1,
      image2: product.image2 || product.image1
    }
    
    // Add the item the selected number of times
    for (let i = 0; i < quantity; i++) {
      addItem(cartProduct)
    }
    
    toast.success("Producto añadido al carrito", {
      description: `${quantity} ${product.name} añadido${quantity > 1 ? 's' : ''} al carrito`,
    })
  }

  const images = product ? [
    product.image1,
    product.image2,
    product.image3
  ].filter(Boolean) : []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Producto no encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error || 'El producto que buscas no existe o ha sido eliminado'}
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === image ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del Producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Últimas {product.stock} unidades
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Sin stock</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.8)</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "Este producto no tiene descripción disponible."}
            </p>
          </div>

          <Separator />

          {/* Cantidad y Botones */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Cantidad:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-muted transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-green-600" />
                <span>{product.stock} disponibles</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleAddToCart} 
                className="flex-1"
                disabled={product.stock === 0}
              >
                Añadir al Carrito
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Información Adicional */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Envío gratis en pedidos superiores a 50€</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>Devoluciones gratuitas hasta 30 días</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Garantía de 2 años incluida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}