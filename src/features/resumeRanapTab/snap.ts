import type { RanapFormData, IcdItem } from './types';
import type { FormSnap } from '../shared/resumeHistory.js';

/**
 * Ranap: RanapFormData (state React) ⇄ FormSnap (shared/resumeHistory).
 * String = nama field native (sama dengan serializeFormData di mount.tsx).
 * Baris ICD: id via `id_*[]`, kode/nama per-baris via key bernomor
 * `kode_diagnosa_sekunder1` / `diagnosa_sekunder1` dst — cocok dengan id
 * elemen form native MORBIS (applySnapshot fallback ke id).
 */

const STRING_KEYS: (keyof RanapFormData)[] = [
  'alasan_rawat',
  'anamnesa',
  'riwayat_penyakit',
  'tensi',
  'nadi',
  'suhu',
  'spo2',
  'nafas',
  'gcs_e',
  'gcs_m',
  'gcs_v',
  'fisik_text',
  'laborat',
  'diagnosa_primary',
  'diagnosa_skunder',
  'diagnosa_tindakan',
  'tindakan',
  'terapi_pengobatan',
  'obat_plg',
  'tindakan_dua',
  'jenis_kasus',
  'kode_diagnosa_utama',
  'id_diagnosa_utama',
  'ku',
  'kes',
  'td_pulang',
  'nadi_pulang',
  'suhu_pulang',
  'rr_pulang',
  'spo2_pulang',
  'catatan_keluar',
  'keadaan_keluar',
  'cara_keluar',
  'penyebab_kematian',
  'instruksi_pulang',
  'tgl_keluar',
  'jadwal_kontrol',
  'pemeriksaan_lanjut',
  'kelas',
  'id_kelas',
];

const ROWS: Array<{
  field: 'icd_sekunder' | 'icd_tindakan' | 'icd_nosokomial';
  idName: string;
  kodePrefix: string;
  namaPrefix: string;
}> = [
  {
    field: 'icd_sekunder',
    idName: 'id_diagnosa_sekunder[]',
    kodePrefix: 'kode_diagnosa_sekunder',
    namaPrefix: 'diagnosa_sekunder',
  },
  {
    field: 'icd_tindakan',
    idName: 'id_tindakan[]',
    kodePrefix: 'kode_tindakan',
    namaPrefix: 'tindakan',
  },
  {
    field: 'icd_nosokomial',
    idName: 'id_nosokomial[]',
    kodePrefix: 'kode_nosokomial',
    namaPrefix: 'nosokomial',
  },
];

export function ranapToSnap(d: RanapFormData): FormSnap {
  const snap: FormSnap = {};
  for (const k of STRING_KEYS) {
    const v = d[k];
    if (typeof v === 'string') snap[k] = v;
  }
  snap['diagnosa_utama'] = d.diagnosa_utama_nama; // id native, bukan nama field
  for (const cfg of ROWS) {
    const items = d[cfg.field];
    snap[cfg.idName] = items.map((i) => i.id);
    items.forEach((it, i) => {
      snap[`${cfg.kodePrefix}${i + 1}`] = it.kode;
      snap[`${cfg.namaPrefix}${i + 1}`] = it.nama;
    });
  }
  return snap;
}

function snapStr(snap: FormSnap, k: string): string {
  const v = snap[k];
  return typeof v === 'string' ? v : Array.isArray(v) ? (v[0] ?? '') : '';
}

export function snapToRanapForm(snap: FormSnap, cur: RanapFormData): RanapFormData {
  const d = structuredClone(cur) as RanapFormData & Record<string, string>;
  for (const k of STRING_KEYS) {
    const v = snap[k as string];
    if (typeof v === 'string') d[k as string] = v;
  }
  const namaUtama = snapStr(snap, 'diagnosa_utama');
  if (namaUtama) d.diagnosa_utama_nama = namaUtama;

  const readRows = (cfg: (typeof ROWS)[number]): IcdItem[] => {
    const ids = snap[cfg.idName];
    const idArr: string[] = Array.isArray(ids) ? ids : [];
    const items: IcdItem[] = [];
    for (let i = 1; i <= 10; i++) {
      const kode = snapStr(snap, `${cfg.kodePrefix}${i}`);
      const nama = snapStr(snap, `${cfg.namaPrefix}${i}`);
      if (!kode && !nama) continue;
      items.push({ id: idArr[i - 1] ?? '', kode, nama });
    }
    return items;
  };

  d.icd_sekunder = readRows(ROWS[0]);
  d.icd_tindakan = readRows(ROWS[1]);
  d.icd_nosokomial = readRows(ROWS[2]);
  return d;
}
