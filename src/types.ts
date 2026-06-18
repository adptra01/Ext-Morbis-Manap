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

  // Batch / tab-action fields
  feature?: string;
  data?: Record<string, unknown>;
  action?: string;
  payload?: unknown;
  tabId?: number;
}
