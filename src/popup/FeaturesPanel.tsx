import { useState } from 'react';
import { Search } from 'lucide-react';
import { Switch } from '../ui/components/switch';
import { Input } from '../ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/components/select';

interface FeaturesPanelProps {
  features: Record<
    string,
    {
      enabled: boolean;
      name?: string;
      description?: string;
      allowedRoles: string[];
      mode?: string;
      modes?: Record<string, string>;
      comingSoon?: boolean;
    }
  >;
  role: string;
  disabled?: boolean;
  onToggle: (key: string, value: boolean) => void;
  onModeChange: (key: string, mode: string) => void;
}

export function FeaturesPanel({
  features,
  role,
  disabled,
  onToggle,
  onModeChange,
}: FeaturesPanelProps) {
  const entries = Object.entries(features)
    .filter(([, f]) => role === 'admin' || f.allowedRoles?.includes(role))
    // Urut abjad (Indonesia) berdasarkan nama fitur agar daftar konsisten.
    .sort(([, a], [, b]) => (a.name ?? '').localeCompare(b.name ?? '', 'id'));

  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const filtered = q
    ? entries.filter(([key, f]) =>
        [key, f.name ?? '', f.description ?? ''].join(' ').toLowerCase().includes(q),
      )
    : entries;

  const enabledCount = filtered.filter(([, f]) => f.enabled && !f.comingSoon).length;
  const totalCount = filtered.filter(([, f]) => !f.comingSoon).length;

  if (entries.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-md-xs text-muted-foreground">Tidak ada fitur untuk role ini</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-md-xs text-muted-foreground">Tidak ada fitur cocok</p>
      </div>
    );
  }

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="relative mb-1.5">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Cari fitur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-[11px] pl-7"
        />
      </div>
      <p className="text-[10px] text-muted-foreground mb-1.5">
        {enabledCount} dari {totalCount} fitur aktif
      </p>
      <div className="space-y-0.5">
        {filtered.map(([key, feature]) => {
          const isComingSoon = feature.comingSoon === true;

          return (
            <div
              key={key}
              className={`flex items-center justify-between px-2.5 py-2 rounded ${
                feature.enabled && !isComingSoon ? 'bg-accent' : ''
              } ${isComingSoon ? 'opacity-60' : ''}`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-md-xs font-medium text-foreground">
                    {feature.name || key}
                  </span>
                  {isComingSoon && (
                    <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                      CS
                    </span>
                  )}
                </div>
                {feature.description && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                    {feature.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {key === 'openDetailInNewTab' && feature.modes && feature.enabled && (
                  <Select
                    value={feature.mode || 'same-tab'}
                    onValueChange={(v) => onModeChange(key, v)}
                  >
                    <SelectTrigger
                      className="h-6 text-[10px] w-[90px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(feature.modes).map(([k, v]) => (
                        <SelectItem key={k} value={k} className="text-[10px]">
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!isComingSoon && (
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(val) => onToggle(key, val)}
                    disabled={disabled}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
