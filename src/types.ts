import type { Role } from './shared/types';

export type {
  FeatureConfig,
  Role,
  ExtensionConfig,
  CustomUrl,
} from './shared/types';

export type { FeatureModule, FeatureMatch, FeatureContext } from './features/shared/types';

export { matchPage, normalizePath } from './features/shared/featureMatch.js';
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

  feature?: string;
  data?: Record<string, unknown>;
  action?: string;
  payload?: unknown;
  tabId?: number;
}
