export interface PatientInfo {
  norm: string
  pasien: string
  nama_dokter: string
  id_visit?: string
  id_rawat_jalan?: string
  id_user?: string
  id_dokter?: string
  id_bed?: string
  noregis?: string
}

export interface VitalSigns {
  tensi: string
  nadi: string
  suhu: string
  nafas: string
  tinggi: string
  berat: string
}

export interface ClinicalNotes {
  anamnesa: string
  pemeriksaan_fisik: string
  catatan: string
  tindakan: string
  terapi_pengobatan: string
}

export interface DiagnosaRow {
  idicd: string
  kode10: string
  namaDiagnosa: string
  kasus: string
  komplikasi: string
}

export interface TindakanRow {
  idicdTindakan: string
  kode9: string
  namaTindakan: string
  komorbid: string
  kategoriProsedur: string
  snomedProsedur: string
  codeProsedur: string
}

export interface ResumeData {
  patientInfo: PatientInfo
  clinicalNotes: ClinicalNotes
  vitalSigns: VitalSigns
  diagnosa: DiagnosaRow[]
  tindakan: TindakanRow[]
}

export interface ValidationError {
  section: string
  message: string
}
