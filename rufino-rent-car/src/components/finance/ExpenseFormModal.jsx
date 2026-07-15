import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../ui/Modal.jsx'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import { useData } from '../../contexts/DataContext.jsx'
import { EXPENSE_CATEGORIES } from '../../utils/constants'

const EMPTY_VALUES = {
  description: '',
  category: 'combustivel',
  value: '',
  date: '',
  vehicleId: '',
  notes: '',
}

function toDateInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function ExpenseFormModal({ open, onClose, expense, onSubmit }) {
  const { vehicles } = useData()
  const isEditing = Boolean(expense)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (open) {
      reset(
        expense
          ? { ...EMPTY_VALUES, ...expense, date: toDateInput(expense.date), vehicleId: expense.vehicleId ?? '' }
          : EMPTY_VALUES
      )
    }
  }, [open, expense, reset])

  async function submit(values) {
    setSaving(true)
    try {
      await onSubmit({
        ...values,
        value: Number(values.value) || 0,
        vehicleId: values.vehicleId || null,
        date: values.date ? new Date(values.date).toISOString() : '',
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
      size="sm"
      title={isEditing ? 'Editar despesa' : 'Nova despesa'}
      subtitle="Lance um gasto da locadora"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <FormField label="Descrição" required error={errors.description && 'Informe a descrição'}>
          <input className="input" placeholder="Troca de óleo" {...register('description', { required: true })} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Categoria" required>
            <select className="input" {...register('category')}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Valor" required error={errors.value && 'Informe o valor'}>
            <input type="number" step="0.01" className="input" placeholder="150.00" {...register('value', { required: true })} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Data" required error={errors.date && 'Informe a data'}>
            <input type="date" className="input" {...register('date', { required: true })} />
          </FormField>
          <FormField label="Veículo vinculado">
            <select className="input" {...register('vehicleId')}>
              <option value="">Nenhum (geral)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.brand} {v.model} · {v.plate}</option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Observações">
          <textarea rows={2} className="input h-auto resize-none py-2.5" {...register('notes')} />
        </FormField>

        <div className="flex justify-end gap-2.5 border-t border-ink-700 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving}>{isEditing ? 'Salvar alterações' : 'Lançar despesa'}</Button>
        </div>
      </form>
    </Modal>
  )
}
