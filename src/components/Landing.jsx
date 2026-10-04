import { useEffect, useRef, useState } from 'react'
import { TEMPLATES } from '../data/catalog'
import { asset } from '../lib/asset'
import { DesignThumb } from './DesignThumb'
import { Icon, Wordmark } from './Icons'

const NAV = [
  {
    label: 'Design',
    items: ['Presentations', 'Social media', 'Video', 'Print products', 'Docs', 'Whiteboards', 'Logos', 'Websites'],
  },
  {
    label: 'Product',
    items: ['Visual Suite', 'Canva AI', 'Magic Studio', 'Brand Kit', 'Apps marketplace', 'Affinity'],
  },
  {
    label: 'Plans',
    items: ['Pricing', 'Pro', 'Business', 'Enterprise', 'Education', 'Nonprofits'],
  },
  {
    label: 'Business',
    items: ['Canva Business', 'Marketing', 'Sales', 'Content teams', 'Contact sales'],
  },
  {
    label: 'Education',
    items: ['K-12', 'Higher education', 'Teachers', 'Students'],
  },
  {
    label: 'Help',
    items: ['Help Center', 'Design School', 'Tutorials', 'Contact support'],
  },
]

const TABS = [
  { id: 'ai', label: 'AI', tint: 'bg-[linear-gradient(98deg,#00c4cc_-9%,#5a32fa_78%,#7630d7_158%)]' },
  { id: 'presentations', label: 'Presentations', tint: 'bg-[linear-gradient(90deg,#fb923c,#f97316)]' },
  { id: 'social', label: 'Social', tint: 'bg-[linear-gradient(90deg,#fb7185,#e11d48)]' },
  { id: 'video', label: 'Video', tint: 'bg-[linear-gradient(90deg,#c084fc,#7c3aed)]' },
]

const TAB_CARDS = {
  ai: [
    {
      title: 'Turn your image into an editable layout with Magic Layers',
      action: 'Explore Magic Layers',
      className: 'lg:col-span-2 bg-[linear-gradient(180deg,#cc00c5_0%,#d636e5_39%,#edd5ff_100%)]',
      image: asset('canva/magic-layers.png'),
      type: 'ig-post',
    },
    {
      title: 'Clean up photos with Magic Eraser',
      action: 'Explore Magic Eraser',
      className: 'lg:col-span-1 bg-[linear-gradient(180deg,#ff3363_0%,#ff8141_50%,#ffb7b1_100%)]',
      image: asset('canva/magic-eraser.png'),
      type: 'ig-post',
    },
    {
      title: 'Remove image and video backgrounds in one click',
      action: 'Explore Background Remover',
      className: 'lg:col-span-1 bg-[#ffd6d8] !text-[#0f1015]',
      image: asset('canva/bg-remover.png'),
      type: 'poster',
    },
    {
      title: 'Elevate your writing with Magic Write',
      action: 'Explore Magic Write',
      className: 'lg:col-span-2 bg-[linear-gradient(180deg,#0a87cc_0%,#2babc9_50%,#97e1ee_100%)]',
      image: asset('canva/magic-write.png'),
      type: 'doc',
    },
  ],
  presentations: [
    {
      title: 'Create presentations that engage and inspire',
      action: 'Explore Presentations',
      className: 'lg:col-span-2 bg-[linear-gradient(180deg,#f25e07_0%,#d97218_28%,#ffc94f_100%)]',
      image: asset('canva/presentations.png'),
      type: 'presentation',
    },
    {
      title: 'Find your perfect presentation template',
      action: 'Explore templates',
      className: 'lg:col-span-1 bg-[#ffdac4] !text-[#0f1015]',
      image: asset('canva/pres-templates-sm.png'),
      type: 'presentation',
    },
    {
      title: 'Stay on-brand with Brand Kit',
      action: 'Explore Brand Kit',
      className: 'lg:col-span-1 bg-[#111827]',
      image: asset('canva/brand-kit.png'),
      type: 'logo',
    },
    {
      title: 'Bring your presentations to life with animations',
      action: 'Explore animations',
      className: 'lg:col-span-2 bg-[linear-gradient(160deg,#ffe9ac_0%,#ffb020_100%)] !text-[#0f1015]',
      image: asset('canva/pres-anim.png'),
      type: 'presentation',
    },
  ],
  social: [
    {
      title: 'Effortlessly create your next video with trending templates',
      action: 'Explore the collection',
      className: 'lg:col-span-2 bg-[linear-gradient(160deg,#c4b5fd_0%,#6d28d9_100%)]',
      image: asset('canva/video-templates.png'),
      type: 'ig-post',
    },
    {
      title: 'Remove image and video backgrounds in one click',
      action: 'Explore Background Remover',
      className: 'lg:col-span-1 bg-[#ffd6d8] !text-[#0f1015]',
      image: asset('canva/bg-remover-desk.png'),
      type: 'ig-post',
    },
    {
      title: 'Sharpen any photo with Image Upscaler',
      action: 'Explore Image Upscaler',
      className: 'lg:col-span-1 bg-[linear-gradient(180deg,#0f172a_0%,#334155_100%)]',
      image: asset('canva/social-upscale.png'),
      type: 'ig-post',
    },
    {
      title: 'Resize designs instantly for any channel',
      action: 'Explore Magic Resize',
      className: 'lg:col-span-2 bg-[linear-gradient(160deg,#7c3aed_0%,#db2777_100%)]',
      image: asset('canva/social-resize.png'),
      type: 'fb-post',
    },
  ],
  video: [
    {
      title: 'Effortlessly turn clips to content with our video editor',
      action: 'Explore Video Editor',
      className: 'lg:col-span-2 bg-[linear-gradient(180deg,#111827_0%,#4c1d95_100%)]',
      image: asset('canva/video-editor.png'),
      type: 'yt',
    },
    {
      title: 'All your video templates in one place',
      action: 'Explore video templates',
      className: 'lg:col-span-1 bg-[#0f172a]',
      image: asset('canva/video-market-sm.png'),
      type: 'yt',
    },
    {
      title: 'Studio quality stock videos for every project',
      action: 'Explore stock videos',
      className: 'lg:col-span-1 bg-[linear-gradient(120deg,#34d399_0%,#0f766e_100%)]',
      image: asset('canva/video-stock-sm.png'),
      type: 'yt',
    },
    {
      title: 'Boost engagement with AI-powered captions',
      action: 'Explore Captions',
      className: 'lg:col-span-2 bg-[linear-gradient(120deg,#fecdd3_0%,#fb7185_100%)] !text-[#0f1015]',
      image: asset('canva/social-captions.png'),
      type: 'ig-story',
    },
  ],
}

export function Landing({ onEnter }) {
  const [tab, setTab] = useState('ai')
  const [menu, setMenu] = useState(false)
  const [openNav, setOpenNav] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const scrollerRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const root = scrollerRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(entry.intersectionRatio < 1),
      { root, threshold: [1] },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const lightHeader = !scrolled

  return (
    <div ref={scrollerRef} data-landing className="h-full overflow-y-auto bg-white text-[#0f1015]">
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-0 z-40 h-20 transition ${lightHeader ? 'text-white' : 'bg-white text-[#0f1015] shadow-[0_1px_0_rgba(15,16,20,0.06)]'}`}
        onMouseLeave={() => setOpenNav(null)}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-6 px-12">
          <button aria-label="Open menu" className="min-[980px]:hidden" onClick={() => setMenu(true)}>
            <Icon name="menu" />
          </button>
          <button aria-label="Canva home" onClick={() => onEnter('start')}>
            <Wordmark light={lightHeader} />
          </button>
          <nav className="hidden min-[980px]:flex flex-1 items-center justify-center gap-0.5">
            {NAV.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setOpenNav(item.label)}>
                <button className={`rounded-xl px-2 py-1.5 text-[16px] font-normal ${lightHeader ? 'hover:bg-white/10' : 'hover:bg-[#f4f5f7]'}`}>
                  {item.label}
                </button>
                {openNav === item.label && (
                  <div className="absolute top-full left-0 z-50 w-56 rounded-2xl bg-white p-2 text-[#0f1015] shadow-2xl ring-1 ring-black/5">
                    {item.items.map((link) => (
                      <button
                        key={link}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f4f5f7]"
                        onClick={() => onEnter('start')}
                      >
                        {link}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              className={`hidden h-8 items-center rounded-[10px] px-3 text-sm font-semibold sm:inline-flex ${lightHeader ? 'text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.85)] hover:bg-white/10' : 'text-[#0f1015] shadow-[inset_0_0_0_1px_rgba(53,65,90,0.2)] hover:bg-[#f4f5f7]'}`}
              onClick={() => onEnter('login')}
            >
              Sign up
            </button>
            <button
              className={`inline-flex h-8 items-center rounded-[10px] px-3 text-sm font-semibold ${lightHeader ? 'bg-white/90 text-[#0f1015]' : 'bg-[#8b3dff] text-white'}`}
              onClick={() => onEnter('login')}
            >
              Log in
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-white p-6 text-[#0f1015]">
          <div className="mb-8 flex items-center justify-between">
            <Wordmark />
            <button aria-label="Close menu" onClick={() => setMenu(false)}>
              <Icon name="close" />
            </button>
          </div>
          {NAV.map((item) => (
            <button
              key={item.label}
              className="block w-full border-b border-[#eee] py-4 text-left text-2xl font-medium"
              onClick={() => {
                setMenu(false)
                onEnter('start')
              }}
            >
              {item.label}
            </button>
          ))}
          <button className="mt-8 w-full rounded-full bg-[#0f1015] py-3 text-sm font-semibold text-white" onClick={() => onEnter('start')}>
            Start designing
          </button>
        </div>
      )}

      <section className="relative min-h-[876px] overflow-hidden bg-[linear-gradient(180deg,#992bff_0%,#5a32fa_30.09%,#13a3b5_56.76%,#93e8f6_76.85%,#f1ebff_95.28%,#ffffff_100%)] text-white">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-6 pt-[175px] text-center">
          <h1
            className="max-w-[14ch] text-[clamp(40px,5.55vw,80px)] font-normal tracking-[-0.8px] text-white/90"
            style={{ lineHeight: 1.1 }}
          >
            What will you design today?
          </h1>
          <p className="mt-4 max-w-[28ch] text-[24px] leading-[33.6px] font-normal text-white/90 sm:max-w-none">
            Make AI-powered social posts, videos, presentations, and more with Canva.
          </p>
          <button
            className="mt-7 inline-flex h-14 w-48 items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.898)] text-base font-semibold text-[#0f1015] shadow-sm hover:bg-white"
            onClick={() => onEnter('start')}
          >
            Start designing
          </button>
        </div>
        <StickerField />
      </section>

      <section id="tools" className="bg-white px-4 pt-6 pb-20 sm:px-6">
        <div className="mx-auto max-w-[1288px]">
          <h2 className="text-center text-[clamp(32px,3.9vw,56px)] leading-[1.1] font-normal tracking-[-0.56px] text-[#0f1015]">
            Tools to power your best work
          </h2>
          <div className="mx-auto mt-7 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(20,16,40,0.12)]">
            {TABS.map((item) => (
              <button
                key={item.id}
                className={`flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-[16px] font-semibold ${
                  tab === item.id ? `${item.tint} text-white` : 'text-[#3f3f46] hover:bg-[#f4f5f7]'
                }`}
                onClick={() => setTab(item.id)}
              >
                <TabGlyph id={item.id} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {TAB_CARDS[tab].map((card) => (
              <button
                key={card.title}
                className={`flex min-h-[520px] flex-col overflow-hidden rounded-[24px] text-left text-white ${card.className}`}
                onClick={() => onEnter('start', card.type)}
              >
                <div className="px-8 pt-8 pb-4">
                  <h3 className="max-w-[18ch] text-[28px] leading-[35px] font-medium tracking-[-0.28px] sm:text-[32px] sm:leading-[40px] sm:font-semibold">
                    {card.title}
                  </h3>
                  <span className="mt-5 inline-flex h-10 w-fit max-w-full items-center truncate rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]">
                    {card.action}
                  </span>
                </div>
                <img src={card.image} alt="" className="mt-auto w-full object-cover object-top" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1288px] px-4 py-16 sm:px-6">
        <h2 className="text-center text-[clamp(32px,4vw,56px)] font-normal tracking-[-0.56px] leading-[1.1]">
          All the tools. All in one place.
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="flex min-h-[720px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#7c3aed_0%,#2563eb_55%,#67e8f9_100%)] text-white">
            <div className="p-10">
              <h3 className="max-w-[12ch] text-[32px] leading-[40px] font-semibold tracking-[-0.32px]">Meet the Visual Suite</h3>
              <p className="mt-4 max-w-md text-lg leading-7 text-white/95">
                Your entire workflow in one place for seamless creation and collaboration, powered by AI.
              </p>
              <button className="mt-6 h-10 w-fit rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]" onClick={() => onEnter('start')}>
                Explore Visual Suite
              </button>
            </div>
            <img src={asset('canva/visual-suite.png')} alt="" className="mt-auto w-full" />
          </article>
          <article className="flex min-h-[720px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#fdba74_0%,#fb923c_40%,#fff7ed_100%)] text-[#0f1015]">
            <div className="p-10">
              <h3 className="max-w-[12ch] text-[32px] leading-[40px] font-semibold tracking-[-0.32px]">Present with impact</h3>
              <p className="mt-4 max-w-md text-lg leading-7">
                Reimagine presentations with cinematic visuals, smart collaboration, and AI-powered tools.
              </p>
              <button className="mt-6 h-10 w-fit rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015] shadow-sm" onClick={() => onEnter('start', 'presentation')}>
                Try Presentations
              </button>
            </div>
            <img src={asset('canva/present-impact.png')} alt="" className="mt-auto w-full" />
          </article>
        </div>
      </section>

      <section id="templates" className="bg-white py-20">
        <div className="mx-auto max-w-[1288px] px-4 sm:px-6">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.1] font-normal tracking-[-0.56px]">
              Templates for absolutely anything
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button className="h-10 rounded-[12px] bg-[#8b3dff] px-4 text-sm font-semibold text-white" onClick={() => onEnter('start')}>
                Start designing for free
              </button>
              <button className="h-10 rounded-[12px] px-4 text-sm font-semibold text-[#0f1015] shadow-[inset_0_0_0_1px_rgba(53,65,90,0.25)]" onClick={() => onEnter('start')}>
                Browse all templates
              </button>
            </div>
          </div>
          <div className="relative mt-8">
            <button
              aria-label="Previous templates"
              className="absolute top-1/2 -left-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#7D2AE8] shadow-lg ring-1 ring-[#eceef2] sm:flex"
              onClick={() => {
                const node = scrollerRef.current?.querySelector('[data-templates]')
                node?.scrollBy({ left: -280, behavior: 'smooth' })
              }}
            >
              ‹
            </button>
            <div data-templates className="no-scrollbar flex gap-4 overflow-x-auto px-1 pb-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className="w-[220px] shrink-0 overflow-hidden rounded-[18px] bg-[#f2f3f5] text-left"
                  onClick={() => onEnter('template', template.id)}
                >
                  <DesignThumb page={template.pages[0]} />
                  <span className="block bg-white px-3 py-2.5 text-sm font-medium">{template.name}</span>
                </button>
              ))}
            </div>
            <button
              aria-label="Next templates"
              className="absolute top-1/2 -right-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#7D2AE8] shadow-lg ring-1 ring-[#eceef2] sm:flex"
              onClick={() => {
                const node = scrollerRef.current?.querySelector('[data-templates]')
                node?.scrollBy({ left: 280, behavior: 'smooth' })
              }}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1288px] px-4 py-8 sm:px-6">
        <h2 className="text-center text-[clamp(32px,4vw,56px)] font-normal tracking-[-0.56px] leading-[1.1]">
          Unlock Canva’s creative ecosystem
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="flex min-h-[420px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#7c3aed_0%,#1d4ed8_40%,#99f6e4_100%)] text-white lg:col-span-2">
            <div className="p-8">
              <h3 className="max-w-[16ch] text-[32px] leading-[40px] font-semibold">Get inspired, build skills and discover what you can create</h3>
              <button className="mt-5 h-10 rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]" onClick={() => onEnter('start')}>
                Explore Canva World Tour
              </button>
            </div>
            <img src={asset('canva/world-tour.png')} alt="" className="mt-auto w-full object-cover" />
          </article>
          <article className="flex min-h-[420px] flex-col overflow-hidden rounded-[24px] bg-[#5b21b6] text-white">
            <div className="p-8">
              <h3 className="max-w-[16ch] text-[32px] leading-[40px] font-semibold">Create magic with My Little Pony Designs</h3>
              <button className="mt-5 h-10 rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]" onClick={() => onEnter('start')}>
                Explore the collection
              </button>
            </div>
            <img src={asset('canva/mlp.png')} alt="" className="mt-auto w-full object-cover" />
          </article>
          <article className="flex min-h-[360px] flex-col overflow-hidden rounded-[24px] bg-[#312e81] text-white">
            <div className="p-8">
              <h3 className="max-w-[16ch] text-[28px] leading-[35px] font-semibold">End-to-end platform for large organizations</h3>
              <button className="mt-5 h-10 rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]" onClick={() => onEnter('start')}>
                Explore Canva Enterprise
              </button>
            </div>
            <img src={asset('canva/enterprise.png')} alt="" className="mt-auto w-full object-cover" />
          </article>
          <article className="flex min-h-[360px] flex-col overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#fb7185,#f43f5e)] text-white lg:col-span-2">
            <div className="p-8">
              <h3 className="max-w-[16ch] text-[28px] leading-[35px] font-semibold">Built for small businesses with big aspirations</h3>
              <button className="mt-5 h-10 rounded-xl bg-white/90 px-4 text-sm font-semibold text-[#0f1015]" onClick={() => onEnter('start')}>
                Explore Canva Business
              </button>
            </div>
            <img src={asset('canva/business.png')} alt="" className="mt-auto w-full object-cover" />
          </article>
        </div>
      </section>

      <footer className="mt-10 border-t border-[#eee] bg-white">
        <div className="mx-auto grid max-w-[1288px] gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER.map((column) => (
            <div key={column.label}>
              <h3 className="text-sm font-semibold">{column.label}</h3>
              <ul className="mt-3 space-y-2 text-sm text-[#5c6370]">
                {column.items.map((item) => (
                  <li key={item}>
                    <button className="hover:text-[#0f1015]" onClick={() => onEnter('start')}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-[1288px] flex-wrap items-center justify-between gap-3 px-5 pb-8 text-sm text-[#6b7280]">
          <Wordmark />
          <p>© {new Date().getFullYear()} Unofficial recreation. Not affiliated with Canva.</p>
        </div>
      </footer>
    </div>
  )
}

function TabGlyph({ id }) {
  if (id === 'ai') return <span aria-hidden="true">✨</span>
  if (id === 'presentations') return <span aria-hidden="true">🖥️</span>
  if (id === 'social') return <span aria-hidden="true">❤️</span>
  if (id === 'video') return <span aria-hidden="true">▶️</span>
  return null
}

const FOOTER = [
  { label: 'Product', items: ['Latest launches', 'Visual Suite', 'Canva AI', 'Brand management', 'Social media', 'Print', 'Apps Marketplace', 'Affinity'] },
  { label: 'Plans', items: ['Pricing', 'Pro', 'Business', 'Enterprise', 'Education', 'Nonprofits', 'Contact Sales'] },
  { label: 'About', items: ['About Canva', 'Newsroom', 'Careers', 'Social impact', 'Sustainability'] },
  { label: 'Help', items: ['Help Center', 'Design School', 'Security', 'Trust Center', 'Accessibility'] },
]

function StickerField() {
  const top = ['floating-font.png', 'floating-ai.png', 'floating-heart.png', 'floating-video.png']
  const bottom = ['floating-wheel.png', 'floating-sticky.png', 'floating-c.png', 'floating-ball.png', 'floating-code.png']
  return (
    <div className="relative mx-auto mt-14 flex max-w-[1180px] flex-col items-center gap-8 px-4 pb-28">
      <div className="flex items-center justify-center gap-8">
        {top.map((src) => (
          <img key={src} src={asset(`canva/${src}`)} alt="" className="h-[170px] w-[170px] object-contain" />
        ))}
      </div>
      <div className="flex items-center justify-center gap-8">
        {bottom.map((src) => (
          <img key={src} src={asset(`canva/${src}`)} alt="" className="h-[170px] w-[170px] object-contain" />
        ))}
      </div>
    </div>
  )
}
