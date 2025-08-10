"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { 
  ArrowLeft, 
  Edit,
  AlertTriangle,
  Calendar,
  Package,
  Euro,
  Palette,
  Ruler,
  Globe,
  Eye,
  Star,
  ShoppingCart,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image1: string
  image2: string | null
  image3: string | null
  category: string | null
  sizes: string[]
  colors: string[]
  slug: string | null
  metaTitle: string | null
  metaDescription: string | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export default function ViewProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  
  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: product,
    minLoadingTime: 400
  })

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
      setSelectedImage(productData.image1)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
          <XCircle className="h-3 w-3 mr-1" />
          Sin stock
        </Badge>
      )
    } else if (stock <= 5) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
          <AlertTriangle className="h-3 w-3 mr-1" />
          Poco stock ({stock})
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="border-green-500 text-green-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
          <CheckCircle className="h-3 w-3 mr-1" />
          {stock} unidades
        </Badge>
      )
    }
  }

  const images = [product?.image1, product?.image2, product?.image3].filter(Boolean) as string[]


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
                      <BreadcrumbPage>Ver Producto</BreadcrumbPage>
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

  if (!product) return null

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
                    <BreadcrumbPage>{product.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              {showSkeleton ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-8 w-8 text-primary" />
                      <div>
                        <div className="h-9 w-64 bg-muted rounded animate-pulse mb-2" />
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-36 bg-muted rounded animate-pulse" />
                  </div>
                </>
              ) : showContent ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-8 w-8 text-primary transition-transform duration-200 hover:scale-110" />
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={product.isActive ? "default" : "secondary"} className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                            {product.isActive ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activo
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactivo
                              </>
                            )}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-500 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                              <Star className="h-3 w-3 mr-1" />
                              Destacado
                            </Badge>
                          )}
                          {getStockBadge(product.stock)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/admin/products')}
                      className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <Button 
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                      className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Producto
                    </Button>
                  </div>
                </>
              ) : null}
            </div>

            {showSkeleton ? (
              // Skeleton para todo el contenido
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Skeleton columna principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Skeleton Galería */}
                  <Card className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-32 bg-muted rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="aspect-square rounded-lg bg-muted" />
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square w-20 rounded-lg bg-muted" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Skeleton Información */}
                  <Card className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-40 bg-muted rounded" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="h-5 w-20 bg-muted rounded" />
                        <div className="h-16 w-full bg-muted rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-5 w-32 bg-muted rounded" />
                            <div className="flex gap-2">
                              {[1, 2, 3].map((j) => (
                                <div key={j} className="h-6 w-12 bg-muted rounded" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Skeleton columna lateral */}
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 w-28 bg-muted rounded" />
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="h-8 w-24 bg-muted rounded" />
                        <div className="h-4 w-32 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : showContent ? (
              <FadeIn>
                <StaggerContainer>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Principal - Galería e Información */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Galería de Imágenes */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle>Galería de Imágenes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Imagen Principal */}
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted group-hover:shadow-inner transition-shadow duration-300">
                              <img
                                src={selectedImage || product.image1}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder.jpg'
                                }}
                              />
                            </div>
                            
                            {/* Thumbnails */}
                            {images.length > 1 && (
                              <div className="flex gap-2">
                                {images.map((image, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                                      selectedImage === image 
                                        ? 'border-primary shadow-md' 
                                        : 'border-transparent hover:border-muted-foreground hover:shadow-sm'
                                    }`}
                                  >
                                    <img
                                      src={image}
                                      alt={`${product.name} ${index + 1}`}
                                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                </Card>

                      {/* Información del Producto */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle>Información del Producto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h3 className="font-semibold mb-2">Descripción</h3>
                            <p className="text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                              {product.description || 'Sin descripción'}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 group-hover:text-accent-foreground">
                                <Ruler className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                Tallas Disponibles
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {product.sizes.length > 0 ? (
                                  product.sizes.map((size) => (
                                    <Badge key={size} variant="outline" className="transition-transform duration-200 hover:scale-105">{size}</Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-sm">No especificadas</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2 transition-colors duration-200 group-hover:text-accent-foreground">
                                <Palette className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                Colores Disponibles
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {product.colors.length > 0 ? (
                                  product.colors.map((color) => (
                                    <Badge key={color} variant="outline" className="transition-transform duration-200 hover:scale-105">{color}</Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-sm">No especificados</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* SEO Information */}
                      {(product.metaTitle || product.metaDescription || product.slug) && (
                        <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                              Información SEO
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {product.slug && (
                              <div>
                                <h4 className="font-medium mb-1">URL Slug</h4>
                                <code className="bg-muted px-2 py-1 rounded text-sm transition-colors duration-200 group-hover:bg-accent/30">{product.slug}</code>
                              </div>
                            )}
                            {product.metaTitle && (
                              <div>
                                <h4 className="font-medium mb-1">Meta Título</h4>
                                <p className="text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">{product.metaTitle}</p>
                              </div>
                            )}
                            {product.metaDescription && (
                              <div>
                                <h4 className="font-medium mb-1">Meta Descripción</h4>
                                <p className="text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">{product.metaDescription}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Columna Lateral - Detalles */}
                    <div className="space-y-6">
                      {/* Precio y Stock */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Euro className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            Precio y Stock
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-3xl font-bold text-primary transition-colors duration-200 group-hover:text-accent-foreground">
                              {formatCurrency(product.price)}
                            </div>
                            <p className="text-muted-foreground text-sm transition-colors duration-200 group-hover:text-muted-foreground/80">Precio de venta</p>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Stock actual</span>
                              <span className="font-semibold transition-colors duration-200 group-hover:text-accent-foreground">{product.stock} unidades</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Estado</span>
                              {getStockBadge(product.stock)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Categoría */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle>Categoría</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {product.category ? (
                            <Badge variant="outline" className="text-base px-3 py-1 transition-transform duration-200 hover:scale-105">
                              {product.category}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Sin categoría</span>
                          )}
                        </CardContent>
                      </Card>

                      {/* Fechas */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            Información Temporal
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">Creado</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                              {formatDate(product.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Última actualización</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-muted-foreground/80">
                              {formatDate(product.updatedAt)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Vista Previa del Cliente */}
                      <Card className="relative overflow-hidden transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            Vista del Cliente
                          </CardTitle>
                          <CardDescription>
                            Cómo se ve en la tienda
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            variant="outline" 
                            className="w-full transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => window.open(`/products/${product.id}`, '_blank')}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ver en tienda
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </StaggerContainer>
              </FadeIn>
            ) : null}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}