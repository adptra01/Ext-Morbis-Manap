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
        terapiLines.push(freq ? `${nama} Jml: ${freq}` : nama);
      }
      row = row.nextElementSibling as HTMLTableRowElement | null;
    }
  }

  const sortedTindakan = sortItemsByPriority(tindakanLines);
  const sortedTerapi = sortItemsByPriority(terapiLines);

  return {
    tindakan: formatAsList(sortedTindakan),
    terapiPengobatan: formatAsList(sortedTerapi),
  };
}

import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import type { ResumeData, DiagnosaRow, TindakanRow } from './types';
import { logResumeHistory, loadLast } from '../shared/resumeHistory.js';
import { resumeDataToSnap } from './snap.js';
import { restoreBreaks } from '../shared/noteText.js';

const isRj = location.pathname.includes('rm-rawat-jalan-new');

const AUTOCOMPLETE_URLS = {
  icd10: '/rekam-medik/search?opsi=kodeicd10&q=',
  icd9: '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=',
};

// Endpoint WAJIB sama dengan `action` form asli SIMRS. Verified live di
// /rekam-medik/rm-rawat-jalan-new?id=<id_rawat_jalan>&id_visit=<id_visit>:
//   <form action="/rekam-medik/control/rm-rawat-jalan" method="POST"
//         onsubmit="return cekForm()">     <- form TANPA atribut id
//   <input type="submit" name="save" value="Simpan" id="save">
// Submit form biasa -> `save=Simpan` ikut terkirim; controller membacanya
// dari $_POST['save']. Balasan = HTML (redirect ke daftar RJ), bukan JSON.
// PENTING: path-nya `rm-rawat-jalan` (DASH). Varian tanpa dash
// `/rekam-medik/control/rm-rawatjalan` dan `/rekam-medik/control/rm-rawat`
// sama-sama 404 (dicek via GET di sesi login) — jangan dipakai.
// Riwayat: endpoint `admisi/.../control/rm-rawat-jalan-refaktor?sub=simpan`
// (kontrak JSON) sudah tidak dipakai — bukan yang dipakai form asli.
const ENDPOINT = '/rekam-medik/control/rm-rawat-jalan';

let reactRoot: Root | null = null;
let overlayBtn: HTMLButtonElement | null = null;

function parseResumeView(): ResumeData | null {
  const view = document.getElementById('resume-view');
  if (!view) return null;
  // Baca teks SEL view dengan `<br>` → `\n` (jangan diratakan jadi satu
  // baris panjang seperti `textContent`). Mengganti elemen `<br>` dengan
  // `\n` di string HTML dulu; literal `<br/>` sisa korupsi lama pun ikut
  // menjadi `\n` (idempoten untuk `\n` yang sudah benar).
  const viewCellText = (el: Element): string => {
    if (!el) return '';
    const tmp = document.createElement('div');
    const html = (el.innerHTML || '').replace(/<\s*br\s*\/?\s*>/gi, '\n');
    tmp.innerHTML = html;
    return (tmp.textContent || '').trim();
  };
  const txt = (label: string): string => {
    const rows = view.querySelectorAll('table table tr, fieldset table tr');
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent?.trim() === label && cells[i + 1]) {
          const next = cells[i + 1];
          const valCell = next.textContent?.trim() === ':' ? cells[i + 2] : next;
          return valCell ? viewCellText(valCell) : '';
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
        const raw = viewCellText(cells[i + 2]);
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
    anamnesa: restoreBreaks(getField('anamnesa')),
    pemeriksaan_fisik: restoreBreaks(
      getField('pemeriksaan_fisik') || getField('pemeriksaan') || getField('fisik') || '',
    ),
    catatan: restoreBreaks(getField('catatan') || ''),
    tindakan: restoreBreaks(getField('tindakan') || getField('namaTindakan')),
    terapi_pengobatan: restoreBreaks(getField('terapi_pengobatan') || ''),
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
      // Form asli memakai `kasus_diagnosa[]` (bukan `kasus[]`) —
      // tanpa selector ini nilai kasus selalu kosong.
      const kasus =
        row.querySelector<HTMLSelectElement>(
          'select[name="kasus_diagnosa[]"], select[name="kasus[]"]',
        )?.value || '';
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
    const codeP = row.querySelector<HTMLInputElement>('input[name="codeProsedur[]"]')?.value || '';
    tindakan.push({
      idicdTindakan: idicd,
      kode9,
      namaTindakan: nama,
      komorbid,
      kategoriProsedur: kategori,
      snomedProsedur: snomed,
      codeProsedur: codeP,
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
    const cSnomed = Array.isArray(cachedFormState['snomedProsedur[]'])
      ? cachedFormState['snomedProsedur[]']
      : [];
    const cCodeP = Array.isArray(cachedFormState['codeProsedur[]'])
      ? cachedFormState['codeProsedur[]']
      : [];
    cKode9.forEach((kode9, i) => {
      if (kode9) {
        tindakan.push({
          idicdTindakan: cIdicdT[i] || '',
          kode9,
          namaTindakan: cNamaT[i] || '',
          komorbid: cKomorbid[i] || '',
          kategoriProsedur: cKategori[i] || '',
          snomedProsedur: cSnomed[i] || '',
          codeProsedur: cCodeP[i] || '',
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
    add('kasus_diagnosa[]', d.kasus);
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
  const params = new URLSearchParams();

  // ═══════════════════════════════════════════════════════════
  // 1. BASE: ambil SEMUA field dari form RJ asli — ini yang menjamin
  //    id_bed, id_user, jenis_kasus, rujukan, SATUSEHAT, dll. ikut
  //    terkirim. Form asli verified live TIDAK punya atribut `id`,
  //    jadi selain #formdata (varian lain) kita cari lewat `action`.
  // ═══════════════════════════════════════════════════════════
  const form =
    (document.getElementById('formdata') as HTMLFormElement | null) ||
    (document.querySelector('form[action*="control/rm-rawat-jalan"]') as HTMLFormElement | null);

  if (form) {
    const fd = new FormData(form);
    fd.forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value);
    });
  } else if (cachedFormState) {
    // Fallback kalau form sudah tidak ada (mis. setelah di-unmount)
    for (const [key, val] of Object.entries(cachedFormState)) {
      if (Array.isArray(val)) {
        for (const v of val) params.append(key, v);
      } else {
        params.set(key, val);
      }
    }
  }

  // Pastikan field wajib ini ada. Timpai juga bila nilainya kosong:
  // `params.has()` bernilai true untuk string kosong, jadi tanpa
  // pengecekan nilai, field yang terkirim kosong tidak pernah diperbaiki.
  const ensure = (name: string, value: string) => {
    if (!value) return;
    if (!params.get(name)) params.set(name, value);
  };
  // ── Fallback skalar: field yang dibaca controller tapi kadang tidak ada
  //    di form (mis. form dirender ulang, atau fetchFormState gagal).
  //    Tanpa ini → PHP Notice "Undefined index" + Oracle INSERT ke kolom
  //    NOT NULL kosong.
  const pi = (name: string) =>
    (data.patientInfo as Record<string, string | undefined>)?.[name] || '';
  const domVal = (name: string) =>
    (document.querySelector(`[name="${name}"]`) as HTMLInputElement | null)?.value || '';
  const fsVal = (name: string) =>
    typeof cachedFormState?.[name] === 'string' ? (cachedFormState![name] as string) : '';

  const idVisit =
    data.patientInfo.id_visit || new URLSearchParams(location.search).get('id_visit') || '';
  const idRJ =
    data.patientInfo.id_rawat_jalan || new URLSearchParams(location.search).get('id') || '';
  ensure('id_visit', idVisit);
  ensure('id_rawat_jalan', idRJ);
  // id_user: pakai nilai form asli. Fallback terakhir tetap '1' (superadmin)
  // agar $_POST['id_user'] tidak undefined.
  ensure('id_user', fsVal('id_user') || '1');
  // `save` WAJIB dikirim. Form asli memakai submit button
  // <input type="submit" name="save" value="Simpan"> dan controller lama
  // hanya memproses simpan kalau $_POST['save'] ada. Tanpa ini data
  // diam-diam tidak tersimpan (controller jatuh ke cabang view/load).
  params.set('save', 'Simpan');

  // Field id_kunjungan / ihs_number / ihs_number_dokter / waktu_visit /
  // nama_pasien / planning TIDAK ada di form RJ lama (verified live, 0
  // kemunculan) — jangan dikirim.
  for (const f of [
    'norm',
    'noregis',
    'pasien',
    'id_bed',
    'id_dokter',
    'nama_dokter',
    'pulang_berkas',
  ] as const) {
    if (params.get(f)) continue;
    const v = pi(f) || domVal(f) || fsVal(f);
    if (v) params.set(f, v);
  }
  // `waktu` = stempel waktu simpan (server pakai buat CREATED_AT).
  if (!params.get('waktu')) {
    const n = new Date();
    const p2 = (x: number) => String(x).padStart(2, '0');
    params.set(
      'waktu',
      `${p2(n.getDate())}/${p2(n.getMonth() + 1)}/${n.getFullYear()} ${p2(n.getHours())}:${p2(n.getMinutes())}:${p2(n.getSeconds())}`,
    );
  }
  // Select (jenis_kasus/status_kasus/tindak_lanjut), field keluar-rujukan,
  // dan SATUSEHAT dibaca controller lewat $_POST jadi harus ADA walau
  // kosong — hilang = PHP Notice "Undefined index" lalu kolom NULL.
  // Nilainya dipertahankan dari form asli (cache); modal tidak punya UI
  // untuk field-field ini sehingga tidak boleh ditimpa default.
  for (const f of [
    'jenis_kasus',
    'status_kasus',
    'tindak_lanjut',
    'rujukan',
    'keadaan_keluar',
    'cara_keluar',
    'pemeriksaan_lanjut',
    'alergiMakananJSON',
    'alergiLingkunganJSON',
    'composition_diet',
  ] as const) {
    if (!params.has(f)) params.set(f, pi(f) || fsVal(f) || '');
  }

  // ═══════════════════════════════════════════════════════════
  // 2. Hapus array field dari base — akan di-replace dari React state
  // ═══════════════════════════════════════════════════════════
  const arrayFieldsToClear = [
    'kode10[]',
    'idicd[]',
    'nama[]',
    'kasus_diagnosa[]',
    'komplikasi[]',
    'namaTindakan[]',
    'kode9[]',
    'idicdTindakan[]',
    'komorbid[]',
    'kategoriProsedur[]',
    'snomedProsedur[]',
    'codeProsedur[]',
  ];
  for (const f of arrayFieldsToClear) params.delete(f);

  // Checkbox persetujuan prosedur: form asli memakai name LITERAL `ic[]`
  // untuk SEMUA baris (verified live: satu-satunya pola name ic di halaman
  // adalah "name='ic[]'"), bukan ic1/ic2/... seperti form era refaktor.
  params.delete('ic[]');

  // ═══════════════════════════════════════════════════════════
  // 3. OVERLAY: notes dari React state.
  //    Kirim `\n` MENTAH seperti form asli (bukan `<br/>`): verifikasi live
  //    membuktikan server menyimpan `\n` apa adanya untuk record native.
  //    `restoreBreaks()` sekalian menyembuhkan literal `<br/>` dari korupsi
  //    serializer lama → `\n` (idempoten, tidak mengubah `\n` yang benar).
  // ═══════════════════════════════════════════════════════════
  const notes = (val: string | undefined) => restoreBreaks(val || '');
  params.set('anamnesa', notes(data.clinicalNotes.anamnesa));
  params.set('pemeriksaan_fisik', notes(data.clinicalNotes.pemeriksaan_fisik));
  params.set('catatan', notes(data.clinicalNotes.catatan));
  params.set('tindakan', notes(data.clinicalNotes.tindakan));
  params.set('terapi_pengobatan', notes(data.clinicalNotes.terapi_pengobatan));

  // ═══════════════════════════════════════════════════════════
  // 4. OVERLAY: vital signs dari React state
  // ═══════════════════════════════════════════════════════════
  const cleanVital = (val: string): string => (val || '').match(/^([\d/.]+)/)?.[0] || '';
  params.set('tensi', cleanVital(data.vitalSigns.tensi));
  params.set('nadi', cleanVital(data.vitalSigns.nadi));
  params.set('suhu', cleanVital(data.vitalSigns.suhu));
  params.set('nafas', cleanVital(data.vitalSigns.nafas));
  // `spo2` SENGAJA tidak dikirim: tidak ada di form RJ asli (verified
  // live, 0 kemunculan di halaman) jadi controller lama tidak membacanya.
  params.set('tinggi', cleanVital(data.vitalSigns.tinggi));
  params.set('berat', cleanVital(data.vitalSigns.berat));

  // ═══════════════════════════════════════════════════════════
  // 5. OVERLAY: diagnosa dari React state
  //
  // Mekanisme server = DELETE-ALL-THEN-INSERT (verified live: handler
  // `deleteElement()` form asli hanya removeChild baris dari DOM, tanpa
  // penanda; payload hasil simpan hanya berisi baris yang tersisa).
  // Jadi JANGAN pernah mengirim baris "dummy" kosong sebagai penanda
  // hapus — hanya akan membuat baris kosong tersimpan / tidak terhapus.
  // ═══════════════════════════════════════════════════════════
  const cKode10 = Array.isArray(cachedFormState?.['kode10[]'])
    ? (cachedFormState!['kode10[]'] as string[])
    : [];
  const cIdicd = Array.isArray(cachedFormState?.['idicd[]'])
    ? (cachedFormState!['idicd[]'] as string[])
    : [];
  const cleanDiagnosa = data.diagnosa
    .filter((d) => d.idicd?.trim() && d.kode10?.trim() && d.namaDiagnosa?.trim())
    .filter((d, i, arr) => arr.findIndex((x) => x.idicd === d.idicd) === i);

  // Baris diagnosa asli hanya punya 5 field: nama[]/idicd[]/kode10[]/
  // kasus_diagnosa[]/komplikasi[] — TIDAK ada keterangan10[] (verified
  // live, 0 kemunculan). `kasus_diagnosa[]` = teks 'Kasus Lama'/'Kasus
  // Baru', `komplikasi[]` = Primer/Komplikasi/Komorbid; nilai di luar
  // daftar itu dibuang agar tidak tersimpan sebagai string asing.
  const cleanKasus = (v: string): string =>
    v === 'LAMA'
      ? 'Kasus Lama'
      : v === 'BARU'
        ? 'Kasus Baru'
        : v === 'Kasus Lama' || v === 'Kasus Baru'
          ? v
          : '';
  const cleanKomplikasi = (v: string): string =>
    v === 'Primer' || v === 'Komplikasi' || v === 'Komorbid' ? v : '';

  cleanDiagnosa.forEach((d) => {
    let idicd = d.idicd;
    if (!idicd && d.kode10) {
      const idx = cKode10.indexOf(d.kode10);
      if (idx >= 0 && cIdicd[idx]) idicd = cIdicd[idx];
    }
    params.append('nama[]', d.namaDiagnosa);
    params.append('idicd[]', idicd);
    params.append('kode10[]', d.kode10);
    params.append('kasus_diagnosa[]', cleanKasus(d.kasus));
    params.append('komplikasi[]', cleanKomplikasi(d.komplikasi));
  });

  // ═══════════════════════════════════════════════════════════
  // 6. OVERLAY: tindakan dari React state
  //    Baris tindakan form RJ asli (verified lewat template
  //    #tambahBarisTindakan) punya: namaTindakan[]/idicdTindakan[]/
  //    kode9[]/ic[]/komorbid[]/kategoriProsedur[]/snomedProsedur[]/
  //    codeProsedur[]. Tiga field terakhir WAJIB ikut — validasi
  //    client-side form asli menolak baris tanpa kategoriProsedur dan
  //    controller membacanya per indeks.
  //    Sama seperti diagnosa: hapus = delete-all-then-insert, tanpa penanda.
  // ═══════════════════════════════════════════════════════════
  const cleanTindakan = data.tindakan
    .filter((t) => t.idicdTindakan?.trim() && t.kode9?.trim() && t.namaTindakan?.trim())
    .filter(
      (t, i, arr) =>
        arr.findIndex((x) => x.idicdTindakan === t.idicdTindakan && x.kode9 === t.kode9) === i,
    );

  // `ic[]` = checkbox persetujuan prosedur; semua baris memakai name
  // literal yang sama sehingga hanya baris TERCENTANG yang ikut submit
  // (tanpa indeks posisi). Modal tidak punya toggle ic, jadi jumlah
  // persetujuan dari form asli diteruskan ke baris yang dikirim.
  let icBudget = Array.isArray(cachedFormState?.['ic[]'])
    ? (cachedFormState!['ic[]'] as string[]).length
    : 0;

  // komorbid[] = '' | 'Primer' | 'Sekunder' (verified live).
  const cleanKomorbid = (v: string): string => (v === 'Primer' || v === 'Sekunder' ? v : '');

  cleanTindakan.forEach((t) => {
    params.append('namaTindakan[]', t.namaTindakan);
    params.append('kode9[]', t.kode9);
    params.append('idicdTindakan[]', t.idicdTindakan);
    params.append('komorbid[]', cleanKomorbid(t.komorbid));
    // kategoriProsedur[] wajib (validasi form asli + dibaca controller).
    // Default = '410606002' (Social service procedure), sama seperti
    // default baris baru di TindakanSection.
    params.append('kategoriProsedur[]', t.kategoriProsedur || '410606002');
    params.append('snomedProsedur[]', t.snomedProsedur || '');
    params.append('codeProsedur[]', t.codeProsedur || '');
    if (icBudget > 0) {
      params.append('ic[]', '1');
      icBudget -= 1;
    }
  });

  // ═══════════════════════════════════════════════════════════
  // 7. VALIDASI ala cekForm()/handler #save form RJ asli.
  //    Controller lama tidak me-validasi di server — form asli menolak di
  //    browser. Karena modal mem-bypass submit form, cek di sini supaya
  //    gagal cepat dengan pesan yang SAMA PERSIS seperti alert form asli
  //    (bukan diam-diam terkirim lalu ditolak).
  // ═══════════════════════════════════════════════════════════
  const need = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(msg);
  };
  need(!!params.get('norm')?.trim(), 'No. RM tidak boleh kosong !');
  need(!!params.get('pasien')?.trim(), 'Nama pasien tidak boleh kosong !');
  need(!!params.get('id_visit')?.trim(), 'Pilih nama atau No. RM dengan benar');
  need(!!params.get('waktu')?.trim(), 'Waktu harus diisi');
  need(!!params.get('nama_dokter')?.trim(), 'Nama dokter harus diisi');
  need(!!params.get('id_dokter')?.trim(), 'Pilih nama dokter dengan benar');
  need(!!params.get('jenis_kasus')?.trim(), 'Pilih jenis kasus');
  need(!!params.get('tindak_lanjut')?.trim(), 'Pilih tindak lanjut');
  need(!!data.clinicalNotes.catatan?.trim(), 'catatan belum diisi');

  // ═══════════════════════════════════════════════════════════
  // 8. DEBUG LOG (bisa dihapus nanti)
  // ═══════════════════════════════════════════════════════════
  const debug: Record<string, string> = {};
  // Sama dengan daftar yang divalidasi form RJ asli (handler #save).
  for (const k of [
    'save',
    'noregis',
    'norm',
    'pasien',
    'id_visit',
    'id_rawat_jalan',
    'id_user',
    'id_bed',
    'id_dokter',
    'nama_dokter',
    'waktu',
    'jenis_kasus',
    'status_kasus',
    'tindak_lanjut',
    'catatan',
  ]) {
    debug[k] = params.get(k) || '(missing)';
  }
  const missing = Object.entries(debug)
    .filter(([, v]) => v === '(missing)')
    .map(([k]) => k);
  console.log(
    `[RJ] payload: ${params.size} key, ${cachedFormKeys.length} dari form,`,
    missing.length ? `MISSING: ${missing.join(', ')}` : 'semua field wajib ada',
  );
  console.debug('[RJ] key values:', debug);

  return params.toString();
}

function serializeFormData(data: ResumeData): string {
  return serializeRawatJalan(data);
}

function closeOverlay(container: HTMLElement) {
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  try {
    container.innerHTML = '';
    container.style.display = 'none';
  } catch {}
  const sh = (document.getElementById('morbis-manap-root') as HTMLElement | null)?.shadowRoot;
  const sc = sh?.getElementById('ext-resume-shadow-container') as HTMLElement | null;
  if (sc) {
    try {
      const r = (sc as unknown as { _reactRoot?: unknown })._reactRoot as
        { unmount?: () => void } | undefined;
      r?.unmount?.();
    } catch {}
    sc.remove();
  }
  document.body.classList.remove('ext-resume-open');
  if (overlayBtn) {
    overlayBtn.disabled = false;
    overlayBtn.style.display = '';
  }
  const sbClose = document.querySelector('[data-scroll-buttons]') as HTMLElement | null;
  if (sbClose) sbClose.style.display = '';
}

function mountReactApp(container: HTMLElement, data: ResumeData) {
  if (reactRoot) {
    try {
      reactRoot.unmount();
    } catch {}
    reactRoot = null;
  }
  try {
    container.innerHTML = '';
  } catch {}

  if (!document.getElementById('morbis-resume-fonts')) {
    const link = document.createElement('link');
    link.id = 'morbis-resume-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  const getShadow = (): ShadowRoot | null => {
    let host = document.getElementById('morbis-manap-root') as HTMLElement | null;
    if (host?.shadowRoot) return host.shadowRoot;
    if (host && !host.shadowRoot) return null;
    host = document.createElement('div');
    host.id = 'morbis-manap-root';
    host.style.cssText =
      'position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block';
    document.body.appendChild(host);
    const sr = host.attachShadow({ mode: 'open' });
    const app = document.createElement('div');
    app.id = 'app';
    sr.appendChild(app);
    const ms = document.createElement('style');
    ms.id = 'morbis-shadow-reset';
    ms.textContent = `:host{display:block}#app{isolation:isolate;color-scheme:light}`;
    sr.appendChild(ms);
    // adoptedStyleSheets — strip @import (Constructable Stylesheets reject it) + fallback to <style>
    try {
      let css0: string = typeof SHADOW_CSS !== 'undefined' ? (SHADOW_CSS as string) : '';
      css0 = css0.replace(/@import[^;]+;/g, '');
      if (css0 && 'adoptedStyleSheets' in sr && 'CSSStyleSheet' in window) {
        try {
          const sheet = new (
            window as unknown as { CSSStyleSheet: new () => CSSStyleSheet }
          ).CSSStyleSheet();
          (sheet as unknown as { replaceSync: (s: string) => void }).replaceSync(css0);
          (sr as unknown as { adoptedStyleSheets: CSSStyleSheet[] }).adoptedStyleSheets = [
            ...(sr as unknown as { adoptedStyleSheets: CSSStyleSheet[] }).adoptedStyleSheets,
            sheet as unknown as CSSStyleSheet,
          ];
        } catch {
          const ss2 = document.createElement('style');
          ss2.textContent = css0;
          sr.appendChild(ss2);
        }
      } else if (css0) {
        const ss2 = document.createElement('style');
        ss2.textContent = css0;
        sr.appendChild(ss2);
      }
    } catch {}
    return sr;
  };
  const shadowRoot = getShadow();
  const cssRaw: string = typeof SHADOW_CSS !== 'undefined' ? (SHADOW_CSS as string) : '';
  const css = cssRaw.replace(/@import[^;]+;/g, '');
  // Modal container rules — single class, must live INSIDE the shadow root
  // (document.head styles can't pierce shadow DOM) and match the shadow form.
  const resumeModalCss = `
      .resume-modal {
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .resume-modal,
      .resume-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .resume-modal option,
      .resume-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
      }
      .resume-modal *,
      .resume-modal *::before,
      .resume-modal *::after {
        box-sizing: border-box;
      }
      .resume-modal input,
      .resume-modal select,
      .resume-modal textarea {
        all: unset;
        box-sizing: border-box;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        cursor: default;
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
      .resume-modal input:focus,
      .resume-modal select:focus,
      .resume-modal textarea:focus {
        border-color: hsl(221.2 83.2% 53.3%);
        box-shadow: 0 0 0 2px hsl(221.2 83.2% 53.3% / 0.15);
      }
      .resume-modal textarea {
        resize: vertical;
        min-height: 80px;
        padding: 8px 10px;
      }
      .resume-modal select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        padding-right: 28px;
      }
      .resume-modal h1,
      .resume-modal h2,
      .resume-modal h3 {
        font-family: 'Lexend', system-ui, sans-serif;
      }
    `;
  if (shadowRoot && !shadowRoot.getElementById('morbis-resume-shadow-css')) {
    const ss = document.createElement('style');
    ss.id = 'morbis-resume-shadow-css';
    ss.textContent = css + resumeModalCss;
    shadowRoot.appendChild(ss);
  }
  if (!document.getElementById('morbis-resume-css')) {
    const s = document.createElement('style');
    s.id = 'morbis-resume-css';
    s.textContent =
      css +
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
      }
      /* Paksa Roboto 16px/1.6 di atas CSS host (termasuk yang !important):
         menang di light-DOM fallback & elemen yang tidak inherit font
         (button native). Kode ICD (.font-mono) dikecualikan. */
      .resume-modal,
      .resume-modal *:not(.font-mono) {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
      }
      /* Dropdown bawaan browser (option/optgroup): render native, paksa eksplisit. */
      .resume-modal option,
      .resume-modal optgroup {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
        font-size: 16px !important;
      }

      /* ── Dropdown autocomplete ICD ──
         Aturan .resume-modal *:not(.font-mono) di atas memaksa
         font-size 16px !important untuk SELURUH isi modal, sehingga
         class Tailwind apa pun (text-lg/text-xl/text-xxl) ikut
         tertimpa. Baris nama & kode pada dropdown dikecualikan lalu
         diberi ukuran eksplisit di sini, setelah aturan itu, dengan
         !important yang sama supaya benar-benar menang.
         Kode sengaja TANPA font-mono: JetBrains Mono punya x-height
         jauh lebih rendah sehingga kode terlihat kecil dibanding nama.
         Catatan: jangan pakai backtick di dalam template literal ini. */
      .resume-modal .rj-icd-hit-nama,
      .resume-modal .rj-icd-hit-kode {
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif !important;
      }
      .resume-modal .rj-icd-hit-nama {
        font-size: 18px !important;
        line-height: 1.4 !important;
      }
      .resume-modal .rj-icd-hit-kode {
        font-size: 22px !important;
        line-height: 1.25 !important;
      }
      .resume-modal .resume-modal *,
      .resume-modal .resume-modal *::before,
      .resume-modal .resume-modal *::after {
        box-sizing: border-box;
      }
      /* Neutralize host page input/select/textarea defaults.
         No reset on buttons — our Button component owns its own styling via Tailwind. */
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
        font-family: 'Roboto', 'Atkinson Hyperlegible', 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
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

  const mountTarget = (() => {
    if (!shadowRoot) return container;
    // shadow aktif → light fallback container jangan sampai tampil (overlay ganda)
    container.style.display = 'none';
    const app = shadowRoot.getElementById('app');
    let sc = shadowRoot.getElementById('ext-resume-shadow-container') as HTMLElement | null;
    if (!sc) {
      sc = document.createElement('div');
      sc.id = 'ext-resume-shadow-container';
      sc.style.cssText =
        'position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;pointer-events:auto';
      // mount di dalam #app supaya warisi :host/#app vars + color-scheme
      (app ?? shadowRoot).appendChild(sc);
    }
    sc.style.display = 'flex';
    // hide float RJ + scroll buttons while modal open so they don't sit on top of modal
    if (overlayBtn) overlayBtn.style.display = 'none';
    const sb = document.querySelector('[data-scroll-buttons]') as HTMLElement | null;
    if (sb) sb.style.display = 'none';
    return sc;
  })();

  reactRoot = createRoot(mountTarget);

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

    // ── Controller lama membalas HTML (redirect); kalau suatu saat JSON ──
    let json: { status?: number; msg?: string } | null = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (json) {
      // Sukses hanya kalau status == 200
      if (Number(json.status) !== 200) {
        console.error('[RJ] server reject:', json);
        throw new Error(json.msg || 'Gagal simpan (status ' + json.status + ')');
      }
    } else {
      // Fallback: cek PHP notice/warning (controller lama)
      const phpPattern =
        /(?:<b>)?(?:Notice|Warning|Fatal error|Parse error|Catchable fatal error)(?:<\/b>)?\s*:\s*[^<]*/gi;
      const phpErrors: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = phpPattern.exec(text)) !== null) {
        const line = m[0].trim().replace(/<[^>]+>/g, '');
        if (!line) continue;
        if (/github\.com\/newrelic|newrelic-browser|google-analytics|googletagmanager/i.test(line))
          continue;
        phpErrors.push(line);
      }
      if (phpErrors.length > 0) {
        console.error('[RJ] PHP errors:', phpErrors);
        throw new Error(phpErrors.join('\n'));
      }
      // Controller lama me-render ulang form RJ saat simpan ditolak
      // (HTTP tetap 200, tanpa redirect). Tandanya: HTML balasan memuat
      // form asli (input id_visit + tombol save). Sukses = redirect ke
      // daftar RJ (fetch mengikutinya → response.redirected / url berubah).
      // Tanpa cek ini, penolakan server terbaca sebagai "sukses".
      if (!response.redirected && /name="id_visit"/.test(text) && /name="save"/.test(text)) {
        const m = text.match(
          /<div[^>]*class="[^"]*(?:error|alert|notif|warning)[^"]*"[^>]*>\s*([^<]{3,200})/i,
        );
        const serverMsg = m ? m[1].trim().replace(/\s+/g, ' ') : '';
        console.error('[RJ] server mengembalikan form, url akhir:', response.url);
        throw new Error(
          'Simpan ditolak server (form dikembalikan)' +
            (serverMsg ? ': ' + serverMsg : '') +
            '. Periksa catatan, ICD, jenis kasus & tindak lanjut.',
        );
      }
    }
    cachedFormState = null;

    // Riwayat: catat snapshot sesudah simpan (nama petugas dibaca di module).
    const idVisit =
      resumeData.patientInfo.id_visit || new URLSearchParams(location.search).get('id_visit') || '';
    const idResume =
      resumeData.patientInfo.id_rawat_jalan || new URLSearchParams(location.search).get('id') || '';
    logResumeHistory({
      idVisit,
      idResume,
      tipe: 'rajal',
      aksi: idResume ? 'ubah' : 'buat',
      before: loadLast(idVisit, 'rajal') ?? {},
      after: resumeDataToSnap(resumeData),
    });
  };

  reactRoot.render(
    <ErrorBoundary onError={() => setTimeout(() => closeOverlay(container), 0)}>
      <App data={data} onSave={handleSave} onClose={() => closeOverlay(container)} />
    </ErrorBoundary>,
  );

  document.body.classList.add('ext-resume-open');

  setTimeout(() => {
    const scope: ParentNode =
      (shadowRoot?.getElementById('ext-resume-shadow-container') as ParentNode) ?? container;
    scope.querySelectorAll('textarea').forEach((tx0) => {
      const tx = tx0 as HTMLTextAreaElement;
      tx.addEventListener('input', () => {
        tx.style.height = 'auto';
        tx.style.height = tx.scrollHeight + 'px';
      });
      tx.dispatchEvent(new Event('input'));
    });
  }, 50);
}

let cachedFormState: Record<string, string | string[]> | null = null;

/**
 * Parse seluruh kontrol form dari HTML halaman RJ jadi peta
 * name → value (atau string[] untuk name ber-`[]`).
 *
 * Menangkap SEMUA <input> (bukan cuma hidden/text) + <textarea> +
 * <select>, karena controller `rm-rawat-jalan` membaca banyak
 * field non-hidden (norm, id_bed, id_dokter, nama_dokter, waktu, …)
 * yang bila hilang memunculkan "Undefined index" di PHP Notice.
 */
function parseFormControls(doc: Document): Record<string, string | string[]> {
  const state: Record<string, string | string[]> = {};

  const put = (name: string, value: string) => {
    if (!name) return;
    if (name.endsWith('[]')) {
      if (!Array.isArray(state[name])) state[name] = [];
      (state[name] as string[]).push(value);
    } else {
      // TERAKHIR menang untuk field skalar — sama dengan cara PHP
      // membaca kunci POST yang duplikat. Ini penting untuk
      // `id_rawat_jalan`: form asli mengirimkannya DUA kali, pertama
      // kosong lalu 135682 di akhir. Dengan aturan "pertama menang"
      // kita menyimpan nilai kosong, lalu ensure() deemang sudah ada
      // dan tidak menimpanya — sehingga server tidak pernah menerima
      // id_rawat_jalan dan hapus/tambah ICD tidak berefek.
      state[name] = value;
    }
  };

  // ── <input> — semua type, skip yang tidak tercentang ──────────
  doc.querySelectorAll<HTMLInputElement>('input[name]').forEach((el) => {
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    // Radio/checkbox yang tidak dicentang TIDAK dikirim browser.
    if ((type === 'radio' || type === 'checkbox') && !el.checked) return;
    if (type === 'submit' || type === 'button' || type === 'file' || type === 'image') return;
    put(el.name, el.value ?? '');
  });

  // ── <textarea> ───────────────────────────────────────────────
  doc.querySelectorAll<HTMLTextAreaElement>('textarea[name]').forEach((el) => {
    put(el.name, el.value ?? '');
  });

  // ── <select> — simpan juga by id (form lama pakai id) ───────
  doc.querySelectorAll<HTMLSelectElement>('select').forEach((el) => {
    if (el.id) state[el.id] = el.value ?? '';
    if (el.name) put(el.name, el.value ?? '');
  });

  return state;
}

/** Nama-nama key yang berhasil di-capture — untuk log diagnostik. */
let cachedFormKeys: string[] = [];

async function fetchFormState(): Promise<Record<string, string | string[]>> {
  const qs = new URLSearchParams(location.search);
  const idVisit = qs.get('id_visit');
  if (!idVisit) return {};

  // `id` = id_rawat_jalan. Form RJ lama butuh KEDUANYA:
  //   /rekam-medik/rm-rawat-jalan-new?id=<id_rawat_jalan>&id_visit=<id_visit>
  // (catatan ejaan path: `rm-rawat-jalan-new` — varian tanpa strip 404,
  // verified live).
  // Di halaman detail-v2, `id` kadang tidak ada di URL — ambil juga dari
  // DOM / cache sebelumnya bila tersedia.
  const idRJ =
    qs.get('id') ||
    (document.getElementById('id_rawat_jalan') as HTMLInputElement | null)?.value ||
    (document.querySelector('[name="id_rawat_jalan"]') as HTMLInputElement | null)?.value ||
    (typeof cachedFormState?.['id_rawat_jalan'] === 'string'
      ? (cachedFormState['id_rawat_jalan'] as string)
      : '');

  // Endpoint LAMA (verified: /rekam-medik/rm-rawat-jalan-new?id=&id_visit=)
  // dikembalikan sebagai prioritas utama; endpoint baru di bawahnya tetap
  // dipertahankan sebagai fallback bila yang lama gagal.
  const urls: string[] = [];
  if (idRJ) {
    urls.push(
      `${location.origin}/rekam-medik/rm-rawat-jalan-new?id=${encodeURIComponent(idRJ)}&id_visit=${encodeURIComponent(idVisit)}`,
    );
  }
  urls.push(
    `${location.origin}/rekam-medik/rm-rawat-jalan-new?id_visit=${encodeURIComponent(idVisit)}`,
    `${location.origin}/rekam-medik/rm-rawat-jalan?id=${encodeURIComponent(idRJ)}&id_visit=${encodeURIComponent(idVisit)}`,
    `${location.origin}/admisi/pelaksanaan_pelayanan/rj?id_visit=${idVisit}`,
  );

  for (const url of urls) {
    // Server SIMRS sesekali membalas 404 sesaat untuk halaman RJ yang
    // sebenarnya valid (terverifikasi di produksi: 3x berturut-turut
    // 404 lalu 200 pada URL identik). Tanpa retry, satu jendela 404
    // membuat cachedFormState = {} → payload simpan kosong → data
    // dokter tidak tersimpan. Coba ulang beberapa kali.
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 350));
      try {
        // `cache: 'no-store'` WAJIB supaya browser tidak menyajikan
        // respons 404 lama yang ter-cache untuk URL yang sama.
        const resp = await fetch(url, {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { Referer: location.origin + '/admisi/pelaksanaan_pelayanan/' },
        });
        if (!resp.ok) continue;
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Form RJ asli teridentifikasi dari `id_visit` + `id_rawat_jalan`
        // (form LAMA tidak punya id_kunjungan — itu field era refaktor).
        if (doc.querySelector('input[name="id_visit"]') === null) break;
        const state = parseFormControls(doc);
        if (state.id_visit && state.id_rawat_jalan !== undefined) {
          cachedFormKeys = Object.keys(state);
          return state;
        }
        break;
      } catch (e) {
        console.warn('[RJ] fetchFormState gagal untuk', url, e);
      }
    }
  }

  console.warn('[RJ] fetchFormState: tidak menemukan form RJ untuk id_visit', idVisit);
  return {};
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
  container.className = 'resume-modal';
  container.style.cssText =
    'position: fixed; inset: 0; z-index: 2147483647; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;';
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
      // Jangan cache hasil kosong permanen: fetch gagal (404 sesaat/server
      // sibuk) membuat modal tampil kosong dan klik berikutnya tidak pernah
      // retry karena `{}` truthy. Hanya simpan bila ada id_visit (form RJ
      // lama tidak punya id_kunjungan — itu field era refaktor).
      if (!cachedFormState || !cachedFormState.id_visit) {
        const fresh = await fetchFormState();
        if (fresh && fresh.id_visit) {
          cachedFormState = fresh;
        } else if (!cachedFormState) {
          // Belum pernah dapat data valid sama sekali → beri tahu user
          // alih-alih membuka modal kosong yang membingungkan.
          const { confirmExt } = await import('../../ui/web/confirm.js');
          await confirmExt({
            title: 'Data belum termuat',
            message:
              'Form resume gagal dimuat dari server (jaringan/server sibuk). Klik tombol RJ sekali lagi untuk mencoba ulang.',
            variant: 'danger',
            okLabel: 'OK',
            hideCancel: true,
          });
          btn.disabled = false;
          return;
        }
        // Sudah ada cache valid lama → lanjut pakai itu walau refresh gagal.
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
    if (e.key === 'Escape' && container.style.display !== 'none') {
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

// ponytail: poll attribute — init.ts (ISOLATED) mungkin belum set data-ext-resume-modal
// saat MAIN world script load karena config async. Poll max 5s lalu give up.
function waitForFeature(timeoutMs = 5000): Promise<boolean> {
  if (isFeatureEnabled()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      if (isFeatureEnabled()) {
        clearInterval(iv);
        resolve(true);
      } else if (Date.now() - t0 > timeoutMs) {
        clearInterval(iv);
        resolve(false);
      }
    }, 200);
  });
}

(async () => {
  if (isLoginPage()) return;
  if (!(await waitForFeature())) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFloatingButton);
  } else {
    setupFloatingButton();
  }
})();

export {};
