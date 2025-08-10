import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Types optimizados
export interface Order {
  id: string
  orderNumber: string
  customerName: string | null
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string | null
  shippingAddress: string | null
  city: string | null
  country: string | null
  phone: string | null
  notes: string | null
  adminNotes?: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  quantity: number
  price: number
  productName: string
  size?: string | null
  color?: string | null
  total: number
  product: {
    id: string
    name: string
    image1: string
    price: number
  }
}

export interface Product {
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

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  address: string | null
  city: string | null
  country: string | null
  createdAt: string
  updatedAt: string
  stats: {
    totalOrders: number
    totalSpent: number
    paidOrders: number
  }
}

export interface DashboardMetrics {
  orders: {
    total: number
    today: number
    pending: number
    thisMonth: number
  }
  revenue: {
    total: number
    today: number
    thisMonth: number
  }
  products: {
    total: number
    lowStock: number
    inactive: number
  }
  users: {
    total: number
    newThisMonth: number
  }
}

export interface AdminAllData {
  orders: Order[]
  products: Product[]
  users: User[]
  dashboard: {
    metrics: DashboardMetrics
    recentOrders: Array<{
      id: string
      orderNumber: string
      customerName: string | null
      customerEmail: string
      total: number
      status: string
      paymentStatus: string
      itemCount: number
      createdAt: string
    }>
    topProducts: Array<{
      id: number
      name: string
      image1: string
      price: number
      totalSold: number
      orderCount: number
    }>
  }
  meta: {
    timestamp: string
    totalRecords: {
      orders: number
      products: number
      users: number
    }
  }
}

// API Definition con CARGA ÚNICA
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/admin',
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['AdminAll', 'Order', 'Product', 'User'],
  endpoints: (builder) => ({
    
    // 🚀 ENDPOINT PRINCIPAL - Carga TODO de una vez
    getAllAdminData: builder.query<AdminAllData, void>({
      query: () => '/all',
      providesTags: ['AdminAll'],
      // Configuración de cache agresiva
      keepUnusedDataFor: 60 * 60, // 1 hora de cache
    }),
    
    // 📝 MUTATIONS para updates específicos
    updateOrderStatus: builder.mutation<
      { order: Order }, 
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      // Optimistic update
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Update inmediato en el cache
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
            const order = draft.orders.find(o => o.id === id)
            if (order) {
              order.status = status
              order.updatedAt = new Date().toISOString()
            }
            
            // También actualizar dashboard metrics si es necesario
            if (status === 'DELIVERED') {
              // Lógica para actualizar métricas
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          // Revert en caso de error
          patchResult.undo()
        }
      },
      invalidatesTags: ['AdminAll'], // Re-sync eventual
    }),
    
    updateOrder: builder.mutation<
      { order: Order }, 
      { id: string; updates: Partial<Order> }
    >({
      query: ({ id, updates }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
            const order = draft.orders.find(o => o.id === id)
            if (order) {
              Object.assign(order, updates)
              order.updatedAt = new Date().toISOString()
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['AdminAll'],
    }),
    
    updateProduct: builder.mutation<
      { product: Product }, 
      { id: number; updates: Partial<Product> }
    >({
      query: ({ id, updates }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
            const product = draft.products.find(p => p.id === id)
            if (product) {
              Object.assign(product, updates)
              product.updatedAt = new Date().toISOString()
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['AdminAll'],
    }),
    
    createProduct: builder.mutation<
      { product: Product }, 
      Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
    >({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      async onQueryStarted(newProduct, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Agregar el nuevo producto al cache
          dispatch(
            adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
              draft.products.unshift(data.product)
              draft.dashboard.metrics.products.total++
            })
          )
        } catch {
          // Error handling
        }
      },
      invalidatesTags: ['AdminAll'],
    }),
    
    deleteProduct: builder.mutation<
      { success: boolean }, 
      number
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
            draft.products = draft.products.filter(p => p.id !== id)
            draft.dashboard.metrics.products.total--
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['AdminAll'],
    }),
    
    updateUser: builder.mutation<
      { user: User }, 
      { id: string; updates: Partial<User> }
    >({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      async onQueryStarted({ id, updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminApi.util.updateQueryData('getAllAdminData', undefined, (draft) => {
            const user = draft.users.find(u => u.id === id)
            if (user) {
              Object.assign(user, updates)
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['AdminAll'],
    }),
  }),
})

// Export hooks
export const {
  // Query principal
  useGetAllAdminDataQuery,
  
  // Mutations optimistas
  useUpdateOrderStatusMutation,
  useUpdateOrderMutation,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateUserMutation,
  
  // Utils para manipulación de cache
  util: adminApiUtil
} = adminApi