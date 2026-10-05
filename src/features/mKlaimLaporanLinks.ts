/**
 * mKlaimLaporanLinks — tombol "Laporan Klaim BPJS" di halaman list
 * /v2/m-klaim. Pola yang sama dengan penerimaanExport: baca filter form
 * klaim → window.open halaman laporan Reports di TAB BARU dengan filter
 * ter-prefill → user mencari / memfilter / mengekspor sendiri di sana.
 * Halaman list MORBIS tetap di tempat (tidak pernah location.href).
 *
 * SATU tombol (permintaan user 2026-10-02: "di halaman aslinya cukup 1
 * button saja jangan sampai ada 3"). Sebelumnya dua tombol — "Laporan
 * Pre-op" + "Laporan Revisi BPJS" — di samping tombol Export asli MORBIS.
 * Sekarang laporan Pre-op dan Revisi digabung jadi satu halaman
 * Reports (`/laporan-klaim-bpjs`) yang punya filter "Jenis Laporan"
 * (semua / Pre-op / Revisi), jadi satu tombol sudah menutup keduanya.
 *
 * `jenis` sengaja TIDAK dikirim: default halaman = semua, jadi user
 * tinggal memilih di Reports bila mau melihat satu jenis saja.
 *
 * Pemetaan field form M-KLAIM → query string Reports (flat):
 *  tanggalAwal→tanggal_mulai, tanggalAkhir→tanggal_selesai,
 *  norm→norm, nama→nama, reg→no_reg, poli→poli, status→status.
 *  `billing` & `id_poli` tidak punya padanan persis → id_poli dipakai
 *  sebagai cadangan `poli` kalau `poli` kosong.
 *  Tanggal DD/MM/YYYY atau DD-MM-YYYY (form MORBIS) → YYYY-MM-DD.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { ensureCasemixBase } from './shared/casemixApi.js';
import { runWhenIdle } from './shared/whenIdle.js';

const g = getMorbisGlobals();

/** Filter form halaman klaim M-KLAIM (dipindahkan dari mKlaimCasemixExport
 *  yang sudah dihapus — tombol Export PDF-nya tidak dipakai lagi karena
 *  data laporan pindah ke halaman Reports). */
export interface KlaimFilter {
  tanggalAwal: string;
  tanggalAkhir: string;
  norm: string;
  nama: string;
  reg: string;
  billing: string;
  status: string;
  idPoli: string;
  poli: string;
}

const FILTER_KEYS: Array<[keyof KlaimFilter, string[]]> = [
  ['tanggalAwal', ['tanggalAwal']],
  ['tanggalAkhir', ['tanggalAkhir']],
  ['norm', ['norm']],
  ['nama', ['nama']],
  ['reg', ['reg']],
  ['billing', ['billing']],
  ['status', ['status']],
  ['idPoli', ['id_poli_cari', 'idPoli']],
  ['poli', ['poli_cari', 'poli']],
];

/** Baca nilai field dari form (by id/name) lalu fallback query URL. */
export function readKlaimFilter(doc: Document = document): KlaimFilter {
  const qs = new URLSearchParams(window.location.search);
  const out = {} as KlaimFilter;
  for (const [key, names] of FILTER_KEYS) {
    let v = '';
    for (const n of names) {
      const el = doc.getElementById(n) as HTMLInputElement | HTMLSelectElement | null;
      if (el?.value !== undefined && el.value !== '') {
        v = el.value;
        break;
      }
      const byName = doc.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${n}"]`);
      if (byName?.value !== undefined && byName.value !== '') {
        v = byName.value;
        break;
      }
    }
    if (!v) {
      for (const n of names) {
        const q = qs.get(n);
        if (q !== null && q !== '' && q !== 'undefined') {
          v = q;
          break;
        }
      }
    }
    out[key] = v;
  }
  return out;
}

/** Halaman laporan gabungan di Reports ( Reports SIMRS, W-7.19 ). */
export const LAPORAN_KLAIM_PATH = '/laporan-klaim-bpjs';

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

/**
 * Select unit #id_poli_cari: value numerik + teks nama unit.
 * null bila select tidak ada (konteks non-form, mis. unit test).
 */
function readUnitSelect(doc: Document | ParentNode): { value: string; text: string } | null {
  try {
    const sel = (doc as Document).querySelector?.('select#id_poli_cari, #id_poli_cari') as
      HTMLSelectElement | null | undefined;
    if (!sel) return null;
    const value = (sel.value ?? '').trim();
    const opt = sel.selectedOptions?.[0];
    const text = (opt?.textContent ?? opt?.text ?? '').trim();
    return { value, text };
  } catch {
    return null;
  }
}

/** true bila option = placeholder/bukan pilihan unit ("Pilih Unit", "Semua"). */
function isUnitPlaceholder(value: string, text: string): boolean {
  if (value === '') return true;
  if (/pilih\s*unit/i.test(text)) return true;
  // Opsi "Semua" (value 3382) = TANPA filter unit — bukan ID untuk exact-match.
  if (/^semua$/i.test(text)) return true;
  return false;
}

/**
 * Nama unit terpilih dari select #id_poli_cari (teks option, BUKAN value).
 *
 * Value select adalah ID numerik (mis. 4029) sedangkan filter `poli` di
 * Reports mencocokkan NAMA (LIKE, mis. "ARJUNA") — mengirim ID numerik
 * sebagai `poli` tidak pernah cocok (ID dikirim terpisah via `id_poli`).
 * Placeholder/"Semua"/kosong → ''.
 */
export function readPoliName(doc: Document | ParentNode = document): string {
  const unit = readUnitSelect(doc);
  if (!unit || isUnitPlaceholder(unit.value, unit.text)) return '';
  return unit.text;
}

/**
 * Filter laporan siap kirim: baca form + selaraskan filter unit dari select.
 * - Unit terpilih valid → `poli` = nama unit, `idPoli` = ID numerik
 *   (server exact-match id_poli; nama sebagai fallback LIKE).
 * - Select kosong/placeholder/"Semua", atau select tak ada → filter unit
 *   dikosongkan (jangan kirim ID "Semua"/sisa — TANPA filter unit).
 * Murni kecuali akses doc → unit-testable dengan doc palsu.
 */
export function resolveLaporanFilter(doc: Document | ParentNode = document): KlaimFilter {
  let filter: KlaimFilter;
  try {
    filter = readKlaimFilter(doc as Document);
  } catch {
    filter = emptyFilter();
  }
  try {
    const unit = readUnitSelect(doc);
    if (unit !== null) {
      if (isUnitPlaceholder(unit.value, unit.text)) {
        filter = { ...filter, poli: '', idPoli: '' };
      } else {
        filter = { ...filter, poli: unit.text, idPoli: unit.value };
      }
    }
  } catch {
    /* abaikan — fallback ke nilai form mentah */
  }
  return filter;
}

/**
 * Query string laporan gabungan dari filter form klaim.
 *
 * Union dari parameter pre-op dan revisi: halaman Reports sudah punya
 * semua kolom itu, dan kolom yang tidak berlaku bagi jenis tertentu
 * diabaikan di sana — jadi tidak perlu memilih jenis dari sini.
 *
 * Catatan semantik form M-KLAIM (hasil baca HTML asli 2026-10-05):
 * - `status` = Status PASIEN (all/rj/ri = Rawat Jalan/Inap), BUKAN status
 *   revisi — hanya pending/saved yang diteruskan, sisanya dibuang.
 * - `billing` (all/valid/belum) + `filter_tanggal` + `jenis_pasien` tidak
 *   punya padanan di Reports → dibuang.
 * - `id_poli_cari` bernilai ID numerik → dikirim apa adanya sebagai
 *   `id_poli` (server exact-match, akurat); nama unit dibaca via
 *   resolveLaporanFilter sebagai `poli` (fallback LIKE bila id tak cocok).
 *   Opsi "Semua"/placeholder mengosongkan keduanya (= tanpa filter unit).
 */
export function buildKlaimParams(filter: KlaimFilter): URLSearchParams {
  const params = new URLSearchParams();
  const mulai = toIsoDate(filter.tanggalAwal);
  const selesai = toIsoDate(filter.tanggalAkhir);
  if (mulai !== '') params.set('tanggal_mulai', mulai);
  if (selesai !== '') params.set('tanggal_selesai', selesai);
  setParam(params, 'norm', filter.norm);
  setParam(params, 'nama', filter.nama);
  setParam(params, 'no_reg', filter.reg);
  setParam(params, 'poli', filter.poli);
  setParam(params, 'id_poli', filter.idPoli);
  // Server hanya kenal pending/saved — nilai lain dibuang (bukan error).
  const st = cleanFilterValue(filter.status).toLowerCase();
  if (st === 'pending' || st === 'saved') params.set('status', st);
  return params;
}

export function buildKlaimUrl(base: string, filter: KlaimFilter): string {
  const qs = buildKlaimParams(filter).toString();
  return base.replace(/\/+$/, '') + LAPORAN_KLAIM_PATH + (qs ? '?' + qs : '');
}

function emptyFilter(): KlaimFilter {
  return {
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

/** Buka halaman laporan gabungan di tab baru dengan filter form saat ini.
 *
 *  Tab dibuka SEBELUM menunggu jaringan (window.open sinkron di dalam
 *  handler klik — kalau menunggu await dulu, popup-blocker menutupnya).
 *  Base dipastikan via ensureCasemixBase (override per-PC yang mati
 *  otomatis diganti fallback); tanpa override, URL langsung jadi.
 */
function openLaporan(): void {
  const w = window.open('about:blank', '_blank');
  if (!w) {
    window.alert('Popup diblokir — izinkan popup untuk halaman ini lalu ulangi.');
    return;
  }
  let filter: KlaimFilter;
  try {
    filter = resolveLaporanFilter(document);
  } catch {
    filter = emptyFilter();
  }
  void Promise.resolve()
    .then(() => ensureCasemixBase())
    .then((base) => {
      const url = buildKlaimUrl(base, filter);
      window.console.info('[mKlaimLaporanLinks] buka laporan klaim →', url);
      w.location.href = url;
    })
    .catch(() => {
      try {
        w.close();
      } catch {
        /* ignore */
      }
      window.alert('Gagal menyiapkan koneksi Reports — coba lagi.');
    });
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
  if (document.getElementById('ext-laporan-klaim-btn')) return;

  // Jangkar: tombol Cari/Tampil pada form filter; fallback tombol asli
  // MORBIS, terakhir tabel pertama.
  const anchor = Array.from(
    document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
  ).find((b) => {
    const t = ((b as HTMLInputElement).value || b.textContent || '').trim().toLowerCase();
    return /^(cari|tampil|tampilkan|filter)$/.test(t);
  }) as HTMLElement | undefined;
  const refBtn =
    anchor ?? (document.querySelector('button[onclick*="loadTableExcel"]') as HTMLElement | null);

  const btnKlaim = makeLinkButton(
    'ext-laporan-klaim-btn',
    'Laporan Klaim BPJS',
    'Buka laporan Pre-op & Revisi Klaim BPJS di Reports (filter form ikut terbawa, bisa pilih jenis di sana)',
    refBtn,
    () => openLaporan(),
  );

  if (anchor?.parentNode) {
    anchor.parentNode.insertBefore(btnKlaim, anchor.nextSibling);
  } else {
    const table = document.querySelector('table');
    if (table?.parentNode) {
      table.parentNode.insertBefore(btnKlaim, table);
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
    name: 'Tautan Laporan Klaim BPJS (M-KLAIM)',
    description:
      'Tombol buka laporan gabungan Pre-op & Revisi BPJS di Reports dengan filter form terbawa',
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
