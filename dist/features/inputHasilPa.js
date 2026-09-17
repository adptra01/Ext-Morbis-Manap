'use strict';
var __morbis_feature = (() => {
  // src/features/inputHasilPa.ts
  (function () {
    const ACTIONS = [
      {
        label: 'Edit Tanggal Pengajuan',
        fn: 'edit_tgl_pengajuan',
        storeKey: 'lab_tgl_pengajuan',
        urlPath: '/admisi/pelaksanaan_pelayanan/laboratorium-data',
      },
      {
        label: 'Cetak',
        fn: 'cetak',
        storeKey: 'lab_cetak',
        urlPath: '/admisi/pelaksanaan_pelayanan/laboratorium-data',
      },
      {
        label: 'Cetak Form Permintaan Lab',
        fn: 'cetak_form_permintaan_lab',
        storeKey: 'lab_cetak_form',
        urlPath: '/admisi/pelaksanaan_pelayanan/laboratorium-data',
      },
      {
        label: 'Edit Form Permintaan Lab',
        fn: 'edit_form_permintaan_lab',
        storeKey: 'lab_edit_form',
        urlPath: '/admisi/pelaksanaan_pelayanan/laboratorium-data',
      },
    ];
    const LIST_BASES = [
      '/admisi/pelaksanaan_pelayanan/riwayat-penunjang-medis-v2',
      '/admisi/pelaksanaan_pelayanan/laboratorium-data',
    ];
    let injectedLab = null;
    function getLabId() {
      const urlLab = new URLSearchParams(window.location.search).get('id_lab');
      if (urlLab) return urlLab;
      try {
        const keys = Object.keys(localStorage);
        const labKey = keys.find((k) => k.startsWith('lab_permintaan_'));
        if (labKey) return labKey.replace('lab_permintaan_', '');
      } catch {}
      return null;
    }
    function readStored(idLab) {
      try {
        const visit = localStorage.getItem(`lab_visit_${idLab}`);
        const permintaan = localStorage.getItem(`lab_permintaan_${idLab}`);
        if (visit && permintaan) return { visit, permintaan };
      } catch {}
      return null;
    }
    function parsePage(doc, idLab) {
      const map = /* @__PURE__ */ new Map();
      let visit = '';
      for (const el of Array.from(doc.querySelectorAll('[onclick]'))) {
        const oc = el.getAttribute('onclick') || '';
        for (const { fn } of ACTIONS) {
          const m = oc.match(new RegExp(`${fn}\\(${idLab},\\s*(\\d+),\\s*(\\d+)\\)`));
          if (m) {
            map.set(fn, m[2]);
            if (!visit) visit = m[1];
          }
        }
      }
      return map.size && visit ? { map, visit } : null;
    }
    async function fetchActions(idLab, idVisit) {
      for (const base of LIST_BASES) {
        for (let page = 1; page <= 25; page++) {
          let html = '';
          try {
            const url = `${location.origin}${base}?id_visit=${idVisit}&page=${page}&status_periksa=belum`;
            const res = await fetch(url, { credentials: 'same-origin' });
            if (!res.ok) continue;
            html = await res.text();
          } catch {
            break;
          }
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const found = parsePage(doc, idLab);
          if (found) {
            try {
              localStorage.setItem(`lab_visit_${idLab}`, found.visit);
              let permintaanFallback = '';
              for (const { fn, storeKey } of ACTIONS) {
                const perm = found.map.get(fn);
                if (perm) {
                  localStorage.setItem(`${storeKey}_${idLab}`, perm);
                  if (!permintaanFallback) permintaanFallback = perm;
                }
              }
              if (permintaanFallback)
                localStorage.setItem(`lab_permintaan_${idLab}`, permintaanFallback);
            } catch {}
            return found;
          }
          if (!doc.querySelector('[onclick*="_pengajuan"], [onclick*="cetak"]')) break;
        }
      }
      return null;
    }
    function renderActions(anchor, idLab, visit, map) {
      const old = anchor.parentElement?.querySelector('[data-ext-lab-actions]');
      if (old) old.remove();
      const container = document.createElement('div');
      container.dataset.extLabActions = 'true';
      container.style.cssText = 'display:flex;gap:6px;margin:8px 0;flex-wrap:wrap;';
      for (const { label, fn, storeKey, urlPath } of ACTIONS) {
        let perm = map.get(fn) ?? '';
        if (!perm) {
          try {
            perm = localStorage.getItem(`${storeKey}_${idLab}`) ?? '';
          } catch {}
        }
        const searchParams = new URLSearchParams({ id_lab: idLab, id_visit: visit });
        if (perm) searchParams.set('id_permintaan', perm);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.style.cssText =
          'padding:4px 10px;border:1px solid #2563eb;border-radius:6px;font-size:11px;font-weight:600;background:#2563eb;color:#fff;cursor:pointer;transition:all .15s;';
        if (!perm) {
          btn.style.opacity = '0.55';
          btn.style.cursor = 'not-allowed';
          btn.title = 'Data aksi belum ditemukan \u2014 buka halaman riwayat penunjang medis dulu';
          btn.addEventListener('click', () => {
            alert(
              'Data permintaan belum tersimpan. Silakan buka halaman riwayat penunjang medis / laboratorium-data terlebih dahulu.',
            );
          });
        } else {
          btn.addEventListener('click', () => {
            const hash = `#ext-lab-action=${fn}`;
            window.open(`${location.origin}${urlPath}?${searchParams.toString()}${hash}`, '_blank');
          });
        }
        container.appendChild(btn);
      }
      anchor.after(container);
    }
    async function injectUi() {
      if (!document.documentElement.getAttribute('data-ext-lab-history')) return;
      const idLab = getLabId();
      if (!idLab) return;
      const idVisitInput = document.querySelector('input[name="id_visit"]');
      const id_visit = idVisitInput?.value.trim() || '';
      if (!id_visit && !readStored(idLab)) return;
      const fieldset = Array.from(document.querySelectorAll('fieldset')).find((fs) =>
        fs.textContent?.includes('Data Pasien'),
      );
      if (!fieldset) return;
      if (injectedLab === idLab) return;
      injectedLab = idLab;
      const old = fieldset.querySelector('[data-ext-lab-history]');
      if (old) old.remove();
      const origin = window.location.origin;
      const historyBtn = document.createElement('ext-btn');
      historyBtn.dataset.extLabHistory = 'true';
      historyBtn.setAttribute('variant', 'primary');
      historyBtn.setAttribute('size', 'sm');
      historyBtn.textContent = 'Lihat Riwayat Permintaan Lab';
      historyBtn.style.margin = '8px 0';
      historyBtn.addEventListener('click', () => {
        if (id_visit)
          window.open(
            `${origin}/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=${id_visit}&status_periksa=belum`,
            '_blank',
          );
      });
      const legend = fieldset.querySelector('legend');
      if (legend) legend.after(historyBtn);
      else fieldset.prepend(historyBtn);
      const cached = readStored(idLab);
      if (cached) {
        renderActions(historyBtn, idLab, cached.visit, /* @__PURE__ */ new Map());
        return;
      }
      if (!id_visit) return;
      const loading = document.createElement('div');
      loading.dataset.extLabActions = 'true';
      loading.textContent = 'Memuat aksi lab\u2026';
      loading.style.cssText = 'margin:6px 0;font-size:12px;color:#64748b;';
      historyBtn.after(loading);
      const found = await fetchActions(idLab, id_visit);
      loading.remove();
      if (found) renderActions(historyBtn, idLab, found.visit, found.map);
      else {
        const err = document.createElement('div');
        err.dataset.extLabActions = 'true';
        err.textContent =
          'Aksi lab tidak ditemukan untuk id_lab ini (coba buka halaman riwayat penunjang medis).';
        err.style.cssText = 'margin:6px 0;font-size:12px;color:#dc2626;';
        historyBtn.after(err);
      }
    }
    const start = performance.now();
    (function poll() {
      if (document.documentElement.getAttribute('data-ext-lab-history')) {
        injectUi();
      } else if (performance.now() - start < 5e3) {
        setTimeout(poll, 200);
      }
    })();
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      origPushState.apply(this, args);
      setTimeout(injectUi, 100);
    };
    window.addEventListener('popstate', () => setTimeout(injectUi, 100));
  })();
})();
//# sourceMappingURL=inputHasilPa.js.map
