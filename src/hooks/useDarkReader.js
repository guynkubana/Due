import { useState, useEffect } from 'react'

export function useDarkReader() {
  const [active, setActive] = useState(
    () => document.documentElement.hasAttribute('data-darkreader-mode')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setActive(document.documentElement.hasAttribute('data-darkreader-mode'))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-darkreader-mode'],
    })
    return () => observer.disconnect()
  }, [])

  return active
}
