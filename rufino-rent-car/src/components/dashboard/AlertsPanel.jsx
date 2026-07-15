import { ShieldAlert, FileWarning, IdCard, FileClock, Wrench, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

const ICONS = {
  seguro: ShieldAlert,
  ipva: FileWarning,
  cnh: IdCard,
  contrato: FileClock,
  manutencao: Wrench,
}

const SEVERITY_STYLE = {
  critical: 'text-ruby-400 bg-ruby-500/10',
  high: 'text-amber-400 bg-amber-500/10',
  medium: 'text-azure-400 bg-azure-500/10',
}

function severityText(alert) {
  if (alert.daysLeft === null) return 'Em andamento'
  if (alert.daysLeft < 0) return `Vencido há ${Math.abs(alert.daysLeft)}d`
  if (alert.daysLeft === 0) return 'Vence hoje'
  return `Vence em ${alert.daysLeft}d`
}

export default function AlertsPanel({ alerts }) {
  if (alerts.length === 0) {
    return (
      <div className="surface-card p-5">
        <h3 className="label-eyebrow mb-1">Alertas</h3>
        <p className="mt-3 text-[13px] text-mist-400">Tudo em dia. Nenhuma pendência no momento.</p>
      </div>
    )
  }

  return (
    <div className="surface-card p-5">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="label-eyebrow">Alertas</h3>
        <span className="rounded-full bg-ruby-500/10 px-2 py-0.5 text-[11px] font-semibold text-ruby-400">
          {alerts.length}
        </span>
      </div>
      <ul className="mt-3 flex flex-col divide-y divide-ink-700">
        {alerts.slice(0, 6).map((alert) => {
          const Icon = ICONS[alert.type] ?? FileWarning
          return (
            <li key={alert.id} className="flex items-center gap-3 py-2.5">
              <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', SEVERITY_STYLE[alert.severity])}>
                <Icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-mist-100">{alert.title}</p>
                <p className="truncate text-[11.5px] text-mist-400">{alert.subtitle}</p>
              </div>
              <span className={clsx('shrink-0 text-[11px] font-medium', SEVERITY_STYLE[alert.severity]?.split(' ')[0])}>
                {severityText(alert)}
              </span>
            </li>
          )
        })}
      </ul>
      {alerts.length > 6 && (
        <Link
          to="/frota"
          className="mt-3 flex items-center justify-center gap-1 rounded-lg py-2 text-[12.5px] font-medium text-gold-400 transition-colors hover:bg-ink-700"
        >
          Ver todos os alertas <ChevronRight size={13} />
        </Link>
      )}
    </div>
  )
}
