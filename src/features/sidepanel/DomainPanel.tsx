import { useState } from 'react'
import { type CustomUrl } from './types'

interface DomainPanelProps {
  urls: CustomUrl[]
  onAdd: (url: string) => void
  onRemove: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
}

export function DomainPanel({ urls, onAdd, onRemove, onToggle }: DomainPanelProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="http://192.168.1.100"
          className="md-input flex-1"
        />
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center h-8 px-3 rounded-md text-md-sm font-medium
            bg-[#2469f0] text-white hover:bg-[#1d58cc] active:bg-[#1647a8] transition-colors shrink-0"
        >
          Add
        </button>
      </div>

      {urls.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-[var(--md-gray-400)]">Belum ada domain</p>
        </div>
      )}

      <div className="space-y-1">
        {urls.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[var(--md-gray-50)] group"
          >
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              onClick={() => onToggle(item.id, !item.enabled)}
              className={`
                relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1
                ${item.enabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
                  transition duration-200 ease-in-out
                  ${item.enabled ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
            <span className="flex-1 text-md-sm text-[var(--md-gray-700)] truncate font-mono text-md-xs">
              {item.url}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="opacity-0 group-hover:opacity-100 text-[var(--md-gray-400)] hover:text-[#cc3340] transition-all p-1"
              title="Hapus"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
