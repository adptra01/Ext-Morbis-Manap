import { attachShadowWithTokens } from './tokens';

/**
 * <ext-input type="text" placeholder="..." value="..." size="sm|md|lg" disabled invalid>
 * Input konsisten untuk fitur vanilla. Pakai `.value` seperti `<input>` biasa.
 * Event `input`/`change`/`focus`/`blur` sampai ke host, jadi listener dipasang
 * di elemen `<ext-input>`, bukan di dalam shadow.
 */
const STYLE = `
  :host { display: block; }
  input {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    line-height: var(--ext-line-height);
    color: var(--ext-text);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-md);
    padding: 9px 12px;
    min-height: 42px;
    transition: border-color var(--ext-duration-fast) var(--ext-ease),
      box-shadow var(--ext-duration-fast) var(--ext-ease);
  }
  input::placeholder { color: var(--ext-text-muted); }
  input:focus { outline: none; border-color: var(--ext-primary); box-shadow: var(--ext-ring); }
  input:disabled { background: var(--ext-surface-2); color: var(--ext-text-muted); cursor: not-allowed; }
  :host([invalid]) input { border-color: var(--ext-danger); }

  :host([size='sm']) input {
    font-size: var(--ext-font-size-sm);
    padding: 6px 10px;
    min-height: 32px;
    border-radius: var(--ext-radius-sm);
  }
  :host([size='lg']) input {
    font-size: var(--ext-font-size-lg);
    padding: 12px 14px;
    min-height: 50px;
  }
`;

export class ExtInput extends HTMLElement {
  private input: HTMLInputElement;

  constructor() {
    super();
    const root = attachShadowWithTokens(this);
    root.innerHTML = `<style>${STYLE}</style><input />`;
    this.input = root.querySelector('input')!;
    // change/focus/blur tidak composed → teruskan agar listener di host tetap jalan
    for (const ev of ['change', 'focus', 'blur'] as const) {
      this.input.addEventListener(ev, () => this.dispatchEvent(new Event(ev)));
    }
  }

  static get observedAttributes() {
    return ['type', 'placeholder', 'value', 'disabled', 'invalid'];
  }

  connectedCallback() {
    this.sync();
  }

  attributeChangedCallback() {
    this.sync();
  }

  private sync() {
    const { input } = this;
    if (!input) return;
    input.type = this.getAttribute('type') || 'text';
    input.placeholder = this.getAttribute('placeholder') || '';
    input.disabled = this.hasAttribute('disabled');
    input.setAttribute('aria-invalid', this.hasAttribute('invalid') ? 'true' : 'false');
    const v = this.getAttribute('value');
    if (v !== null && input.value !== v) input.value = v;
  }

  get value(): string {
    return this.input.value;
  }

  set value(v: string) {
    this.input.value = v ?? '';
  }

  focus() {
    this.input.focus();
  }
}

if (!customElements.get('ext-input')) customElements.define('ext-input', ExtInput);
