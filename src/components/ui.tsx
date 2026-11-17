import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'subtle'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-sky-500 text-slate-950 hover:bg-sky-400 focus-visible:outline-sky-300 shadow-lg shadow-sky-500/20',
  subtle: 'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-400 ring-1 ring-white/10',
  ghost: 'text-slate-300 hover:bg-slate-800/70 hover:text-white focus-visible:outline-slate-400',
}

export function Button({
  variant = 'subtle',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 ${VARIANTS[variant]} ${className}`}
    />
  )
}

export function Stat({ label, value, tone = 'default' }: { label: string; value: ReactNode; tone?: 'default' | 'good' | 'bad' }) {
  const toneClass = tone === 'good' ? 'text-emerald-400' : tone === 'bad' ? 'text-rose-400' : 'text-white'
  return (
    <div className="rounded-xl bg-slate-900/70 px-3 py-2 ring-1 ring-white/5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-lg font-bold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  )
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400 transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-sky-500/15 text-sky-200 ring-sky-400/60'
          : 'bg-slate-900/60 text-slate-300 ring-white/10 hover:bg-slate-800 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  )
}
