import { useMemo, useState } from 'react'
import { BACKGROUNDS, PHOTOS, SHAPE_PRESETS, TEMPLATES, TEXT_PRESETS } from '../data/catalog'
import { fillCss } from '../lib/model'
import { DesignThumb } from './DesignThumb'
import { Icon } from './Icons'

const titles = {
  templates: 'Templates',
  elements: 'Elements',
  text: 'Text',
  photos: 'Photos',
  uploads: 'Uploads',
  layers: 'Layers',
  background: 'Background',
}

export function SidePanel({
  panel,
  page,
  brand,
  selectedId,
  onClose,
  onApplyTemplate,
  onAddShape,
  onAddText,
  onAddPhoto,
  onUpload,
  onBackground,
  onSelect,
  onReorder,
  onToggleHidden,
  onToggleLock,
  onDelete,
}) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()

  const templates = useMemo(
    () =>
      TEMPLATES.filter(
        (template) =>
          !needle ||
          template.name.toLowerCase().includes(needle) ||
          template.category.toLowerCase().includes(needle),
      ),
    [needle],
  )

  const photos = useMemo(
    () => PHOTOS.filter((photo) => !needle || photo.name.toLowerCase().includes(needle)),
    [needle],
  )

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[#eceef2] bg-white md:w-[320px]">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-[15px] font-semibold">{titles[panel]}</h2>
        <button aria-label="Close panel" className="rounded-lg p-1 text-[#5c6370] hover:bg-[#f3f4f7]" onClick={onClose}>
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      {panel !== 'uploads' && panel !== 'layers' && panel !== 'background' && panel !== 'text' && (
        <div className="px-4 pb-3">
          <label className="flex items-center gap-2 rounded-xl bg-[#f3f4f7] px-3 py-2 text-sm text-[#5c6370]">
            <Icon name="search" className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${titles[panel].toLowerCase()}`}
              className="w-full bg-transparent text-[#16181d] outline-none placeholder:text-[#8b909a]"
            />
          </label>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {panel === 'templates' && (
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                className="text-left"
                onClick={() => onApplyTemplate(template)}
              >
                <DesignThumb page={template.pages[0]} className="rounded-xl shadow-sm ring-1 ring-black/5" />
                <span className="mt-1.5 block truncate text-xs font-medium">{template.name}</span>
                <span className="text-[11px] text-[#8b909a]">{template.category}</span>
              </button>
            ))}
          </div>
        )}

        {panel === 'elements' && (
          <div className="grid grid-cols-3 gap-2">
            {SHAPE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-[#f6f7f9] hover:bg-[#eef0f4]"
                onClick={() => onAddShape(preset)}
              >
                <span
                  className="block"
                  style={{
                    width: preset.shape === 'line' ? 36 : 28,
                    height: preset.shape === 'line' ? 4 : 28,
                    background: preset.fill,
                    borderRadius: preset.shape === 'ellipse' ? 999 : preset.shape === 'line' ? 999 : 4,
                    clipPath:
                      preset.shape === 'triangle'
                        ? 'polygon(50% 0, 100% 100%, 0 100%)'
                        : preset.shape === 'star'
                          ? 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                          : 'none',
                  }}
                />
                <span className="text-[11px] text-[#3c4250]">{preset.label}</span>
              </button>
            ))}
          </div>
        )}

        {panel === 'text' && (
          <div className="space-y-2">
            <p className="pb-1 text-xs text-[#6b7280]">Brand fonts: {brand.headingFont} and {brand.bodyFont}</p>
            {TEXT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                className="flex w-full items-center rounded-xl border border-[#eceef2] px-4 py-4 text-left hover:border-[#d8c6ff] hover:bg-[#faf7ff]"
                onClick={() => onAddText(preset)}
              >
                <span
                  style={{
                    fontFamily: preset.fontSize > 30 ? brand.headingFont : brand.bodyFont,
                    fontWeight: preset.fontWeight,
                    fontSize: Math.min(preset.fontSize / 3.2, 28),
                    letterSpacing: preset.letterSpacing > 2 ? 2 : 0,
                  }}
                >
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {panel === 'photos' && (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <button key={photo.id} className="overflow-hidden rounded-xl" onClick={() => onAddPhoto(photo)}>
                <img src={photo.src} alt={photo.name} className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {panel === 'uploads' && (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d5d8e0] bg-[#fafbfc] px-6 py-14 text-center hover:border-[#7D2AE8]">
            <Icon name="upload" className="mb-3 h-6 w-6 text-[#7D2AE8]" />
            <span className="text-sm font-semibold">Upload an image</span>
            <span className="mt-1 text-xs text-[#6b7280]">PNG, JPG, or SVG. It stays in this design.</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onUpload(file)
                event.target.value = ''
              }}
            />
          </label>
        )}

        {panel === 'background' && (
          <div className="grid grid-cols-4 gap-2">
            {BACKGROUNDS.map((fill, index) => (
              <button
                key={index}
                aria-label="Set background"
                className="aspect-square rounded-xl ring-1 ring-black/10"
                style={{ background: fillCss(fill) }}
                onClick={() => onBackground(fill)}
              />
            ))}
            {brand.colors.map((color) => (
              <button
                key={color}
                aria-label={color}
                className="aspect-square rounded-xl ring-1 ring-black/10"
                style={{ background: color }}
                onClick={() => onBackground(color)}
              />
            ))}
          </div>
        )}

        {panel === 'layers' && (
          <div className="space-y-1">
            {page.elements.length === 0 && <p className="text-sm text-[#6b7280]">Nothing on this page yet.</p>}
            {[...page.elements].reverse().map((el) => (
              <div
                key={el.id}
                className={`flex items-center gap-1 rounded-xl px-2 py-1.5 ${selectedId === el.id ? 'bg-[#f4ebff]' : 'hover:bg-[#f6f7f9]'}`}
              >
                <button className="min-w-0 flex-1 truncate px-1 text-left text-sm" onClick={() => onSelect(el.id)}>
                  {layerName(el)}
                </button>
                <IconButton label="Forward" icon="front" onClick={() => onReorder(el.id, 1)} />
                <IconButton label="Backward" icon="back" onClick={() => onReorder(el.id, -1)} />
                <IconButton label={el.hidden ? 'Show' : 'Hide'} icon={el.hidden ? 'eyeOff' : 'eye'} onClick={() => onToggleHidden(el.id)} />
                <IconButton label={el.locked ? 'Unlock' : 'Lock'} icon={el.locked ? 'lock' : 'unlock'} onClick={() => onToggleLock(el.id)} />
                <IconButton label="Delete" icon="trash" onClick={() => onDelete(el.id)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function layerName(el) {
  if (el.type === 'text') return el.text.replace(/\n/g, ' ').slice(0, 28) || 'Text'
  if (el.type === 'image') return 'Photo'
  return el.shape === 'rect' ? 'Shape' : el.shape[0].toUpperCase() + el.shape.slice(1)
}

function IconButton({ label, icon, onClick }) {
  return (
    <button aria-label={label} title={label} className="rounded-md p-1 text-[#5c6370] hover:bg-white" onClick={onClick}>
      <Icon name={icon} className="h-3.5 w-3.5" />
    </button>
  )
}
