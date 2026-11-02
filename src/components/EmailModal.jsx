import { useState } from 'react'

const FORMSPREE = 'https://formspree.io/f/xgaeozwo'

export default function EmailModal({ open, onClose }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData(e.target)
      const res = await fetch(FORMSPREE, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
      if (res.ok) { setStatus('You\'re on the list.'); e.target.reset() }
      else setStatus('Something went wrong.')
    } catch {
      setStatus('Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div id="email-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="email-modal" className={open ? 'open' : ''}>
        <button id="email-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <div id="email-modal-title">Join the list</div>
        <div id="email-modal-sub">Drop info, restocks, and early access.</div>
        <form id="email-form" onSubmit={handleSubmit}>
          <label>Email
            <input type="email" id="email-input" name="email" required placeholder="you@example.com" />
          </label>
          <button type="submit" id="email-submit" disabled={busy}>{busy ? '…' : 'Subscribe'}</button>
        </form>
        <p id="email-status" className={status ? 'show' : ''}>{status}</p>
      </div>
    </>
  )
}
