/**
 * Server-safe filename rewrite for batch upload — random/timestamp based.
 * Generates: `upload_<timestamp>_<random>.ext`
 * Always uses image extensions (jpg/png) since files are converted to images.
 *
 * Pure function, no DOM/chrome deps → unit-testable.
 */
export interface UploadNameSource {
  filename: string;
  norm?: string;
  tanggal?: string;
}

function generateTimestampName(ext: string): string {
  const now = new Date();
  const timestamp = now.getTime(); // milliseconds since epoch
  const random = Math.random().toString(36).substring(2, 8); // 6 chars random
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  return `upload_${dateStr}_${timestamp}_${random}${ext}`;
}

export function rewriteUploadFilename(_item: UploadNameSource, _customBase?: string): string {
  // Generate timestamp-based random name with .jpg extension
  // Always convert to JPEG image
  return generateTimestampName('.jpg');
}
