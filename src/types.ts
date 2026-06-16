import type { Role } from './shared/types';

export type {
  FeatureConfig,
  Role,
  ExtensionConfig,
  CustomUrl,
  FeatureModule,
} from './shared/types';

export { MessageTypes } from './shared/messaging';
export type { MessageType } from './shared/messaging';

export interface MessagePayload {
  type: string;
  role?: Role;
  enabled?: boolean;
  key?: string;
  mode?: string;
  url?: string;
  id?: string;
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
