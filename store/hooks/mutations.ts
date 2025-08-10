import { useDispatch } from 'react-redux'
import { 
  useUpdateOrderStatusMutation, 
  useUpdateProductMutation,
  useUpdateUserRoleMutation,
  useDeleteProductMutation,
  adminApi
} from '../api/adminApi'
import { useAdminNotifications } from '../hooks'

export function useOptimisticMutations() {
  const dispatch = useDispatch()
  const { showNotification } = useAdminNotifications()
  
  const [updateOrderStatus, { isLoading: orderStatusLoading }] = useUpdateOrderStatusMutation()
  const [updateProduct, { isLoading: productLoading }] = useUpdateProductMutation()
  const [updateUserRole, { isLoading: userRoleLoading }] = useUpdateUserRoleMutation()
  const [deleteProduct, { isLoading: deleteProductLoading }] = useDeleteProductMutation()

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap()
      showNotification({
        type: 'success',
        message: `Estado del pedido actualizado a: ${newStatus}`,
        duration: 3000
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error al actualizar el estado del pedido',
        duration: 5000
      })
    }
  }

  const handleProductUpdate = async (productId: number, updates: any) => {
    try {
      await updateProduct({ id: productId, ...updates }).unwrap()
      showNotification({
        type: 'success',
        message: 'Producto actualizado correctamente',
        duration: 3000
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error al actualizar el producto',
        duration: 5000
      })
    }
  }

  const handleUserRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap()
      showNotification({
        type: 'success',
        message: `Rol de usuario actualizado a: ${newRole}`,
        duration: 3000
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error al actualizar el rol del usuario',
        duration: 5000
      })
    }
  }

  const handleProductDelete = async (productId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      await deleteProduct({ id: productId }).unwrap()
      showNotification({
        type: 'success',
        message: 'Producto eliminado correctamente',
        duration: 3000
      })
    } catch (error) {
      showNotification({
        type: 'error',
        message: 'Error al eliminar el producto',
        duration: 5000
      })
    }
  }

  const refreshAllData = () => {
    dispatch(adminApi.util.invalidateTags(['AdminAll']))
    showNotification({
      type: 'info',
      message: 'Actualizando datos...',
      duration: 2000
    })
  }

  return {
    // Mutation functions
    handleOrderStatusUpdate,
    handleProductUpdate,
    handleUserRoleUpdate,
    handleProductDelete,
    refreshAllData,
    
    // Loading states
    isUpdatingOrderStatus: orderStatusLoading,
    isUpdatingProduct: productLoading,
    isUpdatingUserRole: userRoleLoading,
    isDeletingProduct: deleteProductLoading,
    
    // Any loading state
    isPerformingMutation: orderStatusLoading || productLoading || userRoleLoading || deleteProductLoading
  }
}

// Hook especializado para operaciones de orden
export function useOrderMutations() {
  const { handleOrderStatusUpdate, isUpdatingOrderStatus } = useOptimisticMutations()
  
  const updateOrderToConfirmed = (orderId: string) => 
    handleOrderStatusUpdate(orderId, 'CONFIRMED')
  
  const updateOrderToProcessing = (orderId: string) => 
    handleOrderStatusUpdate(orderId, 'PROCESSING')
  
  const updateOrderToShipped = (orderId: string) => 
    handleOrderStatusUpdate(orderId, 'SHIPPED')
  
  const updateOrderToDelivered = (orderId: string) => 
    handleOrderStatusUpdate(orderId, 'DELIVERED')
  
  const updateOrderToCancelled = (orderId: string) => 
    handleOrderStatusUpdate(orderId, 'CANCELLED')

  return {
    updateOrderToConfirmed,
    updateOrderToProcessing,
    updateOrderToShipped,
    updateOrderToDelivered,
    updateOrderToCancelled,
    isUpdatingOrderStatus
  }
}

// Hook especializado para operaciones de producto
export function useProductMutations() {
  const { handleProductUpdate, handleProductDelete, isUpdatingProduct, isDeletingProduct } = useOptimisticMutations()
  
  const updateProductPrice = (productId: number, price: number) =>
    handleProductUpdate(productId, { price })
  
  const updateProductStock = (productId: number, stock: number) =>
    handleProductUpdate(productId, { stock })
  
  const updateProductStatus = (productId: number, isActive: boolean) =>
    handleProductUpdate(productId, { isActive })
  
  const deleteProductById = (productId: number) =>
    handleProductDelete(productId)

  return {
    updateProductPrice,
    updateProductStock,
    updateProductStatus,
    deleteProductById,
    isUpdatingProduct,
    isDeletingProduct
  }
}