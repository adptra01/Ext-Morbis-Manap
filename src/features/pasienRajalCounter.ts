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

const g = getMorbisGlobals();

const HOST_ID = 'ext-pasien-rajal-counter';
const HOST_ID_RANAP = 'ext-pasien-ranap-counter';

const STATUS: ReadonlyArray<readonly [string, string]> = [
  ['belum', 'Belum Diperiksa'],
  ['selesai', 'Sudah Diperiksa'],
  ['bayar', 'Sudah Bayar'],
];

const STATUS_RANAP: ReadonlyArray<readonly [string, string]> = [
  ['belum', 'Belum Discharge'],
  ['selesai', 'Sudah Discharge'],
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

  let wrap = document.getElementById('ext-pasien-counter-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'ext-pasien-counter-wrap';
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;';
    td.appendChild(wrap);
  }

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
  wrap.appendChild(fs);
  return fs;
}

/** Pasang kotak ringkasan ranap di ujung td pertama form#searchTable (bawah rajal). */
function makeRanapHost(): HTMLElement | null {
  const td = document.querySelector('form#searchTable td');
  if (!td) return null;
  if (document.getElementById(HOST_ID_RANAP)) return document.getElementById(HOST_ID_RANAP);

  let wrap = document.getElementById('ext-pasien-counter-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'ext-pasien-counter-wrap';
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px;';
    td.appendChild(wrap);
  }

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
  wrap.appendChild(fs);
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
    if (!document.getElementById(HOST_ID) && !makeHost()) {
      if (attempts < 10) window.setTimeout(tick, 300);
      return;
    }
    makeRanapHost();
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
