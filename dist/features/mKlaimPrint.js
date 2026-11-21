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
  function collectSections() {
    const nodes = Array.from(document.querySelectorAll(".isidalam"));
    const seen = /* @__PURE__ */ new Set();
    const sections = [];
    const inventory = [];
    nodes.forEach((node, i) => {
      const title = titleOf(node, i);
      if (seen.has(title)) return;
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
  var SEP_LOGO_SVG = `<svg class="sep-logo" viewBox="0 0 215 58" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BPJS Kesehatan">
<g transform="translate(4,3)"><circle cx="26" cy="26" r="23" fill="#fff" stroke="#00A651" stroke-width="2.2"/>
<circle cx="26" cy="11" r="3.2" fill="#0066B3"/><circle cx="14" cy="21" r="3.2" fill="#00A651"/>
<circle cx="38" cy="21" r="3.2" fill="#0066B3"/><circle cx="20" cy="38" r="3.2" fill="#0066B3"/>
<circle cx="32" cy="38" r="3.2" fill="#00A651"/><path d="M14 27 Q26 17 38 27 Q26 36 14 27 Z" fill="#0066B3"/></g>
<text x="60" y="24" fill="#009B4C" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="700">BPJS</text>
<text x="60" y="44" fill="#005BAA" font-family="Arial,Helvetica,sans-serif" font-size="21" font-weight="400">Kesehatan</text>
<text x="60" y="54" fill="#222222" font-family="Arial,Helvetica,sans-serif" font-size="8.6">Badan Penyelenggara Jaminan Sosial</text></svg>`;
  var sepNorm = (s) => s.replace(/\s+/g, " ").replace(/Telep\s+on/gi, "Telepon").replace(/Kunjunga\s+n/gi, "Kunjungan").replace(/Spes\s+ialis/gi, "Spesialis").trim();
  function buildSepSection(sections) {
    const sepSection = sections.find((s) => /^SEP$/i.test(s.title));
    const txt = sepSection ? plainText(sepSection.html) : "";
    const grab = (re) => sepNorm(txt.match(re)?.[1] || "") || "-";
    const grabField = (label, next) => grab(new RegExp(`${label}\\s*[:.]?\\s*([\\s\\S]*?)(?=${next}|$)`, "i"));
    const sep = pick("no_sep", "sep") !== "-" ? pick("no_sep", "sep") : grab(/No\.?\s*SEP\s*[:.]?\s*([0-9A-Z]+)/i);
    const tglSep = grab(/Tgl\.?\s*SEP\s*[:.]?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i);
    const noHp = pick("no_hp", "telepon") !== "-" ? pick("no_hp", "telepon") : grabField("No\\.?\\s*Telepon", "Sub\\/Spesialis");
    const kelas = pick("kelas").replace(/^Kelas\s*/i, "");
    const lahirRaw = pick("tgl_lahir", "tglLahir").replace(/^:\s*/, "");
    const lahir = lahirRaw.split(/\s*\/\s*/)[0]?.trim() || "-";
    const masuk = pick("tanggalAwal", "tgl_masuk", "tgl");
    const keluar = pick("tanggalAkhir", "keluar", "tgl_keluar");
    const dokter = pick("dokter", "dpjp");
    const cbgCode = grab(/(E-\d+-\d+-\d+)/i);
    const cbgDesc = grab(/(?:GROUP|INA-CBG)\s+([A-Z][A-Z0-9\s\-(),.]+?)(?:\s+Rp|\s+2\.930|$)/i);
    const cbgTarif = grab(/(?:TARIF|Rp\.?)\s*([\d.]+(?:,\d{2})?)/i);
    const kartu = pick("kartu", "no_kartu", "noka");
    const mr = pick("norm", "rekam_medis");
    const km = kartu.match(/^(.*?)\s*\(MR\.?\s*([^)]+)\)$/i);
    const kartuHtml = km ? `${esc(km[1].trim())}<span class="sep-inline-mr">No.MR : ${esc(km[2].trim())}</span>` : `${esc(kartu)}${mr !== "-" ? `<span class="sep-inline-mr">No.MR : ${esc(mr)}</span>` : ""}`;
    const kunjungan = pick("jenis_kunjungan") !== "-" ? pick("jenis_kunjungan") : grab(/Jns\.?\s*Kunjungan\s*[:.]?\s*([\s\S]*?)(?:\s+Kls\.?\s*Hak|$)/i);
    const kunjunganHtml = /^-\s|\n/.test(kunjungan) ? '<ul class="sep-multiline-list">' + kunjungan.split(/\n/).map((x) => `<li>${esc(x.replace(/^-\s*/, "").trim())}</li>`).join("") + "</ul>" : esc(kunjungan);
    const peserta = pick("peserta", "jenis_peserta") !== "-" ? pick("peserta", "jenis_peserta") : grabField("Peserta", "COB|Jns\\.?\\s*Rawat");
    const penjamin = pick("penjamin") !== "-" ? pick("penjamin") : grabField("Penjamin", "\\*Saya|CATATAN");
    const faskes = pick("faskes_perujuk", "faskes") !== "-" ? pick("faskes_perujuk", "faskes") : grabField("Faskes\\s*Perujuk", "Diagnosa\\s*Awal");
    const diagnosaAwal = pick("diagnosa_awal") !== "-" ? pick("diagnosa_awal") : grabField("Diagnosa\\s*Awal", "Catatan|Peserta");
    const catatan = pick("catatan_sep", "catatan") !== "-" ? pick("catatan_sep", "catatan") : grabField("Catatan", "Peserta|COB");
    const subSpesialis = pick("sub_spesialis", "spesialis") !== "-" ? pick("sub_spesialis", "spesialis") : grabField("Sub\\/Spesialis", "Dokter");
    const cetakan = grab(/Cetakan\s+ke\s*[:.]?\s*(\d+)/i);
    const printMeta = cetakan !== "-" ? `<div class="sep-print-meta">Cetakan ke ${esc(cetakan)}</div>` : "";
    const kv = (label, value, cls = "", right = false) => `<tr><td class="lbl${right ? " right" : ""}">${label}</td><td class="sep">:</td><td class="val${cls ? " " + cls : ""}">${value}</td></tr>`;
    const spacer = '<tr><td colspan="3">&nbsp;</td></tr>';
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
    const kelasTeks = kelas !== "-" ? `Kelas ${esc(kelas)}` : "-";
    return `<section class="rm-page sep-page" id="rm-01">
 <section class="bpjs-sep-sheet">
 <div class="sep-header">
   ${SEP_LOGO_SVG}
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
     ${kv("Nama Peserta", `<strong>${esc(pick("nama"))}</strong>`)}
     ${kv("Tgl.Lahir", esc(lahir))}
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
     <div class="sep-sig-space"></div>
     <div class="sep-sig-line">${esc(pick("nama"))}</div>
   </div>
   <div class="sep-sig-box">
     <div class="sep-sig-role">Petugas<br/>BPJS Kesehatan</div>
     <div class="sep-sig-space"></div>
     <div class="sep-sig-line">&nbsp;</div>
   </div>
 </div>
 </section>

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
    <div>Yang Menyerahkan,</div>
    <div>Pasien / Keluarga Pasien</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Yang Menerima (Petugas Billing / Kasir)</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( .................................................. )</div>
  </div>
</div>
</section>`;
  }
  function buildResumeSection(sections) {
    const res = sections.find((s) => /^Resume/i.test(s.title));
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
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(nama)} )</div>
  </div>
  <div class="rm-sig-box">
    <div>Kota Jambi, ${esc(keluar)}</div>
    <div>Yang Membuat : DPJP</div>
    <div class="rm-sig-space"></div>
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
  function buildRadiologiSection(sections) {
    const rad = sections.find((s) => /^Radiologi/i.test(s.title));
    const doc = rad ? new DOMParser().parseFromString(rad.html, "text/html") : null;
    const fields = /* @__PURE__ */ new Map();
    const exams = [];
    let expertise = "";
    const cellText = (tr) => (tr.textContent || "").replace(/\s+/g, " ").trim();
    if (doc) {
      for (const tr of Array.from(doc.querySelectorAll("tr"))) {
        const c = Array.from(tr.cells).map(
          (td) => (td.innerHTML || "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/[ \t]+/g, " ").trim()
        );
        for (const cell of c) {
          const m = cell.match(/^([^:]{2,40}?)\s*:\s*(.+)$/);
          if (m && !fields.has(m[1].trim())) fields.set(m[1].trim(), m[2].trim());
        }
        if (c.length >= 4 && /^\d+$/.test(c[0]) && c[1]) exams.push(c[1]);
        if (/expertise/i.test(cellText(tr))) expertise = cellText(tr);
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
    const dokterDpjp = f(/^dr\.? DPJP|^Dokter DPJP/i);
    const diagnosa = f(/^Diagnosa Klinis/i);
    const diagnosaIcd = f(/^Diagnosa ICD/i);
    const golongan = exams.length ? "RONTGEN" : "-";
    const examRows = exams.length ? exams.map(
      (name, i) => `<tr><td class="center">${i + 1}</td><td><strong>${esc(name)}</strong></td><td class="center">${esc(golongan)}</td><td class="center">Tanpa Kontras</td><td class="center"><input type="checkbox" class="rm-checkbox" aria-label="Verifikasi Radiologi ${i + 1}"></td></tr>`
    ).join("") : '<tr><td class="center">-</td><td>Tidak ada jenis pemeriksaan tercatat.</td><td class="center">-</td><td class="center">-</td><td class="center">-</td></tr>';
    const expertiseHtml = expertise ? expertise.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `<div>${esc(l)}</div>`).join("") : "<div>Tidak ada expertise tercatat pada halaman.</div>";
    return `<section class="rm-page" id="rm-08">
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
    ${idRow("Dokter DPJP Rad", dokterDpjp)}
    ${idRow("Diagnosa Klinis", diagnosa !== "-" && diagnosaIcd !== "-" ? `${diagnosa} (${diagnosaIcd})` : diagnosa)}
    ${idRow("Golongan / Jenis", `${golongan} \u2014 Tanpa Kontras`)}
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
  <thead><tr><th>URAIAN EXPERTISE &amp; KESAN RADIOGRAFI TORAKS</th></tr></thead>
  <tbody><tr><td style="padding: 8px 10px; line-height: 1.5;">${expertiseHtml}</td></tr></tbody>
</table>

<div class="rm-signature-block">
  <div class="rm-sig-box left-align">
    <div>No. Rontgen : ${esc(noRontgen)}</div>
    <div>Kode Prosedur ICD-9-CM : 87.44</div>
  </div>
  <div class="rm-sig-box">
    <div>Kota Jambi, ${esc(tglPeriksa)}</div>
    <div>Dokter Spesialis Radiologi Penilai</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(dokterDpjp)} )</div>
  </div>
</div>
</section>`;
  }
  function buildTriageSection(sections) {
    const tri = sections.find((s) => /^Triage/i.test(s.title));
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
    <div>Kota Jambi, ${esc(tanggal)}</div>
    <div>Dokter yang Memeriksa</div>
    <div class="rm-sig-space"></div>
    <div class="rm-sig-name">( ${esc(dokterPemeriksa)} )</div>
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
        (tb) => re.test((tb.rows[0]?.textContent || "").replace(/\s+/g, " ").trim())
      );
      return rows(t);
    };
    const byText = (re) => {
      const t = tables.find((tb) => re.test(tb.textContent || ""));
      return rows(t);
    };
    const triase = find(/^Triase/i);
    const nyeri = find(/^Pengkajian\s*0\s*1\s*2\s*Nilai/i);
    const jatuh1 = byText(/Usia/i);
    const jatuh2 = byText(/Riwayat Jatuh/i);
    const objektif = find(/^Objektif\s*Kelainan/i);
    const diagnosaUtama = find(/^Diagnosa Utama$/i);
    const diagnosaBanding = find(/^Diagnosa Banding$/i);
    const tindakan = find(/^Tindakan$/i);
    const obat = find(/^Pukul\s*Nama Obat/i);
    const perawat = find(/^No\s*Nama Perawat IGD/i);
    const grid = (head, body) => '<table class="rm-grid-table"><thead><tr>' + head.map((h) => `<th>${esc(h)}</th>`).join("") + "</tr></thead><tbody>" + (body.length ? body.join("") : '<tr><td colspan="' + head.length + '">-</td></tr>') + "</tbody></table>";
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
    return `<section class="rm-page" id="pengkajian-igd">
${kop("PENGKAJIAN IGD")}
<div class="rm-form-title">LEMBAR PENGKAJIAN INSTALASI GAWAT DARURAT</div>

<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", pick("nama"), true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"), true)}
    ${idRow("Tgl. Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
    ${idRow("No. Telepon", pick("no_hp", "telepon"))}
    ${idRow("Pekerjaan", pick("pekerjaan"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Masuk", pick("tgl_masuk"))}
    ${idRow("Cara Masuk", pick("cara_masuk_text"))}
    ${idRow("Tiba di RS", `${pick("tiba_di_rs_tanggal")} ${pick("pukul_tiba_di_rs")}`.trim())}
    ${idRow("Pukul Diperiksa", pick("pukul_diperiksa"))}
    ${idRow("Status Spiritual", pick("status_spiritual"))}
    ${idRow("Indikasi Rawat", pick("tindak_lanjut_indikasi_ranap"))}
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

<div class="sub-heading-rm">TRIASE (DIISI OLEH DOKTER)</div>
${grid(["SKALA TRIASE", "KETERANGAN", "RESPON TIME"], triaseRows)}

<div class="sub-heading-rm">PENGKAJIAN NYERI (FLACC)</div>
${grid(["PENGKAJIAN", "0", "1", "2", "NILAI"], nyeriRows)}

<div class="sub-heading-rm">SKRINING RISIKO JATUH \u2014 PARAMETER PERTAMA</div>
${grid(["NO", "PARAMETER", "KRITERIA", "NILAI", "SKOR"], skorRows(jatuh1))}

<div class="sub-heading-rm">SKRINING RISIKO JATUH \u2014 PARAMETER KEDUA</div>
${grid(["NO", "PARAMETER", "KRITERIA", "NILAI", "SKOR"], skorRows(jatuh2))}

<div class="sub-heading-rm">PEMERIKSAAN OBJEKTIF</div>
${grid(["OBJEKTIF", "KELAINAN"], objektifRows)}

<div class="sub-heading-rm">DIAGNOSA &amp; TINDAKAN</div>
<table class="rm-grid-table"><tbody>
  ${diagnosaRows}
  <tr><td style="width:180px;"><strong>TINDAKAN</strong></td><td>${esc(tindakanVal)}</td></tr>
</tbody></table>

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
    <div>Kota Jambi, ${esc(pick("tgl_masuk"))}</div>
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
  var fieldValue = (fields, ...res) => {
    for (const [k, v] of fields) if (res.some((r) => r.test(k))) return v;
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
    return `<section class="rm-page" id="form-konsent">
${kop("RM. 19A")}
<div class="rm-form-title">PERSETUJUAN TINDAKAN KEDOKTERAN (RM 19 A)</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("Nama Pasien", nama, true)}
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"))}
    ${idRow("Tgl. Lahir", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Ruang / Kelas", [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-")}
    ${idRow("Tanggal", f(/^Tanggal/i))}
    ${idRow("Dokter Penanggung Jawab", dokter)}
    ${idRow("Diagnosa", f(/^Diagnosa/i))}
  </table></div>
</div>
${kvTable([
      ["TUJUAN TINDAKAN", f(/^Tujuan/i)],
      ["TINDAKAN / PROSEDUR YANG AKAN DILAKUKAN", f(/^Tindakan|^Prosedur/i)],
      ["RISIKO &amp; KOMPLIKASI YANG MUNGKIN", f(/^Risiko|^Komplikasi/i)],
      ["ALTERNATIF TINDAKAN", f(/^Alternatif/i)]
    ])}
<div class="footnote-rm">Dengan tanda tangan di bawah ini saya menyatakan telah mendapat penjelasan dan menyetujui tindakan kedokteran tersebut di atas.</div>
${sig(
      [`Pasien / Keluarga Pasien`, `( ${esc(nama)} )`],
      [`Kota Jambi, ${esc(f(/^Tanggal/i))}`, `Dokter Penanggung Jawab`, `( ${esc(dokter)} )`]
    )}
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
    const fields = formFields(sections, /^Laboratorium/i);
    const rows = formRows(sections, /^Laboratorium/i);
    const src = sections.find((s) => /^Laboratorium/i.test(s.title));
    const doc = src ? new DOMParser().parseFromString(src.html, "text/html") : null;
    const images = doc ? Array.from(doc.querySelectorAll('img[src^="data:"]')).map((img) => img.outerHTML) : [];
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="rm-09">
${kop("RM. 09")}
<div class="rm-form-title">HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Lab", f(/^No\.? Lab/i))}
    ${idRow("NIK / No. RM", pick("norm", "rekam_medis"))}
    ${idRow("Nama Lengkap", pick("nama"), true)}
    ${idRow("Tgl. Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Ruangan", f(/^Ruang|^Unit|^Poliklinik/i))}
    ${idRow("Dokter Pengirim", f(/^Dokter Pengirim/i))}
    ${idRow("Diagnosa Klinis", f(/^Diagnosa/i))}
    ${idRow("Jenis Kelamin", pick("jenis_kelamin", "jk"))}
  </table></div>
</div>
<div class="sub-heading-rm">HASIL PEMERIKSAAN</div>
${dataTable(["PARAMETER PEMERIKSAAN", "HASIL", "SATUAN", "NILAI RUJUKAN"], rows, true)}
<table class="rm-grid-table"><thead><tr><th>LAMPIRAN CETAKAN SISTEM LABORATORIUM (LIS)</th></tr></thead><tbody><tr><td style="padding:6px;">${images.length ? images.join("<br/>") : "-"}</td></tr></tbody></table>
${sig(
      ["Analis Patologi Klinik", `( ${esc(f(/^Analis|^Validator/i))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Dokter Spesialis Patologi Klinik",
        `( ${esc(f(/^Dokter Spesialis|^Dokter Patologi/i))} )`
      ]
    )}
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
  function buildKonsulSection(sections) {
    const fields = formFields(sections, /Konsul/i);
    const f = (...r) => fieldValue(fields, ...r);
    return `<section class="rm-page" id="rm-10">
${kop("RM. 10")}
<div class="rm-form-title">LEMBAR KONSULTASI</div>
<div class="id-box-bordered">
  <div class="id-col"><table class="id-table">
    ${idRow("No. Rekam Medis", pick("norm", "rekam_medis"), true)}
    ${idRow("Nama Pasien", pick("nama"), true)}
  </table></div>
  <div class="id-col"><table class="id-table">
    ${idRow("Tanggal Lahir / Umur", pick("tgl_lahir", "tglLahir"))}
    ${idRow("Jenis Kunjungan", [pick("jenis"), pick("kelas", "ruang")].filter((v) => v !== "-").join(" / ") || "-")}
  </table></div>
</div>
${kvTable([
      ["BAGIAN I : KEPADA YTH. KONSULEN", f(/^Konsulen|^Dokter Konsulen/i)],
      ["JENIS PERMOHONAN", f(/^Jenis Permohonan|^Permohonan/i)],
      ["PENEMUAN KLINIS TERPENTING", f(/^Penemuan|^Keluhan/i)],
      ["DUGAAN DIAGNOSA", f(/^Dugaan|^Diagnosa/i)]
    ])}
${kvTable([
      ["S (SUBJEKTIF)", f(/^S \(Subjektif\)|^Subjektif/i)],
      ["O (OBJEKTIF)", f(/^O \(Objektif\)|^Objektif/i)],
      ["A (ASSESMEN)", f(/^A \(Assesmen\)|^Assesmen/i)],
      ["P (PLANNING &amp; INSTRUKSI)", f(/^P \(Planning|^Planning|^Instruksi/i)],
      ["KEPUTUSAN KONSULTASI", f(/^Keputusan/i)]
    ])}
${sig(
      ["Dokter Pemohon Konsultasi", `( ${esc(pick("dokter", "dpjp"))} )`],
      [
        "Kota Jambi, " + esc(f(/^Tanggal/i)),
        "Dokter Konsulen",
        `( ${esc(f(/^Konsulen|^Dokter Konsulen/i))} )`
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
    const docs = sections.map((s, i) => {
      if (/^SEP$/i.test(s.title)) return buildSepSection(sections);
      if (/^SPRI$/i.test(s.title)) return buildSpriSection(sections);
      if (/^SBPK$/i.test(s.title)) return buildSbpkSection(sections);
      if (/^Rincian Biaya/i.test(s.title)) return buildBillingSection(sections);
      if (/^Resume/i.test(s.title)) return buildResumeSection(sections);
      if (/^Telaah/i.test(s.title)) return buildTelaahSection(sections);
      if (/^Radiologi/i.test(s.title)) return buildRadiologiSection(sections);
      if (/^Triage/i.test(s.title)) return buildTriageSection(sections);
      if (/PENGKAJIAN INSTALASI GAWAT DARURAT/i.test(s.title))
        return buildPengkajianIgdSection(sections);
      if (/^Laboratorium/i.test(s.title)) return buildLaboratoriumSection(sections);
      if (/Konsul/i.test(s.title)) return buildKonsulSection(sections);
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
/* SEP BPJS \u2014 cetakan VClaim (sheet menggantikan kop RSUD) */
.rm-page.sep-page{padding:0}
.bpjs-sep-sheet{width:210mm;max-width:100%;margin:0 auto;padding:10mm 14mm;background:#fff;color:#000;font:9.5pt/1.38 Arial,Helvetica,sans-serif;box-sizing:border-box;break-inside:avoid;page-break-inside:avoid}
.sep-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;position:relative}
.sep-logo{flex:0 0 215px;height:auto}
.sep-title-wrap{flex:1;text-align:center;padding-right:120px}
.sep-title{font-size:13pt;font-weight:400;letter-spacing:.3px;text-transform:uppercase}
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
.sep-no-value{font-size:12pt;letter-spacing:.2px}
.sep-inline-mr{margin-left:14px;white-space:nowrap}
.sep-multiline-list{margin:0;padding:0;list-style:none}
.sep-disclaimer{margin-top:10px;font-size:7.5pt;font-style:italic}
.sep-print-meta{font-size:8pt;font-style:normal}
.sep-signatures{display:flex;justify-content:space-between;gap:16px;margin-top:18px;padding-right:8px}
.sep-sig-box{flex:1;font-size:8.8pt;line-height:1.25}
.sep-sig-role{min-height:24px}
.sep-sig-space{height:36px}
.sep-sig-line{width:115px;border-bottom:1px solid #000;padding-bottom:2px;font-size:8pt;white-space:nowrap}
@media print{@page{size:A4 portrait;margin:10mm 12mm}body{background:#fff;padding:0}.bpjs-sep-sheet{width:100%;padding:0}}
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
  function openDossierTab(html) {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    let win = window.open(url, "_blank");
    if (win) {
      window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
      win.addEventListener(
        "load",
        () => {
          try {
            if (win) installDossierHandlers(win);
          } catch {
          }
        },
        { once: true }
      );
      return true;
    }
    URL.revokeObjectURL(url);
    win = window.open("", "_blank");
    if (!win) return false;
    try {
      win.document.open();
      win.document.write(html);
      win.document.close();
      installDossierHandlers(win);
    } catch {
    }
    return true;
  }
  function openDossierOverlay(html, fallback = false) {
    document.getElementById("ext-dossier-overlay")?.remove();
    const host = document.createElement("div");
    host.id = "ext-dossier-overlay";
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#fff;display:flex;flex-direction:column";
    const bar = document.createElement("div");
    bar.style.cssText = "flex:0 0 auto;padding:6px 10px;border-bottom:2px solid #000;background:#fff;font:600 12px Arial,sans-serif;display:flex;gap:8px;align-items:center";
    const title = document.createElement("strong");
    title.textContent = fallback ? "Dossier Cetak M-KLAIM \u2014 mode lokal (tab ekstensi gagal dibuka)" : "Dossier Cetak M-KLAIM";
    bar.appendChild(title);
    for (const [text, act] of [
      ["Cetak", "print"],
      ["Buka Tab Baru", "tab"],
      ["Tutup", "close"]
    ]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.style.cssText = "font:600 12px Arial;padding:4px 10px;border:1px solid #000;background:#fff;cursor:pointer";
      b.addEventListener("click", () => {
        if (act === "close") host.remove();
        else if (act === "tab") {
          if (!openDossierTab(html))
            window.alert("Popup diblokir \u2014 izinkan popup untuk situs MORBIS lalu klik lagi.");
        } else frame.contentWindow?.print();
      });
      bar.appendChild(b);
    }
    const frame = document.createElement("iframe");
    frame.title = "Dossier Cetak M-KLAIM";
    frame.style.cssText = "flex:1 1 auto;width:100%;border:0;background:#fff";
    frame.addEventListener(
      "load",
      () => {
        try {
          if (frame.contentWindow) {
            installDossierHandlers(frame.contentWindow);
            frame.contentWindow.focus();
          }
        } catch {
        }
      },
      { once: true }
    );
    host.appendChild(bar);
    host.appendChild(frame);
    document.body.appendChild(host);
    frame.srcdoc = html;
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
    if (openDossierTab(html)) return;
    try {
      openDossierOverlay(html, true);
    } catch (e) {
      const reason = lastErr instanceof Error ? lastErr.message : String(lastErr || "");
      window.alert(
        `Gagal membuka dossier: ${reason || "tidak diketahui"}. Render lokal juga gagal: ${e instanceof Error ? e.message : String(e)}`
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
