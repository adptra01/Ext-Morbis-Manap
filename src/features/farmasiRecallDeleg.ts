/* farmasiRecallDeleg.ts — di-inject ke MAIN world (file terpisah agar lolos CSP;
 * inline script diblokir). Menyediakan panggil ulang yang BERTAHAN dari reload
 * #isi oleh contentloader: native MORBIS hanya bind klik `.status-called` sekali
 * saat DOMContentLoaded, jadi baris baru setelah recall kehilangan listener
 * (freeze). Delegation di document + capture + stopPropagation mencegah
 * double-fire dgn listener per-baris native.
 *
 * DIPANGGIL dari farmasiIssue.ts via chrome.runtime.getURL(...) — jangan
 * diekspor sebagai module (build IIFE), jangan pakai import/export. */
(function () {
  if ((window as unknown as { __extAfdRecallDeleg?: boolean }).__extAfdRecallDeleg) return;
  (window as unknown as { __extAfdRecallDeleg: boolean }).__extAfdRecallDeleg = true;

  // Resolusi id baris: data-id, fallback ke input tersembunyi `#id-antrian{N}`
  // (nilai = id antrian sebenarnya, isi native per baris; data-id bisa hilang
  // setelah reload #isi). Tanpa id → klik diabaikan (bukan freeze diam).
  function resolveId(row: HTMLTableRowElement, nomor: string): string {
    const direct = row.getAttribute('data-id') || '';
    if (direct) return direct;
    const inp = document.getElementById('id-antrian' + nomor) as HTMLInputElement | null;
    return inp ? inp.value : '';
  }

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== 'function') return;
      // jangan intercept klik pada tombol/input/print (aksi lain)
      if (t.closest('button, input, a, select, .ext-issue-printone, #ext-issue-print')) return;
      const row = t.closest('tr.status-called, tr[data-id]') as HTMLTableRowElement | null;
      if (!row) return;
      const jenis = row.getAttribute('data-jenis') || 'tunggal';
      const nomor = row.getAttribute('data-nomor') || '';
      const id = resolveId(row, nomor);
      if (!id) return;
      const fn = (window as unknown as Record<string, unknown>).panggilUlang;
      if (typeof fn !== 'function') return;
      // Native menyusun pesan WS recall dari `$('#id-' + nomor).val()` — input
      // tersembunyi itu sering KOSONG/basi utk baris riwayat → pesan tanpa nomor
      // → display tak bisa memanggil ulang. Suapi dgn teks kolom pertama baris
      // (mis. "BT-2"); kalau input belum ada, BUAT hidden dulu (native read pakai
      // jQuery selector `#id-N` — harus ada di DOM).
      const nomorTeks = ((row as HTMLTableRowElement).cells?.[0]?.textContent || '').trim();
      if (nomorTeks) {
        let inp = document.getElementById('id-' + nomor) as HTMLInputElement | null;
        if (!inp) {
          inp = document.createElement('input');
          inp.type = 'hidden';
          inp.id = 'id-' + nomor;
          document.body.appendChild(inp);
        }
        inp.value = nomorTeks;
      }
      // Jalur recall TANPA WebSocket (WS native sering mati/refused di lapangan):
      // tulis sinyal recall ke localStorage (same-origin) — display membaca &
      // mengumumkan lewat bell+TTS extension sendiri. WS hidup → display native
      // sudah announce; extension hanya fallback saat WS mati.
      try {
        localStorage.setItem(
          'ext-afd-recall',
          JSON.stringify({ jenis, nomor, nomorTeks, ts: Date.now() }),
        );
      } catch {
        /* ignore */
      }
      e.stopPropagation();
      e.preventDefault();
      (fn as (id: string, jenis: string, nomor: string) => void).call(window, id, jenis, nomor);
    },
    true,
  );
})();
