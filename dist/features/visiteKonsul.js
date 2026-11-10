"use strict";
var __morbis_feature = (() => {
  // src/features/shared/casemixApi.ts
  var CASEMIX_BASE_FALLBACK = "http://dev.rsudkotajambi.id/rs";
  var BASE_OVERRIDE_KEY = "ext-farmasi-app-base";
  var CASEMIX_ALLOWED_HOSTS = ["dev.rsudkotajambi.id", "103.147.236.138", "localhost", "127.0.0.1"];
  var CASEMIX_ALLOWED_SUFFIX = ".rsudkotajambi.id";
  function isAllowedCasemixBase(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      const h = u.hostname.toLowerCase();
      if (CASEMIX_ALLOWED_HOSTS.includes(h)) return true;
      return h.endsWith(CASEMIX_ALLOWED_SUFFIX);
    } catch {
      return false;
    }
  }
  function resolveCasemixBase() {
    try {
      const ov = localStorage.getItem(BASE_OVERRIDE_KEY);
      if (ov && isAllowedCasemixBase(ov)) return ov.replace(/\/+$/, "");
    } catch {
    }
    return CASEMIX_BASE_FALLBACK;
  }

  // src/features/shared/resumeHistory.ts
  function resolveReportsBase() {
    return resolveCasemixBase();
  }

  // src/features/shared/whenIdle.ts
  function runWhenIdle(cb, timeoutMs = 8e3) {
    try {
      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        ric.call(window, cb, { timeout: timeoutMs });
        return;
      }
    } catch {
    }
    window.setTimeout(cb, Math.min(timeoutMs, 1500));
  }

  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/visiteKonsul.ts
  var LOG_PREFIX = "[MORBIS Ext] visiteKonsul";
  var g = getMorbisGlobals();
  function getIdVisit() {
    try {
      const p = new URLSearchParams(location.search);
      const v = p.get("id_visit");
      return v && v.trim() ? v.trim() : null;
    } catch {
      return null;
    }
  }
  var base = resolveReportsBase();
  var API = base + "/api/visite-konsul";
  function apiErrMsg(j, res) {
    return j?.message || (res ? `HTTP ${res.status}` : "gagal menghubungi server");
  }
  async function apiList(idVisit) {
    const res = await fetch(`${API}/list?id_visit=${encodeURIComponent(idVisit)}`, {
      credentials: "omit"
    });
    const j = await res.json().catch(() => null);
    if (!j?.ok) return { rows: [], error: apiErrMsg(j, res) };
    const rows = (j.data || []).map(
      (r) => ({
        id: r.id,
        jenis: r.jenis,
        nama_dokter: r.nama_dokter,
        id_dokter: r.id_dokter,
        saving: false
      })
    );
    return { rows };
  }
  async function apiSave(idVisit, row, user) {
    const res = await fetch(`${API}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({
        id: row.id,
        id_visit: Number(idVisit),
        jenis: row.jenis,
        id_dokter: row.id_dokter,
        nama_dokter: row.nama_dokter,
        user
      })
    });
    const j = await res.json();
    if (!j?.ok) return null;
    return {
      id: j.data.id,
      jenis: j.data.jenis,
      nama_dokter: j.data.nama_dokter,
      id_dokter: j.data.id_dokter,
      saving: false
    };
  }
  async function apiDelete(id, idVisit) {
    const res = await fetch(`${API}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "omit",
      body: JSON.stringify({ id, id_visit: Number(idVisit) })
    });
    const j = await res.json();
    return !!j?.ok;
  }
  async function searchDokter(q) {
    const res = await fetch(`${API}/dokter?q=${encodeURIComponent(q)}`, { credentials: "omit" });
    const j = await res.json().catch(() => null);
    if (!j?.ok) return { items: [], error: apiErrMsg(j, res) };
    return { items: j.data || [] };
  }
  function readPetugas() {
    try {
      const el = document.querySelector('input[name="id_user"], #id_user');
      if (el?.value?.trim()) return el.value.trim();
    } catch {
    }
    return "petugas";
  }
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .ext-vk-card { margin: 12px 0; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; }
    .ext-vk-card h3 { margin: 0 0 8px; font-size: 14px; font-weight: 700; }
    .ext-vk-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .ext-vk-table th, .ext-vk-table td { border: 1px solid #e2e8f0; padding: 4px 6px; font-size: 12px; }
    .ext-vk-table th { background: #f1f5f9; }
    .ext-vk-table input { width: 100%; box-sizing: border-box; padding: 2px 4px; font-size: 12px; }
    .ext-vk-btn { padding: 3px 8px; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; cursor: pointer; margin-right: 4px; }
    .ext-vk-btn:disabled { opacity: 0.6; cursor: default; }
    .ext-vk-btn.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
    .ext-vk-btn.danger { background: #dc2626; color: #fff; border-color: #dc2626; }
    .ext-vk-autocomplete { position: relative; }
    .ext-vk-suggest { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #cbd5e1; max-height: 160px; overflow-y: auto; z-index: 9999; }
    .ext-vk-suggest div { padding: 4px 6px; font-size: 12px; cursor: pointer; }
    .ext-vk-suggest div:hover { background: #e2e8f0; }
    .ext-vk-status { font-size: 11px; color: #64748b; margin-left: 6px; }
    .ext-vk-warn { margin: 0 0 8px; padding: 6px 8px; font-size: 12px; border-radius: 6px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
  `;
    document.head.appendChild(style);
  }
  function makeAutocomplete(input, row, onSelect) {
    const wrap = input.parentElement;
    let box = null;
    let timer = null;
    function close() {
      if (box) {
        box.remove();
        box = null;
      }
    }
    input.addEventListener("input", () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        const q = input.value.trim();
        if (q.length < 2) {
          close();
          return;
        }
        const { items, error } = await searchDokter(q);
        close();
        if (!items.length && !error) return;
        box = document.createElement("div");
        box.className = "ext-vk-suggest";
        if (error && !items.length) {
          const msg = document.createElement("div");
          msg.textContent = `Pencarian dokter gagal: ${error}`;
          msg.style.color = "#b91c1c";
          box.appendChild(msg);
          wrap.appendChild(box);
          return;
        }
        for (const d of items) {
          const item = document.createElement("div");
          item.textContent = d.nama;
          item.addEventListener("mousedown", (e) => {
            e.preventDefault();
            input.value = d.nama;
            onSelect(d.id, d.nama);
            close();
          });
          box.appendChild(item);
        }
        wrap.appendChild(box);
      }, 250);
    });
    input.addEventListener("blur", () => window.setTimeout(close, 150));
  }
  function buildSection(title, jenis, rows, idVisit, user, container) {
    const card = document.createElement("div");
    card.className = "ext-vk-card";
    const h = document.createElement("h3");
    h.textContent = title;
    card.appendChild(h);
    const table = document.createElement("table");
    table.className = "ext-vk-table";
    const thead = document.createElement("thead");
    thead.innerHTML = '<tr><th style="width:40px">No</th><th>Dokter</th><th style="width:60px">Aksi</th></tr>';
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    card.appendChild(table);
    const addBtn = document.createElement("button");
    addBtn.className = "ext-vk-btn primary";
    addBtn.textContent = "+ Tambah";
    card.appendChild(addBtn);
    const saveBtn = document.createElement("button");
    saveBtn.className = "ext-vk-btn primary";
    saveBtn.textContent = "Simpan";
    card.appendChild(saveBtn);
    const status = document.createElement("span");
    status.className = "ext-vk-status";
    card.appendChild(status);
    function render() {
      tbody.innerHTML = "";
      const filtered = rows.filter((r) => r.jenis === jenis);
      filtered.forEach((row, idx) => {
        const tr = document.createElement("tr");
        const tdNo = document.createElement("td");
        tdNo.textContent = String(idx + 1);
        tr.appendChild(tdNo);
        const tdDoc = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = row.nama_dokter;
        input.placeholder = "Ketik nama dokter...";
        tdDoc.appendChild(input);
        const acWrap = document.createElement("div");
        acWrap.className = "ext-vk-autocomplete";
        acWrap.style.position = "relative";
        tdDoc.appendChild(acWrap);
        acWrap.appendChild(input);
        makeAutocomplete(input, row, (id, nama) => {
          row.id_dokter = id;
          row.nama_dokter = nama;
          status.textContent = "Belum disimpan";
        });
        input.addEventListener("change", () => {
          row.nama_dokter = input.value.trim();
          status.textContent = "Belum disimpan";
        });
        tr.appendChild(tdDoc);
        const tdAct = document.createElement("td");
        const delBtn = document.createElement("button");
        delBtn.className = "ext-vk-btn danger";
        delBtn.textContent = "Hapus";
        delBtn.addEventListener("click", async () => {
          if (row.id) {
            const ok = await apiDelete(row.id, idVisit);
            if (!ok) {
              status.textContent = "Gagal hapus";
              return;
            }
          }
          const i = rows.indexOf(row);
          if (i >= 0) rows.splice(i, 1);
          render();
          status.textContent = "Dihapus";
        });
        tdAct.appendChild(delBtn);
        tr.appendChild(tdAct);
        tbody.appendChild(tr);
      });
    }
    async function saveRow(row) {
      if (!row.nama_dokter.trim() || row.saving) return false;
      row.saving = true;
      const saved = await apiSave(idVisit, row, user);
      row.saving = false;
      if (!saved) return false;
      row.id = saved.id;
      row.id_dokter = saved.id_dokter;
      row.nama_dokter = saved.nama_dokter;
      return true;
    }
    saveBtn.addEventListener("click", async () => {
      const mine = rows.filter((r) => r.jenis === jenis && r.nama_dokter.trim());
      if (!mine.length) {
        status.textContent = "Belum ada data";
        return;
      }
      saveBtn.disabled = true;
      status.textContent = "Menyimpan...";
      let ok = 0;
      for (const r of mine) if (await saveRow(r)) ok++;
      saveBtn.disabled = false;
      status.textContent = ok === mine.length ? "Tersimpan" : `Tersimpan ${ok}/${mine.length}`;
      if (ok !== mine.length) console.warn(LOG_PREFIX, "gagal simpan", jenis, ok, "/", mine.length);
    });
    addBtn.addEventListener("click", () => {
      rows.push({ id: null, jenis, nama_dokter: "", id_dokter: null, saving: false });
      render();
    });
    render();
    container.appendChild(card);
  }
  function findMainHeading() {
    const h2 = Array.from(document.querySelectorAll("h2.judul")).find(
      (el) => /halaman\s+utama/i.test(el.textContent || "")
    );
    if (h2) return h2;
    return Array.from(document.querySelectorAll("h1, h2, h3")).find(
      (el) => /halaman\s+utama/i.test(el.textContent || "")
    ) || null;
  }
  async function waitMainHeading(timeoutMs = 5e3) {
    const end = Date.now() + timeoutMs;
    for (; ; ) {
      const h = findMainHeading();
      if (h || Date.now() > end) return h;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  async function init() {
    const idVisit = getIdVisit();
    if (!idVisit) return;
    if (g.__extVisiteKonsul) return;
    g.__extVisiteKonsul = true;
    injectStyles();
    const user = readPetugas();
    let host = document.querySelector(
      "#main-content, .content, main, #content"
    );
    if (!host) host = document.body;
    const card = document.createElement("div");
    card.className = "ext-vk-card";
    const title = document.createElement("h2");
    title.textContent = "Visite & Konsul Dokter Spesialis IGD (input manual)";
    title.style.fontSize = "15px";
    title.style.fontWeight = "700";
    title.style.marginBottom = "8px";
    card.appendChild(title);
    const heading = await waitMainHeading();
    if (heading) heading.insertAdjacentElement("afterend", card);
    else host.insertBefore(card, host.firstChild);
    const { rows: existing, error: listErr } = await apiList(idVisit);
    if (listErr) {
      const warn = document.createElement("div");
      warn.className = "ext-vk-warn";
      warn.textContent = `API visite-konsul tidak aktif (${listErr}). Pencarian & simpan dokter akan gagal sampai admin Reports mengaktifkan grup API ini.`;
      card.appendChild(warn);
      console.warn(LOG_PREFIX, "api list gagal:", listErr);
    }
    const rows = existing;
    buildSection("VISITE", "visite", rows, idVisit, user, card);
    buildSection("KONSUL", "konsul", rows, idVisit, user, card);
    console.log(LOG_PREFIX, "loaded", rows.length, "rows for visit", idVisit);
  }
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.visiteKonsul = {
      id: "visiteKonsul",
      name: "Visite & Konsul Dokter (IGD)",
      description: "Input manual visite & konsul dokter spesialis IGD di halaman utama pelayanan (data di Reports SIMRS)",
      match: { pathname: "/admisi/pelaksanaan_pelayanan/halaman-utama" },
      enabledWhen: () => !!getIdVisit(),
      run: () => runWhenIdle(() => {
        init().catch((e) => console.error(LOG_PREFIX, e));
      }, 500)
    };
  } else {
    console.warn(LOG_PREFIX, "featureModules not defined, registration skipped");
  }
})();
//# sourceMappingURL=visiteKonsul.js.map
