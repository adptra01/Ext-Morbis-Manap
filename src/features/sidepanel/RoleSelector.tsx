import { cn } from '../../ui/lib/utils'

const roleOptions: { value: string; label: string }[] = [
  { value: 'Casemix', label: 'Casemix' },
  { value: 'Kasir', label: 'Kasir' },
  { value: 'Dokter', label: 'Dokter' },
  { value: 'Apotek', label: 'Apotek' },
  { value: 'Admin', label: 'Admin' },
]

interface RoleSelectorProps {
  value: string
  onChange: (role: string) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
