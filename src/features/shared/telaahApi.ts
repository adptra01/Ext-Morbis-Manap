/**
 * telaahApi — transport API penanda Telaah Berkas (W-7.24).
 *
 * Konsep SAMA dengan seksi Pre-op di casemixApi.ts (tanpa auth,
 * lintas-origin, fire-and-forget untuk toggle, batch untuk pull).
 * Memakai ulang primitif casemixApi (postFireForget/getJson/normalizeIds
 * + requestCentral di dalamnya: kill-switch PHI + fallback base sehat).
 */
import { postFireForget, getJson, normalizeIds, type CentralPreOpMark } from './casemixApi.js';
import type { SyncRowInfo } from './casemixSync.js';

/** Bentuk mark telaah di pusat — sama dengan pre-op (satu baris per id_visit). */
export type CentralTelaahMark = CentralPreOpMark;

export function toggleTelaahCentral(
  idVisit: string,
  marked: boolean,
  info: {
    norm?: string;
    nama?: string;
    noReg?: string;
    user?: string;
    visitDatetime?: string;
    poli?: string;
  } = {},
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (!idVisit) return Promise.resolve();
  return postFireForget(
    '/api/casemix/telaah-berkas/toggle',
    {
      id_visit: idVisit,
      marked,
      // Field SELALU dikirim bila diketahui; server hanya menimpa yang
      // non-null — kiriman sebagian/gagal TIDAK menghapus data baik.
      norm: info.norm ?? null,
      nama: info.nama ?? null,
      no_reg: info.noReg ?? null,
      user: info.user ?? null,
      visit_datetime: info.visitDatetime ?? null,
      poli: info.poli ?? null,
    },
    fetcher,
  );
}

/** Payload SyncRowInfo → bentuk info toggle (dipakai sync/backfill). */
export function telaahInfoFromRow(info?: SyncRowInfo): {
  norm?: string;
  nama?: string;
  noReg?: string;
  user?: string;
  visitDatetime?: string;
  poli?: string;
} {
  return {
    norm: info?.norm,
    nama: info?.nama,
    noReg: info?.noReg,
    user: info?.user,
    visitDatetime: info?.visitDatetime,
    poli: info?.poli,
  };
}

async function getJsonTelaah<T>(path: string, fetcher: typeof fetch): Promise<T | null> {
  return getJson<T>(path, fetcher);
}

export async function fetchTelaahBatch(
  ids: Array<string | number>,
  fetcher: typeof fetch = fetch,
): Promise<Record<string, CentralTelaahMark> | null> {
  const list = normalizeIds(ids);
  if (!list.length) return {};
  const j = await getJsonTelaah<{ ok?: boolean; marks?: Record<string, CentralTelaahMark> }>(
    '/api/casemix/telaah-berkas/list?ids=' + encodeURIComponent(list.join(',')),
    fetcher,
  );
  if (j === null) return null; // jaringan gagal — bedakan dari "konfirmasi kosong"
  if (!j.ok || !j.marks) return {};
  return j.marks;
}

/**
 * Semua tanda Telaah rentang N hari terakhir (discovery untuk pull:
 * menemukan tanda PC lain TANPA harus tahu id-nya dulu).
 */
export async function fetchTelaahRecent(
  daysBack = 30,
  fetcher: typeof fetch = fetch,
): Promise<Record<string, CentralTelaahMark> | null> {
  const end = new Date();
  const start = new Date(end.getTime() - Math.max(1, daysBack) * 24 * 60 * 60 * 1000);
  const fmt = (d: Date): string =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const j = await getJsonTelaah<{
    ok?: boolean;
    data?: Array<CentralTelaahMark & { id_visit?: string }>;
  }>(
    '/api/casemix/telaah-berkas/export?tanggalAwal=' +
      encodeURIComponent(fmt(start)) +
      '&tanggalAkhir=' +
      encodeURIComponent(fmt(end)),
    fetcher,
  );
  if (j === null) return null;
  if (!j.ok || !Array.isArray(j.data)) return {};
  const out: Record<string, CentralTelaahMark> = {};
  for (const r of j.data) {
    const id = String(r?.id_visit ?? '').trim();
    if (id) out[id] = r;
  }
  return out;
}
