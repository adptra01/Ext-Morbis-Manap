interface FeaturesPanelProps {
  features: Record<string, {
    enabled: boolean
    name?: string
    description?: string
    allowedRoles: string[]
    mode?: string
    modes?: Record<string, string>
    comingSoon?: boolean
  }>
  role: string
  onToggle: (key: string, value: boolean) => void
  onModeChange: (key: string, mode: string) => void
}

export function FeaturesPanel({ features, role, onToggle, onModeChange }: FeaturesPanelProps) {
  const entries = Object.entries(features).filter(([, f]) =>
    role === 'admin' || f.allowedRoles?.includes(role)
  )
  const enabledCount = entries.filter(([, f]) => f.enabled && !f.comingSoon).length

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-md-xs text-[var(--md-gray-400)]">Tidak ada fitur untuk role ini</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[10px] text-[var(--md-gray-500)] mb-1.5">
        {enabledCount} dari {entries.filter(([, f]) => !f.comingSoon).length} fitur aktif
      </p>
      <div className="space-y-0.5">
        {entries.map(([key, feature]) => {
          const isComingSoon = feature.comingSoon === true
          const isEnabled = feature.enabled && !isComingSoon
          const disabled = !feature.enabled || isComingSoon

          return (
            <div
              key={key}
              className={`flex items-center justify-between px-2.5 py-2 rounded ${
                isEnabled ? 'bg-[var(--md-gray-50)]' : ''
              } ${isComingSoon ? 'opacity-60' : ''}`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-md-xs font-medium text-[var(--md-gray-800)]">
                    {feature.name || key}
                  </span>
                  {isComingSoon && (
                    <span className="text-[9px] font-semibold text-[#c47a1a] bg-[#fef4e4] px-1.5 py-0.5 rounded-full">
                      CS
                    </span>
                  )}
                </div>
                {feature.description && (
                  <p className="text-[10px] text-[var(--md-gray-500)] truncate mt-0.5">
                    {feature.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {key === 'openDetailInNewTab' && feature.modes && feature.enabled && (
                  <select
                    value={feature.mode || 'same-tab'}
                    onChange={(e) => onModeChange(key, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] px-1.5 py-1 rounded border border-[var(--md-gray-200)] bg-white text-[var(--md-gray-700)] cursor-pointer focus:outline-none"
                  >
                    {Object.entries(feature.modes).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                )}
                {!isComingSoon && (
                  <button
                    type="button"
                    role="switch"
                    aria-checked={feature.enabled}
                    onClick={() => onToggle(key, !feature.enabled)}
                    className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      feature.enabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      feature.enabled ? 'translate-x-3' : 'translate-x-0'
                    }`} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
