import { useState } from 'react'

const FORMSPREE = 'https://formspree.io/f/xgaeozwo'

export default function ContactView({ onClose }) {
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const fd = new FormData(e.target)
      const res = await fetch(FORMSPREE, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
      if (res.ok) {
        setStatus('Message sent.')
        e.target.reset()
      } else {
        setStatus('Something went wrong — try again.')
      }
    } catch {
      setStatus('Something went wrong — try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div id="contact-view">
      <div id="contact-box">
        <button id="contact-close" aria-label="Close" onClick={onClose}>×</button>
        <form id="contact-form" onSubmit={handleSubmit}>
          <label>First name *
            <input type="text" id="contact-first" name="first_name" autoComplete="given-name" required />
          </label>
          <label>Last name *
            <input type="text" id="contact-last" name="last_name" autoComplete="family-name" required />
          </label>
          <label>Email *
            <input type="email" id="contact-email" name="email" autoComplete="email" required />
          </label>
          <label>Comment or message *
            <textarea id="contact-message" name="message" placeholder="Order question? Add your order number." required />
          </label>
          <button type="submit" id="contact-submit" disabled={busy}>{busy ? 'Sending…' : 'Submit'}</button>
          <p id="contact-status" className={status ? 'show' : ''}>{status}</p>
        </form>
        <p id="contact-direct">
          <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a>
          {' '}&nbsp;·&nbsp;{' '}
          <a href="https://instagram.com/duespace" target="_blank" rel="noopener">@duespace</a>
          <br />Kigali, Rwanda
        </p>
      </div>
    </div>
  )
}
