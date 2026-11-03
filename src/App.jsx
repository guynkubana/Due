import { useState, useEffect } from 'react'
import { useProducts } from './hooks/useProducts'
import { useCheckout } from './hooks/useCheckout'
import PasswordGate from './components/PasswordGate'
import HomeHub from './components/HomeHub'
import ShopStage from './components/ShopStage'
import PreviewModal from './components/PreviewModal'
import SizeGuideModal from './components/SizeGuideModal'
import CheckoutView from './components/CheckoutView'
import ContactView from './components/ContactView'
import LookbookView from './components/LookbookView'
import SearchBar from './components/SearchBar'
import TermsPanel from './components/TermsPanel'
import EmailModal from './components/EmailModal'
import CreditsModal from './components/CreditsModal'

function initialView() {
  try { return sessionStorage.getItem('due_unlocked') === '1' ? 'home' : 'password' }
  catch { return 'password' }
}

export default function App() {
  const { products, galleryProducts, store, loading, error, lockEnabled } = useProducts()
  const checkout = useCheckout(store)

  const [view, setView] = useState(initialView)
  const [prevView, setPrevView] = useState('shop')
  const [currentProduct, setCurrentProduct] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)

  useEffect(() => {
    document.body.className = 'view-' + view
  }, [view])

  useEffect(() => {
    if (!loading && !lockEnabled) setView('home')
  }, [loading, lockEnabled])

  function navigateTo(name) {
    if (name === 'checkout' && view !== 'checkout') setPrevView(view)
    if (name === 'lookbook') {
      const el = document.getElementById('lookbook-view')
      if (el) el.scrollTop = 0
    }
    setView(name)
  }


  function handleAddToBag(product, variantId, variantName, price) {
    checkout.addToBag(product, variantId, variantName, price)
    navigateTo('checkout')
  }

  function handleSearchSelect(idx) {
    setCurrentProduct(idx)
    setSearchOpen(false)
    navigateTo('shop')
  }

  return (
    <>
      <div id="magnifier" />

      <PasswordGate onUnlock={() => navigateTo('home')} />

      <HomeHub
        bagCount={checkout.bag.length}
        onShop={() => navigateTo('shop')}
        onLookbook={() => navigateTo('lookbook')}
        onContact={() => navigateTo('contact')}
        onBag={() => navigateTo('checkout')}
      />

      <LookbookView products={galleryProducts} />

      <ContactView onClose={() => navigateTo('home')} />

      {/* Shop chrome — wordmark, top-right cluster, footer */}
      <button className="wordmark" id="home-link" aria-label="Back to home" onClick={() => navigateTo('home')}>
        <img className="wordmark-logo" src="/images/logo.png" alt="DUE" onError={e => { e.target.style.display = 'none' }} />
      </button>
      <div className="top-right-cluster">
        <button id="search-toggle" aria-label="Search" onClick={() => setSearchOpen(true)}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7"/><path d="M21 21 L16 16"/>
          </svg>
        </button>
        <button id="bag-toggle" onClick={() => navigateTo('checkout')}>
          Bag (<span id="bag-count">{checkout.bag.length}</span>)
        </button>
      </div>
      <div className="footer-cluster">
        <button onClick={() => setTermsOpen(true)}>Terms</button>
        <button onClick={() => setEmailOpen(true)}>Email</button>
        <button onClick={() => setCreditsOpen(true)}>Credits</button>
      </div>

      <ShopStage
        products={products}
        currentProduct={currentProduct}
        onNavigate={setCurrentProduct}
        onDiscover={() => setPreviewOpen(true)}
        loading={loading}
        error={error}
      />

      <CheckoutView
        bag={checkout.bag}
        checkout={checkout}
        onBack={() => navigateTo(prevView)}
        onContinue={() => navigateTo('shop')}
      />

      <PreviewModal
        open={previewOpen}
        product={products[currentProduct]}
        selectedSize={selectedSizes[currentProduct]}
        onSelectSize={size => setSelectedSizes(prev => ({ ...prev, [currentProduct]: size }))}
        onSizeGuide={() => setSizeGuideOpen(true)}
        onAddToBag={handleAddToBag}
        onClose={() => setPreviewOpen(false)}
      />

      <SizeGuideModal
        open={sizeGuideOpen}
        product={products[currentProduct]}
        onClose={() => setSizeGuideOpen(false)}
      />

      <SearchBar
        open={searchOpen}
        products={products}
        onSelect={handleSearchSelect}
        onClose={() => setSearchOpen(false)}
      />

      <TermsPanel open={termsOpen} onClose={() => setTermsOpen(false)} />

      <EmailModal open={emailOpen} onClose={() => setEmailOpen(false)} />
      <CreditsModal open={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </>
  )
}
