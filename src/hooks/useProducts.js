import { useState, useEffect } from 'react'
import { fetchProducts, fetchStore } from '../api/mugikari'

const SITE_LOCK_ID = '84f71c40-a584-4278-bc42-5e38eb7ae53d'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [galleryProducts, setGalleryProducts] = useState([])
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lockEnabled, setLockEnabled] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [prods, storeData] = await Promise.all([fetchProducts(), fetchStore()])
        if (cancelled) return
        const visible = prods.filter(p => p.id !== SITE_LOCK_ID)
        setLockEnabled(prods.some(p => p.id === SITE_LOCK_ID))
        setProducts(visible.filter(p => p.status !== 'gallery'))
        setGalleryProducts(visible.filter(p => p.status === 'gallery'))
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

  return { products, galleryProducts, store, loading, error, lockEnabled }
}
