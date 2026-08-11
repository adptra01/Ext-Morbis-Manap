import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/select';
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
    <Select value={value} onValueChange={(v) => onChange(v as Role)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
