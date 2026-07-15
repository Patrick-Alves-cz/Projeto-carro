import { useMemo, useState } from 'react'
import { Wallet, Search, Plus, Trash2, Pencil, TrendingUp, TrendingDown, Scale } from 'lucide-react'
import { useData } from '../../contexts/DataContext.jsx'
import { useConfirm } from '../../contexts/ConfirmContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import PageHeader from '../../components/ui/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ExpenseFormModal from '../../components/finance/ExpenseFormModal.jsx'
import { useHotkey } from '../../hooks/useHotkey.js'
import { EXPENSE_CATEGORIES, labelFor } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { sum, rentalRevenue } from '../../utils/calculations'

export default function FinancePage() {
  const { rentals, expenses, vehicles, addExpense, editExpense, deleteExpense } = useData()
  const confirm = useConfirm()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('despesas')
  const [formOpen, setFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const totalRevenue = useMemo(() => sum(rentals, rentalRevenue), [rentals])
  const totalExpenses = useMemo(() => sum(expenses, (e) => e.value), [expenses])
  const netProfit = totalRevenue - totalExpenses

  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase()
    return expenses
      .filter((e) => !q || e.description.toLowerCase().includes(q) || labelFor(EXPENSE_CATEGORIES, e.category).toLowerCase().includes(q))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, query])

  const finishedRentals = useMemo(
    () => rentals.filter((r) => r.status === 'finalizada' || r.status === 'ativa').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [rentals]
  )

  function openCreate() {
    setEditingExpense(null)
    setFormOpen(true)
  }

  useHotkey('n', openCreate, { enabled: !formOpen })

  function openEdit(expense) {
    setEditingExpense(expense)
    setFormOpen(true)
  }

  async function handleDeleteExpense(expense) {
    const ok = await confirm({
      title: 'Excluir despesa?',
      description: `"${expense.description}" será removida permanentemente.`,
    })
    if (!ok) return
    await deleteExpense(expense.id)
    toast.success('Despesa excluída com sucesso')
  }

  return (
    <div>
      <PageHeader
        title="Financeiro"
        subtitle="Receitas, despesas e fluxo de caixa da locadora"
        actions={<Button icon={Plus} onClick={openCreate}>Nova despesa</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><TrendingUp size={16} /></div>
          <p className="mt-3 font-mono text-[19px] font-semibold text-mist-50">{formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Receita total</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ruby-500/10 text-ruby-400"><TrendingDown size={16} /></div>
          <p className="mt-3 font-mono text-[19px] font-semibold text-mist-50">{formatCurrency(totalExpenses)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Despesa total</p>
        </div>
        <div className="surface-card p-5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${netProfit >= 0 ? 'bg-gold-500/10 text-gold-400' : 'bg-ruby-500/10 text-ruby-400'}`}><Scale size={16} /></div>
          <p className={`mt-3 font-mono text-[19px] font-semibold ${netProfit >= 0 ? 'text-mist-50' : 'text-ruby-400'}`}>{formatCurrency(netProfit)}</p>
          <p className="mt-1 text-[12px] text-mist-400">Lucro líquido</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1 border-b border-ink-700">
        {[
          { key: 'despesas', label: 'Despesas' },
          { key: 'receitas', label: 'Receitas' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.key ? 'text-gold-400' : 'text-mist-400 hover:text-mist-100'
            }`}
          >
            {t.label}
            {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-500" />}
          </button>
        ))}
      </div>

      {tab === 'despesas' && (
        <div className="mt-4">
          <div className="mb-4 flex h-9 max-w-md items-center gap-2 rounded-lg border border-ink-600 bg-ink-800 px-3">
            <Search size={14} className="text-mist-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar despesa..."
              className="h-full w-full bg-transparent text-[13px] text-mist-100 placeholder:text-mist-400 focus:outline-none"
            />
          </div>
          {filteredExpenses.length === 0 ? (
            <EmptyState icon={Wallet} title="Nenhuma despesa encontrada" description="Ajuste a busca ou registre um novo gasto." action={<Button icon={Plus} onClick={openCreate}>Lançar despesa</Button>} />
          ) : (
            <div className="surface-card overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-ink-700 bg-ink-800/60 text-[11px] uppercase tracking-wide text-mist-400">
                    <th className="px-5 py-3 font-medium">Descrição</th>
                    <th className="px-5 py-3 font-medium">Categoria</th>
                    <th className="px-5 py-3 font-medium">Veículo</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Valor</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((e) => {
                    const vehicle = vehicles.find((v) => v.id === e.vehicleId)
                    return (
                      <tr key={e.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                        <td className="px-5 py-3 text-mist-100">{e.description}</td>
                        <td className="px-5 py-3 text-mist-300">{labelFor(EXPENSE_CATEGORIES, e.category)}</td>
                        <td className="px-5 py-3 text-mist-300">{vehicle ? `${vehicle.brand} ${vehicle.model}` : '—'}</td>
                        <td className="px-5 py-3 text-mist-300">{formatDate(e.date)}</td>
                        <td className="px-5 py-3 font-mono text-ruby-400">-{formatCurrency(e.value)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(e)}
                              className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ink-700 hover:text-mist-100"
                              aria-label="Editar despesa"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(e)}
                              className="rounded-md p-1.5 text-mist-400 transition-colors hover:bg-ruby-500/10 hover:text-ruby-400"
                              aria-label="Excluir despesa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'receitas' && (
        <div className="mt-4">
          {finishedRentals.length === 0 ? (
            <EmptyState icon={TrendingUp} title="Nenhuma receita registrada" description="As receitas são geradas automaticamente a partir das locações." />
          ) : (
            <div className="surface-card overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-ink-700 bg-ink-800/60 text-[11px] uppercase tracking-wide text-mist-400">
                    <th className="px-5 py-3 font-medium">Origem</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {finishedRentals.map((r) => {
                    const vehicle = vehicles.find((v) => v.id === r.vehicleId)
                    return (
                      <tr key={r.id} className="border-b border-ink-800 last:border-0 hover:bg-ink-800/40">
                        <td className="px-5 py-3 text-mist-100">
                          Locação — {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Veículo removido'}
                        </td>
                        <td className="px-5 py-3 text-mist-300">{formatDate(r.createdAt)}</td>
                        <td className="px-5 py-3 font-mono text-emerald-400">+{formatCurrency(rentalRevenue(r))}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ExpenseFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        expense={editingExpense}
        onSubmit={async (data) => {
          if (editingExpense) {
            await editExpense(editingExpense.id, data)
            toast.success('Despesa atualizada com sucesso')
          } else {
            await addExpense(data)
            toast.success('Despesa lançada com sucesso')
          }
        }}
      />
    </div>
  )
}
