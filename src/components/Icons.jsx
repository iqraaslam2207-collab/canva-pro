import { asset } from '../lib/asset'

export function Wordmark({ light = false, className = '' }) {
  return (
    <img
      src={light ? asset('canva/logo-white.svg') : asset('canva/logo-color.svg')}
      alt="Canva"
      width="80"
      height="30"
      className={className || 'h-[30px] w-[80px]'}
    />
  )
}

const paths = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  home: (
    <>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M7 10.5V20h10v-9.5" />
    </>
  ),
  folder: <path d="M3 7.5A2 2 0 0 1 5 5.5h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </>
  ),
  brand: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  apps: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <path d="M13 16.5h7M16.5 13v7" />
    </>
  ),
  templates: <path d="M5 4h6v7H5zM13 4h6v4h-6zM13 10h6v10h-6zM5 13h6v7H5z" />,
  elements: (
    <>
      <circle cx="8" cy="8" r="3.2" />
      <rect x="13" y="5" width="6" height="6" rx="1" />
      <path d="M5 16l4 4 4-6 6 8H5z" />
    </>
  ),
  text: <path d="M5 6h14M12 6v13M8 19h8" />,
  photo: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="M4 16l4.5-4 3 3 2.5-2.5L20 16" />
    </>
  ),
  upload: <path d="M12 16V6m0 0 4 4M12 6 8 10M5 19h14" />,
  layers: <path d="M12 4 4 8l8 4 8-4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" />,
  background: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
    </>
  ),
  undo: <path d="M8 8H4v4M4.5 12a8 8 0 1 0 2-5.5L4 8" />,
  redo: <path d="M16 8h4v4M19.5 12a8 8 0 1 1-2-5.5L20 8" />,
  download: <path d="M12 5v10m0 0 4-4m-4 4-4-4M5 19h14" />,
  share: <path d="M15 8a2.2 2.2 0 1 0-2.1-2.8L8.2 8.2a2.2 2.2 0 1 0 0 3.6l4.7 3a2.2 2.2 0 1 0 .7-1.6l-4.2-2.7a2 2 0 0 0 0-.9l4.2-2.6c.2.1.5.1.7.1" />,
  play: <path d="M8 6.5v11l9-5.5-9-5.5z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <path d="M5 7h14M9 7V5h6v2m-7 0 1 12h6l1-12" />,
  copy: <path d="M8 8h10v12H8zM6 16H5V4h10v2" />,
  lock: <path d="M8 11V8a4 4 0 0 1 8 0v3M7 11h10v9H7z" />,
  unlock: <path d="M8 11V8a4 4 0 0 1 7.5-2M7 11h10v9H7z" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </>
  ),
  eyeOff: <path d="M4 5l16 14M9.5 9.7A3 3 0 0 0 12 15a3 3 0 0 0 2.2-1M6 7.5C3.8 9 2 12 2 12s3.5 6 10 6c1.6 0 3-.4 4.2-1M10 6.2A12 12 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-2.2 2.8" />,
  bold: <path d="M8 5h5.2a3.2 3.2 0 0 1 0 6.4H8zm0 6.4h6a3.4 3.4 0 0 1 0 6.8H8z" />,
  italic: <path d="M14 5h-5M15 19H9M13 5 10 19" />,
  alignLeft: <path d="M5 7h14M5 12h9M5 17h12" />,
  alignCenter: <path d="M5 7h14M8 12h8M6 17h12" />,
  alignRight: <path d="M5 7h14M10 12h9M7 17h12" />,
  front: <path d="M12 5v10M8 9l4-4 4 4M6 19h12" />,
  back: <path d="M12 19V9M8 15l4 4 4-4M6 5h12" />,
  present: <path d="M4 6h16v9H4zM8 19h8M12 15v4" />,
  resize: <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  spark: <path d="M12 3l1.2 5.2L18 9.5l-4.8 1.3L12 16l-1.2-5.2L6 9.5l4.8-1.3L12 3zM18 14l.6 2.2L21 17l-2.4.8L18 20l-.6-2.2L15 17l2.4-.8L18 14z" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  sparkle: <path d="M12 3l1.1 5.1L18 9.2l-4.9 1.1L12 15.4l-1.1-5.1L6 9.2l4.9-1.1L12 3z" />,
  board: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M8 19h8" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18M8 5v4" />
    </>
  ),
}

export function Icon({ name, className = '' }) {
  const sized = /\b(?:h|w|size)-/.test(className) ? className : `h-5 w-5 ${className}`
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${sized}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
