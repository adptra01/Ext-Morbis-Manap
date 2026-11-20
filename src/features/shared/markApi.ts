/**
 * markApi — klien HTTP generik untuk mark M-KLAIM tambahan. Endpoint
 * memakai slug mark: /api/casemix/mark/{mark}/{toggle|list|export}.
 */
import { getJson, normalizeIds, postFireForget, type CentralPreOpMark } from './casemixApi.js';

export type CentralMark = CentralPreOpMark;

export interface MarkInfo {
  norm?: string;
  nama?: string;
  noReg?: string;
  user?: string;
  visitDatetime?: string;
  poli?: string;
}

const base = (mark: string): string => '/api/casemix/mark/' + encodeURIComponent(mark);

export function toggleMarkCentral(
  mark: string,
  idVisit: string,
  marked: boolean,
  info: MarkInfo = {},
): Promise<void> {
  return postFireForget(base(mark) + '/toggle', {
    id_visit: idVisit,
    marked,
    norm: info.norm ?? null,
    nama: info.nama ?? null,
    no_reg: info.noReg ?? null,
    user: info.user ?? null,
    visit_datetime: info.visitDatetime ?? null,
    poli: info.poli ?? null,
  });
}

export async function fetchMarkBatch(
  mark: string,
  ids: string[],
): Promise<Record<string, CentralMark> | null> {
  const q = normalizeIds(ids).join(',');
  if (!q) return {};
  const res = await getJson<{ ok?: boolean; marks?: Record<string, CentralMark> }>(
    base(mark) + '/list?ids=' + encodeURIComponent(q),
  );
  return res && res.ok !== false ? (res.marks ?? {}) : null;
}

export async function fetchMarkRecent(
  mark: string,
  daysBack: number,
): Promise<Record<string, CentralMark> | null> {
  const end = new Date();
  const start = new Date(end.getTime() - daysBack * 86400000);
  const fmt = (d: Date): string => d.toISOString().slice(0, 10);
  const res = await getJson<{ ok?: boolean; marks?: Record<string, CentralMark> }>(
    base(mark) + '/export?tanggalAwal=' + fmt(start) + '&tanggalAkhir=' + fmt(end),
  );
  return res && res.ok !== false ? (res.marks ?? {}) : null;
}
