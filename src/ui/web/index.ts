/**
 * Shared UI layer — Web Components + Shadow DOM + design tokens.
 * Import './web' sekali di fitur mana pun (vanilla maupun React):
 *   - vanilla: document.createElement('ext-btn')
 *   - React:   <ext-btn variant="danger">Batal</ext-btn>
 *
 * Aturan arsitektur: feature TIDAK boleh mendefinisikan design primitive
 * sendiri (button, badge, modal, tabs) — semua dari lapisan ini.
 */
import './ext-btn';
import './ext-badge';
import './ext-tabs';
import './ext-modal';
import './confirm';

export { getTokenSheet, adoptTokens, ensureFont, injectGlobalTokens } from './tokens';
export { ExtBtn } from './ext-btn';
export { ExtBadge } from './ext-badge';
export { ExtTabs } from './ext-tabs';
export { ExtModal } from './ext-modal';
export { confirmExt } from './confirm';
export type { ConfirmOptions } from './confirm';
