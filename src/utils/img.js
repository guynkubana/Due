// Inject Cloudinary transforms (format auto + quality auto + optional width) into a URL.
// Non-Cloudinary URLs pass through unchanged.
export function imgUrl(url, width) {
  if (!url) return url
  const marker = '/image/upload/'
  const i = url.indexOf(marker)
  if (i === -1) return url
  const transforms = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  return url.slice(0, i + marker.length) + transforms + '/' + url.slice(i + marker.length)
}
