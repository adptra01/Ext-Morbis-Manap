import { Switch } from '../ui/components/switch';
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
  { value: 'labor', label: 'Labor' },
  { value: 'pendaftaran', label: 'Pendaftaran' },
];

const ROLE_LABELS: Record<Role, string> = {
  casemix: 'Casemix',
  kasir: 'Kasir',
  dokter: 'Dokter',
  apotek: 'Apotek',
  admin: 'Admin',
  labor: 'Labor',
  pendaftaran: 'Pendaftaran',
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
      {/* Native <select>: guaranteed no blur-trigger close in Chrome extension popup.
          Radix/MUI portals render outside DOM → browser sees click as "outside" → popup closes. */}
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        className="w-[120px] h-8 rounded-md border border-input bg-background px-2 text-md-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
