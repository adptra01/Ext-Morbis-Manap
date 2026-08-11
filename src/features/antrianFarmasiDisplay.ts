/* AntrianFarmasiDisplay – fallback WebSocket layar panggilan farmasi
 *
 * Halaman /public/antrian-farmasi-v2/view-call-websocet-v2 hanya ter-update
 * lewat WebSocket ws://host:8088. Saat WS mati (sering), papan & TTS beku.
 *
 * Strategi (tidak menyentuh UI MORBIS, tidak memanggil window.call()):
 *  1. document_start MAIN: ganti window.WebSocket dengan stub yang TIDAK
 *     menyambung ke mana-mana (menghentikan error "connection failed").
 *     Halaman menempelkan ws.onmessage ke instance stub kita — karena itu
 *     "mekanisme asli" halaman tetap bisa kita picu walau call/listtable
 *     tidak tersedia sebagai global dari konteks extension.
 *  2. Polling POST check_antrian tiap 3 detik (endpoint yang sama dipakai
 *     halaman di dalam handler WS).
 *  3. ID panggilan berubah → picu ws.onmessage dengan sinyal
 *     {channel:'dev_antrianPemanggilanFarmasi'} → kode asli MORBIS menarik
 *     data sendiri (check_antrian) lalu render nomor + list + bell + TTS.
 *
 * Lifecycle polling: error (5xx/4xx/timeout/network) hanya di-log, polling
 * tidak pernah berhenti. Dedupe by ID saja — panggil ulang (repeat call, ID
 * sama) sengaja tidak dideteksi agar tidak ada TTS ganda/loop.
 */
(function () {
  const CHANNEL = 'dev_antrianPemanggilanFarmasi';
  const POLL_MS = 3000;
  const CHECK_URL = '/public/antrian-farmasi-v2/data-call-v2?do=check_antrian';

  const RealWS = window.WebSocket;
  let lastCallId = '';
  let firstPoll = true;
  const fakes: FakeWS[] = [];

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
      // tandai "koneksi terbuka" sesaat setelah halaman memasang handler
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

      const data = (await response.json()) as { ID?: string | number | null } | null;

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
      fireOnMessage();
    } catch (error) {
      // timeout / network error → log, lanjut poll berikutnya
      console.warn('[FarmasiDisplay] Polling gagal, akan retry:', error);
    }
  }

  // Buka kunci speechSynthesis di gesture pertama (kiosk/TV tanpa interaksi awal:
  // Chrome menahan TTS sampai ada user gesture; utterance kosong sekali cukup).
  function unlockTts(): void {
    const unlock = (): void => {
      try {
        window.speechSynthesis?.getVoices();
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance(''));
      } catch {
        /* ignore */
      }
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
  }

  setInterval(() => void pollCall(), POLL_MS);
  void pollCall();
})();
