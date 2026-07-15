import { formatCurrency } from '../../utils/formatters'

export default function ChartTooltip({ active, payload, label, valueFormatter = formatCurrency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-3.5 py-2.5 shadow-card-hover">
      {label && <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-mist-400">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey ?? entry.name} className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color || entry.fill }} />
            <span className="text-mist-300">{entry.name}:</span>
            <span className="font-mono font-medium tabular text-mist-50">{valueFormatter(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
