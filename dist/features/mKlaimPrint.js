"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/config.ts
  var HOSPITAL_NAME = "RSUD H. Abdul Manap";

  // src/features/shared/printDossier.ts
  function installDossierHandlers(win) {
    const doPrint = () => {
      try {
        win.focus();
        win.print();
      } catch {
      }
    };
    const d = win.document;
    d.getElementById("btnPrintPdf")?.addEventListener("click", doPrint);
    const pages = Array.from(d.querySelectorAll(".rm-page"));
    const sel = d.getElementById("rmSectionSelect");
    const tabs = Array.from(d.querySelectorAll(".tab-btn"));
    const filter = (target) => {
      if (sel) sel.value = target;
      tabs.forEach((b) => b.classList.toggle("active", b.dataset.target === target));
      pages.forEach((pg) => {
        const show = target === "all" || pg.id === target || pg.id.startsWith(`${target}-`);
        pg.classList.toggle("hidden-section", !show);
      });
      win.scrollTo({ top: 0, behavior: "smooth" });
    };
    sel?.addEventListener("change", (ev) => filter(ev.target.value));
    tabs.forEach((b) => b.addEventListener("click", () => filter(b.dataset.target || "all")));
    const countEl = d.getElementById("checkCounter");
    const boxes = Array.from(d.querySelectorAll(".rm-checkbox, .vbox"));
    const syncCount = () => {
      if (countEl) countEl.textContent = `${boxes.filter((b) => b.checked).length} / ${boxes.length}`;
    };
    boxes.forEach((b) => b.addEventListener("change", syncCount));
    d.getElementById("btnCheckAll")?.addEventListener("click", () => {
      boxes.forEach((b) => b.checked = true);
      syncCount();
    });
    d.getElementById("btnResetChecks")?.addEventListener("click", () => {
      boxes.forEach((b) => b.checked = false);
      syncCount();
    });
    syncCount();
    const scrollBtn = (label, onClick) => {
      const b = d.createElement("button");
      b.type = "button";
      b.className = "ext-scroll-btn no-print";
      b.textContent = label;
      b.addEventListener("click", onClick);
      return b;
    };
    const btnUp = scrollBtn("\u2191", () => win.scrollTo({ top: 0, behavior: "smooth" }));
    const btnDown = scrollBtn(
      "\u2193",
      () => win.scrollTo({ top: d.documentElement.scrollHeight, behavior: "smooth" })
    );
    const style = d.createElement("style");
    style.textContent = ".ext-scroll-btn{position:fixed;right:14px;width:34px;height:34px;border:1px solid #000;background:#fff;font-size:16px;font-weight:bold;cursor:pointer;z-index:9999;display:flex;align-items:center;justify-content:center}.ext-scroll-btn:first-of-type{bottom:56px}.ext-scroll-btn:last-of-type{bottom:14px}";
    d.head.appendChild(style);
    d.body.appendChild(btnUp);
    d.body.appendChild(btnDown);
    win.addEventListener("afterprint", () => {
      if (win.confirm("Apakah menu print ini akan ditutup?")) win.close();
    });
  }

  // src/features/mKlaimPrint.ts
  var g = getMorbisGlobals();
  var REMOVE = [
    "script",
    "style",
    'link[rel="stylesheet"]',
    ".no-print",
    ".hilang-saat-print",
    "button",
    "input",
    "select",
    "textarea",
    'label:has(input[type="checkbox"])',
    ".btn",
    "[data-shortcut-buttons]",
    "[data-back-to-detail-klaim]",
    "[data-bpjs-revision-history]",
    "[onclick]",
    'a[href^="javascript:"]'
  ];
  var val = (id) => document.getElementById(id)?.value?.trim() || "";
  var pick = (...ids) => {
    for (const id of ids) {
      const v = val(id).replace(/^\s*:\s*/, "").trim();
      if (v) return v;
    }
    return "-";
  };
  function flattenControls(root) {
    const span = (text) => {
      const s = document.createElement("span");
      s.className = "fv";
      s.textContent = text;
      return s;
    };
    root.querySelectorAll("input").forEach((el) => {
      const type = (el.type || "text").toLowerCase();
      if (type === "hidden") {
        el.remove();
        return;
      }
      if (type === "radio" || type === "checkbox") {
        if (!el.checked) {
          el.remove();
          return;
        }
        if (type === "radio") {
          el.replaceWith(span("\u2713"));
          return;
        }
        const v2 = (el.value || "").trim();
        const human = v2.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
        el.replaceWith(span(human ? "\u2713 " + human : "\u2713"));
        return;
      }
      const v = (el.value || "").trim();
      if (v) el.replaceWith(span(v));
      else el.remove();
    });
    root.querySelectorAll("textarea").forEach((el) => {
      const v = (el.value || "").trim();
      if (v) el.replaceWith(span(v));
      else el.remove();
    });
    root.querySelectorAll("select").forEach((el) => {
      const opt = el.options[el.selectedIndex];
      const v = (opt?.textContent || el.value || "").trim();
      if (v) el.replaceWith(span(v));
      else el.remove();
    });
  }
  function isBlankCanvas(cv) {
    try {
      if (!cv.width || !cv.height) return true;
      const size = 64;
      const probe = document.createElement("canvas");
      probe.width = size;
      probe.height = size;
      const ctx = probe.getContext("2d", { willReadFrequently: true });
      if (!ctx) return false;
      ctx.drawImage(cv, 0, 0, size, size);
      const d = ctx.getImageData(0, 0, size, size).data;
      let sum = 0;
      for (let i = 0; i < d.length; i += 4) {
        sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
      }
      const avg = sum / (size * size);
      return avg < 8 || avg > 250;
    } catch {
      return false;
    }
  }
  function addVerColumns(root) {
    root.querySelectorAll("table").forEach((table) => {
      if (table.parentElement?.closest("table")) return;
      const rows = Array.from(table.rows);
      const cols = rows[0]?.cells.length || 0;
      if (rows.length < 6 || cols < 4 || table.querySelector(".vcol")) return;
      rows.forEach((tr, idx) => {
        const cells = Array.from(tr.cells);
        if (!cells.length || cells.some((c) => c.colSpan >= 3)) return;
        if (idx === 0) {
          const th = document.createElement("th");
          th.className = "vcol";
          th.textContent = "Ver";
          tr.appendChild(th);
        } else {
          const td = document.createElement("td");
          td.className = "vcol";
          const box = document.createElement("input");
          box.type = "checkbox";
          box.className = "vbox";
          td.appendChild(box);
          tr.appendChild(td);
        }
      });
    });
  }
  var VER_DOCS = /Rincian Biaya|Resume|Telaah|Laboratorium|Radiologi|SPRI|SBPK/i;
  function stripOriginalLetterhead(root) {
    root.querySelectorAll(".tabel-juduls").forEach((el) => el.remove());
    root.querySelectorAll("h1,h2,td").forEach((el) => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^RSUD H\.? ABDUL MANAP$/i.test(t)) el.remove();
    });
    root.querySelectorAll("tr").forEach((tr) => {
      const t = (tr.textContent || "").replace(/\s+/g, " ").trim();
      if (/^(RSUD H\.? ABDUL MANAP|PEMERINTAH KOTA JAMBI|Jl\. Sk\. Rd\. Syahbudin)/i.test(t) || /^(RINCIAN\s+BIAYA|LAPORAN|FORMULIR)/i.test(t) && tr.querySelector("u,b,strong"))
        tr.remove();
    });
    const firstData = root.querySelector("table");
    if (firstData) {
      Array.from(root.querySelectorAll("hr")).forEach((hr) => {
        if (firstData.compareDocumentPosition(hr) & Node.DOCUMENT_POSITION_PRECEDING) hr.remove();
      });
    }
  }
  function clean(section, withVer = false) {
    const c = section.cloneNode(true);
    const sourceCanvas = Array.from(section.querySelectorAll("canvas"));
    const cloneCanvas = Array.from(c.querySelectorAll("canvas"));
    sourceCanvas.forEach((cv, i) => {
      const target = cloneCanvas[i];
      if (!target) return;
      if (isBlankCanvas(cv)) {
        target.remove();
        return;
      }
      try {
        const img = document.createElement("img");
        img.src = cv.toDataURL("image/png");
        img.style.cssText = "max-width:100%;height:auto;";
        target.replaceWith(img);
      } catch {
        const note = document.createElement("div");
        note.className = "fv";
        note.textContent = "[Berkas PDF \u2014 silakan buka di halaman asli]";
        target.replaceWith(note);
      }
    });
    flattenControls(c);
    REMOVE.forEach((sel) => c.querySelectorAll(sel).forEach((el) => el.remove()));
    c.querySelectorAll("tr").forEach((tr) => {
      const cells = Array.from(tr.cells);
      for (let i = cells.length - 1; i >= 0; i--) {
        const cell = cells[i];
        const empty = !(cell.textContent || "").trim() && !cell.querySelector("img,table,input");
        if (!empty) break;
        cell.remove();
      }
    });
    c.querySelectorAll("[style]").forEach((el) => {
      const s = el.getAttribute("style") || "";
      const keep = (s.match(/(?:text-align|width|vertical-align|white-space)\s*:[^;]+/gi) || []).join(
        ";"
      );
      if (keep) el.setAttribute("style", keep);
      else el.removeAttribute("style");
    });
    c.removeAttribute("id");
    c.removeAttribute("class");
    c.removeAttribute("style");
    c.querySelectorAll("div").forEach((el) => {
      if (!el.children.length && !(el.textContent || "").trim()) el.remove();
    });
    stripOriginalLetterhead(c);
    if (withVer) addVerColumns(c);
    return c.innerHTML.trim();
  }
  function titleOf(section, i) {
    const head = section.querySelector(".panel-heading, .panel-title, legend, h4");
    let t = (head?.textContent || "").replace(/\s+/g, " ").trim();
    t = t.replace(/^Cetak\s+/i, "").replace(/^[\d.,\s-]+/, "");
    return t || `Berkas ${String(i + 1).padStart(2, "0")}`;
  }
  var MULTI_DOC = /^(Konsul|Radiologi)/i;
  function collectSections() {
    const nodes = Array.from(document.querySelectorAll(".isidalam"));
    const seen = /* @__PURE__ */ new Set();
    const sections = [];
    const inventory = [];
    nodes.forEach((node, i) => {
      const title = titleOf(node, i);
      if (!MULTI_DOC.test(title) && seen.has(title)) return;
      seen.add(title);
      const html = clean(node, VER_DOCS.test(title));
      if (html.length < 20) {
        inventory.push({ title, docNo: null });
        return;
      }
      sections.push({ title, html });
      inventory.push({ title, docNo: sections.length });
    });
    if (!sections.length) {
      const fallback = document.querySelector("#section-to-print");
      if (fallback) {
        const title = "Detail Klaim";
        sections.push({ title, html: clean(fallback) });
        inventory.push({ title, docNo: 1 });
      }
    }
    return { sections, inventory };
  }
  var esc = (s) => decodeEntities(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
  var nl2br = (s) => esc(s).replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/\n/g, "<br/>");
  var plainText = (html) => (new DOMParser().parseFromString(html.replace(/src="data:[^"]*"/g, ""), "text/html").body.textContent || "").replace(/\s+/g, " ").trim();
  var isoDate = (raw) => {
    const p = raw.split(/[-/]/).map((x) => x.trim());
    if (p.length !== 3) return raw;
    const [a, b, c] = p;
    return a.length === 4 ? `${a}-${b.padStart(2, "0")}-${c.padStart(2, "0")}` : `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
  };
  var RE_MASUK = /(?:Tgl|Tanggal)\.?\s*Masuk(?:\s*RS)?\s*[:.]?\s*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/gi;
  var RE_KELUAR = /(?:Tgl|Tanggal)\.?\s*(?:Keluar|Pulang)(?:\s*RS)?\s*[:.]?\s*(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})/gi;
  var RE_SEPNO = /No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]{8,})/gi;
  function runChecks(sections, inventory) {
    const out = [];
    const texts = sections.map((s) => ({ t: s.title, x: plainText(s.html) }));
    const find = (re) => {
      const hits = [];
      const seen = /* @__PURE__ */ new Set();
      texts.forEach((s) => {
        const rx = new RegExp(re.source, re.flags);
        let m;
        while (m = rx.exec(s.x)) {
          const key = s.t + "|" + m[1];
          if (seen.has(key)) continue;
          seen.add(key);
          hits.push({ t: s.t, d: re === RE_SEPNO ? m[1] : isoDate(m[1]) });
        }
      });
      return hits;
    };
    const masuk = find(RE_MASUK);
    if (new Set(masuk.map((m) => m.d)).size > 1) {
      out.push({
        level: "warn",
        title: "Tanggal masuk berbeda antar berkas",
        detail: masuk.map((m) => `${m.t} ${m.d}`).join(" \xB7 ") + " \u2014 samakan sebelum berkas dikirim ke verifikator."
      });
    }
    const keluar = find(RE_KELUAR);
    if (masuk.length && keluar.length) {
      const first = masuk.map((m) => m.d).sort()[0];
      const last = keluar.map((k) => k.d).sort().pop();
      if (last < first) {
        out.push({
          level: "warn",
          title: "Tanggal keluar lebih awal dari tanggal masuk",
          detail: `Masuk ${first} \xB7 Keluar ${last}.`
        });
      }
    }
    const seps = find(RE_SEPNO);
    if (new Set(seps.map((s) => s.d)).size > 1) {
      out.push({
        level: "warn",
        title: "Nomor SEP berbeda antar lembar",
        detail: seps.map((s) => `${s.t} ${s.d}`).join(" \xB7 ")
      });
    }
    const core = [/^SEP$/i, /SBPK/i, /Resume/i, /Rincian Biaya/i];
    const missing = inventory.filter((r) => r.docNo === null && core.some((re) => re.test(r.title)));
    if (missing.length) {
      out.push({
        level: "warn",
        title: "Berkas inti belum terisi",
        detail: missing.map((m) => m.title).join(", ") + "."
      });
    }
    const billing = texts.find((s) => /Rincian Biaya/i.test(s.t));
    if (billing && !/Total\s+(Biaya|Transaksi|Resep|Jasa)/i.test(billing.x)) {
      out.push({
        level: "warn",
        title: "Rincian biaya tanpa baris total",
        detail: "Tidak ditemukan Total Biaya/Transaksi/Resep pada lembar Rincian Biaya."
      });
    }
    ["Laboratorium", "Radiologi"].forEach((name) => {
      const s = texts.find((t) => new RegExp(name, "i").test(t.t));
      if (s && s.x.length < 60) {
        out.push({
          level: "info",
          title: `Lembar ${name} hanya lampiran gambar`,
          detail: "Tidak ada teks hasil yang bisa dicocokkan otomatis \u2014 cocokkan manual dengan Resume dan Rincian Biaya."
        });
      }
    });
    return out;
  }
  var KOP_LOGO = `data:image/png;base64,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`;
  var RM_META = [
    [
      /^Triage/i,
      {
        id: "triage",
        code: "TRIAGE",
        tab: "Triage IGD",
        option: "Triage \u2014 Pengkajian Awal IGD"
      }
    ],
    [
      /PENGKAJIAN INSTALASI GAWAT DARURAT/i,
      {
        id: "pengkajian-igd",
        code: "PENGKAJIAN IGD",
        tab: "Pengkajian IGD",
        option: "Pengkajian IGD \u2014 Lembar Pengkajian Instalasi Gawat Darurat"
      }
    ],
    [
      /^SEP$/i,
      {
        id: "rm-01",
        code: "RM. 01",
        tab: "RM. 01 SEP/CBG",
        option: "RM. 01 \u2014 SEP &amp; Berkas Klaim Individual (INA-CBG)"
      }
    ],
    [
      /^SBPK$/i,
      {
        id: "rm-02",
        code: "RM. 02",
        tab: "RM. 02 SBPK",
        option: "RM. 02 \u2014 Surat Bukti Pelayanan Kesehatan (SBPK)"
      }
    ],
    [
      /^SPRI$/i,
      {
        id: "rm-03",
        code: "RM. 03",
        tab: "RM. 03 SPRI",
        option: "RM. 03 \u2014 Surat Pengantar Rawat Inap (SPRI)"
      }
    ],
    [
      /^Rincian Biaya/i,
      {
        id: "rm-05",
        code: "RM. 05",
        tab: "RM. 05 Billing",
        option: "RM. 05 \u2014 Rincian Biaya Pelayanan Rawat Inap &amp; Farmasi"
      }
    ],
    [
      /^Resume/i,
      {
        id: "rm-06",
        code: "RM. 06",
        tab: "RM. 06 Resume",
        option: "RM. 06 \u2014 Ringkasan Pulang (Discharge Summary)"
      }
    ],
    [
      /^Telaah/i,
      {
        id: "rm-07",
        code: "RM. 07",
        tab: "RM. 07 Telaah",
        option: "RM. 07 \u2014 Formulir Telaah Resep, Obat &amp; Edukasi"
      }
    ],
    [
      /^Radiologi/i,
      {
        id: "rm-08",
        code: "RM. 08",
        tab: "RM. 08 Radiologi",
        option: "RM. 08 \u2014 Hasil Pemeriksaan Radiologi"
      }
    ],
    [
      /^Laboratorium/i,
      {
        id: "rm-09",
        code: "RM. 09",
        tab: "RM. 09 Lab",
        option: "RM. 09 \u2014 Hasil Pemeriksaan Laboratorium Patologi Klinik"
      }
    ],
    [
      /Konsul/i,
      {
        id: "rm-10",
        code: "RM. 10",
        tab: "RM. 10 Konsul",
        option: "RM. 10 \u2014 Lembar Konsultasi Antar-Spesialis"
      }
    ],
    [
      /^Persetujuan Tindakan/i,
      {
        id: "form-konsent",
        code: "RM. 19A",
        tab: "RM. 19A Persetujuan",
        option: "RM. 19A \u2014 Persetujuan Tindakan Kedokteran"
      }
    ],
    [
      /^Anestesi/i,
      {
        id: "form-anestesi",
        code: "ANESTESI",
        tab: "Anestesi",
        option: "Anestesi \u2014 Rekam Pelaksanaan Anestesi"
      }
    ],
    [
      /^Fisioterapi/i,
      {
        id: "form-fisioterapi",
        code: "FISIOTERAPI",
        tab: "Fisioterapi",
        option: "Fisioterapi \u2014 Assesmen &amp; Terapi"
      }
    ],
    [
      /^Pengkajian Hemodialisa/i,
      {
        id: "form-hemodialisa",
        code: "HEMODIALISA",
        tab: "Hemodialisa",
        option: "Hemodialisa \u2014 Pengkajian &amp; Sesi"
      }
    ],
    [
      /^Operasi/i,
      {
        id: "form-operasi",
        code: "OPERASI",
        tab: "Operasi",
        option: "Operasi \u2014 Laporan Pelaksanaan"
      }
    ],
    [
      /^Surat Kematian/i,
      {
        id: "form-kematian",
        code: "KEMATIAN",
        tab: "Surat Kematian",
        option: "Surat Kematian \u2014 Surat Keterangan"
      }
    ],
    [
      /^Permintaan Terapi/i,
      {
        id: "form-terapi",
        code: "TERAPI",
        tab: "Permintaan Terapi",
        option: "Permintaan Terapi \u2014 Rehabilitasi Medik"
      }
    ],
    [
      /^Uji Fungsi/i,
      {
        id: "form-uji-fungsi",
        code: "UJI FUNGSI",
        tab: "Uji Fungsi",
        option: "Uji Fungsi \u2014 Lembar Uji Fungsi"
      }
    ],
    [
      /^Partograf/i,
      {
        id: "form-partograf",
        code: "PARTOGRAF",
        tab: "Partograf",
        option: "Partograf \u2014 Pemantauan Persalinan"
      }
    ],
    [
      /^Laporan Tindakan/i,
      {
        id: "form-laporan-tindakan",
        code: "LAPORAN TINDAKAN",
        tab: "Laporan Tindakan",
        option: "Laporan Tindakan \u2014 Pelaksanaan Tindakan"
      }
    ],
    [
      /^Bon Makan/i,
      {
        id: "form-bon-makan",
        code: "BON MAKAN",
        tab: "Bon Makan",
        option: "Bon Makan \u2014 Pasien / Pendamping"
      }
    ],
    [
      /^PEMERIKSAAN$/i,
      {
        id: "form-pemeriksaan",
        code: "PEMERIKSAAN",
        tab: "Pemeriksaan",
        option: "Pemeriksaan \u2014 Hasil Diagnostik"
      }
    ]
  ];
  var metaFor = (title, i) => RM_META.find(([re]) => re.test(title))?.[1] ?? {
    id: `doc-${i + 1}`,
    code: "FORMULIR RM KLAIM JKN",
    tab: `RM. ${String(i + 1).padStart(2, "0")} ${title}`,
    option: `RM. ${String(i + 1).padStart(2, "0")} \u2014 ${title}`
  };
  var kop = (code) => `<div class="rm-code-top">${code}</div>
<div class="kop-surat"><img class="kop-logo" src="${KOP_LOGO}" alt="Logo Kota Jambi"><div class="kop-text">
<div class="kop-line-1">PEMERINTAH KOTA JAMBI</div>
<div class="kop-line-2">DINAS KESEHATAN</div>
<div class="kop-line-3">RUMAH SAKIT UMUM DAERAH H. ABDUL MANAP</div>
<div class="kop-line-4">Alamat : Jl. Sk. Rd. Syahbuddin Kel. Mayang Mangurai Kec. Alam Barajo Kota Jambi 36129 &#9742; (0741) 670459</div>
<div class="kop-line-5">email : rsud_ham.jambi@yahoo.co.id, rsud@jambikota.go.id, website : rsud.jambikota.go.id</div>
</div></div><div class="kop-double-rule"></div>`;
  var idRow = (label, value, strong = false) => `<tr><td class="lbl">${label}</td><td class="col">:</td><td class="val">${strong ? `<strong>${nl2br(value)}</strong>` : nl2br(value)}</td></tr>`;
  var BPJS_LOGO = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDEuNjMgMzEuMDIiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEsIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzAwYTU1MTsKICAgICAgfQoKICAgICAgLmNscy0zLCAuY2xzLTQgewogICAgICAgIGZpbGw6ICMwMjNmODc7CiAgICAgIH0KCiAgICAgIC5jbHMtNSB7CiAgICAgICAgZmlsbDogI2ZmZjsKICAgICAgfQoKICAgICAgLmNscy01LCAuY2xzLTQsIC5jbHMtMiB7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBpZD0iTGF5ZXJfMS0yIiBkYXRhLW5hbWU9IkxheWVyIDEiPgogICAgPGc+CiAgICAgIDxnPgogICAgICAgIDxnPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTAyLjkxLDE1LjFjLS44Mi0yLjQtMS42NS00LjgtMi40Ny03LjJsLTEuODYsMi4zMnY0Ljg5YzAsMS4xOS0uNjcsMS45Ni0yLjEyLDEuOTVoLS44N2MwLTUuNjksMC0xMS4zNywwLTE3LjA2aC42NGMuMzEsMCwuNTcsMCwuODcuMDUsMS4wMi4xOSwxLjQ5LjksMS40OSwxLjl2NS4zMmw1LjMxLTYuMzlDMTA0LjY0LDAsMTA1LjA3LDAsMTA2LjI5LDBoLjQxYy0xLjQsMS44LTIuOCwzLjU5LTQuMiw1LjM5LDEuNDMsMy44OSwyLjg3LDcuNzgsNC4zLDExLjY3aC0uNDdjLS42OSwwLTEuMzUuMDMtMS45OC0uMjYtLjQzLS4yLS43OC0uNS0xLjA0LS44OC0uMTgtLjI2LS4yOS0uNTMtLjM5LS44MloiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTExNy45NCwxNC44NmMtLjc1LDEuNjItMi41MywyLjIzLTQuNDMsMi4yMy0yLjk0LDAtNC41NS0xLjYxLTUuMjctMy43Mi0uNS0xLjQ2LS42Ni0zLjI4LS4zOS00Ljk5LjQxLTIuNjEsMi01LjM4LDUuMjktNS4zOCw0Ljc2LDAsNS4zLDMuNjgsNS40Niw2Ljk5aC03Ljk3Yy0uMDksMS45OC4zMiw1LjYxLDMuMjksNS42MS43OSwwLDEuMzktLjE0LDEuNzktLjQyLjcyLS40MiwxLjMxLS43OSwyLjIzLS4zM2gwWm0tMi4wNi02LjA5Yy0uMDYtLjgtLjE1LTEuNDgtLjI3LTIuMDMtLjcxLTMuMTUtMy45OC0yLjgyLTQuNzQtLjAyLS4xNS41NS0uMjQsMS4yNC0uMjYsMi4wNWg1LjI3WiIvPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTIyLjkxLDE1LjAzYy41My4zNSwxLjE3LjUzLDEuOTEuNTNzMS4zNS0uMTgsMS43My0uNTVjLjM4LS4zNi41Ny0uODMuNTctMS40LDAtLjQtLjA2LS43My0uMTktMS0uMTMtLjI3LS4yOS0uNS0uNS0uNjktLjItLjE5LS40NC0uMzUtLjctLjQ3LS4yNy0uMTItLjUzLS4yNC0uODEtLjM0LS42MS0uMjItMS4xNy0uNDYtMS42OC0uNzEtLjUxLS4yNi0uOTUtLjU1LTEuMzItLjg3LS4zNy0uMzItLjY2LS42OS0uODctMS4xMS0uMjEtLjQyLS4zMS0uOS0uMzEtMS40NiwwLS42Ni4xMi0xLjI0LjM1LTEuNzMuMjMtLjUuNTYtLjkxLjk4LTEuMjQuNDItLjMzLjkxLS41OCwxLjQ5LS43NS41Ny0uMTcsMS4yLS4yNSwxLjg3LS4yNS44MiwwLDEuNTkuMTMsMi4zMS40MS43Mi4yNywxLjI0Ljc3LDEuNTgsMS41LS45Ny42OC0xLjYuMTktMi4yMS0uMDMtLjExLS4wNi0uMjMtLjExLS4zNS0uMTYtLjM0LS4xMi0uNzEtLjE4LTEuMTEtLjE4LS4zMiwwLS42My4wNC0uOTMuMTEtLjMuMDctLjU2LjE5LS43OS4zNC0uMjMuMTUtLjQuMzUtLjUzLjU4LS4xMy4yMy0uMTkuNTItLjE5Ljg1LDAsLjU1LjE3Ljk5LjUxLDEuMjkuMzQuMzEuNzYuNTYsMS4yNy43Ny41MS4yLDEuMDYuNCwxLjY0LjU4LjU5LjE4LDEuMTQuNDMsMS42NC43My41MS4zMS45My43MSwxLjI3LDEuMjEuMzQuNS41MSwxLjE3LjUxLDIuMDIsMCwuNjQtLjEzLDEuMjItLjM3LDEuNzMtLjI1LjUxLS41OS45NC0xLjAzLDEuMjktLjQzLjM1LS45NS42Mi0xLjU2LjgxLS42LjE5LTEuMjUuMjgtMS45NC4yOC0xLjE2LDAtMi4xNS0uMjEtMi45Ny0uNjQtLjgyLS40Mi0xLjQzLTEuMDctMS44MS0xLjk1LjMyLS4yLjgzLS41LDEuNDktLjI2LjQ0LjE2LjcuNDksMS4wNy43NFoiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE1Mi43MSw2LjcyYzAtLjctLjE2LTEuMTctLjUtMS40My0uMzMtLjI1LS44NS0uMzgtMS41Ni0uMzgtLjU4LDAtMS4xMi4xMy0xLjYyLjM4LS41LjI1LS44Ni41My0xLjA5Ljg1djkuMDZjMCwuOTUtLjQ1LDEuNjItMS40MiwxLjgxLS4yOS4wNS0uNTMuMDUtLjgzLjA1aC0uNjFWMGguNjFjLjMsMCwuNTQsMCwuODMuMDUuOTcuMTgsMS40Mi44NSwxLjQyLDEuODF2MS4yNmgwdjEuNThjLjM3LS40NS45Mi0uODQsMS42NC0xLjE4LjczLS4zNCwxLjU3LS41MSwyLjU0LS41MSwxLjE2LDAsMi4wMi4yOSwyLjU5Ljg2LjU2LjU3Ljg1LDEuNDYuODUsMi42NnYxMC41NGgtLjYxYy0uMywwLS41NCwwLS44My0uMDUtLjk3LS4xOC0xLjQyLS44NS0xLjQyLTEuODFWNi43MloiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE2NC44Nyw5LjI5Yy0uMzIuMTYtLjcuMjktMS4xNC4zOC0uNDMuMDktLjg1LjItMS4yNi4zMi0uODEuMjMtMS4zOC41OS0xLjc0LDEuMDctLjM1LjQ4LS41MywxLjExLS41MywxLjg4LDAsLjg3LjE3LDEuNTEuNTIsMS45MS4zNS40Ljg5LjYsMS42My42LjU2LDAsMS4wNi0uMTMsMS41LS4zOS40My0uMjYuNzctLjYzLDEuMDEtMS4wOXYtNC42N2gwWm0uMjIsNS44N2MtLjMyLjYtLjgxLDEuMDYtMS40NSwxLjQxLS42NC4zNC0xLjQuNTEtMi4yNy41MS0xLjMyLDAtMi4zMS0uMzMtMi45Ni0uOTktLjY1LS42Ni0uOTgtMS41OC0uOTgtMi43NnMuMjYtMi4wOC43Ny0yLjcxYy41MS0uNjMsMS4zMS0xLjExLDIuMzktMS40NC4zNS0uMTIuNzMtLjIxLDEuMTItLjI3LjM5LS4wNy43OC0uMTMsMS4xNi0uMi4zOC0uMDYuNzQtLjE0LDEuMDktLjI0Ljc5LS4yMi44Ny0uNDIuODgtLjk4LDAtLjI2LDAtLjUyLDAtLjc3LDAtLjcxLS4xNi0xLjI1LS40OC0xLjYxLS4zMi0uMzYtLjkzLS41NS0xLjg0LS41NS0uNjgsMC0xLjI2LjEzLTEuNzUuNC0uOTUuNTItMS4zNy45NC0yLjYuMzQuNDctLjgxLDEuMTEtMS40LDEuOTItMS43Ni44MS0uMzYsMS42OS0uNTMsMi42NC0uNTMuNjgsMCwxLjMyLjA1LDEuOTIuMTQuNi4wOSwxLjEzLjI4LDEuNTcuNTQuNDQuMjcuNzkuNjUsMS4wNSwxLjEzLjI2LjQ5LjM5LDEuMTIuMzksMS45MXYxMC4zM2MtLjA3LDAtLjQ1LDAtLjc3LDAtMS4zNiwwLTEuNzgtLjcyLTEuODEtMS45MVoiLz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0ibTE3Ny43OSwxNi4xNmMtLjQ1LjMzLS45MS41Ni0xLjM5LjctLjQ4LjE0LTEuMS4yMS0xLjg3LjIxLTEuMjIsMC0yLjE4LS4zNS0yLjg3LTEuMDQtLjY5LS42OS0xLjA0LTEuNjUtMS4wNC0yLjg4VjQuMzloLS40NmMtLjc5LS4wMi0xLjIxLS4xNS0xLjIxLTEuMzhoMS42N1YwaC42MWMuMywwLC41NCwwLC44My4wNS45Ny4xOCwxLjQyLjg1LDEuNDIsMS44MXYxLjE1aDEuNjdjLjc5LjAyLDEuMjEuMTUsMS4yMSwxLjM4aC0yLjl2OC43N2MwLC43Ni4xNywxLjM1LjUsMS43Ny4zMy40Mi44Ni42NCwxLjU4LjY0LjI2LDAsLjUtLjAyLjctLjA1Ljg0LS4xMywxLjI1LS4wMSwxLjU3LjY1WiIvPgogICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJtMTk4Ljc4LDYuNzJjMC0uNy0uMTctMS4xNy0uNS0xLjQzLS4zMy0uMjUtLjg1LS4zOC0xLjU2LS4zOC0uNTgsMC0xLjEyLjEzLTEuNjIuMzgtLjUuMjUtLjg2LjUzLTEuMDkuODV2OS4wNmMwLC45NS0uNDUsMS42Mi0xLjQyLDEuODEtLjI5LjA1LS41My4wNS0uODMuMDVoLS42MVYzaC42MWMuMywwLC41NCwwLC44My4wNS45MS4xNywxLjM2Ljc4LDEuNDEsMS42NGgwYy4zNy0uNDUuOTItLjg0LDEuNjQtMS4xOC43Mi0uMzQsMS41Ny0uNTEsMi41NC0uNTEsMS4xNiwwLDIuMDIuMjksMi41OS44Ni41Ni41Ny44NSwxLjQ2Ljg1LDIuNjZ2MTAuNTRoLS42MWMtLjMsMC0uNTQsMC0uODMtLjA1LS45Ny0uMTgtMS40Mi0uODUtMS40Mi0xLjgxVjYuNzJaIi8+CiAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xNDIuMTEsMTQuODZjLS43NSwxLjYyLTIuNTMsMi4yMy00LjQzLDIuMjMtMi45NCwwLTQuNTUtMS42MS01LjI3LTMuNzItLjUtMS40Ni0uNjYtMy4yOC0uNC00Ljk5LjQxLTIuNjEsMi01LjM4LDUuMjktNS4zOCw0Ljc2LDAsNS4zLDMuNjgsNS40Niw2Ljk5aC03Ljk3Yy0uMDksMS45OC4zMiw1LjYxLDMuMjksNS42MS43OSwwLDEuMzktLjE0LDEuNzktLjQyLjcyLS40MiwxLjMxLS43OSwyLjIzLS4zM2gwWm0tMi4wNi02LjA5Yy0uMDYtLjgtLjE1LTEuNDgtLjI3LTIuMDMtLjctMy4xNS0zLjk4LTIuODItNC43NC0uMDItLjE1LjU1LS4yNCwxLjI0LS4yNiwyLjA1aDUuMjdaIi8+CiAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Im0xODYuMjYsOS4yOWMtLjMyLjE2LS43LjI5LTEuMTQuMzgtLjQzLjA5LS44NS4yLTEuMjYuMzItLjgxLjIzLTEuMzkuNTktMS43NCwxLjA3LS4zNS40OC0uNTMsMS4xMS0uNTMsMS44OCwwLC44Ny4xNywxLjUxLjUyLDEuOTEuMzUuNC44OS42LDEuNjMuNi41NiwwLDEuMDYtLjEzLDEuNS0uMzkuNDQtLjI2Ljc3LS42MywxLjAyLTEuMDl2LTQuNjdoMFptLjIyLDUuODdjLS4zMi42LS44MSwxLjA2LTEuNDUsMS40MS0uNjQuMzQtMS40LjUxLTIuMjcuNTEtMS4zMiwwLTIuMzEtLjMzLTIuOTYtLjk5LS42NS0uNjYtLjk4LTEuNTgtLjk4LTIuNzZzLjI2LTIuMDguNzctMi43MWMuNTItLjYzLDEuMzEtMS4xMSwyLjM5LTEuNDQuMzUtLjEyLjczLS4yMSwxLjEyLS4yNy4zOS0uMDcuNzgtLjEzLDEuMTYtLjIuMzgtLjA2Ljc0LS4xNCwxLjA5LS4yNC43OS0uMjIuODctLjQyLjg4LS45OCwwLS4yNiwwLS41MiwwLS43NywwLS43MS0uMTYtMS4yNS0uNDgtMS42MS0uMzItLjM2LS45My0uNTUtMS44NC0uNTUtLjY4LDAtMS4yNi4xMy0xLjc1LjQtLjk1LjUyLTEuMzcuOTQtMi42LjM0LjQ3LS44MSwxLjExLTEuNCwxLjkyLTEuNzYuODEtLjM2LDEuNjktLjUzLDIuNjQtLjUzLjY4LDAsMS4zMi4wNSwxLjkyLjE0LjYuMDksMS4xMy4yOCwxLjU3LjU0LjQ0LjI3Ljc5LjY1LDEuMDUsMS4xMy4yNi40OS4zOSwxLjEyLjM5LDEuOTF2MTAuMzNjLS4wNywwLS40NSwwLS43NywwLTEuMzYsMC0xLjc4LS43Mi0xLjgxLTEuOTFaIi8+CiAgICAgICAgPC9nPgogICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0ibTUxLjczLDcuNzJjMS44OC0uMDYsMi40MS0xLjcsMi40MS0zLjA3LDAtMS40NC0uMTUtMy4wNy0yLjEtMy4wN2gtMi41MXY2LjE0aDIuMlptLS4wMyw3LjljLjkzLDAsMS42Mi0uMjYsMi4wNi0uNzguNDQtLjUyLjY2LTEuMzYuNjYtMi41MiwwLTEuNDctLjItMi45Ny0yLjIyLTMuMjdoLTIuNjh2Ni41N2gyLjE3Wm0tNS4xNywxLjQ3Vi4wNGg1Ljg2YzMuMzEsMCw0Ljc5LDIuMTIsNC40OSw0LjktLjE0LDEuMjgtLjYyLDIuNi0xLjkxLDMuMjksMy4xNi45NiwzLjE2LDUuNTgsMS4zLDcuNTgtLjguODUtMi4wNywxLjI4LTMuODMsMS4yOGgtNS45MVoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im02MC42Ni4wNGg1Ljc5Yy44NywwLDEuNjEuMDksMi4yMi4yNy42MS4xOCwxLjEuNDQsMS40Ny44LjM3LjM2LjY0LjgxLjgxLDEuMzUuMTcuNTQuMjUsMS4xOC4yNSwxLjksMCwxLjE2LS4wOSwyLjEzLS4yNywyLjktLjE4Ljc4LS40NywxLjQxLS44OSwxLjg4LS40Mi40Ny0uOTcuODItMS42NSwxLjAyLS42OC4yMS0xLjUzLjMxLTIuNTUuMzFoLTIuMnY0LjY2YzAsMS4xOS0uNjcsMS45Ni0yLjEyLDEuOTVoLS44N2MwLTUuNjgsMC0xMS4zNywwLTE3LjA1aDBabTQuODgsOC45M2MuNDgsMCwuODktLjA2LDEuMjItLjE5LjMzLS4xMy42LS4zNC44Mi0uNjMuMjItLjMuMzctLjY5LjQ3LTEuMTguMS0uNDkuMTQtMS4xLjE0LTEuODNzLS4wNC0xLjMtLjEyLTEuNzZjLS4wOC0uNDYtLjIxLS44Mi0uMzctMS4wOS0uMTctLjI3LS4zOS0uNDUtLjY2LS41Ni0uMjctLjEtLjYxLS4xNi0xLjAxLS4xNmgtMi4zN3Y3LjM5aDEuODhaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIiBkPSJtNzQuNC4wNGguNjNjLjMxLDAsLjU2LDAsLjg2LjA1LDEuMDEuMTksMS40OC44OSwxLjQ4LDEuODh2MTAuODhjMCwyLjgzLTEuNjcsNC4yNS01LjAyLDQuMjUtLjE2LDAtLjMxLDAtLjQ2LDAtMS4wOS0uMDItMi4wNi0uMjctMi44OS0uNzUtLjg2LS41LTEuNDktMS4yMi0xLjg5LTIuMTUuNy0uMjgsMS4zLS40MywxLjkzLjA0LjI2LjE5LjQ3LjQyLjc1LjYxLjMuMi42NC4zNSwxLjAyLjQ0LjgxLjIsMS45Ni4yMSwyLjc0LS4yMi43OS0uNDQuODYtMS4yNy44Ni0yLjA1Vi4wNFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Im04Mi41OSwxNC44NGMuNTUuMzcsMS4yMy41NiwyLjA1LjU2LjM5LDAsLjc2LS4wNiwxLjExLS4xOC4zNS0uMTIuNjYtLjI5LjkzLS41Mi4yNy0uMjIuNDgtLjQ5LjYzLS44Mi4xNS0uMzIuMjMtLjY4LjIzLTEuMDksMC0uMzYtLjA2LS42Ny0uMTctLjk1LS4xMS0uMjctLjI3LS41Mi0uNDYtLjczLS4xOS0uMjItLjQyLS40MS0uNjktLjU5LS4yNy0uMTgtLjU1LS4zNi0uODYtLjU1LS42OS0uNC0xLjMzLS43OS0xLjkyLTEuMTctLjU5LS4zOC0xLjEtLjc5LTEuNTMtMS4yMi0uNDMtLjQzLS43OC0uOTEtMS4wMy0xLjQzLS4yNS0uNTItLjM3LTEuMTQtLjM3LTEuODYsMC0uNjIuMTEtMS4xOC4zMy0xLjcuMjItLjUyLjU0LS45Ni45Ny0xLjM0LjQzLS4zOC45NS0uNjgsMS41Ni0uODkuNjEtLjIyLDEuMzEtLjMyLDIuMS0uMzIsMS4wMywwLDEuOTIuMjEsMi42Ni42My43NC40MiwxLjI0LDEuMDIsMS41LDEuNzgtLjg2LjM3LTEuNDkuMTctMi4xOS0uMzUtLjQ0LS4yOS0uOTctLjQ0LTEuNTgtLjQ0LS44NSwwLTEuNTIuMjEtMS45OS42Mi0uNDcuNDItLjcxLDEtLjcxLDEuNzYsMCwuNjMuMTgsMS4xNS41NCwxLjU3LjM2LjQyLjgxLjc5LDEuMzUsMS4xMy41NC4zNCwxLjEzLjY2LDEuNzYuOTcuNjQuMzEsMS4yMi42NywxLjc2LDEuMDguNTQuNDEuOTkuOSwxLjM1LDEuNDcuMzYuNTcuNTQsMS4yOS41NCwyLjE1LDAsLjY3LS4xMywxLjMtLjM5LDEuODctLjI2LjU3LS42MywxLjA3LTEuMTEsMS40OC0uNDguNDItMS4wNy43NC0xLjc3Ljk4LS43LjI0LTEuNDkuMzYtMi4zOC4zNi0xLjE0LDAtMi4xNC0uMjUtMy4wMS0uNzUtLjg2LS41LTEuNDktMS4yMi0xLjg5LTIuMTUuNy0uMjgsMS4zLS40MywxLjkzLjA0LjI2LjE5LjQ3LjQyLjc1LjYxWiIvPgogICAgICA8L2c+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0ibTExMy4wOCwyOS4xM3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjExLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS02LjE5LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjYtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNy0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOVptLTUuNTYsMi4zOHYtNy4yM2gtMS4wMXY3LjIzaDEuMDFabS0zLjE4LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjUtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNi0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOFptLTQuNy0yLjk1aC0xLjAxbC0xLjE2LDQuMTMtMS4xOC00LjEzaC0xLjA1bDEuNyw1LjMxLS4wOC4zNmMtLjAyLjExLS4wNS4yLS4xLjI5LS4wNS4wOS0uMTEuMTYtLjE4LjIxLS4wOC4wNS0uMTcuMDgtLjI5LjA4LS4xNCwwLS4yNi0uMDItLjM3LS4wNS0uMTEtLjAzLS4xOS0uMDYtLjI1LS4wOS0uMDYtLjAzLS4wOS0uMDUtLjA5LS4wNWwuMTEuODZzLjA0LjAyLjExLjA1Yy4wNy4wMy4xNy4wNi4zLjA5LjEzLjAzLjI4LjA0LjQ2LjA0LjIyLDAsLjQtLjA0LjU1LS4xMi4xNS0uMDguMjctLjE5LjM3LS4zMi4xLS4xNC4xOC0uMy4yNS0uNDguMDctLjE4LjEzLS4zOC4yLS41OWwxLjcyLTUuNThoMFptLTUuMDgsNS4zM3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjEyLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS02LjE5LTMuMDloLTIuMjVzMC0uMDUsMC0uMTNjMC0uMDguMDEtLjE4LjAzLS4zLjAyLS4xMi4wNS0uMjUuMS0uMzguMDUtLjEzLjExLS4yNi4yLS4zNy4wOS0uMTIuMi0uMjEuMzQtLjI4LjE0LS4wNy4zMS0uMS41MS0uMDkuMTgsMCwuMzQuMDUuNDYuMTIuMTMuMDcuMjMuMTcuMzEuMjkuMDguMTIuMTQuMjQuMTguMzcuMDQuMTMuMDcuMjUuMDkuMzcuMDIuMTIuMDMuMjEuMDMuMjksMCwuMDgsMCwuMTIsMCwuMTNoMFptMS4wMy43MXYtLjNjMC0uMTQsMC0uMy0uMDItLjQ5LS4wMS0uMTktLjA1LS4zOS0uMDktLjYtLjA1LS4yMS0uMTItLjQxLS4yMS0uNjEtLjA5LS4yLS4yMi0uMzgtLjM3LS41NC0uMTUtLjE2LS4zNS0uMjktLjU4LS4zOS0uMjMtLjEtLjUxLS4xNC0uODMtLjE0LS4zMywwLS42Mi4wNS0uODYuMTQtLjI0LjA5LS40NS4yMi0uNjIuMzgtLjE3LjE2LS4zMS4zNC0uNDEuNTQtLjExLjItLjE5LjQtLjI1LjYyLS4wNi4yMS0uMS40Mi0uMTIuNjEtLjAyLjItLjAzLjM4LS4wMy41MywwLC4xNSwwLC4zMi4wMy41MS4wMi4xOS4wNi4zOC4xMi41OC4wNi4yLjE1LjQuMjYuNTkuMTIuMTkuMjcuMzYuNDYuNTIuMTkuMTUuNDIuMjguNy4zNi4yOC4wOS42MS4xNC45OS4xNC4yNSwwLC40Ny0uMDIuNjYtLjA2LjE5LS4wNC4zNS0uMDguNDgtLjEzLjEzLS4wNS4yMy0uMDkuMy0uMTMuMDctLjA0LjExLS4wNy4xMy0uMDhsLjE1LS45NHMtLjA2LjA0LS4xMi4wOWMtLjA3LjA1LS4xNi4xLS4yOS4xNi0uMTIuMDYtLjI4LjExLS40Ny4xNS0uMTkuMDQtLjQxLjA2LS42Ni4wNS0uMywwLS41NS0uMDUtLjc1LS4xMy0uMi0uMDgtLjM2LS4xOC0uNDgtLjMtLjEyLS4xMi0uMjEtLjI1LS4yNi0uMzgtLjA2LS4xMy0uMS0uMjYtLjExLS4zNy0uMDItLjExLS4wMy0uMi0uMDItLjI2di0uMTNoMy4yOFptLTYuMzEtMi4zNWMwLC4yMy0uMDIuNDMtLjA3LjYtLjA1LjE2LS4xMi4zLS4yMi40Mi0uMDguMTEtLjE4LjE5LS4yNy4yNS0uMS4wNi0uMTkuMTEtLjI5LjEzLS4wOS4wMy0uMTguMDUtLjI1LjA1LS4wNywwLS4xMi4wMS0uMTUuMDFoLTEuMDl2LTIuOTZoMS4wOWMuMDgsMCwuMTcsMCwuMjcuMDIuMTEuMDIuMjIuMDUuMzMuMS4xMS4wNS4yMi4xMy4zMi4yNC4xLjExLjE4LjI2LjI0LjQ0LjA2LjE4LjA5LjQyLjA5LjdoMFptMS4yNCwwYzAtLjM5LS4wNS0uNzMtLjE0LTEuMDEtLjA5LS4yOC0uMjItLjUyLS4zOC0uNzEtLjE2LS4xOS0uMzUtLjM0LS41Ni0uNDUtLjIxLS4xMS0uNDUtLjE5LS42OS0uMjQtLjI1LS4wNS0uNS0uMDctLjc3LS4wN2gtMi4yM3Y3LjJoMS4ydi0yLjI5aDEuMDdjLjIxLDAsLjQyLS4wMS42NC0uMDQuMjEtLjAzLjQyLS4wOS42My0uMTguMjEtLjA5LjQxLS4yMy42LS40Mi4yLS4xOC4zNS0uNDMuNDYtLjczLjExLS4zLjE3LS42Ni4xNy0xLjA2aDBabTU1LjU0LDMuMTRjMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xMy4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOS0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDctLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOC45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMi0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzEtLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDcuMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM4LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzktLjQxdi4zMWMwLC4wNSwwLC4xLDAsLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS00LjE3LTQuMjRsLS4xNS0uOTdjLS4wNS0uMDMtLjA5LS4wNi0uMTMtLjA4LS4wNC0uMDItLjA3LS4wNC0uMS0uMDUtLjAzLS4wMS0uMDctLjAzLS4xMi0uMDQtLjA2LS4wMS0uMTEtLjAyLS4xNS0uMDMtLjA0LDAtLjA5LDAtLjE0LDAtLjA5LDAtLjE3LDAtLjI1LjAxLS4wOC4wMS0uMTYuMDMtLjI0LjA3LS4wOC4wMy0uMTUuMDgtLjIyLjE1LS4wOC4wOC0uMTUuMTUtLjIuMjMtLjA1LjA4LS4wOS4xNS0uMTIuMjEtLjAzLjA2LS4wNS4xMS0uMDYuMTR2LS43MmgtMS4wNHY1LjMzaDEuMDR2LTMuMDNjMC0uMDksMC0uMTksMC0uMzEsMC0uMTEuMDItLjIzLjA0LS4zNS4wMy0uMTIuMDctLjI0LjEyLS4zNi4wNi0uMS4xMi0uMTguMjEtLjI2LjA4LS4wOC4xOC0uMTQuMjktLjE4LjExLS4wNC4yNC0uMDcuMzgtLjA3LjE3LDAsLjMzLjAzLjQ2LjA5LjEzLjA2LjI2LjEzLjM3LjIzaDBabS01LjE1LDIuNjVjMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xNC4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOC0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDctLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOS45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMi0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzEtLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDcuMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM5LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzgtLjQxdi4zMWMwLC4wNSwwLC4xLjAxLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS01LjgzLjQ1YzAsLjEyLS4wMy4yMy0uMS4zMi0uMDcuMDktLjE2LjE2LS4yNy4yMi0uMTEuMDYtLjI0LjEtLjM3LjEzLS4xMy4wMy0uMjcuMDQtLjQuMDQtLjI2LDAtLjQ4LS4wMy0uNjctLjA5LS4xOS0uMDYtLjMzLS4xNS0uNDQtLjI1LS4xLS4xMS0uMTUtLjI0LS4xNS0uMzksMC0uMS4wMi0uMTkuMDUtLjI4LjAzLS4wOC4wNy0uMTUuMTItLjIxLjA1LS4wNi4wOS0uMS4xMi0uMTMuMDQtLjAzLjA1LS4wNS4wNi0uMDVoLjkxYy4yMywwLC40Mi4wMy41Ny4wNy4xNS4wNC4yNi4wOS4zNS4xNi4wOC4wNy4xNC4xNC4xOC4yMi4wMy4wOC4wNS4xNi4wNS4yNWgwWm0tLjEzLTQuMDNjMCwuMjQtLjA0LjQ0LS4xMi42MS0uMDguMTctLjIuMy0uMzYuMzktLjE2LjA5LS4zNi4xNC0uNi4xNC0uMiwwLS4zNy0uMDUtLjUyLS4xNS0uMTQtLjEtLjI1LS4yMy0uMzItLjQtLjA3LS4xNy0uMTEtLjM3LS4xMS0uNTlzLjA0LS40NC4xMS0uNmMuMDctLjE2LjE4LS4yOS4zMy0uMzcuMTUtLjA4LjMzLS4xMy41Ni0uMTIuMTksMCwuMzYuMDQuNDkuMS4xMy4wNi4yNC4xNS4zMi4yNS4wOC4xLjE0LjIyLjE3LjM1LjA0LjEzLjA1LjI2LjA1LjM5aDBabTEuMTcsMy45OGMwLS41LS4xNy0uODYtLjUzLTEuMS0uMzYtLjI0LS44OS0uMzYtMS41OS0uMzUtLjA4LDAtLjE3LDAtLjI4LDAtLjExLDAtLjIyLDAtLjM0LDAtLjEyLDAtLjIyLS4wMi0uMzItLjA0LS4xLS4wMi0uMTgtLjA1LS4yNC0uMS0uMDYtLjA1LS4wOS0uMTEtLjEtLjE5LDAtLjA5LjAzLS4xNi4xLS4yMS4wNi0uMDUuMTUtLjA4LjI2LS4xLjExLS4wMi4yNC0uMDMuMzgtLjAzLjE0LDAsLjI5LDAsLjQ2LDAsLjQ0LDAsLjgyLS4wOCwxLjEzLS4yMy4zMS0uMTUuNTQtLjM2LjcxLS42NS4xNi0uMjguMjQtLjYyLjI0LTEuMDF2LTEuNzNoLS41M3MtLjA5LDAtLjEzLDBjLS4wNSwwLS4wOS4wMS0uMTQuMDMtLjA1LjAyLS4wOS4wNi0uMTMuMTEtLjA0LjA1LS4wNi4xMS0uMDcuMTcsMCwuMDYtLjAxLjExLDAsLjE1di4wN3MtLjAxLS4wMi0uMDQtLjA2Yy0uMDMtLjA0LS4wNy0uMDktLjE0LS4xNS0uMDctLjA2LS4xNS0uMTItLjI2LS4xOC0uMTEtLjA2LS4yNC0uMTEtLjM5LS4xNi0uMTYtLjA0LS4zNC0uMDYtLjU1LS4wNi0uMTQsMC0uMjguMDEtLjQzLjA1LS4xNS4wMy0uMy4wOS0uNDUuMTctLjE1LjA4LS4yOC4xOS0uNC4zMy0uMTIuMTQtLjIxLjMxLS4yOC41Mi0uMDcuMjEtLjEuNDYtLjEuNzYsMCwuMi4wMy4zOC4wOC41NC4wNS4xNi4xMi4yOS4xOS40LjA4LjExLjE1LjIuMjMuMjcuMDguMDcuMTQuMTMuMTkuMTYuMDUuMDMuMDguMDUuMDguMDUsMCwwLS4wNCwwLS4xLjAxLS4wNy4wMS0uMTUuMDMtLjI0LjA3LS4xLjAzLS4xOS4wOC0uMjkuMTUtLjEuMDctLjE4LjE2LS4yNC4yNy0uMDYuMTEtLjEuMjYtLjEuNDMsMCwuMTMsMCwuMjQuMDQuMzMuMDMuMDkuMDguMTcuMTQuMjMuMDYuMDYuMTIuMTEuMTkuMTQuMDcuMDQuMTMuMDYuMi4wOCwwLDAtLjAyLjAxLS4wNi4wNC0uMDQuMDItLjA5LjA2LS4xNC4xMS0uMDYuMDUtLjExLjEyLS4xNy4yLS4wNi4wOC0uMS4xOC0uMTQuMjktLjA0LjExLS4wNi4yNC0uMDYuMzksMCwuMjYuMDkuNDguMjYuNjguMTcuMi40Mi4zNS43NC40Ny4zMy4xMS43My4xNywxLjIuMTcuMjksMCwuNTctLjAzLjgyLS4wOS4yNi0uMDYuNDktLjE1LjY5LS4yNy4yLS4xMi4zNi0uMjguNDgtLjQ3LjEyLS4xOS4xOC0uNDEuMi0uNjdoMFptLTYuMjUuMDVjMCwuMTItLjAzLjIzLS4xLjMyLS4wNy4wOS0uMTYuMTYtLjI3LjIyLS4xMS4wNi0uMjQuMS0uMzcuMTMtLjE0LjAzLS4yNy4wNC0uNC4wNC0uMjYsMC0uNDgtLjAzLS42Ny0uMDktLjE5LS4wNi0uMzMtLjE1LS40NC0uMjUtLjEtLjExLS4xNS0uMjQtLjE1LS4zOSwwLS4xLjAyLS4xOS4wNi0uMjguMDMtLjA4LjA3LS4xNS4xMi0uMjEuMDUtLjA2LjA5LS4xLjEyLS4xMy4wNC0uMDMuMDUtLjA1LjA1LS4wNWguOTFjLjIzLDAsLjQyLjAzLjU3LjA3LjE1LjA0LjI2LjA5LjM1LjE2LjA4LjA3LjE0LjE0LjE4LjIyLjAzLjA4LjA1LjE2LjA1LjI1aDBabS0uMTMtNC4wM2MwLC4yNC0uMDQuNDQtLjEyLjYxLS4wOC4xNy0uMi4zLS4zNi4zOS0uMTYuMDktLjM2LjE0LS41OS4xNC0uMiwwLS4zNy0uMDUtLjUyLS4xNS0uMTQtLjEtLjI1LS4yMy0uMzItLjQtLjA3LS4xNy0uMTEtLjM3LS4xMS0uNTlzLjA0LS40NC4xMS0uNmMuMDctLjE2LjE4LS4yOS4zMy0uMzcuMTUtLjA4LjMzLS4xMy41Ni0uMTIuMiwwLC4zNi4wNC40OS4xLjEzLjA2LjI0LjE1LjMyLjI1LjA4LjEuMTQuMjIuMTcuMzUuMDQuMTMuMDUuMjYuMDUuMzloMFptMS4xNywzLjk4YzAtLjUtLjE3LS44Ni0uNTMtMS4xLS4zNi0uMjQtLjg5LS4zNi0xLjU5LS4zNS0uMDgsMC0uMTcsMC0uMjgsMC0uMTEsMC0uMjIsMC0uMzQsMC0uMTIsMC0uMjItLjAyLS4zMi0uMDQtLjEtLjAyLS4xOC0uMDUtLjI0LS4xLS4wNi0uMDUtLjA5LS4xMS0uMS0uMTksMC0uMDkuMDMtLjE2LjEtLjIxLjA2LS4wNS4xNS0uMDguMjYtLjEuMTEtLjAyLjI0LS4wMy4zOC0uMDMuMTQsMCwuMjksMCwuNDYsMCwuNDQsMCwuODItLjA4LDEuMTMtLjIzLjMxLS4xNS41NC0uMzYuNzEtLjY1LjE2LS4yOC4yNC0uNjIuMjQtMS4wMXYtMS43M2gtLjUzcy0uMDksMC0uMTMsMGMtLjA1LDAtLjA5LjAxLS4xNC4wMy0uMDUuMDItLjA5LjA2LS4xNC4xMS0uMDQuMDUtLjA2LjExLS4wNy4xNywwLC4wNi0uMDEuMTEtLjAxLjE1di4wN3MtLjAxLS4wMi0uMDQtLjA2Yy0uMDMtLjA0LS4wNy0uMDktLjE0LS4xNS0uMDctLjA2LS4xNS0uMTItLjI2LS4xOC0uMTEtLjA2LS4yNC0uMTEtLjQtLjE2LS4xNi0uMDQtLjM0LS4wNi0uNTUtLjA2LS4xNCwwLS4yOC4wMS0uNDMuMDUtLjE1LjAzLS4zLjA5LS40NS4xNy0uMTUuMDgtLjI4LjE5LS40LjMzLS4xMi4xNC0uMjEuMzEtLjI4LjUyLS4wNy4yMS0uMS40Ni0uMS43NiwwLC4yLjAzLjM4LjA4LjU0LjA1LjE2LjEyLjI5LjE5LjQuMDguMTEuMTUuMi4yMy4yNy4wOC4wNy4xNC4xMy4xOS4xNi4wNS4wMy4wOC4wNS4wOC4wNSwwLDAtLjA0LDAtLjEuMDEtLjA3LjAxLS4xNS4wMy0uMjQuMDctLjEuMDMtLjE5LjA4LS4yOS4xNS0uMS4wNy0uMTguMTYtLjI0LjI3LS4wNi4xMS0uMS4yNi0uMS40MywwLC4xMywwLC4yNC4wNC4zMy4wMy4wOS4wOC4xNy4xNC4yMy4wNi4wNi4xMi4xMS4xOS4xNC4wNy4wNC4xMy4wNi4xOS4wOCwwLDAtLjAyLjAxLS4wNi4wNC0uMDQuMDItLjA4LjA2LS4xNC4xMS0uMDYuMDUtLjExLjEyLS4xNy4yLS4wNi4wOC0uMS4xOC0uMTQuMjktLjA0LjExLS4wNi4yNC0uMDYuMzksMCwuMjYuMDkuNDguMjYuNjhzLjQyLjM1Ljc0LjQ3Yy4zMy4xMS43My4xNywxLjIuMTcuMjksMCwuNTctLjAzLjgyLS4wOS4yNi0uMDYuNDktLjE1LjY5LS4yNy4yLS4xMi4zNi0uMjguNDgtLjQ3LjEyLS4xOS4xOC0uNDEuMi0uNjdoMFptLTQ2LjE4LS40di0zLjU4YzAtLjE2LDAtLjMyLS4wMi0uNDgtLjAyLS4xNi0uMDUtLjMxLS4xLS40NS0uMDUtLjE0LS4xMy0uMjgtLjIzLS40MS0uMTMtLjE5LS4zMS0uMzItLjUzLS40MS0uMjItLjA5LS40Ny0uMTMtLjc3LS4xMy0uMjMsMC0uNDMuMDQtLjYuMS0uMTcuMDYtLjMxLjE0LS40My4yMy0uMTIuMDktLjIuMTgtLjI3LjI3LS4wNi4wOS0uMTEuMTYtLjEzLjIxdi0uN2gtMS4wNHY1LjMzaDEuMDR2LTMuMjhjMC0uMTEsMC0uMjMuMDItLjM3LjAxLS4xMy4wNS0uMjYuMS0uMzkuMDUtLjEzLjEzLS4yNC4yNC0uMzUuMDktLjA4LjE5LS4xNS4zMS0uMTkuMTEtLjA1LjI1LS4wNy40MS0uMDcuMjMsMCwuNDEuMDQuNTUuMTEuMTMuMDcuMjMuMTcuMjkuMjkuMDYuMTIuMS4yNi4xMi40MS4wMi4xNS4wMi4zLjAyLjQ3djMuMzdoMS4wMlptLTYuMzUtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjEzLjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNy0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM2LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTItLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzkuMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTYuMjQtMS4yNmMtLjA1LjA2LS4xMS4xMy0uMTguMTgtLjA3LjA2LS4xNS4xMS0uMjQuMTYtLjExLjA1LS4yMi4wOS0uMzIuMTEtLjEuMDItLjIxLjAzLS4zMi4wMy0uMjEsMC0uMzktLjA1LS41NC0uMTUtLjE1LS4wOS0uMjYtLjIzLS4zNS0uNC0uMDktLjE3LS4xNS0uMzctLjItLjU5LS4wNC0uMjMtLjA2LS40Ny0uMDctLjc0LDAtLjE1LDAtLjMxLjAyLS40OS4wMS0uMTguMDQtLjM2LjA4LS41My4wNC0uMTguMS0uMzQuMTgtLjQ5LjA4LS4xNS4xOS0uMjcuMzMtLjM2LjE0LS4wOS4zMS0uMTQuNTItLjE0LjE5LDAsLjM0LjAzLjQ4LjA4LjEzLjA1LjI0LjEzLjMyLjIyLjA4LjA4LjEzLjE4LjE4LjI4LjA0LjEuMDcuMjEuMDguMzIuMDEuMTEuMDIuMjIuMDIuMzJ2Mi4xN2gwWm0xLjA0LDEuMjZ2LTcuMjNoLTEuMDR2Mi40cy0uMDEtLjAyLS4wNC0uMDZjLS4wMy0uMDQtLjA3LS4wOS0uMTItLjE1LS4wNi0uMDYtLjE0LS4xMi0uMjMtLjE4LS4xLS4wNi0uMjItLjExLS4zNi0uMTUtLjE0LS4wNC0uMzItLjA2LS41MS0uMDYtLjI4LDAtLjUyLjA1LS43My4xMy0uMjEuMDktLjM5LjIxLS41NC4zNi0uMTUuMTUtLjI4LjMyLS4zOC41MS0uMS4xOS0uMTguMzktLjI0LjYtLjA2LjIxLS4xLjQyLS4xMy42Mi0uMDMuMjEtLjA0LjQtLjA0LjU4LDAsLjI5LjAyLjU3LjA3Ljg0LjA1LjI3LjEyLjUyLjIxLjc1LjEuMjMuMjMuNDMuMzkuNi4xNi4xNy4zNS4zLjU3LjQuMjMuMDkuNDkuMTQuNzkuMTMuMTksMCwuMzYtLjAzLjUyLS4wOC4xNS0uMDUuMy0uMTIuNDMtLjIxLjEzLS4wOS4yNy0uMi4zOS0uMzJ2LjUzaC45OVptLTYuNDYtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjE0LjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTMtLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDcuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzguMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTYuMTQtMi4xNWMwLC4xOS0uMDIuMzYtLjA3LjQ5LS4wNS4xMy0uMTIuMjQtLjIxLjMzLS4xMS4xMS0uMjQuMTgtLjM4LjIyLS4xNC4wNC0uMjkuMDctLjQ0LjA3LS4xNSwwLS4yOSwwLS40MiwwaC0xLjAzdi0yLjIxaDEuMDNjLjE2LDAsLjMyLDAsLjQ4LjAyLjE2LjAxLjMuMDQuNDQuMDkuMTMuMDUuMjUuMTIuMzQuMjIuMDguMDkuMTUuMi4xOS4zMy4wNS4xMi4wNy4yNy4wNy40NGgwWm0tLjI2LTMuMDZjMCwuMi0uMDQuMzctLjEuNS0uMDcuMTMtLjE1LjIzLS4yNi4zLS4xLjA4LS4yMS4xMy0uMzMuMTYtLjExLjAzLS4yMi4wNS0uMzEuMDYtLjEsMC0uMTcuMDEtLjIyLDBoLTEuMDd2LTIuMDVoMS4wN3MuMSwwLC4xNywwYy4wNywwLC4xNS4wMS4yNC4wMi4wOC4wMS4xNy4wMy4yNS4wNi4wOC4wMy4xNS4wNy4yLjEyLjEyLjA5LjIxLjIuMjcuMzMuMDYuMTMuMDkuMjkuMDkuNDhoMFptMS41LDMuMDRjMC0uMTQtLjAxLS4yNy0uMDQtLjQxLS4wMy0uMTQtLjA4LS4yNy0uMTUtLjM5LS4wNy0uMTMtLjE2LS4yNC0uMjgtLjM1LS4xNC0uMTMtLjMtLjIzLS40Ny0uMjktLjE3LS4wNy0uMzUtLjExLS41Mi0uMTQuMTItLjA0LjIzLS4wOS4zNS0uMTUuMTItLjA2LjIyLS4xMy4zMi0uMi4xLS4wOC4xOC0uMTYuMjUtLjI2LjA4LS4xNC4xNS0uMjkuMi0uNDcuMDUtLjE4LjA4LS4zOC4wOC0uNjEsMC0uMjYtLjA0LS41LS4xMy0uNy0uMDgtLjItLjItLjM3LS4zNC0uNTEtLjE0LS4xNC0uMy0uMjQtLjQ4LS4zMi0uMjItLjEtLjQ2LS4xNy0uNy0uMi0uMjQtLjAzLS41MS0uMDUtLjc5LS4wNWgtMi4yN3Y3LjJoMi4yNWMuMTcsMCwuMzYsMCwuNTUtLjAxLjE5LS4wMS4zOC0uMDMuNTctLjA3LjE5LS4wNC4zNy0uMS41NS0uMTcuMTctLjA4LjMzLS4xOC40Ny0uMzEuMTUtLjE2LjI3LS4zMi4zNi0uNS4wOS0uMTguMTQtLjM2LjE4LS41NS4wMy0uMTkuMDUtLjM3LjA1LS41NmgwWm0xMTIuNDksMi4xN3YtMy41OGMwLS4xNiwwLS4zMi0uMDItLjQ4LS4wMi0uMTYtLjA1LS4zMS0uMS0uNDUtLjA1LS4xNC0uMTMtLjI4LS4yMy0uNDEtLjEzLS4xOS0uMzEtLjMyLS41My0uNDEtLjIyLS4wOS0uNDctLjEzLS43Ny0uMTMtLjIzLDAtLjQzLjA0LS42LjEtLjE3LjA2LS4zMS4xNC0uNDMuMjMtLjExLjA5LS4yLjE4LS4yNy4yNy0uMDYuMDktLjExLjE2LS4xMy4yMXYtLjdoLTEuMDR2NS4zM2gxLjA0di0zLjI4YzAtLjExLDAtLjIzLjAyLS4zNy4wMS0uMTMuMDUtLjI2LjEtLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA5LS4wOC4xOS0uMTUuMzEtLjE5LjExLS4wNS4yNS0uMDcuNDEtLjA3LjIzLDAsLjQxLjA0LjU1LjExLjEzLjA3LjIzLjE3LjI5LjI5LjA2LjEyLjEuMjYuMTIuNDEuMDIuMTUuMDIuMy4wMi40N3YzLjM3aDEuMDJabS01LjM3LDB2LTUuMzNoLTEuMDN2NS4zM2gxLjAzWm0uMDktNi43YzAtLjEtLjAzLS4yLS4wOC0uMjctLjA1LS4wOC0uMTItLjE0LS4yMi0uMTgtLjA5LS4wNC0uMi0uMDctLjMxLS4wNy0uMTIsMC0uMjIuMDMtLjMxLjA4LS4wOS4wNS0uMTYuMTEtLjIxLjE5LS4wNS4wOC0uMDguMTYtLjA4LjI1LDAsLjEuMDIuMi4wNy4yOC4wNS4wOC4xMS4xNS4yLjE5LjA5LjA1LjIuMDcuMzQuMDcuMTIsMCwuMjMtLjAzLjMyLS4wNy4wOS0uMDUuMTYtLjExLjIxLS4xOS4wNS0uMDguMDgtLjE4LjA4LS4yOGgwWm0tMi4zNCw2Ljd2LTMuNTZjMC0uMTIsMC0uMjYtLjAyLS40MS0uMDEtLjE1LS4wNC0uMy0uMDgtLjQ0LS4wNC0uMTUtLjExLS4yOS0uMTktLjQzLS4wOC0uMTQtLjItLjI1LS4zNC0uMzYtLjEzLS4wOS0uMjgtLjE2LS40NC0uMi0uMTYtLjA0LS4zMS0uMDYtLjQ3LS4wNi0uMjEsMC0uNC4wMy0uNTYuMDktLjE2LjA2LS4zLjEyLS40Mi4yMS0uMTIuMDgtLjIxLjE3LS4yOS4yNS0uMDguMDktLjEzLjE2LS4xNy4yMy0uMDQuMDctLjA2LjExLS4wNy4xMiwwLS4wMy0uMDItLjA4LS4wNS0uMTUtLjAzLS4wNy0uMDgtLjE1LS4xNS0uMjQtLjA2LS4wOS0uMTUtLjE3LS4yNi0uMjUtLjA5LS4wNi0uMTktLjExLS4zLS4xNS0uMTEtLjA0LS4yMS0uMDctLjMyLS4wOC0uMTEtLjAyLS4yMS0uMDItLjMtLjAyLS4yMiwwLS40Mi4wMy0uNTguMDktLjE3LjA2LS4zLjEzLS40Mi4yMi0uMTEuMDktLjIuMTgtLjI3LjI4LS4wNy4wOS0uMTEuMTgtLjEzLjI1di0uNzJoLTEuMDN2NS4zM2gxLjAzdi0zLjI3YzAtLjIyLjAyLS40LjA1LS41NS4wMy0uMTQuMDgtLjI2LjE0LS4zNS4wNS0uMDkuMTItLjE2LjE4LS4yMi4wOC0uMDguMTYtLjEzLjI2LS4xOC4xLS4wNC4yMS0uMDcuMzQtLjA3LjE2LDAsLjI5LjAyLjM4LjA2LjEuMDQuMTguMDguMjQuMTUuMDguMDcuMTQuMTUuMTkuMjUuMDUuMDkuMDguMjEuMS4zNC4wMi4xMy4wMy4yOS4wMy40N3YzLjM3aDEuMDF2LTMuMjdjMC0uMTIsMC0uMjUuMDEtLjM4LjAxLS4xMy4wNC0uMjYuMDktLjM5LjA1LS4xMy4xMy0uMjQuMjQtLjM1LjA4LS4wOC4xOC0uMTQuMjktLjE4LjEtLjA0LjIxLS4wNi4zMy0uMDYuMTMsMCwuMjQuMDEuMzUuMDQuMS4wMy4yLjA4LjI5LjE2LjA3LjA3LjEzLjE0LjE2LjIxLjA0LjA3LjA2LjEyLjA3LjE2LjAxLjA1LjAzLjExLjA0LjE4LjAxLjA3LjAyLjE2LjAzLjI0LDAsLjA5LjAxLjE4LjAxLjI3djMuMzdoMS4wMVptLTkuMTItMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIxLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjEzLjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE4Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTItLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMi0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wOC4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzguMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOS0uNDF2LjMxYzAsLjA1LDAsLjEuMDEuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptLTUuMDMtMi42MnYtNC41OGgtMS4ydjQuNThjMCwuMTYsMCwuMzMtLjAxLjUsMCwuMTctLjAzLjM0LS4wNy40OS0uMDMuMTYtLjA5LjMtLjE2LjQzLS4xLjE1LS4yMy4yNy0uMzkuMzUtLjE2LjA4LS4zNS4xMi0uNTYuMTItLjE2LDAtLjMxLS4wMi0uNDQtLjA1LS4xNC0uMDMtLjI2LS4wNy0uMzctLjExLS4xLS4wNC0uMTktLjA4LS4yNS0uMTEtLjA2LS4wMy0uMDktLjA1LS4xLS4wNmwuMjYsMS4wNHMuMDMuMDEuMDguMDRjLjA1LjAzLjEyLjA2LjIyLjA5LjEuMDMuMjIuMDcuMzUuMDkuMTQuMDMuMjkuMDQuNDcuMDQuMDcsMCwuMTYsMCwuMjgsMCwuMTIsMCwuMjUtLjAzLjM5LS4wNi4xNC0uMDMuMjgtLjA4LjQzLS4xNS4xNC0uMDcuMjctLjE2LjM5LS4yNy4xMi0uMTEuMjMtLjI0LjMxLS4zOC4wOS0uMTQuMTYtLjMuMjItLjQ5LjA2LS4xOC4xLS40LjEyLS42NS4wMy0uMjUuMDQtLjU0LjA0LS44N2gwWm0zMS4xNiwyLjYydi0zLjU4YzAtLjE2LDAtLjMyLS4wMi0uNDgtLjAyLS4xNi0uMDUtLjMxLS4xLS40NS0uMDUtLjE0LS4xMy0uMjgtLjIzLS40MS0uMTMtLjE5LS4zMS0uMzItLjUzLS40MS0uMjItLjA5LS40Ny0uMTMtLjc3LS4xMy0uMjMsMC0uNDMuMDQtLjYuMS0uMTcuMDYtLjMxLjE0LS40My4yMy0uMTEuMDktLjIuMTgtLjI3LjI3LS4wNi4wOS0uMTEuMTYtLjEzLjIxdi0uN2gtMS4wNHY1LjMzaDEuMDR2LTMuMjhjMC0uMTEsMC0uMjMuMDItLjM3LjAxLS4xMy4wNS0uMjYuMS0uMzkuMDUtLjEzLjEzLS4yNC4yNC0uMzUuMDktLjA4LjE5LS4xNS4zMS0uMTkuMTEtLjA1LjI1LS4wNy40MS0uMDcuMjMsMCwuNDEuMDQuNTUuMTEuMTMuMDcuMjMuMTcuMjkuMjkuMDYuMTIuMS4yNi4xMi40MS4wMi4xNS4wMi4zLjAyLjQ3djMuMzdoMS4wMlptLTYuMzUtMS41OWMwLC4xMy0uMDMuMjUtLjA5LjM0LS4wNi4xLS4xNC4xOS0uMjQuMjYtLjEuMDctLjIyLjEzLS4zNC4xOC0uMDcuMDMtLjE0LjA1LS4yMS4wNi0uMDcuMDEtLjE0LjAyLS4xOS4wMi0uMTcsMC0uMzMtLjAzLS40Ny0uMDktLjE0LS4wNi0uMjUtLjE2LS4zMy0uMjktLjA4LS4xMy0uMTMtLjMtLjEzLS41LDAtLjA1LDAtLjExLDAtLjE2LDAtLjA2LjAyLS4xMS4wMy0uMTYuMDUtLjE2LjE0LS4yOS4yNy0uNC4xMy0uMS4yOC0uMTguNDctLjIyLjE5LS4wNS40LS4wNy42NC0uMDcuMTEsMCwuMjEsMCwuMjkuMDEuMDksMCwuMTYuMDIuMjEuMDMuMDUsMCwuMDguMDEuMDguMDJ2Ljk3aDBabTEuMDQsMS41OXYtMy41YzAtLjIzLS4wMS0uNDMtLjA0LS42LS4wMy0uMTctLjA3LS4zMi0uMTQtLjQ1LS4wNi0uMTMtLjE2LS4yNi0uMjgtLjM4LS4xNi0uMTYtLjM3LS4yOS0uNjMtLjM5LS4yNy0uMS0uNTktLjE1LS45OC0uMTUtLjIzLDAtLjQzLjAyLS42MS4wNi0uMTcuMDMtLjMyLjA4LS40NC4xMi0uMTIuMDUtLjIxLjA5LS4yNy4xMi0uMDYuMDQtLjA5LjA1LS4wOS4wNWwtLjE5Ljk0cy4wMy0uMDMuMDktLjA3Yy4wNi0uMDUuMTQtLjEuMjYtLjE2LjEyLS4wNi4yNi0uMTIuNDMtLjE3LjE3LS4wNS4zNy0uMDguNTktLjA4LjI4LDAsLjUxLjAzLjY4LjA5LjE3LjA2LjMuMTQuMzcuMjUuMDcuMDkuMTIuMTguMTQuMjcuMDMuMDkuMDQuMTguMDQuMjcsMCwuMDksMCwuMTYsMCwuMjN2LjI3cy0uMDMsMC0uMDgtLjAxYy0uMDUsMC0uMTMtLjAxLS4yMi0uMDItLjA5LDAtLjItLjAxLS4zMS0uMDEtLjIsMC0uNDEuMDEtLjYxLjA0LS4yMS4wMy0uNC4wNy0uNTkuMTQtLjE5LjA2LS4zNy4xNS0uNTMuMjYtLjE2LjExLS4zLjI0LS40MS40LS4wOS4xMy0uMTYuMjYtLjIuMzktLjA1LjEzLS4wNy4yNC0uMDkuMzUtLjAyLjExLS4wMi4xOS0uMDIuMjYsMCwuMTEuMDEuMjMuMDQuMzcuMDMuMTQuMDcuMjcuMTQuNDEuMDYuMTQuMTUuMjcuMjcuMzguMTIuMTIuMjYuMjEuNDQuMjkuMTcuMDguMzkuMTIuNjMuMTMuMjYsMCwuNS0uMDIuNy0uMDkuMjEtLjA2LjM5LS4xNS41NC0uMjcuMTUtLjEyLjI4LS4yNi4zOC0uNDF2LjMxYzAsLjA1LDAsLjEsMCwuMTUsMCwuMDUuMDMuMS4wNy4xNC4wMy4wMy4wNy4wNS4xMi4wNy4wNS4wMS4wOS4wMi4xMy4wMi4wNCwwLC4wNywwLC4wOSwwaC41NlptMzIuNTEsMHYtNy4yM2gtMS4wMXY3LjIzaDEuMDFabS0zLjM1LTEuNTljMCwuMTMtLjAzLjI1LS4wOS4zNC0uMDYuMS0uMTQuMTktLjI0LjI2LS4xLjA3LS4yMS4xMy0uMzQuMTgtLjA3LjAzLS4xNC4wNS0uMjEuMDYtLjA3LjAxLS4xNC4wMi0uMTkuMDItLjE3LDAtLjMzLS4wMy0uNDctLjA5LS4xNC0uMDYtLjI1LS4xNi0uMzMtLjI5LS4wOC0uMTMtLjEzLS4zLS4xMy0uNSwwLS4wNSwwLS4xMSwwLS4xNiwwLS4wNi4wMi0uMTEuMDMtLjE2LjA1LS4xNi4xNC0uMjkuMjctLjQuMTMtLjEuMjgtLjE4LjQ3LS4yMi4xOS0uMDUuNC0uMDcuNjQtLjA3LjExLDAsLjIxLDAsLjI5LjAxLjA5LDAsLjE2LjAyLjIxLjAzLjA1LDAsLjA4LjAxLjA4LjAydi45N2gwWm0xLjA0LDEuNTl2LTMuNWMwLS4yMy0uMDEtLjQzLS4wNC0uNi0uMDMtLjE3LS4wNy0uMzItLjE0LS40NS0uMDYtLjEzLS4xNi0uMjYtLjI4LS4zOC0uMTYtLjE2LS4zNy0uMjktLjYzLS4zOS0uMjctLjEtLjU5LS4xNS0uOTgtLjE1LS4yMywwLS40My4wMi0uNjEuMDYtLjE3LjAzLS4zMi4wOC0uNDQuMTItLjEyLjA1LS4yMS4wOS0uMjcuMTItLjA2LjA0LS4wOS4wNS0uMDkuMDVsLS4xOS45NHMuMDMtLjAzLjA5LS4wN2MuMDYtLjA1LjE0LS4xLjI2LS4xNi4xMS0uMDYuMjYtLjEyLjQzLS4xNy4xNy0uMDUuMzctLjA4LjU5LS4wOC4yOCwwLC41MS4wMy42OC4wOS4xNy4wNi4zLjE0LjM3LjI1LjA3LjA5LjEyLjE4LjE0LjI3LjAzLjA5LjA0LjE4LjA0LjI3LDAsLjA5LDAsLjE2LDAsLjIzdi4yN3MtLjAzLDAtLjA4LS4wMWMtLjA1LDAtLjEzLS4wMS0uMjItLjAyLS4wOSwwLS4yLS4wMS0uMzItLjAxLS4yLDAtLjQxLjAxLS42MS4wNC0uMjEuMDMtLjQuMDctLjU5LjE0LS4xOS4wNi0uMzcuMTUtLjUzLjI2LS4xNi4xMS0uMy4yNC0uNDEuNC0uMDkuMTMtLjE2LjI2LS4yLjM5LS4wNS4xMy0uMDguMjQtLjA5LjM1LS4wMi4xMS0uMDIuMTktLjAyLjI2LDAsLjExLjAxLjIzLjA0LjM3LjAzLjE0LjA3LjI3LjE0LjQxLjA2LjE0LjE1LjI3LjI3LjM4LjEyLjEyLjI2LjIxLjQ0LjI5LjE3LjA4LjM5LjEyLjYzLjEzLjI2LDAsLjUtLjAyLjctLjA5LjIxLS4wNi4zOS0uMTUuNTQtLjI3LjE1LS4xMi4yOC0uMjYuMzktLjQxdi4zMWMwLC4wNSwwLC4xLDAsLjE1LDAsLjA1LjAzLjEuMDcuMTQuMDMuMDMuMDcuMDUuMTIuMDcuMDUuMDEuMDkuMDIuMTMuMDIuMDQsMCwuMDcsMCwuMDksMGguNTZabS01LjE1LDB2LTUuMzNoLTEuMDN2NS4zM2gxLjAzWm0uMDktNi43YzAtLjEtLjAzLS4yLS4wOC0uMjctLjA1LS4wOC0uMTItLjE0LS4yMi0uMTgtLjA5LS4wNC0uMi0uMDctLjMyLS4wNy0uMTIsMC0uMjIuMDMtLjMxLjA4LS4wOS4wNS0uMTYuMTEtLjIxLjE5LS4wNS4wOC0uMDguMTYtLjA4LjI1LDAsLjEuMDIuMi4wNy4yOC4wNS4wOC4xMS4xNS4yLjE5LjA5LjA1LjIuMDcuMzMuMDcuMTIsMCwuMjMtLjAzLjMyLS4wNy4wOS0uMDUuMTYtLjExLjIxLS4xOS4wNS0uMDguMDgtLjE4LjA4LS4yOGgwWm0tMi4xMiw1LjE5YzAtLjI2LS4wNi0uNDgtLjE3LS42Ny0uMTEtLjE5LS4yNi0uMzUtLjQ2LS40OC0uMTktLjEzLS40MS0uMjUtLjY1LS4zNS0uMTItLjA1LS4yNC0uMS0uMzctLjE2LS4xMi0uMDUtLjI0LS4xMi0uMzUtLjE5LS4xMS0uMDctLjE5LS4xNS0uMjYtLjI0LS4wNy0uMDktLjEtLjItLjEtLjMyLDAtLjIyLjA4LS4zOC4yMi0uNS4xNS0uMTEuMzUtLjE3LjYyLS4xNy4yMSwwLC40LjAyLjU2LjA1LjE2LjA0LjI5LjA5LjQuMTQuMTEuMDYuMTkuMS4yNC4xNS4wNS4wNC4wOC4wNi4wOC4wN2wtLjE1LS44OHMtLjAyLS4wMi0uMDctLjA2Yy0uMDUtLjA0LS4xMy0uMDgtLjIzLS4xMy0uMTEtLjA1LS4yNS0uMDktLjQyLS4xMi0uMTctLjAzLS4zOS0uMDUtLjY0LS4wNC0uMjMsMC0uNDUuMDMtLjY1LjA5LS4yLjA2LS4zOC4xNS0uNTMuMjgtLjE1LjEyLS4yNy4yNy0uMzYuNDUtLjA5LjE4LS4xMy4zOS0uMTMuNjIsMCwuMjQuMDUuNDUuMTMuNjIuMDguMTcuMTkuMzIuMzMuNDMuMTQuMTIuMjkuMjIuNDUuMzEuMTYuMDguMzMuMTYuNDkuMjMuMTYuMDcuMzIuMTUuNDUuMjIuMTQuMDguMjUuMTcuMzMuMjcuMDguMS4xMy4yMy4xMy4zOCwwLC4yNC0uMDguNDItLjIzLjU0LS4xNS4xMi0uMzguMTctLjcuMTctLjE5LDAtLjM3LS4wMy0uNTUtLjA4LS4xOC0uMDUtLjM0LS4xLS40OC0uMTctLjE0LS4wNi0uMjYtLjEyLS4zNC0uMTctLjA4LS4wNS0uMTMtLjA3LS4xMy0uMDhsLjE1LDEuMDFjLjA3LjA0LjE3LjA5LjI5LjE0LjEzLjA2LjMuMS41LjE0LjIuMDQuNDUuMDYuNzMuMDUuMjcsMCwuNTMtLjA0Ljc3LS4xMi4yNC0uMDguNDUtLjIuNjQtLjM2LjE0LS4xMi4yNi0uMjguMzQtLjQ2LjA4LS4xOS4xMy0uNDEuMTMtLjY2aDBabS01LjM3LTEuMTFjMCwuMzgtLjA0LjcxLS4xMi45OS0uMDguMjgtLjIxLjUtLjM3LjY2LS4xNy4xNi0uMzguMjQtLjY0LjI0LS4yOSwwLS41My0uMDctLjcxLS4yLS4xOC0uMTQtLjMyLS4zNC0uNC0uNjItLjA5LS4yOC0uMTMtLjY0LS4xMy0xLjA3LDAtLjI2LjAxLS41Mi4wNC0uNzYuMDMtLjI0LjA5LS40Ni4xOC0uNjUuMDktLjE5LjIxLS4zNC4zOC0uNDUuMTYtLjExLjM3LS4xNy42NC0uMTcuMjEsMCwuMzguMDUuNTIuMTMuMTQuMDguMjUuMTkuMzMuMzMuMDguMTQuMTQuMjkuMTguNDcuMDQuMTcuMDcuMzUuMDguNTQuMDEuMTkuMDIuMzguMDIuNTZoMFptMS4xLS4wMmMwLS4yOS0uMDItLjU4LS4wNy0uODUtLjA1LS4yNy0uMTItLjUzLS4yMy0uNzYtLjExLS4yMy0uMjQtLjQ0LS40Mi0uNjItLjE3LS4xOC0uMzktLjMyLS42NC0uNDItLjI1LS4xLS41NS0uMTUtLjktLjE2LS4zNCwwLS42NC4wNS0uOS4xNS0uMjYuMS0uNDguMjQtLjY2LjQxLS4xOC4xOC0uMzMuMzgtLjQ0LjYyLS4xMS4yNC0uMi40OS0uMjUuNzctLjA1LjI4LS4wOC41Ni0uMDguODYsMCwuNDEuMDQuNzguMTIsMS4xMS4wOC4zMy4yMS42Mi40Ljg2LjE4LjI0LjQyLjQyLjcyLjU1LjMuMTMuNjYuMTksMS4wOC4yLjM2LDAsLjY3LS4wNy45NS0uMjEuMjgtLjE0LjUyLS4zMy43MS0uNTguMTktLjI1LjM0LS41NC40NC0uODcuMS0uMzMuMTUtLjY4LjE1LTEuMDZoMFptLTUuMzIuNTZjMC0uMjMtLjA0LS40NC0uMS0uNjMtLjA3LS4xOS0uMTctLjM1LS4zLS41LS4xNC0uMTctLjI5LS4zMS0uNDctLjQzLS4xOC0uMTItLjM2LS4yMy0uNTUtLjMyLS4xOS0uMDktLjM4LS4xOC0uNTctLjI2LS4xOS0uMDgtLjM2LS4xNi0uNTItLjI1LS4xNi0uMDgtLjMtLjE4LS40MS0uMjgtLjA3LS4wNy0uMTItLjE0LS4xNi0uMi0uMDQtLjA2LS4wNy0uMTMtLjA4LS4yLS4wMi0uMDctLjAyLS4xNC0uMDItLjIyLDAtLjE0LjAzLS4yNy4wOS0uNC4wNi0uMTMuMTctLjI1LjMyLS4zNS4xLS4wNy4yMy0uMTIuNC0uMTUuMTYtLjAzLjM2LS4wNS42LS4wNS4xMiwwLC4yNCwwLC4zNi4wMy4xMi4wMi4yMy4wNC4zMy4wNi4xNS4wMy4yOC4wNy4zOC4xMS4xLjA0LjE4LjA3LjI0LjEuMDYuMDMuMDkuMDUuMTEuMDdsLS4yNC0xLjAzcy0uMDMtLjAyLS4wOS0uMDVjLS4wNi0uMDMtLjE1LS4wNi0uMjctLjEtLjEyLS4wMy0uMjgtLjA2LS40Ny0uMDktLjE5LS4wMy0uNDItLjA0LS42OS0uMDQtLjIxLDAtLjQxLjAyLS42Mi4wNS0uMi4wNC0uNC4xLS41OC4xOC0uMTkuMDgtLjM2LjItLjUyLjM0LS4xNC4xMi0uMjYuMjYtLjM0LjQtLjA5LjE0LS4xNS4yOS0uMTkuNDQtLjA0LjE1LS4wNi4zLS4wNi40NSwwLC4xNy4wMi4zNC4wNS41LjAzLjE2LjA5LjMxLjE3LjQ2LjEuMTYuMjEuMy4zNi40Mi4xNC4xMi4zMS4yMy40OC4zMi4xOC4wOS4zNi4xOS41NS4yNy4xOS4wOS4zOC4xOC41Ni4yOC4xOS4xLjM2LjIxLjUyLjM0LjEuMDguMTkuMTYuMjYuMjQuMDcuMDguMTIuMTcuMTYuMjcuMDMuMS4wNS4yMS4wNS4zNCwwLC4yLS4wNC4zNy0uMTIuNS0uMDguMTQtLjE5LjI2LS4zNS4zNi0uMDguMDYtLjE3LjEtLjI4LjEzLS4xMS4wMy0uMjIuMDYtLjMzLjA3LS4xMS4wMi0uMjEuMDItLjMuMDMtLjA5LDAtLjE1LDAtLjE4LDAtLjExLDAtLjIyLDAtLjMzLS4wMi0uMTEtLjAxLS4yMi0uMDMtLjMyLS4wNS0uMjItLjA0LS40MS0uMDktLjU2LS4xMy0uMTUtLjA0LS4yNy0uMDgtLjM0LS4xMS0uMDgtLjAzLS4xMi0uMDQtLjEzLS4wNWwuMjYsMS4wMXMuMDQuMDIuMS4wNWMuMDYuMDMuMTYuMDcuMjkuMTEuMTMuMDQuMy4wOC41MS4xMS4yMS4wMy40NS4wNS43NC4wNS4yMiwwLC40NS0uMDIuNjktLjA1LjI0LS4wNC40Ny0uMS43LS4xOS4yMy0uMDkuNDMtLjIyLjYxLS4zOS4xOC0uMTYuMzMtLjM3LjQ0LS42My4xMS0uMjUuMTYtLjU2LjE3LS45MloiLz4KICAgICAgPGc+CiAgICAgICAgPGc+CiAgICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJtMi41MiwxNS4wNGMuNDQtMy4wNSwzLjUtMy44OCwzLjc5LTYuNjYtMS4zOC42MS0zLjAzLjQyLTQuMjQtLjU4LTEuMzQsMi40MS0xLjQxLDQuNzguNDUsNy4yNFoiLz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJtOC40Myw2LjE5YzEuNTYtLjIzLDIuOS0xLjMzLDQuMTgtMi40MSwxLjc3LTEuNSw0LjI0LTMuMzUsNi41OS0zLjE3QzE1LS42OSwxMC40NS4yNCw3LjY4LDEuOTRjMS4wNywxLjE4LDEuMzEsMi44NC43NSw0LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yOC41LDE1Ljk5Yy0uNDQsMy4wNS0zLjUsMy44OC0zLjc5LDYuNjYsMS4zOC0uNjEsMy4wMy0uNDIsNC4yNC41OCwxLjM0LTIuNDEsMS40MS00Ljc4LS40NS03LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yMi41OSwyNC44NGMtMS41Ni4yMy0yLjksMS4zMy00LjE4LDIuNDEtMS43NywxLjUtNC4yNCwzLjM1LTYuNTksMy4xNyw0LjIsMS4zLDguNzQuMzcsMTEuNTEtMS4zMy0xLjA3LTEuMTgtMS4zMS0yLjg0LS43NS00LjI0WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0xNS45OSwyLjUyYzMuMDUuNDQsMy44NywzLjUsNi42NiwzLjc5LS42MS0xLjM4LS40Mi0zLjAzLjU4LTQuMjQtMi40MS0xLjM0LTQuNzgtMS40MS03LjI0LjQ1WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0yNC44NCw4LjQzYy4yMywxLjU2LDEuMzMsMi45LDIuNDEsNC4xOCwxLjUsMS43NywzLjM1LDQuMjQsMy4xNyw2LjU5LDEuMy00LjIuMzctOC43NC0xLjMzLTExLjUxLTEuMTgsMS4wNy0yLjg0LDEuMzItNC4yNC43NVoiLz4KICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJtMTUuMDQsMjguNWMtMy4wNS0uNDQtMy44OC0zLjUtNi42Ni0zLjc5LjYxLDEuMzguNDIsMy4wMy0uNTgsNC4yNCwyLjQxLDEuMzQsNC43OCwxLjQxLDcuMjQtLjQ1WiIvPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im02LjE5LDIyLjU5Yy0uMjMtMS41Ni0xLjMzLTIuOS0yLjQxLTQuMTgtMS41LTEuNzctMy4zNC00LjI0LTMuMTctNi41OS0xLjMsNC4yLS4zNyw4Ljc0LDEuMzMsMTEuNTEsMS4xOC0xLjA3LDIuODQtMS4zMSw0LjI0LS43NVoiLz4KICAgICAgICAgIDwvZz4KICAgICAgICAgIDxnPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im0yOC43NiwyLjI2YzEuMywxLjMsMS4zLDMuNCwwLDQuNy0xLjMsMS4zLTMuNCwxLjMtNC43LDAtMS4zLTEuMy0xLjMtMy40LDAtNC43LDEuMy0xLjMsMy40LTEuMyw0LjcsMFoiLz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Im02Ljk2LDI0LjA3YzEuMywxLjMsMS4zLDMuNCwwLDQuNy0xLjMsMS4zLTMuNCwxLjMtNC43LDAtMS4zLTEuMy0xLjMtMy40LDAtNC43LDEuMy0xLjMsMy40LTEuMyw0LjcsMFoiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im0yOC43NiwyOC43NmMtMS4zLDEuMy0zLjQsMS4zLTQuNywwLTEuMy0xLjMtMS4zLTMuNCwwLTQuNywxLjMtMS4zLDMuNC0xLjMsNC43LDBzMS4zLDMuNCwwLDQuN1oiLz4KICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Im02Ljk2LDYuOTZjLTEuMywxLjMtMy40LDEuMy00LjcsMC0xLjMtMS4zLTEuMy0zLjQsMC00LjcsMS4zLTEuMywzLjQtMS4zLDQuNywwLDEuMywxLjMsMS4zLDMuNCwwLDQuN1oiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0ibTE0LjEsMTguMzF2MS4xN2gyLjgzdi0yLjU1bDIuNDMsMi4zNWMuMi4xOS4xOS4zLjE5LjQ5di44czAsLjAyLDAsLjA0aDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAyLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMywwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMsMCwuMDRoMHMwLC4wMiwwLC4wNGgwczAsLjAzLDAsLjAzaDBzMCwuMDMtLjAxLjA0aDBzMCwuMDMtLjAxLjAzaDBzMCwuMDIsMCwuMDNoMHMwLC4wMy0uMDEuMDRoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMy0uMDEuMDRoMHMwLC4wMi0uMDEuMDNoMHMwLC4wMi0uMDEuMDNoMHMtLjAxLjAzLS4wMi4wNGgwczAsLjAyLS4wMS4wM2gwczAsLjAyLS4wMS4wM2gwczAsLjAzLS4wMi4wM2gwczAsLjAyLS4wMS4wM2gwcy0uMDEuMDItLjAyLjAzYzAsMCwwLDAtLjAxLjAxLDAsMCwwLC4wMS0uMDEuMDJoMHMwLC4wMi0uMDEuMDJjMCwwLDAsMC0uMDEuMDEsMCwwLS4wMS4wMS0uMDIuMDIsMCwwLDAsMC0uMDEuMDEsMCwwLDAsMC0uMDEuMDFoLS4wMXMtLjAxLjAyLS4wMS4wMmMwLDAsMCwwLS4wMS4wMWgwcy0uMDEuMDEtLjAyLjAyaDBzMCwwLS4wMS4wMWMwLDAsMCwwLS4wMS4wMWgtLjAxcy0uMDEuMDItLjAxLjAyYzAsMC0uMDIuMDEtLjAyLjAyaC0uMDFzMCwuMDItLjAxLjAyaC0uMDFzMCwuMDItLjAxLjAyYzAsMCwwLDAtLjAxLDAsMCwwLS4wMi4wMS0uMDMuMDJoMHMtLjAxLjAxLS4wMi4wMmgtLjAxcy0uMDEuMDEtLjAyLjAyaC0uMDFzLS4wMi4wMi0uMDMuMDJoLS4wMXMtLjAxLjAxLS4wMi4wMmgtLjAxcy0uMDEuMDEtLjAyLjAyaDBzLS4wMi4wMi0uMDMuMDJoLS4wMXMtLjAyLjAxLS4wMi4wMWMwLDAsMCwwLS4wMSwwLS4yLjA5LS40MS4xNC0uNjQuMTRoLTMuOTF2MS4xN2wtMi41LTIuNDgsMi41LTIuNDhoMFptMi44My00LjIxaDIuNTV2Mi44M2gtMS4xN2wyLjQ4LDIuNSwyLjQ4LTIuNWgtMS4xN3YtMy45MWMwLS4yMy0uMDUtLjQ1LS4xNC0uNjQsMCwwLDAsMCwwLS4wMXYtLjAycy0uMDEtLjAxLS4wMS0uMDFjMC0uMDEtLjAxLS4wMi0uMDItLjAzaDBzMC0uMDIsMC0uMDJoMHMwLS4wMiwwLS4wM2gwcy0uMDEtLjAzLS4wMi0uMDRoMHMwLS4wMi0uMDEtLjAzaDBzMC0uMDItLjAxLS4wM2gwcy0uMDEtLjAzLS4wMi0uMDRjMCwwLDAsMCwwLS4wMSwwLDAsMCwwLS4wMS0uMDFoMHMwLS4wMi0uMDEtLjAzaDBzLS4wMS0uMDMtLjAyLS4wM2gtLjAxcy0uMDEtLjAyLS4wMS0uMDJjMCwwLDAsMC0uMDEtLjAxLDAsMCwwLDAtLjAxLS4wMWgwcy0uMDEtLjAxLS4wMi0uMDJoMHMwLDAtLjAxLS4wMWgtLjAxcy0uMDEtLjAyLS4wMS0uMDJjMCwwLDAsMC0uMDEtLjAxLDAsMCwwLDAtLjAxLS4wMSwwLDAtLjAxLS4wMS0uMDItLjAyLDAsMCwwLDAtLjAxLDAsMCwwLDAsMC0uMDEtLjAxaC0uMDFzLS4wMS0uMDItLjAyLS4wMmMwLDAsMCwwLS4wMS0uMDEsMCwwLS4wMS0uMDEtLjAyLS4wMWgtLjAxczAtLjAyLS4wMS0uMDJoLS4wMXMtLjAxLS4wMi0uMDItLjAyaC0uMDFzLS4wMS0uMDItLjAyLS4wMmgtLjAxcy0uMDEtLjAyLS4wMi0uMDJoLS4wMXMtLjAyLS4wMi0uMDMtLjAyaDBzLS4wMS0uMDEtLjAyLS4wMmgtLjAxcy0uMDEtLjAxLS4wMi0uMDJoMHMtLjAyLS4wMi0uMDMtLjAyaDBzLS4wMS0uMDEtLjAyLS4wMmgtLjAxcy0uMDItLjAxLS4wMi0uMDJoMHMtLjAyLS4wMS0uMDMtLjAyaDBzLS4wMSwwLS4wMi0uMDFoLS4wMXMtLjAyLS4wMS0uMDMtLjAxaDBzLS4wMiwwLS4wMy0uMDFoLS4wMXMtLjAxLDAtLjAyLS4wMWgwcy0uMDIsMC0uMDMtLjAxaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wMywwaDBzLS4wMiwwLS4wNCwwaDBzLS4wMiwwLS4wMywwaC0uMDFzLS4wMiwwLS4wNCwwaC0uOGMtLjE4LDAtLjI5LS4wMi0uNDkuMTlsLTIuMzUsMi40M2gwWm0tMi44MywyLjgzaC0yLjU1di0yLjgzaDEuMTdsLTIuNDgtMi41LTIuNDgsMi41aDEuMTd2My45MWMwLC4yMy4wNS40NS4xNC42NCwwLDAsMCwwLDAsLjAxdi4wMnMuMDEuMDEuMDEuMDFjMCwuMDEuMDEuMDIuMDIuMDNoMHMwLC4wMiwwLC4wMmgwczAsLjAyLDAsLjAzaDBzLjAxLjAzLjAyLjA0aDBzMCwuMDIuMDEuMDNoMHMwLC4wMi4wMS4wM2gwcy4wMS4wMy4wMi4wNGMwLDAsMCwwLDAsLjAxLDAsMCwwLDAsLjAxLjAxaDBzMCwuMDIuMDEuMDNoMHMuMDEuMDMuMDIuMDRoLjAxcy4wMS4wMi4wMS4wMmMwLDAsMCwwLC4wMS4wMSwwLDAsMCwwLC4wMS4wMWgwcy4wMS4wMS4wMi4wMmgwczAsMCwuMDEuMDFoLjAxcy4wMS4wMi4wMS4wMmMwLDAsMCwwLC4wMS4wMSwwLDAsMCwwLC4wMS4wMSwwLDAsLjAxLjAxLjAyLjAyLDAsMCwwLDAsLjAxLjAxLDAsMCwwLDAsLjAxLjAxaC4wMXMuMDEuMDIuMDIuMDJjMCwwLDAsMCwuMDEuMDEsMCwwLC4wMS4wMS4wMi4wMWguMDFzMCwuMDIuMDEuMDJoLjAxcy4wMS4wMi4wMi4wMmguMDFzLjAxLjAyLjAyLjAyaC4wMXMuMDEuMDIuMDIuMDJoLjAxcy4wMi4wMi4wMy4wMmgwcy4wMS4wMS4wMi4wMmguMDFzLjAxLjAxLjAyLjAyaDBzLjAyLjAyLjAzLjAyaDBzLjAxLjAxLjAyLjAyaDBzLjAyLjAxLjAyLjAyaDBzLjAyLjAxLjAzLjAyaDBzLjAxLjAxLjAyLjAxaC4wMXMuMDIuMDEuMDMuMDFoMHMuMDIsMCwuMDMuMDFoMHMuMDIsMCwuMDIuMDFoLjAxcy4wMiwwLC4wMy4wMWgwcy4wMiwwLC4wMywwaDBzLjAyLDAsLjAzLDBoMHMuMDIsMCwuMDMsMGgwcy4wMiwwLC4wMywwaC4wMXMuMDIsMCwuMDMsMGgwcy4wMiwwLC4wMywwaDBzLjAyLDAsLjAzLDBoLjAxcy4wMiwwLC4wMywwaDBzLjAyLDAsLjA0LDBoMHMuMDIsMCwuMDMsMGguMDFzLjAyLDAsLjA0LDBoLjhjLjE4LDAsLjI5LjAyLjQ5LS4xOWwyLjM1LTIuNDNoMFptMC0yLjgzbC0yLjQzLTIuMzVjLS4yMS0uMi0uMTktLjMtLjE5LS40OXYtLjhzMC0uMDIsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA1aDBzMC0uMDIsMC0uMDRoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA0aDBzMC0uMDMsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAzLDAtLjA0aDBzMC0uMDMsMC0uMDNoMHMwLS4wMywwLS4wNGgwczAtLjAyLjAxLS4wNGgwczAtLjAyLDAtLjAzaDBzMC0uMDMuMDEtLjA0aDBzMC0uMDIsMC0uMDNoMHMwLS4wMywwLS4wM2gwczAtLjAzLjAxLS4wNGgwczAtLjAyLjAxLS4wM2gwczAtLjAyLjAxLS4wM2gwczAtLjAzLjAxLS4wNGgwczAtLjAyLjAxLS4wM2gwczAtLjAyLjAxLS4wM2gwcy4wMS0uMDMuMDItLjA0aDBzMC0uMDIuMDEtLjAzaDBzMC0uMDIuMDEtLjAzaDBzMC0uMDMuMDItLjAzaDBzMC0uMDIuMDEtLjAzaDBzLjAxLS4wMi4wMS0uMDNjMCwwLDAsMCwuMDEtLjAxLDAsMCwwLS4wMS4wMS0uMDJoMHMwLS4wMi4wMS0uMDJjMCwwLDAsMCwuMDEtLjAxLDAsMCwuMDEtLjAxLjAyLS4wMiwwLDAsMCwwLC4wMS0uMDEsMCwwLDAsMCwuMDEtLjAxaC4wMXMuMDEtLjAyLjAxLS4wMmMwLDAsMCwwLC4wMS0uMDFoMHMuMDEtLjAxLjAyLS4wMmgwczAsMCwuMDEtLjAxYzAsMCwwLDAsLjAxLS4wMWguMDFzLjAxLS4wMi4wMS0uMDJjMCwwLC4wMi0uMDEuMDItLjAyaC4wMXMwLS4wMi4wMS0uMDJoLjAxczAtLjAyLjAxLS4wMmMwLDAsMCwwLC4wMSwwLDAsMCwuMDItLjAxLjAzLS4wMmgwcy4wMS0uMDEuMDItLjAyaC4wMXMuMDEtLjAxLjAyLS4wMmguMDFzLjAyLS4wMi4wMy0uMDJoLjAxcy4wMS0uMDEuMDItLjAyaC4wMXMuMDEtLjAxLjAyLS4wMmgwcy4wMi0uMDIuMDMtLjAyaC4wMXMuMDItLjAxLjAyLS4wMWMwLDAsMCwwLC4wMSwwLC4yLS4wOS40MS0uMTQuNjQtLjE0aDMuOTF2LTEuMTdsMi41LDIuNDgtMi41LDIuNDh2LTEuMTdoLTIuODN2Mi41NVoiLz4KICAgICAgICAgIDxwb2x5Z29uIGNsYXNzPSJjbHMtNSIgcG9pbnRzPSIxNC4xMSAxOS40NSAxNC4xMSAxNi45MiAxMS41NyAxNi45MiAxMS41NyAxNC4xMSAxNC4xMSAxNC4xMSAxNC4xMSAxMS41NyAxNi45MiAxMS41NyAxNi45MiAxNC4xMSAxOS40NSAxNC4xMSAxOS40NSAxNi45MiAxNi45MiAxNi45MiAxNi45MiAxOS40NSAxNC4xMSAxOS40NSIvPgogICAgICAgIDwvZz4KICAgICAgPC9nPgogICAgPC9nPgogIDwvZz4KPC9zdmc+`;
  var sepNorm = (s) => s.replace(/\s+/g, " ").replace(/Telep\s+on/gi, "Telepon").replace(/Kunjunga\s+n/gi, "Kunjungan").replace(/Spes\s+ialis/gi, "Spesialis").trim();
  function buildSepSection(sections) {
    const sepSection = sections.find((s) => /^SEP$/i.test(s.title));
    const txt = sepSection ? plainText(sepSection.html) : "";
    const qrSrc = sepSection ? new DOMParser().parseFromString(sepSection.html, "text/html").querySelector('img[src*="qrserver"], img[src*="qr-code"]')?.getAttribute("src") || "" : "";
    const grab = (re) => sepNorm(txt.match(re)?.[1] || "") || "-";
    const grabField = (label, next) => grab(new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=${next}|$)`, "i"));
    const sep = pick("no_sep", "sep") !== "-" ? pick("no_sep", "sep") : grab(/No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]+)/i);
    const tglSep = grab(/Tgl\.?\s*SEP\s*[:.]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    const noHp = pick("no_hp", "telepon") !== "-" ? pick("no_hp", "telepon") : grabField("No\\.?\\s*Telepon", "Sub\\/Spesialis");
    const kelas = pick("kelas").replace(/^Kelas\s*/i, "");
    const lahirRaw = pick("tgl_lahir", "tglLahir").replace(/^:\s*/, "");
    const lahir = lahirRaw.split(/\s*\/\s*/)[0]?.trim() || "-";
    const kelamin = grabField("Kelamin", "No\\.?\\s*Telepon");
    const dokter = pick("dokter", "dpjp");
    const kartu = pick("kartu", "no_kartu", "noka");
    const mr = pick("norm", "rekam_medis");
    const namaPeserta = pick("nama") || "-";
    const km = kartu.match(/^(.*?)\s*\(MR\.?\s*([^)]+)\)$/i);
    const kartuHtml = km ? `${esc(km[1].trim())}<span class="sep-inline-mr">No.MR : ${esc(km[2].trim())}</span>` : `${esc(kartu)}${mr !== "-" ? `<span class="sep-inline-mr">No.MR : ${esc(mr)}</span>` : ""}`;
    const kunjungan = pick("jenis_kunjungan") !== "-" ? pick("jenis_kunjungan") : grab(/Jns\.?\s*Kunjungan\s*[:.]?\s*([\s\S]*?)(?:\s+Kls\.?\s*Hak|$)/i);
    const kunjunganItems = kunjungan.replace(/^-\s*/, "").split(/\s+-\s+|\n/).map((x) => x.trim()).filter(Boolean);
    const kunjunganHtml = kunjunganItems.length > 1 ? '<ul class="sep-multiline-list">' + kunjunganItems.map((x) => `<li>${esc(x)}</li>`).join("") + "</ul>" : esc(kunjungan);
    const peserta = pick("peserta", "jenis_peserta") !== "-" ? pick("peserta", "jenis_peserta") : (
      // Jangan ikut menangkap field nama di kolom kiri — field ini khusus
      // label peserta (PBI JAMINAN KESEHATAN) di kolom kanan.
      grabField("(?<!Nama )Peserta", "COB|Jns\\.?\\s*Rawat")
    );
    const penjamin = pick("penjamin") !== "-" ? pick("penjamin") : grabField("Penjamin", "\\*Saya|CATATAN");
    const faskes = pick("faskes_perujuk", "faskes") !== "-" ? pick("faskes_perujuk", "faskes") : grabField("Faskes\\s*Perujuk", "Diagnosa\\s*Awal");
    const diagnosaAwal = pick("diagnosa_awal") !== "-" ? pick("diagnosa_awal") : grabField("Diagnosa\\s*Awal", "Catatan|Peserta");
    const catatan = pick("catatan_sep", "catatan") !== "-" ? pick("catatan_sep", "catatan") : grabField("Catatan", "Peserta|COB");
    const subSpesialis = pick("sub_spesialis", "spesialis") !== "-" ? pick("sub_spesialis", "spesialis") : grabField("Sub\\/Spesialis", "Dokter");
    const cetakan = grab(/Cetakan\s+ke\s*[:.]?\s*(\d+)/i);
    const printMeta = cetakan !== "-" ? `<div class="sep-print-meta">Cetakan ke ${esc(cetakan)}</div>` : "";
    const kv = (label, value, cls = "", right = false) => `<tr><td class="lbl${right ? " right" : ""}">${label}</td><td class="sep">:</td><td class="val${cls ? " " + cls : ""}">${value}</td></tr>`;
    const spacer = '<tr><td colspan="3">&nbsp;</td></tr>';
    const kelasTeks = kelas !== "-" ? `Kelas ${esc(kelas)}` : "-";
    return `<section class="rm-page sep-page" id="rm-01">
 <section class="bpjs-sep-sheet">
 <div class="sep-header">
   <img class="sep-logo" src="${BPJS_LOGO}" alt="BPJS Kesehatan" width="215" height="33" />
   <div class="sep-title-wrap">
     <div class="sep-title">SURAT ELEGIBILITAS PESERTA</div>
     <div class="sep-hospital">${esc(HOSPITAL_NAME.toUpperCase())}</div>
   </div>
 </div>
 <div class="sep-columns">
   <div class="sep-col-left"><table class="sep-kv-table">
     ${kv("No. SEP", `<span class="sep-no-value">${esc(sep)}</span>`)}
     ${kv("Tgl. SEP", esc(tglSep))}
     ${kv("No.Kartu", kartuHtml)}
     ${kv("Nama Peserta", `<strong>${esc(namaPeserta)}</strong>`)}
     ${kv("Tgl.Lahir", `${esc(lahir)} &nbsp;&nbsp; Kelamin : ${esc(kelamin)}`)}
     ${kv("No.Telepon", esc(noHp))}
     ${kv("Sub/Spesialis", esc(subSpesialis))}
     ${kv("Dokter", esc(dokter))}
     ${kv("Faskes Perujuk", esc(faskes !== "-" ? faskes : `${HOSPITAL_NAME} - Kota Jambi`))}
     ${kv("Diagnosa Awal", esc(diagnosaAwal))}
     ${kv("Catatan", esc(catatan))}
   </table></div>
   <div class="sep-col-right"><table class="sep-kv-table">
     ${spacer}${spacer}
     ${kv("Peserta", esc(peserta), "", true)}
     ${kv("COB", "-", "", true)}
     ${kv("Jns.Rawat", `<strong>${esc(pick("jenis"))}</strong>`, "", true)}
     ${kv("Jns.Kunjungan", kunjunganHtml, "", true)}
     ${kv("Kls.Hak", `<strong>${kelasTeks}</strong>`, "", true)}
     ${kv("Kls.Rawat", `<strong>${kelasTeks}</strong>`, "", true)}
     ${kv("Penjamin", esc(penjamin), "", true)}
   </table></div>
 </div>
 <div class="sep-disclaimer">
   *Saya Menyetujui BPJS Kesehatan menggunakan informasi Medis Pasien jika diperlukan.<br/>
   *SEP bukan sebagai bukti penjamin peserta
 </div>
 ${printMeta}
 <div class="sep-signatures">
   <div class="sep-sig-box">
     <div class="sep-sig-role">Pasien/<br/>Keluarga Pasien</div>
     ${qrSrc ? `<img class="sep-qr" src="${esc(qrSrc)}" alt="QR SEP" width="100" height="100" />` : ""}
     <div class="sep-sig-name">(${esc(namaPeserta)})</div>
   </div>
 </div>
 </section>
</section>`;
  }
  function buildSpriSection(sections) {
    const spr = sections.find((s) => /^SPRI$/i.test(s.title));
    const qrSpri = sectionQrs(sections, /^SPRI$/i)[0] ?? "";
    const doc = spr ? new DOMParser().parseFromString(spr.html, "text/html") : null;
    const field = (label) => {
      if (!doc) return "-";
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const tds = Array.from(tr.cells);
        if (!tds.length) continue;
        const head = (tds[0].textContent || "").replace(/\s+/g, " ").trim();
        if (!label.test(head)) continue;
        if (tds.length === 1) return head;
        const raw = tds.slice(1).map(
          (td) => (td.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
        ).filter(Boolean).join("\n").trim();
        if (raw) return raw;
      }
      return "-";
    };
    const get = (re, from) => from.match(re)?.[1]?.trim() || "-";
    const vitalRaw = field(/^Pemeriksaan Fisik$/i);
    const ku = get(/Keadaan Umum\s*:\s*(.*?)\s*(?:Tensi|$)/i, vitalRaw);
    const tensi = get(/Tensi\s*:\s*(.*?)\s*(?:Nadi|$)/i, vitalRaw);
    const nadi = get(/Nadi\s*:\s*(.*?)\s*(?:RR|$)/i, vitalRaw);
    const rr = get(/RR\s*:\s*(.*?)\s*(?:Suhu|$)/i, vitalRaw);
    const suhu = get(/Suhu\s*:\s*(.*?)\s*(?:BB|$)/i, vitalRaw);
    const bb = get(/BB\s*:\s*(.*?)\s*(?:TB|$)/i, vitalRaw);
    const tb = get(/TB\s*:\s*(.*?)$/i, vitalRaw);
    const fisik = get(/Pemeriksaan Fisik\s*:\s*([\s\S]*)$/i, vitalRaw);
    const catatan = field(/^Catatan$/i);
    const diit = field(/^Diit$/i);
    const terapi = field(/^Terapi$/i);
    const pengantarRaw = field(/^Kota Jambi,.*Jam|^Waktu Pengantar/i);
    const pengantar = pengantarRaw.match(/^(Kota Jambi,.*?Jam\s*\d{1,2}:\d{2})/i)?.[1] || pengantarRaw;
    const dokter = pick("dokter", "dpjp");
    const lahirSplit = pick("tgl_lahir", "tglLahir").split(/\s*\/\s*/);
    const umurTeks = lahirSplit.length > 1 ? `${lahirSplit[1]} (${lahirSplit[0]})` : lahirSplit[0] || "-";
    return `<section class="rm-page" id="rm-03">
${kop("RM. 03")}
<div class="rm-form-title">SURAT PENGANTAR RAWAT INAP (SPRI)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"), true)}
    ${idRow("Umur / Tgl. Lahir", umurTeks)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Alamat", patientAlamat(sections))}
    ${idRow("Dikirim Oleh", dokter)}
    ${idRow("Waktu Pengantar", pengantar)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead>
    <tr><th colspan="7">PEMERIKSAAN TANDA VITAL &amp; ANTROPOMETRI SAAT MASUK</th></tr>
    <tr>
      <th>KEADAAN UMUM</th><th>TEKANAN DARAH</th><th>NADI</th>
      <th>PERNAPASAN (RR)</th><th>SUHU</th><th>BERAT BADAN</th><th>TINGGI BADAN</th>
    </tr>
  </thead>
  <tbody><tr>
    <td class="center"><strong>${esc(ku)}</strong></td>
    <td class="center"><strong>${esc(tensi)}</strong></td>
    <td class="center">${esc(nadi)}</td>
    <td class="center">${esc(rr)}</td>
    <td class="center">${esc(suhu)}</td>
    <td class="center">${esc(bb)}</td>
    <td class="center">${esc(tb)}</td>
  </tr></tbody>
</table>

<table class="rm-grid-table">
  <tbody>
    <tr><td style="width: 175px;"><strong>ANAMNESIS</strong></td><td>${nl2br(field(/^Anamnesis$/i))}</td></tr>
    <tr><td><strong>RIWAYAT PENYAKIT KELUARGA</strong></td><td>${nl2br(field(/^Riwayat Penyakit Keluarga$/i))}</td></tr>
    <tr><td><strong>RIWAYAT ALERGI</strong></td><td>${nl2br(field(/^Riwayat Alergi$/i))}</td></tr>
    <tr><td><strong>PEMERIKSAAN FISIK / CATATAN</strong></td><td>${fisik !== "-" ? `<strong>${nl2br(fisik)}</strong>` : "-"}${catatan !== "-" ? `<br/>${nl2br(catatan)}` : ""}</td></tr>
    <tr><td><strong>PEMERIKSAAN PENUNJANG AWAL</strong></td><td>${nl2br(field(/^Pemeriksaan Penunjang$/i))}</td></tr>
    <tr><td><strong>DIAGNOSA KERJA</strong></td><td><strong>${nl2br(field(/^Diagnosa Kerja$/i))}</strong></td></tr>
    <tr><td><strong>TERAPI &amp; DIIT AWAL</strong></td><td>${nl2br(terapi)}${diit !== "-" ? `<br/><strong>Diit :</strong> ${nl2br(diit)}` : ""}</td></tr>
  </tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>${esc(pengantar)}</div>
    <div>Dokter yang Memeriksa</div>
    ${qrSpri ? `<img class="rm-sig-qr" src="${esc(qrSpri)}" alt="QR tanda tangan dokter" width="80" height="80" />` : ""}
    ${qrSpri ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(dokter)} )</div>
  </div>
</div>
</section>`;
  }
  function buildSbpkSection(sections) {
    const sbpk = sections.find((s) => /^SBPK$/i.test(s.title));
    const doc = sbpk ? new DOMParser().parseFromString(sbpk.html, "text/html") : null;
    const fields = /* @__PURE__ */ new Map();
    const actions = /* @__PURE__ */ new Map();
    const diagRows = [];
    let penanggung = "-";
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const cells = Array.from(tr.cells);
        for (let i = 0; i < cells.length - 2; i++) {
          const label = (cells[i].textContent || "").replace(/\s+/g, " ").trim();
          if ((cells[i + 1].textContent || "").trim() !== ":") continue;
          const value = (cells[i + 2].innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim();
          if (label && value && !fields.has(label)) fields.set(label, value);
        }
        if (cells.length >= 5 && /^[A-Z]\d{2}(?:\.\d+)?$/.test(cells[2].textContent?.trim() ?? "") && cells[0].textContent?.trim() && cells[1].textContent?.trim()) {
          diagRows.push({
            unit: (cells[0].textContent || "").replace(/\s+/g, " ").trim(),
            diag: (cells[1].textContent || "").replace(/\s+/g, " ").trim(),
            icd: (cells[2].textContent || "").trim(),
            dokter: (cells[4].textContent || "").replace(/\s+/g, " ").trim() || "-"
          });
        }
      }
      for (const li of Array.from(doc.querySelectorAll("li"))) {
        const t = (li.textContent || "").replace(/\s+/g, " ").trim();
        if (!t || /\([A-Z]\d{2}(?:\.\d+)?\)$/i.test(t)) continue;
        const key = t.toUpperCase();
        actions.set(key, (actions.get(key) || 0) + 1);
      }
      const tables = Array.from(doc.querySelectorAll("table"));
      const pm = (tables[tables.length - 1]?.textContent || "").match(/\((dr\.[^)]+)\)/i);
      if (pm) penanggung = pm[1].trim();
    }
    const f = (re) => {
      for (const [k, v] of fields) if (re.test(k)) return v;
      return "-";
    };
    const ku = f(/^No Kartu BPJS$/i);
    const norm = pick("norm", "rekam_medis");
    const nama = pick("nama");
    const lahir = f(/^Tanggal lahir/i);
    const alamat = f(/^Alamat$/i);
    const sep = pick("no_sep", "sep") !== "-" ? pick("no_sep", "sep") : f(/^No SEP$/i);
    const jkRaw = f(/^Jenis Kelamin$/i);
    const jk = /^L$/i.test(jkRaw) ? "Laki-laki (L)" : /^P$/i.test(jkRaw) ? "Perempuan (P)" : jkRaw;
    const masuk = f(/^Tgl\.? Masuk RS$/i);
    const bayi = f(/^Berat badan/i);
    const unit = diagRows[0]?.unit || f(/^Unit Pelayanan|^Poliklinik/i);
    const anamnesis = f(/^ANAMNESE$/i);
    const dokter = penanggung !== "-" ? penanggung : pick("dokter", "dpjp");
    const qrDpjp = sectionQrs(sections, /^SBPK/i)[0] ?? "";
    const qrPasienSbpk = sectionQrs(sections, /^SEP/i)[0] ?? sectionQrs(sections, /^Rincian Biaya/i)[0] ?? "";
    const diagBody = diagRows.length ? diagRows.map(
      (r) => `<tr><td>${esc(r.unit)}</td><td>Diagnosa</td><td><strong>${esc(r.diag)}</strong></td><td class="center">${esc(r.icd)}</td><td>${esc(r.dokter)}</td></tr>`
    ).join("") : `<tr><td>${nl2br(unit)}</td><td>Diagnosa Utama</td><td><strong>${nl2br(f(/^Diagnosa utama/i))}</strong></td><td class="center">-</td><td>${esc(dokter)}</td></tr>
       <tr><td>${nl2br(unit)}</td><td>Diagnosa Tambahan</td><td>${nl2br(f(/^Diagnosa tambahan/i))}</td><td class="center">-</td><td>${esc(dokter)}</td></tr>`;
    const actionRows = Array.from(actions.entries()).map(
      ([name, frek], i) => `<tr><td class="center">${i + 1}</td><td>${esc(name)}</td><td>${esc(dokter)}</td><td class="center">${frek}</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi SBPK Item ${i + 1}"></td></tr>`
    ).join("");
    return `<section class="rm-page" id="rm-02">
${kop("RM. 02")}
<div class="rm-form-title">SURAT BUKTI PELAYANAN KESEHATAN (SBPK)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Kartu BPJS", ku)}
    ${idRow("No. Rekam Medis", norm)}
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("Tgl. Lahir / Umur", lahir)}
    ${idRow("Alamat", alamat)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("No. SEP", sep)}
    ${idRow("Jenis Kelamin", jk)}
    ${idRow("Tgl. Masuk RS", `${masuk} (*)`, true)}
    ${idRow("Berat Badan Bayi", bayi)}
    ${idRow("Unit Pelayanan", unit)}
  </table></div>
</div>

<table class="rm-grid-table">
  <tbody>
    <tr>
      <td style="width: 170px;"><strong>Hasil anamnesa datang untuk</strong></td>
      <td>
        <span class="static-box">&nbsp;</span> Suspek &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&#10003;</span> <strong>Tegak Diagnosa</strong> &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Observasi &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Kontrol lanjutan &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="static-box">&nbsp;</span> Buka Balutan / Jahitan
      </td>
    </tr>
    <tr><td><strong>ANAMNESE</strong></td><td>${nl2br(anamnesis)}</td></tr>
  </tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 150px;">POLIKLINIK / RUANG</th>
    <th style="width: 120px;">JENIS DIAGNOSA</th>
    <th>DIAGNOSA</th>
    <th style="width: 65px;">ICD X</th>
    <th style="width: 165px;">DOKTER / PETUGAS</th>
  </tr></thead>
  <tbody>${diagBody}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>TINDAKAN / PEMERIKSAAN PENUNJANG / TERAPI (TERAGGREGASI)</th>
    <th style="width: 165px;">UNIT / DOKTER PELAKSANA</th>
    <th class="center" style="width: 48px;">FREK</th>
    <th class="center" style="width: 56px;">VER (&#10003;)</th>
  </tr></thead>
  <tbody>${actionRows}</tbody>
</table>

<div class="footnote-rm">
  (*) Catatan Sistem: periksa kembali tanggal masuk pada SBPK dengan SEP &amp; Resume sebelum berkas dikirim.
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Pasien / Keluarga Pasien</div>
    ${qrPasienSbpk ? `<img class="rm-sig-qr" src="${esc(qrPasienSbpk)}" alt="QR persetujuan pasien" width="80" height="80" />` : ""}
    ${qrPasienSbpk ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter Penanggung Jawab Pelayanan (DPJP)</div>
    ${qrDpjp ? `<img class="rm-sig-qr" src="${esc(qrDpjp)}" alt="QR persetujuan DPJP" width="80" height="80" />` : ""}
    ${qrDpjp ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(dokter)} )</div>
  </div>
</div>
</section>`;
  }
  function buildBillingSection(sections) {
    const bill = sections.find((s) => /^Rincian Biaya/i.test(s.title));
    const doc = bill ? new DOMParser().parseFromString(bill.html, "text/html") : null;
    const tindakan = /* @__PURE__ */ new Map();
    const obat = /* @__PURE__ */ new Map();
    if (doc) {
      const tables = Array.from(doc.querySelectorAll("table"));
      const tindakanTable = tables.find((t) => /frek/i.test(t.rows[0]?.textContent || ""));
      for (const tr of Array.from(tindakanTable?.rows ?? [])) {
        const c = Array.from(tr.cells).map(
          (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        if (c.length < 6 || !/^\d+\.?$/.test(c[0])) continue;
        const name = c[2] || "-";
        const key = name.toUpperCase().replace(/\s+/g, " ").trim();
        const frek = parseInt(c[4], 10) || 1;
        const jaminan2 = parseFloat((c[7] || "0").replace(/\./g, "").replace(",", ".")) || 0;
        const prev = tindakan.get(key);
        if (prev) {
          prev.frek += frek;
          prev.jaminan += jaminan2;
        } else {
          tindakan.set(key, { name, petugas: c[3] || "-", frek, tarif: c[5] || "-", jaminan: jaminan2 });
        }
      }
      const obatTable = tables.find((t) => /nama\s*obat/i.test(t.rows[0]?.textContent || ""));
      for (const tr of Array.from(obatTable?.rows ?? [])) {
        const c = Array.from(tr.cells).map(
          (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        if (c.length < 5 || !/^\d+(\.\d+)?$/.test(c[2])) continue;
        const name = c[1].replace(/^\d+\s*/, "").trim() || "-";
        const key = name.toUpperCase().replace(/\s+/g, " ").trim();
        const qty = parseFloat(c[2].replace(",", ".")) || 0;
        const jaminan2 = parseFloat((c[5] || "0").replace(/\./g, "").replace(",", ".")) || 0;
        const prev = obat.get(key);
        if (prev) {
          prev.qty += qty;
          prev.jaminan += jaminan2;
        } else {
          obat.set(key, { name, qty, jaminan: jaminan2 });
        }
      }
    }
    const summary = (re) => {
      if (!doc) return 0;
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        if (!c.some((x) => re.test(x))) continue;
        for (const x of c.slice(1)) {
          const num = parseFloat(x.replace(/\./g, "").replace(",", "."));
          if (Number.isFinite(num) && num !== 0) return num;
        }
      }
      return 0;
    };
    const jasa = summary(/^Total Jasa Rp/i);
    const resep = summary(/^Total Resep/i);
    const jasaPelayanan = summary(/^Jasa Pelayanan/i);
    const administrasi = summary(/^Biaya Administrasi/i);
    const materai = summary(/^Biaya Materai/i);
    const diskon = summary(/^Diskon/i);
    const pembulatan = summary(/^Pembulatan/i);
    const jaminan = summary(/^Total Biaya/i);
    const totalTagihan = jasa + resep + jasaPelayanan;
    const tanggungan = Math.max(0, totalTagihan - jaminan);
    const rupiah = (n) => n.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const sumLine = (label, value, bold = false) => `<div class="rm-sum-line"${bold ? ' style="font-weight:bold;border-top:1px solid #000;"' : ""}><span>${esc(label)}</span><span class="rm-sum-dots"></span><span>${esc(value)}</span></div>`;
    const tindakanRows = Array.from(tindakan.values()).map(
      (r, i) => `<tr><td class="center">${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.petugas)}</td><td class="center">${r.frek}</td><td class="num">${esc(r.tarif)}</td><td class="num">${rupiah(r.jaminan)}</td></tr>`
    ).join("");
    const obatRows = Array.from(obat.values()).map(
      (r, i) => `<tr><td class="center">${i + 1}</td><td>${esc(r.name)}</td><td class="center">${r.qty}</td><td class="num">${rupiah(r.jaminan)}</td></tr>`
    ).join("");
    const norm = pick("norm", "rekam_medis");
    const nama = pick("nama");
    const dokter = pick("dokter", "dpjp");
    const alamat = patientAlamat(sections);
    const sep = pick("no_sep", "sep");
    const ruang = [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-";
    const awal = pick("tanggalAwal", "tgl_masuk", "tgl");
    const akhir = pick("tanggalAkhir", "keluar", "tgl_keluar");
    const qrsBill = sectionQrs(sections, /^Rincian Biaya/i);
    const qrPasien = qrsBill.find((url) => /pasien/i.test(decodeURIComponent(url))) ?? qrsBill[0] ?? "";
    const qrPenerima = qrsBill.find((url) => /penerima/i.test(decodeURIComponent(url))) ?? qrsBill[1] ?? "";
    return `<section class="rm-page" id="rm-05">
${kop("RM. 05")}
<div class="rm-form-title">RINCIAN BIAYA PELAYANAN RAWAT INAP &amp; FARMASI</div>

<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Rekam Medis", norm)}
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("Alamat Pasien", alamat)}
    ${idRow("Unit / Instalasi", ruang)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Golongan Pasien", `BPJS KESEHATAN (SEP: ${sep})`)}
    ${idRow("Dokter DPJP", dokter)}
    ${idRow("Periode Rawat", `${awal} s/d ${akhir}`)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>URAIAN TINDAKAN / PELAYANAN</th>
    <th style="width: 155px;">DOKTER / PELAKSANA</th>
    <th class="center" style="width: 48px;">FREK</th>
    <th class="num" style="width: 88px;">TARIF (Rp)</th>
    <th class="num" style="width: 98px;">JAMINAN (Rp)</th>
  </tr></thead>
  <tbody>${tindakanRows}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>NAMA OBAT / ALKES</th>
    <th class="center" style="width: 52px;">QTY</th>
    <th class="num" style="width: 120px;">JAMINAN (Rp)</th>
  </tr></thead>
  <tbody>${obatRows}</tbody>
</table>

<div class="rm-summary">
  ${sumLine("Sub Total Layanan Medis / Tindakan", rupiah(jasa))}
  ${sumLine("Sub Total Penjualan (Farmasi/Obat)", rupiah(resep))}
  ${sumLine("Jasa Pelayanan (Jasa Medis/Paramudis)", rupiah(jasaPelayanan))}
  ${sumLine("Jasa Sarana", "0")}
  ${sumLine("Biaya Administrasi", rupiah(administrasi))}
  ${sumLine("Biaya Materai", rupiah(materai))}
  ${sumLine("Diskon", rupiah(diskon))}
  ${sumLine("Pembulatan", rupiah(pembulatan))}
  ${sumLine("TOTAL TAGIHAN (KOTOR)", rupiah(totalTagihan), true)}
  ${sumLine("Ditanggung Jaminan / Klaim BPJS", rupiah(jaminan))}
  ${sumLine("TANGGUNGAN PASIEN (Sisa yang harus dibayar)", rupiah(tanggungan))}
  ${sumLine("Uang Muka / Deposit", "0")}
  ${sumLine("Bayar (Tunai/Non-Tunai)", rupiah(tanggungan))}
  ${sumLine("Kembali", "0")}
  ${sumLine("Status", tanggungan === 0 ? "Lunas" : "-")}
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    ${qrPasien ? `<img class="rm-sig-qr" src="${esc(qrPasien)}" alt="QR persetujuan pasien" width="80" height="80" />` : ""}
    <div>Yang Menyerahkan,</div>
    <div>Pasien / Keluarga Pasien</div>
    ${qrPasien ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    ${qrPenerima ? `<img class="rm-sig-qr" src="${esc(qrPenerima)}" alt="QR penerima" width="80" height="80" />` : ""}
    <div>Yang Menerima (Petugas Billing / Kasir)</div>
    ${qrPenerima ? "" : '<div class="rm-sig-space"></div>'}
  </div>
</div>
</section>`;
  }
  function buildResumeSection(sections) {
    const res = sections.find((s) => /^Resume/i.test(s.title));
    const qrResume = sectionQrs(sections, /^Resume/i)[0] ?? "";
    const qrPasienResume = sectionQrs(sections, /^SEP/i)[0] ?? sectionQrs(sections, /^Rincian Biaya/i)[0] ?? "";
    const doc = res ? new DOMParser().parseFromString(res.html, "text/html") : null;
    const fields = /* @__PURE__ */ new Map();
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const cells = Array.from(tr.cells);
        for (let i = 0; i < cells.length - 2; i++) {
          const rawLabel = (cells[i].textContent || "").replace(/\s+/g, " ").trim();
          const label = rawLabel.replace(/^-\s*/, "").replace(/\s*:$/, "");
          if ((cells[i + 1].textContent || "").trim() !== ":") continue;
          const value = (cells[i + 2].innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim();
          if (label && value && !fields.has(label)) fields.set(label, value);
        }
      }
    }
    const f = (...labels) => {
      for (const [k, v] of fields) if (labels.some((re) => re.test(k))) return v;
      return "-";
    };
    const vital = (re) => {
      for (const [k, v] of fields) if (re.test(k)) return v;
      return "-";
    };
    const nama = pick("nama");
    const norm = pick("norm", "rekam_medis");
    const lahir = pick("tgl_lahir", "tglLahir");
    const jk = pick("jenis_kelamin", "jk");
    const masuk = f(/^Tanggal Masuk$/i);
    const keluar = f(/^Tanggal Keluar$/i);
    const ruang = f(/^Ruang Rawat$/i);
    const kelas = f(/^Kelas$/i);
    const dokter = pick("dokter", "dpjp");
    const seb = f(/^Anemnesa|^Anamnesa/i);
    const fisik = f(/^Pemeriksaan Fisik$/i);
    const diagnostik = f(/^Hasil Pemeriksaan Diagnostik/i);
    const diagUtama = f(/^Diagnosa Utama$/i);
    const diagSekunder = f(/^Diagnosa Sekunder$/i);
    const prosedur = f(/^Prosedur \/ Operasi|^Diagnosa Tindakan/i);
    const pengobatan = f(/^Pengobatan$/i);
    const obatPulang = f(/^Obat Pulang$/i);
    const kondisi = f(/^Kondisi Pulang$/i);
    const catatanKondisi = f(/^Catatan Kondisi Pulang$/i);
    const kontrol = f(/^Jadwal Kontrol$/i);
    const lanjutan = f(/^Pemeriksaan Lanjutan/i);
    const vitalSigns = [
      ["TD", vital(/^TD$/)],
      ["HR", vital(/^HR$/)],
      ["RR", vital(/^RR$/)],
      ["S", vital(/^S$/)],
      ["SpO2", vital(/^SPO2$/)],
      ["GCS", vital(/^GCS$/)]
    ].filter(([, v]) => v !== "-").map(([k, v]) => `${k}: ${v}`).join(" | ");
    const row = (label, value) => `<tr><td style="width: 175px;"><strong>${label}</strong></td><td>${nl2br(value)}</td></tr>`;
    return `<section class="rm-page" id="rm-06">
${kop("RM. 06")}
<div class="rm-form-title">RINGKASAN PULANG (DISCHARGE SUMMARY)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("No. Rekam Medis", norm, true)}
    ${idRow("Tgl. Lahir / Kelamin", `${lahir} / ${jk}`)}
    ${idRow("Jenis Kasus", f(/^Jenis Kasus$/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Masuk", masuk)}
    ${idRow("Tanggal Keluar", keluar)}
    ${idRow("Ruang / Kelas", `${ruang} / ${kelas}`)}
    ${idRow("DPJP / Rawat Bersama", dokter)}
  </table></div>
</div>

<table class="rm-grid-table">
  <tbody>
    ${row("ALASAN / INDIKASI RAWAT &amp; ANAMNESA", `${f(/^Alasan \/ Indikasi Rawat/i)}
${seb}`.trim())}
    ${row("PEMERIKSAAN FISIK &amp; TANDA VITAL MASUK", `${fisik}${vitalSigns ? `
Vital Signs : ${vitalSigns}` : ""}`.trim())}
    ${row("HASIL PEMERIKSAAN DIAGNOSTIK", diagnostik)}
    ${row("DIAGNOSA UTAMA", diagUtama)}
    ${row("DIAGNOSA SEKUNDER", diagSekunder)}
    ${row("TINDAKAN / PROSEDUR (ICD-9-CM)", prosedur)}
    ${row("PENGOBATAN SELAMA RAWAT", pengobatan)}
    ${row("OBAT PULANG", obatPulang)}
    ${row("KONDISI &amp; CARA PULANG", `${kondisi}
${catatanKondisi}`.trim())}
    ${row("INSTRUKSI &amp; JADWAL KONTROL", `${kontrol}
${lanjutan}`.trim())}
    ${row("STATUS RUJUKAN &amp; PELAYANAN KB", f(/^Apakah pasien rujukan masuk/i))}
  </tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Mengetahui Pasien / Keluarga</div>
    ${qrPasienResume ? `<img class="rm-sig-qr" src="${esc(qrPasienResume)}" alt="QR persetujuan pasien" width="80" height="80" />` : ""}
    ${qrPasienResume ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Yang Membuat</div>
    ${qrResume ? `<img class="rm-sig-qr" src="${esc(qrResume)}" alt="QR tanda tangan DPJP" width="80" height="80" />` : ""}
    ${qrResume ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(dokter)} )</div>
  </div>
</div>
</section>`;
  }
  function buildTelaahSection(sections) {
    const tel = sections.find((s) => /^Telaah/i.test(s.title));
    const doc = tel ? new DOMParser().parseFromString(tel.html, "text/html") : null;
    const fields = /* @__PURE__ */ new Map();
    const meds = [];
    const checklists = [];
    const adminHeads = [];
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td) => (td.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
        );
        for (let i = 0; i < c.length - 2; i++) {
          const label = c[i].replace(/:$/, "").trim();
          if (c[i + 1] !== ":") continue;
          if (label && c[i + 2] && !fields.has(label)) fields.set(label, c[i + 2]);
        }
        for (const cell of c) {
          const m = cell.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);
          if (m && !fields.has(m[1].trim())) fields.set(m[1].trim(), m[2].trim());
        }
      }
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        if (c.length < 2 || !/^R\/\d+$/i.test(c[0])) continue;
        const m = c[1].match(/^(.*?)\s*Jml:\s*(\S+)/i);
        meds.push({
          no: c[0],
          name: m ? m[1].trim() : c[1],
          jml: m ? m[2] : "-"
        });
      }
      for (const table of Array.from(doc.querySelectorAll("table"))) {
        const head = (table.rows[0]?.textContent || "").replace(/\s+/g, " ").trim();
        if (!/^(Telaah Resep|Telaah Obat|Edukasi)/i.test(head)) continue;
        const rows = [];
        for (const tr of Array.from(table.rows).slice(1)) {
          const c = Array.from(tr.cells).map(
            (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
          );
          if (c.length < 2 || !/^\d+$/.test(c[0])) continue;
          rows.push([c[0], c[1]]);
        }
        if (rows.length) checklists.push({ title: head.split(/\s{2,}/)[0] || head, rows });
      }
      const adminTable = Array.from(doc.querySelectorAll("table")).find(
        (t) => /Hitung/i.test(t.rows[0]?.textContent || "")
      );
      if (adminTable) {
        adminHeads.push(
          ...Array.from(adminTable.rows[0].cells).map((td) => (td.textContent || "").replace(/\s+/g, " ").trim()).filter((v) => /Hitung|Timbang|Kemas|Penyerahan/i.test(v))
        );
      }
    }
    if (!adminHeads.length) adminHeads.push("Hitung", "Timbang", "Kemas", "Penyerahan");
    const f = (...res) => {
      for (const [k, v] of fields) if (res.some((r) => r.test(k))) return v;
      return "-";
    };
    const detailField = (re) => {
      for (const td of Array.from(document.querySelectorAll("td"))) {
        const t = (td.textContent || "").replace(/\s+/g, " ").trim();
        const m = t.match(re);
        if (!m) continue;
        const after = t.slice((m.index ?? 0) + m[0].length).replace(/^\s*:\s*/, "").trim();
        if (after) return after;
        const next = (td.nextElementSibling?.textContent || "").replace(/\s+/g, " ").trim();
        if (next && !/^:/.test(next)) return next;
      }
      return "-";
    };
    const dokter = pick("dokter", "dpjp") !== "-" ? pick("dokter", "dpjp") : f(/^Dokter/i);
    const noResep = f(/^No Resep/i);
    const ruang = detailField(/^Ruangan\/Poli/i) !== "-" ? detailField(/^Ruangan\/Poli/i) : f(/^Ruangan\/?Poli/i, /^Ruangan/i);
    const tanggal = detailField(/^Tanggal Periksa/i) !== "-" ? detailField(/^Tanggal Periksa/i) : f(/^Tanggal/i, /^Tanggal & Jam/i);
    const jam = detailField(/^Jam Datang/i) !== "-" ? detailField(/^Jam Datang/i) : f(/^Jam/i);
    const sipDokter = f(/^SIP/i);
    const nama = pick("nama") !== "-" ? pick("nama") : f(/^Nama Pasien/i);
    const norm = pick("norm", "rekam_medis") !== "-" ? pick("norm", "rekam_medis") : f(/^No\.? RM/i);
    const alamat = patientAlamat(sections);
    const tglLahir = pick("tgl_lahir", "tglLahir").replace(/^:\s*/, "") || f(/^Tgl\.? Lahir/i);
    const noHp = pick("no_hp", "telepon").replace(/^:\s*/, "") || f(/^No HP/i);
    const penjamin = f(/^Penjamin/i);
    const alergi = f(/alergi/i);
    const bb = f(/berat|\bbb\b/i);
    const jkRaw = pick("jenis_kelamin", "jk").replace(/^:\s*/, "");
    const jkShort = /perempuan|^p$/i.test(jkRaw) ? "P" : /laki|^l$/i.test(jkRaw) ? "L" : jkRaw;
    const pasienJK = nama + (jkShort && jkShort !== "-" ? ` (${jkShort})` : "");
    const alergiBB = `${alergi !== "-" ? alergi : "-"} / ${bb !== "-" ? `BB ${bb}${/\bkg\b/i.test(bb) ? "" : " kg"}` : "- kg"}`;
    const sep = pick("no_sep", "sep") !== "-" ? pick("no_sep", "sep") : pick("kartu");
    const adminHtml = '<table class="rm-grid-table"><thead><tr>' + adminHeads.map((h) => `<th class="center">${esc(h)}</th>`).join("") + "</tr></thead><tbody><tr>" + adminHeads.map(() => '<td style="height:30px">&nbsp;</td>').join("") + "</tr></tbody></table>";
    const checklistHtml = checklists.length ? checklists.map(
      (g2) => `<table class="rm-grid-table"><thead><tr><th colspan="2">${esc(g2.title)}</th><th style="width:44px;">Y/T</th></tr></thead><tbody>` + g2.rows.map(
        ([n, item]) => `<tr><td class="center" style="width:28px;">${esc(n)}</td><td>${esc(item)}</td><td class="center">&nbsp;</td></tr>`
      ).join("") + "</tbody></table>"
    ).join("") : "";
    const changeSignHtml = '<table class="rm-grid-table"><tbody><tr><th colspan="2">PERUBAHAN RESEP</th></tr><tr><th>Tertulis</th><th>Menjadi</th></tr><tr><td style="height:28px">&nbsp;</td><td style="height:28px">&nbsp;</td></tr><tr><td class="center">Apoteker</td><td class="center">Disetujui Dokter</td></tr><tr><td style="height:28px">&nbsp;</td><td style="height:28px">&nbsp;</td></tr><tr><th colspan="2">WAKTU TUNGGU</th></tr><tr><td>Masuk</td><td>&nbsp;</td></tr><tr><td>Diserahkan</td><td>&nbsp;</td></tr><tr><td>Paraf Pasien/Keluarga</td><td style="height:30px">&nbsp;</td></tr></tbody></table>';
    const tm = (label, value, long = false) => `<div class="tm-row${long ? " long" : ""}"><span class="tm-label">${esc(label)}:</span><span class="tm-val">${value && value.trim() && value !== "-" ? esc(value) : "-"}</span></div>`;
    const medListHtml = meds.length ? meds.map(
      (m) => `<div class="med"><span class="med-no">${esc(m.no)}</span> <span class="med-name">${esc(m.name)}</span>` + (m.jml && m.jml !== "-" ? `, <span class="med-jml">Jml: ${esc(m.jml)}</span>` : "") + "</div>"
    ).join("") : '<div class="med">Tidak ada data obat pada halaman telaah.</div>';
    return `<section class="rm-page" id="rm-07">
${kop("RM. 07")}
<div class="rm-form-title">FORMULIR TELAAH RESEP, TELAAH OBAT &amp; EDUKASI FARMASI</div>

<div class="t-main">
  <div class="t-left">
    <div class="tm-card tm-card--small tm-card--left"><div class="tm-col">
      ${tm("Pasien", pasienJK)}
      ${tm("No. RM", norm)}
      ${tm("Tgl. Lahir", tglLahir)}
      ${tm("Alergi &amp; BB", alergiBB)}
      ${tm("Alamat", alamat, true)}
      ${tm("No HP", noHp)}
    </div></div>
    <div class="t-meds">${medListHtml}</div>
    ${adminHtml}
    <table class="rm-grid-table t-lampiran"><thead><tr>
      <th>Srt. Rujuk Balik</th><th>Surat Iter</th><th>Hasil Lab</th>
    </tr></thead><tbody><tr>
      <td style="height:26px">&nbsp;</td><td style="height:26px">&nbsp;</td><td style="height:26px">&nbsp;</td>
    </tr></tbody></table>
  </div>
  <div class="t-right">
    <div class="tm-card tm-card--right"><div class="tm-col">
      ${tm("Dokter", dokter)}
      ${tm("SIP Dokter", sipDokter)}
      ${tm("No Resep", noResep)}
      ${tm("No SEP", sep)}
      ${tm("Ruangan", ruang)}
      ${tm("Tanggal", tanggal)}
      ${tm("Jam", jam)}
      ${tm("Penjamin", penjamin)}
    </div></div>
    ${checklistHtml}
    ${changeSignHtml}
  </div>
</div>

<div class="footnote-rm">Obat tidak boleh diganti tanpa sepengetahuan Dokter.</div>
</section>`;
  }
  var RAD_LABEL = /^(No\.?\s*(RONTGEN|RM)|Umur|Tanggal Periksa|Bed|Status|Nama Pasien|Jenis Kelamin|Alamat|dr\.?\s*(Pengirim|DPJP)|Dokter (Pengirim|DPJP)|Diagnosa (Klinis|ICD))/i;
  var RAD_HEAD = /<div[^>]*class="[^"]*head-cetak-instansi[^"]*"[^>]*>\s*HASIL PEMERIKSAAN RADIOLOGI/i;
  function buildRadiologiSection(sections, src, id = "rm-08") {
    const rad = src ?? sections.find((s) => /^Radiologi/i.test(s.title));
    return splitByHeader(rad?.html ?? "", RAD_HEAD).map((part, i) => {
      const qr = sectionQrs([{ title: "Radiologi", html: part }], /Radiologi/i)[0] ?? "";
      return buildRadiologiSheet(sections, part, qr, i ? `${id}-${i + 1}` : id);
    }).join("");
  }
  function buildRadiologiSheet(sections, html, qrRad, id) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const fields = pairFields(doc, RAD_LABEL);
    const exams = [];
    let expertise = "";
    for (const tr of Array.from(doc.querySelectorAll("tr"))) {
      const c = Array.from(tr.cells).map(cellText);
      for (const cell of c) {
        const em = cell.match(/^expertise\s*:\s*([\s\S]+)$/i);
        if (em && !expertise) expertise = em[1].trim();
      }
      if (c.length >= 4 && /^\d+$/.test(c[0]) && c[1]) {
        exams.push({ name: c[1], golongan: c[2], kontras: c[3] });
      }
    }
    const f = (...res) => {
      for (const [k, v] of fields) if (res.some((r) => r.test(k))) return v;
      return "-";
    };
    const noRontgen = f(/^No\.? RONTGEN/i);
    const tglPeriksa = f(/^Tanggal Periksa/i);
    const umur = f(/^Umur/i);
    const norm = pick("norm", "rekam_medis") !== "-" ? pick("norm", "rekam_medis") : f(/^No\.? RM/i);
    const nama = pick("nama") !== "-" ? pick("nama") : f(/^Nama Pasien/i);
    const jkRaw = pick("jenis_kelamin", "jk").replace(/^:\s*/, "") || f(/^Jenis Kelamin/i);
    const jkShort = /perempuan|^p$/i.test(jkRaw) ? "P" : /laki|^l$/i.test(jkRaw) ? "L" : jkRaw;
    const alamat = patientAlamat(sections);
    const ruang = f(/^Bed|^Ruang/i);
    const status = f(/^Status/i);
    const dokterPengirim = f(/^dr\.? Pengirim|^Dokter Pengirim/i);
    const dokterDpjpRaw = f(/^dr\.? DPJP|^Dokter DPJP/i);
    const sigDoctor = (doc.body.textContent || "").replace(/\s+/g, " ").match(/\(\s*([^)]{3,80})\s*\)/)?.[1]?.trim() || "-";
    const dokterDpjp = dokterDpjpRaw !== "-" ? dokterDpjpRaw : sigDoctor !== "-" ? sigDoctor : doctorFromQr(qrRad);
    const diagnosa = f(/^Diagnosa Klinis/i);
    const diagnosaIcd = f(/^Diagnosa ICD/i);
    const golongan = exams.length ? exams[0].golongan || "-" : "-";
    const examRows = exams.length ? exams.map(
      (ex, i) => `<tr><td class="center">${i + 1}</td><td><strong>${esc(ex.name)}</strong></td><td class="center">${esc(ex.golongan || "-")}</td><td class="center">${esc(ex.kontras || "-")}</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Radiologi ${i + 1}"></td></tr>`
    ).join("") : '<tr><td class="center">-</td><td>Tidak ada jenis pemeriksaan tercatat.</td><td class="center">-</td><td class="center">-</td><td class="center">-</td></tr>';
    const expertiseHtml = expertise ? expertise.replace(/^\s*\d+\.\s*/, "").replace(/^\n+|\n+$/g, "").split("\n").map((l) => l.trim()).map((l) => l ? `<div>${esc(l)}</div>` : "<div>&nbsp;</div>").join("") : "<div>Tidak ada expertise tercatat pada halaman.</div>";
    return `<section class="rm-page" id="${esc(id)}">
${kop("RM. 08")}
<div class="rm-form-title">HASIL PEMERIKSAAN RADIOLOGI</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Rontgen", noRontgen, true)}
    ${idRow("Tanggal Periksa", tglPeriksa)}
    ${idRow("No. Rekam Medis", norm)}
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("Jenis Kelamin", jkShort !== "-" ? `Laki-laki / Perempuan (${jkShort})` : "-")}
    ${idRow("Alamat", alamat)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Umur / Tgl. Lahir", umur)}
    ${idRow("Ruang / Asal", ruang !== "-" && status !== "-" ? `${ruang} (Status: ${status})` : ruang)}
    ${idRow("Dokter Pengirim", dokterPengirim)}
    ${idRow("Dokter DPJP / Penilai", dokterDpjp)}
    ${idRow("Diagnosa Klinis", diagnosa)}
    ${idRow("Diagnosa ICD", diagnosaIcd)}
    ${idRow("Status Pasien", status)}
    ${idRow("Golongan / Jenis", `${golongan} \u2014 ${exams[0]?.kontras || "-"}`)}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 32px;">NO</th>
    <th>JENIS PEMERIKSAAN</th>
    <th style="width: 110px;">GOLONGAN</th>
    <th style="width: 110px;">KONTRAS</th>
    <th class="center" style="width: 56px;">VER (&#10003;)</th>
  </tr></thead>
  <tbody>${examRows}</tbody>
</table>

<table class="rm-grid-table">
  <thead><tr><th>URAIAN EXPERTISE &amp; KESAN PEMERIKSAAN</th></tr></thead>
  <tbody><tr><td style="padding: 8px 10px; line-height: 1.5;">${expertiseHtml}</td></tr></tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>No. Rontgen : ${esc(noRontgen)}</div>
    <div>Jenis Pemeriksaan : ${esc(golongan)}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter Penilai</div>
    ${qrRad ? `<img class="rm-sig-qr" src="${esc(qrRad)}" alt="QR tanda tangan radiolog" width="80" height="80" />` : ""}
    ${qrRad ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(dokterDpjp)} )</div>
  </div>
</div>
</section>`;
  }
  var triaseRowsDariIgd = (sections) => {
    for (const s of sections) {
      if (!/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(s.title)) continue;
      const d = new DOMParser().parseFromString(s.html, "text/html");
      for (const t of Array.from(d.querySelectorAll("table"))) {
        const head = Array.from(t.rows[0]?.cells || []).map((td) => cellText(td)).join(" ");
        if (!/^Triase/i.test(head)) continue;
        return Array.from(t.rows).slice(1).map((tr) => Array.from(tr.cells).map(cellText));
      }
    }
    return [];
  };
  function buildTriageSection(sections) {
    const tri = sections.find((s) => /^Triage/i.test(s.title));
    const qrTriage = sectionQrs(sections, /^Triage/i)[0] ?? "";
    const doc = tri ? new DOMParser().parseFromString(tri.html, "text/html") : null;
    const fields = /* @__PURE__ */ new Map();
    let dokterPemeriksa = "-";
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td2) => (td2.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
        );
        for (let i = 0; i < c.length - 2; i++) {
          const label = c[i].replace(/:$/, "").trim();
          if (c[i + 1] !== ":") continue;
          if (label && c[i + 2] && !fields.has(label)) fields.set(label, c[i + 2]);
        }
        for (const cell of c) {
          const m = cell.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);
          if (!m || m[2].includes(":") || m[2].length > 120) continue;
          if (!fields.has(m[1].trim())) fields.set(m[1].trim(), m[2].trim());
        }
      }
      const dm = (doc.textContent || "").replace(/\s+/g, " ").match(/Dokter yang memeriksa\s*\(([^)]+)\)/i);
      if (dm) dokterPemeriksa = dm[1].trim();
    }
    const f = (...res) => {
      for (const [k, v] of fields) if (res.some((r) => r.test(k))) return v;
      return "-";
    };
    const norm = pick("norm", "rekam_medis") !== "-" ? pick("norm", "rekam_medis") : f(/^No\.?\s*RM/i);
    const nama = pick("nama") !== "-" ? pick("nama") : f(/^Nama$/i);
    const tanggal = f(/^Tanggal$/i);
    const jamDatang = f(/^Jam Datang/i);
    const jamRegistrasi = f(/^Jam Registrasi/i);
    const caraDatang = f(/^Cara Datang/i);
    const diantarPolisi = f(/^Diantar Polisi/i);
    const noId = f(/^No\.?\s*ID/i);
    const pengantar = f(/^Pengantar Pasien/i);
    const riwayat = f(/^Riwayat Penyakit Dahulu/i);
    const keluhan = f(/^Keluhan Utama/i);
    const keadaanUmum = f(/^Keadaan Umum/i);
    const suhu = f(/^Suhu/i);
    const nadi = f(/^Nadi/i);
    const rr = f(/^RR$/i);
    const td = f(/^Tekanan Darah/i);
    const jam = f(/^Jam$/i);
    const noAntrian = f(/^No\.?\s*Antrian/i);
    const status = f(/^Status/i);
    return `<section class="rm-page" id="triage">
${kop("TRIAGE")}
<div class="rm-form-title">TRIAGE TERINTEGRASI &amp; PENGKAJIAN AWAL IGD</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Rekam Medis", norm, true)}
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("Tanggal", tanggal)}
    ${idRow("Jam Datang", jamDatang)}
    ${idRow("Jam Registrasi", jamRegistrasi)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Cara Datang", caraDatang)}
    ${idRow("Diantar Polisi", diantarPolisi)}
    ${idRow("No. ID", noId)}
    ${idRow("Pengantar Pasien", pengantar)}
    ${idRow("Status Triage", status, true)}
  </table></div>
</div>

<div class="sub-heading-rm">ANAMNESA &amp; RIWAYAT</div>
<table class="rm-grid-table"><tbody>
  ${idRow("Riwayat Penyakit Dahulu", riwayat)}
  ${idRow("Keluhan Utama", keluhan)}
</tbody></table>

<div class="sub-heading-rm">TANDA VITAL &amp; PEMERIKSAAN</div>
<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${idRow("Keadaan Umum", keadaanUmum)}
    ${idRow("Suhu (\xB0C)", suhu)}
    ${idRow("Nadi (x/menit)", nadi)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("RR (x/menit)", rr)}
    ${idRow("Tekanan Darah (mmHg)", td)}
    ${idRow("Jam", jam)}
    ${idRow("No. Antrian", noAntrian)}
  </table></div>
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>Status Triage : ${esc(status)}</div>
    <div>No. Antrian : ${esc(noAntrian)}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter yang Memeriksa</div>
    ${qrTriage ? `<img class="rm-sig-qr" src="${esc(qrTriage)}" alt="QR tanda tangan dokter" width="80" height="80" />` : ""}
    ${qrTriage ? "" : '<div class="rm-sig-space"></div>'}
    <div class="rm-sig-name">( ${esc(dokterPemeriksa !== "-" ? dokterPemeriksa : doctorFromQr(qrTriage))} )</div>
  </div>
</div>
</section>`;
  }
  function buildPengkajianIgdSection(sections) {
    const src = sections.find((s) => /PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(s.title));
    const doc = src ? new DOMParser().parseFromString(src.html, "text/html") : null;
    const tables = doc ? Array.from(doc.querySelectorAll("table")) : [];
    const cell = (td) => (td.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim();
    const rows = (t) => t ? Array.from(t.rows).map((tr) => Array.from(tr.cells).map(cell)) : [];
    const find = (re) => {
      const t = tables.find(
        (tb2) => re.test((tb2.rows[0]?.textContent || "").replace(/\s+/g, " ").trim())
      );
      return rows(t);
    };
    const byText = (re) => {
      const t = tables.find((tb2) => re.test(tb2.textContent || ""));
      return rows(t);
    };
    const triase = find(/^Triase/i);
    const nyeri = find(/^Pengkajian\s*0\s*1\s*2\s*Nilai/i);
    const jatuh1 = byText(/HUMPTY DUMPTY/i);
    const jatuh2 = byText(/MORSE FALL SCALE/i);
    const objektif = find(/^Objektif\s*Kelainan/i);
    const diagnosaUtama = find(/^Diagnosa Utama$/i);
    const diagnosaBanding = find(/^Diagnosa Banding$/i);
    const tindakan = find(/^Tindakan$/i);
    const obat = find(/^Pukul\s*Nama Obat/i);
    const perawat = find(/^No\s*Nama Perawat IGD/i);
    const grid = (head, body) => {
      const rows2 = Array.isArray(body) ? body.join("") : body;
      return '<table class="rm-grid-table"><thead><tr>' + head.map((h) => `<th>${esc(h)}</th>`).join("") + "</tr></thead><tbody>" + (rows2 || '<tr><td colspan="' + head.length + '">-</td></tr>') + "</tbody></table>";
    };
    const triaseRows = triase.slice(1).map((r) => {
      const on = (r[0] || "").includes("\u2713");
      const c = on ? r.slice(1) : r;
      return `<tr${on ? ' style="font-weight:bold;background-color:#F0F0F0;"' : ""}>` + c.map((x) => `<td>${esc(x || "-")}</td>`).join("") + "</tr>";
    }).join("");
    const nyeriRows = nyeri.slice(1).map(
      (r) => "<tr>" + r.map((x, i) => `<td${i === 0 ? "" : ' class="center"'}>${esc(x || "-")}</td>`).join("") + "</tr>"
    ).join("");
    const skorRows = (data) => data.slice(1).map((r) => {
      if (/^(JUMLAH SKOR|Keterangan Hasil|Catatan)$/i.test(r[0] || "")) {
        return '<tr><td colspan="5"><strong>' + esc(r[0]) + "</strong> : " + esc(r.slice(1).filter(Boolean).join(" ") || "-") + "</td></tr>";
      }
      const last = r[r.length - 1] || "";
      const selected = /^\d+$/.test(last);
      const cells = r.length >= 5 ? r : ["", "", r[0] || "", r[1] || "", ""];
      return `<tr${selected ? ' style="font-weight:bold;"' : ""}>` + cells.map((x) => `<td>${esc(x || "&nbsp;")}</td>`).join("") + "</tr>";
    }).join("");
    const objektifRows = objektif.slice(1).map(
      (r) => `<tr><td>${esc(r[0] || "-")}</td><td>${esc(r.slice(1).filter(Boolean).join(" ") || "-")}</td></tr>`
    ).join("");
    const diagnosaRows = [
      ["DIAGNOSA UTAMA", diagnosaUtama.slice(1).flat().filter(Boolean).join(" ") || "-"],
      ["DIAGNOSA BANDING", diagnosaBanding.slice(1).flat().filter(Boolean).join(" ") || "-"]
    ].map(
      ([k, val2]) => `<tr><td style="width:180px;"><strong>${k}</strong></td><td>${esc(val2)}</td></tr>`
    ).join("");
    const tindakanVal = tindakan.slice(1).flat().filter(Boolean).join(" ") || "-";
    const obatRows = obat.slice(1).filter((r) => r.some(Boolean)).map(
      (r) => "<tr>" + r.slice(0, 4).map((x) => `<td>${esc(x || "-")}</td>`).join("") + "</tr>"
    ).join("");
    const perawatVal = perawat.slice(1).flat().filter(Boolean).join(" \xB7 ");
    const triasePilih = triaseRowsDariIgd(sections).find((r) => (r[0] || "").includes("\u2713"))?.slice(1) || [];
    const skorRingkas = (data) => {
      const skor = data.find((r) => /^JUMLAH SKOR/i.test(r[0] || ""));
      const simpulan = data.find((r) => /^Keterangan Hasil/i.test(r[0] || ""));
      const angka = skor?.slice(1).filter(Boolean).join(" ") || "-";
      return simpulan ? `${angka} \xB7 ${simpulan.slice(1).filter(Boolean).join(" ")}` : angka;
    };
    const morseScore = Number((skorRingkas(jatuh2).match(/\d+/) || ["0"])[0]);
    const morseKet = morseScore >= 45 ? "RISIKO JATUH TINGGI (\u226545)" : morseScore >= 25 ? "RISIKO JATUH SEDANG (25\u201344)" : "RISIKO JATUH RENDAH (0\u201324)";
    const checked = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || "-";
    const afterLabel = (re) => {
      const label = Array.from(doc?.querySelectorAll("label") || []).find(
        (l) => re.test((l.textContent || "").replace(/\s+/g, " ").trim())
      );
      return (label?.nextElementSibling?.textContent || "").replace(/\s+/g, " ").trim() || "-";
    };
    const planningText = (() => {
      const marker = Array.from(doc?.querySelectorAll("div") || []).find(
        (d) => /^Planning\s*:\s*Terapy/i.test((d.textContent || "").trim().slice(0, 80))
      );
      return (marker?.nextElementSibling?.textContent || "").replace(/[ \t]+/g, " ").trim() || "-";
    })();
    const uraian = pick("pengkajian_keperawatan");
    const [rps, rpd, rpo] = (() => {
      const bagian = uraian.split(/\n\s*RPD\s*:/i);
      const keluhan = bagian[0].replace(/^\s*Subjektif\s*:\s*/i, "").trim() || "-";
      const sisa = (bagian[1] || "").split(/\n\s*RPO\s*:/i);
      return [keluhan, sisa[0]?.trim() || "-", sisa[1]?.trim() || "-"];
    })();
    const radioTeks = (name, teks) => checked(name) === "ya" ? pick(teks) : checked(name) === "tidak" ? "Tidak" : "-";
    const checkedAll = (name) => {
      const vals = Array.from(
        document.querySelectorAll(`input[name="${name}"]:checked`)
      ).map((x) => x.value).filter(Boolean);
      return vals.length ? vals.join(", ") : "-";
    };
    const labelOf = (v) => ({
      tanpa_bantuan: "Jalan Tanpa Bantuan",
      kursi_roda: "Kursi Roda",
      tempat_tidur: "Brankar",
      dengan_bantuan: "Dengan Bantuan",
      tidak_ada: "Tidak mengalami cedera",
      lantas: "KLL",
      lainnya: "Lainnya",
      tidak: "Tidak Terganggu",
      ya: "Ada Gangguan",
      Bpjs: "BPJS Kesehatan"
    })[v] || v || "-";
    const igdRow = (label, html) => `<tr><td style="width:175px;"><strong>${label}</strong></td><td>${html}</td></tr>`;
    const idOpt = (label, html) => `<tr><td class="lbl">${label}</td><td class="col">:</td><td class="val">${html}</td></tr>`;
    const bb = Number(pick("nutrisi_bb"));
    const tb = Number(pick("nutrisi_tb")) / 100;
    const imt = bb > 0 && tb > 0 ? (bb / (tb * tb)).toFixed(1).replace(".", ",") : "-";
    return `<section class="rm-page" id="pengkajian-igd">
${kop("PENGKAJIAN IGD")}
<div class="rm-form-title">LEMBAR PENGKAJIAN INSTALASI GAWAT DARURAT</div>

<div class="igd-masthead">
  <div class="igd-masthead-label">Pasien \xB7 Instalasi Gawat Darurat</div>
  <div class="igd-masthead-name">${esc(pick("nama"))}</div>
</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"), true)}
    ${idRow("Tgl. Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", /perempuan|^p$/i.test(pick("jenis_kelamin", "jk")) ? "Perempuan (P)" : "Laki-laki (L)")}
    ${idRow("Agama / Suku", `${afterLabel(/^Agama/i)} / ${afterLabel(/^Suku/i)}`)}
    ${idRow("Pekerjaan", pick("pekerjaan"))}
    ${idRow("No. Telp / HP", pick("no_hp", "telepon"))}
    ${idRow("Nama Orangtua / Pasangan", `${pick("nama_orangtua")} / ${pick("nama_pasangan")}`)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Masuk", pick("tgl_masuk"))}
    ${idRow("Tiba di IGD / Diperiksa", `Pukul ${pick("pukul_tiba_di_rs")} / Diperiksa Pukul ${pick("pukul_diperiksa")}`)}
    ${idRow("Prosedur Masuk", labelOf(checked("kaji[prosedur_masuk]")))}
    ${idRow("Cara Masuk", labelOf(checked("kaji[cara_masuk]")))}
    ${idRow("Penyebab Cedera", labelOf(checked("kaji[penyebab_cedera]")))}
    ${idRow("Status Alergi", radioTeks("kaji[status_alergi]", "status_alergi_text"))}
    ${idRow("Gangguan Perilaku", labelOf(checked("kaji[gangguan_perilaku]")))}
    ${idOpt("Status Kehamilan", /perempuan|^p$/i.test(pick("jenis_kelamin", "jk")) ? esc(pick("status_kehamilan")) : '<span class="filter-note">Tidak berlaku (Pasien Laki-laki \u2014 disaring otomatis)</span>')}
  </table></div>
</div>

<div class="igd-summary">
  <div><span>Triase</span><b>${esc(triasePilih[0] || "-")} ${esc(triasePilih[1] || "")}</b></div>
  <div><span>GCS / Kesadaran</span><b>${esc(pick("vital_gcs"))} \xB7 ${esc(pick("vital_kesadaran"))}</b></div>
  <div><span>SpO2 / Nadi</span><b>${esc(pick("vital_spo"))} \xB7 ${esc(pick("vital_nadi"))}</b></div>
  <div><span>Risiko Jatuh (Morse)</span><b>${esc(skorRingkas(jatuh2))}</b></div>
</div>

<div class="sub-heading-rm">KONDISI AWAL &amp; RIWAYAT</div>
<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${idRow("Prosedur Masuk", checked("kaji[prosedur_masuk]"))}
    ${idRow("Cara Masuk", checked("kaji[cara_masuk]"))}
    ${idRow("Status Alergi", radioTeks("kaji[status_alergi]", "status_alergi_text"))}
    ${idRow("Status Psikologi", checked("kaji[status_psikologi]"))}
    ${idRow("Status Sosial", checked("kaji[status_sosial]"))}
    ${idRow("Status Ekonomi", checked("kaji[status_ekonomi]"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Nutrisi (BB/TB)", `${pick("nutrisi_bb")} kg / ${pick("nutrisi_tb")} cm`)}
    ${idRow("Kognitif", checked("kaji[fungsi_kognitif]"))}
    ${idRow("Motorik", checked("kaji[fungsi_motorik]"))}
    ${idRow("Hambatan Pembelajaran", radioTeks("kaji[hambatan_pembelajaran]", "terhambat_pembelajaran_text"))}
    ${idRow("Kebutuhan Edukasi", checked("kaji[kebutuhan_edukasi]"))}
    ${idRow("Penerjemah", radioTeks("kaji[dibutuhkan_penerjemah]", "penerjemah_text"))}
  </table></div>
</div>

<div class="sub-heading-rm">TANDA VITAL SAAT MASUK</div>
${grid(
      ["TEKANAN DARAH", "NADI", "PERNAPASAN", "SUHU", "SpO2", "GCS", "GCS (E/V/M)", "KESADARAN"],
      [
        "<tr>" + [
          normVital(pick("vital_td")),
          pick("vital_nadi"),
          pick("vital_nafas"),
          pick("vital_suhu"),
          pick("vital_spo"),
          pick("vital_gcs")
        ].map((x) => `<td class="center">${esc(x)}</td>`).join("") + `<td class="center">${esc([pick("vital_e"), pick("vital_m"), pick("vital_v")].join("/"))}</td><td class="center">${esc(pick("vital_kesadaran"))}</td></tr>`
      ]
    )}

<div class="sub-heading-rm">KONDISI SAAT PINDAH / PULANG DARI IGD</div>
${grid(
      ["PUKUL", "TEKANAN DARAH", "NADI", "PERNAPASAN", "SUHU", "SpO2", "GCS", "KESADARAN"],
      [
        "<tr>" + [
          pick("waktu_pasien_pulang"),
          normVital(pick("kondisi_pasien_td")),
          pick("kondisi_pasien_nadi"),
          pick("kondisi_pasien_nafas"),
          pick("kondisi_pasien_suhu"),
          pick("kondisi_pasien_spo"),
          pick("kondisi_pasien_gcs"),
          pick("kondisi_pasien_kesadaran")
        ].map((x) => `<td class="center">${esc(x)}</td>`).join("") + "</tr>"
      ]
    )}

<div class="sub-heading-rm">TRIASE (DIISI OLEH DOKTER)</div>
${grid(["SKALA TRIASE", "KETERANGAN", "RESPON TIME"], triaseRows)}

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">II. PENGKAJIAN PSIKOSOSIAL, SPIRITUAL, EKONOMI, NUTRISI &amp; FUNGSIONAL</td></tr></thead>
  <tbody>
    ${igdRow("Status Psikologi", checked("kaji[status_psikologi]") || "-")}
    ${igdRow("Status Sosial &amp; Spiritual", `Hubungan keluarga: ${checked("kaji[status_sosial]") || "-"} | Kegiatan keagamaan: ${esc(pick("status_spiritual"))}`)}
    ${igdRow("Status Pembiayaan", labelOf(checked("kaji[status_ekonomi]")))}
    ${igdRow("Antropometri &amp; Nutrisi", `BB: <strong>${esc(pick("nutrisi_bb"))} Kg</strong> | TB: <strong>${esc(pick("nutrisi_tb"))} Cm</strong> | IMT: <strong>${imt} kg/m&sup2;</strong> | Konsul Gizi: ${checked("kaji[nutrisi_konsul]") || "-"}`)}
    ${igdRow("Status Fungsional", `Kognitif: ${checked("kaji[fungsi_kognitif]") || "-"} | Motorik: ${checked("kaji[fungsi_motorik]") || "-"}`)}
    ${igdRow("Komunikasi &amp; Edukasi", `Hambatan: ${radioTeks("kaji[hambatan_pembelajaran]", "terhambat_pembelajaran_text")} | Penerjemah: ${radioTeks("kaji[dibutuhkan_penerjemah]", "penerjemah_text")} | Kebutuhan Edukasi: ${checkedAll("kaji[kebutuhan_edukasi]")}`)}
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">III. ASESMEN NYERI \u2014 WONG BAKER / NRS (PQRST)</td></tr></thead>
  <tbody>
    <tr>
      <td style="width:165px;"><strong>Skala Wong Baker</strong></td>
      <td><span class="filter-note">Skala nyeri Wong Baker (0\u20135) \u2014 lihat halaman asal; di dossier ini tidak ditampilkan sebagai gambar.</span></td>
    </tr>
    <tr><td><strong>(P) Faktor Pencetus</strong></td><td>${esc(pick("faktor_pencetus"))}</td></tr>
    <tr><td><strong>(Q) Kualitas Nyeri</strong></td><td>${checked("kaji[qualitas]") || "-"}</td></tr>
    <tr><td><strong>(R) Lokasi &amp; Penjalaran</strong></td><td>${esc(pick("lokasi_nyeri"))} &nbsp;|&nbsp; <strong>Menjalar:</strong> ${checked("kaji[nyeri_menjalar]") || "-"}</td></tr>
    <tr><td><strong>(S) Skala Nyeri (NRS 0\u201310)</strong></td><td>${esc(pick("skala_nyeri"))} &nbsp;|&nbsp; Wong Baker: ${esc(pick("emo_wong"))}</td></tr>
    <tr><td><strong>(T) Waktu &amp; Frekuensi</strong></td><td>${esc(pick("lamanya_nyeri"))} &nbsp;|&nbsp; ${checked("kaji[nyeri_frekwensi]") || "-"}</td></tr>
  </tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="5">IV. PENGKAJIAN NYERI (FLACC)</td></tr>
    <tr><th>PENGKAJIAN</th><th>0</th><th>1</th><th>2</th><th>NILAI</th></tr>
  </thead>
  <tbody>${nyeriRows || '<tr><td colspan="5">-</td></tr>'}</tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="5">V. SKRINING RISIKO JATUH \u2014 PARAMETER PERTAMA (HUMPTY DUMPTY)</td></tr>
    <tr><th>NO</th><th>PARAMETER</th><th>KRITERIA</th><th>NILAI</th><th>SKOR</th></tr>
  </thead>
  <tbody>${skorRows(jatuh1)}</tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="5">VI. SKRINING RISIKO JATUH \u2014 PARAMETER KEDUA (MORSE FALL SCALE)</td></tr>
    <tr><th>NO</th><th>PARAMETER</th><th>KRITERIA PENILAIAN</th><th>NILAI</th><th>SKOR PASIEN</th></tr>
  </thead>
  <tbody>
    ${skorRows(jatuh2)}
    <tr><td colspan="4" style="text-align: right;"><strong>TOTAL SKOR MORSE</strong></td><td class="center"><strong>${esc(skorRingkas(jatuh2))}</strong></td></tr>
    <tr><td colspan="5"><strong>INTERPRETASI &amp; PROTOKOL:</strong> ${esc(morseKet)} \u2014 pasang gelang identitas risiko jatuh, side rail &amp; kunci roda, edukasi pencegahan jatuh.</td></tr>
  </tbody>
</table>

<div class="two-col-grid">
  <div class="col-half">
    <table class="rm-table" style="margin-bottom: 0; height: 100%;">
      <thead>
        <tr class="sec-hdr"><td colspan="3">VI-A. PERBANDINGAN TANDA VITAL (OBJEKTIF)</td></tr>
        <tr><th>PARAMETER</th><th style="width: 108px;">AWAL IGD</th><th style="width: 108px;">PINDAH HCU</th></tr>
      </thead>
      <tbody>
        ${[
      ["Tekanan Darah (TD)", pick("vital_td"), pick("kondisi_pasien_td")],
      ["Nadi (HR)", pick("vital_nadi"), pick("kondisi_pasien_nadi")],
      ["Pernapasan (RR)", pick("vital_nafas"), pick("kondisi_pasien_nafas")],
      ["Suhu Aksila", pick("vital_suhu"), pick("kondisi_pasien_suhu")],
      ["Saturasi Oksigen (SpO2)", pick("vital_spo"), pick("kondisi_pasien_spo")],
      ["Kesadaran", pick("vital_kesadaran"), pick("kondisi_pasien_kesadaran")],
      ["Skor GCS", pick("vital_gcs"), pick("kondisi_pasien_gcs")]
    ].map(
      ([k, a, b]) => `<tr><td><strong>${esc(k)}</strong></td><td class="center">${esc(a)}</td><td class="center">${esc(b)}</td></tr>`
    ).join("")}
      </tbody>
    </table>
  </div>
  <div class="col-half">
    <table class="rm-table" style="margin-bottom: 0;">
      <thead>
        <tr class="sec-hdr"><td colspan="2">VI-B. PEMERIKSAAN FISIK LOKALIS &amp; PENUNJANG</td></tr>
        <tr><th>OBJEKTIF</th><th>KELAINAN</th></tr>
      </thead>
      <tbody>${objektifRows}</tbody>
    </table>
  </div>
</div>

<div class="rm-top-meta">
  <span>Halaman 2 dari 2 (Lanjutan Pengkajian Medis &amp; Terapi IGD)</span>
  <span>RM. 02 / IGD</span>
</div>
<div class="running-header-box">
  <div><strong>RSUD H. ABDUL MANAP KOTA JAMBI</strong></div>
  <div>Nama: <strong>${esc(pick("nama"))}</strong></div>
  <div>No. RM: <strong>${esc(pick("norm", "rekam_medis"))}</strong></div>
  <div>Tgl. Lahir / Umur: <strong>${esc(pick("tgl_lahir", "tglLahir"))}</strong></div>
  <div>Tgl. Masuk IGD: <strong>${esc(pick("tgl_masuk"))}</strong></div>
</div>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">V. PENGKAJIAN MEDIS DOKTER IGD \u2014 ANAMNESIS (SUBJEKTIF)</td></tr></thead>
  <tbody>
    <tr><td style="width:155px;"><strong>(a) Keluhan Utama &amp; RPS</strong></td><td>${nl2br(rps)}</td></tr>
    <tr><td><strong>(b) Riwayat Penyakit Dahulu (RPD)</strong></td><td>${nl2br(rpd)}</td></tr>
    <tr><td><strong>(c) Riwayat Penggunaan Obat (RPO)</strong></td><td>${nl2br(rpo)}</td></tr>
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">VI. DIAGNOSA &amp; TINDAKAN & PLANNING TERINTEGRASI</td></tr></thead>
  <tbody>
    ${diagnosaRows}
    <tr><td style="width:165px;"><strong>TINDAKAN</strong></td><td>${esc(tindakanVal)}</td></tr>
    <tr>
      <td><strong>PEMERIKSAAN PENUNJANG</strong></td>
      <td>EKG: ${esc(afterLabel(/^EKG$/i))} &nbsp;|&nbsp; Radiologi: ${esc(afterLabel(/^Radiologi$/i))} &nbsp;|&nbsp; Laboratorium: ${esc(afterLabel(/^Laboratorium$/i))}</td>
    </tr>
  </tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">IX. PENGKAJIAN KEPERAWATAN &amp; MEDIS</td></tr></thead>
  <tbody><tr><td style="width:165px;"><strong>PENGKAJIAN KEPERAWATAN</strong></td><td>${nl2br(pick("pengkajian_keperawatan"))}</td></tr></tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">X. PLANNING / TERAPI TERINTEGRASI</td></tr></thead>
  <tbody><tr>
    <td style="width:165px;vertical-align:top;"><strong>PLANNING / TERAPI</strong></td>
    <td>${nl2br(planningText).replace(/(Konsul dr\.?[^<]*?)(?=<br\/>|$)/gi, "<strong>$1</strong>").replace(/(Plan\s*:|Terapi\s*:|Dx\s*:|Masalah\s*:)/gi, "<strong>$1</strong>")}</td>
  </tr></tbody>
</table>

<table class="rm-table">
  <thead><tr class="sec-hdr"><td colspan="2">XI. DISPOSISI TINDAK LANJUT</td></tr></thead>
  <tbody>
    <tr><td style="width:165px;"><strong>Tindak Lanjut</strong></td><td>${checked("medis[tindak_lanjut]") || "-"}</td></tr>
    <tr><td><strong>Ruangan Rawat Inap</strong></td><td>${esc(pick("tindak_lanjut_ruangan_ranap"))} \u2014 Indikasi: ${esc(pick("tindak_lanjut_indikasi_ranap"))}</td></tr>
    <tr><td><strong>Pukul Pindah / Pulang</strong></td><td>${esc(pick("waktu_pasien_pulang"))}</td></tr>
    <tr><td><strong>Kondisi Pasien Saat Pindah</strong></td><td>TD ${esc(normVital(pick("kondisi_pasien_td")))} | Nadi ${esc(pick("kondisi_pasien_nadi"))} | RR ${esc(pick("kondisi_pasien_nafas"))} | Suhu ${esc(pick("kondisi_pasien_suhu"))} | SpO2 ${esc(pick("kondisi_pasien_spo"))} | GCS ${esc(pick("kondisi_pasien_gcs"))} | Kesadaran ${esc(pick("kondisi_pasien_kesadaran"))}</td></tr>
  </tbody>
</table>

<div class="sub-heading-rm">OBAT / TERAPI IGD</div>
${grid(["PUKUL", "NAMA OBAT", "DOSIS / RUTE", "TANDA TANGAN"], obatRows)}

<div class="sub-heading-rm">PERAWAT IGD</div>
<table class="rm-grid-table"><tbody><tr><td>${esc(perawatVal || "-")}</td></tr></tbody></table>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>Ruangan : ${esc(pick("tindak_lanjut_ruangan_ranap"))}</div>
    <div>Perawat Ruangan : ${esc(pick("perawat_ruangan"))}</div>
  </div>
  <div class="rm-sig-box">
    <div>Dokter IGD</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(pick("dokter_igd", "dokter"))} )</div>
  </div>
</div>
</section>`;
  }
  function sectionField(sections, labelRe) {
    const priority = [/^Telaah/i, /^SBPK/i, /^Radiologi/i];
    const rank = (title) => {
      const i = priority.findIndex((r) => r.test(title));
      return i < 0 ? 99 : i;
    };
    const ordered = [...sections].sort((a, b) => rank(a.title) - rank(b.title));
    for (const s of ordered) {
      const doc = new DOMParser().parseFromString(s.html, "text/html");
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td) => (td.textContent || "").replace(/\s+/g, " ").trim()
        );
        for (let i = 0; i < c.length - 2; i++) {
          if (labelRe.test(c[i]) && c[i + 1] === ":" && c[i + 2]) return c[i + 2];
        }
        for (const cell of c) {
          const m = cell.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);
          if (m && labelRe.test(m[1].trim()) && m[2] && !m[2].includes(":") && m[2].length <= 160)
            return m[2].trim();
        }
      }
    }
    return "-";
  }
  var patientAlamat = (sections) => {
    const v = val("alamat").replace(/^\s*:\s*/, "").trim();
    return v || sectionField(sections, /^Alamat/i);
  };
  var sectionQrs = (sections, titleRe) => {
    const src = sections.find((s) => titleRe.test(s.title));
    if (!src) return [];
    const doc = new DOMParser().parseFromString(src.html, "text/html");
    return Array.from(doc.querySelectorAll("img")).map((img) => img.getAttribute("src") || "").filter((url) => /qr|barcode/i.test(url));
  };
  var doctorFromQr = (url) => {
    if (!url) return "-";
    try {
      const decoded = decodeURIComponent(url.replace(/\+/g, " "));
      const m = decoded.match(/approve\s*([\s\S]*?)\s+tgl\b/i)?.[1] || decoded.match(/(dr\.[^&]+)/i)?.[1] || "";
      return m.split(/\s+(?:tgl|jam)\b/i)[0].replace(/\s+/g, " ").trim() || "-";
    } catch {
      return "-";
    }
  };
  var normVital = (v) => /\d/.test(v) ? v : "-";
  function formFields(sections, titleRe) {
    const src = sections.find((s) => titleRe.test(s.title));
    const doc = src ? new DOMParser().parseFromString(src.html, "text/html") : null;
    const out = /* @__PURE__ */ new Map();
    if (!doc) return out;
    for (const tr of Array.from(doc.querySelectorAll("tr"))) {
      const c = Array.from(tr.cells).map(
        (td) => (td.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
      );
      for (let i = 0; i < c.length - 2; i++) {
        const label = c[i].replace(/^[-:\s]+|[\s:]+$/g, "");
        if (!label || c[i + 1] !== ":" || !c[i + 2] || out.has(label)) continue;
        out.set(label, c[i + 2]);
      }
      for (const cell of c) {
        const m = cell.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);
        if (m && !m[2].includes(":") && m[2].length <= 120 && !out.has(m[1].trim()))
          out.set(m[1].trim(), m[2].trim());
      }
    }
    return out;
  }
  var decodeEntities = (s) => s.replace(/&gt;/gi, ">").replace(/&lt;/gi, "<").replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&nbsp;/gi, " ");
  function cellText(td) {
    return decodeEntities(
      (td.innerHTML || "").replace(/<!--[\s\S]*?-->/g, "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
    );
  }
  function splitByHeader(html, headerRe) {
    const re = new RegExp(
      headerRe.source,
      headerRe.flags.includes("g") ? headerRe.flags : headerRe.flags + "g"
    );
    const marks = Array.from(html.matchAll(re)).map((m) => m.index ?? 0);
    if (marks.length < 2) return [html];
    return marks.map((at, i) => html.slice(at, i + 1 < marks.length ? marks[i + 1] : html.length));
  }
  function pairFields(doc, labelRe) {
    const out = /* @__PURE__ */ new Map();
    for (const tr of Array.from(doc.querySelectorAll("tr"))) {
      const c = Array.from(tr.cells).map(cellText);
      for (let i = 0; i < c.length - 1; i++) {
        const label = c[i].replace(/^[-:\s]+|[\s:]+$/g, "").trim();
        if (!labelRe.test(label) || out.has(label)) continue;
        const value = c[i + 1].replace(/^:\s*/, "").trim();
        if (value) out.set(label, value);
      }
    }
    return out;
  }
  var fieldValue = (fields, ...res) => {
    for (const [k, v] of fields) if (res.some((r) => r.test(k))) return decodeEntities(v);
    return "-";
  };
  function formRows(sections, titleRe, limit = 30) {
    const src = sections.find((s) => titleRe.test(s.title));
    const doc = src ? new DOMParser().parseFromString(src.html, "text/html") : null;
    if (!doc) return [];
    const out = [];
    for (const tr of Array.from(doc.querySelectorAll("tr"))) {
      const c = Array.from(tr.cells).map((td) => (td.textContent || "").replace(/\s+/g, " ").trim());
      if (c.length && c.some(Boolean)) out.push(c);
      if (out.length >= limit) break;
    }
    return out;
  }
  var kvTable = (pairs) => '<table class="rm-grid-table"><tbody>' + pairs.map(
    ([k, v]) => `<tr><td style="width:175px;"><strong>${k}</strong></td><td>${nl2br(v)}</td></tr>`
  ).join("") + "</tbody></table>";
  var dataTable = (head, rows, ver = false) => {
    const h = ver ? [...head, "VER (&#10003;)"] : head;
    return '<table class="rm-grid-table"><thead><tr>' + h.map((x) => `<th>${x}</th>`).join("") + "</tr></thead><tbody>" + (rows.length ? rows.map(
      (r) => "<tr>" + h.map(
        (_, i) => ver && i === h.length - 1 ? '<td class="center"><input type="checkbox" class="rm-checkbox"></td>' : `<td>${nl2br(r[i] || "-")}</td>`
      ).join("") + "</tr>"
    ).join("") : `<tr><td colspan="${h.length}">-</td></tr>`) + "</tbody></table>";
  };
  var sig = (left, right) => '<div class="rm-signature-block">' + [left, right].map(
    (lines, i) => `<div class="rm-sig-box${i ? "" : " left-align"}">` + lines.slice(0, -1).map((x) => `<div>${x}</div>`).join("") + `<div class="rm-sig-space"></div><div class="rm-sig-name">${lines[lines.length - 1]}</div></div>`
  ).join("") + "</div>";
  function buildKonsentSection(sections) {
    const fields = formFields(sections, /^Persetujuan Tindakan/i);
    const f = (...r) => fieldValue(fields, ...r);
    const nama = pick("nama");
    const dokter = pick("dokter", "dpjp");
    const umur = pick("tgl_lahir", "tglLahir");
    const infoList = [
      ["Diagnosis (WD &amp; DD)", f(/^Diagnosis \(WD/i)],
      ["Dasar Diagnosa", f(/^Dasar Diagnosa/i)],
      ["Tindakan Kedokteran", f(/^Tindakan Kedokteran|^Prosedur YANG AKAN DILAKUKAN/i)],
      ["Indikasi Tindakan", f(/^Indikasi Tindakan/i)],
      ["Tata Cara", f(/^Tata Cara/i)],
      ["Tujuan", f(/^Tujuan/i)],
      ["Resiko", f(/^Resiko/i)],
      ["Komplikasi", f(/^Komplikasi/i)],
      ["Prognosis", f(/^Prognosis/i)],
      ["Alternatif", f(/^Alternatif/i)],
      ["Lain-lain", f(/^Lain-lain/i)]
    ].filter(([, v]) => v !== "-").map(
      ([k, v], i) => `<tr><td class="center" style="width:28px;">${i + 1}</td><td>${esc(k)}</td><td>${nl2br(v)}</td><td class="center">&#10003;</td></tr>`
    ).join("");
    const infoTableEmpty = infoList || `<tr><td colspan="4">* Jika ada item informasi yang belum dipilih, sisakan itemnya.</td></tr>`;
    const termsParagraph = f(/^Dengan ini/i) || "";
    const qrDokter = sectionQrs(sections, /^Persetujuan Tindakan/i)[0] ?? "";
    return `<section class="rm-page" id="form-konsent">
${kop("RM. 19A")}
<div class="rm-form-title">PERSETUJUAN TINDAKAN KEDOKTERAN</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("Umur", umur)}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
    ${idRow("Alamat", patientAlamat(sections))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pemberi Informasi", dokter, true)}
    ${idRow("Penerima Informasi / Pemberi Persetujuan", nama, true)}
  </table></div>
</div>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="4">PEMBERIAN INFORMASI &amp; PERSETUJUAN</td></tr>
    <tr><th style="width:28px;">NO</th><th>JENIS INFORMASI</th><th>ISI INFORMASI</th><th>TANDA (&#10003;)</th></tr>
  </thead>
  <tbody>
    <tr><td class="center">1</td><td>Diagnosis (WD &amp; DD)</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">2</td><td>Dasar Diagnosa</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">3</td><td>Tindakan Kedokteran</td><td>${nl2br(f(/^Tindakan Kedokteran/i))}</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">4</td><td>Indikasi Tindakan</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">5</td><td>Tata Cara</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">6</td><td>Tujuan</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">7</td><td>Resiko</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">8</td><td>Komplikasi</td><td>&#10003;</td><td class="center">&#10003;</td></tr>
    <tr><td class="center">9</td><td>Prognosis</td><td>&nbsp;</td><td class="center">&nbsp;</td></tr>
    <tr><td class="center">10</td><td>Alternatif</td><td>&nbsp;</td><td class="center">&nbsp;</td></tr>
    ${infoTableEmpty}
  </tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="4">UJI PEMAHAMAN \u2014 TINDAKAN KEDOKTERAN</td></tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="4" style="width: 175px;">
        <strong>1.</strong> ${nl2br(termsParagraph || "Saya memahami perlunya dan manfaat tindakan tsb sebagaimana telah dijelaskan, termasuk resiko dan komplikasi yang mungkin timbul.")}
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <strong>2.</strong> ${nl2br(f(/^Saya juga menyadari bahwa karena ilmu kedokteran bukanlah ilmu pasti/i) || "Saya juga menyadari bahwa karena ilmu kedokteran bukanlah ilmu pasti, maka keberhasilan tindakan kedokteran bukanlah keniscayaan, melainkan sangat bergantung kepada izin Tuhan Yang Maha Esa.")}
      </td>
    </tr>
    <tr>
      <td colspan="4"><strong>3.</strong> ${nl2br(f(/^Saya bertanggung jawab secara penuh/i) || "Saya bertanggung jawab secara penuh atas segala akibat yang timbul akibat tindakan kedokteran tersebut.")}</td>
    </tr>
  </tbody>
</table>

<table class="rm-table">
  <thead>
    <tr class="sec-hdr"><td colspan="4">SKEMA TANDA TANGAN</td></tr>
  </thead>
  <tbody>
    <tr>
      <td class="center" style="width: 22px;">I</td>
      <td style="width: 210px;"><strong>Nama Pasien / Keluarga Pasien</strong></td>
      <td class="center" style="width: 22px;">II</td>
      <td style="width: 210px;"><strong>Nama Penerima Informasi / Pemberi Persetujuan</strong></td>
    </tr>
    <tr>
      <td class="center"><span class="chk-box">&#10003;</span></td>
      <td class="center">( ${esc(nama)} )</td>
      <td class="center"><span class="chk-box">&#10003;</span></td>
      <td class="center">( ${esc(f(/^Reizky Salban Saputra/i) || f(/^Nama Pasien/i) || "Reizky Salban Saputra")} )</td>
    </tr>
    <tr>
      <td class="center"><span class="chk-box">&#10003;</span></td>
      <td style="text-align: center;"><img class="rm-sig-qr" src="${esc(qrDokter)}" alt="QR dokter penanggung jawab tindakan kedokteran" width="80" height="80" /></td>
      <td class="center"><span class="chk-box">&#10003;</span></td>
      <td style="text-align: center;"><img class="rm-sig-qr" src="${esc(qrDokter)} alt="QR penerima informasi" width="80" height="80" /></td>
    </tr>
    <tr>
      <td class="center">*</td>
      <td><strong>Bila pasien tidak kompeten atau tidak mau menerima informasi, maka penerima informasi adalah wali atau keluarga terdekat.</strong></td>
      <td class="center">&#10003;</td>
      <td class="center">&#10003;</td>
    </tr>
  </tbody>
</table>
</section>`;
  }
  function buildAnestesiSection(sections) {
    const fields = formFields(sections, /^Anestesi/i);
    const rows = formRows(sections, /^Anestesi/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-anestesi">
${kop("ANESTESI")}
<div class="rm-form-title">REKAM PELAKSANAAN ANESTESI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal", f(/^Tanggal/i))}
    ${idRow("Jenis Anestesi", f(/^Jenis Anestesi|^Anestesi/i))}
    ${idRow("ASA", f(/^ASA/i))}
    ${idRow("Dokter Anestesi", f(/^Dokter Anestesi|^Anestesiologi/i))}
  </table></div>
</div>
${kvTable([
      ["DIAGNOSA / TINDAKAN", f(/^Diagnosa|^Tindakan/i)],
      ["PEMERIKSAAN PRA ANESTESI", f(/^Pra Anestesi|^Pemeriksaan/i)],
      ["OBAT &amp; TEKNIK ANESTESI", f(/^Obat|^Teknik/i)],
      ["KOMPLIKASI / CATATAN", f(/^Komplikasi|^Catatan/i)]
    ])}
<div class="sub-heading-rm">MONITORING ANESTESI</div>
${dataTable(["JAM", "TEKANAN DARAH", "NADI", "RR", "SpO2", "CATATAN"], rows, true)}
${sig(
      ["Petugas Anestesi", `( ${esc(f(/^Dokter Anestesi|^Anestesiologi/i))} )`],
      ["Kota Jambi, " + esc(f(/^Tanggal/i)), "Dokter Operator", `( ${esc(pick("dokter", "dpjp"))} )`]
    )}
</section>`;
  }
  function buildFisioterapiSection(sections) {
    const fields = formFields(sections, /^Fisioterapi/i);
    const rows = formRows(sections, /^Fisioterapi/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-fisioterapi">
${kop("FISIOTERAPI")}
<div class="rm-form-title">LEMBAR ASSESMEN &amp; TERAPI FISIOTERAPI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal", f(/^Tanggal/i))}
    ${idRow("Diagnosa", f(/^Diagnosa/i))}
    ${idRow("Ruang / Asal", f(/^Ruang|^Unit/i))}
    ${idRow("Terapis", f(/^Terapis|^Fisioterapis/i))}
  </table></div>
</div>
${kvTable([
      ["KELUHAN UTAMA (SUBJEKTIF)", f(/^Keluhan|^Subjektif/i)],
      ["PEMERIKSAAN OBJEKTIF (ROM / MMT / FUNGSI)", f(/^Objektif|^Pemeriksaan/i)],
      ["ASSESMEN FISIOTERAPI", f(/^Assesmen|^Diagnosa Fisio/i)],
      ["RENCANA TERAPI &amp; TUJUAN", f(/^Rencana|^Terapi|^Tujuan/i)]
    ])}
<div class="sub-heading-rm">PELAKSANAAN TERAPI</div>
${dataTable(["TANGGAL", "MODALITAS / LATIHAN", "FREKUENSI", "RESPON PASIEN"], rows, true)}
${sig(
      ["Pasien / Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Terapis / Fisioterapis",
        `( ${esc(f(/^Terapis|^Fisioterapis/i))} )`
      ]
    )}
</section>`;
  }
  function buildHemodialisaSection(sections) {
    const fields = formFields(sections, /^Pengkajian Hemodialisa/i);
    const rows = formRows(sections, /^Pengkajian Hemodialisa/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-hemodialisa">
${kop("HEMODIALISA")}
<div class="rm-form-title">LEMBAR PENGKAJIAN &amp; SESI HEMODIALISA</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Sesi", f(/^Tanggal/i))}
    ${idRow("Akses Vaskular", f(/^Akses/i))}
    ${idRow("Diagnosa", f(/^Diagnosa/i))}
    ${idRow("Perawat / Dokter", f(/^Perawat|^Dokter/i))}
  </table></div>
</div>
${dataTable(
      ["PARAMETER", "SEBELUM DIALISA", "SESUDAH DIALISA", "KETERANGAN"],
      [
        ["Berat Badan", f(/^BB Sebelum|^Berat Sebelum/), f(/^BB Sesudah|^Berat Sesudah/), "-"],
        ["Tekanan Darah", f(/^TD Sebelum|^Tekanan Sebelum/), f(/^TD Sesudah|^Tekanan Sesudah/), "-"],
        ["Nadi", f(/^Nadi Sebelum/), f(/^Nadi Sesudah/), "-"],
        ...rows
      ],
      true
    )}
${kvTable([
      ["BLOOD FLOW / DIALYSATE FLOW", f(/^Blood Flow|^Dialysate/i)],
      ["ULTRAFILTRASI &amp; Heparinisasi", f(/^Ultrafiltrasi|^UF|^Heparin/i)],
      ["ADEKUASI (Kt/V)", f(/^Kt\/V|^Adekuasi/i)],
      ["KOMPLIKASI / CATATAN", f(/^Komplikasi|^Catatan/i)]
    ])}
${sig(
      ["Pasien / Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      ["Kota Jambi, " + esc(f(/^Tanggal/i)), "Perawat Hemodialisa", `( ${esc(f(/^Perawat/i))} )`]
    )}
</section>`;
  }
  function buildOperasiSection(sections) {
    const fields = formFields(sections, /^Operasi/i);
    const rows = formRows(sections, /^Operasi/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-operasi">
${kop("OPERASI")}
<div class="rm-form-title">LAPORAN PELAKSANAAN OPERASI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Operasi", f(/^Tanggal/i))}
    ${idRow("Diagnosa Pra Operasi", f(/^Diagnosa Pra|^Diagnosa Awal/i))}
    ${idRow("Diagnosa Pasca Operasi", f(/^Diagnosa Pasca|^Diagnosa Akhir/i))}
    ${idRow("Tindakan / ICD-9-CM", f(/^Tindakan|^Prosedur/i))}
  </table></div>
</div>
${kvTable([
      ["JENIS ANESTESI &amp; ASA", f(/^Anestesi|^ASA/i)],
      ["TIM OPERASI (OPERATOR / ASISTEN / ANASTESI)", f(/^Operator|^Asisten|^Tim Operasi/i)],
      ["ALAT / BAHAN &amp; IMPLAN", f(/^Alat|^Bahan|^Implan/i)],
      ["URAIAN PROSEDUR &amp; TEMUAN", f(/^Uraian|^Prosedur|^Temuan/i)],
      ["KOMPLIKASI INTRA OPERASI", f(/^Komplikasi/i)],
      ["KEADAAN PASIEN SELESAI OPERASI", f(/^Keadaan|^Kondisi/i)]
    ])}
<div class="sub-heading-rm">RINCIAN TINDAKAN</div>
${dataTable(["NO", "TINDAKAN / PROSEDUR", "WAKTU", "PELAKSANA"], rows, true)}
${sig(
      ["Asisten Operasi", "-"],
      ["Kota Jambi, " + esc(f(/^Tanggal/i)), "Dokter Operator", `( ${esc(f(/^Operator/i))} )`]
    )}
</section>`;
  }
  function buildLaboratoriumSection(sections) {
    const src = sections.find((s) => /^Laboratorium/i.test(s.title));
    const doc = src ? new DOMParser().parseFromString(src.html, "text/html") : null;
    const lampiran = doc ? Array.from(doc.querySelectorAll("img")).map((img) => img.outerHTML).filter((html) => !/logo/i.test(html)) : [];
    return `<section class="rm-page" id="rm-09">
${kop("RM. 09")}
<div class="rm-form-title">HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK</div>
<div class="passthrough-separator"><span>LAMPIRAN HASIL LABORATORIUM (LIS)</span><span>FILE UPLOAD</span></div>
<div class="raw-upload-frame">
  ${lampiran.length ? lampiran.join("<br/>") : "-"}
</div>
</section>`;
  }
  function buildKematianSection(sections) {
    const fields = formFields(sections, /^Surat Kematian/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-kematian">
${kop("KEMATIAN")}
<div class="rm-form-title">SURAT KETERANGAN KEMATIAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
    ${idRow("Alamat", patientAlamat(sections))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Kematian", f(/^Tanggal Kematian|^Tanggal/i))}
    ${idRow("Jam Kematian", f(/^Jam/i))}
    ${idRow("Tempat Kematian", f(/^Tempat/i))}
    ${idRow("Ruang / Kelas", [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-")}
  </table></div>
</div>
${kvTable([
      ["PENYEBAB KEMATIAN LANGSUNG (I)", f(/^Penyebab Langsung|^Penyebab I/i)],
      ["PENYEBAB ANTARA (II)", f(/^Penyebab Antara|^Penyebab II/i)],
      ["PENYAKIT / KONDISI LAIN", f(/^Penyakit Lain|^Kondisi Lain/i)],
      ["KETERANGAN", f(/^Keterangan|^Catatan/i)]
    ])}
${sig(
      ["Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal Kematian|^Tanggal/i)),
        "Dokter yang Menyatakan Meninggal",
        `( ${esc(pick("dokter", "dpjp"))} )`
      ]
    )}
</section>`;
  }
  function buildTerapiSection(sections) {
    const fields = formFields(sections, /^Permintaan Terapi/i);
    const rows = formRows(sections, /^Permintaan Terapi/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-terapi">
${kop("TERAPI")}
<div class="rm-form-title">PERMINTAAN TERAPI REHABILITASI MEDIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Permintaan", f(/^Tanggal/i))}
    ${idRow("Ruangan / Unit Asal", f(/^Ruang|^Unit/i))}
    ${idRow("Dokter Pengirim", f(/^Dokter Pengirim/i))}
    ${idRow("Diagnosa", f(/^Diagnosa/i))}
  </table></div>
</div>
${kvTable([
      ["JENIS TERAPI YANG DIMINTA", f(/^Jenis Terapi|^Terapi/i)],
      ["TUJUAN TERAPI", f(/^Tujuan/i)],
      ["FREKUENSI / RENCANA", f(/^Frekuensi|^Rencana/i)],
      ["CATATAN KLINIS", f(/^Catatan/i)]
    ])}
<div class="sub-heading-rm">RINCIAN PERMINTAAN</div>
${dataTable(["NO", "TERAPI / MODALITAS", "FREKUENSI", "KETERANGAN"], rows, true)}
${sig(
      ["Pasien / Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      ["Kota Jambi, " + esc(f(/^Tanggal/i)), "Dokter Pengirim", `( ${esc(f(/^Dokter Pengirim/i))} )`]
    )}
</section>`;
  }
  function buildUjiFungsiSection(sections) {
    const fields = formFields(sections, /^Uji Fungsi/i);
    const rows = formRows(sections, /^Uji Fungsi/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-uji-fungsi">
${kop("UJI FUNGSI")}
<div class="rm-form-title">LEMBAR UJI FUNGSI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Pemeriksaan", f(/^Tanggal/i))}
    ${idRow("Diagnosa", f(/^Diagnosa/i))}
    ${idRow("Petugas Uji", f(/^Petugas|^Terapis/i))}
    ${idRow("Alat / Metode", f(/^Alat|^Metode/i))}
  </table></div>
</div>
${dataTable(["PARAMETER FUNGSI", "NILAI / SKOR", "SATUAN", "KETERANGAN"], rows, true)}
${kvTable([
      ["HASIL / INTERPRETASI", f(/^Hasil|^Interpretasi/i)],
      ["KESIMPULAN", f(/^Kesimpulan/i)],
      ["REKOMENDASI TERAPI", f(/^Rekomendasi|^Saran/i)]
    ])}
${sig(
      ["Pasien / Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Petugas Uji Fungsi",
        `( ${esc(f(/^Petugas|^Terapis/i))} )`
      ]
    )}
</section>`;
  }
  function buildPartografSection(sections) {
    const fields = formFields(sections, /^Partograf/i);
    const rows = formRows(sections, /^Partograf/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-partograf">
${kop("PARTOGRAF")}
<div class="rm-form-title">PARTOGRAF \u2014 PEMANTAUAN KEMAJUAN PERSALINAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Umur", f(/^Umur/i))}
    ${idRow("Grafida / Paritas", f(/^Grafida|^Paritas|^G/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("HPHT", f(/^HPHT/i))}
    ${idRow("Taksiran Persalinan", f(/^Taksiran|^TP/i))}
    ${idRow("Tanggal Persalinan", f(/^Tanggal/i))}
    ${idRow("Petugas", f(/^Petugas|^Bidan/i))}
  </table></div>
</div>
<div class="sub-heading-rm">KEMAJUAN PERSALINAN &amp; OBSERVASI</div>
${dataTable(
      ["JAM", "PEMBUKAAN", "TURUN", "KONTRAKSI", "DJJ", "TD / NADI", "SUHU", "URINE", "CATATAN"],
      rows,
      true
    )}
${kvTable([
      ["KEADAAN IBU &amp; JANIN", f(/^Keadaan|^Kondisi/i)],
      ["TINDAKAN / PENYIMPANGAN", f(/^Tindakan|^Penyimpangan/i)],
      ["CATATAN", f(/^Catatan/i)]
    ])}
${sig(
      ["Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Bidan / Petugas Persalinan",
        `( ${esc(f(/^Petugas|^Bidan/i))} )`
      ]
    )}
</section>`;
  }
  function buildLaporanTindakanSection(sections) {
    const fields = formFields(sections, /^Laporan Tindakan/i);
    const rows = formRows(sections, /^Laporan Tindakan/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-laporan-tindakan">
${kop("LAPORAN TINDAKAN")}
<div class="rm-form-title">LAPORAN PELAKSANAAN TINDAKAN</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Tindakan", f(/^Tanggal/i))}
    ${idRow("Jenis Tindakan", f(/^Jenis Tindakan|^Tindakan/i))}
    ${idRow("Ruang / Unit", f(/^Ruang|^Unit/i))}
    ${idRow("Pelaksana", f(/^Pelaksana|^Petugas|^Dokter/i))}
  </table></div>
</div>
${kvTable([
      ["INDIKASI / DIAGNOSA", f(/^Indikasi|^Diagnosa/i)],
      ["URAIAN TINDAKAN", f(/^Uraian|^Prosedur/i)],
      ["HASIL TINDAKAN", f(/^Hasil/i)],
      ["KOMPLIKASI / CATATAN", f(/^Komplikasi|^Catatan/i)]
    ])}
<div class="sub-heading-rm">RINCIAN TINDAKAN</div>
${dataTable(["NO", "TINDAKAN", "WAKTU / JAM", "PELAKSANA"], rows, true)}
${sig(
      ["Pasien / Keluarga Pasien", `( ${esc(pick("nama"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Pelaksana Tindakan",
        `( ${esc(f(/^Pelaksana|^Petugas|^Dokter/i))} )`
      ]
    )}
</section>`;
  }
  var tableRows = (t) => t ? Array.from(t.rows).map((tr) => Array.from(tr.cells).map(cellText)) : [];
  var dateJam = (s) => [
    s.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1] ?? "-",
    s.match(/Pukul\s*([\d:]+)/i)?.[1] ?? "-"
  ];
  var firstDoctor = (s) => s.match(/dr\.[^\n]+/i)?.[0]?.trim() ?? "-";
  function parseKonsulSheet(el) {
    const tables = Array.from(el.querySelectorAll("table"));
    const req = tables[0] ?? null;
    const ans = tables.find((t) => /Jawaban Konsultasi/i.test(t.textContent || "")) ?? null;
    const r = tableRows(req);
    const a = tableRows(ans);
    const head = r[0] ?? [];
    const intro = r[1]?.[0] || "";
    const penemuanIdx = r.findIndex((row) => /^Penemuan Klinis/i.test(row[0] || ""));
    const [tanggal, jam] = dateJam(head[1] || "");
    const [tglJawaban, jamJawaban] = dateJam(a[1]?.[1] || "");
    const soap = {};
    for (const row of a.slice(2)) {
      for (const cell of row) {
        const m = cell.match(/^(Subjektif|Objektif|Assesmen|Planning|Instruksi)\s*:\s*([\s\S]*)$/i);
        if (m) soap[m[1].toLowerCase()] = m[2].trim() || "-";
      }
    }
    const konsulenKe = (head[0] || "").replace(/^\s*Konsul Ke\s*:\s*/i, "").replace(/\s+/g, " ").trim();
    const dokterJawab = firstDoctor(a[a.length - 1]?.[1] || "");
    return {
      konsulen: dokterJawab !== "-" ? dokterJawab : konsulenKe || "-",
      pengirim: firstDoctor(r[r.length - 1]?.[1] || ""),
      tanggal,
      jam,
      jenis: intro.match(/Mohon\s+Konsultasi\s+([^\s:]+)/i)?.[1] ?? "-",
      permintaan: intro || "-",
      penemuan: (penemuanIdx >= 0 ? r[penemuanIdx + 1]?.[0] : "") || "-",
      dugaan: r.flat().find((x) => /^Dugaan\s*:/i.test(x))?.replace(/^Dugaan\s*:\s*/i, "").trim() || "-",
      subjektif: soap.subjektif || "-",
      objektif: soap.objektif || "-",
      asesmen: soap.asesmen || "-",
      planning: soap.planning || "-",
      instruksi: soap.instruksi || "-",
      keputusan: a.flat().find((x) => /Konsultasi selesai tanggal/i.test(x)) || "-",
      tglJawaban,
      jamJawaban
    };
  }
  function buildKonsulSection(sections, src, id = "rm-10") {
    const target = src ?? sections.find((s) => /Konsul/i.test(s.title));
    if (!target) return "";
    const doc = new DOMParser().parseFromString(target.html, "text/html");
    const entries = Array.from(doc.querySelectorAll("b")).filter((b) => /^\s*Konsul Ke\s*:/i.test(b.textContent || "")).map((b) => b.closest("table")?.parentElement).filter((el) => !!el);
    const qrs = sectionQrs([target], /Konsul/i);
    return entries.map((el, i) => buildKonsulSheet(parseKonsulSheet(el), qrs[i] ?? "", i ? `${id}-${i + 1}` : id)).join("");
  }
  function buildKonsulSheet(data, qrKonsul, id) {
    const pengirim = pick("dokter", "dpjp");
    const konsulen = data.konsulen !== "-" ? data.konsulen : pick("dokter_konsulen") !== "-" ? pick("dokter_konsulen") : doctorFromQr(qrKonsul);
    return `<section class="rm-page" id="${esc(id)}">
${kop("RM. 10")}
<div class="rm-form-title">LEMBAR KONSULTASI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"), true)}
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("Tanggal Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Jenis Kunjungan", [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-")}
    ${idRow("Tanggal Permintaan", `${data.tanggal} ${data.jam}`.trim())}
    ${idRow("Tanggal Jawaban", `${data.tglJawaban} ${data.jamJawaban}`.trim())}
  </table></div>
</div>
${kvTable([
      ["BAGIAN I : KEPADA YTH. KONSULEN", konsulen],
      ["JENIS PERMOHONAN", data.jenis],
      ["PERMINTAAN KONSULTASI", data.permintaan],
      ["PENEMUAN KLINIS TERPENTING", data.penemuan],
      ["DUGAAN DIAGNOSA", data.dugaan]
    ])}
${kvTable([
      ["S (SUBJEKTIF)", data.subjektif],
      ["O (OBJEKTIF)", data.objektif],
      ["A (ASSESMEN)", data.asesmen],
      ["P (PLANNING)", data.planning],
      ["INSTRUKSI", data.instruksi],
      ["KEPUTUSAN KONSULTASI", data.keputusan]
    ])}
${sig(
      [
        "Dokter Pemohon Konsultasi",
        pengirim !== "-" ? `( ${esc(pengirim)} )` : `( ${esc(data.pengirim)} )`
      ],
      [
        "Dokter Konsulen",
        qrKonsul ? `<img class="rm-sig-qr" src="${esc(qrKonsul)}" alt="QR dokter konsulen" width="80" height="80" />` : '<div class="rm-sig-space"></div>',
        `( ${esc(konsulen)} )`
      ]
    )}
</section>`;
  }
  function buildBonMakanSection(sections) {
    const fields = formFields(sections, /^Bon Makan/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-bon-makan">
${kop("BON MAKAN")}
<div class="rm-form-title">BON MAKAN PASIEN / PENDAMPING</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Ruang / Kelas", [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-")}
    ${idRow("Tanggal", f(/^Tanggal/i))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pendamping", f(/^Pendamping|^Keluarga/i))}
    ${idRow("Jumlah Porsi", f(/^Jumlah|^Porsi/i))}
    ${idRow("Waktu", f(/^Waktu|^Jam/i))}
    ${idRow("Petugas", f(/^Petugas/i))}
  </table></div>
</div>
${dataTable(
      ["NO", "NAMA", "HUBUNGAN", "JUMLAH", "KETERANGAN"],
      formRows(sections, /^Bon Makan/i),
      true
    )}
<div class="footnote-rm">Bon ini berlaku sesuai jadwal makan yang ditetapkan ruangan / instalasi gizi.</div>
${sig(
      ["Pasien / Pendamping", `( ${esc(f(/^Pendamping|^Keluarga/i))} )`],
      ["Kota Jambi, " + esc(f(/^Tanggal/i)), "Petugas Ruangan", `( ${esc(f(/^Petugas/i))} )`]
    )}
</section>`;
  }
  function buildPemeriksaanSection(sections) {
    const fields = formFields(sections, /^PEMERIKSAAN$/i);
    const rows = formRows(sections, /^PEMERIKSAAN$/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="form-pemeriksaan">
${kop("PEMERIKSAAN")}
<div class="rm-form-title">HASIL PEMERIKSAAN / DIAGNOSTIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Pemeriksaan", f(/^Tanggal/i))}
    ${idRow("Jenis Pemeriksaan", f(/^Jenis Pemeriksaan|^Pemeriksaan/i))}
    ${idRow("Spesimen / Bahan", f(/^Spesimen|^Bahan/i))}
    ${idRow("Dokter Pengirim", f(/^Dokter Pengirim/i))}
  </table></div>
</div>
${dataTable(["PARAMETER", "HASIL", "SATUAN", "NILAI RUJUKAN"], rows, true)}
${kvTable([
      ["MAKROSKOPIK / TEMUAN", f(/^Makroskopik|^Temuan/i)],
      ["MIKROSKOPIK", f(/^Mikroskopik/i)],
      ["KESIMPULAN / DIAGNOSA", f(/^Kesimpulan|^Diagnosa/i)],
      ["CATATAN", f(/^Catatan/i)]
    ])}
${sig(
      ["Petugas / Analis", `( ${esc(f(/^Petugas|^Analis/i))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Dokter Penanggung Jawab",
        `( ${esc(f(/^Dokter Penanggung Jawab|^Dokter/i))} )`
      ]
    )}
</section>`;
  }
  function buildHtml(sections, inventory) {
    const checks = runChecks(sections, inventory);
    const sep = pick("no_sep", "sep");
    const kartu = pick("kartu", "no_kartu", "noka");
    const norm = pick("norm", "rekam_medis");
    const nama = pick("nama");
    const ruang = [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-";
    const dpjp = pick("dokter", "dpjp");
    const awal = pick("tanggalAwal", "tgl_masuk", "tgl");
    const akhir = pick("tanggalAkhir", "keluar", "tgl_keluar");
    const lahir = pick("tgl_lahir", "tglLahir");
    const jk = pick("jenis_kelamin", "jk");
    const alamat = patientAlamat(sections);
    const nota = sections.filter((s) => /resep/i.test(s.title)).length;
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember"
    ];
    const now = /* @__PURE__ */ new Date();
    const tglCetak = `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
    const checksHtml = `<table class="rm-grid-table">
  <thead>
    <tr><th colspan="3">CATATAN KETIDAKSESUAIAN DATA LINTAS DOKUMEN (HASIL UJI SILANG OTOMATIS)</th></tr>
    <tr><th style="width: 32px;">NO</th><th style="width: 170px;">JENIS KETIDAKSESUAIAN</th><th>URAIAN TEMUAN VERIFIKASI</th></tr>
  </thead>
  <tbody>${checks.map(
      (c, i) => `<tr><td class="center">${i + 1}</td><td><strong>${esc(c.title)}</strong></td><td>${esc(c.detail)}</td></tr>`
    ).join("")}</tbody>
</table>`;
    const cover = `<section class="rm-page" id="rm-00">
${kop("RM. 00")}
<div class="rm-form-title">LEMBAR KENDALI KELENGKAPAN &amp; VERIFIKASI BERKAS KLAIM JKN</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    <tr><td class="lbl">NAMA PASIEN</td><td class="col">:</td><td class="val"><strong>${esc(nama)}</strong></td></tr>
    <tr><td class="lbl">NO. REKAM MEDIS</td><td class="col">:</td><td class="val"><strong>${esc(norm)}</strong></td></tr>
    <tr><td class="lbl">TGL. LAHIR / UMUR</td><td class="col">:</td><td class="val">${esc(lahir)}</td></tr>
    <tr><td class="lbl">JENIS KELAMIN</td><td class="col">:</td><td class="val">${esc(jk)}</td></tr>
    <tr><td class="lbl">ALAMAT</td><td class="col">:</td><td class="val">${esc(alamat)}</td></tr>
  </table></div>
  <div class="id-col"><table class="id-table">
    <tr><td class="lbl">NO. KARTU BPJS</td><td class="col">:</td><td class="val"><strong>${esc(kartu)}</strong></td></tr>
    <tr><td class="lbl">NO. SEP</td><td class="col">:</td><td class="val"><strong>${esc(sep)}</strong></td></tr>
    <tr><td class="lbl">TGL. MASUK / KELUAR</td><td class="col">:</td><td class="val">${esc([awal, akhir].filter((v) => v && v !== "-").join(" s/d ") || "-")}</td></tr>
    <tr><td class="lbl">RUANG / KELAS</td><td class="col">:</td><td class="val">${esc(ruang)}</td></tr>
    <tr><td class="lbl">DPJP UTAMA</td><td class="col">:</td><td class="val">${esc(dpjp)}</td></tr>
  </table></div>
</div>

<table class="rm-grid-table">
  <thead>
    <tr>
      <th style="width: 110px;">KODE INA-CBG</th>
      <th>DESKRIPSI GROUPING INA-CBG</th>
      <th class="num" style="width: 120px;">TARIF INA-CBG</th>
      <th class="num" style="width: 120px;">TARIF RIIL RS</th>
      <th class="num" style="width: 115px;">SELISIH</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center"><strong>${esc(val("ina_cbg_code") || "-")}</strong></td>
      <td>${esc(val("ina_cbg_desc") || "-")}</td>
      <td class="num"><strong>${esc(val("tarif_ina_cbg") || "-")}</strong></td>
      <td class="num">${esc(val("tarif_riil_rs") || "-")}</td>
      <td class="num">${esc(val("selisih") || "-")}</td>
    </tr>
  </tbody>
</table>

<table class="rm-grid-table">
  <thead>
    <tr>
      <th style="width: 32px;">NO</th>
      <th style="width: 58px;">KODE RM</th>
      <th>JENIS BERKAS / DOKUMEN KLAIM</th>
      <th style="width: 120px;">STATUS BERKAS</th>
      <th style="width: 68px;">TANDA (&#10003;)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td class="center">1</td><td class="center">RM. 01</td><td>Surat Elegibilitas Peserta (SEP) \u2014 No. ${esc(sep)}</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 01 SEP"></td></tr>
    <tr><td class="center">2</td><td class="center">RM. 01</td><td>Berkas Klaim Individual Pasien (INA-CBG E-Klaim 5.10.9)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi INA-CBG"></td></tr>
    <tr><td class="center">3</td><td class="center">RM. 02</td><td>Surat Bukti Pelayanan Kesehatan (SBPK) \u2014 ${esc(ruang)}</td><td class="center"><strong>ADA *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 02 SBPK"></td></tr>
    <tr><td class="center">4</td><td class="center">RM. 03</td><td>Surat Pengantar Rawat Inap (SPRI) \u2014 Tgl. ${esc(awal || "-")}</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 03 SPRI"></td></tr>
    <tr><td class="center">5</td><td class="center">Seksi 04</td><td>File Upload Dokumen Pasien (Laporan Echo/Doppler &amp; Rekaman EKG)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Seksi 04 Upload"></td></tr>
    <tr><td class="center">6</td><td class="center">RM. 05</td><td>Rincian Biaya Pelayanan Rawat Inap &amp; Farmasi (${nota} Nota Resep)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 05 Billing"></td></tr>
    <tr><td class="center">7</td><td class="center">RM. 06</td><td>Ringkasan Pulang (Discharge Summary) \u2014 DPJP ${esc(dpjp)}</td><td class="center"><strong>ADA *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 06 Resume"></td></tr>
    <tr><td class="center">8</td><td class="center">RM. 07</td><td>Formulir Telaah Resep, Telaah Obat &amp; Edukasi Farmasi (No. 230445)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 07 Telaah"></td></tr>
    <tr><td class="center">9</td><td class="center">RM. 08</td><td>Hasil Pemeriksaan Radiologi \u2014 Thorax AP/PA (No. Rontgen 5918)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 08 Radiologi"></td></tr>
    <tr><td class="center">10</td><td class="center">RM. 09</td><td>Hasil Pemeriksaan Laboratorium Patologi Klinik (Hematologi &amp; Urine)</td><td class="center"><strong>TIDAK LENGKAP *</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 09 Lab"></td></tr>
    <tr><td class="center">11</td><td class="center">RM. 10</td><td>Lembar Konsultasi Antar-Spesialis (dr. M. Ryan Ramadhan, Sp.JP., FIHA)</td><td class="center"><strong>ADA</strong></td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi RM 10 Konsul"></td></tr>
  </tbody>
</table>

${checksHtml}

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Kota Jambi, ${tglCetak}</div>
    <div>Petugas Casemix / Klaim JKN RS</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
    <div class="rm-sig-sub">RSUD H. Abdul Manap Kota Jambi</div>
  </div>
  <div class="rm-sig-box">
    <div>Diterima &amp; Diverifikasi Oleh,</div>
    <div>Verifikator BPJS Kesehatan</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
    <div class="rm-sig-sub">NPP. ............................................</div>
  </div>
</div>
</section>`;
    const renderSections = sections;
    const metaCount = /* @__PURE__ */ new Map();
    const metas = renderSections.map((s, i) => {
      const m = metaFor(s.title, i);
      const n = (metaCount.get(m.id) ?? 0) + 1;
      metaCount.set(m.id, n);
      return n === 1 ? m : { ...m, id: `${m.id}-${n}`, tab: `${m.tab} (${n})`, option: `${m.option} (${n})` };
    });
    const docs = renderSections.map((s, i) => {
      const m = metas[i];
      if (/^SEP$/i.test(s.title)) return buildSepSection(sections);
      if (/^SPRI$/i.test(s.title)) return buildSpriSection(sections);
      if (/^SBPK$/i.test(s.title)) return buildSbpkSection(sections);
      if (/^Rincian Biaya/i.test(s.title)) return buildBillingSection(sections);
      if (/^Resume/i.test(s.title)) return buildResumeSection(sections);
      if (/^Telaah/i.test(s.title)) return buildTelaahSection(sections);
      if (/^Radiologi/i.test(s.title)) return buildRadiologiSection(sections, s, m.id);
      if (/^Triage/i.test(s.title)) return buildTriageSection(sections);
      if (/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(s.title))
        return buildPengkajianIgdSection(sections);
      if (/^Laboratorium/i.test(s.title)) return buildLaboratoriumSection(sections);
      if (/Konsul/i.test(s.title)) return buildKonsulSection(sections, s, m.id);
      if (/^Persetujuan Tindakan/i.test(s.title)) return buildKonsentSection(sections);
      if (/^Anestesi/i.test(s.title)) return buildAnestesiSection(sections);
      if (/^Fisioterapi/i.test(s.title)) return buildFisioterapiSection(sections);
      if (/^Pengkajian Hemodialisa/i.test(s.title)) return buildHemodialisaSection(sections);
      if (/^Operasi/i.test(s.title)) return buildOperasiSection(sections);
      if (/^Surat Kematian/i.test(s.title)) return buildKematianSection(sections);
      if (/^Permintaan Terapi/i.test(s.title)) return buildTerapiSection(sections);
      if (/^Uji Fungsi/i.test(s.title)) return buildUjiFungsiSection(sections);
      if (/^Partograf/i.test(s.title)) return buildPartografSection(sections);
      if (/^Laporan Tindakan/i.test(s.title)) return buildLaporanTindakanSection(sections);
      if (/^Bon Makan/i.test(s.title)) return buildBonMakanSection(sections);
      if (/^PEMERIKSAAN$/i.test(s.title)) return buildPemeriksaanSection(sections);
      return `<section class="rm-page" id="${m.id}">
${kop(m.code)}
<div class="rm-form-title">${esc(s.title)}</div>
<div class="doc-body">${s.html}</div>
</section>`;
    }).join("");
    const tabs = [
      `<button type="button" class="tab-btn active" data-target="all">Semua</button>`,
      `<button type="button" class="tab-btn" data-target="rm-00">RM. 00 Kendali</button>`,
      ...renderSections.map((s, i) => {
        const m = metas[i];
        return `<button type="button" class="tab-btn" data-target="${m.id}">${m.tab}</button>`;
      })
    ].join("");
    const opts = [
      `<option value="all">Semua Formulir RM</option>`,
      `<option value="rm-00">RM. 00 \u2014 Lembar Kendali &amp; Verifikasi</option>`,
      ...renderSections.map((s, i) => {
        const m = metas[i];
        return `<option value="${m.id}">${m.option}</option>`;
      })
    ].join("");
    return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="${esc(location.origin)}">
<title>Formulir Rekam Medis Baku \u2014 Dossier Klaim BPJS ${esc(HOSPITAL_NAME)}</title>
<style>
    /* ==========================================================================
       1. RESET & AUTHENTIC INDONESIAN HOSPITAL RM FORM TOKENS
       Pure Monochrome Black Ink (#000000) on White Paper (#FFFFFF).
       Zero SaaS colors, zero rounded pills/badges, zero drop shadows.
       ========================================================================== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      line-height: 1.35;
      color: #000000;
      background-color: #E5E5E5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ==========================================================================
       2. SCREEN-ONLY VERIFIER TOOLBAR (.no-print)
       ========================================================================== */
    .verifier-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #FFFFFF;
      border-bottom: 2px solid #000000;
      padding: 8px 16px;
      font-family: Arial, Helvetica, sans-serif;
    }

    .toolbar-row {
      max-width: 210mm;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .toolbar-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .toolbar-label {
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
    }

    .toolbar-select {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 4px 8px;
      cursor: pointer;
    }

    .toolbar-counter {
      font-size: 8.5pt;
      border: 1px solid #000000;
      padding: 3px 8px;
      background-color: #FFFFFF;
    }

    .toolbar-btn {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 4px 10px;
      cursor: pointer;
    }

    .toolbar-btn:hover {
      background-color: #F0F0F0;
    }

    .toolbar-btn-print {
      background-color: #000000;
      color: #FFFFFF;
    }

    .toolbar-btn-print:hover {
      background-color: #222222;
    }

    .toolbar-tabs {
      max-width: 210mm;
      margin: 6px auto 0 auto;
      padding-top: 6px;
      border-top: 1px solid #000000;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .tab-btn {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      color: #000000;
      background-color: #FFFFFF;
      border: 1px solid #000000;
      padding: 2px 6px;
      cursor: pointer;
    }

    .tab-btn.active {
      background-color: #000000;
      color: #FFFFFF;
      font-weight: bold;
    }

    /* ==========================================================================
       3. A4 PAPER SHEET CONTAINER (NO DROP SHADOWS)
       ========================================================================== */
    .dossier-wrapper {
      max-width: 210mm;
      margin: 16px auto 40px auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .rm-page {
      width: 100%;
      background-color: #FFFFFF;
      border: 1px solid #888888;
      padding: 12mm 14mm;
    }

    .rm-page.hidden-section {
      display: none;
    }

    /* ==========================================================================
       4. OFFICIAL RSUD H. ABDUL MANAP KOP SURAT (TIMES NEW ROMAN + DOUBLE RULE)
       ========================================================================== */
    .rm-code-top {
      text-align: right;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 2px;
      letter-spacing: 0.02em;
    }

    .kop-surat {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 5px;
    }

    .kop-logo {
      width: 52px;
      height: 60px;
      flex-shrink: 0;
    }

    .kop-text {
      flex: 1;
      text-align: center;
      font-family: "Times New Roman", Times, serif;
      color: #000000;
      line-height: 1.2;
    }

    .kop-line-1 {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.03em;
    }

    .kop-line-2 {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.03em;
    }

    .kop-line-3 {
      font-size: 12.5pt;
      font-weight: bold;
      letter-spacing: 0.02em;
      margin-top: 1px;
    }

    .kop-line-4 {
      font-size: 7.5pt;
      font-weight: normal;
      margin-top: 2px;
    }

    .kop-line-5 {
      font-size: 7.5pt;
      font-weight: normal;
    }

    .kop-double-rule {
      border-top: 2px solid #000000;
      height: 2px;
      border-bottom: 0.75px solid #000000;
      margin-bottom: 10px;
    }

    .rm-form-title {
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }

    /* ==========================================================================
       5. PATIENT IDENTITY BLOCKS (PATTERN A: BORDERED BOX / PATTERN B: BORDERLESS)
       Strict vertical colon ':' alignment (label | 10px ':' | value)
       ========================================================================== */
    .id-box-bordered {
      border: 1px solid #000000;
      padding: 6px 10px;
      margin-bottom: 9px;
      display: flex;
      gap: 16px;
    }

    .id-box-borderless {
      padding: 2px 0;
      margin-bottom: 8px;
      display: flex;
      gap: 16px;
    }

    .id-col {
      flex: 1;
      min-width: 0;
    }

    .id-table {
      width: 100%;
      border-collapse: collapse;
    }

    .id-table td {
      padding: 1.5px 0;
      vertical-align: top;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
      line-height: 1.3;
    }

    .id-table td.lbl {
      width: 118px;
      white-space: nowrap;
      text-align: left;
    }

    .id-table td.lbl-wide {
      width: 138px;
      white-space: nowrap;
      text-align: left;
    }

    .id-table td.col {
      width: 10px;
      text-align: center;
    }

    .id-table td.val {
      text-align: left;
    }

    /* ==========================================================================
       6. FULL-GRID RM TABLES (border: 1px solid #000 ON ALL TH & TD)
       ========================================================================== */
    .rm-grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
    }

    .rm-grid-table th,
    .rm-grid-table td {
      border: 1px solid #000000;
      padding: 4px 6px;
      vertical-align: top;
      color: #000000;
    }

    .rm-grid-table th {
      font-size: 8.5pt;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      background-color: #FFFFFF;
    }

    .rm-grid-table td.center,
    .rm-grid-table th.center {
      text-align: center;
      vertical-align: middle;
    }

    .rm-grid-table td.num,
    .rm-grid-table th.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .rm-grid-table td.nowrap {
      white-space: nowrap;
    }

    .rm-grid-table tr.section-banner td {
      font-weight: bold;
      font-size: 8.5pt;
      text-transform: uppercase;
      padding: 4px 6px;
    }

    .rm-grid-table tr.sub-group td {
      font-weight: bold;
      text-decoration: underline;
      padding-top: 5px;
      padding-bottom: 4px;
    }

    .rm-grid-table tr.total-row td {
      font-weight: bold;
      padding: 5px 6px;
    }

    /* Square 11px x 11px Interactive Verification Checkbox */
    .rm-checkbox {
      appearance: none;
      -webkit-appearance: none;
      width: 11px;
      height: 11px;
      border: 1px solid #000000;
      border-radius: 0;
      background-color: #FFFFFF;
      display: inline-grid;
      place-content: center;
      vertical-align: middle;
      cursor: pointer;
    }

    .rm-checkbox::before {
      content: "\u2713";
      font-size: 9px;
      font-weight: bold;
      line-height: 1;
      color: #000000;
      transform: scale(0);
    }

    .rm-checkbox:checked::before {
      transform: scale(1);
    }

    /* Static printed checkbox symbol for clinical forms */
    .static-box {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 1px solid #000000;
      text-align: center;
      line-height: 9px;
      font-size: 8px;
      font-weight: bold;
      margin-right: 4px;
      vertical-align: middle;
    }

    .sub-heading-rm {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 7px 0 4px 0;
    }

    .footnote-rm {
      font-size: 7.5pt;
      margin-top: 4px;
      line-height: 1.35;
    }

    /* ==========================================================================
       7. ATOMIC SIGNATURE FOOTER (break-inside: avoid)
       ========================================================================== */
    .rm-signature-block {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      break-inside: avoid;
      page-break-inside: avoid;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.2pt;
    }

    .rm-sig-box {
      width: 44%;
      text-align: center;
    }

    .rm-sig-box.left-align {
      text-align: left;
    }

    .rm-sig-space {
      height: 44px;
    }

    .rm-sig-name {
      font-weight: bold;
    }

    .rm-sig-sub {
      font-size: 7.5pt;
    }

    /* ==========================================================================
       8. SECTION 04 \u2014 FILE UPLOAD ORIGINAL PASSTHROUGH (NOT REDESIGNED)
       ========================================================================== */
    .passthrough-separator {
      border-top: 2px solid #000000;
      border-bottom: 1px solid #000000;
      padding: 4px 6px;
      margin-bottom: 10px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .raw-upload-frame {
      border: 1px solid #000000;
      padding: 8px 10px;
      margin-bottom: 12px;
      font-family: "Times New Roman", Times, serif;
      font-size: 8.5pt;
      break-inside: avoid;
    }

    .raw-upload-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 8pt;
    }

    .raw-upload-table th,
    .raw-upload-table td {
      border: 1px solid #000000;
      padding: 2px 4px;
    }

    /* ==========================================================================
       9. PRINT MEDIA RULES (@media print \u2014 A4 PORTRAIT, 12MM MARGIN)
       ========================================================================== */
    @media print {
      @page {
        size: A4 portrait;
        margin: 12mm;
      }

      body {
        background-color: #FFFFFF !important;
        margin: 0;
        padding: 0;
      }

      .no-print,
      .verifier-toolbar {
        display: none !important;
      }

      .dossier-wrapper {
        max-width: 100%;
        margin: 0;
        gap: 0;
      }

      .rm-page {
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        break-after: page;
        page-break-after: always;
      }

      .rm-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .rm-page.hidden-section {
        display: none !important;
      }

      thead {
        display: table-header-group;
      }

      tr,
      .rm-signature-block,
      .id-box-bordered {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }

    @media (max-width: 720px) {
      .rm-page {
        padding: 12px;
      }
      .id-box-bordered,
      .id-box-borderless {
        flex-direction: column;
        gap: 4px;
      }
      .rm-signature-block {
        flex-direction: column;
        gap: 14px;
      }
      .rm-sig-box {
        width: 100%;
      }
    }

/* \u2500\u2500 Tambahan generator: komponen hasil scrape & fokus keyboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.kop-logo{object-fit:contain;object-position:center}
/* SEP BPJS \u2014 cetakan VClaim (sheet menggantikan kop RSUD) */
.rm-page.sep-page{padding:0}
.bpjs-sep-sheet{width:210mm;max-width:100%;margin:0 auto;padding:10mm 14mm;background:#fff;color:#000;font:9.5pt/1.38 Arial,Helvetica,sans-serif;box-sizing:border-box;break-inside:avoid;page-break-inside:avoid}
.sep-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;position:relative}
.sep-logo{flex:0 0 215px;width:215px;height:33px;object-fit:contain;object-position:left center}
.sep-title-wrap{flex:0 0 auto;text-align:right;padding-right:0}
.sep-title{font-size:10.5pt;font-weight:400;letter-spacing:.3px;text-transform:uppercase}
.sep-hospital{font-size:10.5pt;text-transform:uppercase}
.sep-columns{display:flex;justify-content:space-between;gap:18px}
.sep-col-left{flex:0 0 56%}
.sep-col-right{flex:0 0 42%;display:flex;flex-direction:column;justify-content:space-between}
.sep-kv-table{width:100%;border-collapse:collapse}
.sep-kv-table td{padding:1.8px 0;vertical-align:top;border:none}
.sep-kv-table td.lbl{width:102px;white-space:nowrap}
.sep-col-right .sep-kv-table td.lbl{width:92px}
.sep-kv-table td.sep{width:12px;text-align:center}
.sep-kv-table td.val{word-break:break-word}
.sep-no-value{font-size:9.5pt;letter-spacing:.2px}
.sep-inline-mr{margin-left:14px;white-space:nowrap}
.sep-multiline-list{margin:0;padding:0;list-style:none}
.sep-disclaimer{margin-top:10px;font-size:7.5pt;font-style:italic}
.sep-print-meta{font-size:9.5pt;font-style:normal}
/* Isi/body SEP seragam 9.5pt \u2014 kecuali disclaimer (7.5pt italic). */
.sep-signatures{display:flex;justify-content:flex-end;gap:16px;margin-top:18px}
.sep-sig-box{flex:0 0 44%;font-size:9.5pt;line-height:1.25;text-align:center}
.sep-sig-role{min-height:24px}
.sep-sig-name{margin-top:2px;font-weight:bold}
.sep-qr{display:block;margin:2px auto;width:100px;height:100px;object-fit:contain}
.rm-sig-qr{display:block;width:80px;height:80px;margin:0 auto 4px;object-fit:contain}
/* @page A4 portrait 12mm ditetapkan sekali di blok print utama \u2014 jangan
   ditimpa di sini supaya margin semua halaman dossier konsisten. */
@media print{body{background:#fff;padding:0}.bpjs-sep-sheet{width:100%;padding:0}}
@media screen{body{background:#e5e7eb;padding:20px}.bpjs-sep-sheet{box-shadow:0 1px 4px rgba(0,0,0,.15)}}
/* Telaah (RM.07) \u2014 grid 2 kolom ala telaahResepPrint.ts */
.t-main{display:grid;grid-template-columns:62% 38%;gap:8px;align-items:start}
.t-left,.t-right{display:flex;flex-direction:column;gap:5px;min-width:0}
.tm-card{padding:2px 0 4px;margin-bottom:4px;border-bottom:.5pt solid #333}
.tm-col{display:flex;flex-direction:column;gap:2px}
.tm-row{display:grid;grid-template-columns:30% 70%;column-gap:4px;align-items:start}
.tm-row.long{display:grid}
.tm-label{font-size:7.5pt;line-height:1.25;color:#333}
.tm-val{font-size:8pt;line-height:1.25;overflow-wrap:anywhere}
.t-meds{font-size:8pt;margin-bottom:6px}
.med{margin-bottom:3px;line-height:1.3}
.med-no{font-weight:400}
.med-name{font-weight:700}
.med-jml{font-weight:700;white-space:nowrap}
.t-lampiran th{font-size:7.5pt}
.rm-summary{margin:8px 0 10px;font-size:8.5pt}
.rm-sum-line{display:flex;align-items:baseline;gap:6px;padding:1px 0}
.rm-sum-line .rm-sum-dots{flex:1;border-bottom:1px dotted #000;transform:translateY(-3px)}
.rm-checkbox:focus-visible,.vbox:focus-visible,.toolbar-btn:focus-visible,.toolbar-select:focus-visible,.tab-btn:focus-visible{outline:2px solid #000000;outline-offset:2px}
.vbox{appearance:none;-webkit-appearance:none;width:11px;height:11px;margin:0;border:1px solid #000000;border-radius:0;background-color:#FFFFFF;display:inline-grid;place-content:center;vertical-align:middle;cursor:pointer}
.vbox::before{content:"\u2713";font-size:9px;font-weight:bold;line-height:1;color:#000000;transform:scale(0)}
.vbox:checked::before{transform:scale(1)}
.doc-body table{width:100%!important;border-collapse:collapse!important;margin:0 0 8px!important;font-size:8.2pt!important}
.doc-body th,.doc-body td{border:1px solid #000000!important;padding:3px 5px!important;vertical-align:top;color:#000000!important;overflow-wrap:anywhere}
.doc-body th{background-color:#FFFFFF!important;font-weight:bold;text-align:center}
.doc-body h1,.doc-body h2,.doc-body h3{font-size:9.5pt;margin:6px 0}
.doc-body p{margin:2px 0}
.doc-body label{min-width:100px;font-weight:600;color:#333333}
.doc-body .fv{font-weight:500}
.doc-body img{max-width:100%!important;height:auto!important}
.doc-body .panel,.doc-body .isidalam,.doc-body .card{border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;width:100%!important}
.doc-body .vcol{width:16px!important;text-align:center!important}
.telaah-layout{display:flex;gap:8px;align-items:stretch;margin:0 0 6px}
.telaah-layout table{flex:1;margin-bottom:0}
.img-wrap{display:inline-block;max-width:100%}
.img-tools{display:flex;gap:6px;justify-content:flex-end;margin:0 0 5px}
.img-tools button{font-family:inherit;font-size:10px;padding:3px 9px;border:1px solid #000000;background-color:#FFFFFF;cursor:pointer}
</style></head><body>
<style>
    /* IGD: gambar asal MORBIS (skala nyeri Wong Baker & gambar objektif)
       ikut tercetak, dirapikan sebagai figure + keterangan. */
    .rm-figure { margin: 0 0 8px; break-inside: avoid; text-align: center; }
    .rm-figure img { max-width: 100%; height: auto; border: 1px solid #000000; }
    .rm-figure figcaption { margin-top: 3px; font-size: 7pt; text-transform: uppercase; letter-spacing: 0.04em; }
    .rm-figure-row { display: flex; gap: 10px; align-items: flex-start; break-inside: avoid; }
    .rm-figure-row .rm-figure { flex: 0 0 46%; margin: 0; }
    .rm-figure-row .rm-grid-table { flex: 1; min-width: 0; }
    .rm-note { border: 1px solid #000000; padding: 6px 8px; margin-bottom: 8px; font-size: 8.2pt; line-height: 1.4; break-inside: avoid; }

    /* Bahasa visual RM baku: banner bagian bernomor, tabel full-grid, kotak
       centang statis \u2014 mengikuti prototipe referensi RM.02/IGD. */
    .rm-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-family: Arial, Helvetica, sans-serif; font-size: 8pt; line-height: 1.28; }
    .rm-table th, .rm-table td { border: 1px solid #000000; padding: 3px 5px; vertical-align: top; }
    .rm-table th { font-weight: bold; text-align: center; vertical-align: middle; }
    .rm-table tr.sec-hdr td { font-weight: bold; font-size: 8.5pt; text-transform: uppercase; padding: 4px 5px; letter-spacing: 0.01em; }
    .chk-box { display: inline-block; width: 9.5px; height: 9.5px; border: 1px solid #000000; text-align: center; line-height: 8.5px; font-size: 7.5pt; font-weight: bold; margin-right: 3px; vertical-align: middle; }
    .opt-item { display: inline-block; margin-right: 10px; white-space: nowrap; }
    .filter-note { font-size: 7.3pt; font-style: italic; }
    .two-col-grid { display: flex; gap: 6px; margin-bottom: 8px; align-items: stretch; }
    .two-col-grid > .col-half { flex: 1; min-width: 0; }
    .rm-top-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; font-size: 8.5pt; font-weight: bold; }
    .running-header-box { border: 1px solid #000000; padding: 4px 8px; margin-bottom: 6px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; font-size: 7.8pt; }

    /* Editorial clinical: nomor urut otomatis, kepala pasien, dan ringkasan
       data kritis \u2014 tetap tinta hitam di atas kertas A4. */
    #pengkajian-igd { counter-reset: igdsec; }
    #pengkajian-igd .sub-heading-rm {
      counter-increment: igdsec;
      position: relative;
      padding: 3px 0 3px 30px;
      border-bottom: 1px solid #000000;
    }
    #pengkajian-igd .sub-heading-rm::before {
      content: counter(igdsec, decimal-leading-zero);
      position: absolute;
      left: 0;
      top: 3px;
      font-size: 7pt;
      font-weight: normal;
      letter-spacing: 0.08em;
    }
    .igd-masthead { margin-bottom: 9px; }
    .igd-masthead-label { font-size: 7pt; letter-spacing: 0.14em; text-transform: uppercase; }
    .igd-masthead-name {
      font-size: 17pt;
      font-weight: bold;
      line-height: 1.15;
      margin: 2px 0 6px;
      letter-spacing: -0.02em;
    }
    .igd-summary {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
      border-top: 2px solid #000000;
      border-bottom: 1px solid #000000;
      margin: 0 0 9px;
    }
    .igd-summary > div { padding: 5px 8px; border-left: 1px solid #000000; }
    .igd-summary > div:first-child { border-left: 0; padding-left: 0; }
    .igd-summary span { display: block; font-size: 6.5pt; letter-spacing: 0.1em; text-transform: uppercase; }
    .igd-summary b { display: block; font-size: 11pt; line-height: 1.25; margin-top: 2px; }
    .igd-band-value { font-size: 11pt !important; font-weight: bold; }
</style>
<header class="verifier-toolbar no-print"><div class="toolbar-row">
<div class="toolbar-group"><span class="toolbar-label">Formulir RM Klaim BPJS:</span><select id="rmSectionSelect" class="toolbar-select" aria-label="Pilih Formulir RM">${opts}</select></div>
<div class="toolbar-group"><span class="toolbar-counter">Tanda Verifikator (&#10003;): <strong id="checkCounter">0 / 0</strong></span>
<button type="button" class="toolbar-btn" id="btnCheckAll">Centang Semua</button>
<button type="button" class="toolbar-btn" id="btnResetChecks">Reset</button>
<button type="button" class="toolbar-btn toolbar-btn-print" id="btnPrintPdf">Cetak / Simpan PDF (A4)</button></div>
</div><nav id="rmTabs" class="toolbar-tabs" aria-label="Navigasi Formulir RM">${tabs}</nav></header>
<main class="dossier-wrapper">${cover}${docs}</main>
</body></html>`;
  }
  async function waitForPartials() {
    const visible = (el) => {
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0;
    };
    const deadline = Date.now() + 3e3;
    while (Date.now() < deadline) {
      const loading = [".swal2-container", ".swal-overlay--active", ".sweet-alert"].flatMap((sel) => Array.from(document.querySelectorAll(sel))).some(visible);
      if (!loading) break;
      await new Promise((r) => window.setTimeout(r, 150));
    }
    await new Promise((r) => window.setTimeout(r, 50));
  }
  function openDirectTab(html) {
    const win = window.open("", "_blank");
    if (!win) return false;
    try {
      win.document.open();
      win.document.write(html);
      win.document.close();
      installDossierHandlers(win);
      return true;
    } catch {
      return false;
    }
  }
  async function handleMklaimPrint() {
    await waitForPartials();
    let { sections, inventory } = collectSections();
    if (sections.length < 3) {
      await new Promise((r) => window.setTimeout(r, 800));
      ({ sections, inventory } = collectSections());
    }
    if (!sections.length) {
      window.alert("Tidak ada section berkas yang bisa dicetak.");
      return;
    }
    const html = buildHtml(sections, inventory);
    if (openDirectTab(html)) return;
    let lastErr;
    for (const delay of [0, 300, 600]) {
      if (delay) await new Promise((r) => window.setTimeout(r, delay));
      try {
        const res = await chrome.runtime.sendMessage({
          type: "OPEN_PRINT_DOSSIER",
          html
        });
        if (!res?.success) throw new Error("background menolak membuka tab");
        return;
      } catch (e) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : String(e);
        if (!/Receiving end does not exist|Extension context invalidated/i.test(msg)) break;
      }
    }
    const reason = lastErr instanceof Error ? lastErr.message : String(lastErr || "");
    if (!chrome.runtime?.id) {
      window.alert(
        "Ekstensi diperbarui, refresh halaman M-KLAIM (Ctrl+Shift+R) lalu klik lagi Cetak Rapi."
      );
    } else {
      window.alert(
        `Gagal membuka dossier: ${reason || "tidak diketahui"}. Refresh halaman M-KLAIM (Ctrl+Shift+R) lalu coba lagi.`
      );
    }
  }
  function anchorForButton() {
    const nativePrint = Array.from(document.querySelectorAll("button.btn-success")).find(
      (b) => /^printDiv\s*\(/i.test(b.getAttribute("onclick") || "")
    );
    if (nativePrint?.parentElement) return nativePrint.parentElement;
    const bar = Array.from(
      document.querySelectorAll('div[style*="text-align:right"]')
    ).find((d) => d.querySelector("button"));
    return bar || document.getElementById("SCETAK") || document.body;
  }
  var BUILD_TAG = "v2";
  function renderMklaimPrintButton() {
    if (!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor")) return;
    const old = document.getElementById("ext-mklaim-print-btn");
    if (old?.dataset.extBuild === BUILD_TAG) return;
    old?.remove();
    const host = anchorForButton();
    const btn = document.createElement("button");
    btn.id = "ext-mklaim-print-btn";
    btn.dataset.extBuild = BUILD_TAG;
    btn.type = "button";
    btn.className = "btn btn-primary btn-sm";
    btn.style.cssText = "margin-left:8px;background:#0f766e;border-color:#0f766e;color:#fff;font-weight:600;border-radius:4px;padding:5px 12px;cursor:pointer;white-space:nowrap;";
    btn.textContent = "Cetak Rapi M-KLAIM";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleMklaimPrint();
    });
    host.appendChild(btn);
  }
  window.extMklaimPrintNow = handleMklaimPrint;
  if (typeof g.featureModules !== "undefined") {
    g.featureModules.mKlaimPrint = {
      id: "mKlaimPrint",
      name: "Cetak Rapi M-KLAIM",
      description: "Dossier cetak A4 profesional: semua section berkas klaim disusun rapi di tab baru",
      match: { prefix: "/v2/m-klaim/detail-v2-refaktor" },
      run: () => {
        const check = () => renderMklaimPrintButton();
        if (document.readyState === "complete") window.setTimeout(check, 500);
        else window.addEventListener("load", () => window.setTimeout(check, 500));
        const keepLast = () => {
          const btn = document.getElementById("ext-mklaim-print-btn");
          if (btn?.dataset.extBuild !== BUILD_TAG) {
            renderMklaimPrintButton();
            return;
          }
          if (btn.parentElement && btn.parentElement.lastElementChild !== btn) {
            btn.parentElement.appendChild(btn);
          }
        };
        const obs = new MutationObserver(() => keepLast());
        obs.observe(document.body, { childList: true, subtree: true });
        window.setInterval(keepLast, 1500);
      }
    };
  }
})();
