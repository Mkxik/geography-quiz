const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const RGB = { green: '34 197 94', red: '239 68 68', amber: '245 158 11' } as const
export type FlashColor = keyof typeof RGB

/** Expanding glow ring. Uses the Web Animations API so it can be re-triggered on every answer. */
export function flash(el: Element | null, color: FlashColor) {
  if (!el) return
  const rgb = RGB[color]
  el.animate(
    [
      { boxShadow: `0 0 0 0 rgb(${rgb} / 0.85)` },
      { boxShadow: `0 0 0 20px rgb(${rgb} / 0)` },
    ],
    { duration: reducedMotion() ? 1 : 700, easing: 'ease-out' },
  )
}

export function shake(el: Element | null) {
  if (!el || reducedMotion()) return
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-9px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 420, easing: 'ease-in-out' },
  )
}

export function preload(url: string | undefined) {
  if (url) new Image().src = url
}
