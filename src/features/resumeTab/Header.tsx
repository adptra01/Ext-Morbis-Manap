interface HeaderProps {
  title: string
  onClose: () => void
}

export function Header({ title, onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--md-gray-200)] shrink-0">
      <h2 className="text-md-lg font-semibold text-[var(--md-gray-800)]">{title}</h2>
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--md-gray-400)] hover:text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
