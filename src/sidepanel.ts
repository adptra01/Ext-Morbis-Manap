import type { ExtensionConfig, CustomUrl, MessagePayload, Role } from './types.js';

const DOM = {
  toggleExtension: document.getElementById('toggleExtension') as HTMLInputElement,
  statusDot: document.getElementById('statusDot') as HTMLElement,
  statusLabel: document.getElementById('statusLabel') as HTMLElement,
  statusSub: document.getElementById('statusSub') as HTMLElement,
  featuresList: document.getElementById('featuresList') as HTMLElement,
  enabledCount: document.getElementById('enabledCount') as HTMLElement,
  totalCount: document.getElementById('totalCount') as HTMLElement,
  reloadBtn: document.getElementById('reloadBtn') as HTMLElement,
  resetBtn: document.getElementById('resetBtn') as HTMLElement,
  urlInput: document.getElementById('urlInput') as HTMLInputElement,
  addUrlBtn: document.getElementById('addUrlBtn') as HTMLElement,
  urlsList: document.getElementById('urlsList') as HTMLElement,
  toastEl: document.getElementById('toast') as HTMLElement,
  roleSelect: document.getElementById('roleSelect') as HTMLSelectElement,
  tabs: document.querySelectorAll('.tab') as NodeListOf<HTMLElement>,
};

let currentConfig: ExtensionConfig | null = null;
let customUrls: CustomUrl[] = [];

async function bgMessage(msg: MessagePayload): Promise<unknown> {
  try { return await chrome.runtime.sendMessage(msg); }
  catch { return null; }
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  DOM.toastEl.textContent = message;
  DOM.toastEl.className = `toast ${type} show`;
  setTimeout(() => DOM.toastEl.classList.remove('show'), 2000);
}

function reloadPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.id !== undefined) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
}

async function loadAll() {
  const result = (await bgMessage({ type: 'GET_ALL' })) as {
    config?: ExtensionConfig; urls?: CustomUrl[];
  } | null;
  if (result) {
    currentConfig = result.config as ExtensionConfig;
    customUrls = result.urls as CustomUrl[];
  } else {
    const c = (await chrome.storage.sync.get(['extensionConfig', 'extensionCustomUrls'])) as {
      extensionConfig?: ExtensionConfig; extensionCustomUrls?: CustomUrl[];
    };
    currentConfig = c.extensionConfig || { extensionEnabled: true, currentRole: 'casemix', features: {} };
    customUrls = c.extensionCustomUrls || [];
  }
}

function updateStatus() {
  const enabled = currentConfig?.extensionEnabled ?? true;
  DOM.toggleExtension.checked = enabled;
  DOM.statusDot.className = 'status-dot ' + (enabled ? 'on' : 'off');
  DOM.statusLabel.textContent = enabled ? 'Extension Aktif' : 'Extension Non-Aktif';
  DOM.statusSub.textContent = enabled ? 'Semua fitur berjalan' : 'Fitur dinonaktifkan';
}

function updateCounts() {
  const role = currentConfig?.currentRole || 'casemix';
  const features = currentConfig?.features || {};
  let enabled = 0; let total = 0;
  for (const [, f] of Object.entries(features)) {
    if (role !== 'admin' && !f.allowedRoles?.includes(role)) continue;
    if (f.comingSoon) continue;
    total++; if (f.enabled) enabled++;
  }
  DOM.enabledCount.textContent = String(enabled);
  DOM.totalCount.textContent = String(total);
}

function renderFeatures() {
  DOM.featuresList.innerHTML = '';
  const role = currentConfig?.currentRole || 'casemix';
  const features = currentConfig?.features || {};
  const globalEnabled = currentConfig?.extensionEnabled ?? true;
  let enabled = 0; let total = 0; let hasFeatures = false;

  for (const [key, feature] of Object.entries(features)) {
    if (role !== 'admin' && !feature.allowedRoles?.includes(role)) continue;
    hasFeatures = true;
    if (!feature.comingSoon) { total++; if (feature.enabled) enabled++; }

    const isComingSoon = feature.comingSoon === true;
    const disabled = !globalEnabled || isComingSoon;

    const div = document.createElement('div');
    div.className = 'toggle-row' + (disabled ? ' toggle-disabled' : '');
    div.style.cssText = disabled ? 'opacity:0.5;' : '';
    div.innerHTML =
      '<div class="toggle-label">' +
      '<div class="toggle-title">' + (feature.name || key) +
      (isComingSoon ? ' <span style="color:#ef4444;font-size:9px;">(CS)</span>' : '') +
      '</div>' +
      (feature.description ? '<div class="toggle-desc">' + feature.description + '</div>' : '') +
      '</div>' +
      '<label class="switch">' +
      '<input type="checkbox" class="feature-toggle" data-feature="' + key + '"' +
      (feature.enabled ? ' checked' : '') +
      (disabled ? ' disabled' : '') + '>' +
      '<span class="slider"></span>' +
      '</label>';
    DOM.featuresList.appendChild(div);
  }

  if (!hasFeatures) {
    DOM.featuresList.innerHTML = '<div class="empty-state">Tidak ada fitur untuk role ini</div>';
    enabled = 0; total = 0;
  }
  DOM.enabledCount.textContent = String(enabled);
  DOM.totalCount.textContent = String(total);
}

function renderUrls() {
  DOM.urlsList.innerHTML = '';
  customUrls.forEach(function (url) {
    const item = document.createElement('div');
    item.className = 'url-item' + (url.isDefault ? ' default' : '');
    item.innerHTML =
      '<div style="display:flex;align-items:center;flex:1;min-width:0;">' +
      '<div class="url-text">' + url.url + '</div>' +
      '<span class="url-badge">' + (url.isDefault ? 'DEFAULT' : 'CUSTOM') + '</span>' +
      '</div>' +
      '<div class="url-actions">' +
      '<label class="switch">' +
      '<input type="checkbox" class="url-toggle" data-url-id="' + url.id + '"' + (url.enabled ? ' checked' : '') + '>' +
      '<span class="slider"></span>' +
      '</label>' +
      '<button class="btn-delete" data-url-id="' + url.id + '"' + (url.isDefault ? ' disabled' : '') + '>Hapus</button>' +
      '</div>';
    DOM.urlsList.appendChild(item);
  });
}

async function addNewUrl() {
  const val = DOM.urlInput.value.trim();
  if (!val) { showToast('Masukkan URL', 'error'); return; }
  try { new URL(val); } catch { showToast('Format URL tidak valid', 'error'); return; }
  if (customUrls.find((u) => u.url === val)) { showToast('URL sudah ada', 'error'); return; }
  await bgMessage({ type: 'ADD_URL', url: val });
  customUrls.push({ id: 'url-' + Date.now(), url: val, enabled: true, isDefault: false });
  renderUrls();
  DOM.urlInput.value = '';
  showToast('URL ditambahkan');
  reloadPage();
}

async function init() {
  await loadAll();
  updateStatus();
  updateCounts();
  renderFeatures();
  renderUrls();

  DOM.roleSelect.value = currentConfig?.currentRole ?? 'casemix';

  // Tab switching
  DOM.tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      DOM.tabs.forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  DOM.toggleExtension.addEventListener('change', function () {
    bgMessage({ type: 'TOGGLE_EXTENSION', enabled: DOM.toggleExtension.checked });
    updateStatus();
    reloadPage();
  });

  DOM.reloadBtn.addEventListener('click', reloadPage);

  DOM.resetBtn.addEventListener('click', async function () {
    if (confirm('Reset ke pengaturan default?')) {
      await bgMessage({ type: 'RESET_CONFIG' });
      await loadAll();
      updateStatus();
      renderFeatures();
      renderUrls();
      showToast('Config direset');
      reloadPage();
    }
  });

  DOM.addUrlBtn.addEventListener('click', addNewUrl);
  DOM.urlInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') addNewUrl(); });

  DOM.featuresList.addEventListener('change', function (e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('feature-toggle')) {
      const key = (target as HTMLInputElement).dataset.feature as string;
      const checked = (target as HTMLInputElement).checked;
      bgMessage({ type: 'TOGGLE_FEATURE', key, enabled: checked });
      updateCounts();
      showToast('Fitur ' + (checked ? 'diaktifkan' : 'dinonaktifkan'));
      reloadPage();
    }
  });

  DOM.urlsList.addEventListener('change', function (e) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('url-toggle')) {
      const id = (target as HTMLInputElement).dataset.urlId as string;
      const checked = (target as HTMLInputElement).checked;
      bgMessage({ type: 'TOGGLE_URL', id, enabled: checked });
      customUrls = customUrls.map(function (u) { return u.id === id ? { ...u, enabled: checked } : u; });
      showToast('URL ' + (checked ? 'diaktifkan' : 'dinonaktifkan'));
      reloadPage();
    }
  });

  DOM.urlsList.addEventListener('click', function (e) {
    const target = e.target as HTMLElement;
    const btn = target.closest('.btn-delete') as HTMLElement | null;
    if (btn && btn.dataset.urlId) {
      const id = btn.dataset.urlId;
      const url = customUrls.find(function (u) { return u.id === id; });
      if (url?.isDefault) { showToast('URL default tidak dapat dihapus', 'error'); return; }
      bgMessage({ type: 'DELETE_URL', id });
      customUrls = customUrls.filter(function (u) { return u.id !== id; });
      renderUrls();
      showToast('URL dihapus');
      reloadPage();
    }
  });

  DOM.roleSelect.addEventListener('change', async function () {
    await bgMessage({ type: 'SET_ROLE', role: DOM.roleSelect.value as Role });
    if (currentConfig) currentConfig.currentRole = DOM.roleSelect.value as Role;
    renderFeatures();
    updateCounts();
    showToast('Role berhasil diubah');
    reloadPage();
  });
}

init().catch(function (e) { console.error('[SidePanel] Error:', e); });
