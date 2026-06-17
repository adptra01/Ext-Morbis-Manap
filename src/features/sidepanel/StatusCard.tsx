import { Switch } from '../../ui/components/switch';
import { Badge } from '../../ui/components/Badge';
import type { Role } from './types';
import { RoleSelector } from './RoleSelector';

interface StatusCardProps {
  enabled: boolean;
  role: Role;
  onToggle: () => void;
  onRoleChange: (role: Role) => void;
}

export function StatusCard({ enabled, role, onToggle, onRoleChange }: StatusCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-md-sm font-semibold text-foreground">MORBIS Ext</span>
            {enabled && <Badge variant="success">Aktif</Badge>}
          </div>
          <p className="text-md-xs text-muted-foreground mt-0.5">
            {enabled ? 'Extension aktif di halaman ini' : 'Extension tidak aktif'}
          </p>
        </div>
      </div>
      <RoleSelector value={role} onChange={(v) => onRoleChange(v as Role)} />
    </div>
  );
}
