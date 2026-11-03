const BASE = import.meta.env.VITE_MUGIKARI_BASE
const STORE = import.meta.env.VITE_MUGIKARI_STORE
const API_KEY = import.meta.env.VITE_MUGIKARI_API_KEY

const storeParam = `storeName=${encodeURIComponent(STORE)}`

function authHeaders() {
  return API_KEY && API_KEY !== 'YOUR_API_KEY'
    ? { 'X-Api-Key': API_KEY }
    : {}
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.error || data.message || `HTTP ${res.status}`
    throw Object.assign(new Error(msg), { status: res.status, data })
  }
  return data
}

function normalizeProduct(p) {
  const images = Array.isArray(p.images)
    ? [...p.images].sort((a, b) => a.position - b.position).map(i => i.url)
    : p.imageUrl
      ? [p.imageUrl]
      : []

  let sizeChart = null
  if (p.sizeChart && typeof p.sizeChart === 'string') {
    try { sizeChart = JSON.parse(p.sizeChart) } catch (_) {}
  } else if (p.sizeChart && typeof p.sizeChart === 'object') {
    sizeChart = p.sizeChart
  }

  return { ...p, images, sizeChart }
}

export async function fetchProducts({ search = '', category = '' } = {}) {
  const params = new URLSearchParams({ storeName: STORE })
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  const data = await request(`${BASE}/api/public/products?${params}`)
  return (data.products || []).map(normalizeProduct)
}

export async function fetchStore() {
  const data = await request(`${BASE}/api/public/store?${storeParam}`)
  return data.store || {}
}

export async function fetchProductById(id) {
  const data = await request(`${BASE}/api/public/products/${id}?${storeParam}`)
  return normalizeProduct(data.product)
}

export async function validateDiscount({ code, subtotal }) {
  return request(`${BASE}/api/public/discounts/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeName: STORE, code, subtotal }),
  })
}

export async function subscribeNewsletter({ email, name }) {
  return request(`${BASE}/api/public/newsletter?${storeParam}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(name ? { email, name } : { email }),
  })
}

export async function submitOrder({ idempotencyKey, customer, items, discountCode, deliveryNotes }) {
  const body = { idempotencyKey, customer, items }
  if (discountCode) body.discountCode = discountCode
  if (deliveryNotes) body.deliveryNotes = deliveryNotes
  const data = await request(`${BASE}/api/public/orders?${storeParam}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return data.order
}
