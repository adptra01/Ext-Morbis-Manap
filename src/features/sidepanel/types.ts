import type { Role, CustomUrl } from '../../shared/types'

export interface FeatureConfig {
  key: string
  name: string
  desc: string
  roles: Role[]
  comingSoon?: boolean
}

export type { Role, CustomUrl }
