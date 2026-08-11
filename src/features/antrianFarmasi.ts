/* AntrianFarmasi – fallback WebSocket layar panggilan farmasi (build 2026‑08‑11)
 *
 * Halaman /public/antrian-farmasi-v2/view-call-websocet-v2 hanya ter-update
 * lewat WebSocket ws://host:8088. Saat WS mati (sering), papan & TTS beku.
 * Fitur ini meniru alur pesan WS dari sisi extension:
 *   polling check_antrian tiap 3 detik → ID berubah → call() (bel + TTS milik
 *   halaman, fungsi global) → update_antrian → listtable() refresh papan.
 * Plus refresh berkala listtable() tiap 30 detik agar papan tidak beku.
 */
(function () {
  if (document.documentElement.getAttribute('data-ext-antrian-farmasi') !== '1') return;

  const BASE = '/public/antrian-farmasi-v2/data-call-v2';
  const POLL_CALL_MS = 3000;
  const REFRESH_BOARD_MS = 30000;

  let lastId = '';
  let lastCallAt = 0;

  function extLog(event: string, ok: boolean, detail?: unknown): void {
    try {
      window.postMessage?.({ __extUsageLog: { feature: 'antrianFarmasi', event, ok, detail } }, '*');
    } catch {
      /* ignore */
    }
  }

  async function post(params: Record<string, string>): Promise<Record<string, unknown> | null> {
    try {
      const resp = await fetch(`${BASE}?do=${params.do}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: new URLSearchParams(params).toString(),
      });
      if (!resp.ok) return null;
      return (await resp.json()) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  function rowOf(json: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!json || typeof json !== 'object') return null;
    if ((json as Record<string, unknown>).ID !== undefined) return json;
    const d = (json as Record<string, unknown>).data;
    return d && typeof d === 'object' ? (d as Record<string, unknown>) : null;
  }

  function ttsFallback(antrian: string, depo: string): void {
    try {
      const u = new SpeechSynthesisUtterance(`Nomor antrian ${antrian} ${depo || ''}`);
      u.lang = 'id-ID';
      window.speechSynthesis?.cancel();
      window.speechSynthesis?.speak(u);
    } catch {
      /* ignore */
    }
  }

  async function onNewCall(row: Record<string, unknown>): Promise<void> {
    const id = String(row.ID ?? '');
    const idAntrian = String(row.ID_ANTRIAN ?? '');
    const nama = String(row.NAMA ?? '');
    const loket = String(row.COUNTER ?? '');
    const pasien = String(row.NAMA_PASIEN ?? '');
    const depo = String(row.NAMA_DEPO ?? '');

    if (Date.now() - lastCallAt < 1000) return; // debounce ganda poll
    lastCallAt = Date.now();

    // Fungsi halaman bersifat global (inline script top-level): pakai milik halaman
    // agar bel + TTS + format kalimat persis seperti alur WS asli.
    const pageCall = (window as unknown as Record<string, unknown>).call;
    if (typeof pageCall === 'function') {
      try {
        (pageCall as (...a: string[]) => void)(idAntrian, nama, loket, pasien, depo);
      } catch {
        ttsFallback(`${nama} ${idAntrian}`, depo);
      }
    } else {
      ttsFallback(`${nama} ${idAntrian}`, depo);
    }

    void post({ do: 'update_antrian', type: 'update_antrian', id, id_antrian: idAntrian });
    refreshBoard();
    extLog('farmasi_call', true, { id: idAntrian, loket, pasien });
  }

  async function pollCall(): Promise<void> {
    const json = await post({ do: 'check_antrian', type: 'check_antrian' });
    const row = rowOf(json);
    if (!row) return; // belum ada panggilan / server error → poll berikutnya
    const id = String(row.ID ?? '');
    if (!id || id === lastId) return;
    lastId = id;
    await onNewCall(row);
  }

  function refreshBoard(): void {
    const pageList = (window as unknown as Record<string, unknown>).listtable;
    if (typeof pageList === 'function') {
      try {
        (pageList as () => void)();
      } catch {
        /* ignore */
      }
    }
  }

  // Buka kunci speechSynthesis di gesture pertama (kiosk tanpa interaksi awal).
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

  /* ---- START ---- */
  unlockTts();

  // Tunggu fungsi halaman terpasang sebelum polling dimulai.
  const boot = setInterval(() => {
    const pageCall = (window as unknown as Record<string, unknown>).call;
    if (typeof pageCall !== 'function') return; // halaman belum selesai render script-nya
    clearInterval(boot);

    void pollCall(); // langsung cek sekali (panggilan yang masih berjalan saat load)
    setInterval(() => void pollCall(), POLL_CALL_MS);
    setInterval(refreshBoard, REFRESH_BOARD_MS);
    extLog('farmasi_poll', true);
  }, 500);
  setTimeout(() => clearInterval(boot), 15000); // hentikan menunggu bila halaman aneh
})();
