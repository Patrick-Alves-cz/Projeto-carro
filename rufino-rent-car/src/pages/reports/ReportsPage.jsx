import { useMemo } from 'react'
import { FileDown, FileSpreadsheet, TrendingDown, Trophy, Users } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import RevenueProfitChart from '../../components/dashboard/RevenueProfitChart.jsx'
import { formatCurrency } from '../../utils/formatters'
import { vehicleProfile, monthlyRevenueSeries, monthlyExpenseSeries, monthlyProfitSeries, sum, rentalRevenue } from '../../utils/calculations'
import { exportReportToPDF, exportReportToExcel, buildVehicleProfitabilityReport } from '../../utils/reportExport'

export default function ReportsPage() {
  const { vehicles, rentals, expenses, clients, settings } = useData()
  const toast = useToast()

  const profitability = useMemo(() => {
    return vehicles
      .map((v) => ({ vehicle: v, profile: vehicleProfile(v, rentals, expenses) }))
      .sort((a, b) => b.profile.netProfit - a.profile.netProfit)
  }, [vehicles, rentals, expenses])

  const mostProfitable = profitability.slice(0, 3)
  const leastProfitable = [...profitability].reverse().slice(0, 3)

  const topClients = useMemo(() => {
    const counts = {}
    rentals.forEach((r) => {
      if (r.status === 'cancelada') return
      counts[r.clientId] = (counts[r.clientId] || 0) + 1
    })
    return Object.entries(counts)
      .map(([clientId, count]) => ({ client: clients.find((c) => c.id === clientId), count }))
      .filter((c) => c.client)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [rentals, clients])

  const cashFlowSeries = useMemo(() => {
    const rev = monthlyRevenueSeries(rentals, 6)
    const exp = monthlyExpenseSeries(expenses, 6)
    const profit = monthlyProfitSeries(rentals, expenses, 6)
    return rev.map((r, i) => ({ month: r.month, receita: r.receita, lucro: profit[i]?.lucro ?? 0, despesa: exp[i]?.despesa ?? 0 }))
  }, [rentals, expenses])

  const totalRevenue = sum(rentals, rentalRevenue)
  const totalExpenses = sum(expenses, (e) => e.value)

  function handleExportPDF() {
    const report = buildVehicleProfitabilityReport(vehicles, rentals, expenses, vehicleProfile)
    exportReportToPDF({ ...report, companyName: settings.companyName })
    toast.success('Relatório PDF gerado com sucesso')
  }

  function handleExportExcel() {
    const report = buildVehicleProfitabilityReport(vehicles, rentals, expenses, vehicleProfile)
    exportReportToExcel(report)
    toast.success('Relatório Excel gerado com sucesso')
  }

  return (
    <div>
      <PageHeader
        title="Relatórios"
        subtitle="Análises consolidadas de desempenho da locadora"
        actions={
          <div className="flex gap-2.5">
            <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExportExcel}>Exportar Excel</Button>
            <Button variant="outline" icon={FileDown} onClick={handleExportPDF}>Exportar PDF</Button>
          </div>
        }
      />

      <div className="surface-card p-5">
        <h3 className="label-eyebrow mb-1">Fluxo de caixa</h3>
        <p className="mb-2 text-[11.5px] text-mist-400">Receita, despesa e lucro — últimos 6 meses</p>
        <RevenueProfitChart data={cashFlowSeries} />
        <div className="mt-3 grid grid-cols-3 gap-4 border-t border-ink-700 pt-3 text-center">
          <div>
            <p className="text-[11px] text-mist-400">Receita acumulada</p>
            <p className="mt-1 font-mono text-[14px] font-semibold text-gold-400">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-[11px] text-mist-400">Despesa acumulada</p>
            <p className="mt-1 font-mono text-[14px] font-semibold text-ruby-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div>
            <p className="text-[11px] text-mist-400">Lucro acumulado</p>
            <p className="mt-1 font-mono text-[14px] font-semibold text-emerald-400">{formatCurrency(totalRevenue - totalExpenses)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-3 flex items-center gap-1.5"><Trophy size={13} className="text-gold-400" /> Veículos mais lucrativos</h3>
          <ul className="space-y-2.5">
            {mostProfitable.map(({ vehicle, profile }, i) => (
              <li key={vehicle.id} className="flex items-center justify-between rounded-lg bg-ink-800/60 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/15 text-[11px] font-bold text-gold-400">{i + 1}</span>
                  <div>
                    <p className="text-[13px] font-medium text-mist-100">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-[11px] text-mist-400">{vehicle.plate}</p>
                  </div>
                </div>
                <span className="font-mono text-[13px] font-semibold text-emerald-400">{formatCurrency(profile.netProfit)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-3 flex items-center gap-1.5"><TrendingDown size={13} className="text-ruby-400" /> Veículos menos lucrativos</h3>
          <ul className="space-y-2.5">
            {leastProfitable.map(({ vehicle, profile }, i) => (
              <li key={vehicle.id} className="flex items-center justify-between rounded-lg bg-ink-800/60 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ruby-500/15 text-[11px] font-bold text-ruby-400">{i + 1}</span>
                  <div>
                    <p className="text-[13px] font-medium text-mist-100">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-[11px] text-mist-400">{vehicle.plate}</p>
                  </div>
                </div>
                <span className={`font-mono text-[13px] font-semibold ${profile.netProfit >= 0 ? 'text-emerald-400' : 'text-ruby-400'}`}>
                  {formatCurrency(profile.netProfit)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 surface-card p-5">
        <h3 className="label-eyebrow mb-3 flex items-center gap-1.5"><Users size={13} className="text-azure-400" /> Clientes que mais alugam</h3>
        {topClients.length === 0 ? (
          <p className="text-[12.5px] text-mist-400">Nenhum dado suficiente ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {topClients.map(({ client, count }) => (
              <div key={client.id} className="flex items-center justify-between rounded-lg bg-ink-800/60 px-3 py-2.5">
                <p className="truncate text-[13px] text-mist-100">{client.name}</p>
                <span className="shrink-0 rounded-full bg-azure-500/10 px-2 py-0.5 text-[11px] font-semibold text-azure-400">{count}x</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
