import { AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import { useEffect } from 'react'

export default function ConfirmDialog({ title, description, confirmLabel, cancelLabel, tone, onCancel, onConfirm }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel, onConfirm])

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="surface-card w-full max-w-sm animate-scale-in border-ink-600 p-6">
        <div
          className={clsx(
            'mb-4 flex h-11 w-11 items-center justify-center rounded-full',
            tone === 'danger' ? 'bg-ruby-500/10 text-ruby-400' : 'bg-gold-500/10 text-gold-400'
          )}
        >
          <AlertTriangle size={20} />
        </div>
        <h3 className="text-[15px] font-semibold text-mist-50">{title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist-300">{description}</p>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-lg border border-ink-600 px-4 py-2 text-[13px] font-medium text-mist-200 transition-colors hover:bg-ink-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={clsx(
              'rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors',
              tone === 'danger'
                ? 'bg-ruby-500 text-white hover:bg-ruby-500/90'
                : 'bg-gold-500 text-ink-950 hover:bg-gold-400'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
