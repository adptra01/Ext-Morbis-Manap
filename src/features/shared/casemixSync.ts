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
  /** Waktu kunjungan pasien (format ISO: YYYY-MM-DD HH:MM:SS).
   *  Diambil dari kolom "Tanggal Kunjungan" endpoint M-KLAIM.
   *  Opsional — server yang belum punya kolom abaikan. */
  visitDatetime?: string;
  /** Unit/poli pasien (mis. KLINIK MATA) dari kolom "Unit".
   *  Opsional — server yang belum punya kolom abaikan. */
  poli?: string;
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
  /**
   * Cari identitas (norm/nama/no_reg) untuk id yang barisnya TIDAK ada di
   * DOM — mis. di halaman DataTables lain atau di luar filter tanggal.
   * Dipanggil sekali setelah pull. Gagal/melempar → diabaikan (sinkron
   * tetap jalan seperti biasa, hanya tanpa identitas tambahan).
   */
  resolveIdentity?(ids: string[]): Promise<SyncRow[]>;
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

/**
 * Perbaiki identitas warisan versi lama sebelum diunggah (terakhir kali).
 * Pola salah mapping ekstraktor lama yang diketahui: angka 6–10 digit
 * murni (format norm: 00050927, 2609280034) tersimpan di `noReg` —
 * kembalikan ke `norm` bila `norm` kosong. Murni, unit-tested.
 */
export function repairLegacyInfo(stored?: {
  norm?: string;
  nama?: string;
  noReg?: string;
}): SyncRowInfo | undefined {
  if (!stored) return undefined;
  const clean = (v: unknown): string | undefined => {
    const t = String(v ?? '').trim();
    return t === '' ? undefined : t;
  };
  let norm = clean(stored.norm);
  const nama = clean(stored.nama);
  let noReg = clean(stored.noReg);
  if (norm === undefined && noReg !== undefined && /^\d{6,10}$/.test(noReg)) {
    norm = noReg;
    noReg = undefined;
  }
  if (norm === undefined && nama === undefined && noReg === undefined) return undefined;
  return { norm, nama, noReg };
}

/**
 * Gabung identitas baris terlihat (segar, berbasis header — utama) dengan
 * warisan versi lama (cadangan). Kembalikan undefined bila tak ada apa pun.
 * visitDatetime hanya datang dari baris terlihat/endpoint (storage lokal
 * tidak menyimpannya) — wajib diteruskan agar push Sinkron melengkapi
 * kolom Waktu Kunjungan di laporan, bukan hanya norm/nama/no_reg.
 */
export function mergePushInfo(
  visibleInfo: SyncRowInfo | undefined,
  storedItem?: { norm?: string; nama?: string; noReg?: string },
): SyncRowInfo | undefined {
  const legacy = repairLegacyInfo(storedItem);
  const merged: SyncRowInfo = {
    norm: visibleInfo?.norm ?? legacy?.norm,
    nama: visibleInfo?.nama ?? legacy?.nama,
    noReg: visibleInfo?.noReg ?? legacy?.noReg,
    visitDatetime: visibleInfo?.visitDatetime,
    poli: visibleInfo?.poli,
  };
  return infoPresent(merged) ? merged : undefined;
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

  // 1b. Identitas untuk id yang tak terlihat di DOM: tabel M-KLAIM hanya
  //     merender halaman aktif, jadi tanpa ini id lain terkirim hanya-id
  //     dan baris laporan tetap kosong. Hanya id yang ditandai dan belum
  //     lengkap di pusat yang dicari — lengkap = norm+nama+no_reg DAN
  //     visit_datetime (kolom Waktu Kunjungan) DAN poli (kolom Poli);
  //     baris beridentitas tapi visit_datetime/poli-nya null TETAP dicari
  //     supaya Sinkron melengkapi semua field, bukan hanya identitas).
  if (deps.resolveIdentity) {
    const need = new Set<string>();
    const centralComplete = (id: string): boolean => {
      const m = central[id];
      return !!(m && m.norm && m.nama && m.no_reg && m.visit_datetime && m.poli);
    };
    for (const id of new Set([...Object.keys(local), ...Object.keys(central)])) {
      if (infoPresent(visible.get(id))) continue;
      if (centralComplete(id)) continue;
      if (!isMarked(id)) continue;
      need.add(id);
    }
    if (need.size > 0) {
      try {
        const extra = await deps.resolveIdentity([...need].slice(0, 500));
        for (const r of extra ?? []) {
          if (r?.idVisit && infoPresent(r.info) && !infoPresent(visible.get(r.idVisit))) {
            visible.set(r.idVisit, r.info);
          }
        }
      } catch {
        /* pencarian identitas gagal — lanjut tanpa */
      }
    }
  }

  // 2. Push semua id lokal — identitas dari baris terlihat (segar) atau
  //    warisan versi lama (diperbaiki) bila baris tak terlihat. Server
  //    mempertahankan field yang tak dikirim (W-7.20), jadi id-only aman.
  const pushOk: string[] = [];
  for (const id of Object.keys(local)) {
    try {
      if (await deps.postToggle(id, true, mergePushInfo(visible.get(id), local[id]))) {
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
