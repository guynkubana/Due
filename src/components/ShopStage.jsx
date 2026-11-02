import { useState, useEffect, useRef, useCallback } from 'react'
import { fmt } from '../utils/fmt'
import { useMagnifier, hideLens } from '../hooks/useMagnifier'

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ShopStage({ products, currentProduct, onNavigate, onDiscover, loading, error }) {
  const [flipped, setFlipped] = useState(false)
  const [fading, setFading] = useState(false)
  const cycleQueue = useRef([])
  const containerRef = useRef(null)
  const frontRef = useRef(null)

  // Build cycle queue once products load
  useEffect(() => {
    if (products.length > 0) {
      cycleQueue.current = shuffle(products.map((_, i) => i).filter(i => i !== currentProduct))
    }
  }, [products.length])

  // Reset flip on product change
  useEffect(() => {
    setFlipped(false)
    hideLens()
  }, [currentProduct])

  function goToRandom() {
    if (products.length < 2) return
    let next
    if (cycleQueue.current.length > 0) {
      next = cycleQueue.current.pop()
    } else {
      cycleQueue.current = shuffle(products.map((_, i) => i).filter(i => i !== currentProduct))
      next = cycleQueue.current.pop()
    }
    setFading(true)
    setTimeout(() => {
      onNavigate(next ?? 0)
      setFading(false)
    }, 350)
  }

  // Keyboard arrows
  useEffect(() => {
    function onKey(e) {
      if (document.activeElement?.tagName === 'INPUT') return
      if (!document.body.classList.contains('view-shop')) return
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) goToRandom()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const getImgRef = useRef(null)
  getImgRef.current = useCallback(() => frontRef.current?.querySelector('img'), [])

  const onSwipeRef = useRef(null)
  onSwipeRef.current = useCallback(() => goToRandom(), [products.length, currentProduct])

  useMagnifier(containerRef, getImgRef, onSwipeRef)

  const p = products[currentProduct]
  const front = p?.images?.[0]
  const back = p?.images?.[1] || p?.images?.[0]
  const counter = products.length
    ? String(currentProduct + 1).padStart(2, '0') + ' / ' + String(products.length).padStart(2, '0')
    : ''

  return (
    <>
      <button className="arrow" id="arrow-up" aria-label="Another product" onClick={goToRandom}>
        <svg viewBox="0 0 24 24"><path d="M12 20 L12 4 M5 11 L12 4 L19 11"/></svg>
      </button>
      <button className="arrow" id="arrow-down" aria-label="Another product" onClick={goToRandom}>
        <svg viewBox="0 0 24 24"><path d="M12 4 L12 20 M5 13 L12 20 L19 13"/></svg>
      </button>
      <button className="arrow" id="arrow-left" aria-label="Another product" onClick={goToRandom}>
        <svg viewBox="0 0 24 24"><path d="M20 12 L4 12 M11 5 L4 12 L11 19"/></svg>
      </button>
      <button className="arrow" id="arrow-right" aria-label="Another product" onClick={goToRandom}>
        <svg viewBox="0 0 24 24"><path d="M4 12 L20 12 M13 5 L20 12 L13 19"/></svg>
      </button>

      <main>
        <div id="stage" className={fading ? 'fading' : ''}>
          <div
            id="product-image"
            ref={containerRef}
            className={flipped ? 'flipped' : ''}
            onClick={() => p && setFlipped(f => !f)}
          >
            <div className="img-layer img-front" ref={frontRef}>
              {front && <img src={front} alt={p?.name + ' — front'} />}
            </div>
            <div className="img-layer img-back">
              {back && <img src={back} alt={p?.name + ' — back'} />}
            </div>
          </div>

          {loading && <div id="product-counter" style={{ color: 'var(--grey)', fontSize: '0.75rem' }}>Loading…</div>}
          {error && <div id="product-counter" style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{error}</div>}
          {!loading && !error && (
            <>
              <div id="product-counter">{counter}</div>
              <div id="product-name">{p?.name}</div>
              <div id="product-price">{p ? fmt(p.price) : ''}</div>
              <button id="get-btn" type="button" onClick={onDiscover}>Discover</button>
            </>
          )}
        </div>
      </main>
    </>
  )
}
