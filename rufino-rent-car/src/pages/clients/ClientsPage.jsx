import { useMemo, useState } from 'react'
import { Users, Search, Plus, Trash2, Phone, Pencil } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useConfirm } from '../../contexts/ConfirmContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ClientFormModal from '../../components/clients/ClientFormModal.jsx'
import { useHotkey } from '../../hooks/useHotkey.js'
import { formatDate, initials } from '../../utils/formatters'

export default function ClientsPage() {
  const { clients, addClient, editClient, deleteClient } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) =>
      [c.name, c.cpf, c.phone, c.whatsapp, c.email].some((f) => (f || '').toLowerCase().includes(q))
    )
  }, [clients, query])

  function openCreate() {
    setEditingClient(null)
    setFormOpen(true)
  }

  useHotkey('n', openCreate, { enabled: !formOpen })

  function openEdit(client) {
    setEditingClient(client)
    setFormOpen(true)
  }

  async function handleDelete(client) {
    const ok = await confirm({
      title: 'Excluir cliente?',
      description: `${client.name} será removido permanentemente do cadastro.`,
    })
    if (!ok) return
    await deleteClient(client.id)
    toast.success('Cliente excluído com sucesso')
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} clientes cadastrados`}
        actions={<Button icon={Plus} onClick={openCreate}>Novo cliente</Button>}
      />

      <div className="mb-5 flex h-9 max-w-md items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3">
        <Search size={14} className="text-mist-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, CPF, telefone ou e-mail..."
          className="h-full w-full bg-transparent text-[13px] text-mist-100 placeholder:text-mist-400 focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente encontrado"
          description="Ajuste a busca ou cadastre um novo cliente."
          action={<Button icon={Plus} onClick={openCreate}>Cadastrar cliente</Button>}
        />
      ) : (
        <div className="surface-card overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-800/60 text-[11px] uppercase tracking-wide text-mist-400">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">CPF</th>
                <th className="px-5 py-3 font-medium">Contato</th>
                <th className="px-5 py-3 font-medium">CNH válida até</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-[11px] font-bold text-gold-400">
                        {initials(c.name)}
                      </span>
                      <div>
                        <p className="font-medium text-mist-100">{c.name}</p>
                        <p className="text-[11.5px] text-mist-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-mist-300">{c.cpf}</td>
                  <td className="px-5 py-3 text-mist-300">
                    <span className="flex items-center gap-1.5"><Phone size={12} /> {c.whatsapp || c.phone}</span>
                  </td>
                  <td className="px-5 py-3 text-mist-300">{formatDate(c.cnhExpiry)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ink-700 hover:text-mist-100"
                        aria-label="Editar cliente"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ruby-500/10 hover:text-ruby-400"
                        aria-label="Excluir cliente"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ClientFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        client={editingClient}
        onSubmit={async (data) => {
          if (editingClient) {
            await editClient(editingClient.id, data)
            toast.success('Cliente atualizado com sucesso')
          } else {
            await addClient(data)
            toast.success('Cliente cadastrado com sucesso')
          }
        }}
      />
    </div>
  )
}
