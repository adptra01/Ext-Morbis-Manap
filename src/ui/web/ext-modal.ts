import { attachShadowWithTokens } from './tokens';

/**
 * <ext-modal open title="..." variant="warning|danger|success|info" ok-label="Ya, Batal" cancel-label="Tutup">
 *   Isi pesan
 * </ext-modal>
 *
 * Modal konfirmasi/aplikasi — besar, jelas, tegas (usia 30-40, mudah dibaca).
 * Events:
 *   - 'ext-ok'      → tombol utama diklik
 *   - 'ext-cancel'  → tombol batal / X / klik overlay / Esc
 * Atribut:
 *   - open          → tampilkan
 *   - title         → judul
 *   - variant       → skema warna (default: warning)
 *   - ok-label      → teks tombol utama (default "Lanjut")
 *   - cancel-label  → teks tombol sekunder (default "Batal")
 *   - hide-cancel   → sembunyikan tombol sekunder
 */
const STYLE = `
  :host { display: none; }
  :host([open]) { display: block; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(2px);
    animation: ext-fade var(--ext-duration-normal) var(--ext-ease);
    padding: var(--ext-space-6);
  }
  .modal {
    width: 520px;
    max-width: 100%;
    background: var(--ext-surface);
    border-radius: var(--ext-radius-lg);
    box-shadow: var(--ext-shadow-lg);
    overflow: hidden;
    animation: ext-slide-up var(--ext-duration-normal) var(--ext-ease);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ext-space-4);
    padding: var(--ext-space-5) var(--ext-space-6);
    border-bottom: 1px solid var(--ext-border);
  }
  .title {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-lg);
    font-weight: 700;
    color: var(--ext-text);
    margin: 0;
  }
  .close {
    appearance: none;
    border: none;
    background: var(--ext-surface-2);
    color: var(--ext-text-secondary);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--ext-duration-fast) var(--ext-ease), color var(--ext-duration-fast) var(--ext-ease);
  }
  .close:hover { background: var(--ext-danger-soft); color: var(--ext-danger); }
  .close:focus-visible { outline: none; box-shadow: var(--ext-ring); }

  .body {
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text-secondary);
    padding: var(--ext-space-6);
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ext-space-3);
    padding: 0 var(--ext-space-6) var(--ext-space-6);
  }
  /* tombol utama di dalam modal memakai komponen ext-btn — styling via atribut host */
  ::slotted(*) { font-family: var(--ext-font-family); }

  /* variant accent line */
  :host([variant='danger']) .header { box-shadow: inset 4px 0 0 var(--ext-danger); }
  :host([variant='success']) .header { box-shadow: inset 4px 0 0 var(--ext-success); }
  :host([variant='info']) .header { box-shadow: inset 4px 0 0 var(--ext-info); }
  :host([variant='warning']) .header { box-shadow: inset 4px 0 0 var(--ext-warning); }

  @keyframes ext-fade { from { opacity: 0; } }
  @keyframes ext-slide-up {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
  }
`;

export class ExtModal extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = attachShadowWithTokens(this);
    this.root.innerHTML = `
      <style>${STYLE}</style>
      <div class="overlay">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="header">
            <h3 class="title"><slot name="title"></slot></h3>
            <button class="close" part="close" aria-label="Tutup">&times;</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    const overlay = this.root.querySelector('.overlay')!;
    const closeBtn = this.root.querySelector('.close')!;

    closeBtn.addEventListener('click', () => this.cancel());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.cancel();
    });
    document.addEventListener('keydown', this.handleKey);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKey);
  }

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.hasAttribute('open')) this.cancel();
  };

  get titleSlot(): HTMLElement | null {
    return this.querySelector('[slot="title"]');
  }

  get footerSlot(): HTMLElement | null {
    return this.querySelector('[slot="footer"]');
  }

  open(): void {
    this.setAttribute('open', '');
  }

  close(): void {
    this.removeAttribute('open');
  }

  cancel(): void {
    this.dispatchEvent(new CustomEvent('ext-cancel'));
    this.close();
  }

  ok(): void {
    this.dispatchEvent(new CustomEvent('ext-ok'));
  }
}

if (!customElements.get('ext-modal')) customElements.define('ext-modal', ExtModal);
