import { useEffect, useRef } from 'react'

const ZOOM = 2.4
const TOUCH_LIFT = 110

function hideLens() {
  const el = document.getElementById('magnifier')
  if (el) el.style.display = 'none'
}

export function useMagnifier(containerRef, getImgRef, onSwipeRef) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let start = null

    function show(e) {
      const img = getImgRef.current?.()
      if (!img || !img.complete || !img.naturalWidth) { hideLens(); return }
      const mag = document.getElementById('magnifier')
      if (!mag) return

      const rect = container.getBoundingClientRect()
      const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const ox = (rect.width - dw) / 2
      const oy = (rect.height - dh) / 2
      const x = Math.max(0, Math.min(dw, e.clientX - rect.left - ox))
      const y = Math.max(0, Math.min(dh, e.clientY - rect.top - oy))

      const lens = mag.offsetWidth
      const lift = e.pointerType === 'mouse' ? 0 : TOUCH_LIFT
      const left = Math.max(4, Math.min(window.innerWidth - lens - 4, e.clientX - lens / 2))
      const top = Math.max(4, e.clientY - lens / 2 - lift)

      mag.style.backgroundImage = `url("${img.src}")`
      mag.style.backgroundSize = `${dw * ZOOM}px ${dh * ZOOM}px`
      mag.style.backgroundPosition = `${-(x * ZOOM - lens / 2)}px ${-(y * ZOOM - lens / 2)}px`
      mag.style.left = `${left}px`
      mag.style.top = `${top}px`
      mag.style.display = 'block'
    }

    function onPointerDown(e) {
      if (e.pointerType === 'mouse') return
      start = { x: e.clientX, y: e.clientY, t: Date.now() }
      show(e)
    }

    function onPointerUp(e) {
      if (e.pointerType === 'mouse' || !start) { start = null; return }
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      const dt = Date.now() - start.t
      start = null
      if (onSwipeRef?.current && Math.abs(dx) > 50 && Math.abs(dy) < 45 && dt < 450) {
        hideLens()
        onSwipeRef.current(dx < 0 ? 1 : -1)
      }
    }

    function onPointerLeave(e) {
      if (e.pointerType === 'mouse') hideLens()
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointermove', show)
    container.addEventListener('pointerleave', onPointerLeave)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointermove', show)
      container.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [containerRef])
}

export { hideLens }
