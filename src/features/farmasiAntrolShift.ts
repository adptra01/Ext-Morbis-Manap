/**
 * farmasiAntrolShift
 *
 * Alur antrian farmasi berbasis keputusan petugas, bukan otomatis:
 *   pasien datang → petugas buka Detail → klik tombol "Antrian & Cetak"
 *   → resep masuk antrian (POST antrol) + ENQUEUE ke App Antrian (Reports
 *   SIMRS — source of truth nomor T-XX/R-XX, app assign per jenis)
 *   → kartu kertas tercetak (nomor dari app, bukan UT-xxx MORBIS / QueueManager)
 *   → petugas siapkan resep → klik Simpan → panggil dari konsol.
 *
 * Model B (keputusan 2026-08-19): nomor publik DIASSIGN APP saat ENQUEUE.
 * Extension TIDAK mengirim queue_number; nomor hasil diambil dari response.
 *
 * Yang dikerjakan (semua client-side, tidak menyentuh file MORBIS):
 * 1. Blokir POST otomatis `/v2/antrol/search?sub=update_v2` (taskid=6) yang
 *    MORBIS picu saat halaman Detail di-load (cabang else data-resep-new),
 *    agar "buka Detail" tidak lagi otomatis mengantrikan resep.
 * 2. Suntik tombol "Antrian & Cetak" di dekat tombol Simpan halaman Detail:
 *    POST antrol {id: ID_VISIT, taskid: 6}, resolve ID antrian dari
 *    check_antrian, ENQUEUE ke app, lalu cetak kartu sendiri.
 *
 * ponytail: interception berbasis URL string MORBIS — jika MORBIS mengubah endpoint
 * antrol/cetak atau struktur tombol, fitur ini perlu update.
 */
import { pushQueueEvent, queueEventId, probeFarmasiAppBase } from './shared/farmasiQueueSync';
import { printKartuAntrian } from './shared/printKartu';

// Guard anti double-inject: browser/SPA MORBIS bisa menyuntikkan content script
// lebih dari sekali (mis. navigasi parsial) → satu klik bisa memicu 2 event.
if ((window as unknown as { __extAntrolShift?: boolean }).__extAntrolShift) {
  throw new Error('skip double inject farmasiAntrolShift');
}
(window as unknown as { __extAntrolShift?: boolean }).__extAntrolShift = true;

/** Nama pasien: input hidden #nama_pasien → sel berlabel "Nama Pasien" →
 *  fallback header halaman (SANGAT ketat — jangan sampai menangkap judul
 *  halaman seperti "PENJUALAN E-RESEP" sebagai nama). */
function resolveNamaPasien(): string {
  const fromInput = document.querySelector<HTMLInputElement>('#nama_pasien')?.value?.trim();
  if (fromInput) return fromInput.toUpperCase();

  // Label "Nama Pasien" (th/td/strong) → nilai pada sel/elemen berikutnya.
  const labeled = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
  for (const el of labeled) {
    const label = (el.textContent || '').trim();
    if (!/^nama\s*pasien$/i.test(label)) continue;
    const next =
      el.nextElementSibling ||
      el.parentElement?.querySelector('input, select') ||
      el.parentElement?.nextElementSibling;
    const val = (next?.textContent || (next as HTMLInputElement | null)?.value || '').trim();
    if (val) return val.toUpperCase();
  }

  // Fallback terakhir: header yang JELAS nama pasien (2+ kata, huruf besar/
  // campuran, TANPA kata-kata kunci halaman). Judul halaman "PENJUALAN E-RESEP"
  // ditolak di sini.
  const PAGE_KEYWORDS =
    /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i;
  const headers = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
  for (const h of headers) {
    const t = (h.textContent || '').trim();
    if (!t || t.length < 4 || t.length > 60) continue;
    if (PAGE_KEYWORDS.test(t)) continue;
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length < 2) continue;
    return t.toUpperCase();
  }
  return '';
}

/** Cek ke App Antrian: resep sudah di-antri hari ini? (utk ganti tombol jadi
 *  "Cetak Kembali"). Return info antrian atau null. */
async function lookupAntrian(
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

/** Deteksi resep dibatalkan di MORBIS: (1) badge/teks status di DOM detail,
 *  (2) antrian app berstatus DIBATALKAN. Kalau batal → tombol antrian
 *  disembunyikan (user: "batal yaudah gak perlu ada button antrian"). */
function isResepBatal(antrianStatus?: string): boolean {
  if (antrianStatus === 'DIBATALKAN') return true;
  try {
    // Cari indikator status "Batal"/"Dibatalkan" di halaman detail — badge/
    // label status, bukan tombol aksi. Batasi area form utk hindari tombol.
    const area = document.querySelector('#isi, .card, .panel, .form-horizontal, form, table');
    const root = area || document.body;
    const nodes = root.querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
    for (const el of nodes) {
      const t = (el.textContent || '').trim();
      if (!/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(t)) continue;
      // Bukan tombol (button/input/a) — hanya label status pasif.
      if (el.closest('button, input, a')) continue;
      return true;
    }
  } catch {
    /* DOM belum siap */
  }
  return false;
}

(() => {
  const ANTRL_URL = '/v2/antrol/search';
  const ANTRL_SUB = 'sub=update_v2';
  const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';

  function isAntrolCall(url: unknown, body: unknown): boolean {
    const u = String(url ?? '');
    const b = String(body ?? '');
    return u.includes(ANTRL_URL) && u.includes(ANTRL_SUB) && b.includes('taskid=6');
  }

  function blockAutoAntrol(): void {
    // jQuery $.ajax → XMLHttpRequest. Patch prototype sekali, berlaku untuk semua XHR.
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest & { __extUrl?: string },
      method: string,
      url: string | URL,
      ...rest: unknown[]
    ) {
      this.__extUrl = String(url);
      return origOpen.apply(this, [method, url, ...rest] as never);
    };

    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest & { __extUrl?: string },
      body?: Document | XMLHttpRequestBodyInit | null,
    ) {
      if (isAntrolCall(this.__extUrl, body)) {
        console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
        return;
      }
      return origSend.apply(this, [body] as never);
    };

    // Beberapa kode MORBIS bisa memakai fetch.
    const origFetch = window.fetch.bind(window);
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (isAntrolCall(url, init?.body)) {
        console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
        return Promise.resolve(new Response(null, { status: 200 }));
      }
      return origFetch(input, init);
    }) as typeof fetch;
  }

  function registerAntrian(idVisit: string): Promise<boolean> {
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
  async function resolveAntrianRow(
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

  /** Klik tombol antrikan: antrol → resolve → ENQUEUE dgn jenis (racik/tunggal) → cetak. */
  async function onAntrianCetakClick(
    idVisit: string,
    nomorResep: string,
    jenis: 'racik' | 'tunggal',
  ): Promise<void> {
    const ok = await registerAntrian(idVisit);
    if (!ok) {
      alert('[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.');
      return;
    }

    // Ambil ID_PASIEN + WAKTU dari #id_pasien / #waktu_pengajuan (input tersembunyi)
    // agar resolve ke ID antrian (check_antrian) akurat.
    const idPasien = document.querySelector<HTMLInputElement>('#id_pasien')?.value ?? '';
    const waktu = document.querySelector<HTMLInputElement>('#waktu_pengajuan')?.value ?? '';
    let row: Record<string, unknown> | null = null;
    for (let i = 0; i < 5 && !row; i++) {
      row = await resolveAntrianRow(idPasien, waktu);
      if (!row) await new Promise((r) => setTimeout(r, 400));
    }
    const antrianId = row ? String(row.ID ?? '') : idVisit;

    // ENQUEUE ke App Antrian — TANPA queue_number (app assign R-XX utk racik,
    // T-XX utk tunggal, berdasar field jenis). Idempoten via event_id.
    const nama = resolveNamaPasien();
    const jenisLabel = jenis === 'racik' ? 'racikan' : 'tunggal';
    const sync = await pushQueueEvent({
      event_id: queueEventId('enq', antrianId, idVisit + '-' + jenisLabel),
      event: 'ENQUEUE',
      resep_id: nomorResep,
      nama_pasien: nama,
      norm: idPasien || undefined,
      shift: '',
      jenis: jenisLabel,
      counter: '',
      payload: {
        idVisit,
        unit: String(row?.NAMA_UNIT ?? ''),
        waktu: waktu || '',
      },
    });
    if (!sync.ok) {
      alert('[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.');
      return;
    }
    const code = sync.queue_number || '';
    if (!code) {
      alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
      return;
    }

    printKartuAntrian({
      nomorResep,
      nama,
      jenis: jenisLabel,
      unit: String(row?.NAMA_UNIT ?? ''),
      tanggal: waktu ? waktu.slice(0, 10) : '',
      code,
    });
    // Setelah berhasil: ganti tombol jadi "Cetak Kembali" + "Batal antrian".
    renderActionBar('issued', code);
  }

  /** Kirim BATAL ke app: antrian DIHAPUS dari DB app (bukan sentuh MORBIS).
   *  Setelah itu resep bisa di-antrikan ulang (tombol racik/tunggal muncul lagi). */
  async function onBatalAntrian(code: string, nomorResep: string): Promise<void> {
    const sync = await pushQueueEvent({
      event_id: queueEventId('bat', nomorResep, code),
      event: 'BATAL',
      queue_number: code,
      resep_id: nomorResep,
    });
    if (!sync.ok) {
      alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
      return;
    }
    // Antrian terhapus dari DB → tampilkan lagi tombol antrikan (racik/tunggal).
    renderActionBar('ready');
  }

  /** Baca ID kunjungan utk antrol — field hidden MORBIS bisa terisi belakangan
   *  (AJAX), jadi SELALU dibaca saat dibutuhkan (klik), bukan saat render. */
  function getField(id: string, fallbackName?: string): string {
    const el =
      document.querySelector<HTMLInputElement>('#' + id) ||
      (fallbackName
        ? document.querySelector<HTMLInputElement>('input[name="' + fallbackName + '"]')
        : null);
    return (el?.value ?? '').trim();
  }

  /** Render bar tombol aksi sesuai state: ready (belum antri) | issued (sudah
   *  antri) | hidden (resep batal — tanpa tombol antrian). */
  function renderActionBar(state: 'ready' | 'issued', code?: string): void {
    const bar = document.querySelector<HTMLElement>('#ext-antrian-bar');
    if (!bar) return;
    const nomorResep = getField('nomor_resep', 'id_resep');
    if (state === 'issued' && code) {
      bar.innerHTML =
        '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;">' +
        '<span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">' +
        '✓ Sudah antri — ' +
        code +
        '</span>' +
        '<div style="display: flex; gap: 6px;">' +
        '<button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button>' +
        '<button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB — resep bisa di-antrikan ulang">Batal antrian</button>' +
        '</div>' +
        '</div>';
      bar.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
        if (!nomorResep) return;
        try {
          printKartuAntrian({
            nomorResep,
            nama: resolveNamaPasien(),
            jenis: '',
            unit: '',
            tanggal: '',
            code: code || '',
          });
        } catch {
          /* abaikan */
        }
      });
      bar.querySelector('#ext-antrian-batal')?.addEventListener('click', () => {
        if (!confirm('Batalkan antrian ' + code + '? Resep akan keluar dari daftar panggilan.'))
          return;
        void onBatalAntrian(code || '', nomorResep);
      });
      return;
    }
    // Kedua tombol SELALU tampil — user bebas memilih racik (R-XX) atau
    // tunggal (T-XX), tak peduli nilai jenis_resep di MORBIS (keputusan
    // 2026-08-20: data jenis kadang "Tunggal" utk resep yang sebenarnya
    // racikan → biarkan operator yang memutuskan).
    bar.innerHTML =
      '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button>' +
      '<button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
    const klik = (jenis: 'racik' | 'tunggal'): void => {
      // Baca field SAAT KLIK — #id_visit & #id_resep diisi MORBIS via AJAX
      // setelah halaman render (sebelumnya: dibaca saat render → kosong → error
      // "[MORBIS Ext] data resep belum dimuat"). Prioritas #id_resep: nilainya
      // id resep sebenarnya (207140), bukan nomor resep MORBIS ("R2608-0237").
      const idVisit = getField('id_visit');
      const nomorResep2 = getField('id_resep', 'nomor_resep');
      if (!idVisit || !nomorResep2) {
        alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
        return;
      }
      const btn = document.querySelector(
        jenis === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
      ) as HTMLButtonElement | null;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Memproses…';
      }
      void onAntrianCetakClick(idVisit, nomorResep2, jenis).finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = jenis === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal';
        }
      });
    };
    bar.querySelector('#ext-antrian-racik')?.addEventListener('click', () => klik('racik'));
    bar.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => klik('tunggal'));
  }

  function addAntrianBar(): void {
    // Target inject: td valign="top" berisi fieldset id="perhatian" (kolom
    // kanan detail resep). Buat fieldset BARU di dalam td itu utk tombol.
    const findHost = (): HTMLElement | null => {
      const td = Array.from(
        document.querySelectorAll<HTMLTableCellElement>('td[valign="top"]'),
      ).find((c) => c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'));
      if (!td) return null;
      const fieldset = document.createElement('fieldset');
      fieldset.id = 'ext-antrian-fieldset';
      fieldset.style.cssText = 'margin-top:6px;';
      fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
      const bar = document.createElement('div');
      bar.id = 'ext-antrian-bar';
      bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
      fieldset.appendChild(bar);
      td.appendChild(fieldset);
      return bar;
    };

    const tryInject = (): void => {
      // Bar mungkin sudah ada dari inject sebelumnya (MORBIS render ulang) —
      // pakai yang ada, kalau belum ada buat baru.
      const existing = document.querySelector<HTMLElement>('#ext-antrian-bar');
      const bar = existing || findHost();
      if (!bar) return;

      // Lookup berulang: #nomor_resep / #id_resep bisa terisi belakangan
      // (AJAX MORBIS) dan nilai awal (nomor resep "R2608-0237") BEDA dari id
      // resep (207140). Kalau lookup pertama gagal karena field masih kosong/
      // salah, re-lookup berkala sampai ketemu → bar beralih ke "Sudah antri".
      const check = (attempt: number): void => {
        const nomorResep = getField('id_resep', 'nomor_resep');
        if (!nomorResep) {
          if (attempt < 10) window.setTimeout(() => check(attempt + 1), 800);
          else renderActionBar('ready');
          return;
        }
        void lookupAntrian(nomorResep).then((info) => {
          if (isResepBatal(info?.status)) {
            bar.innerHTML =
              '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan — antrian tidak tersedia</span>';
            return;
          }
          if (info) {
            renderActionBar('issued', info.queue_number);
          } else if (attempt < 10) {
            // Belum ketemu — field mungkin baru terisi/berubah, coba lagi.
            window.setTimeout(() => check(attempt + 1), 800);
          } else {
            renderActionBar('ready');
          }
        });
      };
      check(0);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInject, { once: true });
    } else {
      tryInject();
    }
    // Detail resep bisa dirender ulang setelah data AJAX; coba lagi sebentar.
    window.setTimeout(tryInject, 2000);
    window.setTimeout(tryInject, 5000);
  }

  blockAutoAntrol();
  addAntrianBar();
})();
