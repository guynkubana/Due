import { imgUrl } from '../utils/img'

export default function LookbookView({ products = [] }) {
  const images = products.flatMap(p =>
    p.images.map(url => ({ url, alt: p.name }))
  )

  return (
    <div id="lookbook-view">
      {images.length === 0 ? (
        <div id="lookbook-empty">coming soon.</div>
      ) : images.map((img, i) => (
        <figure key={i} className="look">
          <img
            src={imgUrl(img.url, 800)}
            alt={img.alt}
            loading="eager"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="look-ph">[ look {i + 1} ]</div>
          <figcaption>{String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</figcaption>
        </figure>
      ))}
    </div>
  )
}
