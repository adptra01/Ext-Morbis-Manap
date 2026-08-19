"use strict";
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = "http://dev.rsudkotajambi.id/rs";
  var cachedBase = null;
  var basePromise = null;
  var BASE_CANDIDATES = [
    "http://dev.rsudkotajambi.id/rs",
    "http://103.147.236.138/rs"
  ];
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem("ext-farmasi-app-base");
      if (ov && /^https?:\/\//.test(ov)) {
        const b = ov.replace(/\/+$/, "");
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {
    }
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem("ext-farmasi-app-base");
        if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, "");
      } catch {
      }
      for (const base of BASE_CANDIDATES) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 2500);
          const res = await fetch(base + "/api/queue/lookup?resep_id=probe", {
            cache: "no-store",
            credentials: "omit",
            signal: ctrl.signal
          });
          clearTimeout(t);
          if (res.status === 200 || res.status === 422) {
            cachedBase = base;
            return base;
          }
        } catch {
        }
      }
      return FARMASI_APP_BASE;
    })();
    return basePromise;
  }
  async function pushQueueEvent(p) {
    try {
      const body = { ...p };
      if (p.event === "ENQUEUE") delete body.queue_number;
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + "/api/queue/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        credentials: "omit"
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const j = await res.json();
      return { ok: !!j.ok, queue_number: j.queue?.queue_number };
    } catch (e) {
      console.warn("[MORBIS Ext] queue sync gagal:", e.message);
      return { ok: false };
    }
  }
  function queueEventId(prefix, source, nomor) {
    return `${prefix}-${source}-${nomor}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
  }

  // src/features/shared/printKartu.ts
  function printKartuAntrian(data) {
    const win = window.open("", "_blank", "width=400,height=560");
    if (!win) {
      alert("Popup diblokir \u2014 izinkan popup untuk mencetak.");
      return false;
    }
    const jenisLine = data.jenis || data.unit ? `<div style="font-size:16px;margin-top:2px;">${[data.jenis, data.unit].filter(Boolean).join(" \xB7 ")}</div>` : "";
    win.document.write(
      `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${data.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${data.nama}</div>` + jenisLine + `<div style="font-size:11px;margin-top:10px;color:#333;">${data.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {
      }
    }, 300);
    return true;
  }

  // src/features/farmasiAntrolShift.ts
  function resolveNamaPasien() {
    const fromInput = document.querySelector("#nama_pasien")?.value?.trim();
    if (fromInput) return fromInput.toUpperCase();
    const headers = Array.from(document.querySelectorAll("h1, h2, h3, .page-title, .card-title"));
    for (const h of headers) {
      const t = (h.textContent || "").trim();
      if (t && !/^(detail|edit|resep|.*antrian.*)$/i.test(t) && t.length < 60) {
        return t.toUpperCase();
      }
    }
    return "";
  }
  async function lookupAntrian(resepId) {
    try {
      const res = await fetch(
        farmasiAppBase() + "/api/queue/lookup?resep_id=" + encodeURIComponent(resepId),
        { cache: "no-store", credentials: "omit" }
      );
      if (!res.ok) return null;
      const j = await res.json();
      if (!j.ok || !j.found || !j.queue?.queue_number) return null;
      return j.queue.queue_number;
    } catch {
      return null;
    }
  }
  (() => {
    const ANTRL_URL = "/v2/antrol/search";
    const ANTRL_SUB = "sub=update_v2";
    const LIST_URL = "/public/antrian-farmasi-v2/list-antrian-v2";
    function isAntrolCall(url, body) {
      const u = String(url ?? "");
      const b = String(body ?? "");
      return u.includes(ANTRL_URL) && u.includes(ANTRL_SUB) && b.includes("taskid=6");
    }
    function blockAutoAntrol() {
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.__extUrl = String(url);
        return origOpen.apply(this, [method, url, ...rest]);
      };
      XMLHttpRequest.prototype.send = function(body) {
        if (isAntrolCall(this.__extUrl, body)) {
          console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)");
          return;
        }
        return origSend.apply(this, [body]);
      };
      const origFetch = window.fetch.bind(window);
      window.fetch = ((input, init) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        if (isAntrolCall(url, init?.body)) {
          console.log("[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)");
          return Promise.resolve(new Response(null, { status: 200 }));
        }
        return origFetch(input, init);
      });
    }
    function registerAntrian(idVisit) {
      return fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
        credentials: "include"
      }).then((r) => {
        console.log("[MORBIS Ext] antrian terdaftar id=" + idVisit, "status", r.status);
        return true;
      }).catch((e) => {
        console.warn("[MORBIS Ext] gagal mendaftarkan antrian", e);
        return false;
      });
    }
    async function resolveAntrianRow(idPasien, waktu) {
      try {
        const res = await fetch(LIST_URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: "type=check_antrian",
          cache: "no-store",
          credentials: "include"
        });
        if (!res.ok) return null;
        const rows = await res.json();
        if (!Array.isArray(rows)) return null;
        const w = String(waktu ?? "").slice(0, 16);
        return rows.find(
          (r) => String(r.ID_PASIEN ?? "") === String(idPasien) && (!w || String(r.WAKTU ?? "").slice(0, 16) === w)
        ) ?? rows.find((r) => String(r.ID_PASIEN ?? "") === String(idPasien)) ?? null;
      } catch {
        return null;
      }
    }
    async function onAntrianCetakClick(idVisit, nomorResep) {
      const ok = await registerAntrian(idVisit);
      if (!ok) {
        alert("[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.");
        return;
      }
      const idPasien = document.querySelector("#id_pasien")?.value ?? "";
      const waktu = document.querySelector("#waktu_pengajuan")?.value ?? "";
      let row = null;
      for (let i = 0; i < 5 && !row; i++) {
        row = await resolveAntrianRow(idPasien, waktu);
        if (!row) await new Promise((r) => setTimeout(r, 400));
      }
      const antrianId = row ? String(row.ID ?? "") : idVisit;
      const nama = resolveNamaPasien();
      const sync = await pushQueueEvent({
        event_id: queueEventId("enq", antrianId, idVisit),
        event: "ENQUEUE",
        resep_id: nomorResep,
        nama_pasien: nama,
        norm: idPasien || void 0,
        shift: "",
        jenis: String(row?.JENIS ?? ""),
        counter: "",
        payload: {
          idVisit,
          unit: String(row?.NAMA_UNIT ?? ""),
          waktu: waktu || ""
        }
      });
      if (!sync.ok) {
        alert("[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.");
        return;
      }
      const code = sync.queue_number || "";
      if (!code) {
        alert("[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.");
        return;
      }
      printKartuAntrian({
        nomorResep,
        nama,
        jenis: String(row?.JENIS ?? ""),
        unit: String(row?.NAMA_UNIT ?? ""),
        tanggal: waktu ? waktu.slice(0, 10) : "",
        code
      });
      convertToCetakUlang(code);
    }
    function convertToCetakUlang(code) {
      const btn = document.querySelector("#ext-antrian-cetak");
      if (!btn) return;
      const klon = btn.cloneNode(true);
      klon.id = "ext-antrian-cetak";
      klon.textContent = "\u{1F5A8} Cetak Kembali \u2014 " + code;
      klon.title = "Nomor sudah terbit (" + code + "). Cetak ulang kartu tanpa mengantrikan lagi.";
      klon.classList.remove("btn-success");
      klon.classList.add("btn-outline-primary");
      klon.style.cssText = "margin-left:6px;";
      klon.addEventListener("click", () => {
        const idVisit = document.querySelector("#id_visit")?.value ?? "";
        const nomorResep = document.querySelector("#nomor_resep")?.value ?? "";
        if (!idVisit || !nomorResep) return;
        klon.textContent = "Mencetak\u2026";
        try {
          printKartuAntrian({
            nomorResep,
            nama: resolveNamaPasien(),
            jenis: "",
            unit: "",
            tanggal: "",
            code
          });
        } finally {
          klon.textContent = "\u{1F5A8} Cetak Kembali \u2014 " + code;
        }
      });
      btn.replaceWith(klon);
    }
    function addAntrianCetakButton() {
      const tryInject = () => {
        const saveBtn = document.querySelector("#save");
        if (!saveBtn || document.querySelector("#ext-antrian-cetak")) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "ext-antrian-cetak";
        btn.textContent = "Antrian & Cetak";
        btn.className = "btn btn-success";
        btn.style.cssText = "margin-left:6px;";
        btn.addEventListener("click", () => {
          const idVisit = document.querySelector("#id_visit")?.value ?? "";
          const nomorResep2 = document.querySelector("#nomor_resep")?.value ?? "";
          if (!idVisit || !nomorResep2) {
            alert("[MORBIS Ext] data resep belum dimuat. Coba lagi.");
            return;
          }
          btn.disabled = true;
          btn.textContent = "Memproses\u2026";
          void onAntrianCetakClick(idVisit, nomorResep2).finally(() => {
            btn.disabled = false;
            btn.textContent = "Antrian & Cetak";
          });
        });
        saveBtn.insertAdjacentElement("afterend", btn);
        const nomorResep = document.querySelector("#nomor_resep")?.value ?? "";
        if (nomorResep) {
          void lookupAntrian(nomorResep).then((code) => {
            if (code) convertToCetakUlang(code);
          });
        }
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryInject, { once: true });
      } else {
        tryInject();
      }
      window.setTimeout(tryInject, 2e3);
      window.setTimeout(tryInject, 5e3);
    }
    blockAutoAntrol();
    addAntrianCetakButton();
  })();
})();
//# sourceMappingURL=farmasiAntrolShift.js.map
