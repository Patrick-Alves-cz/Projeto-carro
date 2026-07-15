import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatCurrency(value) {
  const n = Number(value) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatCompactCurrency(value) {
  const n = Number(value) || 0
  if (Math.abs(n) >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toFixed(1)}mil`
  return formatCurrency(n)
}

export function formatDate(value, pattern = 'dd/MM/yyyy') {
  if (!value) return '—'
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return '—'
  return format(date, pattern, { locale: ptBR })
}

export function formatDateTime(value) {
  return formatDate(value, "dd/MM/yyyy 'às' HH:mm")
}

export function formatMonthLabel(value) {
  return formatDate(value, 'MMM/yy')
}

export function daysBetween(startISO, endISO) {
  if (!startISO || !endISO) return 0
  const start = parseISO(startISO)
  const end = parseISO(endISO)
  if (!isValid(start) || !isValid(end)) return 0
  return Math.max(0, differenceInCalendarDays(end, start))
}

export function daysUntil(dateISO) {
  if (!dateISO) return null
  const target = parseISO(dateISO)
  if (!isValid(target)) return null
  return differenceInCalendarDays(target, new Date())
}

export function formatCPF(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatPhone(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export function formatPlate(value) {
  return (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

export function formatMileage(value) {
  const n = Number(value) || 0
  return `${n.toLocaleString('pt-BR')} km`
}

export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}
