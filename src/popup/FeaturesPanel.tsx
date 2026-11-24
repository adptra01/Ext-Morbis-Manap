import { useState, useMemo } from 'react';
import { Search, Zap } from 'lucide-react';
import { Switch } from '../ui/components/switch';
import { Input } from '../ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/components/select';
import { cn } from '../ui/lib/utils';
import {
  CATEGORY_LABELS,
  MAIN_CATEGORIES,
  getFeatureMeta,
  matchesPathname,
  type CategoryId,
} from './featureMeta';

interface FeatureEntry {
  enabled: boolean;
  name?: string;
  description?: string;
  allowedRoles: string[];
  mode?: string;
  modes?: Record<string, string>;
  comingSoon?: boolean;
}

interface FeaturesPanelProps {
  features: Record<string, FeatureEntry>;
  role: string;
  disabled?: boolean;
  onToggle: (key: string, value: boolean) => void;
  onModeChange: (key: string, mode: string) => void;
  pathname?: string;
}

export function FeaturesPanel({
  features,
  role,
  disabled,
  onToggle,
  onModeChange,
  pathname,
}: FeaturesPanelProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const q = search.trim().toLowerCase();

  const entries = useMemo(
    () =>
      Object.entries(features)
        .filter(([, f]) => role === 'admin' || f.allowedRoles?.includes(role))
        // Urut abjad (Indonesia) berdasarkan nama fitur agar daftar konsisten.
        .sort(([, a], [, b]) => (a.name ?? '').localeCompare(b.name ?? '', 'id')),
    [features, role],
  );

  const filtered = useMemo(() => {
    const list = q
      ? entries.filter(([key, f]) =>
          [key, f.name ?? '', f.description ?? ''].join(' ').toLowerCase().includes(q),
        )
      : entries;
    if (category === 'all') return list;
    return list.filter(([key]) => getFeatureMeta(key).category === category);
  }, [entries, q, category]);

  const showContextual = !q && category === 'all';
  const contextualEntries = useMemo(() => {
    if (!showContextual) return [] as Array<[string, FeatureEntry]>;
    const path = (pathname ?? '').trim();
    if (!path) return [];
    const matched: Array<[string, FeatureEntry]> = [];
    for (const [key, f] of entries) {
      if (!f.enabled || f.comingSoon) continue;
      if (matchesPathname(getFeatureMeta(key).urlPatterns, path)) {
        matched.push([key, f]);
      }
    }
    return matched;
  }, [showContextual, pathname, entries]);

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
      {showContextual && (
        <div className="mb-1.5 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-2">
          <div className="flex items-center gap-1">
            <Zap className="size-3 text-amber-600 shrink-0" />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Aktif di Halaman Ini
            </span>
          </div>
          <p className="text-[9px] text-muted-foreground font-mono truncate mt-0.5">{pathname}</p>
          {contextualEntries.length > 0 ? (
            <div className="mt-1.5 space-y-0.5">
              {contextualEntries.map(([key, f]) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="flex-1 min-w-0 text-md-xs font-medium text-foreground truncate">
                    {f.name || key}
                  </span>
                  <Switch
                    checked={f.enabled}
                    onCheckedChange={(val) => onToggle(key, val)}
                    disabled={disabled}
                    className="h-4 w-7 shrink-0 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Tidak ada fitur yang aktif di halaman ini
            </p>
          )}
        </div>
      )}

      <div className="relative mb-1.5">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
        <Input
          aria-label="Cari fitur"
          placeholder="Cari fitur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-[11px] pl-7"
        />
      </div>

      <div className="flex gap-1 mb-1.5">
        {MAIN_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              'h-6 px-2 rounded-full text-[10px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              category === c
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
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
