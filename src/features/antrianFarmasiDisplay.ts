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
 *   - STATUS=0               → VALID panggilan aktif (WHERE pap.status=0); bukan batal
 *   - STATUS=1               → siap diambil; STATUS lain → row diabaikan
 *   - nomor baru             → bell lalu TTS (dedup signature ⇒ satu kali)
 *   - WebSocket/Swal/speechSynthesis native → BIARKAN normal; extension TIDAK
 *     override/stub/suppress apa pun dari ketiganya.
 *   - Audio unlock via gesture pengguna (audioUnlocked); TTS TANPA unlock → tidak bicara
 *
 * Gating: fitur aktif hanya bila role apotek (allowedRoles: ['apotek']) →
 * gate data-ext-antrian-farmasi di init.ts.
 */
import { pickAnnounce } from './shared/queueRule';
import { nextHealth, type HealthState } from './shared/wsHealth';

(function () {
  const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  // Adaptive backoff polling fallback (hanya saat native membeku): setiap gagal naik
  // satu anak tangga, reset ke awal setelah berhasil.
  const POLL_LADDER_MS = [3000, 5000, 10000, 15000];
  const CALL_DELAY_MS = 1200; // jeda bell sebelum voice
  const GAP_MS = 400;

  // C1 — WS-health via probe aktivitas DOM native (baca-only). Bukan instrumentasi
  // window.WebSocket; extension "mengamati", bukan "mengambil alih".
  const WATCH_MS = 3000; // periodik baca signal DOM native
  const STALE_MAX = 4; // 4× diam berturut-turut ≈ 12s → anggap WS mati, mulai polling

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
    NAMA?: string;
    NAMA_PASIEN?: string;
    NAMA_UNIT?: string;
    JENIS?: string;
    ID_PASIEN?: string | number;
    LOKET?: string | number;
    STATUS?: string | number;
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
   * API Adapter — fetch data_call, validasi ketat.
   * ============================================================ */
  async function fetchCallData(): Promise<RawRow[]> {
    const res = await fetch(LIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=data_call',
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

  /* ============================================================
   * Normalize — pemetaan eksplisit struktur backend.
   *   STATUS=0   → kontrak merepresentasikan panggilan aktif ("sedang dipanggil")
   *   WAKTU_PENERIMAAN ada → "SIAP DIAMBIL"
   * Karena endpoint data_call tidak memberi WAKTU_PENERIMAAN, panel SIAP DIAMBIL
   * diisi baris yang bukan STATUS=0 (penyerahan). Jika backend berubah, ini titik
   * satu-satunya yang perlu disesuaikan.
   * ============================================================ */
  function normalize(rows: RawRow[]): QueueView {
    const panggilan: ViewRow[] = [];
    const siapDiambil: ViewRow[] = [];
    for (const r of rows) {
      if (!r || r.ID == null) continue; // jangan render baris tanpa ID
      const v: ViewRow = {
        id: String(r.ID),
        nomor: r.COUNTER != null ? String(r.COUNTER) : r.NOMOR != null ? String(r.NOMOR) : '',
        kode: r.NAMA || 'BT',
        namaPasien: r.NAMA_PASIEN ?? '',
        unit: r.NAMA_UNIT ?? '',
        jenis: r.JENIS === 'tunggal' ? 'tunggal' : 'racikan',
        rm: r.ID_PASIEN != null ? String(r.ID_PASIEN) : '',
      };
      // STATUS dari backend (antrian_penjualan.status, dipetakan ke STATUS_PANGGIL).
      // STATUS=0 → panggilan aktif (VALID per kontrak backend WHERE pap.status=0, BUKAN batal).
      // STATUS=1 → sudah dipanggil / siap diambil (penyerahan).
      // Nilai lain/appear tersamar → abaikan row (jangan salah klasifikasi ke salah satu panel).
      const st = String(r.STATUS).trim();
      if (st === '0') panggilan.push(v);
      else if (st === '1') siapDiambil.push(v);
      // status lain: lewati
    }
    return { panggilan, siapDiambil };
  }

  /* ============================================================
   * Display — render DOM, bedakan 3 kondisi (no data / error / ada).
   * ============================================================ */
  const PANGGILAN_SEL = '#antrian-view';
  const SIAP_SEL = '#antrian-penyerahan';

  function panelHtml(title: string, rows: ViewRow[]): string {
    const r = rows[0]; // panel tunggal: tampilkan panggilan terbaru
    return (
      '<div class="antrian-title">' +
      title +
      '</div>' +
      '<div class="antrian-nomor">' +
      r.kode +
      '-' +
      r.nomor +
      '</div>' +
      '<div class="antrian-rm">' +
      r.namaPasien +
      '</div>' +
      '<div class="antrian-rm">' +
      (r.unit || 'RM : ' + r.rm) +
      '</div>' +
      '<img class="antrian-icon" src="/assets/antrian/assets/img/thumb.svg" alt="icon">'
    );
  }

  // P1: HANYA mengubah DOM bila panel punya data valid. Kalau panel kosong
  // (atau API gagal), DOM di-biarkan apa adanya — extension TIDAK menghapus/
  // menimpa tampilan native. Empty/error = jangan sentuh display.
  //
  // Setelah menulis DOM, beri tahu mesin kesehatan via `onWeWrote()` supaya
  // write extension tidak dianggap sebagai "native recovery" (anti feedback-loop).
  function renderDisplay(view: QueueView): void {
    if (view.panggilan.length > 0) {
      const p = document.querySelector<HTMLElement>(PANGGILAN_SEL);
      if (p) p.innerHTML = panelHtml('Panggilan Farmasi', view.panggilan);
    }
    if (view.siapDiambil.length > 0) {
      const s = document.querySelector<HTMLElement>(SIAP_SEL);
      if (s) s.innerHTML = panelHtml('Siap Diambil', view.siapDiambil);
    }
    onWeWrote(); // tandai DOM yang BARU SAJA extension tulis (bukan native)
  }

  /* ============================================================
   * Queue State
   * ============================================================ */
  let announcedId = ''; // signature `${ID}-${COUNTER}` terakhir yang di-announce (dedup)

  /* ============================================================
   * TTS (role-gated). Bell asli MORBIS (audio #unine) dipicu karena
   * suara bell menandai pergantian sebelum voice.
   * ============================================================ */
  const synth = window.speechSynthesis;
  const RealSpeak = synth.speak.bind(synth);
  let busy = false;
  const queue: string[] = [];

  function next(): void {
    if (busy || queue.length === 0) return;
    busy = true;
    const text = queue.shift()!;
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      busy = false;
      setTimeout(() => next(), GAP_MS);
    };
    try {
      const u = new SpeechSynthesisUtterance(text);
      const v = synth.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith('id'));
      if (v) u.voice = v;
      u.lang = 'id-ID';
      u.rate = 0.8;
      u.volume = 1;
      u.onend = finish;
      u.onerror = finish;
      RealSpeak.call(synth, u);
      setTimeout(finish, 20000);
    } catch {
      finish();
    }
  }
  function speak(text: string): void {
    queue.push(text);
    next();
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

  function ringBell(): void {
    try {
      const audio = document.getElementById('unine') as HTMLAudioElement | null;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        void audio.play().catch(() => {
          /* bell diblokir tanpa gesture; voice tetap jalan */
        });
      }
    } catch {
      /* ignore */
    }
  }

  function announce(row: ViewRow): void {
    // C3 — TTS & bell hanya boleh setelah audio di-unlock via gesture.
    // Tanpa unlock: masalah suara dibiarkan lewat, tidak dipaksa.
    if (!audioUnlocked) {
      console.warn('[FarmasiDisplay] audio belum unlocked — TTS/bell dilewati');
      return;
    }
    const kalimat =
      'Nomor antrian ' +
      numberToWords(row.nomor) +
      ', atas nama ' +
      (row.namaPasien || '') +
      ', silakan menuju farmasi.';
    ringBell();
    setTimeout(() => {
      speak(kalimat);
      speak(kalimat);
    }, CALL_DELAY_MS);
  }

  // C2 — Audio unlock via gesture pengguna pertama. TANPA memanggil
  // speechSynthesis.speak() / utterance kosong untuk "unlock", dan TANPA
  // mengubah/override window.speechSynthesis. Suara hanya diizinkan setelah
  // interaksi (policy autoplay browser).
  let audioUnlocked = false;

  function unlockAudio(): void {
    if (audioUnlocked) return;
    audioUnlocked = true;
    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
    console.log('[FarmasiDisplay] audio unlocked via gesture');
  }
  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

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
  let pollTimer: number | null = null;
  const healthCfg = { staleMax: STALE_MAX };
  // State mesin; nativeActive awal true → percaya WS hidup, jangan polling.
  let health: HealthState = { nativeActive: true, staleStreak: 0, nativeSig: '', ourSig: '' };

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
      const rows = await fetchCallData();
      ladderIdx = 0; // sukses → reset backoff ke anak tangga awal

      // Hanya sentuh DOM bila ada data valid; []/gagal → pertahankan DOM native.
      const view = normalize(rows);
      if (view.panggilan.length > 0 || view.siapDiambil.length > 0) {
        renderDisplay(view);
        maybeAnnounce(view);
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

  // TTS: dedup signature (dipanggil bila ada data baru). audioUnlocked header di announce().
  function maybeAnnounce(view: QueueView): void {
    if (!voiceEnabled || view.panggilan.length === 0) return;
    const { row, signature } = pickAnnounce(
      view.panggilan.map((r) => ({
        ID: r.id,
        NOMOR: r.nomor,
        COUNTER: r.nomor,
        NAMA_PASIEN: r.namaPasien,
      })),
      announcedId,
    );
    if (row && signature) {
      announcedId = signature;
      const hit = view.panggilan.find((x) => x.id === row.ID);
      if (hit) announce(hit);
    }
  }

  // MODE 1/2 switch — pengamatan aktivitas DOM native (tiap WATCH_MS).
  function watch(): void {
    const result = nextHealth(health, { type: 'observe', signal: domSignal() }, healthCfg);
    health = result.next;
    if (result.startPolling) {
      // Native membeku → mulai fallback polling (MODE 2).
      ladderIdx = 0;
      schedulePoll();
    } else if (result.stopPolling) {
      // Native hidup kembali → hentikan polling (kembali MODE 1).
      stopPolling();
    }
  }

  /* ============================================================
   * START — SELURUH fitur tergate role apotek.
   * Tanpa gate data-ext-antrian-farmasi (role != apotek) → tidak
   * ada render, tidak ada TTS, tidak ada polling. Board dibiarkan
   * sesuai native MORBIS.
   * ============================================================ */
  function startWithRole(): void {
    voiceEnabled = true; // suara hanya untuk role terotorisasi; TTS native tidak dioverride
    health = { ...health, nativeSig: domSignal() }; // baseline aktivitas native awal
    window.setInterval(watch, WATCH_MS); // pengamatan WS; polling baru bila native membeku
  }

  // Gate di-set init.ts di document_end (hanya bila role apotek + enabled).
  const gateTimer = setInterval(() => {
    if (document.documentElement.getAttribute('data-ext-antrian-farmasi') === '1') {
      clearInterval(gateTimer);
      startWithRole();
    }
  }, 200);
  setTimeout(() => clearInterval(gateTimer), 8000);
})();
