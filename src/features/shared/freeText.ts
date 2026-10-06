/**
 * freeText — netralkan pemaksa besar-kecil huruf di form MORBIS (murni,
 * unit-tested).
 *
 * Halaman input MORBIS (mis. input-hasil-pa) mengikat `toUpper(this)` di
 * keypress+blur hampir SEMUA input/textarea: tiap ketikan langsung
 * di-Title-Case ("Sp.OG(K)" → "Sp.og(k)", "pH" → "Ph"). Nilai yang
 * tersimpan/tercetak pun ikut berubah — bukan sekadar tampilan.
 *
 * Solusi: timpa `window.toUpper` dengan no-op yang mengembalikan nilai
 * apa adanya. Handler halaman (`toUpper(this)`, inline maupun jQuery)
 * me-resolve global LAZY saat event → selalu kena versi kita, tanpa
 * menyentuh listener halaman. Kontrak return dipertahankan
 * (`obj.value`) untuk pemanggil yang memakainya.
 */
export const FREE_TEXT_MARK = 'ext-free-text-noop';

/** CSS pengaman: kapitalisasi visual (text-transform) juga dimatikan. */
export const FREE_TEXT_CSS =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])' +
  ',textarea,select{text-transform:none!important}';

export interface WindowLike {
  toUpper?: unknown;
}

/** Timpa global `toUpper` bila belum versi kita. Return true bila (sudah) netral. */
export function neutralizeToUpper(w: WindowLike): boolean {
  try {
    const cur = w.toUpper as { [FREE_TEXT_MARK]?: boolean } | undefined;
    if (typeof cur === 'function' && cur[FREE_TEXT_MARK] === true) return true;
    const noop = function (obj: { value?: unknown }): unknown {
      return obj?.value ?? '';
    };
    (noop as unknown as Record<string, boolean>)[FREE_TEXT_MARK] = true;
    try {
      Object.defineProperty(w, 'toUpper', {
        value: noop,
        writable: true,
        configurable: true,
      });
    } catch {
      w.toUpper = noop;
    }
    return true;
  } catch {
    return false;
  }
}
