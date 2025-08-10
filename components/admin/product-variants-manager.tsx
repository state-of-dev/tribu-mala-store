"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw,
  Package
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductVariant {
  id?: string
  size: string
  color: string
  stock: number
  sku?: string
}

interface ProductVariantsManagerProps {
  productId: number
  availableSizes: string[]
  availableColors: string[]
  onVariantsChange?: (variants: ProductVariant[]) => void
}

export function ProductVariantsManager({ 
  productId, 
  availableSizes, 
  availableColors, 
  onVariantsChange 
}: ProductVariantsManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (productId) {
      loadVariants()
    }
  }, [productId])

  const loadVariants = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`)
      
      if (response.ok) {
        const data = await response.json()
        setVariants(data.variants || [])
      }
    } catch (error) {
      console.error('Error loading variants:', error)
    } finally {
    }
  }

  const generateAllVariants = () => {
    const newVariants: ProductVariant[] = []
    
    availableSizes.forEach(size => {
      availableColors.forEach(color => {
        // Solo agregar si no existe ya
        const exists = variants.some(v => v.size === size && v.color === color)
        if (!exists) {
          newVariants.push({
            size,
            color,
            stock: 0,
            sku: `${productId}-${size}-${color}`.toUpperCase()
          })
        }
      })
    })

    const updatedVariants = [...variants, ...newVariants]
    setVariants(updatedVariants)
    onVariantsChange?.(updatedVariants)
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updatedVariants = [...variants]
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    }
    setVariants(updatedVariants)
    onVariantsChange?.(updatedVariants)
  }

  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index)
    setVariants(updatedVariants)
    onVariantsChange?.(updatedVariants)
  }

  const saveVariants = async () => {
    try {
      setSaving(true)
      
      const response = await fetch(`/api/admin/products/${productId}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ variants })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar variantes')
      }

      toast({
        title: "Variantes guardadas",
        description: "Las variantes se han guardado exitosamente",
      })
      
      loadVariants()
    } catch (error) {
      console.error('Error saving variants:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error al guardar variantes',
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getTotalStock = () => {
    return variants.reduce((total, variant) => total + variant.stock, 0)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestión de Variantes
            </CardTitle>
            <CardDescription>
              Stock individual por talla y color
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Stock Total: {getTotalStock()}
            </Badge>
            <Button onClick={loadVariants} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={generateAllVariants} 
            variant="outline"
            disabled={availableSizes.length === 0 || availableColors.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generar Todas las Variantes
          </Button>
          <Button 
            onClick={saveVariants} 
            disabled={saving || variants.length === 0}
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Guardando...' : 'Guardar Variantes'}
          </Button>
        </div>

        {/* Variants Table */}
        {variants.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Talla</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-16">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant, index) => (
                  <TableRow key={`${variant.size}-${variant.color}`}>
                    <TableCell>
                      <Badge variant="outline">{variant.size}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{variant.color}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={variant.sku || ''}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder="SKU opcional"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay variantes configuradas</p>
            <p className="text-sm">Agrega tallas y colores primero, luego genera las variantes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}