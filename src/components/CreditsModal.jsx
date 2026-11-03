export default function CreditsModal({ open, onClose }) {
  return (
    <>
      <div id="credits-scrim" className={open ? 'open' : ''} onClick={onClose} />
      <div id="credits-modal" className={open ? 'open' : ''}>
        <button id="credits-modal-close" aria-label="Close" onClick={onClose}>×</button>
        <div id="credits-modal-title">Credits</div>
        <div id="credits-body">
          <p>Website polished by <a href="https://www.instagram.com/hkevink/" target="_blank" rel="noopener">@hkevink</a></p>
        </div>
      </div>
    </>
  )
}
