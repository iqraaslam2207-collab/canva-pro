import { useState } from 'react'
import { Icon, Wordmark } from './Icons'

const TILES = [
  { title: 'Studio', tone: 'from-[#1f2937] to-[#111827]', type: 'editorial' },
  { title: 'Monthly report', tone: 'from-[#7c3aed] to-[#4c1d95]', type: 'chart' },
  { title: 'Go-to market', tone: 'from-[#fde68a] to-[#f59e0b]', type: 'grid', dark: true },
  { title: 'Pre-order', tone: 'from-[#1e3a8a] to-[#0f172a]', type: 'photo' },
  { title: 'Get to know', tone: 'from-[#a5f3fc] to-[#22d3ee]', type: 'type', dark: true },
  { title: 'Digital marketing', tone: 'from-[#86efac] to-[#16a34a]', type: 'poster', dark: true },
  { title: 'Brand guidelines', tone: 'from-[#fbcfe8] to-[#db2777]', type: 'photo' },
  { title: 'Campaign', tone: 'from-[#c4b5fd] to-[#7c3aed]', type: 'type' },
  { title: '2040', tone: 'from-[#e5e7eb] to-[#9ca3af]', type: 'year', dark: true },
  { title: 'Sale 25%', tone: 'from-[#67e8f9] to-[#0891b2]', type: 'sale' },
  { title: 'Training', tone: 'from-[#fef3c7] to-[#f59e0b]', type: 'list', dark: true },
  { title: 'Annual report', tone: 'from-[#34d399] to-[#047857]', type: 'chart' },
  { title: 'Seminar', tone: 'from-[#1e1b4b] to-[#312e81]', type: 'event' },
  { title: 'Zero waste', tone: 'from-[#bbf7d0] to-[#22c55e]', type: 'poster', dark: true },
  { title: 'Tech talk', tone: 'from-[#1d4ed8] to-[#1e3a8a]', type: 'type' },
  { title: 'Onboarding', tone: 'from-[#fdba74] to-[#ea580c]', type: 'list' },
  { title: 'Lookbook', tone: 'from-[#fecdd3] to-[#fb7185]', type: 'photo' },
  { title: 'Pitch deck', tone: 'from-[#ddd6fe] to-[#8b5cf6]', type: 'grid', dark: true },
]

export function Login({ onClose, onEnter }) {
  const [mode, setMode] = useState('pick')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function finish(value) {
    const next = (value || name).trim()
    if (!next) return
    onEnter(next)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b0c10]">
      <div className="pointer-events-none absolute inset-0 columns-2 gap-2 p-2 opacity-80 sm:columns-3 md:columns-4 lg:columns-5">
        {TILES.map((tile) => (
          <MosaicTile key={tile.title} tile={tile} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[rgba(8,10,16,0.55)]" />

      <header className="relative z-10 flex h-14 items-center justify-between px-4 text-white sm:h-16 sm:px-6">
        <button aria-label="Canva home" onClick={onClose}>
          <Wordmark light className="h-6 w-16 sm:h-[30px] sm:w-[80px]" />
        </button>
        <button aria-label="Close" className="rounded-lg p-2 hover:bg-white/10" onClick={onClose}>
          <Icon name="close" />
        </button>
      </header>

      <div className="relative z-10 flex min-h-[calc(100%-3.5rem)] items-start justify-center p-4 pb-10 sm:items-center sm:min-h-[calc(100%-4rem)]">
        <div className="w-full max-w-[420px] rounded-[28px] bg-[#2c2d31] px-5 py-7 text-white shadow-[0_40px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
          {mode === 'pick' ? (
            <>
              <h1 className="text-[32px] leading-[1.15] font-semibold tracking-[-0.03em]">
                Log in or sign up in seconds
              </h1>
              <p className="mt-3 text-[15px] leading-6 text-white/80">
                Use your email or another service to continue with Canva (it’s free)!
              </p>
              <div className="mt-7 space-y-3">
                <AuthButton
                  label="Continue with Google"
                  icon={<GoogleMark />}
                  onClick={() => finish('You')}
                />
                <AuthButton
                  label="Continue with Facebook"
                  icon={<FacebookMark />}
                  onClick={() => finish('You')}
                />
                <AuthButton
                  label="Continue with email"
                  icon={<Icon name="mail" className="h-5 w-5" />}
                  onClick={() => setMode('email')}
                />
              </div>
              <button className="mt-5 w-full py-2 text-center text-sm font-semibold" onClick={() => setMode('email')}>
                Continue another way
              </button>
              <p className="mt-5 text-[12px] leading-5 text-white/70">
                By continuing, you agree to Canva’s{' '}
                <span className="text-[#c4b5fd] underline">Terms of Use</span>. Read our{' '}
                <span className="text-[#c4b5fd] underline">Privacy Policy</span>.
              </p>
              <button className="mt-5 flex items-center gap-2 text-sm font-semibold" onClick={() => setMode('email')}>
                <Icon name="folder" className="h-4 w-4" />
                Signing up for a business
              </button>
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                finish(name || email.split('@')[0] || 'You')
              }}
            >
              <h1 className="text-[32px] leading-[1.15] font-semibold tracking-[-0.03em]">Continue with email</h1>
              <p className="mt-3 text-sm text-white/75">This replica keeps your name on this device. No password.</p>
              <label className="mt-6 block text-xs font-semibold tracking-wide text-white/60 uppercase">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <label className="mt-4 block text-xs font-semibold tracking-wide text-white/60 uppercase">
                Name
                <input
                  autoFocus
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-semibold text-[#111]">Continue</button>
              <button type="button" className="mt-3 w-full py-2 text-sm text-white/70" onClick={() => setMode('pick')}>
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function AuthButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/25 px-4 text-sm font-semibold hover:bg-white/5"
      onClick={onClick}
    >
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      <span className="flex-1 text-center pr-6">{label}</span>
    </button>
  )
}

function MosaicTile({ tile }) {
  return (
    <article className={`mb-2 break-inside-avoid overflow-hidden rounded-xl bg-gradient-to-br p-4 ${tile.tone} ${tile.dark ? 'text-[#111]' : 'text-white'}`}>
      <p className="text-[11px] tracking-[0.18em] uppercase opacity-70">Design</p>
      <h2 className="mt-6 text-2xl leading-none font-semibold tracking-tight">{tile.title}</h2>
      {tile.type === 'chart' && (
        <div className="mt-8 flex h-16 items-end gap-1">
          {[40, 70, 55, 90, 35, 80].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-white/70" style={{ height: `${h}%` }} />
          ))}
        </div>
      )}
      {tile.type === 'grid' && (
        <div className="mt-8 grid grid-cols-4 gap-1">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="aspect-square rounded bg-white/50" />
          ))}
        </div>
      )}
      {tile.type === 'list' && (
        <div className="mt-8 space-y-2">
          <span className="block h-2 w-3/4 rounded bg-white/50" />
          <span className="block h-2 w-1/2 rounded bg-white/40" />
          <span className="block h-2 w-2/3 rounded bg-white/30" />
        </div>
      )}
      {tile.type === 'year' && <p className="mt-10 text-5xl font-black tracking-tight">2040</p>}
    </article>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.5 3.6-5.2 3.6-3.1 0-5.7-2.6-5.7-5.8S8.9 6 12 6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.5 14.6 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 11.7S6.9 20.8 12 20.8c5.2 0 8.6-3.6 8.6-8.7 0-.6 0-1-.1-1.5H12z" />
    </svg>
  )
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path fill="#fff" d="M13.6 19v-6.2h2.1l.3-2.4h-2.4V8.9c0-.7.2-1.2 1.2-1.2H16V5.5c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8H9v2.4h2.2V19h2.4z" />
    </svg>
  )
}
