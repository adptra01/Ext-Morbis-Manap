import { type Role } from './types'
import { RoleSelector } from './RoleSelector'

interface StatusCardProps {
  enabled: boolean
  role: Role
  onToggle: () => void
  onRoleChange: (role: Role) => void
}

export function StatusCard({ enabled, role, onToggle, onRoleChange }: StatusCardProps) {
  return (
    <div className="md-card p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={`
            relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1
            ${enabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
              transition duration-200 ease-in-out
              ${enabled ? 'translate-x-4' : 'translate-x-0'}
            `}
          />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-md-sm font-semibold text-[var(--md-gray-800)]">MORBIS Ext</span>
            {enabled && <span className="md-badge md-badge--green">Aktif</span>}
          </div>
          <p className="text-md-xs text-[var(--md-gray-500)] mt-0.5">
            {enabled ? 'Extension aktif di halaman ini' : 'Extension tidak aktif'}
          </p>
        </div>
      </div>
      <RoleSelector value={role} onChange={(v) => onRoleChange(v as Role)} />
    </div>
  )
}
