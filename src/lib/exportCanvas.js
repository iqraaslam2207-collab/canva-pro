const STAR = [
  [50, 0],
  [61, 35],
  [98, 35],
  [68, 57],
  [79, 91],
  [50, 70],
  [21, 91],
  [32, 57],
  [2, 35],
  [39, 35],
]
const TRIANGLE = [
  [50, 0],
  [100, 100],
  [0, 100],
]

function paintFill(ctx, fill, x, y, w, h) {
  if (!fill) {
    ctx.fillStyle = 'transparent'
    return
  }
  if (typeof fill === 'string') {
    ctx.fillStyle = fill
    return
  }
  const angle = ((fill.angle ?? 135) * Math.PI) / 180
  const cx = x + w / 2
  const cy = y + h / 2
  const len = Math.hypot(w, h) / 2
  const dx = Math.sin(angle) * len
  const dy = -Math.cos(angle) * len
  const gradient = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy)
  fill.stops.forEach((stop, index) => {
    gradient.addColorStop(index / Math.max(1, fill.stops.length - 1), stop)
  })
  ctx.fillStyle = gradient
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r || 0, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function polygon(ctx, x, y, w, h, points) {
  ctx.beginPath()
  points.forEach(([px, py], index) => {
    const X = x + (px / 100) * w
    const Y = y + (py / 100) * h
    if (index === 0) ctx.moveTo(X, Y)
    else ctx.lineTo(X, Y)
  })
  ctx.closePath()
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null)
      return
    }
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function measureLine(ctx, line, letterSpacing) {
  if (!letterSpacing) return ctx.measureText(line).width
  let width = 0
  for (const char of line) width += ctx.measureText(char).width + letterSpacing
  return Math.max(0, width - letterSpacing)
}

function drawLine(ctx, line, x, y, letterSpacing) {
  if (!letterSpacing) {
    ctx.fillText(line, x, y)
    return
  }
  let cursor = x
  for (const char of line) {
    ctx.fillText(char, cursor, y)
    cursor += ctx.measureText(char).width + letterSpacing
  }
}

function wrapText(ctx, text, maxWidth, letterSpacing) {
  const lines = []
  for (const paragraph of String(text ?? '').split('\n')) {
    const words = paragraph.split(' ')
    let line = ''
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (measureLine(ctx, test, letterSpacing) > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = test
      }
    }
    lines.push(line)
  }
  return lines
}

function drawElement(ctx, el, images) {
  if (el.hidden) return
  const cx = el.x + el.width / 2
  const cy = el.y + el.height / 2
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((el.rotation * Math.PI) / 180)
  ctx.globalAlpha = el.opacity ?? 1
  if (el.shadow) {
    ctx.shadowColor = 'rgba(14, 16, 20, 0.28)'
    ctx.shadowBlur = 28
    ctx.shadowOffsetY = 16
  }
  const x = -el.width / 2
  const y = -el.height / 2

  if (el.type === 'shape') {
    paintFill(ctx, el.fill, x, y, el.width, el.height)
    if (el.shape === 'ellipse') {
      ctx.beginPath()
      ctx.ellipse(0, 0, el.width / 2, el.height / 2, 0, 0, Math.PI * 2)
    } else if (el.shape === 'triangle') {
      polygon(ctx, x, y, el.width, el.height, TRIANGLE)
    } else if (el.shape === 'star') {
      polygon(ctx, x, y, el.width, el.height, STAR)
    } else {
      roundRect(ctx, x, y, el.width, el.height, el.shape === 'line' ? el.height / 2 : el.radius || 0)
    }
    ctx.fill()
  } else if (el.type === 'image') {
    const image = images.get(el.src)
    ctx.save()
    roundRect(ctx, x, y, el.width, el.height, el.radius || 0)
    ctx.clip()
    if (image) ctx.drawImage(image, x, y, el.width, el.height)
    else {
      ctx.fillStyle = '#e7e8ee'
      ctx.fillRect(x, y, el.width, el.height)
    }
    ctx.restore()
  } else if (el.type === 'text') {
    const fontStyle = el.fontStyle || 'normal'
    const fontWeight = el.fontWeight || 400
    ctx.font = `${fontStyle} ${fontWeight} ${el.fontSize}px "${el.fontFamily || 'Inter'}"`
    ctx.fillStyle = el.color || '#111'
    ctx.textBaseline = 'top'
    const lines = wrapText(ctx, el.text, el.width, el.letterSpacing || 0)
    const lineHeight = el.fontSize * (el.lineHeight || 1.15)
    lines.forEach((line, index) => {
      const width = measureLine(ctx, line, el.letterSpacing || 0)
      let lineX = x
      if (el.textAlign === 'center') lineX = -width / 2
      if (el.textAlign === 'right') lineX = el.width / 2 - width
      const lineY = y + index * lineHeight
      if (lineY > el.height / 2) return
      drawLine(ctx, line, lineX, lineY, el.letterSpacing || 0)
    })
  }
  ctx.restore()
}

export async function renderPage(page) {
  await document.fonts.ready
  const canvas = document.createElement('canvas')
  canvas.width = page.width
  canvas.height = page.height
  const ctx = canvas.getContext('2d')
  paintFill(ctx, page.background, 0, 0, page.width, page.height)
  ctx.fillRect(0, 0, page.width, page.height)

  const sources = [...new Set(page.elements.filter((el) => el.type === 'image' && el.src).map((el) => el.src))]
  const images = new Map()
  await Promise.all(
    sources.map(async (src) => {
      images.set(src, await loadImage(src))
    }),
  )
  for (const el of page.elements) drawElement(ctx, el, images)
  return canvas
}

export async function downloadPage(page, filename) {
  const canvas = await renderPage(page)
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = filename
  link.click()
}
