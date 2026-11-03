/**
 * Gate unit untuk fitur resepAsli: hanya aktif untuk unit DEPO RANAP
 * atau pasien rawat inap / IGD.
 *
 * Murni (tanpa chrome.*), unit-testable.
 */

/** Cek apakah halaman menampilkan unit DEPO RANAP. */
export function isDepoRanap(doc: Document = document): boolean {
  const text = (doc.body?.textContent || '').toUpperCase();
  return text.includes('DEPO RANAP');
}

/** Cek apakah pasien adalah rawat inap atau IGD. */
export function isRawatInapAtauIgd(doc: Document = document): boolean {
  // Cek meta "Ruangan" / "Kelas" / "Jenis Kunjungan"
  const metaMap = new Map<string, string>();
  doc.querySelectorAll('table').forEach((t) => {
    t.querySelectorAll('tr').forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      if (tds.length < 2) return;
      const label = (tds[0]?.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const value = (tds[1]?.textContent || '').replace(/\s+/g, ' ').trim();
      if (label && !metaMap.has(label)) metaMap.set(label, value);
    });
  });

  const ruangan = (metaMap.get('ruangan') || metaMap.get('ruangan/poli') || '').toUpperCase();
  const kelas = (metaMap.get('kelas') || metaMap.get('kelas rawat') || '').toUpperCase();
  const jenis = (metaMap.get('jenis kunjungan') || metaMap.get('jenis') || '').toUpperCase();

  if (ruangan.includes('IGD') || ruangan.includes('RAWAT INAP')) return true;
  if (kelas.includes('IGD') || kelas.includes('RAWAT INAP')) return true;
  if (jenis.includes('RAWAT INAP') || jenis.includes('IGD')) return true;

  // Cek juga teks body untuk "RAWAT INAP" / "IGD"
  const bodyText = (doc.body?.textContent || '').toUpperCase();
  if (bodyText.includes('RAWAT INAP') || bodyText.includes('IGD')) return true;

  return false;
}

/** Gate gabungan: aktif jika depo ranap ATAU pasien rawat inap/IGD. */
export function isResepAsliAllowed(doc: Document = document): boolean {
  return isDepoRanap(doc) || isRawatInapAtauIgd(doc);
}
