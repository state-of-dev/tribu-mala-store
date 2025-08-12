"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Eye, ShoppingCart } from "lucide-react"

interface ProductPreviewCardProps {
  name: string
  price: string
  images: string[]
  category: string
  isActive: boolean
  stock: number
}

export function ProductPreviewCard({ 
  name, 
  price, 
  images, 
  category, 
  isActive, 
  stock 
}: ProductPreviewCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const validImages = images.filter(img => img && img.trim() !== '')
  
  const nextImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length)
    }
  }

  const prevImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    }
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount) || 0
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(numAmount)
  }

  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  if (validImages.length === 0) {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden max-w-sm">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-muted rounded-t-lg flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sin imagen</p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {name || 'Nombre del producto'}
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              {category || 'Sin categoría'}
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold text-primary">
                {formatCurrency(price)}
              </span>
              <div className="flex gap-1">
                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                  {isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 px-4 pb-4">
          <Button className="w-full gap-2" disabled>
            <ShoppingCart className="h-4 w-4" />
            Añadir al carrito
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden max-w-sm">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          {/* Imagen principal */}
          <img
            src={validImages[currentImageIndex]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder.jpg'
            }}
          />
          
          {/* Stock badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOutOfStock && (
              <Badge variant="destructive">Sin stock</Badge>
            )}
            {isLowStock && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                ¡Últimas {stock}!
              </Badge>
            )}
            <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
              {isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          
          {/* Badge de número de imágenes */}
          {validImages.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1}/{validImages.length}
            </div>
          )}
          
          
          {/* Indicadores de imagen */}
          {validImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    goToImage(index)
                  }}
                />
              ))}
            </div>
          )}

          {/* Overlay con navegación mejorada */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Área central para el botón de vista previa */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button size="sm" variant="secondary" className="gap-2 pointer-events-auto">
                <Eye className="h-4 w-4" />
                Vista previa
              </Button>
            </div>
            
            {/* Flechas de navegación solo iconos */}
            {validImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 pointer-events-auto transition-colors p-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    prevImage()
                  }}
                >
                  <ChevronLeft className="h-6 w-6 drop-shadow-lg" />
                </button>
                
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 pointer-events-auto transition-colors p-1"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    nextImage()
                  }}
                >
                  <ChevronRight className="h-6 w-6 drop-shadow-lg" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {name || 'Nombre del producto'}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
            {category || 'Sin categoría'}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-primary">
              {formatCurrency(price)}
            </span>
            {stock > 5 && (
              <span className="text-xs text-muted-foreground">
                {stock} disponibles
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-4 pb-4">
        <Button 
          className="w-full gap-2" 
          disabled={isOutOfStock}
          variant={isOutOfStock ? "outline" : "default"}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? "Sin stock" : "Añadir al carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}