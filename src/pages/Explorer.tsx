import { useMemo, useState } from 'react'
import { FlagImage } from '../components/FlagImage'
import { Button, Chip, PageHeader } from '../components/ui'
import {
  CONTINENTS,
  FLAG_COLORS,
  FLAG_FEATURES,
  flagsData,
  type Continent,
  type FlagColor,
  type FlagFeature,
} from '../data/flagsData'
import { normalize } from '../lib/matching'

const SWATCH: Record<FlagColor, string> = {
  red: 'bg-red-600',
  white: 'bg-white',
  blue: 'bg-blue-600',
  yellow: 'bg-yellow-400',
  green: 'bg-green-600',
  black: 'bg-black ring-1 ring-white/30',
  orange: 'bg-orange-500',
}

const FEATURE_ICON: Record<FlagFeature, string> = {
  star: '★',
  crescent: '☾',
  cross: '✚',
  sun: '☀',
  circle: '●',
  triangle: '▲',
  diagonal: '⟋',
  emblem: '🛡',
  animal: '🦅',
  map: '🗺',
}

type ColorMode = 'all' | 'any' | 'only'

const COLOR_MODE_LABEL: Record<ColorMode, string> = {
  all: 'Has all',
  any: 'Has any',
  only: 'Only these',
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export default function Explorer() {
  const [colors, setColors] = useState<Set<FlagColor>>(() => new Set())
  const [features, setFeatures] = useState<Set<FlagFeature>>(() => new Set())
  const [colorMode, setColorMode] = useState<ColorMode>('all')
  const [continent, setContinent] = useState<'All' | Continent>('All')
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = normalize(query)
    return flagsData.filter((c) => {
      if (continent !== 'All' && c.continent !== continent) return false
      if (q && ![c.name, ...c.aliases].some((n) => normalize(n).includes(q))) return false
      if (colors.size) {
        const selected = [...colors]
        if (colorMode === 'all' && !selected.every((col) => c.colors.includes(col))) return false
        if (colorMode === 'any' && !selected.some((col) => c.colors.includes(col))) return false
        if (colorMode === 'only' && !c.colors.every((col) => colors.has(col))) return false
      }
      if (features.size && ![...features].every((f) => c.features.includes(f))) return false
      return true
    })
  }, [colors, features, colorMode, continent, query])

  const hasFilters = colors.size > 0 || features.size > 0 || continent !== 'All' || query !== ''

  function reset() {
    setColors(new Set())
    setFeatures(new Set())
    setContinent('All')
    setQuery('')
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Color & Feature Explorer" subtitle="Learning mode: filter the gallery by color, symbol or region.">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name…"
          aria-label="Search by name"
          className="w-44 rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-white ring-1 ring-white/10 outline-none placeholder:text-slate-500 focus:ring-sky-400"
        />
        <select
          value={continent}
          onChange={(e) => setContinent(e.target.value as 'All' | Continent)}
          aria-label="Continent"
          className="rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-slate-200 ring-1 ring-white/10 outline-none focus:ring-sky-400"
        >
          <option value="All">All continents</option>
          {CONTINENTS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </PageHeader>

      <div className="mb-6 space-y-4 rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/5 sm:p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Colors</h2>
            <div className="flex rounded-lg bg-slate-950/70 p-0.5 ring-1 ring-white/10" role="group" aria-label="Color matching">
              {(Object.keys(COLOR_MODE_LABEL) as ColorMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setColorMode(mode)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    colorMode === mode ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {COLOR_MODE_LABEL[mode]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {FLAG_COLORS.map((color) => (
              <Chip key={color} active={colors.has(color)} onClick={() => setColors((s) => toggle(s, color))}>
                <span className={`h-3.5 w-3.5 rounded-full ${SWATCH[color]}`} />
                <span className="capitalize">{color}</span>
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Features (has all selected)</h2>
          <div className="flex flex-wrap gap-2">
            {FLAG_FEATURES.map((feature) => (
              <Chip key={feature} active={features.has(feature)} onClick={() => setFeatures((s) => toggle(s, feature))}>
                <span aria-hidden className="w-4 text-center">
                  {FEATURE_ICON[feature]}
                </span>
                <span className="capitalize">{feature}</span>
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400" aria-live="polite">
          Showing <span className="font-semibold text-white">{results.length}</span> of {flagsData.length} flags
        </p>
        {hasFilters && (
          <Button variant="ghost" onClick={reset} className="py-1.5">
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/40 py-16 text-center text-slate-400 ring-1 ring-white/5">
          No flag matches every filter. Try removing one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((c) => (
            <article
              key={c.id}
              className="group animate-fade-in rounded-xl bg-slate-900/60 p-3 ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800/80 hover:ring-white/15"
            >
              <FlagImage src={c.flagUrl} alt={`Flag of ${c.name}`} className="aspect-[3/2] w-full" />
              <h3 className="mt-2 truncate text-sm font-semibold text-white" title={c.name}>
                {c.name}
              </h3>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-slate-400">{c.continent}</span>
                <span className="flex shrink-0 gap-0.5">
                  {c.colors.map((col) => (
                    <span key={col} title={col} className={`h-2.5 w-2.5 rounded-full ${SWATCH[col]}`} />
                  ))}
                </span>
              </div>
              {c.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.features.map((f) => (
                    <span
                      key={f}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        features.has(f) ? 'bg-sky-500/20 text-sky-200' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {FEATURE_ICON[f]} {f}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
