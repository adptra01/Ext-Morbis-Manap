interface FooterProps {
  onReload: () => void
  onReset: () => void
}

export function Footer({ onReload, onReset }: FooterProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[var(--md-gray-200)]">
      <button
        onClick={onReload}
        className="flex-1 px-2.5 py-1.5 rounded text-md-xs font-medium bg-[#2469f0] text-white hover:bg-[#1d58cc] active:bg-[#1647a8] transition-colors"
      >
        Reload Halaman
      </button>
      <button
        onClick={onReset}
        className="flex-1 px-2.5 py-1.5 rounded text-md-xs font-medium bg-[var(--md-gray-500)] text-white hover:bg-[var(--md-gray-600)] active:bg-[var(--md-gray-700)] transition-colors"
      >
        Reset Default
      </button>
    </div>
  )
}
