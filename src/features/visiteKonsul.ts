/**
 * visiteKonsul — input manual Visite & Konsul dokter spesialis IGD.
 *
 * Jalan di halaman MORBIS `/admisi/pelaksanaan_pelayanan/halaman-utama?id_visit=…`.
 * Dua bagian terpisah (Visite, Konsul), baris dinamis (tambah/hapus).
 * Dokter diisi manual dengan autocomplete dari Reports SIMRS (ref_dokters).
 * Tanpa token API (semua pengguna extension boleh memakai).
 * Data disimpan di MariaDB Reports SIMRS, bukan Oracle/MORBIS.
 * Auto-sinkron: buka kunjungan lain / buka ulang → data tersimpan tampil otomatis.
 */
import { resolveReportsBase } from './shared/resumeHistory.js';
import { runWhenIdle } from './shared/whenIdle.js';
import { getMorbisGlobals, type MorbisGlobals } from './shared/types.js';
import '../ui/web/ext-btn';
import '../ui/web/ext-input';
import { injectGlobalTokens } from '../ui/web/tokens';

const LOG_PREFIX = '[MORBIS Ext] visiteKonsul';

const g = getMorbisGlobals() as MorbisGlobals & { __extVisiteKonsul?: boolean };

function getIdVisit(): string | null {
  try {
    const p = new URLSearchParams(location.search);
    const v = p.get('id_visit');
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

interface Row {
  id: number | null;
  jenis: 'visite' | 'konsul';
  nama_dokter: string;
  id_dokter: number | null;
  saving: boolean;
}

const base = resolveReportsBase();
const API = base + '/api/visite-konsul';

/** Ambil pesan galat API (mis. 503 API_DISABLED) supaya tidak gagal senyap. */
function apiErrMsg(j: { message?: string; code?: string } | null, res?: Response): string {
  return j?.message || (res ? `HTTP ${res.status}` : 'gagal menghubungi server');
}

async function apiList(idVisit: string): Promise<{ rows: Row[]; error?: string }> {
  const res = await fetch(`${API}/list?id_visit=${encodeURIComponent(idVisit)}`, {
    credentials: 'omit',
  });
  const j = await res.json().catch(() => null);
  if (!j?.ok) return { rows: [], error: apiErrMsg(j, res) };
  const rows = (j.data || []).map(
    (r: { id: number; jenis: string; nama_dokter: string; id_dokter: number | null }) => ({
      id: r.id,
      jenis: r.jenis,
      nama_dokter: r.nama_dokter,
      id_dokter: r.id_dokter,
      saving: false,
    }),
  );
  return { rows };
}

async function apiSave(idVisit: string, row: Row, user: string): Promise<Row | null> {
  const res = await fetch(`${API}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    body: JSON.stringify({
      id: row.id,
      id_visit: Number(idVisit),
      jenis: row.jenis,
      id_dokter: row.id_dokter,
      nama_dokter: row.nama_dokter,
      user,
    }),
  });
  const j = await res.json();
  if (!j?.ok) return null;
  return {
    id: j.data.id,
    jenis: j.data.jenis,
    nama_dokter: j.data.nama_dokter,
    id_dokter: j.data.id_dokter,
    saving: false,
  };
}

async function apiDelete(id: number, idVisit: string): Promise<boolean> {
  const res = await fetch(`${API}/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    body: JSON.stringify({ id, id_visit: Number(idVisit) }),
  });
  const j = await res.json();
  return !!j?.ok;
}

async function searchDokter(
  q: string,
): Promise<{ items: { id: number; nama: string }[]; error?: string }> {
  const res = await fetch(`${API}/dokter?q=${encodeURIComponent(q)}`, { credentials: 'omit' });
  const j = await res.json().catch(() => null);
  if (!j?.ok) return { items: [], error: apiErrMsg(j, res) };
  return { items: j.data || [] };
}

function makeBtn(
  variant: 'primary' | 'secondary' | 'danger',
  size: 'sm' | 'md',
  label: string,
): HTMLElement {
  const ce = (
    typeof window !== 'undefined' ? window.customElements : null
  ) as CustomElementRegistry | null;
  if (ce?.get?.('ext-btn')) {
    const b = document.createElement('ext-btn');
    b.setAttribute('variant', variant);
    b.setAttribute('size', size);
    b.textContent = label;
    return b;
  }
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  b.className = `ext-vk-btn ext-vk-btn--${variant} ext-vk-btn--${size}`;
  return b;
}
function readPetugas(): string {
  try {
    const el = document.querySelector<HTMLInputElement>('input[name="id_user"], #id_user');
    if (el?.value?.trim()) return el.value.trim();
  } catch {
    /* ignore */
  }
  return 'petugas';
}

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .ext-vk-card { margin: 12px 0; padding: 12px; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-md); background: var(--ext-surface); font-family: var(--ext-font-family); }
    .ext-vk-card h2, .ext-vk-card h3 { margin: 0 0 8px; font-size: var(--ext-font-size-md); font-weight: 700; color: var(--ext-text); }
    .ext-vk-card > ext-btn, .ext-vk-card > .ext-vk-btn { margin-right: 6px; }
    .ext-vk-btn { display: inline-flex; align-items: center; justify-content: center; font-family: var(--ext-font-family); font-weight: 600; border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); cursor: pointer; margin-right: 6px; }
    .ext-vk-btn--sm { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; }
    .ext-vk-btn--primary { background: var(--ext-primary); color: var(--ext-text-on-primary); border-color: var(--ext-primary); }
    .ext-vk-btn--secondary { background: var(--ext-surface); color: var(--ext-text); }
    .ext-vk-btn--danger { background: var(--ext-danger); color: var(--ext-text-on-primary); border-color: var(--ext-danger); }
    .ext-vk-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .ext-vk-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .ext-vk-table th, .ext-vk-table td { border: 1px solid var(--ext-border); padding: 4px 6px; font-size: var(--ext-font-size-sm); color: var(--ext-text); }
    .ext-vk-table th { background: var(--ext-surface-2); }
    .ext-vk-autocomplete { position: relative; }
    .ext-vk-input { width: 100%; box-sizing: border-box; padding: 6px 10px; font-size: var(--ext-font-size-sm); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); font-family: var(--ext-font-family); color: var(--ext-text); background: var(--ext-surface); }
    .ext-vk-suggest { position: absolute; top: 100%; left: 0; right: 0; background: var(--ext-surface); border: 1px solid var(--ext-border); border-radius: var(--ext-radius-sm); max-height: 160px; overflow-y: auto; z-index: 9999; box-shadow: var(--ext-shadow-md); }
    .ext-vk-suggest div { padding: 6px 8px; font-size: var(--ext-font-size-sm); color: var(--ext-text); cursor: pointer; }
    .ext-vk-suggest div:hover { background: var(--ext-surface-2); }
    .ext-vk-status { font-size: var(--ext-font-size-xs); color: var(--ext-text-muted); margin-left: 6px; }
    .ext-vk-warn { margin: 0 0 8px; padding: 8px 10px; font-size: var(--ext-font-size-sm); border-radius: var(--ext-radius-sm); background: var(--ext-danger-soft); border: 1px solid #f3c1be; color: var(--ext-danger); }
  `;
  document.head.appendChild(style);
}

function makeAutocomplete(
  input: HTMLElement,
  row: Row,
  onSelect: (id: number, nama: string) => void,
) {
  const readVal = () => {
    const v = (input as { value?: unknown }).value;
    return typeof v === 'string' ? v : (input.getAttribute('value') ?? '');
  };
  const writeVal = (v: string) => {
    const anyEl = input as { value?: string };
    try {
      anyEl.value = v;
    } catch {
      /* ignore */
    }
    input.setAttribute('value', v);
  };

  const wrap = input.parentElement as HTMLElement;
  let box: HTMLDivElement | null = null;
  let timer: number | null = null;

  function close() {
    if (box) {
      box.remove();
      box = null;
    }
  }

  input.addEventListener('input', () => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(async () => {
      const q = readVal().trim();
      if (q.length < 2) {
        close();
        return;
      }
      const { items, error } = await searchDokter(q);
      close();
      if (!items.length && !error) return;
      box = document.createElement('div');
      box.className = 'ext-vk-suggest';
      if (error && !items.length) {
        const msg = document.createElement('div');
        msg.textContent = `Pencarian dokter gagal: ${error}`;
        msg.style.color = 'var(--ext-danger)';
        box.appendChild(msg);
        wrap.appendChild(box);
        return;
      }
      for (const d of items) {
        const item = document.createElement('div');
        item.textContent = d.nama;
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          writeVal(d.nama);
          onSelect(d.id, d.nama);
          close();
        });
        box.appendChild(item);
      }
      wrap.appendChild(box);
    }, 250);
  });
  input.addEventListener('blur', () => window.setTimeout(close, 150));
}

function buildSection(
  title: string,
  jenis: 'visite' | 'konsul',
  rows: Row[],
  idVisit: string,
  user: string,
  container: HTMLElement,
) {
  const card = document.createElement('div');
  card.className = 'ext-vk-card';
  const h = document.createElement('h3');
  h.textContent = title;
  card.appendChild(h);

  const table = document.createElement('table');
  table.className = 'ext-vk-table';
  const thead = document.createElement('thead');
  thead.innerHTML =
    '<tr><th style="width:40px">No</th><th>Dokter</th><th style="width:60px">Aksi</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  card.appendChild(table);

  const addBtn = makeBtn('secondary', 'sm', '+ Tambah');
  card.appendChild(addBtn);

  const saveBtn = makeBtn('primary', 'sm', 'Simpan');
  card.appendChild(saveBtn);

  const status = document.createElement('span');
  status.className = 'ext-vk-status';
  card.appendChild(status);

  function render() {
    tbody.innerHTML = '';
    const filtered = rows.filter((r) => r.jenis === jenis);
    filtered.forEach((row, idx) => {
      const tr = document.createElement('tr');
      const tdNo = document.createElement('td');
      tdNo.textContent = String(idx + 1);
      tr.appendChild(tdNo);

      const tdDoc = document.createElement('td');
      const acWrap = document.createElement('div');
      acWrap.className = 'ext-vk-autocomplete';
      let input: HTMLElement;
      if (window.customElements?.get?.('ext-input')) {
        input = document.createElement('ext-input');
        input.setAttribute('type', 'text');
        input.setAttribute('size', 'sm');
        input.setAttribute('placeholder', 'Ketik nama dokter...');
        try {
          (input as { value?: string }).value = row.nama_dokter;
        } catch {
          /* ignore */
        }
        input.setAttribute('value', row.nama_dokter);
      } else {
        const ni = document.createElement('input');
        ni.type = 'text';
        ni.placeholder = 'Ketik nama dokter...';
        ni.value = row.nama_dokter;
        ni.className = 'ext-vk-input';
        input = ni;
      }
      acWrap.appendChild(input);
      tdDoc.appendChild(acWrap);

      makeAutocomplete(input, row, (id, nama) => {
        row.id_dokter = id;
        row.nama_dokter = nama;
        status.textContent = 'Belum disimpan';
      });

      input.addEventListener('change', () => {
        const v = (input as { value?: unknown }).value;
        row.nama_dokter = (typeof v === 'string' ? v : (input.getAttribute('value') ?? '')).trim();
        status.textContent = 'Belum disimpan';
      });

      tr.appendChild(tdDoc);

      const tdAct = document.createElement('td');
      const delBtn = makeBtn('danger', 'sm', 'Hapus');
      delBtn.addEventListener('click', async () => {
        if (row.id) {
          const ok = await apiDelete(row.id, idVisit);
          if (!ok) {
            status.textContent = 'Gagal hapus';
            return;
          }
        }
        const i = rows.indexOf(row);
        if (i >= 0) rows.splice(i, 1);
        render();
        status.textContent = 'Dihapus';
      });
      tdAct.appendChild(delBtn);
      tr.appendChild(tdAct);

      tbody.appendChild(tr);
    });
  }

  async function saveRow(row: Row): Promise<boolean> {
    if (!row.nama_dokter.trim() || row.saving) return false;
    row.saving = true;
    const saved = await apiSave(idVisit, row, user);
    row.saving = false;
    if (!saved) return false;
    row.id = saved.id;
    row.id_dokter = saved.id_dokter;
    row.nama_dokter = saved.nama_dokter;
    return true;
  }

  saveBtn.addEventListener('click', async () => {
    const mine = rows.filter((r) => r.jenis === jenis && r.nama_dokter.trim());
    if (!mine.length) {
      status.textContent = 'Belum ada data';
      return;
    }
    const isExt = !!window.customElements?.get?.('ext-btn');
    if (isExt) saveBtn.setAttribute('loading', '');
    else {
      (saveBtn as HTMLButtonElement).disabled = true;
      saveBtn.textContent = 'Menyimpan...';
    }
    status.textContent = 'Menyimpan...';
    let ok = 0;
    for (const r of mine) if (await saveRow(r)) ok++;
    if (isExt) saveBtn.removeAttribute('loading');
    else {
      (saveBtn as HTMLButtonElement).disabled = false;
      saveBtn.textContent = 'Simpan';
    }
    status.textContent = ok === mine.length ? 'Tersimpan' : `Tersimpan ${ok}/${mine.length}`;
    if (ok !== mine.length) console.warn(LOG_PREFIX, 'gagal simpan', jenis, ok, '/', mine.length);
  });

  addBtn.addEventListener('click', () => {
    rows.push({ id: null, jenis, nama_dokter: '', id_dokter: null, saving: false });
    render();
  });

  render();
  container.appendChild(card);
}

/** Cari judul "HALAMAN UTAMA" — h2.judul diutamakan, fallback h1/h2/h3 mana pun. */
function findMainHeading(): HTMLElement | null {
  const h2 = Array.from(document.querySelectorAll<HTMLElement>('h2.judul')).find((el) =>
    /halaman\s+utama/i.test(el.textContent || ''),
  );
  if (h2) return h2;
  return (
    Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3')).find((el) =>
      /halaman\s+utama/i.test(el.textContent || ''),
    ) || null
  );
}

/** Konten MORBIS kadang datang belakangan — tunggu sebentar sebelum fallback. */
async function waitMainHeading(timeoutMs = 5000): Promise<HTMLElement | null> {
  const end = Date.now() + timeoutMs;
  for (;;) {
    const h = findMainHeading();
    if (h || Date.now() > end) return h;
    await new Promise((r) => setTimeout(r, 250));
  }
}

async function init() {
  const idVisit = getIdVisit();
  if (!idVisit) return;

  // guard anti double inject — dipindah ke sini (bukan top-level) supaya
  // registrasi featureModules di bawah tetap jalan saat script ter-inject 2×.
  if (g.__extVisiteKonsul) return;
  g.__extVisiteKonsul = true;

  injectGlobalTokens();
  injectStyles();

  const user = readPetugas();

  // cari container host
  let host: HTMLElement | null = document.querySelector(
    '#main-content, .content, main, #content',
  ) as HTMLElement | null;
  if (!host) host = document.body;

  const card = document.createElement('div');
  card.className = 'ext-vk-card';
  const title = document.createElement('h2');
  title.textContent = 'Visite & Konsul Dokter Spesialis IGD (input manual)';
  card.appendChild(title);
  const heading = await waitMainHeading();
  if (heading) heading.insertAdjacentElement('afterend', card);
  else host.insertBefore(card, host.firstChild);

  const { rows: existing, error: listErr } = await apiList(idVisit);
  if (listErr) {
    const warn = document.createElement('div');
    warn.className = 'ext-vk-warn';
    warn.textContent = `API visite-konsul tidak aktif (${listErr}). Pencarian & simpan dokter akan gagal sampai admin Reports mengaktifkan grup API ini.`;
    card.appendChild(warn);
    console.warn(LOG_PREFIX, 'api list gagal:', listErr);
  }
  const rows: Row[] = existing;

  buildSection('VISITE', 'visite', rows, idVisit, user, card);
  buildSection('KONSUL', 'konsul', rows, idVisit, user, card);

  console.log(LOG_PREFIX, 'loaded', rows.length, 'rows for visit', idVisit);
}

// Registrasi ke registry init.ts — HANYA inject di halaman utama pelayanan.
// Tanpa ini fitur jalan sendiri di semua halaman yang match manifest
// (detail-rawat-inap, rm-rawat-jalan-new, pelaksanaan-operasi, dll) dan
// toggle di popup tidak berpengaruh.
if (typeof g.featureModules !== 'undefined') {
  g.featureModules.visiteKonsul = {
    id: 'visiteKonsul',
    name: 'Visite & Konsul Dokter (IGD)',
    description:
      'Input manual visite & konsul dokter spesialis IGD di halaman utama pelayanan (data di Reports SIMRS)',
    match: { pathname: '/admisi/pelaksanaan_pelayanan/halaman-utama' },
    enabledWhen: () => !!getIdVisit(),
    run: () =>
      runWhenIdle(() => {
        init().catch((e) => console.error(LOG_PREFIX, e));
      }, 500),
  };
} else {
  console.warn(LOG_PREFIX, 'featureModules not defined, registration skipped');
}
