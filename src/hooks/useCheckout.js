import { useState, useRef } from 'react'
import { validateDiscount, submitOrder } from '../api/mugikari'

function buildAddress(f) {
  return [
    f.street,
    f.landmark,
    f.cell ? 'Cell: ' + f.cell : '',
    f.sector ? 'Sector: ' + f.sector : '',
    f.district ? f.district + ' District' : '',
    'Rwanda',
  ].filter(Boolean).join(', ')
}

export function useCheckout(store) {
  const [bag, setBag] = useState([])
  const idCounter = useRef(0)
  const [discount, setDiscount] = useState(null)
  const [discountError, setDiscountError] = useState(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [orderSending, setOrderSending] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const [confirmed, setConfirmed] = useState(null)
  const idemKey = useRef(null)

  function addToBag(product, variantId, variantName, price) {
    const label = variantName ? `${product.name} — ${variantName}` : product.name
    setBag(prev => [...prev, {
      id: idCounter.current++,
      name: label,
      price,
      productId: product.id,
      variantId: variantId || null,
      imageUrl: product.images?.[0] || null,
    }])
  }

  function removeFromBag(id) {
    setBag(prev => prev.filter(item => item.id !== id))
    setDiscount(null)
    setDiscountError(null)
  }

  async function checkDiscount(code) {
    if (!code.trim()) return
    const subtotal = bag.reduce((s, i) => s + i.price, 0)
    setDiscountLoading(true)
    setDiscountError(null)
    try {
      const result = await validateDiscount({ code: code.trim(), subtotal })
      if (result.valid) {
        setDiscount({ ...result, code: code.trim() })
      } else {
        setDiscountError('Invalid code.')
        setDiscount(null)
      }
    } catch (err) {
      const errCode = err.data?.error
      const messages = {
        INVALID_DISCOUNT: 'Invalid code.',
        DISCOUNT_EXPIRED: 'This code has expired.',
        DISCOUNT_NOT_STARTED: 'This code isn\'t active yet.',
        DISCOUNT_EXHAUSTED: 'This code has been used up.',
        MINIMUM_NOT_MET: 'Order total too low for this code.',
      }
      setDiscountError(messages[errCode] || 'Invalid code.')
      setDiscount(null)
    } finally {
      setDiscountLoading(false)
    }
  }

  const shippingFee = store?.defaultShippingFee ?? 0
  const bagSubtotal = bag.reduce((s, i) => s + i.price, 0)
  const discountedSubtotal = discount ? discount.newSubtotal : bagSubtotal
  const total = discountedSubtotal + shippingFee

  async function placeOrder(formFields) {
    if (!idemKey.current) idemKey.current = crypto.randomUUID()
    setOrderSending(true)
    setOrderError(null)
    try {
      const grouped = {}
      bag.forEach(item => {
        const k = item.productId + '|' + (item.variantId || '')
        if (!grouped[k]) grouped[k] = { productId: item.productId, variantId: item.variantId || null, quantity: 0 }
        grouped[k].quantity++
      })

      const order = await submitOrder({
        idempotencyKey: idemKey.current,
        customer: {
          name: formFields.name,
          email: formFields.email,
          phone: formFields.phone,
          address: buildAddress(formFields),
        },
        items: Object.values(grouped),
        discountCode: discount?.code || undefined,
        deliveryNotes: formFields.landmark || undefined,
      })

      idemKey.current = null
      setBag([])
      setDiscount(null)
      setConfirmed({
        orderId: order.orderNumber || order.id,
        paymentInstructions: store?.paymentInstructions || '',
      })
    } catch (err) {
      const errCode = err.data?.error
      const messages = {
        OUT_OF_STOCK: 'One or more items are out of stock.',
        VALIDATION_ERROR: 'Please check your order details.',
      }
      setOrderError(messages[errCode] || err.message || 'Something went wrong — try again.')
    } finally {
      setOrderSending(false)
    }
  }

  function resetConfirmed() {
    setConfirmed(null)
    setOrderError(null)
  }

  return {
    bag, addToBag, removeFromBag,
    shippingFee, bagSubtotal, discountedSubtotal, total,
    discount, discountError, discountLoading, checkDiscount,
    orderSending, orderError, placeOrder,
    confirmed, resetConfirmed,
  }
}
