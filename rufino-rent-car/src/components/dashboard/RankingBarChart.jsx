import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ChartTooltip from './ChartTooltip'

export default function RankingBarChart({ data, dataKey, name, valueFormatter, color = '#C9A961' }) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-[13px] text-mist-400">
        Sem dados suficientes ainda.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#212127" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#75757F', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={110}
          tick={{ fill: '#B4B4BC', fontSize: 11.5 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={valueFormatter} />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey={dataKey} name={name} radius={[0, 6, 6, 0]} maxBarSize={18}>
          {data.map((entry, i) => (
            <Cell key={entry.vehicleId ?? i} fill={color} fillOpacity={1 - i * 0.13} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
