import { useMemo, useState } from 'react'
import { CATEGORIES, DESIGN_TYPES, TEMPLATES } from '../data/catalog'
import { FONTS, timeAgo } from '../lib/model'
import { DesignThumb } from './DesignThumb'
import { Icon, Wordmark } from './Icons'

const NAV = [
  ['home', 'Home', 'home'],
  ['projects', 'Projects', 'folder'],
  ['templates', 'Templates', 'grid'],
  ['brand', 'Brand', 'brand'],
  ['apps', 'Apps', 'apps'],
]

export function Home({ user, projects, brand, onBrand, onOpen, onCreate, onTemplate, onDelete, onLogout }) {
  const [tab, setTab] = useState('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [custom, setCustom] = useState(false)
  const [size, setSize] = useState({ width: 1080, height: 1080 })
  const needle = query.trim().toLowerCase()

  const templates = useMemo(
    () =>
      TEMPLATES.filter((template) => {
        const matchesCategory = category === 'All' || template.category === category
        const matchesQuery = !needle || template.name.toLowerCase().includes(needle) || template.category.toLowerCase().includes(needle)
        return matchesCategory && matchesQuery
      }),
    [category, needle],
  )

  const recent = useMemo(() => {
    return [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  }, [projects])

  const createTypes = [
    ...DESIGN_TYPES.filter((type) =>
      ['doc', 'whiteboard', 'presentation', 'ig-post', 'yt', 'poster', 'website'].includes(type.id),
    ),
    DESIGN_TYPES.find((type) => type.id === 'custom'),
  ].filter(Boolean)

  return (
    <div className="flex h-full bg-white text-[#0f1015]">
      <nav className="flex w-[72px] shrink-0 flex-col items-center border-r border-[#eceef2] bg-white py-3">
        <button aria-label="Canva home" className="mb-3" onClick={() => setTab('home')}>
          <Wordmark className="h-[18px] w-[48px]" />
        </button>
        <button
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b3dff] text-white shadow-md hover:bg-[#7a30ee]"
          aria-label="Create a design"
          onClick={() => onCreate(DESIGN_TYPES.find((type) => type.id === 'presentation'))}
        >
          <Icon name="plus" className="h-6 w-6" />
        </button>
        <div className="flex flex-1 flex-col gap-0.5">
          {NAV.map(([id, label, icon]) => (
            <button
              key={id}
              className={`flex w-[64px] flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold ${
                tab === id ? 'bg-[#f3e8ff] text-[#8b3dff]' : 'text-[#5c6370] hover:bg-[#f4f5f7]'
              }`}
              onClick={() => setTab(id)}
            >
              <Icon name={icon} className="h-[18px] w-[18px]" />
              {label}
            </button>
          ))}
        </div>
        <button className="flex flex-col items-center gap-1" onClick={onLogout} title="Log out">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b3dff] text-sm font-semibold text-white">
            {(user || 'Y').slice(0, 1).toUpperCase()}
          </span>
          <span className="text-[10px] text-[#6b7280]">Log out</span>
        </button>
      </nav>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          {(tab === 'home' || tab === 'templates') && (
            <label className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border border-[#e6e8ee] bg-[#f2f3f5] px-5 py-3.5">
              <Icon name="search" className="text-[#8b3dff]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What will you design today?"
                className="w-full bg-transparent text-base outline-none placeholder:text-[#8b93a2]"
              />
            </label>
          )}

          {tab === 'home' && (
            <>
              <section className="mt-8">
                <h1 className="text-[15px] font-semibold">Create a design</h1>
                <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
                  {createTypes.map((type) => (
                    <button
                      key={type.id}
                      className="w-[92px] shrink-0 text-center"
                      onClick={() => (type.id === 'custom' ? setCustom(true) : onCreate(type))}
                    >
                      <span className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#f2f3f5]">
                        <CreateGlyph id={type.id} tint={type.tint} />
                      </span>
                      <span className="mt-2 block text-[12px] font-medium text-[#3d4250]">{type.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent designs</h2>
                  <button className="text-sm font-semibold text-[#7D2AE8]" onClick={() => setTab('projects')}>
                    View all
                  </button>
                </div>
                {recent.length === 0 ? (
                  <p className="rounded-2xl bg-white px-4 py-8 text-sm text-[#6b7280]">No designs yet. Pick a format above.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {recent.slice(0, 4).map((project) => (
                      <ProjectCard key={project.id} project={project} onOpen={onOpen} onDelete={onDelete} />
                    ))}
                  </div>
                )}
              </section>

              <TemplateGrid
                templates={templates}
                category={category}
                onCategory={setCategory}
                onTemplate={onTemplate}
              />
            </>
          )}

          {tab === 'projects' && (
            <section>
              <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
              <p className="mt-1 text-sm text-[#6b7280]">{projects.length} saved on this device</p>
              {projects.length === 0 ? (
                <p className="mt-8 text-sm text-[#6b7280]">Your designs will show up here.</p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {recent.map((project) => (
                    <ProjectCard key={project.id} project={project} onOpen={onOpen} onDelete={onDelete} />
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'templates' && (
            <div className="mt-8">
              <TemplateGrid templates={templates} category={category} onCategory={setCategory} onTemplate={onTemplate} />
            </div>
          )}

          {tab === 'brand' && <BrandKit brand={brand} onBrand={onBrand} />}

          {tab === 'apps' && (
            <section>
              <h1 className="text-2xl font-semibold tracking-tight">Apps</h1>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <AppCard
                  title="Magic resize"
                  text="Open a design, then use Resize in the top bar. The page and every layer scale together."
                  action="Create a presentation"
                  onClick={() => onCreate(DESIGN_TYPES.find((type) => type.id === 'presentation'))}
                />
                <AppCard
                  title="Brand kit"
                  text="Colors and fonts you set here become the default for new text and shapes."
                  action="Edit brand"
                  onClick={() => setTab('brand')}
                />
                <AppCard
                  title="Presentation"
                  text="Add pages in the editor and play them full screen."
                  action="Start a deck"
                  onClick={() => onCreate(DESIGN_TYPES.find((type) => type.id === 'presentation'))}
                />
                <AppCard
                  title="Backgrounds"
                  text="Solid colors and gradients live in the editor’s Background tab."
                  action="New poster"
                  onClick={() => onCreate(DESIGN_TYPES.find((type) => type.id === 'poster'))}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      {custom && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setCustom(false)}>
          <form
            className="w-full max-w-sm rounded-3xl bg-white p-6"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault()
              onCreate({
                id: 'custom',
                label: 'Custom size',
                group: 'Custom',
                width: Math.max(100, Number(size.width) || 1080),
                height: Math.max(100, Number(size.height) || 1080),
              })
              setCustom(false)
            }}
          >
            <h2 className="text-lg font-semibold">Custom size</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-xs text-[#6b7280]">
                Width
                <input
                  type="number"
                  min="100"
                  value={size.width}
                  onChange={(event) => setSize((current) => ({ ...current, width: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#e6e8ee] px-3 py-2 text-sm text-[#16181d]"
                />
              </label>
              <label className="text-xs text-[#6b7280]">
                Height
                <input
                  type="number"
                  min="100"
                  value={size.height}
                  onChange={(event) => setSize((current) => ({ ...current, height: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#e6e8ee] px-3 py-2 text-sm text-[#16181d]"
                />
              </label>
            </div>
            <button className="mt-5 w-full rounded-full bg-[#7D2AE8] py-2.5 text-sm font-semibold text-white">Create design</button>
          </form>
        </div>
      )}
    </div>
  )
}

function TemplateGrid({ templates, category, onCategory, onTemplate }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Templates</h2>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((item) => (
          <button
            key={item}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${category === item ? 'bg-[#16181d] text-white' : 'bg-white text-[#3d4250]'}`}
            onClick={() => onCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 columns-2 gap-4 md:columns-3 xl:columns-4">
        {templates.map((template) => (
          <button
            key={template.id}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5"
            onClick={() => onTemplate(template)}
          >
            <DesignThumb page={template.pages[0]} />
            <span className="block px-3 pt-2 text-sm font-medium">{template.name}</span>
            <span className="block px-3 pb-3 text-xs text-[#6b7280]">{template.category}</span>
          </button>
        ))}
        {templates.length === 0 && <p className="text-sm text-[#6b7280]">No templates match that search.</p>}
      </div>
    </section>
  )
}

function ProjectCard({ project, onOpen, onDelete }) {
  return (
    <article className="group">
      <button className="block w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5" onClick={() => onOpen(project)}>
        <DesignThumb page={project.pages[0]} />
      </button>
      <div className="mt-2 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{project.name}</p>
          <p className="text-xs text-[#6b7280]">
            {project.designType} · {timeAgo(project.updatedAt)}
          </p>
        </div>
        <button
          aria-label={`Delete ${project.name}`}
          className="rounded-lg p-1 text-[#98a0ae] opacity-0 hover:bg-[#f4f5f7] hover:text-[#d11a3a] group-hover:opacity-100"
          onClick={() => onDelete(project.id)}
        >
          <Icon name="trash" className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

function BrandKit({ brand, onBrand }) {
  const [draft, setDraft] = useState(brand)
  return (
    <section className="max-w-xl">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Brand kit</h1>
        <span className="rounded-full bg-[#f4ebff] px-2 py-0.5 text-[11px] font-semibold text-[#7D2AE8]">Pro</span>
      </div>
      <label className="mt-6 block text-sm font-medium">
        Brand name
        <input
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          className="mt-1 w-full rounded-xl border border-[#e6e8ee] bg-white px-3 py-2"
        />
      </label>
      <p className="mt-6 text-sm font-medium">Colors</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {draft.colors.map((color, index) => (
          <label key={`${color}-${index}`} className="text-center text-[11px] text-[#6b7280]">
            <input
              type="color"
              value={color}
              onChange={(event) => {
                const colors = [...draft.colors]
                colors[index] = event.target.value
                setDraft({ ...draft, colors })
              }}
            />
            <span className="mt-1 block">{color}</span>
          </label>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FontField label="Heading font" value={draft.headingFont} onChange={(headingFont) => setDraft({ ...draft, headingFont })} />
        <FontField label="Body font" value={draft.bodyFont} onChange={(bodyFont) => setDraft({ ...draft, bodyFont })} />
      </div>
      <button
        className="mt-6 rounded-full bg-[#7D2AE8] px-5 py-2.5 text-sm font-semibold text-white"
        onClick={() => onBrand(draft)}
      >
        Save brand kit
      </button>
    </section>
  )
}

function FontField({ label, value, onChange }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-[#e6e8ee] bg-white px-3 py-2"
      >
        {FONTS.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
    </label>
  )
}

function AppCard({ title, text, action, onClick }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#4b5160]">{text}</p>
      <button className="mt-4 text-sm font-semibold text-[#7D2AE8]" onClick={onClick}>
        {action}
      </button>
    </article>
  )
}

function CreateGlyph({ id, tint }) {
  if (id === 'custom') {
    return (
      <span className="text-3xl font-light text-[#5c6370]" aria-hidden="true">
        ···
      </span>
    )
  }
  if (id === 'presentation') {
    return (
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <rect x="6" y="8" width="30" height="20" rx="3" fill={tint} />
        <path d="M16 32h10M21 28v4" stroke="#0e0e10" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'whiteboard') {
    return (
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <rect x="6" y="8" width="30" height="22" rx="3" fill="#E7FBFC" stroke={tint} strokeWidth="2" />
        <circle cx="16" cy="18" r="3" fill={tint} />
        <path d="M22 16h10M22 22h7" stroke={tint} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'website') {
    return (
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <rect x="5" y="8" width="32" height="24" rx="3" fill="white" stroke={tint} strokeWidth="2" />
        <path d="M5 14h32" stroke={tint} strokeWidth="2" />
        <circle cx="10" cy="11" r="1.2" fill={tint} />
      </svg>
    )
  }
  if (id === 'ig-story') {
    return (
      <svg width="36" height="42" viewBox="0 0 36 42" aria-hidden="true">
        <rect x="6" y="2" width="24" height="38" rx="6" fill={tint} />
        <rect x="10" y="8" width="16" height="20" rx="2" fill="white" opacity="0.9" />
      </svg>
    )
  }
  if (id === 'doc') {
    return (
      <svg width="36" height="42" viewBox="0 0 36 42" aria-hidden="true">
        <path d="M8 4h14l8 8v26a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="white" stroke={tint} strokeWidth="2" />
        <path d="M12 20h12M12 26h12M12 32h8" stroke={tint} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
      <rect x="7" y="9" width="28" height="24" rx="4" fill={tint} />
      <circle cx="16" cy="18" r="3" fill="white" />
      <path d="M10 29l7-6 5 4 4-3 6 5" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
