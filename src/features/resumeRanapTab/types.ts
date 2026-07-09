export interface IcdItem {
  id: string;
  kode: string;
  nama: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface RanapFormData {
  // Hidden / meta
  id_visit: string;
  id_resume_inap: string;
  id_user: string;
  id_bed: string;
  unit: string;
  noreg: string;
  norm: string;
  pasien: string;
  // Ringkasan
  dokter_bersama: string;
  alasan_rawat: string;
  anamnesa: string;
  riwayat_penyakit: string;
  // Vital signs
  tensi: string;
  nadi: string;
  suhu: string;
  spo2: string;
  nafas: string;
  gcs_e: string;
  gcs_m: string;
  gcs_v: string;
  // Pemeriksaan & Diagnosa
  fisik_text: string;
  laborat: string;
  diagnosa_primary: string;
  diagnosa_skunder: string;
  diagnosa_tindakan: string;
  tindakan: string;
  terapi_pengobatan: string;
  obat_plg: string;
  tindakan_dua: string;
  jenis_kasus: string;
  // ICD display + hidden IDs
  kode_diagnosa_utama: string;
  diagnosa_utama_nama: string;
  id_diagnosa_utama: string;
  icd_sekunder: IcdItem[];
  icd_tindakan: IcdItem[];
  icd_nosokomial: IcdItem[];
  // Kondisi pulang
  ku: string;
  kes: string;
  td_pulang: string;
  nadi_pulang: string;
  suhu_pulang: string;
  rr_pulang: string;
  spo2_pulang: string;
  catatan_keluar: string;
  keadaan_keluar: string;
  cara_keluar: string;
  penyebab_kematian: string;
  instruksi_pulang: string;
  // Keluar
  tgl_keluar: string;
  jadwal_kontrol: string;
  pemeriksaan_lanjut: string;
  kelas: string;
  id_kelas: string;
}

export interface ValidationError {
  section: string;
  message: string;
}
