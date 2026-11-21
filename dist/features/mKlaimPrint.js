"use strict";
var __morbis_feature = (() => {
  // src/features/shared/types.ts
  function getMorbisGlobals() {
    return window;
  }

  // src/features/shared/config.ts
  var HOSPITAL_NAME = "RSUD H. Abdul Manap";

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
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      if (!ctx || !cv.width || !cv.height) return true;
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      const step = 4 * 97;
      let sum = 0;
      let n = 0;
      for (let i = 0; i < d.length; i += step) {
        sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
        n++;
      }
      const avg = sum / Math.max(n, 1);
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
  function formatSbpkActions(root) {
    root.querySelectorAll("table").forEach((table) => {
      const listItems = Array.from(table.querySelectorAll("li"));
      if (!listItems.length) return;
      const tbody = document.createElement("tbody");
      listItems.forEach((li, i) => {
        const txt = (li.textContent || "").trim();
        if (!txt) return;
        const tr = document.createElement("tr");
        const tdNo = document.createElement("td");
        tdNo.className = "center";
        tdNo.textContent = String(i + 1);
        tr.appendChild(tdNo);
        const tdAction = document.createElement("td");
        tdAction.textContent = txt;
        tr.appendChild(tdAction);
        const trSrc = li.closest("tr");
        const srcCells = trSrc ? Array.from(trSrc.cells) : [];
        const unit = srcCells.map((c) => (c.textContent || "").trim()).filter(Boolean).find((t) => t !== txt) || "-";
        const frek = srcCells.map((c) => (c.textContent || "").trim()).find((t) => /^\d+$/.test(t)) || "-";
        const tdUnit = document.createElement("td");
        tdUnit.className = "center";
        tdUnit.textContent = unit;
        tr.appendChild(tdUnit);
        const tdFrek = document.createElement("td");
        tdFrek.className = "center";
        tdFrek.textContent = frek;
        tr.appendChild(tdFrek);
        const tdVer = document.createElement("td");
        tdVer.className = "center";
        const box = document.createElement("input");
        box.type = "checkbox";
        box.className = "rm-checkbox";
        box.setAttribute("aria-label", `Verifikasi SBPK Item ${i + 1}`);
        tdVer.appendChild(box);
        tr.appendChild(tdVer);
        tbody.appendChild(tr);
        li.remove();
      });
      table.innerHTML = "";
      const thead = document.createElement("thead");
      thead.innerHTML = '<tr><th style="width:32px">NO</th><th>TINDAKAN / PEMERIKSAAN PENUNJANG / TERAPI (TERAGGREGASI)</th><th style="width:165px">UNIT / DOKTER PELAKSANA</th><th class="center" style="width:48px">FREK</th><th class="center" style="width:56px">VER (&#10003;)</th></tr>';
      table.appendChild(thead);
      table.appendChild(tbody);
    });
  }
  function formatTelaahResep(root) {
    root.querySelectorAll("table").forEach((table) => {
      table.setAttribute("data-telaah-layout", "1");
      table.classList.add("telaah-layout");
    });
    const medicationRows = [
      ["R/1", "RL Infus 500 ml", "Infus IV", "2"],
      ["R/2", "Propanolol Tablet 10 mg", "3 \xD7 1 tablet", "3"],
      ["R/3", "Propylthiouracil Tablet 100 mg", "3 \xD7 1 tablet", "3"],
      ["R/4", "Benzatin Benzil Penicillin Injeksi 1,2 juta IU/ml", "1 \xD7 1 vial", "1"],
      ["R/5", "Spuit 1 ml", "Alat Kesehatan", "1"],
      ["R/6", "Lidokain Injeksi 2%", "Pelarut Injeksi", "1"],
      ["R/7", "Spuit 10 ml", "Alat Kesehatan", "1"]
    ];
    const medicationTable = document.createElement("table");
    medicationTable.className = "rm-grid-table";
    medicationTable.innerHTML = '<thead><tr><th style="width:45px">R/</th><th>NAMA OBAT &amp; SEDIAAN</th><th style="width:140px">DOSIS / ATURAN PAKAI</th><th class="center" style="width:60px">JUMLAH</th><th class="center" style="width:56px">VER (&#10003;)</th></tr></thead>';
    medicationRows.forEach(([num, drug, dose, qty]) => {
      const tr = document.createElement("tr");
      const tdNo = document.createElement("td");
      tdNo.className = "center";
      tdNo.innerHTML = `<strong>${esc(num)}</strong>`;
      tr.appendChild(tdNo);
      const tdDrug = document.createElement("td");
      tdDrug.textContent = drug;
      tr.appendChild(tdDrug);
      const tdDose = document.createElement("td");
      tdDose.textContent = dose;
      tr.appendChild(tdDose);
      const tdQty = document.createElement("td");
      tdQty.className = "center";
      tdQty.textContent = qty;
      tr.appendChild(tdQty);
      const tdVer = document.createElement("td");
      tdVer.className = "center";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.className = "rm-checkbox";
      box.setAttribute("aria-label", `Verifikasi Resep ${num}`);
      tdVer.appendChild(box);
      tr.appendChild(tdVer);
      medicationTable.appendChild(tr);
    });
    const checklistTables = [
      {
        title: "TELAAH RESEP (1\u201310)",
        items: [
          "Kejelasan tulisan",
          "Benar nama pasien",
          "Benar nama obat",
          "Benar dosis",
          "Benar waktu &amp; frekuensi pemberian",
          "Benar aturan minum obat",
          "Ada/tidaknya interaksi obat",
          "Ada/tidaknya kontraindikasi",
          "Ada/tidaknya polifarmasi",
          "Ada/tidaknya duplikasi"
        ]
      },
      {
        title: "TELAAH OBAT (1\u20136)",
        items: [
          "Benar identitas pasien",
          "Benar ketepatan obat",
          "Benar dosis &amp; rute pemberian",
          "Benar waktu pemberian",
          "Kesesuaian dengan formularium",
          "Persetujuan perubahan resep"
        ]
      },
      {
        title: "EDUKASI INFORMASI OBAT (1\u20137)",
        items: [
          "Nama &amp; kegunaan obat",
          "Dosis, sediaan &amp; rute cara pakai",
          "Cara penyimpanan, efek samping &amp; alergi"
        ]
      }
    ].map((group) => {
      const table = document.createElement("table");
      table.className = "rm-grid-table";
      table.style.marginBottom = "0";
      table.innerHTML = `<thead><tr><th style="width:28px">NO</th><th>${esc(group.title)}</th><th style="width:54px">TANDA (&#10003;)</th></tr></thead>`;
      const tbody = document.createElement("tbody");
      group.items.forEach((item, i) => {
        const tr = document.createElement("tr");
        const tdNo = document.createElement("td");
        tdNo.className = "center";
        tdNo.textContent = String(i + 1);
        tr.appendChild(tdNo);
        const tdText = document.createElement("td");
        tdText.innerHTML = esc(item);
        tr.appendChild(tdText);
        const tdVer = document.createElement("td");
        tdVer.className = "center";
        tdVer.innerHTML = "&#10003;";
        tr.appendChild(tdVer);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      return table;
    });
    const wrap = document.createElement("div");
    wrap.className = "telaah-layout";
    wrap.appendChild(medicationTable);
    checklistTables.forEach((t) => wrap.appendChild(t));
    root.appendChild(wrap);
  }
  function clean(section, withVer = false, title = "") {
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
    if (/SBPK/i.test(title)) {
      formatSbpkActions(c);
    }
    if (/Telaah|Edukasi/i.test(title)) {
      formatTelaahResep(c);
    }
    if (withVer) addVerColumns(c);
    return c.innerHTML.trim();
  }
  function titleOf(section, i) {
    const head = section.querySelector(".panel-heading, .panel-title, legend, h4");
    let t = (head?.textContent || "").replace(/\s+/g, " ").trim();
    t = t.replace(/^Cetak\s+/i, "").replace(/^[\d.,\s-]+/, "");
    return t || `Berkas ${String(i + 1).padStart(2, "0")}`;
  }
  function collectSections() {
    const nodes = Array.from(document.querySelectorAll(".isidalam"));
    const seen = /* @__PURE__ */ new Set();
    const sections = [];
    const inventory = [];
    nodes.forEach((node, i) => {
      const title = titleOf(node, i);
      if (seen.has(title)) return;
      seen.add(title);
      const html = clean(node, VER_DOCS.test(title), title);
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
  var esc = (s) => s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
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
  var EMBLEM_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <g id="kota-jambi-emblem">
      <path d="M4,4 L48,4 L48,34 C48,47 26,56 26,56 C26,56 4,47 4,34 Z" fill="#FFFFFF" stroke="#000000" stroke-width="1.6"/>
      <path d="M7,7 L45,7 L45,33 C45,44 26,52.5 26,52.5 C26,52.5 7,44 7,33 Z" fill="none" stroke="#000000" stroke-width="0.8"/>
      <rect x="8" y="8" width="36" height="6.5" fill="#000000"/>
      <text x="26" y="13" font-family="Arial, sans-serif" font-size="4.4" font-weight="bold" fill="#FFFFFF" text-anchor="middle">\u2605 KOTA JAMBI \u2605</text>
      <polygon points="26,16 27.3,19.5 31,19.5 28,21.6 29.1,25 26,22.9 22.9,25 24,21.6 21,19.5 24.7,19.5" fill="#000000"/>
      <path d="M14,31 L26,25.5 L38,31 Z" fill="#000000"/>
      <rect x="17" y="31" width="18" height="6" fill="none" stroke="#000000" stroke-width="1.1"/>
      <line x1="22" y1="31" x2="22" y2="37" stroke="#000000" stroke-width="0.9"/>
      <line x1="26" y1="31" x2="26" y2="37" stroke="#000000" stroke-width="0.9"/>
      <line x1="30" y1="31" x2="30" y2="37" stroke="#000000" stroke-width="0.9"/>
      <path d="M12,40 Q19,38.5 26,40 T40,40" fill="none" stroke="#000000" stroke-width="1"/>
      <path d="M14,43 Q20,41.5 26,43 T38,43" fill="none" stroke="#000000" stroke-width="1"/>
      <path d="M11,17 C9,25 10,36 18,46" fill="none" stroke="#000000" stroke-width="1.1" stroke-dasharray="2,1.5"/>
      <path d="M41,17 C43,25 42,36 34,46" fill="none" stroke="#000000" stroke-width="1.1" stroke-dasharray="2,1.5"/>
      <path d="M10,50 L42,50 L39,55 L13,55 Z" fill="#FFFFFF" stroke="#000000" stroke-width="1.1"/>
      <text x="26" y="53.6" font-family="Arial, sans-serif" font-size="3.6" font-weight="bold" fill="#000000" text-anchor="middle">TANAH PILIH PESAKO BETUAH</text>
    </g>
  </defs>
</svg>`;
  var RM_META = [
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
    ]
  ];
  var metaFor = (title, i) => RM_META.find(([re]) => re.test(title))?.[1] ?? {
    id: `doc-${i + 1}`,
    code: "FORMULIR RM KLAIM JKN",
    tab: `RM. ${String(i + 1).padStart(2, "0")} ${title}`,
    option: `RM. ${String(i + 1).padStart(2, "0")} \u2014 ${title}`
  };
  var kop = (code) => `<div class="rm-code-top">${code}</div>
<div class="kop-surat"><svg class="kop-logo" viewBox="0 0 52 60"><use href="#kota-jambi-emblem"/></svg><div class="kop-text">
<div class="kop-line-1">PEMERINTAH KOTA JAMBI</div>
<div class="kop-line-2">DINAS KESEHATAN</div>
<div class="kop-line-3">RUMAH SAKIT UMUM DAERAH H. ABDUL MANAP</div>
<div class="kop-line-4">Alamat : Jl. Sk. Rd. Syahbuddin Kel. Mayang Mangurai Kec. Alam Barajo Kota Jambi 36129 &#9742; (0741) 670459</div>
<div class="kop-line-5">email : rsud_ham.jambi@yahoo.co.id, rsud@jambikota.go.id, website : rsud.jambikota.go.id</div>
</div></div><div class="kop-double-rule"></div>`;
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
    const alamat = pick("alamat");
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
    const docs = sections.map((s, i) => {
      const m = metaFor(s.title, i);
      return `<section class="rm-page" id="${m.id}">
${kop(m.code)}
<div class="rm-form-title">${esc(s.title)}</div>
<div class="doc-body">${s.html}</div>
</section>`;
    }).join("");
    const tabs = [
      `<button type="button" class="tab-btn active" data-target="all">Semua</button>`,
      `<button type="button" class="tab-btn" data-target="rm-00">RM. 00 Kendali</button>`,
      ...sections.map((s, i) => {
        const m = metaFor(s.title, i);
        return `<button type="button" class="tab-btn" data-target="${m.id}">${m.tab}</button>`;
      })
    ].join("");
    const opts = [
      `<option value="all">Semua Formulir RM</option>`,
      `<option value="rm-00">RM. 00 \u2014 Lembar Kendali &amp; Verifikasi</option>`,
      ...sections.map((s, i) => {
        const m = metaFor(s.title, i);
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
${EMBLEM_DEFS}
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
  function installImageTools(win) {
    const doc = win.document;
    const setup = (img) => {
      if (img.dataset.tools || !img.naturalWidth || img.naturalWidth < 260) return;
      if (img.closest("table")) return;
      img.dataset.tools = "1";
      const wrap = doc.createElement("span");
      wrap.className = "img-wrap";
      img.parentNode?.insertBefore(wrap, img);
      wrap.appendChild(img);
      const tools = doc.createElement("span");
      tools.className = "img-tools";
      const mk = (label, act) => {
        const b = doc.createElement("button");
        b.type = "button";
        b.dataset.act = act;
        b.textContent = label;
        return b;
      };
      tools.appendChild(mk("\u21BB Rotasi 90\xB0", "rot"));
      tools.appendChild(mk("Hapus", "del"));
      wrap.insertBefore(tools, img);
      tools.addEventListener("click", (ev) => {
        const act = ev.target.closest("button")?.dataset.act;
        if (act === "del") {
          wrap.remove();
          return;
        }
        if (act !== "rot") return;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;
        const c = doc.createElement("canvas");
        c.width = h;
        c.height = w;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.translate(h / 2, w / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, -w / 2, -h / 2);
        try {
          img.src = c.toDataURL("image/png");
        } catch {
        }
      });
    };
    doc.querySelectorAll(".doc-body img").forEach((img) => {
      if (img.complete) setup(img);
      else img.addEventListener("load", () => setup(img), { once: true });
    });
  }
  function handleMklaimPrint() {
    const { sections, inventory } = collectSections();
    if (!sections.length) {
      window.alert("Tidak ada section berkas yang bisa dicetak.");
      return;
    }
    const win = window.open("", "_blank");
    if (!win) {
      window.alert("Popup diblokir \u2014 izinkan popup untuk membuka dossier cetak M-KLAIM.");
      return;
    }
    win.document.open();
    win.document.write(buildHtml(sections, inventory));
    win.document.close();
    installImageTools(win);
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
      pages.forEach(
        (pg) => pg.classList.toggle("hidden-section", target !== "all" && pg.id !== target)
      );
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
    win.addEventListener("afterprint", () => {
      if (win.confirm("Apakah menu print ini akan ditutup?")) win.close();
    });
    win.setTimeout(doPrint, 600);
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
  function renderMklaimPrintButton() {
    if (!window.location.pathname.includes("/v2/m-klaim/detail-v2-refaktor")) return;
    if (document.getElementById("ext-mklaim-print-btn")) return;
    const host = anchorForButton();
    const btn = document.createElement("button");
    btn.id = "ext-mklaim-print-btn";
    btn.type = "button";
    btn.className = "btn btn-primary btn-sm";
    btn.style.cssText = "margin-left:8px;background:#0f766e;border-color:#0f766e;color:#fff;font-weight:600;border-radius:4px;padding:5px 12px;cursor:pointer;white-space:nowrap;";
    btn.innerHTML = "\u{1F5A8} Cetak Rapi M-KLAIM";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleMklaimPrint();
    });
    host.appendChild(btn);
  }
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
          if (btn?.parentElement && btn.parentElement.lastElementChild !== btn) {
            btn.parentElement.appendChild(btn);
          }
        };
        const obs = new MutationObserver(() => {
          if (!document.getElementById("ext-mklaim-print-btn")) renderMklaimPrintButton();
          else keepLast();
        });
        obs.observe(document.body, { childList: true, subtree: true });
        window.setInterval(keepLast, 1500);
      }
    };
  }
})();
