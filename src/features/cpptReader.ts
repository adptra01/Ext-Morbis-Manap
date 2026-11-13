/**
 * cpptReader — tombol "Baca CPPT" di halaman detail/edit resep.
 *
 * Posisi: menempel di section "Antrian Farmasi" (#ext-antrian-fieldset, dibuat
 * penjualanResepAntrian) sebagai baris kedua, jadi tidak ikut terhapus saat
 * bar antrian re-render. Bila section itu tidak ada (mis. penerimaan/detail),
 * fieldset sendiri dibuat.
 *
 * Data: AJAX CPPT bawaan MORBIS (bukan scrape halaman penuh). Tiap halaman CPPT
 * punya DUA tabel (diverifikasi live 2026-11-13):
 *   - kunjungan ini → cppt/table?id_visit=&id_pasien=
 *   - riwayat kunjungan sebelumnya → cppt/history_kunjungan?id_visit=&id_pasien=&page=N
 * Path mengikuti jenis kunjungan (rajal → /admisi/pelaksanaan_pelayanan/...,
 * ranap → /admisi/detail-rawat-inap/...), tapi server melayani keduanya sama
 * sehingga dicoba berurutan. `id_pasien` WAJIB untuk riwayat (tanpa itu server
 * balas tabel kosong) — diambil dari envelope data-resep-new, cadangan dari
 * script halaman CPPT.
 *
 * Modal dibuat dari DOM biasa — `customElements` bernilai null di sebagian
 * halaman MORBIS, jadi web component tidak bisa diandalkan di sini.
 *
 * Role: admin & apotek (allowedRoles di background.ts).
 */
import {
  decideFeatureGate,
  whenFeatureEnabled,
  type FeatureGateConfig,
} from './shared/featureGate.js';

const BAR_ID = 'ext-cppt-bar';
const BTN_ID = 'ext-cppt-btn';
const MODAL_ID = 'ext-cppt-modal';
const LINK_ID = 'ext-visit-link';

export interface CpptRow {
  /** id_cppt (atribut id <tr>) — kunci dedupe utama; kosong bila tak ada. */
  id: string;
  waktu: string;
  subyektif: string;
  obyektif: string;
  assessment: string;
  planning: string;
  instruksi: string;
  penginput: string;
  dpjp: string;
}

export interface CpptData {
  /** CPPT kunjungan ini. */
  current: CpptRow[];
  /** CPPT kunjungan sebelumnya (sudah dedupe terhadap `current`). */
  riwayat: CpptRow[];
}

interface CpptSource {
  label: string;
  /** Halaman CPPT penuh — cadangan sumber `id_pasien` (script refreshHistoryTable). */
  page: string;
  table: string;
  history: string;
}

const SUMBER: readonly CpptSource[] = [
  {
    label: 'Rajal',
    page: '/admisi/pelaksanaan_pelayanan/cppt?id_visit=',
    table: '/admisi/pelaksanaan_pelayanan/cppt/table?id_visit=',
    history: '/admisi/pelaksanaan_pelayanan/cppt/history_kunjungan',
  },
  {
    label: 'Ranap',
    page: '/admisi/detail-rawat-inap/cppt?idVisit=',
    table: '/admisi/detail-rawat-inap/cppt/table?id_visit=',
    history: '/admisi/detail-rawat-inap/cppt/history_kunjungan',
  },
];

/** ponytail: batas 10 halaman riwayat — cukup untuk puluhan kunjungan dan
 *  mencegah loop tanpa akhir bila server selalu menyertakan tombol 'next'. */
const MAX_HALAMAN_RIWAYAT = 10;

/** id_visit: input hidden halaman dulu, lalu query string. */
function resolveIdVisit(): string {
  const fromInput = document.querySelector<HTMLInputElement>('#id_visit')?.value?.trim();
  if (fromInput) return fromInput;
  const p = new URLSearchParams(location.search);
  return p.get('visit') || p.get('id_visit') || p.get('idVisit') || '';
}

/** Nilai string pertama yang ada di antara beberapa kunci (envelope MORBIS). */
function pick(env: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = env[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

/** Teks sel: buang tag, decode entitas dasar, rapatkan spasi. */
function cellText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

interface RawCell {
  th: boolean;
  text: string;
}

/** Sel <td>/<th> dari isi satu <tr> (tanpa DOMParser — unit test jalan di Node). */
function rowCells(trBody: string): RawCell[] {
  const out: RawCell[] = [];
  const re = /<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trBody))) out.push({ th: m[1].toLowerCase() === 'th', text: cellText(m[2]) });
  return out;
}

interface ColIndex {
  waktu: number;
  subyektif: number;
  obyektif: number;
  assessment: number;
  planning: number;
  instruksi: number;
  penginput: number;
  dpjp: number;
}

/** Pemetaan kolom lewat judul header (jumlah kolom beda rajal/ranap/history). */
function colIndex(heads: string[]): ColIndex {
  const find = (...kws: string[]): number => heads.findIndex((h) => kws.some((k) => h.includes(k)));
  return {
    waktu: find('waktu'),
    subyektif: find('subyek', 'subjekt'),
    obyektif: find('obyek', 'objek'),
    assessment: find('assess'),
    planning: find('planning'),
    instruksi: find('instruksi'),
    penginput: find('penginput'),
    dpjp: find('dpjp'),
  };
}

/**
 * Parse tabel CPPT dari fragmen HTML. Header-driven: kolom dipetakan lewat
 * judul ("Assessment"/"Assessement", "Subyektif"/"Subjektif") sehingga kolom
 * No/Aksi tidak ikut jadi data dan urutan kolom bebas.
 */
export function parseCpptTable(html: string): CpptRow[] {
  const rows: CpptRow[] = [];
  const trRe = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi;
  let heads: ColIndex | null = null;
  let m: RegExpExecArray | null;

  while ((m = trRe.exec(html))) {
    const cells = rowCells(m[2]);
    if (!cells.length) continue;

    if (cells.some((c) => c.th)) {
      heads = colIndex(cells.map((c) => c.text.toLowerCase()));
      continue;
    }
    if (!heads) continue; // header belum ketemu — tak bisa dipetakan

    const texts = cells.map((c) => c.text);
    if (texts.length < 5) continue;
    const at = (i: number): string => (i >= 0 && i < texts.length ? texts[i] : '');

    const row: CpptRow = {
      id: (/(?:^|\s)id\s*=\s*["']([^"']*)["']/i.exec(m[1]) ?? [])[1] ?? '',
      waktu: at(heads.waktu),
      subyektif: at(heads.subyektif),
      obyektif: at(heads.obyektif),
      assessment: at(heads.assessment),
      planning: at(heads.planning),
      instruksi: at(heads.instruksi),
      penginput: at(heads.penginput),
      dpjp: at(heads.dpjp),
    };
    if (row.waktu || row.subyektif || row.assessment) rows.push(row);
  }
  return rows;
}

/** id_pasien dari script halaman CPPT (refreshHistoryTable / link paging). */
export function parseIdPasien(html: string): string {
  const m = /id_pasien=(\d+)/i.exec(html);
  return m ? m[1] : '';
}

/** URL fragmen riwayat CPPT. `page` 1 = tanpa parameter (default server). */
export function buildHistoryUrl(
  base: string,
  idVisit: string,
  idPasien: string,
  page: number,
): string {
  const p = (k: string, v: string): string => k + '=' + encodeURIComponent(v);
  const qs = [
    p('id_visit', idVisit),
    idPasien ? p('id_pasien', idPasien) : '',
    page > 1 ? p('page', String(page)) : '',
  ]
    .filter(Boolean)
    .join('&');
  return base + '?' + qs;
}

/** Ada halaman riwayat berikutnya? (tombol `next` di div .body-page). */
export function hasNextHistoryPage(html: string): boolean {
  return /class\s*=\s*["']?[^"'>]*page-next/i.test(html);
}

/** Kunci urut waktu "DD/MM/YYYY HH:MM:SS" → "YYYYMMDDHHMMSS" (kosong bila gagal). */
export function waktuSortKey(waktu: string): string {
  const m = /(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(waktu);
  if (!m) return '';
  return m[3] + m[2] + m[1] + (m[4] ?? '') + (m[5] ?? '') + (m[6] ?? '');
}

/** Kunci dedupe baris: id_cppt bila ada, cadangan waktu+assessment+subyektif. */
function rowKey(r: CpptRow): string {
  return r.id || [r.waktu, r.assessment, r.subyektif].join('|');
}

/**
 * Gabung CPPT kunjungan ini + riwayat: dedupe (baris kunjungan ini juga muncul
 * di tabel riwayat) lalu urut kronologis menurun (terbaru di atas).
 */
export function mergeCppt(current: CpptRow[], history: CpptRow[]): CpptData {
  const seen = new Set<string>();
  const keep = (r: CpptRow): boolean => {
    const k = rowKey(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  };
  const byWaktuDesc = (a: CpptRow, b: CpptRow): number =>
    waktuSortKey(b.waktu).localeCompare(waktuSortKey(a.waktu));
  return {
    current: current.filter(keep).sort(byWaktuDesc),
    riwayat: history.filter(keep).sort(byWaktuDesc),
  };
}

async function getText(url: string): Promise<string | null> {
  try {
    const resp = await fetch(url, { credentials: 'include', cache: 'no-store' });
    return resp.ok ? await resp.text() : null;
  } catch {
    return null;
  }
}

/** Envelope data-resep-new (sesi MORBIS) — ID_VISIT/ID_PASIEN/ID_KUNJUNGAN/depo. */
async function fetchEnvelope(): Promise<Record<string, unknown>> {
  const idResep =
    document.querySelector<HTMLInputElement>('#id_resep')?.value?.trim() ||
    new URLSearchParams(location.search).get('id') ||
    '';
  if (!idResep) return {};
  try {
    const resp = await fetch(
      '/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=' +
        encodeURIComponent(idResep),
      { credentials: 'include', cache: 'no-store' },
    );
    if (!resp.ok) return {};
    return (await resp.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Riwayat kunjungan sebelumnya — ikuti paging sampai halaman terakhir. */
async function fetchHistory(base: string, idVisit: string, idPasien: string): Promise<CpptRow[]> {
  const rows: CpptRow[] = [];
  if (!idPasien) return rows;
  for (let page = 1; page <= MAX_HALAMAN_RIWAYAT; page++) {
    const html = await getText(buildHistoryUrl(base, idVisit, idPasien, page));
    if (html == null) break;
    rows.push(...parseCpptTable(html));
    if (!hasNextHistoryPage(html)) break;
  }
  return rows;
}

/** Ambil CPPT kunjungan ini + riwayat; sumber pertama yang ada isinya dipakai. */
async function fetchCppt(idVisit: string, env: Record<string, unknown>): Promise<CpptData> {
  let idPasien = pick(env, 'ID_PASIEN', 'id_pasien');
  for (const s of SUMBER) {
    if (!idPasien) {
      idPasien = parseIdPasien((await getText(s.page + encodeURIComponent(idVisit))) ?? '');
    }
    const suffix = idPasien ? '&id_pasien=' + encodeURIComponent(idPasien) : '';
    const currentHtml = await getText(s.table + encodeURIComponent(idVisit) + suffix);
    const current = currentHtml ? parseCpptTable(currentHtml) : [];
    const history = await fetchHistory(s.history, idVisit, idPasien);
    if (current.length || history.length) return mergeCppt(current, history);
  }
  return { current: [], riwayat: [] };
}

function el(tag: string, css?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (css) node.style.cssText = css;
  if (text) node.textContent = text;
  return node;
}

function sectionTitle(text: string, count: number): HTMLElement {
  return el(
    'div',
    'font-weight:700;font-size:14px;color:#1c2530;margin:4px 0 8px;',
    `${text} (${count})`,
  );
}

function rowCard(r: CpptRow, no: number, terbaru: boolean): HTMLElement {
  const item = el(
    'div',
    'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;',
  );
  const head = el('div', 'font-weight:700;color:#0f5132;margin-bottom:6px;');
  head.appendChild(
    document.createTextNode(`#${no} — ${r.waktu}${r.penginput ? ' · ' + r.penginput : ''}`),
  );
  if (terbaru) {
    head.appendChild(
      el(
        'span',
        'display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;background:#dcfce7;color:#166534;font-size:11px;font-weight:600;vertical-align:middle;',
        'Terbaru',
      ),
    );
  }
  item.appendChild(head);

  const fields: Array<[string, string]> = [
    ['S', r.subyektif],
    ['O', r.obyektif],
    ['A', r.assessment],
    ['P', r.planning],
    ['Instruksi', r.instruksi],
    ['DPJP', r.dpjp],
  ];
  for (const [label, value] of fields) {
    if (!value) continue;
    item.appendChild(el('div', 'margin-bottom:3px;white-space:pre-wrap;', `${label}: ${value}`));
  }
  return item;
}

function showModal(data: CpptData): void {
  document.getElementById(MODAL_ID)?.remove();

  const overlay = el(
    'div',
    'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;' +
      'background:rgba(15,23,42,.55);padding:16px;',
  );
  overlay.id = MODAL_ID;

  const card = el(
    'div',
    'width:920px;max-width:100%;max-height:88vh;display:flex;flex-direction:column;background:#fff;' +
      'border-radius:14px;box-shadow:0 20px 50px rgba(16,24,40,.18);font:13px/1.55 system-ui,sans-serif;color:#1c2530;',
  );

  const header = el(
    'div',
    'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid #d0d5dd;',
  );
  header.appendChild(el('h3', 'margin:0;font-size:17px;font-weight:700;', 'Isian CPPT'));
  const closeBtn = el(
    'button',
    'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;line-height:1;',
    '×',
  ) as HTMLButtonElement;
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Tutup');
  header.appendChild(closeBtn);

  const body = el('div', 'padding:14px 18px;overflow:auto;flex:1;max-height:70vh;');

  const total = data.current.length + data.riwayat.length;
  if (!total) {
    body.appendChild(
      el('p', 'margin:0;color:#667085;', 'Tidak ada isian CPPT untuk kunjungan ini.'),
    );
  } else {
    let no = 0;
    if (data.current.length) {
      body.appendChild(sectionTitle('Kunjungan ini', data.current.length));
      data.current.forEach((r, i) => {
        body.appendChild(rowCard(r, (no += 1), i === 0));
      });
    } else {
      body.appendChild(
        el('p', 'margin:0 0 10px;color:#667085;', 'Tidak ada isian CPPT pada kunjungan ini.'),
      );
    }
    if (data.riwayat.length) {
      body.appendChild(sectionTitle('Riwayat kunjungan sebelumnya', data.riwayat.length));
      data.riwayat.forEach((r) => {
        body.appendChild(rowCard(r, (no += 1), false));
      });
    }
  }

  card.appendChild(header);
  card.appendChild(body);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const close = (): void => {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', onKey);
}

async function onClick(btn: HTMLButtonElement): Promise<void> {
  const env = await fetchEnvelope();
  const idVisit = pick(env, 'ID_VISIT', 'id_visit') || resolveIdVisit();
  if (!idVisit) {
    alert('[MORBIS Ext] id_visit tidak ditemukan — buka lewat halaman detail resep pasien.');
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Memuat…';
  try {
    showModal(await fetchCppt(idVisit, env));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Baca CPPT';
  }
}

/** Fieldset sendiri bila section Antrian Farmasi tidak ada di halaman. */
function ownHost(): HTMLElement | null {
  if (!document.body) return null;
  const fieldset = document.createElement('fieldset');
  fieldset.id = 'ext-cppt-fieldset';
  fieldset.style.cssText = 'margin-top:6px;';
  fieldset.innerHTML = '<legend>CPPT</legend>';

  const td = Array.from(document.querySelectorAll<HTMLTableCellElement>('td[valign="top"]')).find(
    (c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
  );
  if (td) {
    td.appendChild(fieldset);
    return fieldset;
  }
  const form = document.querySelector('form');
  if (form) {
    form.prepend(fieldset);
    return fieldset;
  }
  const panel = document.querySelector('.card-body, .panel-body, .form-horizontal');
  if (panel) {
    panel.prepend(fieldset);
    return fieldset;
  }
  fieldset.style.cssText =
    'position:fixed;top:60px;right:12px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:8px;padding:8px;box-shadow:0 2px 8px rgba(0,0,0,.15);';
  document.body.appendChild(fieldset);
  return fieldset;
}

function mount(allowOwn: boolean): boolean {
  if (document.getElementById(BAR_ID)) return true;

  // Dahulukan section Antrian Farmasi (dibuat penjualanResepAntrian, bisa telat
  // karena config async) — baru buat fieldset sendiri bila memang tak ada.
  let host = document.getElementById('ext-antrian-fieldset');
  if (!host) {
    if (!allowOwn) return false;
    host = ownHost();
  }
  if (!host) return false;

  const row = el('div', 'display:flex;flex-wrap:wrap;align-items:center;margin-top:4px;');
  row.id = BAR_ID;

  const btn = document.createElement('button');
  btn.id = BTN_ID;
  btn.type = 'button';
  btn.className = 'btn';
  btn.title = 'Baca isian CPPT pasien (kunjungan ini + riwayat)';
  btn.style.cssText = 'margin:2px 6px 2px 0;background:#2193cf;color:#fff;border-color:#2193cf;';
  btn.textContent = 'Baca CPPT';
  btn.addEventListener('click', () => void onClick(btn));

  row.appendChild(btn);
  if (isDetailKunjunganEnabled()) row.appendChild(visitLink());
  host.appendChild(row);
  return true;
}

/** Tombol "Detail Kunjungan" — tautan ke halaman pelaksanaan pasien:
 *  rajal → /admisi/pelaksanaan_pelayanan/billing_pasien
 *  ranap → /admisi/detail-rawat-inap/cppt
 *  URL di-resolve sekali saat mount (butuh ID_KUNJUNGAN + depo dari envelope
 *  data-resep-new), jadi klik = navigasi biasa (tanpa window.open). */
function visitLink(): HTMLAnchorElement {
  const a = document.createElement('a');
  a.id = LINK_ID;
  a.className = 'btn';
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = 'Buka detail kunjungan pasien (rajal/ranap)';
  a.style.cssText =
    'margin:2px 6px 2px 0;background:#0f766e;color:#fff;border-color:#0f766e;display:none;';
  a.textContent = 'Detail Kunjungan';
  void resolveVisitUrl().then((url) => {
    if (!url) return; // id_visit/depo tak ketemu — tombol tidak ditampilkan
    a.href = url;
    a.style.display = '';
  });
  return a;
}

async function resolveVisitUrl(): Promise<string> {
  const env = await fetchEnvelope();
  const idVisit = pick(env, 'ID_VISIT', 'id_visit') || resolveIdVisit();
  if (!idVisit) return '';
  return buildVisitUrl(
    pick(env, 'UNIT_TUJUAN_DEPO'),
    idVisit,
    pick(env, 'ID_KUNJUNGAN', 'id_kunjungan'),
  );
}

/** URL halaman pelaksanaan pasien. Depo rajal satu-satunya penanda "rawat
 *  jalan" yang tegas; depo lain (RANAP/IGD/CATHLAB/Pdp/OK) = halaman ranap.
 *  Depo kosong → anggap rajal (mayoritas resep). */
export function buildVisitUrl(depo: string, idVisit: string, idKunjungan: string): string {
  if (!idVisit) return '';
  const p = (k: string, v: string): string => k + '=' + encodeURIComponent(v);
  if (/RAJAL/i.test(depo) || !depo) {
    return (
      '/admisi/pelaksanaan_pelayanan/billing_pasien?' +
      [
        p('id_visit', idVisit),
        'status_periksa=belum',
        idKunjungan ? p('id_kunjungan', idKunjungan) : '',
      ]
        .filter(Boolean)
        .join('&')
    );
  }
  return '/admisi/detail-rawat-inap/cppt?' + p('idVisit', idVisit);
}

/** Cek toggle fitur Detail Kunjungan. */
function isDetailKunjunganEnabled(): boolean {
  const g = (window as unknown as { ExtensionCore?: { isFeatureAllowed?: (k: string) => boolean } })
    .ExtensionCore;
  const cfg = (
    window as unknown as { currentConfig?: { features?: Record<string, { enabled?: boolean }> } }
  ).currentConfig;
  const f = cfg?.features?.detailKunjungan;
  if (f && f.enabled === false) return false;
  if (g?.isFeatureAllowed && !g.isFeatureAllowed('detailKunjungan')) return false;
  return true;
}

function start(): void {
  // Section antrian bisa muncul belakangan (config async) — coba berkala.
  // 6 tick pertama (~3s) hanya menempel ke section antrian; setelah itu boleh
  // membuat fieldset sendiri agar fitur tetap jalan saat antrianFarmasi OFF.
  let attempts = 0;
  const tick = (): void => {
    attempts += 1;
    if (mount(attempts > 6) || attempts >= 20) return;
    window.setTimeout(tick, 500);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick, { once: true });
  } else {
    tick();
  }
}

function stop(): void {
  document.getElementById(BAR_ID)?.remove();
  document.getElementById('ext-cppt-fieldset')?.remove();
  document.getElementById(MODAL_ID)?.remove();
}

whenFeatureEnabled('cpptReader', start);

// Toggle di popup/sidepanel berlaku seketika — sidepanel tidak me-reload tab.
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes['extensionConfig']) return;
    const cfg = changes['extensionConfig'].newValue as FeatureGateConfig | null | undefined;
    if (decideFeatureGate('cpptReader', cfg)) start();
    else stop();
  });
} catch {
  /* page world tanpa chrome.storage — gate di titik injeksi */
}

// Toggle Detail Kunjungan berlaku seketika — tampilkan/sembunyikan tautan.
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes['extensionConfig']) return;
    const cfg = changes['extensionConfig'].newValue as FeatureGateConfig | null | undefined;
    const on = decideFeatureGate('detailKunjungan', cfg);
    const link = document.getElementById(LINK_ID) as HTMLAnchorElement | null;
    if (on) {
      if (!link) {
        const bar = document.getElementById(BAR_ID);
        if (bar) bar.appendChild(visitLink());
      } else {
        link.style.display = link.getAttribute('href') ? '' : 'none';
      }
    } else if (link) {
      link.style.display = 'none';
    }
  });
} catch {
  /* page world tanpa chrome.storage */
}
