import { getMorbisGlobals } from './shared/types.js';
import { injectSharedCSS, confirmLegacy, safeFetch } from './shared/batchUtils.js';

/**
 * MORBIS Ext — Bulk Verif / Batal Verif (halaman /v2/m-klaim)
 *
 * Kontrak halaman (diverifikasi live 2026-09-29 di SIMRS 103.147.236.140):
 *
 *  - Tabel `#data-table` = daftar klaim (belum terverifikasi).
 *    Kolom Aksi native hanya punya tombol "Detail". Tombol VERIF berada di
 *    halaman detail klaim, memanggil:
 *        POST /v2/m-klaim/control/verif        { id_visit }
 *        -> { kode: 200, message: "..." }
 *
 *  - Tabel `#data-table-verif` = "PASIEN SUDAH TERVERIFIKASI TIM CASEMIX".
 *    Kolom Aksi native punya tombol "Batal Verif" (fungsi global
 *    `BatalVerif(visit)`), yang memanggil:
 *        POST /v2/m-klaim/control/batal-verif  { id_visit }
 *        -> { kode: 200, message: "..." }
 *
 *  - Kedua tabel = DataTables CLIENT-SIDE, jadi seluruh baris sudah ada di
 *    memori. "Pilih semua hasil pencarian" memakai API
 *    `dt.rows({ search: 'applied' })` sehingga mengikuti filter pencarian
 *    asli milik petugas, bukan hanya baris yang sedang tampil.
 *
 * KEBERHASILAN MEMILIH BARIS (syarat utama fitur ini):
 *  1. Identitas baris = `id_visit` yang diambil dari tombol native
 *     `detail(<id>)` di kolom Aksi - BUKAN nomor baris. Jadi pilihan tetap
 *     benar meski tabel digambar ulang, difilter, atau dipindah halamannya.
 *  2. Checkbox SELALU dibangun ulang dari DOM yang sedang tampil
 *     (`syncRows`), tidak pernah dipakai ulang antar-gambar. Kalau node
 *     <tr> dipakai ulang DataTables untuk data berbeda, checkbox lama bisa
 *     membawa id yang salah - itu yang dicegah di sini.
 *  3. Sebelum mengirim, pilihan divalidasi ulang dengan memindai baris NYATA
 *     yang masih memenuhi syarat. Baris yang sudah tidak ada / tidak lagi
 *     memenuhi syarat otomatis dibuang.
 *  4. Kalau pencarian tidak menghasilkan baris sama sekali, "pilih semua"
 *     memilih TIDAK ADA - bukan semua baris yang tampil.
 *
 * KESELAMATAN:
 *  - Batal Verif hanya boleh dipilih untuk baris yang memang sudah punya
 *    tombol "Batal Verif" secara native (artinya sudah terverifikasi).
 *  - Verif dikirim apa pun statusnya; SERVER yang menentukan validitas.
 *    Hasil per-baris dilaporkan apa adanya ke petugas.
 *  - Permintaan dikirim SATU-PER-SATU dengan jeda - server rumah sakit tidak
 *    boleh dipukes oleh satu klik.
 */

const g = getMorbisGlobals();

const CONFIG = {
  endpointVerif: '/v2/m-klaim/control/verif',
  endpointBatal: '/v2/m-klaim/control/batal-verif',
  delayMs: 600, // jeda antar permintaan
  barId: 'ext-bulk-verif-bar',
  cssId: 'ext-bulk-verif-style',
  readyTimeoutMs: 15000,
  readyPollMs: 250,
  // Di atas ambang ini, petugas diberi tahu soal waktu proses.
  warnIfMoreThan: 100,
  // MODE UJI: kolom checkbox ditampilkan tapi SEMUA checkbox nonaktif dan
  // tombol aksi tidak muncul. Dipakai untuk memastikan kolom termuat di
  // browser petugas sebelum mengaktifkan proses massal. Ubah ke false
  // setelah kolom terlihat benar.
  UJI_SAJA: true,
} as const;

type TableKind = 'main' | 'verif';

interface TableTarget {
  sel: string;
  kind: TableKind;
  nama: string;
  aksi: string;
  endpoint: string;
  danger: boolean;
}

const TABLES: TableTarget[] = [
  {
    sel: '#data-table',
    kind: 'main',
    nama: 'Klaim',
    aksi: 'Verif',
    endpoint: CONFIG.endpointVerif,
    danger: false,
  },
  {
    sel: '#data-table-verif',
    kind: 'verif',
    nama: 'Sudah Terverifikasi',
    aksi: 'Batal Verif',
    endpoint: CONFIG.endpointBatal,
    danger: true,
  },
];

/** Satu-satunya sumber kebenaran pilihan. Berisi id_visit. */
const dipilih: Record<TableKind, Set<string>> = {
  main: new Set<string>(),
  verif: new Set<string>(),
};

let sedangProses = false;

// ---------------------------------------------------------------------------
// Logika murni (diekspor untuk unit test - inilah jaminan "tidak salah pilih")
// ---------------------------------------------------------------------------

/** Ringkasan satu baris untuk perhitungan, bebas DOM. */
export interface BarisInfo {
  id: string | null;
  eligible: boolean;
}

/**
 * Terapkan "pilih semua" pada baris hasil filter pencarian.
 *
 * Hanya baris yang punya id dan LAYAK yang disentuh. Kalau hasil pencarian
 * kosong, TIDAK ADA yang dipilih - tidak pernah jatuh ke "pilih semua baris
 * yang sedang tampil".
 * @returns jumlah baris yang terpengaruh
 */
export function applySelectAll(kind: TableKind, rows: BarisInfo[], checked: boolean): number {
  let jumlah = 0;
  rows.forEach((r) => {
    if (!r.id || !r.eligible) return;
    if (checked) dipilih[kind].add(r.id);
    else dipilih[kind].delete(r.id);
    jumlah += 1;
  });
  return jumlah;
}

/**
 * Buang pilihan yang barisnya sudah tidak ada / tidak lagi layak.
 * Dipanggil tepat sebelum proses agar id yang dikirim selalu milik baris nyata.
 * @returns jumlah pilihan yang dibuang
 */
export function pruneSelection(kind: TableKind, existingRows: BarisInfo[]): number {
  const validIds = new Set<string>();
  existingRows.forEach((r) => {
    if (r.id && r.eligible) validIds.add(r.id);
  });

  let gugur = 0;
  Array.from(dipilih[kind]).forEach((id) => {
    if (!validIds.has(id)) {
      dipilih[kind].delete(id);
      gugur += 1;
    }
  });
  return gugur;
}

/** Pilihan saat ini (untuk UI & test). */
export function getSelected(kind: TableKind): string[] {
  return Array.from(dipilih[kind]);
}

/** Kosongkan pilihan (untuk test & tombol Batal Pilih). */
export function clearSelection(kind: TableKind): void {
  dipilih[kind].clear();
}

/** Ambil id_visit dari string onclick native. Murni, tanpa DOM. */
export function parseIdVisit(onclick: string): string | null {
  const m = onclick.match(/\d+/);
  return m ? m[0] : null;
}

/**
 * Kelayakan baris per jenis tabel - inti aturan safety.
 * - 'verif' (Batal Verif): hanya baris yang sudah punya tombol native
 *   "Batal Verif", artinya klaim benar-benar sudah terverifikasi.
 * - 'main' (Verif): semua baris klaim yang punya tombol Detail.
 */
export function isEligible(
  kind: TableKind,
  hasDetail: boolean,
  hasBatalVerifBtn: boolean,
): boolean {
  if (!hasDetail) return false;
  return kind === 'main' ? true : hasBatalVerifBtn;
}

// ---------------------------------------------------------------------------
// Util DOM
// ---------------------------------------------------------------------------

function injectCSS(): void {
  if (document.getElementById(CONFIG.cssId)) return;

  const style = document.createElement('style');
  style.id = CONFIG.cssId;
  style.textContent = `
    #${CONFIG.barId} {
      position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
      z-index: 2147482000; display: none; align-items: center; gap: 14px;
      background: #0f172a; color: #f8fafc; border-radius: 12px;
      padding: 10px 16px; font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; box-shadow: 0 8px 28px rgba(15,23,42,.35);
    }
    #${CONFIG.barId} .bv-item { display: flex; align-items: center; gap: 8px; }
    #${CONFIG.barId} .bv-label { color: #cbd5e1; }
    #${CONFIG.barId} .bv-count { color: #f8fafc; font-weight: 700; }
    #${CONFIG.barId} button {
      border: none; border-radius: 8px; cursor: pointer; padding: 7px 14px;
      font-size: 12.5px; font-weight: 700; font-family: inherit;
    }
    #${CONFIG.barId} .bv-aksi { background: #2563eb; color: #fff; }
    #${CONFIG.barId} .bv-aksi:hover { background: #1d4ed8; }
    #${CONFIG.barId} .bv-aksi-danger { background: #dc2626; color: #fff; }
    #${CONFIG.barId} .bv-aksi-danger:hover { background: #b91c1c; }
    #${CONFIG.barId} .bv-reset { background: #334155; color: #e2e8f0; }
    #${CONFIG.barId} .bv-reset:hover { background: #475569; }
    #${CONFIG.barId} button:disabled { opacity: .55; cursor: not-allowed; }

    .bv-check {
      display: inline-flex; align-items: center; justify-content: center;
      margin-right: 6px; vertical-align: middle; cursor: pointer;
    }
    .bv-check input { width: 14px; height: 14px; cursor: pointer; margin: 0; }
    .bv-check input:disabled { cursor: not-allowed; }
    th.bv-th-head { width: 26px; }
    /* Kolom khusus checkbox - sel tersendiri di awal baris. Header native
       TIDAK disentuh supaya indeks sorting bawaan tidak bergeser. */
    td.bv-sel {
      width: 30px; text-align: center; vertical-align: middle;
      padding: 4px 2px !important; border-right: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    td.bv-sel input { width: 15px; height: 15px; cursor: pointer; margin: 0; }
    td.bv-sel input:disabled { cursor: not-allowed; }
    /* Penanda fitur aktif - memudahkan diagnosis di console */
    html[data-ext-bulk-verif='1'] td.bv-sel { background: #eff6ff; }
  `;

  document.head.appendChild(style);
  injectSharedCSS();
}

function getTableEl(target: TableTarget): HTMLTableElement | null {
  return document.querySelector<HTMLTableElement>(target.sel);
}

function getDataTable(target: TableTarget): any {
  const jq = (window as unknown as { jQuery?: (s: string) => any }).jQuery;
  if (!jq) return null;
  try {
    return jq(target.sel).DataTable() ?? null;
  } catch {
    return null;
  }
}

function toEl(node: unknown): HTMLElement[] {
  return (Array.isArray(node) ? node : [node]).filter(
    (n): n is HTMLElement => n instanceof HTMLElement,
  );
}

/** id_visit dari aksi native (detail / BatalVerif) - sumber = UI asli.
 *  Dicari di elemen APA PUN (button, <a>, <span>, <i>, dst) karena markup
 *  tombol Aksi bisa berbeda antar-host SIMRS (140/138/192.168.8.4/dev).
 *  Angka di dalam onclick = id_visit, bukan nomor baris - pilihan tetap
 *  1:1 dengan klaim asli. */
function getIdVisit(row: HTMLElement): string | null {
  const el = row.querySelector<HTMLElement>('[onclick*="detail("]');
  if (el) {
    const m = (el.getAttribute('onclick') || '').match(/\d+/);
    if (m) return m[0];
  }
  const bV = row.querySelector<HTMLElement>('[onclick*="BatalVerif("]');
  if (bV) {
    const m = (bV.getAttribute('onclick') || '').match(/\d+/);
    if (m) return m[0];
  }
  return null;
}

/**
 * Baris yang boleh dicentang untuk aksi tabel ini.
 * - Batal Verif: HANYA baris yang punya tombol "Batal Verif" native
 *   (sudah terverifikasi) - mencegah kirim ke klaim yang belum terverifikasi.
 */
function bolehPilih(target: TableTarget, row: HTMLElement): boolean {
  return isEligible(
    target.kind,
    !!row.querySelector('button[onclick*="detail("]'),
    !!row.querySelector('button[onclick*="BatalVerif("]'),
  );
}

/** Baris -> BarisInfo untuk logika murni. */
function toBarisInfo(target: TableTarget, row: HTMLElement): BarisInfo {
  return { id: getIdVisit(row), eligible: bolehPilih(target, row) };
}

/**
 * Baris hasil filter pencarian aktif (lintas halaman).
 *
 * Kalau DataTables API tersedia, hasilnya dipakai APA ADANYA - termasuk hasil
 * KOSONG. Kalau hasil kosong dijatuhkan ke fallback DOM, "pilih semua" akan
 * diam-diam memilih semua baris yang tampil. Fallback hanya untuk kasus API-nya
 * memang tidak ada.
 */
function getBarisTersaring(target: TableTarget): HTMLElement[] {
  const table = getTableEl(target);
  if (!table) return [];

  const dt = getDataTable(target);
  if (dt) {
    try {
      return toEl(dt.rows({ search: 'applied' }).nodes().toArray());
    } catch {
      /* abaikan, pakai DOM */
    }
  }

  return Array.from(table.querySelectorAll<HTMLElement>('tbody tr')).filter(
    (tr) => !tr.classList.contains('dataTables_empty'),
  );
}

/**
 * SEMUA baris, tanpa memedulikan filter (client-side menyimpan semuanya di
 * memori). Dipakai untuk validasi ulang pilihan sebelum mengirim - termasuk
 * baris yang tidak terlihat karena petugas sedang mencari data lain.
 */
function getSemuaBaris(target: TableTarget): HTMLElement[] {
  const table = getTableEl(target);
  if (!table) return [];

  const dt = getDataTable(target);
  if (dt) {
    try {
      return toEl(dt.rows().nodes().toArray());
    } catch {
      /* pakai DOM */
    }
  }

  return Array.from(table.querySelectorAll<HTMLElement>('tbody tr')).filter(
    (tr) => !tr.classList.contains('dataTables_empty'),
  );
}

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------

/**
 * Bangun checkbox untuk satu baris - SELALU elemen baru.
 * Jangan pernah mengandalkan checkbox yang sudah menempel di node <tr>:
 * DataTables bisa memakai ulang node itu untuk data berbeda saat tabel
 * digambar ulang, dan checkbox lama akan membawa id_visit yang salah.
 */
function renderCheckbox(target: TableTarget, row: HTMLElement): void {
  const id = getIdVisit(row);

  // Kolom wajib tampil untuk SETIAP baris (termasuk saat mode uji), sehingga
  // petugas selalu melihat kolomnya. Kalau id tidak terbaca dari markup host,
  // checkbox tetap dirender tapi NONAKTIF - baris tak dikenal tidak boleh
  // dipilih (jaminan "tidak salah pilih baris").
  if (!id) {
    const cell = document.createElement('td');
    cell.className = 'bv-sel';
    cell.dataset.extBvUnid = '1';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.disabled = true;
    cb.title = 'id_visit tidak terbaca dari markup baris ini';
    cell.appendChild(cb);
    row.insertBefore(cell, row.firstChild);
    return;
  }

  const sel = bolehPilih(target, row);

  // Kolom khusus: sel <td> tersendiri di AWAL baris.
  // Header native TIDAK ditambah kolom baru - bila ditambah, indeks sorting
  // bawaan DataTables bergeser dan sorting DataTables ikut salah kolom.
  // Checkbox "pilih semua" tetap di th kolom "No".
  const cell = document.createElement('td');
  cell.className = 'bv-sel';

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.dataset.extBvId = id;
  cb.checked = dipilih[target.kind].has(id); // Set = sumber kebenaran

  if (CONFIG.UJI_SAJA) {
    // Mode uji: kolom tampil, checkbox nonaktif, tidak ada proses.
    cb.disabled = true;
    cb.title = 'Mode uji - belum bisa dipilih';
  } else {
    cb.disabled = !sel;
    cb.title = sel ? 'Pilih baris ini' : 'Baris tidak memenuhi syarat aksi ini';
    cb.addEventListener('change', () => {
      if (cb.checked) dipilih[target.kind].add(id);
      else dipilih[target.kind].delete(id);
      updateBar();
      syncHeaderState(target);
    });
  }

  cell.appendChild(cb);
  row.insertBefore(cell, row.firstChild);
}

/** Buang kolom checkbox di tbody (header di thead tidak disentuh). */
function stripRowCheckboxes(table: HTMLElement): void {
  table.querySelectorAll('tbody td.bv-sel').forEach((el) => el.remove());
}

/**
 * Sinkronkan checkbox dengan DOM yang sedang tampil. Dipanggil setiap kali
 * DataTables menggambar ulang tabel (cari / ganti halaman / ubah Show
 * entries) supaya checkbox selalu cocok dengan baris yang tampil.
 */
function syncRows(target: TableTarget): void {
  const table = getTableEl(target);
  if (!table) return;

  stripRowCheckboxes(table);
  table.querySelectorAll<HTMLElement>('tbody tr').forEach((tr) => renderCheckbox(target, tr));
  syncHeaderState(target);
}

/** State checkbox header: checked / indeterminate / disabled. */
function syncHeaderState(target: TableTarget): void {
  const table = getTableEl(target);
  const cb = table?.querySelector<HTMLInputElement>('thead input[data-ext-bv-header]');
  if (!cb) return;

  const baris = getBarisTersaring(target).filter((tr) => bolehPilih(target, tr));
  const total = baris.length;
  const tercentang = baris.filter((tr) => {
    const id = getIdVisit(tr);
    return !!id && dipilih[target.kind].has(id);
  }).length;

  cb.disabled = CONFIG.UJI_SAJA || sedangProses || total === 0;
  cb.checked = total > 0 && tercentang === total;
  cb.indeterminate = tercentang > 0 && tercentang < total;
}

function renderHeaderCheckbox(target: TableTarget): void {
  const table = getTableEl(target);
  const th = table?.querySelector<HTMLElement>('thead th');
  if (!th) return;

  if (th.dataset.extBvHeader === '1') {
    syncHeaderState(target);
    return;
  }

  th.classList.add('bv-th-head');
  const wrap = document.createElement('span');
  wrap.className = 'bv-check';
  wrap.title = 'Pilih / batal pilih semua baris yang cocok dengan pencarian';

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.dataset.extBvHeader = '1';
  if (CONFIG.UJI_SAJA) {
    cb.disabled = true;
    cb.title = 'Mode uji - belum bisa dipilih';
    wrap.appendChild(cb);
    th.insertBefore(wrap, th.firstChild);
    th.dataset.extBvHeader = '1';
    return;
  }
  cb.addEventListener('change', () => {
    // Hanya baris hasil filter pencarian - persis yang dilihat petugas.
    const baris = getBarisTersaring(target).map((tr) => toBarisInfo(target, tr));
    applySelectAll(target.kind, baris, cb.checked);
    syncRows(target);
    updateBar();
  });

  wrap.appendChild(cb);
  th.insertBefore(wrap, th.firstChild);
  th.dataset.extBvHeader = '1';
}

function renderAll(): void {
  TABLES.forEach((t) => {
    if (!getTableEl(t)) return;
    renderHeaderCheckbox(t);
    syncRows(t);
  });
  updateBar();
}

// ---------------------------------------------------------------------------
// Action bar
// ---------------------------------------------------------------------------

function getBar(): HTMLElement | null {
  return document.getElementById(CONFIG.barId);
}

function updateBar(): void {
  const bar = getBar();
  if (!bar) return;

  const isi = TABLES.map((t) => [t, dipilih[t.kind].size] as const).filter(([, n]) => n > 0);

  if (CONFIG.UJI_SAJA || isi.length === 0 || sedangProses) {
    bar.style.display = 'none';
    return;
  }

  bar.innerHTML = '';
  isi.forEach(([t, n]) => {
    const item = document.createElement('div');
    item.className = 'bv-item';

    const label = document.createElement('span');
    label.className = 'bv-label';
    label.textContent = `${t.nama}: `;

    const count = document.createElement('span');
    count.className = 'bv-count';
    count.textContent = `${n} dipilih`;

    const btn = document.createElement('button');
    btn.className = t.danger ? 'bv-aksi bv-aksi-danger' : 'bv-aksi';
    btn.textContent = t.aksi;
    btn.addEventListener('click', () => void jalankanAksi(t));

    item.append(label, count, btn);
    bar.appendChild(item);
  });

  const reset = document.createElement('button');
  reset.className = 'bv-reset';
  reset.textContent = 'Batal Pilih';
  reset.addEventListener('click', () => {
    TABLES.forEach((t) => clearSelection(t.kind));
    renderAll();
  });
  bar.appendChild(reset);

  bar.style.display = 'flex';
}

function buildBar(): void {
  if (getBar()) return;
  const bar = document.createElement('div');
  bar.id = CONFIG.barId;
  bar.style.display = 'none';
  document.body.appendChild(bar);
}

// ---------------------------------------------------------------------------
// Eksekusi
// ---------------------------------------------------------------------------

interface HasilSatu {
  id: string;
  ok: boolean;
  pesan: string;
}

async function kirimSatu(endpoint: string, idVisit: string): Promise<HasilSatu> {
  try {
    const body = new URLSearchParams({ id_visit: idVisit });
    const res = await safeFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body.toString(),
      credentials: 'same-origin',
    });

    if (!res.ok) return { id: idVisit, ok: false, pesan: `HTTP ${res.status}` };

    const json = (await res.json()) as { kode?: number | string; message?: string };
    const ok = String(json.kode) === '200';
    return { id: idVisit, ok, pesan: json.message ?? (ok ? 'Sukses' : 'Gagal') };
  } catch (err) {
    return { id: idVisit, ok: false, pesan: (err as Error).message || 'Gagal koneksi' };
  }
}

/**
 * Validasi ulang pilihan terhadap baris NYATA di tabel.
 * Ini penjaga terakhir supaya id yang dikirim benar-benar milik baris yang
 * masih ada dan masih memenuhi syarat - bukan sisa checkbox basi.
 */
function validasiUlang(target: TableTarget): { valid: string[]; gugur: number } {
  const semua = getSemuaBaris(target).map((tr) => toBarisInfo(target, tr));
  const gugur = pruneSelection(target.kind, semua);
  return { valid: getSelected(target.kind), gugur };
}

async function jalankanAksi(target: TableTarget): Promise<void> {
  if (sedangProses) return;

  const { valid, gugur } = validasiUlang(target);
  if (valid.length === 0) {
    clearSelection(target.kind);
    renderAll();
    await confirmLegacy({
      title: 'Tidak ada baris yang bisa diproses',
      message: 'Pilihan tidak lagi cocok dengan data di tabel. Silakan pilih ulang.',
      okLabel: 'Mengerti',
      hideCancel: true,
    });
    return;
  }

  const perkiraanDetik = Math.ceil((valid.length * CONFIG.delayMs) / 1000);
  const pesan = [`${target.nama}: ${valid.length} baris akan diproses.`];
  if (gugur > 0) pesan.push(`${gugur} pilihan diabaikan (data berubah/tidak memenuhi syarat).`);
  pesan.push(
    target.danger
      ? 'Verifikasi yang dibatalkan kembali ke daftar belum terverifikasi.'
      : 'Data yang tidak memenuhi syarat akan ditolak server.',
  );
  if (valid.length > CONFIG.warnIfMoreThan) {
    pesan.push(`PERINGATAN: jumlah besar, proses ±${perkiraanDetik} detik. Jangan tutup halaman.`);
  }
  pesan.push('Lanjutkan?');

  const konfirmasi = await confirmLegacy({
    title: `${target.aksi} ${valid.length} data?`,
    message: pesan.join('\n'),
    variant: target.danger ? 'danger' : 'primary',
    okLabel: `Ya, ${target.aksi}`,
    cancelLabel: 'Batal',
  });
  if (!konfirmasi) return;

  sedangProses = true;
  TABLES.forEach((t) => syncHeaderState(t));
  updateBar();

  const gagal: HasilSatu[] = [];
  let sukses = 0;

  for (let i = 0; i < valid.length; i += 1) {
    const hasil = await kirimSatu(target.endpoint, valid[i]);
    if (hasil.ok) sukses += 1;
    else gagal.push(hasil);

    const bar = getBar();
    const label = bar?.querySelector('.bv-label');
    if (label) label.textContent = `${target.nama} (${i + 1}/${valid.length}): `;

    if (i < valid.length - 1) await new Promise((r) => setTimeout(r, CONFIG.delayMs));
  }

  sedangProses = false;
  clearSelection(target.kind);
  renderAll();

  const laporan = [`${target.aksi} selesai.`, `Berhasil: ${sukses} dari ${valid.length}`];
  if (gagal.length > 0) {
    laporan.push('', `Gagal: ${gagal.length}`);
    gagal.slice(0, 10).forEach((h) => laporan.push(`#${h.id} - ${h.pesan}`));
    if (gagal.length > 10) laporan.push(`... dan ${gagal.length - 10} lainnya`);
  }

  await confirmLegacy({
    title: 'Hasil',
    message: laporan.join('\n'),
    okLabel: 'Muat ulang tabel',
    hideCancel: true,
  });

  window.location.reload();
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

/** Tunggu tabel + DataTable siap (halaman memuat data lewat AJAX). */
function waitForTables(): Promise<void> {
  return new Promise((resolve) => {
    const mulai = Date.now();
    const cek = (): void => {
      const ada = TABLES.some((t) => getTableEl(t));
      if (ada || Date.now() - mulai > CONFIG.readyTimeoutMs) {
        resolve();
        return;
      }
      setTimeout(cek, CONFIG.readyPollMs);
    };
    cek();
  });
}

function bindDataTablesRedraw(): void {
  const jq = (window as unknown as { jQuery?: (s: string) => any }).jQuery;
  if (!jq) return;

  TABLES.forEach((t) => {
    if (!getTableEl(t)) return;
    try {
      // off dulu supaya tidak terikat dua kali kalau init berjalan ulang
      jq(t.sel)
        .off('draw.dt.extBv')
        .on('draw.dt.extBv', () => {
          if (sedangProses) return;
          syncRows(t);
          updateBar();
        });
    } catch {
      /* abaikan - render awal tetap jalan */
    }
  });
}

export function initMKlaimBulkVerifFeature(): void {
  try {
    injectCSS();

    void waitForTables().then(() => {
      buildBar();
      renderAll();
      bindDataTablesRedraw();
      document.documentElement.setAttribute('data-ext-bulk-verif', '1');
      const ringkas = TABLES.map((t) => {
        const tbl = getTableEl(t);
        const baris = tbl ? tbl.querySelectorAll('tbody tr:not(.dataTables_empty)').length : 0;
        const selBv = tbl ? tbl.querySelectorAll('tbody td.bv-sel').length : 0;
        const unid = tbl ? tbl.querySelectorAll('tbody td.bv-sel[data-ext-bv-unid]').length : 0;
        return `${t.sel}: kolom=${selBv}/${baris}${unid ? ` (${unid} tanpa id)` : ''}`;
      });
      console.log(
        '[BulkVerif] Init complete -',
        ringkas.join(' | '),
        CONFIG.UJI_SAJA ? '(MODE UJI: checkbox nonaktif)' : '',
      );
    });
  } catch (err) {
    console.error('[BulkVerif] Init error:', err);
  }
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.mKlaimBulkVerif = {
    id: 'mKlaimBulkVerif',
    name: 'Bulk Verif / Batal Verif',
    description: 'Verifikasi atau batalkan verifikasi banyak klaim sekaligus',
    match: { regex: /^\/v2\/m-klaim\/?$/ },
    run: initMKlaimBulkVerifFeature,
  };
}
