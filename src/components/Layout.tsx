import { NavLink, Outlet } from 'react-router-dom'

const LINKS = [
  { to: '/classic', label: 'Classic', icon: '⌨️' },
  { to: '/continents', label: 'Continents', icon: '🗺️' },
  { to: '/doppelgangers', label: 'Doppelgängers', icon: '👯' },
  { to: '/explorer', label: 'Explorer', icon: '🔎' },
]

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
          <NavLink to="/" className="mr-2 flex shrink-0 items-center gap-2 font-bold tracking-tight text-white">
            <span className="text-xl">🌍</span>
            <span className="hidden sm:inline">Flags of the World</span>
          </NavLink>
          <div className="ml-auto flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                title={link.label}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <span aria-hidden>{link.icon}</span>
                <span className="hidden md:inline">{link.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-xs text-slate-500">
        Flag images from <a className="underline hover:text-slate-300" href="https://flagcdn.com" target="_blank" rel="noreferrer">flagcdn.com</a>
      </footer>
    </div>
  )
}
