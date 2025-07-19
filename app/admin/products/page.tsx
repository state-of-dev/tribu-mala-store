"use client"

import { useEffect, useState } from "react"
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
  Filter, 
  Edit, 
  Eye, 
  Plus,
  Download,
  MoreHorizontal,
  Star,
  AlertTriangle,
  TrendingUp,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [productsData, setProductsData] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [activeFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (activeFilter !== 'all') params.set('isActive', activeFilter)
      
      const response = await fetch(`/api/admin/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar productos')
      }
      
      const data = await response.json()
      setProductsData(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
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

  const filteredProducts = productsData?.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  if (loading) {
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
                      <BreadcrumbPage>Productos</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min animate-pulse" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
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

            {/* Filtros y Acciones */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-4">
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
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </div>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{productsData?.pagination.total || 0}</div>
                  <p className="text-sm text-muted-foreground">Total productos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-500">
                    {productsData?.products.filter(p => p.isActive).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Activos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-500">
                    {productsData?.products.filter(p => !p.isActive).length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Inactivos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-500">
                    {productsData?.products.filter(p => p.stock <= 5).length || 0}
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
                  Productos ({filteredProducts.length})
                </CardTitle>
                <CardDescription>
                  Catálogo completo de productos con información de stock y estado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                    <p className="text-muted-foreground">
                      No hay productos que coincidan con los filtros aplicados.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors overflow-hidden"
                      >
                        <div className="aspect-square relative">
                          <img 
                            src={product.image1} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.isFeatured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
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
                              <Badge className={`${getProductStatusColor(product.isActive)} text-xs font-medium border shrink-0`}>
                                {product.isActive ? 'Activo' : 'Inactivo'}
                              </Badge>
                            </div>
                            
                            <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
                            
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Stock:</span>
                                <Badge className={`${getStockStatusColor(product.stock)} text-xs`}>
                                  {product.stock === 0 ? 'Agotado' : 
                                   product.stock <= 5 ? `Bajo (${product.stock})` : 
                                   `${product.stock} unidades`}
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
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Abrir menú</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Ver métricas
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  {product.isFeatured ? 'Quitar destacado' : 'Marcar destacado'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar producto
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}