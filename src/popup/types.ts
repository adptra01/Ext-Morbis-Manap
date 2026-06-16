import type { Role, ExtensionConfig, CustomUrl } from '../shared/types'
import type { MessagePayload } from '../types'

export interface PopupState {
  enabled: boolean
  role: Role
  config: ExtensionConfig | null
  urls: CustomUrl[]
  loading: boolean
}

export type { Role, ExtensionConfig, CustomUrl, MessagePayload }
