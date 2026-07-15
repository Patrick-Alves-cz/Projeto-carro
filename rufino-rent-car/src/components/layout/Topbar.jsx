import { Bell, Keyboard } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GlobalSearch from './GlobalSearch.jsx'
import { useData } from '../../contexts/DataContext.jsx'
import { initials } from '../../utils/formatters'

export default function Topbar({ onOpenShortcuts }) {
  const { alerts, settings } = useData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-ink-700 bg-ink-950/85 px-6 backdrop-blur-md">
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onOpenShortcuts}
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-ink-600 px-3 text-[12px] text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-100 lg:flex"
          title="Ver atalhos de teclado"
        >
          <Keyboard size={14} /> Atalhos <kbd className="rounded border border-ink-600 bg-ink-700 px-1 text-[10px]">?</kbd>
        </button>
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ink-600 text-mist-300 transition-colors hover:bg-ink-800 hover:text-mist-50"
          >
            <Bell size={16} />
            {alerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ruby-500 px-1 text-[10px] font-bold text-white">
                {alerts.length}
              </span>
            )}
          </button>
          {open && (
            <div className="animate-scale-in absolute right-0 top-11 w-80 rounded-xl border border-ink-600 bg-ink-800 p-2 shadow-card-hover">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-mist-400">
                Alertas ({alerts.length})
              </p>
              <div className="max-h-72 overflow-y-auto">
                {alerts.length === 0 && (
                  <p className="px-2 py-6 text-center text-[13px] text-mist-400">Nenhum alerta no momento.</p>
                )}
                {alerts.slice(0, 8).map((a) => (
                  <div key={a.id} className="rounded-lg px-2 py-2 hover:bg-ink-700">
                    <p className="text-[12.5px] font-medium text-mist-100">{a.title}</p>
                    <p className="text-[11px] text-mist-400">{a.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          to="/configuracoes"
          className="flex items-center gap-2.5 rounded-lg border border-ink-600 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-ink-800"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-500/15 text-[11px] font-bold text-gold-400">
            {initials(settings.ownerName) || 'RC'}
          </span>
          <span className="hidden text-[12.5px] font-medium text-mist-200 sm:block">{settings.ownerName}</span>
        </Link>
      </div>
    </header>
  )
}
