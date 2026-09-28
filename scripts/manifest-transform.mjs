/**
 * Transformasi manifest untuk build PRODUKSI.
 *
 * Produksi TIDAK boleh mengangkut host development di host_permissions
 * (least-privilege): http://127.0.0.1, http://localhost, *.ddev.site hanya
 * berguna saat development lokal. Manifest yang lolos ke dist/ (dan akhirnya
 * ke device farmasi 50-500 mesin) cukup membawa host produksi SIMRS.
 *
 * Guard regresi: tests/unit/manifest-prod.test.ts
 */
export const DEV_HOSTS = ['http://127.0.0.1/*', 'http://localhost/*', 'http://*.ddev.site/*'];

/**
 * Salin manifest & buang host development dari host_permissions.
 * Murni (tidak memutasi input) agar dipakai untuk dev/tests juga.
 */
export function stripDevHosts(manifest) {
  const next = JSON.parse(JSON.stringify(manifest));
  if (Array.isArray(next.host_permissions)) {
    const removed = next.host_permissions.filter((h) => DEV_HOSTS.includes(h));
    if (removed.length > 0) {
      console.log(`[manifest] production: hapus dev host_permissions → ${removed.join(', ')}`);
    }
    next.host_permissions = next.host_permissions.filter((h) => !DEV_HOSTS.includes(h));
  }
  return next;
}
