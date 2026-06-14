export interface FeatureConfig {
  key: string
  name: string
  desc: string
  roles: string[]
  comingSoon?: boolean
}

export type Role = 'Casemix' | 'Kasir' | 'Dokter' | 'Apotek' | 'Admin'

export interface CustomUrl {
  id: string
  url: string
  enabled: boolean
}
