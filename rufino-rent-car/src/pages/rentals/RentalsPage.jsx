import { useMemo, useState } from 'react'
import { FileSignature, Search, Plus, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useConfirm } from '../../contexts/ConfirmContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import RentalFormModal from '../../components/rentals/RentalFormModal.jsx'
import { useHotkey } from '../../hooks/useHotkey.js'
import { RENTAL_STATUSES, PAYMENT_METHODS, labelFor, colorFor } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function RentalsPage() {
  const { rentals, clients, vehicles, addRental, editRental, deleteRental, finalizeRental } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editingRental, setEditingRental] = useState(null)

  const enriched = useMemo(() => {
    return rentals
      .map((r) => ({
        ...r,
        client: clients.find((c) => c.id === r.clientId),
        vehicle: vehicles.find((v) => v.id === r.vehicleId),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [rentals, clients, vehicles])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enriched.filter((r) => {
      const matchesQuery =
        !q ||
        `${r.client?.name ?? ''} ${r.vehicle?.brand ?? ''} ${r.vehicle?.model ?? ''} ${r.vehicle?.plate ?? ''}`
          .toLowerCase()
          .includes(q)
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [enriched, query, statusFilter])

  function openCreate() {
    setEditingRental(null)
    setFormOpen(true)
  }

  useHotkey('n', openCreate, { enabled: !formOpen })

  function openEdit(rental) {
    setEditingRental(rental)
    setFormOpen(true)
  }

  async function handleFinalize(rental) {
    await finalizeRental(rental.id)
    toast.success('Locação finalizada', { description: 'O veículo voltou automaticamente para Disponível.' })
  }

  async function handleDelete(rental) {
    const ok = await confirm({
      title: 'Excluir locação?',
      description: 'Este registro de locação será removido permanentemente do histórico.',
    })
    if (!ok) return
    await deleteRental(rental.id)
    toast.success('Locação excluída com sucesso')
  }

  return (
    <div>
      <PageHeader
        title="Locações"
        subtitle={`${rentals.length} locações registradas`}
        actions={<Button icon={Plus} onClick={openCreate}>Nova locação</Button>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3">
          <Search size={14} className="text-mist-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por cliente ou veículo..."
            className="h-full w-full bg-transparent text-[13px] text-mist-100 placeholder:text-mist-400 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-ink-600 bg-ink-800 px-3 text-[12.5px] text-mist-200 focus:outline-none"
        >
          <option value="all">Todos os status</option>
          {RENTAL_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="Nenhuma locação encontrada"
          description="Ajuste os filtros ou registre uma nova locação."
          action={<Button icon={Plus} onClick={openCreate}>Registrar locação</Button>}
        />
      ) : (
        <div className="surface-card overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-800/60 text-[11px] uppercase tracking-wide text-mist-400">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Veículo</th>
                <th className="px-5 py-3 font-medium">Retirada</th>
                <th className="px-5 py-3 font-medium">Devolução</th>
                <th className="px-5 py-3 font-medium">Pagamento</th>
                <th className="px-5 py-3 font-medium">Valor</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="px-5 py-3 text-mist-100">{r.client?.name ?? 'Cliente removido'}</td>
                  <td className="px-5 py-3 text-mist-300">
                    {r.vehicle ? `${r.vehicle.brand} ${r.vehicle.model}` : 'Veículo removido'}
                    <span className="ml-1.5 font-mono text-[11px] text-mist-500">{r.vehicle?.plate}</span>
                  </td>
                  <td className="px-5 py-3 text-mist-300">{formatDate(r.pickupDate)}</td>
                  <td className="px-5 py-3 text-mist-300">{formatDate(r.actualReturnDate || r.returnDate)}</td>
                  <td className="px-5 py-3 text-mist-300">{labelFor(PAYMENT_METHODS, r.paymentMethod)}</td>
                  <td className="px-5 py-3 font-mono text-mist-100">{formatCurrency(r.totalValue)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={colorFor(RENTAL_STATUSES, r.status)}>{labelFor(RENTAL_STATUSES, r.status)}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === 'ativa' && (
                        <button
                          onClick={() => handleFinalize(r)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
                        >
                          <CheckCircle2 size={13} /> Finalizar
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(r)}
                        className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ink-700 hover:text-mist-100"
                        aria-label="Editar locação"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ruby-500/10 hover:text-ruby-400"
                        aria-label="Excluir locação"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RentalFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rental={editingRental}
        onSubmit={async (data) => {
          if (editingRental) {
            await editRental(editingRental.id, data)
            toast.success('Locação atualizada com sucesso')
          } else {
            await addRental(data)
            toast.success('Locação registrada com sucesso', {
              description: data.status === 'ativa' ? 'O veículo foi marcado como Alugado.' : undefined,
            })
          }
        }}
      />
    </div>
  )
}
