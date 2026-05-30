// MORBIS Ext Unofficial - popup.js (Built with esbuild)
"use strict";
var __morbis_popup = (() => {
  // src/popup.ts
  var DOM = {
    loading: document.getElementById("loading"),
    mainContent: document.getElementById("mainContent"),
    toggleExtension: document.getElementById("toggleExtension"),
    statusBadge: document.getElementById("statusBadge"),
    statusText: document.getElementById("statusText"),
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
    roleBanner: document.getElementById("roleBanner")
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
  async function bgWrite(msg) {
    const ok = await bgMessage(msg);
    if (ok) return ok;
    const c = currentConfig || {};
    switch (msg.type) {
      case "TOGGLE_EXTENSION":
        c.extensionEnabled = msg.enabled;
        await chrome.storage.sync.set({ extensionConfig: c });
        break;
      case "TOGGLE_FEATURE":
        if (c.features?.[msg.key])
          c.features[msg.key].enabled = msg.enabled;
        await chrome.storage.sync.set({ extensionConfig: c });
        break;
      case "SET_ROLE":
        c.currentRole = msg.role;
        await chrome.storage.sync.set({ extensionConfig: c });
        break;
      case "CHANGE_FEATURE_MODE":
        if (c.features?.[msg.key]) c.features[msg.key].mode = msg.mode;
        await chrome.storage.sync.set({ extensionConfig: c });
        break;
      case "RESET_CONFIG":
        await chrome.storage.sync.remove(["extensionConfig", "extensionCustomUrls"]);
        break;
      case "ADD_URL": {
        const u = await chrome.storage.sync.get("extensionCustomUrls");
        const urls = u.extensionCustomUrls || [];
        urls.push({
          id: "url-" + Date.now(),
          url: msg.url,
          enabled: true,
          isDefault: false
        });
        await chrome.storage.sync.set({ extensionCustomUrls: urls });
        break;
      }
      case "DELETE_URL": {
        const d = await chrome.storage.sync.get("extensionCustomUrls");
        const durls = (d.extensionCustomUrls || []).filter((x) => x.id !== msg.id || x.isDefault);
        await chrome.storage.sync.set({ extensionCustomUrls: durls });
        break;
      }
      case "TOGGLE_URL": {
        const t = await chrome.storage.sync.get("extensionCustomUrls");
        const turls = t.extensionCustomUrls || [];
        turls.forEach((x) => {
          if (x.id === msg.id) x.enabled = msg.enabled;
        });
        await chrome.storage.sync.set({ extensionCustomUrls: turls });
        break;
      }
    }
    return { success: true };
  }
  async function loadAll() {
    const result = await bgMessage({ type: "GET_ALL" });
    if (result) {
      currentConfig = result.config;
      customUrls = result.urls;
    } else {
      const c = await chrome.storage.sync.get(["extensionConfig", "extensionCustomUrls"]);
      currentConfig = c.extensionConfig || {
        extensionEnabled: true,
        currentRole: "casemix",
        features: {}
      };
      customUrls = c.extensionCustomUrls || [];
    }
  }
  function isValidUrl(url) {
    try {
      const p = new URL(url);
      return p.protocol === "http:" || p.protocol === "https:";
    } catch {
      return false;
    }
  }
  function showToast(message, type = "success") {
    DOM.toastEl.textContent = message;
    DOM.toastEl.className = `toast ${type} show`;
    setTimeout(() => {
      DOM.toastEl.classList.remove("show");
    }, 2e3);
  }
  function reloadPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]?.id !== void 0) {
        chrome.tabs.reload(tabs[0].id);
        window.close();
      }
    });
  }
  function updateRoleBanner() {
    const role = currentConfig?.currentRole || "casemix";
    const name = role.charAt(0).toUpperCase() + role.slice(1);
    DOM.roleBanner.innerHTML = `Anda saat ini: <strong>${name}</strong>. <a href="#" id="changeRoleLink">[Ubah]</a>`;
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
    const sectionTitle = document.querySelector(".section:nth-child(5) .section-title");
    if (sectionTitle) {
      const roleName = role.charAt(0).toUpperCase() + role.slice(1);
      sectionTitle.textContent = `Fitur Tersedia (${roleName})`;
    }
    for (const [key, feature] of Object.entries(features)) {
      if (role !== "admin" && !feature.allowedRoles?.includes(role)) continue;
      hasFeatures = true;
      if (!feature.comingSoon) {
        total++;
        if (feature.enabled) enabled++;
      }
      const isComingSoon = feature.comingSoon === true;
      const disabled = !globalEnabled || isComingSoon;
      let controlsHtml = "";
      if (!isComingSoon) {
        let modeHtml = "";
        if (key === "openDetailInNewTab" && feature.modes && feature.enabled) {
          const currentMode = feature.mode || "new-tab";
          modeHtml = '<div style="margin-left:12px;margin-right:8px;"><select class="feature-mode-select" data-feature="' + key + '" style="padding:4px 8px;border-radius:4px;border:1px solid #d1d5db;font-size:11px;">' + Object.entries(feature.modes).map(function(m) {
            return '<option value="' + m[0] + '"' + (m[0] === currentMode ? " selected" : "") + ">" + m[1] + "</option>";
          }).join("") + "</select></div>";
        }
        controlsHtml = modeHtml + '<div class="checkbox-wrapper"><input type="checkbox" class="toggle-checkbox feature-toggle" data-feature="' + key + '"' + (feature.enabled ? " checked" : "") + (disabled ? " disabled" : "") + "></div>";
      }
      const div = document.createElement("div");
      div.className = "toggle-container" + (disabled ? " feature-disabled" : "");
      div.innerHTML = '<div class="toggle-label"><span class="title">' + (feature.name || key) + (isComingSoon ? ' <span style="color:#ef4444;font-size:9px;font-weight:bold;">(COMING SOON)</span>' : "") + '</span><span class="subtitle">' + (feature.description || "") + "</span></div>" + controlsHtml;
      DOM.featuresList.appendChild(div);
    }
    if (!hasFeatures) {
      const div = document.createElement("div");
      div.className = "toggle-container";
      div.style.cssText = "text-align:center;color:#6b7280;padding:20px 10px";
      div.innerHTML = '<div style="font-size:13px;">Tidak ada fitur untuk role: <strong>' + role + '</strong></div><div style="font-size:11px;margin-top:4px;">Silakan pilih role lain untuk melihat fitur yang tersedia</div>';
      DOM.featuresList.appendChild(div);
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
      item.innerHTML = '<div class="url-info"><div class="url-text">' + url.url + '</div><span class="url-badge">' + (url.isDefault ? "DEFAULT" : "CUSTOM") + '</span></div><div class="url-actions"><input type="checkbox" class="toggle-checkbox"' + (url.enabled ? " checked" : "") + ' data-url-id="' + url.id + '"><button class="btn-delete" data-url-id="' + url.id + '"' + (url.isDefault ? " disabled" : "") + ">Hapus</button></div>";
      DOM.urlsList.appendChild(item);
    });
  }
  async function addNewUrl() {
    const val = DOM.urlInput.value.trim();
    if (!val) {
      showToast("Masukkan URL terlebih dahulu", "error");
      return;
    }
    if (!isValidUrl(val)) {
      showToast("Format URL tidak valid (gunakan http:// atau https://)", "error");
      return;
    }
    if (customUrls.find((u) => u.url === val)) {
      showToast("URL sudah ada di daftar", "error");
      return;
    }
    await bgWrite({ type: "ADD_URL", url: val });
    customUrls.push({ id: "url-" + Date.now(), url: val, enabled: true, isDefault: false });
    renderUrls();
    DOM.urlInput.value = "";
    showToast("URL berhasil ditambahkan");
    reloadPage();
  }
  function updateUI() {
    const enabled = currentConfig?.extensionEnabled ?? true;
    DOM.toggleExtension.checked = enabled;
    DOM.statusBadge.className = "status-badge " + (enabled ? "active" : "inactive");
    DOM.statusText.textContent = enabled ? "Extension Aktif" : "Extension Non-Aktif";
    renderFeatures();
    renderUrls();
  }
  async function init() {
    try {
      await loadAll();
      DOM.loading.classList.add("hidden");
      DOM.mainContent.classList.remove("hidden");
      updateUI();
      DOM.toggleExtension.addEventListener("change", (e) => {
        const target = e.target;
        bgWrite({ type: "TOGGLE_EXTENSION", enabled: target.checked });
        DOM.toggleExtension.checked = target.checked;
        updateUI();
        reloadPage();
      });
      DOM.reloadBtn.addEventListener("click", reloadPage);
      DOM.resetBtn.addEventListener("click", async () => {
        if (confirm("Apakah Anda yakin ingin mereset ke pengaturan default?")) {
          await bgWrite({ type: "RESET_CONFIG" });
          await loadAll();
          updateUI();
          reloadPage();
        }
      });
      DOM.addUrlBtn.addEventListener("click", addNewUrl);
      DOM.urlInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addNewUrl();
      });
      DOM.featuresList.addEventListener("change", (e) => {
        const target = e.target;
        if (target.classList.contains("feature-toggle")) {
          const key = target.dataset.feature;
          const checked = target.checked;
          bgWrite({ type: "TOGGLE_FEATURE", key, enabled: checked });
          DOM.featuresList.querySelectorAll(`.feature-toggle[data-feature="${key}"]`).forEach((el) => {
            el.checked = checked;
          });
          updateCounts();
          reloadPage();
        } else if (target.classList.contains("feature-mode-select")) {
          const key = target.dataset.feature;
          bgWrite({ type: "CHANGE_FEATURE_MODE", key, mode: target.value });
          showToast("Mode berhasil diubah");
        }
      });
      DOM.urlsList.addEventListener("change", (e) => {
        const target = e.target;
        if (target.classList.contains("toggle-checkbox") && target.dataset.urlId) {
          const id = target.dataset.urlId;
          bgWrite({ type: "TOGGLE_URL", id, enabled: target.checked });
          customUrls = customUrls.map((u) => u.id === id ? { ...u, enabled: target.checked } : u);
          reloadPage();
        }
      });
      DOM.urlsList.addEventListener("click", (e) => {
        const target = e.target;
        const btn = target.closest(".btn-delete");
        if (btn && btn.dataset.urlId) {
          const id = btn.dataset.urlId;
          const url = customUrls.find((u) => u.id === id);
          if (url?.isDefault) {
            showToast("URL default tidak dapat dihapus", "error");
            return;
          }
          bgWrite({ type: "DELETE_URL", id });
          customUrls = customUrls.filter((u) => u.id !== id);
          renderUrls();
          showToast("URL berhasil dihapus");
          reloadPage();
        }
      });
      DOM.roleSelect.value = currentConfig?.currentRole ?? "casemix";
      DOM.roleSelect.addEventListener("change", async (e) => {
        const target = e.target;
        await bgWrite({ type: "SET_ROLE", role: target.value });
        if (currentConfig) currentConfig.currentRole = target.value;
        updateRoleBanner();
        renderFeatures();
        showToast("Role berhasil diubah");
        reloadPage();
      });
      DOM.roleBanner.addEventListener("click", (e) => {
        if (e.target.id === "changeRoleLink") {
          e.preventDefault();
          DOM.roleSelect.focus();
        }
      });
      updateRoleBanner();
    } catch (error) {
      console.error("[Popup] Error initializing:", error);
      DOM.loading.textContent = "Terjadi kesalahan saat memuat.";
    }
  }
  init();
})();
//# sourceMappingURL=popup.js.map
