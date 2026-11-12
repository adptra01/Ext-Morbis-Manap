/**
 * cpptReader — tombol "Baca CPPT" di halaman detail/edit resep.
 *
 * Posisi: menempel di section "Antrian Farmasi" (#ext-antrian-fieldset, dibuat
 * penjualanResepAntrian) sebagai baris kedua, jadi tidak ikut terhapus saat
 * bar antrian re-render. Bila section itu tidak ada (mis. penerimaan/detail),
 * fieldset sendiri dibuat.
 *
 * Data: AJAX CPPT bawaan MORBIS (bukan scrape halaman penuh):
 *   rajal → /admisi/pelaksanaan_pelayanan/cppt/table?id_visit=
 *   ranap → /admisi/detail-rawat-inap/cppt/table?id_visit=
 *
 * Modal dibuat dari DOM biasa — `customElements` bernilai null di sebagian
 * halaman MORBIS, jadi web component tidak bisa diandalkan di sini.
 *
 * Role: admin & apotek (allowedRoles di background.ts).
 */
import { whenFeatureEnabled } from './shared/featureGate.js';

const BAR_ID = 'ext-cppt-bar';
const BTN_ID = 'ext-cppt-btn';
const MODAL_ID = 'ext-cppt-modal';

interface CpptRow {
  waktu: string;
  subyektif: string;
  obyektif: string;
  assessment: string;
  planning: string;
  instruksi: string;
  penginput: string;
  dpjp: string;
}

/** id_visit: input hidden halaman dulu, lalu query string. */
function resolveIdVisit(): string {
  const fromInput = document.querySelector<HTMLInputElement>('#id_visit')?.value?.trim();
  if (fromInput) return fromInput;
  const p = new URLSearchParams(location.search);
  return p.get('visit') || p.get('id_visit') || p.get('idVisit') || '';
}

const txt = (el: Element | null | undefined): string =>
  (el?.textContent || '').replace(/\s+/g, ' ').trim();

/** Parse tabel CPPT dari fragmen HTML; kolom dipetakan lewat judul header. */
function parseRows(html: string): CpptRow[] {
  const table = new DOMParser().parseFromString(html, 'text/html').querySelector('table');
  if (!table) return [];

  const trs = Array.from(table.querySelectorAll('tr'));
  if (!trs.length) return [];

  const header = trs.find((tr) => tr.querySelector('th')) ?? trs[0];
  const heads = Array.from(header.querySelectorAll('th, td')).map((c) => txt(c).toLowerCase());
  const col = (kw: string): number => heads.findIndex((h) => h.includes(kw));
  const idx = {
    waktu: col('waktu'),
    subyektif: col('subyektif'),
    obyektif: col('obyektif'),
    assessment: col('assess'),
    planning: col('planning'),
    instruksi: col('instruksi'),
    penginput: col('penginput'),
    dpjp: col('dpjp'),
  };

  const rows: CpptRow[] = [];
  for (const tr of trs) {
    if (tr === header) continue;
    const cells = Array.from(tr.querySelectorAll('td'));
    if (cells.length < 5) continue;
    const at = (i: number): string => (i >= 0 ? txt(cells[i]) : '');
    const row: CpptRow = {
      waktu: at(idx.waktu),
      subyektif: at(idx.subyektif),
      obyektif: at(idx.obyektif),
      assessment: at(idx.assessment),
      planning: at(idx.planning),
      instruksi: at(idx.instruksi),
      penginput: at(idx.penginput),
      dpjp: at(idx.dpjp),
    };
    if (row.waktu || row.subyektif || row.assessment) rows.push(row);
  }
  return rows;
}

const SUMBER: ReadonlyArray<readonly [string, string]> = [
  ['Rajal', '/admisi/pelaksanaan_pelayanan/cppt/table?id_visit='],
  ['Ranap', '/admisi/detail-rawat-inap/cppt/table?id_visit='],
];

/** Ambil CPPT: coba endpoint rajal lalu ranap (sumber yang ada isinya dipakai). */
async function fetchRows(idVisit: string): Promise<{ rows: CpptRow[]; source: string }> {
  for (const [label, base] of SUMBER) {
    try {
      const resp = await fetch(base + encodeURIComponent(idVisit), { credentials: 'include' });
      if (!resp.ok) continue;
      const rows = parseRows(await resp.text());
      if (rows.length) return { rows, source: label };
    } catch {
      /* coba sumber berikutnya */
    }
  }
  return { rows: [], source: '' };
}

function el(tag: string, css?: string, text?: string): HTMLElement {
  const node = document.createElement(tag);
  if (css) node.style.cssText = css;
  if (text) node.textContent = text;
  return node;
}

function showModal(rows: CpptRow[], source: string): void {
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
  header.appendChild(
    el(
      'h3',
      'margin:0;font-size:17px;font-weight:700;',
      `Isian CPPT${source ? ' (' + source + ')' : ''}`,
    ),
  );
  const closeBtn = el(
    'button',
    'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:20px;line-height:1;',
    '×',
  ) as HTMLButtonElement;
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Tutup');
  header.appendChild(closeBtn);

  const body = el('div', 'padding:14px 18px;overflow:auto;flex:1;');

  if (!rows.length) {
    body.appendChild(
      el('p', 'margin:0;color:#667085;', 'Tidak ada isian CPPT untuk kunjungan ini.'),
    );
  }
  rows.forEach((r, i) => {
    const item = el(
      'div',
      'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;',
    );
    item.appendChild(
      el(
        'div',
        'font-weight:700;color:#0f5132;margin-bottom:6px;',
        `#${i + 1} — ${r.waktu}${r.penginput ? ' · ' + r.penginput : ''}`,
      ),
    );
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
    body.appendChild(item);
  });

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
  const idVisit = resolveIdVisit();
  if (!idVisit) {
    alert('[MORBIS Ext] id_visit tidak ditemukan — buka lewat halaman detail resep pasien.');
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Memuat…';
  try {
    const { rows, source } = await fetchRows(idVisit);
    showModal(rows, source);
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
  btn.title = 'Baca isian CPPT pasien (rajal/ranap)';
  btn.style.cssText = 'margin:2px 6px 2px 0;background:#2193cf;color:#fff;border-color:#2193cf;';
  btn.textContent = 'Baca CPPT';
  btn.addEventListener('click', () => void onClick(btn));

  row.appendChild(btn);
  host.appendChild(row);
  return true;
}

whenFeatureEnabled('cpptReader', () => {
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
});
