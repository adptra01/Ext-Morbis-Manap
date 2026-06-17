import type { FeatureConfig, Role } from './types';

export function configToFeatureList(
  features: Record<
    string,
    {
      enabled: boolean;
      name?: string;
      description?: string;
      allowedRoles?: string[];
      mode?: string;
      modes?: Record<string, string>;
      comingSoon?: boolean;
    }
  >,
): FeatureConfig[] {
  return Object.entries(features).map(([key, f]) => ({
    key,
    name: f.name || key,
    desc: f.description || '',
    roles: (f.allowedRoles || []) as Role[],
    mode: f.mode,
    modes: f.modes,
    comingSoon: f.comingSoon,
  }));
}

export function configToToggles(
  features: Record<string, { enabled: boolean }>,
): Record<string, boolean> {
  const toggles: Record<string, boolean> = {};
  for (const [key, f] of Object.entries(features || {})) {
    toggles[key] = f.enabled ?? false;
  }
  return toggles;
}
