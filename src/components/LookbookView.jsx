import { imgUrl } from '../utils/img'

export default function LookbookView({ products = [] }) {
  const images = products.flatMap(p => p.images.map(img => ({ url: img.url, alt: p.name })))

  return (
    <div id="lookbook-view">
      {images.map((img, i) => (
        <figure key={i} className="look">
          <img
            src={imgUrl(img.url, 800)}
            alt={img.alt}
            loading="lazy"
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
