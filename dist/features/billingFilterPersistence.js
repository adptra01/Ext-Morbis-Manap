'use strict';
var __morbis_feature = (() => {
  function l() {
    return window;
  }
  var i = l(),
    n = {
      targetUrlPattern: 'billing/pembayaran-new/billing-verifikasi',
      storageKey: 'billing_verifikasi_filter',
      fields: [
        'awal',
        'akhir',
        'noreg',
        'no_Rm',
        'pasien',
        'sep',
        'status',
        'jenisPasien',
        'statusPeriksa',
        'dokter',
        'idDokter',
        'unit',
        'idUnit',
        'kategori',
      ],
      radioGroups: ['statuspasien'],
      cariButtonSelectors: [
        '#cari',
        'input[value="Cari"]',
        'button.btn-info[onclick*="cari"]',
        'input.tombol[value="Cari"]',
      ],
      batalButtonSelectors: ['input[value="Cancel"]', 'input.tombol[value="Cancel"]'],
    };
  function a() {
    return window.location.href.includes(n.targetUrlPattern);
  }
  function u() {
    let r = {};
    (n.fields.forEach(function (e) {
      let t = document.getElementById(e);
      t && (r[e] = t.value);
    }),
      n.radioGroups.forEach(function (e) {
        let t = document.querySelector(`input[name="${e}"]:checked`);
        t && (r[e] = t.value);
      }),
      i.CookieFilterStorage.set(n.storageKey, r),
      console.log('Billing filter state saved:', r));
  }
  function c() {
    let r = i.CookieFilterStorage.get(n.storageKey);
    if (r)
      try {
        (n.fields.forEach(function (e) {
          let t = document.getElementById(e);
          t &&
            r[e] !== void 0 &&
            ((t.value = r[e]),
            t.dispatchEvent(new Event('input', { bubbles: !0 })),
            t.dispatchEvent(new Event('change', { bubbles: !0 })),
            t.dispatchEvent(new KeyboardEvent('keyup', { bubbles: !0 })),
            (e === 'awal' || e === 'akhir') &&
              setTimeout(() => {
                t.dispatchEvent(new Event('blur', { bubbles: !0 }));
              }, 100));
        }),
          n.radioGroups.forEach(function (e) {
            if (r[e] !== void 0) {
              let t = document.querySelector(`input[name="${e}"][value="${r[e]}"]`);
              t && ((t.checked = !0), t.dispatchEvent(new Event('change', { bubbles: !0 })));
            }
          }),
          console.log('Billing filter state restored:', r));
      } catch (e) {
        console.error('[Billing Filter Persistence] Failed to restore filter state:', e);
      }
  }
  function g() {
    (i.CookieFilterStorage.remove(n.storageKey),
      n.fields.forEach(function (r) {
        let e = document.getElementById(r);
        e && (e.value = '');
      }),
      n.radioGroups.forEach(function (r) {
        let e = document.querySelector(`input[name="${r}"]`);
        e && (e.checked = !0);
      }),
      console.log('Billing filter state cleared.'));
  }
  function s() {
    for (let r of n.cariButtonSelectors) {
      let e = document.querySelectorAll(r);
      for (let t of Array.from(e)) {
        let o = t;
        t &&
          !o.dataset.filterBound &&
          ((o.dataset.filterBound = 'true'),
          t.addEventListener('click', u),
          console.log('Attached save listener to Cari button'));
      }
    }
    for (let r of n.batalButtonSelectors) {
      let e = document.querySelectorAll(r);
      for (let t of Array.from(e)) {
        let o = t;
        t &&
          !o.dataset.filterBound &&
          ((o.dataset.filterBound = 'true'),
          t.addEventListener('click', g),
          console.log('Attached clear listener to Batal button'));
      }
    }
  }
  function d() {
    if (
      !i.currentConfig?.features?.billingFilterPersistence?.enabled ||
      !i.ExtensionCore.isFeatureAllowed('billingFilterPersistence') ||
      !a()
    )
      return;
    (console.log('Running Billing Filter Persistence State feature'),
      i.CookieFilterStorage.migrateFromLocalStorage(n.storageKey, n.storageKey),
      i.setupFilterLogoutWatcher(),
      i.initClearAllFilterButton(),
      c(),
      s(),
      new MutationObserver((e) => {
        let t = !1;
        for (let o of e)
          if (o.type === 'childList' && o.addedNodes.length > 0) {
            t = !0;
            break;
          }
        t && s();
      }).observe(document.body, { childList: !0, subtree: !0 }));
  }
  typeof i.featureModules < 'u'
    ? (i.featureModules.billingFilterPersistence = {
        id: 'billingFilterPersistence',
        name: 'Billing Filter Persistence State',
        description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
        match: { pathname: '/billing/pembayaran-new/billing-verifikasi' },
        run: d,
      })
    : console.warn(
        '[Billing Filter Persistence] featureModules not defined, module registration skipped',
      );
})();
