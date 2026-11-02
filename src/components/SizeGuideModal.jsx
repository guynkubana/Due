export default function SizeGuideModal({ open, product, selectedSize, onSelectSize, onClose }) {
  const chart = product?.sizeChart

  return (
    <>
      <div id="size-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="size-modal" className={open ? 'open' : ''}>
        <button id="size-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <div id="size-modal-title">Size guide — {product?.name}</div>
        <div id="size-modal-sub">Measurements in inches — tap a row to select</div>
        {chart ? (
          <table id="size-table">
            <thead id="size-table-head">
              <tr>{chart.columns.map(c => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody id="size-table-body">
              {chart.rows.map(row => (
                <tr
                  key={row[0]}
                  className={`size-row${selectedSize === row[0] ? ' selected' : ''}`}
                  onClick={() => onSelectSize(row[0])}
                >
                  {row.map((cell, i) => <td key={i}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: '0.78rem', color: 'var(--grey)', padding: '1rem 0' }}>
            Size chart not available for this product.
          </p>
        )}
        <p id="size-modal-note">Between sizes? Size up for a looser, drop-shoulder fit.</p>
      </div>
    </>
  )
}
