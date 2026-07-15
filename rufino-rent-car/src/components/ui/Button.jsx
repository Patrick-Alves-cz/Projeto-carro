import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-gold',
  secondary: 'bg-ink-800 text-mist-50 border border-ink-600 hover:bg-ink-700',
  ghost: 'text-mist-200 hover:bg-ink-800',
  danger: 'bg-ruby-500 text-white hover:bg-ruby-500/90',
  outline: 'border border-gold-500/40 text-gold-400 hover:bg-gold-500/10',
}

const SIZES = {
  sm: 'h-8 px-3 text-[12.5px] gap-1.5',
  md: 'h-10 px-4 text-[13.5px] gap-2',
  lg: 'h-11 px-5 text-[14px] gap-2',
  icon: 'h-9 w-9 justify-center',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className,
  children,
  disabled,
  ...rest
}) {
  return (
    <Component
      className={clsx(
        'inline-flex items-center rounded-lg font-semibold transition-all duration-200 ease-premium',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </Component>
  )
}
