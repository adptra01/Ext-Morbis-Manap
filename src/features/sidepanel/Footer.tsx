interface FooterProps {
  onReload: () => void
  onReset: () => void
}

export function Footer({ onReload, onReset }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--md-gray-200)]">
      <button
        onClick={onReload}
        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-md-sm font-medium
          text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] active:bg-[var(--md-gray-200)] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 2v6h-6M3 12a9 9 0 0115.36-6.36L21 8M3 22v-6h6M21 12a9 9 0 01-15.36 6.36L3 16" />
        </svg>
        Reload Halaman
      </button>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-md-sm font-medium
          text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] active:bg-[var(--md-gray-200)] transition-colors"
      >
        Reset Default
      </button>
    </div>
  )
}
