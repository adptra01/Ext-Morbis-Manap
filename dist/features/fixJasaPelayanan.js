"use strict";
var __morbis_feature = (() => {
  // src/features/fixJasaPelayanan.ts
  (function() {
    const MAX_WAIT = 100;
    let waited = 0;
    const check = setInterval(function() {
      waited++;
      const enabled = document.documentElement.getAttribute("data-ext-fix-jasa");
      if (enabled !== null) {
        clearInterval(check);
        if (enabled !== "1") return;
        patchFunction();
      } else if (waited >= MAX_WAIT) {
        clearInterval(check);
      }
    }, 50);
    function patchFunction() {
      const MAX_RETRIES = 50;
      let retries = 0;
      const poll = setInterval(function() {
        retries++;
        const w = window;
        if (typeof w.hitungJsPelayananFeatEmbal === "function") {
          clearInterval(poll);
          const originalFn = w.hitungJsPelayananFeatEmbal;
          w.hitungJsPelayananFeatEmbal = function(...args) {
            const el = document.querySelector("#jasa_pelayanan");
            if (!el) {
              originalFn.apply(this, args);
              return;
            }
            const valBefore = el.value;
            try {
              originalFn.apply(this, args);
            } finally {
              if (parseFloat(el.value) === 0 && parseFloat(valBefore) > 0) {
                el.value = valBefore;
              }
            }
          };
        } else if (retries >= MAX_RETRIES) {
          clearInterval(poll);
        }
      }, 200);
    }
  })();
})();
//# sourceMappingURL=fixJasaPelayanan.js.map
