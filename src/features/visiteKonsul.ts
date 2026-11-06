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

async function apiList(idVisit: string): Promise<Row[]> {
  const res = await fetch(`${API}/list?id_visit=${encodeURIComponent(idVisit)}`, {
    credentials: 'omit',
  });
  const j = await res.json();
  if (!j?.ok) return [];
  return (j.data || []).map(
    (r: { id: number; jenis: string; nama_dokter: string; id_dokter: number | null }) => ({
      id: r.id,
      jenis: r.jenis,
      nama_dokter: r.nama_dokter,
      id_dokter: r.id_dokter,
      saving: false,
    }),
  );
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

async function searchDokter(q: string): Promise<{ id: number; nama: string }[]> {
  const res = await fetch(`${API}/dokter?q=${encodeURIComponent(q)}`, { credentials: 'omit' });
  const j = await res.json();
  if (!j?.ok) return [];
  return j.data || [];
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
    .ext-vk-card { margin: 12px 0; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; }
    .ext-vk-card h3 { margin: 0 0 8px; font-size: 14px; font-weight: 700; }
    .ext-vk-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .ext-vk-table th, .ext-vk-table td { border: 1px solid #e2e8f0; padding: 4px 6px; font-size: 12px; }
    .ext-vk-table th { background: #f1f5f9; }
    .ext-vk-table input { width: 100%; box-sizing: border-box; padding: 2px 4px; font-size: 12px; }
    .ext-vk-btn { padding: 3px 8px; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; margin-right: 4px; }
    .ext-vk-btn.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
    .ext-vk-btn.danger { background: #dc2626; color: #fff; border-color: #dc2626; }
    .ext-vk-autocomplete { position: relative; }
    .ext-vk-suggest { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #cbd5e1; max-height: 160px; overflow-y: auto; z-index: 9999; }
    .ext-vk-suggest div { padding: 4px 6px; font-size: 12px; cursor: pointer; }
    .ext-vk-suggest div:hover { background: #e2e8f0; }
    .ext-vk-status { font-size: 11px; color: #64748b; margin-left: 6px; }
  `;
  document.head.appendChild(style);
}

function makeAutocomplete(
  input: HTMLInputElement,
  row: Row,
  onSelect: (id: number, nama: string) => void,
) {
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
      const q = input.value.trim();
      if (q.length < 2) {
        close();
        return;
      }
      const list = await searchDokter(q);
      close();
      if (!list.length) return;
      box = document.createElement('div');
      box.className = 'ext-vk-suggest';
      for (const d of list) {
        const item = document.createElement('div');
        item.textContent = d.nama;
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          input.value = d.nama;
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

  const addBtn = document.createElement('button');
  addBtn.className = 'ext-vk-btn primary';
  addBtn.textContent = '+ Tambah';
  card.appendChild(addBtn);

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
      const input = document.createElement('input');
      input.type = 'text';
      input.value = row.nama_dokter;
      input.placeholder = 'Ketik nama dokter...';
      tdDoc.appendChild(input);
      const acWrap = document.createElement('div');
      acWrap.className = 'ext-vk-autocomplete';
      acWrap.style.position = 'relative';
      tdDoc.appendChild(acWrap);
      // move input into acWrap
      acWrap.appendChild(input);

      makeAutocomplete(input, row, (id, nama) => {
        row.id_dokter = id;
        row.nama_dokter = nama;
        saveRow(row);
      });

      input.addEventListener('change', () => {
        row.nama_dokter = input.value.trim();
        if (row.nama_dokter) saveRow(row);
      });

      tr.appendChild(tdDoc);

      const tdAct = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.className = 'ext-vk-btn danger';
      delBtn.textContent = 'Hapus';
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

  async function saveRow(row: Row) {
    if (!row.nama_dokter.trim()) return;
    row.saving = true;
    status.textContent = 'Menyimpan...';
    const saved = await apiSave(idVisit, row, user);
    row.saving = false;
    if (saved) {
      row.id = saved.id;
      row.id_dokter = saved.id_dokter;
      row.nama_dokter = saved.nama_dokter;
      status.textContent = 'Tersimpan';
    } else {
      status.textContent = 'Gagal simpan';
    }
  }

  addBtn.addEventListener('click', () => {
    rows.push({ id: null, jenis, nama_dokter: '', id_dokter: null, saving: false });
    render();
  });

  render();
  container.appendChild(card);
}

async function init() {
  const idVisit = getIdVisit();
  if (!idVisit) return;

  // guard anti double inject — dipindah ke sini (bukan top-level) supaya
  // registrasi featureModules di bawah tetap jalan saat script ter-inject 2×.
  if (g.__extVisiteKonsul) return;
  g.__extVisiteKonsul = true;

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
  title.style.fontSize = '15px';
  title.style.fontWeight = '700';
  title.style.marginBottom = '8px';
  card.appendChild(title);
  host.insertBefore(card, host.firstChild);

  const existing = await apiList(idVisit);
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
