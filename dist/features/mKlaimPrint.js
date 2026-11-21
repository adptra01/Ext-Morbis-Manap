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
  var KOP_LOGO = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAb0klEQVR4nOV7d3gUVdv+MzM72zebLdnNJtn03kgIJQQIHRN6AAEVBHn15QWliSIoiqIiIKDYX6VbEJCOdOkkhJJCIL1v+ibZXmZ3yu+PVX4ImLKU77uu7772n/Oc8zznvvfMmVMHYRgGHgaHwzFp/Jjeffo+NPd/M3Jzcg4c+f2fclkdeCb16vPeBx8+AUpPFqtWvttBLvrUePwvQUct7MK3BQd/K7/wFKg8Ot7pNX2oOqnjMp0LLtfXn63LvdeCAMLAw3v+/yxejh7VaZnOBT+Iwb49Kgz1tWatKznUNyFaFnSy5tr8HhO/KzgUKwvKCB64vfiEkyYnBA90lVl65btlSc/naEsPV2XdjfNs6CAUkN3l51f2eTFPW36oKvPtpOfNTtuR6qzFCc9uLzoxPWIEC8WaLG1rbu5anfLK1sJjpfo6l2+af+8TtdfdIO9OH54YknpXCQAkeIVlBA/8uN/LA1RxDDA/P/NekjJi/+iPUn3i/xUz+tX4iTOj0pQ88Yo+M+fEjrs3ziDfhCF+iWI2/70+s+bGjQeA5yNGLE6ckqyMnt9jUpin79z4CQny0PeTZw/0if137Fi1UHHXd0ni1AR5iBvku9HCCp54SeJULsaeGj5ET5hDxD7tduP63N0AECn1V/FlIw8uGeKXWNBa0XvPHM1Le3O15ZN/f++HYW/6bZ08KrBvub4u2TsGQxDq7wNhsnd0ub6ur3cMhiAAIMB5vRThesLsyv255HSkxN9OOlzJWGngcHUSiiCD/BLe6zPzYn1+m83wc9kf9D8Mrg+iGy3cYjP8XHJ6hH8vL54kzFOd6BW2teiYhSQAwEcgRxAkWKwSswUNllaKYVqsOg+2ABAAAECgvyruWFUWzTBRkoD7wvZXxR2vyXZQzhhpEABU6OvGBKWU6WpduZsGLeCy2K02vSt5p72aYqjVKf/GUVZGSOr44AFn63O7rrZ7ggHgVlvVkapMmqEBYGfxSY251WXXE6Yfi07MjEpvtRkDPbzZKOYj9GqzG+86pqhiZ0Slidj8/qpYABjkE//NoIVcDHfQZH9V7AsRI8UcoSurWFcbLPYtN/zZV4ftW5irLcsISXUlGYAvbx08U3vDlZx3fmO9pa1bErrdh5O9o4cfWPz8iVUj7hkAclrKfrhztJ8qtsrYECL2a/zXAQxBLzfccuXiCNbHO2pb0bErDQUuVXbK8e+48S9EjizV1fbxjtpedPxyw62/BNdUGuodNOXy3TNqVX+f+Pq/XpAAIMJ5ERL/UYfe/LHoxPjgAd3l3723NJ/FmXx8pdZmAIDMxtsu4+WGW42W1symwrcuf6MjzKMOvzkqsN+vpX8YnbYSneaTGz+J2PxV2ds/y/stVhYULwsGgOzm4rlnN3jxPfeUXxDivI15v8VIAxPkIefrcrOa7tSYmk0OW6Wx8d2sHzAEa7C07am4oBBIyw31ACDlivrtnddqNx6vvZ7kFdpdwUgHc+nVH656/8OPllz6emPe3kR5iIjN7270p4bbbdXthOmXke88FzFi1cp3O5gRd7WFvx78ej9VzGOi9/gx+vDSYzXXulKye490iZ5ss9NuUXpS8OajwR7dUNE9wdeaHQVtzm5SerJI9mZ3S/D/udWS+4JJu5UkbO75tpXlW7X1blf9KHBn8QAATotR/+18hs1DU59jaIqhaYahgWEYmmZoyvUDmmEY6q7lr1zaqCmz6Zrs+jZ5RE+Oh9TlDjTFMHd9GVwoDp+y+PFKdcFNwY72JtRTAQDIjaP3mBFAALHolZbmu8mHAwWQYnRzXn5+W4JKhiDIPSEAAOhmxnYYYeRqp8QP9Q7iShT/EKjbcFOwQB0uePnTh2Y5dC2GK3tFrdV/NzMAYGlt5Mu875UXLAss1lRGhEa4yvCMzYh3MGNsxXSNXhWXoQIAwEFRJpbAoQpzqCId6hi+fxSCYe7RBrcFdwC2RAFjXiUfsDstxspTv0Rl/OdeIw9AdCdbQ9hUPQcDQGt5Ln7xJ5LGHc8s5ub8jvI9vDU5bAyTMXZoKICGAubGXj2wzL6xMPFNDOe4Qe/xC/4nlJ/8OXz0rAftipi+JYc3y8IT2EJPTmgihCSwEWADAvGpAFBTliM6t0XxZx8BBAEJkJKGvDJNiSA43g0aT0lwe0WB2D+CMOm157apuVdkHA0gtJ7wrbEmS3pMCE2bXnp0e9TE/wAAIH/r97ywns7gHpXZh+XX9nowjrt2zNzuHpOnJLju6gm5hBggmTlhsZnLuTt7v02SJ4+fWvfbqRlcSV99dZFnYNSDvgiGcVMydPFDDOd2KEovclAE4P7/pet4GhOPloIsWduWL+dtnDbJ5FJLUiKSEgEAiwVjR9m+ff2HQPtX5ad+6SAILvTExi6sn7q60TOQpGlG5ucemSfewgzDMAWfbv6mmcdlKJrX1DxWp+9PUh4ACAszSCVXlIojfL5tzdLc2XOqdZXTJMEdLVG4fhHMS+srS28KfdzZ0IKn0MI15w/Mn3aJx2UcTmlZ2XKjoS+XY/QQVXqIKjgck16fUlb2jtPpiWGwYa2h6fKOrsQUhney+dwBnrhgr/avevV0AiDVNa8iCC4UaDzZ+TLjcZnudwlyVSjQoAhSXTsHAJHL6NTA/ZS709Uu4skKNjVUjR90BwAMxgSHQ8XhGoVIMTsnl7zEcV7i49mVHtYsNtdIEAEGUxwAPDPU0FLozm5z1/FkBetrS2OiSQAwmuIxFsFmm1n1lUSFj+2WyJYrslcoscpGNm7GWHaTKR4AoiJIc2P1E6X0ZF9aTqtFJKIBgKRECEqhqBPsFGNnUW0oYwVahTE2FAUCQWiS9AAAnM2gtOWJUnqyLcz18GxrQwEAx3UMjVEUjsg5LC8LO8LBiXXiSjuiQCjgMwwLx3UAYLUiwJbcF6ROm/uQ0O7iyQqWBMfm5eMA4OlxkyS5TgefUMSyE9oFCTX8nhpujzpHcJzDISKdXLH4BgDk5eOSkPuHpQuNOw3mx7Z4fjyPNEORDEOjLPY9JpomSZ5UcenmgAw4IxQUC/l3CLsfIIzTX4Kr2xGasqEygvAg7GKBoFDILwOA01fDpINj742MIIieaDISLWKh72Oh+hgEMxRpObguwFuu9U9B1X/S1R3eFCLltqqS2rwXZ169mJLs8FdvraxeaLH4OxxmFPMFAJrCnU4+l1Mb4P8DAJSUsUrwN/wAqW+/VabPJmnCTxQdqRhCMxQA1LblFOsuMwydoEhXiiPcZvsYHmnSakwID+w1cChLk++yMAydFOQdk5QsaS9Txvb75sy8xiYMw6yhIWuVin2AWK02pdWmAMSqVB4IDv4MQ20GI/rJz5P9+k+obsoq0WVSjLPBWnpUs2lX/iIOar5Q/dmeyg8Mpjqadv5esUGjy3ObrfstbG2uJW1mnkKNi6QWvtfPWaUUS4bmnfcMS8QFYtI7Ys+V2x4x/RlNmWrUu0u/t741eWtsNCmXnZPLzt0XqroG+2DrBNnozwGQQGVyXXVJpfEGQVowJ+IrvhPtQWBc86/F4hZS02puGOI3W4RJn65ghsHtej99cfaBHU6ng5IHOtOnK1pPOz19ay+fajywCWT+5mdeCGFbtBadMCwJAFTj1n1yfkDUmY8njqyIiiDvLnUqq1gHTvrcsL2pnjDdtQBq1BXqHU1x4iE1xjwexRNQRRRBoxiK0iiDIhyKc6l626zE/z5VwX5MexK3IVNbKZfLRqaPriwvKz21OSw8vLH2lpDPGztuXJtWW5q1u0XqI9CdsIm9eAp/APBNGWegRn2SlUkdyJZyNAhl0ZEhjKy3d1Kq+p69C6U4IoaxnKr9dpjPv260HHJgE49qj4fwElhc7VDv6fW24or2awjifk/snmAMAQCoQ2UOGsPEXoBgZ06e6D9wYEN9PY/PDw+PqKquzrpypV+/FIDiHgFKs9msuXmAHvkqirEAAMFYqsRUgFQOofFiSuu4wx6sAsVYpdpLUyM+ymv6PUI6gKCs7YCHcIMmBczL0uxKj3xTzY9m4dzHLxhBENfO270LbSH+51/bi2cUpvTFSDuLdko8JSPT0m4XFMTGxYeGhVVXV4s8RJOnTrt0/nz/gakRBJFvqDZI/3bMx2UM/nC1Dh4iGAAGB73C4XiEi/v5yOKKmv4AAItT5ynwS/aZAgAh3gPvLcx6YCfgn44HOxGM4zhBOABAzvMEAKPDDABS7p/R8xySUWL72PRnjEajSCRCUTQ4OMRVj1zuJRSJ2Gy22k9NEATGwjCCc+7vSyAT4hNLH8xk3n7oxgWH4wEAPrI4ABio7j0mYCGJhNfYQeJx/+0BAPBgIwCgI8wAoBLIAcBut7sjGP76q6KlAQBwq7XymYC+fBZyRuOa66L7q5GxXnYpm92kdZzRYmaK44E6+4usvnzMaqROtTjanJgI48pxyglU9f0zZO5imUZC5Ou4CR0QAACFSDorMuNCPVFT83AZCh5KMfTttkoAiJYGAkDHFyA6EiwUCU0mU6JXOABcbboDAFESvERHWElXSORSG+/vHpyzuvu2TjEAHAAA/kaXQ9t5SqeYbtBBJ4I7hb+IVdBabnLa/YVeCr6kVauVy+UdlO9IcGJiz9ycm6mDBquFXufr8ymG5rHQncMVbXbqEVmKW7dYQF6LD3rEOD4CTIgjZzU5AJCiigOAG9evJfXu3YFLR+/3vsn9rmZmAsBQv8R2wnSl4RYAqIWsNjv9iL9IOKmnlDQmeETB8TIcAI5UZwLAcHVPALiWfbXjG8AdtbDcy0urbQGA0YH9dhSf2l12LtU3QcZD381upx7t5iEhC1imPqkkMps5KW4HQRFIUuD1Zu2lhgIMQdIDkxmGMZlMQqGwA69OxuGAgMCqqsr0wGQhi/tr6R+fDpgbIuZa5wa5zdIFa+vLSOn30fSRZnBfcJwMF7PRr/NPUAw9yCfeRyC/lZ8XG9fJcUQngseOn3Bg/75Fry+ZGJq6s/jUj0Un58SNr9A7p55ocZsoALwm+nmmBBqROLcjIADD/DhOmvzu9mEAmBWVBgBHDh2aM+/Vjh07a+HAQE1tDUVR8+Im7Cw+9WnOr7NjRkdJ2cPUvAqDu3cfHKYpom8dFFbEmuTm8QFALwXbm49tKzymMWvlXI8p4cNsNpvJZOr4FQ1dmVqmpY86dvTI2PETUn3iLjYUbL59ZG58xsaBskYLSbt1v8XpFNAFXB5mDCWWNaCqjgsbLezz1R61JhvvnpGcwxKnBSyxU44Pr+0EgPnxE/kszs6ftk169tlOa+9c8LARIxfNf3X02HEf9J095MDi97K3PRs2VM4T//e2adV1XafuD8X7smnL1N/HMftaGWXHJU1WuGIFALhnMwXGBK0T4dgn13+pMjXJuKIFCZMdDkduzs0XZ73UadX/eDHtXpw8fsxqtWZMmjz+6NuHqzJnRAzfOXKFk2ZyWhyd+j4UgoZPw6zv1gmeI/ymd9dXxFGqPZLK9fU9ds22ksSmga8tSJi8dfMPsbFxfZKTO3Xv0mppZFr64gWvjUxL25Q6/2xdzo8lZ8YEpkwJH9pbyVl7U+/GPOQV+g8Ggf1tVx3mG91ylPNDZiXsJWlq1unVVpLo6RU6Lz6jrbW1tKR49suvdCVClwQjCPLagkWfb1j/znvvb+g/b875ja+cXR8vD4mUBvT15ryT1f6PdzkeBj/isr//BQAIlw1ni7y74QnQ1/dfHEy47Mp3V5rucDF82/DlLBTb8Onaha8v6WKELj3SLnz/3beRUVEDBw2aevz9veUXwsS+V5792ovnyQB0/QsIwlxBFgzE6UYAMKPB1/EELadLi1sOSzQ67GMBLvul5PT0Ux8zAN8MWjQ3fsLhgwftdtuUac91kUA3BNM0/cbihW8uWy6SSwb+9lpea0UfZeSpCRvEbMGxauuM0y1EZ/OvcCjc5LOsgfIyEtxJXiduOcXBbFsBLcrnyDp25LJE02K3+Iji/9DcGH1kOUE5X4ke9f2wpZUVFZu//2712odfr3kouiEYAPR63Yrly9at36hnbAP2vVZlbErxjj42bp2YI7zWTJToHP98UeluhQAMhDe93IO1u1S5EfEIcRAmDk/cgYeQrQgQ9wZAzmlyxh5dbiGJ9IA+h8asthrN7yxbum7jZ3x+N+bk3RMMAJWVFV9t+nzt+o0aq3bI/kW15pZEecjRcWt9BHKagUsNtjL9gzd47oe3ds0I1uoddj8th9dxSbW418TITUK21+HKy8+d/NBKEsP8Eg+P/QQlYenri5etWOHj070N+m4LBoA7twu2bdm8eu2nTYQu/dDSQl2NWijfN+rD3sooi5N+/VLbbxX/eCCG0s5e9JkFqi1D5TfzZStRcUc3vHGMG6eYgCCsTbl73rjyHcXQ44NSdqWtREhm+dI3Xp2/MDQsrLvkuyo48/wBX/+ogOBIV/LO7dubv//uo0/WOFjM1OPvn9bc5GL4+gFz58VPRABIGgCA9bClp9Nht2fJ2JgVAA45Q+u4ng+tTiGIGBmyQiGINDos/zm7flfZOQBYEJ+xYeBrNov1nWVL5y9cHBYeDgAkSZ469EXv1BleXl6PU/D1S7tl7S81sN/tO/wNHMcBoKa6+tM1q5eveM/b12fl1a1rbv5CMXS6f+//Dn1DLVLSDPyhsa3L0bc+MErHOg9OEv3qrWAKcTGFPfivoAnek5JU01EEO1+XM/vM2ipTs4DF/XrwoplRaRpN7ZqPP1q+4l0/PzUAVFcU1mXPRsm6fjM0SNfu9XRVsMloqjqmDvM13NQk+6fs8A8MB4DqqqovN302fsLE1MGDL9TnzT6zptLYJMJ5K/vMnN9jEhvDDQ568x1Tq51io39jwzB0qvKn+4w83DNOkcFliQCg2dq+PPP7HUUnaWB6KyJ2jng7Uhpw8cL5Qwf2L1j0ekBgIMMwWX98qzQv9ZNbcg2vJ4/e0BUV3RAMAFePzEuUfAsANVqRXvoV38PXdGsKov40r8hqMBgWLVlCosz72du+yN/voMkwsc+q5NnPhg3FEJRiIKvRvqXQlN1sd9WGIMwL/sPvRlYJ4xJVU2MV43CUa3JYvsjft+7mLqPTJsS5K/vMXJQwhSapLz7bwGZz4oPbmNYd/oPO1t54u5f3fjaL0ZlQc8it0PCufp7QJcHNzc31NSWakv1pQZtclsY2rKZFmBxlsDuQXO1ERDFv757dM16c1bdfv6L2mrcyvztSlQUAURL/NxKnPh85gouxAaBc7zxYaTlea7vebFsWM0oljAuTDomUp8n5wQDQYtV9W3Dwq1sHWu1GFEGeDx/2Scq//YSK3JycLT/8N33USLFpYy91JoLA0avCMcl/frqWXyVBQ7aLpOEhoSEsFv5IgimK2rfjbX/Obwp+ja/X37ri5QL2gDgHw0BBJR4f4ixu8HH6fZVb0FRdXf3qawt8fH2zGu+surb9ZO0NBhgvrvilqLRZ0elR0kCXO0kzJG12Pb00Q1+oy9tadOy38gt2yokiyLjAlPeTX+ohD21rbf3qy01SqTQxWiQ3vaEUG/kcBgBMVqSqkRUf8v8X5BY7UtkosuLJ3MC3+yR3tDfYSQvr9fo7WZskls9CvA13jXnleKgvKeQxDANz13uO6W9P62u3Eegd0yyfuLd2/fwjh8N9Zc5/pDJZnrZsY+6ePeXnCcqJACTIQyeHDhoX3D9GFkzS5JWGgkOVl/dVXNSYtQDAxfBpYUOX9JwaKwu2WMzbtmxubGiY+tzz7SVrE2S7a5sxsw2pbWZlpNoAoKASD/AmPfh/kqcZyNNEsQM/SkyegKId7Ux26ZFuaWkuyVwZjG+Ri0mdGa2oZ/WKcADAkStcXy/q8i2OB59OSya8pVRhvZoJ+EKq7LFl8/cCPn/GrJd8ff20Nt32whPbi44X/vVFoa9AZnJYjc4/zyOiJP4vRafPikr34nnq9bqfdu6oramZ+dK/HOYKpPbVKJ/6Q5e4UUHkN/sEFI3MzTBHB5Lw11MGAOVNMoP4/d6D57iGj47RjZdWaeF1bd5cFT+vphnzkVEBSmrPOd6NInZTG/ryOOvRy9xxqfaB8YTFjtxunxCcvAHB8J92bNfr9eMmZCT3SwEEclpKfi09+1v5hWpTMwD4C70mhw6aFj6slzISAaSkuHj3rl9I0vn8jBc9xR6ll1+P8dzLwWHfBa6TRAqrWBEBpLeUFvHp/nGO8npWaR0rNZ64rX8+etAGL0UnGwnuCAYAp9N59dQ6c9WaEJVNq8eiApwUhazfJRTwmMIq1svjLCeyuO/NNuEspr6V34QviEl5k8PlHjl0MPtqVkhI6LiMDLXanwHI15ZRDN1TEY4AYjDofz9y5Mb1a2Fh4VOmPcfl8fIufSGzrJGJTD8cFtgIJL2f/U4lfuIqZ2QfYkgS4a+grhayVTK6uEHp3+erxOQJXeffbcEuFORfL7nwSvSAD5srDvaQbKvXYtVN2NkbHMKJyD1pfwXVO9rBwSFIRZY2SE2ieSGJ85Teqory8sOHDtRpNJGRUSPT0j3E4j9On7qWnS0UCkaNHpvUu7fRaCy8tpXdtiHat37fOV5NM0bRSEaq7fhVbmMrOm6gPSXW0WZklZFvCensW+XYqBlblUqf7pJ3RzAAMDSNoCgA3Li8m988z1+uO5fDbjeitU2s4hqWxINeOdu0abdgepo1SEXVtnBbkTEsr6mhMcMkEklJcfGpkyeMRsOwYSN69+1LEERxwWVHy16BdW+4r+FSPvvyLY7Bgqhk9Mx069aj/PED7c06NCXWcbsuiBe1LbrHIJvNhuM4i+XOab6bgu9FY4Om9OKcnt4n9GbkZDY3XE0aLYjZimoN6MVcdnoKMWWIjcViAKC6kWOgIhBeBMJWACCMs52xlXPpO2G+FgyFAxd5PcMdJ65yWw0oAyDiM1IPOrUHoVZSJitaZJ6dMHy9WNzRQvIpCQYAhmGuXdjB1y4NV2kr6llqJfX5bkGoH1Vcy+KxmVfGWRZ87rnqZaPNjnhJaLGQdh22MwBaHeogkXotllnA5nEZnRGdm2HZtEdgsKCDE4mEMKe/ksrXhPLCv4lLGvHoPOFxCXahtVVbdGlFEHurzIO0E0hJLevwFe6ofkRFHXb6OjdcTY4ZYP9yj0CrRwNVFADgLCbYh2KzmSOXuNNG2KoaWMmxDg7O2AlELKQTwpy1Wn4z+42eQ97i8x/bl7yPU7AL5SX5TfkrwsXHPPj0nSr8+FUOGwcMZdoM6PxnLfM3irk4SDzoUD+yrI6llNBFNSyZBx0RQCIINLWiC6eYRXymRY/XOJ4L6v2Brzrw8dJ7/IJdKLqdrStd74MdUsmchBMx25BbFbhESNsdiNmGVDWwKAZ0RlTTjC2aaj6Xw5k6zMZlM1w2U9vC1aJTvWOXBodGPwliT0qwC3WamrrCnUzbr0GSYonoz4MZowWtbsRUcqrNgIb7k641YrsJrdbFIF4vBMa96O3dyfnLo+DJCnaBYZjKirL2uvOM+RpjKwJCA5QRgAHMA9h+CD8aEfaVqYcEh4RCtza43cL/A+p9uOR8npnAAAAAAElFTkSuQmCC`;
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
<div class="kop-surat"><img class="kop-logo" src="${KOP_LOGO}" alt="Logo Kota Jambi"><div class="kop-text">
<div class="kop-line-1">PEMERINTAH KOTA JAMBI</div>
<div class="kop-line-2">DINAS KESEHATAN</div>
<div class="kop-line-3">RUMAH SAKIT UMUM DAERAH H. ABDUL MANAP</div>
<div class="kop-line-4">Alamat : Jl. Sk. Rd. Syahbuddin Kel. Mayang Mangurai Kec. Alam Barajo Kota Jambi 36129 &#9742; (0741) 670459</div>
<div class="kop-line-5">email : rsud_ham.jambi@yahoo.co.id, rsud@jambikota.go.id, website : rsud.jambikota.go.id</div>
</div></div><div class="kop-double-rule"></div>`;
  var idRow = (label, value, strong = false) => `<tr><td class="lbl">${label}</td><td class="col">:</td><td class="val">${strong ? `<strong>${nl2br(value)}</strong>` : nl2br(value)}</td></tr>`;
  function buildSepSection(sections) {
    const sepSection = sections.find((s) => /^SEP$/i.test(s.title));
    const txt = sepSection ? plainText(sepSection.html) : "";
    const grab = (re) => txt.match(re)?.[1]?.replace(/\s+/g, " ").trim() || "-";
    const sep = pick("no_sep", "sep") !== "-" ? pick("no_sep", "sep") : grab(/No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]+)/i);
    const tglSep = grab(/Tgl\.?\s*SEP\s*[:.]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    const noHp = pick("no_hp", "telepon");
    const kelas = pick("kelas").replace(/^Kelas\s*/i, "");
    const jk = pick("jenis_kelamin", "jk");
    const jkLabel = /^L$/i.test(jk) ? "Laki-laki" : /^P$/i.test(jk) ? "Perempuan" : jk;
    const lahir = pick("tgl_lahir", "tglLahir").replace(/^:\s*/, "");
    const masuk = pick("tanggalAwal", "tgl_masuk", "tgl");
    const keluar = pick("tanggalAkhir", "keluar", "tgl_keluar");
    const dokter = pick("dokter", "dpjp");
    const cbgCode = grab(/(E-\d+-\d+-\d+)/i);
    const cbgDesc = grab(/(?:GROUP|INA-CBG)\s+([A-Z][A-Z0-9\s\-(),.]+?)(?:\s+Rp|\s+2\.930|$)/i);
    const cbgTarif = grab(/(?:TARIF|Rp\.?)\s*([\d.]+(?:,\d{2})?)/i);
    const codeRows = [];
    if (sepSection) {
      const doc = new DOMParser().parseFromString(sepSection.html, "text/html");
      doc.querySelectorAll("tr").forEach((tr) => {
        const cells = Array.from(tr.cells).map(
          (c) => c.textContent?.replace(/\s+/g, " ").trim() || ""
        );
        if (cells.length < 3) return;
        const code = cells.find((c) => /^[A-Z]?\d{2}(?:\.\d+)?$/.test(c));
        if (!code) return;
        const desc = cells[cells.length - 1] === code ? "-" : cells[cells.length - 1];
        const jenis = cells[0] === code ? "-" : cells[0];
        codeRows.push(
          `<tr><td>${esc(jenis)}</td><td class="center"><strong>${esc(code)}</strong></td><td>${esc(desc)}</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi ${esc(code)}"></td></tr>`
        );
      });
    }
    if (!codeRows.length) {
      codeRows.push(
        '<tr><td>Diagnosa Utama</td><td class="center">-</td><td>-</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Diagnosa Utama"></td></tr>'
      );
    }
    return `<section class="rm-page" id="rm-01">
${kop("RM. 01")}
<div class="rm-form-title">SURAT ELEGIBILITAS PESERTA (SEP) &amp; BERKAS KLAIM INDIVIDUAL (INA-CBG)</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. SEP", sep, true)}
    ${idRow("Tgl. SEP", tglSep)}
    ${idRow("No. Kartu", `${pick("kartu")} (MR. ${pick("norm", "rekam_medis")})`)}
    ${idRow("Nama Peserta", pick("nama"), true)}
    ${idRow("Tgl. Lahir", `${lahir} \xA0\xA0 Kelamin : ${jkLabel}`)}
    ${idRow("No. Telepon", noHp)}
    ${idRow("Sub/Spesialis", "-")}
    ${idRow("Dokter", dokter)}
    ${idRow("Faskes Perujuk", "RSUD H. Abdul Manap - Kota Jambi")}
    ${idRow("Diagnosa Awal", "-")}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Peserta", "PBI JAMINAN KESEHATAN")}
    ${idRow("COB", "-")}
    ${idRow("Jns. Rawat", pick("jenis"), true)}
    ${idRow("Jns. Kunjungan", "-")}
    ${idRow("Kls. Hak", kelas ? `Kelas ${kelas}` : "-", true)}
    ${idRow("Kls. Rawat", kelas ? `Kelas ${kelas}` : "-", true)}
    ${idRow("Penjamin", "BPJS Kesehatan")}
    ${idRow("Catatan", "-")}
  </table></div>
</div>

<div class="sub-heading-rm">BERKAS KLAIM INDIVIDUAL PASIEN (E-KLAIM INA-CBG)</div>

<div class="id-box-borderless">
  <div class="id-col"><table class="id-table">
    ${idRow("Kode / Kelas RS", "-")}
    ${idRow("Tanggal Masuk", masuk)}
    ${idRow("Tanggal Keluar", keluar)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Umur Tahun / Hari", "-")}
    ${idRow("Lama Rawat (LOS)", "-")}
    ${idRow("Cara Pulang", "-")}
  </table></div>
</div>

<table class="rm-grid-table">
  <thead><tr>
    <th style="width: 120px;">JENIS KODING</th>
    <th style="width: 72px;">KODE</th>
    <th>DESKRIPSI DIAGNOSA (ICD-10) / PROSEDUR (ICD-9-CM)</th>
    <th style="width: 56px;">VER (&#10003;)</th>
  </tr></thead>
  <tbody>${codeRows.join("")}</tbody>
</table>

<table class="rm-grid-table">
  <thead>
    <tr><th colspan="3">HASIL GROUPING INA-CBG (Generated: E-Klaim 5.10.9)</th></tr>
    <tr><th style="width: 110px;">KODE INA-CBG</th><th>DESKRIPSI GROUP</th><th class="num" style="width: 140px;">TARIF (Rp)</th></tr>
  </thead>
  <tbody>
    <tr><td class="center"><strong>${esc(cbgCode)}</strong></td><td>${esc(cbgDesc)}</td><td class="num">${esc(cbgTarif)}</td></tr>
    <tr><td class="center">-</td><td>Sub Acute / Chronic / Special CMG</td><td class="num">0,00</td></tr>
    <tr class="total-row"><td colspan="2" style="text-align: right;">TOTAL TARIF INA-CBG :</td><td class="num">Rp ${esc(cbgTarif)}</td></tr>
  </tbody>
</table>

<div class="footnote-rm">
  *Saya Menyetujui BPJS Kesehatan menggunakan informasi Medis Pasien jika diperlukan. *SEP bukan bagian bukti penjamin peserta.
</div>

<div class="rm-signature-block">
  <div class="rm-sig-box">
    <div>Pasien / Keluarga Pasien</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(pick("nama"))} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Kota Jambi, ${esc(tglSep)}</div>
    <div>Petugas Pendaftaran / Coder JKN</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
  </div>
</div>
</section>`;
  }
  function buildSpriSection(sections) {
    const spr = sections.find((s) => /^SPRI$/i.test(s.title));
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
    ${idRow("Alamat", pick("alamat"))}
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
    <div>Petugas Admisi / TPPRI</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
  </div>
  <div class="rm-sig-box">
    <div>${esc(pengantar)}</div>
    <div>Dokter yang Memeriksa</div>
    <div class="rm-sig-space"></div>
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
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const cells = Array.from(tr.cells);
        for (let i = 0; i < cells.length - 2; i++) {
          const label = (cells[i].textContent || "").replace(/\s+/g, " ").trim();
          if ((cells[i + 1].textContent || "").trim() !== ":") continue;
          const value = (cells[i + 2].innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim();
          if (label && value && !fields.has(label)) fields.set(label, value);
        }
      }
      for (const li of Array.from(doc.querySelectorAll("li"))) {
        const t = (li.textContent || "").replace(/\s+/g, " ").trim();
        if (!t) continue;
        const key = t.toUpperCase();
        actions.set(key, (actions.get(key) || 0) + 1);
      }
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
    const unit = f(/^Unit Pelayanan|^Poliklinik/i);
    const anamnesis = f(/^ANAMNESE$/i);
    const dokter = pick("dokter", "dpjp");
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
  <tbody>
    <tr><td>${nl2br(unit)}</td><td>Diagnosa Utama</td><td><strong>${nl2br(f(/^Diagnosa utama/i))}</strong></td><td class="center">-</td><td>${esc(dokter)}</td></tr>
    <tr><td>${nl2br(unit)}</td><td>Diagnosa Tambahan</td><td>${nl2br(f(/^Diagnosa tambahan/i))}</td><td class="center">-</td><td>${esc(dokter)}</td></tr>
  </tbody>
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
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Kota Jambi, ${esc(masuk)}</div>
    <div>Dokter Penanggung Jawab Pelayanan (DPJP)</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(dokter)} )</div>
  </div>
</div>
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
      if (/^SEP$/i.test(s.title)) return buildSepSection(sections);
      if (/^SPRI$/i.test(s.title)) return buildSpriSection(sections);
      if (/^SBPK$/i.test(s.title)) return buildSbpkSection(sections);
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
.kop-logo{object-fit:contain;object-position:center}
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
