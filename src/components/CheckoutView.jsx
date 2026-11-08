import { useState } from 'react'
import { fmt } from '../utils/fmt'
import { imgUrl } from '../utils/img'

const DISTRICTS = {
  'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
  'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
  'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
  'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro'],
}

export default function CheckoutView({ bag, checkout, onBack, onContinue }) {
  const {
    shippingFee, bagSubtotal, total,
    discount, discountError, discountLoading, checkDiscount,
    orderSending, orderError, placeOrder, confirmed, resetConfirmed,
    removeFromBag,
  } = checkout

  const [payMethod, setPayMethod] = useState('momo')
  const [discountInput, setDiscountInput] = useState('')
  const [fields, setFields] = useState({
    email: '', name: '', phone: '', district: '', sector: '', cell: '', street: '', landmark: '',
  })

  function field(id) {
    return (e) => setFields(prev => ({ ...prev, [id]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await placeOrder(fields)
  }

  function handleConfirmClose() {
    resetConfirmed()
    onContinue()
  }

  return (
    <div id="checkout-view" className={confirmed ? 'confirmed' : ''}>
      <div id="checkout-bar">
        <button type="button" id="checkout-back" aria-label="Back" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20"/></svg>
        </button>
        <span id="checkout-bag-label">Bag (<span id="checkout-bag-count">{bag.length}</span>)</span>
      </div>

      <div id="checkout-layout">
        <form id="checkout-form" onSubmit={handleSubmit}>

          <section className="co-section">
            <h2 className="co-heading">Contact information</h2>
            <div className="co-field">
              <label htmlFor="co-email">Email address</label>
              <input type="email" id="co-email" name="email" autoComplete="email" required value={fields.email} onChange={field('email')} />
            </div>
          </section>

          <section className="co-section">
            <h2 className="co-heading">Delivery address</h2>
            <p className="co-note">
              Delivery within Rwanda only · Flat rate{' '}
              <span id="delivery-fee-note">{fmt(shippingFee)}</span>
            </p>
            <div className="co-field">
              <label htmlFor="co-name">Full name</label>
              <input type="text" id="co-name" name="name" autoComplete="name" required value={fields.name} onChange={field('name')} />
            </div>
            <div className="co-field">
              <label htmlFor="co-phone">Phone</label>
              <input type="tel" id="co-phone" name="tel" autoComplete="tel" placeholder="+250 7XX XXX XXX" required value={fields.phone} onChange={field('phone')} />
            </div>
            <div className="co-field">
              <label htmlFor="co-district">District</label>
              <select id="co-district" name="district" required value={fields.district} onChange={field('district')}>
                <option value="" disabled>Select your district</option>
                {Object.entries(DISTRICTS).map(([group, opts]) => (
                  <optgroup key={group} label={group}>
                    {opts.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="co-row">
              <div className="co-field">
                <label htmlFor="co-sector">Sector</label>
                <input type="text" id="co-sector" name="sector" required value={fields.sector} onChange={field('sector')} />
              </div>
              <div className="co-field">
                <label htmlFor="co-cell">Cell</label>
                <input type="text" id="co-cell" name="cell" required value={fields.cell} onChange={field('cell')} />
              </div>
            </div>
            <div className="co-field">
              <label htmlFor="co-street">Street address</label>
              <input type="text" id="co-street" name="street" placeholder="Street name or number (e.g. KG 11 Ave)" autoComplete="address-line1" required value={fields.street} onChange={field('street')} />
            </div>
            <div className="co-field">
              <label htmlFor="co-landmark">House no. / landmark (optional)</label>
              <input type="text" id="co-landmark" name="landmark" placeholder="House number, nearby landmark, etc." autoComplete="address-line2" value={fields.landmark} onChange={field('landmark')} />
            </div>
          </section>

          <section className="co-section">
            <h2 className="co-heading">Discount code</h2>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-end', marginBottom: '0.8rem' }}>
              <div className="co-field" style={{ flex: 1, marginBottom: 0 }}>
                <label htmlFor="co-discount">Code</label>
                <input
                  type="text"
                  id="co-discount"
                  value={discountInput}
                  onChange={e => setDiscountInput(e.target.value.toUpperCase())}
                  placeholder="SAVE10"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <button
                type="button"
                style={{ background: 'none', border: '1px solid var(--ink)', padding: '0.6rem 1rem', fontFamily: 'inherit', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '1.4rem' }}
                onClick={() => checkDiscount(discountInput)}
                disabled={discountLoading || !discountInput.trim()}
              >
                {discountLoading ? '…' : 'Apply'}
              </button>
            </div>
            {discountError && <p style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '-0.4rem', marginBottom: '0.8rem' }}>{discountError}</p>}
            {discount && <p style={{ fontSize: '0.7rem', color: 'var(--grey)', marginBottom: '0.8rem' }}>Code applied — {fmt(discount.discountAmount)} off.</p>}
          </section>

          <section className="co-section">
            <h2 className="co-heading">Payment</h2>
            <div className="pay-options" role="radiogroup" aria-label="Payment method">
              <label className={`pay-option${payMethod === 'momo' ? ' selected' : ''}`}>
                <input type="radio" name="payment_method" value="momo" checked={payMethod === 'momo'} onChange={() => setPayMethod('momo')} />
                <span className="pay-title">Mobile money</span>
                <span className="pay-sub">MTN MoMo · Airtel Money</span>
              </label>
              <label className={`pay-option${payMethod === 'card' ? ' selected' : ''}`}>
                <input type="radio" name="payment_method" value="card" checked={payMethod === 'card'} onChange={() => setPayMethod('card')} />
                <span className="pay-title">Card</span>
                <span className="pay-sub">Visa · Mastercard</span>
              </label>
            </div>
            {payMethod === 'momo' && (
              <div id="pay-panel-momo" className="payment-box">
                <p className="payment-label">How to pay</p>
                <p className="payment-line payment-line-main">Payment instructions will appear after your order.</p>
              </div>
            )}
            {payMethod === 'card' && (
              <div id="pay-panel-card" className="pay-note">
                <span id="pay-card-soon">Card payments aren't available yet — please pay with mobile money.</span>
              </div>
            )}
          </section>

          <button
            type="submit"
            id="checkout-submit"
            disabled={orderSending || bag.length === 0 || payMethod === 'card'}
          >
            {orderSending ? 'Sending…' : 'Place order'}
          </button>
          <p id="checkout-error" className={orderError ? 'show' : ''}>{orderError}</p>
        </form>

        <aside id="checkout-summary-col">
          <h2 className="co-heading">Order summary</h2>
          <div id="co-items">
            {bag.length === 0 ? (
              <div className="co-empty">Your bag is empty</div>
            ) : bag.map(item => (
              <div key={item.id} className="co-item">
                <div className="co-thumb">
                  {item.imageUrl && <img src={imgUrl(item.imageUrl, 80)} alt="" loading="lazy" onError={e => { e.target.style.display = 'none' }} />}
                </div>
                <span className="co-item-name">{item.name}</span>
                <span className="co-item-price">{fmt(item.price)}</span>
                <button type="button" className="co-remove" aria-label={`Remove ${item.name}`} onClick={() => removeFromBag(item.id)}>
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7 L20 7 M9 7 L9.5 4.5 A1 1 0 0 1 10.5 3.7 L13.5 3.7 A1 1 0 0 1 14.5 4.5 L15 7 M6.5 7 L7.3 20 A1 1 0 0 0 8.3 21 L15.7 21 A1 1 0 0 0 16.7 20 L17.5 7"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="co-total-row"><span>Subtotal</span><span id="co-subtotal">{fmt(bagSubtotal)}</span></div>
          {discount && <div className="co-total-row"><span>Discount</span><span style={{ color: 'var(--grey)' }}>−{fmt(discount.discountAmount)}</span></div>}
          <div className="co-total-row"><span>Delivery (flat rate)</span><span id="co-delivery">{bag.length ? fmt(shippingFee) : '—'}</span></div>
          <div className="co-total-row co-total-final"><span>Total</span><span id="co-total">{fmt(bag.length ? total : 0)}</span></div>
          <button type="button" id="co-continue" onClick={onContinue}>Continue shopping</button>
        </aside>
      </div>

      <div id="confirm-block">
        <h2 className="co-heading">Order received</h2>
        <p id="confirm-order-id">Order #{confirmed?.orderId}</p>
        <p id="confirm-message">We've got your order and sent a confirmation to your email. Complete payment using the details below.</p>
        {confirmed?.paymentInstructions && (
          <div className="payment-box" id="confirm-pay">
            <p className="payment-label">How to pay</p>
            <p className="payment-line payment-line-main">{confirmed.paymentInstructions}</p>
          </div>
        )}
        <p id="confirm-warning">If payment isn't confirmed within 24 hours, this order will be cancelled.</p>
        <button type="button" id="confirm-close" onClick={handleConfirmClose}>Continue shopping</button>
      </div>
    </div>
  )
}
