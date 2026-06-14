// MORBIS Ext Unofficial - sidepanel.js (Built with esbuild)
"use strict";
var __morbis_sidepanel = (() => {
  // src/sidepanel.ts
  var DOM = {
    toggleExtension: document.getElementById("toggleExtension"),
    statusDot: document.getElementById("statusDot"),
    statusLabel: document.getElementById("statusLabel"),
    statusSub: document.getElementById("statusSub"),
    featuresList: document.getElementById("featuresList"),
    enabledCount: document.getElementById("enabledCount"),
    totalCount: document.getElementById("totalCount"),
    reloadBtn: document.getElementById("reloadBtn"),
    resetBtn: document.getElementById("resetBtn"),
    urlInput: document.getElementById("urlInput"),
    addUrlBtn: document.getElementById("addUrlBtn"),
    urlsList: document.getElementById("urlsList"),
    toastEl: document.getElementById("toast"),
    roleSelect: document.getElementById("roleSelect"),
    tabs: document.querySelectorAll(".tab")
  };
  var currentConfig = null;
  var customUrls = [];
  async function bgMessage(msg) {
    try {
      return await chrome.runtime.sendMessage(msg);
    } catch {
      return null;
    }
  }
  function showToast(message, type = "success") {
    DOM.toastEl.textContent = message;
    DOM.toastEl.className = `toast ${type} show`;
    setTimeout(() => DOM.toastEl.classList.remove("show"), 2e3);
  }
  function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]?.id !== void 0) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
  async function loadAll() {
    const result = await bgMessage({ type: "GET_ALL" });
    if (result) {
      currentConfig = result.config;
      customUrls = result.urls;
    } else {
      const c = await chrome.storage.sync.get(["extensionConfig", "extensionCustomUrls"]);
      currentConfig = c.extensionConfig || { extensionEnabled: true, currentRole: "casemix", features: {} };
      customUrls = c.extensionCustomUrls || [];
    }
  }
  function updateStatus() {
    const enabled = currentConfig?.extensionEnabled ?? true;
    DOM.toggleExtension.checked = enabled;
    DOM.statusDot.className = "status-dot " + (enabled ? "on" : "off");
    DOM.statusLabel.textContent = enabled ? "Extension Aktif" : "Extension Non-Aktif";
    DOM.statusSub.textContent = enabled ? "Semua fitur berjalan" : "Fitur dinonaktifkan";
  }
  function updateCounts() {
    const role = currentConfig?.currentRole || "casemix";
    const features = currentConfig?.features || {};
    let enabled = 0;
    let total = 0;
    for (const [, f] of Object.entries(features)) {
      if (role !== "admin" && !f.allowedRoles?.includes(role)) continue;
      if (f.comingSoon) continue;
      total++;
      if (f.enabled) enabled++;
    }
    DOM.enabledCount.textContent = String(enabled);
    DOM.totalCount.textContent = String(total);
  }
  function renderFeatures() {
    DOM.featuresList.innerHTML = "";
    const role = currentConfig?.currentRole || "casemix";
    const features = currentConfig?.features || {};
    const globalEnabled = currentConfig?.extensionEnabled ?? true;
    let enabled = 0;
    let total = 0;
    let hasFeatures = false;
    for (const [key, feature] of Object.entries(features)) {
      if (role !== "admin" && !feature.allowedRoles?.includes(role)) continue;
      hasFeatures = true;
      if (!feature.comingSoon) {
        total++;
        if (feature.enabled) enabled++;
      }
      const isComingSoon = feature.comingSoon === true;
      const disabled = !globalEnabled || isComingSoon;
      const div = document.createElement("div");
      div.className = "toggle-row" + (disabled ? " toggle-disabled" : "");
      div.style.cssText = disabled ? "opacity:0.5;" : "";
      div.innerHTML = '<div class="toggle-label"><div class="toggle-title">' + (feature.name || key) + (isComingSoon ? ' <span style="color:#ef4444;font-size:9px;">(CS)</span>' : "") + "</div>" + (feature.description ? '<div class="toggle-desc">' + feature.description + "</div>" : "") + '</div><label class="switch"><input type="checkbox" class="feature-toggle" data-feature="' + key + '"' + (feature.enabled ? " checked" : "") + (disabled ? " disabled" : "") + '><span class="slider"></span></label>';
      DOM.featuresList.appendChild(div);
    }
    if (!hasFeatures) {
      DOM.featuresList.innerHTML = '<div class="empty-state">Tidak ada fitur untuk role ini</div>';
      enabled = 0;
      total = 0;
    }
    DOM.enabledCount.textContent = String(enabled);
    DOM.totalCount.textContent = String(total);
  }
  function renderUrls() {
    DOM.urlsList.innerHTML = "";
    customUrls.forEach(function(url) {
      const item = document.createElement("div");
      item.className = "url-item" + (url.isDefault ? " default" : "");
      item.innerHTML = '<div style="display:flex;align-items:center;flex:1;min-width:0;"><div class="url-text">' + url.url + '</div><span class="url-badge">' + (url.isDefault ? "DEFAULT" : "CUSTOM") + '</span></div><div class="url-actions"><label class="switch"><input type="checkbox" class="url-toggle" data-url-id="' + url.id + '"' + (url.enabled ? " checked" : "") + '><span class="slider"></span></label><button class="btn-delete" data-url-id="' + url.id + '"' + (url.isDefault ? " disabled" : "") + ">Hapus</button></div>";
      DOM.urlsList.appendChild(item);
    });
  }
  async function addNewUrl() {
    const val = DOM.urlInput.value.trim();
    if (!val) {
      showToast("Masukkan URL", "error");
      return;
    }
    try {
      new URL(val);
    } catch {
      showToast("Format URL tidak valid", "error");
      return;
    }
    if (customUrls.find((u) => u.url === val)) {
      showToast("URL sudah ada", "error");
      return;
    }
    await bgMessage({ type: "ADD_URL", url: val });
    customUrls.push({ id: "url-" + Date.now(), url: val, enabled: true, isDefault: false });
    renderUrls();
    DOM.urlInput.value = "";
    showToast("URL ditambahkan");
    reloadPage();
  }
  async function init() {
    await loadAll();
    updateStatus();
    updateCounts();
    renderFeatures();
    renderUrls();
    DOM.roleSelect.value = currentConfig?.currentRole ?? "casemix";
    DOM.tabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        DOM.tabs.forEach(function(t) {
          t.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach(function(c) {
          c.classList.remove("active");
        });
        tab.classList.add("active");
        const target = document.getElementById("tab-" + tab.dataset.tab);
        if (target) target.classList.add("active");
      });
    });
    DOM.toggleExtension.addEventListener("change", function() {
      bgMessage({ type: "TOGGLE_EXTENSION", enabled: DOM.toggleExtension.checked });
      updateStatus();
      reloadPage();
    });
    DOM.reloadBtn.addEventListener("click", reloadPage);
    DOM.resetBtn.addEventListener("click", async function() {
      if (confirm("Reset ke pengaturan default?")) {
        await bgMessage({ type: "RESET_CONFIG" });
        await loadAll();
        updateStatus();
        renderFeatures();
        renderUrls();
        showToast("Config direset");
        reloadPage();
      }
    });
    DOM.addUrlBtn.addEventListener("click", addNewUrl);
    DOM.urlInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") addNewUrl();
    });
    DOM.featuresList.addEventListener("change", function(e) {
      const target = e.target;
      if (target.classList.contains("feature-toggle")) {
        const key = target.dataset.feature;
        const checked = target.checked;
        bgMessage({ type: "TOGGLE_FEATURE", key, enabled: checked });
        updateCounts();
        showToast("Fitur " + (checked ? "diaktifkan" : "dinonaktifkan"));
        reloadPage();
      }
    });
    DOM.urlsList.addEventListener("change", function(e) {
      const target = e.target;
      if (target.classList.contains("url-toggle")) {
        const id = target.dataset.urlId;
        const checked = target.checked;
        bgMessage({ type: "TOGGLE_URL", id, enabled: checked });
        customUrls = customUrls.map(function(u) {
          return u.id === id ? { ...u, enabled: checked } : u;
        });
        showToast("URL " + (checked ? "diaktifkan" : "dinonaktifkan"));
        reloadPage();
      }
    });
    DOM.urlsList.addEventListener("click", function(e) {
      const target = e.target;
      const btn = target.closest(".btn-delete");
      if (btn && btn.dataset.urlId) {
        const id = btn.dataset.urlId;
        const url = customUrls.find(function(u) {
          return u.id === id;
        });
        if (url?.isDefault) {
          showToast("URL default tidak dapat dihapus", "error");
          return;
        }
        bgMessage({ type: "DELETE_URL", id });
        customUrls = customUrls.filter(function(u) {
          return u.id !== id;
        });
        renderUrls();
        showToast("URL dihapus");
        reloadPage();
      }
    });
    DOM.roleSelect.addEventListener("change", async function() {
      await bgMessage({ type: "SET_ROLE", role: DOM.roleSelect.value });
      if (currentConfig) currentConfig.currentRole = DOM.roleSelect.value;
      renderFeatures();
      updateCounts();
      showToast("Role berhasil diubah");
      reloadPage();
    });
  }
  init().catch(function(e) {
    console.error("[SidePanel] Error:", e);
  });
})();
//# sourceMappingURL=sidepanel.js.map
