/**
 * Versi ekstensi untuk UI (popup & side panel).
 *
 * Sengaja TIDAK di-hardcode: badge versi pernah macet di "v1.2" sementara
 * manifest sudah 1.5.x — CI hanya menjaga konsistensi manifest/update.xml,
 * bukan string di dalam komponen React. Sumber kebenaran tetap manifest.json.
 */

/** Versi dari manifest; string kosong bila API tidak tersedia (mis. unit test). */
export function getExtensionVersion(): string {
  try {
    return chrome?.runtime?.getManifest?.().version ?? '';
  } catch {
    return '';
  }
}

/** Badge siap pakai, mis. `v1.5.92`; kosong bila versi tidak terbaca. */
export function getVersionBadge(): string {
  const v = getExtensionVersion();
  return v ? `v${v}` : '';
}
