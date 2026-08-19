'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
    } catch {}
    return FARMASI_APP_BASE;
  }
  async function pushQueueEvent(p) {
    try {
      const res = await fetch(farmasiAppBase() + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      return !!j.ok;
    } catch (e) {
      console.warn('[MORBIS Ext] queue sync gagal:', e.message);
      return false;
    }
  }

  // src/features/antrianFarmasiOperator.ts
  var lastState = '';
  var POLL_MS = 5e3;
  function log(...args) {
    console.log('[MORBIS Ext] operator:', ...args);
  }
  function hideNative() {
    const isi = document.getElementById('isi');
    if (!isi) return;
    isi.style.display = 'none';
    const header = document.querySelector('h1, h2, .page-header, .card-header');
    if (header && !header.hasAttribute('data-ext-op-hidden')) {
      header.setAttribute('data-ext-op-hidden', '1');
      header.style.display = 'none';
    }
  }
  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'ext-farmasi-operator';
    p.style.cssText =
      'padding:16px;max-width:1100px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;background:#f8f9fa;min-height:90vh;box-sizing:border-box;';
    p.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;"><b style="font-size:18px;color:#0f5132;">Antrian Farmasi \u2014 Operasional</b><div style="display:flex;gap:8px;align-items:center;"><span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat\u2026</span><button id="ext-op-refresh" style="padding:6px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button></div></div><div id="ext-op-current" style="margin-bottom:14px;"></div><div id="ext-op-waiting"></div>';
    return p;
  }
  function callBtn(ev, label, num, eventId) {
    return (
      '<button class="ext-op-act" data-ev="' +
      ev +
      '" data-num="' +
      num +
      '" data-eid="' +
      eventId +
      '" style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;font-weight:600;' +
      (ev === 'CALL'
        ? 'background:#0f5132;color:#fff;'
        : 'background:#e9ecef;color:#212529;border:1px solid #ced4da;') +
      '">' +
      label +
      '</button>'
    );
  }
  function rowCard(r, prefix) {
    const jenis = r.jenis
      ? `<span style="color:#6c757d;font-size:12px;"> \xB7 ${r.jenis}</span>`
      : '';
    const shift = r.shift
      ? `<span style="color:#6c757d;font-size:12px;"> \xB7 Shift ${r.shift}</span>`
      : '';
    return (
      '<div class="ext-op-row" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:8px;gap:10px;"><div><b style="font-size:16px;">' +
      r.queue_number +
      '</b><div style="color:#495057;">' +
      (r.nama_pasien || '-') +
      jenis +
      shift +
      '</div><div style="color:#adb5bd;font-size:11px;">resep ' +
      (r.resep_id || '-') +
      (r.norm ? ' \xB7 RM ' + r.norm : '') +
      '</div></div><div style="flex-shrink:0;">' +
      callBtn('CALL', '\u{1F4E2} Panggil', r.queue_number, prefix + '-call-' + r.queue_number) +
      '</div></div>'
    );
  }
  async function render() {
    const st = document.getElementById('ext-op-status');
    try {
      const res = await fetch(farmasiAppBase() + '/api/queue/display?limit=50', {
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const d = await res.json();
      const key = JSON.stringify({ c: d.current, w: d.waiting });
      if (key !== lastState) {
        lastState = key;
        const cur = document.getElementById('ext-op-current');
        const wait = document.getElementById('ext-op-waiting');
        if (cur && wait) {
          cur.innerHTML = d.current.length
            ? d.current
                .map(
                  (r) =>
                    '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#0f5132;color:#fff;border-radius:12px;margin-bottom:10px;gap:10px;"><div><div style="font-size:12px;opacity:.8;">Sedang dipanggil \xB7 ' +
                    (r.counter?.name || 'LOKET') +
                    '</div><b style="font-size:26px;">' +
                    r.queue_number +
                    '</b></div><div style="text-align:right;color:#fff;">' +
                    (r.nama_pasien || '-') +
                    '<div style="opacity:.8;font-size:12px;">' +
                    (r.jenis || '') +
                    '</div></div><div style="flex-shrink:0;">' +
                    callBtn('DONE', '\u2714 Selesai', r.queue_number, 'op-done-' + r.queue_number) +
                    '</div></div>',
                )
                .join('')
            : '<div style="padding:12px 16px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Belum ada panggilan aktif</div>';
          wait.innerHTML =
            '<div style="font-size:13px;color:#6c757d;margin-bottom:8px;">Menunggu \u2014 ' +
            d.waiting.length +
            ' pasien</div>' +
            (d.waiting.length
              ? d.waiting.map((r) => rowCard(r, 'op-enq')).join('')
              : '<div style="padding:12px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Tidak ada antrian menunggu</div>');
        }
      }
      if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
    } catch (e) {
      if (st) st.textContent = 'gagal hubungi app \u2014 cek CORS/BASE';
      log('display gagal:', e.message);
    }
  }
  async function act(ev, num, eid) {
    const ok = await pushQueueEvent({
      event_id: eid + '-' + Date.now().toString(36),
      queue_number: num,
      event: ev,
    });
    log(ev, num, ok ? 'OK' : 'gagal');
    if (ok) await render();
  }
  function init() {
    const start = () => {
      if (!document.getElementById('isi')) return;
      hideNative();
      if (document.getElementById('ext-farmasi-operator')) return;
      const panel = buildPanel();
      (document.getElementById('isi')?.parentElement || document.body).appendChild(panel);
      panel.addEventListener('click', (e) => {
        const btn = e.target.closest('.ext-op-act');
        if (!btn) return;
        void act(
          btn.getAttribute('data-ev') || '',
          btn.getAttribute('data-num') || '',
          btn.getAttribute('data-eid') || '',
        );
      });
      document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
      void render();
      window.setInterval(() => void render(), POLL_MS);
      log('panel operator aktif');
    };
    start();
    new MutationObserver(() => {
      hideNative();
      if (!document.getElementById('ext-farmasi-operator')) start();
    }).observe(document.body, { childList: true, subtree: true });
  }
  init();
})();
//# sourceMappingURL=antrianFarmasiOperator.js.map
