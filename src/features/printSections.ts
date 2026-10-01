/**
 * printSections — cetak otomatis berkas pada halaman detail M-KLAIM.
 *
 * MASALAH YANG DISELESAIKAN (terukur di live 103.147.236.140):
 * Halaman `detail-v2-refaktor` menyaji 24 section `div.isidalam`, masing-masing
 * berpasangan dengan checkbox APP `checkedPrint(checkbox, id)`:
 *
 *   function checkedPrint(elem, idElem) {
 *     if (elem.checked) $('#' + idElem).removeClass('no-print');
 *     else             $('#' + idElem).addClass('no-print');
 *   }
 *
 * `onclick`-nya HANYA jalan saat user klik. Section yang checkbox-nya tidak
 * dicentang tapi TIDAK punya class `no-print` sejak awal (cetak-sbpk,
 * pembayaran-gabung, cetak-resume, cetak-telaah, file-upload-sep) tetap
 * tercetak padahal tidak dipilih. Akibatnya 1 kunjungan = 20 halaman, dan
 * 12 halaman di antaranya PUTIH (section kosong cuma berisi tombol "Cetak X"
 * + satu `<hr>`).
 *
 * SOLUSI: checkbox tidak dipakai sebagai sumber kebenaran. Section yang punya
 * isi dideteksi otomatis, section kosong disembunyikan, dan tiap dokumen
 * dikecilkan agar pas di 1 lembar A4 — seperti berkas cetak manual.
 */

import { getMorbisGlobals } from './shared/types.js';
import { injectCSS } from '../shared/ui/index.js';
import { whenFeatureEnabled } from './shared/featureGate.js';

const g = getMorbisGlobals();

// ── Konstanta geometri cetak ────────────────────────────────────────────────
// A4 = 210 × 297mm. Margin 8mm per sisi (printer BMJ punya area non-cetak ~5mm,
// jadi 8mm aman). CSS px print = 1/96 inch.
const MM_TO_PX = 96 / 25.4;
const PAGE_CONTENT_W_MM = 210 - 8 * 2; // 194mm
const PAGE_CONTENT_H_MM = 297 - 8 * 2; // 281mm
const PAGE_W = Math.round(PAGE_CONTENT_W_MM * MM_TO_PX); // 733px
const PAGE_H = Math.round(PAGE_CONTENT_H_MM * MM_TO_PX); // 1062px

/**
 * Safety margin saat mengunci tinggi kotak halaman (~1,6mm). Tanpa ini kotak
 * berisi tepat 1062px = tinggi area cetak, dan pembulatan Chrome/Microsoft Print
 * to PDF mendorong timbulnya 1 halaman kosong di belakang.
 */
const PAGE_H_SAFE = PAGE_H - 6;

/**
 * Batas bawah penskalaan. Di bawah ini teks 9pt jadi <6pt → tak terbaca di
 * kertas. Dokumen yang butuh skala lebih kecil TIDAK dipaksa: ia tetap 1:1 dan
 * mengalir ke 2 halaman (header tabel tetap berulang). Turunkan ke 0.55 hanya
 * kalau Anda tetap mau 1 lember walau kecil.
 */
const MIN_SCALE = 0.7;

/** Teks placeholder yang bukan isi dokumen. */
const PLACEHOLDER_RE = /^(-+|—+|-?|n\/?a|null|undefined|tbd|\?)$/i;

/** Elemen UI yang bukan isi dokumen saat menghitung "isi". */
const UI_SELECTOR =
  'input,button,select,textarea,label,script,style,hr,' +
  '.panel-heading,.pdf-viewer,canvas,.watermark';

// ── Helper murni (unit-testable) ─────────────────────────────────────────────

/** Apakah teks sel/barisconsidered isi nyata (bukan placeholder)? */
export function isRealContentText(text: string | null | undefined): boolean {
  const t = (text ?? '').trim();
  return t.length > 2 && !PLACEHOLDER_RE.test(t);
}

/**
 * Keputusan "section ini ada isinya?" dari tiga sinyal yang sudah dibersihkan
 * di luar fungsi ini (biar mudah diuji tanpa DOM).
 */
export function sectionHasContent(input: {
  /** Teks baris tabel yang sudah dibersihkan dari placeholder. */
  tableRows?: string[];
  /** Teks section setelah node UI dibuang. */
  textWithoutUi?: string;
  /** Jumlah file ter-render (canvas PDF.js) dengan ukuran nyata. */
  renderedFiles?: number;
  /** Lebar/tinggi file ter-render dalam px (0 = belum ter-render). */
  renderedSizePx?: number;
}): boolean {
  if ((input.tableRows ?? []).some(isRealContentText)) return true;
  if ((input.textWithoutUi ?? '').trim().length > 30) return true;
  if ((input.renderedFiles ?? 0) > 0 && (input.renderedSizePx ?? 0) > 0) return true;
  return false;
}

/**
 * Hitung skala + tinggi kotak halaman agar dokumen pas di 1 lembar.
 * `scale === 1` berarti muat natural (tak perlu dikecilkan).
 */
export function fitToSinglePage(
  contentHeightPx: number,
  pageHeightPx: number = PAGE_H,
  minScale: number = MIN_SCALE,
): { scale: number; boxHeightPx: number; fitsOnePage: boolean; needed: number } {
  if (!(contentHeightPx > 0) || !(pageHeightPx > 0)) {
    return { scale: 1, boxHeightPx: 0, fitsOnePage: true, needed: 1 };
  }
  if (contentHeightPx <= pageHeightPx) {
    return { scale: 1, boxHeightPx: 0, fitsOnePage: true, needed: 1 };
  }
  const needed = pageHeightPx / contentHeightPx;
  const scale = Math.max(minScale, Math.min(1, needed));
  const fitsOnePage = contentHeightPx * scale <= pageHeightPx + 0.5;
  // Kalau tidak muat Even di skala minimum, biarkan mengalir natural (tanpa
  // clip) — kotak halaman tak dikunci tinggi.
  return { scale, boxHeightPx: fitsOnePage ? contentHeightPx * scale : 0, fitsOnePage, needed };
}

// ── Implementasi DOM ─────────────────────────────────────────────────────────

const DOC_CLASS = 'ext-print-doc';
const DOC_LAST_CLASS = 'ext-print-doc-last';
const FIT_CLASS = 'ext-print-fit';
const EMPTY_CLASS = 'ext-print-empty';
const PAGE_BOX_ATTR = 'data-ext-print-box';
const MEASURE_CLASS = 'ext-print-measuring';

/**
 * CSS pengukuran: meniru aturan @media print persis (lebar 194mm, font 9pt,
 * padding rapat, panel-heading/hr disembunyikan) supaya tinggi yang diukur
 * sama dengan tinggi saat dicetak. Hanya aktif saat pengukuran.
 */
function injectMeasureCSS(): void {
  injectCSS(
    'ext-print-measure',
    `html.${MEASURE_CLASS},html.${MEASURE_CLASS} body{
      width:${PAGE_W}px!important;max-width:${PAGE_W}px!important;background:#fff!important;}
    html.${MEASURE_CLASS} .navbar,html.${MEASURE_CLASS} .main-sidebar,
    html.${MEASURE_CLASS} .sidebar,html.${MEASURE_CLASS} .footer,
    html.${MEASURE_CLASS} .breadcrumb,html.${MEASURE_CLASS} .panel-heading,
    html.${MEASURE_CLASS} hr,html.${MEASURE_CLASS} input,
    html.${MEASURE_CLASS} .pdf-viewer,html.${MEASURE_CLASS} .watermark{
      display:none!important;}
    html.${MEASURE_CLASS} .wrapper,html.${MEASURE_CLASS} .container,
    html.${MEASURE_CLASS} .container-fluid,html.${MEASURE_CLASS} .row,
    html.${MEASURE_CLASS} [class*=col-md],html.${MEASURE_CLASS} [class*=col-sm],
    html.${MEASURE_CLASS} .content,html.${MEASURE_CLASS} .content-wrapper,
    html.${MEASURE_CLASS} .panel,html.${MEASURE_CLASS} .panel-body,
    html.${MEASURE_CLASS} .box-body{
      margin:0!important;padding:0!important;width:100%!important;
      max-width:none!important;float:none!important;border:0!important;
      box-shadow:none!important;background:#fff!important;}
    html.${MEASURE_CLASS} table{
      border-collapse:collapse!important;font-size:9pt!important;line-height:1.25!important;}
    html.${MEASURE_CLASS} th,html.${MEASURE_CLASS} td{
      padding:1.5px 3px!important;vertical-align:top!important;}
    html.${MEASURE_CLASS} thead{display:table-header-group!important;}
    html.${MEASURE_CLASS} h1,html.${MEASURE_CLASS} h2,html.${MEASURE_CLASS} h3,
    html.${MEASURE_CLASS} h4,html.${MEASURE_CLASS} h5{margin:0 0 2mm!important;}
    /* saat pengukuran, tiap dokumen diukur pada lebar penuh tanpa transform */
    html.${MEASURE_CLASS} .${DOC_CLASS}{height:auto!important;overflow:visible!important;}
    html.${MEASURE_CLASS} .${FIT_CLASS}{transform:none!important;width:auto!important;}
  `,
  );
}

function injectPrintCSS(): void {
  injectCSS(
    'ext-print-sections',
    `@media print{
      @page{size:A4;margin:8mm;}
      html,body{background:#fff!important;width:auto!important;}
      /* section kosong (cuma tombol "Cetak X") tak pernah ikut cetak */
      .${EMPTY_CLASS}{display:none!important;}
      /* satu dokumen = satu halaman, seperti berkas cetak manual */
      .${DOC_CLASS}{page-break-after:always;break-after:page;}
      .${DOC_LAST_CLASS}{page-break-after:auto;break-after:auto;}
      /* kotak halaman mengunci tinggi hasil penskalaan supaya tepat 1 lembar.
         Tinggi & skala dikirim lewat custom property dari JS, bukan inline
         style langsung: inline style berlaku juga di layar, sedangkan
         penskalaan hanya boleh berlaku saat print. */
      .${DOC_CLASS}[${PAGE_BOX_ATTR}="1"]{
        height:var(--ext-print-box-h,auto)!important;
        overflow:hidden!important;
      }
      .${FIT_CLASS}{
        transform:scale(var(--ext-print-scale,1));
        width:calc(100% / var(--ext-print-scale,1));
      }
      /* halaman file ter-render: satu file = satu lembar penuh */
      .${DOC_CLASS}[data-ext-print-file]{page-break-after:always;break-after:page;
        page-break-inside:avoid;break-inside:avoid;}
      .${DOC_CLASS}[data-ext-print-file][${DOC_LAST_CLASS}]{page-break-after:auto;break-after:auto;}
      /* rapikan kerangka Bootstrap */
      .navbar,.navbar-default,.main-sidebar,.sidebar,.footer,.breadcrumb,
      .panel-heading,hr,input[type=checkbox],.no-print{display:none!important;}
      .wrapper,.container,.container-fluid,.row,[class*=col-md],[class*=col-sm],
      .content,.content-wrapper,.panel,.panel-body,.box-body{
        margin:0!important;padding:0!important;width:100%!important;
        max-width:none!important;float:none!important;border:0!important;
        box-shadow:none!important;background:#fff!important;}
      /* tabel rapat: padding kecil, header berulang, baris tak terpotong */
      table{border-collapse:collapse!important;font-size:9pt;line-height:1.25;}
      th,td{padding:1.5px 3px!important;vertical-align:top;}
      thead{display:table-header-group;}
      tfoot{display:table-footer-group;}
      tr,td,th{page-break-inside:avoid;break-inside:avoid;}
      h1,h2,h3,h4,h5{margin:0 0 2mm!important;page-break-after:avoid;break-after:avoid;}
      img{max-width:100%!important;height:auto!important;}
    }`,
  );
}

/** Ambil section `div.isidalam` milik APP (bukan milik ekstensi). */
function collectSections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('div.isidalam')].filter(
    (el) => !el.classList.contains(DOC_CLASS) && !el.classList.contains(EMPTY_CLASS),
  );
}

/** Whether a section actually contains a document (cleaned of UI nodes). */
function detectContent(sec: HTMLElement): boolean {
  const rows: string[] = [];
  for (const tr of sec.querySelectorAll('tr')) {
    rows.push((tr.innerText ?? '').trim());
  }

  const clone = sec.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(UI_SELECTOR).forEach((n) => n.remove());

  // File ter-render (PDF.js canvas) = dokumen nyata. Ambil yang punya ukuran.
  let renderedFiles = 0;
  let renderedSizePx = 0;
  for (const cv of sec.querySelectorAll<HTMLCanvasElement>('canvas')) {
    const w = cv.clientWidth || cv.width;
    const h = cv.clientHeight || cv.height;
    if (w > 20 && h > 20) {
      renderedFiles++;
      renderedSizePx = Math.max(renderedSizePx, w * h);
    }
  }

  return sectionHasContent({
    tableRows: rows,
    textWithoutUi: (clone.innerText ?? '').trim(),
    renderedFiles,
    renderedSizePx,
  });
}

/** Bungkus isi section dengan kotak halaman + lapisan yang bisa diskalakan. */
function wrapForPrint(sec: HTMLElement): HTMLElement {
  let box = sec.querySelector<HTMLElement>(`:scope > .${FIT_CLASS}`);
  if (!box) {
    box = document.createElement('div');
    box.className = FIT_CLASS;
    while (sec.firstChild) box.appendChild(sec.firstChild);
    sec.appendChild(box);
  }
  return box;
}

/**
 * Ukur tinggi natural tiap dokumen pada layout CETAK (lebar 194mm, font 9pt,
 * padding rapat) — bukan layout layar, yang font/padding-nya jauh lebih besar
 * dan membuat dokumen terlihat "meluap" padahal di kertas muat.
 *
 * `.ext-print-measuring` meniru aturan @media print persis, jadi angka yang
 * keluar = tinggi yang akan benar-benar dipakai printer. Ditemporary-kan di
 * <html> lalu dilepas dalam satu tick sinkron -> tak ada kedipan.
 */
function measureAndScale(docs: HTMLElement[]): void {
  if (docs.length === 0) return;
  const html = document.documentElement;
  html.classList.add(MEASURE_CLASS);

  try {
    for (const sec of docs) {
      const box = wrapForPrint(sec);
      const natural = box.scrollHeight;
      const fit = fitToSinglePage(natural, PAGE_H_SAFE);

      if (fit.scale < 1 && fit.fitsOnePage) {
        // Kotak halaman dikunci setinggi hasil skala -> tepat 1 lembar, tanpa clip.
        // Nilai dikirim sebagai custom property: gaya di screen tak terpengaruh.
        sec.style.setProperty('--ext-print-box-h', `${Math.round(fit.boxHeightPx)}px`);
        box.style.setProperty('--ext-print-scale', fit.scale.toFixed(4));
        sec.setAttribute(PAGE_BOX_ATTR, '1');
      } else {
        sec.removeAttribute(PAGE_BOX_ATTR);
        sec.style.removeProperty('--ext-print-box-h');
        box.style.removeProperty('--ext-print-scale');
      }

      if (fit.scale < 1 && !fit.fitsOnePage) {
        console.info(
          `[PrintSections] "${sec.id}": butuh skala ${fit.needed.toFixed(2)} < batas ${MIN_SCALE} ` +
            `-> dicetak natural (${Math.ceil(natural / PAGE_H)} halaman) demi keterbacaan`,
        );
      }
    }
  } finally {
    html.classList.remove(MEASURE_CLASS);
  }
}

/**
 * Pisahkan file ter-render (canvas PDF.js) jadi satu lembar per halaman file.
 * Section aslinya disembunyikan karena isinya sudah diwakili page-box.
 */
function splitRenderedFiles(sec: HTMLElement): boolean {
  const canvases = [...sec.querySelectorAll<HTMLCanvasElement>('canvas')].filter(
    (cv) => (cv.clientWidth || cv.width) > 20 && (cv.clientHeight || cv.height) > 20,
  );
  if (canvases.length === 0) return false;

  for (const cv of canvases) {
    const page = document.createElement('div');
    page.className = DOC_CLASS;
    page.setAttribute('data-ext-print-file', sec.id || 'file');
    cv.style.maxHeight = `${PAGE_H}px`;
    cv.style.width = 'auto';
    cv.style.maxWidth = '100%';
    page.appendChild(cv);
    sec.parentElement?.insertBefore(page, sec);
  }
  sec.classList.add(EMPTY_CLASS);
  return true;
}

function applySections(): void {
  const sections = collectSections();
  const printable: HTMLElement[] = [];

  for (const sec of sections) {
    if (sec.classList.contains(EMPTY_CLASS)) continue;
    if (!detectContent(sec)) {
      sec.classList.add(EMPTY_CLASS);
      continue;
    }
    sec.classList.remove(EMPTY_CLASS);

    // File ter-render: satu lembar per halaman file.
    if (splitRenderedFiles(sec)) continue;

    // Buang sisa state APP supaya dokumen ini benar-benar ikut cetak.
    sec.classList.remove('no-print');
    sec.classList.add(DOC_CLASS);
    printable.push(sec);
  }

  // Dokumen terakhir ditentukan dari urutan DOM (bukan urutan array) supaya
  // page-break-after tak menyisakan satu halaman kosong di akhir cetakan.
  const inDomOrder = [...document.querySelectorAll<HTMLElement>(`.${DOC_CLASS}`)];
  for (const el of inDomOrder) el.classList.remove(DOC_LAST_CLASS);
  inDomOrder[inDomOrder.length - 1]?.classList.add(DOC_LAST_CLASS);

  // Sinkronkan checkbox APP supaya tampilan layar = yang akan tercetak.
  for (const sec of printable) {
    const cb = document.querySelector<HTMLInputElement>(
      `input[type=checkbox][onclick*="${CSS.escape(sec.id || '')}"]`,
    );
    if (!cb) continue;
    cb.checked = true;
    cb.disabled = false;
  }
  for (const sec of sections) {
    if (sec.classList.contains(EMPTY_CLASS)) {
      const cb = document.querySelector<HTMLInputElement>(
        `input[type=checkbox][onclick*="${CSS.escape(sec.id || '')}"]`,
      );
      if (cb) {
        cb.checked = false;
        cb.disabled = true; // gray out: there's nothing to print
      }
    }
  }

  measureAndScale(printable);
}

function initPrintSections(): void {
  if (document.getElementById('ext-print-sections') === null) injectPrintCSS();
  if (document.getElementById('ext-print-measure') === null) injectMeasureCSS();
  injectCSS(
    'ext-print-sections-ui',
    `.${EMPTY_CLASS} > .panel-heading{opacity:.45;}
     input[type=checkbox][disabled]{cursor:not-allowed;}`,
  );

  // Section dimuat async oleh APP -> beforeprint adalah sumber kebenaran terakhir.
  window.addEventListener(
    'beforeprint',
    () => {
      try {
        applySections();
      } catch (e) {
        console.error('[PrintSections] gagal applied:', e);
      }
    },
    { passive: true },
  );

  // Jalankan sekali saat DOM siap (klasifikasi awal untuk checkbox).
  const runOnce = () => {
    try {
      applySections();
    } catch (e) {
      console.error('[PrintSections] gagal applied:', e);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOnce, { once: true });
  } else {
    runOnce();
  }

  // Re-klasifikasi saat section baru dimuat (throttled).
  let timer = 0;
  const obs = new MutationObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(runOnce, 800);
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.printSections = {
    id: 'printSections',
    name: 'Cetak Otomatis Berkas (M-KLAIM)',
    description:
      'Cetak hanya berkas yang ada isinya, tiap dokumen pas 1 lembar A4 (tanpa perlu centang checkbox)',
    match: {
      oneOf: [{ prefix: '/v2/m-klaim/detail' }],
    },
    run: initPrintSections,
  };
}

// Auto-run bila dimuat langsung (load-unpacked/dev) — TETAP lewat gate config
// supaya toggle OFF di popup benar-benar menonaktifkan fitur.
whenFeatureEnabled('printSections', () => {
  if ((window.location?.pathname ?? '').includes('/v2/m-klaim/detail')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPrintSections);
    } else {
      initPrintSections();
    }
  }
});
