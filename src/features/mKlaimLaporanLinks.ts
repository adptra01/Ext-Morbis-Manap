/**
 * mKlaimLaporanLinks — tombol "Laporan Pre-op" & "Laporan Revisi BPJS" di
 * halaman list /v2/m-klaim. Pola yang sama dengan penerimaanExport:
 * baca filter form klaim → window.open halaman laporan Reports di TAB BARU
 * dengan filter ter-prefill → user mencari / memfilter / mengekspor sendiri
 * di sana. Halaman list MORBIS tetap di tempat (tidak pernah location.href).
 *
 * Pemetaan field form M-KLAIM → query string Reports (flat):
 *  tanggalAwal→tanggal_mulai, tanggalAkhir→tanggal_selesai,
 *  norm→norm, nama→nama, reg→no_reg (khusus pre-op),
 *  poli→poli + status→status (khusus revisi).
 *  billing & id_poli tidak punya padanan di Reports → dibuang diam-diam.
 *  Tanggal DD/MM/YYYY atau DD-MM-YYYY (form MORBIS) → YYYY-MM-DD.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { readKlaimFilter, type KlaimFilter } from './mKlaimCasemixExport.js';
import { resolveCasemixBase } from './shared/casemixApi.js';
import { runWhenIdle } from './shared/whenIdle.js';

const g = getMorbisGlobals();

export const LAPORAN_PREOP_PATH = '/laporan-pre-op';
export const LAPORAN_REVISI_PATH = '/laporan-revisi-bpjs';

/** Nilai filter aman: literal "undefined"/"null"/"NaN" (bug JS halaman)
 *  dibersihkan jadi kosong agar tak terkirim verbatim. */
function cleanFilterValue(v: unknown): string {
  const t = String(v ?? '').trim();
  if (t === 'undefined' || t === 'null' || t === 'NaN') return '';
  return t;
}

/** Tanggal → YYYY-MM-DD. Terima DD/MM/YYYY, DD-MM-YYYY (form MORBIS),
 *  atau YYYY-MM-DD (sudah baku). Kalender tidak valid → ''. */
export function toIsoDate(v: string): string {
  const dmy = /^(\d{2})[/-](\d{2})[/-](\d{4})$/.exec((v || '').trim());
  if (dmy) {
    const d = Number(dmy[1]);
    const m = Number(dmy[2]);
    const y = Number(dmy[3]);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const valid = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
    if (!valid) return '';
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test((v || '').trim())) return v.trim();
  return '';
}

function setParam(params: URLSearchParams, key: string, value: string): void {
  const v = cleanFilterValue(value);
  if (v !== '') params.set(key, v);
}

/** Query string laporan pre-op dari filter form klaim. */
export function buildPreOpParams(filter: KlaimFilter): URLSearchParams {
  const params = new URLSearchParams();
  const mulai = toIsoDate(filter.tanggalAwal);
  const selesai = toIsoDate(filter.tanggalAkhir);
  if (mulai !== '') params.set('tanggal_mulai', mulai);
  if (selesai !== '') params.set('tanggal_selesai', selesai);
  setParam(params, 'norm', filter.norm);
  setParam(params, 'nama', filter.nama);
  setParam(params, 'no_reg', filter.reg);
  return params;
}

/** Query string laporan revisi dari filter form klaim. */
export function buildRevisiParams(filter: KlaimFilter): URLSearchParams {
  const params = new URLSearchParams();
  const mulai = toIsoDate(filter.tanggalAwal);
  const selesai = toIsoDate(filter.tanggalAkhir);
  if (mulai !== '') params.set('tanggal_mulai', mulai);
  if (selesai !== '') params.set('tanggal_selesai', selesai);
  setParam(params, 'norm', filter.norm);
  setParam(params, 'nama', filter.nama);
  setParam(params, 'poli', filter.poli || filter.idPoli);
  // Server hanya kenal pending/saved — nilai lain dibuang (bukan error).
  const st = cleanFilterValue(filter.status).toLowerCase();
  if (st === 'pending' || st === 'saved') params.set('status', st);
  return params;
}

export function buildPreOpUrl(base: string, filter: KlaimFilter): string {
  const qs = buildPreOpParams(filter).toString();
  return base.replace(/\/+$/, '') + LAPORAN_PREOP_PATH + (qs ? '?' + qs : '');
}

export function buildRevisiUrl(base: string, filter: KlaimFilter): string {
  const qs = buildRevisiParams(filter).toString();
  return base.replace(/\/+$/, '') + LAPORAN_REVISI_PATH + (qs ? '?' + qs : '');
}

/** Buka halaman laporan di tab baru dengan filter form saat ini. */
function openLaporan(kind: 'preop' | 'revisi'): void {
  let base: string;
  try {
    base = resolveCasemixBase();
  } catch {
    window.alert('Base URL Reports belum dikonfigurasi.');
    return;
  }
  let filter: KlaimFilter;
  try {
    filter = readKlaimFilter();
  } catch {
    filter = {
      tanggalAwal: '',
      tanggalAkhir: '',
      norm: '',
      nama: '',
      reg: '',
      billing: '',
      status: '',
      idPoli: '',
      poli: '',
    };
  }
  const url = kind === 'preop' ? buildPreOpUrl(base, filter) : buildRevisiUrl(base, filter);
  window.console.info('[mKlaimLaporanLinks] buka laporan →', url);
  window.open(url, '_blank', 'noopener');
}

function makeLinkButton(
  id: string,
  label: string,
  title: string,
  refBtn: HTMLElement | null | undefined,
  onClick: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = id;
  btn.type = 'button';
  btn.className = refBtn?.className || 'btn btn-info';
  const refStyle = refBtn?.getAttribute('style');
  if (refStyle) btn.setAttribute('style', refStyle);
  btn.style.display = 'inline-block';
  btn.style.marginLeft = '8px';
  const icon = refBtn?.querySelector('i');
  if (icon) {
    btn.appendChild(icon.cloneNode(true));
    btn.appendChild(document.createTextNode(' '));
  }
  btn.appendChild(document.createTextNode(label));
  btn.title = title;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });
  return btn;
}

export function injectLaporanButtons(): void {
  if (document.getElementById('ext-laporan-preop-btn')) return;

  const exportBtn = document.getElementById('ext-casemix-export-btn') as HTMLElement | null;
  const anchor = exportBtn?.parentNode ? exportBtn : null;
  const refBtn =
    (document.getElementById('ext-casemix-export-btn') as HTMLElement | null) ||
    (document.querySelector('button[onclick*="loadTableExcel"]') as HTMLElement | null);

  const btnPreOp = makeLinkButton(
    'ext-laporan-preop-btn',
    'Laporan Pre-op',
    'Buka laporan Pre-op di Reports (filter form ikut terbawa, bisa cari/filter sendiri)',
    refBtn,
    () => openLaporan('preop'),
  );
  const btnRevisi = makeLinkButton(
    'ext-laporan-revisi-btn',
    'Laporan Revisi BPJS',
    'Buka laporan Revisi Klaim BPJS di Reports (filter form ikut terbawa, bisa cari/filter sendiri)',
    refBtn,
    () => openLaporan('revisi'),
  );

  if (anchor?.parentNode) {
    anchor.parentNode.insertBefore(btnPreOp, anchor.nextSibling);
    anchor.parentNode.insertBefore(btnRevisi, btnPreOp.nextSibling);
  } else {
    const table = document.querySelector('table');
    if (table?.parentNode) {
      table.parentNode.insertBefore(btnRevisi, table);
      table.parentNode.insertBefore(btnPreOp, btnRevisi);
    }
  }
}

export function initLaporanLinks(): void {
  if (window.location.pathname.includes('/detail')) return;
  runWhenIdle(injectLaporanButtons);
  window.setInterval(() => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    injectLaporanButtons();
  }, 3000);
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.laporanLinks = {
    id: 'laporanLinks',
    name: 'Tautan Laporan Pre-op & Revisi (M-KLAIM)',
    description: 'Tombol buka laporan Pre-op & Revisi BPJS di Reports dengan filter form terbawa',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
      ],
      exclude: [{ prefix: '/v2/m-klaim/detail' }],
    },
    run: initLaporanLinks,
  };
}

// Auto-run jika dimuat langsung (load-unpacked/dev) — TETAP lewat gate
// config supaya toggle OFF di popup benar-benar menonaktifkan fitur.
whenFeatureEnabled('laporanLinks', () => {
  if (
    (window.location?.pathname ?? '').startsWith('/v2/m-klaim') &&
    !(window.location?.pathname ?? '').includes('/detail')
  ) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLaporanLinks);
    } else {
      initLaporanLinks();
    }
  }
});
