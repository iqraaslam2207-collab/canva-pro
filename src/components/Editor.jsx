import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DESIGN_TYPES } from '../data/catalog'
import { downloadPage } from '../lib/exportCanvas'
import {
  cloneElement,
  clonePage,
  createImage,
  createPage,
  createShape,
  createText,
  FONTS,
  resizePage,
  solidHex,
} from '../lib/model'
import { CanvasStage } from './CanvasStage'
import { DesignThumb } from './DesignThumb'
import { Icon, Wordmark } from './Icons'
import { PageSurface } from './PageSurface'
import { SidePanel } from './SidePanel'

const RAIL = [
  ['templates', 'Templates', 'templates'],
  ['elements', 'Elements', 'elements'],
  ['text', 'Text', 'text'],
  ['photos', 'Photos', 'photo'],
  ['uploads', 'Uploads', 'upload'],
  ['background', 'Background', 'background'],
  ['layers', 'Layers', 'layers'],
]

export function Editor({ project, brand, onBack, onSave }) {
  const [doc, setDoc] = useState(project)
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [panel, setPanel] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches ? 'templates' : null,
  )
  const [zoom, setZoom] = useState(1)
  const [viewScale, setViewScale] = useState(0.4)
  const [grid, setGrid] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)
  const docRef = useRef(doc)
  const pageIndexRef = useRef(pageIndex)
  const past = useRef([])
  const future = useRef([])
  const gesturing = useRef(false)
  const selectedRef = useRef(null)
  const commands = useRef({})

  const show = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }, [])

  const update = useCallback((mutator, { record = true } = {}) => {
    if (record) gesturing.current = false
    const prev = docRef.current
    const next = mutator(prev)
    if (!next || next === prev) return
    if (record) {
      past.current.push(prev)
      if (past.current.length > 80) past.current.shift()
      future.current = []
    }
    docRef.current = next
    setDoc(next)
  }, [])

  const onGestureStart = useCallback(() => {
    if (gesturing.current) return
    past.current.push(docRef.current)
    if (past.current.length > 80) past.current.shift()
    future.current = []
    gesturing.current = true
  }, [])

  const onGestureEnd = useCallback(() => {
    gesturing.current = false
  }, [])

  const undo = useCallback(() => {
    const prev = past.current.pop()
    if (!prev) return
    future.current.push(docRef.current)
    docRef.current = prev
    gesturing.current = false
    setDoc(prev)
    setPageIndex((index) => Math.min(index, prev.pages.length - 1))
    setEditingId(null)
  }, [])

  const redo = useCallback(() => {
    const next = future.current.pop()
    if (!next) return
    past.current.push(docRef.current)
    docRef.current = next
    gesturing.current = false
    setDoc(next)
    setPageIndex((index) => Math.min(index, next.pages.length - 1))
    setEditingId(null)
  }, [])

  function mapPage(doc, mapper) {
    const index = pageIndexRef.current
    return {
      ...doc,
      updatedAt: Date.now(),
      pages: doc.pages.map((page, pageNumber) => (pageNumber === index ? mapper(page) : page)),
    }
  }

  function patchElement(id, partial, { gesture = false } = {}) {
    if (!gesture) gesturing.current = false
    update(
      (current) =>
        mapPage(current, (page) => ({
          ...page,
          elements: page.elements.map((el) => (el.id === id ? { ...el, ...partial } : el)),
        })),
      { record: !gesture },
    )
  }

  function addElement(el) {
    gesturing.current = false
    update((current) => mapPage(current, (page) => ({ ...page, elements: [...page.elements, el] })))
    setSelectedId(el.id)
    setEditingId(null)
  }

  function place(el) {
    const page = docRef.current.pages[pageIndexRef.current]
    addElement({
      ...el,
      x: Math.round((page.width - el.width) / 2),
      y: Math.round((page.height - el.height) / 2),
    })
  }

  function removeElement(id) {
    gesturing.current = false
    update((current) =>
      mapPage(current, (page) => ({ ...page, elements: page.elements.filter((el) => el.id !== id) })),
    )
    setSelectedId((current) => (current === id ? null : current))
    setEditingId((current) => (current === id ? null : current))
  }

  function duplicateElement(id) {
    const page = docRef.current.pages[pageIndexRef.current]
    const el = page.elements.find((item) => item.id === id)
    if (!el) return
    const copy = cloneElement(el, 28)
    addElement(copy)
  }

  function reorder(id, direction) {
    update((current) =>
      mapPage(current, (page) => {
        const elements = [...page.elements]
        const index = elements.findIndex((el) => el.id === id)
        const next = index + direction
        if (index < 0 || next < 0 || next >= elements.length) return page
        const [item] = elements.splice(index, 1)
        elements.splice(next, 0, item)
        return { ...page, elements }
      }),
    )
  }

  function toggleLock(id) {
    const el = docRef.current.pages[pageIndexRef.current].elements.find((item) => item.id === id)
    if (el) patchElement(id, { locked: !el.locked })
  }

  function toggleHidden(id) {
    const el = docRef.current.pages[pageIndexRef.current].elements.find((item) => item.id === id)
    if (!el) return
    patchElement(id, { hidden: !el.hidden })
    if (!el.hidden) setSelectedId(null)
  }

  function onAction(type, id) {
    if (type === 'duplicate') duplicateElement(id)
    if (type === 'forward') reorder(id, 1)
    if (type === 'back') reorder(id, -1)
    if (type === 'lock') toggleLock(id)
    if (type === 'delete') removeElement(id)
  }

  const page = doc.pages[Math.min(pageIndex, doc.pages.length - 1)]
  const selected = page.elements.find((el) => el.id === selectedId) || null

  useLayoutEffect(() => {
    docRef.current = doc
    pageIndexRef.current = pageIndex
    selectedRef.current = selected
    commands.current = { undo, redo, duplicateElement, removeElement, patchElement, presenting }
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const ok = onSave(docRef.current)
      if (!ok) show('Storage is full. Download a PNG — large uploads may not be kept.')
    }, 280)
    return () => window.clearTimeout(timer)
  }, [doc, onSave, show])

  useEffect(() => {
    function onKey(event) {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'
      const meta = event.metaKey || event.ctrlKey
      if (event.key === 'Escape') {
        setEditingId(null)
        setSelectedId(null)
        setPresenting(false)
        setDialog(null)
        return
      }
      if (typing) return
      const command = commands.current
      if (command.presenting) {
        if (event.key === 'ArrowRight') setPageIndex((index) => Math.min(docRef.current.pages.length - 1, index + 1))
        if (event.key === 'ArrowLeft') setPageIndex((index) => Math.max(0, index - 1))
        return
      }
      if (meta && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) command.redo()
        else command.undo()
        return
      }
      if (meta && event.key.toLowerCase() === 'd' && selectedRef.current) {
        event.preventDefault()
        command.duplicateElement(selectedRef.current.id)
        return
      }
      if ((event.key === 'Backspace' || event.key === 'Delete') && selectedRef.current) {
        event.preventDefault()
        command.removeElement(selectedRef.current.id)
        return
      }
      if (selectedRef.current && !selectedRef.current.locked && event.key.startsWith('Arrow')) {
        event.preventDefault()
        const step = event.shiftKey ? 10 : 1
        const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key]
        if (!delta) return
        command.patchElement(selectedRef.current.id, {
          x: selectedRef.current.x + delta[0],
          y: selectedRef.current.y + delta[1],
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reportScale = useCallback((value) => {
    setViewScale((prev) => (Math.abs(prev - value) < 0.002 ? prev : value))
  }, [])

  const changeZoom = useCallback((delta) => {
    setZoom((current) => Math.min(3, Math.max(0.25, +(current + delta).toFixed(2))))
  }, [])

  function applyTemplate(template) {
    const fresh = template.pages.map((item) => clonePage(item))
    update((current) => {
      const pages = current.pages.map((item, index) => {
        if (index !== pageIndexRef.current) return item
        return {
          ...item,
          width: fresh[0].width,
          height: fresh[0].height,
          background: fresh[0].background,
          elements: fresh[0].elements,
          name: item.name,
        }
      })
      if (fresh.length > 1) pages.push(...fresh.slice(1))
      return {
        ...current,
        updatedAt: Date.now(),
        designType: template.category,
        name: current.name === 'Untitled design' ? template.name : current.name,
        pages,
      }
    })
    setSelectedId(null)
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setPanel(null)
    }
    show('Template applied. Undo if you want it back.')
  }

  function addShape(preset) {
    place(
      createShape(preset.shape, {
        width: preset.width,
        height: preset.height,
        radius: preset.radius,
        fill: brand.colors[0] || preset.fill,
      }),
    )
  }

  function addText(preset) {
    const current = docRef.current.pages[pageIndexRef.current]
    const dark = isDark(current.background)
    place(
      createText({
        text: preset.text,
        fontSize: preset.fontSize,
        fontWeight: preset.fontWeight,
        fontFamily: preset.fontSize > 30 ? brand.headingFont : brand.bodyFont,
        height: preset.height,
        width: Math.min(current.width - 96, preset.fontSize > 40 ? 860 : 640),
        letterSpacing: preset.letterSpacing,
        color: dark ? '#ffffff' : '#16181d',
      }),
    )
    setEditingId(null)
  }

  function addPhoto(photo) {
    const current = docRef.current.pages[pageIndexRef.current]
    const width = Math.min(current.width * 0.72, 760)
    place(createImage({ src: photo.src, width, height: width * 0.75, radius: 0 }))
  }

  async function upload(file) {
    const loaded = await readFile(file)
    const current = docRef.current.pages[pageIndexRef.current]
    const max = Math.min(current.width, current.height) * 0.7
    const fitted = Math.min(1, max / Math.max(loaded.width, loaded.height))
    place(
      createImage({
        src: loaded.src,
        width: Math.round(loaded.width * fitted),
        height: Math.round(loaded.height * fitted),
        radius: 0,
      }),
    )
  }

  function addTextAt(point) {
    const current = docRef.current.pages[pageIndexRef.current]
    const el = createText({
      text: 'Add a heading',
      x: point.x,
      y: point.y,
      width: Math.min(640, current.width * 0.7),
      height: 90,
      fontSize: 56,
      fontFamily: brand.headingFont,
      color: isDark(current.background) ? '#ffffff' : '#16181d',
    })
    addElement(el)
    setEditingId(el.id)
  }

  function addPage() {
    const current = docRef.current.pages[pageIndexRef.current]
    const index = docRef.current.pages.length
    update((docNow) => ({
      ...docNow,
      updatedAt: Date.now(),
      pages: [
        ...docNow.pages,
        createPage({
          width: current.width,
          height: current.height,
          name: `Page ${docNow.pages.length + 1}`,
        }),
      ],
    }))
    setPageIndex(index)
    setSelectedId(null)
  }

  function duplicatePage() {
    const current = docRef.current.pages[pageIndexRef.current]
    const copy = clonePage(current, `${current.name} copy`)
    const index = pageIndexRef.current + 1
    update((docNow) => {
      const pages = [...docNow.pages]
      pages.splice(index, 0, copy)
      return { ...docNow, pages, updatedAt: Date.now() }
    })
    setPageIndex(index)
  }

  function deletePage(index) {
    if (docRef.current.pages.length === 1) return
    update((docNow) => ({
      ...docNow,
      updatedAt: Date.now(),
      pages: docNow.pages.filter((_, pageNumber) => pageNumber !== index),
    }))
    setPageIndex((current) => Math.max(0, current >= index ? current - 1 : current))
  }

  function applyResize(width, height) {
    update((current) =>
      mapPage(current, (item) => resizePage(item, width, height)),
    )
    setDialog(null)
    show(`Resized to ${width} × ${height}`)
  }

  async function savePng(all) {
    setBusy(true)
    try {
      const pages = all ? doc.pages : [page]
      for (let index = 0; index < pages.length; index += 1) {
        const suffix = all ? `-page-${index + 1}` : ''
        await downloadPage(pages[index], `${safeName(doc.name)}${suffix}.png`)
      }
      show(all ? 'Downloaded every page' : 'PNG downloaded')
    } finally {
      setBusy(false)
      setDialog(null)
    }
  }

  function align(which) {
    if (!selected) return
    const patch = {}
    if (which === 'left') patch.x = 0
    if (which === 'center') patch.x = (page.width - selected.width) / 2
    if (which === 'right') patch.x = page.width - selected.width
    if (which === 'top') patch.y = 0
    if (which === 'middle') patch.y = (page.height - selected.height) / 2
    if (which === 'bottom') patch.y = page.height - selected.height
    patchElement(selected.id, patch)
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(doc, null, 2))
      show('Design JSON copied')
    } catch {
      show('Could not copy from this browser')
    }
    setDialog(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f3f4f6] text-[#16181d]">
      <header className="flex h-12 shrink-0 items-center gap-1 overflow-x-auto border-b border-[#e6e8ee] bg-white px-2 sm:h-14 sm:gap-2 sm:px-3">
        <button className="rounded-lg px-1" onClick={onBack} aria-label="Back to home">
          <Wordmark className="h-5 w-14 sm:h-[24px] sm:w-[64px]" />
        </button>
        <input
          value={doc.name}
          onChange={(event) => update((current) => ({ ...current, name: event.target.value }), { record: false })}
          className="w-28 rounded-lg px-2 py-1 text-sm font-medium outline-none hover:bg-[#f4f5f7] focus:bg-[#f4f5f7] sm:w-44 md:w-64"
          aria-label="Design name"
        />
        <span className="hidden rounded-full bg-[#f4ebff] px-2 py-0.5 text-[11px] font-semibold text-[#7D2AE8] sm:inline">
          Pro
        </span>
        <div className="mx-1 hidden h-6 w-px bg-[#e6e8ee] sm:block" />
        <BarButton label="Undo" icon="undo" onClick={undo} />
        <BarButton label="Redo" icon="redo" onClick={redo} />
        <button
          className="ml-1 hidden items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-[#f4f5f7] md:flex"
          onClick={() => setDialog('resize')}
        >
          <Icon name="resize" className="h-4 w-4" />
          Resize
        </button>
        <div className="flex-1" />
        <button className="hidden rounded-lg px-2 py-1.5 text-sm hover:bg-[#f4f5f7] sm:block" onClick={() => setDialog('help')}>
          Shortcuts
        </button>
        <button
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-[#f4f5f7]"
          onClick={() => setPresenting(true)}
        >
          <Icon name="present" className="h-4 w-4" />
          <span className="hidden sm:inline">Present</span>
        </button>
        <button
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm hover:bg-[#f4f5f7]"
          onClick={() => setDialog('download')}
          disabled={busy}
        >
          <Icon name="download" className="h-4 w-4" />
          <span className="hidden sm:inline">{busy ? 'Saving…' : 'Download'}</span>
        </button>
        <button
          className="rounded-full bg-[#7D2AE8] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#6924cc]"
          onClick={() => setDialog('share')}
        >
          Share
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <nav className="order-2 flex h-16 w-full shrink-0 flex-row items-stretch overflow-x-auto border-t border-[#eceef2] bg-white px-1 pb-[env(safe-area-inset-bottom)] md:order-1 md:h-auto md:w-[76px] md:flex-col md:items-center md:gap-1 md:overflow-visible md:border-t-0 md:border-r md:px-0 md:py-3 md:pb-3">
          {RAIL.map(([id, label, icon]) => (
            <button
              key={id}
              className={`flex min-w-[58px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[9px] font-medium md:min-w-0 md:w-[68px] md:flex-none md:py-2 md:text-[10px] ${
                panel === id ? 'bg-[#f4ebff] text-[#7D2AE8]' : 'text-[#3d4250] hover:bg-[#f4f5f7]'
              }`}
              onClick={() => setPanel((current) => (current === id ? null : id))}
            >
              <Icon name={icon} className="h-[18px] w-[18px]" />
              {label}
            </button>
          ))}
        </nav>

        {panel && (
          <div className="absolute inset-0 z-40 md:static md:inset-auto md:order-2 md:z-auto md:shadow-none">
          <SidePanel
            panel={panel}
            page={page}
            brand={brand}
            selectedId={selectedId}
            onClose={() => setPanel(null)}
            onApplyTemplate={applyTemplate}
            onAddShape={addShape}
            onAddText={addText}
            onAddPhoto={addPhoto}
            onUpload={upload}
            onBackground={(fill) => update((current) => mapPage(current, (item) => ({ ...item, background: fill })))}
            onSelect={setSelectedId}
            onReorder={reorder}
            onToggleHidden={toggleHidden}
            onToggleLock={toggleLock}
            onDelete={removeElement}
          />
          </div>
        )}

        <div className="relative order-1 flex min-h-0 min-w-0 flex-1 flex-col md:order-3">
          {selected && (
            <FormatBar
              element={selected}
              brand={brand}
              onPatch={(partial) => patchElement(selected.id, partial)}
              onAlign={align}
              onDuplicate={() => duplicateElement(selected.id)}
              onDelete={() => removeElement(selected.id)}
              onReorder={(direction) => reorder(selected.id, direction)}
              onLock={() => toggleLock(selected.id)}
            />
          )}
          <CanvasStage
            page={page}
            zoom={zoom}
            grid={grid}
            selectedId={selectedId}
            editingId={editingId}
            onZoom={changeZoom}
            onScale={reportScale}
            onSelect={setSelectedId}
            onEdit={setEditingId}
            onPatch={(id, partial, meta) => patchElement(id, partial, meta)}
            onText={(id, text) => {
              if (!gesturing.current) onGestureStart()
              patchElement(id, { text }, { gesture: true })
            }}
            onTextBlur={() => {
              onGestureEnd()
              setEditingId(null)
            }}
            onGestureStart={onGestureStart}
            onGestureEnd={onGestureEnd}
            onUpload={upload}
            onEmptyDoubleClick={addTextAt}
            onAction={onAction}
          />
          <footer className="flex h-16 shrink-0 items-center gap-2 overflow-x-auto border-t border-[#e6e8ee] bg-white px-2 sm:h-[76px] sm:gap-3 sm:px-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              {doc.pages.map((item, index) => (
                <button
                  key={item.id}
                  className={`w-16 shrink-0 overflow-hidden rounded-lg bg-[#f4f5f7] ring-2 ${
                    index === pageIndex ? 'ring-[#7D2AE8]' : 'ring-transparent'
                  }`}
                  onClick={() => {
                    setPageIndex(index)
                    setSelectedId(null)
                  }}
                  onDoubleClick={() => deletePage(index)}
                  title="Double-click to delete"
                >
                  <DesignThumb page={item} />
                </button>
              ))}
              <button
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#d0d3dc] text-[#5c6370] hover:border-[#7D2AE8] hover:text-[#7D2AE8]"
                onClick={addPage}
                aria-label="Add page"
              >
                <Icon name="plus" />
              </button>
              <button className="shrink-0 rounded-lg px-2 py-1 text-xs text-[#5c6370] hover:bg-[#f4f5f7]" onClick={duplicatePage}>
                Duplicate page
              </button>
            </div>
            <div className="hidden items-center gap-1 text-sm sm:flex">
              <button
                className={`rounded-lg px-2 py-1 text-xs ${grid ? 'bg-[#f4ebff] text-[#7D2AE8]' : 'hover:bg-[#f4f5f7]'}`}
                onClick={() => setGrid((value) => !value)}
              >
                Grid
              </button>
              <BarButton label="Zoom out" icon="minus" onClick={() => changeZoom(-0.1)} />
              <button className="w-14 rounded-lg py-1 text-xs tabular-nums hover:bg-[#f4f5f7]" onClick={() => setZoom(1)}>
                {Math.round(viewScale * 100)}%
              </button>
              <BarButton label="Zoom in" icon="plus" onClick={() => changeZoom(0.1)} />
            </div>
          </footer>
        </div>
      </div>

      {presenting && (
        <Presentation
          page={page}
          index={pageIndex}
          total={doc.pages.length}
          onClose={() => setPresenting(false)}
          onPrev={() => setPageIndex((index) => Math.max(0, index - 1))}
          onNext={() => setPageIndex((index) => Math.min(doc.pages.length - 1, index + 1))}
        />
      )}

      {dialog === 'resize' && (
        <ResizeDialog page={page} onClose={() => setDialog(null)} onApply={applyResize} />
      )}
      {dialog === 'download' && (
        <Modal title="Download" onClose={() => setDialog(null)}>
          <p className="text-sm text-[#4b5160]">Export this design as a PNG at the page’s real pixel size.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button className="rounded-full px-4 py-2 text-sm hover:bg-[#f4f5f7]" onClick={() => savePng(true)}>
              All pages
            </button>
            <button className="rounded-full bg-[#7D2AE8] px-4 py-2 text-sm font-semibold text-white" onClick={() => savePng(false)}>
              This page
            </button>
          </div>
        </Modal>
      )}
      {dialog === 'share' && (
        <Modal title="Share" onClose={() => setDialog(null)}>
          <p className="text-sm leading-6 text-[#4b5160]">
            Designs in this demo stay in your browser. Copy the file if you want to keep it somewhere else.
          </p>
          <div className="mt-4 flex justify-end">
            <button className="rounded-full bg-[#7D2AE8] px-4 py-2 text-sm font-semibold text-white" onClick={share}>
              Copy design JSON
            </button>
          </div>
        </Modal>
      )}
      {dialog === 'help' && (
        <Modal title="Shortcuts" onClose={() => setDialog(null)}>
          <ul className="space-y-2 text-sm text-[#2a2e38]">
            <Shortcut keys="⌘ Z" label="Undo" />
            <Shortcut keys="⌘ ⇧ Z" label="Redo" />
            <Shortcut keys="⌘ D" label="Duplicate" />
            <Shortcut keys="Delete" label="Remove selection" />
            <Shortcut keys="Arrows" label="Nudge, hold Shift for 10px" />
            <Shortcut keys="Double-click" label="Edit text, or add text on empty canvas" />
            <Shortcut keys="Esc" label="Deselect, or leave presentation" />
          </ul>
        </Modal>
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#16181d] px-4 py-2 text-sm text-white shadow-lg md:bottom-6">
          {toast}
        </div>
      )}
    </div>
  )
}

function FormatBar({ element, brand, onPatch, onAlign, onDuplicate, onDelete, onReorder, onLock }) {
  const color = element.type === 'text' ? element.color : element.fill
  return (
    <div className="pointer-events-none absolute top-3 left-1/2 z-20 w-[min(760px,calc(100%-24px))] -translate-x-1/2">
        <div className="pointer-events-auto flex flex-nowrap items-center gap-1 overflow-x-auto rounded-2xl border border-black/5 bg-white px-2 py-1.5 shadow-[0_10px_30px_rgba(15,18,28,0.12)] md:flex-wrap md:overflow-visible">
        {element.type === 'text' && (
          <>
            <select
              value={element.fontFamily}
              onChange={(event) => onPatch({ fontFamily: event.target.value })}
              className="max-w-36 rounded-lg bg-[#f4f5f7] px-2 py-1 text-xs"
            >
              {FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="8"
              value={Math.round(element.fontSize)}
              onChange={(event) => onPatch({ fontSize: Math.max(8, Number(event.target.value) || 8) })}
              className="w-14 rounded-lg bg-[#f4f5f7] px-2 py-1 text-xs"
              aria-label="Font size"
            />
            <BarButton label="Bold" icon="bold" active={element.fontWeight >= 700} onClick={() => onPatch({ fontWeight: element.fontWeight >= 700 ? 500 : 700 })} />
            <BarButton label="Italic" icon="italic" active={element.fontStyle === 'italic'} onClick={() => onPatch({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })} />
            <BarButton label="Align left" icon="alignLeft" active={element.textAlign === 'left'} onClick={() => onPatch({ textAlign: 'left' })} />
            <BarButton label="Align center" icon="alignCenter" active={element.textAlign === 'center'} onClick={() => onPatch({ textAlign: 'center' })} />
            <BarButton label="Align right" icon="alignRight" active={element.textAlign === 'right'} onClick={() => onPatch({ textAlign: 'right' })} />
          </>
        )}
        {element.type !== 'image' && (
          <input
            type="color"
            aria-label="Color"
            value={solidHex(color)}
            onChange={(event) => onPatch(element.type === 'text' ? { color: event.target.value } : { fill: event.target.value })}
          />
        )}
        {brand.colors.slice(0, 5).map((swatch) => (
          <button
            key={swatch}
            aria-label={swatch}
            className="h-5 w-5 rounded-full ring-1 ring-black/10"
            style={{ background: swatch }}
            onClick={() => {
              if (element.type === 'text') onPatch({ color: swatch })
              if (element.type === 'shape') onPatch({ fill: swatch })
            }}
          />
        ))}
        {(element.type === 'shape' && element.shape === 'rect') || element.type === 'image' ? (
          <label className="flex items-center gap-1 text-[11px] text-[#5c6370]">
            Radius
            <input
              type="range"
              min="0"
              max="120"
              value={element.radius || 0}
              onChange={(event) => onPatch({ radius: Number(event.target.value) })}
            />
          </label>
        ) : null}
        <label className="flex items-center gap-1 text-[11px] text-[#5c6370]">
          Opacity
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={element.opacity ?? 1}
            onChange={(event) => onPatch({ opacity: Number(event.target.value) })}
          />
        </label>
        <BarButton label="Shadow" icon="spark" active={element.shadow} onClick={() => onPatch({ shadow: !element.shadow })} />
        <span className="mx-1 h-5 w-px bg-[#eceef2]" />
        <BarButton label="Align left on page" icon="alignLeft" onClick={() => onAlign('left')} />
        <BarButton label="Center on page" icon="alignCenter" onClick={() => onAlign('center')} />
        <BarButton label="Align top" icon="front" onClick={() => onAlign('top')} />
        <BarButton label="Bring forward" icon="front" onClick={() => onReorder(1)} />
        <BarButton label="Send backward" icon="back" onClick={() => onReorder(-1)} />
        <BarButton label="Duplicate" icon="copy" onClick={onDuplicate} />
        <BarButton label={element.locked ? 'Unlock' : 'Lock'} icon={element.locked ? 'lock' : 'unlock'} onClick={onLock} />
        <BarButton label="Delete" icon="trash" onClick={onDelete} />
      </div>
    </div>
  )
}

function BarButton({ label, icon, onClick, active = false }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`rounded-lg p-1.5 ${active ? 'bg-[#f4ebff] text-[#7D2AE8]' : 'text-[#2c313c] hover:bg-[#f4f5f7]'}`}
      onClick={onClick}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button aria-label="Close" onClick={onClose}>
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ResizeDialog({ page, onClose, onApply }) {
  const [width, setWidth] = useState(page.width)
  const [height, setHeight] = useState(page.height)
  return (
    <Modal title="Magic resize" onClose={onClose}>
      <p className="mb-3 text-sm text-[#4b5160]">Pick a format or type a size. Everything on the page scales with it.</p>
      <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto">
        {DESIGN_TYPES.filter((type) => type.id !== 'custom').map((type) => (
          <button
            key={type.id}
            className="rounded-xl border border-[#eceef2] px-3 py-2 text-left text-sm hover:border-[#7D2AE8]"
            onClick={() => onApply(type.width, type.height)}
          >
            <span className="block font-medium">{type.label}</span>
            <span className="text-xs text-[#6b7280]">
              {type.width} × {type.height}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input type="number" value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-full rounded-xl border border-[#e6e8ee] px-3 py-2 text-sm" aria-label="Width" />
        <span className="text-[#98a0ae]">×</span>
        <input type="number" value={height} onChange={(event) => setHeight(Number(event.target.value))} className="w-full rounded-xl border border-[#e6e8ee] px-3 py-2 text-sm" aria-label="Height" />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="rounded-full bg-[#7D2AE8] px-4 py-2 text-sm font-semibold text-white"
          onClick={() => onApply(Math.max(100, width), Math.max(100, height))}
        >
          Resize page
        </button>
      </div>
    </Modal>
  )
}

function Presentation({ page, index, total, onClose, onPrev, onNext }) {
  const padX = window.innerWidth < 768 ? 24 : 120
  const padY = window.innerWidth < 768 ? 120 : 140
  const scale = Math.min((window.innerWidth - padX) / page.width, (window.innerHeight - padY) / page.height)
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] text-white">
      <div style={{ width: page.width * scale, height: page.height * scale }}>
        <div style={{ width: page.width, height: page.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <PageSurface page={page} />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3 text-sm">
        <button className="rounded-full bg-white/10 px-4 py-2" onClick={onPrev}>
          Previous
        </button>
        <span>
          {index + 1} / {total}
        </span>
        <button className="rounded-full bg-white/10 px-4 py-2" onClick={onNext}>
          Next
        </button>
        <button className="rounded-full bg-white px-4 py-2 text-[#16181d]" onClick={onClose}>
          Exit
        </button>
      </div>
    </div>
  )
}

function Shortcut({ keys, label }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="rounded-md bg-[#f4f5f7] px-2 py-1 text-xs font-medium">{keys}</span>
    </li>
  )
}

function isDark(fill) {
  if (typeof fill !== 'string' || !fill.startsWith('#') || fill.length < 7) return false
  const red = Number.parseInt(fill.slice(1, 3), 16)
  const green = Number.parseInt(fill.slice(3, 5), 16)
  const blue = Number.parseInt(fill.slice(5, 7), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 < 140
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve({ src: reader.result, width: image.width, height: image.height })
      image.onerror = () => reject(new Error('Could not read image'))
      image.src = reader.result
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function safeName(name) {
  return (name || 'design').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'design'
}
