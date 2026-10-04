import { createImage, createPage, createShape, createText } from '../lib/model'

export const DESIGN_TYPES = [
  { id: 'doc', label: 'Docs', group: 'Docs', width: 794, height: 1123, tint: '#12A36A' },
  { id: 'whiteboard', label: 'Whiteboards', group: 'Docs', width: 1920, height: 1080, tint: '#00C4CC' },
  { id: 'presentation', label: 'Presentations', group: 'Presentations', width: 1920, height: 1080, tint: '#7D2AE8' },
  { id: 'ig-post', label: 'Social media', group: 'Social', width: 1080, height: 1080, tint: '#FF5A8A' },
  { id: 'yt', label: 'Videos', group: 'Video', width: 1280, height: 720, tint: '#FF3B30' },
  { id: 'poster', label: 'Print products', group: 'Print', width: 1080, height: 1520, tint: '#FF8A3D' },
  { id: 'website', label: 'Websites', group: 'Brand', width: 1440, height: 900, tint: '#3B6CFF' },
  { id: 'ig-story', label: 'Story', group: 'Social', width: 1080, height: 1920, tint: '#FF8A3D' },
  { id: 'fb-post', label: 'Facebook Post', group: 'Social', width: 1200, height: 630, tint: '#3B6CFF' },
  { id: 'logo', label: 'Logo', group: 'Brand', width: 800, height: 800, tint: '#00A3AD' },
  { id: 'card', label: 'Business Card', group: 'Print', width: 1050, height: 600, tint: '#C2410C' },
  { id: 'custom', label: 'More', group: 'Custom', width: 1080, height: 1080, tint: '#5C6370' },
]

export const BACKGROUNDS = [
  '#ffffff',
  '#0F1014',
  '#7D2AE8',
  '#00C4CC',
  '#FF5A6A',
  '#F6F1E8',
  '#E7F6F7',
  '#1F2937',
  '#FDE68A',
  '#111111',
  { angle: 150, stops: ['#6C2BD9', '#00C4CC'] },
  { angle: 180, stops: ['#FF7A45', '#7D2AE8'] },
  { angle: 135, stops: ['#111111', '#5B21B6'] },
  { angle: 120, stops: ['#FDE68A', '#F97316'] },
  { angle: 160, stops: ['#042F2E', '#14B8A6'] },
  { angle: 200, stops: ['#F8E7F5', '#C4B5FD'] },
]

export const SHAPE_PRESETS = [
  { shape: 'rect', label: 'Square', radius: 0, width: 220, height: 220, fill: '#7D2AE8' },
  { shape: 'rect', label: 'Rounded', radius: 36, width: 260, height: 160, fill: '#00C4CC' },
  { shape: 'rect', label: 'Pill', radius: 80, width: 280, height: 84, fill: '#0F1014' },
  { shape: 'ellipse', label: 'Circle', radius: 0, width: 200, height: 200, fill: '#FF5A6A' },
  { shape: 'ellipse', label: 'Oval', radius: 0, width: 280, height: 160, fill: '#F6C945' },
  { shape: 'triangle', label: 'Triangle', radius: 0, width: 200, height: 180, fill: '#3B6CFF' },
  { shape: 'star', label: 'Star', radius: 0, width: 200, height: 200, fill: '#F59E0B' },
  { shape: 'line', label: 'Line', radius: 0, width: 340, height: 8, fill: '#0F1014' },
]

function svgUrl(body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const PHOTOS = [
  {
    id: 'coast',
    name: 'Coast at dusk',
    src: svgUrl(`
      <defs>
        <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8EC8F8"/>
          <stop offset="0.48" stop-color="#F6C98A"/>
          <stop offset="1" stop-color="#155E75"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#a)"/>
      <circle cx="640" cy="110" r="46" fill="#FFE3A3"/>
      <path d="M0 340 C150 280 250 410 420 350 C560 300 680 390 800 330 V600 H0Z" fill="#E9F7FF" opacity=".9"/>
      <path d="M0 430 C180 390 280 500 480 450 C640 410 700 480 800 450 V600 H0Z" fill="#0F6E86"/>
    `),
  },
  {
    id: 'city',
    name: 'Night city',
    src: svgUrl(`
      <rect width="800" height="600" fill="#0B1020"/>
      <rect x="70" y="180" width="90" height="420" fill="#1E293B"/>
      <rect x="180" y="90" width="120" height="510" fill="#312E81"/>
      <rect x="320" y="220" width="80" height="380" fill="#1E3A5F"/>
      <rect x="420" y="140" width="150" height="460" fill="#4C1D95"/>
      <rect x="590" y="250" width="110" height="350" fill="#1F2937"/>
      <g fill="#FDE68A">
        <rect x="100" y="220" width="14" height="10"/>
        <rect x="130" y="260" width="14" height="10"/>
        <rect x="210" y="140" width="16" height="12"/>
        <rect x="250" y="200" width="16" height="12"/>
        <rect x="450" y="190" width="18" height="12"/>
        <rect x="500" y="250" width="18" height="12"/>
        <rect x="620" y="300" width="14" height="10"/>
      </g>
      <rect y="520" width="800" height="80" fill="#111827"/>
    `),
  },
  {
    id: 'studio',
    name: 'Studio portrait',
    src: svgUrl(`
      <defs>
        <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#F8D7C4"/>
          <stop offset="1" stop-color="#C084FC"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#b)"/>
      <circle cx="400" cy="230" r="110" fill="#F3C7A5"/>
      <path d="M250 600 C270 430 330 360 400 360 C470 360 530 430 550 600Z" fill="#3B0764"/>
      <path d="M290 250 C300 140 500 140 510 250 C470 210 340 210 290 250Z" fill="#1F2937"/>
    `),
  },
  {
    id: 'flora',
    name: 'Soft florals',
    src: svgUrl(`
      <rect width="800" height="600" fill="#F7F3EE"/>
      <circle cx="250" cy="280" r="120" fill="#F9A8D4"/>
      <circle cx="430" cy="230" r="90" fill="#FDBA74"/>
      <circle cx="520" cy="360" r="130" fill="#C4B5FD"/>
      <circle cx="340" cy="390" r="70" fill="#FDE68A"/>
      <rect x="80" y="470" width="640" height="16" rx="8" fill="#111827" opacity=".15"/>
    `),
  },
  {
    id: 'desert',
    name: 'Desert road',
    src: svgUrl(`
      <rect width="800" height="600" fill="#F6D7A8"/>
      <circle cx="620" cy="140" r="54" fill="#F97316"/>
      <path d="M0 360 L800 300 L800 600 L0 600Z" fill="#E7B56A"/>
      <path d="M0 430 L800 390 L800 600 L0 600Z" fill="#C2410C" opacity=".35"/>
      <path d="M380 600 L430 390 L470 390 L520 600Z" fill="#44403C"/>
    `),
  },
  {
    id: 'coffee',
    name: 'Coffee flatlay',
    src: svgUrl(`
      <rect width="800" height="600" fill="#E7D3C5"/>
      <circle cx="300" cy="300" r="150" fill="#F8F1EA"/>
      <circle cx="300" cy="300" r="110" fill="#6F4E37"/>
      <circle cx="270" cy="270" r="28" fill="#F5E6D3" opacity=".7"/>
      <rect x="470" y="180" width="180" height="240" rx="16" fill="#FFF7ED"/>
      <rect x="500" y="230" width="120" height="10" rx="5" fill="#D6D3D1"/>
      <rect x="500" y="260" width="90" height="10" rx="5" fill="#D6D3D1"/>
    `),
  },
  {
    id: 'mesh',
    name: 'Color mesh',
    src: svgUrl(`
      <rect width="800" height="600" fill="#0F172A"/>
      <circle cx="180" cy="160" r="220" fill="#7C3AED" opacity=".9"/>
      <circle cx="620" cy="180" r="200" fill="#06B6D4" opacity=".75"/>
      <circle cx="420" cy="480" r="240" fill="#F43F5E" opacity=".7"/>
    `),
  },
  {
    id: 'product',
    name: 'Product light',
    src: svgUrl(`
      <rect width="800" height="600" fill="#F4F4F5"/>
      <ellipse cx="400" cy="470" rx="180" ry="28" fill="#E4E4E7"/>
      <rect x="300" y="160" width="200" height="280" rx="28" fill="#18181B"/>
      <rect x="330" y="200" width="140" height="180" rx="12" fill="#7C3AED"/>
    `),
  },
]

const textPresets = [
  { label: 'Add a heading', text: 'Add a heading', fontSize: 84, fontWeight: 800, fontFamily: 'Poppins', height: 120, letterSpacing: -2 },
  { label: 'Add a subheading', text: 'Add a subheading', fontSize: 40, fontWeight: 600, fontFamily: 'Poppins', height: 70, letterSpacing: -0.6 },
  { label: 'Add body text', text: 'Add a little bit of body text', fontSize: 24, fontWeight: 500, fontFamily: 'Inter', height: 80, letterSpacing: 0 },
  { label: 'Add a label', text: 'LABEL', fontSize: 18, fontWeight: 700, fontFamily: 'Outfit', height: 40, letterSpacing: 6 },
]

export const TEXT_PRESETS = textPresets

function page(width, height, background, elements, name = 'Page 1') {
  return createPage({ width, height, background, elements, name })
}

export const TEMPLATES = [
  {
    id: 'summer-sale',
    name: 'Summer sale',
    category: 'Social',
    pages: [
      page(1080, 1080, { angle: 150, stops: ['#5B21E6', '#14B8C7'] }, [
        createShape('ellipse', { x: 760, y: -160, width: 480, height: 480, fill: 'rgba(255,255,255,0.16)' }),
        createShape('ellipse', { x: -180, y: 780, width: 420, height: 420, fill: 'rgba(255,255,255,0.12)' }),
        createText({
          text: 'SUMMER EDIT',
          x: 80,
          y: 170,
          width: 700,
          height: 48,
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 8,
          color: '#ffffff',
        }),
        createText({
          text: 'Sale',
          x: 72,
          y: 220,
          width: 900,
          height: 200,
          fontSize: 188,
          fontWeight: 800,
          fontFamily: 'Poppins',
          letterSpacing: -8,
          color: '#ffffff',
        }),
        createText({
          text: 'Up to 50% off styles\nyou will actually wear.',
          x: 84,
          y: 450,
          width: 700,
          height: 140,
          fontSize: 36,
          fontWeight: 500,
          fontFamily: 'Outfit',
          letterSpacing: 0,
          lineHeight: 1.25,
          color: '#F4F7FF',
        }),
        createShape('rect', { x: 84, y: 680, width: 250, height: 72, radius: 36, fill: '#ffffff' }),
        createText({
          text: 'Shop now',
          x: 84,
          y: 698,
          width: 250,
          height: 42,
          fontSize: 26,
          fontWeight: 700,
          fontFamily: 'Poppins',
          textAlign: 'center',
          letterSpacing: 0,
          color: '#161616',
        }),
      ]),
    ],
  },
  {
    id: 'quiet-quote',
    name: 'Quiet quote',
    category: 'Social',
    pages: [
      page(1080, 1080, '#F6F1E8', [
        createShape('rect', { x: 0, y: 0, width: 22, height: 1080, radius: 0, fill: '#7D2AE8' }),
        createText({
          text: '“Design is the\nsilent ambassador\nof your brand.”',
          x: 100,
          y: 220,
          width: 880,
          height: 460,
          fontSize: 78,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          letterSpacing: -1.5,
          lineHeight: 1.08,
          color: '#1C140F',
        }),
        createText({
          text: 'PAUL RAND',
          x: 104,
          y: 760,
          width: 400,
          height: 40,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 6,
          color: '#7D2AE8',
        }),
      ]),
    ],
  },
  {
    id: 'friday-drop',
    name: 'Friday drop',
    category: 'Social',
    pages: [
      page(1080, 1920, { angle: 180, stops: ['#FF7A3C', '#7D2AE8'] }, [
        createShape('ellipse', { x: 680, y: 120, width: 520, height: 520, fill: 'rgba(255,255,255,0.14)' }),
        createText({
          text: 'NEW IN',
          x: 80,
          y: 280,
          width: 500,
          height: 50,
          fontSize: 24,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 8,
          color: '#ffffff',
        }),
        createText({
          text: 'The Friday\ndrop',
          x: 72,
          y: 360,
          width: 900,
          height: 420,
          fontSize: 140,
          fontWeight: 800,
          fontFamily: 'Poppins',
          letterSpacing: -4,
          lineHeight: 0.95,
          color: '#ffffff',
        }),
        createText({
          text: 'Limited pieces.\nOnline from 6pm.',
          x: 84,
          y: 860,
          width: 700,
          height: 140,
          fontSize: 36,
          fontWeight: 500,
          fontFamily: 'Outfit',
          letterSpacing: 0,
          lineHeight: 1.3,
          color: '#FFF7ED',
        }),
        createShape('rect', { x: 84, y: 1560, width: 320, height: 84, radius: 42, fill: '#ffffff' }),
        createText({
          text: 'See the edit',
          x: 84,
          y: 1582,
          width: 320,
          height: 48,
          fontSize: 28,
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: 0,
          color: '#1A1020',
          fontFamily: 'Poppins',
        }),
      ]),
    ],
  },
  {
    id: 'pitch-night',
    name: 'Pitch night',
    category: 'Presentations',
    pages: [
      page(
        1920,
        1080,
        '#0E1020',
        [
          createShape('rect', { x: 0, y: 0, width: 18, height: 1080, radius: 0, fill: '#8B5CF6' }),
          createText({
            text: 'NORTHWIND',
            x: 120,
            y: 150,
            width: 500,
            height: 36,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'Outfit',
            letterSpacing: 6,
            color: '#A78BFA',
          }),
          createText({
            text: 'A calmer way\nto launch.',
            x: 112,
            y: 240,
            width: 1100,
            height: 340,
            fontSize: 104,
            fontWeight: 700,
            fontFamily: 'Poppins',
            letterSpacing: -3,
            lineHeight: 1.02,
            color: '#F8FAFC',
          }),
          createText({
            text: 'Series A narrative  ·  2026',
            x: 120,
            y: 640,
            width: 700,
            height: 50,
            fontSize: 28,
            fontWeight: 500,
            fontFamily: 'Outfit',
            letterSpacing: 0,
            color: '#CBD5E1',
          }),
          createShape('rect', { x: 120, y: 820, width: 480, height: 140, radius: 24, fill: '#171A2E' }),
          createShape('rect', { x: 630, y: 820, width: 480, height: 140, radius: 24, fill: '#171A2E' }),
          createShape('rect', { x: 1140, y: 820, width: 480, height: 140, radius: 24, fill: '#171A2E' }),
          createText({ text: '12 markets', x: 150, y: 860, width: 420, height: 70, fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -0.5, fontFamily: 'Poppins' }),
          createText({ text: '4.8★ product', x: 660, y: 860, width: 420, height: 70, fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -0.5, fontFamily: 'Poppins' }),
          createText({ text: '38% growth', x: 1170, y: 860, width: 420, height: 70, fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: -0.5, fontFamily: 'Poppins' }),
        ],
        'Cover',
      ),
      page(
        1920,
        1080,
        '#F7F6FB',
        [
          createText({
            text: 'The numbers',
            x: 120,
            y: 100,
            width: 800,
            height: 100,
            fontSize: 72,
            fontWeight: 750,
            fontFamily: 'Poppins',
            letterSpacing: -2,
            color: '#111827',
          }),
          createShape('rect', { x: 120, y: 280, width: 500, height: 620, radius: 32, fill: '#7D2AE8' }),
          createShape('rect', { x: 660, y: 280, width: 500, height: 620, radius: 32, fill: '#111827' }),
          createShape('rect', { x: 1200, y: 280, width: 560, height: 620, radius: 32, fill: '#ffffff' }),
          createText({ text: '$4.2m', x: 160, y: 360, width: 420, height: 120, fontSize: 78, fontWeight: 750, color: '#fff', letterSpacing: -2, fontFamily: 'Poppins' }),
          createText({ text: 'ARR this quarter', x: 160, y: 500, width: 400, height: 80, fontSize: 28, fontWeight: 500, color: '#EDE9FE', letterSpacing: 0, fontFamily: 'Outfit' }),
          createText({ text: '62%', x: 700, y: 360, width: 420, height: 120, fontSize: 78, fontWeight: 750, color: '#fff', letterSpacing: -2, fontFamily: 'Poppins' }),
          createText({ text: 'Customers who stay', x: 700, y: 500, width: 420, height: 80, fontSize: 28, fontWeight: 500, color: '#CBD5E1', letterSpacing: 0, fontFamily: 'Outfit' }),
          createText({ text: '18', x: 1248, y: 360, width: 460, height: 120, fontSize: 78, fontWeight: 750, color: '#111827', letterSpacing: -2, fontFamily: 'Poppins' }),
          createText({ text: 'People on the team', x: 1248, y: 500, width: 460, height: 80, fontSize: 28, fontWeight: 500, color: '#4B5563', letterSpacing: 0, fontFamily: 'Outfit' }),
        ],
        'Numbers',
      ),
    ],
  },
  {
    id: 'night-stage',
    name: 'Night stage',
    category: 'Print',
    pages: [
      page(1080, 1520, '#120814', [
        createText({
          text: 'SAT  18  OCT',
          x: 80,
          y: 120,
          width: 700,
          height: 40,
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 8,
          color: '#F0ABFC',
        }),
        createText({
          text: 'NOVA\nLANE',
          x: 70,
          y: 220,
          width: 960,
          height: 520,
          fontSize: 210,
          fontWeight: 400,
          fontFamily: 'Bebas Neue',
          letterSpacing: 2,
          lineHeight: 0.86,
          color: '#FAFAFA',
        }),
        createShape('rect', { x: 80, y: 820, width: 180, height: 8, radius: 4, fill: '#E879F9' }),
        createText({
          text: 'With Glass Hour  ·  Mina Sol  ·  Kids of June',
          x: 80,
          y: 870,
          width: 880,
          height: 80,
          fontSize: 28,
          fontWeight: 500,
          fontFamily: 'Outfit',
          letterSpacing: 0,
          color: '#E9D5FF',
        }),
        createText({
          text: 'The Hall\nDoors 7pm',
          x: 80,
          y: 1180,
          width: 500,
          height: 160,
          fontSize: 42,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          letterSpacing: -0.5,
          lineHeight: 1.15,
          color: '#ffffff',
        }),
        createShape('rect', { x: 700, y: 1240, width: 280, height: 90, radius: 45, fill: '#F0ABFC' }),
        createText({
          text: 'Tickets',
          x: 700,
          y: 1264,
          width: 280,
          height: 48,
          fontSize: 28,
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: 0,
          color: '#2E1064',
          fontFamily: 'Poppins',
        }),
      ]),
    ],
  },
  {
    id: 'watch-this',
    name: 'Watch this',
    category: 'Video',
    pages: [
      page(1280, 720, '#101114', [
        createImage({ src: PHOTOS[6].src, x: 700, y: 0, width: 580, height: 720, radius: 0 }),
        createShape('rect', { x: 620, y: 0, width: 180, height: 720, radius: 0, fill: { angle: 90, stops: ['#101114', 'rgba(16,17,20,0)'] } }),
        createText({
          text: 'HOW TO',
          x: 64,
          y: 150,
          width: 400,
          height: 36,
          fontSize: 20,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 6,
          color: '#F87171',
        }),
        createText({
          text: 'Edit faster\nthis week',
          x: 56,
          y: 200,
          width: 640,
          height: 240,
          fontSize: 78,
          fontWeight: 800,
          fontFamily: 'Poppins',
          letterSpacing: -2,
          lineHeight: 1.02,
          color: '#ffffff',
        }),
        createShape('ellipse', { x: 64, y: 500, width: 84, height: 84, fill: '#EF4444' }),
        createShape('triangle', { x: 96, y: 522, width: 32, height: 40, fill: '#ffffff', rotation: 90 }),
        createText({
          text: '12 min',
          x: 170,
          y: 522,
          width: 200,
          height: 48,
          fontSize: 28,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: 0,
          fontFamily: 'Outfit',
        }),
      ]),
    ],
  },
  {
    id: 'mark-studio',
    name: 'Mark studio',
    category: 'Brand',
    pages: [
      page(800, 800, '#ffffff', [
        createShape('ellipse', { x: 250, y: 150, width: 300, height: 300, fill: '#7D2AE8' }),
        createText({
          text: 'M',
          x: 250,
          y: 200,
          width: 300,
          height: 210,
          fontSize: 170,
          fontWeight: 700,
          fontFamily: 'Fraunces',
          textAlign: 'center',
          letterSpacing: -4,
          color: '#ffffff',
        }),
        createText({
          text: 'Marrow',
          x: 80,
          y: 500,
          width: 640,
          height: 100,
          fontSize: 72,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          textAlign: 'center',
          letterSpacing: -1,
          color: '#16141A',
        }),
        createText({
          text: 'STUDIO',
          x: 80,
          y: 610,
          width: 640,
          height: 40,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Outfit',
          textAlign: 'center',
          letterSpacing: 10,
          color: '#7D2AE8',
        }),
      ]),
    ],
  },
  {
    id: 'atelier-card',
    name: 'Atelier card',
    category: 'Print',
    pages: [
      page(1050, 600, '#F6F1E8', [
        createShape('rect', { x: 0, y: 0, width: 18, height: 600, radius: 0, fill: '#7D2AE8' }),
        createText({
          text: 'Avery Lang',
          x: 70,
          y: 150,
          width: 600,
          height: 90,
          fontSize: 64,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          letterSpacing: -1,
          color: '#1C140F',
        }),
        createText({
          text: 'Brand designer',
          x: 74,
          y: 250,
          width: 400,
          height: 40,
          fontSize: 24,
          fontWeight: 500,
          fontFamily: 'Outfit',
          letterSpacing: 0,
          color: '#7D2AE8',
        }),
        createText({
          text: 'avery@marrow.studio\n+1 415 555 0198\nSan Francisco',
          x: 74,
          y: 380,
          width: 500,
          height: 140,
          fontSize: 20,
          fontWeight: 500,
          fontFamily: 'Inter',
          letterSpacing: 0,
          lineHeight: 1.45,
          color: '#44403C',
        }),
        createShape('ellipse', { x: 820, y: 200, width: 140, height: 140, fill: '#7D2AE8' }),
        createText({
          text: 'M',
          x: 820,
          y: 228,
          width: 140,
          height: 90,
          fontSize: 64,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          textAlign: 'center',
          color: '#fff',
          letterSpacing: -1,
        }),
      ]),
    ],
  },
  {
    id: 'cafe-board',
    name: 'Cafe board',
    category: 'Print',
    pages: [
      page(1080, 1350, '#F3E6D4', [
        createText({
          text: 'Hearth',
          x: 80,
          y: 90,
          width: 900,
          height: 120,
          fontSize: 92,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          textAlign: 'center',
          letterSpacing: -2,
          color: '#3F2A1D',
        }),
        createText({
          text: 'MORNING MENU',
          x: 80,
          y: 220,
          width: 920,
          height: 36,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Outfit',
          textAlign: 'center',
          letterSpacing: 8,
          color: '#9A3412',
        }),
        createShape('rect', { x: 390, y: 280, width: 300, height: 3, radius: 2, fill: '#C2410C' }),
        createText({
          text: 'Oat latte                     5\nCardamom bun            4\nCitrus salad                9\nSoft eggs                    11\nHouse drip                  3',
          x: 160,
          y: 360,
          width: 760,
          height: 520,
          fontSize: 40,
          fontWeight: 500,
          fontFamily: 'Fraunces',
          letterSpacing: 0,
          lineHeight: 1.7,
          color: '#3F2A1D',
        }),
        createText({
          text: 'Open 7–2  ·  18 Mercer St',
          x: 80,
          y: 1120,
          width: 920,
          height: 50,
          fontSize: 24,
          fontWeight: 600,
          fontFamily: 'Outfit',
          textAlign: 'center',
          letterSpacing: 0,
          color: '#9A3412',
        }),
      ]),
    ],
  },
  {
    id: 'coast-notes',
    name: 'Coast notes',
    category: 'Social',
    pages: [
      page(1080, 1080, '#083344', [
        createImage({ src: PHOTOS[0].src, x: 0, y: 0, width: 1080, height: 1080, radius: 0 }),
        createShape('rect', {
          x: 0,
          y: 620,
          width: 1080,
          height: 460,
          radius: 0,
          fill: { angle: 180, stops: ['rgba(8,20,28,0)', '#082028'] },
        }),
        createText({
          text: 'WEEKEND',
          x: 64,
          y: 700,
          width: 400,
          height: 36,
          fontSize: 18,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 6,
          color: '#99F6E4',
        }),
        createText({
          text: 'Leave the city\nfor one tide.',
          x: 60,
          y: 750,
          width: 900,
          height: 220,
          fontSize: 72,
          fontWeight: 700,
          fontFamily: 'Poppins',
          letterSpacing: -2,
          lineHeight: 1.05,
          color: '#ffffff',
        }),
      ]),
    ],
  },
  {
    id: 'launch-note',
    name: 'Launch note',
    category: 'Social',
    pages: [
      page(1200, 630, '#F8FAFC', [
        createShape('rect', { x: 0, y: 0, width: 460, height: 630, radius: 0, fill: '#111827' }),
        createText({
          text: 'NOW LIVE',
          x: 48,
          y: 160,
          width: 360,
          height: 30,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 5,
          color: '#67E8F9',
        }),
        createText({
          text: 'Version\ntwo.',
          x: 44,
          y: 210,
          width: 380,
          height: 220,
          fontSize: 84,
          fontWeight: 750,
          fontFamily: 'Poppins',
          letterSpacing: -3,
          lineHeight: 0.95,
          color: '#ffffff',
        }),
        createText({
          text: 'A faster editor for teams who publish every day.',
          x: 530,
          y: 180,
          width: 600,
          height: 180,
          fontSize: 40,
          fontWeight: 650,
          fontFamily: 'Fraunces',
          letterSpacing: -0.8,
          lineHeight: 1.2,
          color: '#111827',
        }),
        createShape('rect', { x: 530, y: 420, width: 220, height: 64, radius: 32, fill: '#7D2AE8' }),
        createText({
          text: 'Read the notes',
          x: 530,
          y: 436,
          width: 220,
          height: 36,
          fontSize: 16,
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: 0,
          color: '#fff',
          fontFamily: 'Outfit',
        }),
      ]),
    ],
  },
  {
    id: 'proposal',
    name: 'Project proposal',
    category: 'Docs',
    pages: [
      page(794, 1123, '#ffffff', [
        createShape('rect', { x: 0, y: 0, width: 794, height: 16, radius: 0, fill: '#7D2AE8' }),
        createText({
          text: 'PROPOSAL',
          x: 64,
          y: 80,
          width: 400,
          height: 28,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Outfit',
          letterSpacing: 4,
          color: '#7D2AE8',
        }),
        createText({
          text: 'Brand site\nfor Hearth',
          x: 60,
          y: 130,
          width: 660,
          height: 180,
          fontSize: 58,
          fontWeight: 750,
          fontFamily: 'Poppins',
          letterSpacing: -1.5,
          lineHeight: 1.05,
          color: '#111827',
        }),
        createText({
          text: 'A six-week engagement to redesign the cafe website, menu system, and booking flow. Includes a visual language, responsive pages, and a handoff for the in-house team.',
          x: 64,
          y: 360,
          width: 660,
          height: 160,
          fontSize: 18,
          fontWeight: 500,
          fontFamily: 'Inter',
          letterSpacing: 0,
          lineHeight: 1.45,
          color: '#374151',
        }),
        createShape('rect', { x: 64, y: 560, width: 200, height: 4, radius: 2, fill: '#7D2AE8' }),
        createText({
          text: '01  Discover\nInterviews, menu audit, and a one-day workshop.\n\n02  Design\nHomepage, menu, and booking in two rounds.\n\n03  Handoff\nFiles, specs, and a working session with the team.',
          x: 64,
          y: 610,
          width: 660,
          height: 360,
          fontSize: 20,
          fontWeight: 500,
          fontFamily: 'Inter',
          letterSpacing: 0,
          lineHeight: 1.45,
          color: '#1F2937',
        }),
      ]),
    ],
  },
]

export const CATEGORIES = ['All', 'Social', 'Presentations', 'Video', 'Print', 'Brand', 'Docs']
