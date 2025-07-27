"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  ArrowLeft,
  Loader2,
  X,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductFormData {
  name: string
  description: string
  price: string
  stock: string
  image1: string
  image2: string
  image3: string
  category: string
  sizes: string[]
  colors: string[]
  slug: string
  metaTitle: string
  metaDescription: string
  isActive: boolean
  isFeatured: boolean
}

export default function NewProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '0',
    image1: '',
    image2: '',
    image3: '',
    category: '',
    sizes: [],
    colors: [],
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false
  })

  const [newSize, setNewSize] = useState('')
  const [newColor, setNewColor] = useState('')

  const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const commonColors = ['Black', 'White', 'Gray', 'Navy', 'Cream', 'Red', 'Blue', 'Green']

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      handleInputChange('sizes', [...formData.sizes, size])
    }
    setNewSize('')
  }

  const removeSize = (size: string) => {
    handleInputChange('sizes', formData.sizes.filter(s => s !== size))
  }

  const addColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      handleInputChange('colors', [...formData.colors, color])
    }
    setNewColor('')
  }

  const removeColor = (color: string) => {
    handleInputChange('colors', formData.colors.filter(c => c !== color))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleNameChange = (name: string) => {
    handleInputChange('name', name)
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      handleInputChange('slug', generateSlug(name))
    }
    if (!formData.metaTitle || formData.metaTitle === `${formData.name} - Premium Streetwear`) {
      handleInputChange('metaTitle', `${name} - Premium Streetwear`)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validación básica
      if (!formData.name || !formData.price || !formData.image1) {
        toast({
          title: "Error de validación",
          description: "Nombre, precio e imagen principal son requeridos",
          variant: "destructive"
        })
        return
      }

      const createData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      }

      const response = await fetch(`/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el producto')
      }

      const data = await response.json()

      toast({
        title: "Producto creado",
        description: "El nuevo producto se ha creado exitosamente",
      })

      router.push('/admin/products')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dark">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">Admin Panel</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/products">Productos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Nuevo Producto</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Producto</h1>
                <p className="text-muted-foreground">
                  Añade un nuevo producto a tu catálogo
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/products')}
                  disabled={saving}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Creando...' : 'Crear Producto'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información Básica */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                    <CardDescription>
                      Detalles principales del producto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del Producto *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Ej: Tribu Mala Classic Black Hoodie"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descripción detallada del producto..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Precio ($MXN) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="149.99"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoría</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Imágenes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Imágenes del Producto</CardTitle>
                    <CardDescription>
                      URLs de las imágenes (la primera es obligatoria)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="image1">Imagen Principal *</Label>
                      <Input
                        id="image1"
                        value={formData.image1}
                        onChange={(e) => handleInputChange('image1', e.target.value)}
                        placeholder="https://ejemplo.com/imagen1.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image2">Imagen Secundaria</Label>
                      <Input
                        id="image2"
                        value={formData.image2}
                        onChange={(e) => handleInputChange('image2', e.target.value)}
                        placeholder="https://ejemplo.com/imagen2.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image3">Imagen Terciaria</Label>
                      <Input
                        id="image3"
                        value={formData.image3}
                        onChange={(e) => handleInputChange('image3', e.target.value)}
                        placeholder="https://ejemplo.com/imagen3.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Variantes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Variantes del Producto</CardTitle>
                    <CardDescription>
                      Tallas y colores disponibles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Tallas */}
                    <div>
                      <Label>Tallas Disponibles</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {formData.sizes.map((size) => (
                          <Badge key={size} variant="outline" className="px-3 py-1">
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select value={newSize} onValueChange={setNewSize}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Talla" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonSizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => addSize(newSize)}
                          disabled={!newSize || formData.sizes.includes(newSize)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Añadir
                        </Button>
                      </div>
                    </div>

                    {/* Colores */}
                    <div>
                      <Label>Colores Disponibles</Label>
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {formData.colors.map((color) => (
                          <Badge key={color} variant="outline" className="px-3 py-1">
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Select value={newColor} onValueChange={setNewColor}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonColors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => addColor(newColor)}
                          disabled={!newColor || formData.colors.includes(newColor)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Añadir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Columna Lateral */}
              <div className="space-y-6">
                {/* Estado del Producto */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Producto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive">Producto Activo</Label>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isFeatured">Producto Destacado</Label>
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO</CardTitle>
                    <CardDescription>
                      Optimización para motores de búsqueda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="tribu-mala-classic-black-hoodie"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metaTitle">Meta Título</Label>
                      <Input
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        placeholder="Tribu Mala Classic Black Hoodie - Premium Streetwear"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metaDescription">Meta Descripción</Label>
                      <Textarea
                        id="metaDescription"
                        value={formData.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        placeholder="Descripción para motores de búsqueda..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Vista Previa */}
                {formData.image1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Vista Previa</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={formData.image1}
                          alt={formData.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-semibold line-clamp-1">{formData.name || 'Nombre del producto'}</h3>
                        <p className="text-lg font-bold text-primary">
                          {formData.price ? `${formData.price}` : '$0 MXN.00'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}