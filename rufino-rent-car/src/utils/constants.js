export const VEHICLE_CATEGORIES = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatch', label: 'Hatch' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'popular', label: 'Popular' },
  { value: 'utilitario', label: 'Utilitário' },
]

export const VEHICLE_STATUSES = [
  { value: 'disponivel', label: 'Disponível', color: 'emerald' },
  { value: 'alugado', label: 'Alugado', color: 'gold' },
  { value: 'manutencao', label: 'Manutenção', color: 'ruby' },
  { value: 'reservado', label: 'Reservado', color: 'azure' },
]

export const RENTAL_STATUSES = [
  { value: 'pendente', label: 'Pendente', color: 'azure' },
  { value: 'ativa', label: 'Ativa', color: 'gold' },
  { value: 'finalizada', label: 'Finalizada', color: 'emerald' },
  { value: 'cancelada', label: 'Cancelada', color: 'ruby' },
]

export const PAYMENT_METHODS = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartao_credito', label: 'Cartão de crédito' },
  { value: 'cartao_debito', label: 'Cartão de débito' },
  { value: 'transferencia', label: 'Transferência' },
]

export const EXPENSE_CATEGORIES = [
  { value: 'seguro', label: 'Seguro' },
  { value: 'combustivel', label: 'Combustível' },
  { value: 'ipva', label: 'IPVA' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'pecas', label: 'Peças' },
  { value: 'pneus', label: 'Pneus' },
  { value: 'lavagem', label: 'Lavagem' },
  { value: 'multas', label: 'Multas' },
  { value: 'outros', label: 'Outros' },
]

export function labelFor(list, value) {
  return list.find((i) => i.value === value)?.label ?? value
}

export function colorFor(list, value) {
  return list.find((i) => i.value === value)?.color ?? 'mist'
}
