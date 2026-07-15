import { createContext, useCallback, useContext, useRef, useState } from 'react'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null)
  const resolverRef = useRef(null)

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setState({
        title: options.title ?? 'Confirmar ação',
        description: options.description ?? 'Essa ação não pode ser desfeita.',
        confirmLabel: options.confirmLabel ?? 'Excluir',
        cancelLabel: options.cancelLabel ?? 'Cancelar',
        tone: options.tone ?? 'danger',
      })
    })
  }, [])

  const handleClose = useCallback((result) => {
    setState(null)
    resolverRef.current?.(result)
    resolverRef.current = null
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <ConfirmDialog
          {...state}
          onCancel={() => handleClose(false)}
          onConfirm={() => handleClose(true)}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider')
  return ctx
}
