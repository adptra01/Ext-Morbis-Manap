/**
 * mKlaimCasemixExport — tombol export PDF Pre-op & Revisi BPJS di halaman
 * list /v2/m-klaim, mengikuti filter form halaman klaim.
 *
 * Alur: baca filter (form + URL) → kumpulkan id_visit dari tabel DOM →
 * GET batch pusat (pre-op list + revisions list, atau export per tanggal) →
 * susun dokumen cetak → window.print (PDF). Selama proses: spinner +
 * tombol disabled (pola penerimaanExport.ts).
 */

import { getMorbisGlobals } from './shared/types.js';
import { fetchPreOpBatch, fetchRevisionsBatch, resolveCasemixBase } from './shared/casemixApi.js';
import { loadPreOpMap } from './shared/preOpStorage.js';

const g = getMorbisGlobals();

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

export interface KlaimRow {
  idVisit: string;
  norm: string;
  nama: string;
  noReg: string;
  poli: string;
  status: string;
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

function extractIdVisit(row: HTMLTableRowElement): string | null {
  const els = row.querySelectorAll<HTMLElement>('button, a, [onclick], [data-id-visit], [data-id]');
  for (const el of els) {
    const attr = el.dataset.idVisit || el.dataset.idvisit || el.dataset.id;
    if (attr && /^\d+$/.test(attr)) return attr;
    const oc = el.getAttribute('onclick') || '';
    const m = oc.match(/detail\(['"]?(\d+)['"]?\)/) || oc.match(/id_visit=(\d+)/);
    if (m) return m[1];
    const href = el.getAttribute('href') || '';
    const mh = href.match(/id_visit=(\d+)/);
    if (mh) return mh[1];
  }
  return null;
}

/** Kumpulkan baris klaim dari tabel DOM (lewati baris kosong DataTables). */
export function collectKlaimRows(doc: Document = document): KlaimRow[] {
  const rows: KlaimRow[] = [];
  const seen = new Set<string>();
  for (const table of Array.from(doc.querySelectorAll('table'))) {
    const headCells = Array.from(table.querySelectorAll('thead th')).map((th) =>
      (th.textContent || '').toLowerCase(),
    );
    const hasHead = headCells.length > 0;
    const colIdx = (re: RegExp): number => headCells.findIndex((h) => re.test(h));
    const iNorm = hasHead ? colIdx(/no\s*rm|norm/) : 1;
    const iNama = hasHead ? colIdx(/nama/) : 2;
    const iReg = hasHead ? colIdx(/no\s*reg|registrasi/) : -1;
    const iPoli = hasHead ? colIdx(/poli|unit/) : -1;
    const iStatus = hasHead ? colIdx(/status/) : -1;
    for (const tr of Array.from(table.querySelectorAll('tbody tr'))) {
      if ((tr as HTMLElement).classList.contains('dataTables_empty')) continue;
      const idVisit = extractIdVisit(tr as HTMLTableRowElement);
      if (!idVisit || seen.has(idVisit)) continue;
      const tds = tr.querySelectorAll('td');
      if (!tds.length) continue;
      const cell = (i: number): string =>
        i >= 0 && i < tds.length ? (tds[i].textContent || '').trim() : '';
      seen.add(idVisit);
      rows.push({
        idVisit,
        norm: cell(iNorm),
        nama: cell(iNama),
        noReg: cell(iReg),
        poli: cell(iPoli),
        status: cell(iStatus),
      });
    }
  }
  return rows;
}

function esc(s: string | null | undefined): string {
  return String(s ?? '-')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Susun HTML dokumen cetak (murni, unit-tested).
 *  centralOk=false → spanduk offline: kolom pusat dari cache lokal. */
export function buildExportHtml(
  filter: KlaimFilter,
  rows: KlaimRow[],
  marks: Record<string, { marked_at?: string | null; user?: string | null }>,
  revs: Record<
    string,
    Array<{ keterangan?: string | null; user?: string | null; submitted_at?: string | null }>
  >,
  centralOk = true,
): string {
  const trs = rows
    .map((r, i) => {
      const m = marks[r.idVisit];
      const rl = revs[r.idVisit] ?? [];
      const last = rl[rl.length - 1];
      return (
        `<tr><td>${i + 1}</td><td>${esc(r.norm)}</td><td>${esc(r.nama)}</td>` +
        `<td>${esc(r.noReg)}</td><td>${esc(r.poli)}</td>` +
        `<td>${m ? 'YA' : '-'}</td><td>${esc(m?.marked_at)}</td>` +
        `<td>${esc(m?.user)}</td>` +
        `<td>${rl.length || '-'}</td><td>${esc(last?.keterangan)}</td></tr>`
      );
    })
    .join('');
  const f = (l: string, v: string): string =>
    v ? `<span style="margin-right:18px"><b>${l}:</b> ${esc(v)}</span>` : '';
  return (
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pre-op &amp; Revisi Klaim</title>` +
    `<style>body{font-family:Arial,sans-serif;font-size:12px;color:#111}` +
    `h2{margin:0 0 4px}p{margin:0 0 12px}table{border-collapse:collapse;width:100%}` +
    `th,td{border:1px solid #555;padding:4px 6px;text-align:left;vertical-align:top}` +
    `th{background:#eee}@media print{.no-print{display:none}}</style></head><body>` +
    `<h2>Laporan Pre-op &amp; Revisi Klaim BPJS</h2>` +
    `<p>${f('Periode', [filter.tanggalAwal, filter.tanggalAkhir].filter(Boolean).join(' s.d. '))}` +
    `${f('NORM', filter.norm)}${f('Nama', filter.nama)}${f('Reg', filter.reg)}` +
    `${f('Billing', filter.billing)}${f('Status', filter.status)}${f('Poli', filter.poli || filter.idPoli)}` +
    `<br>Sumber: DB pusat ${esc(resolveCasemixBaseSafe())} — ${esc(new Date().toLocaleString('id-ID'))}</p>` +
    `<table><thead><tr><th>No</th><th>No RM</th><th>Nama</th><th>No Reg</th><th>Poli</th>` +
    `<th>Pre-op</th><th>Waktu Tandai</th><th>Penanda</th>` +
    `<th>Jml Revisi</th><th>Revisi Terakhir</th></tr></thead><tbody>${trs}</tbody></table>` +
    (centralOk
      ? ''
      : `<p style="color:#b45309"><b>Catatan:</b> DB pusat tak terjangkau saat export ` +
        `(offline/sinyal lambat) — kolom Pre-op/Revisi dari cache lokal PC ini.</p>`) +
    `<script>window.onload=function(){window.print()}</script></body></html>`
  );
}

function resolveCasemixBaseSafe(): string {
  try {
    return resolveCasemixBase();
  } catch {
    return '';
  }
}

/* ── UI: spinner + disable tombol (pola penerimaanExport) ── */

function setBtnDisabled(disabled: boolean): void {
  const btn = document.getElementById('ext-casemix-export-btn') as HTMLButtonElement | null;
  if (!btn) return;
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
}

function showLoading(msg: string): void {
  hideLoading();
  setBtnDisabled(true);
  const ov = document.createElement('div');
  ov.id = 'ext-casemix-loading';
  ov.style.cssText =
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;' +
    'justify-content:center;background:rgba(0,0,0,0.35);';
  ov.innerHTML =
    `<div style="display:flex;align-items:center;gap:16px;padding:24px 32px;background:#fff;` +
    `border-radius:12px;font-family:'Roboto','Segoe UI',system-ui,sans-serif">` +
    `<div style="width:40px;height:40px;border:4px solid #e0e7ff;border-top-color:#175cd3;` +
    `border-radius:50%;animation:ext-spin .8s linear infinite"></div>` +
    `<span id="ext-casemix-loading-text" style="font-size:16px;font-weight:600;color:#175cd3"></span></div>`;
  (ov.querySelector('#ext-casemix-loading-text') as HTMLElement).textContent = msg;
  if (!document.getElementById('ext-export-spinner-style')) {
    const st = document.createElement('style');
    st.id = 'ext-export-spinner-style';
    st.textContent = '@keyframes ext-spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(st);
  }
  document.body.appendChild(ov);
}

function updateLoading(msg: string): void {
  const el = document.getElementById('ext-casemix-loading-text');
  if (el) el.textContent = msg;
}

function hideLoading(): void {
  setBtnDisabled(false);
  document.getElementById('ext-casemix-loading')?.remove();
}

async function processExport(): Promise<void> {
  showLoading('Membaca filter & tabel klaim…');
  try {
    const filter = readKlaimFilter();
    const rows = collectKlaimRows();
    if (!rows.length) {
      window.alert('Tidak ada baris klaim terbaca di halaman ini.');
      return;
    }
    updateLoading(`Mengambil data pusat (${rows.length} kunjungan)…`);
    const ids = rows.map((r) => r.idVisit);
    const [centralMarks, centralRevs] = await Promise.all([
      fetchPreOpBatch(ids),
      fetchRevisionsBatch(ids),
    ]);
    // Fallback lokal bila pusat offline: pre-op localStorage.
    const localMap = loadPreOpMap();
    const marks: Record<string, { marked_at?: string | null; user?: string | null }> = {};
    for (const r of rows) {
      const c = centralMarks?.[r.idVisit];
      if (c) {
        marks[r.idVisit] = { marked_at: c.marked_at ?? null, user: c.user ?? null };
      } else if (!centralMarks && localMap[r.idVisit]) {
        marks[r.idVisit] = {
          marked_at: new Date(localMap[r.idVisit].markedAt).toLocaleString('id-ID'),
          user: null,
        };
      }
    }
    updateLoading('Menyusun dokumen cetak…');
    const centralOk = centralMarks !== null && centralRevs !== null;
    if (!centralOk) {
      updateLoading('Pusat offline — memakai cache lokal…');
    }
    const html = buildExportHtml(filter, rows, marks, centralRevs ?? {}, centralOk);
    const w = window.open('', '_blank');
    if (!w) {
      window.alert('Popup diblokir — izinkan popup untuk halaman ini lalu ulangi.');
      return;
    }
    w.document.write(html);
    w.document.close();
  } finally {
    hideLoading();
  }
}

function injectExportButton(): void {
  if (document.getElementById('ext-casemix-export-btn')) return;

  // Jangkar: tombol Cari/Tampil pada form filter; fallback tombol pertama di form.
  const anchor = Array.from(
    document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
  ).find((b) => {
    const t = ((b as HTMLInputElement).value || b.textContent || '').trim().toLowerCase();
    return /^(cari|tampil|tampilkan|filter|cetak|export)$/.test(t);
  }) as HTMLElement | undefined;

  const morbisRef =
    (document.querySelector('button[onclick*="loadTableExcel"]') as HTMLElement | null) ?? anchor;
  const btn = document.createElement('button');
  btn.id = 'ext-casemix-export-btn';
  btn.type = 'button';
  // Samakan tampilan dengan tombol MORBIS (class + inline style + icon bila ada).
  btn.className = morbisRef?.className || anchor?.className || 'btn btn-success';
  const refStyle = morbisRef?.getAttribute('style') || anchor?.getAttribute('style');
  if (refStyle) btn.setAttribute('style', refStyle);
  btn.style.display = 'inline-block';
  btn.style.marginLeft = '8px';
  const icon = morbisRef?.querySelector('i') || anchor?.querySelector('i');
  if (icon) {
    btn.appendChild(icon.cloneNode(true));
    btn.appendChild(document.createTextNode(' '));
  }
  btn.appendChild(document.createTextNode('Export Pre-op & Revisi (PDF)'));
  btn.title = 'Export semua baris sesuai filter + data pusat Pre-op & Revisi ke PDF';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    void processExport().catch((err) => {
      window.console.warn('[mKlaimCasemixExport] gagal:', err);
    });
  });

  if (anchor?.parentNode) {
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  } else {
    const table = document.querySelector('table');
    table?.parentNode?.insertBefore(btn, table);
  }
}

export function initCasemixExport(): void {
  if (window.location.pathname.includes('/detail')) return;
  injectExportButton();
  window.setInterval(() => {
    try {
      if (document.hidden) return; // tab tak terlihat → lewati
    } catch {
      /* ignore */
    }
    injectExportButton();
  }, 3000);
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.casemixExport = {
    id: 'casemixExport',
    name: 'Export Pre-op & Revisi (M-KLAIM)',
    description: 'Export PDF Pre-op & Revisi mengikuti filter halaman klaim (data DB pusat)',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
      ],
      exclude: [{ prefix: '/v2/m-klaim/detail' }],
    },
    run: initCasemixExport,
  };
}

// Auto-run bila cocok langsung (dilewati di env non-DOM seperti unit test).
try {
  if (
    typeof window !== 'undefined' &&
    window.location?.pathname?.startsWith('/v2/m-klaim') &&
    !window.location.pathname.includes('/detail')
  ) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCasemixExport);
    } else {
      initCasemixExport();
    }
  }
} catch {
  /* non-DOM */
}
