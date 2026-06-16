import { useState } from 'react'
import type { CustomUrl } from '../types'

interface DomainPanelProps {
  urls: CustomUrl[]
  onAdd: (url: string) => void
  onRemove: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
}

export function DomainPanel({ urls, onAdd, onRemove, onToggle }: DomainPanelProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isValidUrl = (url: string): boolean => {
    try {
      const p = new URL(url)
      return p.protocol === 'http:' || p.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) {
      setError('Masukkan URL terlebih dahulu')
      return
    }
    if (!isValidUrl(trimmed)) {
      setError('Format URL tidak valid')
      return
    }
    if (urls.find((u) => u.url === trimmed)) {
      setError('URL sudah ada')
      return
    }
    setError(null)
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(null) }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="http://example.com"
          className="flex-1 text-md-xs px-2 py-1.5 rounded border border-[var(--md-gray-200)] bg-white text-[var(--md-gray-700)] placeholder:text-[var(--md-gray-400)] focus:outline-none focus:ring-1 focus:ring-[#2469f0]"
        />
        <button
          onClick={handleAdd}
          className="px-2.5 py-1.5 rounded text-md-xs font-medium bg-[#2469f0] text-white hover:bg-[#1d58cc] active:bg-[#1647a8] transition-colors shrink-0"
        >
          Tambah
        </button>
      </div>
      {error && (
        <p className="text-[10px] text-[var(--md-red-500)] mb-1">{error}</p>
      )}
      {urls.length === 0 ? (
        <p className="text-center text-md-xs text-[var(--md-gray-400)] py-3">Belum ada URL</p>
      ) : (
        <div className="space-y-0.5">
          {urls.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[var(--md-gray-50)] group ${
                item.isDefault ? 'bg-[#eff6ff]' : ''
              }`}
            >
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                onClick={() => onToggle(item.id, !item.enabled)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  item.enabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'
                }`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  item.enabled ? 'translate-x-3' : 'translate-x-0'
                }`} />
              </button>
              <span className="flex-1 text-[10px] text-[var(--md-gray-700)] truncate font-mono">
                {item.url}
              </span>
              <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${
                item.isDefault
                  ? 'bg-[#dbeafe] text-[#1d4ed8]'
                  : 'bg-[var(--md-gray-200)] text-[var(--md-gray-500)]'
              }`}>
                {item.isDefault ? 'DEFAULT' : 'CUSTOM'}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                disabled={item.isDefault}
                className={`p-0.5 rounded transition-colors ${
                  item.isDefault
                    ? 'opacity-0'
                    : 'opacity-0 group-hover:opacity-100 hover:bg-[var(--md-gray-200)]'
                }`}
                title="Hapus"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--md-gray-400)] hover:text-[#cc3340]">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
