import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../ui/Modal.jsx'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import { useData } from '../../contexts/DataContext.jsx'
import { PAYMENT_METHODS, RENTAL_STATUSES } from '../../utils/constants'
import { formatCurrency, daysBetween } from '../../utils/formatters'

const EMPTY_VALUES = {
  clientId: '',
  vehicleId: '',
  pickupDate: '',
  returnDate: '',
  dailyRate: '',
  paymentMethod: 'pix',
  status: 'ativa',
  notes: '',
}

function toDateInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function RentalFormModal({ open, onClose, rental, onSubmit }) {
  const { clients, vehicles } = useData()
  const isEditing = Boolean(rental)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (open) {
      reset(
        rental
          ? {
              ...EMPTY_VALUES,
              ...rental,
              pickupDate: toDateInput(rental.pickupDate),
              returnDate: toDateInput(rental.returnDate),
            }
          : EMPTY_VALUES
      )
    }
  }, [open, rental, reset])

  const pickupDate = watch('pickupDate')
  const returnDate = watch('returnDate')
  const dailyRate = Number(watch('dailyRate')) || 0
  const vehicleId = watch('vehicleId')

  const days = useMemo(() => {
    if (!pickupDate || !returnDate) return 0
    return Math.max(1, daysBetween(new Date(pickupDate).toISOString(), new Date(returnDate).toISOString()))
  }, [pickupDate, returnDate])

  const totalValue = days * dailyRate

  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'disponivel' || v.id === rental?.vehicleId || v.id === vehicleId)
  }, [vehicles, rental, vehicleId])

  async function submit(values) {
    setSaving(true)
    try {
      await onSubmit({
        ...values,
        dailyRate: Number(values.dailyRate) || 0,
        days,
        totalValue,
        pickupDate: values.pickupDate ? new Date(values.pickupDate).toISOString() : '',
        returnDate: values.returnDate ? new Date(values.returnDate).toISOString() : '',
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isEditing ? 'Editar locação' : 'Nova locação'}
      subtitle="Selecione cliente, veículo e período"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Cliente" required error={errors.clientId && 'Selecione um cliente'}>
            <select className="input" {...register('clientId', { required: true })}>
              <option value="">Selecione...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Veículo" required error={errors.vehicleId && 'Selecione um veículo'}>
            <select className="input" {...register('vehicleId', { required: true })}>
              <option value="">Selecione...</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} · {v.plate}</option>
              ))}
            </select>
            {availableVehicles.length === 0 && (
              <p className="mt-1 text-[11px] text-amber-400">Nenhum veículo disponível no momento.</p>
            )}
          </FormField>
          <FormField label="Data de retirada" required error={errors.pickupDate && 'Informe a retirada'}>
            <input type="date" className="input" {...register('pickupDate', { required: true })} />
          </FormField>
          <FormField label="Data de devolução" required error={errors.returnDate && 'Informe a devolução'}>
            <input type="date" className="input" {...register('returnDate', { required: true })} />
          </FormField>
          <FormField label="Valor da diária" required error={errors.dailyRate && 'Informe o valor'}>
            <input type="number" step="0.01" className="input" placeholder="150.00" {...register('dailyRate', { required: true })} />
          </FormField>
          <FormField label="Forma de pagamento">
            <select className="input" {...register('paymentMethod')}>
              {PAYMENT_METHODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" className="sm:col-span-2">
            <select className="input" {...register('status')}>
              {RENTAL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-ink-800/60 px-4 py-3">
          <div>
            <p className="text-[11.5px] text-mist-400">{days} {days === 1 ? 'diária' : 'diárias'} × {formatCurrency(dailyRate)}</p>
            <p className="text-[11px] text-mist-500">Valor calculado automaticamente</p>
          </div>
          <p className="font-mono text-[17px] font-semibold text-gold-400">{formatCurrency(totalValue)}</p>
        </div>

        <FormField label="Observações">
          <textarea rows={2} className="input h-auto resize-none py-2.5" {...register('notes')} />
        </FormField>

        <div className="flex justify-end gap-2.5 border-t border-ink-700 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving}>{isEditing ? 'Salvar alterações' : 'Registrar locação'}</Button>
        </div>
      </form>
    </Modal>
  )
}
