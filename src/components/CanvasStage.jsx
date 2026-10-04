import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { resizeElement, rotationFromPointer, snapPosition } from '../lib/model'
import { ElementBody } from './PageSurface'

const HANDLES = [
  { id: 'nw', x: '0%', y: '0%', cursor: 'nwse-resize' },
  { id: 'n', x: '50%', y: '0%', cursor: 'ns-resize' },
  { id: 'ne', x: '100%', y: '0%', cursor: 'nesw-resize' },
  { id: 'e', x: '100%', y: '50%', cursor: 'ew-resize' },
  { id: 'se', x: '100%', y: '100%', cursor: 'nwse-resize' },
  { id: 's', x: '50%', y: '100%', cursor: 'ns-resize' },
  { id: 'sw', x: '0%', y: '100%', cursor: 'nesw-resize' },
  { id: 'w', x: '0%', y: '50%', cursor: 'ew-resize' },
]

export function CanvasStage({
  page,
  zoom,
  grid,
  selectedId,
  editingId,
  onZoom,
  onScale,
  onSelect,
  onEdit,
  onPatch,
  onText,
  onTextBlur,
  onGestureStart,
  onGestureEnd,
  onUpload,
  onEmptyDoubleClick,
  onAction,
}) {
  const hostRef = useRef(null)
  const pageRef = useRef(null)
  const scaleRef = useRef(1)
  const [box, setBox] = useState({ w: 960, h: 640 })
  const [guides, setGuides] = useState({ v: null, h: null })
  const [menu, setMenu] = useState(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const measure = () => setBox({ w: host.clientWidth, h: host.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  const fit = Math.min((box.w - 80) / page.width, (box.h - 72) / page.height)
  const scale = Math.max(0.05, fit * zoom)
  useLayoutEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    onScale(scale)
  }, [scale, onScale])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const onWheel = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return
      event.preventDefault()
      onZoom(event.deltaY < 0 ? 0.08 : -0.08)
    }
    host.addEventListener('wheel', onWheel, { passive: false })
    return () => host.removeEventListener('wheel', onWheel)
  }, [onZoom])

  function toDesign(clientX, clientY) {
    const rect = pageRef.current.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / scaleRef.current,
      y: (clientY - rect.top) / scaleRef.current,
    }
  }

  function track(startMove) {
    let moved = false
    const move = (event) => {
      if (!moved) {
        moved = true
        onGestureStart()
      }
      startMove(event)
    }
    const up = () => {
      if (moved) onGestureEnd()
      setGuides({ v: null, h: null })
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function onElementDown(event, el) {
    if (editingId === el.id) return
    event.stopPropagation()
    onSelect(el.id)
    setMenu(null)
    if (el.locked) return
    const originX = event.clientX
    const originY = event.clientY
    const startX = el.x
    const startY = el.y
    track((ev) => {
      const dx = (ev.clientX - originX) / scaleRef.current
      const dy = (ev.clientY - originY) / scaleRef.current
      const snapped = snapPosition(page, el.width, el.height, startX + dx, startY + dy)
      setGuides({ v: snapped.guideV, h: snapped.guideH })
      onPatch(el.id, { x: snapped.x, y: snapped.y }, { gesture: true })
    })
  }

  function onHandleDown(event, el, handle) {
    event.stopPropagation()
    event.preventDefault()
    const origin = toDesign(event.clientX, event.clientY)
    const start = { ...el }
    track((ev) => {
      const point = toDesign(ev.clientX, ev.clientY)
      const lock = el.type === 'image' || ev.shiftKey
      const next = resizeElement(start, handle, point.x - origin.x, point.y - origin.y, lock)
      onPatch(el.id, next, { gesture: true })
    })
  }

  function onRotateDown(event, el) {
    event.stopPropagation()
    event.preventDefault()
    track((ev) => {
      const point = toDesign(ev.clientX, ev.clientY)
      onPatch(el.id, { rotation: rotationFromPointer(el, point.x, point.y) }, { gesture: true })
    })
  }

  const selected = page.elements.find((el) => el.id === selectedId && !el.hidden)

  return (
    <div
      ref={hostRef}
      className="relative min-h-0 flex-1 overflow-hidden bg-[#e7e8ec]"
      onPointerDown={() => {
        onSelect(null)
        onEdit(null)
        setMenu(null)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) onUpload(file)
      }}
    >
      <div
        className="absolute"
        style={{
          left: (box.w - page.width * scale) / 2,
          top: (box.h - page.height * scale) / 2,
          width: page.width * scale,
          height: page.height * scale,
        }}
      >
        <div
          ref={pageRef}
          className="relative shadow-[0_16px_50px_rgba(15,18,28,0.18)]"
          style={{
            width: page.width,
            height: page.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            background: 'transparent',
          }}
          onPointerDown={(event) => {
            event.stopPropagation()
            onSelect(null)
            onEdit(null)
            setMenu(null)
          }}
          onDoubleClick={(event) => {
            event.stopPropagation()
            if (event.target.closest('[data-element]')) return
            const point = toDesign(event.clientX, event.clientY)
            onEmptyDoubleClick(point)
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                typeof page.background === 'string'
                  ? page.background
                  : `linear-gradient(${page.background.angle ?? 135}deg, ${page.background.stops.join(', ')})`,
            }}
          />
          {grid && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(125,42,232,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,42,232,0.16) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          )}
          {page.elements.map((el) =>
            el.hidden ? null : (
              <div
                key={el.id}
                data-element="true"
                role="button"
                aria-label={el.type === 'text' ? el.text.replace(/\n/g, ' ').slice(0, 48) : el.type === 'image' ? 'Photo' : el.shape}
                tabIndex={-1}
                className="absolute"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1,
                  cursor: el.locked ? 'default' : 'move',
                  outline: selectedId === el.id ? `${1.5 / scale}px solid #7D2AE8` : 'none',
                  zIndex: selectedId === el.id ? 2 : 1,
                }}
                onPointerDown={(event) => onElementDown(event, el)}
                onDoubleClick={(event) => {
                  event.stopPropagation()
                  if (el.type === 'text') onEdit(el.id)
                }}
                onContextMenu={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onSelect(el.id)
                  setMenu({ x: event.clientX, y: event.clientY, id: el.id })
                }}
              >
                <ElementBody
                  el={el}
                  editing={editingId === el.id}
                  onChangeText={onText}
                  onBlurText={onTextBlur}
                />
                {selectedId === el.id && !el.locked && editingId !== el.id && (
                  <>
                    <div
                      className="absolute bg-[#7D2AE8]"
                      style={{
                        left: '50%',
                        top: -28 / scale,
                        width: 1 / scale,
                        height: 28 / scale,
                        transform: 'translateX(-50%)',
                      }}
                    />
                    <button
                      aria-label="Rotate"
                      className="absolute rounded-full border border-[#7D2AE8] bg-white"
                      style={{
                        left: '50%',
                        top: -28 / scale,
                        width: 14 / scale,
                        height: 14 / scale,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'grab',
                      }}
                      onPointerDown={(event) => onRotateDown(event, el)}
                    />
                    {HANDLES.map((handle) => (
                      <button
                        key={handle.id}
                        aria-label={`Resize ${handle.id}`}
                        className="absolute rounded-[2px] border border-[#7D2AE8] bg-white"
                        style={{
                          left: handle.x,
                          top: handle.y,
                          width: 11 / scale,
                          height: 11 / scale,
                          transform: 'translate(-50%, -50%)',
                          cursor: handle.cursor,
                        }}
                        onPointerDown={(event) => onHandleDown(event, el, handle.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            ),
          )}
          {guides.v != null && (
            <div className="pointer-events-none absolute top-0 bottom-0 bg-[#7D2AE8]" style={{ left: guides.v, width: 1 / scale }} />
          )}
          {guides.h != null && (
            <div className="pointer-events-none absolute right-0 left-0 bg-[#7D2AE8]" style={{ top: guides.h, height: 1 / scale }} />
          )}
          {page.elements.every((el) => el.hidden) && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[28px] text-[#98a0ae]">
              Double-click to add text
            </div>
          )}
        </div>
      </div>
      {menu && (
        <>
          <button aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-44 overflow-hidden rounded-xl border border-black/5 bg-white py-1 text-sm shadow-xl"
            style={{ left: menu.x, top: menu.y }}
          >
            <MenuButton label="Duplicate" onClick={() => { setMenu(null); onAction('duplicate', menu.id) }} />
            <MenuButton label="Bring forward" onClick={() => { setMenu(null); onAction('forward', menu.id) }} />
            <MenuButton label="Send backward" onClick={() => { setMenu(null); onAction('back', menu.id) }} />
            <MenuButton label="Lock" onClick={() => { setMenu(null); onAction('lock', menu.id) }} />
            <MenuButton label="Delete" danger onClick={() => { setMenu(null); onAction('delete', menu.id) }} />
          </div>
        </>
      )}
      {selected && (
        <span className="sr-only">
          {selected.type} selected
        </span>
      )}
    </div>
  )
}

function MenuButton({ label, onClick, danger = false }) {
  return (
    <button
      className={`block w-full px-3 py-2 text-left hover:bg-[#f4f5f8] ${danger ? 'text-[#d11a3a]' : 'text-[#1c1e24]'}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
