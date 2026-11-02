import { useState, useEffect } from 'react'
import { fetchProducts, fetchStore } from '../api/mugikari'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [prods, storeData] = await Promise.all([fetchProducts(), fetchStore()])
        if (cancelled) return
        setProducts(prods)
        setStore(storeData)
      } catch (err) {
        if (cancelled) return
        setError(err.message || 'Failed to load store data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, store, loading, error }
}
