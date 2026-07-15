import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, User, Car, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../contexts/DataContext.jsx'

function normalize(str = '') {
  return str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function GlobalSearch() {
  const { clients, vehicles } = useData()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    function handleKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        containerRef.current?.querySelector('input')?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (q.length < 2) return { clients: [], vehicles: [] }

    const matchedClients = clients
      .filter((c) => [c.name, c.cpf, c.phone, c.whatsapp].some((field) => normalize(field).includes(q)))
      .slice(0, 5)

    const matchedVehicles = vehicles
      .filter((v) =>
        [v.brand, v.model, v.plate, v.renavam].some((field) => normalize(field).includes(q))
      )
      .slice(0, 5)

    return { clients: matchedClients, vehicles: matchedVehicles }
  }, [query, clients, vehicles])

  const hasResults = results.clients.length > 0 || results.vehicles.length > 0

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex h-9 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3 transition-colors focus-within:border-gold-500/50">
        <Search size={15} className="shrink-0 text-mist-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Buscar cliente, veículo, CPF, placa..."
          className="h-full w-full bg-transparent text-[13px] text-mist-100 placeholder:text-mist-400 focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-mist-400 hover:text-mist-100">
            <X size={13} />
          </button>
        )}
        <kbd className="hidden shrink-0 rounded border border-ink-600 bg-ink-700 px-1.5 py-0.5 text-[10px] text-mist-400 sm:block">
          ⌘K
        </kbd>
      </div>

      {open && query.trim().length >= 2 && (
        <div className="animate-scale-in absolute left-0 right-0 top-11 z-50 max-h-96 overflow-y-auto rounded-xl border border-ink-600 bg-ink-800 p-2 shadow-card-hover">
          {!hasResults && (
            <p className="px-3 py-6 text-center text-[13px] text-mist-400">Nenhum resultado para "{query}"</p>
          )}
          {results.clients.length > 0 && (
            <div className="mb-1">
              <p className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-mist-400">Clientes</p>
              {results.clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    navigate('/clientes')
                    setOpen(false)
                    setQuery('')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-700"
                >
                  <User size={14} className="text-mist-400" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-mist-100">{c.name}</p>
                    <p className="truncate text-[11px] text-mist-400">{c.cpf}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {results.vehicles.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-mist-400">Veículos</p>
              {results.vehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    navigate(`/frota/${v.id}`)
                    setOpen(false)
                    setQuery('')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-ink-700"
                >
                  <Car size={14} className="text-mist-400" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] text-mist-100">{v.brand} {v.model}</p>
                    <p className="truncate text-[11px] text-mist-400">{v.plate}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
