import { Component } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ruby-500/10 text-ruby-400">
          <AlertOctagon size={26} />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-mist-50">Algo deu errado</h1>
          <p className="mt-1.5 max-w-md text-[13.5px] text-mist-400">
            Um erro inesperado interrompeu esta tela. Seus dados continuam salvos localmente.
            Tente recarregar o sistema.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-gold-400"
        >
          <RotateCcw size={15} /> Recarregar sistema
        </button>
      </div>
    )
  }
}
