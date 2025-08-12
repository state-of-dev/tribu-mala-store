"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export interface ProductVariant {
  size: string
  color: string
  stock: number
  id?: string
}

interface ProductVariantsManagerProps {
  variants: ProductVariant[]
  onVariantsChange: (variants: ProductVariant[]) => void
  category: string
}

export function ProductVariantsManager({ 
  variants, 
  onVariantsChange, 
  category 
}: ProductVariantsManagerProps) {
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const commonColors = ['Black', 'White', 'Gray', 'Navy', 'Cream', 'Red', 'Blue', 'Green']

  const addVariant = () => {
    const newVariant: ProductVariant = {
      size: '',
      color: '',
      stock: 0,
      id: Date.now().toString()
    }
    onVariantsChange([...(variants || []), newVariant])
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    const updatedVariants = (variants || []).map(variant =>
      variant.id === id ? { ...variant, [field]: value } : variant
    )
    onVariantsChange(updatedVariants)
  }

  const removeVariant = (id: string) => {
    const filteredVariants = (variants || []).filter(variant => variant.id !== id)
    onVariantsChange(filteredVariants)
  }

  const calculateTotalStock = () => {
    return variants?.reduce((total, variant) => total + variant.stock, 0) || 0
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Gestión de Variantes</h3>
          <p className="text-sm text-muted-foreground">
            {category === 'Accessories' 
              ? 'Para accesorios, agrega solo una variante con cantidad total' 
              : 'Define tallas, colores y stock para cada combinación'}
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
          Stock Total: <span className="font-medium text-foreground">{calculateTotalStock()}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {!variants || variants.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground mb-4">No hay variantes definidas</p>
            <Button type="button" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Variante
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {variants?.map((variant) => (
                <div key={variant.id} className="flex items-end gap-3 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Talla</Label>
                      <Select 
                        value={variant.size} 
                        onValueChange={(value) => updateVariant(variant.id!, 'size', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {category === 'Accessories' ? (
                            <SelectItem value="Única">Única</SelectItem>
                          ) : (
                            commonSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Color</Label>
                      <Select 
                        value={variant.color} 
                        onValueChange={(value) => updateVariant(variant.id!, 'color', value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Stock</Label>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id!, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="h-10"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVariant(variant.id!)}
                    className="h-10 w-10 p-0 bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button type="button" variant="outline" onClick={addVariant} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Variante
            </Button>
          </>
        )}
      </div>
    </div>
  )
}