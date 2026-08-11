/* AntrianFarmasiDisplay – fallback WebSocket layar panggilan farmasi
 *
 * Halaman /public/antrian-farmasi-v2/view-call-websocet-v2 hanya ter-update
 * lewat WebSocket ws://host:8088. Saat WS mati (sering), papan & TTS beku.
 *
 * Fase:
 *  A) Transport — ganti window.WebSocket dengan stub (document_start MAIN):
 *     polling POST check_antrian tiap 3 detik; ID berubah → picu ws.onmessage
 *     {channel:'dev_antrianPemanggilanFarmasi'} → kode asli MORBIS menarik data
 *     sendiri lalu render nomor + daftar + bell (+ native speak). call/listtable
 *     sengaja TIDAK dipanggil langsung dari extension (tidak global).
 *  B) Farmasi Voice — native speechSynthesis.speak() dibungkam (teks MANAP
 *     garbled "BT 13DEPO RAJAL", tanpa nama pasien). Extension menjadi satu-satunya
 *     sumber voice dengan format betul + nama pasien + depo, diulang 2× via queue
 *     (menunggu onend, tidak pernah cancel() panggilan yang sedang berjalan).
 *
 * Role: hanya aktif bila admin/apotek (gate data-ext-antrian-farmasi di init.ts).
 */
(function () {
  const CHANNEL = 'dev_antrianPemanggilanFarmasi';
  const POLL_MS = 3000;
  const CALL_DELAY_MS = 1600; // jeda bell native (durasi audio unine) sebelum voice #1
  const GAP_MS = 400; // jeda antar repetisi

  const CHECK_URL = '/public/antrian-farmasi-v2/data-call-v2?do=check_antrian';

  /* numberToWords – konversi angka (0-999) ke kata Bahasa Indonesia.
   * Dipakai untuk TTS farmasi agar nomor terbaca jelas. Didefinisikan lokal
   * (bukan import dari shared/utils) supaya TIDAK menarik side-effect global
   * module shared (window.SharedBatchUtils, console.log) ke halaman display.
   */
  const N2W_SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  function numberToWords(n: number | string): string {
    const num = Math.abs(Math.trunc(Number(n)));
    if (!Number.isFinite(num)) return String(n);
    const two = (x: number): string => {
      if (x < 12) return N2W_SATUAN[x];
      if (x < 20) return N2W_SATUAN[x - 10] + ' belas';
      if (x < 100) return (x % 10 === 0 ? N2W_SATUAN[x / 10] + ' puluh' : N2W_SATUAN[Math.trunc(x / 10)] + ' puluh ' + N2W_SATUAN[x % 10]);
      return '';
    };
    if (num === 0) return 'nol';
    if (num < 100) return two(num);
    if (num < 1000) {
      const r = num % 100;
      return (num < 200 ? 'seratus' : two(Math.trunc(num / 100)) + ' ratus') + (r ? ' ' + two(r) : '');
    }
    return String(num); // > 999 → angka polos
  }

  const RealWS = window.WebSocket;
  let lastCallId = '';
  let firstPoll = true;
  const fakes: FakeWS[] = [];

  /* ============================================================
   * A) WebSocket stub + polling transport
   * ============================================================ */
  class FakeWS {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    url: string;
    readyState = FakeWS.OPEN; // selalu "terbuka" agar logika reconnect halaman tidur
    onopen: ((ev: Event) => unknown) | null = null;
    onmessage: ((ev: MessageEvent) => unknown) | null = null;
    onerror: ((ev: Event) => unknown) | null = null;
    onclose: ((ev: CloseEvent) => unknown) | null = null;

    constructor(url: string) {
      this.url = url;
      fakes.push(this);
      setTimeout(() => {
        if (typeof this.onopen === 'function') this.onopen(new Event('open'));
      }, 0);
    }

    send(): void {
      /* display read-only; halaman tidak mengirim */
    }

    close(): void {
      /* biarkan readyState OPEN; tidak ada reconnect */
    }
  }

  // Facade: hanya ganti WebSocket yang menuju port 8088; URL lain → asli.
  const OverrideWS = ((url: string | URL) => {
    const target = String(url);
    if (!/:8088/.test(target)) return new RealWS(target);
    return new FakeWS(target);
  }) as unknown as typeof WebSocket;
  Object.assign(OverrideWS, { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 });
  window.WebSocket = OverrideWS;

  /* ============================================================
   * B1) Bungkam native TTS MORBIS (ganti speak → no-op di document_start).
   * smooth cancel() supaya sintesis pending (kalau ada) tidak terganggu.
   * ============================================================ */
  const synth = window.speechSynthesis;
  const RealSpeak = synth.speak.bind(synth);

  /* ============================================================
   * WS STUB — selalu aktif sejak document_start (sebelum inline
   * script halaman new WebSocket(':8088')) agar tidak ada error
   * "connection failed". Aktif baik fitur aktif maupun tidak.
   * ============================================================ */

  /* ============================================================
   * B2) Extension voice + antrian (queue) — i18n angka id-ID.
   * ============================================================ */
  function toIdVoice(): SpeechSynthesisVoice | null {
    try {
      const vl = synth.getVoices();
      return vl.find((v) => v.lang && v.lang.toLowerCase().startsWith('id')) ?? null;
    } catch {
      return null;
    }
  }

  // Antrian: jalankan berurutan, tunggu onend, tidak pernah cancel() item berjalan.
  let busy = false;
  let queue: string[] = [];
  function nextSpeak(): void {
    if (busy || queue.length === 0) return;
    busy = true;
    const text = queue.shift() as string;
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      busy = false;
      setTimeout(() => nextSpeak(), GAP_MS);
    };
    try {
      const u = new SpeechSynthesisUtterance(text);
      const v = toIdVoice();
      if (v) u.voice = v;
      u.lang = 'id-ID';
      u.rate = 0.8;
      u.pitch = 0.9;
      u.volume = 1;
      u.onend = finish;
      u.onerror = finish;
      RealSpeak.call(synth, u);
      // voice missing / impl malas melempar onend → jangan gantung queue selamanya.
      setTimeout(finish, 20000);
    } catch {
      finish();
    }
  }

  function enqueue(text: string): void {
    queue.push(text);
    nextSpeak();
  }

  // Voice panggilan farmasi: "Nomor antrian tiga belas, atas nama Amat Safuan,
  // silakan menuju Depo Rajal." diulang 2×.
  function announceCall(nomor: number | string, namaPasien: string, depo: string): void {
    const n = numberToWords(nomor);
    const pasien = (namaPasien || '').trim();
    const d = (depo || '').trim();
    const sentence = `Nomor antrian ${n}, atas nama ${pasien}, silakan menuju ${d}.`;
    enqueue(sentence);
    enqueue(sentence);
  }

  /* ============================================================
   * C) Pipeline: trigger native → delayed voice (setelah bell).
   * ============================================================ */
  function fireOnMessage(): void {
    const payload = JSON.stringify({ channel: CHANNEL, message: 'poll' });
    for (const f of fakes) {
      if (typeof f.onmessage === 'function') {
        try {
          f.onmessage(new MessageEvent('message', { data: payload }));
        } catch (err) {
          console.warn('[FarmasiDisplay] handler halaman gagal:', err);
        }
      }
    }
  }

  function handleNewCall(data: { COUNTER?: string | number; NAMA_PASIEN?: string; NAMA_DEPO?: string }): void {
    fireOnMessage(); // update UI + bell (bell async di halaman)
    setTimeout(() => {
      announceCall(data.COUNTER ?? '', data.NAMA_PASIEN ?? '', data.NAMA_DEPO ?? '');
    }, CALL_DELAY_MS);
  }

  /* ============================================================
   * D) Polling persistent (error → warn, lanjut; tak pernah berhenti).
   * ============================================================ */
  type Row = { ID?: string | number | null; COUNTER?: string | number; NAMA_PASIEN?: string; NAMA_DEPO?: string };

  async function pollCall(): Promise<void> {
    try {
      const response = await fetch(CHECK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=check_antrian',
      });

      if (!response.ok) {
        console.warn('[FarmasiDisplay] check_antrian HTTP', response.status);
        return;
      }

      const data = (await response.json()) as Row | null;
      if (!data || data.ID === undefined || data.ID === null) {
        console.warn('[FarmasiDisplay] Response tidak memiliki ID', data);
        return;
      }

      const currentId = String(data.ID);
      if (currentId === lastCallId) return; // panggilan sama → abaikan

      // Polling pertama hanya meng-seed identitas (jangan announce ulang
      // panggilan yang sudah berjalan saat halaman di-load).
      if (firstPoll) {
        firstPoll = false;
        lastCallId = currentId;
        return;
      }

      lastCallId = currentId;
      handleNewCall(data);
    } catch (error) {
      // timeout / network error → log, lanjut poll berikutnya
      console.warn('[FarmasiDisplay] Polling gagal, akan retry:', error);
    }
  }

  /* ============================================================
   * E) Audio unlock gesture kiosk (Chrome menahan TTS sampai user gesture).
   * ============================================================ */
  function unlockTts(): void {
    const unlock = (): void => {
      try {
        synth.getVoices();
        // trigger asli supaya browser menganggap synth "digunakan" di gesture
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
   * START — WS stub sudah terpasang. Fitur (polling + voice)
   * hanya mutlak aktif bila role admin/apotek (gate diset init.ts
   * di document_end → muncul sesaat setelah halaman ter-render).
   * ============================================================ */
  function start(): void {
    // Bungkam native TTS MORBIS (teks MANAP garbled tanpa nama pasien).
    // Hanya saat feature aktif → kalau nonaktif, native voice tetap normal.
    synth.speak = function (
      this: SpeechSynthesis,
      _utterance: SpeechSynthesisUtterance,
    ): void {
      return;
    } as typeof synth.speak;

    unlockTts();
    setInterval(() => void pollCall(), POLL_MS);
    void pollCall();
  }

  // document_start belum punya gate (diset init.ts di document_end).
  // Tunggu atribut hingga ±8 detik; kalau tak muncul → fitur nonaktif.
  const gateTimer = setInterval(() => {
    if (document.documentElement.getAttribute('data-ext-antrian-farmasi') === '1') {
      clearInterval(gateTimer);
      start();
    }
  }, 200);
  setTimeout(() => clearInterval(gateTimer), 8000);
})();