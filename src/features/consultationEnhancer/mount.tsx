import React from 'react';
import { createRoot } from 'react-dom/client';
import { adoptTokens, ensureFont, injectGlobalTokens } from '../../ui/web';
import ConsEnhancerApp from './ConsEnhancerApp';

/**
 * Mount konsultasi enhancer ke dalam Shadow DOM + design tokens (shared UI layer).
 * UI React di sini memakai bahasa visual yang sama dengan fitur lain (ext-btn,
 * ext-badge, dst.) — font & token dari src/ui/web/tokens.ts.
 */
export function mountConsultationEnhancer() {
  // Guard: remove existing root before re-mount
  const existing = document.getElementById('consRoot');
  if (existing) existing.remove();

  // Token global untuk konten server-rendered (tabel MORBIS di dalam modal)
  // yang dirender di light DOM dan tidak bisa dijangkau CSS shadow.
  injectGlobalTokens();
  const host = document.createElement('div');
  host.id = 'consRoot';
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483000;pointer-events:none;';
  document.body.appendChild(host);

  // Shadow root mengisolasi styling React dari Bootstrap MORBIS
  const shadow = host.attachShadow({ mode: 'open' });
  adoptTokens(shadow);
  ensureFont();

  const container = document.createElement('div');
  container.style.cssText = 'pointer-events:none;';
  shadow.appendChild(container);

  const root = createRoot(container);
  root.render(<ConsEnhancerApp />);
  return () => {
    root.unmount();
    host.remove();
  };
}
