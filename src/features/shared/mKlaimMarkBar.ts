/**
 * mKlaimMarkBar — satu UI mark untuk seluruh tabel M-KLAIM.
 *
 * Menggantikan 6 tombol per baris (Labor/Radiologi/Batal Berobat/Pre-op/
 * Telaah/Partial) dengan 1 tombol pemicu + 1 popover bersama + multi-chip.
 * Tombol lama sengaja DIBIARKAN di DOM (disembunyikan CSS) karena engine
 * masing-masing fitur masih memakainya untuk toggle + sinkron pusat — cukup
 * dikirimi `.click()` dari popover. Jadi tidak ada duplikasi logika simpan.
 *
 * State dibaca dari tombol lama, disimpan sebagai signature di Map; hanya
 * baris yang berubah yang disentuh (rAF, sekali frame) → tabel tidak getar.
 */
import { injectCSS } from '../../shared/ui/index.js';
import { badgeCellFor } from '../mKlaimPreOp.js';

export interface MarkDef {
  key: string;
  label: string;
  badge: string;
  /** Tombol lama yang dipakai sebagai sumber state + penerima klik. */
  button: string;
  /** Atribut penanda status "aktif" pada tombol/badge lama. */
  stateAttr: string;
  /** Key config di background.ts — satu sumber untuk gate & UI. */
  configKey: string;
}

/** Urutan tampil chip & checkbox mengikuti urutan mark di permintaan. */
export const MARK_DEFS: MarkDef[] = [
  {
    key: 'labor',
    label: 'Labor',
    badge: 'LABOR',
    button: 'button.ext-mk-btn[data-ext-mk="labor"]',
    stateAttr: 'data-ext-mk-marked',
    configKey: 'mKlaimMarks',
  },
  {
    key: 'radiologi',
    label: 'Radiologi',
    badge: 'RADIOLOGI',
    button: 'button.ext-mk-btn[data-ext-mk="radiologi"]',
    stateAttr: 'data-ext-mk-marked',
    configKey: 'mKlaimMarks',
  },
  {
    key: 'batal-berobat',
    label: 'Batal Berobat',
    badge: 'BATAL BEROBAT',
    button: 'button.ext-mk-btn[data-ext-mk="batal-berobat"]',
    stateAttr: 'data-ext-mk-marked',
    configKey: 'mKlaimMarks',
  },
  {
    key: 'pre-op',
    label: 'Pre-op',
    badge: 'PRE-OP',
    button: 'button.ext-preop-btn',
    stateAttr: 'data-ext-preop-marked',
    configKey: 'mKlaimMarks',
  },
  {
    key: 'telaah',
    label: 'Telaah',
    badge: 'TELAAH',
    button: 'button.ext-telaah-btn',
    stateAttr: 'data-ext-telaah-marked',
    configKey: 'mKlaimMarks',
  },
  {
    key: 'partial',
    label: 'Partial',
    badge: 'PARTIAL',
    button: 'button.ext-partial-btn',
    stateAttr: 'data-ext-partial-marked',
    configKey: 'mKlaimMarks',
  },
];

/** Mark yang benar-benar aktif (config ON + role diizinkan). */
export function activeMarkDefs(enabledKeys: ReadonlySet<string>): MarkDef[] {
  return MARK_DEFS.filter((d) => enabledKeys.has(d.configKey));
}

const CSS = `
@media print { .ext-mark-trigger, .ext-chips-wrap, #ext-shared-popover { display:none !important; } }
/* Tombol & badge lama disembunyikan di list — logikanya tetap jalan. */
table tbody tr .ext-mk-btn:not(.ext-mk-large),
table tbody tr .ext-preop-btn:not(.ext-preop-large),
table tbody tr .ext-telaah-btn:not(.ext-telaah-large),
table tbody tr .ext-partial-btn:not(.ext-partial-large),
.ext-mk-badge, .ext-preop-badge, .ext-telaah-badge, .ext-partial-badge {
  display:none !important;
}
.ext-mark-trigger {
  display:inline-flex;align-items:center;justify-content:center;gap:4px;
  height:26px;margin-left:4px;padding:0 8px;
  font-size:11px;font-weight:600;color:#334155;background:#f8fafc;
  border:1px solid #cbd5e1;border-radius:4px;cursor:pointer;vertical-align:middle;
  white-space:nowrap;
}
.ext-mark-trigger:hover { background:#e2e8f0; }
.ext-mark-trigger.has-count { background:#eff6ff;color:#1d4ed8;border-color:#93c5fd; }
.ext-mark-trigger.has-count:hover { background:#dbeafe; }
.ext-chips-wrap {
  display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;max-width:125px;
  contain:layout style;
}
.ext-chip {
  font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;
  letter-spacing:.1px;line-height:1.25;white-space:nowrap;
}
.ext-chip[data-type="labor"]         { background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd; }
.ext-chip[data-type="radiologi"]     { background:#fef3c7;color:#b45309;border:1px solid #fde68a; }
.ext-chip[data-type="batal-berobat"] { background:#fee2e2;color:#b91c1c;border:1px solid #fecaca; }
.ext-chip[data-type="pre-op"]        { background:#f3e8ff;color:#7e22ce;border:1px solid #e9d5ff; }
.ext-chip[data-type="telaah"]        { background:#dcfce7;color:#15803d;border:1px solid #bbf7d0; }
.ext-chip[data-type="partial"]       { background:#f1f5f9;color:#334155;border:1px solid #cbd5e1; }
tr.ext-has-marks > td:first-child { box-shadow:inset 3px 0 0 #64748b; }
#ext-shared-popover {
  position:fixed;z-index:99999;width:175px;background:#fff;
  border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 8px 20px rgba(15,23,42,.15);
  padding:6px;display:none;font-family:system-ui,-apple-system,sans-serif;
}
#ext-shared-popover.open { display:block; }
.ext-pop-item {
  display:flex;align-items:center;gap:8px;padding:5px 7px;font-size:12px;
  color:#1e293b;border-radius:4px;cursor:pointer;user-select:none;
}
.ext-pop-item:hover { background:#f1f5f9; }
.ext-pop-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
.ext-pop-dot[data-type="labor"]         { background:#0284c7; }
.ext-pop-dot[data-type="radiologi"]     { background:#d97706; }
.ext-pop-dot[data-type="batal-berobat"] { background:#dc2626; }
.ext-pop-dot[data-type="pre-op"]        { background:#7c3aed; }
.ext-pop-dot[data-type="telaah"]        { background:#16a34a; }
.ext-pop-dot[data-type="partial"]       { background:#64748b; }
`;

/**
 * Baris klaim = baris yang punya minimal satu tombol mark lama yang aktif.
 * PENTING: jangan pakai `table tbody tr` mentah — datepicker kalender di form
 * pencarian juga pakai <table> dan ikut kena "+ Mark" (laporan 2026-11-23).
 */
export function hasLegacyMarkButton(
  row: HTMLTableRowElement,
  defs: MarkDef[] = MARK_DEFS,
): boolean {
  return !!row.querySelector(defs.map((d) => d.button).join(','));
}

/** Teks tombol pemicu mengikuti jumlah mark aktif. */
export function triggerLabel(count: number): string {
  return count > 0 ? `Mark (${count})` : '+ Mark';
}

/** Signature ringkas untuk state diffing (urutan tetap). */
export function marksSignature(marks: string[]): string {
  return marks.slice().sort().join('|');
}

/** Baca mark aktif dari tombol lama pada satu baris. */
export function readRowMarks(row: HTMLTableRowElement, defs: MarkDef[] = MARK_DEFS): string[] {
  const out: string[] = [];
  for (const def of defs) {
    const btn = row.querySelector<HTMLElement>(def.button);
    if (!btn) continue;
    const attr = btn.getAttribute(def.stateAttr);
    if (attr === 'true' || btn.classList.contains('active')) out.push(def.key);
  }
  return out;
}

/** Label tombol tunggal di footer detail. */
export function detailTriggerLabel(count: number): string {
  return count > 0 ? `TANDAI (${count})` : 'TANDAI';
}

let started = false;

export function startMarkBar(enabledKeys: ReadonlySet<string>): void {
  if (started) return;
  const defs = activeMarkDefs(enabledKeys);
  if (!defs.length) return; // semua mark OFF — jangan injeks UI sama sekali
  started = true;
  injectCSS('ext-mark-bar-styles', CSS);

  // Jaring pengaman: core.ts sudah reload saat config berubah. Kalau pesannya
  // tak sampai ke tab ini, toggle OFF tetap segera berlaku di sini.
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.extensionConfig) {
        window.setTimeout(() => window.location.reload(), 300);
      }
    });
  } catch {
    /* MAIN world tanpa chrome — gate tetap jalan saat load */
  }

  const popover = document.createElement('div');
  popover.id = 'ext-shared-popover';
  popover.innerHTML = defs
    .map(
      (d) =>
        `<label class="ext-pop-item" data-ext-pop="${d.key}">` +
        `<input type="checkbox" value="${d.key}">` +
        `<span class="ext-pop-dot" data-type="${d.key}"></span>` +
        `<span>${d.label}</span></label>`,
    )
    .join('');
  document.body.appendChild(popover);

  const cache = new Map<string, string>();
  let activeRow: HTMLTableRowElement | null = null;
  let frame = 0;

  function rowId(row: HTMLTableRowElement): string {
    const known = row.getAttribute('data-ext-mark-row-id');
    if (known) return known;
    const btn = row.querySelector<HTMLElement>(defs.map((d) => d.button).join(','));
    if (!btn) return '';
    const attrs = [
      btn.getAttribute('data-ext-mk-id'),
      btn.getAttribute('data-ext-preop-btn'),
      btn.getAttribute('data-ext-telaah-btn'),
      btn.getAttribute('data-ext-partial-btn'),
    ];
    const id = attrs.find((x) => !!x) || '';
    if (id) row.setAttribute('data-ext-mark-row-id', id);
    return id;
  }

  /** Label tombol mengikuti jumlah mark aktif: "+ Mark" / "Mark (4)". */
  function updateTriggerBadge(row: HTMLTableRowElement, count: number): void {
    const btn = row.querySelector<HTMLButtonElement>('.ext-mark-trigger');
    if (!btn) return;
    const text = triggerLabel(count);
    if (btn.textContent !== text) btn.textContent = text;
    btn.classList.toggle('has-count', count > 0);
  }

  function paint(row: HTMLTableRowElement, marks: string[]): void {
    updateTriggerBadge(row, marks.length);
    const cell = badgeCellFor(row);
    if (!cell) return;
    let wrap = row.querySelector<HTMLElement>('.ext-chips-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'ext-chips-wrap';
      cell.appendChild(wrap);
    }
    const html = marks
      .map((key) => {
        const def = defs.find((d) => d.key === key);
        return def ? `<span class="ext-chip" data-type="${def.key}">${def.badge}</span>` : '';
      })
      .join('');
    if (wrap.innerHTML !== html) wrap.innerHTML = html;
    row.classList.toggle('ext-has-marks', marks.length > 0);
  }

  /** Diff + rAF: hanya baris yang benar-benar berubah yang disentuh. */
  function scan(): void {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      for (const row of document.querySelectorAll<HTMLTableRowElement>('table tbody tr')) {
        if (row.classList.contains('dataTables_empty')) continue;
        if (!hasLegacyMarkButton(row, defs)) continue; // kalender/datepicker & tabel lain
        const id = rowId(row);
        if (!id) continue; // baris klaim tanpa id_visit tak bisa disinkronkan
        const marks = readRowMarks(row, defs);
        ensureTrigger(row, id); // idempoten — tahan redraw DataTables
        if (cache.get(id) === marksSignature(marks)) continue;
        cache.set(id, marksSignature(marks));
        paint(row, marks);
      }
    });
  }

  function ensureTrigger(row: HTMLTableRowElement, id: string): void {
    const cell = row.cells[row.cells.length - 1];
    if (!cell || cell.querySelector('.ext-mark-trigger')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ext-mark-trigger';
    btn.textContent = '+ Mark';
    btn.setAttribute('data-ext-mark-trigger', id);
    cell.appendChild(btn);
  }

  function openPopover(row: HTMLTableRowElement, trigger: HTMLElement): void {
    activeRow = row;
    const marks = readRowMarks(row, defs);
    popover.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
      cb.checked = marks.includes(cb.value);
    });
    popover.classList.add('open');
    const rect = trigger.getBoundingClientRect();
    const width = popover.offsetWidth;
    const height = popover.offsetHeight;
    // Rata kanan dengan tombol → popover selalu membuka ke arah dalam (kiri).
    const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
    // Auto-flip ke atas bila sisa ruang bawah tidak cukup.
    const top =
      window.innerHeight - rect.bottom < height + 10
        ? Math.max(8, rect.top - height - 4)
        : rect.bottom + 4;
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  popover.addEventListener('change', (e) => {
    const cb = e.target as HTMLInputElement;
    if (!cb.matches('input[type="checkbox"]') || !activeRow) return;
    const def = defs.find((d) => d.key === cb.value);
    if (!def) return;
    const legacy = activeRow.querySelector<HTMLElement>(def.button);
    // Optimistic: chip langsung berubah; engine lama yang menangani POST.
    const marks = readRowMarks(activeRow, defs).filter((x) => x !== def.key);
    if (cb.checked) marks.push(def.key);
    cache.set(rowId(activeRow), marksSignature(marks));
    paint(activeRow, marks);
    if (legacy && !('disabled' in legacy && (legacy as HTMLButtonElement).disabled)) {
      (legacy as HTMLButtonElement).click();
    }
    activeRow.querySelector<HTMLButtonElement>('.ext-mark-trigger')?.focus();
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const trigger = target.closest<HTMLElement>('.ext-mark-trigger');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const row = trigger.closest('tr') as HTMLTableRowElement | null;
      if (row) openPopover(row, trigger);
      return;
    }
    if (!popover.contains(target)) {
      popover.classList.remove('open');
      activeRow = null;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popover.classList.remove('open');
      activeRow = null;
    }
  });

  scan();
  new MutationObserver(() => scan()).observe(document.body, { childList: true, subtree: true });
  window.setInterval(scan, 1000);
}

/* --- Detail M-KLAIM: 1 tombol TANDAI + popover ke atas ------------------ */

const DETAIL_CSS = `
body.ext-detail-marks button.ext-mk-btn.ext-mk-large,
body.ext-detail-marks button.ext-telaah-btn.ext-telaah-large,
body.ext-detail-marks button.ext-partial-btn.ext-partial-large,
body.ext-detail-marks button.ext-preop-btn.ext-preop-large { display:none !important; }
#ext-detail-mark-trigger {
  display:inline-flex;align-items:center;gap:5px;margin-left:8px;
  padding:6px 12px;font-size:14px;line-height:1.42857143;font-weight:600;
  color:#fff;background:#2193cf;border:1px solid #2193cf;border-radius:4px;
  cursor:pointer;vertical-align:middle;
}
#ext-detail-mark-trigger:hover { background:#1b7fb5;border-color:#1b7fb5; }
#ext-detail-popover {
  position:fixed;z-index:100000;width:190px;background:#fff;
  border:1px solid #cbd5e1;border-radius:6px;box-shadow:0 8px 20px rgba(15,23,42,.18);
  padding:6px;display:none;font-family:system-ui,-apple-system,sans-serif;
}
#ext-detail-popover.open { display:block; }
.ext-detail-pop-item {
  display:flex;align-items:center;gap:8px;padding:6px 7px;font-size:13px;
  color:#1e293b;border-radius:4px;cursor:pointer;user-select:none;
}
.ext-detail-pop-item:hover { background:#f1f5f9; }
`;

let detailStarted = false;

function readDetailMarks(defs: MarkDef[]): string[] {
  const out: string[] = [];
  for (const def of defs) {
    const btn = document.querySelector<HTMLElement>(def.button);
    if (!btn) continue;
    if (btn.getAttribute(def.stateAttr) === 'true' || btn.classList.contains('active'))
      out.push(def.key);
  }
  return out;
}

/**
 * Versi detail: tombol lama tetap dipakai engine masing-masing sebagai
 * backend (toggle + sinkron pusat), tapi disembunyikan. Satu tombol TANDAI
 * membuka popover ke atas berisi semua mark yang tersedia.
 */
export function startDetailMarkBar(enabledKeys: ReadonlySet<string>): void {
  if (detailStarted) return;
  const defs = activeMarkDefs(enabledKeys);
  if (!defs.length) return;
  detailStarted = true;
  document.body.classList.add('ext-detail-marks');
  injectCSS('ext-detail-mark-styles', DETAIL_CSS);

  const popover = document.createElement('div');
  popover.id = 'ext-detail-popover';
  popover.innerHTML = defs
    .map(
      (d) =>
        `<label class="ext-detail-pop-item" data-ext-pop="${d.key}">` +
        `<input type="checkbox" value="${d.key}">` +
        `<span class="ext-pop-dot" data-type="${d.key}"></span>` +
        `<span>${d.label}</span></label>`,
    )
    .join('');
  document.body.appendChild(popover);

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = 'ext-detail-mark-trigger';
  trigger.textContent = detailTriggerLabel(0);

  const mountTrigger = (): void => {
    if (trigger.isConnected) return;
    const legacy = document.querySelector<HTMLElement>(
      'button.ext-mk-btn.ext-mk-large, button.ext-telaah-btn.ext-telaah-large, button.ext-partial-btn.ext-partial-large, button.ext-preop-btn.ext-preop-large',
    );
    const host = legacy?.parentElement;
    if (host) host.appendChild(trigger);
  };
  mountTrigger();

  function paint(): void {
    const marks = readDetailMarks(defs);
    const text = detailTriggerLabel(marks.length);
    if (trigger.textContent !== text) trigger.textContent = text;
  }

  function open(): void {
    const marks = readDetailMarks(defs);
    popover.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
      cb.checked = marks.includes(cb.value);
    });
    popover.classList.add('open');
    const rect = trigger.getBoundingClientRect();
    const w = popover.offsetWidth;
    const h = popover.offsetHeight;
    popover.style.left = Math.max(8, Math.min(rect.right - w, window.innerWidth - w - 8)) + 'px';
    // Permintaan user: dropdown selalu membuka KE ATAS.
    popover.style.top = Math.max(8, rect.top - h - 6) + 'px';
  }

  popover.addEventListener('change', (e) => {
    const cb = e.target as HTMLInputElement;
    if (!cb.matches('input[type="checkbox"]')) return;
    const def = defs.find((d) => d.key === cb.value);
    if (!def) return;
    const legacy = document.querySelector<HTMLElement>(def.button);
    if (legacy && !(legacy instanceof HTMLButtonElement && legacy.disabled)) {
      (legacy as HTMLButtonElement).click();
    }
    window.setTimeout(paint, 50);
  });

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (popover.classList.contains('open')) popover.classList.remove('open');
    else open();
  });
  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target as Node) && e.target !== trigger)
      popover.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') popover.classList.remove('open');
  });

  paint();
  const observer = new MutationObserver(() => {
    mountTrigger();
    paint();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'data-ext-mk-marked',
      'data-ext-preop-marked',
      'data-ext-telaah-marked',
      'data-ext-partial-marked',
      'class',
    ],
  });
  const timer = window.setInterval(paint, 1000);
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    window.clearInterval(timer);
  });
}
