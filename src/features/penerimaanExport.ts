/**
 * penerimaanExport — Export "resep sudah diterima" dengan kolom waktu antrian.
 *
 * Halaman /inventory/resep/penerimaan (list) punya Export server (.xls tabel
 * HTML) dengan kolom "Waktu Penjualan". User ingin kolom itu diganti:
 *   "Waktu Verif/Antrikan" (= queues.created_at — klik Antrikan extension)
 *   "Waktu Klik Selesai"   (= queues.done_at — klik SELESAI display operator)
 *
 * Cara kerja: intercept klik/form Export → unduh xls server → parse →
 * join No Resep ↔ tr[id] tabel live → lookup-batch ke App Antrian →
 * tulis ulang kolom → unduh file jadi. Server tidak disentuh; gagal →
 * fallback buka export asli di tab baru.
 */
import { lookupAntrianBatch, isFarmasiAppReachable } from './shared/antrianActions';

// Guard anti double-inject (SPA MORBIS bisa inject content script >1×).
if ((window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport) {
  throw new Error('skip double inject penerimaanExport');
}
(window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport = true;

const EXPORT_RE = /export|xls|excel|informasi-resep/i;
const FILENAME = 'informasi-resep.xls';

/** Fetch with timeout (AbortController) — default 30s, configurable. */
function fetchWithTimeout(
  url: string,
  init: RequestInit = {},
  timeoutMs = 30000,
): Promise<Response> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  return fetch(url, { ...init, signal: ac.signal }).finally(() => clearTimeout(timer));
}

/**
 * Diagnostik respons export utk log: status, content-type, judul halaman,
 * jumlah tabel, header kolom 3 tabel pertama, dan cuplikan body — biar
 * kegagalan rewrite bisa dibedakan (login page / layout beda / error HTML)
 * langsung dari log, tanpa perlu membuka file hasil.
 */
function responseDiag(html: string, res: Response): string {
  const norm = (s: string): string => s.replace(/\s+/g, ' ').trim().slice(0, 200);
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const title = doc.querySelector('title')?.textContent || '';
  const headers: string[] = [];
  for (const t of Array.from(doc.querySelectorAll('table')).slice(0, 3)) {
    const ths = Array.from(t.querySelectorAll('thead th, tr:first-child th'))
      .map((h) => (h.textContent || '').trim())
      .filter(Boolean);
    if (ths.length) headers.push(ths.join(' | '));
  }
  return (
    `status=${res.status} ct=${res.headers.get('content-type') ?? '?'} ` +
    `title=${norm(title)} loginPage=${/login/i.test(title)} ` +
    `tables=${doc.querySelectorAll('table').length} ` +
    `headers=[${headers.join(' ;; ')}] body=${norm(html).slice(0, 120)}`
  );
}

/** 'YYYY-MM-DD HH:mm:ss' → 'DD/MM/YYYY HH:mm:ss' (gaya kolom existing). */
export function fmtWaktuAntrian(sql: string): string {
  const m = String(sql || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}` : String(sql || '');
}

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
    window.clearTimeout((toast as unknown as { _t?: number })._t);
    (toast as unknown as { _t?: number })._t = window.setTimeout(() => t?.remove(), ms);
  } catch {
    /* ignore */
  }
}

/** Nonaktifkan / aktifkan tombol export agar tidak bisa diklik berulang kali. */
function setExportButtonsDisabled(disabled: boolean): void {
  const btns = document.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>(
    '#ext-export-custom-btn, button[onclick*="loadTableExcel"]',
  );
  btns.forEach((btn) => {
    if (disabled) {
      btn.setAttribute('disabled', 'true');
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.65';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.removeAttribute('disabled');
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
      btn.style.cursor = '';
    }
  });
}

/** Tampilkan overlay loading dengan spinner lingkaran selama proses export.
 *  Muat: pesan + spinner CSS animation. Hilangkan via hideLoading(). */
function showLoading(msg: string): void {
  setExportButtonsDisabled(true);
  hideLoading(); // bersihkan overlay sebelumnya
  const overlay = document.createElement('div');
  overlay.id = 'ext-export-loading';
  overlay.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;' +
    'justify-content:center;background:rgba(0,0,0,0.35);';
  const card = document.createElement('div');
  card.style.cssText =
    'display:flex;align-items:center;gap:16px;padding:24px 32px;' +
    'background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.2);' +
    "font-family:'Roboto','Segoe UI',system-ui,sans-serif;";
  // Spinner lingkaran via CSS animation
  const spinner = document.createElement('div');
  spinner.id = 'ext-export-spinner';
  spinner.style.cssText =
    'width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;' +
    'border-radius:50%;animation:ext-spin 0.8s linear infinite;';
  const text = document.createElement('span');
  text.id = 'ext-export-loading-text';
  text.style.cssText = 'font-size:16px;font-weight:600;color:#175cd3;';
  text.textContent = msg;
  card.appendChild(spinner);
  card.appendChild(text);
  overlay.appendChild(card);
  // Inject keyframes sekali
  if (!document.getElementById('ext-export-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'ext-export-spinner-style';
    style.textContent = '@keyframes ext-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  document.body.appendChild(overlay);
}

/** Perbarui teks loading (spinner tetap berputar). */
function updateLoading(msg: string): void {
  const el = document.getElementById('ext-export-loading-text');
  if (el) el.textContent = msg;
}

/** Hilangkan overlay loading dan aktifkan kembali tombol export. */
function hideLoading(): void {
  setExportButtonsDisabled(false);
  document.getElementById('ext-export-loading')?.remove();
}

/** Peta No Resep (teks) → id resep dari tabel live halaman ini.
 *  tr[id] = id_resep MORBIS (dipakai lookupAntrianBatch). Bila tr tidak
 *  punya id, fallback: No Resep teks = id_resep (banyak kasus MORBIS). */
function buildLiveMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const table of Array.from(document.querySelectorAll('table'))) {
    const ths = Array.from(table.querySelectorAll('thead th'));
    const head = ths.length ? ths : Array.from(table.querySelectorAll('tr:first-child th'));
    const idx = head.findIndex((th) => /no\s*resep/i.test(th.textContent || ''));
    if (idx < 0) continue;
    for (const tr of Array.from(table.querySelectorAll('tbody tr'))) {
      const trId = (tr as HTMLTableRowElement).id?.trim();
      // FIX: tr.id validation — hanya gunakan id yang valid (numeric, non-empty)
      // MORBIS kadang render tr.id="", tr.id="0", atau id non-numeric.
      const validTrId = trId && /^\d+$/.test(trId) ? trId : null;
      const tds = tr.querySelectorAll('td');
      if (idx >= tds.length) continue;
      const no = (tds[idx].textContent || '').trim();
      if (!no) continue;
      // Prioritas: tr[id] yang VALID (id_resep MORBIS); fallback: No Resep teks itu sendiri.
      const resepId = validTrId || no;
      if (resepId) map.set(no, resepId);
    }
  }
  return map;
}

/** Statistik hasil join export ↔ App Antrian. */
interface ExportStats {
  total: number;
  matched: number;
  adaSelesai: number;
  contohTidakDitemukan: string[];
}

/** Netralkan sel yang bisa dievaluasi Excel sebagai formula (CWE-1236):
 *  sel TEKS yang diawali `=` `+` `-` `@` diberi apostrof depan agar dibaca
 *  sebagai teks murni. Sel numerik (mis. "-123", "+1.234,5") TIDAK disentuh. */
function neutralizeFormulaCells(doc: Document): void {
  for (const cell of Array.from(doc.querySelectorAll('td, th'))) {
    const text = cell.textContent || '';
    if (!text) continue;
    const c = text[0];
    if (c !== '=' && c !== '+' && c !== '-' && c !== '@') continue;
    // Angka negatif/positif aman — biarkan utuh (bukan formula).
    if ((c === '+' || c === '-') && /^[+-]?[\d.,]+$/.test(text.trim())) continue;
    cell.prepend(doc.createTextNode("'"));
  }
}

/** Tulis ulang HTML xls: ganti kolom Waktu Penjualan → 2 kolom waktu antrian.
 *  No Resep dari export HTML dijoin ke liveMap → resep_id → lookupAntrianBatch
 *  → created_at (Waktu Verif/Antrikan) + done_at (Waktu Klik Selesai).
 *  Bila liveMap kosong, fallback: No Resep teks = resep_id langsung.
 *
 *  Kolom kosong itu Meaningful: nilai HANYA ada kalau status antrian di App
 *  sudah lewat tahap itu (created_at saat ENQUEUE/Antrikan, done_at saat
 *  DONE/Selesai). Resep yang belum di-antri atau belum "Selesai" memang
 *  kosong — karena itu selisihnya dikembalikan sebagai stats + console log
 *  supaya bisa dibedakan dari "App Antrian mati". */
async function rewriteExport(
  html: string,
  liveMap: Map<string, string>,
): Promise<{ html: string; stats: ExportStats }> {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let target: HTMLTableElement | null = null;
  let headerCells: HTMLTableCellElement[] = [];
  let headerTr: HTMLTableRowElement | null = null;
  let wpIdx = -1;
  let noIdx = -1;
  for (const t of Array.from(doc.querySelectorAll('table'))) {
    // Header: prefer <th>; fallback baris pertama ber-<td> — gaya export HTML
    // lama memakai <td> utk header, tanpa ini file salah ditolak
    // ("kolom Waktu Penjualan tidak ketemu") padahal kolomnya ada.
    const ths = Array.from(t.querySelectorAll('th'));
    const cells: HTMLTableCellElement[] = ths.length
      ? ths
      : Array.from(t.querySelector('tr')?.querySelectorAll('td') ?? []);
    const w = cells.findIndex((h) => /waktu\s*penjualan/i.test(h.textContent || ''));
    if (w < 0) continue;
    target = t as HTMLTableElement;
    headerCells = cells;
    headerTr = ths.length ? null : ((cells[0]?.parentElement as HTMLTableRowElement) ?? null);
    wpIdx = w;
    noIdx = cells.findIndex((h) => /no\s*resep/i.test(h.textContent || ''));
    break;
  }
  if (!target || wpIdx < 0) throw new Error('kolom Waktu Penjualan tidak ketemu di file export');

  // Kumpulkan id resep per baris (lewati baris header/kop).
  const rows: Array<{ tds: NodeListOf<HTMLTableCellElement>; id: string }> = [];
  const ids: string[] = [];
  for (const tr of Array.from(target.querySelectorAll('tr'))) {
    if (tr.querySelector('th') || (headerTr && tr === headerTr)) continue;
    const tds = tr.querySelectorAll('td');
    if (Math.max(wpIdx, noIdx) >= tds.length) continue;
    const no = noIdx >= 0 ? (tds[noIdx].textContent || '').trim() : '';
    // Baris tanpa No Resep (mis. subtotal) dilewati — jangan rusak.
    if (!no) continue;
    // Prioritas: liveMap (tr[id] = id_resep); fallback: No Resep teks = resep_id.
    const id = liveMap.get(no) || no;
    rows.push({ tds, id });
    ids.push(id);
  }

  const times = await lookupAntrianBatch(ids);

  // Header: 1 th → 2 th.
  const wth = headerCells[wpIdx];
  const th1 = doc.createElement('th');
  th1.textContent = 'Waktu Verif/Antrikan';
  const th2 = doc.createElement('th');
  th2.textContent = 'Waktu Klik Selesai';
  wth.replaceWith(th1, th2);

  const stats: ExportStats = {
    total: rows.length,
    matched: 0,
    adaSelesai: 0,
    contohTidakDitemukan: [],
  };
  for (const r of rows) {
    const q = r.id ? times[r.id] : undefined;
    const orig = r.tds[wpIdx];
    const tdV = orig.cloneNode(false) as HTMLTableCellElement;
    const tdS = orig.cloneNode(false) as HTMLTableCellElement;
    if (q) {
      stats.matched++;
      tdV.textContent = q.created_at ? fmtWaktuAntrian(q.created_at) : '—';
      if (q.done_at) {
        stats.adaSelesai++;
        tdS.textContent = fmtWaktuAntrian(q.done_at);
      } else {
        tdS.textContent = '—';
      }
    } else {
      // Tidak ada record antrian sama sekali (belum di-antri / bukan hari ini).
      tdV.textContent = '—';
      tdS.textContent = '—';
      if (stats.contohTidakDitemukan.length < 10) stats.contohTidakDitemukan.push(`${r.id}`);
    }
    orig.replaceWith(tdV, tdS);
  }
  // CWE-1236: netralkan sel (kolom lain dari server) sebelum diserialisasi ke .xls.
  neutralizeFormulaCells(doc);
  return { html: doc.documentElement.outerHTML, stats };
}

/** Unduh string (HTML export / hasil rewrite) sebagai .xls via blob — TANPA
 *  membuka tab baru / navigasi; halaman list tetap dan user tak terganggu. */
function downloadBlob(content: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = FILENAME;
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 4000);
}

async function processExport(url: string): Promise<void> {
  showLoading('Mengunduh data export dari server…');
  try {
    const res = await fetchWithTimeout(url, { credentials: 'include', cache: 'no-store' }, 30000);
    if (!res.ok) {
      // Jangan navigasi ke endpoint — cukup kabari user (sesi expired / error).
      window.console.warn('[penerimaanExport] fetch gagal HTTP ' + res.status);
      toast(
        `Export gagal — server balas HTTP ${res.status}. Muat ulang halaman atau login ulang MORBIS, lalu coba lagi.`,
        9000,
      );
      return;
    }
    const html = await res.text();

    updateLoading('Menggabungkan data waktu antrian…');
    let out: string;
    let stats: ExportStats | null = null;
    try {
      const r = await rewriteExport(html, buildLiveMap());
      out = r.html;
      stats = r.stats;
    } catch (err) {
      // Diagnostik: jelaskan bentuk respons server (login page? layout beda?
      // error HTML?) supaya bisa dibedakan dari log saja.
      const diag = responseDiag(html, res);
      window.console.warn(
        '[penerimaanExport] rewrite gagal — ' + diag,
        String((err as Error)?.message ?? err),
      );
      // TETAP unduh file asli server (tanpa kolom antrian) secara senyap —
      // TANPA window.open/navigasi: user tidak dilempar keluar halaman.
      downloadBlob(html);
      toast(
        'Kolom waktu antrian tidak bisa digabung (layout file export berubah) — ' +
          'file asli server tetap terunduh. Salin log console "[penerimaanExport] rewrite gagal" ke developer.',
        10000,
      );
      return;
    }

    // Bedakan 2 kegagalan yang tadinya sama-sama "kolom kosong":
    // (a) App Antrian tidak terjangkau dari PC ini, (b) record memang tidak ada.
    const reachable = await isFarmasiAppReachable();
    window.console.info(
      `[penerimaanExport] baris=${stats.total} cocok=${stats.matched} selesai=${stats.adaSelesai} ` +
        `appAntrian=${reachable ? 'REACHABLE' : 'TIDAK TERJANGKAU'}` +
        (stats.contohTidakDitemukan.length
          ? ` idTanpaAntrian=[${stats.contohTidakDitemukan.join(', ')}]`
          : ''),
    );

    updateLoading('Menyiapkan file unduhan…');
    // Jaring pengaman: bila server mengabaikan filter tanggal (param search[]
    // tidak dikenal versi server), file berisi SELURUH DB — beri tahu user
    // alih-alih diam memberinya file raksasa. Batas 5000 baris ≫ volume
    // harian penerimaan resep RS, jadi false-positive praktis tidak mungkin.
    if (stats.total > 5000 && /date_start|date_end/i.test(url)) {
      toast(
        'PERINGATAN: server mengabaikan filter tanggal — file berisi seluruh DB ' +
          `(${stats.total} baris). Laporkan ke admin MORBIS (endpoint cetak-excel).`,
        10000,
      );
    }
    // BOM (U+FEFF) agar Excel tidak salah baca karakter non-ASCII
    // (nama pasien, em-dash) — pola sama dengan paLabPrint.ts.
    downloadBlob(out);

    if (stats.total > 0 && stats.matched === 0) {
      toast(
        reachable
          ? 'Export selesai, TAPI tidak ada baris yang punya data antrian — ' +
              'resep di file ini belum pernah di-Antrikan (atau bukan antrian hari ini).'
          : 'Export selesai, TAPI App Antrian tidak terjangkau dari PC ini — ' +
              'kolom waktu kosong semua. Cek koneksi ke dev.rsudkotajambi.id.',
        9000,
      );
    } else if (stats.matched < stats.total || stats.adaSelesai < stats.matched) {
      toast(
        `Export selesai — ${stats.matched}/${stats.total} baris ter-antri, ` +
          `${stats.adaSelesai} sudah "Selesai". Sisanya "—" (belum antri / belum selesai).`,
        8000,
      );
    } else {
      toast('Export selesai — kolom Waktu Verif/Antrikan + Waktu Klik Selesai terisi.');
    }
  } catch (err) {
    // Tak terduga (network error dll.) — jangan pernah navigasi ke endpoint.
    window.console.warn('[penerimaanExport] proses export gagal:', err);
    toast(
      'Export gagal — tidak ada file terunduh. Cek koneksi / login MORBIS, lalu coba lagi.',
      9000,
    );
  } finally {
    hideLoading();
  }
}

/** Nilai filter aman: DOM selalu string — literal "undefined"/"null"/"NaN"
 *  (bug JS halaman) dibersihkan jadi kosong agar tak terkirim verbatim. */
function cleanFilterValue(v: unknown): string {
  const t = String(v ?? '').trim();
  if (t === 'undefined' || t === 'null' || t === 'NaN') return '';
  return t;
}

/** Mapping nama field form → param export (`search[...]`) — DISALIN dari
 *  `loadTableExcel()` bawaan MORBIS (server live 103.147.236.140, sumber
 *  halaman penerimaan):
 *  - tanggal dikirim APA ADANYA (format tampilan DD/MM/YYYY) — konversi ke
 *    YYYY-MM-DD membuat query Oracle gagal → server balas halaman
 *    "Error - Aplikasi" (bukan file export!).
 *  - nama param beda dari nama field: depo tujuan = `id_unit_tujuan`
 *    (BUKAN `unit_tujuan`), RM = `no_rm` (BUKAN `norm`), dll. Salah nama →
 *    filter diabaikan server → export berisi seluruh DB/hari.
 *  Server HANYA membaca bentuk `search[...]`; bentuk flat diabaikan. */
const EXPORT_FIELD_MAP: Record<string, string> = {
  // tanggal (passthrough; nilai tetap format form)
  date_start: 'date_start',
  date_end: 'date_end',
  tanggal_awal: 'date_start',
  tanggal_akhir: 'date_end',
  tgl_awal: 'date_start',
  tgl_akhir: 'date_end',
  tgl_start: 'date_start',
  tgl_end: 'date_end',
  start_date: 'date_start',
  end_date: 'date_end',
  tgl: 'date_start',
  tanggal: 'date_start',
  date_start_kj: 'date_start_kj',
  date_end_kj: 'date_end_kj',
  // unit/depo & pasien
  unit_tujuan: 'id_unit_tujuan',
  id_unit_tujuan: 'id_unit_tujuan',
  unit_asal: 'id_unit_asal',
  idUnit: 'id_unit_asal',
  id_unit_asal: 'id_unit_asal',
  norm: 'no_rm',
  no_rm: 'no_rm',
  status_pasien: 'status_pasien',
  pasien: 'pasien',
  no_registrasi: 'no_registrasi',
  no_resep: 'no_resep',
  jenis_kategori_pengajuan_resep: 'kategori_resep',
  kategori_resep: 'kategori_resep',
};

/** URL export dari nilai filter di halaman — MENIRU `loadTableExcel()`
 *  bawaan MORBIS: GET .../penerimaan/cetak/cetak-excel?search[field]=... */
function buildExportUrl(): string {
  const params = new URLSearchParams();
  const seen = new Set<string>();

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
    // Skip tombol/submit/reset/image
    if (['submit', 'button', 'reset', 'image'].includes(t)) return false;
    // Hidden field — JANGAN di-skip kalau namanya mirip tanggal (MORBIS kadang render date sebagai hidden)
    if (t === 'hidden') {
      const n = (el.getAttribute('name') || '').toLowerCase();
      if (!/tgl|tanggal|date|start|end/.test(n)) return false;
    }
    const name = el.getAttribute('name') || '';
    if (!name) return false;
    return true;
  });

  for (const el of els) {
    const rawName = el.getAttribute('name') || '';
    if (!rawName || seen.has(rawName)) continue;
    const input = el as HTMLInputElement;
    if ((input.type === 'checkbox' || input.type === 'radio') && !input.checked) continue;
    seen.add(rawName);

    const val = cleanFilterValue(input.value);
    if (!val) continue;

    // Nama param: pas lewat bila sudah `search[...]`; selain itu alias
    // nama field form → nama param export (EXPORT_FIELD_MAP).
    const lowerName = rawName.toLowerCase();
    if (/^search\[/i.test(lowerName)) {
      params.append(rawName, val);
    } else {
      const outName = EXPORT_FIELD_MAP[lowerName] || rawName;
      params.append(`search[${outName}]`, val);
    }
  }

  // Hanya bentuk search[...] — sama persis dengan loadTableExcel bawaan;
  // param flat diabaikan server (dan membingungkan saat debug).
  const base = '/inventory/resep/penerimaan/cetak/cetak-excel';
  const qs = params.toString();
  const url = new URL(qs ? base + '?' + qs : base, location.href).href;

  // Debug: log parameter yang dikirim
  window.console.info(
    '[penerimaanExport] buildExportUrl →',
    url,
    '| params:',
    Object.fromEntries(params.entries()),
  );
  return url;
}

/** Bungkus loadTableExcel() bawaan halaman: cegah unduhan asli, proses
 *  via rewrite; gagal → toast + fallback panggil fungsi asli.
 *  Mekanisme utama = TRAP defineProperty (setiap assignment ulang halaman
 *  dibungkus sinkron, tanpa window rentan); polling 5 detik hanya jaring
 *  pengaman bila trap digusur paksa. */
const WRAP_FLAG = '__extPenerimaanWrapped';

/** Handle timer & listener aktif — dibersihkan saat keluar halaman list. */
let rearmTimer: number | null = null;
let injectTimer: number | null = null;
let onClickExport: ((e: MouseEvent) => void) | null = null;
let onSubmitExport: ((e: SubmitEvent) => void) | null = null;

/** Masih di halaman list penerimaan? (bukan /detail, bukan route lain). */
function isListPage(): boolean {
  return (
    /\/inventory\/resep\/penerimaan/.test(location.pathname) &&
    !location.pathname.includes('/detail')
  );
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

function makeLoadWrapper(orig: (...a: unknown[]) => unknown): (...a: unknown[]) => unknown {
  // Catatan: `orig` (loadTableExcel asli) sengaja TIDAK dipanggil di mana pun —
  // memanggilnya = eksekusi `window.location.href = cetak-excel...` (navigasi
  // penuh keluar halaman list, keluhan user). void → param tetap "terpakai"
  // secara semantik + dokumentasi niat.
  void orig;
  const wrapper = function (this: unknown, ..._args: unknown[]): unknown {
    let url: string;
    try {
      url = buildExportUrl();
    } catch (e) {
      window.console.warn('[penerimaanExport] buildExportUrl error:', e);
      toast('Export gagal — muat ulang halaman lalu coba lagi.', 6000);
      return false;
    }
    window.console.info('[penerimaanExport] loadTableExcel → ' + url);
    // processExport menangani semua kegagalan internal (toast + unduhan file
    // asli server) — TANPA fallback ke fungsi asli: `orig.apply` memicu
    // window.location.navigation ke endpoint cetak-excel (keluhan user —
    // "halaman langsung redirect"). Halaman list harus tetap di tempat.
    void processExport(url).catch((err) => {
      window.console.warn('[penerimaanExport] proses export error:', err);
      toast('Export gagal — coba lagi. Lihat console.', 6000);
    });
    return false;
  };
  (wrapper as unknown as Record<string, unknown>)[WRAP_FLAG] = true;
  return wrapper;
}

function trapLoadTableExcel(): void {
  const w = window as unknown as Record<string, unknown> & {
    __extLoadTrap?: boolean;
    __extTrapSetter?: (v: unknown) => void;
    __extTrapFailed?: boolean;
  };
  const isWrapped = (fn: unknown): boolean =>
    typeof fn === 'function' && (fn as unknown as Record<string, unknown>)[WRAP_FLAG] === true;
  const arm = (): void => {
    let current: unknown = w.loadTableExcel;
    const setter = (newFn: unknown): void => {
      if (typeof newFn !== 'function' || isWrapped(newFn)) {
        current = newFn;
        return;
      }
      current = makeLoadWrapper(newFn as (...a: unknown[]) => unknown);
      window.console.info('[penerimaanExport] loadTableExcel dibungkus (trap)');
    };
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
    } catch {
      if (!w.__extTrapFailed) {
        w.__extTrapFailed = true;
        window.console.warn('[penerimaanExport] trap ditolak, hanya polling');
      }
      return;
    }
    if (typeof current === 'function' && !isWrapped(current)) {
      current = makeLoadWrapper(current as (...a: unknown[]) => unknown);
      window.console.info('[penerimaanExport] loadTableExcel dibungkus');
    }
  };
  arm();
  // Jaring pengaman: pasang ulang trap bila digusur paksa.
  rearmTimer = window.setInterval(() => {
    if (!isListPage()) {
      // Pindah halaman — berhenti total, jangan aktif di route lain.
      cleanup();
      return;
    }
    try {
      const d = Object.getOwnPropertyDescriptor(w, 'loadTableExcel');
      if (d && d.set === w.__extTrapSetter) return;
      w.__extLoadTrap = false;
      arm();
    } catch {
      /* ignore */
    }
  }, 5000);
}

function wrapLoadTableExcel(): void {
  trapLoadTableExcel();
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

  // Salin class & style tombol asli agar tampilan 100% persis dengan tema MORBIS (mis. "btn btn-success")
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

  extExportBtn.title = 'Export resep dengan kolom Waktu Verif/Antrikan + Waktu Klik Selesai';

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

  // Event handler untuk tombol kustom export
  extExportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = buildExportUrl();
    window.console.info('[penerimaanExport] custom btn → ' + url);
    void processExport(url).catch((err) => {
      window.console.warn('[penerimaanExport] proses export error:', err);
      toast('Export gagal — coba lagi. Lihat console.', 6000);
    });
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

  wrapLoadTableExcel();
  onClickExport = (e: MouseEvent): void => {
    const el = e.target as HTMLElement;
    const clickable = el.closest?.(
      'a[href], button, input[type="button"], input[type="submit"], [onclick]',
    ) as HTMLElement | null;
    if (!clickable) return;
    let href = (clickable as HTMLAnchorElement).getAttribute?.('href') || '';
    // Tombol JS: gali URL export dari atribut onclick.
    if (!href) {
      const oc = clickable.getAttribute?.('onclick') || '';
      const m = oc.match(/['"]([^'"]*(?:export|xls|excel|informasi-resep)[^'"]*)['"]/i);
      if (m) href = m[1];
    }
    if (!href && !EXPORT_RE.test(clickable.textContent || '')) return;
    if (href && !EXPORT_RE.test(href) && !EXPORT_RE.test(clickable.textContent || '')) return;
    if (!href) {
      // --- Tombol JS: onclick="loadTableExcel()" / "exportExcel()" dst ---
      const oc = clickable.getAttribute?.('onclick') || '';
      // Deteksi panggilan fungsi JS yang terkait export
      if (!/loadTableExcel|exportExcel|excel|export/i.test(oc)) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation(); // hapus tangan inline onclick

      const url = buildExportUrl();
      window.console.info('[penerimaanExport] intercept onclick → ' + url);
      void processExport(url).catch((err) => {
        window.console.warn('[penerimaanExport] proses export error:', err);
        toast('Export gagal — coba lagi. Lihat console.', 6000);
      });
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const url = new URL(href, location.href).href;
    window.console.info('[penerimaanExport] intercept:', url);
    void processExport(url).catch((err) => {
      window.console.warn('[penerimaanExport] proses export error:', err);
      toast('Export gagal — coba lagi. Lihat console.', 6000);
    });
  };
  document.addEventListener('click', onClickExport, true);

  onSubmitExport = (e: SubmitEvent): void => {
    const f = e.target as HTMLFormElement;
    const action = f?.action || '';
    if (!EXPORT_RE.test(action)) return;
    e.preventDefault();
    e.stopPropagation();
    const fd = new FormData(f);
    const params = new URLSearchParams();
    fd.forEach((v, k) => params.append(k, String(v)));
    const url = action + (action.includes('?') ? '&' : '?') + params.toString();
    window.console.info('[penerimaanExport] intercept form:', url);
    void processExport(url).catch((err) => {
      window.console.warn('[penerimaanExport] proses export error:', err);
      toast('Export gagal — coba lagi. Lihat console.', 6000);
    });
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
