export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-600 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-mist-400">
          <Icon size={20} />
        </div>
      )}
      <h3 className="text-[14.5px] font-semibold text-mist-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-[13px] text-mist-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
