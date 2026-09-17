'use strict';
var __morbis_feature = (() => {
  // src/features/labPermintaanBridge.ts
  (function () {
    const ACTIONS = [
      { fn: 'edit_pengajuan', storeKey: 'lab_permintaan' },
      { fn: 'edit_tgl_pengajuan', storeKey: 'lab_tgl_pengajuan' },
      { fn: 'cetak', storeKey: 'lab_cetak' },
      { fn: 'cetak_form_permintaan_lab', storeKey: 'lab_cetak_form' },
      { fn: 'edit_form_permintaan_lab', storeKey: 'lab_edit_form' },
    ];
    function patternOf(fn) {
      return new RegExp(`^\\s*${fn}\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)`);
    }
    function normalizeOnclick(raw) {
      return raw.replace(/\s*;\s*$/, '').trim();
    }
    function extractAll() {
      const found = /* @__PURE__ */ new Map();
      for (const { fn, storeKey } of ACTIONS) {
        const els = document.querySelectorAll(`[onclick*="${fn}("]`);
        for (const el of els) {
          const raw = el.getAttribute('onclick');
          if (!raw) continue;
          const m = raw.match(patternOf(fn));
          if (!m) continue;
          const [, id_lab, id_visit, id_permintaan] = m;
          const entry = found.get(id_lab) ?? { id_visit, id_permintaan, actions: {} };
          entry.actions[fn] = normalizeOnclick(raw.replace(/\(event\)/g, ''));
          found.set(id_lab, entry);
          localStorage.setItem(`${storeKey}_${id_lab}`, id_permintaan);
          localStorage.setItem(`lab_visit_${id_lab}`, id_visit);
        }
      }
      for (const [id_lab, entry] of found) {
        localStorage.setItem(
          `lab_data_${id_lab}`,
          JSON.stringify({
            id_visit: entry.id_visit,
            id_permintaan: entry.id_permintaan,
            actions: entry.actions,
          }),
        );
        if (entry.actions.edit_pengajuan) {
          localStorage.setItem(`lab_permintaan_${id_lab}`, entry.id_permintaan);
        }
      }
      console.log(`[labBridge] Stored ${found.size} lab rows (${document.title})`);
    }
    function runAutoPilot() {
      const hashMatch = window.location.hash.match(/ext-lab-action=([A-Za-z_]+)/);
      const fn = hashMatch?.[1];
      if (!fn) return;
      const idLabFromQuery = new URLSearchParams(window.location.search).get('id_lab');
      const findTarget = (idLab) => {
        if (idLab) {
          const byLab = document.querySelector(`[onclick*="${fn}(${idLab},"]`);
          if (byLab) return byLab;
        }
        return document.querySelector(`[onclick*="${fn}("]`);
      };
      const target = findTarget(idLabFromQuery);
      if (!target) {
        console.warn(`[labBridge] Auto-pilot: no target for ${fn}(...)`);
        return;
      }
      console.log(`[labBridge] Auto-pilot: executing ${fn} ${target.getAttribute('onclick')}`);
      target.click();
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    function boot() {
      extractAll();
      runAutoPilot();
    }
    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', boot);
  })();
})();
//# sourceMappingURL=labPermintaanBridge.js.map
