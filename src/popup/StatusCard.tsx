import type { Role } from '../types'

interface StatusCardProps {
  enabled: boolean
  role: Role
  onToggle: () => void
  onRoleChange: (role: Role) => void
}

const ROLES: { value: Role; label: string }[] = [
  { value: 'casemix', label: 'Casemix' },
  { value: 'kasir', label: 'Kasir' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'apotek', label: 'Apotek' },
  { value: 'admin', label: 'Admin' },
]

export function StatusCard({ enabled, role, onToggle, onRoleChange }: StatusCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1 ${
            enabled ? 'bg-[#2469f0]' : 'bg-[var(--md-gray-200)]'
          }`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </button>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${enabled ? 'bg-[#1b8a4b]' : 'bg-[var(--md-gray-400)]'}`} />
            <span className="text-md-xs font-medium text-[var(--md-gray-700)]">
              {enabled ? 'Aktif' : 'Non-Aktif'}
            </span>
          </div>
        </div>
      </div>
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="text-md-xs px-2 py-1 rounded border border-[var(--md-gray-200)] bg-white text-[var(--md-gray-700)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2469f0]"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
  )
}
