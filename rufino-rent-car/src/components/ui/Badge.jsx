import clsx from 'clsx'

const TONES = {
  gold: 'bg-gold-500/10 text-gold-400 border-gold-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  ruby: 'bg-ruby-500/10 text-ruby-400 border-ruby-500/25',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  azure: 'bg-azure-500/10 text-azure-400 border-azure-500/25',
  mist: 'bg-ink-700 text-mist-200 border-ink-600',
}

export default function Badge({ tone = 'mist', children, dot = true, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-medium leading-none',
        TONES[tone],
        className
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', `bg-current`)} />}
      {children}
    </span>
  )
}
