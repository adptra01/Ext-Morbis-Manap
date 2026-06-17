import { Switch } from '../ui/components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/components/select';
import type { Role } from '../types';

interface StatusCardProps {
  enabled: boolean;
  role: Role;
  onToggle: () => void;
  onRoleChange: (role: Role) => void;
}

const ROLES: { value: Role; label: string }[] = [
  { value: 'casemix', label: 'Casemix' },
  { value: 'kasir', label: 'Kasir' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'apotek', label: 'Apotek' },
  { value: 'admin', label: 'Admin' },
];

const ROLE_LABELS: Record<Role, string> = {
  casemix: 'Casemix',
  kasir: 'Kasir',
  dokter: 'Dokter',
  apotek: 'Apotek',
  admin: 'Admin',
};

export function StatusCard({ enabled, role, onToggle, onRoleChange }: StatusCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <div>
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-muted-foreground'}`}
            />
            <span className="text-md-xs font-medium text-foreground">
              {enabled ? 'Aktif' : 'Non-Aktif'}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Role: {ROLE_LABELS[role] || role}
          </p>
        </div>
      </div>
      <Select value={role} onValueChange={(v) => onRoleChange(v as Role)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
