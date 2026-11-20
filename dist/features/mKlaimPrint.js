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
      const ctx = cv.getContext("2d");
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
          const box = document.createElement("span");
          box.className = "box";
          td.appendChild(box);
          tr.appendChild(td);
        }
      });
    });
  }
  var VER_DOCS = /Rincian Biaya|Resume|Telaah|Laboratorium|Radiologi|SPRI|SBPK/i;
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
  function buildHtml(sections, inventory) {
    const logo = "/assets/images/logo/Kota Jambi.png";
    const row = (label, value) => `<div class="meta-item"><span class="meta-label">${esc(label)}</span><span class="meta-value">${esc(value || "\u2014")}</span></div>`;
    const ada = inventory.filter((r) => r.docNo !== null).length;
    const ctlRows = inventory.map((r) => {
      const filled = r.docNo !== null;
      return `<tr>
        <td class="c-no">${filled ? String(r.docNo).padStart(2, "0") : "\u2014"}</td>
        <td>${esc(r.title)}</td>
        <td class="c-stat">${filled ? "Ada" : '<span class="st-empty">Tidak terisi</span>'}</td>
        <td class="c-ver"><span class="box"></span></td>
      </tr>`;
    }).join("");
    const checks = runChecks(sections, inventory);
    const checksHtml = checks.length ? `<section class="checks">
  <h2>Catatan Pemeriksaan Otomatis</h2>
  <ul>${checks.map(
      (c) => `<li class="check ${c.level}"><span class="mark">${c.level === "warn" ? "\u25B2" : "\u2022"}</span><span><b>${esc(c.title)}</b> \u2014 ${esc(c.detail)}</span></li>`
    ).join("")}</ul>
</section>` : "";
    const docs = sections.map(
      (s, i) => `
      <section class="doc">
        <div class="doc-head">
          <span class="doc-num">${String(i + 1).padStart(2, "0")}</span>
          <h2>${esc(s.title)}</h2>
          <span class="doc-rule"></span>
        </div>
        <div class="doc-body">${s.html}</div>
      </section>`
    ).join("");
    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<base href="${esc(location.origin)}">
<title>Dossier Cetak M-KLAIM \u2014 ${esc(HOSPITAL_NAME)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,700&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#17212b; --muted:#5b6b78; --accent:#0f766e; --accent-soft:#e6f4f1;
  --paper:#fdfcf9; --rule:#d7dee2; --chip:#f1f5f4;
  --sans:'IBM Plex Sans','Segoe UI',sans-serif; --serif:'Source Serif 4',Georgia,serif;
}
@page{size:A4;margin:14mm 13mm;}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;}
body{
  background:var(--paper); color:var(--ink); font-family:var(--sans);
  font-size:11px; line-height:1.55; padding:22px 26px;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.cover{
  display:grid; grid-template-columns:64px 1fr; gap:16px; align-items:center;
  border-bottom:3px double var(--ink); padding-bottom:14px; margin-bottom:18px;
}
.cover img{width:64px;height:64px;object-fit:contain;}
.eyebrow{font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);font-weight:700;}
.cover h1{font-family:var(--serif);font-size:22px;line-height:1.15;margin:3px 0 2px;font-weight:700;}
.cover .sub{font-size:10px;color:var(--muted);}
.meta{
  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px 16px;
  border-top:1px solid var(--ink);border-bottom:1px solid var(--rule);
  padding:10px 0;margin-bottom:12px;background:transparent;
}
.meta-item{display:flex;flex-direction:column;gap:2px;min-width:0;}
.meta-label{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600;}
.meta-value{font-weight:600;font-size:11px;overflow-wrap:anywhere;}
/* Lembar Kendali \u2014 inventaris berkas (halaman 1) */
.control{margin:0 0 10px;}
.control h2{
  font-family:var(--serif);font-size:13px;margin:0 0 2px;text-transform:uppercase;
  letter-spacing:.06em;
}
.control .note{font-size:9px;color:var(--muted);margin:0 0 8px;}
.ctl{width:100%;border-collapse:collapse;font-size:9.5px;}
.ctl th{
  border-bottom:1px solid var(--ink);text-align:left;padding:3px 6px;
  font-size:8px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700;
}
.ctl td{border-bottom:1px solid var(--rule);padding:3px 6px;vertical-align:middle;}
.ctl tr:last-child td{border-bottom:1px solid var(--ink);}
.ctl .c-no{width:26px;color:var(--muted);font-variant-numeric:tabular-nums;}
.ctl .c-stat{width:92px;}
.ctl .c-ver{width:74px;text-align:center;}
.st-empty{color:var(--muted);font-style:italic;}
.box{display:inline-block;width:11px;height:11px;border:1px solid var(--ink);vertical-align:-2px;}
.ctl-sum{margin:6px 0 0;font-size:9px;color:var(--muted);}
/* Catatan pemeriksaan otomatis */
.checks{margin:14px 0 0;}
.checks h2{font-family:var(--serif);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.06em;}
.checks ul{list-style:none;margin:0;padding:0;}
.check{display:flex;gap:7px;padding:4px 0;border-bottom:1px solid var(--rule);font-size:9.5px;line-height:1.45;}
.check .mark{flex:0 0 10px;font-weight:700;}
.check.warn .mark{color:#8a1c1c;}
.check.info .mark{color:var(--muted);}
/* Kolom Verifikasi pada tabel */
.doc-body .vcol{width:18px!important;padding:4px 2px!important;text-align:center!important;}
.img-wrap{display:inline-block;max-width:100%;}
.img-tools{display:flex;gap:6px;justify-content:flex-end;margin:0 0 5px;}
.img-tools button{
  font:inherit;font-size:10px;padding:3px 9px;border:1px solid var(--rule);
  background:#fff;border-radius:4px;cursor:pointer;color:var(--muted);
}
.img-tools button:hover{border-color:var(--accent);color:var(--accent);}
.doc{margin:0 0 24px;break-inside:avoid-page;}
.doc-head{display:flex;align-items:baseline;gap:10px;margin-bottom:8px;border-bottom:1px solid var(--ink);padding-bottom:5px;}
.doc-num{
  font-family:var(--serif);font-size:15px;color:var(--accent);font-weight:700;
  min-width:24px;
}
.doc-head h2{
  font-family:var(--serif);font-size:13px;margin:0;text-transform:uppercase;
  letter-spacing:.06em;
}
.doc-rule{display:none;}
.doc-body{background:transparent;border:0;border-radius:0;padding:2px 0 0;}
.doc-body table{width:100%!important;border-collapse:collapse!important;margin:0 0 10px;border:0!important;}
.doc-body th,.doc-body td{border:0!important;border-bottom:1px solid var(--rule)!important;padding:5px 7px;font-size:10px!important;text-align:left;vertical-align:top;overflow-wrap:anywhere;}
.doc-body th{background:transparent!important;font-weight:700;color:var(--ink);border-bottom:1px solid var(--ink)!important;letter-spacing:.04em;text-transform:uppercase;font-size:9px!important;}
.doc-body h1,.doc-body h2,.doc-body h3{font-family:var(--serif);font-size:13px;margin:6px 0;}
.doc-body p{margin:3px 0;}
.doc-body label{display:inline-block;min-width:112px;font-weight:600;color:var(--muted);font-size:9px;letter-spacing:.02em;text-transform:uppercase;}
.doc-body .fv{font-weight:500;color:var(--ink);}
.doc-body img{max-width:100%!important;height:auto!important;}
.doc-body .panel,.doc-body .isidalam,.doc-body .card{border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;width:100%!important;}
.screen-bar{
  position:sticky;top:0;z-index:9;display:flex;justify-content:flex-end;gap:8px;
  background:rgba(253,252,249,.94);backdrop-filter:blur(6px);
  padding:8px 0 12px;margin:-22px -26px 14px;padding-left:26px;padding-right:26px;
  border-bottom:1px solid var(--rule);
}
.screen-bar button{font:inherit;font-size:11px;font-weight:600;cursor:pointer;border-radius:5px;padding:7px 14px;}
.btn-print{background:var(--accent);color:#fff;border:1px solid var(--accent);}
.btn-close{background:#fff;color:var(--ink);border:1px solid var(--rule);}
.sign{display:flex;justify-content:flex-end;margin-top:26px;}
.sign-box{width:230px;text-align:center;font-size:10px;color:var(--muted);}
.sign-space{height:52px;}
@media print{
  .screen-bar,.img-tools{display:none!important;}
  body{padding:0;background:#fff;font-size:10px;}
  main{break-before:page;}
  .doc{break-after:page;}
  .doc:last-child{break-after:auto;}
  /* Header tabel diulang tiap halaman + baris tidak terpotong di batas kertas */
  .doc-body thead{display:table-header-group;}
  .doc-body tr,.sign-box{break-inside:avoid;page-break-inside:avoid;}
  .meta,.doc-body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
}
@media screen and (max-width:900px){
  .meta{grid-template-columns:repeat(2,minmax(0,1fr));}
}
</style>
</head>
<body>
<div class="screen-bar">
  <button type="button" class="btn-close" id="close-view">Tutup</button>
  <button type="button" class="btn-print" id="print-view">\u{1F5A8} Cetak</button>
</div>
<header class="cover">
  <img src="${esc(logo)}" alt="Logo">
  <div>
    <div class="eyebrow">Dossier Cetak \xB7 Detail Klaim</div>
    <h1>${esc(HOSPITAL_NAME)}</h1>
    <div class="sub">Laporan lengkap berkas klaim &bull; ${(/* @__PURE__ */ new Date()).toLocaleString("id-ID")}</div>
  </div>
</header>
<div class="meta">
  ${row("No. RM", val("norm"))}
  ${row("Nama Pasien", val("nama"))}
  ${row("No. Registrasi", val("no_registrasi") || val("reg"))}
  ${row("ID Visit", val("id_visit"))}
  ${row("Tanggal Awal", val("tanggalAwal"))}
  ${row("Tanggal Akhir", val("tanggalAkhir"))}
  ${row("Status", val("status"))}
  ${row("Billing", val("billing"))}
</div>
<section class="control">
  <h2>Lembar Kendali Berkas Klaim</h2>
  <p class="note">Nomor mengacu pada nomor berkas di dossier. Centang kolom Verifikasi setelah berkas diperiksa.</p>
  <table class="ctl">
    <thead><tr><th class="c-no">No</th><th>Nama Berkas</th><th class="c-stat">Status</th><th class="c-ver">Verifikasi</th></tr></thead>
    <tbody>${ctlRows}</tbody>
  </table>
  <p class="ctl-sum">${inventory.length} berkas terdaftar &middot; ${ada} berisi &middot; ${inventory.length - ada} tidak terisi</p>
</section>
${checksHtml}
<main>${docs}</main>
<div class="sign"><div class="sign-box">
  <div>Petugas Verifikasi</div><div class="sign-space"></div>
  <div><strong>( .................................... )</strong></div>
</div></div>
</body>
</html>`;
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
    win.document.getElementById("print-view")?.addEventListener("click", doPrint);
    win.document.getElementById("close-view")?.addEventListener("click", () => {
      if (win.confirm("Tutup halaman cetak ini?")) win.close();
    });
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
