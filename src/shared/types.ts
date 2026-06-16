export interface FeatureConfig {
  enabled: boolean;
  name?: string;
  description?: string;
  allowedRoles: Role[];
  mode?: string;
  modes?: Record<string, string>;
  comingSoon?: boolean;
}

export type Role = 'casemix' | 'kasir' | 'dokter' | 'apotek' | 'admin';

export interface ExtensionConfig {
  extensionEnabled: boolean;
  currentRole: Role;
  features: Record<string, FeatureConfig>;
}

export interface CustomUrl {
  id: string;
  url: string;
  enabled: boolean;
  isDefault: boolean;
}

export interface FeatureModule {
  name: string;
  run: () => void;
}
