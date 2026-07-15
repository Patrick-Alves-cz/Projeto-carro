import { Link } from 'react-router-dom'
import { Compass, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-gold-400">
        <Compass size={26} />
      </div>
      <div>
        <p className="font-mono text-[13px] font-semibold tracking-widest text-gold-400">404</p>
        <h1 className="font-display text-lg font-bold text-mist-50">Página não encontrada</h1>
        <p className="mt-1.5 max-w-sm text-[13.5px] text-mist-400">
          O endereço acessado não existe ou foi movido. Volte para o painel principal para continuar.
        </p>
      </div>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-gold-400"
      >
        <ArrowLeft size={15} /> Voltar ao Dashboard
      </Link>
    </div>
  )
}
