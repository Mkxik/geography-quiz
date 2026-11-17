import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { FlagImage } from '../components/FlagImage'
import { Button, PageHeader, ProgressBar, Stat } from '../components/ui'
import { CONTINENTS, flagsData, type Continent, type Country } from '../data/flagsData'
import { flash, preload, shake } from '../lib/feedback'
import { matchCountry } from '../lib/matching'
import { shuffle } from '../lib/random'

type Scope = 'All' | Continent

export default function ClassicType() {
  const [scope, setScope] = useState<Scope>('All')
  const [includeTerritories, setIncludeTerritories] = useState(true)
  const [round, setRound] = useState(0)

  const pool = useMemo(
    () =>
      flagsData.filter(
        (c) => (includeTerritories || !c.isTerritory) && (scope === 'All' || c.continent === scope),
      ),
    [scope, includeTerritories],
  )

  return (
    <div className="animate-fade-in">
      <PageHeader title="Classic Type" subtitle="Name the flag. Aliases and small typos are accepted.">
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as Scope)}
          className="rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-slate-200 ring-1 ring-white/10 outline-none focus:ring-sky-400"
          aria-label="Region"
        >
          <option value="All">All regions</option>
          {CONTINENTS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm text-slate-300 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={includeTerritories}
            onChange={(e) => setIncludeTerritories(e.target.checked)}
            className="accent-sky-500"
          />
          Territories
        </label>
      </PageHeader>
      <ClassicGame
        key={`${scope}-${includeTerritories}-${round}`}
        pool={pool}
        onRestart={() => setRound((r) => r + 1)}
      />
    </div>
  )
}

type Reveal = { kind: 'correct' | 'fuzzy' | 'skipped'; typed: string }

const REVEAL_MS: Record<Reveal['kind'], number> = { correct: 650, fuzzy: 1200, skipped: 1600 }

function ClassicGame({ pool, onRestart }: { pool: Country[]; onRestart: () => void }) {
  const [queue] = useState(() => shuffle(pool))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState<Country[]>([])
  const [input, setInput] = useState('')
  const [reveal, setReveal] = useState<Reveal | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = queue[index] as Country | undefined
  const total = queue.length

  useEffect(() => {
    preload(queue[index + 1]?.flagUrl)
    preload(queue[index + 2]?.flagUrl)
  }, [index, queue])

  useEffect(() => {
    if (!reveal) return
    const timer = setTimeout(() => {
      setReveal(null)
      setInput('')
      setIndex((i) => i + 1)
    }, REVEAL_MS[reveal.kind])
    return () => clearTimeout(timer)
  }, [reveal])

  useEffect(() => {
    if (!reveal) inputRef.current?.focus()
  }, [reveal, index])

  function accept(kind: 'correct' | 'fuzzy', typed: string) {
    setScore((s) => s + 1)
    setReveal({ kind, typed })
    flash(cardRef.current, 'green')
  }

  function handleChange(value: string) {
    setInput(value)
    if (!reveal && current && matchCountry(value, current) === 'exact') accept('correct', value)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (reveal || !current || !input.trim()) return
    const result = matchCountry(input, current)
    if (result === 'none') {
      flash(cardRef.current, 'red')
      shake(cardRef.current)
      return
    }
    accept(result === 'exact' ? 'correct' : 'fuzzy', input)
  }

  function skip() {
    if (reveal || !current) return
    setMissed((m) => [...m, current])
    setReveal({ kind: 'skipped', typed: input })
    flash(cardRef.current, 'amber')
  }

  if (!current) {
    return <ClassicSummary score={score} total={total} missed={missed} onRestart={onRestart} />
  }

  const revealTone =
    reveal?.kind === 'skipped'
      ? 'ring-amber-400/70 bg-amber-500/5'
      : reveal
        ? 'ring-emerald-400/70 bg-emerald-500/5'
        : 'ring-white/10 bg-slate-900/60'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat label="Score" value={`${score}/${total}`} tone="good" />
        <Stat label="Flag" value={`${Math.min(index + 1, total)}/${total}`} />
        <Stat label="Skipped" value={missed.length} tone={missed.length ? 'bad' : 'default'} />
      </div>
      <ProgressBar value={index} max={total} />

      <div
        ref={cardRef}
        className={`mt-6 rounded-3xl p-6 ring-1 transition-colors duration-300 sm:p-10 ${revealTone}`}
      >
        <FlagImage key={current.id} src={current.flagUrl} eager className="mx-auto aspect-[3/2] w-full max-w-md" />

        <div className="mt-6 h-12 text-center" aria-live="polite">
          {reveal && (
            <div className="animate-pop">
              <div
                className={`text-2xl font-bold ${reveal.kind === 'skipped' ? 'text-amber-300' : 'text-emerald-300'}`}
              >
                {reveal.kind === 'skipped' ? '↷ ' : '✓ '}
                {current.name}
              </div>
              {reveal.kind === 'fuzzy' && (
                <div className="text-xs text-slate-400">Accepted “{reveal.typed}” as a close match</div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && skip()}
            disabled={!!reveal}
            placeholder="Type the country name…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Country name"
            className="min-w-0 flex-1 rounded-xl bg-slate-950/80 px-4 py-3 text-lg text-white ring-1 ring-white/10 outline-none transition-shadow placeholder:text-slate-500 focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={!!reveal || !input.trim()} className="flex-1 sm:flex-none">
              Guess
            </Button>
            <Button type="button" onClick={skip} disabled={!!reveal} className="flex-1 sm:flex-none">
              Skip
            </Button>
          </div>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">
          Exact names are accepted as you type · <kbd className="font-mono">Enter</kbd> checks close spellings ·{' '}
          <kbd className="font-mono">Esc</kbd> skips
        </p>
      </div>
    </div>
  )
}

function ClassicSummary({
  score,
  total,
  missed,
  onRestart,
}: {
  score: number
  total: number
  missed: Country[]
  onRestart: () => void
}) {
  const pct = total ? Math.round((score / total) * 100) : 0
  return (
    <div className="mx-auto max-w-3xl animate-pop text-center">
      <div className="rounded-3xl bg-slate-900/60 p-8 ring-1 ring-white/10">
        <div className="text-6xl">{pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '🧭'}</div>
        <h2 className="mt-4 text-3xl font-bold text-white">
          {score}/{total}
        </h2>
        <p className="text-slate-400">{pct}% correct</p>
        <Button variant="primary" className="mt-6" onClick={onRestart}>
          Play again
        </Button>
      </div>
      {missed.length > 0 && (
        <div className="mt-8 text-left">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Flags to review</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {missed.map((c) => (
              <div key={c.id} className="rounded-xl bg-slate-900/60 p-3 ring-1 ring-white/5">
                <FlagImage src={c.flagUrl} alt={`Flag of ${c.name}`} className="aspect-[3/2] w-full" />
                <div className="mt-2 text-center text-sm font-medium text-slate-200">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
