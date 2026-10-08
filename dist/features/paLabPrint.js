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

  // src/features/shared/freeText.ts
  var FREE_TEXT_MARK = "ext-free-text-noop";
  var FREE_TEXT_CSS = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,select{text-transform:none!important}';
  function neutralizeToUpper(w) {
    try {
      const cur = w.toUpper;
      if (typeof cur === "function" && cur[FREE_TEXT_MARK] === true) return true;
      const noop = function(obj) {
        return obj?.value ?? "";
      };
      noop[FREE_TEXT_MARK] = true;
      try {
        Object.defineProperty(w, "toUpper", {
          value: noop,
          writable: true,
          configurable: true
        });
      } catch {
        w.toUpper = noop;
      }
      return true;
    } catch {
      return false;
    }
  }

  // src/features/shared/paTypo.ts
  var TYPO_KEY = "ext-pa-typo";
  var TYPO_GROUPS = [
    { key: "kop", label: "Kop Surat" },
    { key: "pasien", label: "Data Pasien" },
    { key: "judul", label: "Judul Bagian Isi" },
    { key: "isi", label: "Isi" },
    { key: "kesimpulan", label: "Kesimpulan" },
    { key: "ttd", label: "TTD" }
  ];
  var DEFAULT_TYPO = {
    kop: { fs: 16, lh: 1.2 },
    pasien: { fs: 4, lh: 1 },
    judul: { fs: 6, lh: 1.2 },
    isi: { fs: 5, lh: 1.25 },
    kesimpulan: { fs: 5, lh: 1.25 },
    ttd: { fs: 6, lh: 1.2 }
  };
  var FS_MIN = 4;
  var FS_MAX = 24;
  var LH_MIN = 0.5;
  var LH_MAX = 2.5;
  function num(v, fallback, min, max) {
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }
  function group(v, fb) {
    const o = v ?? {};
    return {
      fs: num(o.fs, fb.fs, FS_MIN, FS_MAX),
      lh: num(o.lh, fb.lh, LH_MIN, LH_MAX)
    };
  }
  function sanitizeTypo(v) {
    const o = v ?? {};
    return {
      kop: group(o.kop, DEFAULT_TYPO.kop),
      pasien: group(o.pasien, DEFAULT_TYPO.pasien),
      judul: group(o.judul, DEFAULT_TYPO.judul),
      isi: group(o.isi, DEFAULT_TYPO.isi),
      kesimpulan: group(o.kesimpulan, DEFAULT_TYPO.kesimpulan),
      ttd: group(o.ttd, DEFAULT_TYPO.ttd)
    };
  }
  function defaultTypo() {
    return sanitizeTypo(null);
  }
  function loadTypo(store) {
    try {
      if (!store) return defaultTypo();
      const raw = store.getItem(TYPO_KEY);
      if (!raw) return defaultTypo();
      return sanitizeTypo(JSON.parse(raw));
    } catch {
      return defaultTypo();
    }
  }
  function saveTypo(store, t) {
    try {
      if (!store) return false;
      store.setItem(TYPO_KEY, JSON.stringify(sanitizeTypo(t)));
      return true;
    } catch {
      return false;
    }
  }
  function resetTypo(store) {
    try {
      store?.removeItem(TYPO_KEY);
    } catch {
    }
  }
  function resolveTypo(t) {
    const s = sanitizeTypo(t);
    const clamp = (n) => Math.min(FS_MAX, Math.max(FS_MIN, n));
    return {
      ...s,
      alamatFs: clamp(s.kop.fs - 8.5),
      judulLapFs: clamp(s.kop.fs - 4)
    };
  }
  var r2 = (n) => String(Math.round(n * 100) / 100);
  function typoCssVars(t) {
    const r = resolveTypo(t);
    return {
      "--pa-kop-fs": `${r2(r.kop.fs)}pt`,
      "--pa-kop-lh": r2(r.kop.lh),
      "--pa-alamat-fs": `${r2(r.alamatFs)}pt`,
      "--pa-judul-lap-fs": `${r2(r.judulLapFs)}pt`,
      "--pa-pasien-fs": `${r2(r.pasien.fs)}pt`,
      "--pa-pasien-lh": r2(r.pasien.lh),
      "--pa-judul-fs": `${r2(r.judul.fs)}pt`,
      "--pa-judul-lh": r2(r.judul.lh),
      "--pa-isi-fs": `${r2(r.isi.fs)}pt`,
      "--pa-isi-lh": r2(r.isi.lh),
      "--pa-kesimpulan-fs": `${r2(r.kesimpulan.fs)}pt`,
      "--pa-kesimpulan-lh": r2(r.kesimpulan.lh),
      "--pa-ttd-fs": `${r2(r.ttd.fs)}pt`,
      "--pa-ttd-lh": r2(r.ttd.lh)
    };
  }
  function applyTypoVars(target, t) {
    if (!target) return;
    try {
      for (const [k, v] of Object.entries(typoCssVars(t))) target.setProperty(k, v);
    } catch {
    }
  }

  // src/features/shared/paList.ts
  var MARKER_RE = /^(\(?[IVXLC]+[.)]|\d+[.)]|[-•–—*])\s+/;
  function splitListMarker(text) {
    const t = text ?? "";
    const m = t.match(MARKER_RE);
    if (!m) return null;
    const rest = t.slice(m[0].length).trim();
    if (rest === "") return null;
    return [m[1], rest];
  }
  var r1 = (n) => Math.round(n * 10) / 10;
  function hangingFor(markerWidthPx, fontPx, gapEm = 0.35) {
    const w = Number.isFinite(markerWidthPx) && markerWidthPx > 0 ? markerWidthPx : 0;
    const f = Number.isFinite(fontPx) && fontPx > 0 ? fontPx : 12;
    const pad = r1(w + gapEm * f);
    return { padPx: pad, indentPx: -pad };
  }
  function estimateMarkerPt(marker, fsPt) {
    const fs = Number.isFinite(fsPt) && fsPt > 0 ? fsPt : 11;
    const len = (marker ?? "").length;
    if (len === 0) return 0;
    return r1(len * 0.55 * fs + 0.35 * fs);
  }

  // src/features/paLabPrint.ts
  whenFeatureEnabled("paLabPrint", function() {
    "use strict";
    function freeTextNow() {
      try {
        neutralizeToUpper(window);
      } catch {
      }
      try {
        if (document.head && !document.getElementById("ext-free-text-style")) {
          const s = document.createElement("style");
          s.id = "ext-free-text-style";
          s.textContent = FREE_TEXT_CSS;
          document.head.appendChild(s);
        }
      } catch {
      }
    }
    freeTextNow();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", freeTextNow);
    }
    window.setInterval(freeTextNow, 3e3);
    const isPrintPage = window.location.pathname.includes("/laboratorium/print/");
    if (!isPrintPage) return;
    async function apply() {
      const PAGE_GUARD = "ext-pa-print-proc";
      if (document.documentElement.getAttribute(PAGE_GUARD)) return;
      document.documentElement.setAttribute(PAGE_GUARD, "1");
      const typoStore = () => {
        try {
          return window.localStorage ?? null;
        } catch {
          return null;
        }
      };
      let typo = loadTypo(typoStore());
      const applyTypo = () => {
        try {
          applyTypoVars(document.documentElement.style, typo);
        } catch {
        }
      };
      applyTypo();
      const txt = (el) => cleanPhpNoise(el?.textContent || "");
      function stripTags(s) {
        return s.replace(/<[^>]+>/g, " ");
      }
      function fixRsName(s) {
        return s.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi, "H. ");
      }
      function cleanPhpNoise(s) {
        return fixRsName(s).replace(
          /\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi,
          " "
        ).replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi, " ").replace(/\s+/g, " ").trim();
      }
      function esc(s) {
        return String(s ?? "").replace(
          /[&<>"']/g,
          (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
        );
      }
      const logoSrc = document.querySelector("#logo img")?.getAttribute("src") || "/assets/images/logo/Kota Jambi.png";
      const kopLines = Array.from(document.querySelectorAll("h1.kop-atas")).map((h) => txt(h)).filter(Boolean);
      while (kopLines.length < 3) kopLines.push("");
      let addrLines = [];
      const headLogo = document.querySelector("#head-cetak-logo center, #head-cetak-logo");
      if (headLogo) {
        const tmp = document.createElement("div");
        tmp.innerHTML = headLogo.innerHTML;
        tmp.querySelectorAll("h1").forEach((h) => h.remove());
        addrLines = (tmp.innerHTML || "").split(/<br\s*\/?>/gi).map((l) => tmp.textContent && l.replace(/<[^>]+>/g, "").trim()).map((l) => String(l || "").trim()).filter(Boolean);
      }
      const addrText = addrLines.join(" ");
      const pickPhone = (label) => {
        const m = addrText.match(new RegExp(label + "\\s*:([\\d\\s().+-]+)", "i"));
        return m ? m[1].trim() : "";
      };
      const telp = pickPhone("telp");
      const fax = pickPhone("fax");
      const email = (addrText.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/) || [""])[0];
      const website = (addrText.match(/https?:\/\/[^\s;,]+/) || [""])[0];
      let street = addrText.replace(/telp\s*:[\d\s().+-]+/gi, "").replace(/fax\s*:[\d\s().+-]+/gi, "").replace(/website\s*:?/gi, "").replace(/email\s*:?/gi, "");
      if (email) street = street.split(email).join("");
      if (website) street = street.split(website).join("");
      street = street.split(/[;]+/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean).join(", ").replace(/,\s*,+/g, ",").replace(/^[,;\s]+|[,;\s]+$/g, "");
      const addrLine1 = ["Alamat: " + street, telp ? "Telp: " + telp : "", fax ? "Fax: " + fax : ""].filter(Boolean).join(", ");
      const addrLine2 = [email ? "Email: " + email : "", website ? "Website: " + website : ""].filter(Boolean).join(", ");
      addrLines = [addrLine1, addrLine2].filter(Boolean);
      const judul = txt(document.querySelector(".head-cetak-instansi")) || "LAPORAN HASIL PEMERIKSAAN";
      const infoItems = [];
      document.querySelectorAll(".table-outer tr").forEach((tr) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length >= 6) {
          const l1 = txt(tds[0]);
          const v1 = txt(tds[2]);
          const l2 = txt(tds[3]);
          const v2 = txt(tds[5]);
          if (l1) infoItems.push([l1, v1]);
          if (l2) infoItems.push([l2, v2]);
        }
      });
      const ORDER = ["makroskopik", "mikroskopik", "kesimpulan", "icdo", "catatan", "saran"];
      const normTitle = (t) => t.toLowerCase().replace(/0/g, "o").replace(/[^a-z]/g, "");
      const sections = [];
      document.querySelectorAll(".contentlab td").forEach((td) => {
        let title = "";
        let hasSt = false;
        const st = td.querySelector(".section-title");
        if (st) {
          title = txt(st);
          hasSt = true;
        } else {
          const head = (t) => t.split(":")[0].trim();
          for (const el of Array.from(td.children).slice(0, 3)) {
            const t = txt(el);
            if (t && t.length <= 24 && ORDER.includes(normTitle(head(t)))) {
              title = head(t);
              break;
            }
          }
          if (!title) {
            const firstLine = (td.textContent || "").split("\n").map((l) => l.trim()).find(Boolean) || "";
            if (firstLine && ORDER.includes(normTitle(head(firstLine)))) title = head(firstLine);
          }
          if (!title) return;
        }
        const tmp = document.createElement("div");
        tmp.innerHTML = td.innerHTML;
        tmp.querySelector(".section-title")?.remove();
        const paras = tmp.innerHTML.replace(/\r\n?/g, "\n").replace(/<br\s*\/?>[ \t]*\n?/gi, "\n").replace(/\n(?:[ \t]*\n)+/g, "\u2028").split("\u2028").map(
          (block) => block.split(/<br\s*\/?>|\n/).map((l) => cleanPhpNoise(l.replace(/<[^>]+>/g, " "))).filter(Boolean)
        ).filter((b) => b.length);
        const items = [];
        const paraIdx = [];
        paras.forEach((block, bi) => {
          block.forEach((it, ii) => {
            if (bi > 0 && ii === 0 && items.length) paraIdx.push(items.length);
            items.push(it);
          });
        });
        const finalItems = items;
        if (!hasSt && finalItems.length && normTitle(finalItems[0]) === normTitle(title)) {
          finalItems.shift();
          for (let k = 0; k < paraIdx.length; k++) paraIdx[k] -= 1;
          while (paraIdx.length && paraIdx[0] <= 0) paraIdx.shift();
        }
        if (finalItems.length > 1 && !/^[IVXLC]+\.\s/.test(finalItems[0]) && finalItems.slice(1).some((it) => /^II\.\s/.test(it))) {
          finalItems[0] = "I. " + finalItems[0];
        }
        if (title) sections.push({ title, items: finalItems, para: paraIdx });
      });
      const MARK_CATATAN = /^catatan\s*:?/i;
      const MARK_ICDO = /^icd[\s-]*o\b\s*:?/i;
      const splitSections = [];
      for (const s of sections) {
        const parts = [
          { title: s.title, items: [], para: [] }
        ];
        let cur = parts[0];
        let openedVirtual = false;
        const open = (t, bare) => {
          cur = { title: t, items: [], para: [], bare };
          parts.push(cur);
          openedVirtual = true;
        };
        s.items.forEach((it, i) => {
          const mCat = it.match(MARK_CATATAN);
          const mIc = mCat ? null : it.match(MARK_ICDO);
          if (mCat) {
            if (normTitle(cur.title) !== "catatan") open("Catatan");
            const rest = it.slice(mCat[0].length).trim();
            if (rest) {
              if (s.para.includes(i)) cur.para.push(cur.items.length);
              cur.items.push(rest);
            }
            return;
          }
          if (mIc) {
            if (normTitle(cur.title) !== "icdo") open("ICD-0", true);
            if (s.para.includes(i)) cur.para.push(cur.items.length);
            cur.items.push(it);
            return;
          }
          if (s.para.includes(i)) cur.para.push(cur.items.length);
          cur.items.push(it);
        });
        if (openedVirtual) {
          for (const p of parts) if (p.items.length) splitSections.push(p);
        } else {
          splitSections.push(parts[0]);
        }
      }
      sections.length = 0;
      sections.push(...splitSections);
      sections.forEach((s, i) => s._i = i);
      sections.sort((a, b) => {
        const ai = a._i ?? 0;
        const bi = b._i ?? 0;
        const ao = ORDER.indexOf(normTitle(a.title));
        const bo = ORDER.indexOf(normTitle(b.title));
        const ra = ao === -1 ? ORDER.length : ao;
        const rb = bo === -1 ? ORDER.length : bo;
        return ra !== rb ? ra - rb : ai - bi;
      });
      function fieldText(el) {
        let val = "";
        if (el instanceof HTMLSelectElement) {
          const opt = el.selectedIndex >= 0 ? el.options[el.selectedIndex] : void 0;
          val = (opt?.textContent || el.value || "").trim();
        } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          val = (el.value || "").trim();
        }
        const ids = (el.getAttribute("name") || "") + " " + (el.getAttribute("id") || "");
        const ph = el.getAttribute("placeholder") || "";
        const row = el.closest("tr, .form-group, .form-row, div")?.textContent || "";
        return { val, ctx: (ids + " " + ph + " " + row).slice(0, 300) };
      }
      function originalValue(doc2, printVal, ctxRe) {
        const toks = printVal.toLowerCase().split(/[^a-z0-9]+/).filter(
          (t) => t.length >= 4 && !/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(t)
        );
        if (!toks.length) return "";
        const anchor = toks.sort((a, b) => b.length - a.length)[0];
        let best = "";
        let bestScore = -1;
        doc2.querySelectorAll("input, textarea, select").forEach((el) => {
          const { val, ctx } = fieldText(el);
          if (!val || val === printVal) return;
          if (!val.toLowerCase().includes(anchor)) return;
          const score = ctxRe.test(ctx) ? 2 : 0;
          if (score > bestScore) {
            bestScore = score;
            best = val;
          }
        });
        return best;
      }
      function inputFieldValue(doc2, sel) {
        const el = doc2.querySelector(sel);
        return (el?.value || "").trim();
      }
      async function overrideFromInput(info) {
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) return;
        const isKlinis = (l) => /ket\w*\s*klinis/i.test(l);
        const isDokRs = (l) => /^dokter/i.test(l) || /^rs\b/i.test(l);
        const targets = info.map(([l, v], i) => ({ label: l, value: v, idx: i })).filter((t) => isDokRs(t.label) ? !!t.value : isKlinis(t.label));
        if (!targets.length) return;
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 6e3);
        try {
          const url = new URL(
            "/laboratorium/input-hasil/input-hasil-pa?id_lab=" + encodeURIComponent(id),
            window.location.href
          );
          const res = await fetch(url.toString(), {
            credentials: "same-origin",
            signal: ctrl.signal
          });
          if (!res.ok) {
            window.console.info("[paPrint] override: fetch input status " + res.status);
            return;
          }
          const html = await res.text();
          const doc2 = new DOMParser().parseFromString(html, "text/html");
          window.console.info(
            '[paPrint] override: input title="' + (doc2.title || "").slice(0, 60) + '" len=' + html.length + " fields=" + doc2.querySelectorAll("input, textarea, select").length
          );
          for (const t of targets) {
            if (isKlinis(t.label)) {
              const rawK = inputFieldValue(
                doc2,
                '#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]'
              );
              const klinis = cleanPhpNoise(stripTags(rawK));
              window.console.info(
                "[paPrint] override: " + t.label + ' cetak="' + t.value + '" input="' + klinis + '"'
              );
              if (klinis && klinis !== t.value) info[t.idx][1] = klinis;
              continue;
            }
            const ctxRe = /^dokter/i.test(t.label) ? /dokter|pengirim|luar|dalam|rujuk/i : /rs\b|rumah\s*sakit|faskes|asal/i;
            const raw = originalValue(doc2, t.value, ctxRe);
            const orig = cleanPhpNoise(stripTags(raw || ""));
            window.console.info(
              "[paPrint] override: " + t.label + ' cetak="' + t.value + '" input="' + orig + '"'
            );
            if (orig && orig !== t.value) info[t.idx][1] = orig;
          }
        } catch {
          window.console.info("[paPrint] override: fetch gagal, pakai nilai server");
        } finally {
          window.clearTimeout(timer);
        }
      }
      await overrideFromInput(infoItems).catch(() => {
      });
      const sigTds = Array.from(document.querySelectorAll(".contentlab ~ div table td"));
      const sigTexts = sigTds.map((td) => txt(td)).filter(Boolean);
      const thanks = sigTexts[0] || "";
      const dateLine = sigTexts[1] || "";
      const qrSrc = document.querySelector(".contentlab ~ div table img")?.getAttribute("src") || "";
      const docName = sigTexts.find((t) => /^\(.*\)$/.test(t)) || sigTexts[2] || "";
      const nip = sigTexts.find((t) => /^nip\.?/i.test(t)) || sigTexts[3] || "";
      const exportHref = document.querySelector('a.tombol[href*="export"]')?.getAttribute("href") || window.location.href + "&export=word";
      const bodyScripts = Array.from(
        document.body.querySelectorAll("script")
      );
      const titleCase = (s) => s.toLowerCase().split(/\s+/).map((w) => w ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(" ");
      const infoClean = infoItems.map(([l, v]) => {
        if (!/^ruang/i.test(l)) return [l, v];
        const dedup = v.replace(/^poli\s+.+?-\s*(?=klinik)/i, "").trim() || v;
        const segDup = dedup.replace(/^(\S+)\s+-\s*(?=\1\b)/i, "").trim();
        const base = segDup || dedup;
        const segs = base.split(/\s+-\s*/);
        if (segs.length >= 3 && /rawat\s+inap/i.test(segs[1])) {
          const mid = titleCase(segs[1].trim());
          const rest = segs.slice(2).join(" - ").trim();
          const out = rest ? mid + " - " + rest : mid;
          if (out) return [l, out];
        }
        return [l, base];
      });
      const infoHtml = infoClean.map(
        ([l, v]) => '<div class="info-item"><div class="info-label">' + esc(l) + '</div><div class="info-colon">:</div><div class="info-value">' + esc(v) + "</div></div>"
      ).join("");
      const fmtItem = (it) => (
        // Baris ICD-O tampil bold seperti prototype (ICD-0: 8210/0 …).
        /^icd-?o\s*:/i.test(it) ? "<strong>" + esc(it) + "</strong>" : esc(it)
      );
      const isCatatan = (t) => /^catatan/i.test(t.trim());
      const stripBullet = (it) => it.replace(/^catatan\s*:?\s*/i, "").replace(/^[-•–—*]+\s*/, "").trim();
      const noPA = infoClean.find(([l]) => /^no\.?pa/i.test(l))?.[1].replace(/[^a-zA-Z0-9]+/g, "-") || "tanpa-no";
      function dataUrl(src) {
        if (/^data:/i.test(src)) return Promise.resolve(src);
        const abs = new URL(src, window.location.href).href;
        return fetch(abs, { signal: AbortSignal.timeout(8e3), credentials: "same-origin" }).then((res) => {
          if (!res.ok) throw new Error("img " + res.status);
          return res.blob();
        }).then(
          (blob) => new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result));
            fr.onerror = () => reject(fr.error);
            fr.readAsDataURL(blob);
          })
        ).catch(() => abs);
      }
      async function exportWord() {
        const r = resolveTypo(typo);
        const [logo, qr] = await Promise.all([
          dataUrl(logoSrc),
          qrSrc ? dataUrl(qrSrc) : Promise.resolve("")
        ]);
        let infoTbl = "";
        for (let r3 = 0; r3 < infoClean.length; r3 += 2) {
          const a2 = infoClean[r3];
          const b = infoClean[r3 + 1];
          infoTbl += "<tr><td>" + esc(a2[0]) + "</td><td>:</td><td>" + esc(a2[1]) + "</td>" + (b ? "<td>" + esc(b[0]) + "</td><td>:</td><td>" + esc(b[1]) + "</td>" : "<td></td><td></td><td></td>") + "</tr>";
        }
        let hasilDoc = "";
        for (const s of sections) {
          if (isCatatan(s.title)) {
            const rows = s.items.length ? s.items : ["Tidak ada"];
            hasilDoc += '<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top" style="font-size:' + r.judul.fs + 'pt"><b><u>CATATAN:</u></b></td><td>' + rows.map((it) => "- " + esc(stripBullet(it) || "Tidak ada")).join("<br>") + "</td></tr></table>";
            continue;
          }
          if (s.bare) {
            s.items.forEach((it, i) => {
              hasilDoc += '<p style="margin:' + (i === 0 ? "12pt" : "0") + " 0 6pt 0;font-size:" + r.judul.fs + 'pt;"><b>' + esc(it.toUpperCase()) + "</b></p>";
            });
            continue;
          }
          hasilDoc += '<p style="margin:12pt 0 0 0;font-size:' + r.judul.fs + 'pt;"><b><u>' + esc(s.title.toUpperCase()) + "</u></b></p>";
          const boldAll = normTitle(s.title) === "kesimpulan";
          const fs = boldAll ? r.kesimpulan.fs : r.isi.fs;
          const lh = boldAll ? r.kesimpulan.lh : r.isi.lh;
          s.items.forEach((it, i) => {
            const body = boldAll ? "<b>" + esc(it) + "</b>" : fmtItem(it);
            const mk = splitListMarker(it);
            const maxMk = Math.max(
              0,
              ...s.items.map((x) => {
                const mm = splitListMarker(x);
                return mm ? estimateMarkerPt(mm[0], fs) : 0;
              })
            );
            const hv = maxMk > 0 ? maxMk.toFixed(1) : "0";
            const hang = "margin-left:" + hv + "pt;" + (mk && maxMk > 0 ? "text-indent:-" + hv + "pt;" : "");
            hasilDoc += '<p style="margin:' + (s.para.includes(i) ? "14pt" : "0") + " 0 6pt 0;font-size:" + fs + "pt;line-height:" + lh + ";text-align:justify;" + hang + '">' + body + "</p>";
          });
        }
        const doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + esc(judul) + '</title></head><body style="font-family:Arial,sans-serif;font-size:' + r.isi.fs + "pt;line-height:" + r.isi.lh + ';"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="' + logo + '" width="90"></td><td align="center">' + kopLines.slice(0, 3).map((l) => '<b style="font-size:' + r.kop.fs + 'pt;">' + esc(l) + "</b>").join("<br>") + '<br><span style="font-size:' + r.alamatFs + 'pt;">' + addrLines.map((l) => esc(l)).join("<br>") + '</span></td></tr></table><hr><p align="center" style="font-size:' + r.judulLapFs + 'pt;"><b><u>' + esc(judul.toUpperCase()) + '</u></b></p><table border="0" cellspacing="0" cellpadding="2" style="font-size:' + r.pasien.fs + "pt;line-height:" + r.pasien.lh + ';">' + infoTbl + "</table>" + hasilDoc + '<table border="0" width="100%" cellspacing="0" cellpadding="0" style="font-size:' + r.ttd.fs + "pt;line-height:" + r.ttd.lh + ';"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">' + esc(thanks) + '</p><p style="margin:0 0 6pt 0;">' + esc(dateLine) + "</p>" + (qr ? '<p style="margin:0 0 6pt 0;"><img src="' + qr + '" width="80" height="80"></p>' : "") + '<p style="margin:0 0 6pt 0;"><b>' + esc(docName) + '</b></p><p style="margin:0 0 6pt 0;">' + esc(nip) + "</p></td></tr></table></body></html>";
        const blob = new Blob(["\uFEFF" + doc], { type: "application/msword" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Hasil-PA-" + noPA + ".doc";
        document.body.appendChild(a);
        a.click();
        window.setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 4e3);
      }
      const hasilHtml = sections.map((s) => {
        if (isCatatan(s.title)) {
          const rows = s.items.length ? s.items : ["Tidak ada"];
          return '<div class="section-catatan"><span class="catatan-label">Catatan:</span><div class="catatan-list">' + rows.map(
            (it) => '<div class="catatan-item"><span class="catatan-dash">-</span><span>' + esc(stripBullet(it) || "Tidak ada") + "</span></div>"
          ).join("") + "</div></div>";
        }
        const boldAll = normTitle(s.title) === "kesimpulan";
        const isi = '<div class="' + (s.bare ? "section-isi section-isi-bare" : "section-isi") + (boldAll ? " section-kesimpulan" : "") + '">' + s.items.map((it, i) => {
          const paraCls = s.para.includes(i) ? " item-para" : "";
          const mk = splitListMarker(it);
          if (mk) {
            const rest = boldAll ? "<strong>" + esc(mk[1]) + "</strong>" : fmtItem(mk[1]);
            return '<div class="item-list has-marker' + paraCls + '"><span class="item-marker">' + esc(mk[0]) + "</span> <span>" + rest + "</span></div>";
          }
          return '<div class="item-list' + paraCls + '">' + (boldAll ? "<strong>" + esc(it) + "</strong>" : fmtItem(it)) + "</div>";
        }).join("") + "</div>";
        if (s.bare) return isi;
        return '<div class="section-judul">' + esc(s.title) + "</div>" + isi;
      }).join("");
      function alignHanging(root = document) {
        let blocks;
        try {
          blocks = Array.from(root.querySelectorAll(".section-isi"));
        } catch {
          return;
        }
        for (const block of blocks) {
          let items;
          try {
            items = Array.from(block.querySelectorAll(":scope > .item-list"));
          } catch {
            items = Array.from(block.children).filter((c) => c.classList.contains("item-list"));
          }
          const marked = items.filter((el) => el.classList.contains("has-marker"));
          if (!marked.length) continue;
          let fontPx = 12;
          try {
            const fs = parseFloat(getComputedStyle(block).fontSize);
            if (Number.isFinite(fs) && fs > 0) fontPx = fs;
          } catch {
          }
          let maxW = 0;
          const widths = /* @__PURE__ */ new Map();
          for (const el of marked) {
            const m = el.querySelector(".item-marker");
            if (!m || !m.textContent) continue;
            let w = 0;
            try {
              const range = document.createRange();
              range.selectNodeContents(m);
              const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0.5);
              if (rects.length) w = Math.max(...rects.map((r) => r.width));
            } catch {
            }
            if (w > 0) {
              widths.set(el, w);
              if (w > maxW) maxW = w;
            }
          }
          if (maxW <= 0) continue;
          const { padPx } = hangingFor(maxW, fontPx);
          const pad = padPx.toFixed(1) + "px";
          const indent = (-padPx).toFixed(1) + "px";
          for (const el of items) {
            try {
              const html = el;
              html.style.paddingLeft = pad;
              html.style.textIndent = widths.has(el) ? indent : "0px";
            } catch {
            }
          }
        }
      }
      let alignT;
      function alignHangingSoon() {
        try {
          window.clearTimeout(alignT);
        } catch {
        }
        alignT = window.setTimeout(() => {
          alignHanging();
        }, 250);
      }
      document.body.innerHTML = '<a href="' + esc(exportHref) + '" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><button type="button" class="no-print" id="btn-typo" title="Atur font & spasi cetakan">\u2699\uFE0F Gaya</button><div class="t-typo no-print" id="ext-pa-typo" hidden></div><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="' + esc(logoSrc) + '" alt="Logo"></div><div class="kop-text">' + kopLines.slice(0, 3).map((l) => '<h1 class="kop-atas">' + esc(l) + "</h1>").join("") + '<div class="kop-alamat">' + addrLines.map((l) => esc(l)).join("<br>") + '</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">' + esc(judul) + '</div><div class="patient-info-container">' + infoHtml + '</div><div class="hasil-pa">' + hasilHtml + '</div><div class="ttd-container clearfix"><div class="ttd-box"><p>' + esc(thanks) + "</p><p>" + esc(dateLine) + "</p>" + (qrSrc ? '<img src="' + esc(qrSrc) + '" alt="QR Code TTD">' : "") + '<p style="font-weight: bold; margin-bottom: 0;">' + esc(docName) + '</p><p style="margin-top: 2px;">' + esc(nip) + "</p></div></div></div>";
      bodyScripts.forEach((s) => document.body.appendChild(s));
      document.querySelector("#btn-word")?.addEventListener("click", (e) => {
        e.preventDefault();
        exportWord().catch(() => {
          window.location.href = exportHref;
        });
      });
      const renderTypoPanel = () => {
        const panel = document.getElementById("ext-pa-typo");
        if (!panel) return;
        const row = (gkey, field, label, min, max, step, val, unit) => "<label>" + esc(label) + '<input type="range" data-g="' + esc(gkey) + '" data-f="' + field + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output data-o="' + esc(gkey + "-" + field) + '">' + esc(String(val) + unit) + "</output></label>";
        panel.innerHTML = "<h4>Gaya Cetakan PA</h4>" + TYPO_GROUPS.map(
          (g) => '<div class="t-typo-group"><strong>' + esc(g.label) + '</strong><div class="t-typo-row">' + row(g.key, "fs", "Font (pt)", 4, 20, 0.5, typo[g.key].fs, "pt") + row(g.key, "lh", "Spasi baris", 0.5, 2.5, 0.05, typo[g.key].lh, "") + "</div></div>"
        ).join("") + '<div class="t-typo-actions"><button type="button" data-act="save" class="primary">Simpan</button><button type="button" data-act="reset">Reset</button></div><div class="t-typo-note" data-note></div>';
        panel.querySelectorAll('input[type="range"]').forEach((el) => {
          const input = el;
          input.addEventListener("input", () => {
            const gk = input.dataset.g;
            const fd = input.dataset.f;
            if (!gk || !fd || !typo[gk]) return;
            typo[gk][fd] = Number(input.value);
            applyTypo();
            alignHangingSoon();
            const out = panel.querySelector(`output[data-o="${gk}-${fd}"]`);
            if (out) out.textContent = input.value + (fd === "fs" ? "pt" : "");
          });
        });
        const note = panel.querySelector("[data-note]");
        panel.querySelector('[data-act="save"]')?.addEventListener("click", () => {
          const ok = saveTypo(typoStore(), typo);
          if (note) note.textContent = ok ? "Tersimpan \u2713" : "Gagal menyimpan";
        });
        panel.querySelector('[data-act="reset"]')?.addEventListener("click", () => {
          resetTypo(typoStore());
          typo = loadTypo(typoStore());
          applyTypo();
          renderTypoPanel();
          if (note) {
            const n2 = panel.querySelector("[data-note]");
            if (n2) n2.textContent = "Kembali ke default \u2713";
          }
        });
      };
      document.querySelector("#btn-typo")?.addEventListener("click", () => {
        const panel = document.getElementById("ext-pa-typo");
        if (!panel) return;
        const willOpen = panel.hidden;
        if (willOpen) renderTypoPanel();
        panel.hidden = !willOpen;
      });
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());
      const STYLE_ID = "ext-pa-print-style";
      if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement("style");
        s.id = STYLE_ID;
        s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

        /* Pengaturan Font dan Kertas untuk Cetak */
        body {
            font-family: 'Roboto', sans-serif;
            font-size: 6pt;
            color: #000;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
        }

        .page-a4 {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            border-radius: 4px;
        }

        /* User Header Styles */
        .head-cetak {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin-bottom: 5px;
            width: 100%;
        }

        #logo img {
            height: 90px;
            width: auto;
        }

        .kop-text {
            text-align: center;
        }

        .kop-atas {
            font-size: var(--pa-kop-fs, 16pt);
            margin: 0;
            line-height: var(--pa-kop-lh, 1.2);
            font-weight: bold;
            color: #000;
        }

        .kop-alamat {
            font-size: var(--pa-alamat-fs, 7.5pt);
            margin-top: 5px;
            color: #334155;
            line-height: var(--pa-kop-lh, 1.3);
        }

        hr.kop-hr {
            border: none;
            border-top: 2px solid #000;
            margin: 10px 0;
            width: 100%;
        }

        .head-cetak-instansi {
            font-size: var(--pa-judul-lap-fs, 12pt);
            font-weight: bold;
            text-align: center;
            margin: 15px 0 20px 0;
            text-decoration: underline;
            text-transform: uppercase;
            line-height: var(--pa-kop-lh, 1.2);
        }

        /* Kontainer utama dengan 2 kolom */
        .patient-info-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 40px;
            font-family: Arial, sans-serif;
            max-width: 900px;
        }

        /* Tata letak untuk setiap baris data (Label : Nilai) */
        .info-item {
            display: grid;
            grid-template-columns: 110px 15px 1fr;
            align-items: start;
        }

        .info-label {
            font-weight: 500;
        }

        .info-colon {
            text-align: center;
        }

        /* Responsif: Ubah jadi 1 kolom di layar HP (lebar maksimal 768px) */
        @media (max-width: 768px) {
            .patient-info-container {
                grid-template-columns: 1fr;
            }
        }

        /* Result Sections */
        .hasil-pa {
            margin-top: 20px;
        }

        .hasil-title {
            text-align: center;
            font-weight: bold;
            font-size: 8pt;
            margin-bottom: 20px;
            text-decoration: underline;
        }

        .section-judul {
            font-weight: bold;
            margin-top: 12px;
            font-size: 6pt;
            text-decoration: underline;
            text-transform: uppercase;
        }

        .section-isi {
            margin-top: 8px;
            text-align: justify;
            line-height: 1.25;
        }

        .item-list {
            margin-bottom: 12px;
        }

        .group-title {
            margin-bottom: 6px;
            font-weight: 500;
        }

        .empty-field {
            color: #9ca3af;
            font-style: italic;
        }

        /* Signature Section */
        .ttd-container {
            margin-top: 15px;
        }

        .ttd-box {
            float: right;
            width: 300px;
            text-align: center;
            font-size: var(--pa-ttd-fs, 6pt);
            line-height: var(--pa-ttd-lh, 1.2);
        }

        .ttd-box p {
            margin: 5px 0;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        @media print {
            body {
                background-color: transparent;
                padding: 0;
            }

            .page-a4 {
                margin: 0;
                box-shadow: none;
                width: 100%;
                padding: 10mm;
            }

            .nav-container,
            .nav-button,
            .btn-print,
            .btn-back {
                display: none !important;
            }
        }

        /* Buttons */
        .nav-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #64748b;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px;
            transition: background 0.2s;
        }

        .nav-button:hover {
            background-color: #475569;
        }

        .btn-print {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
        }

        .btn-print:hover {
            background: #0f172a;
        }

        .btn-back {
            position: fixed;
            top: 20px;
            right: 170px;
            background: #64748b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-back:hover {
            background: #475569;
        }

        /* === OVERRIDE: QR sedang + info rapat + print 2 kolom ===
           Layout tetap prioritas; hanya: QR 80px, jarak baris info
           rapat, info pasien tetap grid 2 kolom saat cetak. */
        .ttd-box img {
            width: 80px;
            height: 80px;
        }

        .patient-info-container {
            font-size: var(--pa-pasien-fs, 4pt);
            line-height: var(--pa-pasien-lh, 1);
            gap: 4px 40px;
            border: 1px solid #000;
            padding: 10px 12px;
        }

        @media print {
            .patient-info-container {
                grid-template-columns: 1fr 1fr !important;
            }

            .section-judul {
                break-after: avoid;
            }
        }

        .section-judul {
            font-size: var(--pa-judul-fs, 6pt);
            line-height: var(--pa-judul-lh, 1.2);
        }

        /* Gutter hanging indent dihitung PER SECTION via JS terukur
           (alignHanging -> inline style), BUKAN fix 1.8em: marker
           sepanjang apa pun ("1." s/d "XIII.") sejajar sempurna.
           Aturan di bawah hanya fallback bila pengukuran belum jalan. */
        .section-isi {
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
        }

        /* Isi Kesimpulan: grup gaya sendiri, terpisah dari Isi
           (permintaan user). Default sama dengan isi agar tampilan
           awal tidak berubah. */
        .section-kesimpulan {
            font-size: var(--pa-kesimpulan-fs, 5pt);
            line-height: var(--pa-kesimpulan-lh, 1.25);
        }

        /* Fallback pra-pengukuran: gutter fix 1.8em (ditimpa inline
           presisi oleh alignHanging segera setelah render). */
        .item-list.has-marker {
            padding-left: 1.8em;
            text-indent: -1.8em;
        }

        .item-list {
            margin-bottom: 6px;
        }

        /* Awal paragraf baru (baris kosong di input): gap ekstra. */
        .item-list.item-para {
            margin-top: 14px;
        }

        /* ICD-O tanpa judul (bare, id=154696): "ICD-O : \u2026" saja tanpa
           dobel judul "ICD-0" \u2014 font, margin & padding sama persis
           seperti section-judul (minus garis bawah). */
        .section-isi-bare {
            margin: 12px 0 0;
            padding: 0;
            font-size: var(--pa-judul-fs, 6pt);
            font-weight: bold;
            line-height: var(--pa-judul-lh, 1.2);
            text-transform: uppercase;
        }

        .section-isi-bare .item-list {
            margin: 0;
            padding: 0;
        }

        /* CATATAN: label + list gantung \u2014 baris lanjutan rata di bawah
           dash pertama ("Catatan: - \u2026" lalu "- \u2026" sejajar di bawahnya). */
        .section-catatan {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 12px;
            font-size: var(--pa-isi-fs, 5pt);
            line-height: var(--pa-isi-lh, 1.25);
            text-align: justify;
        }

        .catatan-label {
            flex-shrink: 0;
            font-weight: bold;
            font-size: var(--pa-judul-fs, 6pt);
            line-height: var(--pa-judul-lh, 1.2);
            text-transform: uppercase;
        }

        .catatan-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }

        .catatan-item {
            display: flex;
            gap: 6px;
        }

        .catatan-dash {
            flex-shrink: 0;
        }

        /* Panel pengaturan tipografi (tombol \u2699\uFE0F Gaya) \u2014 no-print. */
        #btn-typo {
            position: fixed;
            top: 70px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            z-index: 9999;
        }
        #btn-typo:hover { background: #0f172a; }
        .t-typo {
            position: fixed;
            top: 120px;
            right: 20px;
            width: 280px;
            max-height: 70vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
            padding: 12px 14px;
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
        }
        .t-typo h4 { margin: 0 0 8px; font-size: 13px; }
        .t-typo-group { margin-bottom: 10px; border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .t-typo-group > strong { display: block; font-size: 12px; margin-bottom: 4px; }
        .t-typo-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .t-typo-row label { display: flex; flex-direction: column; font-size: 11px; color: #475569; gap: 2px; }
        .t-typo-row input[type="range"] { width: 100%; }
        .t-typo-row output { font-size: 11px; color: #0f172a; font-weight: 600; }
        .t-typo-actions { display: flex; gap: 8px; margin-top: 4px; }
        .t-typo-actions button {
            flex: 1;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            border-radius: 6px;
            padding: 6px 0;
            font-size: 12px;
            cursor: pointer;
        }
        .t-typo-actions button.primary { background: #1e293b; color: white; border-color: #1e293b; }
        .t-typo-note { font-size: 11px; color: #15803d; min-height: 16px; margin-top: 6px; }
        @media print { .no-print { display: none !important; } }
      `;
        document.head.appendChild(s);
      }
      alignHanging();
      try {
        if (document.fonts?.ready) {
          void document.fonts.ready.then(() => {
            alignHanging();
          });
        }
      } catch {
      }
      window.addEventListener("resize", alignHangingSoon);
      window.addEventListener("beforeprint", () => {
        alignHanging();
      });
    }
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (document.documentElement.getAttribute("data-ext-pa-print") === "1") {
        window.clearInterval(iv);
        apply().catch(() => {
        });
      } else if (Date.now() - t0 > 5e3) {
        window.clearInterval(iv);
      }
    }, 200);
  });
})();
//# sourceMappingURL=paLabPrint.js.map
