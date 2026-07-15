import clsx from 'clsx'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function KpiCard({ icon: Icon, label, value, trend, tone = 'gold', suffix }) {
  const isPositive = typeof trend === 'number' && trend >= 0
  const toneClasses = {
    gold: 'text-gold-400 bg-gold-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    ruby: 'text-ruby-400 bg-ruby-500/10',
    azure: 'text-azure-400 bg-azure-500/10',
    mist: 'text-mist-200 bg-ink-700',
  }

  return (
    <div className="surface-card-interactive p-5">
      <div className="flex items-start justify-between">
        <div className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', toneClasses[tone])}>
          {Icon && <Icon size={17} />}
        </div>
        {typeof trend === 'number' && (
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-ruby-500/10 text-ruby-400'
            )}
          >
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-[22px] font-semibold leading-none tabular text-mist-50">
        {value}
        {suffix && <span className="ml-1 text-[13px] font-normal text-mist-400">{suffix}</span>}
      </p>
      <p className="mt-1.5 text-[12.5px] text-mist-400">{label}</p>
    </div>
  )
}
