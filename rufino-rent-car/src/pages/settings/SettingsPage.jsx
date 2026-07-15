import { useState } from 'react'
import { Building2, Save, Download, Upload, DatabaseZap, ShieldCheck } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import { storageAdapter } from '../../services/storageAdapter'

export default function SettingsPage() {
  const { settings, updateSettings } = useData()
  const toast = useToast()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await updateSettings(form)
    setSaving(false)
    toast.success('Configurações salvas com sucesso')
  }

  async function handleExportBackup() {
    const payload = await storageAdapter.exportAll()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-rufino-rent-car-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exportado com sucesso')
  }

  function handleImportClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const payload = JSON.parse(text)
        await storageAdapter.importAll(payload)
        toast.success('Backup restaurado com sucesso', { description: 'Recarregue o sistema para ver os dados atualizados.' })
      } catch {
        toast.error('Não foi possível ler o arquivo de backup')
      }
    }
    input.click()
  }

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Dados da empresa, preferências e backup" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="label-eyebrow mb-4 flex items-center gap-1.5"><Building2 size={13} /> Dados da empresa</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa">
              <input value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="input" />
            </Field>
            <Field label="Proprietário">
              <input value={form.ownerName} onChange={(e) => handleChange('ownerName', e.target.value)} className="input" />
            </Field>
            <Field label="CNPJ">
              <input value={form.cnpj} onChange={(e) => handleChange('cnpj', e.target.value)} className="input" placeholder="00.000.000/0000-00" />
            </Field>
            <Field label="Telefone">
              <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="input" placeholder="(66) 90000-0000" />
            </Field>
            <Field label="E-mail">
              <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="input" placeholder="contato@rufinorentcar.com.br" />
            </Field>
            <Field label="Endereço">
              <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="input" placeholder="Rondonópolis, MT" />
            </Field>
          </div>
          <div className="mt-5">
            <Button icon={Save} loading={saving} onClick={handleSave}>Salvar alterações</Button>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="label-eyebrow mb-4 flex items-center gap-1.5"><DatabaseZap size={13} /> Backup dos dados</h3>
          <p className="text-[12.5px] leading-relaxed text-mist-400">
            Todos os dados ficam salvos localmente neste computador. Exporte um backup regularmente
            para não perder informações e para facilitar a futura migração para banco de dados online.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Button variant="secondary" icon={Download} onClick={handleExportBackup}>Exportar backup (.json)</Button>
            <Button variant="secondary" icon={Upload} onClick={handleImportClick}>Restaurar backup</Button>
          </div>

          <div className="divider-gold my-4" />

          <div className="flex items-start gap-2.5 rounded-lg bg-ink-800/60 p-3">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-400" />
            <p className="text-[11.5px] leading-relaxed text-mist-400">
              Arquitetura preparada para migração futura: login, banco de dados online e versão
              instalável (.exe), sem perda de dados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-mist-300">{label}</span>
      {children}
    </label>
  )
}
