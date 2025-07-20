"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/types"

interface HoodieCardProps {
  id: number
  title: string
  price: number
  image: string
  description?: string
  sizes?: string[]
  colors?: string[]
  stock?: number
}

export function HoodieCard({ id, title, price, image, description, stock = 0 }: HoodieCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const product: Product = {
      id,
      name: title,
      price,
      image1: image,
      image2: image,
    }
    addItem(product)
  }

  const isOutOfStock = stock <= 0
  const isLowStock = stock > 0 && stock <= 5

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/products/${id}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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
            </div>

            {/* Overlay with view button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button size="sm" variant="secondary" className="gap-2">
                <Eye className="h-4 w-4" />
                Ver detalle
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            {description && (
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}
            
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
      </Link>
      
      <CardFooter className="pt-0 px-4 pb-4">
        <Button 
          className="w-full gap-2" 
          onClick={handleAddToCart}
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
