import { attachShadowWithTokens } from './tokens';

/**
 * <ext-tabs>
 *   <button slot="tab" data-tab="a" data-active>Tab A</button>
 *   <div slot="panel" data-panel="a">Isi A</div>
 *   ...
 * </ext-tabs>
 * Tab sederhana & tegas — label besar, indikator aktif jelas.
 */
const STYLE = `
  :host {
    display: flex;
    flex-direction: column;
    font-family: var(--ext-font-family);
    background: var(--ext-surface);
    border: 1px solid var(--ext-border);
    border-radius: var(--ext-radius-lg);
    overflow: hidden;
  }
  .tablist {
    display: flex;
    border-bottom: 1px solid var(--ext-border);
    background: var(--ext-surface-2);
    overflow-x: auto;
  }
  ::slotted([slot='tab']) {
    appearance: none;
    border: none;
    background: transparent;
    font-family: var(--ext-font-family);
    font-size: var(--ext-font-size-md);
    font-weight: 600;
    color: var(--ext-text-secondary);
    padding: 14px 20px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    white-space: nowrap;
    transition: color var(--ext-duration-fast) var(--ext-ease),
      border-color var(--ext-duration-fast) var(--ext-ease),
      background-color var(--ext-duration-fast) var(--ext-ease);
  }
  ::slotted([slot='tab']:hover) { color: var(--ext-primary); background: var(--ext-primary-soft); }
  ::slotted([slot='tab'][data-active]) { color: var(--ext-primary); border-bottom-color: var(--ext-primary); font-weight: 700; }
  ::slotted([slot='tab']:focus-visible) { outline: none; box-shadow: inset var(--ext-ring); }
  .panels { padding: var(--ext-space-5); }
  ::slotted([slot='panel']) { display: none; }
  ::slotted([slot='panel'][data-active]) { display: block; }
`;

export class ExtTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadowWithTokens();
  }

  private attachShadowWithTokens(): void {
    const root = attachShadowWithTokens(this);
    root.innerHTML = `
      <style>${STYLE}</style>
      <div class="tablist"><slot name="tab"></slot></div>
      <div class="panels"><slot name="panel"></slot></div>
    `;
  }

  connectedCallback() {
    this.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).closest('[slot="tab"]');
      if (!tab || !this.contains(tab)) return;
      this.activate(tab.getAttribute('data-tab') || '');
    });
    // aktifkan tab pertama yang punya data-active, atau tab pertama
    const current = this.querySelector('[slot="tab"][data-active]');
    if (current) this.activate(current.getAttribute('data-tab') || '');
  }

  activate(tabId: string): void {
    if (!tabId) return;
    this.querySelectorAll<HTMLElement>('[slot="tab"]').forEach((t) => {
      if (t.getAttribute('data-tab') === tabId) t.setAttribute('data-active', '');
      else t.removeAttribute('data-active');
    });
    this.querySelectorAll<HTMLElement>('[slot="panel"]').forEach((p) => {
      if (p.getAttribute('data-panel') === tabId) p.setAttribute('data-active', '');
      else p.removeAttribute('data-active');
    });
    this.dispatchEvent(new CustomEvent('ext-tab-change', { detail: { tab: tabId } }));
  }
}

if (!customElements.get('ext-tabs')) customElements.define('ext-tabs', ExtTabs);
