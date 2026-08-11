(function () {
  if (!window.location.pathname.includes('laporan-kasir')) return;

  (function pollFlag() {
    const flag = document.documentElement.getAttribute('data-ext-laporan-kasir-time');
    if (flag !== '1') return; // gate ketat: extension disabled / role tak sesuai → tidak jalan
    run();
  })();

  function run() {
    const pad = (n: number) => (n < 10 ? '0' : '') + n;
    const f = (d: Date) => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
    const now = new Date();
    const today = f(now);
    const yst = new Date(now);
    yst.setDate(yst.getDate() - 1);
    const yesterday = f(yst);
    const noon = '12:00:00';

    function setTime() {
      const a = document.getElementById('awal') as HTMLInputElement | null;
      const b = document.getElementById('akhir') as HTMLInputElement | null;
      if (a) a.value = yesterday + ' ' + noon;
      if (b) b.value = today + ' ' + noon;
    }
    setTime();

    function patchFn(name: string) {
      const w = window as any;
      if (typeof w[name] !== 'function') return false;
      const orig = w[name];
      w[name] = function (...args: unknown[]) {
        setTime();
        return orig.apply(this, args);
      };
      return true;
    }

    ['loadTabelRiwayat', 'CariData', 'cari'].forEach(function (name) {
      if (!patchFn(name)) {
        let n = 0;
        const h = setInterval(function () {
          n++;
          if (patchFn(name) || n >= 40) clearInterval(h);
        }, 300);
      }
    });

    if (typeof (window as any).contentloader === 'function') {
      const orig = (window as any).contentloader;
      (window as any).contentloader = function (...args: unknown[]) {
        setTime();
        return orig.apply(this, args);
      };
    } else {
      let n = 0;
      const h = setInterval(function () {
        n++;
        if (typeof (window as any).contentloader === 'function') {
          clearInterval(h);
          const orig = (window as any).contentloader;
          (window as any).contentloader = function (...args: unknown[]) {
            setTime();
            return orig.apply(this, args);
          };
        }
        if (n >= 40) clearInterval(h);
      }, 300);
    }

    // Table time display
    const target = document.getElementById('content-riwayat') || document.body;
    const obs = new MutationObserver(function () {
      setTimeout(fixTables, 500);
      setTimeout(fixTables, 2000);
    });
    obs.observe(target, { childList: true, subtree: true });

    function fixTables() {
      const sel =
        '#laporan-pembayaran-tunai,#laporan-pembayaran-non-tunai,#laporan-pembayaran-bri,#laporan-pembayaran-edc';
      document.querySelectorAll(sel).forEach(function (t: any) {
        if (t.dataset.extDone) return;
        t.dataset.extDone = '1';
        const hd = t.querySelector('thead tr');
        if (!hd) return;
        const hcs = hd.querySelectorAll('th,td');
        let si = -1;
        hcs.forEach(function (c: any, i: number) {
          const tx = (c.textContent || '').toLowerCase().trim();
          if (tx === 'shift' || tx === 'pagi/sore') si = i;
        });
        if (si === -1) return;
        t.querySelectorAll('tbody tr').forEach(function (r: any) {
          const sc = r.cells[si];
          if (!sc || sc.dataset.extDone) return;
          sc.dataset.extDone = '1';
          const shift = (sc.textContent || '').trim();
          for (let i = 0; i < r.cells.length; i++) {
            if (i === si) continue;
            const v = (r.cells[i].textContent || '').trim();
            if (/^\d{2}:\d{2}(:\d{2})?$/.test(v)) {
              sc.textContent = shift + ' ' + v;
              return;
            }
          }
          const h = r.querySelector('[data-jam],[data-time],[data-waktu]');
          if (h) {
            const tv =
              h.getAttribute('data-jam') ||
              h.getAttribute('data-time') ||
              h.getAttribute('data-waktu') ||
              '';
            if (tv) sc.textContent = shift + ' ' + tv;
          }
        });
      });
    }

    // Flatpickr
    function loadFlatpickr(cb: () => void) {
      if ((window as any).flatpickr) {
        cb();
        return;
      }
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
      document.head.appendChild(l);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      s.onload = cb;
      document.head.appendChild(s);
    }

    function destroyLegacy() {
      const $ = (window as any).$;
      if ($ && $.fn && $.fn.datepicker) {
        try {
          $('#awal, #akhir').datepicker('destroy');
        } catch {
          /* skip */
        }
      }
    }

    function initFlatpickr() {
      ['awal', 'akhir'].forEach(function (id) {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (!el) return;
        if (el.classList.contains('hasDatepicker')) el.classList.remove('hasDatepicker');
        try {
          (window as any).flatpickr('#' + id, {
            enableTime: true,
            dateFormat: 'd/m/Y H:i:S',
            time_24hr: true,
            defaultDate: el.value || (id === 'awal' ? yesterday + ' ' + noon : today + ' ' + noon),
          });
        } catch (e) {
          console.warn('[LaporanKasirTime] flatpickr err', id, e);
        }
      });
    }

    function applyPicker() {
      destroyLegacy();
      loadFlatpickr(initFlatpickr);
    }

    applyPicker();
    setTimeout(applyPicker, 2000);
    setTimeout(applyPicker, 5000);
  }
})();
