import { getMorbisGlobals } from './shared/types.js';
import { initBpjsRevisionHistory } from './shortcutButtons.js';
import { colors, injectCSS } from '../shared/ui/index.js';

const g = getMorbisGlobals();

injectCSS(
  'ext-toolbar-styles',
  `@media print{[data-toolbar]{display:none!important}}
  [data-toolbar] { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; margin:12px 0; background:${colors.secondary}; border-radius:8px; border:1px solid ${colors.border}; }
  [data-toolbar] .ext-toolbar-label { color:${colors.mutedForeground}; font-weight:600; font-size:13px; }
  .ext-toolbar-link {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    text-decoration:none; font-size:14px; font-weight:600; cursor:pointer;
    transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-link:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-link:active { transform:translateY(0); }
  .ext-toolbar-btn {
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 20px; color:#fff !important; border:none; border-radius:6px;
    font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s;
    box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  .ext-toolbar-btn:hover { transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  .ext-toolbar-btn:active { transform:translateY(0); }
  .ext-toolbar-batch { background:#ef4444; }
  .ext-toolbar-batch:hover { background:#dc2626; }
  .ext-toolbar-upload { background:#2563eb; }
  .ext-toolbar-upload:hover { background:#1d4ed8; }
  /* Billing tools — toggle melekat di bawah tombol RJ/RI, panel di bawahnya */
  .ext-bt-anchor{position:relative;flex-basis:100%;display:block}
  .ext-bt-fab{display:inline-flex;align-items:center;justify-content:center;padding:10px 20px;background:#2c3e50;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer}
  .ext-bt-fab:hover{background:#34495e}
  .ext-bt-panel{position:absolute;top:calc(100% + 6px);left:0;width:300px;background:#fff;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,.2);border:1px solid #ddd;overflow:hidden;z-index:9999;display:none;animation:ext-bt-slide .3s ease-out;font:13px/1.5 'Segoe UI',Tahoma,sans-serif;color:#1c2530}
  @keyframes ext-bt-slide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .ext-bt-head{background:#2c3e50;color:#fff;padding:12px 15px;font-weight:700;font-size:14px;display:flex;justify-content:space-between;align-items:center}
  .ext-bt-head .x{cursor:pointer;font-size:18px}
  .ext-bt-body{padding:15px}
  .ext-bt-info{font-size:12px;color:#444;margin-bottom:12px;border-bottom:1px dashed #ccc;padding-bottom:10px}
  .ext-bt-info span{display:block;margin-bottom:4px}
  .ext-bt-group{display:flex;flex-direction:column;gap:8px}
  .ext-bt-btn{padding:10px;border:none;border-radius:5px;cursor:pointer;font-weight:700;font-size:13px;color:#fff;width:100%;box-sizing:border-box}
  .ext-bt-btn:hover{opacity:.9}
  .ext-bt-batal{background:#dc3545}.ext-bt-edit{background:#0d6efd}.ext-bt-verif{background:#198754}
  .ext-bt-status{font-size:12px;color:#b91c1c;margin-top:8px;font-weight:600}
  .ext-bt-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);justify-content:center;align-items:center;z-index:10000}
  .ext-bt-modal{background:#fff;width:min(900px,94vw);border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,.3);overflow:hidden}
  .ext-bt-modal-head{background:#f8f9fa;padding:15px 20px;border-bottom:1px solid #dee2e6;font-weight:700;display:flex;justify-content:space-between}
  .ext-bt-modal-body{padding:10px;max-height:70vh;overflow:auto}
  .ext-bt-search{display:flex;gap:6px;margin-bottom:10px}
  .ext-bt-q{flex:1;min-width:180px;padding:6px;box-sizing:border-box}
  .ext-bt-add,.ext-bt-cari{padding:6px 10px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:700;white-space:nowrap}
  .ext-bt-table{width:100%;border-collapse:collapse;font-size:12px}
  .ext-bt-table th,.ext-bt-table td{border:1px solid #ddd;padding:6px;text-align:left}
  .ext-bt-table th{background:#f4f4f4}
  .ext-bt-modal-foot{padding:15px 20px;background:#f8f9fa;border-top:1px solid #dee2e6;display:flex;justify-content:flex-end;gap:10px}
  .ext-bt-modal-foot button{padding:8px 15px;border:none;border-radius:4px;cursor:pointer;font-weight:700;color:#fff}
  .ext-bt-kembali{background:#6c757d}.ext-bt-simpan{background:#0d6efd}.ext-bt-simpanverif{background:#198754}
  @media print{.ext-bt-anchor,.ext-bt-overlay{display:none!important}}
`,
);

const TOOLBAR_URLS = {
  rajal: '/admisi/pelaksanaan_pelayanan/halaman-utama',
  ranap: '/admisi/detail-rawat-inap/resume-ri',
  dokumenPasien: '/admisi/pelaksanaan_pelayanan/dokumen-pasien',
  // Edit Resume Rajal harus ke halaman daftar/histori /rj dulu (bukan
  // langsung ke form rm-rawat-jalan-new) — permintaan user 2026-11-06.
  editResumeRajalList: '/admisi/pelaksanaan_pelayanan/rj',
  editResumeRanap: '/admisi/detail-rawat-inap/resume-ri',
  triageIgd: '/admisi/pelaksanaan_pelayanan/triage_terintegrasi',
  spri: '/admisi/detail-rawat-inap/surat-pengantar-ri',
  pengkajianIgd: '/admisi/pelaksanaan_pelayanan/pengkajian_awal_rj/igd',
};

const BTN_STYLES = {
  rajal: { text: 'Pelayanan Rawat Jalan', bg: colors.primary, hover: colors.primaryHover },
  ranap: { text: 'Pelayanan Rawat Inap', bg: colors.success, hover: '#16a34a' },
  dokumenPasien: { text: 'Dokumen Pasien', bg: '#8b5cf6', hover: '#7c3aed' },
  editResume: { text: 'Edit Resume', bg: colors.warning, hover: '#d97706' },
  triageIgd: { text: 'Triage IGD', bg: '#ec4899', hover: '#db2777' },
  spri: { text: 'SPRI', bg: '#0891b2', hover: '#0e7490' },
  pengkajianIgd: { text: 'Pengkajian Awal IGD', bg: '#d946ef', hover: '#c026d3' },
  backMklaim: { text: 'Kembali ke M-KLAIM', bg: colors.error, hover: '#dc2626' },
};

function extractParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function getJenisKunjungan(): string | null {
  const input = document.querySelector<HTMLInputElement>('input[name="jenis"]');
  if (input) return input.value.trim().toUpperCase();
  const sel = document.querySelector<HTMLSelectElement>('select[name="jenis"]');
  if (sel) return sel.value.trim().toUpperCase();
  return null;
}

function isRawatJalan(): boolean {
  const j = getJenisKunjungan();
  return !!j && (j.includes('JALAN') || j === 'RAWAT JALAN');
}

function isRawatInap(): boolean {
  const j = getJenisKunjungan();
  return !!j && (j.includes('INAP') || j === 'RAWAT INAP');
}

function extractIdVisit(): string | null {
  return extractParam('id_visit');
}

function extractIdKunjungan(): string | null {
  const fromUrl = extractParam('id_kunjungan');
  if (fromUrl) return fromUrl;
  const hidden = (document.getElementById('id_kunjungan') as HTMLInputElement)?.value;
  if (hidden) return hidden;
  const named = document.querySelector<HTMLInputElement>('input[name="id_kunjungan"]')?.value;
  return named || null;
}

function buildUrl(path: string, qs: string): string {
  return `${window.location.origin}${path}?${qs}`;
}

function rajalUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.rajal, `id_visit=${id}&page=101&status_periksa=belum`) : null;
}

function ranapUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.ranap, `idVisit=${id}`) : null;
}

function dokumenPasienUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.dokumenPasien, `id_visit=${id}&page=85&id_kunjungan=`) : null;
}

function editResumeUrl(): string | null {
  const id = extractIdVisit();
  if (!id) return null;
  if (isRawatJalan()) {
    // Pasien rawat jalan: ke halaman daftar/histori /rj (page=6), bukan
    // langsung ke form rm-rawat-jalan-new — pola:
    // /admisi/pelaksanaan_pelayanan/rj?id_visit=…&page=6&status_periksa=belum&id_kunjungan=…
    const kunj = extractIdKunjungan();
    const qs = `id_visit=${id}&page=6&status_periksa=belum` + (kunj ? `&id_kunjungan=${kunj}` : '');
    return buildUrl(TOOLBAR_URLS.editResumeRajalList, qs);
  }
  if (isRawatInap()) return buildUrl(TOOLBAR_URLS.editResumeRanap, `idVisit=${id}`);
  return null;
}

function triageIgdUrl(): string | null {
  if (!isRawatInap()) return null;
  const id = extractIdVisit();
  return id
    ? buildUrl(TOOLBAR_URLS.triageIgd, `id_visit=${id}&status_periksa=belum&page=51`)
    : null;
}

function spriUrl(): string | null {
  if (!isRawatInap()) return null;
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.spri, `id_visit=${id}`) : null;
}

function pengkajianIgdUrl(): string | null {
  const id = extractIdVisit();
  return id ? buildUrl(TOOLBAR_URLS.pengkajianIgd, `id_visit=${id}&page=87&jenis=igd`) : null;
}

function mklaimBaseUrl(): string {
  return `${window.location.origin}/v2/m-klaim`;
}

function isTargetPage(): boolean {
  const url = window.location.href;
  // Support both URL patterns:
  // - /v2/m-klaim/detail-v2-refaktor (casemix API pattern)
  // - /admisi/pelaksanaan_pelayanan (SIMRS refaktor pattern)
  const pattern1 = url.includes('/v2/m-klaim/detail-v2-refaktor');
  const pattern2 =
    url.includes('/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new') ||
    url.includes('/admisi/pelaksanaan_pelayanan/rj');
  if (!pattern1 && !pattern2) return false;

  // Check required params based on pattern
  if (pattern1) {
    for (const p of ['id_visit', 'tanggalAwal', 'tanggalAkhir']) {
      if (!extractParam(p)) return false;
    }
  } else if (pattern2) {
    // For /admisi/pelaksanaan_pelayanan pattern, check id_visit
    if (!extractParam('id_visit')) return false;
  }
  return true;
}

function createLink(
  url: string,
  def: (typeof BTN_STYLES)[keyof typeof BTN_STYLES],
  sameTab = false,
): HTMLAnchorElement {
  const a = document.createElement('a');
  a.href = url;
  a.textContent = def.text;
  a.className = 'ext-toolbar-link';
  a.style.background = def.bg;
  a.addEventListener('mouseenter', () => {
    a.style.background = def.hover;
  });
  a.addEventListener('mouseleave', () => {
    a.style.background = def.bg;
  });
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const mode = g.currentConfig?.features?.openDetailInNewTab?.mode || 'new-tab';
    if (sameTab || mode === 'same-tab') {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  });
  return a;
}

function createBtn(
  text: string,
  bg: string,
  hover: string,
  onClick: () => void,
  className: string,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = text;
  btn.className = `ext-toolbar-btn ${className}`;
  btn.style.background = bg;
  btn.addEventListener('mouseenter', () => {
    btn.style.background = hover;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = bg;
  });
  btn.addEventListener('click', onClick);
  return btn;
}

/** --- Batal verif / edit billing langsung dari detail M-KLAIM --- */

import {
  composeLayanan,
  parseBillingRow,
  tarifRowFields,
  type BillingRowInfo,
  type TarifOption,
} from './shared/billingTools.js';

interface BillingInfo extends BillingRowInfo {
  idVisit: string;
  idPasien: string;
  pasien: string;
  /** billing-edit mengembalikan false bila sudah dibayar / tidak bisa diedit. */
  editable: boolean;
  kelas: string;
}

interface BillingEditData {
  ID_BILLING?: string;
  ID_PASIEN?: string;
  NAMA_PAS?: string;
  KELAS?: string;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { credentials: 'include', cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

/** Status verifikasi dari baris tabel yang benar-benar punya id_visit ini. */
async function fetchVerified(idVisit: string, norm: string): Promise<BillingRowInfo | null> {
  for (let page = 1; page <= 3; page++) {
    const p = new URLSearchParams({
      'search[no_Rm]': norm,
      'search[status]': 'Semua',
      page: String(page),
    });
    try {
      const r = await fetch(
        '/billing/verif-pembayaran/billing-pembayaran-table-verifikasi?' + p.toString(),
        { credentials: 'include', cache: 'no-store' },
      );
      if (!r.ok) return null;
      const row = parseBillingRow(await r.text(), idVisit);
      if (row) return row;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Sumber kebenaran id_billing = endpoint asli form edit, di-query by id_visit
 * (bukan scan tabel per NORM/SEP yang bisa kena kunjungan lain).
 */
async function fetchBillingInfo(): Promise<BillingInfo | null> {
  const idVisit = extractParam('id_visit');
  if (!idVisit) return null;
  const data = await getJson<BillingEditData | false>(
    '/admisi/search?opsi=billing-edit&q=' + encodeURIComponent(idVisit),
  );
  const norm = String((data && data.ID_PASIEN) || '').replace(/\D/g, '');
  const row = norm ? await fetchVerified(idVisit, norm) : null;
  if (!data || !data.ID_BILLING) {
    // Billing sudah dibayar tapi masih bisa dibatalkan verifikasinya.
    if (!row) return null;
    return {
      ...row,
      idVisit,
      idPasien: norm,
      pasien:
        document.querySelector<HTMLInputElement>('#nama')?.value?.trim() ||
        extractParam('nama') ||
        '',
      editable: false,
      kelas: '',
    };
  }
  return {
    idBilling: String(data.ID_BILLING),
    verified: row?.verified ?? false,
    idVisit,
    idPasien: String(data.ID_PASIEN || ''),
    pasien: String(data.NAMA_PAS || ''),
    editable: true,
    kelas: String(data.KELAS || ''),
  };
}

function billingEditUrl(i: BillingInfo): string {
  return (
    window.location.origin +
    '/billing/billing-edit?id_billing=' +
    encodeURIComponent(i.idBilling) +
    '&id_pasien=' +
    encodeURIComponent(i.idPasien) +
    '&id_visit=' +
    encodeURIComponent(i.idVisit) +
    '&pasien=' +
    encodeURIComponent(i.pasien)
  );
}

function billingVerifUrl(i: BillingInfo): string {
  return (
    window.location.origin +
    '/billing/verifikasi-billing/index?id_visit=' +
    encodeURIComponent(i.idVisit) +
    '&id_pasien=' +
    encodeURIComponent(i.idPasien) +
    '&id_billing=' +
    encodeURIComponent(i.idBilling) +
    '&pasien=' +
    encodeURIComponent(i.pasien)
  );
}

/** --- Billing tools: toggle 💰 → panel → modal edit billing --- */

let billingToolsMounted = false;
let billingPanelState: BillingInfo | null = null;
let billingEditCtx: { panel: HTMLElement } | null = null;
let billingSourceFrame: HTMLIFrameElement | null = null;

function billingStatus(panel: HTMLElement, msg: string): void {
  let el = panel.querySelector<HTMLElement>('.ext-bt-status');
  if (!el) {
    el = document.createElement('div');
    el.className = 'ext-bt-status';
    panel.appendChild(el);
  }
  el.textContent = msg;
}

function renderPanelInfo(infoEl: HTMLElement, info: BillingInfo | null): void {
  infoEl.textContent = '';
  const add = (k: string, v: string): void => {
    const s = document.createElement('span');
    const b = document.createElement('strong');
    b.textContent = k + ': ';
    s.append(b, document.createTextNode(v || '-'));
    infoEl.appendChild(s);
  };
  add('Pasien', info?.pasien || '');
  add(
    'RM',
    document.querySelector<HTMLInputElement>('#norm')?.value?.trim() || extractParam('norm') || '',
  );
  add('ID Visit', info?.idVisit || extractParam('id_visit') || '');
  add('ID Billing', info?.idBilling || '');
}

/** Load form asli di iframe tersembunyi — dipakai sbg sumber field, bukan UI. */
function loadSourceDoc(url: string, waitForRows = true): Promise<Document | null> {
  return new Promise((resolve) => {
    const fr = billingSourceFrame;
    if (!fr) return resolve(null);
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      fr.removeEventListener('load', finish);
      // Form MORBIS mengisi header/baris via AJAX setelah load — tunggu
      // noBilling terisi, bukan sekadar jeda tetap (sering masih kosong).
      const start = Date.now();
      let readyAt = 0;
      const poll = (): void => {
        try {
          const d = fr.contentDocument;
          if (!waitForRows) {
            // Form verifikasi tidak punya #noBilling — cukup tunggu field klaim.
            if (d?.getElementById('formPembayaran')) {
              if (!readyAt) readyAt = Date.now();
              if (d.querySelector('input[name="klaim_bpjs"]') || Date.now() - readyAt > 900) {
                resolve(d);
                return;
              }
            }
          } else if (d?.getElementById('form_billing')) {
            const no = d.querySelector<HTMLInputElement>('#noBilling');
            if (no?.value) {
              if (!readyAt) readyAt = Date.now();
              // Baris billing di-append AJAX setelah header — tunggu barisnya,
              // tapi jangan macet kalau memang billing-nya kosong.
              if (
                d.querySelectorAll('input[name^="billing["]').length ||
                Date.now() - readyAt > 1200
              ) {
                resolve(d);
                return;
              }
            }
          }
        } catch {
          /* frame belum siap */
        }
        if (Date.now() - start > 6000) {
          try {
            resolve(fr.contentDocument);
          } catch {
            resolve(null);
          }
          return;
        }
        window.setTimeout(poll, 100);
      };
      poll();
    };
    fr.addEventListener('load', finish);
    fr.src = url;
    window.setTimeout(finish, 8000);
  });
}

let billingTarifResults: TarifOption[] = [];
let billingTarifTimer = 0;
let billingActiveRow: string | null = null;
let billingSearchInput: HTMLInputElement | null = null;
let billingTarifList: HTMLDataListElement | null = null;

function billingNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(
    d.getMinutes(),
  )}:${p(d.getSeconds())}`;
}

function billingNum(v: string): number {
  return Number(String(v).replace(/[^\d.-]/g, '')) || 0;
}

/** Tabel tindakan UI kita, field-nya diambil dari form billing asli. */
function renderBillingRows(doc: Document, tbody: HTMLElement): void {
  tbody.textContent = '';
  const fields = Array.from(
    doc.querySelectorAll<HTMLInputElement>('input[name^="billing["][name*="]["]'),
  );
  const rows = new Map<string, Map<string, HTMLInputElement>>();
  fields.forEach((input) => {
    const m = /^billing\[(\d+)\]\[(\w+)\]$/.exec(input.name);
    if (!m) return;
    if (!rows.has(m[1])) rows.set(m[1], new Map());
    rows.get(m[1])!.set(m[2], input);
  });

  for (const [idx, f] of rows) {
    const tr = buildBillingRow(idx, Object.fromEntries([...f].map(([k, v]) => [k, v.value])));
    const cari = tr.querySelector<HTMLButtonElement>('.ext-bt-cari');
    cari?.addEventListener('click', () => selectTarifTarget(idx));
    tr.dataset.extBtSource = '1';
    tbody.appendChild(tr);
  }
  if (!rows.size) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 7;
    td.textContent = 'Belum ada baris tindakan — gunakan "Cari tindakan / tarif" di atas.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

/** Satu baris UI; semua field punya data-billing-name supaya ikut tergserialize. */
function buildBillingRow(idx: string, values: Record<string, string>): HTMLTableRowElement {
  const tr = document.createElement('tr');
  tr.dataset.btIdx = idx;
  const addInput = (name: string, cls: string, visible: boolean): void => {
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = visible ? 'text' : 'hidden';
    input.value = values[name] ?? (name === 'frekuensi' ? '1' : name === 'diskon' ? '0' : '');
    input.className = cls;
    input.dataset.billingName = 'billing[' + idx + '][' + name + ']';
    input.style.cssText = visible ? 'width:100%;box-sizing:border-box;' : '';
    td.appendChild(input);
    tr.appendChild(td);
  };
  addInput('layanan', 'ext-bt-layanan', true);

  const searchCell = document.createElement('td');
  const cari = document.createElement('button');
  cari.type = 'button';
  cari.textContent = 'Cari';
  cari.className = 'ext-bt-cari';
  cari.addEventListener('click', () => selectTarifTarget(idx));
  searchCell.appendChild(cari);
  tr.appendChild(searchCell);

  addInput('waktu', 'ext-bt-waktu', true);
  addInput('frekuensi', 'ext-bt-frek', true);
  addInput('diskon', 'ext-bt-diskon', true);
  Object.keys(values).forEach((n) => {
    if (!['layanan', 'waktu', 'frekuensi', 'diskon'].includes(n)) addInput(n, '', false);
  });

  const price = document.createElement('td');
  price.className = 'ext-bt-total';
  price.textContent = values.total || values.harga || '-';
  tr.appendChild(price);

  const act = document.createElement('td');
  const del = document.createElement('button');
  del.type = 'button';
  del.textContent = 'Hapus';
  del.className = 'ext-bt-kembali';
  del.style.cssText = 'padding:4px 8px;border:none;border-radius:4px;cursor:pointer;color:#fff;';
  del.addEventListener('click', () => {
    const source = document.querySelector<HTMLIFrameElement>('.ext-bt-source');
    const doc = source?.contentDocument;
    if (tr.dataset.extBtSource && doc) {
      for (const el of Array.from(
        doc.querySelectorAll<HTMLInputElement>('input[name^="billing[' + idx + ']"]'),
      ))
        el.disabled = true;
    }
    tr.remove();
  });
  act.appendChild(del);
  tr.appendChild(act);
  return tr;
}

function selectTarifTarget(idx: string): void {
  billingActiveRow = idx;
  if (billingSearchInput) {
    billingSearchInput.value = '';
    billingSearchInput.focus();
  }
}

function addBillingRow(tbody: HTMLElement): void {
  const idx = String(
    1 +
      Math.max(
        0,
        ...Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr[data-bt-idx]')).map((r) =>
          Number(r.dataset.btIdx || 0),
        ),
      ),
  );
  const empty = tbody.querySelector('td[colspan]');
  if (empty) empty.closest('tr')?.remove();
  tbody.appendChild(
    buildBillingRow(idx, {
      waktu: billingNow(),
      frekuensi: '1',
      diskon: '0',
      tarif: '',
      induk_tarif: '',
      harga: '',
      total: '',
    }),
  );
  selectTarifTarget(idx);
}

function applyTarif(tr: HTMLTableRowElement, t: TarifOption): void {
  const idx = tr.dataset.btIdx || '';
  const fields = tarifRowFields(t, idx, billingNow());
  for (const [name, value] of Object.entries(fields)) {
    let input = tr.querySelector<HTMLInputElement>(`input[data-billing-name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.dataset.billingName = name;
      tr.appendChild(input);
    }
    // Waktu asli tidak diubah saat ganti tindakan (sama seperti form asli).
    if (name.endsWith('[waktu]') && input.value) continue;
    input.value = value;
  }
  const total = tr.querySelector<HTMLElement>('.ext-bt-total');
  if (total) total.textContent = String(t.TOTAL ?? '-');
  billingActiveRow = null;
}

function tarifLabel(t: TarifOption, i: number): string {
  return (
    composeLayanan(t) +
    ' — ' +
    (t.KATEGORI || '') +
    ' — ' +
    billingNum(t.TOTAL || '') +
    ' [#' +
    (t.ID_TARIF || i) +
    ']'
  );
}

async function searchTarif(q: string): Promise<void> {
  if (!billingTarifList) return;
  billingTarifList.textContent = '';
  billingTarifResults = [];
  if (q.trim().length < 2) return;
  const p = new URLSearchParams({
    q: q.trim(),
    opsi: 'layananBillingSemua',
    id_visit: extractParam('id_visit') || '',
    idKelas: billingPanelState?.kelas || '',
  });
  const data = await getJson<TarifOption[]>('/admisi/search?' + p.toString());
  if (!Array.isArray(data)) return;
  billingTarifResults = data.slice(0, 20);
  billingTarifResults.forEach((t, i) => {
    const opt = document.createElement('option');
    opt.value = tarifLabel(t, i);
    billingTarifList!.appendChild(opt);
  });
}

async function refreshBillingPanel(
  panel: HTMLElement,
  group: HTMLElement,
  infoEl: HTMLElement,
): Promise<void> {
  const info = await fetchBillingInfo();
  billingPanelState = info;
  renderPanelInfo(infoEl, info);
  group.textContent = '';
  if (!info) {
    billingStatus(panel, 'Data billing tidak ditemukan untuk kunjungan ini.');
    return;
  }
  const button = (text: string, cls: string, fn: () => void): void => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ext-bt-btn ' + cls;
    b.textContent = text;
    b.addEventListener('click', () => void fn());
    group.appendChild(b);
  };
  if (info.verified) {
    button(
      '❌ Batal Verif Billing',
      'ext-bt-batal',
      () => void batalVerifFromPanel(panel, group, infoEl),
    );
  } else if (info.editable) {
    button('✏️ Edit Billing', 'ext-bt-edit', () => void openEditFromPanel(panel));
    button('✅ Verif Billing', 'ext-bt-verif', () => void verifFromPanel(panel));
  } else {
    billingStatus(panel, 'Billing sudah dibayar / tidak bisa diedit.');
  }
}

async function batalVerifFromPanel(
  panel: HTMLElement,
  group: HTMLElement,
  infoEl: HTMLElement,
): Promise<void> {
  const info = billingPanelState;
  if (!info || !info.verified) return;
  if (!window.confirm(`Batalkan verifikasi billing ${info.pasien} (visit ${info.idVisit})?`))
    return;
  billingStatus(panel, 'Memproses batal verif…');
  try {
    const r = await fetch(
      '/billing/verifikasi-billing/control/batal-control?id=' + encodeURIComponent(info.idVisit),
      { credentials: 'include', cache: 'no-store' },
    );
    const j = (await r.json()) as { status?: string; message?: string };
    billingStatus(
      panel,
      String(
        j.message ?? (String(j.status) === '1' ? 'Batal verif berhasil.' : 'Batal verif gagal.'),
      ),
    );
    await refreshBillingPanel(panel, group, infoEl);
  } catch (e) {
    billingStatus(panel, 'Batal verif gagal: ' + String(e));
  }
}

function closeBillingEdit(): void {
  const overlay = document.querySelector<HTMLElement>('.ext-bt-overlay');
  if (overlay) overlay.style.display = 'none';
  billingEditCtx = null;
}

async function openEditFromPanel(panel: HTMLElement): Promise<void> {
  const info = billingPanelState;
  const overlay = document.querySelector<HTMLElement>('.ext-bt-overlay');
  const tbody = document.querySelector<HTMLElement>('.ext-bt-rows');
  if (!info || !overlay || !tbody) return;
  billingEditCtx = { panel };
  billingStatus(panel, 'Memuat form billing…');
  const doc = await loadSourceDoc(billingEditUrl(info));
  if (!doc) {
    billingStatus(panel, 'Form billing gagal dimuat.');
    return;
  }
  renderBillingRows(doc, tbody);
  overlay.style.display = 'flex';
  billingStatus(panel, '');
}

function serializeSourceForm(doc: Document): URLSearchParams {
  const form = doc.getElementById('form_billing') as HTMLFormElement | null;
  const body = new URLSearchParams();
  if (!form) return body;
  new FormData(form).forEach((v, k) => {
    if (typeof v === 'string') body.append(k, v);
  });
  // Tulis nilai dari UI kita ke field asli; baris baru dibuat di form asli.
  document
    .querySelectorAll<HTMLInputElement>('.ext-bt-rows input[data-billing-name]')
    .forEach((el) => {
      const name = el.dataset.billingName;
      if (!name || !el.value) return;
      let target = doc.querySelector<HTMLInputElement>('input[name="' + name + '"]');
      if (!target) {
        target = doc.createElement('input');
        target.type = 'hidden';
        target.name = name;
        (doc.getElementById('tblBilling') || form).appendChild(target);
      }
      target.disabled = false;
      target.value = el.value;
      body.set(name, el.value);
    });
  body.append('save', '1');
  return body;
}

/** Simpan + (opsional) verifikasi BPJS klaim penuh — semua lewat fetch. */
async function saveBillingEdit(andVerif: boolean): Promise<void> {
  const ctx = billingEditCtx;
  if (!ctx) return;
  const doc = billingSourceFrame?.contentDocument;
  if (!doc?.getElementById('form_billing')) {
    billingStatus(ctx.panel, 'Form billing belum siap / tidak bisa diedit.');
    return;
  }
  billingStatus(ctx.panel, 'Menyimpan billing…');
  try {
    const r = await fetch('/billing/control/billing-edit', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: serializeSourceForm(doc).toString(),
    });
    const j = (await r.json()) as {
      status?: string | number;
      message?: string;
      message_detail?: string;
    };
    const ok = String(j.status) === '1' || String(j.status) === '201';
    if (!ok) {
      billingStatus(ctx.panel, 'Simpan gagal: ' + String(j.message ?? j.message_detail ?? ''));
      return;
    }
    closeBillingEdit();
    billingStatus(ctx.panel, 'Billing tersimpan.');
    if (andVerif) await verifFromPanel(ctx.panel);
  } catch (e) {
    billingStatus(ctx.panel, 'Simpan gagal: ' + String(e));
  }
}

/** Verifikasi BPJS klaim penuh: form asli di-load silent, klaim = total tagihan. */
async function verifFromPanel(panel: HTMLElement): Promise<void> {
  const info = billingPanelState;
  if (!info) return;
  billingStatus(panel, 'Memproses verifikasi BPJS…');
  const doc = await loadSourceDoc(billingVerifUrl(info), false);
  if (!doc) {
    billingStatus(panel, 'Form verifikasi gagal dimuat.');
    return;
  }
  const form = doc.getElementById('formPembayaran') as HTMLFormElement | null;
  if (!form) {
    billingStatus(panel, 'Form verifikasi tidak tersedia.');
    return;
  }
  // total_checklist = total tagihan keseluruhan (sudah termasuk jasa dokter);
  // total_billing hanya jumlah baris billing — jangan dipakai untuk klaim.
  const total = Number(
    doc.querySelector<HTMLInputElement>('input[name="total_checklist"]')?.value ||
      (doc.getElementById('total_billing') as HTMLInputElement | null)?.value ||
      0,
  );
  const klaim = doc.querySelector<HTMLInputElement>('input[name="klaim_bpjs"]');
  if (klaim) klaim.value = String(total);
  const sisa = doc.querySelector<HTMLInputElement>('input[name="sisaTagihan"]');
  if (sisa) sisa.value = '0';
  const body = new URLSearchParams();
  new FormData(form).forEach((v, k) => {
    if (typeof v === 'string') body.append(k, v);
  });
  if (klaim) body.set('klaim_bpjs', String(total));
  if (sisa) body.set('sisaTagihan', '0');
  body.append('save', '1');
  try {
    const r = await fetch('/billing/verifikasi-billing/control/bayar-control-new', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const j = (await r.json()) as { status?: string; message?: string };
    billingStatus(
      panel,
      String(j.status) === '1'
        ? String(j.message ?? 'Verifikasi BPJS berhasil.')
        : String(j.message ?? 'Verifikasi BPJS gagal.'),
    );
  } catch (e) {
    billingStatus(panel, 'Verifikasi BPJS gagal: ' + String(e));
  }
}

function mountBillingTools(bar: HTMLElement): void {
  if (billingToolsMounted || !document.body) return;
  billingToolsMounted = true;

  const anchor = document.createElement('span');
  anchor.className = 'ext-bt-anchor';
  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'ext-bt-fab';
  fab.title = 'M-Klaim Tools — Billing';
  fab.setAttribute('aria-label', 'Buka tools billing');
  fab.textContent = '💰 Billing Tools';

  const panel = document.createElement('div');
  panel.className = 'ext-bt-panel';
  const head = document.createElement('div');
  head.className = 'ext-bt-head';
  const title = document.createElement('span');
  title.textContent = '💰 M-Klaim Tools Extension';
  const closeHead = document.createElement('span');
  closeHead.className = 'x';
  closeHead.textContent = '×';
  head.append(title, closeHead);
  const bodyEl = document.createElement('div');
  bodyEl.className = 'ext-bt-body';
  const infoEl = document.createElement('div');
  infoEl.className = 'ext-bt-info';
  const group = document.createElement('div');
  group.className = 'ext-bt-group';
  bodyEl.append(infoEl, group);
  panel.append(head, bodyEl);
  anchor.append(fab, panel);
  bar.appendChild(anchor);

  const overlay = document.createElement('div');
  overlay.className = 'ext-bt-overlay';
  const modal = document.createElement('div');
  modal.className = 'ext-bt-modal';
  const modalHead = document.createElement('div');
  modalHead.className = 'ext-bt-modal-head';
  const modalTitle = document.createElement('span');
  modalTitle.textContent = 'Edit Billing Pasien';
  const closeModal = document.createElement('span');
  closeModal.style.cursor = 'pointer';
  closeModal.textContent = '×';
  modalHead.append(modalTitle, closeModal);
  const modalBody = document.createElement('div');
  modalBody.className = 'ext-bt-modal-body';

  // Autocomplete tarif = endpoint yang sama dengan tombol "Cari" di form asli.
  const searchBar = document.createElement('div');
  searchBar.className = 'ext-bt-search';
  const q = document.createElement('input');
  q.type = 'text';
  q.className = 'ext-bt-q';
  q.placeholder = 'Cari tindakan / tarif…';
  q.autocomplete = 'off';
  q.setAttribute('list', 'ext-bt-tarif-list');
  const list = document.createElement('datalist');
  list.id = 'ext-bt-tarif-list';
  billingSearchInput = q;
  billingTarifList = list;
  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'ext-bt-add';
  add.textContent = 'Tambah Tindakan';
  add.addEventListener('click', () => addBillingRow(tbody));
  searchBar.append(q, list, add);
  modalBody.appendChild(searchBar);

  const table = document.createElement('table');
  table.className = 'ext-bt-table';
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  ['Tindakan', 'Cari', 'Waktu', 'Frek', 'Diskon', 'Total', ''].forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  const tbody = document.createElement('tbody');
  tbody.className = 'ext-bt-rows';
  table.append(thead, tbody);
  modalBody.appendChild(table);
  const foot = document.createElement('div');
  foot.className = 'ext-bt-modal-foot';
  const mkFoot = (text: string, cls: string, fn: () => void): void => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = text;
    b.addEventListener('click', fn);
    foot.appendChild(b);
  };
  mkFoot('Kembali', 'ext-bt-kembali', closeBillingEdit);
  mkFoot('Simpan', 'ext-bt-simpan', () => void saveBillingEdit(false));
  mkFoot('Simpan & Verif Ulang', 'ext-bt-simpanverif', () => void saveBillingEdit(true));
  modal.append(modalHead, modalBody, foot);
  overlay.appendChild(modal);

  const source = document.createElement('iframe');
  source.className = 'ext-bt-source';
  source.title = 'Sumber form billing (internal)';
  source.style.cssText = 'display:none;';
  billingSourceFrame = source;

  document.body.append(overlay, source);
  q.addEventListener('input', () => {
    window.clearTimeout(billingTarifTimer);
    const value = q.value;
    billingTarifTimer = window.setTimeout(() => void searchTarif(value), 200);
  });
  q.addEventListener('change', () => {
    const t = billingTarifResults.find((x) => tarifLabel(x, 0) === q.value);
    if (!t) return;
    let tr = billingActiveRow
      ? tbody.querySelector<HTMLTableRowElement>(`tr[data-bt-idx="${billingActiveRow}"]`)
      : null;
    if (!tr) {
      addBillingRow(tbody);
      tr = tbody.querySelector<HTMLTableRowElement>(`tr[data-bt-idx="${billingActiveRow}"]`);
    }
    if (tr) applyTarif(tr, t);
    q.value = '';
  });
  fab.addEventListener('click', () => {
    const open = panel.style.display !== 'block';
    panel.style.display = open ? 'block' : 'none';
    if (open) void refreshBillingPanel(panel, group, infoEl);
  });
  closeHead.addEventListener('click', () => {
    panel.style.display = 'none';
  });
  closeModal.addEventListener('click', closeBillingEdit);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBillingEdit();
  });
}

function anyFeatureEnabled(): boolean {
  const cfg = g.currentConfig;
  if (!cfg?.extensionEnabled) return false;
  const ok = (key: string) => cfg.features?.[key]?.enabled && g.ExtensionCore.isFeatureAllowed(key);
  return ok('shortcutButtons') || ok('batchDelete') || ok('batchUpload') || ok('billingEditTools');
}

function renderToolbar(): void {
  if (!anyFeatureEnabled()) return;
  if (!isTargetPage() || document.querySelector('[data-toolbar]')) return;
  if (!extractIdVisit()) return;
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  if (
    loginPaths.some((p) => window.location.pathname.toLowerCase().includes(p)) ||
    document.querySelectorAll('input[type="password"]').length > 0
  )
    return;

  const bar = document.createElement('div');
  bar.dataset.toolbar = 'true';

  const label = document.createElement('span');
  label.textContent = 'Tools:';
  label.className = 'ext-toolbar-label';
  bar.appendChild(label);

  const shortcutOk =
    g.currentConfig?.features?.shortcutButtons?.enabled &&
    g.ExtensionCore.isFeatureAllowed('shortcutButtons');

  if (shortcutOk) {
    if (g.currentConfig?.extensionEnabled)
      bar.appendChild(createLink(mklaimBaseUrl(), BTN_STYLES.backMklaim, true));

    const eResume = editResumeUrl();
    if (eResume) bar.appendChild(createLink(eResume, BTN_STYLES.editResume));

    const dUrl = dokumenPasienUrl();
    if (dUrl) bar.appendChild(createLink(dUrl, BTN_STYLES.dokumenPasien));

    if (isRawatJalan() || isRawatInap()) {
      const rj = rajalUrl();
      if (rj) bar.appendChild(createLink(rj, BTN_STYLES.rajal));
    }
    if (isRawatInap()) {
      const spri = spriUrl();
      if (spri) bar.appendChild(createLink(spri, BTN_STYLES.spri));
      const pkIgd = pengkajianIgdUrl();
      if (pkIgd) bar.appendChild(createLink(pkIgd, BTN_STYLES.pengkajianIgd));
      const ri = ranapUrl();
      if (ri) bar.appendChild(createLink(ri, BTN_STYLES.ranap));
    }

    const tId = triageIgdUrl();
    if (tId) bar.appendChild(createLink(tId, BTN_STYLES.triageIgd));
  }

  if (
    g.currentConfig?.features?.batchDelete?.enabled &&
    g.ExtensionCore.isFeatureAllowed('batchDelete')
  ) {
    bar.appendChild(
      createBtn(
        'Hapus Dokumen',
        '#ef4444',
        '#dc2626',
        () => (g as any).batchDeleteShowModal?.(),
        'ext-toolbar-batch',
      ),
    );
  }
  if (
    g.currentConfig?.features?.batchUpload?.enabled &&
    g.ExtensionCore.isFeatureAllowed('batchUpload')
  ) {
    bar.appendChild(
      createBtn(
        'Upload Dokumen Ulang',
        '#2563eb',
        '#1d4ed8',
        () => (g as any).batchUploadShowModal?.(),
        'ext-toolbar-upload',
      ),
    );
  }

  if (
    g.currentConfig?.features?.billingEditTools?.enabled &&
    g.ExtensionCore.isFeatureAllowed('billingEditTools')
  ) {
    mountBillingTools(bar);
  }

  const selectors = [
    '.form-horizontal',
    'form',
    '.container-fluid',
    '.container',
    '.content',
    '.main-content',
    '#content',
    '.page-content',
  ];
  let target: HTMLElement | null = null;
  for (const sel of selectors) {
    target = document.querySelector<HTMLElement>(sel);
    if (target) break;
  }
  if (!target) target = document.body;
  if (target.firstChild) target.insertBefore(bar, target.firstChild);
  else target.appendChild(bar);
  if (shortcutOk) initBpjsRevisionHistory(bar);
}

function scheduleToolbar(): void {
  const fire = () => setTimeout(renderToolbar, 500);
  if (document.readyState === 'complete') fire();
  else window.addEventListener('load', fire);
  // Partial halaman detail dimuat lewat AJAX (kadang setelah 'load') —
  // coba lagi sekali sebentar, renderToolbar idempotent.
  setTimeout(renderToolbar, 3000);
}
scheduleToolbar();
