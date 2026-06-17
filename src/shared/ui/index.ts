import { colors } from './colors';
export { colors };

/* ── Style injection ── */

const injectedSheets = new Set<string>();

export function injectCSS(id: string, css: string): HTMLStyleElement {
  if (injectedSheets.has(id)) {
    const existing = document.getElementById(id) as HTMLStyleElement | null;
    if (existing) return existing;
  }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
  injectedSheets.add(id);
  return style;
}

export function removeInjectedCSS(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.remove();
    injectedSheets.delete(id);
  }
}

/* ── DOM helpers ── */

export function div(
  className?: string,
  children?: (HTMLElement | string | null | undefined)[],
): HTMLDivElement {
  const el = document.createElement('div');
  if (className) el.className = className;
  if (children) appendAll(el, children);
  return el;
}

export function span(text?: string, className?: string): HTMLSpanElement {
  const el = document.createElement('span');
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}

function appendAll(
  parent: HTMLElement,
  children: (HTMLElement | string | null | undefined)[],
): void {
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else {
      parent.appendChild(child);
    }
  }
}

/* ── Shadcn-style component builders ── */

type BtnVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';

export function createButton(
  text: string,
  variant: BtnVariant = 'default',
  options?: { size?: 'sm' | 'default'; icon?: string; disabled?: boolean; id?: string },
): HTMLButtonElement {
  const sizes = {
    sm: 'padding:5px 10px;font-size:11px;line-height:16px;',
    default: 'padding:6px 14px;font-size:12px;line-height:18px;',
  };
  const variants: Record<BtnVariant, string> = {
    default: `background:${colors.primary};color:${colors.primaryForeground};border:none;`,
    secondary: `background:${colors.secondary};color:${colors.secondaryForeground};border:none;`,
    outline: `background:transparent;color:${colors.foreground};border:1px solid ${colors.border};`,
    ghost: `background:transparent;color:${colors.foreground};border:none;`,
    destructive: `background:${colors.destructive};color:${colors.destructiveForeground};border:none;`,
  };

  const btn = document.createElement('button');
  btn.textContent = text;
  if (options?.id) btn.id = options.id;
  if (options?.disabled) btn.disabled = true;
  btn.style.cssText = [
    'display:inline-flex;align-items:center;justify-content:center;gap:4px;',
    'border-radius:6px;',
    'font-weight:500;cursor:pointer;white-space:nowrap;',
    'transition:all 0.15s ease;',
    'user-select:none;',
    sizes[options?.size || 'default'],
    variants[variant],
    options?.disabled ? 'opacity:0.5;pointer-events:none;' : '',
  ].join('');
  btn.onmouseenter = () => {
    if (!btn.disabled) btn.style.opacity = '0.85';
  };
  btn.onmouseleave = () => {
    if (!btn.disabled) btn.style.opacity = '1';
  };
  return btn;
}

export function createBadge(
  text: string,
  variant: 'default' | 'success' | 'warning' | 'danger' = 'default',
): HTMLSpanElement {
  const vars = {
    default: `background:${colors.infoBg};color:${colors.info};border:1px solid ${colors.border};`,
    success: `background:${colors.successBg};color:${colors.success};border:1px solid ${colors.success}33;`,
    warning: `background:${colors.warningBg};color:${colors.warning};border:1px solid ${colors.warning}33;`,
    danger: `background:${colors.errorBg};color:${colors.error};border:1px solid ${colors.error}33;`,
  };
  const el = document.createElement('span');
  el.textContent = text;
  el.style.cssText = [
    'display:inline-flex;align-items:center;gap:4px;',
    'padding:1px 8px;font-size:11px;font-weight:600;border-radius:9999px;user-select:none;',
    vars[variant],
  ].join('');
  return el;
}

export function createControlBar(id?: string): HTMLDivElement {
  const bar = document.createElement('div');
  bar.style.cssText = [
    'display:flex;align-items:center;gap:8px;',
    `padding:6px 12px;background:${colors.muted};`,
    `border:1px solid ${colors.border};border-radius:6px;`,
    'font-size:12px;line-height:18px;user-select:none;',
  ].join('');
  if (id) bar.id = id;
  return bar;
}

export function createFloatingButton(
  text: string,
  options?: {
    size?: number;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    variant?: BtnVariant;
    id?: string;
    title?: string;
  },
): HTMLButtonElement {
  const btn = createButton(text, options?.variant || 'default', { size: 'sm' });
  btn.style.cssText += [
    'position:fixed;z-index:9999;',
    `width:${options?.size || 44}px;height:${options?.size || 44}px;`,
    'border-radius:50%;padding:0;font-size:14px;font-weight:700;',
    `box-shadow:0 2px 8px rgba(0,0,0,0.15);`,
    options?.top ? `top:${options.top};` : '',
    options?.right ? `right:${options.right};` : '',
    options?.bottom ? `bottom:${options.bottom};` : '',
    options?.left ? `left:${options.left};` : '',
  ].join('');
  if (options?.id) btn.id = options.id;
  if (options?.title) btn.title = options.title;
  return btn;
}

export function createToast(
  message: string,
  variant: 'success' | 'error' | 'warning' | 'info' = 'info',
  options?: { duration?: number },
): HTMLDivElement {
  const vars = {
    success: `background:${colors.successBg};color:${colors.success};border:1px solid ${colors.success}33;`,
    error: `background:${colors.errorBg};color:${colors.error};border:1px solid ${colors.error}33;`,
    warning: `background:${colors.warningBg};color:${colors.warning};border:1px solid ${colors.warning}33;`,
    info: `background:${colors.infoBg};color:${colors.info};border:1px solid ${colors.border};`,
  };

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = [
    'position:fixed;bottom:20px;right:20px;z-index:99999;',
    'padding:10px 16px;font-size:12px;font-weight:600;border-radius:6px;',
    'box-shadow:0 4px 16px rgba(0,0,0,0.14);',
    'animation:fadeSlideIn 0.2s ease-out;',
    vars[variant],
  ].join('');
  document.body.appendChild(toast);

  const duration = options?.duration ?? 3000;
  setTimeout(() => {
    (toast as HTMLDivElement).style.transition = 'opacity 0.2s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, duration);

  return toast;
}

/* ── Inject keyframes for animations ── */

injectCSS(
  'ext-shared-animations',
  `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
);
