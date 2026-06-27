export type PageType =
  | 'SOURCE'
  | 'SOURCE_AWAL_RANAP'
  | 'SOURCE_AWAL_RAJAL'
  | 'TARGET_LIST'
  | 'BILLING_SOURCE'
  | 'EDIT_KUNJUNGAN'
  | 'CHILD_CPPT'
  | 'CHILD_CEKLIST_PRE'
  | 'CHILD_CEKLIST_ANASTESI'
  | 'CHILD_CEKLIST_KESELAMATAN'
  | 'CHILD_PENUNJANG'
  | 'CHILD_LAB'
  | 'CHILD_RESUME'
  | 'CHILD_SURAT_PERSETUJUAN'
  | 'CHILD_INFORMASI_KEDOKTERAN'
  | 'CHILD_BHP'
  | 'CHILD_LAPORAN'
  | 'UNKNOWN'

export type JenisKunjungan = 'RAJAL' | 'RANAP'
export type BillingStatus = 'OPEN' | 'CLOSED'
export type OperasiStatus = 'PENGAJUAN' | 'SELESAI' | 'BATAL'
export type PageAction = 'SUBMIT' | 'LOAD' | 'RELOAD'

export interface VisitInfo {
  visitId: number
  kunjunganId?: number
  billingId?: number
  noRm: string
  nama: string
  jenis: JenisKunjungan
  status: BillingStatus
  kelas?: string
  unit?: string
}

export interface FormState {
  action: string | null
  method: string
  inputs: Record<string, string>
}

export interface DOMSnapshot {
  timestamp: string
  url: string
  pageType: PageType
  form: FormState
  idIndukAll: string | null
  idPermintaan: string | null
  idVisit: string | null
  idKunjungan: string | null
  detailBillingIds: string[]
  dataArray: string[]
  visibleText: Record<string, string>
  scriptsWithIdVisit: number
}

export interface NetworkRecord {
  timestamp: string
  method: string
  url: string
  requestPayload: Record<string, string> | null
  responseStatus: number
  responseBody: string | null
  duration: number
  isBpjsRequest: boolean
}

export interface FieldDelta {
  changed: string[]
  unchanged: string[]
  added: string[]
  removed: string[]
}

export interface Observation {
  id: string
  timestamp: string
  pageType: PageType
  action: PageAction
  snapshotA: DOMSnapshot | null
  snapshotB: DOMSnapshot | null
  network: NetworkRecord | null
  delta: FieldDelta | null
  confidence: number
}

export interface Dependency {
  from: string
  to: string
  type: 'DIRECT' | 'RESET' | 'UNCHANGED'
  confidence: number
  observationsCount: number
}

export interface MigrationRule {
  id: string
  field: string
  action: 'REPLACE' | 'CLEAR' | 'KEEP'
  condition?: string
  confidence: number
  firstObserved: string
  lastVerified: string
  observationIds: string[]
}

export interface EvidenceStore {
  version: number
  observations: Observation[]
  dependencies: Dependency[]
  rules: MigrationRule[]
  lastUpdated: string
}

export interface MigrationCheck {
  name: string
  passed: boolean
  message: string
  severity: 'ERROR' | 'WARNING' | 'INFO'
}

export interface MigrationValidation {
  allPassed: boolean
  checks: MigrationCheck[]
}

export interface FieldChange {
  field: string
  from: string
  to: string
  action: 'REPLACE' | 'CLEAR' | 'KEEP'
  confidence: number
}

export interface MoveOperationPlan {
  metadata: {
    timestamp: string
    version: string
    sourceUrl: string
  }
  operation: {
    idPermintaan: number
    type: JenisKunjungan
    status: OperasiStatus
  }
  source: VisitInfo
  target: VisitInfo
  fieldChanges: FieldChange[]
  validation: MigrationValidation
}

export interface OperationMigrationConfig {
  enabled: boolean
  mode: 'AUDIT' | 'PREVIEW' | 'EXECUTE'
  minConfidence: number
}
