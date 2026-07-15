import { useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

  return createPortal(
    <div className="fixed inset-0 z-[250] flex items-start justify-center overflow-y-auto bg-ink-950/70 p-4 py-8 backdrop-blur-sm animate-fade-in sm:items-center">
      <div
        className={`surface-card w-full ${widths[size]} animate-scale-in border-ink-600`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-ink-700 px-6 py-4">
          <div>
            <h2 className="font-display text-[16px] font-bold text-mist-50">{title}</h2>
            {subtitle && <p className="mt-0.5 text-[12.5px] text-mist-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist-400 transition-colors hover:bg-ink-700 hover:text-mist-100"
            aria-label="Fechar"
          >
            <X size={17} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}
