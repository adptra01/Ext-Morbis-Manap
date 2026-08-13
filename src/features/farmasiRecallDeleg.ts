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

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as HTMLElement | null;
      if (!t || typeof t.closest !== 'function') return;
      // jangan intercept klik pada tombol/input/print (aksi lain)
      if (t.closest('button, input, a, select, .ext-issue-printone, #ext-issue-print')) return;
      const row = t.closest('tr.status-called, tr[data-id]');
      if (!row) return;
      const id = row.getAttribute('data-id') || '';
      const jenis = row.getAttribute('data-jenis') || 'tunggal';
      const nomor = row.getAttribute('data-nomor') || '';
      if (!id) return;
      const fn = (window as unknown as Record<string, unknown>).panggilUlang;
      if (typeof fn !== 'function') return;
      // Native menyusun pesan WS recall dari `$('#id-' + nomor).val()` — input
      // tersembunyi itu sering KOSONG/basi utk baris riwayat → pesan tanpa nomor
      // → display tak bisa memanggil ulang. Suapi dgn teks kolom pertama baris
      // (mis. "BT-2") sebelum panggilUlang dipanggil.
      const nomorTeks = ((row as HTMLTableRowElement).cells?.[0]?.textContent || '').trim();
      if (nomorTeks) {
        const inp = document.getElementById('id-' + nomor) as HTMLInputElement | null;
        if (inp) inp.value = nomorTeks;
      }
      e.stopPropagation();
      e.preventDefault();
      (fn as (id: string, jenis: string, nomor: string) => void).call(window, id, jenis, nomor);
    },
    true,
  );
})();
