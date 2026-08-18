/**
 * farmasiAntrolShift
 *
 * Alur antrian farmasi berbasis keputusan petugas, bukan otomatis:
 *   pasien datang → petugas buka Detail → klik tombol "Antrian & Cetak"
 *   → resep masuk antrian (POST antrol) + nomor publik QueueManager (T-xx/R-xx)
 *   → kartu kertas tercetak (format penomoran kita, bukan UT-xxx MORBIS)
 *   → petugas siapkan resep → klik Simpan → panggil dari konsol.
 *
 * Yang dikerjakan (semua client-side, tidak menyentuh file MORBIS):
 * 1. Blokir POST otomatis `/v2/antrol/search?sub=update_v2` (taskid=6) yang
 *    MORBIS picu saat halaman Detail di-load (cabang else data-resep-new),
 *    agar "buka Detail" tidak lagi otomatis mengantrikan resep.
 * 2. Suntik tombol "Antrian & Cetak" di dekat tombol Simpan halaman Detail:
 *    POST antrol {id: ID_VISIT, taskid: 6}, resolve ID antrian dari
 *    check_antrian, issue nomor publik via bridge, lalu cetak kartu sendiri.
 *
 * ponytail: interception berbasis URL string MORBIS — jika MORBIS mengubah endpoint
 * antrol/cetak atau struktur tombol, fitur ini perlu update.
 */
import { assignPublicNumber } from './shared/farmasiQueueBridge';
import { printKartuAntrian } from './shared/printKartu';

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

  /** Klik tombol: antrol → resolve → nomor publik → cetak kartu kita. */
  async function onAntrianCetakClick(idVisit: string, nomorResep: string): Promise<void> {
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

    // Terbitkan nomor utk SATU id (idempoten — cetak ulang → tiket sama).
    const issued = await assignPublicNumber(
      antrianId,
      (row?.JENIS as string | null) ?? null,
      waktu || null,
    );
    if (!issued.code) {
      alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
      return;
    }
    const code = issued.code;

    const nama = document.querySelector<HTMLInputElement>('#nama_pasien')?.value ?? '';
    printKartuAntrian({
      nomorResep,
      nama: String(nama).toUpperCase(),
      jenis: String(row?.JENIS ?? ''),
      unit: String(row?.NAMA_UNIT ?? ''),
      tanggal: waktu ? waktu.slice(0, 10) : '',
      code,
    });
  }

  function addAntrianCetakButton(): void {
    // Tunggu tombol Simpan (#save) dirender MORBIS.
    const tryInject = (): void => {
      const saveBtn = document.querySelector<HTMLButtonElement>('#save');
      if (!saveBtn || document.querySelector('#ext-antrian-cetak')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'ext-antrian-cetak';
      btn.textContent = 'Antrian & Cetak';
      btn.className = 'btn btn-success';
      btn.style.cssText = 'margin-left:6px;';
      btn.addEventListener('click', () => {
        const idVisit = document.querySelector<HTMLInputElement>('#id_visit')?.value ?? '';
        const nomorResep = document.querySelector<HTMLInputElement>('#nomor_resep')?.value ?? '';
        if (!idVisit || !nomorResep) {
          alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
          return;
        }
        btn.disabled = true;
        btn.textContent = 'Memproses…';
        void onAntrianCetakClick(idVisit, nomorResep).finally(() => {
          btn.disabled = false;
          btn.textContent = 'Antrian & Cetak';
        });
      });
      saveBtn.insertAdjacentElement('afterend', btn);
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
  addAntrianCetakButton();
})();
