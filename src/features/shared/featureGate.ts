/**
 * featureGate — gerbang config untuk file fitur yang dimuat LANGSUNG oleh
 * manifest content_scripts (bukan lewat loop featureModules di init.ts).
 *
 * LATAR: 13+ file fitur berbentuk IIFE/auto-run yang jalan saat file di-load,
 * tanpa pernah membaca `features[key].enabled`. Akibatnya toggle OFF di popup
 * tidak berpengaruh — fitur tetap aktif bahkan saat semua dimatikan.
 *
 * POLA PAKAI (di paling luar file fitur):
 *
 *   import { whenFeatureEnabled } from './shared/featureGate.js';
 *   whenFeatureEnabled('resumeValidator', () => {
 *     ... seluruh isi lama ...
 *   });
 *
 * CATATAN:
 * - File yang di-inject ke page world via <script> (fetchWatchdog,
 *   farmasiRecallDeleg) TIDAK punya akses chrome.storage → gate-nya di titik
 *   injeksi (init.ts), bukan di sini.
 * - Entry config yang belum ada dianggap ON (kompatibel mundur; semua fitur
 *   historis selalu jalan). Pengecualian: entry ada + enabled === false → OFF.
 */

const STORAGE_KEY = 'extensionConfig';

export interface FeatureGateEntry {
  enabled?: boolean;
  allowedRoles?: string[];
}

export interface FeatureGateConfig {
  extensionEnabled?: boolean;
  currentRole?: string;
  features?: Record<string, FeatureGateEntry>;
}

/**
 * Keputusan murni: bolehkah fitur `key` jalan? (unit-testable, tanpa I/O)
 *
 * - extensionEnabled === false → false (sakelar GLOBAL mati → semua fitur OFF)
 * - entry hilang → true (kompatibel mundur: fitur lama selalu jalan)
 * - enabled === false → false (user mematikan)
 * - role admin → true (admin melihat semua, konsisten dgn init.ts/popup)
 * - allowedRoles kosong/hilang → true (tak ada batasan role)
 * - role lain → true hanya bila ada di allowedRoles
 */
export function decideFeatureGate(
  key: string,
  config: FeatureGateConfig | null | undefined,
  role?: string,
): boolean {
  // Sakelar global menang atas semua fitur — ini yang dipakai popup/sidepanel
  // saat "Extension dinonaktifkan". Sebelumnya hanya init.ts yang cek ini,
  // sehingga 13+ fitur ber-`whenFeatureEnabled` (termasuk mark) tetap jalan.
  if (config?.extensionEnabled === false) return false;
  const entry = config?.features?.[key];
  if (!entry) return true;
  if (entry.enabled === false) return false;
  const r = role ?? config?.currentRole ?? 'admin';
  if (r === 'admin') return true;
  const allowed = entry.allowedRoles;
  if (!Array.isArray(allowed) || allowed.length === 0) return true;
  return allowed.includes(r);
}

/** Baca config dari background (sudah termigrasi), fallback storage.local. */
export async function isFeatureEnabled(key: string): Promise<boolean> {
  try {
    const resp = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
    if (resp?.config) return decideFeatureGate(key, resp.config as FeatureGateConfig);
  } catch {
    /* background tidur / MAIN world tanpa chrome — fallback di bawah */
  }
  try {
    const store = await chrome.storage.local.get(STORAGE_KEY);
    const cfg = (store?.[STORAGE_KEY] ?? null) as FeatureGateConfig | null;
    return decideFeatureGate(key, cfg);
  } catch {
    return true;
  }
}

/** Jalankan `fn` hanya bila fitur `key` aktif. Tak pernah throw. */
export function whenFeatureEnabled(key: string, fn: () => void): void {
  isFeatureEnabled(key).then((ok) => {
    if (!ok) return;
    try {
      fn();
    } catch (e) {
      console.error(`[featureGate:${key}] gagal jalan:`, e);
    }
  });
}
