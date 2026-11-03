export default function SizeGuideModal({ open, product, onClose }) {
  const chart = product?.sizeChart

  return (
    <>
      <div id="size-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="size-modal" className={open ? 'open' : ''}>
        <button id="size-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <div id="size-modal-title">Size guide — {product?.name}</div>
        {chart ? (
          <div id="size-chart-text">{chart}</div>
        ) : (
          <p id="size-chart-empty">Size chart not available for this product.</p>
        )}
        <p id="size-modal-note">Between sizes? Size up for a looser, drop-shoulder fit.</p>
      </div>
    </>
  )
}
