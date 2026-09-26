"use strict";
var __morbis_feature = (() => {
  // src/ui/web/tokens.ts
  var FONT_STACK = '"Plus Jakarta Sans", -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
  var TOKENS_CSS = `
  :host {
    /* Brand */
    --ext-primary: #00875a;
    --ext-primary-hover: #007049;
    --ext-primary-soft: #e6f4ef;

    /* Semantic */
    --ext-success: #027a48;
    --ext-success-soft: #e8f6ef;
    --ext-warning: #b54708;
    --ext-warning-soft: #fdf1e3;
    --ext-danger: #d92d20;
    --ext-danger-hover: #b42318;
    --ext-danger-soft: #fdeceb;
    --ext-info: #175cd3;
    --ext-info-soft: #e8f0fd;

    /* Surface */
    --ext-bg: #f4f6f8;
    --ext-surface: #ffffff;
    --ext-surface-2: #f8fafc;
    --ext-border: #d0d5dd;

    /* Text \u2014 kontras tinggi untuk keterbacaan usia 30-40 */
    --ext-text: #1c2530;
    --ext-text-secondary: #475467;
    --ext-text-muted: #667085;
    --ext-text-on-primary: #ffffff;

    /* Typography \u2014 lebih besar dari default, untuk mudah dibaca */
    --ext-font-family: ${FONT_STACK};
    --ext-font-size-xs: 12px;
    --ext-font-size-sm: 13px;
    --ext-font-size-md: 15px;
    --ext-font-size-lg: 17px;
    --ext-font-size-xl: 20px;
    --ext-line-height: 1.5;

    /* Radius */
    --ext-radius-sm: 6px;
    --ext-radius-md: 10px;
    --ext-radius-lg: 14px;

    /* Spacing */
    --ext-space-1: 4px;
    --ext-space-2: 8px;
    --ext-space-3: 12px;
    --ext-space-4: 16px;
    --ext-space-5: 20px;
    --ext-space-6: 24px;
    --ext-space-8: 32px;

    /* Shadow */
    --ext-shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
    --ext-shadow-md: 0 6px 20px rgba(16, 24, 40, 0.1);
    --ext-shadow-lg: 0 20px 50px rgba(16, 24, 40, 0.18);

    /* Focus ring \u2014 terlihat jelas, penting utk usability */
    --ext-ring: 0 0 0 3px rgba(0, 135, 90, 0.35);

    /* Motion */
    --ext-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ext-duration-fast: 140ms;
    --ext-duration-normal: 220ms;
  }
`;
  var sharedSheet = null;
  function getTokenSheet() {
    if (!sharedSheet) {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(TOKENS_CSS);
    }
    return sharedSheet;
  }
  var fontInjected = false;
  function ensureFont() {
    if (fontInjected || document.getElementById("ext-pjs-font")) return;
    fontInjected = true;
    const link = document.createElement("link");
    link.id = "ext-pjs-font";
    link.rel = "stylesheet";
    link.href = "http://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }
  function attachShadowWithTokens(el, mode = "open") {
    const root = el.attachShadow({ mode });
    root.adoptedStyleSheets = [getTokenSheet()];
    ensureFont();
    return root;
  }

  // src/ui/web/ext-btn.ts
  var STYLE = `
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
  var ExtBtn = class extends HTMLElement {
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
      this.btn = root.querySelector("button");
    }
    connectedCallback() {
      this.btn.disabled = this.hasAttribute("disabled") || this.hasAttribute("loading");
      this.btn.setAttribute("aria-busy", this.hasAttribute("loading") ? "true" : "false");
      this.btn.addEventListener("click", (e) => {
        if (this.hasAttribute("loading") || this.hasAttribute("disabled")) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      });
    }
    static get observedAttributes() {
      return ["disabled", "loading"];
    }
    attributeChangedCallback(name) {
      if (name === "disabled" || name === "loading") {
        this.btn.disabled = this.hasAttribute("disabled") || this.hasAttribute("loading");
        this.btn.setAttribute("aria-busy", this.hasAttribute("loading") ? "true" : "false");
      }
    }
  };
  if (!customElements.get("ext-btn")) customElements.define("ext-btn", ExtBtn);

  // src/features/inputHasilPa.ts
  (function() {
    const $ = (sel) => document.querySelector(sel);
    const val = (sel) => $(sel)?.value?.trim() || "";
    let tanggalPengajuan = null;
    function readIds() {
      return {
        idLab: new URLSearchParams(window.location.search).get("id_lab") || val('input[name="id_lab"]'),
        idVisit: val('input[name="id_visit"]'),
        idHasilLab: val('input[name="hasil[1][id]"]')
      };
    }
    async function fetchPermintaanData(idLab, idVisit) {
      try {
        const res = await fetch(
          `/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${idVisit}`,
          {
            credentials: "same-origin"
          }
        );
        const html = await res.text();
        const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
        const row = rows.find((r) => r.includes(`nolab="${idLab}"`));
        if (!row) return null;
        const id = row.match(/cetakFormPermintaanLab\(\s*(\d+)/)?.[1] || null;
        const tgl = row.match(/edit_tanggal\(\s*\d+\s*,\s*\d+\s*,\s*"([^"]+)"/)?.[1] || null;
        return id ? { id, tgl } : null;
      } catch {
        return null;
      }
    }
    function openUrl(path) {
      window.open(path, "_blank");
    }
    const KEEP_FIELDS = ["dok_luar", "nama_rs"];
    const keepBest = {};
    let _keepCaseIntervalId = null;
    function camelWords(s) {
      return s.toLowerCase().split(" ").map((w) => w ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
    }
    function readKeepField(name) {
      return document.querySelector(`[name="${name}"]`);
    }
    function noteValue(name, v) {
      const cur = keepBest[name];
      if (cur === void 0) {
        if (v) keepBest[name] = v;
        return false;
      }
      if (v === cur) return false;
      if (v.toLowerCase() !== cur.toLowerCase()) {
        keepBest[name] = v;
        return false;
      }
      if (v === camelWords(cur)) return true;
      keepBest[name] = v;
      return false;
    }
    function snapEvent() {
      try {
        for (const name of KEEP_FIELDS) {
          const el = readKeepField(name);
          if (el) noteValue(name, (el.value ?? "").trim());
        }
      } catch {
      }
    }
    function pollKeep() {
      try {
        for (const name of KEEP_FIELDS) {
          const el = readKeepField(name);
          if (!el) continue;
          if (noteValue(name, (el.value ?? "").trim())) {
            el.value = keepBest[name];
            window.console.info("[paKeepCase] " + name + " dikembalikan ke ejaan asli");
          }
        }
      } catch {
      }
    }
    function patchXhrKeepCase() {
      const proto = window.XMLHttpRequest.prototype;
      if (proto.__extKeepPatched) return;
      proto.__extKeepPatched = true;
      const origOpen = proto.open;
      const origSend = proto.send;
      proto.open = function(...args) {
        try {
          const u = args[1];
          this.__extUrl = typeof u === "string" ? u : String(u);
        } catch {
        }
        return origOpen.apply(this, args);
      };
      proto.send = function(...args) {
        try {
          const self = this;
          const body = args[0];
          const url = self.__extUrl;
          if (Object.keys(keepBest).length && typeof url === "string" && url.includes("pemeriksaan-pa") && typeof body === "string" && body.includes("dok_luar=")) {
            const params = new URLSearchParams(body);
            let changed = false;
            for (const name of KEEP_FIELDS) {
              const base = keepBest[name];
              const curP = params.get(name);
              if (base && curP !== null && curP !== base && curP === camelWords(base)) {
                params.set(name, base);
                changed = true;
              }
            }
            if (changed) {
              window.console.info("[paKeepCase] payload dok_luar/nama_rs dikembalikan ke ejaan asli");
              return origSend.call(this, params.toString());
            }
          } else if (Object.keys(keepBest).length && typeof url === "string" && url.includes("pemeriksaan-pa") && typeof FormData !== "undefined" && body instanceof FormData && (body.has("dok_luar") || body.has("nama_rs"))) {
            for (const name of KEEP_FIELDS) {
              const base = keepBest[name];
              const cur = body.get(name);
              if (base && typeof cur === "string" && cur !== base && cur === camelWords(base)) {
                window.console.info("[paKeepCase] payload FormData " + name + " dikembalikan");
                body.set(name, base);
              }
            }
          }
        } catch {
        }
        return origSend.apply(this, args);
      };
    }
    function startKeepCase() {
      const w = window;
      if (w.__paKeepCase) return;
      w.__paKeepCase = true;
      snapEvent();
      document.addEventListener(
        "input",
        (e) => {
          const t = e.target;
          if (t && typeof t.matches === "function" && t.matches("input, textarea, select")) {
            snapEvent();
          }
        },
        true
      );
      document.addEventListener("focusout", () => snapEvent(), true);
      document.addEventListener("submit", () => snapEvent(), true);
      patchXhrKeepCase();
      _keepCaseIntervalId = window.setInterval(pollKeep, 300);
      window.console.info("[paKeepCase] aktif di input-hasil-pa");
    }
    function showEditTanggalModal(idLab, idVisit) {
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999999;display:flex;align-items:center;justify-content:center;";
      const box = document.createElement("div");
      box.style.cssText = "background:#fff;border-radius:8px;padding:16px 18px;min-width:340px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Arial,sans-serif;";
      const title = document.createElement("div");
      title.textContent = "Edit Tanggal Pengajuan";
      title.style.cssText = "font-weight:700;font-size:14px;margin-bottom:10px;color:#1e293b;";
      const dateInput = document.createElement("input");
      dateInput.type = "date";
      dateInput.style.cssText = "width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;padding:10px;";
      const m = tanggalPengajuan?.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      if (m) dateInput.value = `${m[3]}-${m[2]}-${m[1]}`;
      const hint = document.createElement("div");
      hint.textContent = "Server menerima dd/mm/yyyy hh:mm:ss \u2014 waktu diset otomatis ke 00:00:00.";
      hint.style.cssText = "font-size:11px;color:#64748b;margin:4px 0 12px;";
      const btnRow = document.createElement("div");
      btnRow.style.cssText = "display:flex;justify-content:flex-end;";
      const save = document.createElement("button");
      save.type = "button";
      save.textContent = "Edit Tanggal";
      save.style.cssText = "margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#2563eb;cursor:pointer;";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = "Batal";
      cancel.style.cssText = "margin:18px;padding:15px;border:none;border-radius:6px;font-size:12px;font-weight:600;color:#fff;background:#dc2626;cursor:pointer;";
      save.addEventListener("click", async () => {
        const raw = dateInput.value.trim();
        if (!raw) {
          alert("Isi tanggal pengajuan baru dulu.");
          return;
        }
        const [y, mo, da] = raw.split("-");
        const date = `${da}/${mo}/${y} 00:00:00`;
        save.disabled = true;
        save.textContent = "Menyimpan\u2026";
        let ok = false;
        try {
          const res = await fetch("/laboratorium/control/edit_tanggal", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest"
            },
            body: new URLSearchParams({
              lab: idLab,
              id_visit: idVisit,
              date,
              action: "edit"
            }).toString()
          });
          ok = (await res.json()).status == 1;
        } catch {
          ok = false;
        }
        overlay.remove();
        alert(ok ? "Edit Tanggal Pengajuan berhasil diubah." : "Gagal menyimpan tanggal baru.");
        if (ok) window.location.reload();
      });
      cancel.addEventListener("click", () => overlay.remove());
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });
      btnRow.append(save, cancel);
      box.append(title, dateInput, hint, btnRow);
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      dateInput.focus();
    }
    function renderActions() {
      const fieldset = Array.from(document.querySelectorAll("fieldset")).find(
        (fs) => fs.textContent?.includes("Data Pasien")
      );
      if (!fieldset) return;
      const old = document.querySelector("[data-ext-lab-actions]");
      if (old) old.remove();
      const { idLab, idVisit, idHasilLab } = readIds();
      if (!idLab || !idVisit || !idHasilLab) {
        console.warn("[inputHasilPa] Missing ids", { idLab, idVisit, idHasilLab });
        return;
      }
      const container = document.createElement("div");
      container.setAttribute("data-ext-lab-actions", "true");
      container.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;";
      const mk = (label, variant, onClick) => {
        const b = document.createElement("ext-btn");
        b.setAttribute("variant", variant);
        b.setAttribute("size", "sm");
        b.textContent = label;
        b.addEventListener("click", onClick);
        return b;
      };
      let permintaanId = idHasilLab;
      fetchPermintaanData(idLab, idVisit).then((got) => {
        if (got) {
          permintaanId = got.id;
          tanggalPengajuan = got.tgl;
          console.log("[inputHasilPa] permintaan data", { idLab, idVisit, id: got.id, tgl: got.tgl });
        } else {
          console.warn("[inputHasilPa] Baris lab tidak ditemukan di daftar, pakai hasil[1][id].", {
            idLab,
            idVisit
          });
        }
      });
      container.append(
        mk("Edit Tanggal Pengajuan", "primary", () => showEditTanggalModal(idLab, idVisit)),
        mk(
          "Cetak",
          "info",
          () => openUrl(`/laboratorium/print/hasil-lab?id=${idLab}&nolab=${idLab}`)
        ),
        mk(
          "Cetak Form Permintaan Lab",
          "secondary",
          () => openUrl(
            `/admisi/formulir-permintaan-labor/cetak?id=${permintaanId}&id_visit=${idVisit}&jenis=cetak`
          )
        ),
        // tombol asli panggil editFormPermintaanLab(idHasilLab) — 1 arg → id_visit=undefined
        mk(
          "Edit Form Permintaan Lab",
          "secondary",
          () => openUrl(
            `/admisi/formulir-permintaan-labor/form?id=${permintaanId}&id_visit=undefined&jenis=edit`
          )
        ),
        mk(
          "Halaman Asli Pengajuan Lab",
          "ghost",
          () => openUrl(`/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${idVisit}`)
        )
      );
      const target = Array.from(document.querySelectorAll("fieldset")).find(
        (fs) => fs.textContent?.includes("Tanggal Hasil")
      );
      if (target) {
        target.after(container);
      } else {
        const form = document.querySelector("form");
        if (form) form.appendChild(container);
        else fieldset.after(container);
      }
    }
    function injectUi() {
      if (!document.documentElement.getAttribute("data-ext-lab-history")) return;
      startKeepCase();
      renderActions();
    }
    const start = performance.now();
    (function poll() {
      if (document.documentElement.getAttribute("data-ext-lab-history")) {
        injectUi();
      } else if (performance.now() - start < 5e3) {
        setTimeout(poll, 200);
      }
    })();
    const origPushState = history.pushState;
    history.pushState = function(...args) {
      origPushState.apply(this, args);
      setTimeout(injectUi, 100);
    };
    window.addEventListener("popstate", () => setTimeout(injectUi, 100));
    window.addEventListener("pagehide", () => {
      if (_keepCaseIntervalId !== null) {
        clearInterval(_keepCaseIntervalId);
        _keepCaseIntervalId = null;
      }
    });
  })();
})();
//# sourceMappingURL=inputHasilPa.js.map
