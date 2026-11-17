import { useEffect, useMemo, useRef, useState } from 'react'
import { FlagImage } from '../components/FlagImage'
import { Button, PageHeader, ProgressBar, Stat } from '../components/ui'
import { flagsData, type Country, type SimilarityGroup } from '../data/flagsData'
import { flash, preload, shake } from '../lib/feedback'
import { buildGroups } from '../lib/groups'
import { sample, shuffle } from '../lib/random'

const MAX_OPTIONS = 6
const ROUND_SIZES = [10, 25, 50] as const

interface Round {
  target: Country
  group: SimilarityGroup
  options: Country[]
}

function buildRounds(countries: Country[], length: number | 'all'): Round[] {
  const groups = buildGroups(countries)
  const candidates = shuffle(groups.flatMap((g) => g.members.map((target) => ({ target, group: g }))))
  const picked = length === 'all' ? candidates : candidates.slice(0, length)
  return picked.map(({ target, group }) => {
    const others = group.members.filter((m) => m.id !== target.id)
    return {
      target,
      group: group.name,
      options: shuffle([target, ...sample(others, MAX_OPTIONS - 1)]),
    }
  })
}

export default function Doppelgangers() {
  const [length, setLength] = useState<number | 'all'>(25)
  const [includeTerritories, setIncludeTerritories] = useState(true)
  const [round, setRound] = useState(0)

  const pool = useMemo(() => flagsData.filter((c) => includeTerritories || !c.isTerritory), [includeTerritories])

  return (
    <div className="animate-fade-in">
      <PageHeader title="Doppelgängers" subtitle="Hardcore mode: each question shows 2–6 flags that look alike.">
        <div className="flex rounded-xl bg-slate-900 p-1 ring-1 ring-white/10" role="group" aria-label="Round length">
          {[...ROUND_SIZES, 'all' as const].map((size) => (
            <button
              key={size}
              onClick={() => setLength(size)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                length === size ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {size === 'all' ? 'All' : size}
            </button>
          ))}
        </div>
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
      <DoppelgangerGame
        key={`${length}-${includeTerritories}-${round}`}
        pool={pool}
        length={length}
        onRestart={() => setRound((r) => r + 1)}
      />
    </div>
  )
}

interface Mistake {
  target: Country
  picked: Country
}

function DoppelgangerGame({
  pool,
  length,
  onRestart,
}: {
  pool: Country[]
  length: number | 'all'
  onRestart: () => void
}) {
  const [rounds] = useState(() => buildRounds(pool, length))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const tileRefs = useRef(new Map<string, HTMLButtonElement>())
  const nextRef = useRef<HTMLButtonElement>(null)

  const current = rounds[index] as Round | undefined
  const answeredCorrectly = picked !== null && picked === current?.target.id

  useEffect(() => {
    rounds[index + 1]?.options.forEach((o) => preload(o.flagUrl))
  }, [index, rounds])

  const next = () => {
    setPicked(null)
    setIndex((i) => i + 1)
  }

  // Correct answers advance on their own; wrong answers wait so the player can compare the flags.
  // Focus "Next" without scrolling the question out of view, so Enter / Space continues.
  useEffect(() => {
    if (picked !== null && !answeredCorrectly) nextRef.current?.focus({ preventScroll: true })
  }, [picked, answeredCorrectly])

  useEffect(() => {
    if (!answeredCorrectly) return
    const timer = setTimeout(next, 1100)
    return () => clearTimeout(timer)
  }, [answeredCorrectly])

  function choose(option: Country) {
    if (!current || picked) return
    setPicked(option.id)
    const el = tileRefs.current.get(option.id) ?? null
    if (option.id === current.target.id) {
      setScore((s) => s + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      setBestStreak((b) => Math.max(b, newStreak))
      flash(el, 'green')
    } else {
      setStreak(0)
      setMistakes((m) => [...m, { target: current.target, picked: option }])
      flash(el, 'red')
      shake(el)
      flash(tileRefs.current.get(current.target.id) ?? null, 'green')
    }
  }

  if (!current) {
    return <Summary score={score} total={rounds.length} bestStreak={bestStreak} mistakes={mistakes} onRestart={onRestart} />
  }

  const cols =
    current.options.length <= 2
      ? 'grid-cols-2'
      : current.options.length === 4
        ? 'grid-cols-2'
        : 'grid-cols-2 sm:grid-cols-3'

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 grid grid-cols-3 gap-2 sm:max-w-md">
        <Stat label="Score" value={`${score}/${rounds.length}`} tone="good" />
        <Stat label="Streak" value={`🔥 ${streak}`} />
        <Stat label="Best" value={bestStreak} />
      </div>
      <ProgressBar value={index} max={rounds.length} />

      <div className="mt-6 text-center">
        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-300 ring-1 ring-rose-400/30">
          {current.group}
        </span>
        <h2 key={current.target.id} className="mt-4 animate-pop text-2xl font-bold text-white sm:text-3xl">
          Which of these is <span className="text-sky-300">{current.target.name}</span>?
        </h2>
      </div>

      <div key={index} className={`mx-auto mt-8 grid max-w-3xl animate-fade-in gap-3 sm:gap-4 ${cols}`}>
        {current.options.map((option) => {
          const isTarget = option.id === current.target.id
          const isPicked = option.id === picked
          const state =
            picked === null
              ? 'ring-1 ring-white/10 bg-slate-900/60 hover:-translate-y-1 hover:ring-sky-400/60 hover:bg-slate-800'
              : isTarget
                ? 'ring-2 ring-emerald-400 bg-emerald-500/10'
                : isPicked
                  ? 'ring-2 ring-rose-500 bg-rose-500/10'
                  : 'ring-1 ring-white/5 bg-slate-900/40'
          return (
            <button
              key={option.id}
              ref={(el) => {
                if (el) tileRefs.current.set(option.id, el)
                else tileRefs.current.delete(option.id)
              }}
              onClick={() => choose(option)}
              disabled={picked !== null}
              aria-label={picked ? option.name : 'Flag option'}
              className={`flex flex-col items-center rounded-2xl p-3 transition-all duration-300 sm:p-5 ${state}`}
            >
              <FlagImage src={option.flagUrl} eager className="aspect-[3/2] w-full" />
              <span
                className={`mt-3 h-5 text-sm font-semibold transition-opacity duration-300 ${
                  picked ? 'opacity-100' : 'opacity-0'
                } ${isTarget ? 'text-emerald-300' : isPicked ? 'text-rose-300' : 'text-slate-300'}`}
              >
                {picked ? option.name : '·'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex h-12 items-center justify-center">
        {picked !== null && !answeredCorrectly && (
          <Button ref={nextRef} variant="primary" onClick={next} className="animate-pop">
            Next <kbd className="ml-1 rounded bg-slate-950/20 px-1.5 font-mono text-xs">Enter</kbd>
          </Button>
        )}
        {answeredCorrectly && <div className="animate-pop text-lg font-bold text-emerald-300">✓ Correct!</div>}
      </div>
    </div>
  )
}

function Summary({
  score,
  total,
  bestStreak,
  mistakes,
  onRestart,
}: {
  score: number
  total: number
  bestStreak: number
  mistakes: Mistake[]
  onRestart: () => void
}) {
  const pct = total ? Math.round((score / total) * 100) : 0
  return (
    <div className="mx-auto max-w-3xl animate-pop">
      <div className="rounded-3xl bg-slate-900/60 p-8 text-center ring-1 ring-white/10">
        <div className="text-6xl">{pct === 100 ? '🏆' : pct >= 70 ? '🎯' : '👀'}</div>
        <h2 className="mt-4 text-3xl font-bold text-white">
          {score}/{total}
        </h2>
        <p className="text-slate-400">
          {pct}% correct · best streak {bestStreak}
        </p>
        <Button variant="primary" className="mt-6" onClick={onRestart}>
          New set
        </Button>
      </div>
      {mistakes.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Your mix-ups</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {mistakes.map(({ target, picked }, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-900/60 p-3 ring-1 ring-white/5">
                <div className="flex-1 text-center">
                  <FlagImage src={target.flagUrl} alt={`Flag of ${target.name}`} className="aspect-[3/2] w-full" />
                  <div className="mt-1 text-xs font-semibold text-emerald-300">{target.name}</div>
                </div>
                <span className="text-slate-500">vs</span>
                <div className="flex-1 text-center">
                  <FlagImage src={picked.flagUrl} alt={`Flag of ${picked.name}`} className="aspect-[3/2] w-full" />
                  <div className="mt-1 text-xs font-semibold text-rose-300">{picked.name} (your pick)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
