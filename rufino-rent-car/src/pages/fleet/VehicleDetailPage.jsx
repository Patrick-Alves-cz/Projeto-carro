import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Car, Gauge, Trash2, TrendingUp, TrendingDown, Percent, Wrench, Pencil } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useConfirm } from '../../contexts/ConfirmContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import VehicleFormModal from '../../components/fleet/VehicleFormModal.jsx'
import { VEHICLE_STATUSES, VEHICLE_CATEGORIES, EXPENSE_CATEGORIES, RENTAL_STATUSES, labelFor, colorFor } from '../../utils/constants'
import { formatCurrency, formatDate, formatMileage } from '../../utils/formatters'
import { vehicleProfile } from '../../utils/calculations'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const confirm = useConfirm()
  const toast = useToast()
  const { vehicles, rentals, expenses, clients, deleteVehicle, editVehicle } = useData()
  const [editOpen, setEditOpen] = useState(false)

  const vehicle = vehicles.find((v) => v.id === id)

  const profile = useMemo(() => {
    if (!vehicle) return null
    return vehicleProfile(vehicle, rentals, expenses)
  }, [vehicle, rentals, expenses])

  const vehicleRentals = useMemo(
    () =>
      rentals
        .filter((r) => r.vehicleId === id)
        .sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate)),
    [rentals, id]
  )

  const vehicleExpenses = useMemo(
    () => expenses.filter((e) => e.vehicleId === id).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [expenses, id]
  )

  if (!vehicle) {
    return (
      <EmptyState
        icon={Car}
        title="Veículo não encontrado"
        description="Este veículo pode ter sido removido da frota."
        action={<Button onClick={() => navigate('/frota')}>Voltar para a frota</Button>}
      />
    )
  }

  async function handleDelete() {
    const ok = await confirm({
      title: 'Excluir veículo?',
      description: `${vehicle.brand} ${vehicle.model} (${vehicle.plate}) será removido permanentemente da frota.`,
    })
    if (!ok) return
    await deleteVehicle(vehicle.id)
    toast.success('Veículo excluído com sucesso')
    navigate('/frota')
  }

  return (
    <div>
      <Link to="/frota" className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] text-mist-400 hover:text-mist-100">
        <ArrowLeft size={14} /> Voltar para a frota
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-ink-800">
            {vehicle.photo ? (
              <img src={vehicle.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <Car size={26} className="text-mist-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-[20px] font-bold text-mist-50">{vehicle.brand} {vehicle.model}</h1>
              <Badge tone={colorFor(VEHICLE_STATUSES, vehicle.status)}>{labelFor(VEHICLE_STATUSES, vehicle.status)}</Badge>
            </div>
            <p className="mt-0.5 text-[13px] text-mist-400">
              {vehicle.version} · {vehicle.year} · {labelFor(VEHICLE_CATEGORIES, vehicle.category)} · <span className="font-mono">{vehicle.plate}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>Editar</Button>
          <Button variant="danger" icon={Trash2} onClick={handleDelete}>Excluir veículo</Button>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400"><TrendingUp size={16} /></div>
          <p className="mt-3 font-mono text-[18px] font-semibold text-mist-50">{formatCurrency(profile.totalRevenue)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Receita total gerada</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ruby-500/10 text-ruby-400"><TrendingDown size={16} /></div>
          <p className="mt-3 font-mono text-[18px] font-semibold text-mist-50">{formatCurrency(profile.totalExpenses)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Total de despesas</p>
        </div>
        <div className="surface-card p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${profile.netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-ruby-500/10 text-ruby-400'}`}><Gauge size={16} /></div>
          <p className={`mt-3 font-mono text-[18px] font-semibold ${profile.netProfit >= 0 ? 'text-emerald-400' : 'text-ruby-400'}`}>{formatCurrency(profile.netProfit)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Lucro líquido</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-azure-500/10 text-azure-400"><Percent size={16} /></div>
          <p className="mt-3 font-mono text-[18px] font-semibold text-mist-50">{profile.roi.toFixed(1)}%</p>
          <p className="mt-1 text-[12px] text-mist-400">ROI sobre valor de compra</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Vehicle info */}
        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-3">Informações do veículo</h3>
          <dl className="space-y-2.5 text-[13px]">
            <Row label="Cor" value={vehicle.color} />
            <Row label="RENAVAM" value={vehicle.renavam} mono />
            <Row label="Chassi" value={vehicle.chassis} mono />
            <Row label="Quilometragem" value={formatMileage(vehicle.mileage)} />
            <Row label="Valor de compra" value={formatCurrency(vehicle.purchaseValue)} />
            <Row label="Data da compra" value={formatDate(vehicle.purchaseDate)} />
            <Row label="Seguro vence em" value={formatDate(vehicle.insuranceExpiry)} />
            <Row label="IPVA/Licenciamento vence em" value={formatDate(vehicle.licensingExpiry)} />
          </dl>
          {vehicle.notes && (
            <>
              <div className="divider-gold my-3" />
              <p className="text-[12.5px] text-mist-300">{vehicle.notes}</p>
            </>
          )}
        </div>

        {/* Usage stats */}
        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-3">Desempenho operacional</h3>
          <dl className="space-y-2.5 text-[13px]">
            <Row label="Quantidade de locações" value={profile.rentalCount} />
            <Row label="Dias alugado" value={`${profile.daysRented} dias`} />
            <Row label="Dias parado" value={`${profile.daysIdle} dias`} />
            <Row label="Valor médio por locação" value={formatCurrency(profile.avgTicket)} />
          </dl>
        </div>

        {/* Expense breakdown */}
        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-3">Despesas por categoria</h3>
          {Object.keys(profile.expenseBreakdown).length === 0 ? (
            <p className="text-[12.5px] text-mist-400">Nenhuma despesa registrada para este veículo.</p>
          ) : (
            <dl className="space-y-2.5 text-[13px]">
              {Object.entries(profile.expenseBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, value]) => (
                  <Row key={category} label={labelFor(EXPENSE_CATEGORIES, category)} value={formatCurrency(value)} />
                ))}
            </dl>
          )}
        </div>
      </div>

      {/* Rental history */}
      <div className="surface-card mt-4 p-5">
        <h3 className="label-eyebrow mb-3">Histórico de locações</h3>
        {vehicleRentals.length === 0 ? (
          <p className="text-[12.5px] text-mist-400">Este veículo ainda não possui locações registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-ink-700 text-[11px] uppercase tracking-wide text-mist-400">
                  <th className="pb-2 pr-4 font-medium">Cliente</th>
                  <th className="pb-2 pr-4 font-medium">Retirada</th>
                  <th className="pb-2 pr-4 font-medium">Devolução</th>
                  <th className="pb-2 pr-4 font-medium">Valor</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {vehicleRentals.map((r) => {
                  const client = clients.find((c) => c.id === r.clientId)
                  return (
                    <tr key={r.id} className="border-b border-ink-800 last:border-0">
                      <td className="py-2.5 pr-4 text-mist-100">{client?.name ?? 'Cliente removido'}</td>
                      <td className="py-2.5 pr-4 text-mist-300">{formatDate(r.pickupDate)}</td>
                      <td className="py-2.5 pr-4 text-mist-300">{formatDate(r.actualReturnDate || r.returnDate)}</td>
                      <td className="py-2.5 pr-4 font-mono text-mist-100">{formatCurrency(r.totalValue)}</td>
                      <td className="py-2.5">
                        <Badge tone={colorFor(RENTAL_STATUSES, r.status)}>{labelFor(RENTAL_STATUSES, r.status)}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense history */}
      <div className="surface-card mt-4 p-5">
        <h3 className="label-eyebrow mb-3 flex items-center gap-1.5"><Wrench size={13} /> Histórico de despesas</h3>
        {vehicleExpenses.length === 0 ? (
          <p className="text-[12.5px] text-mist-400">Nenhuma despesa registrada para este veículo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-ink-700 text-[11px] uppercase tracking-wide text-mist-400">
                  <th className="pb-2 pr-4 font-medium">Descrição</th>
                  <th className="pb-2 pr-4 font-medium">Categoria</th>
                  <th className="pb-2 pr-4 font-medium">Data</th>
                  <th className="pb-2 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {vehicleExpenses.map((e) => (
                  <tr key={e.id} className="border-b border-ink-800 last:border-0">
                    <td className="py-2.5 pr-4 text-mist-100">{e.description}</td>
                    <td className="py-2.5 pr-4 text-mist-300">{labelFor(EXPENSE_CATEGORIES, e.category)}</td>
                    <td className="py-2.5 pr-4 text-mist-300">{formatDate(e.date)}</td>
                    <td className="py-2.5 font-mono text-mist-100">{formatCurrency(e.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VehicleFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        vehicle={vehicle}
        onSubmit={async (data) => {
          await editVehicle(vehicle.id, data)
          toast.success('Veículo atualizado com sucesso')
        }}
      />
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-mist-400">{label}</dt>
      <dd className={`text-right text-mist-100 ${mono ? 'font-mono' : ''}`}>{value || '—'}</dd>
    </div>
  )
}
