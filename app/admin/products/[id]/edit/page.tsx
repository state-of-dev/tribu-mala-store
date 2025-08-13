"use client"

import { useEffect, useState } from "react"
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
import { ProductVariantsManager, ProductVariant } from "@/components/admin/product-variants-manager"
import { ImageManager } from "@/components/admin/image-manager"
import { ProductPreviewCard } from "@/components/admin/product-preview-card"
import { 
  Save, 
  ArrowLeft, 
  Upload,
  AlertTriangle,
  Loader2,
  X
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image1: string
  image2: string | null
  image3: string | null
  category: string | null
  variants: ProductVariant[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  images: string[]
  category: string
  variants: ProductVariant[]
  isActive: boolean
}

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  isUploading?: boolean
  onUploadStart?: () => void
  onUploadEnd?: () => void
  required?: boolean
}

function ImageUpload({ 
  label, 
  value, 
  onChange, 
  isUploading, 
  onUploadStart, 
  onUploadEnd, 
  required 
}: ImageUploadProps) {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive"
      })
      return
    }

    try {
      onUploadStart?.()
      
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

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
        onChange(data.url)
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
      setPreview(null)
    } finally {
      onUploadEnd?.()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const currentImage = preview || value

  return (
    <div className="space-y-3">
      <Label>{label} {required && "*"}</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => {
          if (!isUploading) {
            document.getElementById(`file-input-${label}`)?.click()
          }
        }}
      >
        <input
          id={`file-input-${label}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
        
        {currentImage ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={currentImage}
                alt={label}
                className="max-w-full max-h-32 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.jpg'
                }}
              />
              {value && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange('')
                    setPreview(null)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Click para cambiar la imagen
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isUploading ? 'Subiendo imagen...' : 'Arrastra una imagen aquí o click para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF hasta 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    images: [''],
    category: '',
    variants: [],
    isActive: true
  })

  const [isUploading, setIsUploading] = useState({
    image1: false,
    image2: false,
    image3: false
  })

  const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']
  
  const handleInputChange = (field: keyof ProductFormData, value: string | boolean | ProductVariant[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Calcular stock total automáticamente
  const calculateTotalStock = () => {
    return formData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0
  }

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar el producto')
      }
      
      const data = await response.json()
      const productData = data.product
      
      setProduct(productData)
      // Convertir imágenes a array - asegurar que tengamos exactamente 5 slots
      const images = Array(5).fill('')
      if (productData.image1) images[0] = productData.image1
      if (productData.image2) images[1] = productData.image2
      if (productData.image3) images[2] = productData.image3
      
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price?.toString() || '',
        images: images,
        category: productData.category || '',
        variants: productData.variants || [],
        isActive: productData.isActive
      })
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    }
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

      const updateData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        images: formData.images.filter(img => img && img.trim() !== ''), // Solo enviar imágenes no vacías
        category: formData.category,
        isActive: formData.isActive,
        variants: formData.variants
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar el producto')
      }

      toast({
        title: "Producto actualizado",
        description: "Los cambios se han guardado exitosamente",
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

  if (error) {
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
                      <BreadcrumbPage>Editar</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <div className="flex gap-2">
                    <Button onClick={fetchProduct}>
                      Reintentar
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/admin/products')}>
                      Volver a productos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
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
                    <BreadcrumbPage>Editar {product?.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
                <p className="text-muted-foreground">
                  Modifica la información del producto en tu catálogo
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
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Variantes</CardTitle>
                    <CardDescription>
                      Combina tallas, colores y stock para cada variante
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductVariantsManager
                      variants={formData.variants}
                      onVariantsChange={(variants) => handleInputChange('variants', variants)}
                      category={formData.category}
                    />
                  </CardContent>
                </Card>
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