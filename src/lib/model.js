export function uid() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6)
}

export const FONTS = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Outfit',
  'Space Grotesk',
  'Playfair Display',
  'Fraunces',
  'Bebas Neue',
  'Great Vibes',
]

export function fillCss(fill) {
  if (!fill) return 'transparent'
  if (typeof fill === 'string') return fill
  const angle = fill.angle ?? 135
  return `linear-gradient(${angle}deg, ${fill.stops.join(', ')})`
}

export function solidHex(fill, fallback = '#7D2AE8') {
  if (typeof fill === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(fill)) {
    if (fill.length === 4) {
      return `#${fill[1]}${fill[1]}${fill[2]}${fill[2]}${fill[3]}${fill[3]}`
    }
    return fill
  }
  return fallback
}

export function createText(partial = {}) {
  return {
    id: uid(),
    type: 'text',
    x: 80,
    y: 80,
    width: 560,
    height: 150,
    rotation: 0,
    opacity: 1,
    text: 'Add a heading',
    fontSize: 72,
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#0e0e10',
    letterSpacing: -1.5,
    lineHeight: 1.05,
    shadow: false,
    locked: false,
    hidden: false,
    ...partial,
  }
}

export function createShape(shape, partial = {}) {
  return {
    id: uid(),
    type: 'shape',
    shape,
    x: 160,
    y: 160,
    width: shape === 'line' ? 360 : 200,
    height: shape === 'line' ? 10 : 200,
    rotation: 0,
    opacity: 1,
    fill: '#7D2AE8',
    radius: shape === 'rect' ? 18 : 0,
    shadow: false,
    locked: false,
    hidden: false,
    ...partial,
  }
}

export function createImage(partial = {}) {
  return {
    id: uid(),
    type: 'image',
    x: 120,
    y: 120,
    width: 420,
    height: 280,
    rotation: 0,
    opacity: 1,
    src: '',
    radius: 0,
    shadow: false,
    locked: false,
    hidden: false,
    ...partial,
  }
}

export function createPage(partial = {}) {
  return {
    id: uid(),
    name: partial.name || 'Page 1',
    width: partial.width || 1080,
    height: partial.height || 1080,
    background: partial.background ?? '#ffffff',
    elements: partial.elements || [],
  }
}

export function cloneElement(el, offset = 0) {
  return {
    ...el,
    id: uid(),
    x: el.x + offset,
    y: el.y + offset,
    fill: el.fill && typeof el.fill === 'object' ? { ...el.fill, stops: [...el.fill.stops] } : el.fill,
  }
}

export function clonePage(page, name) {
  return {
    id: uid(),
    name: name || page.name,
    width: page.width,
    height: page.height,
    background:
      page.background && typeof page.background === 'object'
        ? { ...page.background, stops: [...page.background.stops] }
        : page.background,
    elements: page.elements.map((el) => cloneElement(el)),
  }
}

export function createProject({ name, designType, pages }) {
  return {
    id: uid(),
    name: name || 'Untitled design',
    designType: designType || 'Custom',
    updatedAt: Date.now(),
    pages: pages?.length ? pages : [createPage()],
  }
}

export function resizePage(page, width, height) {
  const sx = width / page.width
  const sy = height / page.height
  const s = Math.min(sx, sy)
  return {
    ...page,
    width,
    height,
    elements: page.elements.map((el) => ({
      ...el,
      x: Math.round(el.x * sx),
      y: Math.round(el.y * sy),
      width: Math.max(8, Math.round(el.width * sx)),
      height: Math.max(8, Math.round(el.height * sy)),
      fontSize: el.fontSize ? Math.max(8, Math.round(el.fontSize * s)) : el.fontSize,
      radius: el.radius ? Math.round(el.radius * s) : 0,
      letterSpacing: el.letterSpacing ? +(el.letterSpacing * s).toFixed(2) : el.letterSpacing,
    })),
  }
}

export function snapPosition(page, width, height, x, y) {
  const threshold = 8
  let nx = x
  let ny = y
  let guideV = null
  let guideH = null
  let bestX = threshold
  let bestY = threshold
  const xPoints = [
    [x, 0],
    [x + width / 2, width / 2],
    [x + width, width],
  ]
  const yPoints = [
    [y, 0],
    [y + height / 2, height / 2],
    [y + height, height],
  ]
  for (const target of [0, page.width / 2, page.width]) {
    for (const [edge, origin] of xPoints) {
      const distance = Math.abs(edge - target)
      if (distance < bestX) {
        bestX = distance
        nx = target - origin
        guideV = target
      }
    }
  }
  for (const target of [0, page.height / 2, page.height]) {
    for (const [edge, origin] of yPoints) {
      const distance = Math.abs(edge - target)
      if (distance < bestY) {
        bestY = distance
        ny = target - origin
        guideH = target
      }
    }
  }
  return { x: nx, y: ny, guideV, guideH }
}

// Resize in the element's local axes so rotated boxes stay anchored
// on the opposite edge. CSS rotation is clockwise; y grows downward.
export function resizeElement(start, handle, dx, dy, lockRatio) {
  const theta = (start.rotation * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const ldx = dx * cos + dy * sin
  const ldy = -dx * sin + dy * cos
  const min = 16

  let width = start.width
  let height = start.height
  if (handle.includes('e')) width = start.width + ldx
  if (handle.includes('w')) width = start.width - ldx
  if (handle.includes('s')) height = start.height + ldy
  if (handle.includes('n')) height = start.height - ldy
  width = Math.max(min, width)
  height = Math.max(min, height)

  const corner = ['nw', 'ne', 'se', 'sw'].includes(handle)
  if (lockRatio && corner) {
    const ratio = start.width / start.height
    if (width / height > ratio) width = Math.max(min, height * ratio)
    else height = Math.max(min, width / ratio)
  }

  const ax = handle.includes('w') ? start.width / 2 : handle.includes('e') ? -start.width / 2 : 0
  const ay = handle.includes('n') ? start.height / 2 : handle.includes('s') ? -start.height / 2 : 0
  const nax = handle.includes('w') ? width / 2 : handle.includes('e') ? -width / 2 : 0
  const nay = handle.includes('n') ? height / 2 : handle.includes('s') ? -height / 2 : 0
  const localCx = ax - nax
  const localCy = ay - nay
  const worldDx = localCx * cos - localCy * sin
  const worldDy = localCx * sin + localCy * cos
  const cx = start.x + start.width / 2 + worldDx
  const cy = start.y + start.height / 2 + worldDy

  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
  }
}

export function rotationFromPointer(el, px, py) {
  const cx = el.x + el.width / 2
  const cy = el.y + el.height / 2
  let angle = (Math.atan2(py - cy, px - cx) * 180) / Math.PI + 90
  angle = ((angle + 180) % 360) - 180
  const snaps = [0, 45, 90, 135, 180, -45, -90, -135]
  for (const snap of snaps) {
    if (Math.abs(angle - snap) < 4) return snap
  }
  return Math.round(angle * 10) / 10
}

export function timeAgo(ts) {
  const seconds = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
