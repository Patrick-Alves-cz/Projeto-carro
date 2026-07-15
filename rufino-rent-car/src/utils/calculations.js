import { parseISO, isSameMonth, isSameYear, isWithinInterval, format } from 'date-fns'
import { daysBetween } from './formatters'

const now = () => new Date()

export function sum(list, picker) {
  return list.reduce((acc, item) => acc + (Number(picker(item)) || 0), 0)
}

/** Revenue recognized for a rental — realized (finalizada) or accruing (ativa). */
export function rentalRevenue(rental) {
  if (rental.status === 'cancelada' || rental.status === 'pendente') return 0
  return Number(rental.totalValue) || 0
}

export function monthRevenue(rentals, date = now()) {
  return sum(
    rentals.filter((r) => r.createdAt && isSameMonth(parseISO(r.createdAt), date) && isSameYear(parseISO(r.createdAt), date)),
    rentalRevenue
  )
}

export function yearRevenue(rentals, date = now()) {
  return sum(
    rentals.filter((r) => r.createdAt && isSameYear(parseISO(r.createdAt), date)),
    rentalRevenue
  )
}

export function monthExpenses(expenses, date = now()) {
  return sum(
    expenses.filter((e) => e.date && isSameMonth(parseISO(e.date), date) && isSameYear(parseISO(e.date), date)),
    (e) => e.value
  )
}

export function yearExpenses(expenses, date = now()) {
  return sum(
    expenses.filter((e) => e.date && isSameYear(parseISO(e.date), date)),
    (e) => e.value
  )
}

export function fleetCounts(vehicles) {
  return {
    total: vehicles.length,
    disponivel: vehicles.filter((v) => v.status === 'disponivel').length,
    alugado: vehicles.filter((v) => v.status === 'alugado').length,
    manutencao: vehicles.filter((v) => v.status === 'manutencao').length,
    reservado: vehicles.filter((v) => v.status === 'reservado').length,
  }
}

/** Last N months as {key, label, date} — used to build chart x-axes. */
export function lastMonths(n = 6, reference = now()) {
  const months = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(reference.getFullYear(), reference.getMonth() - i, 1)
    months.push({ key: format(d, 'yyyy-MM'), label: format(d, 'MMM'), date: d })
  }
  return months
}

export function monthlyRevenueSeries(rentals, months = 6) {
  const range = lastMonths(months)
  return range.map(({ key, label, date }) => ({
    month: label,
    receita: sum(
      rentals.filter((r) => r.createdAt && format(parseISO(r.createdAt), 'yyyy-MM') === key),
      rentalRevenue
    ),
    key,
  }))
}

export function monthlyExpenseSeries(expenses, months = 6) {
  const range = lastMonths(months)
  return range.map(({ key, label }) => ({
    month: label,
    despesa: sum(
      expenses.filter((e) => e.date && format(parseISO(e.date), 'yyyy-MM') === key),
      (e) => e.value
    ),
    key,
  }))
}

export function monthlyProfitSeries(rentals, expenses, months = 6) {
  const rev = monthlyRevenueSeries(rentals, months)
  const exp = monthlyExpenseSeries(expenses, months)
  return rev.map((r, i) => ({
    month: r.month,
    lucro: r.receita - (exp[i]?.despesa ?? 0),
  }))
}

export function expensesByCategory(expenses, date = now(), scope = 'month') {
  const filtered = expenses.filter((e) => {
    if (!e.date) return false
    const d = parseISO(e.date)
    return scope === 'month' ? isSameMonth(d, date) && isSameYear(d, date) : isSameYear(d, date)
  })
  const grouped = {}
  filtered.forEach((e) => {
    grouped[e.category] = (grouped[e.category] || 0) + Number(e.value || 0)
  })
  return Object.entries(grouped)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
}

export function mostRentedVehicles(rentals, vehicles, limit = 5) {
  const counts = {}
  rentals.forEach((r) => {
    if (r.status === 'cancelada') return
    counts[r.vehicleId] = (counts[r.vehicleId] || 0) + 1
  })
  return Object.entries(counts)
    .map(([vehicleId, count]) => {
      const v = vehicles.find((veh) => veh.id === vehicleId)
      return {
        vehicleId,
        label: v ? `${v.brand} ${v.model}` : 'Veículo removido',
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function revenueByVehicle(rentals, vehicles, limit = 5) {
  const totals = {}
  rentals.forEach((r) => {
    totals[r.vehicleId] = (totals[r.vehicleId] || 0) + rentalRevenue(r)
  })
  return Object.entries(totals)
    .map(([vehicleId, value]) => {
      const v = vehicles.find((veh) => veh.id === vehicleId)
      return {
        vehicleId,
        label: v ? `${v.brand} ${v.model}` : 'Veículo removido',
        value,
      }
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
}

/** Full financial + usage profile for a single vehicle — powers the vehicle detail page. */
export function vehicleProfile(vehicle, rentals, expenses) {
  const vehicleRentals = rentals.filter((r) => r.vehicleId === vehicle.id && r.status !== 'cancelada')
  const vehicleExpenses = expenses.filter((e) => e.vehicleId === vehicle.id)

  const totalRevenue = sum(vehicleRentals, rentalRevenue)
  const totalExpenseValue = sum(vehicleExpenses, (e) => e.value)
  const rentalCount = vehicleRentals.length

  const daysRented = sum(vehicleRentals, (r) => {
    const end = r.actualReturnDate || r.returnDate
    return daysBetween(r.pickupDate, end)
  })

  const daysSincePurchase = vehicle.purchaseDate ? daysBetween(vehicle.purchaseDate, new Date().toISOString()) : 0
  const daysIdle = Math.max(0, daysSincePurchase - daysRented)

  const avgTicket = rentalCount > 0 ? totalRevenue / rentalCount : 0
  const netProfit = totalRevenue - totalExpenseValue
  const roi = vehicle.purchaseValue > 0 ? (netProfit / vehicle.purchaseValue) * 100 : 0

  const expenseBreakdown = {}
  vehicleExpenses.forEach((e) => {
    expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + Number(e.value || 0)
  })

  return {
    totalRevenue,
    totalExpenses: totalExpenseValue,
    netProfit,
    roi,
    rentalCount,
    daysRented,
    daysIdle,
    avgTicket,
    expenseBreakdown,
  }
}

export function isExpiringSoon(dateISO, thresholdDays = 30) {
  if (!dateISO) return false
  const target = parseISO(dateISO)
  const diff = Math.ceil((target - now()) / (1000 * 60 * 60 * 24))
  return diff <= thresholdDays
}

export function isWithinDateRange(dateISO, start, end) {
  if (!dateISO || !start || !end) return true
  try {
    return isWithinInterval(parseISO(dateISO), { start: parseISO(start), end: parseISO(end) })
  } catch {
    return true
  }
}
