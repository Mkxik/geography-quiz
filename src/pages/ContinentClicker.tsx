import { useEffect, useMemo, useRef, useState } from 'react'
import { FlagImage } from '../components/FlagImage'
import { Button, PageHeader, ProgressBar, Stat } from '../components/ui'
import { CONTINENTS, flagsData, type Continent, type Country } from '../data/flagsData'
import { flash, shake } from '../lib/feedback'
import { shuffle } from '../lib/random'

const CONTINENT_STYLE: Record<Continent, { icon: string; accent: string }> = {
  Africa: { icon: '🌍', accent: 'from-amber-500/25 ring-amber-400/30' },
  Asia: { icon: '🌏', accent: 'from-rose-500/25 ring-rose-400/30' },
  Europe: { icon: '🏰', accent: 'from-sky-500/25 ring-sky-400/30' },
  'North America': { icon: '🌎', accent: 'from-emerald-500/25 ring-emerald-400/30' },
  'South America': { icon: '🦜', accent: 'from-lime-500/25 ring-lime-400/30' },
  Oceania: { icon: '🏝️', accent: 'from-cyan-500/25 ring-cyan-400/30' },
}

export default function ContinentClicker() {
  const [continent, setContinent] = useState<Continent | null>(null)
  const [includeTerritories, setIncludeTerritories] = useState(true)
  const [round, setRound] = useState(0)

  const pools = useMemo(() => {
    const map = new Map<Continent, Country[]>()
    for (const c of CONTINENTS) {
      map.set(
        c,
        flagsData.filter((f) => f.continent === c && (includeTerritories || !f.isTerritory)),
      )
    }
    return map
  }, [includeTerritories])

  if (continent) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={`${CONTINENT_STYLE[continent].icon} ${continent}`} subtitle="Click the flag that matches the name.">
          <Button variant="ghost" onClick={() => setContinent(null)}>
            ← Continents
          </Button>
          <Button onClick={() => setRound((r) => r + 1)}>Restart</Button>
        </PageHeader>
        <ClickerGame
          key={`${continent}-${round}`}
          pool={pools.get(continent)!}
          onRestart={() => setRound((r) => r + 1)}
          onBack={() => setContinent(null)}
        />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Continent Clicker" subtitle="Choose a continent. Every flag on it goes into the grid.">
        <label className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-slate-300 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={includeTerritories}
            onChange={(e) => setIncludeTerritories(e.target.checked)}
            className="accent-sky-500"
          />
          Include territories
        </label>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTINENTS.map((c, i) => {
          const pool = pools.get(c)!
          return (
            <button
              key={c}
              onClick={() => setContinent(c)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group animate-fade-in rounded-2xl bg-gradient-to-br ${CONTINENT_STYLE[c].accent} to-transparent bg-slate-900/60 p-5 text-left ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  <span className="mr-2">{CONTINENT_STYLE[c].icon}</span>
                  {c}
                </h2>
                <span className="rounded-full bg-slate-950/60 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                  {pool.length} flags
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                {pool.slice(0, 5).map((f) => (
                  <FlagImage key={f.id} src={f.flagUrl} className="h-7 w-10 transition-transform group-hover:scale-105" />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ClickerGame({
  pool,
  onRestart,
  onBack,
}: {
  pool: Country[]
  onRestart: () => void
  onBack: () => void
}) {
  const [grid] = useState(() => shuffle(pool))
  const [queue] = useState(() => shuffle(pool))
  const [index, setIndex] = useState(0)
  const [found, setFound] = useState<Set<string>>(() => new Set())
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set())
  const [mistakes, setMistakes] = useState(0)
  const [wrong, setWrong] = useState<{ id: string; nonce: number } | null>(null)
  const [hideFound, setHideFound] = useState(false)
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())

  const target = queue[index] as Country | undefined
  const total = queue.length

  useEffect(() => {
    if (!wrong) return
    const timer = setTimeout(() => setWrong(null), 900)
    return () => clearTimeout(timer)
  }, [wrong])

  function handleClick(country: Country) {
    if (!target || found.has(country.id) || skipped.has(country.id)) return
    const el = tileRefs.current.get(country.id) ?? null
    if (country.id === target.id) {
      setFound((prev) => new Set(prev).add(country.id))
      setWrong(null)
      setIndex((i) => i + 1)
      flash(el, 'green')
    } else {
      setMistakes((m) => m + 1)
      setWrong({ id: country.id, nonce: Date.now() })
      flash(el, 'red')
      shake(el)
    }
  }

  function skip() {
    if (!target) return
    setSkipped((prev) => new Set(prev).add(target.id))
    setIndex((i) => i + 1)
    const el = tileRefs.current.get(target.id)
    flash(el ?? null, 'amber')
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const wrongCountry = wrong ? pool.find((c) => c.id === wrong.id) : undefined
  const done = !target
  const accuracy = found.size + mistakes ? Math.round((found.size / (found.size + mistakes)) * 100) : 100

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-4 mb-6 border-b border-white/5 bg-slate-950/85 px-4 py-4 backdrop-blur-xl">
        {done ? (
          <div className="flex animate-pop flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <div className="text-xl font-bold text-white">
                {skipped.size === 0 && mistakes === 0 ? '🏆 Flawless!' : '🎉 Continent complete'}
              </div>
              <div className="text-sm text-slate-400">
                Found {found.size}/{total} · {mistakes} wrong clicks · {accuracy}% accuracy
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={onBack}>Other continent</Button>
              <Button variant="primary" onClick={onRestart}>
                Play again
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Find and click the flag of</div>
              <div key={target.id} className="animate-pop truncate text-2xl font-bold text-white sm:text-3xl">
                {target.name}
              </div>
              <div className="h-5 text-sm" aria-live="polite">
                {wrongCountry && (
                  <span key={wrong!.nonce} className="animate-fade-in text-rose-300">
                    ✗ That one is {wrongCountry.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Stat label="Found" value={`${found.size}/${total}`} tone="good" />
              <Stat label="Wrong" value={mistakes} tone={mistakes ? 'bad' : 'default'} />
              <Button onClick={skip} className="self-stretch">
                Skip
              </Button>
            </div>
          </div>
        )}
        <div className="mt-3">
          <ProgressBar value={index} max={total} />
        </div>
      </div>

      <label className="mb-4 flex w-fit items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" checked={hideFound} onChange={(e) => setHideFound(e.target.checked)} className="accent-sky-500" />
        Remove found flags from the grid
      </label>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
        {grid.map((country) => {
          const isFound = found.has(country.id)
          const isSkipped = skipped.has(country.id)
          const isWrong = wrong?.id === country.id
          if (hideFound && isFound) return null
          const resolved = isFound || isSkipped || done
          const state = isFound
            ? 'ring-2 ring-emerald-400/80 bg-emerald-500/10 opacity-60'
            : isSkipped
              ? 'ring-2 ring-amber-400/70 bg-amber-500/10 opacity-60'
              : isWrong
                ? 'ring-2 ring-rose-500 bg-rose-500/20'
                : 'ring-1 ring-white/10 bg-slate-900/60 hover:-translate-y-0.5 hover:bg-slate-800 hover:ring-sky-400/60'
          return (
            <button
              key={country.id}
              ref={(el) => {
                if (el) tileRefs.current.set(country.id, el)
                else tileRefs.current.delete(country.id)
              }}
              onClick={() => handleClick(country)}
              disabled={resolved}
              aria-label={resolved ? country.name : 'Flag'}
              className={`relative flex flex-col items-center justify-start rounded-xl p-2 transition-all duration-300 ${state}`}
            >
              <FlagImage src={country.flagUrl} className="aspect-[3/2] w-full" />
              {resolved && (
                <span className="mt-1.5 w-full animate-fade-in truncate text-center text-[11px] font-medium text-slate-200">
                  {country.name}
                </span>
              )}
              {isFound && (
                <span className="absolute right-1 top-1 flex h-5 w-5 animate-pop items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-slate-950">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
