import { useMemo } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Wallet, Car, Users, FileSignature, Wrench } from 'lucide-react'
import { useData } from '../contexts/DataContext.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import FleetGauge from '../components/dashboard/FleetGauge.jsx'
import RevenueProfitChart from '../components/dashboard/RevenueProfitChart.jsx'
import ExpensesByCategoryChart from '../components/dashboard/ExpensesByCategoryChart.jsx'
import RankingBarChart from '../components/dashboard/RankingBarChart.jsx'
import AlertsPanel from '../components/dashboard/AlertsPanel.jsx'
import { formatCurrency, formatCompactCurrency } from '../utils/formatters'
import {
  monthRevenue,
  yearRevenue,
  monthExpenses,
  yearExpenses,
  fleetCounts,
  monthlyProfitSeries,
  monthlyRevenueSeries,
  expensesByCategory,
  mostRentedVehicles,
  revenueByVehicle,
} from '../utils/calculations'

export default function DashboardPage() {
  const { vehicles, clients, rentals, expenses, alerts, settings } = useData()

  const metrics = useMemo(() => {
    const revenueMonth = monthRevenue(rentals)
    const revenueYear = yearRevenue(rentals)
    const expenseMonth = monthExpenses(expenses)
    const expenseYear = yearExpenses(expenses)
    const counts = fleetCounts(vehicles)
    const activeRentals = rentals.filter((r) => r.status === 'ativa').length

    const revSeries = monthlyRevenueSeries(rentals, 6)
    const profitSeries = monthlyProfitSeries(rentals, expenses, 6)
    const combinedSeries = revSeries.map((r, i) => ({ month: r.month, receita: r.receita, lucro: profitSeries[i]?.lucro ?? 0 }))

    return {
      revenueMonth,
      revenueYear,
      expenseMonth,
      expenseYear,
      profitMonth: revenueMonth - expenseMonth,
      profitYear: revenueYear - expenseYear,
      counts,
      activeRentals,
      combinedSeries,
      expenseCategoryData: expensesByCategory(expenses, new Date(), 'month'),
      mostRented: mostRentedVehicles(rentals, vehicles, 5),
      byVehicle: revenueByVehicle(rentals, vehicles, 5),
      utilization: counts.total > 0 ? (counts.alugado / counts.total) * 100 : 0,
    }
  }, [vehicles, rentals, expenses])

  return (
    <div>
      <PageHeader
        title={`Bem-vindo, ${settings.ownerName?.split(' ')[0] ?? ''}`}
        subtitle="Visão geral do desempenho da locadora em tempo real"
      />

      {/* Top row: primary financial KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="Receita do mês" value={formatCurrency(metrics.revenueMonth)} tone="gold" />
        <KpiCard icon={TrendingUp} label="Receita anual" value={formatCompactCurrency(metrics.revenueYear)} tone="emerald" />
        <KpiCard icon={TrendingDown} label="Despesas do mês" value={formatCurrency(metrics.expenseMonth)} tone="ruby" />
        <KpiCard icon={Wallet} label="Lucro do mês" value={formatCurrency(metrics.profitMonth)} tone={metrics.profitMonth >= 0 ? 'emerald' : 'ruby'} />
      </div>

      {/* Second row: operational KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={Car} label="Veículos na frota" value={metrics.counts.total} tone="mist" />
        <KpiCard icon={FileSignature} label="Locações ativas" value={metrics.activeRentals} tone="gold" />
        <KpiCard icon={Users} label="Clientes cadastrados" value={clients.length} tone="azure" />
        <KpiCard icon={Wrench} label="Em manutenção" value={metrics.counts.manutencao} tone="ruby" />
      </div>

      {/* Third row: gauge + revenue/profit trend */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card flex flex-col items-center justify-center p-5 lg:col-span-1">
          <h3 className="label-eyebrow mb-2 self-start">Frota</h3>
          <FleetGauge
            percent={metrics.utilization}
            label="Utilização da frota"
            sublabel={`${metrics.counts.alugado} de ${metrics.counts.total} veículos alugados`}
          />
          <div className="mt-4 grid w-full grid-cols-3 gap-2 text-center">
            <div>
              <p className="font-mono text-[15px] font-semibold text-emerald-400">{metrics.counts.disponivel}</p>
              <p className="text-[10.5px] text-mist-400">Disponível</p>
            </div>
            <div>
              <p className="font-mono text-[15px] font-semibold text-gold-400">{metrics.counts.alugado}</p>
              <p className="text-[10.5px] text-mist-400">Alugado</p>
            </div>
            <div>
              <p className="font-mono text-[15px] font-semibold text-azure-400">{metrics.counts.reservado}</p>
              <p className="text-[10.5px] text-mist-400">Reservado</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-5 lg:col-span-2">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="label-eyebrow">Receita &amp; lucro mensal</h3>
            <p className="text-[11.5px] text-mist-400">Últimos 6 meses</p>
          </div>
          <RevenueProfitChart data={metrics.combinedSeries} />
        </div>
      </div>

      {/* Fourth row: expenses + rankings */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-1">Despesas por categoria</h3>
          <p className="mb-2 text-[11.5px] text-mist-400">Mês atual</p>
          <ExpensesByCategoryChart data={metrics.expenseCategoryData} />
        </div>

        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-1">Veículos mais alugados</h3>
          <p className="mb-2 text-[11.5px] text-mist-400">Contagem de locações</p>
          <RankingBarChart data={metrics.mostRented} dataKey="count" name="Locações" valueFormatter={(v) => `${v}`} color="#C9A961" />
        </div>

        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-1">Receita por veículo</h3>
          <p className="mb-2 text-[11.5px] text-mist-400">Top 5 geradores de receita</p>
          <RankingBarChart data={metrics.byVehicle} dataKey="value" name="Receita" valueFormatter={formatCurrency} color="#3FA772" />
        </div>
      </div>

      {/* Fifth row: alerts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AlertsPanel alerts={alerts} />
        </div>
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="label-eyebrow mb-3">Resumo financeiro anual</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11.5px] text-mist-400">Receita anual</p>
              <p className="mt-1 font-mono text-[17px] font-semibold text-mist-50">{formatCurrency(metrics.revenueYear)}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-mist-400">Despesa anual</p>
              <p className="mt-1 font-mono text-[17px] font-semibold text-mist-50">{formatCurrency(metrics.expenseYear)}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-mist-400">Lucro anual</p>
              <p className={`mt-1 font-mono text-[17px] font-semibold ${metrics.profitYear >= 0 ? 'text-emerald-400' : 'text-ruby-400'}`}>
                {formatCurrency(metrics.profitYear)}
              </p>
            </div>
          </div>
          <div className="divider-gold my-4" />
          <p className="text-[12.5px] leading-relaxed text-mist-400">
            {metrics.profitYear >= 0
              ? 'A operação está lucrativa no acumulado do ano. Continue acompanhando as categorias de despesa com maior peso para preservar a margem.'
              : 'A operação está com despesas acima da receita no acumulado do ano. Revise as categorias de maior gasto na página Financeiro.'}
          </p>
        </div>
      </div>
    </div>
  )
}
