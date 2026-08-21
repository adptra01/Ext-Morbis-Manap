import { attachShadowWithTokens } from './tokens';

/**
 * <ext-badge variant="success|warning|danger|info|neutral">Teks</ext-badge>
 * Label status kecil — untuk memberi konteks cepat pada petugas.
 */
const STYLE = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-xs);
    font-weight: 700;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }
  :host([variant='success']) { background: var(--ext-success-soft); color: var(--ext-success); border-color: #bfe3cf; }
  :host([variant='warning']) { background: var(--ext-warning-soft); color: var(--ext-warning); border-color: #f2d3ae; }
  :host([variant='danger']) { background: var(--ext-danger-soft); color: var(--ext-danger); border-color: #f3c1be; }
  :host([variant='info']) { background: var(--ext-info-soft); color: var(--ext-info); border-color: #c3d6f5; }
  :host([variant='neutral']) { background: var(--ext-surface-2); color: var(--ext-text-secondary); border-color: var(--ext-border); }
  :host([variant='primary']) { background: var(--ext-primary-soft); color: var(--ext-primary); border-color: #b8ddcd; }
`;

export class ExtBadge extends HTMLElement {
  constructor() {
    super();
    const root = attachShadowWithTokens(this);
    root.innerHTML = `<style>${STYLE}</style><slot></slot>`;
  }
}

if (!customElements.get('ext-badge')) customElements.define('ext-badge', ExtBadge);
