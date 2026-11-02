import { useState } from 'react'

const SITE_PASSWORD = 'thebestitw'
const FORMSPREE = 'https://formspree.io/f/xgaeozwo'

export default function PasswordGate({ onUnlock }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [pwError, setPwError] = useState(false)
  const [subStatus, setSubStatus] = useState('')
  const [subBusy, setSubBusy] = useState(false)

  function openModal() { setModalOpen(true); setPwError(false) }
  function closeModal() { setModalOpen(false) }

  async function handleSubscribe(e) {
    e.preventDefault()
    const email = e.target.elements.email.value.trim()
    if (!email) return
    setSubBusy(true)
    try {
      const fd = new FormData()
      fd.append('email', email)
      const res = await fetch(FORMSPREE, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
      setSubStatus(res.ok ? 'You\'re on the list.' : 'Something went wrong.')
    } catch {
      setSubStatus('Something went wrong.')
    } finally {
      setSubBusy(false)
    }
  }

  function handlePassword(e) {
    e.preventDefault()
    const val = e.target.elements[0].value.trim()
    if (val.toLowerCase() === SITE_PASSWORD.toLowerCase()) {
      try { sessionStorage.setItem('due_unlocked', '1') } catch (_) {}
      closeModal()
      onUnlock()
    } else {
      setPwError(true)
    }
  }

  return (
    <>
      <div id="password-view">
        <div className="logo-slot">
          <img className="logo-img" src="/images/logo-anim.gif" alt="DUE" onError={e => { e.target.src = '/images/logo.png' }} />
        </div>
        <div id="subscribe-block">
          <div id="pw-sub-title">Join the list</div>
          <div id="pw-sub-copy">Drop info, restocks, and early access.</div>
          <form id="pw-subscribe-form" onSubmit={handleSubscribe}>
            <input type="email" id="pw-email-input" name="email" placeholder="email" autoComplete="email" required />
            <button type="submit" id="pw-subscribe-submit" disabled={subBusy}>Subscribe</button>
            <p id="pw-subscribe-status" className={subStatus ? 'show' : ''}>{subStatus}</p>
          </form>
          <button type="button" className="pw-link" onClick={openModal}>I know the password</button>
        </div>
      </div>

      <div id="pw-modal-scrim" className={modalOpen ? 'open' : ''} onClick={closeModal} />
      <div id="pw-modal" className={modalOpen ? 'open' : ''}>
        <button id="pw-modal-close" aria-label="Close" onClick={closeModal}>×</button>
        <div id="pw-modal-title">Enter password</div>
        <form id="password-form" autoComplete="off" onSubmit={handlePassword}>
          <div className="pw-field">
            <input
              type={showPw ? 'text' : 'password'}
              id="password-input"
              placeholder="password"
              autoComplete="off"
              required
              onChange={() => setPwError(false)}
            />
            <button
              type="button"
              id="pw-eye"
              aria-label="Show password"
              aria-pressed={showPw}
              className={showPw ? 'showing' : ''}
              onClick={() => setShowPw(s => !s)}
            >
              <svg className="eye-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg className="eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1.5 12s3.8-7 10.5-7 10.5 7 10.5 7-3.8 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/>
              </svg>
            </button>
          </div>
          <button type="submit" id="password-submit">Enter</button>
          <p id="password-error" className={pwError ? 'show' : ''}>Wrong password.</p>
        </form>
      </div>
    </>
  )
}
