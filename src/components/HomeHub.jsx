export default function HomeHub({ bagCount, onShop, onLookbook, onContact, onBag }) {
  return (
    <div id="home-view">
      <button className="home-point home-north" onClick={onShop}>
        <span className="home-label">Shop</span>
        <span className="home-hover">Browse the collection</span>
      </button>
      <button className="home-point home-west" onClick={onLookbook}>
        <span className="home-label">Lookbook</span>
        <span className="home-hover">neverbeendone</span>
      </button>
      <div className="logo-slot">
        <img className="logo-img" src="/images/logo-anim.gif" alt="DUE" onError={e => { e.target.src = '/images/logo.png' }} />
      </div>
      <button className="home-point home-east" onClick={onContact}>
        <span className="home-label">Contact</span>
        <span className="home-hover">Questions, orders</span>
      </button>
      <button className="home-point home-south" onClick={onBag}>
        <span className="home-label">Bag ({bagCount})</span>
        <span className="home-hover">Your bag</span>
      </button>
    </div>
  )
}
