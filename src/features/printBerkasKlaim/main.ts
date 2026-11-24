/** Halaman ekstensi asli untuk dossier cetak M-KLAIM.
 *  Berbeda dari about:blank: punya URL chrome-extension:// sehingga isi
 *  dossier tetap ada setelah tab di-refresh (dibaca ulang dari storage). */
import { installDossierHandlers, installImageTools, loadDossier } from '../shared/printDossier.js';

async function boot(): Promise<void> {
  const loading = document.getElementById('ext-print-loading');
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    if (loading) loading.textContent = 'Dossier tidak ditemukan (parameter id hilang).';
    return;
  }

  let html: string | null;
  try {
    html = await loadDossier(id);
  } catch (e) {
    if (loading)
      loading.textContent =
        'Gagal membaca dossier dari penyimpanan browser: ' +
        (e instanceof Error ? e.message : String(e));
    console.error('[printBerkasKlaim] loadDossier gagal:', e);
    return;
  }
  if (!html) {
    if (loading)
      loading.textContent =
        'Data dossier sudah tidak tersedia (browser pernah di-restart). Silakan klik Cetak Rapi lagi dari halaman M-KLAIM.';
    return;
  }

  // Tulis dokumen lengkap ke halaman ekstensi (CSP 'self': inline <style>
  // diizinkan; tidak ada inline <script> di HTML hasil generate).
  document.open();
  document.write(html);
  document.close();

  installImageTools(window);
  installDossierHandlers(window);
}

void boot();
