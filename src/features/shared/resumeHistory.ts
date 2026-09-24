/**
 * Riwayat Resume — modul bersama antara form native MORBIS (Ranap & Rajal)
 * dan modal React di M-KLAIM (resumeTab / resumeRanapTab).
 *
 * Menyimpan snapshot SEBELUM + SESUDAH tiap simpan, nama user (petugas),
 * lalu sinkron fire-and-forget ke endpoint Reports SIMRS.
 *
 * Catatan arsitektur:
 * - Key storage tipe-aware: `ext_rv_history_ri_<id_visit>` (ranap) dan
 *   `ext_rv_history_rj_<id_visit>` (rajal). Key lama `ext_rv_history_<id_visit>`
 *   (tanpa tipe) di-migrasi saat dibaca untuk ranap.
 * - Modul murni (tanpa DOM) untuk diff/key/storage → di-unit-test.
 *   UI (openHistoryModal/showHistToast/readPetugas) butuh DOM, tidak di-test.
 */

export type FormSnap = Record<string, string | string[]>;
export type TipeResume = 'ranap' | 'rajal';

export interface ResumeHistoryEntry {
  at: number;
  aksi: 'buat' | 'ubah';
  id_resume: string;
  user: string;
  tipe: TipeResume;
  before: FormSnap;
  after: FormSnap;
  changed: string[];
  /** ID unik per entri (anti-dobel saat kirim ulang outbox).
   *  Opsional agar data lama + test literal lama tetap valid. */
  client_id?: string;
}

/** ID unik klien untuk dedup sisi server bila pengiriman terulang. */
export function newClientId(): string {
  try {
    const c = globalThis.crypto as undefined | { randomUUID?: () => string };
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  } catch {
    /* ignore */
  }
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

/** Storage minimal (localStorage pinggir: Map buat test). */
export type KVStore = { getItem(k: string): string | null; setItem(k: string, v: string): void };

function defaultStore(): KVStore | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    /* ignore */
  }
  return null;
}

const HIST_PREFIX = 'ext_rv_history_';
const LEGACY_HIST_PREFIX = HIST_PREFIX; // `ext_rv_history_<id>` (tanpa tipe, ranap dulu)
const LAST_PREFIX = 'ext_rv_lastform_';
/** Watermark outbox per kunci history: `at` terbesar yang SUDAH tembus ke
 *  pusat. Dipakai backfill (casemixBackfill) + postToReports langsung —
 *  satu mekanisme, dua penulis, tanpa dobel-kirim. */
export const RV_MIGRATED_PREFIX = 'ext_migrated_rv_';
const MAX_ENTRIES = 50;

export function getHistoryKey(idVisit: string, tipe: TipeResume): string {
  return `${HIST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
}

export function getLastKey(idVisit: string, tipe: TipeResume): string {
  return `${LAST_PREFIX}${tipe === 'ranap' ? 'ri' : 'rj'}_${idVisit || 'unknown'}`;
}

function readJson<T>(store: KVStore | null, key: string): T | null {
  if (!store) return null;
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(store: KVStore | null, key: string, value: unknown): void {
  if (!store) return;
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode */
  }
}

/* ── Pure helpers (unit-tested) ── */

export function sameSnapVal(
  a: string | string[] | undefined,
  b: string | string[] | undefined,
): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

export function diffSnap(before: FormSnap, after: FormSnap): string[] {
  const keys: Record<string, boolean> = {};
  Object.keys(before).forEach((k) => (keys[k] = true));
  Object.keys(after).forEach((k) => (keys[k] = true));
  return Object.keys(keys).filter((k) => !sameSnapVal(before[k], after[k]));
}

export function shortSnapVal(v: string | string[] | undefined): string {
  const s = v === undefined ? '-' : JSON.stringify(v);
  return s.length > 60 ? s.slice(0, 60) + '…' : s;
}

/* ── Storage (localStorage, tipe-aware, legacy migration) ── */

export function loadHistory(
  idVisit: string,
  tipe: TipeResume,
  store: KVStore | null = defaultStore(),
): ResumeHistoryEntry[] {
  const arr = readJson<ResumeHistoryEntry[]>(store, getHistoryKey(idVisit, tipe));
  const list = Array.isArray(arr) ? arr : [];

  // Migrasi key lama `ext_rv_history_<id>` (ranap, sebelum tipe ada)
  if (tipe === 'ranap') {
    const legacy = readJson<Partial<ResumeHistoryEntry>[]>(store, LEGACY_HIST_PREFIX + idVisit);
    if (Array.isArray(legacy) && legacy.length > 0 && list.length === 0) {
      const migrated = legacy.map((e) => ({ ...e, tipe: 'ranap' as const }));
      saveHistory(migrated as ResumeHistoryEntry[], idVisit, 'ranap', store);
      return migrated as ResumeHistoryEntry[];
    }
  }
  return list;
}

export function saveHistory(
  list: ResumeHistoryEntry[],
  idVisit: string,
  tipe: TipeResume,
  store: KVStore | null = defaultStore(),
): void {
  writeJson(store, getHistoryKey(idVisit, tipe), list.slice(-MAX_ENTRIES));
}

export function loadLast(
  idVisit: string,
  tipe: TipeResume,
  store: KVStore | null = defaultStore(),
): FormSnap | null {
  const snap = readJson<FormSnap>(store, getLastKey(idVisit, tipe));
  if (snap) return snap;
  // Baseline lama (sebelum key tipe-aware) untuk ranap
  if (tipe === 'ranap') return readJson<FormSnap>(store, LAST_PREFIX + idVisit);
  return null;
}

export function storeLast(
  snap: FormSnap,
  idVisit: string,
  tipe: TipeResume,
  store: KVStore | null = defaultStore(),
): void {
  writeJson(store, getLastKey(idVisit, tipe), snap);
}

/* ── User (petugas) detection ── */

/**
 * Ambil nama user yang login dari #userpanel MORBIS (`<li id="userpanel">`),
 * tersedia di semua halaman MORBIS (form Ranap/Rajal maupun M-KLAIM):
 *   Username → `mbi` + Role → `Admin` → hasil `mbi (Admin)`.
 * Fallback: selector umum, nama dokter dari form, lalu `id_user`.
 */
export function readPetugas(): string {
  try {
    const panel = document.getElementById('userpanel');
    if (panel) {
      let username = '';
      let role = '';
      panel.querySelectorAll('.subgroup').forEach((sg) => {
        const title = (sg.querySelector('.subtitle')?.textContent || '').trim().toLowerCase();
        const content = (sg.querySelector('.subcontent')?.textContent || '').trim();
        if (title === 'username' && content) username = content;
        if (title === 'role' && content) role = content;
      });
      if (username) return `${username}${role ? ` (${role})` : ''}`;
      const a = panel.querySelector('a');
      const t = (a?.textContent || '').trim();
      if (t && t !== 'Petugas Rumah Sakit') return t;
    }

    const el = document.querySelector('#petugas, .petugas, .username, #username, .user-name');
    const t = (el?.textContent || '').trim();
    if (t) return t.slice(0, 80);

    const dokter = document
      .querySelector<HTMLInputElement>('input[name="dokter"], #dokter, input[name="nama_dokter"]')
      ?.value?.trim();
    if (dokter) return dokter.slice(0, 80);

    const idUser = document
      .querySelector<HTMLInputElement>('input[name="id_user"], #id_user')
      ?.value?.trim();
    if (idUser) return `User #${idUser}`;
  } catch {
    /* ignore */
  }
  return 'petugas';
}

/* ── Sinkronisasi Reports SIMRS (outbox: lokal dulu, kirim belakang) ── */

import {
  resolveCasemixBase,
  fetchResumeCentral,
  casemixTransportBlockReason,
  type CentralResumeEntry,
} from './casemixApi.js';

const REPORTS_API_PATH = '/api/reports/resume-history';

export function resolveReportsBase(): string {
  return resolveCasemixBase();
}

/** Kunci watermark outbox untuk satu kunci history lokal. */
export function getMigratedKey(historyKey: string): string {
  return RV_MIGRATED_PREFIX + historyKey;
}

function readMarker(store: KVStore | null, key: string): number {
  if (!store) return 0;
  try {
    const raw = store.getItem(key);
    if (raw === null) return 0;
    const n = Number(JSON.parse(raw));
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/** Maju watermark bila entri ini lebih baru dari yang sudah tembus. */
export function advanceMigratedMarker(
  store: KVStore | null,
  idVisit: string,
  tipe: TipeResume,
  at: number,
): void {
  if (!store || !idVisit) return;
  try {
    const key = getMigratedKey(getHistoryKey(idVisit, tipe));
    if (at > readMarker(store, key)) writeJson(store, key, at);
  } catch {
    /* ignore */
  }
}

export function postToReports(
  entry: ResumeHistoryEntry,
  idVisit: string,
  fetcher: typeof fetch = fetch,
  store: KVStore | null = defaultStore(),
  tipe: TipeResume = entry.tipe,
): Promise<boolean> {
  const payload = {
    client_id: entry.client_id ?? null,
    id_visit: idVisit,
    id_resume: entry.id_resume,
    aksi: entry.aksi,
    tipe: entry.tipe,
    waktu: new Date(entry.at).toISOString(),
    user: entry.user,
    before: entry.before,
    after: entry.after,
    changed: entry.changed,
  };
  const send = async (): Promise<boolean> => {
    try {
      const base = resolveReportsBase();
      // Kill switch PHI (lihat casemixApi): base http: → fail fast TANPA
      // mengirim snapshot resume (anamnesa/diagnosa/terapi) lewat plaintext.
      const locked = casemixTransportBlockReason(base);
      if (locked) {
        console.warn('[resumeHistory]', locked, '— kirim resume dilewati:', idVisit);
        return false;
      }
      const res = await fetcher(base + REPORTS_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'omit',
      });
      if (!res.ok) return false;
      // Tembus → majukan watermark agar backfill tak kirim ulang.
      advanceMigratedMarker(store, idVisit, tipe, entry.at);
      return true;
    } catch {
      /* endpoint Reports belum ada / offline — riwayat lokal tetap aman,
       * backfill 30 dtk akan coba lagi (watermark belum maju) */
      return false;
    }
  };
  try {
    return send();
  } catch {
    return Promise.resolve(false);
  }
}

/* ── Catat history (dedup dobel-klik) ── */

let _lastLogHash: string | null = null;
let _lastLogAt = 0;

export interface LogResumeOpts {
  idVisit: string;
  idResume: string;
  tipe: TipeResume;
  aksi: 'buat' | 'ubah';
  before: FormSnap;
  after: FormSnap;
  now?: number;
  user?: string;
  store?: KVStore | null;
  fetcher?: typeof fetch;
}

export function logResumeHistory(opts: LogResumeOpts): ResumeHistoryEntry | null {
  // Tanpa id_visit entri tak bisa ditautkan ke kunjungan: riwayat lokal
  // akan tercampur di bucket 'unknown' dan terkirim ke pusat dengan
  // id_visit kosong. Tolak diam-diam (submit asli pemanggil tetap jalan).
  if (!opts.idVisit) return null;
  const now = opts.now ?? Date.now();
  // Simpan terlebih dahulu snapshot "last form" sebelum cek dedup,
  // agar tetap tersimpan meskipun entri log ini di-dedup.
  const store = opts.store ?? defaultStore();
  storeLast(opts.after, opts.idVisit, opts.tipe, store);
  // Dedup dobel-klik per kunjungan: hash menyertakan idVisit + aksi agar
  // save beruntun dua kunjungan berbeda dengan isi sama tidak saling
  // menghapus (kunjungan kedua tetap tercatat).
  const hash = JSON.stringify([opts.idVisit, opts.aksi, opts.after]);
  if (_lastLogHash === hash && now - _lastLogAt < 5000) return null; // dobel-klik
  _lastLogHash = hash;
  _lastLogAt = now;

  const entry: ResumeHistoryEntry = {
    at: now,
    aksi: opts.aksi,
    id_resume: opts.idResume ?? '',
    user: opts.user ?? readPetugas(),
    tipe: opts.tipe,
    before: opts.before ?? {},
    after: opts.after,
    changed: diffSnap(opts.before ?? {}, opts.after),
    client_id: newClientId(),
  };
  const list = loadHistory(opts.idVisit, opts.tipe, store);
  list.push(entry);
  saveHistory(list, opts.idVisit, opts.tipe, store);
  storeLast(opts.after, opts.idVisit, opts.tipe, store);
  // Outbox: lokal SUDAH tersimpan sinkron di atas; kirim ke pusat di
  // belakang layar tanpa menahan UI. Gagal → watermark tak maju →
  // backfill 30 dtk mengulang sampai tembus (client_id cegah dobel).
  try {
    void postToReports(entry, opts.idVisit, opts.fetcher ?? fetch, store, opts.tipe);
  } catch {
    /* ignore — backfill yang urus */
  }
  return entry;
}

/* ── Toast ── */

export function showHistToast(msg: string): void {
  try {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText =
      'position:fixed;top:20px;right:20px;z-index:2147483647;padding:14px 18px;border-radius:8px;' +
      'background:#dcfce7;color:#065f46;border-left:5px solid #16a34a;font-weight:600;' +
      'font-size:16px!important;line-height:1.6!important;font-family:' +
      HIST_FONT +
      '!important;box-shadow:0 4px 16px rgba(0,0,0,.15);max-width:420px;';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  } catch {
    /* ignore */
  }
}

/* ── Read-back pusat: riwayat antar-PC/akun ── */

function coerceSnapVal(v: unknown): string | string[] | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) {
    return v.map((x) => {
      if (typeof x === 'string') return x;
      try {
        return JSON.stringify(x) ?? '';
      } catch {
        return '';
      }
    });
  }
  try {
    const s = JSON.stringify(v);
    return s ?? '';
  } catch {
    return '';
  }
}

function coerceSnap(rec: Record<string, unknown> | null | undefined): FormSnap {
  const out: FormSnap = {};
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return out;
  for (const k of Object.keys(rec)) {
    const c = coerceSnapVal(rec[k]);
    if (c !== undefined) out[k] = c;
  }
  return out;
}

/** Baris pusat → entri lokal (null bila tak bisa dipakai). */
export function centralToResumeEntry(
  r: CentralResumeEntry,
  fallbackTipe: TipeResume,
): ResumeHistoryEntry | null {
  try {
    if (!r || typeof r !== 'object') return null;
    const at = r.waktu ? Date.parse(r.waktu) : NaN;
    if (!Number.isFinite(at)) return null;
    const after = coerceSnap(r.after);
    const before = coerceSnap(r.before);
    const tipe: TipeResume =
      r.tipe === 'rajal' ? 'rajal' : r.tipe === 'ranap' ? 'ranap' : fallbackTipe;
    const changed = Array.isArray(r.changed)
      ? r.changed.filter((x): x is string => typeof x === 'string')
      : diffSnap(before, after);
    const cid = typeof r.client_id === 'string' && r.client_id ? r.client_id : undefined;
    return {
      at,
      aksi: r.aksi === 'buat' ? 'buat' : 'ubah',
      id_resume: typeof r.id_resume === 'string' ? r.id_resume : '',
      user: typeof r.user === 'string' && r.user ? r.user : 'petugas',
      tipe,
      before,
      after,
      changed,
      ...(cid ? { client_id: cid } : {}),
    };
  } catch {
    return null;
  }
}

function centralEntryKey(e: ResumeHistoryEntry): string {
  if (e.client_id) return 'cid:' + e.client_id;
  try {
    return 'h:' + e.at + '|' + e.user + '|' + e.aksi + '|' + JSON.stringify(e.after);
  } catch {
    return 'h:' + e.at + '|' + e.user + '|' + e.aksi;
  }
}

/** Gabung entri pusat ke daftar lokal: dedup (client_id dulu), urut waktu,
 *  cap 50. Murni (unit-tested) — tanpa DOM/jaringan. */
export function mergeCentralResumeEntries(
  local: ResumeHistoryEntry[],
  incoming: ResumeHistoryEntry[],
): ResumeHistoryEntry[] {
  const seen = new Set(local.map(centralEntryKey));
  const out = local.slice();
  for (const e of incoming) {
    const k = centralEntryKey(e);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  out.sort((a, b) => a.at - b.at);
  return out.slice(-MAX_ENTRIES);
}

/* ── Modal Riwayat (dipakai form native & modal React) ── */

// Light-DOM (tidak terlindung shadow): paksa font Roboto eksplisit agar
// tidak mewarisi font halaman host (mis. Open Sans) — native <button>
// tidak inherit font dari parent.
const HIST_FONT = `'Roboto','Segoe UI',system-ui,-apple-system,Arial,sans-serif`;

export interface OpenHistoryOpts {
  idVisit: string;
  tipe: TipeResume;
  title?: string;
  /** Dipanggil saat user klik "Salin ke Form" — isi form / state React. */
  onApply: (snap: FormSnap) => void;
  /** Overlay z-index: form native 99998, modal React di atasnya (2147483647). */
  zIndex?: number;
  store?: KVStore | null;
}

export function openHistoryModal(opts: OpenHistoryOpts): void {
  try {
    document.querySelector('#ext-rv-history-overlay')?.remove();
  } catch {
    /* ignore */
  }
  const store = opts.store ?? defaultStore();
  // Tampil SEGERA dari lokal (instan, offline-proof); entri pusat menyusul
  // di belakang layar lalu digabung — pola sama seperti revisi BPJS.
  let list = loadHistory(opts.idVisit, opts.tipe, store).slice().reverse();
  const z = opts.zIndex ?? 99998;

  const ov = document.createElement('div');
  ov.id = 'ext-rv-history-overlay';
  ov.style.cssText =
    `position:fixed;inset:0;z-index:${z};background:rgba(15,23,42,.55);` +
    'display:flex;align-items:center;justify-content:center;padding:24px;';
  ov.addEventListener('click', function (e) {
    if (e.target === ov) ov.remove();
  });

  const box = document.createElement('div');
  box.style.cssText =
    'background:#fff;border-radius:12px;max-width:680px;width:100%;max-height:82vh;' +
    'display:flex;flex-direction:column;overflow:hidden;font-size:16px!important;line-height:1.6!important;' +
    'color:#1c2530;font-family:' +
    HIST_FONT +
    '!important;';
  ov.appendChild(box);

  const head = document.createElement('div');
  head.style.cssText =
    'display:flex;align-items:center;justify-content:space-between;' +
    'padding:14px 18px;border-bottom:1px solid #d0d5dd;font-weight:700;';
  const headTitle = document.createElement('span');
  headTitle.textContent = `${opts.title ?? 'Riwayat Resume'} (${list.length})`;
  head.appendChild(headTitle);
  const x = document.createElement('button');
  x.type = 'button';
  x.textContent = '×';
  x.style.cssText =
    'border:none;background:#f8fafc;width:32px;height:32px;border-radius:50%;' +
    'font-family:inherit!important;font-size:16px!important;line-height:1!important;cursor:pointer;';
  x.onclick = function () {
    ov.remove();
  };
  head.appendChild(x);
  box.appendChild(head);

  const body = document.createElement('div');
  body.style.cssText = 'padding:14px 18px;overflow-y:auto;';
  box.appendChild(body);

  // Gambar ulang isi dari daftar (terbaru dulu). Dipanggil sekali untuk
  // lokal + sekali lagi bila entri pusat tiba menyusul.
  const paint = (rows: ResumeHistoryEntry[]): void => {
    list = rows;
    headTitle.textContent = `${opts.title ?? 'Riwayat Resume'} (${list.length})`;
    body.replaceChildren();
    if (!list.length) {
      body.textContent =
        'Belum ada riwayat untuk kunjungan ini. Riwayat tercatat otomatis setiap kali Simpan ditekan.';
      return;
    }

    list.forEach(function (entry, idx) {
      const no = list.length - idx;
      const row = document.createElement('div');
      row.style.cssText =
        'border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;margin-bottom:10px;';

      const title = document.createElement('div');
      title.style.fontWeight = '600';
      const who = entry.user ? ` — oleh ${entry.user}` : '';
      title.textContent =
        `#${no} — ${new Date(entry.at).toLocaleString('id-ID')} — ` +
        `${entry.aksi === 'buat' ? 'Buat baru' : 'Ubah'}${who} — ` +
        `${entry.changed.length} field berubah`;
      row.appendChild(title);

      const detail = document.createElement('div');
      detail.style.cssText =
        'display:none;margin-top:8px;background:#f8fafc;border-radius:6px;padding:8px 10px;' +
        'font-size:13px;line-height:1.6;max-height:180px;overflow-y:auto;white-space:pre-wrap;';
      if (!entry.changed.length) {
        detail.textContent = 'Tidak ada perbedaan field.';
      } else {
        detail.textContent = entry.changed
          .map(function (k) {
            return k + ': ' + shortSnapVal(entry.before[k]) + ' → ' + shortSnapVal(entry.after[k]);
          })
          .join('\n');
      }
      row.appendChild(detail);

      const bar = document.createElement('div');
      bar.style.cssText = 'margin-top:8px;display:flex;gap:8px;';

      const btnLihat = document.createElement('button');
      btnLihat.type = 'button';
      btnLihat.textContent = 'Lihat';
      btnLihat.style.cssText =
        'border:1px solid #cbd5e1;background:#fff;border-radius:6px;padding:6px 12px;cursor:pointer;' +
        'font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;';
      btnLihat.onclick = function () {
        detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
      };
      bar.appendChild(btnLihat);

      const btnSalin = document.createElement('button');
      btnSalin.type = 'button';
      btnSalin.textContent = 'Salin ke Form';
      btnSalin.style.cssText =
        'background:#00875a;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;' +
        'font-family:inherit!important;font-size:inherit!important;line-height:inherit!important;';
      btnSalin.onclick = function () {
        try {
          opts.onApply(entry.after);
          ov.remove();
        } catch {
          /* biarkan modal terbuka bila apply gagal */
        }
      };
      bar.appendChild(btnSalin);
      row.appendChild(bar);

      body.appendChild(row);
    });
  };

  paint(list);

  try {
    document.body.appendChild(ov);
  } catch {
    /* ignore */
  }

  // Read-through pusat: riwayat dari PC/akun lain ikut tampil tanpa reload.
  // Diam bila offline (daftar lokal tetap tampil) atau modal sudah ditutup.
  if (opts.idVisit) {
    // Kill switch PHI (lihat casemixApi): base http: → tidak fetch riwayat
    // pusat sama sekali; tampilkan catatan ramah di modal, riwayat lokal tetap.
    const locked = casemixTransportBlockReason();
    if (locked) {
      try {
        const note = document.createElement('div');
        note.textContent = locked + ' — riwayat hanya dari PC ini.';
        note.style.cssText =
          'margin-top:10px;padding:8px 10px;background:#fef3c7;color:#92400e;' +
          'border-radius:6px;font-size:13px;line-height:1.5;';
        body.appendChild(note);
      } catch {
        /* ignore */
      }
    } else {
      try {
        void fetchResumeCentral(opts.idVisit, opts.tipe).then((central) => {
          try {
            if (!central.length || !ov.isConnected) return;
            const incoming: ResumeHistoryEntry[] = [];
            for (const r of central) {
              const e = centralToResumeEntry(r, opts.tipe);
              if (e) incoming.push(e);
            }
            if (!incoming.length) return;
            const base = loadHistory(opts.idVisit, opts.tipe, store);
            const merged = mergeCentralResumeEntries(base, incoming);
            if (merged.length === base.length) return; // tak ada yang baru
            saveHistory(merged, opts.idVisit, opts.tipe, store);
            paint(merged.slice().reverse());
            // Kabari tombol Riwayat (validator) agar counter ikut mutakhir.
            try {
              document.dispatchEvent(
                new CustomEvent('ext-rv-history-merged', {
                  detail: { idVisit: opts.idVisit, tipe: opts.tipe, count: merged.length },
                }),
              );
            } catch {
              /* ignore */
            }
          } catch {
            /* ignore */
          }
        });
      } catch {
        /* ignore */
      }
    }
  }
}
