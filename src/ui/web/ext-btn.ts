import { attachShadowWithTokens } from './tokens';

/**
 * <ext-btn variant="primary|danger|success|secondary|ghost" size="sm|md|lg" loading disabled>
 *   Teks / slot
 * </ext-btn>
 * Button konsisten untuk semua fitur. Variant & size semantik — feature tidak
 * mengatur styling langsung (prinsip: komponen yang menentukan tampilan).
 */
const STYLE = `
  :host { display: inline-block; }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ext-space-2);
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    line-height: 1.2;
    border: 1px solid transparent;
    border-radius: var(--ext-radius-md);
    padding: 10px 18px;
    cursor: pointer;
    transition: background-color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      transform var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
    min-height: 42px;
    white-space: nowrap;
  }
  button:hover:not(:disabled) { transform: translateY(-1px); }
  button:active:not(:disabled) { transform: translateY(0); }
  button:focus-visible { outline: none; box-shadow: var(--ext-ring); }
  button:disabled { opacity: 0.55; cursor: not-allowed; }

  /* sizes */
  :host([size='sm']) button { font-size: var(--ext-font-size-sm); padding: 6px 12px; min-height: 32px; border-radius: var(--ext-radius-sm); }
  :host([size='lg']) button { font-size: var(--ext-font-size-lg); padding: 13px 24px; min-height: 50px; }

  /* variants */
  :host([variant='primary']) button { background: var(--ext-primary); color: var(--ext-text-on-primary); }
  :host([variant='primary']) button:hover:not(:disabled) { background: var(--ext-primary-hover); }
  :host([variant='danger']) button { background: var(--ext-danger); color: var(--ext-text-on-primary); }
  :host([variant='danger']) button:hover:not(:disabled) { background: var(--ext-danger-hover); }
  :host([variant='success']) button { background: var(--ext-success); color: var(--ext-text-on-primary); }
  :host([variant='secondary']) button { background: var(--ext-surface); color: var(--ext-text); border-color: var(--ext-border); }
  :host([variant='secondary']) button:hover:not(:disabled) { background: var(--ext-surface-2); }
  :host([variant='ghost']) button { background: transparent; color: var(--ext-primary); }
  :host([variant='ghost']) button:hover:not(:disabled) { background: var(--ext-primary-soft); }
  :host([variant='ghost-danger']) button { background: transparent; color: var(--ext-danger); }
  :host([variant='ghost-danger']) button:hover:not(:disabled) { background: var(--ext-danger-soft); }

  /* loading spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ext-spin 0.7s linear infinite;
    display: none;
  }
  :host([loading]) .spinner { display: inline-block; }
  :host([loading]) button { pointer-events: none; opacity: 0.8; }
  @keyframes ext-spin { to { transform: rotate(360deg); } }
`;

export class ExtBtn extends HTMLElement {
  private btn: HTMLButtonElement;

  constructor() {
    super();
    const root = attachShadowWithTokens(this);
    root.innerHTML = `
      <style>${STYLE}</style>
      <button type="button">
        <span class="spinner" aria-hidden="true"></span>
        <span class="label"><slot></slot></span>
      </button>
    `;
    this.btn = root.querySelector('button')!;
  }

  connectedCallback() {
    this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading');
    this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
    // forward click dari button dalam ke host supaya addEventListener di <ext-btn> jalan
    this.btn.addEventListener('click', (e) => {
      if (this.hasAttribute('loading') || this.hasAttribute('disabled')) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
    });
  }

  static get observedAttributes() {
    return ['disabled', 'loading'];
  }

  attributeChangedCallback(name: string) {
    if (name === 'disabled' || name === 'loading') {
      this.btn.disabled = this.hasAttribute('disabled') || this.hasAttribute('loading');
      this.btn.setAttribute('aria-busy', this.hasAttribute('loading') ? 'true' : 'false');
    }
  }
}

if (!customElements.get('ext-btn')) customElements.define('ext-btn', ExtBtn);
