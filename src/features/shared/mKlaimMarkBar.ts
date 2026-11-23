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
}

/** Urutan tampil chip & checkbox mengikuti urutan mark di permintaan. */
export const MARK_DEFS: MarkDef[] = [
  {
    key: 'labor',
    label: 'Labor',
    badge: 'LABOR',
    button: 'button.ext-mk-btn[data-ext-mk="labor"]',
    stateAttr: 'data-ext-mk-marked',
  },
  {
    key: 'radiologi',
    label: 'Radiologi',
    badge: 'RADIOLOGI',
    button: 'button.ext-mk-btn[data-ext-mk="radiologi"]',
    stateAttr: 'data-ext-mk-marked',
  },
  {
    key: 'batal-berobat',
    label: 'Batal Berobat',
    badge: 'BATAL BEROBAT',
    button: 'button.ext-mk-btn[data-ext-mk="batal-berobat"]',
    stateAttr: 'data-ext-mk-marked',
  },
  {
    key: 'pre-op',
    label: 'Pre-op',
    badge: 'PRE-OP',
    button: 'button.ext-preop-btn',
    stateAttr: 'data-ext-preop-marked',
  },
  {
    key: 'telaah',
    label: 'Telaah',
    badge: 'TELAAH',
    button: 'button.ext-telaah-btn',
    stateAttr: 'data-ext-telaah-marked',
  },
  {
    key: 'partial',
    label: 'Partial',
    badge: 'PARTIAL',
    button: 'button.ext-partial-btn',
    stateAttr: 'data-ext-partial-marked',
  },
];

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
  width:66px;height:26px;margin-left:4px;padding:0;
  font-size:11px;font-weight:600;color:#334155;background:#f8fafc;
  border:1px solid #cbd5e1;border-radius:4px;cursor:pointer;vertical-align:middle;
}
.ext-mark-trigger:hover { background:#e2e8f0; }
.ext-chips-wrap {
  display:flex;flex-wrap:wrap;gap:3px;margin-top:3px;
  contain:layout style;
}
.ext-chip {
  font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;
  letter-spacing:.2px;line-height:1.3;white-space:nowrap;
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
`;

/** Signature ringkas untuk state diffing (urutan tetap). */
export function marksSignature(marks: string[]): string {
  return marks.slice().sort().join('|');
}

/** Baca mark aktif dari tombol lama pada satu baris. */
export function readRowMarks(row: HTMLTableRowElement): string[] {
  const out: string[] = [];
  for (const def of MARK_DEFS) {
    const btn = row.querySelector<HTMLElement>(def.button);
    if (!btn) continue;
    const attr = btn.getAttribute(def.stateAttr);
    if (attr === 'true' || btn.classList.contains('active')) out.push(def.key);
  }
  return out;
}

let started = false;

export function startMarkBar(): void {
  if (started) return;
  started = true;
  injectCSS('ext-mark-bar-styles', CSS);

  const popover = document.createElement('div');
  popover.id = 'ext-shared-popover';
  popover.innerHTML = MARK_DEFS.map(
    (d) =>
      `<label class="ext-pop-item" data-ext-pop="${d.key}">` +
      `<input type="checkbox" value="${d.key}"><span>${d.label}</span></label>`,
  ).join('');
  document.body.appendChild(popover);

  const cache = new Map<string, string>();
  let activeRow: HTMLTableRowElement | null = null;
  let frame = 0;

  function rowId(row: HTMLTableRowElement): string {
    const known = row.getAttribute('data-ext-mark-row-id');
    if (known) return known;
    const btn = row.querySelector<HTMLElement>(MARK_DEFS.map((d) => d.button).join(','));
    const attrs = [
      btn?.getAttribute('data-ext-mk-id'),
      btn?.getAttribute('data-ext-preop-btn'),
      btn?.getAttribute('data-ext-telaah-btn'),
      btn?.getAttribute('data-ext-partial-btn'),
    ];
    const id = attrs.find((x) => !!x) || `${row.rowIndex}`;
    row.setAttribute('data-ext-mark-row-id', id);
    return id;
  }

  function paint(row: HTMLTableRowElement, marks: string[]): void {
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
        const def = MARK_DEFS.find((d) => d.key === key);
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
        const marks = readRowMarks(row);
        if (!marks.length && !row.querySelector('.ext-mark-trigger')) {
          // Baris tanpa mark apa pun tetap dapat trigger (mark bisa ditambah).
          const id = rowId(row);
          if (!id) continue;
        }
        const id = rowId(row);
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
    const marks = readRowMarks(row);
    popover.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
      cb.checked = marks.includes(cb.value);
    });
    popover.classList.add('open');
    const rect = trigger.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - 185);
    const below = rect.bottom + 4;
    popover.style.left = `${Math.max(4, left)}px`;
    popover.style.top =
      below + popover.offsetHeight > window.innerHeight
        ? `${Math.max(4, rect.top - popover.offsetHeight - 4)}px`
        : `${below}px`;
  }

  popover.addEventListener('change', (e) => {
    const cb = e.target as HTMLInputElement;
    if (!cb.matches('input[type="checkbox"]') || !activeRow) return;
    const def = MARK_DEFS.find((d) => d.key === cb.value);
    if (!def) return;
    const legacy = activeRow.querySelector<HTMLElement>(def.button);
    // Optimistic: chip langsung berubah; engine lama yang menangani POST.
    const marks = readRowMarks(activeRow).filter((x) => x !== def.key);
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
