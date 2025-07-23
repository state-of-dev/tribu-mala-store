import { useState, useEffect, useCallback } from 'react'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class ApiCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000 // 5 minutos

  set<T>(key: string, data: T, expiry?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.DEFAULT_EXPIRY
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > item.expiry
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(): void {
    this.cache.clear()
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

const apiCache = new ApiCache()

interface UseCachedFetchOptions {
  cacheKey: string
  cacheExpiry?: number
  enabled?: boolean
}

export function useCachedFetch<T>(
  url: string | null,
  options: UseCachedFetchOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { cacheKey, cacheExpiry, enabled = true } = options

  const fetchData = useCallback(async (bypassCache = false) => {
    if (!url || !enabled) return

    // Intentar obtener de cache primero
    if (!bypassCache) {
      const cached = apiCache.get<T>(cacheKey)
      if (cached) {
        setData(cached)
        setLoading(false)
        return cached
      }
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      // Guardar en cache
      apiCache.set(cacheKey, result, cacheExpiry)
      setData(result)
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [url, cacheKey, cacheExpiry, enabled])

  const refetch = useCallback(() => {
    return fetchData(true) // Bypass cache
  }, [fetchData])

  const invalidateCache = useCallback(() => {
    apiCache.invalidate(cacheKey)
  }, [cacheKey])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  }
}

// Hook específico para productos del admin
export function useAdminProducts(filters?: { isActive?: string; category?: string }) {
  const params = new URLSearchParams()
  if (filters?.isActive) params.set('isActive', filters.isActive)
  if (filters?.category) params.set('category', filters.category)
  
  const url = `/api/admin/products${params.toString() ? `?${params}` : ''}`
  const cacheKey = `admin-products-${params.toString()}`

  return useCachedFetch(url, {
    cacheKey,
    cacheExpiry: 2 * 60 * 1000 // 2 minutos para datos de admin
  })
}

// Hook específico para un producto individual
export function useAdminProduct(id: string | null) {
  const url = id ? `/api/admin/products/${id}` : null
  const cacheKey = `admin-product-${id}`

  return useCachedFetch(url, {
    cacheKey,
    cacheExpiry: 5 * 60 * 1000, // 5 minutos
    enabled: !!id
  })
}