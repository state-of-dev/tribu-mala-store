"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { 
  Package, 
  Search, 
  Edit, 
  Plus,
  AlertTriangle,
  Trash2,
  Star,
  Filter,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"
import { useAdminProducts } from "@/hooks/use-cached-fetch"
import { useSmoothLoading } from "@/hooks/use-smooth-loading"
import { FadeIn, StaggerContainer } from "@/components/ui/fade-in"
import { useAlertModal } from "@/components/ui/alert-modal"

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  image1: string
  image2: string | null
  category: string | null
  isActive: boolean
  isFeatured: boolean
  createdAt: string
}

interface ProductsData {
  products: Product[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export default function AdminProducts() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { showAlert, showConfirm, AlertModalComponent } = useAlertModal()

  // Usar el hook optimizado con cache
  const { 
    data: productsData, 
    error, 
    refetch: fetchProducts,
    invalidateCache 
  } = useAdminProducts({
    isActive: activeFilter !== 'all' ? activeFilter : undefined
  })

  const { showSkeleton, showContent } = useSmoothLoading({ 
    data: productsData,
    minLoadingTime: 300
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const getProductStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/10 text-green-500 border-green-500/20'
      : 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return 'bg-red-500/10 text-red-500 border-red-500/20'
    if (stock <= 5) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    return 'bg-green-500/10 text-green-500 border-green-500/20'
  }

  const handleDeleteProduct = (productId: number, productName: string) => {
    showConfirm(
      "Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          setDeletingId(productId)
          
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            throw new Error('Error al eliminar el producto')
          }

          const result = await response.json()

          // Invalidar cache y refrescar lista
          invalidateCache()
          await fetchProducts()

          showAlert("¡Éxito!", result.message || 'Producto eliminado exitosamente')
        } catch (error) {
          console.error('Error al eliminar producto:', error)
          showAlert("Error", "Hubo un problema al eliminar el producto. Inténtalo de nuevo.", "Aceptar", "destructive")
        } finally {
          setDeletingId(null)
        }
      },
      "Eliminar",
      "Cancelar",
      "destructive"
    )
  }

  // Memoizar el filtrado para evitar recálculos innecesarios
  const filteredProducts = useMemo(() => {
    if (!productsData?.products) return []
    
    if (!searchTerm) return productsData.products
    
    const searchLower = searchTerm.toLowerCase()
    return productsData.products.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower))
    )
  }, [productsData?.products, searchTerm])


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
                      <BreadcrumbLink href="/admin">Panel de Administración</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Productos</BreadcrumbPage>
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
                  <Button onClick={fetchProducts}>
                    Reintentar
                  </Button>
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
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">
                      Admin Panel
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Productos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
              <p className="text-muted-foreground">
                Administra el catálogo completo de productos de la tienda
              </p>
            </div>

            {/* Búsqueda y Filtro */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                size="sm"
                onClick={() => router.push('/admin/products/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo
              </Button>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">{productsData?.pagination.total || 0}</div>
                    )}
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total productos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {productsData?.products.filter(p => p.isActive).length || 0}
                      </div>
                    )}
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Activos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {productsData?.products.filter(p => !p.isActive).length || 0}
                      </div>
                    )}
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Inactivos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {showSkeleton ? (
                      <div className="h-8 w-12 bg-muted rounded animate-pulse" />
                    ) : (
                      <div className="text-2xl font-bold">
                        {productsData?.products.filter(p => p.stock <= 5).length || 0}
                      </div>
                    )}
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Poco stock</p>
                </CardContent>
              </Card>
            </div>

            {/* Productos Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {showSkeleton ? (
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  ) : (
                    `Productos (${filteredProducts.length})`
                  )}
                </CardTitle>
                <CardDescription>
                  Catálogo completo de productos con información de stock y estado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showSkeleton ? (
                  // Skeleton loading para productos
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="rounded-lg border bg-card/50 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-muted" />
                        <div className="p-4 space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <div className="h-5 w-32 bg-muted rounded" />
                              <div className="h-4 w-16 bg-muted rounded" />
                            </div>
                            <div className="h-6 w-20 bg-muted rounded" />
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-8 bg-muted rounded text-xs" />
                                <div className="h-5 w-14 bg-muted rounded-full" />
                              </div>
                              <div className="h-3 w-16 bg-muted rounded" />
                            </div>
                            <div className="h-8 w-full bg-muted rounded" />
                          </div>
                          <div className="flex justify-between pt-2">
                            <div className="flex gap-2">
                              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                              <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : showContent && filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                    <p className="text-muted-foreground">
                      No hay productos que coincidan con los filtros aplicados.
                    </p>
                  </div>
                ) : showContent ? (
                  <FadeIn>
                    <StaggerContainer>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="relative overflow-hidden rounded-lg border bg-card/50 transition-all duration-300 ease-out hover:shadow-md hover:border-accent-foreground/20 hover:translate-y-[-2px] hover:scale-[1.005] group"
                      >
                        {/* Subtle shine effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                        <div className="aspect-square relative">
                          <Image 
                            src={product.image1} 
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                          />
                          {product.isFeatured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                                <Star className="h-3 w-3 mr-1" />
                                Destacado
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-card-foreground line-clamp-2">{product.name}</h3>
                              <Badge className={`${getProductStatusColor(product.isActive)} text-xs font-medium border shrink-0 relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full group-hover:translate-x-full" />
                                {product.isActive ? (
                                  <>
                                    <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                    Activo
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-2.5 w-2.5 mr-1" />
                                    Inactivo
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Stock:</span>
                                <Badge className={`${getStockStatusColor(product.stock)} text-xs relative overflow-hidden`}>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out -translate-x-full hover:translate-x-full" />
                                  {product.stock === 0 ? (
                                    <>
                                      <XCircle className="h-2.5 w-2.5 mr-1" />
                                      Agotado
                                    </>
                                  ) : product.stock <= 5 ? (
                                    <>
                                      <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                                      Bajo ({product.stock})
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                      {product.stock} unidades
                                    </>
                                  )}
                                </Badge>
                              </div>
                              <span className="text-muted-foreground">
                                {product.category || 'Sin categoría'}
                              </span>
                            </div>
                            
                            {product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = `/admin/products/${product.id}/edit`}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-primary hover:text-primary hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled={deletingId === product.id}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 hover:border-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                              >
                                {deletingId === product.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Eliminando...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Eliminar
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                      </div>
                    </StaggerContainer>
                  </FadeIn>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <AlertModalComponent />
    </div>
  )
}