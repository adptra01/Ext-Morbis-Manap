import type { ResumeData, DiagnosaRow, TindakanRow, ClinicalNotes } from './types';
import type { FormSnap } from '../shared/resumeHistory.js';

/**
 * Rajal: ResumeData (state React) ⇄ FormSnap (shared/resumeHistory).
 * Key snap = nama field form native MORBIS agar "Salin ke Form" (applySnapshot
 * di resumeValidator) cocok satu-ke-satu.
 */

function arr(snap: FormSnap, k: string): string[] {
  const v = snap[k];
  if (Array.isArray(v)) return v;
  return v === undefined ? [] : [v];
}

function str(snap: FormSnap, k: string): string {
  const v = snap[k];
  return typeof v === 'string' ? v : Array.isArray(v) ? (v[0] ?? '') : '';
}

export function resumeDataToSnap(d: ResumeData): FormSnap {
  const n = d.clinicalNotes;
  const v = d.vitalSigns;
  const snap: FormSnap = {
    anamnesa: n.anamnesa,
    pemeriksaan_fisik: n.pemeriksaan_fisik,
    catatan: n.catatan,
    tindakan: n.tindakan,
    terapi_pengobatan: n.terapi_pengobatan,
    tensi: v.tensi,
    nadi: v.nadi,
    suhu: v.suhu,
    nafas: v.nafas,
    tinggi: v.tinggi,
    berat: v.berat,
  };
  const c = n as ClinicalNotes & Partial<Record<string, string>>;
  for (const k of ['jenis_kasus', 'status_kasus', 'tindak_lanjut'] as const) {
    if (c[k]) snap[k] = c[k];
  }
  snap['kode10[]'] = d.diagnosa.map((r) => r.kode10);
  snap['idicd[]'] = d.diagnosa.map((r) => r.idicd);
  snap['nama[]'] = d.diagnosa.map((r) => r.namaDiagnosa);
  snap['kasus_diagnosa[]'] = d.diagnosa.map((r) => r.kasus);
  snap['komplikasi[]'] = d.diagnosa.map((r) => r.komplikasi);
  snap['kode9[]'] = d.tindakan.map((r) => r.kode9);
  snap['idicdTindakan[]'] = d.tindakan.map((r) => r.idicdTindakan);
  snap['namaTindakan[]'] = d.tindakan.map((r) => r.namaTindakan);
  snap['komorbid[]'] = d.tindakan.map((r) => r.komorbid);
  snap['kategoriProsedur[]'] = d.tindakan.map((r) => r.kategoriProsedur);
  snap['snomedProsedur[]'] = d.tindakan.map((r) => r.snomedProsedur);
  snap['codeProsedur[]'] = d.tindakan.map((r) => r.codeProsedur);
  return snap;
}

export function snapToResumeData(snap: FormSnap, cur: ResumeData): ResumeData {
  const diagMax = Math.max(
    arr(snap, 'kode10[]').length,
    arr(snap, 'idicd[]').length,
    arr(snap, 'nama[]').length,
  );
  const diagnosa: DiagnosaRow[] = [];
  for (let i = 0; i < diagMax; i++) {
    const idicd = arr(snap, 'idicd[]')[i] ?? '';
    const kode10 = arr(snap, 'kode10[]')[i] ?? '';
    const namaDiagnosa = arr(snap, 'nama[]')[i] ?? '';
    if (!idicd && !kode10 && !namaDiagnosa) continue;
    diagnosa.push({
      idicd,
      kode10,
      namaDiagnosa,
      kasus: arr(snap, 'kasus_diagnosa[]')[i] ?? '',
      komplikasi: arr(snap, 'komplikasi[]')[i] ?? '',
    });
  }

  const tdkMax = Math.max(
    arr(snap, 'kode9[]').length,
    arr(snap, 'idicdTindakan[]').length,
    arr(snap, 'namaTindakan[]').length,
  );
  const tindakan: TindakanRow[] = [];
  for (let i = 0; i < tdkMax; i++) {
    const idicdTindakan = arr(snap, 'idicdTindakan[]')[i] ?? '';
    const kode9 = arr(snap, 'kode9[]')[i] ?? '';
    const namaTindakan = arr(snap, 'namaTindakan[]')[i] ?? '';
    if (!idicdTindakan && !kode9 && !namaTindakan) continue;
    tindakan.push({
      idicdTindakan,
      kode9,
      namaTindakan,
      komorbid: arr(snap, 'komorbid[]')[i] ?? '',
      kategoriProsedur: arr(snap, 'kategoriProsedur[]')[i] ?? '',
      snomedProsedur: arr(snap, 'snomedProsedur[]')[i] ?? '',
      codeProsedur: arr(snap, 'codeProsedur[]')[i] ?? '',
    });
  }

  return {
    patientInfo: cur.patientInfo,
    clinicalNotes: {
      anamnesa: str(snap, 'anamnesa'),
      pemeriksaan_fisik: str(snap, 'pemeriksaan_fisik'),
      catatan: str(snap, 'catatan'),
      tindakan: str(snap, 'tindakan'),
      terapi_pengobatan: str(snap, 'terapi_pengobatan'),
      jenis_kasus: str(snap, 'jenis_kasus'),
      status_kasus: str(snap, 'status_kasus'),
      tindak_lanjut: str(snap, 'tindak_lanjut'),
    },
    vitalSigns: {
      tensi: str(snap, 'tensi'),
      nadi: str(snap, 'nadi'),
      suhu: str(snap, 'suhu'),
      nafas: str(snap, 'nafas'),
      tinggi: str(snap, 'tinggi'),
      berat: str(snap, 'berat'),
    },
    diagnosa,
    tindakan,
  };
}
