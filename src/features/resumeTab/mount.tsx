/* ── Priority config for sorting tindakan / terapi items ── */
// ponytail: patterns checked in order — first match wins. Items that don't
// match any pattern sort last (weight 999). Add/remove patterns as needed.
const ITEM_PRIORITIES: { pattern: string; weight: number }[] = [
  { pattern: 'periksa.*dokter', weight: 1 },
  { pattern: 'konsultasi', weight: 2 },
  { pattern: 'tindakan utama', weight: 3 },
  { pattern: 'lab', weight: 10 },
  { pattern: 'glukosa', weight: 11 },
  { pattern: 'hba1c', weight: 12 },
  { pattern: 'hb a1c', weight: 12 },
];

function sortItemsByPriority(items: string[]): string[] {
  const regexCache = new Map<string, RegExp>();
  return [...items].sort((a, b) => {
    const weightOf = (item: string): number => {
      const lower = item.toLowerCase().trim();
      for (const p of ITEM_PRIORITIES) {
        if (!regexCache.has(p.pattern)) {
          regexCache.set(p.pattern, new RegExp(p.pattern, 'i'));
        }
        if (regexCache.get(p.pattern)!.test(lower)) return p.weight;
      }
      return 999;
    };
    return weightOf(a) - weightOf(b);
  });
}

function formatItemText(item: string): string {
  if (!item) return '';
  const t = item.trim();
  if (!t) return '';
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function formatAsList(items: string[]): string {
  return items.map(formatItemText).join('\n');
}

// ponytail: extract tindakan & terapi obat dari DOM halaman rincian cetak
function extractBillingFromDOM(): { tindakan: string; terapiPengobatan: string } {
  const container = document.getElementById('pembayaran-gabung') || document.body;
  const tindakanLines: string[] = [];
  const terapiLines: string[] = [];

  // ---------- Tindakan (ALL sections) ----------
  // Walk EVERY row in the billing table. Any row where the first cell is a
  // number (item index) is a line item. This catches LABORATORIUM, VISITE,
  // TINDAKAN, and any other section in a single pass.
  const allRows = container.querySelectorAll<HTMLTableRowElement>('tr');
  let inActionSection = false;
  for (const row of allRows) {
    const text = row.textContent?.trim() || '';

    // Detect section headers — bold elements mark new sections
    const bold = row.querySelector('b');
    if (bold && !text.match(/^\d/)) {
      inActionSection = true;
      continue;
    }

    // Detect "Total" / "Sub Total" rows — stop current section
    if (inActionSection && (text.includes('Total') || text.includes('Sub Total'))) {
      inActionSection = false;
      continue;
    }

    // If in an action section and row has a numbered first cell
    if (inActionSection) {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length >= 5 && cells[0]?.textContent?.trim().match(/^\d+\.?$/)) {
        const nama = cells[2]?.textContent?.trim() || '';
        const frek = cells[4]?.textContent?.trim() || '1';
        tindakanLines.push(frek && frek !== '1' ? `${nama} (${frek})` : nama);
      }
    }
  }

  // ---------- Obat (Terapi Pengobatan) ----------
  const resepHeader = Array.from(container.querySelectorAll('b')).find((b) =>
    b.textContent?.includes('Biaya Resep'),
  );
  if (resepHeader) {
    let row = resepHeader.closest('tr')?.nextElementSibling as HTMLTableRowElement | null;
    while (row && !row.textContent?.includes('Sub Total')) {
      if (row.getAttribute('valign') === 'top') {
        const cells = Array.from(row.querySelectorAll('td'));
        const raw = cells[1]?.textContent?.trim() || '';
        const match = raw.match(/^\d+\s+(.*)/);
        const nama = match ? match[1] : raw;
        const freq = cells[2]?.textContent?.trim() || '';
        terapiLines.push(freq ? `${nama} (${freq})` : nama);
      }
      row = row.nextElementSibling as HTMLTableRowElement | null;
    }
  }

  const sortedTindakan = sortItemsByPriority(tindakanLines);
  const sortedTerapi = sortItemsByPriority(terapiLines);

  console.log('[RJ] extracted billing lines:', {
    tindakanLines,
    terapiLines,
    sortedTindakan,
    sortedTerapi,
  });
  return {
    tindakan: formatAsList(sortedTindakan),
    terapiPengobatan: formatAsList(sortedTerapi),
  };
}

import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import type { ResumeData, DiagnosaRow, TindakanRow } from './types';

const isRj = location.pathname.includes('rm-rawat-jalan-new');

const AUTOCOMPLETE_URLS = {
  icd10: '/rekam-medik/search?opsi=kodeicd10&q=',
  icd9: '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=',
};

const ENDPOINT = '/rekam-medik/control/rm-rawat-jalan';

let reactRoot: Root | null = null;
let overlayBtn: HTMLButtonElement | null = null;

function parseResumeView(): ResumeData | null {
  const view = document.getElementById('resume-view');
  if (!view) return null;
  const txt = (label: string): string => {
    const rows = view.querySelectorAll('table table tr, fieldset table tr');
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent?.trim() === label && cells[i + 1]) {
          const next = cells[i + 1];
          const valCell = next.textContent?.trim() === ':' ? cells[i + 2] : next;
          return valCell?.textContent?.trim() || '';
        }
      }
    }
    return '';
  };

  const getFisik = (): string => {
    const fisik = Array.from(view.querySelectorAll('tr')).find((r) =>
      r.textContent?.includes('Hasil Pemeriksaan Fisik'),
    );
    if (!fisik) return '';
    const vtable = fisik.querySelector('td:last-child table, td[colspan] table');
    if (!vtable) return '';
    const lainnyaRow = Array.from(vtable.querySelectorAll('tr')).find((row) => {
      const cells = row.querySelectorAll('td');
      return Array.from(cells).some((c) => c.textContent?.trim() === 'Lainnya');
    });
    if (!lainnyaRow) return '';
    const cells = lainnyaRow.querySelectorAll('td');
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent?.trim() === 'Lainnya' && i + 2 < cells.length) {
        const raw = cells[i + 2]?.textContent?.trim() || '';
        const vitalPrefixes = [
          'Tensi:',
          'Nadi:',
          'Suhu:',
          'Nafas:',
          'Tinggi:',
          'Berat:',
          'Lainnya:',
        ];
        return raw
          .split('\n')
          .filter((line) => {
            const t = line.trim();
            return t && !vitalPrefixes.some((p) => t.startsWith(p));
          })
          .join('\n');
      }
    }
    return '';
  };

  const getVital = (label: string): string => {
    const fisik = Array.from(view.querySelectorAll('tr')).find((r) =>
      r.textContent?.includes('Hasil Pemeriksaan Fisik'),
    );
    if (!fisik) return '';
    const td = fisik.querySelector('td:last-child table, td[colspan] table');
    if (!td) return '';
    const rows = td.querySelectorAll('tr');
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent?.trim() === label && cells[i + 1]) {
          const next = cells[i + 1];
          const valCell = next.textContent?.trim() === ':' ? cells[i + 2] : next;
          return valCell?.textContent?.trim() || '';
        }
      }
    }
    return '';
  };

  const diagnosa: DiagnosaRow[] = [];
  const icdSection = Array.from(view.querySelectorAll('tr')).find((r) =>
    r.textContent?.includes('ICD X'),
  );
  if (icdSection) {
    const icdTable = icdSection.querySelector('td:last-child table, td[colspan] table');
    if (icdTable) {
      const items = icdTable.querySelectorAll('tr');
      for (const item of items) {
        const text = item.textContent?.trim() || '';
        const m = text.match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/);
        if (m) {
          diagnosa.push({ idicd: '', kode10: m[2], namaDiagnosa: m[1], kasus: '', komplikasi: '' });
        }
      }
    }
  }

  const tindakan: TindakanRow[] = [];

  return {
    patientInfo: {
      norm: txt('No. Rekam Medis'),
      pasien: txt('Nama Pasien'),
      nama_dokter: '',
    },
    clinicalNotes: {
      anamnesa: txt('Anamnesa'),
      pemeriksaan_fisik: getFisik(),
      catatan: txt('Diagnosa'),
      tindakan: txt('Tindakan'),
      terapi_pengobatan: txt('Terapi Pengobatan'),
    },
    vitalSigns: {
      tensi: getVital('Tensi'),
      nadi: getVital('Nadi'),
      suhu: getVital('Suhu'),
      nafas: getVital('Nafas'),
      tinggi: getVital('Tinggi'),
      berat: getVital('Berat'),
    },
    diagnosa,
    tindakan,
  };
}

function extractFormData(): ResumeData {
  console.log('[RJ] extractFormData — path:', location.pathname);
  const fromView = parseResumeView();

  const doc = document;
  const getVal = (id: string) => (doc.getElementById(id) as HTMLInputElement)?.value || '';
  const getField = (name: string) => {
    const el = doc.querySelector(
      `textarea[name="${name}"], input[name="${name}"], #${name}, select[name="${name}"]`,
    ) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (!el) return '';
    if ('tagName' in el && el.tagName === 'SELECT') return (el as HTMLSelectElement).value;
    return (el as HTMLInputElement | HTMLTextAreaElement).value || '';
  };
  const getRadio = (name: string): string => {
    const checked = doc.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null;
    return checked?.value || '';
  };

  const patientInfo = {
    norm: getVal('norm') || getVal('no_rm'),
    pasien: getVal('pasien') || getVal('nama_pasien'),
    nama_dokter: getVal('nama_dokter') || getVal('dokter'),
    id_visit:
      getVal('id_visit') ||
      new URLSearchParams(location.search).get('id_visit') ||
      (typeof cachedFormState?.['id_visit'] === 'string'
        ? (cachedFormState['id_visit'] as string)
        : ''),
    id_rawat_jalan:
      getVal('id_rawat_jalan') ||
      new URLSearchParams(location.search).get('id') ||
      (typeof cachedFormState?.['id_rawat_jalan'] === 'string'
        ? (cachedFormState['id_rawat_jalan'] as string)
        : ''),
    id_user:
      getVal('id_user') ||
      (typeof cachedFormState?.['id_user'] === 'string'
        ? (cachedFormState['id_user'] as string)
        : '') ||
      '1',
    id_dokter:
      getVal('id_dokter') ||
      (typeof cachedFormState?.['id_dokter'] === 'string'
        ? (cachedFormState['id_dokter'] as string)
        : ''),
    id_bed:
      getVal('id_bed') ||
      (typeof cachedFormState?.['id_bed'] === 'string'
        ? (cachedFormState['id_bed'] as string)
        : ''),
    noregis:
      getVal('noregis') ||
      (typeof cachedFormState?.['noregis'] === 'string'
        ? (cachedFormState['noregis'] as string)
        : ''),
  };

  const clinicalNotes = {
    anamnesa: getField('anamnesa'),
    pemeriksaan_fisik:
      getField('pemeriksaan_fisik') || getField('pemeriksaan') || getField('fisik') || '',
    catatan: getField('catatan') || '',
    tindakan: getField('tindakan') || getField('namaTindakan'),
    terapi_pengobatan: getField('terapi_pengobatan') || '',
    jenis_kasus: getField('jenis_kasus'),
    status_kasus: getRadio('status_kasus'),
    tindak_lanjut: getField('tindak_lanjut'),
  };

  const vitalSigns = {
    tensi: getVal('tensi'),
    nadi: getVal('nadi'),
    suhu: getVal('suhu'),
    nafas: getVal('nafas'),
    tinggi: getVal('tinggi'),
    berat: getVal('berat'),
  };

  const diagnosa: DiagnosaRow[] = [];
  const kode10Inputs = doc.querySelectorAll<HTMLInputElement>(
    'input[name="kode10[]"], input[name="kode[]"]',
  );
  if (kode10Inputs.length === 0) {
    let i = 1;
    while (
      doc.getElementById(`kode${i}`) ||
      doc.querySelector(`input[name="kode10[]"]:nth-child(${i})`)
    ) {
      const idicd = getVal(`idicd${i}`) || '';
      const kode10 = getVal(`kode${i}`) || '';
      const nama = getVal(`nama${i}`) || '';
      if (kode10 || nama)
        diagnosa.push({ idicd, kode10, namaDiagnosa: nama, kasus: '', komplikasi: '' });
      i++;
    }
  } else {
    kode10Inputs.forEach((inp) => {
      const row = inp.closest('tr');
      if (!row) return;
      const idicd =
        row.querySelector<HTMLInputElement>('input[name="idicd[]"], input[name="idicd"]')?.value ||
        '';
      const kode10 = inp.value || '';
      const nama =
        row.querySelector<HTMLInputElement>('input[name="namaDiagnosa[]"], input[name="nama[]"]')
          ?.value || '';
      const kasus = row.querySelector<HTMLSelectElement>('select[name="kasus[]"]')?.value || '';
      const komplikasi =
        row.querySelector<HTMLSelectElement>('select[name="komplikasi[]"]')?.value || '';
      if (kode10 || nama) {
        diagnosa.push({ idicd, kode10, namaDiagnosa: nama, kasus, komplikasi });
      }
    });
  }

  if (diagnosa.length === 0 && cachedFormState) {
    const cKode10 = Array.isArray(cachedFormState['kode10[]']) ? cachedFormState['kode10[]'] : [];
    const cNama = Array.isArray(cachedFormState['nama[]']) ? cachedFormState['nama[]'] : [];
    const cIdicd = Array.isArray(cachedFormState['idicd[]']) ? cachedFormState['idicd[]'] : [];
    const cKasus = Array.isArray(cachedFormState['kasus_diagnosa[]'])
      ? cachedFormState['kasus_diagnosa[]']
      : [];
    const cKomplikasi = Array.isArray(cachedFormState['komplikasi[]'])
      ? cachedFormState['komplikasi[]']
      : [];
    cKode10.forEach((kode10, i) => {
      if (kode10) {
        diagnosa.push({
          idicd: cIdicd[i] || '',
          kode10,
          namaDiagnosa: cNama[i] || '',
          kasus: cKasus[i] || '',
          komplikasi: cKomplikasi[i] || '',
        });
      }
    });
  }

  const tindakan: TindakanRow[] = [];
  const kode9Inputs = doc.querySelectorAll<HTMLInputElement>('input[name="kode9[]"]');
  kode9Inputs.forEach((inp) => {
    const row = inp.closest('tr');
    if (!row) return;
    const kode9 = inp.value || '';
    if (!kode9) return;
    const idicd = row.querySelector<HTMLInputElement>('input[name="idicdTindakan[]"]')?.value || '';
    const nama = row.querySelector<HTMLInputElement>('input[name="namaTindakan[]"]')?.value || '';
    const komorbid = row.querySelector<HTMLSelectElement>('select[name="komorbid[]"]')?.value || '';
    const kategori =
      row.querySelector<HTMLSelectElement>('select[name="kategoriProsedur[]"]')?.value || '';
    const snomed =
      row.querySelector<HTMLInputElement>('input[name="snomedProsedur[]"]')?.value || '';
    const codeProsedur =
      row.querySelector<HTMLInputElement>('input[name="codeProsedur[]"]')?.value || kode9;
    tindakan.push({
      idicdTindakan: idicd,
      kode9,
      namaTindakan: nama,
      komorbid,
      kategoriProsedur: kategori,
      snomedProsedur: snomed,
      codeProsedur,
    });
  });
  if (tindakan.length === 0 && cachedFormState) {
    const cKode9 = Array.isArray(cachedFormState['kode9[]']) ? cachedFormState['kode9[]'] : [];
    const cNamaT = Array.isArray(cachedFormState['namaTindakan[]'])
      ? cachedFormState['namaTindakan[]']
      : [];
    const cIdicdT = Array.isArray(cachedFormState['idicdTindakan[]'])
      ? cachedFormState['idicdTindakan[]']
      : [];
    const cKomorbid = Array.isArray(cachedFormState['komorbid[]'])
      ? cachedFormState['komorbid[]']
      : [];
    const cKategori = Array.isArray(cachedFormState['kategoriProsedur[]'])
      ? cachedFormState['kategoriProsedur[]']
      : [];
    cKode9.forEach((kode9, i) => {
      if (kode9) {
        tindakan.push({
          idicdTindakan: cIdicdT[i] || '',
          kode9,
          namaTindakan: cNamaT[i] || '',
          komorbid: cKomorbid[i] || '',
          kategoriProsedur: cKategori[i] || '',
        });
      }
    });
  }

  if (fromView) {
    patientInfo.norm = patientInfo.norm || fromView.patientInfo.norm;
    patientInfo.pasien = patientInfo.pasien || fromView.patientInfo.pasien;
    patientInfo.nama_dokter = patientInfo.nama_dokter || fromView.patientInfo.nama_dokter;

    clinicalNotes.anamnesa = clinicalNotes.anamnesa || fromView.clinicalNotes.anamnesa;
    clinicalNotes.pemeriksaan_fisik =
      clinicalNotes.pemeriksaan_fisik || fromView.clinicalNotes.pemeriksaan_fisik;
    clinicalNotes.catatan = clinicalNotes.catatan || fromView.clinicalNotes.catatan;
    clinicalNotes.tindakan = clinicalNotes.tindakan || fromView.clinicalNotes.tindakan;
    clinicalNotes.terapi_pengobatan =
      clinicalNotes.terapi_pengobatan || fromView.clinicalNotes.terapi_pengobatan;

    vitalSigns.tensi = vitalSigns.tensi || fromView.vitalSigns.tensi;
    vitalSigns.nadi = vitalSigns.nadi || fromView.vitalSigns.nadi;
    vitalSigns.suhu = vitalSigns.suhu || fromView.vitalSigns.suhu;
    vitalSigns.nafas = vitalSigns.nafas || fromView.vitalSigns.nafas;
    vitalSigns.tinggi = vitalSigns.tinggi || fromView.vitalSigns.tinggi;
    vitalSigns.berat = vitalSigns.berat || fromView.vitalSigns.berat;
    if (diagnosa.length === 0) diagnosa.push(...fromView.diagnosa);
    if (tindakan.length === 0) tindakan.push(...fromView.tindakan);
  }

  if (
    !clinicalNotes.tindakan ||
    clinicalNotes.tindakan === '-' ||
    !clinicalNotes.terapi_pengobatan ||
    clinicalNotes.terapi_pengobatan === '-'
  ) {
    const billing = extractBillingFromDOM();
    if (billing.tindakan && (!clinicalNotes.tindakan || clinicalNotes.tindakan === '-')) {
      clinicalNotes.tindakan = billing.tindakan;
    }
    if (
      billing.terapiPengobatan &&
      (!clinicalNotes.terapi_pengobatan || clinicalNotes.terapi_pengobatan === '-')
    ) {
      clinicalNotes.terapi_pengobatan = billing.terapiPengobatan;
    }
  }

  if (cachedFormState) {
    const noteFields: Record<string, string> = {
      anamnesa: clinicalNotes.anamnesa,
      pemeriksaan_fisik: clinicalNotes.pemeriksaan_fisik,
      catatan: clinicalNotes.catatan,
      tindakan: clinicalNotes.tindakan,
      terapi_pengobatan: clinicalNotes.terapi_pengobatan,
    };
    for (const [key, val] of Object.entries(noteFields)) {
      if (!val || val === '-') {
        const cached = cachedFormState[key];
        if (typeof cached === 'string' && cached) clinicalNotes[key] = cached;
      }
    }
  }

  return { patientInfo, clinicalNotes, vitalSigns, diagnosa, tindakan };
}

function serializeKlaim(data: ResumeData): string {
  const pairs: [string, string][] = [];
  const add = (name: string, value: string | number) => pairs.push([name, String(value)]);

  [
    'id_visit',
    'id_rawat_jalan',
    'id_dokter',
    'id_bed',
    'noregis',
    'norm',
    'pasien',
    'nama_dokter',
    'id_user',
  ].forEach((name) => {
    const el = document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
    if (el?.value) add(name, el.value);
  });

  const dokterEl = document.querySelector('input[name="nama_dokter"]') as HTMLInputElement | null;
  if (dokterEl?.value) add('nama_dokter', dokterEl.value);

  const jenisKasusEl = document.querySelector(
    'select[name="jenis_kasus"]',
  ) as HTMLSelectElement | null;
  if (jenisKasusEl?.value) add('jenis_kasus', jenisKasusEl.value);

  const tindakLanjutEl = document.querySelector(
    'select[name="tindak_lanjut"]',
  ) as HTMLSelectElement | null;
  if (tindakLanjutEl?.value) add('tindak_lanjut', tindakLanjutEl.value);

  const statusKasusEl = document.querySelector(
    'input[name="status_kasus"]:checked',
  ) as HTMLInputElement | null;
  if (statusKasusEl?.value) add('status_kasus', statusKasusEl.value);

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  add(
    'waktu',
    `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  );

  const noteFields: Record<string, string> = {
    anamnesa: data.clinicalNotes.anamnesa,
    pemeriksaan_fisik: data.clinicalNotes.pemeriksaan_fisik,
    catatan: data.clinicalNotes.catatan,
    tindakan: data.clinicalNotes.tindakan,
    terapi_pengobatan: data.clinicalNotes.terapi_pengobatan,
  };
  Object.entries(noteFields).forEach(([name, val]) => {
    if (val) add(name, val);
  });

  const vitalFields: Record<string, string> = {
    tensi: data.vitalSigns.tensi,
    nadi: data.vitalSigns.nadi,
    suhu: data.vitalSigns.suhu,
    nafas: data.vitalSigns.nafas,
    tinggi: data.vitalSigns.tinggi,
    berat: data.vitalSigns.berat,
  };
  Object.entries(vitalFields).forEach(([name, val]) => {
    if (val) add(name, val);
  });

  data.diagnosa.forEach((d) => {
    add('idicd[]', d.idicd);
    add('kode10[]', d.kode10);
    add('namaDiagnosa[]', d.namaDiagnosa);
    add('kasus[]', d.kasus);
    add('komplikasi[]', d.komplikasi);
  });

  data.tindakan.forEach((t) => {
    add('idicdTindakan[]', t.idicdTindakan);
    add('kode9[]', t.kode9);
    add('namaTindakan[]', t.namaTindakan);
  });

  add('save', 'Simpan');
  return pairs.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
}

function serializeRawatJalan(data: ResumeData): string {
  const pairs: [string, string][] = [];
  const add = (name: string, value: string | number) => pairs.push([name, String(value)]);

  if (!cachedFormState?.['id_bed'])
    console.log('[RJ] MISS id_bed — cfs keys:', Object.keys(cachedFormState || {}).join(','));

  const el = (name: string) =>
    (document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null)?.value || '';
  const sel = (id: string) =>
    (document.getElementById(id) as HTMLSelectElement | null)?.value || '';
  const radioChecked = (name: string) =>
    (document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null)?.value ||
    '';
  const fs = (name: string) => {
    const val =
      typeof cachedFormState?.[name] === 'string' ? (cachedFormState[name] as string) : '';
    return val;
  };

  const pi = (name: string) =>
    (data.patientInfo as Record<string, string | undefined>)?.[name] || '';
  add(
    'id_visit',
    pi('id_visit') ||
      el('id_visit') ||
      new URLSearchParams(location.search).get('id_visit') ||
      fs('id_visit'),
  );
  add(
    'id_rawat_jalan',
    pi('id_rawat_jalan') ||
      el('id_rawat_jalan') ||
      new URLSearchParams(location.search).get('id') ||
      fs('id_rawat_jalan'),
  );
  add('id_user', pi('id_user') || el('id_user') || fs('id_user') || '1');
  add('id_dokter', pi('id_dokter') || el('id_dokter') || fs('id_dokter') || '');
  add('id_bed', pi('id_bed') || el('id_bed') || fs('id_bed') || '');
  if (!pi('id_bed') && !el('id_bed') && !fs('id_bed')) console.log('[RJ] id_bed STILL empty');
  add('norm', pi('norm') || el('norm') || fs('norm') || '');
  add('noregis', pi('noregis') || el('noregis') || fs('noregis') || '');
  add('pasien', pi('pasien') || el('pasien') || fs('pasien') || '');
  add('nama_dokter', pi('nama_dokter') || el('nama_dokter') || fs('nama_dokter') || '');

  add('jenis_kasus', sel('jenis_kasus') || fs('jenis_kasus') || '');
  add('tindak_lanjut', sel('tindak_lanjut') || fs('tindak_lanjut') || '');
  add('status_kasus', radioChecked('status_kasus') || fs('status_kasus') || 'BARU');
  add('rujukan', sel('rujukan') || fs('rujukan') || '83');
  add('keadaan_keluar', sel('keadaan_keluar') || fs('keadaan_keluar') || '87');
  add('cara_keluar', sel('cara_keluar') || fs('cara_keluar') || '161');
  add('pemeriksaan_lanjut', sel('pemeriksaan_lanjut') || fs('pemeriksaan_lanjut') || '88');
  add('pulang_berkas', el('pulang_berkas') || fs('pulang_berkas') || '');
  add(
    'composition_diet',
    el('composition_diet') ||
      (document.getElementById('composition_diet') as HTMLTextAreaElement | null)?.value ||
      fs('composition_diet') ||
      '',
  );
  add('alergiMakananJSON', el('alergiMakananJSON') || fs('alergiMakananJSON') || '[]');
  add('alergiLingkunganJSON', el('alergiLingkunganJSON') || fs('alergiLingkunganJSON') || '[]');

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  add(
    'waktu',
    `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
  );

  const toHtml = (val: string) => val.replace(/\n/g, '<br/>');
  add('anamnesa', toHtml(data.clinicalNotes.anamnesa));
  add('pemeriksaan_fisik', toHtml(data.clinicalNotes.pemeriksaan_fisik));
  add('catatan', toHtml(data.clinicalNotes.catatan));
  add('tindakan', toHtml(data.clinicalNotes.tindakan));
  add('terapi_pengobatan', toHtml(data.clinicalNotes.terapi_pengobatan));

  const cleanVital = (val: string): string => val.match(/^([\d/.]+)/)?.[0] || '';
  add('tensi', cleanVital(data.vitalSigns.tensi));
  add('nadi', cleanVital(data.vitalSigns.nadi));
  add('suhu', cleanVital(data.vitalSigns.suhu));
  add('nafas', cleanVital(data.vitalSigns.nafas));
  add('tinggi', cleanVital(data.vitalSigns.tinggi));
  add('berat', cleanVital(data.vitalSigns.berat));

  const cachedArr = (name: string): string[] =>
    Array.isArray(cachedFormState?.[name]) ? (cachedFormState![name] as string[]) : [];
  const cKode10 = cachedArr('kode10[]');
  const cIdicd = cachedArr('idicd[]');
  const cKasus = cachedArr('kasus_diagnosa[]');
  const cKomplikasi = cachedArr('komplikasi[]');
  const cleanDiagnosa = data.diagnosa
    .filter((d) => d.idicd?.trim() && d.kode10?.trim() && d.namaDiagnosa?.trim())
    .filter((d, i, arr) => arr.findIndex((x) => x.idicd === d.idicd) === i);
  cleanDiagnosa.forEach((d) => {
    let idicd = d.idicd;
    if (!idicd && d.kode10) {
      const idx = cKode10.indexOf(d.kode10);
      if (idx >= 0 && cIdicd[idx]) idicd = cIdicd[idx];
    }
    add('nama[]', d.namaDiagnosa);
    add('idicd[]', idicd);
    add('kode10[]', d.kode10);
    add('kasus_diagnosa[]', d.kasus || '');
    add('komplikasi[]', d.komplikasi || '');
  });

  const cleanTindakan = data.tindakan
    .filter((t) => t.idicdTindakan?.trim() && t.kode9?.trim() && t.namaTindakan?.trim())
    .filter(
      (t, i, arr) =>
        arr.findIndex((x) => x.idicdTindakan === t.idicdTindakan && x.kode9 === t.kode9) === i,
    );
  cleanTindakan.forEach((t) => {
    add('namaTindakan[]', t.namaTindakan);
    add('kode9[]', t.kode9);
    add('idicdTindakan[]', t.idicdTindakan);
    add('kategoriProsedur[]', t.kategoriProsedur || '');
    add('komorbid[]', t.komorbid || '');
    add('snomedProsedur[]', t.snomedProsedur || '');
    add('codeProsedur[]', t.codeProsedur || '');
  });

  add('save', 'Simpan');
  return pairs.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
}

function serializeFormData(data: ResumeData): string {
  return serializeRawatJalan(data);
}

function closeOverlay(container: HTMLElement) {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  container.innerHTML = '';
  container.style.display = 'none';
  document.body.classList.remove('ext-resume-open');
  if (overlayBtn) overlayBtn.disabled = false;
}

function mountReactApp(container: HTMLElement, data: ResumeData) {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  container.innerHTML = '';

  if (!document.getElementById('morbis-resume-fonts')) {
    const link = document.createElement('link');
    link.id = 'morbis-resume-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  if (!document.getElementById('morbis-resume-css')) {
    const s = document.createElement('style');
    s.id = 'morbis-resume-css';
    s.textContent =
      (typeof SHADOW_CSS !== 'undefined' ? SHADOW_CSS : '') +
      `
      /* ── Reset host-page overrides inside the modal ── */
      /* ponytail: specificity 0-2-0 beats most host styles without !important */
      .resume-modal .resume-modal {
        background: #f8f6f3;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(0,0,0,.3);
        width: 94%;
        max-width: 900px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: resume-slideup .3s ease;
        font-size: 16px;
        line-height: 1.6;
        color: #1a1d23;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
      }
      .resume-modal .resume-modal *,
      .resume-modal .resume-modal *::before,
      .resume-modal .resume-modal *::after {
        box-sizing: border-box;
      }
      /* Neutralize host page button/input/select/textarea defaults */
      .resume-modal .resume-modal button,
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
      }
      .resume-modal .resume-modal button {
        cursor: pointer;
        min-height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap;
        border-radius: 6px;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        padding: 4px 10px;
        transition: background-color 0.15s, color 0.15s;
      }
      .resume-modal .resume-modal button:disabled {
        pointer-events: none;
        opacity: 0.5;
      }
      .resume-modal .resume-modal input,
      .resume-modal .resume-modal select,
      .resume-modal .resume-modal textarea {
        height: auto;
        min-height: 32px;
        width: 100%;
        border: 1px solid hsl(214.3 31.8% 91.4%);
        border-radius: 6px;
        background: white;
        padding: 4px 10px;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .resume-modal .resume-modal input:focus,
      .resume-modal .resume-modal select:focus,
      .resume-modal .resume-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .resume-modal .resume-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .resume-modal .resume-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .resume-modal .resume-modal h1,
      .resume-modal .resume-modal h2,
      .resume-modal .resume-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
      /* ── Radix Select portal (renders outside .resume-modal) ── */
      [data-radix-select-viewport] {
        padding: 4px;
      }
      [data-radix-select-viewport] [role="option"] {
        all: unset;
        display: flex;
        align-items: center;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        line-height: 18px;
        font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
        color: #1a1d23;
      }
      [data-radix-select-viewport] [role="option"]:focus,
      [data-radix-select-viewport] [role="option"][data-highlighted] {
        background: hsl(210 40% 96.1%);
        color: hsl(222.2 47.4% 11.2%);
      }
      [data-radix-popper-content-wrapper] {
        z-index: 2147483646 !important;
      }
      @keyframes resume-slideup { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
    `;
    document.head.appendChild(s);
  }

  reactRoot = createRoot(container);

  const handleSave = async (resumeData: ResumeData): Promise<void> => {
    const body = serializeFormData(resumeData);
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'same-origin',
    });
    const text = await response.text();
    if (!response.ok) {
      console.error('[RJ] save failed:', response.status, text);
      throw new Error('HTTP ' + response.status);
    }
    const phpPattern =
      /(?:<b>)?(?:Notice|Warning|Fatal error|Parse error|Catchable fatal error)(?:<\/b>)?\s*:\s*[^<]*/gi;
    const phpErrors: string[] = [];
    let m;
    while ((m = phpPattern.exec(text)) !== null) {
      let line = m[0].trim().replace(/<[^>]+>/g, '');
      if (!line) continue;
      if (/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(line))
        continue;
      phpErrors.push(line);
    }
    if (phpErrors.length > 0) {
      console.error('[RJ] PHP errors:', phpErrors);
      throw new Error(phpErrors.join('\n'));
    }
    cachedFormState = null;
  };

  reactRoot.render(
    <ErrorBoundary onError={() => setTimeout(() => closeOverlay(container), 0)}>
      <App data={data} onSave={handleSave} onClose={() => closeOverlay(container)} />
    </ErrorBoundary>,
  );

  document.body.classList.add('ext-resume-open');

  setTimeout(() => {
    container.querySelectorAll('textarea').forEach((tx) => {
      tx.style.height = 'auto';
      tx.style.height = tx.scrollHeight + 'px';
      tx.addEventListener('input', () => {
        tx.style.height = 'auto';
        tx.style.height = tx.scrollHeight + 'px';
      });
    });
  }, 50);
}

let cachedFormState: Record<string, string | string[]> | null = null;

async function fetchFormState(): Promise<Record<string, string | string[]>> {
  const idVisit = new URLSearchParams(location.search).get('id_visit');
  if (!idVisit) return {};

  const url = `${location.origin}/rekam-medik/rm-rawat-jalan-new?id_visit=${idVisit}`;
  try {
    const resp = await fetch(url, { credentials: 'same-origin' });
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const state: Record<string, string | string[]> = {};

    doc
      .querySelectorAll<HTMLInputElement>('input[type="hidden"], input[type="text"]')
      .forEach((el) => {
        if (el.name && !el.name.endsWith('[]')) state[el.name] = el.value;
      });

    doc.querySelectorAll<HTMLTextAreaElement>('textarea').forEach((el) => {
      if (el.name) state[el.name] = el.value;
    });

    doc.querySelectorAll<HTMLSelectElement>('select').forEach((el) => {
      if (el.id) state[el.id] = el.value;
      if (el.name) {
        if (el.name.endsWith('[]')) {
          if (!Array.isArray(state[el.name])) state[el.name] = [];
          (state[el.name] as string[]).push(el.value);
        } else {
          state[el.name] = el.value;
        }
      }
    });

    doc.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked').forEach((el) => {
      if (el.name) state[el.name] = el.value;
    });

    const arrayNames = new Set<string>();
    doc.querySelectorAll<HTMLInputElement>('input[name$="[]"]').forEach((el) => {
      if (el.name) arrayNames.add(el.name);
    });
    for (const name of arrayNames) {
      const values: string[] = [];
      doc.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`).forEach((el) => {
        if (el.value) values.push(el.value);
      });
      if (values.length > 0) state[name] = values;
    }

    return state;
  } catch (e) {
    console.error('[RJ] failed to fetch form state:', e);
    return {};
  }
}

function findAllResepIdsFromPage(): string[] {
  const ids: string[] = [];
  for (const el of document.querySelectorAll('p, td')) {
    const m = el.textContent?.trim().match(/No Resep\s*:\s*(\d+)/i);
    if (m && !ids.includes(m[1])) ids.push(m[1]);
  }
  return ids;
}

async function parseResepTable(url: string): Promise<string[]> {
  const resp = await fetch(url, { credentials: 'same-origin' });
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const headers = doc.querySelectorAll('h5');
  let tebusHeader: Element | null = null;
  for (const h of headers) {
    if (h.textContent?.trim() === 'Resep yang ditebus') {
      tebusHeader = h;
      break;
    }
  }
  if (!tebusHeader) return [];
  let table = tebusHeader.nextElementSibling;
  while (table && table.tagName !== 'TABLE') table = table.nextElementSibling;
  if (!table) return [];
  const lines: string[] = [];
  const rows = table.querySelectorAll('tr');
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length < 8) continue;
    const nama = cells[1]?.textContent?.trim();
    const aturan = cells[7]?.textContent?.trim();
    const jumlah = cells[5]?.textContent?.trim();
    if (nama) lines.push(`${nama} - ${aturan || '-'}`);
  }
  return lines;
}

async function fetchAllPrescriptionHistories(): Promise<string | null> {
  const resepIds = findAllResepIdsFromPage();
  if (!resepIds.length) return null;
  const results = await Promise.all(
    resepIds.map((id) => {
      const url = `${location.origin}/admisi/pelaksanaan_pelayanan/history/resep?id=${id}`;
      return parseResepTable(url);
    }),
  );
  const seen = new Set<string>();
  const allLines: string[] = [];
  for (const lines of results) {
    for (const line of lines) {
      const nama = line.split(' - ')[0];
      if (!seen.has(nama)) {
        seen.add(nama);
        allLines.push(line);
      }
    }
  }
  return allLines.length ? allLines.join('\n') : null;
}

function setupFloatingButton() {
  const targetPage = '/v2/m-klaim/detail-v2-refaktor';
  if (!location.href.startsWith(location.origin + targetPage)) {
    return;
  }

  const urlParams = new URLSearchParams(location.search);
  if (!urlParams.has('id_visit')) {
    return;
  }
  const jenis =
    document.querySelector<HTMLInputElement>('input[name=jenis]')?.value ??
    document.querySelector<HTMLSelectElement>('select[name=jenis]')?.value ??
    '';
  if (jenis.toUpperCase().includes('INAP')) {
    return;
  }
  if (document.getElementById('ext-resume-float-btn')) return;

  const container = document.createElement('div');
  container.id = 'ext-resume-container';
  container.style.cssText =
    'position: fixed; inset: 0; z-index: 1000; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;';
  document.body.appendChild(container);

  const btn = document.createElement('button');
  overlayBtn = btn;
  btn.id = 'ext-resume-float-btn';
  btn.textContent = 'RJ';
  btn.title = 'Resume Rajal';
  btn.style.cssText =
    'position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;' +
    'width:48px;height:48px;border-radius:12px;border:none;' +
    'background:#2b5f8a;color:white;font-size:14px;font-weight:700;' +
    'cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);' +
    'transition:transform .15s,box-shadow .15s;';
  btn.onmouseenter = () => {
    btn.style.transform = 'translateY(-50%) scale(1.05)';
    btn.style.boxShadow = '0 4px 16px rgba(43,95,138,.35)';
  };
  btn.onmouseleave = () => {
    btn.style.transform = 'translateY(-50%)';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)';
  };

  btn.addEventListener('click', async () => {
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      if (!cachedFormState) {
        cachedFormState = await fetchFormState();
      }
      const prescriptionText = await fetchAllPrescriptionHistories();
      const data = extractFormData();
      if (prescriptionText) data.clinicalNotes.terapi_pengobatan = prescriptionText;
      const needTindakan = !data.clinicalNotes.tindakan || data.clinicalNotes.tindakan === '-';
      const needTerapi =
        !data.clinicalNotes.terapi_pengobatan || data.clinicalNotes.terapi_pengobatan === '-';
      if (needTindakan || needTerapi) {
        const billing = extractBillingFromDOM();
        if (billing.tindakan && needTindakan) {
          data.clinicalNotes.tindakan = billing.tindakan;
        }
        if (billing.terapiPengobatan && needTerapi) {
          data.clinicalNotes.terapi_pengobatan = billing.terapiPengobatan;
        }
      }
      container.style.display = 'flex';
      mountReactApp(container, data);
    } catch (e) {
      console.error('[RJ] click error:', e);
      container.style.display = 'none';
      btn.disabled = false;
    }
  });

  document.body.appendChild(btn);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.style.display === 'block') {
      closeOverlay(container);
    }
  });
}

function isFeatureEnabled(): boolean {
  // MAIN world tidak punya chrome.storage (dulu catch → return true = SELALU aktif).
  // Gate via attribute yang di-set init.ts (isolated) berdasarkan config + role.
  return document.documentElement.getAttribute('data-ext-resume-modal') === '1';
}

function isLoginPage(): boolean {
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  return (
    loginPaths.some((p) => location.pathname.toLowerCase().includes(p)) ||
    document.querySelectorAll('input[type="password"]').length > 0
  );
}

(() => {
  if (!isFeatureEnabled()) return;
  if (isLoginPage()) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFloatingButton);
  } else {
    setupFloatingButton();
  }
})();

export {};
