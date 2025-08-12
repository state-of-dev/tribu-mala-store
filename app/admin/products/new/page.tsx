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
  Plus,
  Upload,
  Image as ImageIcon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ProductVariantsManager, ProductVariant } from "@/components/admin/product-variants-manager"
import { ImageManager } from "@/components/admin/image-manager"
import { ProductPreviewCard } from "@/components/admin/product-preview-card"

interface ProductFormData {
  name: string
  description: string
  price: string
  images: string[]
  category: string
  variants: ProductVariant[]
  isActive: boolean
}

export default function NewProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    images: [''], // Imagen principal vacía inicialmente
    category: '',
    variants: [],
    isActive: true
  })

  const [uploadingImages, setUploadingImages] = useState<boolean[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']

  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[] | ProductVariant[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addImageSlot = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImage = (index: number) => {
    if (index === 0) return // No permitir eliminar la imagen principal
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    
    // Limpiar preview si existe
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setUploadingImages(prev => prev.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? url : img)
    }))
  }


  const handleImageUpload = async (file: File, imageField: string) => {
    try {
      setUploadingImages(prev => ({ ...prev, [imageField]: true }))

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreviewImages(prev => ({ ...prev, [imageField]: previewUrl }))

      const filename = `products/${Date.now()}-${file.name}`
      const response = await fetch(`/api/upload?filename=${filename}`, {
        method: 'POST',
        body: file
      })

      if (!response.ok) {
        throw new Error('Error uploading image')
      }

      const data = await response.json()
      
      if (data.success) {
        handleInputChange(imageField as keyof ProductFormData, data.url)
        toast({
          title: "Imagen subida",
          description: "La imagen se ha subido correctamente",
        })
      } else {
        throw new Error(data.error || 'Error uploading image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Error al subir la imagen",
        variant: "destructive"
      })
      // Remove preview on error
      setPreviewImages(prev => {
        const newPrev = { ...prev }
        delete newPrev[imageField]
        return newPrev
      })
    } finally {
      setUploadingImages(prev => ({ ...prev, [imageField]: false }))
    }
  }

  // Calcular stock total automáticamente
  const calculateTotalStock = () => {
    return formData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0
  }


  const handleSave = async () => {
    try {
      setSaving(true)

      // Validación básica
      if (!formData.name || !formData.price || !formData.images[0]) {
        toast({
          title: "Error de validación",
          description: "Nombre, precio e imagen principal son requeridos",
          variant: "destructive"
        })
        return
      }

      // Validación de variantes
      if (!formData.variants || formData.variants.length === 0) {
        toast({
          title: "Error de validación",
          description: "Debe agregar al menos una variante con talla, color y stock",
          variant: "destructive"
        })
        return
      }

      const createData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image1: formData.images[0] || '',
        image2: formData.images[1] || '',
        image3: formData.images[2] || '',
        category: formData.category,
        isActive: formData.isActive,
        stock: calculateTotalStock(), // Stock calculado automáticamente
        variants: formData.variants
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
                        onChange={(e) => handleInputChange('name', e.target.value)}
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
                        <Label htmlFor="price" className="block mb-2">Precio ($MXN) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="149.99"
                          className="h-10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="block mb-2">Categoría</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="h-10">
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
                      <div>
                        <Label htmlFor="isActive" className="block mb-2">Producto Activo</Label>
                        <div className="h-10 flex items-center justify-center border rounded-md bg-background">
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Imágenes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Imágenes del Producto</CardTitle>
                    <CardDescription>
                      Sube las imágenes de tu producto (la primera es obligatoria)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageManager 
                      images={formData.images}
                      onImagesChange={(images) => handleInputChange('images', images)}
                    />
                  </CardContent>
                </Card>

                {/* Gestión de Variantes */}
                <ProductVariantsManager
                  variants={formData.variants}
                  onVariantsChange={(variants) => handleInputChange('variants', variants)}
                  category={formData.category}
                />
              </div>

              {/* Columna Lateral */}
              <div className="space-y-6">
                {/* Resumen del Producto */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Stock Total:</span>
                      <span className="font-medium">{calculateTotalStock()} unidades</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Variantes:</span>
                      <span className="font-medium">{formData.variants?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Imágenes:</span>
                      <span className="font-medium">{formData.images?.filter(img => img).length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <span className={`text-sm font-medium ${
                        formData.isActive ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {formData.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Vista Previa */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
                  <ProductPreviewCard
                    name={formData.name}
                    price={formData.price}
                    images={formData.images}
                    category={formData.category}
                    isActive={formData.isActive}
                    stock={calculateTotalStock()}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}