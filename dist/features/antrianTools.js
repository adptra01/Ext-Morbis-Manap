"use strict";
var __morbis_feature = (() => {
  // src/features/antrianTools.ts
  (function() {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function() {
      waited++;
      const enabled = document.documentElement.getAttribute("data-ext-antrian-tools");
      if (enabled !== null) {
        clearInterval(check);
        if (enabled !== "1") return;
        init();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function init() {
      const path = window.location.pathname;
      console.log("[AntrianTools] Init on:", path);
      if (path.includes("/mesin-antrian")) {
        console.log("[AntrianTools] Running mesin-antrian mode");
        simplifyMesinAntrian();
      } else if (path.includes("/counter-antrian/view-antrian")) {
        console.log("[AntrianTools] Running view-antrian mode");
        simplifyViewAntrian();
      } else if (path.includes("/counter-antrian/counter")) {
        console.log("[AntrianTools] Running counter mode");
        fixCounter();
      }
    }
    function simplifyMesinAntrian() {
      const style = document.createElement("style");
      style.id = "ext-antrian-css";
      style.textContent = [
        ".card1.row > div:nth-child(n+2) { display: none !important; }",
        ".card1.row > div:first-child { width: 100% !important; max-width: 600px; margin: 0 auto; }"
      ].join("\n");
      document.head.appendChild(style);
      setTimeout(function() {
        const h3 = document.querySelector(".card1 .card-body h3");
        if (h3) {
          h3.textContent = "ANTRIAN RUMAH SAKIT RSUD ABDUL MANAP";
          h3.style.fontSize = "22px";
        }
        const card = document.querySelector(".card1 .card");
        if (card) {
          card.style.background = "#00A65A";
        }
      }, 300);
    }
    function simplifyViewAntrian() {
      var s = document.createElement("style");
      s.id = "ext-antrian-view-css";
      s.textContent = [
        '#isi-val .card, #isi-val [class*="card"] { width: 100% !important; max-width: 100% !important; }',
        '#isi-val [class*="col-"] { width: 100% !important; max-width: 100% !important; flex: 0 0 100% !important; }',
        '#isi-val .container, #isi-val [class*="container"] { max-width: 100% !important; padding: 10px !important; }'
      ].join("\n");
      document.head.appendChild(s);
      var target = document.getElementById("isi-val");
      if (!target) {
        console.log("[AntrianTools] #isi-val not found on view-antrian page");
        return;
      }
      console.log("[AntrianTools] View-antrian: #isi-val found, setting up observer");
      function hideExtraSliders() {
        console.log("[AntrianTools] Hiding extra sliders...");
        for (var i = 2; i <= 10; i++) {
          var slider = document.getElementById("slider" + i);
          if (slider) {
            console.log("[AntrianTools] Hiding #slider" + i);
            slider.style.display = "none";
          }
        }
        var slider1 = document.getElementById("slider1");
        if (slider1) slider1.style.display = "block";
        var allCards = target.querySelectorAll('.card, [class*="card"]');
        console.log("[AntrianTools] Cards found in content:", allCards.length);
        if (allCards.length > 1) {
          for (var j = 1; j < allCards.length; j++) {
            allCards[j].style.display = "none";
          }
        }
        if (allCards.length >= 1) {
          var firstCard = allCards[0];
          firstCard.style.width = "100%";
          firstCard.style.maxWidth = "100%";
          var parent = firstCard.parentElement;
          if (parent) {
            parent.querySelectorAll('[class*="col-"]').forEach(function(col) {
              col.style.width = "100%";
              col.style.maxWidth = "100%";
              col.style.flex = "0 0 100%";
            });
          }
        }
        var queueNames = target.querySelectorAll(".nama-antrian, .judul, h3");
        for (var k = 0; k < queueNames.length; k++) {
          var el = queueNames[k];
          if (el.textContent && el.textContent.trim()) {
            console.log("[AntrianTools] Renaming queue:", el.textContent.trim());
            el.textContent = "ANTRIAN PASIEN RSUD ABDUL MANAP";
          }
        }
      }
      hideExtraSliders();
      var observer = new MutationObserver(function() {
        setTimeout(hideExtraSliders, 800);
      });
      observer.observe(target, { childList: true, subtree: true });
      for (var r = 1; r <= 6; r++) {
        setTimeout(hideExtraSliders, r * 3e3);
      }
    }
    function fixCounter() {
      console.log("[AntrianTools] Counter page detected, waiting for content...");
      injectStyle();
      var poll = setInterval(function() {
        var resetBtn = document.querySelector('button[onclick*="reset_antrian"], .tombol');
        if (resetBtn) {
          console.log("[AntrianTools] Reset button found, applying fixes");
          clearInterval(poll);
          fixResetButton(resetBtn);
        }
      }, 300);
      setTimeout(function() {
        clearInterval(poll);
      }, 2e4);
      pollCounterSimplify(5);
    }
    function pollCounterSimplify(retries) {
      if (retries <= 0) return;
      setTimeout(function() {
        var container = document.querySelector('#isi, [class*="card"], [class*="antrian"]');
        if (container) {
          var cards = container.querySelectorAll('.card, [class*="card-body"]');
          if (cards.length > 1) {
            console.log("[AntrianTools] Simplifying counter UI, cards:", cards.length);
            for (var i = 1; i < cards.length; i++) {
              cards[i].style.display = "none";
            }
            cards[0].style.maxWidth = "600px";
            cards[0].style.margin = "0 auto";
          }
        } else {
          pollCounterSimplify(retries - 1);
        }
      }, 1e3);
    }
    function injectStyle() {
      if (document.getElementById("ext-antrian-counter-css")) return;
      var s = document.createElement("style");
      s.id = "ext-antrian-counter-css";
      s.textContent = ".ext-counter-fixed{width:100%!important;max-width:600px;margin:0 auto}";
      document.head.appendChild(s);
    }
    function fixResetButton(resetBtn) {
      resetBtn.onclick = function(e) {
        e.preventDefault();
        var w = window;
        var swal = typeof w.swal === "function" ? w.swal : null;
        var doReset = function() {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", "control-call", true);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          if (swal) {
            swal({ title: "Memproses Reset...", text: "Mengosongkan semua antrian", icon: "info", buttons: false, closeOnClickOutside: false });
          }
          xhr.onload = function() {
            try {
              var data = JSON.parse(xhr.responseText);
              if (data.status === 200) {
                if (swal) {
                  swal({ title: "Reset Berhasil", text: "Antrian dikosongkan. Memuat ulang...", icon: "success", timer: 2e3 });
                }
                setTimeout(function() {
                  window.location.reload();
                }, 2e3);
              } else {
                if (swal) {
                  swal({ title: "Reset Gagal", text: "Status: " + (data.status || "unknown"), icon: "error" });
                }
              }
            } catch (_e) {
              if (swal) {
                swal({ title: "Reset Gagal", text: "Response tidak valid dari server", icon: "error" });
              }
            }
          };
          xhr.onerror = function() {
            var msg = "Gagal menghubungi server (HTTP " + xhr.status + ")";
            if (xhr.status === 500) msg = "Server error - hubungi administrator IT";
            if (swal) {
              swal({ title: "Reset Gagal", text: msg, icon: "error" });
            }
          };
          xhr.send("type=reset_antrian");
        };
        if (swal) {
          swal({
            title: "Reset Semua Antrian?",
            text: "Semua nomor antrian hari ini akan dihapus.",
            icon: "warning",
            buttons: ["Batal", "Ya, Reset"],
            dangerMode: true,
            closeOnClickOutside: false
          }).then(function(yes) {
            if (yes) doReset();
          });
        } else if (confirm("Reset semua antrian hari ini?")) {
          doReset();
        }
      };
    }
  })();
})();
//# sourceMappingURL=antrianTools.js.map
