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
import { lookupAntrianBatch } from './shared/antrianActions';
import { whenAntrianFarmasiActive } from './shared/farmasiQueueSync';

// Guard anti double-inject (SPA MORBIS bisa inject content script >1×).
if ((window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport) {
  throw new Error('skip double inject penerimaanExport');
}
(window as unknown as { __extPenerimaanExport?: boolean }).__extPenerimaanExport = true;

const EXPORT_RE = /export|xls|excel|informasi-resep/i;
const FILENAME = 'informasi-resep.xls';

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

/** Peta No Resep (teks) → tr[id] dari tabel live halaman ini. */
function buildLiveMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const table of Array.from(document.querySelectorAll('table'))) {
    const ths = Array.from(table.querySelectorAll('thead th'));
    const head = ths.length ? ths : Array.from(table.querySelectorAll('tr:first-child th'));
    const idx = head.findIndex((th) => /no\s*resep/i.test(th.textContent || ''));
    if (idx < 0) continue;
    for (const tr of Array.from(table.querySelectorAll('tbody tr'))) {
      const id = (tr as HTMLTableRowElement).id?.trim();
      if (!id) continue;
      const tds = tr.querySelectorAll('td');
      if (idx >= tds.length) continue;
      const no = (tds[idx].textContent || '').trim();
      if (no) map.set(no, id);
    }
  }
  return map;
}

/** Tulis ulang HTML xls: ganti kolom Waktu Penjualan → 2 kolom waktu antrian. */
async function rewriteExport(html: string, liveMap: Map<string, string>): Promise<string> {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let target: HTMLTableElement | null = null;
  let wpIdx = -1;
  let noIdx = -1;
  for (const t of Array.from(doc.querySelectorAll('table'))) {
    const ths = Array.from(t.querySelectorAll('th'));
    const w = ths.findIndex((h) => /waktu\s*penjualan/i.test(h.textContent || ''));
    if (w < 0) continue;
    target = t as HTMLTableElement;
    wpIdx = w;
    noIdx = ths.findIndex((h) => /no\s*resep/i.test(h.textContent || ''));
    break;
  }
  if (!target || wpIdx < 0) throw new Error('kolom Waktu Penjualan tidak ketemu di file export');

  // Kumpulkan id resep per baris (lewati baris header/kop).
  const rows: Array<{ tds: NodeListOf<HTMLTableCellElement>; id: string }> = [];
  const ids: string[] = [];
  for (const tr of Array.from(target.querySelectorAll('tr'))) {
    if (tr.querySelector('th')) continue;
    const tds = tr.querySelectorAll('td');
    if (Math.max(wpIdx, noIdx) >= tds.length) continue;
    const no = noIdx >= 0 ? (tds[noIdx].textContent || '').trim() : '';
    const id = liveMap.get(no) || '';
    // Baris tanpa No Resep (mis. subtotal) dilewati — jangan rusak.
    if (!no) continue;
    rows.push({ tds, id });
    if (id) ids.push(id);
  }

  const times = await lookupAntrianBatch(ids);

  // Header: 1 th → 2 th.
  const wth = target.querySelectorAll('th')[wpIdx];
  const th1 = doc.createElement('th');
  th1.textContent = 'Waktu Verif/Antrikan';
  const th2 = doc.createElement('th');
  th2.textContent = 'Waktu Klik Selesai';
  wth.replaceWith(th1, th2);

  for (const r of rows) {
    const q = r.id ? times[r.id] : undefined;
    const orig = r.tds[wpIdx];
    const tdV = orig.cloneNode(false) as HTMLTableCellElement;
    const tdS = orig.cloneNode(false) as HTMLTableCellElement;
    tdV.textContent = q?.created_at ? fmtWaktuAntrian(q.created_at) : '';
    tdS.textContent = q?.done_at ? fmtWaktuAntrian(q.done_at) : '';
    orig.replaceWith(tdV, tdS);
  }
  return doc.documentElement.outerHTML;
}

async function processExport(url: string): Promise<void> {
  toast('Menyiapkan export + waktu antrian…', 8000);
  const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
  if (!res.ok) throw new Error('export server HTTP ' + res.status);
  const html = await res.text();
  const out = await rewriteExport(html, buildLiveMap());
  const blob = new Blob([out], { type: 'application/vnd.ms-excel' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = FILENAME;
  document.body.appendChild(a);
  a.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 4000);
  toast('Export selesai — kolom Waktu Verif/Antrikan + Waktu Klik Selesai terisi.');
}

function init(): void {
  // Hanya halaman list; detail punya fitur sendiri.
  if (location.pathname.includes('/detail')) return;
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!EXPORT_RE.test(href) && !EXPORT_RE.test(a.textContent || '')) return;
      e.preventDefault();
      e.stopPropagation();
      const url = new URL(href, location.href).href;
      window.console.info('[penerimaanExport] intercept:', url);
      void processExport(url).catch((err) => {
        window.console.warn('[penerimaanExport] fallback export asli:', err);
        window.open(url, '_blank');
      });
    },
    true,
  );
  document.addEventListener('submit', (e) => {
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
      window.console.warn('[penerimaanExport] fallback export asli:', err);
      window.open(url, '_blank');
    });
  });
}

// Gate: hanya jalan bila fitur antrianFarmasi aktif di config + role.
whenAntrianFarmasiActive(() => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
});
