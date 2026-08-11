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
 * Prinsip keamanan (P0/P1):
 *   - Data VALID         → normalize → render PANGGILAN & SIAP DIAMBIL
 *   - [] kosong / error  → PERTAHANKAN DOM native (jangan timpa dengan "tidak ada",
 *                          jangan tampilkan pesan error). Extension tidak menghapus
 *                          tampilan native MORBIS; polling/backoff terus jalan.
 *   - STATUS=0           → VALID panggilan aktif per backend (WHERE pap.status=0); bukan batal
 *   - STATUS=1           → siap diambil
 *   - STATUS lain        → baris diabaikan (jangan salah klasifikasi)
 *   - nomor baru         → bell lalu TTS "silakan menuju farmasi" 2×
 *   - nomor sama         → jangan panggil ulang (anti double)
 *   - WebSocket/Swal/speechSynthesis native → BIARKAN normal; extension TIDAK
 *     override/stub/suppress (jangan ambil alih mekanisme MORBIS)
 *
 * Gating: RENDER selalu ON (stabilizer polling → kebenaran MORBIS, jangan sampai
 * kiosk rawan blank). TTS suara hanya bila role apotek (allowedRoles: ['apotek'])
 * → gate data-ext-antrian-farmasi di init.ts aktif.
 */
import { pickAnnounce } from './shared/queueRule';

(function () {
  const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  const POLL_MS = 5000;
  const MAX_BACKOFF_MS = 60000;
  const CALL_DELAY_MS = 1200; // jeda bell sebelum voice
  const GAP_MS = 400;

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
  function renderDisplay(view: QueueView): void {
    if (view.panggilan.length > 0) {
      const p = document.querySelector<HTMLElement>(PANGGILAN_SEL);
      if (p) p.innerHTML = panelHtml('Panggilan Farmasi', view.panggilan);
    }
    if (view.siapDiambil.length > 0) {
      const s = document.querySelector<HTMLElement>(SIAP_SEL);
      if (s) s.innerHTML = panelHtml('Siap Diambil', view.siapDiambil);
    }
  }

  /* ============================================================
   * Queue State
   * ============================================================ */
  let announcedId = '';

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

  function unlockTts(): void {
    const unlock = (): void => {
      try {
        synth.getVoices();
        RealSpeak.call(synth, new SpeechSynthesisUtterance(''));
      } catch {
        /* ignore */
      }
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  }

  /* ============================================================
   * Queue Controller — polling backoff + dedup + render.
   * RENDER selalu jalan; TTS hanya bila `voiceEnabled`.
   * ============================================================ */
  let voiceEnabled = false;
  let timer: number | null = null;
  let backoff = POLL_MS;

  function schedule(): void {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => void tick(), backoff);
  }

  async function tick(): Promise<void> {
    try {
      const rows = await fetchCallData();
      backoff = POLL_MS; // sukses → reset

      // P1: hanya sentuh DOM bila ada data valid untuk ditampilkan. [] atau
      // respons gagal → pertahankan tampilan native/DOM terakhir.
      const view = normalize(rows);
      if (view.panggilan.length > 0 || view.siapDiambil.length > 0) {
        renderDisplay(view);
      }

      // TTS: hanya panggilan TERBARU dari panel panggilan, dan hanya bila voice aktif.
      if (voiceEnabled && view.panggilan.length > 0) {
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
    } catch (error) {
      // API error / HTML / ORA → PERTAHANKAN DOM (jangan hapus tampilan native),
      // hanya perbesar backoff + log. Extension tidak memperparah masalah.
      backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
      console.warn('[FarmasiDisplay] data_call gagal (backoff ' + backoff + 'ms):', error);
    }
    schedule();
  }

  /* ============================================================
   * START — SELURUH fitur tergate role apotek.
   * Tanpa gate data-ext-antrian-farmasi (role != apotek) → tidak
   * ada render, tidak ada TTS, tidak ada polling. Board tetap
   * kosong (bukan error palsu; memang tidak diizinkan akses).
   * ============================================================ */
  function startWithRole(): void {
    // Voice diaktifkan bila role apotek terotorisasi. Native speechSynthesis
    // TIDAK dioverride — extension hanya menambah ucapan, tidak mengambil alih.
    voiceEnabled = true;
    unlockTts();
    void tick(); // mulai render + polling hanya saat role terotorisasi
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
