/**
 * Server-safe filename rewrite for batch upload — NORM_tgl_basename.ext
 * (e.g. `35447_20260907_laporan.pdf`).
 *
 * Pure function, no DOM/chrome deps → unit-testable.
 */
export interface UploadNameSource {
  filename: string;
  norm?: string;
  tanggal?: string;
}

export function rewriteUploadFilename(item: UploadNameSource, customBase?: string): string {
  const filename = item.filename || '';

  // --- Jika customBase diberikan (yaitu keterangan dari pengguna),
  // gunakannya langsung sebagai basename setelah disanitasi.
  if (customBase) {
    const sBase = customBase
      .replace(/[^\w\s.-]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^[._]+|[._]+$/g, '')
      .slice(0, 60);
    const extMatch = filename.match(/\.([A-Za-z0-9]+)$/);
    const ext = extMatch ? '.' + extMatch[1].toLowerCase() : '';
    const norm = (item.norm || '').replace(/\D/g, '').slice(0, 20);
    const tgl = (item.tanggal || '').replace(/\D/g, '').slice(0, 8);
    const prefix = [norm, tgl].filter(Boolean).join('_');
    return prefix ? `${prefix}_${sBase}${ext}` : `${sBase}${ext}`;
  }

  // --- Logika default (tanpa customBase) — mulai sini sepert aslinya
  const extMatch = filename.match(/\.([A-Za-z0-9]+)$/);
  const base0 = extMatch ? filename.slice(0, -extMatch[0].length) : filename;

  // ponytail: collapse doubled extensions from repeated re-uploads
  // (`foto.pdfpdf` → `.pdf`, `x.pdf.pdf` → `.pdf`). Token-level check so
  // legit extensions (`pdf`, weird `16`) are left alone.
  const knownExts = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
  const token = (extMatch?.[1] || '').toLowerCase();
  const doubled = knownExts.find((k) => token.endsWith(k) && token.length > k.length);
  const ext = doubled ? '.' + doubled : extMatch ? '.' + token : '';
  const base = doubled ? base0 : base0.replace(/\.(pdf|jpe?g|png|gif)$/i, '');

  // --- Strip already-applied prefixes so re-uploads don't stack names ---
  // Server renames every upload to `{norm}-{unix_ts}-{nama}`; re-uploading a
  // file downloaded from the server compounds that prefix forever (and it can
  // appear MULTIPLE times mid-name). Drop every occurrence. Our own previous
  // rename (`NORM_tgl_...`) is never re-stacked either.
  const cleaned = base.replace(/\d{1,9}-\d{10}-/g, '').replace(/^(\d+)_\d{8}_/, '');

  // --- Sanitize ---
  const cleanBase =
    cleaned
      .replace(/[^\w\s.-]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^[._]+|[._]+$/g, '')
      .slice(0, 60) || 'dokumen';
  const norm = (item.norm || '').replace(/\D/g, '').slice(0, 20);
  const tgl = (item.tanggal || '').replace(/\D/g, '').slice(0, 8);
  const prefix = [norm, tgl].filter(Boolean).join('_');
  return prefix ? `${prefix}_${cleanBase}${ext}` : `${cleanBase}${ext}`;
}
