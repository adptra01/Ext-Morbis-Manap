import { cn } from '../../ui/lib/utils'
import type { Role } from './types'

const roleOptions: { value: Role; label: string }[] = [
  { value: 'casemix', label: 'Casemix' },
  { value: 'kasir', label: 'Kasir' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'apotek', label: 'Apotek' },
  { value: 'admin', label: 'Admin' },
]

interface RoleSelectorProps {
  value: Role
  onChange: (role: Role) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Role)}
      className={cn(
        'h-8 rounded-md border border-[var(--md-gray-200)] bg-white px-2.5 text-md-sm text-[var(--md-gray-800)]',
        'focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1',
        'dark:bg-[var(--md-gray-100)] dark:text-[var(--md-gray-200)] dark:border-[var(--md-gray-200)]'
      )}
    >
      {roleOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
