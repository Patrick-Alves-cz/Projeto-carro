import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { labelFor, EXPENSE_CATEGORIES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'

const PALETTE = ['#C9A961', '#3FA772', '#3F7FC9', '#C9524F', '#DBC17F', '#57C08A', '#5B9BE0', '#E17471', '#93939C']

export default function ExpensesByCategoryChart({ data }) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-[13px] text-mist-400">
        Nenhuma despesa registrada neste período.
      </div>
    )
  }

  const chartData = data.map((d) => ({ name: labelFor(EXPENSE_CATEGORIES, d.category), value: d.value }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="46%"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={2}
          stroke="#0E0E11"
          strokeWidth={2}
        >
          {chartData.map((entry, i) => (
            <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip valueFormatter={formatCurrency} />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-[11.5px] text-mist-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
