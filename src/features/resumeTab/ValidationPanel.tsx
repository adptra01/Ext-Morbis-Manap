import type { ValidationError } from './types'

interface ValidationPanelProps {
  errors: ValidationError[]
}

export function ValidationPanel({ errors }: ValidationPanelProps) {
  if (errors.length === 0) return null

  return (
    <div className="px-5 py-3 bg-[var(--md-red-50)] border-t border-[var(--md-red-100)] animate-slide-up">
      <div className="flex items-start gap-2.5">
        <svg
          className="w-4 h-4 text-[#cc3340] mt-0.5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <div className="space-y-1">
          <p className="text-md-xs font-semibold text-[#cc3340]">
            {errors.length} {errors.length === 1 ? 'masalah' : 'masalah'} perlu diperbaiki
          </p>
          {errors.map((e, i) => (
            <p key={i} className="text-md-xs text-[#ad2b36]">
              <strong>{e.section}:</strong> {e.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
