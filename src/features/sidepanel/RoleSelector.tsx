import type { Role } from './types';

const roleOptions: { value: Role; label: string }[] = [
  { value: 'casemix', label: 'Casemix' },
  { value: 'kasir', label: 'Kasir' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'apotek', label: 'Apotek' },
  { value: 'admin', label: 'Admin' },
  { value: 'pendaftaran', label: 'Pendaftaran' },
];

interface RoleSelectorProps {
  value: Role;
  onChange: (role: Role) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Role)}
      className="w-[120px] h-7 rounded-md border border-input bg-background px-2 text-md-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      {roleOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
