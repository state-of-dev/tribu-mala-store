"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductVariant {
  id: string
  size: string
  color: string
  stock: number
  sku?: string
}

interface ProductVariantSelectorProps {
  productId: number
  availableSizes: string[]
  availableColors: string[]
  selectedSize: string | null
  selectedColor: string | null
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
  onVariantChange?: (variant: ProductVariant | null) => void
}

export function ProductVariantSelector({
  productId,
  availableSizes,
  availableColors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onVariantChange
}: ProductVariantSelectorProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (productId) {
      loadVariants()
    }
  }, [productId])

  useEffect(() => {
    // Notificar el cambio de variante cuando se seleccionan size y color
    if (selectedSize && selectedColor) {
      const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor)
      onVariantChange?.(variant || null)
    } else {
      onVariantChange?.(null)
    }
  }, [selectedSize, selectedColor, variants, onVariantChange])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/variants`)
      
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Error loading variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVariantStock = (size: string, color: string) => {
    const variant = variants.find(v => v.size === size && v.color === color)
    return variant?.stock || 0
  }

  const isVariantAvailable = (size: string, color: string) => {
    return getVariantStock(size, color) > 0
  }

  const getAvailableColorsForSize = (size: string) => {
    if (!size) return availableColors
    return availableColors.filter(color => isVariantAvailable(size, color))
  }

  const getAvailableSizesForColor = (color: string) => {
    if (!color) return availableSizes
    return availableSizes.filter(size => isVariantAvailable(size, color))
  }

  const getCurrentVariant = () => {
    if (!selectedSize || !selectedColor) return null
    return variants.find(v => v.size === selectedSize && v.color === selectedColor)
  }

  const currentVariant = getCurrentVariant()
  const availableColorsForSize = getAvailableColorsForSize(selectedSize || '')
  const availableSizesForColor = getAvailableSizesForColor(selectedColor || '')

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Talla {selectedSize && <span className="text-sm text-muted-foreground">({selectedSize})</span>}
        </Label>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const hasAvailableColors = getAvailableColorsForSize(size).length > 0
            const isSelected = selectedSize === size
            
            return (
              <Button
                key={size}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onSizeChange(size)
                  // Reset color if not available for this size
                  if (selectedColor && !getAvailableColorsForSize(size).includes(selectedColor)) {
                    onColorChange('')
                  }
                }}
                disabled={!hasAvailableColors}
                className={cn(
                  "min-w-[3rem]",
                  !hasAvailableColors && "opacity-50 cursor-not-allowed"
                )}
              >
                {size}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Color Selector */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Color {selectedColor && <span className="text-sm text-muted-foreground">({selectedColor})</span>}
        </Label>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => {
            const isAvailable = !selectedSize || availableColorsForSize.includes(color)
            const isSelected = selectedColor === color
            
            return (
              <Button
                key={color}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onColorChange(color)}
                disabled={!isAvailable}
                className={cn(
                  "min-w-[4rem]",
                  !isAvailable && "opacity-50 cursor-not-allowed"
                )}
              >
                {color}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Stock Info */}
      {currentVariant && (
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Stock disponible:</span>
              </div>
              <Badge 
                variant={currentVariant.stock > 10 ? "default" : currentVariant.stock > 0 ? "secondary" : "destructive"}
              >
                {currentVariant.stock > 0 ? `${currentVariant.stock} unidades` : 'Agotado'}
              </Badge>
            </div>
            {currentVariant.sku && (
              <p className="text-xs text-muted-foreground mt-2">
                SKU: {currentVariant.sku}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {(!selectedSize || !selectedColor) && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {!selectedSize && !selectedColor && "Selecciona una talla y color"}
                {selectedSize && !selectedColor && "Selecciona un color"}
                {!selectedSize && selectedColor && "Selecciona una talla"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSize && selectedColor && currentVariant && currentVariant.stock === 0 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Esta combinación está agotada. Prueba otra talla o color.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}