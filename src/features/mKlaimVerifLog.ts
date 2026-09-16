import { getMorbisGlobals } from './shared/types.js';
import {
  type FormSnap,
  type TipeResume,
  loadLast,
  logResumeHistory,
  readPetugas,
  showHistToast,
} from './shared/resumeHistory.js';
import { logUsage } from './shared/usageLog.js';

const g = getMorbisGlobals();

let _initialized = false;
let _observer: MutationObserver | null = null;

function extractIdVisit(): string | null {
  return new URLSearchParams(window.location.search).get('id_visit');
}

function detectTipeResume(): TipeResume {
  const jenisInput = document.querySelector<HTMLInputElement>('input[name="jenis"]');
  const jenisSel = document.querySelector<HTMLSelectElement>('select[name="jenis"]');
  const val = (jenisInput?.value || jenisSel?.value || '').toUpperCase();
  if (val.includes('INAP')) return 'ranap';
  return 'rajal';
}

function extractResumeSnapshotFromPage(): FormSnap {
  const snap: FormSnap = {};

  // Ambil data dasar pasien
  const textFields = [
    'id_visit',
    'id_rawat_jalan',
    'id_resume_inap',
    'norm',
    'pasien',
    'nama_dokter',
    'jenis',
    'anamnesa',
    'catatan',
    'terapi_pengobatan',
    'pemeriksaan_fisik',
    'tindakan',
    'alasan_rawat',
    'diagnosa_primary',
    'jenis_kasus',
    'keadaan_keluar',
    'cara_keluar',
    'tgl_keluar2',
  ];

  textFields.forEach((name) => {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[name="${name}"], #${name}`,
    );
    if (el && el.value) {
      snap[name] = el.value.trim();
    }
  });

  // Kumpulkan array diagnosa & tindakan
  const kode10: string[] = [];
  document
    .querySelectorAll<HTMLInputElement>('input[name="kode10[]"], [id^="kode10"]')
    .forEach((el) => {
      if (el.value) kode10.push(el.value.trim());
    });
  if (kode10.length > 0) snap['kode10[]'] = kode10;

  const kode9: string[] = [];
  document
    .querySelectorAll<HTMLInputElement>('input[name="kode9[]"], [id^="kode9"]')
    .forEach((el) => {
      if (el.value) kode9.push(el.value.trim());
    });
  if (kode9.length > 0) snap['kode9[]'] = kode9;

  // Tanda bahwa ini snapshot verifikasi
  snap['_source'] = 'verif_action';
  snap['_verified_at'] = new Date().toISOString();

  return snap;
}

function handleVerifClick(targetBtn: HTMLElement): void {
  const idVisit = extractIdVisit();
  if (!idVisit) return;

  const tipe = detectTipeResume();
  const lastSnap = loadLast(idVisit, tipe);
  const currentSnap = extractResumeSnapshotFromPage();

  const idResume =
    (document.getElementById('id_rawat_jalan') as HTMLInputElement)?.value ||
    (document.getElementById('id_resume_inap') as HTMLInputElement)?.value ||
    (currentSnap['id_rawat_jalan'] as string) ||
    (currentSnap['id_resume_inap'] as string) ||
    '';

  const petugas = readPetugas();

  // Catat riwayat lokal + kirim ke endpoint Reports SIMRS
  try {
    logResumeHistory({
      idVisit,
      idResume,
      tipe,
      aksi: 'ubah',
      before: lastSnap ?? {},
      after: Object.keys(currentSnap).length > 2 ? currentSnap : (lastSnap ?? { _empty: 'true' }),
      user: `${petugas} [Verif]`,
    });
  } catch (e) {
    console.warn('[mKlaimVerifLog] Gagal mencatat history:', e);
  }

  // Kirim log penggunaan lokal
  void logUsage('mKlaimVerif', 'verif_berkas', true, {
    idVisit,
    tipe,
    petugas,
    btn: targetBtn.textContent?.trim() || targetBtn.id || 'btn-verif',
    timestamp: new Date().toISOString(),
  });

  // Notifikasi visual feedback
  showHistToast('✅ Berkas diverifikasi — snapshot resume berhasil dicatat ke riwayat log.');
}

function isVerifButton(el: HTMLElement): boolean {
  if (el.dataset.extVerifBound) return false;

  const text = (el.textContent || '').trim().toLowerCase();
  const val = (el as HTMLInputElement).value?.trim().toLowerCase() || '';
  const id = el.id.toLowerCase();
  const cls = (el.className || '').toLowerCase();
  const onclick = el.getAttribute('onclick')?.toLowerCase() || '';
  const dataAction = el.getAttribute('data-action')?.toLowerCase() || '';

  const isMatch =
    text === 'verif' ||
    text === 'verifikasi' ||
    text.includes('verifikasi berkas') ||
    text.includes('simpan verif') ||
    val === 'verif' ||
    val === 'verifikasi' ||
    id.includes('verif') ||
    cls.includes('btn-verif') ||
    cls.includes('verifikasi') ||
    onclick.includes('verif') ||
    dataAction.includes('verif');

  return isMatch;
}

function attachVerifListeners(): void {
  const candidates = document.querySelectorAll<HTMLElement>(
    'button, a, input[type="button"], input[type="submit"], [role="button"]',
  );

  candidates.forEach((el) => {
    if (isVerifButton(el) && !el.dataset.extVerifBound) {
      el.dataset.extVerifBound = 'true';
      el.addEventListener('click', () => {
        handleVerifClick(el);
      });
    }
  });

  // Tangkap juga submit pada form verifikasi bila ada
  const forms = document.querySelectorAll<HTMLFormElement>(
    'form[action*="verif"], form#form-verifikasi, form.form-verif',
  );
  forms.forEach((form) => {
    if (!form.dataset.extVerifBound) {
      form.dataset.extVerifBound = 'true';
      form.addEventListener('submit', () => {
        handleVerifClick(form);
      });
    }
  });
}

export function initMklaimVerifLog(): void {
  if (_initialized) return;
  if (!window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor')) return;

  _initialized = true;
  attachVerifListeners();

  if (_observer) _observer.disconnect();
  _observer = new MutationObserver(() => {
    attachVerifListeners();
  });

  _observer.observe(document.body, { childList: true, subtree: true });
}

// Feature module registration
if (typeof g.featureModules !== 'undefined') {
  g.featureModules.mKlaimVerifLog = {
    id: 'mKlaimVerifLog',
    name: 'Verifikasi Klaim & Log Resume',
    description:
      'Simpan snapshot resume & kirim ke riwayat log / Reports SIMRS saat klik verif berkas',
    match: {
      prefix: '/v2/m-klaim/detail-v2-refaktor',
    },
    run: initMklaimVerifLog,
  };
}

// Auto-run if on detail page
if (window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMklaimVerifLog);
  } else {
    initMklaimVerifLog();
  }
}
