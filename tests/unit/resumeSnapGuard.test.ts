import { describe, it, expect } from 'vitest';
import { snapToResumeData } from '../../src/features/resumeTab/snap.js';
import { snapToRanapForm } from '../../src/features/resumeRanapTab/snap.js';
import type { ResumeData } from '../../src/features/resumeTab/types.js';
import type { RanapFormData } from '../../src/features/resumeRanapTab/types.js';
import type { FormSnap } from '../../src/features/shared/resumeHistory.js';

function baseResumeData(): ResumeData {
  return {
    patientInfo: { id_visit: '204223', id_rawat_jalan: '135682', norm: '00050832' },
    clinicalNotes: {
      anamnesa: 'nyeri pinggang',
      pemeriksaan_fisik: '-',
      catatan: 'catatan',
      tindakan: 'tindakan',
      terapi_pengobatan: 'obat',
      jenis_kasus: '191',
      status_kasus: 'LAMA',
      tindak_lanjut: '56',
    },
    vitalSigns: {
      tensi: '120/77',
      nadi: '87',
      suhu: '36.6',
      nafas: '24',
      tinggi: '158',
      berat: '70',
    },
    diagnosa: [{ idicd: '40676', kode10: 'M47.8', namaDiagnosa: 'x', kasus: '', komplikasi: '' }],
    tindakan: [
      {
        idicdTindakan: '14489',
        kode9: '87.24',
        namaTindakan: 'y',
        komorbid: '',
        kategoriProsedur: '',
      },
    ],
  };
}

function baseRanapData(): RanapFormData {
  return {
    id_visit: '204224',
    id_resume_inap: '',
    anamnesa: 'demam',
    diagnosa_utama_nama: 'A00',
    icd_sekunder: [{ id: '1', kode: 'B01', nama: 'b' }],
    icd_tindakan: [],
    icd_nosokomial: [],
  } as RanapFormData;
}

const verifSnap: FormSnap = {
  jenis: 'RAWAT JALAN',
  norm: '00050832',
  _source: 'verif_action',
  _verified_at: '2026-09-28T03:29:21.766Z',
};

describe('guard entri verifikasi (`_source: verif_action`)', () => {
  it('snapToResumeData: snap verif → state tidak berubah', () => {
    const cur = baseResumeData();
    const out = snapToResumeData(verifSnap, cur);
    expect(out).toBe(cur); // objek sama (no-op), bukan salinan kosong
    expect(out.clinicalNotes.anamnesa).toBe('nyeri pinggang');
    expect(out.diagnosa).toHaveLength(1);
    expect(out.tindakan).toHaveLength(1);
  });

  it('snapToRanapForm: snap verif → state tidak berubah', () => {
    const cur = baseRanapData();
    const out = snapToRanapForm(verifSnap, cur);
    expect(out).toBe(cur);
    expect(out.anamnesa).toBe('demam');
    expect(out.icd_sekunder).toHaveLength(1);
  });
});

describe('snap normal tetap berfungsi (regression)', () => {
  it('snapToResumeData: field klinis + diagnosa/tindakan terisi dari snap', () => {
    const cur = baseResumeData();
    const snap: FormSnap = {
      anamnesa: 'keluhan baru',
      'kode10[]': ['M47.8', 'M18.9'],
      'idicd[]': ['40676', '39752'],
      'nama[]': ['a', 'b'],
      'kode9[]': ['87.24'],
      'idicdTindakan[]': ['14489'],
      'namaTindakan[]': ['Other x-ray'],
      tensi: '110/70',
    };
    const out = snapToResumeData(snap, cur);
    expect(out.clinicalNotes.anamnesa).toBe('keluhan baru');
    expect(out.vitalSigns.tensi).toBe('110/70');
    expect(out.diagnosa).toHaveLength(2);
    expect(out.tindakan).toHaveLength(1);
    expect(out.diagnosa[1].kode10).toBe('M18.9');
  });

  it('snapToRanapForm: string keys + baris ICD terisi dari snap', () => {
    const cur = baseRanapData();
    const snap: FormSnap = {
      anamnesa: 'sesak',
      'id_diagnosa_sekunder[]': ['11'],
      kode_diagnosa_sekunder1: 'J18.9',
      diagnosa_sekunder1: 'Pneumonia',
      'id_tindakan[]': ['22'],
      kode_tindakan1: '99.99',
      tindakan1: 'Tindakan X',
    };
    const out = snapToRanapForm(snap, cur);
    expect(out.anamnesa).toBe('sesak');
    expect(out.icd_sekunder).toEqual([{ id: '11', kode: 'J18.9', nama: 'Pneumonia' }]);
    expect(out.icd_tindakan).toEqual([{ id: '22', kode: '99.99', nama: 'Tindakan X' }]);
  });
});
