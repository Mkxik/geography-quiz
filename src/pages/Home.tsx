import { Link } from 'react-router-dom'
import { FlagImage } from '../components/FlagImage'
import { CONTINENTS, flagsData, SOVEREIGN_COUNT } from '../data/flagsData'
import { doppelgangerGroups } from '../lib/groups'

const MODES = [
  {
    to: '/classic',
    title: 'Classic Type',
    tag: 'Mode A',
    icon: '⌨️',
    description: 'One flag at a time. Type the country name, with typos and aliases forgiven.',
    accent: 'from-sky-500/25 to-sky-500/0 ring-sky-400/30',
    flags: ['br', 'jp', 'ca', 'za'],
  },
  {
    to: '/continents',
    title: 'Continent Clicker',
    tag: 'Mode B',
    icon: '🗺️',
    description: 'Pick a continent, then find each named flag in the grid.',
    accent: 'from-emerald-500/25 to-emerald-500/0 ring-emerald-400/30',
    flags: ['ke', 'gh', 'ng', 'et'],
  },
  {
    to: '/doppelgangers',
    title: 'Doppelgängers',
    tag: 'Mode C · Hardcore',
    icon: '👯',
    description: 'Lookalike flags side by side. Chad or Romania? Slovakia or Slovenia?',
    accent: 'from-rose-500/25 to-rose-500/0 ring-rose-400/30',
    flags: ['td', 'ro', 'id', 'mc'],
  },
  {
    to: '/explorer',
    title: 'Color & Feature Explorer',
    tag: 'Mode D · Learn',
    icon: '🔎',
    description: 'A gallery you can filter by colors and symbols like stars, crescents and crosses.',
    accent: 'from-violet-500/25 to-violet-500/0 ring-violet-400/30',
    flags: ['tr', 'ch', 'kz', 'np'],
  },
]

const flagById = new Map(flagsData.map((c) => [c.id, c]))

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="mb-10 text-center sm:mb-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">Geography quiz</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Flags of the{' '}
          <span className="bg-gradient-to-r from-sky-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">World</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          {SOVEREIGN_COUNT} countries plus {flagsData.length - SOVEREIGN_COUNT} territories and home nations. Four ways
          to learn them.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300 ring-1 ring-white/10">{flagsData.length} flags</span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300 ring-1 ring-white/10">{CONTINENTS.length} continents</span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300 ring-1 ring-white/10">
            {doppelgangerGroups.length} lookalike groups
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {MODES.map((mode, i) => (
          <Link
            key={mode.to}
            to={mode.to}
            style={{ animationDelay: `${i * 70}ms` }}
            className={`group relative animate-fade-in overflow-hidden rounded-2xl bg-gradient-to-br ${mode.accent} bg-slate-900/60 p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{mode.tag}</div>
                <h2 className="mt-1 text-xl font-bold text-white">
                  <span className="mr-2" aria-hidden>
                    {mode.icon}
                  </span>
                  {mode.title}
                </h2>
              </div>
              <span className="text-2xl text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{mode.description}</p>
            <div className="mt-5 flex gap-2">
              {mode.flags.map((id) => (
                <FlagImage
                  key={id}
                  src={flagById.get(id)!.flagUrl}
                  className="h-8 w-12 transition-transform duration-300 group-hover:scale-105"
                />
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
