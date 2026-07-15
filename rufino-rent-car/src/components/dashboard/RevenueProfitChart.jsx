import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatCompactCurrency } from '../../utils/formatters'

export default function RevenueProfitChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A961" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3FA772" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#3FA772" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#212127" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#75757F', fontSize: 11.5 }}
          axisLine={{ stroke: '#212127' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#75757F', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCompactCurrency}
          width={64}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3D3D46', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="receita"
          name="Receita"
          stroke="#C9A961"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
        <Area
          type="monotone"
          dataKey="lucro"
          name="Lucro"
          stroke="#3FA772"
          strokeWidth={2}
          fill="url(#profitFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
