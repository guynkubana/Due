import { useState, useEffect } from 'react'
import { fmt } from '../utils/fmt'

export default function SearchBar({ open, products, onSelect, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => { if (open) setQuery('') }, [open])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = query.trim()
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <>
      <div id="search-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="search-modal" className={open ? 'open' : ''}>
        <input
          id="search-input"
          type="text"
          placeholder="search the collection"
          autoComplete="off"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus={open}
        />
        <div id="search-results">
          {query.trim() && results.length === 0 && (
            <div className="search-empty">No results for "{query}"</div>
          )}
          {results.map((p, i) => {
            const idx = products.indexOf(p)
            return (
              <div key={p.id} className="search-result" onClick={() => onSelect(idx)}>
                <span>{p.name}</span>
                <span>{fmt(p.price)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
