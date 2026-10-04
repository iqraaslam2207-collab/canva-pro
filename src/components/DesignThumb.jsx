import { useEffect, useRef, useState } from 'react'
import { PageSurface } from './PageSurface'

export function DesignThumb({ page, className = '' }) {
  const frameRef = useRef(null)
  const [scale, setScale] = useState(0.2)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined
    const measure = () => {
      const width = frame.clientWidth
      if (width > 0) setScale(width / page.width)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [page.width])

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={{ aspectRatio: `${page.width} / ${page.height}` }}
    >
      <div className="absolute top-0 left-0" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <PageSurface page={page} />
      </div>
    </div>
  )
}
