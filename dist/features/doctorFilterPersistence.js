'use strict';
var __morbis_feature = (() => {
  function s() {
    return window;
  }
  var n = s(),
    c = {
      pelaksanaanOperasi: {
        urlPattern: 'admisi/pelaksanaan-operasi',
        storageKey: 'doctor_operasi_filter',
        fields: ['awal', 'akhir', 'noreg', 'norm', 'nama'],
        saveButtonSelectors: ['input[value="Display"]', '.tombol[value="Display"]'],
        clearButtonSelectors: ['input[value="Cancel"]', '.tombol[value="Cancel"]'],
      },
      pelaksanaanRawatJalan: {
        urlPattern: 'admisi/pelaksanaan_pelayanan',
        storageKey: 'doctor_rawat_jalan_filter',
        fields: [
          'date-start',
          'date-end',
          'norm',
          'nama_pasien',
          'noreg',
          'dokter',
          'id_dokter',
          'poli_unit',
          'shift',
        ],
        saveButtonSelectors: ['#search', 'button#search', '.btn-success'],
        clearButtonSelectors: ['#reset', 'button#reset', '.btn-trans'],
      },
      pelaksanaanRawatInap: {
        urlPattern: 'admisi/detail-rawat-inap',
        excludePattern: 'tambah-resume-ri',
        storageKey: 'doctor_rawat_inap_filter',
        fields: [
          'tgl1',
          'tgl2',
          'noRm',
          'pasien',
          'noReg',
          'dokter_rs',
          'id_unit',
          'status_kunjungan',
        ],
        saveButtonSelectors: ['#search', 'input[value="Cari"]', '.tombol[value="Cari"]'],
        clearButtonSelectors: [
          '.tombol[value="Reset"]',
          'input[value="Reset"]',
          'button[onclick*="btnOnResetFormSearch"]',
        ],
      },
    };
  function i() {
    let t = window.location.pathname;
    for (let [, r] of Object.entries(c)) {
      let e = '/' + r.urlPattern;
      if (!(t !== e && t !== e + '/')) return r;
    }
    return null;
  }
  function u() {
    let t = i();
    if (!t) return;
    let r = {};
    (t.fields.forEach(function (e) {
      let o = document.getElementById(e);
      o && (r[e] = o.value);
    }),
      n.CookieFilterStorage.set(t.storageKey, r),
      console.log('Doctor filter state saved (' + t.urlPattern + '):', r));
  }
  function g() {
    let t = i();
    if (!t) return;
    let r = n.CookieFilterStorage.get(t.storageKey);
    if (r)
      try {
        (t.fields.forEach(function (e) {
          let o = document.getElementById(e);
          o &&
            r[e] !== void 0 &&
            ((o.value = r[e]),
            o.dispatchEvent(new Event('input', { bubbles: !0 })),
            o.dispatchEvent(new Event('change', { bubbles: !0 })),
            o.dispatchEvent(new KeyboardEvent('keyup', { bubbles: !0 })),
            (e === 'awal' ||
              e === 'akhir' ||
              e === 'date-start' ||
              e === 'date-end' ||
              e === 'tgl1' ||
              e === 'tgl2') &&
              setTimeout(() => {
                o.dispatchEvent(new Event('blur', { bubbles: !0 }));
              }, 100));
        }),
          console.log('Doctor filter state restored (' + t.urlPattern + '):', r));
      } catch (e) {
        console.error('[Doctor Filter Persistence] Failed to restore filter state:', e);
      }
  }
  function d() {
    let t = i();
    t &&
      (n.CookieFilterStorage.remove(t.storageKey),
      t.fields.forEach(function (r) {
        let e = document.getElementById(r);
        e && (e.value = '');
      }),
      console.log('Doctor filter state cleared (' + t.urlPattern + ').'));
  }
  function l() {
    let t = i();
    if (t) {
      for (let r of t.saveButtonSelectors) {
        let e = document.querySelectorAll(r);
        for (let o of Array.from(e)) {
          let a = o;
          o &&
            !a.dataset.filterBound &&
            ((a.dataset.filterBound = 'true'),
            o.addEventListener('click', u),
            console.log('Attached save listener to button:', r));
        }
      }
      for (let r of t.clearButtonSelectors) {
        let e = document.querySelectorAll(r);
        for (let o of Array.from(e)) {
          let a = o;
          o &&
            !a.dataset.filterBound &&
            ((a.dataset.filterBound = 'true'),
            o.addEventListener('click', d),
            console.log('Attached clear listener to button:', r));
        }
      }
    }
  }
  function f() {
    if (
      !n.currentConfig?.features?.doctorFilterPersistence?.enabled ||
      !n.ExtensionCore.isFeatureAllowed('doctorFilterPersistence') ||
      !i()
    )
      return;
    console.log('Running Doctor Filter Persistence State feature');
    let t = c;
    for (let e in t)
      n.CookieFilterStorage.migrateFromLocalStorage(t[e].storageKey, t[e].storageKey);
    (n.setupFilterLogoutWatcher(),
      n.initClearAllFilterButton(),
      g(),
      l(),
      new MutationObserver((e) => {
        let o = !1;
        for (let a of e)
          if (a.type === 'childList' && a.addedNodes.length > 0) {
            o = !0;
            break;
          }
        o && l();
      }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  typeof n.featureModules < 'u'
    ? (n.featureModules.doctorFilterPersistence = {
        id: 'doctorFilterPersistence',
        name: 'Doctor Filter Persistence State',
        description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
        match: {
          oneOf: [
            { pathname: '/admisi/pelaksanaan_pelayanan' },
            { pathname: '/admisi/pelaksanaan-operasi' },
            { pathname: '/admisi/detail-rawat-inap' },
          ],
        },
        run: f,
      })
    : console.warn(
        '[Doctor Filter Persistence] featureModules not defined, module registration skipped',
      );
})();
