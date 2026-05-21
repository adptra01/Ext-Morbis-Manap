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

export interface MessagePayload {
  type: string;
  role?: Role;
  enabled?: boolean;
  key?: string;
  mode?: string;
  url?: string;
  id?: string;
}

export interface FeatureModule {
  name: string;
  run: () => void;
}

export interface PopupDOM {
  loading: HTMLElement;
  mainContent: HTMLElement;
  toggleExtension: HTMLInputElement;
  statusBadge: HTMLElement;
  statusText: HTMLElement;
  featuresList: HTMLElement;
  enabledCount: HTMLElement;
  totalCount: HTMLElement;
  reloadBtn: HTMLElement;
  resetBtn: HTMLElement;
  urlInput: HTMLInputElement;
  addUrlBtn: HTMLElement;
  urlsList: HTMLElement;
  toastEl: HTMLElement;
  roleSelect: HTMLSelectElement;
  roleBanner: HTMLElement;
}
