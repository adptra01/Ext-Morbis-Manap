import { getMorbisGlobals } from './shared/types.js';
import { colors, injectCSS } from '../shared/ui/index.js';

const g = getMorbisGlobals();

const BACK_DETAIL_BTN = { text: 'Kembali ke Detail Klaim', bg: '#6366f1', hover: '#4f46e5' };

injectCSS(
  'ext-shortcut-styles',
  `@media print{[data-shortcut-buttons],[data-back-to-detail-klaim],[data-bpjs-revision-history],[data-bpjs-revision-history] textarea,.no-print,.hilang-saat-print{display:none!important;height:0!important;width:0!important;margin:0!important;padding:0!important;overflow:hidden!important;visibility:hidden!important;position:absolute!important;top:-9999px!important;left:-9999px!important;opacity:0!important}[data-shortcut-buttons] a,[data-shortcut-buttons] button,[data-back-to-detail-klaim] a,[data-back-to-detail-klaim] button{display:none!important}}
  [data-bpjs-revision-history] {
    display:flex; flex-direction:column; gap:8px; margin:0 0 12px; padding:12px 16px;
    background:${colors.card}; border:1px solid ${colors.border}; border-radius:8px;
    font-size:13px; color:${colors.foreground};
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-head {
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    font-weight:600;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-count {
    font-weight:500; color:${colors.mutedForeground}; font-size:12px;
  }
  [data-bpjs-revision-history] textarea {
    width:100%; min-height:84px; resize:vertical; padding:10px 12px;
    border:1px solid ${colors.input}; border-radius:6px; background:${colors.secondary};
    color:${colors.foreground}; font:inherit; line-height:1.5;
  }
  [data-bpjs-revision-history] .ext-bpjs-revision-hint {
    color:${colors.mutedForeground}; font-size:12px;
  }
  [data-back-to-detail-klaim] {
    display:inline-flex; align-items:center; padding:10px 14px; margin:12px;
    background:${colors.secondary}; border:1px solid ${colors.border}; border-radius:8px;
    position:fixed; top:100px; right:20px; z-index:9999;
  }
  [data-back-to-detail-klaim] a {
    display:inline-flex; align-items:center; justify-content:center;
    padding:8px 16px; background:${BACK_DETAIL_BTN.bg}; color:#fff; border:none;
    border-radius:6px; text-decoration:none; font-size:13px; font-weight:600;
    cursor:pointer; transition:all 0.2s; box-shadow:0 2px 4px rgba(0,0,0,0.2);
  }
  [data-back-to-detail-klaim] a:hover { background:${BACK_DETAIL_BTN.hover}; transform:translateY(-2px); box-shadow:0 4px 8px rgba(0,0,0,0.3); }
  [data-back-to-detail-klaim] a:active { transform:translateY(0); }
`,
);

function extractParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function isExecutionPage(): boolean {
  return (
    window.location.pathname.includes('/admisi/pelaksanaan_pelayanan/') ||
    window.location.pathname.includes('/admisi/detail-rawat-inap/')
  );
}

function formatDate(d: Date): string {
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('-');
}

function generateDetailUrl(idVisit: string): string {
  const ta =
    (document.getElementById('tanggalAwal') as HTMLInputElement)?.value || formatDate(new Date());
  const tAkhir =
    (document.getElementById('tanggalAkhir') as HTMLInputElement)?.value || formatDate(new Date());
  return `${window.location.origin}/v2/m-klaim/detail-v2-refaktor?id_visit=${idVisit}&tanggalAwal=${encodeURIComponent(ta)}&tanggalAkhir=${encodeURIComponent(tAkhir)}&norm=&nama=&reg=&billing=all&status=all&id_poli_cari=&poli_cari=`;
}

/* ── BPJS revision history (detail page) ── */

export interface BpjsRevision {
  idVisit: string;
  poli: string;
  idPoli: string;
  keterangan: string;
  submittedAt: number;
  status: 'pending' | 'saved';
}

const BPJS_REVISION_PANEL_SELECTOR = '[data-bpjs-revision-history]';
const BPJS_REVISION_TEXTAREA_ID = 'ext-bpjs-revision-history';
const BPJS_REVISION_COUNT_ID = 'ext-bpjs-revision-count';
const BPJS_REVISION_HISTORY_KEY = 'extBpjsRevisions';
const BPJS_REVISION_SUBMIT_PATH = '/v2/m-klaim/control/revisi';
const BPJS_REVISION_SUCCESS_WINDOW_MS = 180000;

let bpjsRevisions: BpjsRevision[] = [];
let pendingBpjsRevisions: BpjsRevision[] = [];
let bpjsRevisionObserver: MutationObserver | null = null;
let bpjsRevisionListenersInstalled = false;

export function bpjsRevisionKey(revision: Omit<BpjsRevision, 'status'>): string {
  return [
    revision.idVisit,
    revision.poli,
    revision.idPoli,
    revision.keterangan,
    String(revision.submittedAt),
  ].join('|');
}

export function isBpjsRevision(value: unknown): value is BpjsRevision {
  if (!value || typeof value !== 'object') return false;
  const revision = value as Record<string, unknown>;
  return (
    typeof revision.idVisit === 'string' &&
    typeof revision.poli === 'string' &&
    typeof revision.idPoli === 'string' &&
    typeof revision.keterangan === 'string' &&
    typeof revision.submittedAt === 'number' &&
    Number.isFinite(revision.submittedAt) &&
    (revision.status === 'pending' || revision.status === 'saved')
  );
}

export function mergeRevisionHistory(
  current: BpjsRevision[],
  incoming: BpjsRevision[],
): BpjsRevision[] {
  const seen = new Set(current.map((revision) => bpjsRevisionKey(revision)));
  const merged = [...current];
  for (const revision of incoming) {
    const key = bpjsRevisionKey(revision);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(revision);
    }
  }
  return merged;
}

export function readRevisionHistoryState(state: unknown): BpjsRevision[] {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return [];
  const revisions = (state as { [BPJS_REVISION_HISTORY_KEY]?: unknown })[BPJS_REVISION_HISTORY_KEY];
  if (!Array.isArray(revisions)) return [];
  return revisions.filter(isBpjsRevision);
}

export function withRevisionHistoryState(
  currentState: unknown,
  revisions: BpjsRevision[],
): Record<string, unknown> {
  const base =
    currentState && typeof currentState === 'object' && !Array.isArray(currentState)
      ? (currentState as Record<string, unknown>)
      : {};
  return {
    ...base,
    [BPJS_REVISION_HISTORY_KEY]: revisions.filter((revision) => revision.status === 'saved'),
  };
}

export function formatRevisionTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatBpjsRevisions(revisions: BpjsRevision[]): string {
  return revisions
    .map((revision, index) => {
      const state = revision.status === 'saved' ? 'tersimpan' : 'mengirim...';
      return [
        `Revisi ${index + 1} — ${formatRevisionTimestamp(revision.submittedAt)} (${state})`,
        `ID Visit: ${revision.idVisit || '-'}`,
        `Poli Tujuan: ${revision.poli || '-'}${revision.idPoli ? ` (ID ${revision.idPoli})` : ''}`,
        `Keterangan: ${revision.keterangan || '-'}`,
      ].join('\n');
    })
    .join('\n\n---\n\n');
}

function readRevisionHistory(): BpjsRevision[] {
  try {
    return readRevisionHistoryState(history.state);
  } catch {
    return [];
  }
}

function persistRevisionHistory(): void {
  try {
    history.replaceState(withRevisionHistoryState(history.state, bpjsRevisions), '');
  } catch {
    // History state is best-effort session continuity; the panel still shows new submissions.
  }
}

function queryRevisionPanel(): {
  panel: HTMLElement;
  textarea: HTMLTextAreaElement;
  count: HTMLElement;
} | null {
  const panel = document.querySelector<HTMLElement>(BPJS_REVISION_PANEL_SELECTOR);
  const textarea =
    panel?.querySelector<HTMLTextAreaElement>(`#${BPJS_REVISION_TEXTAREA_ID}`) ?? null;
  const count = panel?.querySelector<HTMLElement>(`#${BPJS_REVISION_COUNT_ID}`) ?? null;
  if (!panel || !textarea || !count) return null;
  return { panel, textarea, count };
}

function ensureRevisionPanel(toolbar: HTMLElement): HTMLTextAreaElement | null {
  const parent = toolbar.parentElement;
  if (!parent) return null;
  let found = queryRevisionPanel();
  if (found) return found.textarea;

  const panel = document.createElement('div');
  panel.setAttribute('data-bpjs-revision-history', 'true');

  const head = document.createElement('div');
  head.className = 'ext-bpjs-revision-head';

  const title = document.createElement('span');
  title.textContent = 'Riwayat Revisi BPJS';

  const count = document.createElement('span');
  count.id = BPJS_REVISION_COUNT_ID;
  count.className = 'ext-bpjs-revision-count';
  count.textContent = '0 revisi';

  const textarea = document.createElement('textarea');
  textarea.id = BPJS_REVISION_TEXTAREA_ID;
  textarea.readOnly = true;
  textarea.spellcheck = false;
  textarea.rows = 3;
  textarea.setAttribute('aria-label', 'Riwayat revisi BPJS');
  textarea.placeholder = 'Belum ada revisi BPJS yang dikirim pada tab ini.';

  const hint = document.createElement('div');
  hint.className = 'ext-bpjs-revision-hint';
  hint.textContent = 'Diambil dari poli dan keterangan yang dikirim lewat Revisi.';

  head.append(title, count);
  panel.append(head, textarea, hint);
  parent.insertBefore(panel, toolbar.nextSibling);
  found = queryRevisionPanel();
  return found?.textarea ?? null;
}

function renderRevisionHistory(): void {
  const found = queryRevisionPanel();
  if (!found) return;
  const value = formatBpjsRevisions(bpjsRevisions);
  found.textarea.value = value;
  found.textarea.rows = value ? Math.min(12, Math.max(5, value.split('\n').length + 1)) : 3;
  found.count.textContent = `${bpjsRevisions.length} revisi`;
}

function isRevisionForm(form: HTMLFormElement): boolean {
  if (form.id === 'form-add') return true;
  const action = form.getAttribute('action') || form.action || '';
  if (!action.includes(BPJS_REVISION_SUBMIT_PATH)) return false;
  try {
    return new URL(action, window.location.href).searchParams.get('sub') === 'simpan';
  } catch {
    return true;
  }
}

function readRevisionFromForm(form: HTMLFormElement): BpjsRevision | null {
  const poli =
    form.querySelector<HTMLInputElement>('#poli, input[name="poli"]')?.value.trim() ?? '';
  const idPoli =
    form.querySelector<HTMLInputElement>('#id_poli, input[name="id_poli"]')?.value.trim() ?? '';
  const keterangan =
    form
      .querySelector<HTMLTextAreaElement>('#keterangan, textarea[name="keterangan"]')
      ?.value.trim() ?? '';
  const idVisit =
    form.querySelector<HTMLInputElement>('input[name="id_visit"]')?.value.trim() ??
    extractParam('id_visit') ??
    '';
  if (!idPoli || !keterangan) return null;
  return { idVisit, poli, idPoli, keterangan, submittedAt: Date.now(), status: 'pending' };
}

function onRevisionSubmit(event: Event): void {
  const target = event.target as HTMLElement | null;
  const form = target?.closest?.('form');
  if (!(form instanceof HTMLFormElement) || !isRevisionForm(form)) return;
  const revision = readRevisionFromForm(form);
  if (!revision) {
    pendingBpjsRevisions = [];
    return;
  }
  pendingBpjsRevisions = [revision];
  bpjsRevisions = mergeRevisionHistory(bpjsRevisions, pendingBpjsRevisions);
  renderRevisionHistory();
}

let bpjsRevisionObserverTimer: number | null = null;

function scheduleBpjsRevisionCheck(): void {
  if (bpjsRevisionObserverTimer !== null) return;
  bpjsRevisionObserverTimer = window.setTimeout(() => {
    bpjsRevisionObserverTimer = null;
    onRevisionMutations();
  }, 200);
}

function onRevisionMutations(): void {
  // Tanpa submit in-flight, tidak ada yang perlu dikonfirmasi/dirender ulang:
  // init/submit handler sudah render awal. Mutasi lain (partial, toast lain) = skip.
  if (pendingBpjsRevisions.length === 0) {
    const toolbar = document.querySelector<HTMLElement>('[data-toolbar]');
    if (toolbar && !queryRevisionPanel()) ensureRevisionPanel(toolbar);
    return;
  }

  const now = Date.now();
  pendingBpjsRevisions = pendingBpjsRevisions.filter(
    (revision) => now - revision.submittedAt <= BPJS_REVISION_SUCCESS_WINDOW_MS,
  );
  if (pendingBpjsRevisions.length === 0) return;

  const failed = document.querySelector('.toast-error, .toast-warning');
  if (failed) {
    pendingBpjsRevisions = [];
    renderRevisionHistory();
    return;
  }
  if (!document.querySelector('.toast-success')) return;

  for (const revision of pendingBpjsRevisions) revision.status = 'saved';
  pendingBpjsRevisions = [];
  persistRevisionHistory();
  renderRevisionHistory();
}

export function initBpjsRevisionHistory(toolbar: HTMLElement | null): void {
  if (!toolbar) return;
  const restored = readRevisionHistory();
  bpjsRevisions = mergeRevisionHistory(bpjsRevisions, restored);
  ensureRevisionPanel(toolbar);
  renderRevisionHistory();
  if (bpjsRevisionListenersInstalled) return;
  document.addEventListener('submit', onRevisionSubmit, true);
  bpjsRevisionObserver = new MutationObserver(scheduleBpjsRevisionCheck);
  bpjsRevisionObserver.observe(document.body, { childList: true, subtree: true });
  bpjsRevisionListenersInstalled = true;
}

function renderBackToDetailButton(): void {
  if (!g.currentConfig?.features?.shortcutButtons?.enabled) return;
  if (!isExecutionPage() || document.querySelector('[data-back-to-detail-klaim]')) return;

  const idVisit = extractParam('id_visit') || extractParam('idVisit');
  if (!idVisit) return;

  const detailUrl = generateDetailUrl(idVisit);

  const container = document.createElement('div');
  container.dataset.backToDetailKlaim = 'true';

  const btn = document.createElement('a');
  btn.href = detailUrl;
  btn.textContent = BACK_DETAIL_BTN.text;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
    setTimeout(() => {
      window.location.href = detailUrl;
    }, 300);
  });

  container.appendChild(btn);
  document.body.appendChild(container);
}

function runWithObserver(fn: () => void, checkExist: () => boolean): void {
  if (document.readyState === 'complete') setTimeout(fn, 500);
  else window.addEventListener('load', () => setTimeout(fn, 500));
  const obs = new MutationObserver(() => {
    if (g.currentConfig?.features?.shortcutButtons?.enabled !== false && !checkExist()) fn();
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.shortcutButtons = {
    id: 'shortcutButtons',
    name: 'Kembali ke Detail Klaim',
    description: 'Tombol floating kembali ke halaman detail klaim dari halaman pelaksanaan',
    match: {
      oneOf: [
        { prefix: '/admisi/pelaksanaan_pelayanan/' },
        { prefix: '/admisi/detail-rawat-inap/' },
      ],
    },
    run: () => {
      runWithObserver(
        renderBackToDetailButton,
        () => !!document.querySelector('[data-back-to-detail-klaim]'),
      );
    },
  };
}
