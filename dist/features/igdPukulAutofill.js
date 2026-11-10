"use strict";
var __morbis_feature = (() => {
  // src/features/igdPukulAutofill.ts
  (function() {
    const MAX_WAIT = 200;
    let waited = 0;
    function nowLocal() {
      const d = /* @__PURE__ */ new Date();
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    function patchDelete() {
      const w = window;
      const $ = window.jQuery || window.$;
      w.deleteElementObat = function(el) {
        const parent = el.parentNode && el.parentNode.parentNode;
        if (parent && parent.parentNode) parent.parentNode.removeChild(parent);
        const rows = $(".obat_tr");
        const count = rows.length;
        for (let i = 0; i < count; i++) {
          const $row = $(`.obat_tr:eq(${i})`);
          $row.removeClass("even odd").addClass((i + 1) % 2 !== 0 ? "even" : "odd");
          $row.children("td:eq(0)").children('input[type="datetime-local"]').attr("id", "pukulobat" + (i + 1));
          $row.children("td:eq(0)").children('input[type="datetime-local"]').attr("name", "medis[" + (i + 1) + "][pukulobat]");
          $row.children("td:eq(1)").children(".auto").attr("id", "nama_barang" + (i + 1));
          $row.children("td:eq(1)").children(".auto").attr("name", "medis[" + (i + 1) + "][nama_barang]");
          $row.children("td:eq(1)").children(".hideauto").attr("id", "id_barang" + (i + 1));
          $row.children("td:eq(1)").children(".hideauto").attr("name", "medis[" + (i + 1) + "][id_barang]");
          $row.children("td:eq(2)").children('input[type="text"]').attr("id", "dosis" + (i + 1));
          $row.children("td:eq(2)").children('input[type="text"]').attr("name", "medis[" + (i + 1) + "][dosis]");
          $row.children("td:eq(3)").children(".auto").attr("id", "perawat_ttd" + (i + 1));
          $row.children("td:eq(3)").children(".auto").attr("name", "medis[" + (i + 1) + "][perawat_ttd]");
          $row.children("td:eq(3)").children(".hideauto").attr("id", "id_perawat_ttd" + (i + 1));
          $row.children("td:eq(3)").children(".hideauto").attr("name", "medis[" + (i + 1) + "][id_perawat_ttd]");
        }
      };
    }
    function setupAutofill() {
      const seen = /* @__PURE__ */ new WeakSet();
      const protectedValues = /* @__PURE__ */ new Set();
      function collectProtected() {
        document.querySelectorAll(".obat_tr").forEach((tr) => {
          tr.querySelectorAll('input[type="datetime-local"]').forEach((inp) => {
            protectedValues.add(inp.value);
          });
        });
      }
      function markExisting() {
        document.querySelectorAll(".obat_tr").forEach((tr) => seen.add(tr));
      }
      function fillNew() {
        document.querySelectorAll(".obat_tr").forEach((tr) => {
          const row = tr;
          if (seen.has(row)) return;
          seen.add(row);
          row.querySelectorAll('input[type="datetime-local"]').forEach((inp) => {
            const el = inp;
            if (!protectedValues.has(el.value)) {
              el.value = nowLocal();
            }
            protectedValues.add(el.value);
          });
        });
      }
      setTimeout(() => {
        collectProtected();
        markExisting();
        fillNew();
        const target = document.querySelector("#obattable") || document.body;
        const obs = new MutationObserver(() => fillNew());
        obs.observe(target, { childList: true, subtree: true });
      }, 1500);
    }
    const check = setInterval(function() {
      waited++;
      const $ = window.jQuery || window.$;
      if ($) {
        clearInterval(check);
        patchDelete();
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", setupAutofill);
        } else {
          setupAutofill();
        }
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
  })();
})();
//# sourceMappingURL=igdPukulAutofill.js.map
