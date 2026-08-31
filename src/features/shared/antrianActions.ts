/**
 * antrianActions — aksi antrian farmasi yang HOST-agnostik (bisa dipakai dari
 * halaman mana pun: detail penerimaan resep, detail penjualan resep-edit, dll).
 *
 * Yang TIDAK ada di sini: injeksi DOM (target host beda-beda) — itu tetap
 * per-fituran (lihat farmasiAntrolShift / penjualanResepAntrian).
 *
 * API app = source of truth nomor T-XX/R-XX; extension hanya menangkap.
 */
import {
  pushQueueEvent,
  queueEventId,
  probeFarmasiAppBase,
  type QueueEventPayload,
} from './farmasiQueueSync';
import { printKartuAntrian } from './printKartu';

export const ANTRL_URL = '/v2/antrol/search';
export const ANTRL_SUB = 'sub=update_v2';
export const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';

/** Baca field dari DOM. Host inject reader yg tahu struktur halamannya. */
export interface AntrianFieldReader {
  /** Baca hidden input by id, fallback by name. */
  get: (id: string, fallbackName?: string) => string;
  /** Nama pasien (UPPERCASE). */
  namaPasien: () => string;
  /** Tanggal lahir. */
  tglLahir: () => string;
}

/** Cek ke App Antrian: resep sudah di-antri hari ini? Return info/nomor atau null. */
export async function lookupAntrian(
  resepId: string,
): Promise<{ queue_number: string; status: string } | null> {
  try {
    const res = await fetch(
      (await probeFarmasiAppBase()) + '/api/queue/lookup?resep_id=' + encodeURIComponent(resepId),
      { cache: 'no-store', credentials: 'omit' },
    );
    if (!res.ok) return null;
    const j = (await res.json()) as {
      ok?: boolean;
      found?: boolean;
      queue?: { queue_number?: string; status?: string };
    };
    if (!j.ok || !j.found || !j.queue?.queue_number) return null;
    return { queue_number: j.queue.queue_number, status: j.queue.status ?? '' };
  } catch {
    return null; // app tidak terjangkau — biarkan tombol normal
  }
}

/** Coba SEMUA kandidat id resep — id bisa beda antar halaman utk resep sama. */
export async function lookupAntrianAny(
  reader: AntrianFieldReader,
): Promise<{ queue_number: string; status: string } | null> {
  const candidates = [
    reader.get('id_resep') || '',
    reader.get('id_resep', 'nomor_resep') || '',
    new URLSearchParams(location.search).get('id') ?? '',
  ].filter((v) => v && v.length >= 3);
  for (const c of candidates) {
    const info = await lookupAntrian(c);
    if (info) return info;
  }
  return null;
}

/** Deteksi resep dibatalkan di MORBIS (badge/teks status) atau antrian DIBATALKAN. */
export function isResepBatal(antrianStatus?: string): boolean {
  if (antrianStatus === 'DIBATALKAN') return true;
  try {
    const area = document.querySelector('#isi, .card, .panel, .form-horizontal, form, table');
    const root = area || document.body;
    const nodes = root.querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
    for (const el of nodes) {
      const t = (el.textContent || '').trim();
      if (!/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(t)) continue;
      if (el.closest('button, input, a')) continue;
      return true;
    }
  } catch {
    /* DOM belum siap */
  }
  return false;
}

/** POST antrol MORBIS (taskid=6) supaya resep tercatat di antrian MORBIS juga. */
export async function registerAntrian(idVisit: string): Promise<boolean> {
  return fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
    credentials: 'include',
  })
    .then((r) => {
      console.log('[MORBIS Ext] antrian terdaftar id=' + idVisit, 'status', r.status);
      return true;
    })
    .catch((e) => {
      console.warn('[MORBIS Ext] gagal mendaftarkan antrian', e);
      return false;
    });
}

/** Cari baris antrian via check_antrian (ID_PASIEN + WAKTU_PENGAJUAN). */
export async function resolveAntrianRow(
  idPasien: string,
  waktu: string,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(LIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<Record<string, unknown>>;
    if (!Array.isArray(rows)) return null;
    const w = String(waktu ?? '').slice(0, 16);
    return (
      rows.find(
        (r) =>
          String(r.ID_PASIEN ?? '') === String(idPasien) &&
          (!w || String(r.WAKTU ?? '').slice(0, 16) === w),
      ) ??
      rows.find((r) => String(r.ID_PASIEN ?? '') === String(idPasien)) ??
      null
    );
  } catch {
    return null;
  }
}

/** Alur "antrikan resep": antrol → resolve row → ENQUEUE → cetak kartu → code.
 *  Kembalikan nomor antrian (code) utk renderActionBar; throw bila gagal. */
export async function antrikanResep(
  idVisit: string,
  nomorResep: string,
  jenis: 'racik' | 'tunggal',
  reader: AntrianFieldReader,
): Promise<string> {
  const ok = await registerAntrian(idVisit);
  if (!ok) throw new Error('gagal antrol MORBIS');

  const idPasien =
    reader.get('id_pasien') || new URLSearchParams(location.search).get('norm') || '';
  const waktu = reader.get('waktu_pengajuan');
  const nama = reader.namaPasien();
  const jenisLabel = jenis === 'racik' ? 'racikan' : 'tunggal';

  const rowPromise = (async (): Promise<Record<string, unknown> | null> => {
    for (let i = 0; i < 3; i++) {
      const r = await resolveAntrianRow(idPasien, waktu);
      if (r) return r;
      await new Promise((r2) => setTimeout(r2, 200));
    }
    return null;
  })();

  const syncPromise = pushQueueEvent({
    event_id:
      queueEventId('enq', idVisit, idVisit + '-' + jenisLabel) + '-' + Date.now().toString(36),
    event: 'ENQUEUE',
    resep_id: nomorResep,
    nama_pasien: nama,
    norm: idPasien || undefined,
    tgl_lahir: reader.tglLahir() || undefined,
    shift: '',
    jenis: jenisLabel,
    counter: '',
    payload: { idVisit, unit: '', waktu: waktu || '' },
  });

  const [row, sync] = await Promise.all([rowPromise, syncPromise]);
  if (!sync.ok) throw new Error('gagal terhubung App Antrian');
  const code = sync.queue_number || '';
  if (!code) throw new Error('nomor antrian belum terbit');

  printKartuAntrian({
    nomorResep,
    nama,
    jenis: jenisLabel,
    unit: String(row?.NAMA_UNIT ?? ''),
    tanggal: waktu ? waktu.slice(0, 10) : '',
    code,
    tglLahir: reader.tglLahir(),
  });
  return code;
}

/** Kirim BATAL ke app: antrian DIHAPUS dari DB. Kembalikan {ok, gone} —
 *  gone=true bila record sudah tidak ada (dianggap sudah batal). */
export async function batalAntrian(
  code: string,
  nomorResep: string,
  reader: AntrianFieldReader,
): Promise<{ ok: boolean; gone: boolean }> {
  const eid = queueEventId('bat', nomorResep, code) + '-' + Date.now().toString(36);
  const sync = await pushQueueEvent({
    event_id: eid,
    event: 'BATAL',
    queue_number: code,
    resep_id: nomorResep,
  });
  if (!sync.ok) {
    const info = await lookupAntrianAny(reader);
    if (!info) return { ok: true, gone: true };
    return { ok: false, gone: false };
  }
  return { ok: true, gone: false };
}

/** Cetak ulang kartu (state issued). Versi generic utk host apa pun. */
export function cetakKartuUlang(
  nomorResep: string,
  code: string,
  reader: AntrianFieldReader,
  jenis = '',
  unit = '',
  tanggal = '',
): void {
  printKartuAntrian({
    nomorResep,
    nama: reader.namaPasien(),
    jenis,
    unit,
    tanggal,
    code,
    tglLahir: reader.tglLahir(),
  });
}

export type { QueueEventPayload };
