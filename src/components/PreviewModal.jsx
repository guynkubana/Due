import { useState, useEffect, useRef, useCallback } from 'react'
import { fmt } from '../utils/fmt'
import { imgUrl } from '../utils/img'
import { useMagnifier, hideLens } from '../hooks/useMagnifier'

export default function PreviewModal({
  open, product, selectedSize, onSelectSize, onSizeGuide, onAddToBag, onClose
}) {
  const [imgIndex, setImgIndex] = useState(0)
  const [sizeError, setSizeError] = useState(false)
  const mainRef = useRef(null)

  useEffect(() => {
    if (open) { setImgIndex(0); setSizeError(false) }
  }, [open, product])

  const images = product?.images || []
  const variants = product?.variants || []

  const getImgRef = useRef(null)
  getImgRef.current = useCallback(() => mainRef.current?.querySelector('img'), [])

  const onSwipeRef = useRef(null)
  onSwipeRef.current = useCallback((dir) => {
    const n = images.length
    if (n < 2) return
    setImgIndex(i => (i + dir + n) % n)
    hideLens()
  }, [images.length])

  useMagnifier(mainRef, getImgRef, onSwipeRef)

  function handleAddToBag() {
    if (variants.length > 0 && !selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    const variant = variants.find(v => v.name === selectedSize)
    const price = (variant?.priceOverride != null) ? variant.priceOverride : product.price
    onAddToBag(product, variant?.id || null, selectedSize || null, price)
    onClose()
  }

  function handleSizeSelect(size) {
    onSelectSize(size)
    setSizeError(false)
  }

  return (
    <>
      <div id="preview-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="preview-modal" className={open ? 'open' : ''} role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <button id="preview-close" aria-label="Close" onClick={onClose}>×</button>

        <div id="preview-gallery">
          <div id="preview-main" ref={mainRef}>
            {images[imgIndex] && (
              <img src={imgUrl(images[imgIndex], 900)} alt={`${product?.name} photo ${imgIndex + 1}`} loading="eager" />
            )}
            {!images[imgIndex] && (
              <div className="pv-ph" style={{ display: 'flex' }}>[ no image ]</div>
            )}
          </div>
          {images.length > 1 && (
            <div id="preview-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pv-thumb${i === imgIndex ? ' active' : ''}`}
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setImgIndex(i)}
                >
                  <img src={imgUrl(src, 120)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div id="preview-info">
          <div id="preview-title">{product?.name}</div>
          <div id="preview-price">{product ? fmt(product.price) : ''}</div>

          <div id="preview-buy">
            {variants.length > 0 && (
              <>
                <div className="pv-label">Size</div>
                <div id="preview-sizes">
                  {variants.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      className={`pv-size${selectedSize === v.name ? ' selected' : ''}`}
                      disabled={v.inventoryCount === 0}
                      onClick={() => handleSizeSelect(v.name)}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
                {product?.sizeChart && (
                  <button type="button" id="preview-size-guide" onClick={onSizeGuide}>
                    size guide
                  </button>
                )}
                <p id="preview-size-error" className={sizeError ? 'show' : ''}>Select a size first.</p>
              </>
            )}
            <button type="button" id="preview-add" onClick={handleAddToBag}>Add to bag</button>
          </div>

          {product?.description && (
            <p id="preview-desc">{product.description}</p>
          )}
          {product?.materials && (
            <div className="pv-section">
              <div className="pv-label">Materials</div>
              <div id="preview-materials">{product.materials}</div>
            </div>
          )}
          {product?.careInstructions && (
            <div className="pv-section">
              <div className="pv-label">Care</div>
              <div id="preview-care">{product.careInstructions}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
