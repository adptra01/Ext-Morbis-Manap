/**
 * mKlaimLaporanLinks — tombol "Laporan Klaim BPJS" di halaman list
 * /v2/m-klaim. Pola yang sama dengan penerimaanExport: buka halaman
 * laporan Reports di TAB BARU, lalu user mencari / memfilter /
 * mengekspor sendiri di sana. Halaman list MORBIS tetap di tempat
 * (tidak pernah location.href).
 *
 * SATU tombol (permintaan user 2026-10-02: "di halaman aslinya cukup 1
 * button saja jangan sampai ada 3"). Sebelumnya dua tombol — "Laporan
 * Pre-op" + "Laporan Revisi BPJS" — di samping tombol Export asli MORBIS.
 * Sekarang laporan Pre-op dan Revisi digabung jadi satu halaman
 * Reports (`/laporan-klaim-bpjs`) yang punya filter "Jenis Laporan"
 * (semua / Pre-op / Revisi), jadi satu tombol sudah menutup keduanya.
 *
 * SENGAJA tanpa query string (permintaan user 2026-10-05): filter form
 * M-KLAIM TIDAK dibawa ke halaman laporan — halaman laporan dibuka polos
 * (default tanggal = hari ini, jenis = semua) supaya user tidak bingung
 * melihat filter ter-prefill dari form lain. Rantai prefill lama
 * (readKlaimFilter/resolveLaporanFilter/buildKlaimParams) dihapus total.
 */
import { getMorbisGlobals } from './shared/types.js';
import { whenFeatureEnabled } from './shared/featureGate.js';
import { ensureCasemixBase } from './shared/casemixApi.js';
import { runWhenIdle } from './shared/whenIdle.js';

const g = getMorbisGlobals();

/** Halaman laporan gabungan di Reports ( Reports SIMRS, W-7.19 ). */
export const LAPORAN_KLAIM_PATH = '/laporan-klaim-bpjs';

/** URL halaman laporan polos — tanpa query string, tanpa prefill filter. */
export function buildLaporanUrl(base: string): string {
  return base.replace(/\/+$/, '') + LAPORAN_KLAIM_PATH;
}

/** Buka halaman laporan gabungan di tab baru (polos, tanpa filter).
 *
 *  Tab dibuka SEBELUM menunggu jaringan (window.open sinkron di dalam
 *  handler klik — kalau menunggu await dulu, popup-blocker menutupnya).
 *  Base dipastikan via ensureCasemixBase (override per-PC yang mati
 *  otomatis diganti fallback); tanpa override, URL langsung jadi.
 */
function openLaporan(): void {
  const w = window.open('about:blank', '_blank');
  if (!w) {
    window.alert('Popup diblokir — izinkan popup untuk halaman ini lalu ulangi.');
    return;
  }
  void Promise.resolve()
    .then(() => ensureCasemixBase())
    .then((base) => {
      const url = buildLaporanUrl(base);
      window.console.info('[mKlaimLaporanLinks] buka laporan klaim →', url);
      w.location.href = url;
    })
    .catch(() => {
      try {
        w.close();
      } catch {
        /* ignore */
      }
      window.alert('Gagal menyiapkan koneksi Reports — coba lagi.');
    });
}

function makeLinkButton(
  id: string,
  label: string,
  title: string,
  refBtn: HTMLElement | null | undefined,
  onClick: () => void,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = id;
  btn.type = 'button';
  btn.className = refBtn?.className || 'btn btn-info';
  const refStyle = refBtn?.getAttribute('style');
  if (refStyle) btn.setAttribute('style', refStyle);
  btn.style.display = 'inline-block';
  btn.style.marginLeft = '8px';
  const icon = refBtn?.querySelector('i');
  if (icon) {
    btn.appendChild(icon.cloneNode(true));
    btn.appendChild(document.createTextNode(' '));
  }
  btn.appendChild(document.createTextNode(label));
  btn.title = title;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });
  return btn;
}

export function injectLaporanButtons(): void {
  if (document.getElementById('ext-laporan-klaim-btn')) return;

  // Jangkar: tombol Cari/Tampil pada form filter; fallback tombol asli
  // MORBIS, terakhir tabel pertama.
  const anchor = Array.from(
    document.querySelectorAll('button, input[type="button"], input[type="submit"]'),
  ).find((b) => {
    const t = ((b as HTMLInputElement).value || b.textContent || '').trim().toLowerCase();
    return /^(cari|tampil|tampilkan|filter)$/.test(t);
  }) as HTMLElement | undefined;
  const refBtn =
    anchor ?? (document.querySelector('button[onclick*="loadTableExcel"]') as HTMLElement | null);

  const btnKlaim = makeLinkButton(
    'ext-laporan-klaim-btn',
    'Laporan Klaim BPJS',
    'Buka laporan Pre-op & Revisi Klaim BPJS di Reports (halaman polos, filter diisi sendiri di sana)',
    refBtn,
    () => openLaporan(),
  );

  if (anchor?.parentNode) {
    anchor.parentNode.insertBefore(btnKlaim, anchor.nextSibling);
  } else {
    const table = document.querySelector('table');
    if (table?.parentNode) {
      table.parentNode.insertBefore(btnKlaim, table);
    }
  }
}

export function initLaporanLinks(): void {
  if (window.location.pathname.includes('/detail')) return;
  runWhenIdle(injectLaporanButtons);
  window.setInterval(() => {
    try {
      if (document.hidden) return;
    } catch {
      /* ignore */
    }
    injectLaporanButtons();
  }, 3000);
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.laporanLinks = {
    id: 'laporanLinks',
    name: 'Tautan Laporan Klaim BPJS (M-KLAIM)',
    description: 'Tombol buka laporan gabungan Pre-op & Revisi BPJS di Reports (halaman polos)',
    match: {
      oneOf: [
        { pathname: '/v2/m-klaim' },
        { pathname: '/v2/m-klaim/' },
        { pathname: '/v2/m-klaim/index' },
      ],
      exclude: [{ prefix: '/v2/m-klaim/detail' }],
    },
    run: initLaporanLinks,
  };
}

// Auto-run jika dimuat langsung (load-unpacked/dev) — TETAP lewat gate
// config supaya toggle OFF di popup benar-benar menonaktifkan fitur.
whenFeatureEnabled('laporanLinks', () => {
  if (
    (window.location?.pathname ?? '').startsWith('/v2/m-klaim') &&
    !(window.location?.pathname ?? '').includes('/detail')
  ) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLaporanLinks);
    } else {
      initLaporanLinks();
    }
  }
});
