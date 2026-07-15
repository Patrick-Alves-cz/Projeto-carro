import { Keyboard } from 'lucide-react'
import Modal from './Modal.jsx'

const SHORTCUTS = [
  { keys: ['⌘', 'K'], description: 'Abrir busca global' },
  { keys: ['N'], description: 'Criar novo registro na tela atual (Frota, Clientes, Locações, Financeiro)' },
  { keys: ['Esc'], description: 'Fechar modal ou diálogo de confirmação' },
  { keys: ['Enter'], description: 'Confirmar diálogo de confirmação' },
  { keys: ['?'], description: 'Abrir esta lista de atalhos' },
]

export default function ShortcutsHelpModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} size="sm" title="Atalhos de teclado" subtitle="Navegue mais rápido pelo sistema">
      <ul className="space-y-2.5">
        {SHORTCUTS.map((s) => (
          <li key={s.description} className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-mist-300">{s.description}</span>
            <span className="flex shrink-0 gap-1">
              {s.keys.map((k) => (
                <kbd key={k} className="rounded-md border border-ink-600 bg-ink-700 px-2 py-1 font-mono text-[11px] text-mist-100">
                  {k}
                </kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export function ShortcutsHint() {
  return (
    <span className="hidden items-center gap-1 text-[11px] text-mist-500 lg:flex">
      <Keyboard size={12} /> Pressione <kbd className="rounded border border-ink-600 bg-ink-800 px-1">?</kbd> para atalhos
    </span>
  )
}
