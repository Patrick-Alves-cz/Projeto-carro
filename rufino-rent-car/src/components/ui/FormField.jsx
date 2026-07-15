import clsx from 'clsx'

export default function FormField({ label, error, required, className, children, hint }) {
  return (
    <label className={clsx('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-[12px] font-medium text-mist-300">
        {label}
        {required && <span className="text-gold-400">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-[11px] text-mist-400">{hint}</span>}
      {error && <span className="mt-1 block text-[11px] text-ruby-400">{error}</span>}
    </label>
  )
}
