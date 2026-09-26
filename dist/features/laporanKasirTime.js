"use strict";
var __morbis_feature = (() => {
  // src/features/laporanKasirTime.ts
  (function() {
    if (!window.location.pathname.includes("laporan-kasir")) return;
    (function pollFlag(attempt) {
      const flag = document.documentElement.getAttribute("data-ext-laporan-kasir-time");
      if (flag === "1") {
        run();
        return;
      }
      if (attempt < 20) window.setTimeout(() => pollFlag(attempt + 1), 500);
    })(0);
    function run() {
      const pad = (n) => (n < 10 ? "0" : "") + n;
      const f = (d) => pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
      const now = /* @__PURE__ */ new Date();
      const today = f(now);
      const yst = new Date(now);
      yst.setDate(yst.getDate() - 1);
      const yesterday = f(yst);
      const noon = "12:00:00";
      function setTime() {
        const a = document.getElementById("awal");
        const b = document.getElementById("akhir");
        if (a) a.value = yesterday + " " + noon;
        if (b) b.value = today + " " + noon;
      }
      setTime();
      function patchFn(name) {
        const w = window;
        if (typeof w[name] !== "function") return false;
        const orig = w[name];
        w[name] = function(...args) {
          setTime();
          return orig.apply(this, args);
        };
        return true;
      }
      ["loadTabelRiwayat", "CariData", "cari"].forEach(function(name) {
        if (!patchFn(name)) {
          let n = 0;
          const h = setInterval(function() {
            n++;
            if (patchFn(name) || n >= 40) clearInterval(h);
          }, 300);
        }
      });
      if (typeof window.contentloader === "function") {
        const orig = window.contentloader;
        window.contentloader = function(...args) {
          setTime();
          return orig.apply(this, args);
        };
      } else {
        let n = 0;
        const h = setInterval(function() {
          n++;
          if (typeof window.contentloader === "function") {
            clearInterval(h);
            const orig = window.contentloader;
            window.contentloader = function(...args) {
              setTime();
              return orig.apply(this, args);
            };
          }
          if (n >= 40) clearInterval(h);
        }, 300);
      }
      const target = document.getElementById("content-riwayat") || document.body;
      const obs = new MutationObserver(function() {
        setTimeout(fixTables, 500);
        setTimeout(fixTables, 2e3);
      });
      obs.observe(target, { childList: true, subtree: true });
      function fixTables() {
        const sel = "#laporan-pembayaran-tunai,#laporan-pembayaran-non-tunai,#laporan-pembayaran-bri,#laporan-pembayaran-edc";
        document.querySelectorAll(sel).forEach(function(t) {
          if (t.dataset.extDone) return;
          t.dataset.extDone = "1";
          const hd = t.querySelector("thead tr");
          if (!hd) return;
          const hcs = hd.querySelectorAll("th,td");
          let si = -1;
          hcs.forEach(function(c, i) {
            const tx = (c.textContent || "").toLowerCase().trim();
            if (tx === "shift" || tx === "pagi/sore") si = i;
          });
          if (si === -1) return;
          t.querySelectorAll("tbody tr").forEach(function(r) {
            const sc = r.cells[si];
            if (!sc || sc.dataset.extDone) return;
            sc.dataset.extDone = "1";
            const shift = (sc.textContent || "").trim();
            for (let i = 0; i < r.cells.length; i++) {
              if (i === si) continue;
              const v = (r.cells[i].textContent || "").trim();
              if (/^\d{2}:\d{2}(:\d{2})?$/.test(v)) {
                sc.textContent = shift + " " + v;
                return;
              }
            }
            const h = r.querySelector("[data-jam],[data-time],[data-waktu]");
            if (h) {
              const tv = h.getAttribute("data-jam") || h.getAttribute("data-time") || h.getAttribute("data-waktu") || "";
              if (tv) sc.textContent = shift + " " + tv;
            }
          });
        });
      }
      let _fpLoaded = false;
      let _fpLoading = false;
      let _fpQueue = [];
      function loadFlatpickr(cb) {
        if (window.flatpickr) {
          cb();
          return;
        }
        if (_fpLoaded) return;
        _fpQueue.push(cb);
        if (_fpLoading) return;
        _fpLoading = true;
        const l = document.createElement("link");
        l.id = "ext-flatpickr-css";
        l.rel = "stylesheet";
        l.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
        document.head.appendChild(l);
        const s = document.createElement("script");
        s.id = "ext-flatpickr-js";
        s.src = "https://cdn.jsdelivr.net/npm/flatpickr";
        s.onload = () => {
          _fpLoading = false;
          _fpLoaded = true;
          const q = _fpQueue;
          _fpQueue = [];
          q.forEach((fn) => fn());
        };
        s.onerror = () => {
          _fpLoading = false;
          _fpQueue = [];
        };
        document.head.appendChild(s);
      }
      function destroyLegacy() {
        const $ = window.$;
        if ($ && $.fn && $.fn.datepicker) {
          try {
            $("#awal, #akhir").datepicker("destroy");
          } catch {
          }
        }
      }
      function initFlatpickr() {
        ["awal", "akhir"].forEach(function(id) {
          const el = document.getElementById(id);
          if (!el) return;
          if (el._flatpickr) return;
          if (el.classList.contains("hasDatepicker")) el.classList.remove("hasDatepicker");
          try {
            window.flatpickr("#" + id, {
              enableTime: true,
              dateFormat: "d/m/Y H:i:S",
              time_24hr: true,
              defaultDate: el.value || (id === "awal" ? yesterday + " " + noon : today + " " + noon)
            });
          } catch (e) {
            console.warn("[LaporanKasirTime] flatpickr err", id, e);
          }
        });
      }
      function applyPicker() {
        destroyLegacy();
        loadFlatpickr(initFlatpickr);
      }
      applyPicker();
      setTimeout(applyPicker, 2e3);
      setTimeout(applyPicker, 5e3);
    }
  })();
})();
//# sourceMappingURL=laporanKasirTime.js.map
