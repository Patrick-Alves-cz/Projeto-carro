import { daysUntil } from './formatters'

const THRESHOLD_DAYS = 30

function pushIfExpiring(list, { id, type, title, subtitle, dateISO, severity }) {
  const diff = daysUntil(dateISO)
  if (diff === null) return
  if (diff <= THRESHOLD_DAYS) {
    list.push({
      id,
      type,
      title,
      subtitle,
      dueDate: dateISO,
      daysLeft: diff,
      severity: diff < 0 ? 'critical' : diff <= 7 ? 'high' : 'medium',
    })
  }
}

/**
 * buildAlerts — scans the whole dataset for anything that needs attention:
 * insurance/IPVA/CNH expiring, contracts ending soon, vehicles stuck in
 * maintenance. Returned list is pre-sorted, most urgent first.
 */
export function buildAlerts({ vehicles = [], clients = [], rentals = [] }) {
  const alerts = []

  vehicles.forEach((v) => {
    pushIfExpiring(alerts, {
      id: `insurance-${v.id}`,
      type: 'seguro',
      title: 'Seguro vencendo',
      subtitle: `${v.brand} ${v.model} · ${v.plate}`,
      dateISO: v.insuranceExpiry,
    })
    pushIfExpiring(alerts, {
      id: `licensing-${v.id}`,
      type: 'ipva',
      title: 'IPVA/Licenciamento vencendo',
      subtitle: `${v.brand} ${v.model} · ${v.plate}`,
      dateISO: v.licensingExpiry,
    })
    if (v.status === 'manutencao') {
      alerts.push({
        id: `maintenance-${v.id}`,
        type: 'manutencao',
        title: 'Veículo em manutenção',
        subtitle: `${v.brand} ${v.model} · ${v.plate}`,
        dueDate: null,
        daysLeft: null,
        severity: 'medium',
      })
    }
  })

  clients.forEach((c) => {
    pushIfExpiring(alerts, {
      id: `cnh-${c.id}`,
      type: 'cnh',
      title: 'CNH vencendo',
      subtitle: c.name,
      dateISO: c.cnhExpiry,
    })
  })

  rentals
    .filter((r) => r.status === 'ativa')
    .forEach((r) => {
      pushIfExpiring(alerts, {
        id: `contract-${r.id}`,
        type: 'contrato',
        title: 'Contrato terminando',
        subtitle: 'Locação ativa',
        dateISO: r.returnDate,
      })
    })

  const severityWeight = { critical: 0, high: 1, medium: 2 }
  return alerts.sort((a, b) => (severityWeight[a.severity] ?? 3) - (severityWeight[b.severity] ?? 3))
}
