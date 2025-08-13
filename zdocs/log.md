✓ Compiled in 3s (1229 modules)
 ⨯ ./app/admin/products/[id]/edit/page.tsx
Error:
  × the name `handleInputChange` is defined multiple times
     ╭─[C:\lffg\state-of-dev\tribu-mala-store\app\admin\products\[id]\edit\page.tsx:90:1]
  90 │
  91 │   const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']
  92 │
  93 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | ProductVariant[]) => {
     ·         ────────┬────────
     ·                 ╰── previous definition of `handleInputChange` here
  94 │     setFormData(prev => ({
  95 │       ...prev,
  96 │       [field]: value
  97 │     }))
  98 │   }
  99 │
 100 │   // Calcular stock total automáticamente
 101 │   const calculateTotalStock = () => {
 102 │     return formData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0
 103 │   }
 104 │
 105 │   useEffect(() => {
 106 │     fetchProduct()
 107 │   }, [params.id])
 108 │
 109 │   const fetchProduct = async () => {
 110 │     try {
 111 │       const response = await fetch(`/api/admin/products/${params.id}`)
 112 │
 113 │       if (!response.ok) {
 114 │         throw new Error('Error al cargar el producto')
 115 │       }
 116 │
 117 │       const data = await response.json()
 118 │       const productData = data.product
 119 │
 120 │       setProduct(productData)
 121 │       setFormData({
 122 │         name: productData.name || '',
 123 │         description: productData.description || '',
 124 │         price: productData.price?.toString() || '',
 125 │         stock: productData.stock?.toString() || '',
 126 │         image1: productData.image1 || '',
 127 │         image2: productData.image2 || '',
 128 │         image3: productData.image3 || '',
 129 │         category: productData.category || '',
 130 │         sizes: productData.sizes || [],
 131 │         colors: productData.colors || [],
 132 │         slug: productData.slug || '',
 133 │         metaTitle: productData.metaTitle || '',
 134 │         metaDescription: productData.metaDescription || '',
 135 │         isActive: productData.isActive,
 136 │         isFeatured: productData.isFeatured
 137 │       })
 138 │     } catch (error) {
 139 │       console.error('Error:', error)
 140 │       setError(error instanceof Error ? error.message : 'Error desconocido')
 141 │     } finally {
 142 │     }
 143 │   }
 144 │
 145 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
     ·         ────────┬────────
     ·                 ╰── `handleInputChange` redefined here
 146 │     setFormData(prev => ({
 147 │       ...prev,
 148 │       [field]: value
     ╰────

Import trace for requested module:
./app/admin/products/[id]/edit/page.tsx
 ○ Compiling /_error ...
 ⨯ ./app/admin/products/[id]/edit/page.tsx
Error:
  × the name `handleInputChange` is defined multiple times
     ╭─[C:\lffg\state-of-dev\tribu-mala-store\app\admin\products\[id]\edit\page.tsx:90:1]
  90 │
  91 │   const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']
  92 │
  93 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | ProductVariant[]) => {
     ·         ────────┬────────
     ·                 ╰── previous definition of `handleInputChange` here
  94 │     setFormData(prev => ({
  95 │       ...prev,
  96 │       [field]: value
  97 │     }))
  98 │   }
  99 │
 100 │   // Calcular stock total automáticamente
 101 │   const calculateTotalStock = () => {
 102 │     return formData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0
 103 │   }
 104 │
 105 │   useEffect(() => {
 106 │     fetchProduct()
 107 │   }, [params.id])
 108 │
 109 │   const fetchProduct = async () => {
 110 │     try {
 111 │       const response = await fetch(`/api/admin/products/${params.id}`)
 112 │
 113 │       if (!response.ok) {
 114 │         throw new Error('Error al cargar el producto')
 115 │       }
 116 │
 117 │       const data = await response.json()
 118 │       const productData = data.product
 119 │
 120 │       setProduct(productData)
 121 │       setFormData({
 122 │         name: productData.name || '',
 123 │         description: productData.description || '',
 124 │         price: productData.price?.toString() || '',
 125 │         stock: productData.stock?.toString() || '',
 126 │         image1: productData.image1 || '',
 127 │         image2: productData.image2 || '',
 128 │         image3: productData.image3 || '',
 129 │         category: productData.category || '',
 130 │         sizes: productData.sizes || [],
 131 │         colors: productData.colors || [],
 132 │         slug: productData.slug || '',
 133 │         metaTitle: productData.metaTitle || '',
 134 │         metaDescription: productData.metaDescription || '',
 135 │         isActive: productData.isActive,
 136 │         isFeatured: productData.isFeatured
 137 │       })
 138 │     } catch (error) {
 139 │       console.error('Error:', error)
 140 │       setError(error instanceof Error ? error.message : 'Error desconocido')
 141 │     } finally {
 142 │     }
 143 │   }
 144 │
 145 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
     ·         ────────┬────────
     ·                 ╰── `handleInputChange` redefined here
 146 │     setFormData(prev => ({
 147 │       ...prev,
 148 │       [field]: value
     ╰────

Import trace for requested module:
./app/admin/products/[id]/edit/page.tsx
 GET /admin/products/new 500 in 388ms
 ⨯ ./app/admin/products/[id]/edit/page.tsx
Error:
  × the name `handleInputChange` is defined multiple times
     ╭─[C:\lffg\state-of-dev\tribu-mala-store\app\admin\products\[id]\edit\page.tsx:90:1]
  90 │
  91 │   const categories = ['Hoodies', 'T-Shirts', 'Sweatshirts', 'Pants', 'Accessories']
  92 │
  93 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | ProductVariant[]) => {
     ·         ────────┬────────
     ·                 ╰── previous definition of `handleInputChange` here
  94 │     setFormData(prev => ({
  95 │       ...prev,
  96 │       [field]: value
  97 │     }))
  98 │   }
  99 │
 100 │   // Calcular stock total automáticamente
 101 │   const calculateTotalStock = () => {
 102 │     return formData.variants?.reduce((total, variant) => total + variant.stock, 0) || 0
 103 │   }
 104 │
 105 │   useEffect(() => {
 106 │     fetchProduct()
 107 │   }, [params.id])
 108 │
 109 │   const fetchProduct = async () => {
 110 │     try {
 111 │       const response = await fetch(`/api/admin/products/${params.id}`)
 112 │
 113 │       if (!response.ok) {
 114 │         throw new Error('Error al cargar el producto')
 115 │       }
 116 │
 117 │       const data = await response.json()
 118 │       const productData = data.product
 119 │
 120 │       setProduct(productData)
 121 │       setFormData({
 122 │         name: productData.name || '',
 123 │         description: productData.description || '',
 124 │         price: productData.price?.toString() || '',
 125 │         image1: productData.image1 || '',
 126 │         image2: productData.image2 || '',
 127 │         image3: productData.image3 || '',
 128 │         category: productData.category || '',
 129 │         variants: productData.variants || [],
 130 │         isActive: productData.isActive
 131 │       })
 132 │     } catch (error) {
 133 │       console.error('Error:', error)
 134 │       setError(error instanceof Error ? error.message : 'Error desconocido')
 135 │     } finally {
 136 │     }
 137 │   }
 138 │
 139 │   const handleInputChange = (field: keyof ProductFormData, value: string | boolean | string[]) => {
     ·         ────────┬────────
     ·                 ╰── `handleInputChange` redefined here
 140 │     setFormData(prev => ({
 141 │       ...prev,
 142 │       [field]: value
     ╰────

Import trace for requested module:
./app/admin/products/[id]/edit/page.tsx
 GET /_next/static/webpack/e6b6a48b2a973f13.webpack.hot-update.json 500 in 4997ms
 ⚠ Fast Refresh had to perform a full reload. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
 GET /admin/products/new 500 in 132ms
 GET /admin/products/1/edit 500 in 127ms
 GET /admin/products/new 500 in 119ms
 GET /admin/products/new 500 in 102ms
 GET /admin/products/1/edit 500 in 417ms
