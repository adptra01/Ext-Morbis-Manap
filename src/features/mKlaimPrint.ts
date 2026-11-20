import { getMorbisGlobals } from './shared/types.js';
import { HOSPITAL_NAME } from './shared/config.js';

const g = getMorbisGlobals();

/**
 * mKlaimPrint.ts — "Dossier Cetak" M-KLAIM.
 *
 * Mengambil SEMUA section berkas di halaman detail (/v2/m-klaim/
 * detail-v2-refaktor), membersihkan kontrol/CSS lama tiap section, lalu
 * menyusunnya ulang sebagai satu laporan A4 bernomor di tab baru.
 *
 * Arah desain: editorial clinical dossier — kertas hangat, tinta biru-tua,
 * aksen teal, penomoran section di rail kiri dengan aturan vertikal tipis.
 */
interface Section {
  title: string;
  html: string;
}

const REMOVE = [
  'script',
  'style',
  'link[rel="stylesheet"]',
  '.no-print',
  '.hilang-saat-print',
  'button',
  'input',
  'select',
  'textarea',
  'label:has(input[type="checkbox"])',
  '.btn',
  '[data-shortcut-buttons]',
  '[data-back-to-detail-klaim]',
  '[data-bpjs-revision-history]',
  '[onclick]',
  'a[href^="javascript:"]',
];

const val = (id: string): string =>
  (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value?.trim() ||
  '';

/** Ubah kontrol form menjadi teks sebelum dibersihkan — banyak section
 *  (mis. Pengkjadian IGD) menyimpan data pasien di `value` input/textarea,
 *  jadi menghapus input mentah membuat data hilang. */
function flattenControls(root: HTMLElement): void {
  const span = (text: string): HTMLSpanElement => {
    const s = document.createElement('span');
    s.className = 'fv';
    s.textContent = text;
    return s;
  };
  root.querySelectorAll<HTMLInputElement>('input').forEach((el) => {
    const type = (el.type || 'text').toLowerCase();
    if (type === 'hidden') {
      el.remove();
      return;
    }
    if (type === 'radio' || type === 'checkbox') {
      if (!el.checked) {
        el.remove();
        return;
      }
      // Radio: label di depannya sudah memuat teks pilihan → cukup centang
      // (mengeluarkan value radio duplikat seperti "Non Rujukan ✓ Non Rujukan").
      if (type === 'radio') {
        el.replaceWith(span('✓'));
        return;
      }
      const v = (el.value || '').trim();
      const human = v
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      el.replaceWith(span(human ? '✓ ' + human : '✓'));
      return;
    }
    const v = (el.value || '').trim();
    if (v) el.replaceWith(span(v));
    else el.remove();
  });
  root.querySelectorAll<HTMLTextAreaElement>('textarea').forEach((el) => {
    const v = (el.value || '').trim();
    if (v) el.replaceWith(span(v));
    else el.remove();
  });
  root.querySelectorAll<HTMLSelectElement>('select').forEach((el) => {
    const opt = el.options[el.selectedIndex];
    const v = (opt?.textContent || el.value || '').trim();
    if (v) el.replaceWith(span(v));
    else el.remove();
  });
}

function clean(section: HTMLElement): string {
  const c = section.cloneNode(true) as HTMLElement;
  // Canvas PDF (pdf.js) tidak ikut tersalin oleh cloneNode → ubah jadi img
  // data-URL dari canvas asli supaya berkas tetap tampil di dossier.
  const sourceCanvas = Array.from(section.querySelectorAll('canvas'));
  const cloneCanvas = Array.from(c.querySelectorAll('canvas'));
  sourceCanvas.forEach((cv, i) => {
    const target = cloneCanvas[i];
    if (!target) return;
    try {
      const img = document.createElement('img');
      img.src = cv.toDataURL('image/png');
      img.style.cssText = 'max-width:100%;height:auto;';
      target.replaceWith(img);
    } catch {
      const note = document.createElement('div');
      note.className = 'fv';
      note.textContent = '[Berkas PDF — silakan buka di halaman asli]';
      target.replaceWith(note);
    }
  });
  flattenControls(c);
  REMOVE.forEach((sel) => c.querySelectorAll(sel).forEach((el) => el.remove()));
  // Buang sel kosong di AKHIR baris tabel (colspan kosong dari markup asli
  // yang bikin tabel Rincian Biaya punya kolom kanan lebar dan kosong).
  // Sel tengah tidak disentuh agar tidak menggeser kolom data.
  c.querySelectorAll('tr').forEach((tr) => {
    const cells = Array.from(tr.cells);
    for (let i = cells.length - 1; i >= 0; i--) {
      const cell = cells[i];
      const empty = !(cell.textContent || '').trim() && !cell.querySelector('img,table,input');
      if (!empty) break;
      cell.remove();
    }
  });
  c.querySelectorAll('[style]').forEach((el) => {
    // Buang style inline lama (font Consolas, lebar paksa, dll.) — tapi
    // pertahankan atribut layout jinak yang dipakai tabel medis.
    const s = el.getAttribute('style') || '';
    const keep = (s.match(/(?:text-align|width|vertical-align|white-space)\s*:[^;]+/gi) || []).join(
      ';',
    );
    if (keep) el.setAttribute('style', keep);
    else el.removeAttribute('style');
  });
  c.removeAttribute('id');
  c.removeAttribute('class');
  c.removeAttribute('style');
  // Bungkus kosong → buang.
  c.querySelectorAll('div').forEach((el) => {
    if (!el.children.length && !(el.textContent || '').trim()) el.remove();
  });
  return c.innerHTML.trim();
}

function titleOf(section: HTMLElement, i: number): string {
  const head = section.querySelector('.panel-heading, .panel-title, legend, h4');
  let t = (head?.textContent || '').replace(/\s+/g, ' ').trim();
  t = t.replace(/^Cetak\s+/i, '').replace(/^[\d.,\s-]+/, '');
  return t || `Berkas ${String(i + 1).padStart(2, '0')}`;
}

function collectSections(): Section[] {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.isidalam'));
  const seen = new Set<string>();
  const out: Section[] = [];
  nodes.forEach((node, i) => {
    const html = clean(node);
    if (html.length < 20) return;
    const title = titleOf(node, i);
    // Dedup oleh JUDUL (unique per berkas). Dedup by potongan HTML salah
    // kaprah: beberapa dokumen punya pembuka <div width:100%> yang sama
    // persis → section besar (mis. Pengkajian IGD) ikut terbuang.
    if (seen.has(title)) return;
    seen.add(title);
    out.push({ title, html });
  });
  if (!out.length) {
    const fallback = document.querySelector<HTMLElement>('#section-to-print');
    if (fallback) out.push({ title: 'Detail Klaim', html: clean(fallback) });
  }
  return out;
}

const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );

function buildHtml(sections: Section[]): string {
  // PNG resolusi penuh — logo.svg aslinya cuma 28x33 & pucat di kertas putih.
  const logo = '/assets/images/logo/Kota Jambi.png';
  const row = (label: string, value: string): string =>
    `<div class="meta-item"><span class="meta-label">${esc(label)}</span><span class="meta-value">${esc(value || '—')}</span></div>`;
  const toc = sections
    .map(
      (s, i) =>
        `<span class="toc-chip"><b>${String(i + 1).padStart(2, '0')}</b> ${esc(s.title)}</span>`,
    )
    .join('');
  const docs = sections
    .map(
      (s, i) => `
      <section class="doc">
        <div class="doc-head">
          <span class="doc-num">${String(i + 1).padStart(2, '0')}</span>
          <h2>${esc(s.title)}</h2>
          <span class="doc-rule"></span>
        </div>
        <div class="doc-body">${s.html}</div>
      </section>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<base href="${esc(location.origin)}">
<title>Dossier Cetak M-KLAIM — ${esc(HOSPITAL_NAME)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#17212b; --muted:#5b6b78; --accent:#0f766e; --accent-soft:#e6f4f1;
  --paper:#fdfcf9; --rule:#d7dee2; --chip:#f1f5f4;
  --sans:'IBM Plex Sans','Segoe UI',sans-serif; --serif:'Source Serif 4',Georgia,serif;
}
@page{size:A4;margin:14mm 13mm;}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:var(--paper); color:var(--ink); font-family:var(--sans);
  font-size:11px; line-height:1.55; padding:22px 26px;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.cover{
  display:grid; grid-template-columns:64px 1fr; gap:16px; align-items:center;
  border-bottom:3px double var(--ink); padding-bottom:14px; margin-bottom:18px;
}
.cover img{width:64px;height:64px;object-fit:contain;}
.eyebrow{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);font-weight:700;}
.cover h1{font-family:var(--serif);font-size:22px;line-height:1.15;margin:3px 0 2px;font-weight:700;}
.cover .sub{font-size:10px;color:var(--muted);}
.meta{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px 16px;
  border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);
  padding:10px 0;margin-bottom:12px;background:transparent;
}
.meta-item{display:flex;flex-direction:column;gap:2px;min-width:0;}
.meta-label{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600;}
.meta-value{font-weight:600;font-size:11px;overflow-wrap:anywhere;}
.toc{
  display:flex;flex-wrap:wrap;gap:2px 0;padding:0 0 10px;border-bottom:1px solid var(--rule);margin-bottom:18px;
}
.toc-chip{font-size:9px;color:var(--muted);padding:0;}
.toc-chip:not(:last-child)::after{content:' ·';color:var(--rule);margin-left:6px;}
.toc-chip b{color:var(--accent);font-weight:700;margin-right:3px;}
.doc{margin:0 0 24px;break-inside:avoid-page;}
.doc-head{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;border-bottom:1px solid var(--ink);padding-bottom:5px;}
.doc-num{
  font-family:var(--serif);font-size:15px;color:var(--accent);font-weight:700;
  min-width:24px;
}
.doc-head h2{
  font-family:var(--serif);font-size:13px;margin:0;text-transform:uppercase;
  letter-spacing:.06em;
}
.doc-rule{display:none;}
.doc-body{background:transparent;border:0;border-radius:0;padding:2px 0 0;}
.doc-body table{width:100%!important;border-collapse:collapse!important;margin:0 0 10px;border:0!important;}
.doc-body th,.doc-body td{border:0!important;border-bottom:1px solid var(--rule)!important;padding:5px 7px;font-size:10px!important;text-align:left;vertical-align:top;overflow-wrap:anywhere;}
.doc-body th{background:transparent!important;font-weight:700;color:var(--ink);border-bottom:1px solid var(--ink)!important;letter-spacing:.04em;text-transform:uppercase;font-size:9px!important;}
.doc-body h1,.doc-body h2,.doc-body h3{font-family:var(--serif);font-size:13px;margin:6px 0;}
.doc-body p{margin:3px 0;}
.doc-body label{display:inline-block;min-width:112px;font-weight:600;color:var(--muted);font-size:9px;letter-spacing:.02em;text-transform:uppercase;}
.doc-body .fv{font-weight:500;color:var(--ink);}
.doc-body img{max-width:100%!important;height:auto!important;}
.doc-body .panel,.doc-body .isidalam,.doc-body .card{border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;width:100%!important;}
.screen-bar{
  position:sticky;top:0;z-index:9;display:flex;justify-content:flex-end;gap:8px;
  background:rgba(253,252,249,.94);backdrop-filter:blur(6px);
  padding:8px 0 12px;margin:-22px -26px 14px;padding-left:26px;padding-right:26px;
  border-bottom:1px solid var(--rule);
}
.screen-bar button{font:inherit;font-size:11px;font-weight:600;cursor:pointer;border-radius:5px;padding:7px 14px;}
.btn-print{background:var(--accent);color:#fff;border:1px solid var(--accent);}
.btn-close{background:#fff;color:var(--ink);border:1px solid var(--rule);}
.sign{display:flex;justify-content:flex-end;margin-top:26px;}
.sign-box{width:230px;text-align:center;font-size:10px;color:var(--muted);}
.sign-space{height:52px;}
@media print{
  .screen-bar{display:none!important;}
  body{padding:0;background:#fff;font-size:10px;}
  .doc{break-after:page;}
  .doc:last-child{break-after:auto;}
  .meta,.toc,.doc-body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
}
@media screen and (max-width:900px){
  .meta{grid-template-columns:repeat(2,minmax(0,1fr));}
}
</style>
</head>
<body>
<div class="screen-bar">
  <button type="button" class="btn-close" id="close-view">Tutup</button>
  <button type="button" class="btn-print" id="print-view">🖨 Cetak</button>
</div>
<header class="cover">
  <img src="${esc(logo)}" alt="Logo">
  <div>
    <div class="eyebrow">Dossier Cetak · Detail Klaim</div>
    <h1>${esc(HOSPITAL_NAME)}</h1>
    <div class="sub">Laporan lengkap berkas klaim &bull; ${new Date().toLocaleString('id-ID')}</div>
  </div>
</header>
<div class="meta">
  ${row('No. RM', val('norm'))}
  ${row('Nama Pasien', val('nama'))}
  ${row('No. Registrasi', val('no_registrasi') || val('reg'))}
  ${row('ID Visit', val('id_visit'))}
  ${row('Tanggal Awal', val('tanggalAwal'))}
  ${row('Tanggal Akhir', val('tanggalAkhir'))}
  ${row('Status', val('status'))}
  ${row('Billing', val('billing'))}
</div>
<div class="toc">${toc}</div>
<main>${docs}</main>
<div class="sign"><div class="sign-box">
  <div>Petugas Verifikasi</div><div class="sign-space"></div>
  <div><strong>( .................................... )</strong></div>
</div></div>
<script>
(function(){
  function doPrint(){ window.focus(); window.print(); }
  document.getElementById('print-view').addEventListener('click', doPrint);
  document.getElementById('close-view').addEventListener('click', function(){
    if (window.confirm('Tutup halaman cetak ini?')) window.close();
  });
  window.addEventListener('load', function(){ setTimeout(doPrint, 500); });
  window.addEventListener('afterprint', function(){
    if (window.confirm('Apakah menu print ini akan ditutup?')) window.close();
  });
})();
</script>
</body>
</html>`;
}

function handleMklaimPrint(): void {
  const sections = collectSections();
  if (!sections.length) {
    window.alert('Tidak ada section berkas yang bisa dicetak.');
    return;
  }
  const win = window.open('', '_blank');
  if (!win) {
    window.alert('Popup diblokir — izinkan popup untuk membuka dossier cetak M-KLAIM.');
    return;
  }
  win.document.open();
  win.document.write(buildHtml(sections));
  win.document.close();
}

function anchorForButton(): HTMLElement | null {
  // Action bar bawah: tombol Print native (onclick printDiv) / Kembali.
  const nativePrint = Array.from(document.querySelectorAll<HTMLElement>('button.btn-success')).find(
    (b) => /^printDiv\s*\(/i.test(b.getAttribute('onclick') || ''),
  );
  if (nativePrint?.parentElement) return nativePrint.parentElement;
  const bar = Array.from(
    document.querySelectorAll<HTMLElement>('div[style*="text-align:right"]'),
  ).find((d) => d.querySelector('button'));
  return bar || document.getElementById('SCETAK') || document.body;
}

function renderMklaimPrintButton(): void {
  if (!window.location.pathname.includes('/v2/m-klaim/detail-v2-refaktor')) return;
  if (document.getElementById('ext-mklaim-print-btn')) return;
  const host = anchorForButton();
  const btn = document.createElement('button');
  btn.id = 'ext-mklaim-print-btn';
  btn.type = 'button';
  btn.className = 'btn btn-primary btn-sm';
  btn.style.cssText =
    'margin-left:8px;background:#0f766e;border-color:#0f766e;color:#fff;font-weight:600;' +
    'border-radius:4px;padding:5px 12px;cursor:pointer;white-space:nowrap;';
  btn.innerHTML = '🖨 Cetak Rapi M-KLAIM';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleMklaimPrint();
  });
  // Taruh PALING AKHIR di action bar bawah (gabung dengan Kembali,
  // Verif/Revisi bila ada, dan tombol mark) — bukan di depan tombol Print.
  host.appendChild(btn);
}

if (typeof g.featureModules !== 'undefined') {
  g.featureModules.mKlaimPrint = {
    id: 'mKlaimPrint',
    name: 'Cetak Rapi M-KLAIM',
    description:
      'Dossier cetak A4 profesional: semua section berkas klaim disusun rapi di tab baru',
    match: { prefix: '/v2/m-klaim/detail-v2-refaktor' },
    run: () => {
      const check = (): void => renderMklaimPrintButton();
      if (document.readyState === 'complete') window.setTimeout(check, 500);
      else window.addEventListener('load', () => window.setTimeout(check, 500));
      const keepLast = (): void => {
        const btn = document.getElementById('ext-mklaim-print-btn');
        if (btn?.parentElement && btn.parentElement.lastElementChild !== btn) {
          // Tombol mark (Telaah/Partial/Labor/...) bisa ditambahkan belakangan
          // — geser tombol cetak supaya tetap PALING AKHIR di action bar.
          btn.parentElement.appendChild(btn);
        }
      };
      const obs = new MutationObserver(() => {
        if (!document.getElementById('ext-mklaim-print-btn')) renderMklaimPrintButton();
        else keepLast();
      });
      obs.observe(document.body, { childList: true, subtree: true });
      // Jaga juga saat observer tidak terpicu (render ulang cepat).
      window.setInterval(keepLast, 1500);
    },
  };
}
