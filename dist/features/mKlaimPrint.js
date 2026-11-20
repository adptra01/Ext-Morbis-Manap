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
  function clean(section) {
    const c = section.cloneNode(true);
    const sourceCanvas = Array.from(section.querySelectorAll("canvas"));
    const cloneCanvas = Array.from(c.querySelectorAll("canvas"));
    sourceCanvas.forEach((cv, i) => {
      const target = cloneCanvas[i];
      if (!target) return;
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
    const out = [];
    nodes.forEach((node, i) => {
      const html = clean(node);
      if (html.length < 20) return;
      const title = titleOf(node, i);
      if (seen.has(title)) return;
      seen.add(title);
      out.push({ title, html });
    });
    if (!out.length) {
      const fallback = document.querySelector("#section-to-print");
      if (fallback) out.push({ title: "Detail Klaim", html: clean(fallback) });
    }
    return out;
  }
  var esc = (s) => s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
  function buildHtml(sections) {
    const logo = "/assets/images/logo/Kota Jambi.png";
    const row = (label, value) => `<div class="meta-item"><span class="meta-label">${esc(label)}</span><span class="meta-value">${esc(value || "\u2014")}</span></div>`;
    const toc = sections.map(
      (s, i) => `<span class="toc-chip"><b>${String(i + 1).padStart(2, "0")}</b> ${esc(s.title)}</span>`
    ).join("");
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
  background:var(--accent-soft);border-left:3px solid var(--accent);
  padding:11px 14px;margin-bottom:14px;
}
.meta-item{display:flex;flex-direction:column;gap:2px;min-width:0;}
.meta-label{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600;}
.meta-value{font-weight:600;font-size:11px;overflow-wrap:anywhere;}
.toc{
  display:flex;flex-wrap:wrap;gap:5px;padding:9px 0 13px;border-bottom:1px solid var(--rule);margin-bottom:16px;
}
.toc-chip{background:var(--chip);border:1px solid var(--rule);border-radius:999px;padding:3px 9px;font-size:9px;color:var(--muted);}
.toc-chip b{color:var(--accent);font-weight:700;margin-right:3px;}
.doc{margin:0 0 22px;break-inside:avoid-page;}
.doc-head{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
.doc-num{
  font-family:var(--serif);font-size:18px;color:var(--accent);font-weight:700;
  min-width:26px;border-right:1px solid var(--rule);padding-right:9px;
}
.doc-head h2{
  font-family:var(--serif);font-size:14px;margin:0;text-transform:uppercase;
  letter-spacing:.04em;white-space:nowrap;
}
.doc-rule{flex:1;height:1px;background:linear-gradient(90deg,var(--rule),transparent);}
.doc-body{background:#fff;border:1px solid var(--rule);border-radius:3px;padding:12px 14px;}
.doc-body table{width:100%!important;border-collapse:collapse!important;margin:0 0 10px;}
.doc-body th,.doc-body td{border:1px solid var(--rule)!important;padding:5px 7px;font-size:10px!important;text-align:left;vertical-align:top;overflow-wrap:anywhere;}
.doc-body th{background:var(--chip)!important;font-weight:600;color:var(--ink);}
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
  .screen-bar{display:none!important;}
  body{padding:0;background:#fff;font-size:10px;}
  .doc{break-after:page;}
  .doc:last-child{break-after:auto;}
  .meta,.toc,.doc-body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
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
<div class="toc">${toc}</div>
<main>${docs}</main>
<div class="sign"><div class="sign-box">
  <div>Petugas Verifikasi</div><div class="sign-space"></div>
  <div><strong>( .................................... )</strong></div>
</div></div>
<script>
(function(){
  function doPrint(){ window.focus(); window.print(); }
  document.getElementById('print-view').addEventListener('click', doPrint);
  document.getElementById('close-view').addEventListener('click', function(){
    if (window.confirm('Tutup halaman cetak ini?')) window.close();
  });
  window.addEventListener('load', function(){ setTimeout(doPrint, 500); });
  window.addEventListener('afterprint', function(){
    if (window.confirm('Apakah menu print ini akan ditutup?')) window.close();
  });
})();
<\/script>
</body>
</html>`;
  }
  function handleMklaimPrint() {
    const sections = collectSections();
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
    win.document.write(buildHtml(sections));
    win.document.close();
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
    const nativePrint = Array.from(host.querySelectorAll("button.btn-success")).find(
      (b) => /^printDiv\s*\(/i.test(b.getAttribute("onclick") || "")
    );
    if (nativePrint) host.insertBefore(btn, nativePrint);
    else host.appendChild(btn);
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
        const obs = new MutationObserver(() => {
          if (!document.getElementById("ext-mklaim-print-btn")) renderMklaimPrintButton();
        });
        obs.observe(document.body, { childList: true, subtree: true });
      }
    };
  }
})();
