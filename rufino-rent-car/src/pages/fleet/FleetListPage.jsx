import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Plus, Search, Gauge } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import VehicleFormModal from '../../components/fleet/VehicleFormModal.jsx'
import { useHotkey } from '../../hooks/useHotkey.js'
import { VEHICLE_CATEGORIES, VEHICLE_STATUSES, labelFor, colorFor } from '../../utils/constants'
import { formatMileage } from '../../utils/formatters'

export default function FleetListPage() {
  const { vehicles, addVehicle } = useData()
  const navigate = useNavigate()
  const toast = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vehicles.filter((v) => {
      const matchesQuery =
        !q ||
        `${v.brand} ${v.model} ${v.plate} ${v.renavam}`.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter
      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [vehicles, query, statusFilter, categoryFilter])

  useHotkey('n', () => setFormOpen(true), { enabled: !formOpen })

  return (
    <div>
      <PageHeader
        title="Frota"
        subtitle={`${vehicles.length} veículos cadastrados`}
        actions={
          <Button icon={Plus} onClick={() => setFormOpen(true)}>
            Novo veículo
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3">
          <Search size={14} className="text-mist-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por marca, modelo, placa..."
            className="h-full w-full bg-transparent text-[13px] text-mist-100 placeholder:text-mist-400 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-ink-600 bg-ink-800 px-3 text-[12.5px] text-mist-200 focus:outline-none"
        >
          <option value="all">Todos os status</option>
          {VEHICLE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 rounded-lg border border-ink-600 bg-ink-800 px-3 text-[12.5px] text-mist-200 focus:outline-none"
        >
          <option value="all">Todas as categorias</option>
          {VEHICLE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Car}
          title="Nenhum veículo encontrado"
          description="Ajuste os filtros de busca ou cadastre um novo veículo na frota."
          action={<Button icon={Plus} onClick={() => setFormOpen(true)}>Cadastrar veículo</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => navigate(`/frota/${v.id}`)}
              className="surface-card-interactive group flex flex-col overflow-hidden text-left"
            >
              <div className="flex h-32 items-center justify-center bg-ink-800">
                {v.photo ? (
                  <img src={v.photo} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
                ) : (
                  <Car size={32} className="text-mist-500 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-mist-50">{v.brand} {v.model}</p>
                    <p className="truncate text-[11.5px] text-mist-400">{v.version} · {v.year}</p>
                  </div>
                  <Badge tone={colorFor(VEHICLE_STATUSES, v.status)}>{labelFor(VEHICLE_STATUSES, v.status)}</Badge>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 text-[11.5px] text-mist-400">
                  <span className="font-mono tracking-wide">{v.plate}</span>
                  <span className="flex items-center gap-1"><Gauge size={12} /> {formatMileage(v.mileage)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <VehicleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        vehicle={null}
        onSubmit={async (data) => {
          await addVehicle(data)
          toast.success('Veículo cadastrado com sucesso')
        }}
      />
    </div>
  )
}
