"use strict";
var __morbis_feature = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/features/randomKodeGenerator.ts
  var randomKodeGenerator_exports = {};
  __export(randomKodeGenerator_exports, {
    buatKode: () => buatKode,
    kodeSudahAda: () => kodeSudahAda,
    prefixJenis: () => prefixJenis
  });

  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
    if (config?.extensionEnabled === false) return false;
    const entry = config?.features?.[key];
    if (!entry) return true;
    if (entry.enabled === false) return false;
    const r = role ?? config?.currentRole ?? "admin";
    if (r === "admin") return true;
    const allowed = entry.allowedRoles;
    if (!Array.isArray(allowed) || allowed.length === 0) return true;
    return allowed.includes(r);
  }
  async function isFeatureEnabled(key) {
    try {
      const resp = await chrome.runtime.sendMessage({ type: "GET_CONFIG" });
      if (resp?.config) return decideFeatureGate(key, resp.config);
    } catch {
    }
    try {
      const store = await chrome.storage.local.get(STORAGE_KEY);
      const cfg = store?.[STORAGE_KEY] ?? null;
      return decideFeatureGate(key, cfg);
    } catch {
      return true;
    }
  }
  function whenFeatureEnabled(key, fn) {
    isFeatureEnabled(key).then((ok) => {
      if (!ok) return;
      try {
        fn();
      } catch (e) {
        console.error(`[featureGate:${key}] gagal jalan:`, e);
      }
    }).catch((e) => console.error(`[featureGate:${key}] gagal baca config:`, e));
  }

  // src/features/randomKodeGenerator.ts
  var BTN_ID = "ext-random-kode-btn";
  var STATUS_ID = "ext-random-kode-status";
  var MAX_PERCUBAAN = 30;
  function bersihkan(s) {
    return s.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim().toUpperCase();
  }
  function kodeSudahAda(html, kode) {
    const target = bersihkan(kode);
    if (!target) return false;
    for (const baris of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || []) {
      const sel = Array.from(baris.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map(
        (m) => bersihkan(m[1])
      );
      if (sel.includes(target)) return true;
    }
    return false;
  }
  function buatKode(prefix) {
    const p = prefix.toUpperCase();
    if (p === "LAB") {
      const alphabet2 = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const bytes2 = new Uint8Array(3);
      if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes2);
      else for (let i = 0; i < bytes2.length; i++) bytes2[i] = Math.floor(Math.random() * 256);
      let out2 = "LAB-";
      for (let i = 0; i < bytes2.length; i++) out2 += alphabet2[bytes2[i] % alphabet2.length];
      return out2;
    }
    if (p === "RWI") {
      const b = new Uint8Array(1);
      if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(b);
      else b[0] = Math.floor(Math.random() * 256);
      return "RWI-" + String(b[0] % 1e3).padStart(3, "0");
    }
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const bytes = new Uint8Array(5);
    if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    let out = "RWJ-";
    for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
  }
  function prefixJenis(jenis) {
    return /INAP/i.test(jenis) ? "RWI" : "RWJ";
  }
  function jenisHalaman() {
    const p = location.pathname.toLowerCase();
    if (p.includes("/admisi/data-layanan")) return "layanan";
    if (p.includes("/laboratorium/data-pemeriksaan-lab")) return "lab";
    return null;
  }
  function fieldKode(jenis) {
    return jenis === "layanan" ? "kode_layanan" : "kode_u";
  }
  async function kodeTersedia(jenis, kode) {
    const url = (jenis === "layanan" ? "/admisi/data-layanan" : "/laboratorium/data-pemeriksaan-lab") + "?do=tabel&category=" + (jenis === "layanan" ? "8" : "2") + "&key=" + encodeURIComponent(kode);
    const r = await fetch(url, { credentials: "include", cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const html = await r.text();
    if (/Morbis \| Login/i.test(html)) throw new Error("sesi MORBIS habis");
    return !kodeSudahAda(html, kode);
  }
  function statusEl() {
    let el = document.getElementById(STATUS_ID);
    if (!el) {
      el = document.createElement("span");
      el.id = STATUS_ID;
      el.style.cssText = "font-size:12px;margin-left:8px;font-weight:600;";
      const btn = document.getElementById(BTN_ID);
      btn?.parentNode?.insertBefore(el, btn.nextSibling);
    }
    return el;
  }
  function pasangTombol(input, jenis) {
    if (document.getElementById(BTN_ID)) return;
    const btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.textContent = "\u{1F3B2} Generate Kode";
    btn.title = "Buat kode acak yang belum dipakai";
    btn.style.cssText = "margin-left:6px;padding:6px 10px;border:none;border-radius:5px;background:#6d4df5;color:#fff;font-weight:700;cursor:pointer;vertical-align:middle;";
    input.parentNode?.insertBefore(btn, input.nextSibling);
    btn.addEventListener("click", () => void generate(jenis));
  }
  async function generate(jenis) {
    const btn = document.getElementById(BTN_ID);
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    statusEl().textContent = "Mencari kode unik\u2026";
    const prefix = jenis === "lab" ? "LAB" : prefixJenis(document.querySelector("#jenis")?.value || "");
    try {
      let kode = "";
      for (let i = 0; i < MAX_PERCUBAAN; i++) {
        const kandidat = buatKode(prefix);
        if (await kodeTersedia(jenis, kandidat)) {
          kode = kandidat;
          break;
        }
      }
      if (!kode) throw new Error("tidak ada kode unik setelah " + MAX_PERCUBAAN + " percobaan");
      const target = document.querySelector(
        'input[name="' + fieldKode(jenis) + '"]'
      );
      if (!target) throw new Error("field kode tidak ditemukan");
      target.value = kode;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
      if (jenis === "lab") {
        const list = document.querySelector('input[name="kode"]');
        if (list) {
          list.value = kode;
          list.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
      statusEl().style.color = "#166534";
      statusEl().textContent = "Kode " + kode + " tersedia.";
    } catch (e) {
      statusEl().style.color = "#b91c1c";
      statusEl().textContent = "Gagal: " + String(e.message ?? e);
    } finally {
      btn.disabled = false;
    }
  }
  function start() {
    if (typeof document === "undefined" || typeof location === "undefined") return;
    const jenis = jenisHalaman();
    if (!jenis || document.querySelector('input[type="password"]')) return;
    const cobaPasang = () => {
      const input = document.querySelector(
        'input[name="' + fieldKode(jenis) + '"]'
      );
      if (input) pasangTombol(input, jenis);
    };
    cobaPasang();
    if (typeof MutationObserver !== "undefined") {
      let t = 0;
      new MutationObserver(() => {
        window.clearTimeout(t);
        t = window.setTimeout(cobaPasang, 150);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
  whenFeatureEnabled("randomKodeGenerator", start);
  return __toCommonJS(randomKodeGenerator_exports);
})();
