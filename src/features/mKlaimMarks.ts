/**
 * mKlaimMarks — mark tambahan M-KLAIM (Labor, Radiologi, Batal Berobat).
 * Satu engine generik untuk 3 mark, masing-masing punya toggle config,
 * tombol + badge di list & footer detail, sinkron pusat lintas-PC.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { injectCSS } from '../shared/ui/index.js';
import { logUsage } from './shared/usageLog.js';
import { readPetugas } from './shared/resumeHistory.js';
import { runWhenIdle } from './shared/whenIdle.js';
import {
  loadMarkMap,
  setMark,
  removeMark,
  resolveMark,
  clearUnmark,
  collectStaleMark,
  forgetMarkCentral,
  type MarkMap,
} from './shared/markStorage.js';
import { toggleMarkCentral, fetchMarkBatch, type CentralMark } from './shared/markApi.js';
import {
  detailIdVisit,
  parseDetailPairs,
  collectDetailPairs,
  findDetailFooter,
} from './mKlaimTelaah.js';
import { extractPatientInfo, badgeCellFor, type PatientInfo } from './mKlaimPreOp.js';

const g = getMorbisGlobals();

interface MarkConfig {
  key: string;
  mark: string;
  label: string;
  badge: string;
  color: string;
  border: string;
  bg: string;
}

const CONFIGS: MarkConfig[] = [
  {
    key: 'laborMarker',
    mark: 'labor',
    label: 'Labor',
    badge: 'LABOR',
    color: '#15803d',
    border: '#86efac',
    bg: '#dcfce7',
  },
  {
    key: 'radiologiMarker',
    mark: 'radiologi',
    label: 'Radiologi',
    badge: 'RADIOLOGI',
    color: '#0f766e',
    border: '#5eead4',
    bg: '#ccfbf1',
  },
  {
    key: 'batalBerobatMarker',
    mark: 'batal-berobat',
    label: 'Batal Berobat',
    badge: 'BATAL BEROBAT',
    color: '#b91c1c',
    border: '#fca5a5',
    bg: '#fee2e2',
  },
];

let cssInjected = false;
function ensureCss(): void {
  if (cssInjected) return;
  cssInjected = true;
  const rgba = (hex: string, a: number): string =>
    `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${a})`;
  const rules = CONFIGS.map(
    (c) => `
    .ext-mk-btn[data-ext-mk="${c.mark}"].active {
      background:${c.color} !important;border-color:${c.color} !important;color:#ffffff !important;
      font-weight:700;box-shadow:0 2px 6px ${rgba(c.color, 0.35)};
    }
    .ext-mk-btn[data-ext-mk="${c.mark}"].active:hover {
      background:${c.color} !important;border-color:${c.color} !important;
    }
    /* Footer detail: ukuran Bootstrap seperti Telaah/Partial, warna khas mark. */
    .ext-mk-btn.ext-mk-large[data-ext-mk="${c.mark}"] {
      display:inline-block;margin-left:8px;padding:6px 12px;
      font-size:14px;line-height:1.42857143;border-radius:4px;font-weight:600;
      background:${c.color} !important;border-color:${c.color} !important;color:#ffffff !important;
    }
    .ext-mk-btn.ext-mk-large[data-ext-mk="${c.mark}"]:hover {
      background:${c.color} !important;border-color:${c.color} !important;opacity:.9;
      transform:none;
    }
    .ext-mk-btn.ext-mk-large[data-ext-mk="${c.mark}"].active {
      box-shadow:0 2px 6px ${rgba(c.color, 0.45)};font-weight:700;
    }
    .ext-mk-badge[data-ext-mk="${c.mark}"] { background:${c.bg}; color:${c.color}; border-color:${c.border}; }
    tr[data-ext-mk-marked="${c.mark}=true"] { box-shadow: inset 3px 0 0 ${c.color} !important; }
  `,
  ).join('');
  injectCSS(
    'ext-marks-styles',
    `@media print { .ext-mk-btn, .ext-mk-badge { display:none !important; } }
    /* Sama persis dengan tombol kecil Pre-op / Verif / Telaah / Detail. */
    .ext-mk-btn {
      display:inline-flex;align-items:center;justify-content:center;padding:3px 8px;
      font-size:11px;font-weight:600;line-height:1.4;border-radius:6px;border:1px solid #cbd5e1;
      background:#f8fafc;color:#475569;cursor:pointer;transition:all .15s ease;
      margin-left:4px;vertical-align:middle;user-select:none;text-decoration:none !important;
    }
    .ext-mk-btn:hover { background:#f1f5f9;border-color:#94a3b8;color:#1e293b;transform:translateY(-1px); }
    .ext-mk-btn:disabled { opacity:.65;cursor:wait;transform:none; }
    .ext-mk-btn.pending { border-style:dashed;animation:ext-mk-pulse 1s ease-in-out infinite; }
    @keyframes ext-mk-pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
    .ext-mk-badge {
      display:inline-block;padding:2px 6px;font-size:10px;font-weight:700;line-height:1.2;
      border-radius:4px;border:1px solid #cbd5e1;margin-left:6px;vertical-align:middle;
    }
    ${rules}`,
  );
}

interface Runtime {
  cfg: MarkConfig;
  central: Record<string, CentralMark> | null;
  centralAt: number;
  pending: Set<string>;
  observer: MutationObserver | null;
  interval: number | null;
  booted: boolean;
  scanning: boolean;
}

const runtimes: Record<string, Runtime> = {};

function effective(rt: Runtime, id: string, local: MarkMap): boolean {
  const centralHas = rt.central ? !!rt.central[id] : null;
  return resolveMark(rt.cfg.mark, id, id in local, centralHas);
}

function extractId(row: HTMLTableRowElement): string | null {
  const m =
    row.innerHTML.match(/detail[^(]*\(\s*['"]?(\d+)/i) ||
    row.innerHTML.match(/id_visit=(\d+)/) ||
    row.getAttribute('data-id-visit')?.match(/(\d+)/);
  return m ? m[1] : null;
}

function paintButton(rt: Runtime, btn: HTMLButtonElement, marked: boolean, busy: boolean): void {
  const { cfg } = rt;
  btn.disabled = busy;
  btn.classList.toggle('pending', busy);
  const text = busy ? '⏳ Menyimpan…' : marked ? '✓ ' + cfg.label : cfg.label;
  if (btn.textContent !== text) btn.textContent = text;
  const title = busy
    ? 'Menyimpan ke server pusat…'
    : marked
      ? `Ditandai sebagai ${cfg.label} (klik untuk batalkan)`
      : `Tandai pasien sebagai ${cfg.label}`;
  if (btn.title !== title) btn.title = title;
  const want = String(marked);
  if (btn.getAttribute('data-ext-mk-marked') !== want) btn.setAttribute('data-ext-mk-marked', want);
  btn.classList.toggle('active', marked);
}

function paintBadge(rt: Runtime, row: HTMLTableRowElement, marked: boolean): void {
  const { cfg } = rt;
  row.setAttribute('data-ext-mk-marked', cfg.mark + '=' + String(marked));
  let badge = row.querySelector<HTMLElement>(`.ext-mk-badge[data-ext-mk="${cfg.mark}"]`);
  if (marked) {
    const cell = badgeCellFor(row);
    if (!cell) return;
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'ext-mk-badge';
      badge.setAttribute('data-ext-mk', cfg.mark);
      badge.textContent = cfg.badge;
    }
    if (badge.parentElement !== cell) cell.appendChild(badge);
  } else {
    badge?.remove();
  }
}

function ensureButton(rt: Runtime, row: HTMLTableRowElement, id: string): HTMLButtonElement | null {
  let btn = row.querySelector<HTMLButtonElement>(`button.ext-mk-btn[data-ext-mk="${rt.cfg.mark}"]`);
  if (btn) return btn;
  btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ext-mk-btn';
  btn.setAttribute('data-ext-mk', rt.cfg.mark);
  btn.setAttribute('data-ext-mk-id', id);
  const anchor =
    row.querySelector('[data-ext-partial-btn]') ??
    row.querySelector('[data-ext-telaah-btn]') ??
    row.querySelector('[data-ext-preop-btn]');
  if (anchor?.parentNode) anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  else row.querySelector('td:last-child')?.appendChild(btn);
  return btn;
}

function toggle(rt: Runtime, id: string, btn: HTMLButtonElement, info?: PatientInfo): void {
  if (rt.pending.has(id) || btn.disabled) return;
  const local = loadMarkMap(rt.cfg.mark);
  const next = !effective(rt, id, local);
  if (next) {
    setMark(rt.cfg.mark, id);
    clearUnmark(rt.cfg.mark, id);
  } else {
    removeMark(rt.cfg.mark, id);
  }
  const row = btn.closest('tr') as HTMLTableRowElement | null;
  paintButton(rt, btn, next, true);
  if (row) paintBadge(rt, row, next);
  rt.pending.add(id);
  const settle = (): void => {
    rt.pending.delete(id);
    try {
      paintButton(rt, btn, effective(rt, id, loadMarkMap(rt.cfg.mark)), false);
    } catch {
      /* DOM hilang */
    }
  };
  const payload = {
    norm: info?.norm,
    nama: info?.nama,
    noReg: info?.noReg,
    user: readPetugas(),
    visitDatetime: info?.visitDatetime,
    poli: info?.poli,
  };
  try {
    void toggleMarkCentral(rt.cfg.mark, id, next, payload).then(settle, settle);
  } catch {
    settle();
  }
  window.setTimeout(() => {
    if (rt.pending.has(id)) settle();
  }, 10000);
  void logUsage(rt.cfg.key, next ? 'mark' : 'unmark', true, { idVisit: id });
}

function scanList(rt: Runtime): void {
  if (rt.scanning) return;
  rt.scanning = true;
  try {
    const local = loadMarkMap(rt.cfg.mark);
    for (const table of document.querySelectorAll<HTMLTableElement>('table')) {
      for (const row of table.querySelectorAll<HTMLTableRowElement>('tbody tr')) {
        if (row.classList.contains('dataTables_empty')) continue;
        const id = extractId(row);
        if (!id) continue;
        const btn = ensureButton(rt, row, id);
        if (!btn) continue;
        if (btn.getAttribute('data-ext-mk-id') !== id) btn.setAttribute('data-ext-mk-id', id);
        if (!btn.dataset.bound) {
          btn.dataset.bound = '1';
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              toggle(rt, id, btn, extractPatientInfo(row));
            } catch {
              toggle(rt, id, btn);
            }
          });
        }
        const marked = effective(rt, id, local);
        if (rt.pending.has(id)) paintButton(rt, btn, marked, true);
        else if (btn.getAttribute('data-ext-mk-marked') !== String(marked)) {
          paintButton(rt, btn, marked, false);
          paintBadge(rt, row, marked);
        }
      }
    }
  } finally {
    rt.scanning = false;
  }
}

function refreshCentral(rt: Runtime): void {
  const now = Date.now();
  if (rt.central && now - rt.centralAt < 15000) return;
  rt.centralAt = now;
  const ids: string[] = [];
  for (const row of document.querySelectorAll<HTMLTableRowElement>('table tbody tr')) {
    const id = extractId(row);
    if (id) ids.push(id);
  }
  if (!ids.length) return;
  void fetchMarkBatch(rt.cfg.mark, ids).then((marks) => {
    if (!marks) return;
    rt.central = marks;
    const local = loadMarkMap(rt.cfg.mark);
    for (const id of collectStaleMark(local, (x) => !!marks[x])) forgetMarkCentral(rt.cfg.mark, id);
    scanList(rt);
  });
}

function scanDetail(rt: Runtime): void {
  const id = detailIdVisit(window.location.search);
  if (!id) return;
  const domId = 'ext-mk-detail-' + rt.cfg.mark;
  if (document.getElementById(domId)) return;
  const footer = findDetailFooter(document);
  if (!footer) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  // Footer detail: samakan ukuranBootstrap dengan tombol Telaah/Partial
  // (btn btn-primary), tapi warna khas tiap mark lewat .ext-mk-large.
  btn.className = 'btn btn-primary ext-mk-btn ext-mk-large';
  btn.id = domId;
  btn.setAttribute('data-ext-mk', rt.cfg.mark);
  const last = Array.from(
    footer.querySelectorAll<HTMLElement>(
      'button, a.btn, input[type="button"], input[type="submit"]',
    ),
  ).pop();
  if (last?.parentNode === footer) footer.insertBefore(btn, last.nextSibling);
  else footer.appendChild(btn);
  paintButton(rt, btn, effective(rt, id, loadMarkMap(rt.cfg.mark)), false);
  void fetchMarkBatch(rt.cfg.mark, [id]).then((marks) => {
    if (!marks) return;
    rt.central = marks;
    rt.centralAt = Date.now();
    if (marks[id] && !(id in loadMarkMap(rt.cfg.mark)))
      setMark(rt.cfg.mark, id, undefined, Date.now(), true);
    if (!rt.pending.has(id))
      paintButton(rt, btn, effective(rt, id, loadMarkMap(rt.cfg.mark)), false);
  });
  btn.addEventListener('click', () => {
    const info = parseDetailPairs(collectDetailPairs(document));
    const marked = effective(rt, id, loadMarkMap(rt.cfg.mark));
    const who = info.nama?.trim() || `kunjungan ID ${id}`;
    const ok = window.confirm(
      marked
        ? `Batalkan tanda ${rt.cfg.label} untuk ${who}?`
        : `Tandai ${rt.cfg.label} untuk ${who}?`,
    );
    if (ok) toggle(rt, id, btn, info);
  });
}

function start(rt: Runtime): void {
  ensureCss();
  const detail = (window.location.pathname || '').includes('/detail');
  rt.observer = new MutationObserver(() => {
    window.setTimeout(() => (detail ? scanDetail(rt) : scanList(rt)), 100);
  });
  rt.observer.observe(document.body, { childList: true, subtree: true });
  runWhenIdle(() => {
    rt.booted = true;
    if (detail) scanDetail(rt);
    else {
      scanList(rt);
      refreshCentral(rt);
    }
    rt.interval = window.setInterval(() => {
      if (detail) scanDetail(rt);
      else {
        scanList(rt);
        refreshCentral(rt);
      }
    }, 1500);
  });
  window.addEventListener('pagehide', () => {
    rt.observer?.disconnect();
    if (rt.interval !== null) window.clearInterval(rt.interval);
  });
}

for (const cfg of CONFIGS) {
  runtimes[cfg.key] = {
    cfg,
    central: null,
    centralAt: 0,
    pending: new Set(),
    observer: null,
    interval: null,
    booted: false,
    scanning: false,
  };
  if (typeof g.featureModules !== 'undefined') {
    g.featureModules[cfg.key] = {
      id: cfg.key,
      name: cfg.label + ' Marker (M-KLAIM)',
      description: `Tandai pasien ${cfg.label} di list + footer detail klaim, sinkron lintas-PC`,
      match: {
        oneOf: [
          { pathname: '/v2/m-klaim' },
          { pathname: '/v2/m-klaim/' },
          { pathname: '/v2/m-klaim/index' },
          { prefix: '/v2/m-klaim/detail' },
        ],
      },
      run: () => start(runtimes[cfg.key]),
    };
  }
  whenFeatureEnabled(cfg.key, () => {
    if (!(window.location?.pathname ?? '').startsWith('/v2/m-klaim')) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => start(runtimes[cfg.key]));
    } else {
      start(runtimes[cfg.key]);
    }
  });
}
