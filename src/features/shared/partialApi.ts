/**
 * partialApi — transport API penanda Pasien Partial (W-7.26).
 *
 * Konsep SAMA dengan telaahApi.ts / seksi Pre-op di casemixApi.ts
 * (tanpa auth, lintas-origin, fire-and-forget untuk toggle, batch untuk
 * pull). Memakai ulang primitif casemixApi (postFireForget/getJson/
 * normalizeIds + requestCentral di dalamnya).
 */
import { postFireForget, getJson, normalizeIds, type CentralPreOpMark } from './casemixApi.js';
import type { SyncRowInfo } from './casemixSync.js';

/** Bentuk mark partial di pusat — sama dengan pre-op (satu baris per id_visit). */
export type CentralPartialMark = CentralPreOpMark;

export function togglePartialCentral(
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
    '/api/casemix/partial-berkas/toggle',
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
export function partialInfoFromRow(info?: SyncRowInfo): {
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

export async function fetchPartialBatch(
  ids: Array<string | number>,
  fetcher: typeof fetch = fetch,
): Promise<Record<string, CentralPartialMark> | null> {
  const list = normalizeIds(ids);
  if (!list.length) return {};
  const j = await getJson<{ ok?: boolean; marks?: Record<string, CentralPartialMark> }>(
    '/api/casemix/partial-berkas/list?ids=' + encodeURIComponent(list.join(',')),
    fetcher,
  );
  if (j === null) return null; // jaringan gagal — bedakan dari "konfirmasi kosong"
  if (!j.ok || !j.marks) return {};
  return j.marks;
}
