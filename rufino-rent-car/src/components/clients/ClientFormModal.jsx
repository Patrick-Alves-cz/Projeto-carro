import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../ui/Modal.jsx'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import { formatCPF, formatPhone } from '../../utils/formatters'

const EMPTY_VALUES = {
  name: '',
  cpf: '',
  rg: '',
  cnh: '',
  cnhExpiry: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  notes: '',
}

function toDateInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function ClientFormModal({ open, onClose, client, onSubmit }) {
  const isEditing = Boolean(client)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (open) {
      reset(
        client
          ? { ...EMPTY_VALUES, ...client, cnhExpiry: toDateInput(client.cnhExpiry) }
          : EMPTY_VALUES
      )
    }
  }, [open, client, reset])

  const cpf = watch('cpf')
  const phone = watch('phone')
  const whatsapp = watch('whatsapp')

  async function submit(values) {
    setSaving(true)
    try {
      await onSubmit({
        ...values,
        cnhExpiry: values.cnhExpiry ? new Date(values.cnhExpiry).toISOString() : '',
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
      title={isEditing ? 'Editar cliente' : 'Novo cliente'}
      subtitle={isEditing ? client.name : 'Cadastre um novo cliente'}
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <FormField label="Nome completo" required error={errors.name && 'Informe o nome'}>
          <input className="input" placeholder="Carlos Eduardo Silva" {...register('name', { required: true })} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="CPF" required error={errors.cpf && 'Informe o CPF'}>
            <input
              className="input font-mono"
              placeholder="000.000.000-00"
              value={cpf}
              maxLength={14}
              {...register('cpf', { required: true, onChange: (e) => setValue('cpf', formatCPF(e.target.value)) })}
            />
          </FormField>
          <FormField label="RG">
            <input className="input font-mono" {...register('rg')} />
          </FormField>
          <FormField label="CNH">
            <input className="input font-mono" {...register('cnh')} />
          </FormField>
          <FormField label="Validade da CNH">
            <input type="date" className="input" {...register('cnhExpiry')} />
          </FormField>
          <FormField label="Telefone">
            <input
              className="input font-mono"
              placeholder="(66) 90000-0000"
              value={phone}
              maxLength={16}
              {...register('phone', { onChange: (e) => setValue('phone', formatPhone(e.target.value)) })}
            />
          </FormField>
          <FormField label="WhatsApp">
            <input
              className="input font-mono"
              placeholder="(66) 90000-0000"
              value={whatsapp}
              maxLength={16}
              {...register('whatsapp', { onChange: (e) => setValue('whatsapp', formatPhone(e.target.value)) })}
            />
          </FormField>
        </div>

        <FormField label="E-mail">
          <input type="email" className="input" placeholder="cliente@email.com" {...register('email')} />
        </FormField>

        <FormField label="Endereço">
          <input className="input" placeholder="Rua, número, bairro, cidade" {...register('address')} />
        </FormField>

        <FormField label="Observações">
          <textarea rows={3} className="input h-auto resize-none py-2.5" {...register('notes')} />
        </FormField>

        <div className="flex justify-end gap-2.5 border-t border-ink-700 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving}>{isEditing ? 'Salvar alterações' : 'Cadastrar cliente'}</Button>
        </div>
      </form>
    </Modal>
  )
}
