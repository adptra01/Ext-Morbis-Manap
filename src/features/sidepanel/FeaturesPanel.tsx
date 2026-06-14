import { type FeatureConfig, type Role } from './types'

interface FeaturesPanelProps {
  features: FeatureConfig[]
  enabledFeatures: Record<string, boolean>
  role: Role
  onToggle: (key: string, enabled: boolean) => void
}

export function FeaturesPanel({ features, enabledFeatures, role, onToggle }: FeaturesPanelProps) {
  const visible = features.filter((f) => f.roles.includes(role))
  const activeCount = visible.filter((f) => enabledFeatures[f.key]).length

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-md-xs text-[var(--md-gray-500)] font-medium">
          {activeCount} dari {visible.length} aktif
        </p>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-[var(--md-gray-400)]">Tidak ada fitur untuk role ini</p>
        </div>
      )}

      <div className="space-y-0.5">
        {visible.map((feature) => {
          const isEnabled = !!enabledFeatures[feature.key]
          return (
            <div
              key={feature.key}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-md
                ${isEnabled ? 'bg-[var(--md-gray-50)]' : ''}
                ${feature.comingSoon ? 'opacity-60' : 'cursor-pointer hover:bg-[var(--md-gray-50)]'}
              `}
              onClick={() => {
                if (!feature.comingSoon) onToggle(feature.key, !isEnabled)
              }}
            >
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2">
                  <span className="text-md-sm font-medium text-[var(--md-gray-800)]">{feature.name}</span>
                  {feature.comingSoon && <span className="md-badge md-badge--amber">CS</span>}
                </div>
                <p className="text-md-xs text-[var(--md-gray-500)] mt-0.5 truncate">{feature.desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isEnabled}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!feature.comingSoon) onToggle(feature.key, !isEnabled)
                }}
                className={`
                  relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1
                  ${isEnabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
                    transition duration-200 ease-in-out
                    ${isEnabled ? 'translate-x-4' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
