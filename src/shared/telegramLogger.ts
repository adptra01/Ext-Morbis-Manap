/**
 * Remote error logging via Telegram Bot (production only).
 *
 * Alur: content script / feature → chrome.runtime.sendMessage(LOG_TO_TELEGRAM)
 * → background SW → fetch api.telegram.org (bebas CSP/CORS halaman MORBIS).
 *
 * Keamanan data pasien (wajib):
 *  - sanitizeMessage() memblokir No. RM / NIK / deretan angka sensitif
 *    SEBELUM pesan meninggalkan content script (double-guard: background
 *    juga menyaring ulang sebelum kirim ke Telegram).
 *  - Bot token & chat ID hanya di-inject saat build --production (define
 *    esbuild), dev build berisi string kosong → tidak ada pengiriman.
 *
 * Rate limit: maksimal 5 pesan identik per menit (in-memory per halaman).
 */

/** Masking format No RM (12-34-56 / 123456) & NIK / deretan angka 6–16 digit. */
export function sanitizeMessage(input: string): string {
  if (!input) return '';
  return input
    .replace(/\b\d{2}-\d{2}-\d{2}\b/g, '[NO_RM_REDACTED]')
    .replace(/\b\d{6,16}\b/g, '[NUMERIC_DATA_REDACTED]');
}

/** Rate limiter sederhana: batasi pesan identik (5/menit). */
const sentLogs = new Map<string, number>();
const RATE_LIMIT = 5; // per menit
const RATE_WINDOW_MS = 60_000;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const count = sentLogs.get(key) ?? 0;
  if (count >= RATE_LIMIT) return true;
  sentLogs.set(key, count + 1);
  // cleanup entri lama biar Map tidak membesar tanpa batas
  if (sentLogs.size > 100) {
    for (const [k, t] of sentLogs) {
      if (now - t > RATE_WINDOW_MS) sentLogs.delete(k);
    }
  }
  return false;
}

export interface TelegramLogOptions {
  level?: 'error' | 'warn';
  /** Nama fitur/komponen sumber (mis. 'cancelButton', 'antrianFarmasi'). */
  feature: string;
  message: string;
}

/** Kirim log error ke Telegram via background (no-op jika dev / rate-limited). */
export function reportToTelegram(opts: TelegramLogOptions): void {
  const message = sanitizeMessage(opts.message);
  if (!message || rateLimited(opts.feature + ':' + message)) return;
  try {
    void chrome.runtime.sendMessage({
      type: 'LOG_TO_TELEGRAM',
      level: opts.level ?? 'error',
      feature: opts.feature,
      message,
    });
  } catch {
    /* best-effort — logging tidak boleh merusak alur fitur */
  }
}

export type TelegramLogger = typeof reportToTelegram;
