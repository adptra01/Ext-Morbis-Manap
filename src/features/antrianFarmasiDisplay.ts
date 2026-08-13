/* AntrianFarmasiDisplay – Queue Controller v2 (Presentation Layer) untuk layar
 * panggilan farmasi MORBIS legacy.
 *
 * Konstanta terverifikasi (curl live):
 *   - HTML asli server-render: #antrian-view / #antrian-penyerahan / #list-content
 *     SEMUA ada di body sejak awal (bukan dimuat JS). Selektor ini aman.
 *   - Endpoint `list-antrian-v2?type=data_call` mengembalikan JSON VALID tanpa
 *     session (2 baris, kolom: NOMOR, NAMA_PASIEN, NAMA_UNIT, NAMA, JENIS, ...).
 *   - Endpoint `check_antrian` memerlukan session → ORA-00936 kala session hilang.
 *   => Extension memakai data_call sebagai sumber kebenaran display, JANGAN
 *      mengarang nomor / memakai data saat API error.
 *
 * Arsitektur (resilient layer — MORBIS = source of truth, WebSocket = jalur utama):
 *
 *   Native WS sehat (display native bergerak)      → extension TIDAK polling, tidak
 *                                                    sentuh DOM (MODE 1 / NATIVE).
 *   Native membeku (WS mati/gagal)                 → polling data_call fallback (MODE 2),
 *                                                    valid data → render; invalid → retry.
 *   API error / [] / HTML / ORA / 404 / 500        → PERTAHANKAN DOM (transport
 *                                                    uncertainty ≠ queue kosong).
 *
 * Prinsip non-negotiable:
 *   - Data VALID             → normalize → render PANGGILAN & SIAP DIAMBIL
 *   - [] / HTML / ORA / HTTP → jangan ubah DOM native; hanya backoff + log
 *   - Klik "Selanjutnya" di halaman manajemen mengubah current-number pada
 *     endpoint `?section=isi&nomor=<loket>` (VERIFIKASI PRODUKSI 2026-08-12:
 *     MURSIDAH BT-4 diklik → current-number counter 1 = "4"; endpoint ini
 *     PUBLIK dan dipakai display native sendiri via loadContent). STATUS &
 *     STATUS_PANGGIL pada data_call TIDAK diandalkan sebagai sumber panggilan
 *     aktif (basi saat display dibuka ulang). current-number = sumber kebenaran.
 *   - data_call hanya dipakai untuk NAMA pasien (cocokkan COUNTER/NOMOR
 *     dengan current-number) dan daftar SIAP DIAMBIL.
 *   - WAKTU_PENERIMAAN ada & belum diserahkan → SIAP DIAMBIL
 *   - nomor baru             → bell lalu TTS (dedup signature ⇒ satu kali)
 *   - WebSocket/Swal/speechSynthesis native → BIARKAN normal; extension TIDAK
 *     override/stub/suppress apa pun dari ketiganya.
 *   - Audio unlock via gesture pengguna (audioUnlocked); TTS TANPA unlock → tidak bicara
 *
 * Gating: fitur aktif hanya bila role apotek (allowedRoles: ['apotek']) →
 * gate data-ext-antrian-farmasi di init.ts.
 */
import { nextHealth, type HealthState } from './shared/wsHealth';
import {
  activeNumber,
  isReset,
  parseListContentPatient,
  parseCurrentNumbers,
  parsePatients,
  type PatientByName,
} from './shared/currentNumber';

// Observability (debug) — snapshot baca-saja, bukan sumber kebenaran.
// Hanya dibuat bila URL memakai ?debug=1; production normal tetap bersih
// dan perilaku identik dengan/tanpa debug.
type AntrianFarmasiDebugState = {
  started: boolean;
  mode: 'NATIVE' | 'FALLBACK';
  nativeActive: boolean;
  pollingActive: boolean;
  lastNativeActivity: number | null;
  lastPoll: number | null;
  lastDataCount: number | null;
  lastAnnouncement: string | null;
  audioUnlocked: boolean;
  ttsMode: 'speech' | 'mp3' | 'local' | 'silent' | null;
};

declare global {
  interface Window {
    __ANTRIAN_FARMASI_DEBUG__?: AntrianFarmasiDebugState;
  }
}

(function () {
  const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  // Adaptive backoff polling fallback (hanya saat native membeku): setiap gagal naik
  // satu anak tangga, reset ke awal setelah berhasil.
  // ponytail: anak tangga pertama 600ms supaya klik beruntun Selanjutnya tertangkap
  // (tes lapangan: klik 1x/detik melompati 1 nomor di poll 2s). Klik lebih cepat
  // dari 600ms masih bisa terlewat — naikkan budget hanya bila itu terjadi.
  const POLL_LADDER_MS = [500, 1500, 3000, 6000];
  const GAP_MS = 400;
  // Segarkan card (angka panggilan last + nama) secara tetap — cepat (~1s),
  // tidak tergantung health/native/poll. Bikin display responsif setelah
  // 'Selanjutnya'/recall tanpa menunggu WS native.
  const CARD_MS = 1000;
  // Badge status (pojok kanan-atas): memberi tahu petugas bahwa refresh berjalan
  // ("MEMPERBARUI…") vs selesai ("SIAP") — menandakan delay itu normal, bukan freeze.
  let statusBadge: HTMLDivElement | null = null;
  let controlsHost: HTMLDivElement | null = null;

  // Kotak kontrol di bagian bawah section `.side`: berisi status badge + tombol
  // Tes Suara + Full Screen, disusun rapi (kolom) dalam kotak rounded. Fallback:
  // bila `.side` tidak ada, append ke body (tetap terlihat).
  function ensureControlsHost(): void {
    if (controlsHost) return;
    // run_at document_start → body/.side bisa belum ada. Jangan throw; buat host
    // hanya bila target tersedia (di-append ulang oleh interval mount bwh).
    if (!document.body) return;
    const side = document.querySelector('.side');
    const host = document.createElement('div');
    host.id = 'ext-afd-controls';
    host.style.cssText =
      'display:flex;flex-direction:column;gap:10px;margin:12px 4px 4px;padding:12px;' +
      'background:#fff;border:1px solid #0f5132;border-radius:16px;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.08);';
    (side ?? document.body).appendChild(host);
    controlsHost = host;
  }

  function ensureStatusBadge(): void {
    if (statusBadge) return;
    ensureControlsHost();
    // run_at document_start → body/`.side` bisa belum ada; mount di-retry (interval).
    statusBadge = document.createElement('div');
    statusBadge.id = 'ext-afd-status';
    statusBadge.style.cssText =
      'padding:5px 12px;border-radius:999px;align-self:flex-start;' +
      'font:700 12px/1.3 "Inter",system-ui,sans-serif;display:flex;align-items:center;gap:6px;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.15);color:#fff;';
    statusBadge.setAttribute('data-state', 'init');
    const sb = statusBadge;
    const mount = () => {
      if (!document.body) return;
      ensureControlsHost();
      if (sb && !sb.isConnected) controlsHost?.appendChild(sb);
    };
    document.addEventListener('DOMContentLoaded', mount);
    window.setInterval(mount, 300);
    mount();
  }
  function setStatus(state: 'loading' | 'ok' | 'error'): void {
    ensureStatusBadge();
    if (!statusBadge) return;
    statusBadge.setAttribute('data-state', state);
    const dot =
      '<span style="width:9px;height:9px;border-radius:999px;background:currentColor;display:inline-block;flex-shrink:0;"></span>';
    if (state === 'loading') {
      statusBadge.style.background = '#d97706';
      statusBadge.innerHTML = dot + 'MEMPERBARUI…';
    } else if (state === 'ok') {
      statusBadge.style.background = '#0f5132';
      statusBadge.innerHTML =
        dot + 'SIAP · ' + new Date().toLocaleTimeString('id-ID', { hour12: false });
    } else {
      statusBadge.style.background = '#b91c1c';
      statusBadge.innerHTML = dot + 'GAGAL';
    }
  }

  // Tombol "Tes Suara Panggilan" & "Full Screen" — di dalam kotak kontrol (bawah .side).
  // Klik Tes Suara = user-activation (unlock audio) + jalankan bell & TTS sampel.
  let toolbar: HTMLDivElement | null = null;
  function ensureToolbar(): void {
    if (toolbar) return;
    ensureControlsHost();
    toolbar = document.createElement('div');
    toolbar.id = 'ext-afd-toolbar';
    toolbar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
    toolbar.innerHTML =
      '<button id="ext-afd-testsound" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#0f5132;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">🔊 Tes Suara</button>' +
      '<button id="ext-afd-fs" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#155e75;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">⛶ Full Screen</button>';
    const el = toolbar;
    const mount = () => {
      if (!el || el.isConnected) return;
      ensureControlsHost();
      controlsHost?.appendChild(el);
    };
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount);
    window.setInterval(mount, 300);
    toolbar.querySelector('#ext-afd-testsound')?.addEventListener('click', () => {
      unlockAudio(); // gesture ini membuka izin suara di browser yg ketat
      setStatus('loading');
      announce({
        id: 'tes:suara',
        nomor: '99',
        kode: 'BT',
        namaPasien: 'Tes Suara Panggilan',
        unit: '',
        jenis: 'tunggal',
        rm: '',
      });
      // reset badge ke SIAP setelah announce selesai bicara (~4-5 detik)
      window.setTimeout(() => setStatus('ok'), 5000);
    });
    toolbar.querySelector('#ext-afd-fs')?.addEventListener('click', () => {
      const doc = document as Document & { webkitFullscreenElement?: unknown };
      const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (
          (document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen
        )
          (document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        void el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    });
  }
  // C1 — Native Activity Health Monitor: probe aktivitas DOM antrian (baca-only).
  // Bukan instrumentasi window.WebSocket — extension "mengamati konsekuensi transport
  // native", bukan merekayasa WebSocket-nya. Nama file wsHealth.ts dipertahankan
  // (internal), namun yang sebenarnya diamati adalah aktivitas display native.
  // ponytail: 1500ms × 2 = ~3s deteksi freeze (dulu 3000×4 = 12s) — keluhan "lambat".
  const WATCH_MS = 1500; // periodik baca signal DOM antrian native
  const STALE_MAX = 2; // 2× diam berturut-turut ≈ 3s → anggap native membeku, mulai polling

  /* ============================================================
   * WebSocket native MORBIS → BIARKAN berjalan normal. Extension
   * TIDAK mengganti/men-stub WebSocket. (P0: jangan ambil alih
   * mekanisme native; FakeWS sebelumnya menelan onmessage dan
   * mematikan data yang native tarik lewat ws://:8088.)
   * ============================================================ */

  /* ============================================================
   * Types (kontrak backend data_call)
   * ============================================================ */
  type RawRow = {
    ID?: string | number | null;
    NOMOR?: string | number;
    COUNTER?: string | number;
    KODE?: string;
    NAMA?: string;
    NAMA_PASIEN?: string;
    NAMA_UNIT?: string;
    JENIS?: string;
    ID_PASIEN?: string | number;
    LOKET?: string | number;
    STATUS?: string | number;
    STATUS_PANGGIL?: string | number;
    WAKTU_PENERIMAAN?: string | null;
    WAKTU_PENYERAHAN?: string | null;
    WAKTU?: string | null;
  };

  // Output normalize: dua daftar terpisah untuk render.
  type ViewRow = {
    id: string;
    nomor: string;
    kode: string;
    namaPasien: string;
    unit: string;
    jenis: 'tunggal' | 'racikan';
    rm: string;
  };

  type QueueView = {
    panggilan: ViewRow[];
    siapDiambil: ViewRow[];
  };

  /* ============================================================
   * API Adapter — fetch data_call (nama pasien) + current-number.
   * ============================================================ */
  async function fetchCallData(): Promise<RawRow[]> {
    // GET (bukan POST): endpoint mengembalikan data hanya utk GET ?type=data_call.
    // Verifikasi kiosk: GET → 3 record; POST body type=data_call → HTTP 200 tapi [].
    const res = await fetch(LIST_URL + '?type=data_call', {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const parsed: unknown = JSON.parse(text); // THROW bila HTML/ORA/blank → dipakai controller sbg error, BUKAN [] kosong
    if (!Array.isArray(parsed)) {
      // Respons JSON tapi bukan array → bukan data antrian; anggap error, jangan samarkan sbg [].
      throw new Error('Respons bukan array: ' + String(text).slice(0, 80));
    }
    return parsed as RawRow[];
  }

  // Loket display (DEPO RAJAL = 4324; verifikasi produksi 2026-08-12, satusatunya
  // opsi di <select id="no_loket"> halaman manajemen). Baca dari DOM bila ada
  // (display asli tidak punya #no_loket → fallback ke konstanta terverifikasi).
  function loket(): string {
    const el = document.querySelector<HTMLSelectElement>('#no_loket');
    if (el && el.value) return el.value;
    return '4324';
  }

  // Sumber kebenaran panggilan aktif: endpoint ?section=isi (PUBLIK, tanpa
  // session — dipakai display native loadContent tiap 30 detik). current-number
  // berubah SAAT klik "Selanjutnya" di halaman manajemen; TIDAK bergantung WS.
  // Respons yang sama juga memuat tabel antrian dengan NAMA pasien per nomor —
  // diurai sekaligus agar nama TTS selalu sinkron (data_call bisa lag/basi).
  async function fetchCurrentNumber(): Promise<{
    current: Map<string, string>;
    patients: PatientByName;
  }> {
    const res = await fetch(
      '/antrian-farmasi/v2?section=isi&nomor=' + encodeURIComponent(loket()),
      {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      },
    );
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const html = await res.text();
    return { current: parseCurrentNumbers(html), patients: parsePatients(html) };
  }

  /* ============================================================
   * Normalize — pemetaan eksplisit struktur backend (tervalidasi data nyata).
   * Klasifikasi ground truth (kiosk, 2026-08-12):
   *   STATUS=0                 → kandidat PANGGILAN awal (baseline pertama saja)
   *   WAKTU_PENERIMAAN ada     → SIAP DIAMBIL (sudah diterima, belum diserahkan)
   *                              — contoh ID 78887/78891 (STATUS=4)
   *   selain itu               → IGNORE (jangan salah klasifikasi)
   * Catatan: jangan pakai STATUS=='1' utk ready — data nyata memakai STATUS=4.
   *
   * Panggilan BARU (klik "Selanjutnya") dideteksi lewat delta STATUS_PANGGIL
   * antar poll (lihat detectNewCalls) — STATUS TIDAK berubah saat klik, jadi
   * STATUS=0 hanya dipakai sebagai baseline tampilan pertama, bukan sumber
   * kebenaran panggilan (fix 2026-08-12: display macet di UT-1 TEST).
   * ============================================================ */
  function toViewRow(r: RawRow): ViewRow {
    // Konsisten dgn renumber: racikan hanya bila JENIS mengandung 'racik'; selain
    // itu (tunggal / null) = tunggal. Jangan default null → racikan.
    const j = /racik/i.test(String(r.JENIS ?? '')) ? 'racikan' : 'tunggal';
    return {
      id: String(r.ID),
      nomor: r.COUNTER != null ? String(r.COUNTER) : r.NOMOR != null ? String(r.NOMOR) : '',
      kode: r.KODE || r.NAMA || 'BT',
      namaPasien: r.NAMA_PASIEN ?? '',
      unit: r.NAMA_UNIT ?? '',
      jenis: j,
      rm: r.ID_PASIEN != null ? String(r.ID_PASIEN) : '',
    };
  }

  function normalize(rows: RawRow[]): QueueView {
    const panggilan: ViewRow[] = [];
    const siapDiambil: ViewRow[] = [];
    for (const r of rows) {
      if (!r || r.ID == null) continue; // jangan render baris tanpa ID
      const v = toViewRow(r);
      const st = String(r.STATUS).trim();
      const diterima = r.WAKTU_PENERIMAAN != null && String(r.WAKTU_PENERIMAAN).trim() !== '';
      const diserahkan = r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '';
      if (st === '0') panggilan.push(v);
      else if (diterima && !diserahkan) siapDiambil.push(v);
      // status lain tanpa tanda penerimaan: lewati
    }
    return { panggilan, siapDiambil };
  }

  /* ============================================================
   * Display — render DOM, bedakan 3 kondisi (no data / error / ada).
   * ============================================================ */
  // Pemetaan panel MENGIKUTI NATIVE (verifikasi 2026-08-13):
  //   #antrian-penyerahan = Resep TUNGGAL (native menulis di sini saat tunggal dipanggil)
  //   #antrian-view       = Resep RACIKAN (native menulis di sini saat racikan dipanggil)
  // Dulu extension membaliknya → recall tunggal ditulis native ke #antrian-penyerahan
  // tapi extension baca/timpa #antrian-view → recall tunggal tak terdeteksi & hilang.
  const PANGGILAN_SEL = '#antrian-penyerahan'; // panel native TUNGGAL
  const SIAP_SEL = '#antrian-view'; // panel native RACIKAN

  // Seksi card per jenis: ANGKA = current MORBIS (mengikuti panggilan terakhir,
  // '0'/kosong → '—'), NAMA = pasien terakhir per jenis (opsional).
  function cardSection(label: string, numText: string, nama: string): string {
    return (
      '<div class="antrian-title">' +
      label +
      '</div>' +
      '<div class="antrian-nomor">' +
      (numText && numText !== '0' ? numText : '—') +
      '</div>' +
      (nama ? '<div class="antrian-rm">' + nama + '</div>' : '')
    );
  }

  // Nama pasien utk current MORBIS per jenis: cari baris data_call yg nomor
  // (NOMOR/COUNTER)-nya sama dgn current & jenis cocok → nama pasiennya.
  function currentPatientName(jenis: 'tunggal' | 'racikan', morbisNum: string): string {
    if (!morbisNum || morbisNum === '0') return '';
    const isR = jenis === 'racikan';
    const row = lastRows.find(
      (r) =>
        (isR ? /racik/i.test(String(r.JENIS ?? '')) : !/racik/i.test(String(r.JENIS ?? ''))) &&
        (String(r.NOMOR ?? '') === morbisNum || String(r.COUNTER ?? '') === morbisNum),
    );
    return row?.NAMA_PASIEN || '';
  }

  // Nomor antrian yang tampil di panel native (recall): ekstrak digit terakhir
  // dari teks panel (mis. "BT-30" / "30"). Bukan sumber kebenaran panggilan baru,
  // hanya untuk deteksi recall yang tidak terlihat di current-number ?section=isi.
  function readPanelNumber(sel: string): string {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return '';
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    const m = txt.match(/(?:^|\D)(\d{1,4})(?:\D|$)/);
    return m ? m[1] : '';
  }

  // Nama pasien utk nomor recall: cari di lastRows (data_call) — jenis apa pun.
  function currentPatientNameByNum(morbisNum: string): string {
    if (!morbisNum) return '';
    const row = lastRows.find(
      (r) => String(r.NOMOR ?? '') === morbisNum || String(r.COUNTER ?? '') === morbisNum,
    );
    return row?.NAMA_PASIEN || '';
  }

  // Highlight baris tabel #list-content utk panggilan terakhir per jenis.
  // Cocokkan NOMOR secara PERSIS (angka dari h4 BT-xx/UR-xx) dgn currentByJenis,
  // atau via nama pasien terakhir per jenis — tandai kuning.
  function highlightCurrents(): void {
    const lc = document.querySelector('#list-content');
    if (!lc) return;
    const targets = [currentByJenis.tunggal, currentByJenis.racikan].filter((n) => n && n !== '0');
    const names = [
      lastByJenis.tunggal?.namaPasien || '',
      lastByJenis.racikan?.namaPasien || '',
    ].filter(Boolean);
    for (const dl of lc.querySelectorAll('dl')) {
      const h4 = dl.querySelector('h4');
      const num = ((h4?.textContent || '').match(/(\d+)$/) || [])[1] || '';
      const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
      const d = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
      // nomor harus PERSIS (bukan substring) — hindari 5 cocok 15/25/35
      const matchNum = targets.some((n) => num && n === num);
      const matchName = names.some((nm) => nm && d === nm);
      (dl as HTMLElement).style.background = matchNum || matchName ? '#fde68a' : '';
    }
  }

  // Panggil ulang pasien tertentu (replicating native panggilUlang): POST
  // /antrian-farmasi/control {id, nomor, jenis, loket} lalu refresh konten.
  // Dipicu klik pada baris pasien di #list-content. Tidak auto-fire — butuh konfirmasi.
  async function recallPatient(row: RawRow): Promise<void> {
    const noLoket = loket();
    const id = row.ID != null ? String(row.ID) : '';
    const nomor =
      row.COUNTER != null ? String(row.COUNTER) : row.NOMOR != null ? String(row.NOMOR) : '';
    const jenis = /racik/i.test(String(row.JENIS ?? '')) ? 'racikan' : 'tunggal';
    if (!id) return;
    if (!window.confirm('Panggil ulang ' + (row.NAMA_PASIEN || '') + ' (' + nomor + ')?')) return;
    try {
      const res = await fetch('/antrian-farmasi/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body:
          'id=' +
          encodeURIComponent(id) +
          '&nomor=' +
          encodeURIComponent(nomor) +
          '&jenis=' +
          encodeURIComponent(jenis) +
          '&loket=' +
          encodeURIComponent(noLoket),
      });
      if (!res.ok) {
        console.error('[AFD] recall gagal HTTP', res.status);
        return;
      }
      // refresh konten display agar nomor ter-panggil terbaru tampil
      const loader = window as unknown as { contentloader?: (u: string, sel: string) => void };
      if (typeof loader.contentloader === 'function') {
        loader.contentloader('/antrian-farmasi/v2?section=isi&nomor=' + noLoket, '#isi');
      }
    } catch (e) {
      console.error('[AFD] recall error', e);
    }
  }

  // Wire klik baris utk panggil ulang + sorot (highlight). Hubungkan tiap baris
  // #list-content ke baris data_call (lastRows) via nama utk dapat id/nomor/jenis.
  function wireRowRecall(): void {
    const lc = document.querySelector('#list-content');
    if (!lc || (lc as unknown as { __afdRecall?: boolean }).__afdRecall) return;
    (lc as unknown as { __afdRecall: boolean }).__afdRecall = true;
    const rows = lc.querySelectorAll('dl');
    for (const dl of rows) {
      const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
      const nameTxt = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
      if (!nameTxt || (dl as unknown as { __afdRec?: boolean }).__afdRec) continue;
      (dl as unknown as { __afdRec: boolean }).__afdRec = true;
      dl.addEventListener('click', () => {
        const row = lastRows.find(
          (r) => ((r.NAMA_PASIEN || '').replace(/\s+/g, ' ').trim() || '').indexOf(nameTxt) !== -1,
        );
        if (row) void recallPatient(row);
      });
    }
  }

  // Refresh angka card + highlight secara tetap & cepat. Fetch ?section=isi
  // (current number) + data_call (nama), update currentByJenis/lastRows, render.
  // Di-ranse interval mandiri (CARD_MS) — tak bertabrakan dgn health/poll.
  //
  // Recall (panggil ulang): current-number ?section=isi TIDAK berubah (tetap nomor
  // terakhir "Selanjutnya"), tapi panel native di-update WS native dengan nomor
  // recall — TUNGGAL → #antrian-penyerahan, RACIKAN → #antrian-view (mapping native).
  // Deteksi: baca nomor KEDUA panel SEBELUM menimpa → beda dari current-number
  // jenisnya = panggilan native (recall) → announce + JANGAN timpa, supaya nomor
  // recall tetap terlihat & bersuara.
  let lastNativeCall: string | null = null; // key 'jenis:nomor' recall terakhir di-announce
  async function refreshCardNumber(): Promise<void> {
    setStatus('loading');
    try {
      // Baca nomor panel native SAAT INI (sebelum kita menulis) — sumber recall.
      const panelT = readPanelNumber(PANGGILAN_SEL); // panel TUNGGAL native
      const panelR = readPanelNumber(SIAP_SEL); // panel RACIKAN native
      const [{ current: cur }, rows] = await Promise.all([fetchCurrentNumber(), fetchCallData()]);
      lastRows = rows;
      const g1 = cur.get('1')?.trim();
      const g2 = cur.get('2')?.trim();
      currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
      currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';

      // Recall terdeteksi: panel native menampilkan nomor yang TIDAK sama dengan
      // current-number jenisnya → announce sekali (dedup via lastNativeCall) +
      // biarkan panel native tampil (jangan timpa) sampai native mengubahnya.
      const recallT = panelT && panelT !== '0' && panelT !== currentByJenis.tunggal;
      const recallR = panelR && panelR !== '0' && panelR !== currentByJenis.racikan;
      if (recallT || recallR) {
        const jenis = recallT ? 'tunggal' : 'racikan';
        const panelNum = recallT ? panelT : panelR;
        const key = jenis + ':' + panelNum;
        if (key !== lastNativeCall) {
          lastNativeCall = key;
          const nama = currentPatientNameByNum(panelNum);
          announce({
            id: 'recall:' + key,
            nomor: panelNum,
            kode: '',
            namaPasien: nama,
            unit: '',
            jenis,
            rm: '',
          });
          updateDebugState({ lastAnnouncement: 'recall:' + key });
        }
        setStatus('ok');
        return; // jangan timpa panel recall native
      }

      // Deteksi panggilan BARU per jenis utk bell+TTS — jalan di NATIVE maupun
      // FALLBACK (sebelumnya hanya di poll fallback, jadi NATIVE kiosk tak bicara).
      for (const j of ['tunggal', 'racikan'] as const) {
        const cur = currentByJenis[j];
        const prev = prevByJenis[j];
        if (cur && cur !== '0' && cur !== prev) {
          lastNativeCall = null; // panggilan normal → recall berikutnya harus announce lagi
          const nama = currentPatientName(j, cur);
          announce({
            id: j + ':' + cur,
            nomor: cur,
            kode: '',
            namaPasien: nama,
            unit: '',
            jenis: j,
            rm: '',
          });
        }
        prevByJenis[j] = cur || '';
      }

      const atas = document.querySelector<HTMLElement>(PANGGILAN_SEL);
      if (atas)
        atas.innerHTML = cardSection(
          'Obat Tunggal',
          currentByJenis.tunggal,
          currentPatientName('tunggal', currentByJenis.tunggal),
        );
      const bawah = document.querySelector<HTMLElement>(SIAP_SEL);
      if (bawah)
        bawah.innerHTML = cardSection(
          'Obat Racikan',
          currentByJenis.racikan,
          currentPatientName('racikan', currentByJenis.racikan),
        );
      highlightCurrents();
      onWeWrote(); // tandai write extension agar tak dianggap native recovery
      setStatus('ok');
    } catch {
      setStatus('error');
      /* poll gagal — diam, kartu biarkan apa adanya */
    }
  }

  // P1: HANYA mengubah DOM bila panel punya data valid. Kalau panel kosong
  // (atau API gagal), DOM di-biarkan apa adanya — extension TIDAK menghapus/
  // menimpa tampilan native. Empty/error = jangan sentuh display.
  //
  // call = panggilan aktif yang HARUS ditampilkan (hasil deteksi delta
  // STATUS_PANGGIL). null → panel panggilan tidak disentuh.
  //
  // Setelah menulis DOM, beri tahu mesin kesehatan via `onWeWrote()` supaya
  // write extension tidak dianggap sebagai "native recovery" (anti feedback-loop).
  function renderDisplay(view: QueueView, call: ViewRow | null): void {
    if (call) {
      // update panggilan terakhir per jenis + seed dari data (card atas/bawah)
      lastByJenis[call.jenis] = call;
      seedLastByJenis(view);
      const atas = document.querySelector<HTMLElement>(PANGGILAN_SEL);
      if (atas)
        atas.innerHTML = cardSection(
          'Obat Tunggal',
          currentByJenis.tunggal,
          currentPatientName('tunggal', currentByJenis.tunggal),
        );
      const bawah = document.querySelector<HTMLElement>(SIAP_SEL);
      if (bawah)
        bawah.innerHTML = cardSection(
          'Obat Racikan',
          currentByJenis.racikan,
          currentPatientName('racikan', currentByJenis.racikan),
        );
      highlightCurrents(); // tandai baris panggilan terakhir per jenis
      wireRowRecall(); // aktifkan klik-kiri-pasien utk panggil ulang
    }
    onWeWrote(); // tandai DOM yang BARU SAJA extension tulis (bukan native)
  }

  // Isi slot jenis yang masih kosong dari data_call mentah (lastRows) — karena
  // STATUS=0 tak selalu menandai baris aktif, gunakan SEMUA baris per jenis, ambil
  // yang terakhir. Card samping selalu lengkap (tunggal + racikan) selama data ada.
  function seedLastByJenis(view: QueueView): void {
    // prioritas baris yang sudah "dipanggil" (STATUS=0) perlu disebarkan dulu
    for (const row of view.panggilan) {
      if (!lastByJenis[row.jenis]) lastByJenis[row.jenis] = row;
    }
    // lalu semua baris data_call per jenis (urutan lastRows terakhir menang)
    for (const row of lastRows) {
      const v = toViewRow(row);
      lastByJenis[v.jenis] = v; // selalu timpa → menampilkan baris TERAKHIR per jenis
    }
  }

  /* ============================================================
   * Queue State
   * ============================================================ */
  let announcedSig = ''; // signature `${counter}:${nomor}` terakhir yang di-announce (dedup)
  // current-number (counter → nomor) dari poll sebelumnya. Klik "Selanjutnya"
  // di halaman manajemen MENGUBAH current-number pada endpoint ?section=isi —
  // delta antar poll = panggilan baru (verifikasi produksi 2026-08-12). Lebih
  // andal daripada delta STATUS_PANGGIL: tidak basi saat display dibuka ulang.
  const prevCurrent = new Map<string, string>();
  let currentCall: ViewRow | null = null; // panggilan aktif yang sedang ditampilkan
  let baselineSet = false; // false = poll pertama (tampilkan tanpa announce)

  // Panggilan TERAKHIR per jenis — dibuat agar card samping bisa menampilkan
  // dua bagian: Obat Tunggal (atas) & Obat Racikan (bawah). Di-update setiap
  // kali renderDisplay me-render call; bertahan walau panggilan berikutnya beda jenis.
  const lastByJenis: Record<'tunggal' | 'racikan', ViewRow | null> = {
    tunggal: null,
    racikan: null,
  };

  // Nomor current MORBIS per jenis (dari ?section=isi current-number, counter 1 =
  // Non Racikan, counter 2 = Racikan). Dipakai sebagai ANGKA utama di card —
  // mengikuti panggilan terakhir nyata; '0'/kosong = belum ada panggilan → '—'.
  const currentByJenis: Record<'tunggal' | 'racikan', string> = {
    tunggal: '',
    racikan: '',
  };
  // Nomor per jenis pada refresh sebelumnya — deteksi panggilan BARU utk bell+TTS
  // (jalan di NATIVE maupun FALLBACK, tidak hanya saat poll fallback).
  const prevByJenis: Record<'tunggal' | 'racikan', string> = { tunggal: '', racikan: '' };

  // data_call mentah terakhir (diisi pollFallback) — dipakai seed card dua-bagian
  // karena STATUS=0 tak selalu menandai baris aktif (status MORBIS tak reliable).
  let lastRows: RawRow[] = [];

  /* ============================================================
   * TTS (role-gated). Bell asli MORBIS (audio #unine) dipicu karena
   * suara bell menandai pergantian sebelum voice.
   * ============================================================ */
  const synth = window.speechSynthesis;
  const RealSpeak = synth.speak.bind(synth);
  let busy = false;
  // Antrean serial (FIFO): bell DAN voice dalam satu antrean supaya panggilan baru
  // tidak menimpa panggilan yang sedang berbicara — bell berikutnya menunggu voice
  // aktif selesai (klik "Selanjutnya" beruntun).
  type QueueItem = { kind: 'voice'; text: string } | { kind: 'bell' };
  const queue: QueueItem[] = [];

  function next(): void {
    if (busy || queue.length === 0) return;
    busy = true;
    const item = queue.shift()!;
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      busy = false;
      setTimeout(() => next(), GAP_MS);
    };
    if (item.kind === 'bell') {
      // finish() (→ voice berikutnya) dipanggil SETELAH bell benar-benar selesai
      // (durasi bell sintesis terukur via ringBell → onDone), bukan setelah
      // jeda buta. Jadi TTS tidak tumpang-tindih dengan bell.
      ringBell(finish);
      return;
    }
    playVoice(item.text, finish);
  }

  // TTS berlapis (kiosk display: Chrome speechSynthesis diam tanpa user-gesture,
  // voices bisa kosong — bell AudioContext ter-unlock oleh sound=Allow, TTS tidak).
  // 1) speechSynthesis dgn voice id-ID online → onstart = suara jalan
  // 2) voices kosong / tak mulai dlm 1.2s → MP3 Google TTS (Audio element, ikut
  //    autoplay sound=Allow) — pola sama dgn antrianTools
  // 3) MP3 gagal (internet mati) → voice lokal sistem (espeak) sbg jaring terakhir
  function playVoice(text: string, onDone: () => void): void {
    let done = false;
    const fin = (): void => {
      if (done) return;
      done = true;
      onDone();
    };
    const speakLocal = (): void => {
      try {
        updateDebugState({ ttsMode: 'local' });
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'id';
        const lv =
          synth
            .getVoices()
            .find((x) => (x.lang || '').toLowerCase().startsWith('id') && x.localService) ||
          synth.getVoices().find((x) => x.localService);
        if (lv) u.voice = lv;
        u.onend = fin;
        u.onerror = fin;
        RealSpeak.call(synth, u);
        setTimeout(fin, 20000);
      } catch {
        updateDebugState({ ttsMode: 'silent' });
        fin();
      }
    };
    const speakMp3 = (): void => {
      try {
        updateDebugState({ ttsMode: 'mp3' });
        const a = new Audio(
          'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=' +
            encodeURIComponent(text),
        );
        a.onended = fin;
        a.onerror = speakLocal;
        void a.play().catch(speakLocal);
        setTimeout(fin, 20000); // pengaman bila onended tak datang
      } catch {
        speakLocal();
      }
    };
    try {
      const u = new SpeechSynthesisUtterance(text);
      updateDebugState({ ttsMode: 'speech' });
      const online = synth
        .getVoices()
        .find((x) => (x.lang || '').toLowerCase().startsWith('id') && !x.localService);
      if (online) u.voice = online;
      u.lang = 'id-ID';
      u.rate = 0.8;
      u.volume = 1;
      let started = false;
      u.onstart = () => {
        started = true;
      };
      u.onend = fin;
      u.onerror = () => {
        if (!started) speakMp3();
        else fin();
      };
      RealSpeak.call(synth, u);
      // speechSynthesis macet (kiosk tanpa gesture): onstart tak akan datang → MP3
      setTimeout(() => {
        if (!started && !synth.speaking) speakMp3();
        else if (!started) setTimeout(() => speakMp3(), 1500); // speaking tp bisu? coba MP3
      }, 1200);
    } catch {
      speakMp3();
    }
  }

  /* numberToWords lokal (bukan import shared → tanpa side-effect global). */
  const N2W_SATUAN = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
    'sepuluh',
    'sebelas',
  ];
  function numberToWords(n: number | string): string {
    const num = Math.abs(Math.trunc(Number(n)));
    if (!Number.isFinite(num)) return String(n);
    const two = (x: number): string => {
      if (x < 12) return N2W_SATUAN[x];
      if (x < 20) return N2W_SATUAN[x - 10] + ' belas';
      if (x < 100)
        return x % 10 === 0
          ? N2W_SATUAN[x / 10] + ' puluh'
          : N2W_SATUAN[Math.trunc(x / 10)] + ' puluh ' + N2W_SATUAN[x % 10];
      return '';
    };
    if (num === 0) return 'nol';
    if (num < 100) return two(num);
    if (num < 1000) {
      const r = num % 100;
      return (
        (num < 200 ? 'seratus' : two(Math.trunc(num / 100)) + ' ratus') + (r ? ' ' + two(r) : '')
      );
    }
    return String(num);
  }

  // Bell sintesis Web Audio ("ding") — pengganti bell bawaan MORBIS (#unine).
  // Keunggulan: bukan audio morbis, durasi terukur sehingga onDone dipanggil
  // tepat saat bell selesai (TTS tidak tumpang-tindih), tanpa file eksternal.
  let bellCtx: AudioContext | null = null;
  function ringBell(onDone: () => void): void {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return onDone();
      bellCtx = bellCtx || new Ctor();
      void bellCtx.resume();
      const now = bellCtx.currentTime;
      // dua nada "ding-ding": E6 lalu A6, tiap nada ~0.28s
      const notes: Array<[number, number]> = [
        [1318.5, now],
        [1760, now + 0.28],
      ];
      for (const [freq, t0] of notes) {
        const osc = bellCtx.createOscillator();
        const g = bellCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        // envelope: naik-cepat lalu decay (suara bell bersih)
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.45, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
        osc.connect(g);
        g.connect(bellCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.32);
      }
      // total durasi bell ~0.6s — onDone TEPAT setelah bell selesai
      const totalMs = 280 + 300 + 80; // nada terakhir berakhir 280+300, +80 buffer
      setTimeout(onDone, totalMs);
    } catch {
      onDone(); // bell gagal → tetap lanjut (jangan blokir voice)
    }
  }

  // Title-case utk pembacaan TTS: Google TTS mengeja huruf jika kata ALL-CAPS
  // (dianggap akronim) → "ELPIANIS" jadi "E L P I A N I S". Buat jadi "Elpianis"
  // utk dibaca natural. HANYA utk ujaran; tampilan card tetap pakai nilai asli.
  function titleCase(s: string): string {
    return s
      .split(/\s+/)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
      .join(' ');
  }

  function announce(row: ViewRow): void {
    // C3 — TTS & bell hanya boleh setelah audio di-unlock via gesture.
    // Tanpa unlock: masalah suara dibiarkan lewat, tidak dipaksa.
    if (!audioUnlocked) {
      console.warn('[FarmasiDisplay] audio belum unlocked — TTS/bell dilewati');
      return;
    }
    // TTS: ucapkan nomor; nama title-case agar TTS membacanya natural (bukan eja).
    const kalimat =
      'Nomor antrian ' +
      numberToWords(row.nomor) +
      (row.namaPasien ? ', atas nama ' + titleCase(String(row.namaPasien)) : '') +
      ', silakan menuju farmasi.';
    // Antrean serial: bell → voice → voice. Panggilan baru yang datang saat yang
    // lama masih berbicara masuk antrean — tidak menimpa (fix klik beruntun).
    queue.push(
      { kind: 'bell' },
      { kind: 'voice', text: kalimat },
      { kind: 'voice', text: kalimat },
    );
    next();
  }

  // C2 — Audio unlock via gesture pengguna pertama. TANPA memanggil
  // speechSynthesis.speak() / utterance kosong untuk "unlock", dan TANPA
  // mengubah/override window.speechSynthesis. Suara hanya diizinkan setelah
  // interaksi (policy autoplay browser).
  let audioUnlocked = false;

  function unlockAudio(): void {
    if (audioUnlocked) return;
    audioUnlocked = true;
    updateDebugState({ audioUnlocked: true });
    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
    console.log('[FarmasiDisplay] audio unlocked via gesture');
  }
  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

  // Auto-unlock utk display kiosk: bila Chrome sound = Allow utk domain,
  // resume AudioContext + speechSynthesis sukses TANPA user-gesture. Coba sekali
  // saat load; sukses → aktifkan audio. Gesture listener tetap sbg fallback.
  // (tanpa sound=Allow, resume tetap gagal output → tidak aktif, aman.)
  (function tryAutoUnlock(): void {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      unlockAudio(); // set audioUnlocked=true (sound=Allow memungkinkan output)
    };
    const run = () => {
      try {
        const Ctor = window.AudioContext;
        if (Ctor) {
          const a = new Ctor();
          a.onstatechange = () => {
            if (a.state === 'running') {
              a.close().catch(() => {});
              finish();
            }
          };
          void a.resume().catch(() => {});
        } else {
          finish(); // tanpa AudioContext, percayai speechSynthesis (fallback)
        }
        // jaring pengaman: kalau resume tidak memberi sinyal, coba speech sekali
        window.setTimeout(() => {
          if (done) return;
          try {
            const u = new SpeechSynthesisUtterance(' ');
            const s = window.speechSynthesis;
            s.speak(u);
            window.setTimeout(() => {
              s.cancel();
              if (audioUnlocked === false) finish();
            }, 250);
          } catch {
            finish();
          }
        }, 400);
      } catch {
        finish();
      }
    };
    if (document.readyState !== 'loading') run();
    else document.addEventListener('DOMContentLoaded', run);
  })();

  /* ============================================================
   * C1 — WS-health monitor (probe aktivitas DOM native, baca-only).
   *
   * MORBIS = source of truth, WebSocket = jalur utama. Extension TIDAK
   * meletakkan tangan di window.WebSocket; ia "mengamati". Jika display
   * native terus berubah → WS sehat → extension DIAM (MODE 1 / NATIVE,
   * tak polling, tak sentuh DOM). Jika native membeku ~STALE_MAX pengamatan
   * → WS dianggap mati → hidupkan polling fallback (MODE 2).
   *
   * Mesin status ada di shared/wsHealth.ts (murni, bisa diuji unit):
   * membedakan perubahan DOM hasil tulis extension (`we-wrote`) dari
   * perubahan eksternal/native (recovery) → tanpa feedback-loop.
   * ============================================================ */
  let voiceEnabled = false;
  let started = false; // idempotency: cegah watcher/listener/polling ganda
  let watchTimer: ReturnType<typeof setInterval> | null = null;
  let pollTimer: number | null = null;
  let cardTimer: ReturnType<typeof setInterval> | null = null;
  const healthCfg = { staleMax: STALE_MAX };
  // State mesin; nativeActive awal true → percaya WS hidup, jangan polling.
  let health: HealthState = { nativeActive: true, staleStreak: 0, nativeSig: '', ourSig: '' };

  // Observability — debug SNAPSHOT (hanya jika ?debug=1). Debug tidak
  // pernah menjadi sumber kebenaran perilaku; ia hanya cermin state internal.
  const debugEnabled = new URLSearchParams(window.location.search).get('debug') === '1';
  const debugState: AntrianFarmasiDebugState = {
    started: false,
    mode: 'NATIVE',
    nativeActive: true,
    pollingActive: false,
    lastNativeActivity: null,
    lastPoll: null,
    lastDataCount: null,
    lastAnnouncement: null,
    audioUnlocked: false,
    ttsMode: null,
  };
  function updateDebugState(patch: Partial<AntrianFarmasiDebugState>): void {
    if (!debugEnabled) return;
    Object.assign(debugState, patch);
    window.__ANTRIAN_FARMASI_DEBUG__ = { ...debugState };
  }

  // Signal aktivitas DOM (read-only; tidak mengubah apa pun).
  function domSignal(): string {
    const p = document.querySelector<HTMLElement>(PANGGILAN_SEL);
    const s = document.querySelector<HTMLElement>(SIAP_SEL);
    return (p ? (p.textContent ?? '') : '') + '|' + (s ? (s.textContent ?? '') : '');
  }

  // dispatch: tandai extension baru saja menulis DOM (dipanggil renderDisplay).
  function onWeWrote(): void {
    health = nextHealth(health, { type: 'we-wrote', signal: domSignal() }, healthCfg).next;
  }

  function stopPolling(): void {
    if (pollTimer) {
      window.clearTimeout(pollTimer);
      pollTimer = null;
    }
  }

  function schedulePoll(): void {
    if (health.nativeActive || pollTimer) return;
    if (!voiceEnabled) return; // belum role → jangan polling
    pollTimer = window.setTimeout(() => void pollFallback(), POLL_LADDER_MS[ladderIdx]);
  }

  // MODE 2 — polling fallback: hanya jalan saat native membeku.
  let ladderIdx = 0;
  async function pollFallback(): Promise<void> {
    pollTimer = null;
    try {
      // Satu fetch ?section=isi memberi current-number (nomor aktif) + nama
      // pasien (tabel antrian) — sinkron, tanpa race. data_call tetap dipakai
      // untuk daftar SIAP DIAMBIL (normalize).
      const [{ current: cur, patients }, rows] = await Promise.all([
        fetchCurrentNumber(),
        fetchCallData(),
      ]);
      ladderIdx = 0; // sukses → reset backoff ke anak tangga awal
      updateDebugState({ lastPoll: Date.now(), lastDataCount: rows.length });
      lastRows = rows; // simpan utk seed card dua-bagian (status MORBIS tak reliable)

      // Hanya sentuh DOM bila ada data valid; []/gagal → pertahankan DOM native.
      const view = normalize(rows);
      const num = activeNumber(cur);

      // Nomor current MORBIS per jenis (counter 1 = Non Racikan/tunggal,
      // counter 2 = Racikan). '0'/kosong = belum ada panggilan → card tampil '—'.
      const g1 = cur.get('1')?.trim();
      const g2 = cur.get('2')?.trim();
      currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
      currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';

      const sig =
        num !== ''
          ? [...cur.entries()]
              .filter(([, v]) => v === num)
              .map(([c]) => c + ':' + num)
              .join('|')
          : '';

      if (num !== '') {
        // Nama pasien: PRIORITAS dari DOM #list-content (halaman view-call,
        // fresh real-time dari WebSocket native) → fallback tabel ?section=isi
        // (parsePatients) → fallback data_call (matchPatient).
        const domNames = parseListContentPatient(document.querySelector('#list-content'));
        let pr = domNames.get(num);
        if (!pr || !pr.nama) pr = patients.get(num);
        const mPat = matchPatient(rows, num);
        const call: ViewRow = {
          id: 'cur-' + num,
          nomor: num,
          kode: (pr && pr.kode) || mPat?.kode || '',
          namaPasien: (pr && pr.nama) || mPat?.namaPasien || '',
          unit: mPat?.unit || '',
          jenis: mPat?.jenis || 'tunggal',
          rm: mPat?.rm || '',
        };
        if (!baselineSet) {
          // Poll pertama: tampilkan panggilan aktif saat ini TANPA announce
          // (bukan panggilan baru — hanya kondisi awal layar / display dibuka ulang).
          baselineSet = true;
          currentCall = call;
          prevCurrent.clear();
          for (const [c, v] of cur) prevCurrent.set(c, v);
          renderDisplay(view, currentCall);
        } else if (sig !== announcedSig && isNewCurrent(cur)) {
          if (isReset(cur, prevCurrent)) {
            // Reset antrian (tombol "Reset Antrian" di halaman manajemen):
            // current-number turun drastis — BUKAN panggilan baru. Update
            // baseline & tampilkan, tanpa announce (fix 2026-08-12).
            currentCall = call;
            prevCurrent.clear();
            for (const [c, v] of cur) prevCurrent.set(c, v);
            renderDisplay(view, currentCall);
          } else {
            // current-number berubah antar poll = klik "Selanjutnya" → panggilan baru.
            announcedSig = sig;
            currentCall = call;
            prevCurrent.clear();
            for (const [c, v] of cur) prevCurrent.set(c, v);
            renderDisplay(view, currentCall);
            maybeAnnounce(view, currentCall);
          }
        } else {
          // Tidak ada panggilan baru → pertahankan panggilan aktif, tapi
          // refresh panel SIAP DIAMBIL. prevCurrent tetap disinkronkan.
          prevCurrent.clear();
          for (const [c, v] of cur) prevCurrent.set(c, v);
          if (currentCall) renderDisplay(view, currentCall);
          else {
            currentCall = call;
            renderDisplay(view, currentCall);
          }
        }
      } else if (view.siapDiambil.length > 0) {
        // Tidak ada panggilan aktif saat ini; tampilkan hanya SIAP DIAMBIL.
        if (currentCall) renderDisplay(view, currentCall);
      }
    } catch (error) {
      // API error / HTML / ORA / [] → transport uncertainty, JANGAN ubah DOM.
      ladderIdx = Math.min(ladderIdx + 1, POLL_LADDER_MS.length - 1);
      console.warn(
        '[FarmasiDisplay] fallback gagal (backoff ' + POLL_LADDER_MS[ladderIdx] + 'ms):',
        error,
      );
    } finally {
      schedulePoll(); // lanjut polling berikutnya (dengan adaptive backoff)
    }
  }

  // Apakah current-number berubah dibanding poll sebelumnya? Perubahan = panggilan
  // baru. Baseline pertama (prevCurrent kosong) → false (jangan announce).
  function isNewCurrent(cur: Map<string, string>): boolean {
    if (prevCurrent.size === 0) return false;
    for (const [c, v] of cur) {
      if (prevCurrent.get(c) !== v) return true;
    }
    return false;
  }

  // Cocokkan nomor aktif ke record data_call: COUNTER == nomor (preferensi),
  // fallback NOMOR == nomor. Status STATUS_PANGGIL tidak dipakai sebagai filter —
  // data_call bisa basi; current-number adalah sumber kebenaran urutan panggil.
  function matchPatient(rows: RawRow[], nomor: string): ViewRow | null {
    const byCounter = rows.find(
      (r) => r && r.COUNTER != null && String(r.COUNTER).trim() === nomor,
    );
    const hit =
      byCounter ?? rows.find((r) => r && r.NOMOR != null && String(r.NOMOR).trim() === nomor);
    return hit ? toViewRow(hit) : null;
  }

  // TTS: dedup signature (dipanggil bila ada panggilan baru). audioUnlocked header
  // di announce(). Observability: log ANNOUNCE hanya saat benar-benar bicara, dan
  // duplicate ignored saat signature sama — tidak log data pasien, cukup signature.
  function maybeAnnounce(view: QueueView, call: ViewRow): void {
    if (!voiceEnabled) return;
    if (call.id === announcedSig) {
      console.info('[AFD] duplicate ignored ' + announcedSig);
      return;
    }
    announcedSig = call.id;
    updateDebugState({ lastAnnouncement: announcedSig });
    console.info('[AFD] ANNOUNCE ' + announcedSig);
    announce(call);
  }

  // MODE 1/2 switch — pengamatan aktivitas DOM native (tiap WATCH_MS).
  // Observability: hanya UPDATE debug snapshot + log SATU KALI saat mode berubah.
  let lastMode: 'NATIVE' | 'FALLBACK' = 'NATIVE';
  function watch(): void {
    const result = nextHealth(health, { type: 'observe', signal: domSignal() }, healthCfg);
    health = result.next;

    if (result.startPolling) {
      // Native membeku → mulai fallback polling (MODE 2).
      ladderIdx = 0;
      schedulePoll();
      if (lastMode !== 'FALLBACK') {
        lastMode = 'FALLBACK';
        console.info('[AFD] MODE=FALLBACK');
      }
      updateDebugState({ mode: 'FALLBACK', nativeActive: false, pollingActive: true });
    } else if (result.stopPolling) {
      // Native hidup kembali → hentikan polling (kembali MODE 1).
      stopPolling();
      if (lastMode !== 'NATIVE') {
        lastMode = 'NATIVE';
        console.info('[AFD] MODE=NATIVE');
      }
      updateDebugState({
        mode: 'NATIVE',
        nativeActive: true,
        pollingActive: false,
        lastNativeActivity: Date.now(),
      });
    } else if (!health.nativeActive && lastMode !== 'FALLBACK') {
      // Fallback berjalan diam-diam; pastikan snapshot konsisten dengan mode.
      lastMode = 'FALLBACK';
      updateDebugState({ mode: 'FALLBACK', nativeActive: false, pollingActive: true });
    }
  }

  /* ============================================================
   * START — SELURUH fitur.
   * Self-gated oleh manifest (hanya disuntik pada halaman display
   * antrian farmasi). startWithRole idempotent; dipanggil langsung
   * begitu skrip load, tanpa menunggu init.ts.
   * ============================================================ */
  function startWithRole(): void {
    if (started) return; // idempotent: jangan buat watcher/listener/polling ganda
    started = true;
    updateDebugState({ started: true });
    ensureStatusBadge(); // pastikan badge status ada sedari awal (loading)
    ensureToolbar(); // tombol Tes Suara & Full Screen
    setStatus('loading');

    voiceEnabled = true; // suara hanya untuk role terotorisasi; TTS native tidak dioverride
    health = { ...health, nativeSig: domSignal() }; // baseline aktivitas native awal
    if (watchTimer === null) {
      // pengamatan aktivitas DOM native; polling fallback baru menyala bila native membeku
      watchTimer = setInterval(watch, WATCH_MS);
    }
    if (cardTimer === null) {
      // segarkan angka card + highlight cepat (~1s) biar responsif setelah Selanjutnya
      cardTimer = setInterval(() => void refreshCardNumber(), CARD_MS);
      void refreshCardNumber(); // render pertama segera
    }
  }

  /* ============================================================
   * START — self-gated oleh manifest itu sendiri.
   * Skrip ini HANYA disuntik pada halaman display antrian farmasi
   * (pola matches view-call-websocet-v2 di manifest.json).
   * Kehadiran skrip di halaman sudah menjadi validasi cukup —
   * halaman display ini PUBLIK dan TIDAK me-load init.ts, sehingga
   * attribute data-ext-antrian-farmasi tidak pernah dibuat di sini.
   * Self-gate menghilangkan ketergantungan pada producer yang tidak
   * ikut dimuat (root cause started:false).
   * wsHealth/polling/TTS TIDAK disentuh; hanya gate yang diubah.
   * ============================================================ */
  startWithRole(); // idempotent (guard started) — tidak ada dobel watcher/listener
})();
