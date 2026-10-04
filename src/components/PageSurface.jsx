import { fillCss } from '../lib/model'

const STAR = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
const TRIANGLE = 'polygon(50% 0%, 100% 100%, 0% 100%)'

function textStyle(el) {
  return {
    width: '100%',
    height: '100%',
    color: el.color,
    fontFamily: `"${el.fontFamily}", sans-serif`,
    fontWeight: el.fontWeight,
    fontStyle: el.fontStyle,
    fontSize: el.fontSize,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing,
    textAlign: el.textAlign,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflow: 'hidden',
    textShadow: el.shadow ? '0 10px 24px rgba(0,0,0,.35)' : 'none',
  }
}

function shapeStyle(el) {
  const shadow = el.shadow ? '0 18px 34px rgba(15,16,20,.28)' : 'none'
  const base = { width: '100%', height: '100%', background: fillCss(el.fill), boxShadow: shadow }
  if (el.shape === 'ellipse') return { ...base, borderRadius: '50%' }
  if (el.shape === 'triangle') return { ...base, clipPath: TRIANGLE }
  if (el.shape === 'star') return { ...base, clipPath: STAR }
  if (el.shape === 'line') return { ...base, borderRadius: 999 }
  return { ...base, borderRadius: el.radius || 0 }
}

export function ElementBody({ el, editing = false, onChangeText, onBlurText }) {
  if (el.type === 'text') {
    if (editing) {
      return (
        <textarea
          autoFocus
          value={el.text}
          onChange={(event) => onChangeText(el.id, event.target.value)}
          onBlur={() => onBlurText?.()}
          onPointerDown={(event) => event.stopPropagation()}
          style={textStyle(el)}
          className="absolute inset-0 m-0 resize-none border-0 bg-transparent p-0 outline-none"
        />
      )
    }
    return <div style={textStyle(el)}>{el.text}</div>
  }

  if (el.type === 'image') {
    return (
      <img
        src={el.src}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
        style={{
          borderRadius: el.radius || 0,
          boxShadow: el.shadow ? '0 18px 34px rgba(15,16,20,.28)' : 'none',
        }}
      />
    )
  }

  return <div style={shapeStyle(el)} />
}

export function PageSurface({ page }) {
  return (
    <div className="relative overflow-hidden" style={{ width: page.width, height: page.height, background: fillCss(page.background) }}>
      {page.elements.map((el) =>
        el.hidden ? null : (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity ?? 1,
            }}
          >
            <ElementBody el={el} />
          </div>
        ),
      )}
    </div>
  )
}
