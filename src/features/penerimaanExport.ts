/**
 * penerimaanExport — tombol "Export resep sudah diterima" → BUKA REKAP
 * Penerimaan Resep + Waktu Antrian di Reports SIMRS (halaman public).
 *
 * KONSEP BARU (2026-09-25, pengganti pipeline rewrite .xls):
 *  - Data + filter + export XLSX/CSV sekarang milik halaman public Reports
 *    SIMRS `/rs/penerimaan-resep-antrian` (query Oracle SIMRS, tanpa login,
 *    audit tercatat). Extension tidak lagi mengunduh/menulis file apa pun:
 *    tidak ada fetch server, tidak ada rewrite kolom, tidak ada
 *    `lookupAntrianBatch` (antrian diambil server dari tabel `queues`).
 *  - Klik tombol (custom / loadTableExcel / link export) → `window.open` ke
 *    halaman tersebut di TAB BARU dengan filter form MORBIS yang di-prefill.
 *    Halaman list MORBIS TETAP di tempat — TIDAK PERNAH `location.href`
 *    (keluhan lama: "halaman langsung redirect").
 *
 * Param form MORBIS → query string halaman rekap (flat, tanpa `search[...]`):
 *  date_start→tanggal_mulai, date_end→tanggal_selesai,
 *  date_start_kj→tanggal_mulai_kj, date_end_kj→tanggal_selesai_kj,
 *  id_unit_tujuan/unit_tujuan→depo_id, no_rm/norm→norm, sisanya sama.
 *  Tanggal DD/MM/YYYY (format tampilan form) → YYYY-MM-DD.
 */
import { farmasiAppBase } from './shared/farmasiQueueSync';

// Guard anti double-inject (SPA MORBIS bisa inject content script >1×).
if ((window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport) {
  throw new Error('skip double inject penerimaanExport');
}
(window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport = true;

/** Rute lokal (pathname) yang considered halaman rekap — untuk pesan log. */
const REPORT_PATH = '/penerimaan-resep-antrian';

/** Nama field form MORBIS (tanpa `search[...]`, lowercase) → param halaman rekap. */
const PARAM_MAP: Record<string, string> = {
  date_start: 'tanggal_mulai',
  date_end: 'tanggal_selesai',
  date_start_kj: 'tanggal_mulai_kj',
  date_end_kj: 'tanggal_selesai_kj',
  unit_tujuan: 'depo_id',
  id_unit_tujuan: 'depo_id',
  norm: 'norm',
  no_rm: 'norm',
  status_pasien: 'status_pasien',
  pasien: 'pasien',
  no_registrasi: 'no_registrasi',
  no_resep: 'no_resep',
  // Field lain (unit_asal, kategori_resep, dll) TIDAK ada filter-nya di
  // halaman rekap → dibuang diam-diam (halaman punya form filter sendiri).
};

function toast(msg: string, ms = 4000): void {
  try {
    let t = document.getElementById('ext-export-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ext-export-toast';
      t.style.cssText =
        'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;' +
        'border-radius:8px;background:#e8f0fd;color:#175cd3;border-left:5px solid #175cd3;' +
        'font-weight:600;font-size:16px;line-height:1.6;box-shadow:0 4px 16px rgba(0,0,0,.15);' +
        "font-family:'Roboto','Segoe UI',system-ui,sans-serif;max-width:420px;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    window.clearTimeout((t as unknown as { _t?: number })._t);
    (t as unknown as { _t?: number })._t = window.setTimeout(() => t?.remove(), ms);
  } catch {
    /* ignore */
  }
}

/** Nilai filter aman: DOM selalu string — literal "undefined"/"null"/"NaN"
 *  (bug JS halaman) dibersihkan jadi kosong agar tak terkirim verbatim. */
function cleanFilterValue(v: unknown): string {
  const t = String(v ?? '').trim();
  if (t === 'undefined' || t === 'null' || t === 'NaN') return '';
  return t;
}

/** Ambil nama field dari atribut name — buang bentuk `search[...]` MORBIS. */
function fieldName(raw: string): string {
  const m = /^search\[([^\]]+)\]$/.exec(raw.trim());
  return (m ? m[1] : raw.trim()).toLowerCase();
}

/** Tanggal → YYYY-MM-DD. Terima DD/MM/YYYY (format form MORBIS) atau
 *  YYYY-MM-DD (sudah baku). Tanggal kalender tidak valid (mis. 31/02) → ''. */
function toIsoDate(v: string): string {
  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (dmy) {
    const d = Number(dmy[1]);
    const m = Number(dmy[2]);
    const y = Number(dmy[3]);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const valid = dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
    if (!valid) return '';
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return '';
}

/** Bangun URL halaman rekap dari filter form MORBIS. Tanpa `search[...]`:
 *  halaman public rekap membaca param flat (tanggal_mulai, depo_id, ...). */
function buildPageUrl(): string {
  const params = new URLSearchParams();

  // Form filter MORBIS = #searchTable (lihat halaman penerimaan resep).
  // Fallback: form pertama di halaman bila tidak ada #searchTable.
  const form = document.querySelector<HTMLFormElement>(
    'form#searchTable, form#filter, form#search, form#form_filter',
  );
  const container: ParentNode = form || document;

  // Ambil SEMUA input/select/textarea di dalam form filter.
  const els = Array.from(
    container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea',
    ),
  ).filter((el) => {
    const t = (el.type || '').toLowerCase();
    if (['submit', 'button', 'reset', 'image'].includes(t)) return false;
    // Hidden field — JANGAN di-skip kalau namanya mirip tanggal (MORBIS
    // kadang render date sebagai hidden).
    if (t === 'hidden') {
      const n = (el.getAttribute('name') || '').toLowerCase();
      if (!/tgl|tanggal|date|start|end/.test(n)) return false;
    }
    return Boolean(el.getAttribute('name'));
  });

  const seen = new Set<string>();
  for (const el of els) {
    const raw = el.getAttribute('name') || '';
    if (!raw || seen.has(raw)) continue;
    seen.add(raw);

    if ((el.type === 'checkbox' || el.type === 'radio') && !(el as HTMLInputElement).checked) {
      continue;
    }

    const target = PARAM_MAP[fieldName(raw)];
    if (!target) continue; // filter tanpa padanan → dibuang (bukan error)

    const val = cleanFilterValue((el as HTMLInputElement).value);
    if (!val) continue;

    if (target.startsWith('tanggal_')) {
      const iso = toIsoDate(val);
      if (!iso) continue; // tanggal rusak/locale lain → biarkan halaman rekap
      params.set(target, iso); // pertahankan (klik ulang tak duplikat param)
    } else {
      params.set(target, val);
    }
  }

  const base = farmasiAppBase() + REPORT_PATH;
  const qs = params.toString();
  const url = qs ? base + '?' + qs : base;
  window.console.info(
    '[penerimaanExport] buka rekap →',
    url,
    '| params:',
    Object.fromEntries(params.entries()),
  );
  return url;
}

/** Buka halaman rekap di tab baru. Halaman list TIDAK dinavigasi (tujuan
 *  konsep baru: ganti file export .xls dengan halaman laporan live). */
function openRekapPage(): void {
  let url: string;
  try {
    url = buildPageUrl();
  } catch (e) {
    window.console.warn('[penerimaanExport] buildPageUrl error:', e);
    toast('Gagal membuka Rekap Penerimaan Resep — muat ulang halaman lalu coba lagi.', 6000);
    return;
  }
  window.open(url, '_blank', 'noopener');
}

const WRAP_FLAG = '__extPenerimaanWrapped';

/** Handle timer & listener aktif — dibersihkan saat keluar halaman list. */
let rearmTimer: number | null = null;
let injectTimer: number | null = null;
let onClickExport: ((e: MouseEvent) => void) | null = null;
let onSubmitExport: ((e: SubmitEvent) => void) | null = null;

/** Masih di halaman list penerimaan? (bukan /detail, bukan route lain). */
function isListPage(): boolean {
  return /\/inventory\/resep\/penerimaan/.test(location.pathname);
}

/** Cleanup: hentikan interval + lepas listener document saat SPA pindah
 *  halaman (atau pagehide/beforeunload) — jangan biarkan aktif di halaman lain. */
function cleanup(): void {
  if (rearmTimer !== null) {
    window.clearInterval(rearmTimer);
    rearmTimer = null;
  }
  if (injectTimer !== null) {
    window.clearInterval(injectTimer);
    injectTimer = null;
  }
  if (onClickExport) {
    document.removeEventListener('click', onClickExport, true);
    onClickExport = null;
  }
  if (onSubmitExport) {
    document.removeEventListener('submit', onSubmitExport, true);
    onSubmitExport = null;
  }
}

/** Bungkus loadTableExcel() bawaan halaman: cegah navigasi ke endpoint
 *  cetak-excel MORBIS, arahkan user ke halaman rekap. Fungsi asli
 *  SENGAJA TIDAK dipanggil (memanggilnya = window.location.href navigasi
 *  penuh keluar halaman list — keluhan user). void → param tetap "terpakai"
 *  secara semantik + dokumentasi niat. */
function makeLoadWrapper(orig: (...a: unknown[]) => unknown): (...a: unknown[]) => unknown {
  void orig;
  const wrapper = function (this: unknown, ..._args: unknown[]): unknown {
    openRekapPage();
    return false;
  };
  (wrapper as unknown as Record<string, unknown>)[WRAP_FLAG] = true;
  return wrapper;
}

function trapLoadTableExcel(): void {
  const w = window as unknown as Record<string, unknown> & {
    __extLoadTrap?: boolean;
    __extTrapSetter?: (v: unknown) => void;
    __extWrappedFn?: unknown;
    __extTrapFailed?: boolean;
  };
  const isWrapped = (fn: unknown): boolean =>
    typeof fn === 'function' && (fn as unknown as Record<string, unknown>)[WRAP_FLAG] === true;

  // returns true bila loadTableExcel ter-kontrol penuh (trap atau assignment)
  const arm = (): boolean => {
    let current: unknown = w.loadTableExcel;
    const setter = (newFn: unknown): void => {
      // NB: tulis ke closure `current`, bukan w.loadTableExcel — assignment ke
      // properti itu sendiri akan memanggil setter ini lagi (rekursi).
      if (typeof newFn !== 'function' || isWrapped(newFn)) {
        current = newFn;
        w.__extWrappedFn = undefined;
        return;
      }
      current = makeLoadWrapper(newFn as (...a: unknown[]) => unknown);
      w.__extWrappedFn = current;
      window.console.info('[penerimaanExport] loadTableExcel dibungkus ulang (assignment)');
    };
    // Jaring 1: accessor trap (intercept assignment loadTableExcel berikutnya).
    try {
      Object.defineProperty(w, 'loadTableExcel', {
        configurable: true,
        enumerable: true,
        get() {
          return current;
        },
        set: setter,
      });
      w.__extTrapSetter = setter;
      w.__extLoadTrap = true;
      if (typeof current === 'function' && !isWrapped(current)) {
        current = makeLoadWrapper(current as (...a: unknown[]) => unknown);
        w.__extWrappedFn = current;
        window.console.info('[penerimaanExport] loadTableExcel dibungkus (trap)');
      } else if (typeof current !== 'function') {
        w.__extWrappedFn = undefined;
      }
      return true;
    } catch {
      // Jaring 2: assignment langsung (properti non-configurable tapi writable).
      try {
        if (typeof current === 'function' && !isWrapped(current)) {
          w.__extWrappedFn = makeLoadWrapper(current as (...a: unknown[]) => unknown);
          w.loadTableExcel = w.__extWrappedFn;
          window.console.info('[penerimaanExport] loadTableExcel dibungkus (assignment)');
        } else if (isWrapped(current)) {
          w.__extWrappedFn = current;
        }
        w.__extLoadTrap = false;
        return true;
      } catch {
        // Jaring 3: properti terkunci penuh (non-configurable + non-writable).
        // Fungsi loadTableExcel tidak bisa dibungkus; jaring pengaman tetap
        // aktif: tombol kustom + intercept klik/submit (document capture).
        if (!w.__extTrapFailed) {
          w.__extTrapFailed = true;
          window.console.info(
            '[penerimaanExport] loadTableExcel tidak bisa dibungkus (properti terkunci) — ' +
              'fallback: tombol kustom + intercept klik + re-check berkala. Fungsi tetap bekerja.',
          );
        }
        return false;
      }
    }
  };
  arm();
  // Jaring pengaman: pasang ulang pembungkus bila halaman menimpa
  // loadTableExcel setelahnya (assign ulang dari script halaman).
  rearmTimer = window.setInterval(() => {
    if (!isListPage()) {
      // Pindah halaman — berhenti total, jangan aktif di route lain.
      cleanup();
      return;
    }
    try {
      const d = Object.getOwnPropertyDescriptor(w, 'loadTableExcel');
      if (w.__extLoadTrap) {
        // Mode trap: descriptor ours utuh → tak perlu apa-apa.
        if (d && d.set === w.__extTrapSetter) return;
      } else {
        // Mode assignment/fallback: cek apakah loadTableExcel masih wrapper kita.
        if (w.__extWrappedFn && w.loadTableExcel === w.__extWrappedFn) return;
        if (!w.__extWrappedFn) {
          // Tidak pernah ter-bungkus (terkunci) — jangan putar sia-sia tiap 5 detik.
          if (w.__extTrapFailed) return;
        }
      }
      w.__extLoadTrap = false;
      w.__extWrappedFn = undefined;
      arm();
    } catch {
      /* ignore */
    }
  }, 5000);
}

function injectCustomButton(): void {
  // Anti double-inject
  if (document.getElementById('ext-export-custom-btn')) return;

  // Cari tombol export MORBIS asli (onclick loadTableExcel atau teks "Export resep")
  const morbisBtn = (document.querySelector('button[onclick*="loadTableExcel"]') ||
    Array.from(document.querySelectorAll('button[onclick], a[href]')).find((b) => {
      const oc = b.getAttribute('onclick') || '';
      const tx = (b.textContent || '').trim();
      return /loadTableExcel/i.test(oc) || /export\s*resep/i.test(tx);
    })) as HTMLElement | undefined;

  const extExportBtn = document.createElement('button');
  extExportBtn.id = 'ext-export-custom-btn';
  extExportBtn.type = 'button';

  // Salin class & style tombol asli agar tampilan 100% persis dengan tema MORBIS
  extExportBtn.className = morbisBtn?.className || 'btn btn-success';
  if (morbisBtn?.getAttribute('style')) {
    extExportBtn.setAttribute('style', morbisBtn.getAttribute('style') || '');
  }
  extExportBtn.style.display = 'inline-block'; // pastikan tombol kita tampil

  // Ambil icon asli bila ada (mis. <i class="fa fa-print"></i>) atau buat icon default
  const origIcon = morbisBtn?.querySelector('i');
  if (origIcon) {
    extExportBtn.appendChild(origIcon.cloneNode(true));
    extExportBtn.appendChild(document.createTextNode(' '));
  } else {
    const icon = document.createElement('i');
    icon.className = 'fa fa-print';
    extExportBtn.appendChild(icon);
    extExportBtn.appendChild(document.createTextNode(' '));
  }

  // Gunakan label teks yang identik dengan tombol MORBIS asli
  const textSpan = document.createElement('span');
  textSpan.textContent = morbisBtn?.textContent?.trim() || 'Export resep sudah diterima';
  extExportBtn.appendChild(textSpan);

  extExportBtn.title = 'Buka Rekap Penerimaan Resep + Waktu Antrian (Reports SIMRS)';

  if (morbisBtn && morbisBtn.parentNode) {
    morbisBtn.parentNode.insertBefore(extExportBtn, morbisBtn.nextSibling);
    morbisBtn.style.display = 'none'; // sembunyikan tombol asli
  } else {
    // Fallback: letakkan di atas tabel pertama
    const table = document.querySelector('table');
    if (table && table.parentNode) {
      table.parentNode.insertBefore(extExportBtn, table);
    }
  }

  extExportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openRekapPage();
  });
}

function init(): void {
  // Hanya halaman list; detail punya fitur sendiri.
  if (location.pathname.includes('/detail')) return;

  // Gate: flag khusus penerimaanExport (admin + apotek)
  if (!isEnabled()) return;

  // Inject tombol kustom (re-inject bila SPA render ulang)
  injectCustomButton();
  injectTimer = window.setInterval(() => {
    if (!isListPage()) {
      window.console.info('[penerimaanExport] bukan halaman list — cleanup interval/listener');
      cleanup();
      return;
    }
    injectCustomButton();
  }, 3000);

  trapLoadTableExcel();
  onClickExport = (e: MouseEvent): void => {
    const el = e.target as HTMLElement;
    const clickable = el.closest?.(
      'a[href], button, input[type="button"], input[type="submit"], [onclick]',
    ) as HTMLElement | null;
    if (!clickable) return;
    if (clickable.id === 'ext-export-custom-btn') return; // tombol custom sudah punya listener
    let href = (clickable as HTMLAnchorElement).getAttribute?.('href') || '';
    // Tombol JS: gali URL export dari atribut onclick.
    if (!href) {
      const oc = clickable.getAttribute?.('onclick') || '';
      const m = oc.match(/['"]([^'"]*(?:export|xls|excel|informasi-resep)[^'"]*)['"]/i);
      if (m) href = m[1];
    }
    if (!href && !/export|xls|excel|informasi-resep/i.test(clickable.textContent || '')) return;
    if (
      href &&
      !/export|xls|excel|informasi-resep/i.test(href) &&
      !/export|xls|excel|informasi-resep/i.test(clickable.textContent || '')
    )
      return;
    if (!href) {
      // --- Tombol JS: onclick="loadTableExcel()" / "exportExcel()" dst ---
      const oc = clickable.getAttribute?.('onclick') || '';
      if (!/loadTableExcel|exportExcel|excel|export/i.test(oc)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // hapus tangan inline onclick
      openRekapPage();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    openRekapPage();
  };
  document.addEventListener('click', onClickExport, true);

  onSubmitExport = (e: SubmitEvent): void => {
    const f = e.target as HTMLFormElement;
    const action = f?.action || '';
    if (!/export|xls|excel|informasi-resep/i.test(action)) return;
    e.preventDefault();
    e.stopPropagation();
    openRekapPage();
  };
  document.addEventListener('submit', onSubmitExport, true);

  // Full navigation / tutup tab → bersihkan semua timer & listener.
  window.addEventListener('pagehide', cleanup);
  window.addEventListener('beforeunload', cleanup);
}

// Gate: flag khusus penerimaanExport (admin + apotek) — pola yang sama
// dipakai fitur tab (polling karena init.js ISOLATED bisa lebih lambat).
function isEnabled(): boolean {
  return document.documentElement.getAttribute('data-ext-penerimaan-export') === '1';
}

function waitForFeature(timeoutMs = 5000): Promise<boolean> {
  if (isEnabled()) return Promise.resolve(true);
  return new Promise((resolve) => {
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (isEnabled()) {
        window.clearInterval(iv);
        resolve(true);
      } else if (Date.now() - t0 > timeoutMs) {
        window.clearInterval(iv);
        resolve(false);
      }
    }, 200);
  });
}

void waitForFeature().then((ok) => {
  window.console.info(
    '[penerimaanExport] gate=' +
      (ok ? 'AKTIF' : document.documentElement.getAttribute('data-ext-penerimaan-export')),
  );
  if (!ok) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
});
