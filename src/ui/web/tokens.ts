/**
 * Design tokens — satu sumber kebenaran visual untuk semua UI ekstensi.
 * Dipakai via constructable stylesheet yang di-adopt ke setiap Shadow Root,
 * sehingga komponen vanilla maupun React memakai bahasa visual yang sama.
 *
 * Arah desain: "Klinis Tenang" — hijau klinis MORBIS, kontras tinggi,
 * tipografi besar & jelas (target usia 30–40), motion halus.
 */
export const FONT_STACK =
  '"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

const TOKENS_CSS = `
  :host {
    /* Brand */
    --ext-primary: #00875a;
    --ext-primary-hover: #007049;
    --ext-primary-soft: #e6f4ef;

    /* Semantic */
    --ext-success: #027a48;
    --ext-success-soft: #e8f6ef;
    --ext-warning: #b54708;
    --ext-warning-soft: #fdf1e3;
    --ext-danger: #d92d20;
    --ext-danger-hover: #b42318;
    --ext-danger-soft: #fdeceb;
    --ext-info: #175cd3;
    --ext-info-soft: #e8f0fd;

    /* Surface */
    --ext-bg: #f4f6f8;
    --ext-surface: #ffffff;
    --ext-surface-2: #f8fafc;
    --ext-border: #d0d5dd;

    /* Text — kontras tinggi untuk keterbacaan usia 30-40 */
    --ext-text: #1c2530;
    --ext-text-secondary: #475467;
    --ext-text-muted: #667085;
    --ext-text-on-primary: #ffffff;

    /* Typography — lebih besar dari default, untuk mudah dibaca */
    --ext-font-family: ${FONT_STACK};
    --ext-font-size-xs: 12px;
    --ext-font-size-sm: 13px;
    --ext-font-size-md: 15px;
    --ext-font-size-lg: 17px;
    --ext-font-size-xl: 20px;
    --ext-line-height: 1.5;

    /* Radius */
    --ext-radius-sm: 6px;
    --ext-radius-md: 10px;
    --ext-radius-lg: 14px;

    /* Spacing */
    --ext-space-1: 4px;
    --ext-space-2: 8px;
    --ext-space-3: 12px;
    --ext-space-4: 16px;
    --ext-space-5: 20px;
    --ext-space-6: 24px;
    --ext-space-8: 32px;

    /* Shadow */
    --ext-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
    --ext-shadow-md: 0 6px 20px rgba(16, 24, 40, 0.1);
    --ext-shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.18);

    /* Focus ring — terlihat jelas, penting utk usability */
    --ext-ring: 0 0 0 3px rgba(0, 135, 90, 0.35);

    /* Motion */
    --ext-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ext-duration-fast: 140ms;
    --ext-duration-normal: 220ms;
  }
`;

let sharedSheet: CSSStyleSheet | null = null;

/** Satu constructable stylesheet berisi tokens, dipakai semua shadow root. */
export function getTokenSheet(): CSSStyleSheet {
  if (!sharedSheet) {
    sharedSheet = new CSSStyleSheet();
    sharedSheet.replaceSync(TOKENS_CSS);
  }
  return sharedSheet;
}

/** Inject font Plus Jakarta Sans sekali ke document (halaman http → pakai http, aman dari mixed-content). */
let fontInjected = false;
export function ensureFont(): void {
  if (fontInjected || document.getElementById('ext-pjs-font')) return;
  fontInjected = true;
  const link = document.createElement('link');
  link.id = 'ext-pjs-font';
  link.rel = 'stylesheet';
  link.href =
    'http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
}

/** Attach shadow root + adopt token sheet. Return shadow root. */
export function attachShadowWithTokens(el: HTMLElement, mode: ShadowRootMode = 'open'): ShadowRoot {
  const root = el.attachShadow({ mode });
  root.adoptedStyleSheets = [getTokenSheet()];
  ensureFont();
  return root;
}

/** Attach token sheet ke shadow root yang sudah ada (untuk React mount). */
export function adoptTokens(root: ShadowRoot): void {
  root.adoptedStyleSheets = [getTokenSheet()];
  ensureFont();
}

/**
 * Inject token sebagai CSS custom properties di document :root.
 * Hanya custom properties (prefix --ext-), tidak mengubah layout apa pun —
 * dipakai supaya CSS konten server-rendered (mis. tabel MORBIS) bisa memakai
 * bahasa visual yang sama tanpa masuk shadow DOM.
 */
let tokensInjected = false;
export function injectGlobalTokens(): void {
  if (tokensInjected) return;
  tokensInjected = true;
  const style = document.createElement('style');
  style.id = 'ext-token-css';
  style.textContent = TOKENS_CSS.replace(':host', ':root');
  document.head.appendChild(style);
}
