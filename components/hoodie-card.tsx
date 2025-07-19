"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
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

  const handleAddToCart = () => {
    const product: Product = {
      id,
      name: title,
      price,
      image1: image,
      image2: image, // Use same image for now if no second image
    }
    addItem(product)
  }

  const isOutOfStock = stock <= 0

  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        {description && (
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{description}</p>
        )}
        <p className="text-gray-400 mb-4">${price.toFixed(2)}</p>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? "Agotado" : "Agregar al Carrito"}
        </Button>
      </div>
    </div>
  )
}
