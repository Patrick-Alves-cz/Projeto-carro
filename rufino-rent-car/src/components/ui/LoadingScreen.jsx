export default function LoadingScreen({ label = 'Carregando...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-ink-600 border-t-gold-500" />
      <p className="text-[13px] text-mist-400">{label}</p>
    </div>
  )
}
