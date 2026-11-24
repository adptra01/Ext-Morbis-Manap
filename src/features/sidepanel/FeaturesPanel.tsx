import { useState } from 'react';
import { Search } from 'lucide-react';
import { Switch } from '../../ui/components/switch';
import { Input } from '../../ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/select';
import { type FeatureConfig, type Role } from './types';
import {
  CATEGORY_LABELS,
  MAIN_CATEGORIES,
  getFeatureMeta,
  matchesPathname,
  type CategoryId,
} from './featureMeta';

interface FeaturesPanelProps {
  features: FeatureConfig[];
  enabledFeatures: Record<string, boolean>;
  role: Role;
  disabled?: boolean;
  /** Pathname SIMRS aktif (dari chrome.tabs.query), untuk blok kontekstual. */
  pathname?: string | null;
  onToggle: (key: string, enabled: boolean) => void;
  onModeChange: (key: string, mode: string) => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1';

export function FeaturesPanel({
  features,
  enabledFeatures,
  role,
  disabled,
  pathname,
  onToggle,
  onModeChange,
}: FeaturesPanelProps) {
  // Admin melihat semua fitur (sama seperti popup), bukan hanya yang roles-nya
  // berisi 'admin'. Urut abjad (Indonesia) berdasarkan nama fitur.
  const visible = features
    .filter((f) => role === 'admin' || f.roles.includes(role))
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const q = search.trim().toLowerCase();
  const filtered = visible.filter((f) => {
    if (category !== 'all' && getFeatureMeta(f.key).category !== category) return false;
    return !q || [f.key, f.name, f.desc].join(' ').toLowerCase().includes(q);
  });

  const activeCount = filtered.filter((f) => enabledFeatures[f.key]).length;
  const filterActive = q.length > 0 || category !== 'all';
  const contextual = filterActive
    ? []
    : visible.filter((f) => {
        const patterns = getFeatureMeta(f.key).urlPatterns;
        return patterns.length > 0 && !!pathname && matchesPathname(patterns, pathname);
      });
  // Fitur baru yang belum punya meta tetap bisa difilter lewat "Lainnya".
  const categories = visible.some((f) => getFeatureMeta(f.key).category === 'lainnya')
    ? [...MAIN_CATEGORIES, 'lainnya']
    : MAIN_CATEGORIES;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          aria-label="Cari fitur"
          placeholder="Cari fitur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-8 text-sm [touch-action:manipulation]"
        />
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter kategori fitur">
        {categories.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors duration-150 [touch-action:manipulation] ${FOCUS_RING} ${
              category === id
                ? 'bg-[#2469f0] border-[#2469f0] text-white'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {CATEGORY_LABELS[id]}
          </button>
        ))}
      </div>

      {!filterActive && (
        <section
          aria-label="Fitur yang tersedia di halaman ini"
          className="rounded-lg border border-primary/25 bg-primary/5 p-2.5"
        >
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-md-sm font-semibold text-foreground">⚡ Aktif di Halaman Ini</h2>
            <span className="ml-auto text-[10px] font-medium text-muted-foreground tabular-nums">
              {contextual.length} fitur
            </span>
          </div>
          {contextual.length === 0 ? (
            <p className="text-md-xs text-muted-foreground">
              {pathname
                ? 'Belum ada fitur yang dipakai di halaman ini.'
                : 'Halaman SIMRS tidak terdeteksi.'}
            </p>
          ) : (
            <ul className="space-y-0.5">
              {contextual.map((feature) => (
                <li
                  key={feature.key}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-accent/60"
                >
                  <span
                    className="min-w-0 truncate text-md-xs text-foreground"
                    title={feature.name}
                  >
                    {feature.name}
                  </span>
                  <Switch
                    checked={!!enabledFeatures[feature.key]}
                    onCheckedChange={(val) => onToggle(feature.key, val)}
                    disabled={disabled || feature.comingSoon}
                    aria-label={`${enabledFeatures[feature.key] ? 'Nonaktifkan' : 'Aktifkan'} ${feature.name} di halaman ini`}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="flex items-center justify-between">
        <p className="text-md-xs text-muted-foreground font-medium tabular-nums">
          {activeCount} dari {filtered.length} aktif
        </p>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-muted-foreground">Tidak ada fitur untuk role ini</p>
        </div>
      )}

      {visible.length > 0 && filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-muted-foreground">Tidak ada fitur cocok</p>
        </div>
      )}

      <div className="space-y-0.5">
        {filtered.map((feature) => {
          const isEnabled = !!enabledFeatures[feature.key];
          const blocked = disabled || feature.comingSoon;
          const toggleLabel = `${isEnabled ? 'Nonaktifkan' : 'Aktifkan'} ${feature.name}`;
          return (
            <div
              key={feature.key}
              className={`flex items-center rounded-md ${isEnabled ? 'bg-accent' : ''}`}
            >
              <button
                type="button"
                disabled={blocked}
                aria-label={toggleLabel}
                onClick={() => onToggle(feature.key, !isEnabled)}
                className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-md transition-colors duration-150 [touch-action:manipulation] ${FOCUS_RING} ${
                  blocked ? 'cursor-not-allowed' : 'hover:bg-accent'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-md-sm font-medium text-foreground truncate">
                    {feature.name}
                  </span>
                  {feature.comingSoon && (
                    <span className="shrink-0 text-[10px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                      CS
                    </span>
                  )}
                </span>
                <span className="block text-md-xs text-muted-foreground mt-0.5 truncate">
                  {feature.desc}
                </span>
              </button>
              <div className="flex items-center gap-1.5 pr-3 shrink-0">
                {feature.key === 'openDetailInNewTab' &&
                  feature.modes &&
                  enabledFeatures[feature.key] && (
                    <Select
                      value={feature.mode || 'same-tab'}
                      onValueChange={(v) => onModeChange(feature.key, v)}
                    >
                      <SelectTrigger
                        className="h-7 text-md-xs w-[100px]"
                        aria-label="Mode buka detail"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(feature.modes).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="text-md-xs">
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(val) => {
                    if (!feature.comingSoon) onToggle(feature.key, val);
                  }}
                  disabled={blocked}
                  aria-label={toggleLabel}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
