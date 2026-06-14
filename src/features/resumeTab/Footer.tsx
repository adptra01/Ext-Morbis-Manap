interface FooterProps {
  saving: boolean
  hasErrors: boolean
  lastSaved: string | null
  onSave: () => void
  onCancel: () => void
}

export function Footer({ saving, hasErrors, lastSaved, onSave, onCancel }: FooterProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--md-gray-200)] shrink-0">
      <div className="flex items-center gap-2">
        {lastSaved && (
          <span className="text-md-xs text-[var(--md-green-500)] flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {lastSaved}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="inline-flex items-center justify-center h-8 px-4 rounded-md text-md-sm font-medium
            border border-[var(--md-gray-200)] text-[var(--md-gray-600)]
            hover:bg-[var(--md-gray-50)] active:bg-[var(--md-gray-100)] transition-colors"
        >
          Tutup
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center h-8 px-4 rounded-md text-md-sm font-semibold
            bg-[#1b8a4b] text-white shadow-sm
            hover:bg-[#16753f] active:bg-[#116033]
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            'Simpan Resume'
          )}
        </button>
      </div>
    </div>
  )
}
