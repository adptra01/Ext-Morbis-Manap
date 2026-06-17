import { Switch } from '../../ui/components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/components/select';
import { type FeatureConfig, type Role } from './types';

interface FeaturesPanelProps {
  features: FeatureConfig[];
  enabledFeatures: Record<string, boolean>;
  role: Role;
  disabled?: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  onModeChange: (key: string, mode: string) => void;
}

export function FeaturesPanel({
  features,
  enabledFeatures,
  role,
  disabled,
  onToggle,
  onModeChange,
}: FeaturesPanelProps) {
  const visible = features.filter((f) => f.roles.includes(role));
  const activeCount = visible.filter((f) => enabledFeatures[f.key]).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-md-xs text-muted-foreground font-medium">
          {activeCount} dari {visible.length} aktif
        </p>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-8">
          <p className="text-md-sm text-muted-foreground">Tidak ada fitur untuk role ini</p>
        </div>
      )}

      <div className="space-y-0.5">
        {visible.map((feature) => {
          const isEnabled = !!enabledFeatures[feature.key];
          return (
            <div
              key={feature.key}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-md
                ${isEnabled ? 'bg-accent' : ''}
                ${feature.comingSoon ? 'opacity-60' : 'cursor-pointer hover:bg-accent'}
              `}
              onClick={() => {
                if (!feature.comingSoon && !disabled) onToggle(feature.key, !isEnabled);
              }}
            >
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2">
                  <span className="text-md-sm font-medium text-foreground">{feature.name}</span>
                  {feature.comingSoon && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                      CS
                    </span>
                  )}
                </div>
                <p className="text-md-xs text-muted-foreground mt-0.5 truncate">{feature.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {feature.key === 'openDetailInNewTab' &&
                  feature.modes &&
                  enabledFeatures[feature.key] && (
                    <Select
                      value={feature.mode || 'same-tab'}
                      onValueChange={(v) => onModeChange(feature.key, v)}
                    >
                      <SelectTrigger
                        className="h-7 text-md-xs w-[100px]"
                        onClick={(e) => e.stopPropagation()}
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
                  disabled={disabled || feature.comingSoon}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
