import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Car, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import Modal from '../ui/Modal.jsx'
import FormField from '../ui/FormField.jsx'
import Button from '../ui/Button.jsx'
import { VEHICLE_CATEGORIES, VEHICLE_STATUSES } from '../../utils/constants'
import { formatPlate } from '../../utils/formatters'

const EMPTY_VALUES = {
  photo: '',
  brand: '',
  model: '',
  version: '',
  year: new Date().getFullYear(),
  color: '',
  plate: '',
  renavam: '',
  chassis: '',
  purchaseValue: '',
  purchaseDate: '',
  mileage: 0,
  category: 'hatch',
  status: 'disponivel',
  insuranceExpiry: '',
  licensingExpiry: '',
  notes: '',
}

function toDateInput(iso) {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export default function VehicleFormModal({ open, onClose, vehicle, onSubmit }) {
  const isEditing = Boolean(vehicle)
  const fileInputRef = useRef(null)
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
        vehicle
          ? {
              ...EMPTY_VALUES,
              ...vehicle,
              purchaseDate: toDateInput(vehicle.purchaseDate),
              insuranceExpiry: toDateInput(vehicle.insuranceExpiry),
              licensingExpiry: toDateInput(vehicle.licensingExpiry),
            }
          : EMPTY_VALUES
      )
    }
  }, [open, vehicle, reset])

  const photo = watch('photo')

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      alert('A imagem deve ter até 3MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setValue('photo', reader.result)
    reader.readAsDataURL(file)
  }

  async function submit(values) {
    setSaving(true)
    try {
      await onSubmit({
        ...values,
        year: Number(values.year),
        purchaseValue: Number(values.purchaseValue) || 0,
        mileage: Number(values.mileage) || 0,
        plate: formatPlate(values.plate),
        purchaseDate: values.purchaseDate ? new Date(values.purchaseDate).toISOString() : '',
        insuranceExpiry: values.insuranceExpiry ? new Date(values.insuranceExpiry).toISOString() : '',
        licensingExpiry: values.licensingExpiry ? new Date(values.licensingExpiry).toISOString() : '',
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
      size="lg"
      title={isEditing ? 'Editar veículo' : 'Novo veículo'}
      subtitle={isEditing ? `${vehicle.brand} ${vehicle.model} · ${vehicle.plate}` : 'Cadastre um veículo na frota'}
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-800">
            {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : <Car size={24} className="text-mist-500" />}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <Button type="button" variant="secondary" size="sm" icon={Camera} onClick={() => fileInputRef.current?.click()}>
              {photo ? 'Trocar foto' : 'Adicionar foto'}
            </Button>
            <p className="mt-1.5 text-[11px] text-mist-400">JPG ou PNG, até 3MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Marca" required error={errors.brand && 'Informe a marca'}>
            <input className="input" placeholder="Chevrolet" {...register('brand', { required: true })} />
          </FormField>
          <FormField label="Modelo" required error={errors.model && 'Informe o modelo'}>
            <input className="input" placeholder="Onix" {...register('model', { required: true })} />
          </FormField>
          <FormField label="Versão">
            <input className="input" placeholder="LT 1.0 Turbo" {...register('version')} />
          </FormField>
          <FormField label="Ano" required error={errors.year && 'Informe o ano'}>
            <input type="number" className="input" {...register('year', { required: true })} />
          </FormField>
          <FormField label="Cor">
            <input className="input" placeholder="Branco" {...register('color')} />
          </FormField>
          <FormField label="Placa" required error={errors.plate && 'Informe a placa'}>
            <input className="input font-mono uppercase" placeholder="ABC1D23" maxLength={7} {...register('plate', { required: true })} />
          </FormField>
          <FormField label="RENAVAM">
            <input className="input font-mono" {...register('renavam')} />
          </FormField>
          <FormField label="Chassi">
            <input className="input font-mono" {...register('chassis')} />
          </FormField>
          <FormField label="Categoria" required>
            <select className="input" {...register('category')}>
              {VEHICLE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status" required>
            <select className="input" {...register('status')}>
              {VEHICLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Quilometragem">
            <input type="number" className="input" {...register('mileage')} />
          </FormField>
          <FormField label="Valor de compra">
            <input type="number" step="0.01" className="input" {...register('purchaseValue')} />
          </FormField>
          <FormField label="Data da compra">
            <input type="date" className="input" {...register('purchaseDate')} />
          </FormField>
          <FormField label="Seguro vence em">
            <input type="date" className="input" {...register('insuranceExpiry')} />
          </FormField>
          <FormField label="IPVA/Licenciamento vence em" className="sm:col-span-2">
            <input type="date" className="input" {...register('licensingExpiry')} />
          </FormField>
        </div>

        <FormField label="Observações">
          <textarea rows={3} className="input h-auto resize-none py-2.5" {...register('notes')} />
        </FormField>

        <div className="flex justify-end gap-2.5 border-t border-ink-700 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={saving} icon={saving ? Loader2 : undefined}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar veículo'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
