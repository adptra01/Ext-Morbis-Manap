'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  var cachedBase = null;
  var basePromise = null;
  var BASE_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function farmasiAppBase() {
    try {
      const ov = localStorage.getItem('ext-farmasi-app-base');
      if (ov && /^https?:\/\//.test(ov)) {
        const b = ov.replace(/\/+$/, '');
        if (cachedBase !== b) {
          cachedBase = b;
          basePromise = null;
        }
        return b;
      }
    } catch {}
    if (cachedBase) return cachedBase;
    return FARMASI_APP_BASE;
  }
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem('ext-farmasi-app-base');
        if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
      } catch {}
      for (const base of BASE_CANDIDATES) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 2500);
          const res = await fetch(base + '/api/queue/lookup?resep_id=probe', {
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
          });
          clearTimeout(t);
          if (res.status === 200 || res.status === 422) {
            cachedBase = base;
            return base;
          }
        } catch {}
      }
      return FARMASI_APP_BASE;
    })();
    return basePromise;
  }
  async function pushQueueEvent(p) {
    try {
      const body = { ...p };
      if (p.event === 'ENQUEUE') delete body.queue_number;
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + '/api/queue/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      return { ok: !!j.ok, queue_number: j.queue?.queue_number };
    } catch (e) {
      console.warn('[MORBIS Ext] queue sync gagal:', e.message);
      return { ok: false };
    }
  }

  // src/features/shared/printKartu.ts
  function printKartuAntrian(data) {
    const win = window.open('', '_blank', 'width=400,height=560');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return false;
    }
    const jenisLine =
      data.jenis || data.unit
        ? `<div style="font-size:16px;margin-top:2px;">${[data.jenis, data.unit].filter(Boolean).join(' \xB7 ')}</div>`
        : '';
    win.document.write(
      `<html><head><title>Antrian Farmasi</title></head><body style="width:320px;padding-top:10px;font-family:Arial,Helvetica,sans-serif;text-align:center;"><div style="font-size:16px;font-weight:bold;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:14px;margin-top:2px;">Antrian Farmasi</div><div style="margin-top:14px;"><div style="font-size:110px;font-weight:900;letter-spacing:-2px;line-height:1;">${data.code}</div></div><div style="font-size:20px;font-weight:bold;margin-top:10px;">${data.nama}</div>` +
        jenisLine +
        `<div style="font-size:11px;margin-top:10px;color:#333;">${data.tanggal}</div><div style="font-size:13px;margin-top:14px;color:#555;">Silakan menunggu panggilan</div></body></html>`,
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 300);
    return true;
  }

  // src/features/antrianFarmasiOperator.ts
  var STATUS_META = {
    WAITING: { label: 'BELUM DIPANGGIL', icon: '\u{1F535}', bg: '#e7f1ff', fg: '#084298' },
    CALLED: { label: 'DIPANGGIL', icon: '\u{1F7E2}', bg: '#d1e7dd', fg: '#0f5132' },
    DEFERRED: { label: 'DITUNDA', icon: '\u{1F7E0}', bg: '#fff3cd', fg: '#664d03' },
    DONE: { label: 'SELESAI', icon: '\u26AA', bg: '#e9ecef', fg: '#495057' },
    SKIPPED: { label: 'LEWAT', icon: '\u26AB', bg: '#f8f9fa', fg: '#6c757d' },
  };
  var STATUS_ORDER = {
    WAITING: 0,
    CALLED: 1,
    DEFERRED: 2,
    SKIPPED: 3,
    DONE: 4,
  };
  var lastState = '';
  var POLL_MS = 2e3;
  var lastRows = [];
  var lastTanggal = '';
  function printTicket(r) {
    printKartuAntrian({
      nomorResep: r.resep_id || '',
      nama: r.nama_pasien || '-',
      jenis: r.jenis || '',
      unit: '',
      tanggal: lastTanggal,
      code: r.queue_number,
    });
  }
  function printSheetA4() {
    if (!lastRows.length) {
      alert('Belum ada data antrian utk dicetak.');
      return;
    }
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    const rows = [...lastRows].sort((a, b) =>
      a.queue_number.localeCompare(b.queue_number, void 0, { numeric: true }),
    );
    const items = rows
      .map(
        (r) =>
          '<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-bottom:1px solid #ddd;"><b style="min-width:70px;font-size:16px;color:#0f5132;">' +
          r.queue_number +
          '</b><span style="flex:1;font-size:14px;">' +
          (r.nama_pasien || '-') +
          '</span><span style="font-size:11px;color:#777;">' +
          (r.jenis || '') +
          '</span></div>',
      )
      .join('');
    win.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Sheet A4</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:10mm;"><div style="text-align:center;font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:2px;">RSUD H. Abdul Manap</div><div style="text-align:center;font-size:14px;margin-bottom:6px;">Daftar Antrian Farmasi \u2014 ' +
        lastTanggal +
        '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2mm;border:1px solid #999;padding:4mm;">' +
        items +
        '</div></body></html>',
    );
    win.document.close();
    window.setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 300);
  }
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
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;"><b style="font-size:18px;color:#0f5132;">Antrian Farmasi \u2014 Operasional</b><div style="display:flex;gap:8px;align-items:center;"><span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat\u2026</span><button id="ext-op-print-sheet" style="padding:6px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">\u{1F5A8} Cetak Sheet A4</button><button id="ext-op-refresh" style="padding:6px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button></div></div><div id="ext-op-current" style="margin-bottom:14px;"></div><div id="ext-op-queues"></div>';
    return p;
  }
  function callBtn(ev, label, num, eventId) {
    const styles = {
      CALL: 'background:#084298;color:#fff;',
      RECALL: 'background:#0f5132;color:#fff;',
      DEFER: 'background:#fff3cd;color:#664d03;border:1px solid #ffc107;',
      DONE: 'background:#e9ecef;color:#212529;border:1px solid #ced4da;',
    };
    return (
      '<button class="ext-op-act" data-ev="' +
      ev +
      '" data-num="' +
      num +
      '" data-eid="' +
      eventId +
      '" style="padding:8px 14px;border:none;border-radius:8px;cursor:pointer;font-weight:600;' +
      (styles[ev] || styles.DONE) +
      '">' +
      label +
      '</button>'
    );
  }
  function statusBadge(status) {
    const m = STATUS_META[status] || STATUS_META.DONE;
    return (
      '<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.03em;background:' +
      m.bg +
      ';color:' +
      m.fg +
      ';border:1px solid transparent;">' +
      m.icon +
      ' ' +
      m.label +
      '</span>'
    );
  }
  function rowActions(r, prefix) {
    const n = r.queue_number;
    switch (r.status) {
      case 'WAITING':
        return callBtn('CALL', '\u{1F4E2} Panggil', n, prefix + '-call-' + n);
      case 'CALLED':
        return (
          callBtn('RECALL', '\u{1F501} Panggil Ulang', n, prefix + '-recall-' + n) +
          callBtn('DEFER', '\u23F8 Tunda', n, prefix + '-defer-' + n) +
          callBtn('DONE', '\u2714 Selesai', n, prefix + '-done-' + n)
        );
      case 'DEFERRED':
      case 'SKIPPED':
        return callBtn('RECALL', '\u{1F501} Panggil Ulang', n, prefix + '-recall-' + n);
      default:
        return '';
    }
  }
  function rowCard(r, prefix) {
    const jenis = r.jenis
      ? `<span style="color:#6c757d;font-size:12px;"> \xB7 ${r.jenis}</span>`
      : '';
    const shift = r.shift
      ? `<span style="color:#6c757d;font-size:12px;"> \xB7 Shift ${r.shift}</span>`
      : '';
    const calledAt = r.called_at
      ? `<span style="color:#adb5bd;font-size:11px;margin-left:6px;">${r.called_at.slice(11, 16)}</span>`
      : '';
    const dim = r.status === 'DONE' || r.status === 'SKIPPED' ? 'opacity:.62;' : '';
    return (
      '<div class="ext-op-row" style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:8px;gap:10px;' +
      dim +
      '"><div style="display:flex;align-items:center;gap:10px;">' +
      statusBadge(r.status) +
      '<div><b style="font-size:16px;">' +
      r.queue_number +
      calledAt +
      '</b><div style="color:#495057;">' +
      (r.nama_pasien || '-') +
      jenis +
      shift +
      '</div><div style="color:#adb5bd;font-size:11px;">resep ' +
      (r.resep_id || '-') +
      (r.norm ? ' \xB7 RM ' + r.norm : '') +
      '</div></div></div><div style="flex-shrink:0;display:flex;gap:6px;"><button class="ext-op-print1" data-num="' +
      r.queue_number +
      '" style="padding:8px 14px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;font-weight:600;" title="Cetak tiket pasien ini">\u{1F5A8}</button>' +
      rowActions(r, prefix) +
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
      lastRows = [...(d.current || []), ...(d.waiting || []), ...(d.called || [])].map((r) => ({
        id: r.id ?? 0,
        queue_number: r.queue_number,
        resep_id: r.resep_id ?? null,
        nama_pasien: r.nama_pasien ?? null,
        norm: r.norm ?? null,
        shift: r.shift ?? null,
        jenis: r.jenis ?? null,
        status: r.status,
        called_at: r.called_at ?? null,
        counter: r.counter ?? null,
      }));
      lastTanggal = d.tanggal;
      const key = JSON.stringify({ c: d.current, q: d.queues });
      if (key !== lastState) {
        lastState = key;
        const cur = document.getElementById('ext-op-current');
        const list = document.getElementById('ext-op-queues');
        if (cur && list) {
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
                    '</div></div><div style="flex-shrink:0;display:flex;gap:8px;">' +
                    callBtn(
                      'RECALL',
                      '\u{1F501} Panggil Ulang',
                      r.queue_number,
                      'op-recall-' + r.queue_number,
                    ) +
                    callBtn('DEFER', '\u23F8 Tunda', r.queue_number, 'op-defer-' + r.queue_number) +
                    callBtn('DONE', '\u2714 Selesai', r.queue_number, 'op-done-' + r.queue_number) +
                    '</div></div>',
                )
                .join('')
            : '<div style="padding:12px 16px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Belum ada panggilan aktif</div>';
          const queues = [...(d.queues || [])].sort((a, b) => {
            const oa = STATUS_ORDER[a.status] ?? 9;
            const ob = STATUS_ORDER[b.status] ?? 9;
            if (oa !== ob) return oa - ob;
            return a.queue_number.localeCompare(b.queue_number, void 0, { numeric: true });
          });
          list.innerHTML =
            '<div style="font-size:13px;color:#6c757d;margin-bottom:8px;">Antrean Hari Ini \u2014 ' +
            queues.length +
            ' antrian</div>' +
            (queues.length
              ? queues.map((r) => rowCard(r, 'op-enq')).join('')
              : '<div style="padding:12px;background:#fff;border:1px dashed #ced4da;border-radius:10px;color:#6c757d;text-align:center;">Tidak ada antrian hari ini</div>');
        }
      }
      if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
    } catch (e) {
      if (st) st.textContent = 'gagal hubungi app \u2014 cek CORS/BASE';
      log('display gagal:', e.message);
    }
  }
  async function act(ev, num, eid) {
    const apiEvent = ev === 'DEFER' ? 'TUNDA' : ev;
    const ok = await pushQueueEvent({
      event_id: eid + '-' + Date.now().toString(36),
      queue_number: num,
      event: apiEvent,
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
        if (btn) {
          void act(
            btn.getAttribute('data-ev') || '',
            btn.getAttribute('data-num') || '',
            btn.getAttribute('data-eid') || '',
          );
          return;
        }
        const p1 = e.target.closest('.ext-op-print1');
        if (p1) {
          const num = p1.getAttribute('data-num') || '';
          const row = lastRows.find((r) => r.queue_number === num);
          if (row) printTicket(row);
          return;
        }
      });
      document.getElementById('ext-op-print-sheet')?.addEventListener('click', printSheetA4);
      document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
      void render();
      void probeFarmasiAppBase().then(() => void render());
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
