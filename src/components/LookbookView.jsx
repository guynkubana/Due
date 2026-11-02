const LOOKS = [1, 2, 3, 4, 5, 6].map(n => `images/lookbook-${n}.jpg`)

export default function LookbookView() {
  return (
    <div id="lookbook-view">
      {LOOKS.map((src, i) => (
        <figure key={i} className="look">
          <img
            src={src}
            alt=""
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="look-ph">[ look {i + 1} ]</div>
          <figcaption></figcaption>
        </figure>
      ))}
    </div>
  )
}
