/**
 * casemixSync — sinkronisasi dua arah Pre-op eksplisit (push + pull).
 *
 * Latar: backfill diam-diam (30 dtk) hanya mengunggah id + marked, dan
 * refresh diam-diam (15 dtk) hanya menarik untuk baris terlihat. Fungsi
 * `syncCasemixNow` di sini melakukan keduanya SEKALIGUS secara eksplisit
 * (dipicu tombol "Sinkron" di halaman M-KLAIM):
 *
 *  1. PULL dulu: ambil tanda pusat untuk semua id relevan (lokal + terlihat)
 *     supaya tahu mana yang ditandai PC lain.
 *  2. PUSH: unggah semua id lokal (dengan identitas bila barisnya terlihat
 *     di halaman ini; id-only bila tidak — server mempertahankan identitas
 *     yang sudah ada, W-7.20).
 *  3. ENRICH: baris terlihat yang marked (lokal/efektif) tapi belum tentu
 *     beridentitas di pusat → kirim ulang + identitas penuh. Ini yang
 *     memperbaiki baris laporan yang kosong (—) dari sapuan lama.
 *  4. PULL-merge: tanda pusat yang belum ada lokal disimpan lokal
 *     (menghormati unmark segar) → komputer ini ikut "get data dari pusat".
 *
 * Murni + dependensi injeksi → unit-testable penuh di env node (tanpa DOM).
 * Lapisan DOM (kumpul baris terlihat, tombol, toast) ada di mKlaimPreOp.ts.
 */
import { resolvePreOpMarked, type PreOpMap } from './preOpStorage.js';
import type { CentralPreOpMark } from './casemixApi.js';

export interface SyncRowInfo {
  norm?: string;
  nama?: string;
  noReg?: string;
  user?: string;
}

export interface SyncRow {
  idVisit: string;
  info: SyncRowInfo;
}

export interface SyncFetchResult {
  ok: boolean;
  marks: Record<string, CentralPreOpMark>;
}

export interface SyncDeps {
  loadLocal(): PreOpMap;
  readUnmarks(): Record<string, number>;
  postToggle(idVisit: string, marked: boolean, info?: SyncRowInfo): Promise<boolean>;
  fetchMarks(ids: string[]): Promise<SyncFetchResult>;
  /** Discovery: semua tanda pusat rentang terakhir (tanpa harus tahu id). */
  fetchRecent(): Promise<SyncFetchResult>;
  saveMark(idVisit: string): void;
  /** Watermark id yang sudah terkirim (opsional — bila tak ada, pending = semua id lokal). */
  readMigrated?(): string[];
  /**
   * Tandai id-id sebagai sudah terkirim. HANYA dipanggil untuk id lokal
   * yang sukses di-push — JANGAN untuk id hasil enrich/pull yang bukan
   * anggota map lokal, supaya sapuan unmark backfill tidak mengirim
   * marked:false untuk tanda milik PC lain.
   */
  markMigrated?(ids: string[]): void;
  now?: number;
}

export interface SyncCounts {
  pushed: number;
  enriched: number;
  pulled: number;
  /** Id lokal yang BELUM terkirim saat sinkron dimulai (untuk badge tombol). */
  pending: number;
  offline: boolean;
}

function infoPresent(info: SyncRowInfo | undefined): info is SyncRowInfo {
  return !!info && (info.norm !== undefined || info.nama !== undefined || info.noReg !== undefined);
}

export async function syncCasemixNow(rows: SyncRow[], deps: SyncDeps): Promise<SyncCounts> {
  const now = deps.now ?? Date.now();
  const visible = new Map<string, SyncRowInfo>();
  for (const r of rows) {
    if (r.idVisit && !visible.has(r.idVisit)) visible.set(r.idVisit, r.info ?? {});
  }
  const local = deps.loadLocal();
  const unmarks = deps.readUnmarks();
  let pushed = 0;
  let enriched = 0;
  let pulled = 0;
  let offline = false;

  // 0. Hitung yang belum terkirim (untuk badge tombol): id lokal yang
  //    belum ada di watermark migrated.
  let pending = 0;
  try {
    const done = new Set(deps.readMigrated?.() ?? []);
    for (const id of Object.keys(local)) {
      if (!done.has(id)) pending++;
    }
  } catch {
    pending = Object.keys(local).length;
  }

  // 1. Pull dulu (acuan langkah enrich + merge): batch id yang dikenal
  //    + discovery rentang terakhir (tanda PC lain yang id-nya tak dikenal).
  let central: Record<string, CentralPreOpMark> = {};
  const ids = [...new Set([...Object.keys(local), ...visible.keys()])];
  if (ids.length > 0) {
    try {
      const res = await deps.fetchMarks(ids);
      if (res.ok) {
        central = res.marks ?? {};
      } else {
        offline = true;
      }
    } catch {
      offline = true;
    }
  }
  try {
    const recent = await deps.fetchRecent();
    if (recent.ok) {
      central = { ...(recent.marks ?? {}), ...central };
    } else {
      offline = true;
    }
  } catch {
    offline = true;
  }

  const centralHas = (id: string): boolean | null =>
    offline && !(id in central) ? null : id in central;
  const isMarked = (id: string): boolean =>
    resolvePreOpMarked(id in local, centralHas(id), unmarks[id], now);

  // 2. Push semua id lokal (identitas bila barisnya terlihat).
  const pushOk: string[] = [];
  for (const id of Object.keys(local)) {
    try {
      if (await deps.postToggle(id, true, visible.get(id))) {
        pushed++;
        pushOk.push(id);
      } else {
        offline = true;
      }
    } catch {
      offline = true;
    }
  }
  // Majukan watermark migrated HANYA untuk id lokal yang sukses — supaya
  // badge "belum terkirim" turun dan backfill tak mengulang. Id hasil
  // enrich/pull yang bukan anggota map lokal SENGAJA tak ditandai (lihat
  // kontrak markMigrated di atas).
  if (pushOk.length > 0) {
    try {
      deps.markMigrated?.(pushOk);
    } catch {
      /* watermark gagal disimpan — backfill mencoba lagi nanti */
    }
  }

  // 3. Enrich: baris terlihat yang marked tapi belum di-push beridentitas.
  for (const [id, info] of visible) {
    if (id in local && infoPresent(info)) continue; // sudah terkirim + identitas di langkah 2
    if (!isMarked(id)) continue;
    if (!infoPresent(info)) continue; // tak ada identitas → id-only tak mengubah apa pun
    try {
      if (await deps.postToggle(id, true, info)) {
        enriched++;
      } else {
        offline = true;
      }
    } catch {
      offline = true;
    }
  }

  // 4. Pull-merge ke lokal (hormati unmark segar).
  for (const id of Object.keys(central)) {
    if (id in local) continue;
    if (!resolvePreOpMarked(false, true, unmarks[id], now)) continue;
    try {
      deps.saveMark(id);
      pulled++;
    } catch {
      /* storage penuh — lewati */
    }
  }

  return { pushed, enriched, pulled, pending, offline };
}
