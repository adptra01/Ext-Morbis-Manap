"use strict";
var __morbis_feature = (() => {
  // src/features/shared/featureGate.ts
  var STORAGE_KEY = "extensionConfig";
  function decideFeatureGate(key, config, role) {
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
      const store = await chrome.storage.sync.get(STORAGE_KEY);
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
    });
  }

  // src/features/resepAsliPrint.ts
  whenFeatureEnabled("resepAsli", function() {
    "use strict";
    async function apply() {
      const PAGE_GUARD = "ext-resepAsli-proc";
      const root = document.querySelector(".halaman");
      if (!root || root.getAttribute(PAGE_GUARD)) return;
      const page = root;
      page.setAttribute(PAGE_GUARD, "1");
      const txt = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
      function esc(s) {
        return String(s ?? "").replace(
          /[&<>"']/g,
          (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
        );
      }
      const formatAntrian = (v) => v ? esc(v.replace(/^(.*?)(\d+)$/, "$1\n$2")) : "-";
      const metaMap = /* @__PURE__ */ new Map();
      page.querySelectorAll("table").forEach((t) => {
        t.querySelectorAll("tr").forEach((tr) => {
          const tds = tr.querySelectorAll("td");
          if (tds.length < 2) return;
          const label = txt(tds[0]);
          const value = txt(tds[1]).replace(/^:\s*/, "");
          if (label && !metaMap.has(label)) metaMap.set(label, value);
        });
      });
      const getMeta = (label) => metaMap.get(label) ?? "";
      const params = new URLSearchParams(window.location.search);
      const resepId = params.get("id") || params.get("id_resep") || "";
      let noSep = "";
      let catatan = "";
      let diagnosisUtama = [];
      let diagnosisSekunder = [];
      async function fetchDetailData() {
        if (!resepId) return;
        const detailUrl = "/inventory/resep/penerimaan/detail?id=" + encodeURIComponent(resepId);
        try {
          const resp = await fetch(detailUrl, { credentials: "include" });
          if (!resp.ok) return;
          const html2 = await resp.text();
          const doc = new DOMParser().parseFromString(html2, "text/html");
          const inVal = (name) => {
            const el = doc.querySelector("#" + name) || doc.querySelector('input[name="' + name + '"]') || doc.querySelector('input[id*="' + name + '"]') || doc.querySelector("textarea#" + name) || doc.querySelector('textarea[name="' + name + '"]');
            return el?.value?.trim() || "";
          };
          noSep = inVal("no_sep") || noSep;
          catatan = inVal("catatan") || catatan;
          const fieldsets = Array.from(doc.querySelectorAll("fieldset#perhatian"));
          const fs = fieldsets.find((f) => {
            const leg = f.querySelector("legend");
            return leg && /riwayat\s*diagnosa\s*pasien/i.test(txt(leg));
          });
          if (fs) {
            const allLis = Array.from(fs.querySelectorAll("li")).map((li) => txt(li)).filter(Boolean);
            let sekunderStartIdx = -1;
            const strongs = Array.from(fs.querySelectorAll("strong, b"));
            for (const s of strongs) {
              if (/diagnosa\s*sekunder/i.test(txt(s))) {
                const parentLi = s.closest("li");
                if (parentLi) {
                  const idx = Array.from(fs.querySelectorAll("li")).indexOf(parentLi);
                  if (idx >= 0) sekunderStartIdx = idx;
                } else {
                  const nextOl = s.nextElementSibling;
                  if (nextOl && nextOl.tagName === "OL") {
                    const firstSekunderLi = nextOl.querySelector("li");
                    if (firstSekunderLi) {
                      const idx = Array.from(fs.querySelectorAll("li")).indexOf(firstSekunderLi);
                      if (idx >= 0) sekunderStartIdx = idx;
                    }
                  }
                }
                break;
              }
            }
            if (sekunderStartIdx >= 0 && sekunderStartIdx < allLis.length) {
              diagnosisUtama = allLis.slice(0, sekunderStartIdx);
              diagnosisSekunder = allLis.slice(sekunderStartIdx).filter((v) => v && !/tidak ada/i.test(v));
            } else if (allLis.length) {
              diagnosisUtama = allLis;
            }
          }
        } catch {
        }
      }
      if (!catatan && resepId) {
        try {
          const envResp = await fetch(
            "/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=" + encodeURIComponent(resepId),
            { credentials: "include", cache: "no-store" }
          );
          if (envResp.ok) {
            const env = await envResp.json();
            const c = String(env?.CATATAN ?? "").trim();
            if (c) catatan = c;
          }
        } catch {
        }
      }
      await fetchDetailData();
      if (!diagnosisUtama.length) {
        const d = getMeta("Diagnosa");
        if (d) diagnosisUtama = d.split(",").map((s) => s.trim()).filter(Boolean);
      }
      const jk = getMeta("Jenis Kelamin");
      const jkShort = /^perempuan$/i.test(jk) ? "P" : /^laki-laki$/i.test(jk) ? "L" : jk;
      const pasienJK = (getMeta("Nama Pasien") || "-") + (jk ? " (" + jkShort + ")" : "");
      const dokterRuang = (getMeta("Dokter Pengirim") || getMeta("Dokter") || "-") + (getMeta("Ruangan") || getMeta("Ruangan/Poli") ? " / " + (getMeta("Ruangan") || getMeta("Ruangan/Poli")) : "");
      const look = (re) => {
        for (const k of metaMap.keys()) if (re.test(k)) return metaMap.get(k) || "";
        return "";
      };
      const alergi = look(/alergi/i);
      const bb = look(/berat|\bbb\b/i);
      const bbTxt = bb ? /\bkg\b/i.test(bb) ? bb : bb + " kg" : "- kg";
      const alergiBB = (alergi ? alergi : "-") + " / " + (bb ? "BB " + bbTxt : bbTxt);
      const patientRows = [
        ["Pasien", pasienJK, ""],
        ["No. RM", getMeta("No. RM"), ""],
        ["No. SEP", noSep || getMeta("No. SEP") || "-", ""],
        ["No. Kartu", getMeta("No. Kartu") || "-", ""],
        ["Tgl. Lahir", getMeta("Tanggal Lahir") || getMeta("Tgl. Lahir/Umur") || "-", ""],
        ["Alergi & BB", alergiBB, ""],
        ["Alamat", getMeta("Alamat") || "-", "long"]
      ];
      const doctorRows = [
        ["Dokter", dokterRuang, ""],
        ["SIP", getMeta("SIP") || getMeta("SIP Dokter") || "-", ""],
        ["No Resep", getMeta("No. Resep") || "-", ""],
        ["Ruangan", getMeta("Ruangan") || getMeta("Ruangan/Poli") || "-", ""],
        ["Tanggal", getMeta("Tanggal") || getMeta("Tanggal & Jam") || "-", ""],
        ["Penjamin", getMeta("Penjamin") || "-", ""]
      ];
      const diagValues = [
        ...diagnosisUtama.length ? [diagnosisUtama.join(", ")] : [],
        ...diagnosisSekunder.length ? [diagnosisSekunder.join(", ")] : []
      ];
      const diagThen = '<div class="tm-row long"><span class="tm-label">Diagnosa:</span><span class="tm-val long-val">' + (diagValues.length ? esc(diagValues.join(", ")) : "-") + "</span></div>";
      const patientMetaHtml = '<section class="tm-card tm-card--left"><div class="tm-col">' + patientRows.map(([l, v, rc]) => metaLine(l, v, "", rc)).join("") + diagThen + "</div></section>";
      const doctorMetaHtml = '<section class="tm-card tm-card--right"><div class="tm-col">' + doctorRows.map(([l, v]) => metaLine(l, v)).join("") + "</div></section>";
      const meds = [];
      const tables = page.querySelectorAll("table");
      tables.forEach((table) => {
        table.querySelectorAll("tbody tr").forEach((tr) => {
          const cells = tr.querySelectorAll("td");
          if (cells.length >= 2) {
            const no = txt(cells[0]);
            const name = txt(cells[1]);
            const jml = cells.length > 2 ? txt(cells[2]) : "";
            const aturan = cells.length > 3 ? txt(cells[3]) : "";
            if (no && name) meds.push({ no, name, jml, aturan });
          }
        });
      });
      if (!meds.length && resepId) {
        try {
          const penjualanId = getMeta("ID Penjualan");
          let items = [];
          if (penjualanId && penjualanId !== "0") {
            const r = await fetch(
              "/inventory/search?opsi=tabel_penjualan_lama&id_penjualan=" + encodeURIComponent(penjualanId),
              { credentials: "include", cache: "no-store" }
            );
            if (r.ok) {
              const p = await r.json();
              items = Array.isArray(p) ? p : Object.values(p || {});
            }
          }
          if (!items.length) {
            const r2 = await fetch(
              "/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=" + encodeURIComponent(resepId),
              { credentials: "include", cache: "no-store" }
            );
            if (r2.ok) {
              const env = await r2.json();
              items = Array.isArray(env?.resep) ? env.resep : [];
            }
          }
          if (items.length) {
            meds.length = 0;
            const groups = /* @__PURE__ */ new Map();
            for (const it of items) {
              const nr = String(it.NO_R ?? it.no_r ?? "").trim();
              if (!nr) continue;
              if (!groups.has(nr)) groups.set(nr, []);
              groups.get(nr).push(it);
            }
            for (const [nr, gitems] of groups) {
              const first = gitems[0];
              const isRacikan = String(first.JENIS_R ?? first.JENIS_RSP ?? "").toLowerCase() === "racikan" || gitems.length > 1;
              if (isRacikan) {
                const sediaan = String(first.NAMA_RACIKAN ?? "").trim();
                const rawAturan = String(first.ATURAN_PAKAI_MANUAL ?? "").trim();
                const aturanTxt = rawAturan.replace(/^-\s*/, "").trim();
                const subLines = gitems.map((it) => {
                  const dn = (it.NAMA || "").trim() + (it.KEKUATAN_R_RACIK || it.KEKUATAN ? " " + (it.KEKUATAN_R_RACIK || it.KEKUATAN) : "") + (it.SEDAAN ? ", " + it.SEDAAN : "") + (it.SATUAN ? " @" + it.SATUAN : "");
                  return { name: dn, jml: String(it.JUMLAH_R_PAKAI ?? "").trim() };
                }).filter((s) => s.name);
                const total = String(first.JUMLAH_RACIKAN ?? "").trim();
                meds.push({
                  no: "R/" + nr,
                  name: sediaan || "Racikan",
                  jml: total ? total + " " + (sediaan || "Racikan") : "",
                  aturan: aturanTxt,
                  subMeds: subLines
                });
              } else {
                const dn = (first.NAMA || "").trim() + (first.KEKUATAN ? " " + first.KEKUATAN : "") + (first.SEDAAN ? ", " + first.SEDAAN : "") + (first.SATUAN ? " @" + first.SATUAN : "");
                const jml = String(first.JUMLAH_R_RESEP ?? first.JUMLAH_R_PAKAI ?? "").trim();
                const rawA = String(first.ATURAN_PAKAI_MANUAL ?? "").trim();
                meds.push({ no: "R/" + nr, name: dn, jml, aturan: rawA.replace(/^-\s*/, "").trim() });
              }
            }
          }
        } catch {
        }
      }
      if (!meds.length) {
        const pre = page.querySelector("pre, code, .resep-content");
        if (pre) {
          const lines = (pre.textContent || "").split("\n").filter((l) => l.trim());
          lines.forEach((line, i) => {
            meds.push({ no: "R/" + (i + 1), name: line.trim(), jml: "", aturan: "", raw: true });
          });
        }
      }
      const medListHtml = meds.map((m) => {
        if (m.subMeds && m.subMeds.length) {
          const lines = m.subMeds.map((s, i) => {
            const jml2 = s.jml ? ", Jml: " + esc(s.jml) : "";
            return '<div class="med-line' + (i > 0 ? " indent" : "") + '">' + (i === 0 ? '<span class="med-no">' + esc(m.no) + "</span> " : "") + '<span class="med-name">' + esc(s.name) + "</span>" + jml2 + "</div>";
          }).join("");
          const jadi = m.jml ? '<div class="med-jadiracik">Jml ' + esc(m.jml) + "</div>" : "";
          const atr2 = m.aturan ? '<div class="med-aturan">' + esc(m.aturan) + "</div>" : "";
          return '<div class="med">' + lines + jadi + atr2 + "</div>";
        }
        const jml = m.jml ? ", Jml: " + esc(m.jml) : "";
        const atr = m.aturan ? '<div class="med-aturan">' + esc(m.aturan) + "</div>" : "";
        const raw = m.raw ? ' style="font-family:monospace;font-size:10px;white-space:pre-wrap"' : "";
        return '<div class="med"><div class="med-line"' + raw + '><span class="med-no">' + esc(m.no) + '</span> <span class="med-name">' + esc(m.name) + "</span>" + jml + "</div>" + atr + "</div>";
      }).join("");
      const chkForm = page.querySelector("#form_checklist_telaah_resep");
      const readCheck = (title) => {
        const rows = [];
        if (!chkForm) return rows;
        const tbl = Array.from(chkForm.querySelectorAll("table")).find((t) => {
          const th = txt(t.querySelector("tr td"));
          return th === title;
        });
        if (!tbl) return rows;
        tbl.querySelectorAll("tr").forEach((tr, i) => {
          if (i === 0) return;
          const tds = tr.querySelectorAll("td");
          if (tds.length < 2) return;
          const num = txt(tds[0]);
          const item = txt(tds[1]);
          if (num && item && item !== title) rows.push([num, item]);
        });
        return rows;
      };
      const telaahResep = readCheck("Telaah Resep");
      const telaahObat = readCheck("Telaah Obat");
      const footerEl = Array.from(page.querySelectorAll("center, strong")).find(
        (el) => /Obat tidak boleh diganti/i.test(txt(el))
      );
      const footerText = footerEl ? txt(footerEl) : "Obat tidak boleh diganti tanpa sepengetahuan Dokter";
      const metaLine = (label, value, vClass = "", rowClass = "") => '<div class="tm-row' + (rowClass ? " " + rowClass : "") + '"><span class="tm-label">' + esc(label) + ':</span><span class="tm-val' + (vClass ? " " + vClass : "") + '">' + (value && value.trim() ? esc(value) : "-") + "</span></div>";
      const checkTable = (title, rows) => '<table class="t-check"><thead><tr><th class="l" colspan="2">' + esc(title) + '</th><th class="yt">Y/T</th></tr></thead><tbody>' + rows.map(
        ([num, item]) => '<tr><td class="num">' + esc(num) + "</td><td>" + esc(item) + '</td><td class="yt"></td></tr>'
      ).join("") + "</tbody></table>";
      const bawahHtml = '<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>';
      const html = '<header class="t-head"><img class="t-logo" alt="Logo" src="' + esc("/assets/images/logo/Kota Jambi.png") + '"/><div class="t-bhead"><h1 class="t-hname">RSUD H. ABDUL MANAP</h1><div class="t-hsub">Jl. Sk. Rd. Syahbudin, Mayang Mangurai, Alam Barajo, Kota Jambi<br/>Telp: (0741) 5910190</div></div><div class="t-antrian">' + formatAntrian("") + '</div></header><main class="t-main"><section class="t-left">' + patientMetaHtml + '<div class="t-meds">' + medListHtml + "</div>" + (catatan.trim() !== "" ? '<div class="t-catatan"><div class="t-catatan-title">Catatan</div><div class="t-catatan-body">' + esc(catatan).split("\n").map((l) => l.trim()).filter(Boolean).join("<br/>") + "</div></div>" : "") + '</section><section class="t-right">' + doctorMetaHtml + (telaahResep.length ? checkTable("Telaah Resep", telaahResep) : "") + (telaahObat.length ? checkTable("Telaah Obat", telaahObat) : "") + bawahHtml + '</section></main><footer class="t-footer">' + esc(footerText) + '</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';
      page.innerHTML = html;
      if (resepId) {
        void (async () => {
          try {
            let base = "http://dev.rsudkotajambi.id/rs";
            try {
              const ov = localStorage.getItem("ext-farmasi-app-base");
              if (ov && /^https?:\/\//.test(ov)) base = ov.replace(/\/+$/, "");
            } catch {
            }
            const resp = await fetch(
              base + "/api/queue/lookup?resep_id=" + encodeURIComponent(resepId),
              { cache: "no-store", credentials: "omit", signal: AbortSignal.timeout(8e3) }
            );
            if (!resp.ok) return;
            const j = await resp.json();
            if (j?.ok && j?.found && j?.queue?.queue_number) {
              const el = page.querySelector(".t-antrian");
              if (el && el.isConnected) {
                el.textContent = j.queue.queue_number.replace(/^(.*?)(\d+)$/, "$1\n$2");
              }
            }
          } catch {
          }
        })();
      }
      const TARGET = 866;
      const pageH = page.scrollHeight;
      if (pageH > TARGET) {
        page.classList.add("compact");
        void page.offsetHeight;
        if (page.scrollHeight > TARGET) {
          page.classList.remove("compact");
          page.classList.add("ultra");
        }
      }
      const SID = "ext-resepAsli-style";
      if (!document.getElementById(SID)) {
        document.head.appendChild(
          Object.assign(document.createElement("style"), {
            id: SID,
            textContent: [
              "/* PRINT: 105x241mm */",
              ".halaman{box-sizing:border-box;width:105mm!important;height:auto!important;max-height:241mm;margin:0!important;padding:0 3mm}",
              "@page{size:105mm 241mm;margin:0}",
              ".halaman *{box-sizing:border-box;font-size:11px!important}",
              ".halaman{font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}",
              /* Header */
              ".t-head{display:flex;align-items:center;padding-bottom:6px;border-bottom:1.5px solid #000;margin-bottom:8px;gap:10px}",
              ".t-logo{width:50px;height:50px;object-fit:contain;flex:none}",
              ".t-bhead{flex:1;font-size:11px;min-width:0}",
              ".t-hname{font-size:12px;font-weight:800;margin:0 0 2px;letter-spacing:-.01em}",
              ".t-hsub{line-height:1.2;font-size:10px}",
              ".t-antrian{flex:none;text-align:right;font-size:36px!important;font-weight:800;color:#198754;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1;white-space:pre-line;min-width:0;overflow-wrap:anywhere}",
              /* Metadata cards */
              ".tm-card{background:#fff;padding:2px 0 4px;margin-bottom:4px;font-size:11px;border-bottom:0.5pt solid #333}",
              ".tm-card--small .tm-label{font-size:9px!important}",
              ".tm-card--small .tm-val{font-size:10px!important}",
              ".tm-col{display:flex;flex-direction:column;gap:3px}",
              ".tm-row{display:grid;grid-template-columns:35% 65%;column-gap:4px;align-items:start}",
              ".tm-card--left .tm-row{grid-template-columns:20% 65%}",
              ".tm-card--right .tm-row{grid-template-columns:30% 65%}",
              ".tm-label{color:#5b6470;font-size:10px;line-height:1.25;text-align:left}",
              ".tm-val{color:#000;line-height:1.25;word-wrap:break-word;overflow-wrap:anywhere}",
              ".tm-row.long{display:grid}",
              ".tm-row.long .tm-label{display:block}",
              ".long-val{font-size:10px!important}",
              /* Main 2-col */
              ".t-main{display:grid;grid-template-columns:62% 38%;gap:6px;align-items:start}",
              ".t-left,.t-right{display:flex;flex-direction:column;gap:5px;min-width:0}",
              ".t-right .t-check{margin-bottom:0}",
              ".t-meds{margin-bottom:8px;font-size:11px;min-width:0}",
              /* Med list */
              ".med{margin-bottom:6px}",
              ".med-line{font-size:11px;line-height:1.35;text-align:left}",
              ".med-line.indent{margin-left:0}",
              ".med-no{font-weight:400}",
              ".med-name{font-weight:600}",
              ".med-jml{white-space:nowrap;font-weight:600;color:#047857}",
              ".med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}",
              ".med-jadiracik{margin-top:3px;padding-top:1px;font-size:11px;font-weight:700}",
              /* Catatan */
              ".t-catatan{margin-bottom:8px;border:1px solid #f87171;border-radius:4px;padding:4px 6px;background:#fef2f2}",
              ".t-catatan-title{font-weight:700;font-size:10px;color:#b91c1c;margin-bottom:2px}",
              ".t-catatan-body{font-size:11px;color:#7f1d1d;line-height:1.35;white-space:normal}",
              /* Tables */
              "table{width:100%;border-collapse:collapse;font-size:10px}",
              ".halaman th,.halaman td{border:0.5pt solid #333;padding:1px 3px;font-weight:400;font-size:10px!important;line-height:1.2}",
              "thead th{font-weight:400}",
              ".yt{width:32px;text-align:center}",
              ".num{width:16px;text-align:center}",
              ".l{text-align:left}",
              ".c{text-align:center}",
              ".half{width:50%}",
              ".third{width:33.333%}",
              ".twothird{width:66.667%}",
              ".blk{height:40px;padding:.5pt 3px}",
              ".blk2{min-height:10px}",
              ".blk3{min-height:35px}",
              ".blk4{height:40px;padding:.5pt 3px}",
              ".t-lampiran{margin-top:0}",
              ".t-sub{text-align:center;font-size:10px!important;margin:3px 0}",
              /* Footer */
              ".t-footer{margin-top:10px;text-align:center;font-weight:700;font-style:italic;font-size:11px}",
              ".t-print{margin-top:24px;display:flex;gap:8px}",
              ".t-btn{border:1px solid #d1d5db;border-radius:4px;background:#fff;color:#374151;padding:4px 12px;cursor:pointer;font-size:11px}",
              ".t-btn:hover{background:#f3f4f6}",
              ".no-print{display:none}",
              "@media print{.no-print{display:none!important}}"
            ].join("\n")
          })
        );
      }
    }
    apply();
  });
})();
//# sourceMappingURL=resepAsliPrint.js.map
