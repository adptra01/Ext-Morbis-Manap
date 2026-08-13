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
import { renumberFarmasi } from './shared/farmasiRenumber';

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
  const POLL_LADDER_MS = [600, 2000, 5000, 10000];
  const GAP_MS = 400;
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
  const PANGGILAN_SEL = '#antrian-view';
  const SIAP_SEL = '#antrian-penyerahan';

  // Seksi panggilan per jenis (card atas = Obat Tunggal, bawah = Obat Racikan).
  function seksiJenis(label: string, r: ViewRow | null): string {
    if (!r)
      return '<div class="antrian-title">' + label + '</div><div class="antrian-nomor">—</div>';
    // primary: ID baris → R-xx/T-xx (tak bentrok); fallback nomor(counter).
    const disp =
      renumberById.get(r.id) ||
      renumberByNomor.get(r.nomor) ||
      (r.kode ? r.kode + '-' + r.nomor : r.nomor);
    return (
      '<div class="antrian-title">' +
      label +
      '</div>' +
      '<div class="antrian-nomor">' +
      disp +
      '</div>' +
      '<div class="antrian-rm">' +
      r.namaPasien +
      '</div>'
    );
  }

  // Highlight baris tabel #list-content yang namanya cocok dengan pasien dipanggil.
  // Cocokkan nama (dd.col-3) atau nomor (h4 BT-{nomor}); nama diprioritaskan.
  function highlightCalledRow(nama: string, nomor: string): void {
    const lc = document.querySelector('#list-content');
    if (!lc) return;
    const lines = lc.querySelectorAll('dl');
    for (const dl of lines) {
      const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
      const d = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
      const h4 = dl.querySelector('h4');
      const idTxt = (h4?.textContent || '').trim();
      const match = (nama && d.includes(nama)) || (nomor && idTxt.includes(nomor));
      (dl as HTMLElement).style.background = match ? '#fde68a' : '';
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
      if (atas) atas.innerHTML = seksiJenis('Obat Tunggal', lastByJenis.tunggal);
      const bawah = document.querySelector<HTMLElement>(SIAP_SEL);
      if (bawah) bawah.innerHTML = seksiJenis('Obat Racikan', lastByJenis.racikan);
      highlightCalledRow(call.namaPasien, call.nomor); // tandai baris dipanggil
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

  // Nomor rapi per baris (R-xx / T-xx) — diisi dari renumber data_call saat poll,
  // dipakai render card & highlight agar konsisten dengan tiket cetak.
  const renumberByNomor = new Map<string, string>(); // key = nomor(counter) → R-xx/T-xx (fallback)
  const renumberById = new Map<string, string>(); // key = ID baris data_call → R-xx/T-xx (primary)
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
    try {
      const u = new SpeechSynthesisUtterance(item.text);
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

  function announce(row: ViewRow): void {
    // C3 — TTS & bell hanya boleh setelah audio di-unlock via gesture.
    // Tanpa unlock: masalah suara dibiarkan lewat, tidak dipaksa.
    if (!audioUnlocked) {
      console.warn('[FarmasiDisplay] audio belum unlocked — TTS/bell dilewati');
      return;
    }
    // TTS: ucapkan nomor; segmen nama hanya bila ada (data_call bisa tak punya
    // record utk nomor yg ekstensi anggap aktif — server penomoran tak berurutan).
    // Log cadangan utk diagnosa: announce dengan nama kosong ≠ kegagalan, tp layak dicatat.
    const kalimat =
      'Nomor antrian ' +
      numberToWords(row.nomor) +
      (row.namaPasien ? ', atas nama ' + row.namaPasien : '') +
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

      // Bangun map nomor(counter)→R-xx/T-xx dari renumber data_call, utk card &
      // highlight konsisten dengan tiket cetak (Penerbitan Antrian).
      renumberByNomor.clear();
      renumberById.clear();
      const rr = renumberFarmasi(
        rows.map((r) => ({
          id: String(r.ID ?? ''),
          jenis: (r.JENIS as string | null) ?? null,
          status: (r.STATUS as string | null) ?? null,
          waktu: (r.WAKTU as string | null) ?? null,
        })),
      );
      // primary: ID baris → kode (tidak bentrok — meski banyak baris share COUNTER)
      for (const [id, kode] of rr.byId) renumberById.set(id, kode);
      // fallback: nomor(counter) → kode
      for (const row of rows) {
        const n =
          row.COUNTER != null ? String(row.COUNTER) : row.NOMOR != null ? String(row.NOMOR) : '';
        if (n && rr.byId.has(String(row.ID))) renumberByNomor.set(n, rr.byId.get(String(row.ID))!);
      }

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

    voiceEnabled = true; // suara hanya untuk role terotorisasi; TTS native tidak dioverride
    health = { ...health, nativeSig: domSignal() }; // baseline aktivitas native awal
    if (watchTimer === null) {
      // pengamatan aktivitas DOM native; polling fallback baru menyala bila native membeku
      watchTimer = setInterval(watch, WATCH_MS);
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
