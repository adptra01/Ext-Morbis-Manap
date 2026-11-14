/**
 * pasienRajalCounter — ringkasan TOTAL PASIEN RAJAL hari itu di halaman
 * /inventory/resep/penerimaan (3 angka: Belum Diperiksa, Sudah Diperiksa,
 * Sudah Bayar).
 *
 * Sumber angka: jumlah baris tabel pelaksanaan pelayanan (halaman admisi),
 * diambil via fetch persis seperti loadTable MORBIS — halaman asli TIDAK
 * diubah (tanpa navigasi, tanpa scraping halaman penerimaan):
 *   /admisi/pelaksanaan_pelayanan/table?...&status_periksa=belum|selesai|bayar
 *
 * Tanggal ikut input #date-start/#date-end form penerimaan (dd/mm/yyyy);
 * fallback hari ini. Diperbarui saat #search diklik — listener, tanpa polling.
 */
import { getMorbisGlobals } from './shared/types.js';
import { farmasiAppBase } from './shared/farmasiQueueSync.js';

const g = getMorbisGlobals();

const HOST_ID = 'ext-pasien-rajal-counter';
const HOST_ID_RANAP = 'ext-pasien-ranap-counter';
const HOST_ID_RESEP = 'ext-resep-penerimaan-counter';

const STATUS: ReadonlyArray<readonly [string, string]> = [
  ['belum', 'Belum Diperiksa'],
  ['selesai', 'Sudah Diperiksa'],
  ['bayar', 'Sudah Bayar'],
];

const STATUS_RANAP: ReadonlyArray<readonly [string, string]> = [
  ['belum', 'Belum Discharge'],
  ['selesai', 'Sudah Discharge'],
];

/** Tab tabel penerimaan → label counter. */
const TIPE_RESEP: ReadonlyArray<readonly [string, string]> = [
  ['selesai', 'Sudah Diterima'],
  ['masuk', 'Belum Diterima'],
];

/** URL tabel pelaksanaan pelayanan — persis pola loadTable MORBIS. */
export function buildPelaksanaanUrl(status: string, dateStart: string, dateEnd: string): string {
  return (
    '/admisi/pelaksanaan_pelayanan/table?search[date_start]=' +
    dateStart +
    '&status_periksa=' +
    status +
    '&search[date_end]=' +
    dateEnd +
    '&search[no_rm]=&search[dokter]=&search[jam_awal]=&search[jam_akhir]=&search[shift]=' +
    '&search[noreg]=&search[cari_dokter]=&search[id_unit]='
  );
}

/** URL endpoint publik Reports SIMRS untuk total pasien rajal (JSON). */
export function buildRajalTotalsUrl(tanggal: string): string {
  return farmasiAppBase() + '/rekap-pasien-rajal?tanggal=' + encodeURIComponent(tanggal);
}

/** Jumlah baris data tabel: buang baris header (<th>) dan baris placeholder
 *  "Tidak ada data yang dapat ditampilkan" (sel ber-colspan). */
export function countDataRows(html: string): number {
  const rows = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) ?? [];
  return rows.filter((r) => /<td[\s>]/i.test(r) && !/colspan/i.test(r)).length;
}

/** Total baris dari teks "Jumlah Total: N" (lebih andal daripada menghitung
 *  <tr>, karena tabel hanya menampilkan 1 halaman). Cadangan: hitung <tr>. */
export function parseTotal(html: string): number {
  const m = /Jumlah\s+Totals?\s*:\s*(\d+)/i.exec(html);
  if (m) return parseInt(m[1], 10);
  return countDataRows(html);
}

/** Ada halaman berikutnya di tabel admisi? (tombol .page-next). */
export function hasNextRajalPage(html: string): boolean {
  return /class\s*=\s*["']?[^"'>]*page-next/i.test(html);
}

/** Hitung baris pasien yang kolom Status Kunjungan memuat badge "RESEP". */
export function countResepRows(html: string): number {
  const rows = html.match(/<tr[\s>][\s\S]*?<\/tr>/gi) ?? [];
  return rows.filter((r) => /<td[\s>]/i.test(r) && !/colspan/i.test(r) && /RESEP/i.test(r)).length;
}

/** URL tabel detail rawat inap. tipe: 'belum' (belum discharge) / 'selesai'. */
export function buildRanapUrl(tipe: string, tgl1: string, tgl2: string): string {
  return (
    '/admisi/detail-rawat-inap?section=tabel' +
    '&search[no_rm]=' +
    '&search[no_reg]=' +
    '&search[pasien]=' +
    '&search[id_unit]=' +
    '&search[dokter]=' +
    '&search[status_kunjungan]=' +
    '&tgl1=' +
    encodeURIComponent(tgl1) +
    '&tgl2=' +
    encodeURIComponent(tgl2) +
    '&tipe=' +
    encodeURIComponent(tipe) +
    '&id_jenis_asuransi='
  );
}

/** Total pasien ranap dari teks "Jumlah Total Pasien : N". */
export function parseRanapTotal(html: string): number {
  const m = /Jumlah\s+Total\s+Pasien\s*:\s*(\d+)/i.exec(html);
  if (m) return parseInt(m[1], 10);
  return 0;
}

function log(...args: unknown[]): void {
  console.log('[MORBIS Ext]', ...args);
}

/** Rentang tanggal dd/mm/yyyy dari form; fallback hari ini. */
function readDateRange(): [string, string] {
  const val = (id: string): string =>
    (document.getElementById(id) as HTMLInputElement | null)?.value?.trim() || '';
  const d = new Date();
  const p = (n: number): string => String(n).padStart(2, '0');
  const today = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  return [val('date-start') || today, val('date-end') || today];
}

/** Pasang kotak ringkasan di ujung td pertama form#searchTable. */
function makeHost(): HTMLElement | null {
  const td = document.querySelector('form#searchTable td');
  if (!td) return null;

  const fs = document.createElement('fieldset');
  fs.id = HOST_ID;
  fs.className = 'field-group';
  const legend = document.createElement('legend');
  legend.textContent = 'Total Pasien Rajal';
  fs.appendChild(legend);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:18px;flex-wrap:wrap;';
  for (const [key, label] of STATUS) {
    const box = document.createElement('div');
    const num = document.createElement('div');
    num.id = HOST_ID + '-' + key;
    num.style.cssText = 'font-size:20px;font-weight:700;line-height:1.1;';
    num.textContent = '…';
    const cap = document.createElement('div');
    cap.style.cssText = 'font-size:11px;color:#667085;';
    cap.textContent = label;
    box.appendChild(num);
    box.appendChild(cap);
    row.appendChild(box);
  }
  fs.appendChild(row);
  td.appendChild(fs);
  return fs;
}

/** Pasang kotak ringkasan ranap di ujung td pertama form#searchTable (bawah rajal). */
function makeRanapHost(): HTMLElement | null {
  const td = document.querySelector('form#searchTable td');
  if (!td) return null;
  if (document.getElementById(HOST_ID_RANAP)) return document.getElementById(HOST_ID_RANAP);

  const fs = document.createElement('fieldset');
  fs.id = HOST_ID_RANAP;
  fs.className = 'field-group';
  const legend = document.createElement('legend');
  legend.textContent = 'Total Pasien Ranap';
  fs.appendChild(legend);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:18px;flex-wrap:wrap;';
  for (const [key, label] of STATUS_RANAP) {
    const box = document.createElement('div');
    const num = document.createElement('div');
    num.id = HOST_ID_RANAP + '-' + key;
    num.style.cssText = 'font-size:20px;font-weight:700;line-height:1.1;';
    num.textContent = '…';
    const cap = document.createElement('div');
    cap.style.cssText = 'font-size:11px;color:#667085;';
    cap.textContent = label;
    box.appendChild(num);
    box.appendChild(cap);
    row.appendChild(box);
  }
  fs.appendChild(row);
  td.appendChild(fs);
  return fs;
}

/** Nilai filter form halaman penerimaan (dibaca dari id input). */
export type PenerimaanSearch = Record<string, string>;

/** Field form penerimaan: id elemen → nama param `search[...]`. */
const PENERIMAAN_FIELDS: ReadonlyArray<readonly [string, string]> = [
  ['date-start-kj', 'date_start_kj'],
  ['date-end-kj', 'date_end_kj'],
  ['date-start', 'date_start'],
  ['date-end', 'date_end'],
  ['norm', 'no_rm'],
  ['no_registrasi', 'no_registrasi'],
  ['status_pasien', 'status_pasien'],
  ['idUnit', 'id_unit_asal'],
  ['unit_tujuan', 'id_unit_tujuan'],
  ['pasien', 'pasien'],
  ['no_resep', 'no_resep'],
  ['jenis_kategori_pengajuan_resep', 'kategori_resep'],
];

/** Baca filter dari form #searchTable (id elemen MORBIS). */
export function readPenerimaanSearch(): PenerimaanSearch {
  const s: PenerimaanSearch = {};
  for (const [id, param] of PENERIMAAN_FIELDS) {
    s[param] =
      (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value?.trim() ??
      '';
  }
  return s;
}

/** URL tabel penerimaan — mirror loadTableData() halaman asli. */
export function buildPenerimaanUrl(tipe: string, s: PenerimaanSearch): string {
  let q = '/inventory/resep/penerimaan/table?tipe=' + encodeURIComponent(tipe);
  for (const [, param] of PENERIMAAN_FIELDS) {
    q += '&search[' + param + ']=' + encodeURIComponent(s[param] ?? '');
  }
  return q;
}

/** Baris pasien dari tabel penerimaan: nama, no RM, poli (Unit Sekarang). */
export interface ResepRow {
  nama: string;
  rm: string;
  poli: string;
}

/** Parse baris tabel penerimaan (header-driven; jumlah <td> bisa < <th>
 *  karena kolom Aksi/No Antrian kadang digabung/tidak ada). */
export function parsePenerimaanRows(html: string): ResepRow[] {
  const strip = (s: string): string =>
    s
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
  const ths = (html.match(/<th[^>]*>[\s\S]*?<\/th>/gi) ?? []).map(strip);
  const iRm = ths.indexOf('No RM');
  const iNama = ths.indexOf('Pasien');
  const iPoli = ths.indexOf('Unit Sekarang');
  if (iRm < 0 || iNama < 0) return [];

  const out: ResepRow[] = [];
  for (const tr of html.match(/<tr[^>]*\bid="\d+"[^>]*>[\s\S]*?<\/tr>/gi) ?? []) {
    const tds = (tr.match(/<td[^>]*>[\s\S]*?<\/td>/gi) ?? []).map(strip);
    const off = ths.length - tds.length; // sel yang hilang di depan baris
    const at = (i: number): string => (i >= 0 ? (tds[i - off] ?? '') : '');
    const nama = at(iNama);
    if (!nama) continue;
    out.push({ nama, rm: at(iRm), poli: at(iPoli) });
  }
  return out;
}

/** Modal daftar pasien (nama (RM) — poli), scroll di dalam kotak. */
function openRowsModal(title: string, rows: ResepRow[] | null): void {
  document.getElementById('ext-resep-modal')?.remove();
  const ov = document.createElement('div');
  ov.id = 'ext-resep-modal';
  ov.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.55);' +
    'display:flex;align-items:center;justify-content:center;padding:24px;';
  const box = document.createElement('div');
  box.style.cssText =
    'background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.35);' +
    'width:820px;max-width:95vw;max-height:82vh;display:flex;flex-direction:column;' +
    'overflow:hidden;font-family:Roboto,"Segoe UI",system-ui,sans-serif;';
  const head = document.createElement('div');
  head.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;gap:12px;' +
    'padding:14px 18px;border-bottom:1px solid #e4e7ec;';
  const h = document.createElement('div');
  h.style.cssText = 'font-size:16px;font-weight:700;color:#1c2530;';
  h.textContent = rows ? `${title} (${rows.length})` : title;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '×';
  btn.style.cssText =
    'border:none;background:#f2f4f7;color:#344054;border-radius:8px;width:32px;height:32px;' +
    'cursor:pointer;font-size:18px;line-height:1;';
  const onKey = (ev: KeyboardEvent): void => {
    if (ev.key === 'Escape') close();
  };
  const close = (): void => {
    document.removeEventListener('keydown', onKey);
    ov.remove();
  };
  btn.addEventListener('click', close);
  head.appendChild(h);
  head.appendChild(btn);

  const body = document.createElement('div');
  body.style.cssText = 'overflow:auto;padding:0 18px 18px;flex:1 1 auto;';
  if (!rows) {
    const wait = document.createElement('div');
    wait.style.cssText = 'padding:24px 0;color:#667085;font-size:14px;';
    wait.textContent = 'Memuat data pasien…';
    body.appendChild(wait);
  } else if (!rows.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:24px 0;color:#667085;font-size:14px;';
    empty.textContent = 'Tidak ada data.';
    body.appendChild(empty);
  } else {
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;margin-top:8px;';
    table.innerHTML =
      '<thead><tr style="position:sticky;top:0;background:#f9fafb;">' +
      '<th style="text-align:left;padding:8px;border-bottom:1px solid #e4e7ec;">Nama Pasien (RM)</th>' +
      '<th style="text-align:left;padding:8px;border-bottom:1px solid #e4e7ec;">Poli</th>' +
      '</tr></thead><tbody></tbody>';
    const tb = table.querySelector('tbody') as HTMLTableSectionElement;
    for (const r of rows) {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.style.cssText = 'padding:8px;border-bottom:1px solid #f2f4f7;';
      td1.textContent = r.rm ? `${r.nama} (${r.rm})` : r.nama;
      const td2 = document.createElement('td');
      td2.style.cssText = 'padding:8px;border-bottom:1px solid #f2f4f7;color:#475467;';
      td2.textContent = r.poli || '—';
      tr.appendChild(td1);
      tr.appendChild(td2);
      tb.appendChild(tr);
    }
    body.appendChild(table);
  }

  box.appendChild(head);
  box.appendChild(body);
  ov.appendChild(box);
  ov.addEventListener('click', (e) => {
    if (e.target === ov) close();
  });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(ov);
}

/** Klik angka → ambil semua halaman → tampilkan modal daftar pasien. */
async function showPenerimaanRows(tipe: string, label: string): Promise<void> {
  const s = readPenerimaanSearch();
  openRowsModal(`Resep ${label}`, null);
  const rows: ResepRow[] = [];
  let total = 0;
  // Halaman penerimaan tidak punya `.page-next` (pager-nya `class='block'`),
  // jadi patokan berhenti = "Jumlah Total" dari halaman pertama.
  for (let page = 1; page <= 50; page++) {
    try {
      const resp = await fetch(buildPenerimaanUrl(tipe, s) + (page > 1 ? '&page=' + page : ''), {
        credentials: 'include',
        cache: 'no-store',
        headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
      });
      if (!resp.ok) break;
      const html = await resp.text();
      if (page === 1) total = parseTotal(html);
      const got = parsePenerimaanRows(html);
      if (!got.length) break;
      rows.push(...got);
      if (rows.length >= total) break;
    } catch {
      break;
    }
  }
  openRowsModal(`Resep ${label}`, rows);
}

/** Pasang kotak total resep (sudah/belum diterima) di bawah kotak ranap. */
function makeResepHost(): HTMLElement | null {
  const td = document.querySelector('form#searchTable td');
  if (!td) return null;
  if (document.getElementById(HOST_ID_RESEP)) return document.getElementById(HOST_ID_RESEP);

  const fs = document.createElement('fieldset');
  fs.id = HOST_ID_RESEP;
  fs.className = 'field-group';
  const legend = document.createElement('legend');
  legend.textContent = 'Total Resep (Penerimaan)';
  fs.appendChild(legend);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:18px;flex-wrap:wrap;';
  for (const [tipe, label] of TIPE_RESEP) {
    const box = document.createElement('div');
    const num = document.createElement('div');
    num.id = HOST_ID_RESEP + '-' + tipe;
    num.style.cssText = 'font-size:20px;font-weight:700;line-height:1.1;';
    num.textContent = '…';
    const cap = document.createElement('div');
    cap.style.cssText = 'font-size:11px;color:#667085;';
    cap.textContent = label;
    box.appendChild(num);
    box.appendChild(cap);
    row.appendChild(box);
  }
  fs.appendChild(row);
  td.appendChild(fs);
  return fs;
}

/** Hitung (lazy, saat hover) jumlah pasien dengan resep untuk satu status. */
async function computeResepHover(
  key: string,
  ds: string,
  de: string,
  el: HTMLElement,
): Promise<void> {
  if (el.dataset.resepLoaded === '1') return;
  el.title = 'Menghitung pasien dengan resep…';
  let count = 0;
  try {
    let html = '';
    const resp = await fetch(buildPelaksanaanUrl(key, ds, de), {
      credentials: 'include',
      cache: 'no-store',
      headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
    });
    if (resp.ok) {
      html = await resp.text();
      count += countResepRows(html);
      let page = 2;
      while (hasNextRajalPage(html) && page <= 20) {
        const r2 = await fetch(buildPelaksanaanUrl(key, ds, de) + '&page=' + page, {
          credentials: 'include',
          cache: 'no-store',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
        });
        if (!r2.ok) break;
        html = await r2.text();
        count += countResepRows(html);
        if (!hasNextRajalPage(html)) break;
        page += 1;
      }
    }
  } catch {
    /* biarkan count 0 */
  }
  el.dataset.resepLoaded = '1';
  el.title = 'Pasien dengan resep: ' + count;
}

async function refresh(): Promise<void> {
  const [ds, de] = readDateRange();
  for (const [key] of STATUS) {
    const el = document.getElementById(HOST_ID + '-' + key);
    if (el) el.textContent = '…';
  }
  // Total pasien rajal (unit-scoped di MORBIS). Untuk apotek, kotak rajal
  // tidak dirender (tidak relevan & endpoint restricted) — hanya resep.
  const isApotek = g.currentConfig?.currentRole === 'apotek';
  if (!isApotek) {
    for (const [key] of STATUS) {
      const el = document.getElementById(HOST_ID + '-' + key);
      if (el) el.textContent = '…';
    }
    await Promise.all(
      STATUS.map(async ([key]) => {
        const el = document.getElementById(HOST_ID + '-' + key);
        try {
          const resp = await fetch(buildPelaksanaanUrl(key, ds, de), {
            credentials: 'include',
            cache: 'no-store',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
          });
          if (!el) return;
          if (!resp.ok) {
            el.textContent = '—';
            return;
          }
          const html = await resp.text();
          el.textContent = String(parseTotal(html));
          el.title = 'Arahkan kursor untuk menghitung pasien dengan resep…';
          el.style.cursor = 'help';
          if (!el.dataset.resepBound) {
            el.dataset.resepBound = '1';
            el.addEventListener('mouseenter', () => void computeResepHover(key, ds, de, el));
          }
        } catch {
          if (el) el.textContent = '—';
        }
      }),
    );
  }

  // Ranap: 30 hari ke belakang s.d. hari ini (mirror default halaman ranap).
  const d0 = new Date();
  const pad = (n: number): string => String(n).padStart(2, '0');
  const tgl2 = `${pad(d0.getDate())}/${pad(d0.getMonth() + 1)}/${d0.getFullYear()}`;
  const d1 = new Date(d0.getTime() - 30 * 24 * 60 * 60 * 1000);
  const tgl1 = `${pad(d1.getDate())}/${pad(d1.getMonth() + 1)}/${d1.getFullYear()}`;
  await Promise.all(
    STATUS_RANAP.map(async ([key]) => {
      const el = document.getElementById(HOST_ID_RANAP + '-' + key);
      try {
        const resp = await fetch(buildRanapUrl(key, tgl1, tgl2), {
          credentials: 'include',
          cache: 'no-store',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
        });
        if (!el) return;
        el.textContent = resp.ok ? String(parseRanapTotal(await resp.text())) : '—';
      } catch {
        if (el) el.textContent = '—';
      }
    }),
  );

  // Total resep sudah/belum diterima (tab tabel penerimaan).
  const ps = readPenerimaanSearch();
  for (const [tipe] of TIPE_RESEP) {
    const e = document.getElementById(HOST_ID_RESEP + '-' + tipe);
    if (e) e.textContent = '…';
  }
  await Promise.all(
    TIPE_RESEP.map(async ([tipe, label]) => {
      const el = document.getElementById(HOST_ID_RESEP + '-' + tipe);
      try {
        const resp = await fetch(buildPenerimaanUrl(tipe, ps), {
          credentials: 'include',
          cache: 'no-store',
          headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/html' },
        });
        if (!el) return;
        el.textContent = resp.ok ? String(parseTotal(await resp.text())) : '—';
        el.title = 'Klik untuk melihat daftar pasien';
        el.style.cursor = 'pointer';
        if (!el.dataset.rowsBound) {
          el.dataset.rowsBound = '1';
          el.addEventListener('click', () => void showPenerimaanRows(tipe, label));
        }
      } catch {
        if (el) el.textContent = '—';
      }
    }),
  );
}

function run(): void {
  if (
    !g.currentConfig?.extensionEnabled ||
    !g.currentConfig?.features?.pasienRajalCounter?.enabled ||
    !g.ExtensionCore.isFeatureAllowed('pasienRajalCounter')
  )
    return;

  let attempts = 0;
  const tick = (): void => {
    attempts += 1;
    const isApotek = g.currentConfig?.currentRole === 'apotek';
    if (!isApotek && !document.getElementById(HOST_ID) && !makeHost()) {
      if (attempts < 10) window.setTimeout(tick, 300);
      return;
    }
    if (!isApotek) makeRanapHost();
    makeResepHost();
    const btn = document.getElementById('search') as HTMLElement | null;
    if (btn && !btn.dataset.extPrcBound) {
      btn.dataset.extPrcBound = '1';
      btn.addEventListener('click', () => void refresh());
    }
    log('Pasien Rajal/Ranap Counter: mounted');
    void refresh();
  };
  tick();
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.pasienRajalCounter = {
    id: 'pasienRajalCounter',
    name: 'Total Pasien Rajal',
    description:
      'Ringkasan jumlah pasien rajal hari itu (belum diperiksa / sudah diperiksa / sudah bayar) di halaman penerimaan resep',
    match: { pathname: '/inventory/resep/penerimaan' },
    run,
  };
} else {
  console.warn('[Pasien Rajal Counter] featureModules not defined');
}
