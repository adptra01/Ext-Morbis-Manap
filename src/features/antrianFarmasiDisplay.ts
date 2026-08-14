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
// Display jalan di world MAIN tanpa chrome.runtime → akses QueueManager via
// bridge (postMessage ke isolated world) — getQueueState/issuePending bridge.
import { issuePending } from './shared/farmasiQueueBridge';
import { getTicket } from './shared/farmasiQueue';
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
  // TTS observability: engine yang benar-benar dipakai, error terakhir, jumlah
  // percobaan, dan pasien/nomor yang TERAKHIR dipanggil (state recall).
  ttsMode: 'speech' | 'mp3' | 'local' | 'error' | null;
  ttsEngine: string | null;
  ttsLastError: string | null;
  ttsAttempts: number;
  lastCalledPatient: string | null;
  lastCalledNumber: string | null;
  lastTtsStart: number | null;
  lastTtsEnd: number | null;
  lastRealtimeEvent: string | null;
  // Trace fase TTS layer-0: start→recv→blob:N→audio-new→canplay→play→end:reason
  ttsTrace: string[] | null;
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
      updateDebugState({
        ttsMode: null,
        ttsEngine: null,
        ttsLastError: null,
        ttsAttempts: 0,
        lastTtsStart: null,
        lastTtsEnd: null,
      });
      // Tes Suara = bell + TTS kalimat pendek Bahasa Indonesia (bukan "99").
      // Bell dan TTS diuji TERPISAH: bell sukses ≠ TTS sukses (debug mencatat
      // engine yang benar-benar dipakai / alasan semua engine gagal).
      queue.push({ kind: 'bell' }, { kind: 'voice', text: 'Tes suara antrian farmasi.' });
      next();
      // reset badge ke SIAP setelah announce selesai bicara (~5-6 detik)
      window.setTimeout(() => setStatus('ok'), 6000);
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

  // Cache kode publik (id → T-xx/R-xx, frozen dari QueueManager). Sumber nomor
  // yang SAMA dengan kertas cetak (farmasiIssue) & panggilan (display/TTS).
  let renumberCache = new Map<string, string>();
  // Urutan nomor publik per jenis (num naik, id belum-selesai) — fallback card
  // saat current MORBIS gap (angka tak match baris). Mengekor keputusan
  // "kelola sendiri": display menampilkan nomor publik antrian berikutnya.
  const nextToCallByJenis: Record<'tunggal' | 'racikan', string> = { tunggal: '', racikan: '' };
  async function updateRenumber(rows: RawRow[]): Promise<void> {
    const { state: st } = await issuePending(
      rows.map((r) => ({
        id: String(r.ID ?? ''),
        jenis: (r.JENIS as string | null) ?? null,
        waktu: (r.WAKTU as string | null) ?? null,
        // display tahu kapan baris selesai (WAKTU_PENYERAHAN) — skip utk next-to-call
        selesai: (r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '') || false,
      })),
    );
    const next = new Map<string, string>();
    for (const r of rows) {
      const id = String(r.ID ?? '');
      const t = getTicket(st, id);
      if (t) next.set(id, t.code);
    }
    renumberCache = next;
    // seed nomor publik terkecil (berikutnya) per jenis dari baris belum-selesai
    for (const j of ['tunggal', 'racikan'] as const) {
      nextToCallByJenis[j] = '';
      const isR = j === 'racikan';
      const min = rows
        .filter(
          (r) =>
            r &&
            String(r.ID ?? '') !== '' &&
            (r.WAKTU_PENYERAHAN == null || String(r.WAKTU_PENYERAHAN).trim() === '') &&
            (isR ? /racik/i.test(String(r.JENIS ?? '')) : !/racik/i.test(String(r.JENIS ?? ''))) &&
            next.get(String(r.ID ?? '')),
        )
        // ambil tiket dgn num terkecil
        // (diakses via st pakai id — num tersimpan di st)
        .map((r) => ({
          id: String(r.ID ?? ''),
          num: getTicket(st, String(r.ID ?? ''))?.num ?? Infinity,
        }))
        .sort((a, b) => a.num - b.num)[0];
      if (min) nextToCallByJenis[j] = next.get(min.id) ?? '';
    }
  }

  // Nomor TAMPILAN per jenis: NOMOR MORBIS → kode publik (T-42/R-42) agar cocok
  // dengan kertas. Sudah berbentuk kode → biarkan. Baris tak ditemukan (selesai/
  // hilang dari data_call / gap MORBIS) → fallback nomor publik antrian berikutnya
  // per jenis (kelola sendiri) — BUKAN nomor MORBIS asli.
  function kodeTampil(jenis: 'tunggal' | 'racikan', num: string): string {
    if (!num || num === '0') return num;
    if (/^[TR]-\d+$/.test(num)) return num;
    const isR = jenis === 'racikan';
    const row = lastRows.find(
      (r) =>
        (isR ? /racik/i.test(String(r.JENIS ?? '')) : !/racik/i.test(String(r.JENIS ?? ''))) &&
        (String(r.NOMOR ?? '') === num || String(r.COUNTER ?? '') === num),
    );
    if (row) return renumberCache.get(String(row.ID ?? '')) ?? nextToCallByJenis[jenis];
    return nextToCallByJenis[jenis] || num;
  }

  /* ============================================================
   * API Adapter — fetch data_call (nama pasien) + current-number.
   * ============================================================ */
  async function fetchCallData(): Promise<RawRow[]> {
    // GET (bukan POST): endpoint mengembalikan data hanya utk GET ?type=data_call.
    // Verifikasi kiosk: GET → 3 record; POST body type=data_call → HTTP 200 tapi [].
    const res = await fetch(LIST_URL + '?type=data_call', {
      method: 'GET',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      cache: 'no-store', // data_call juga harus segar (nama pasien recall)
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
        cache: 'no-store', // jangan pernah pakai cache browser: current-number harus segar
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
  // Mapping panel display mengikuti NATIVE MORBIS (terverifikasi dari kode native
  // view-call-websocet-v2): #antrian-penyerahan = Obat TUNGGAL, #antrian-view =
  // Obat RACIKAN. Baseline lama terbalik → card/recall tunggal salah.
  const PANGGILAN_SEL = '#antrian-penyerahan';
  const SIAP_SEL = '#antrian-view';

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

  // Baca nomor yang tampil di panel (selector PENGGILAN/SIAP). Format display
  // kami & native sama: <div class="antrian-nomor">NN</div> — bisa NOMOR MORBIS
  // ("30") atau kode renumber ("T-42"). '—'/kosong → ''. HANYA angka atau kode
  // T-/R- yang diterima — teks/nama pasien (mis. "SITI AMINAH-") tidak pernah
  // dianggap recall (anti false-positive recall native).
  function readPanelNumber(sel: string): string {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return '';
    const m = (el.querySelector?.('.antrian-nomor')?.textContent || '').trim();
    return /^(?:[TR]-)?\d+$/.test(m) ? m : '';
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

  // Recall via localStorage (konsol→display, same-origin). Bebas WS & login:
  // jalur ini jalan walau WS :8088 mati & current-number butuh session.
  // Konsol menulis saat klik recall (farmasiRecallDeleg.ts); display announce.
  // DIPANGGIL SEBELUM fetch — recall tak boleh buntu gara-gara fetch gagal.
  function processLocalRecall(): void {
    try {
      const raw = localStorage.getItem('ext-afd-recall');
      if (!raw) return;
      const sig = JSON.parse(raw) as {
        jenis: string;
        nomor: string;
        nomorTeks?: string;
        ts: number;
      };
      const key = `${sig.jenis}:${sig.nomor}`;
      const segar = Date.now() - (sig.ts || 0) < 8000; // sinyal kedaluwarsa 8 detik
      if (segar && key !== lastLocalRecallKey) {
        lastLocalRecallKey = key;
        localStorage.removeItem('ext-afd-recall');
        const jenis = (sig.jenis === 'racikan' ? 'racikan' : 'tunggal') as 'tunggal' | 'racikan';
        const kode = kodeTampil(jenis, sig.nomor); // MORBIS konsol → kode renumber (kertas)
        // Nama pasien: dari record data_call (nomor konsol = NOMOR MORBIS), fallback
        // ke pasien terakhir yang benar-benar dipanggil (lastCalled) — BUKAN
        // nomorTeks (cell pertama tabel konsol = kode/nomor, bukan nama).
        const nama =
          currentPatientName(jenis, sig.nomor) ||
          (lastCalled && lastCalled.jenis === jenis ? lastCalled.namaPasien : '');
        updateDebugState({ lastAnnouncement: `recall:${jenis}:${kode}` });
        announce({
          id: `local-recall-${key}`,
          nomor: kode,
          kode: '',
          namaPasien: nama,
          unit: '',
          jenis,
          rm: '',
        });
      }
    } catch {
      /* ignore */
    }
  }

  // Refresh angka card + highlight secara tetap & cepat. Fetch ?section=isi
  // (current number) + data_call (nama), update currentByJenis/lastRows, render.
  // Di-ranse interval mandiri (CARD_MS) — tak bertabrakan dgn health/poll.
  async function refreshCardNumber(): Promise<void> {
    setStatus('loading');
    processLocalRecall(); // recall lokal diproses duluan, tak peduli fetch gagal/tidak
    try {
      const [{ current: cur }, rows] = await Promise.all([fetchCurrentNumber(), fetchCallData()]);
      lastRows = rows;
      await updateRenumber(rows);
      updateDebugState({ lastPoll: Date.now(), lastDataCount: rows.length }); // observability: jalur render tercapai
      const g1 = cur.get('1')?.trim();
      const g2 = cur.get('2')?.trim();
      currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
      currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';

      // Reset Antrian (current-number turun drastis) → bersihkan state panggilan
      // (dedup signature + lastCalled) supaya "Selanjutnya" berikutnya announce
      // lagi & recall tidak memakai pasien lama. Tidak menyentuh konfigurasi TTS.
      let justReset = false;
      if (isReset(cur, prevCurrent)) {
        clearCallState();
        justReset = true;
      }
      // Sinkron baseline antar-iterasi (isReset di refresh berikutnya).
      prevCurrent.clear();
      for (const [c, v] of cur) prevCurrent.set(c, v);

      // Recall (panggil ulang): current-number ?section=isi TIDAK berubah (tetap
      // nomor terakhir "Selanjutnya"), tapi native display menulis nomor recall ke
      // panel via WS. Deteksi: BACA nomor panel SEBELUM kita menimpa. Panel ≠
      // current-number jenisnya = panggilan native (recall) → announce + biarkan
      // panel tampil (jangan timpa).
      //
      // Signature penulis: extension juga menulis panel (refresh tiap CARD_MS). Di
      // mode FALLBACK (WS native mati), panel = nilai extension refresh sebelumnya —
      // SELALU beda dari current saat transisi → false-positive recall tanpa ini.
      // Recall HANYA jika panel ≠ current DAN ≠ nilai yang extension tulis sendiri.
      const panelT = readPanelNumber(PANGGILAN_SEL); // penyerahan = TUNGGAL native
      const panelR = readPanelNumber(SIAP_SEL); // view = RACIKAN native
      // Setelah reset, current MORBIS kosong ('') — panel masih menampilkan nomor
      // recall lama → tanpa guard ini, recall branch announce ulang pasien lama.
      // Recall hanya valid bila ADA panggilan aktif (current non-kosong).
      const recallT =
        !justReset &&
        currentByJenis.tunggal !== '' &&
        panelT &&
        panelT !== '0' &&
        panelT !== currentByJenis.tunggal &&
        panelT !== writtenByUs.tunggal;
      const recallR =
        !justReset &&
        currentByJenis.racikan !== '' &&
        panelR &&
        panelR !== '0' &&
        panelR !== currentByJenis.racikan &&
        panelR !== writtenByUs.racikan;
      if (recallT || recallR) {
        const jenis = recallT ? 'tunggal' : 'racikan';
        const panelNum = recallT ? panelT : panelR;
        const kode = kodeTampil(jenis, panelNum); // MORBIS native → kode renumber (kertas)
        const key = jenis + ':' + kode;
        if (key !== lastNativeCall) {
          lastNativeCall = key;
          // Nama pasien: dari record data_call (panel native = NOMOR MORBIS),
          // fallback ke pasien terakhir yang benar-benar dipanggil (lastCalled).
          const nama =
            currentPatientName(jenis, panelNum) ||
            (lastCalled && lastCalled.jenis === jenis ? lastCalled.namaPasien : '');
          announce({
            id: 'recall:' + key,
            nomor: kode,
            kode: '',
            namaPasien: nama,
            unit: '',
            jenis,
            rm: '',
          });
          updateDebugState({ lastAnnouncement: 'recall:' + key });
        }
        // JANGAN set writtenByUs = panel recall — itu membunuh guard recall di
        // iterasi berikutnya (panel 30 ≠ writtenByUs 30 = false → panel ditimpa).
        // Dedup announce sudah via lastNativeCall; writtenByUs tetap nilai current
        // agar panel recall dipertahankan sampai panggilan normal berikutnya.
        setStatus('ok');
        return;
      }

      // Deteksi panggilan BARU per jenis utk bell+TTS — jalan di NATIVE maupun
      // FALLBACK (sebelumnya hanya di poll fallback, jadi NATIVE kiosk tak bicara).
      for (const j of ['tunggal', 'racikan'] as const) {
        const cur = currentByJenis[j];
        const prev = prevByJenis[j];
        if (cur && cur !== '0' && cur !== prev) {
          const kode = kodeTampil(j, cur); // kode renumber (kertas) — bukan MORBIS
          const key = j + ':' + kode;
          if (key !== lastNormalKey) {
            // Panggilan normal baru (atau recall sebelumnya). Dedup BERSAMA
            // dengan pollFallback: satu klik Selanjutnya = satu announce.
            lastNormalKey = key;
            lastNativeCall = null; // panggilan normal → recall berikutnya harus announce lagi
            const nama = currentPatientName(j, cur);
            announce({
              id: key,
              nomor: kode,
              kode: '',
              namaPasien: nama,
              unit: '',
              jenis: j,
              rm: '',
            });
            updateDebugState({ lastAnnouncement: key });
          }
        }
        prevByJenis[j] = cur || '';
      }

      // Tulis panel SELALU (NATIVE maupun FALLBACK): card menampilkan KODE PUBLIK
      // (QueueManager), bukan nomor MORBIS. Keputusan desain "override native" —
      // pasien melihat nomor yang sama persis dgn kertas (T-01..N). Mesin health
      // di-beri tahu lewat onWeWrote() agar DOM tulis-extension tidak dianggap
      // "native recovery"; akibatnya health melihat signal kita → polling fallback
      // (yang extension kendalikan) menjadi penjaga utama — konsisten dgn override.
      // Guard recall (sama spt renderDisplay): jangan timpa panel yang sedang
      // menampilkan RECALL native — refresh 1s ini kalau menimpa akan menghapus
      // nomor recall yang baru saja di-announce.
      {
        renderCardPanel(); // card selalu kode publik (kelola sendiri)
        highlightCurrents();
        // tandai nilai yang KITA tulis — signature recall detection (anti false-positif)
        writtenByUs.tunggal =
          nextToCallByJenis.tunggal || kodeTampil('tunggal', currentByJenis.tunggal);
        writtenByUs.racikan =
          nextToCallByJenis.racikan || kodeTampil('racikan', currentByJenis.racikan);
        onWeWrote(); // tandai write extension agar tak dianggap native recovery
        setStatus('ok');
      }
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
    renderCardPanel(view);
    if (call) {
      // update panggilan terakhir per jenis + seed dari data (card atas/bawah)
      lastByJenis[call.jenis] = call;
      seedLastByJenis(view);
      // Ponytail: jangan timpa panel yang sedang menampilkan RECALL native (WS
      // membeku di FALLBACK → pollFallback→renderDisplay menimpa panel recall
      // dengan current, menghapus nomor recall). Deteksi: panel ≠ current & ≠
      // nilai yg kita tulis = recall aktif → biarkan.
      const kodeT = kodeTampil('tunggal', currentByJenis.tunggal);
      const kodeR = kodeTampil('racikan', currentByJenis.racikan);
      const atasRecall =
        readPanelNumber(PANGGILAN_SEL) &&
        readPanelNumber(PANGGILAN_SEL) !== currentByJenis.tunggal &&
        readPanelNumber(PANGGILAN_SEL) !== writtenByUs.tunggal;
      const bawahRecall =
        readPanelNumber(SIAP_SEL) &&
        readPanelNumber(SIAP_SEL) !== currentByJenis.racikan &&
        readPanelNumber(SIAP_SEL) !== writtenByUs.racikan;
      const atas = atasRecall ? null : document.querySelector<HTMLElement>(PANGGILAN_SEL);
      if (atas)
        atas.innerHTML = cardSection(
          'Obat Tunggal',
          kodeT,
          currentPatientName('tunggal', currentByJenis.tunggal),
        );
      const bawah = bawahRecall ? null : document.querySelector<HTMLElement>(SIAP_SEL);
      if (bawah)
        bawah.innerHTML = cardSection(
          'Obat Racikan',
          kodeR,
          currentPatientName('racikan', currentByJenis.racikan),
        );
      highlightCurrents(); // tandai baris panggilan terakhir per jenis
      wireRowRecall(); // aktifkan klik-kiri-pasien utk panggil ulang
      writtenByUs.tunggal = kodeT;
      writtenByUs.racikan = kodeR;
    }
    onWeWrote(); // tandai DOM yang BARU SAJA extension tulis (bukan native)
  }

  // Render card atas/bawah dari urutan publik per jenis (kelola sendiri) —
  // dipanggil SELALU (override native), termasuk saat tidak ada panggilan aktif.
  // Nomor publik antrian pertama per jenis = pasien berikutnya yang wajib tampil.
  function renderCardPanel(_view?: QueueView): void {
    const atas = document.querySelector<HTMLElement>(PANGGILAN_SEL);
    const bawah = document.querySelector<HTMLElement>(SIAP_SEL);
    const t = nextToCallByJenis.tunggal;
    const r = nextToCallByJenis.racikan;
    if (atas)
      atas.innerHTML = cardSection(
        'Obat Tunggal',
        t || currentByJenis.tunggal,
        t ? currentPatientName('tunggal', t) : '',
      );
    if (bawah)
      bawah.innerHTML = cardSection(
        'Obat Racikan',
        r || currentByJenis.racikan,
        r ? currentPatientName('racikan', r) : '',
      );
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
  // Nilai panel terakhir yang extension tulis sendiri — signature pembeda recall
  // native vs nilai extension (mode FALLBACK). Di-set SETELAH menulis panel.
  const writtenByUs: Record<'tunggal' | 'racikan', string> = { tunggal: '', racikan: '' };
  // Key 'jenis:nomor' recall native terakhir yang di-announce (dedup serial).
  let lastNativeCall: string | null = null;
  // Dedup sinyal recall dari konsol (localStorage) — key 'jenis:nomor'.
  let lastLocalRecallKey = '';

  // data_call mentah terakhir (diisi pollFallback) — dipakai seed card dua-bagian
  // karena STATUS=0 tak selalu menandai baris aktif (status MORBIS tak reliable).
  let lastRows: RawRow[] = [];

  // Key panggilan NORMAL terakhir yang di-announce ('jenis:kode') — dipakai
  // BERSAMA oleh refreshCardNumber & pollFallback supaya SATU klik Selanjutnya
  // tidak memicu announce ganda (kedua jalur fetch current-number yang sama).
  // Recall (lastNativeCall/lastLocalRecallKey) tetap jalur terpisah → selalu
  // bisa memaksa announce ulang.
  let lastNormalKey = '';

  // Pasien TERAKHIR yang benar-benar dipanggil (state eksplisit recall).
  // Recall memakai state ini — BUKAN "pasien terakhir yang ditemukan di DOM"
  // — supaya nama yang diumumkan saat panggil ulang = pasien yang dipanggil.
  // Di-reset saat Reset Antrian (state lama tidak valid lagi).
  let lastCalled: { jenis: 'tunggal' | 'racikan'; nomor: string; namaPasien: string } | null = null;

  // Bersihkan state panggilan saat Reset Antrian (current-number turun drastis).
  // Dedup signature lama tidak valid → panggilan berikutnya pasti di-announce.
  // TTS/voice config TIDAK disentuh.
  function clearCallState(): void {
    lastCalled = null;
    lastNativeCall = null;
    lastLocalRecallKey = '';
    announcedSig = '';
    lastNormalKey = '';
    prevByJenis.tunggal = '';
    prevByJenis.racikan = '';
    prevCurrent.clear();
    updateDebugState({
      lastCalledPatient: null,
      lastCalledNumber: null,
      lastRealtimeEvent: 'reset',
    });
  }

  /* ============================================================
   * TTS MULTI-LAYER (role-gated).
   *
   * Bell (Web Audio) dan TTS adalah dua jalur independen: bell sukses
   * TIDAK berarti TTS sukses. Pipeline TTS mencoba layer demi layer dan
   * SETIAP layer benar-benar di-tunggu (await onend/play/error/timeout),
   * tidak "fire-and-forget".
   *
   * Prioritas = LOKAL dulu (internet BUKAN dependency utama), Google
   * MP3 jadi cadangan terakhir:
   *
   *   Layer 0 — local service 127.0.0.1:8765 (tts_service.py; MP3 via Audio,
   *             engine di luar browser — bebas CORS & voices kosong)
   *   Layer 1 — speechSynthesis voice BAHASA INDONESIA lokal (localService)
   *   Layer 2 — speechSynthesis voice id-ID apa pun (termasuk Google online)
   *   Layer 3 — speechSynthesis voice lokal apa pun yang tersedia
   *   Layer 4 — Google Translate TTS MP3 (fetch→blob→Audio→play→ended)
   *   Layer 5 — ERROR eksplisit: ttsMode='error' + ttsLastError
   *
   * Tidak ada mode 'silent' diam-diam: kegagalan semua layer tercatat
   * di debug state (ttsMode/ttsEngine/ttsLastError/ttsAttempts) + log
   * diagnostik [TTS] di tiap langkah (voices, voice terpilih, onstart,
   * onend/onerror, durasi) supaya kegagalan tidak ditebak-tebak.
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
    void playVoice(item.text).then(finish, finish);
  }

  // --- Voice registry: tunggu voiceschanged (Chrome memuat voices async) ---
  let voicesCache: SpeechSynthesisVoice[] = [];
  function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
    if (voicesCache.length > 0) return Promise.resolve(voicesCache);
    return new Promise((resolve) => {
      const got = (): boolean => {
        const vs = synth.getVoices();
        if (vs.length > 0) {
          voicesCache = vs;
          resolve(vs);
          return true;
        }
        return false;
      };
      if (got()) return;
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (got() || tries >= 50) {
          // 50×100ms = 5s; kalau tetap kosong, beri kesempatan layer MP3/lokal.
          window.clearInterval(timer);
          if (!voicesCache.length) {
            voicesCache = synth.getVoices();
            resolve(voicesCache);
          }
        }
      }, 100);
      // beberapa browser butuh voiceschanged (bukan polling)
      synth.addEventListener('voiceschanged', () => {
        if (!voicesCache.length) got();
      });
    });
  }

  function pickVoice(
    prefer: 'id-local' | 'id-any' | 'any-local' | 'any',
  ): SpeechSynthesisVoice | null {
    const vs = voicesCache;
    const low = (s: string): string => (s || '').toLowerCase();
    if (prefer === 'id-local')
      return (
        vs.find((v) => low(v.lang).startsWith('id') && v.localService) ??
        vs.find((v) => /indonesia/i.test(v.name)) ??
        null
      );
    if (prefer === 'id-any') return vs.find((v) => low(v.lang).startsWith('id')) ?? null;
    if (prefer === 'any-local') return vs.find((v) => v.localService) ?? null;
    return vs[0] ?? null;
  }

  // Layer 1-3 — speechSynthesis. RESOLVE true saat benar-benar selesai bicara
  // (onend); false saat onerror / tidak mulai / timeout. TIDAK memanggil
  // cancel() di sini — queue speechSynthesis dikontrol dari playVoice (satu
  // tempat), cancel() per-utterance bisa membatalkan utterance yang baru
  // di-speak (bug engine tertentu).
  function speakSynth(
    text: string,
    voice: SpeechSynthesisVoice | null,
    timeoutMs = 20000,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = (voice && voice.lang) || 'id-ID';
        if (voice) u.voice = voice;
        u.rate = 0.8;
        u.volume = 1;
        let started = false;
        let done = false;
        const t0 = Date.now();
        const fin = (ok: boolean): void => {
          if (done) return;
          done = true;
          window.clearTimeout(timer);
          updateDebugState({ lastTtsEnd: Date.now() });
          console.info(
            '[AFD] [TTS] speakSynth ' +
              (ok ? 'SUCCESS' : 'FAIL') +
              ' voice=' +
              (voice
                ? voice.name + '/' + voice.lang + (voice.localService ? '/local' : '/net')
                : 'null') +
              ' durasi=' +
              (Date.now() - t0) +
              'ms',
          );
          resolve(ok);
        };
        u.onstart = () => {
          started = true;
          updateDebugState({ lastTtsStart: Date.now() });
          console.info('[AFD] [TTS] onstart voice=' + (voice ? voice.name : 'null'));
        };
        u.onend = () => fin(true);
        // onerror setelah mulai bicara → anggap selesai (Chrome kadang fire
        // error saat utterance interupsi, padahal sudah berbunyi).
        u.onerror = (e) => {
          console.info('[AFD] [TTS] onerror started=' + started + ' err=' + (e.error || ''));
          fin(started);
        };
        RealSpeak.call(synth, u);
        const timer = window.setTimeout(() => {
          console.info('[AFD] [TTS] timeout ' + timeoutMs + 'ms started=' + started);
          fin(started);
        }, timeoutMs);
      } catch (e) {
        console.info('[AFD] [TTS] speakSynth throw', e);
        resolve(false);
      }
    });
  }

  // Layer 4 — Google TTS MP3. fetch→blob→objectURL→Audio→canplay→play→ended.
  // Semua langkah di-await; setiap kegagalan (HTTP/empty/CORS/autoplay reject)
  // resolve false → lanjut ke layer berikutnya. Sub-fallback: kalau fetch
  // diblokir CORS, mainkan Audio langsung dari URL (audio element tidak kena
  // CORS untuk playback).
  function speakGoogleMp3(text: string, timeoutMs = 15000): Promise<boolean> {
    const url =
      'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=' +
      encodeURIComponent(text);
    return new Promise((resolve) => {
      let settled = false;
      let objUrl: string | null = null;
      let audio: HTMLAudioElement | null = null;
      const fin = (ok: boolean): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        if (audio) {
          audio.onended = null;
          audio.onerror = null;
          audio.oncanplay = null;
        }
        if (objUrl) URL.revokeObjectURL(objUrl);
        updateDebugState({ lastTtsEnd: Date.now() });
        console.info('[AFD] [TTS] google-mp3 ' + (ok ? 'SUCCESS' : 'FAIL'));
        resolve(ok);
      };
      const timer = window.setTimeout(() => fin(false), timeoutMs);
      const playAudio = (src: string): void => {
        audio = new Audio(src);
        audio.onended = () => fin(true);
        audio.onerror = () => fin(false);
        audio.oncanplay = () => {
          // autoplay bisa ditolak (NotAllowedError) → resolve false (layer berikut)
          void audio!.play().catch(() => fin(false));
        };
        audio.load();
      };
      fetch(url, { mode: 'cors' })
        .then((r) => {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.blob();
        })
        .then((blob) => {
          if (!blob || blob.size === 0) throw new Error('empty blob');
          objUrl = URL.createObjectURL(blob);
          playAudio(objUrl);
        })
        .catch(() => playAudio(url)); // CORS/network fetch gagal → Audio langsung
    });
  }

  // Layer 0 — TTS LOCAL SERVICE (127.0.0.1:8765). Engine sintesis ada di luar
  // browser (Python service stdlib, tts_service.py) sehingga tidak bergantung
  // speechSynthesis browser (voices=[] di kiosk display) dan tidak kena CORS
  // (service fetch Google server-side). Browser hanya memutar MP3 via Audio —
  // jalur yang sudah terbukti jalan (data-URL MP3: canplay→play→ended).
  // NETWORK FETCH dipindah ke background service worker (PNA: halaman HTTP
  // publik 103.x TIDAK boleh fetch ke localhost; SW punya host_permissions
  // http://*/* sehingga bebas PNA). Content script tetap handle Audio/play.
  // Telemetry (user request): REQUEST→ENGINE→LOAD→PLAY→ENERGY→END→ERROR —
  // fase kegagalan dicatat via resolve(false, reason).
  function speakLocalService(
    text: string,
    timeoutMs = 10000,
  ): Promise<{ ok: boolean; reason: string }> {
    return new Promise((resolve) => {
      let settled = false;
      let objUrl: string | null = null;
      let audio: HTMLAudioElement | null = null;
      const fin = (ok: boolean, reason: string): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        if (audio) {
          audio.onended = null;
          audio.onerror = null;
          audio.oncanplay = null;
          audio.onplay = null;
        }
        if (objUrl) URL.revokeObjectURL(objUrl);
        updateDebugState({ lastTtsEnd: Date.now(), ttsTrace: [...ttsTrace, 'end:' + reason] });
        console.info('[AFD] [TTS] local-service ' + (ok ? 'SUCCESS' : 'FAIL ' + reason));
        resolve({ ok, reason });
      };
      const ttsTrace: string[] = ['start'];
      const timer = window.setTimeout(() => fin(false, 'timeout'), timeoutMs);
      const playAudio = (src: string): void => {
        ttsTrace.push('audio-new');
        audio = new Audio(src);
        audio.onplay = () => {
          // push ke ttsTrace LOKAL dulu (sama spt canplay), baru snapshot —
          // kalau tidak, fin() menimpa state dengan snapshot yg tanpa 'play'.
          ttsTrace.push('play');
          updateDebugState({ lastTtsStart: Date.now(), ttsTrace: [...ttsTrace] });
        };
        audio.onended = () => fin(true, 'ended');
        audio.onerror = () =>
          fin(false, 'audio-error ' + (audio && audio.error ? audio.error.code : '?'));
        audio.oncanplay = () => {
          ttsTrace.push('canplay');
          audio!.play().catch((e) => fin(false, 'play-rejected ' + String(e).slice(0, 60)));
        };
        audio.load();
      };
      try {
        // World MAIN TIDAK punya chrome.runtime (Chrome docs). Jalur layer-0:
        // MAIN --postMessage--> ISOLATED bridge (farmasiBridge.ts, punya
        // chrome.runtime) --sendMessage--> SW --fetch--> 127.0.0.1:8765.
        // Bridge balas via postMessage TTS_RESULT. Audio/play tetap di sini.
        const reqId = 'tts-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
        const onResult = (event: MessageEvent): void => {
          if (event.source !== window) return;
          const d = event.data as {
            source?: string;
            type?: string;
            id?: string;
            ok?: boolean;
            reason?: string;
            mime?: string;
            data?: number[];
          };
          if (
            !d ||
            d.source !== 'MORBIS-FARMASI-BRIDGE' ||
            d.type !== 'TTS_RESULT' ||
            d.id !== reqId
          )
            return;
          window.removeEventListener('message', onResult);
          if (!d.ok) {
            fin(false, d.reason || 'message-error no-response');
            return;
          }
          if (!d.data || d.data.length === 0) {
            fin(false, 'blob-error empty-data');
            return;
          }
          ttsTrace.push('blob:' + d.data.length);
          const bytes = new Uint8Array(d.data);
          const blob = new Blob([bytes], { type: d.mime || 'audio/mpeg' });
          objUrl = URL.createObjectURL(blob);
          playAudio(objUrl);
        };
        window.addEventListener('message', onResult);
        window.postMessage({ source: 'MORBIS-FARMASI', type: 'TTS_REQUEST', id: reqId, text }, '*');
      } catch (e) {
        // world MAIN tanpa postMessage/window — tidak mungkin, tapi jaga-jaga
        fin(false, 'message-error postmessage ' + String(e).slice(0, 40));
      }
    });
  }

  // Pipeline multi-layer (LOKAL dulu, Google MP3 cadangan). DIPANGGIL dari
  // antrean (next) → resolve saat selesai.
  async function playVoice(text: string): Promise<void> {
    updateDebugState({ ttsAttempts: 0, ttsLastError: null, ttsEngine: null });
    // Satu-satunya tempat cancel(): bersihkan utterance sisa (dari luar/recall
    // sebelumnya) SEKALI sebelum pipeline — bukan per-utterance.
    try {
      synth.cancel();
    } catch {
      /* ignore */
    }
    await ensureVoices();
    console.info('[AFD] [TTS] voices=' + voicesCache.map((v) => v.name).join(', '));

    // Layer 0: local service — jalur paling reliable (MP3 via Audio, terbukti)
    const svc = await speakLocalService(text);
    if (svc.ok) {
      updateDebugState({ ttsMode: 'local', ttsEngine: 'local-service:8765' });
      return;
    }
    const ttsFailDetail = 'local-service: ' + svc.reason;
    updateDebugState({ ttsLastError: ttsFailDetail });

    // Layer 1: voice Bahasa Indonesia LOKAL (localService)
    const idLocal = pickVoice('id-local');
    if (idLocal) {
      updateDebugState({ ttsMode: 'speech', ttsEngine: 'speech:' + idLocal.name });
      const ok = await speakSynth(text, idLocal);
      if (ok) return;
    }

    // Layer 2: voice id-ID apa pun (termasuk Google online via speechSynthesis)
    const idAny = pickVoice('id-any');
    if (idAny && idAny !== idLocal) {
      updateDebugState({ ttsMode: 'speech', ttsEngine: 'speech:' + idAny.name, ttsAttempts: 1 });
      const ok = await speakSynth(text, idAny);
      if (ok) return;
    }

    // Layer 3: voice lokal apa pun yang tersedia
    const anyLocal = pickVoice('any-local');
    if (anyLocal && anyLocal !== idLocal && anyLocal !== idAny) {
      updateDebugState({ ttsMode: 'local', ttsEngine: 'local:' + anyLocal.name, ttsAttempts: 2 });
      const ok = await speakSynth(text, anyLocal);
      if (ok) return;
    }

    // Layer 4: Google TTS MP3 (cadangan terakhir sebelum error)
    updateDebugState({ ttsMode: 'mp3', ttsEngine: 'google-translate', ttsAttempts: 3 });
    const okMp3 = await speakGoogleMp3(text);
    if (okMp3) return;

    // Layer 5: semua gagal → ERROR eksplisit, bukan silent
    updateDebugState({
      ttsMode: 'error',
      ttsEngine: null,
      ttsLastError:
        'all engines failed — layer0=' +
        ttsFailDetail +
        ' (speech id-local/id-any/any-local, google-mp3)',
      ttsAttempts: 4,
    });
    updateDebugState({ lastTtsEnd: Date.now() });
    console.error('[AFD] [TTS] semua engine gagal utk:', text.slice(0, 40));
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
    // Kode renumber "T-42"/"R-42" → ucapkan angkanya (kertas bertuliskan kode;
    // TTS menyebut nomor agar pasien mencocokkan dengan tiketnya).
    const clean = String(n).replace(/^[TR]-/, '');
    const num = Math.abs(Math.trunc(Number(clean)));
    if (!Number.isFinite(num)) return String(clean);
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
    // State pasien TERAKHIR yang benar-benar dipanggil — sumber recall.
    // Recall memakai state ini (bukan "pasien terakhir di DOM") supaya nama
    // pasien yang di-umumkan saat panggil ulang = pasien yang dipanggil.
    lastCalled = {
      jenis: row.jenis,
      nomor: String(row.nomor),
      namaPasien: String(row.namaPasien || ''),
    };
    updateDebugState({
      lastCalledPatient: lastCalled.namaPasien,
      lastCalledNumber: lastCalled.nomor,
      lastRealtimeEvent: 'announce:' + row.id,
    });
    // TTS: ucapkan nomor; nama title-case agar TTS membacanya natural (bukan eja).
    const kalimat =
      'Nomor antrian ' +
      numberToWords(row.nomor) +
      (row.namaPasien ? ', atas nama ' + titleCase(String(row.namaPasien)) : '') +
      ', silakan menuju farmasi.';
    // Antrean serial: bell → voice (SATU KALI). Pengulangan suara TIDAK
    // diduplikasi di queue — kalau diperlukan, buat mekanisme eksplisit
    // (recall/ulang panggil) supaya debugging tidak ambigu.
    queue.push({ kind: 'bell' }, { kind: 'voice', text: kalimat });
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
  // resume AudioContext sukses TANPA user-gesture. Coba sekali saat load;
  // sukses → aktifkan audio. Gesture listener tetap sbg fallback.
  // (tanpa sound=Allow, resume tetap gagal output → tidak aktif, aman.)
  // CATATAN: tidak lagi memakai `speechSynthesis.speak(' ')` + `cancel()` cepat
  // sebagai probe unlock — kombinasi itu bisa membuat state speech engine
  // tidak stabil (utterance dibatalkan 250ms setelah di-speak). Unlock TTS
  // dibuktikan langsung oleh playVoice (onstart/onend), bukan asumsi.
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
          // jaring pengaman: tanpa sinyal state, unlock via AudioContext timeout
          window.setTimeout(() => {
            if (done) return;
            try {
              if (a.state === 'running') {
                a.close().catch(() => {});
                finish();
              }
            } catch {
              /* ignore */
            }
          }, 800);
        } else {
          finish(); // tanpa AudioContext, percayai speechSynthesis (fallback)
        }
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
    ttsEngine: null,
    ttsLastError: null,
    ttsAttempts: 0,
    lastCalledPatient: null,
    lastCalledNumber: null,
    lastTtsStart: null,
    lastTtsEnd: null,
    lastRealtimeEvent: null,
    ttsTrace: null,
  };
  function updateDebugState(patch: Partial<AntrianFarmasiDebugState>): void {
    if (!debugEnabled) return;
    Object.assign(debugState, patch);
    window.__ANTRIAN_FARMASI_DEBUG__ = { ...debugState };
    // DOM mirror — content script bisa berjalan di isolated world (window main
    // world tak terlihat), tapi DOM selalu dishare: e2e/tester baca dari sini.
    document.documentElement.setAttribute('data-afd-debug', JSON.stringify(debugState));
    // probe world: apakah chrome.runtime tersedia di konteks ini
    document.documentElement.setAttribute(
      'data-afd-world',
      typeof chrome !== 'undefined' && !!chrome.runtime ? 'isolated-has-cr' : 'no-cr',
    );
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
      await updateRenumber(rows);

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
          nomor: kodeTampil(mPat?.jenis || 'tunggal', num), // kode renumber (kertas)
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
          renderDisplay(view, currentCall);
        } else if (sig !== announcedSig && isNewCurrent(cur)) {
          if (isReset(cur, prevCurrent)) {
            // Reset antrian (tombol "Reset Antrian" di halaman manajemen):
            // current-number turun drastis — BUKAN panggilan baru. Update
            // baseline & tampilkan, tanpa announce (fix 2026-08-12).
            clearCallState(); // bersihkan dedup + lastCalled (state lama invalid)
            currentCall = call;
            renderDisplay(view, currentCall);
          } else {
            // current-number berubah antar poll = klik "Selanjutnya" → panggilan baru.
            announcedSig = sig;
            currentCall = call;
            renderDisplay(view, currentCall);
            maybeAnnounce(view, currentCall);
          }
        } else {
          // Tidak ada panggilan baru → pertahankan panggilan aktif, tapi
          // refresh panel SIAP DIAMBIL. prevCurrent TIDAK ditulis di sini:
          // refreshCardNumber (interval 1s) adalah SATU-SATUNYA penulis
          // prevCurrent. Dulu pollFallback ikut menulis → race: poll yang lebih
          // sering (500ms) menulis cur turun lebih dulu di cabang ini, sehingga
          // isReset() refresh berikutnya melihat prev==cur → reset tak terdeteksi.
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
    // Dedup BERSAMA dengan refreshCardNumber (lastNormalKey): SATU klik
    // Selanjutnya = satu announce, dari jalur mana pun yang lebih dulu.
    const key = call.jenis + ':' + call.nomor;
    if (key === lastNormalKey) {
      console.info('[AFD] duplicate ignored ' + key);
      return;
    }
    lastNormalKey = key;
    announcedSig = call.id;
    updateDebugState({ lastAnnouncement: key });
    console.info('[AFD] ANNOUNCE ' + key);
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
  // Swal MORBIS (mis. notifikasi "Selamat Datang"/peringatan) menutupi tombol
  // Tes Suara dan menghalangi klik pada halaman display. Halaman display TIDAK
  // memakai Swal untuk fungsi penting (recall pakai window.confirm), jadi aman
  // disembunyikan total — hanya tampilan, tidak mengubah logika MORBIS.
  function hideNativeSwal(): void {
    const s = document.createElement('style');
    s.id = 'ext-afd-hide-swal';
    s.textContent =
      '.swal2-container, .swal2-backdrop { display: none !important; visibility: hidden !important; }';
    // document_start → <head> mungkin belum ada; fallback ke documentElement
    (document.head || document.documentElement).appendChild(s);
    const mo = new MutationObserver(() => {
      document.querySelectorAll('.swal2-container').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
  function startWithRole(): void {
    if (started) return; // idempotent: jangan buat watcher/listener/polling ganda
    started = true;
    updateDebugState({ started: true });
    hideNativeSwal(); // Swal MORBIS menutup tombol Tes Suara & mengganggu klik
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
