import type { ExtModal } from './ext-modal';
import './ext-modal';
import './ext-btn';

export interface ConfirmOptions {
  title: string;
  message?: string;
  variant?: 'warning' | 'danger' | 'success' | 'info';
  okLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  /** Icon besar di atas pesan (opsional, emoji sederhana). */
  icon?: string;
}

/**
 * Konfirmasi modal berbasis Promise — pengganti `swal(...).then(...)` /
 * `confirm()` untuk UI extension. Komponen ext-modal + ext-btn dari shared
 * layer, self-contained (shadow + token), aman dari CSS MORBIS.
 *
 * ```ts
 * const ok = await confirmExt({ title: 'Hapus?', message: 'Yakin?', variant: 'danger' });
 * if (ok) { ... }
 * ```
 */
export function confirmExt(opts: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement('ext-modal') as ExtModal;
    modal.setAttribute('variant', opts.variant ?? 'warning');
    if (opts.okLabel) modal.setAttribute('ok-label', opts.okLabel);
    if (opts.cancelLabel) modal.setAttribute('cancel-label', opts.cancelLabel);
    if (opts.hideCancel) modal.setAttribute('hide-cancel', '');

    modal.innerHTML =
      `<h3 slot="title"></h3>` +
      `<div class="ext-confirm-body"></div>` +
      `<div slot="footer">
         <ext-btn data-ext-confirm-cancel variant="secondary"></ext-btn>
         <ext-btn data-ext-confirm-ok></ext-btn>
       </div>`;

    // title & message via textContent (aman dari HTML injection / XSS),
    // newline → <br> agar pesan berformat tetap terbaca
    const title = modal.querySelector('[slot="title"]')!;
    title.textContent = opts.title;

    const body = modal.querySelector<HTMLElement>('.ext-confirm-body')!;
    if (opts.icon) {
      const icon = document.createElement('div');
      icon.className = 'ext-confirm-icon';
      icon.textContent = opts.icon;
      body.appendChild(icon);
    }
    if (opts.message) {
      const lines = opts.message.split('\n');
      lines.forEach((line, i) => {
        if (i > 0) body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode(line));
      });
    }

    modal.querySelector<HTMLElement>('[data-ext-confirm-ok]')!.textContent =
      opts.okLabel ?? 'Lanjut';
    const okBtn = modal.querySelector<HTMLElement>('[data-ext-confirm-ok]')!;
    okBtn.setAttribute('variant', opts.variant === 'danger' ? 'danger' : 'primary');
    if (opts.hideCancel) {
      modal.querySelector('[data-ext-confirm-cancel]')?.remove();
    } else {
      modal.querySelector<HTMLElement>('[data-ext-confirm-cancel]')!.textContent =
        opts.cancelLabel ?? 'Batal';
    }

    const done = (result: boolean) => {
      modal.remove();
      resolve(result);
    };
    modal.addEventListener('ext-ok', () => done(true));
    modal.addEventListener('ext-cancel', () => done(false));
    document.body.appendChild(modal);
    modal.open();
  });
}
