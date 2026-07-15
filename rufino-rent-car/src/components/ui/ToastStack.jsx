import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import clsx from 'clsx'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const ACCENT = {
  success: 'text-emerald-400 border-emerald-500/30',
  error: 'text-ruby-400 border-ruby-500/30',
  info: 'text-azure-400 border-azure-500/30',
  warning: 'text-amber-400 border-amber-500/30',
}

export default function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex w-[360px] max-w-[92vw] flex-col gap-2.5">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] ?? Info
        return (
          <div
            key={toast.id}
            role="status"
            className={clsx(
              'animate-scale-in surface-card flex items-start gap-3 border p-3.5 pr-2.5 shadow-card-hover',
              ACCENT[toast.type]
            )}
          >
            <Icon size={19} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium leading-snug text-mist-50">{toast.message}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs leading-snug text-mist-300">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 rounded-md p-1 text-mist-400 transition-colors hover:bg-ink-700 hover:text-mist-100"
              aria-label="Fechar notificação"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
