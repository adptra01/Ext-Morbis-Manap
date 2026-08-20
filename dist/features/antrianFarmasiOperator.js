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
      if (p.event === 'BATAL' && !p.queue_number) {
        console.warn('[MORBIS Ext] BATAL tanpa queue_number \u2014 dilewati');
        return { ok: false };
      }
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
  var ICONS = {
    speaker:
      '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    recall: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    pause:
      '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    printer:
      '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    refresh:
      '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    trash:
      '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  };
  function svg(name, size = 16, color = '#212529') {
    return (
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 24 24" fill="none" stroke="' +
      color +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;visibility:visible;vertical-align:middle;flex:none;">' +
      (ICONS[name] || '') +
      '</svg>'
    );
  }
  var STATUS_META = {
    WAITING: { label: 'BELUM DIPANGGIL', dot: '#2193cf', bg: '#e7f1ff', fg: '#2193cf' },
    CALLED: { label: 'DIPANGGIL', dot: '#2445d6', bg: '#e0e7ff', fg: '#2445d6' },
    DEFERRED: { label: 'DITUNDA', dot: '#997404', bg: '#fff3cd', fg: '#664d03' },
    DONE: { label: 'SELESAI', dot: '#495057', bg: '#e9ecef', fg: '#495057' },
    SKIPPED: { label: 'LEWAT', dot: '#6c757d', bg: '#f8f9fa', fg: '#6c757d' },
  };
  var CAT_META = {
    tunggal: { label: 'Non Racikan', accent: '#2193cf', soft: '#e7f1ff' },
    racikan: { label: 'Racikan', accent: '#d97706', soft: '#fef3c7' },
  };
  var lastState = '';
  var POLL_MS = 2e3;
  var lastRows = [];
  var lastTanggal = '';
  function catOf(num) {
    return String(num || '')
      .toUpperCase()
      .startsWith('R')
      ? 'racikan'
      : 'tunggal';
  }
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
          '<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-bottom:1px solid #ddd;"><b style="min-width:70px;font-size:16px;color:#2193cf;">' +
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
  function openDialog(title, bodyHtml, onOk, okLabel = 'Simpan') {
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:14px;padding:18px;width:400px;max-width:94vw;box-shadow:0 10px 40px rgba(0,0,0,.25);font:14px/1.5 system-ui,sans-serif;color:#212529;"><div style="font-size:15px;font-weight:800;margin-bottom:12px;">' +
      title +
      '</div><div class="ext-op-dlg-body"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;"><button class="ext-op-dlg-cancel" style="padding:8px 14px;border:1px solid #ced4da;background:#fff;border-radius:8px;cursor:pointer;">Batal</button><button class="ext-op-dlg-ok" style="padding:8px 14px;border:none;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">' +
      okLabel +
      '</button></div></div>';
    document.body.appendChild(overlay);
    const card = overlay.firstElementChild;
    const root = card.querySelector('.ext-op-dlg-body');
    root.innerHTML = bodyHtml;
    const close = () => overlay.remove();
    card.querySelector('.ext-op-dlg-cancel')?.addEventListener('click', close);
    card.querySelector('.ext-op-dlg-ok')?.addEventListener('click', () => {
      try {
        onOk(root);
      } finally {
        close();
      }
    });
  }
  async function postSetCounter(prefix, lastSeq) {
    const base = await probeFarmasiAppBase();
    const res = await fetch(base + '/api/queue/counter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, last_seq: lastSeq }),
      cache: 'no-store',
      credentials: 'omit',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    log('set counter:', prefix, lastSeq, '\u2192', j.next);
  }
  function openSetCounterDialog() {
    const body =
      '<div style="margin-bottom:10px;font-size:13px;color:#495057;">Penomoran terlewat / kendala? Set nomor terakhir yang sudah terbit \u2014 antrian berikutnya lanjut dari nomor itu.</div><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><label style="font-weight:700;">Jenis:</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-cnt-prefix" value="T" checked> T \u2014 Non Racikan</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-cnt-prefix" value="R"> R \u2014 Racikan</label></div><div style="display:flex;align-items:center;gap:10px;"><label style="font-weight:700;">Nomor terakhir:</label><input id="ext-op-cnt-seq" type="number" min="0" max="9999" value="0" style="width:110px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div>';
    openDialog('Set Nomor Lanjutan', body, (root) => {
      const prefix = root.querySelector('input[name="ext-op-cnt-prefix"]:checked').value;
      const seq = Math.max(0, parseInt(root.querySelector('#ext-op-cnt-seq').value, 10) || 0);
      void postSetCounter(prefix, seq).then(
        () => {
          void render();
        },
        (e) => alert('[MORBIS Ext] Gagal set nomor: ' + String(e?.message ?? e)),
      );
    });
  }
  function printBlankSheet(prefix, count) {
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup untuk mencetak.');
      return;
    }
    const accent = prefix === 'R' ? '#d97706' : '#2193cf';
    const items = [];
    for (let i = 1; i <= count; i++) {
      items.push(
        '<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-bottom:1px solid #ddd;"><b style="min-width:70px;font-size:16px;color:' +
          accent +
          ';">' +
          prefix +
          '-' +
          String(i).padStart(2, '0') +
          '</b><span style="flex:1;font-size:14px;">&nbsp;</span></div>',
      );
    }
    win.document.write(
      '<html><head><title>Antrian Farmasi \u2014 Sheet A4</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:10mm;"><div style="text-align:center;font-size:18px;font-weight:bold;text-transform:uppercase;margin-bottom:2px;">RSUD H. Abdul Manap</div><div style="text-align:center;font-size:14px;margin-bottom:6px;">Sheet Antrian Farmasi ' +
        (prefix === 'R' ? 'Racikan (R)' : 'Non Racikan (T)') +
        ' \u2014 ' +
        lastTanggal +
        '</div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2mm;border:1px solid #999;padding:4mm;">' +
        items.join('') +
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
  function openPrintSheetDialog() {
    const body =
      '<div style="margin-bottom:12px;font-size:13px;color:#495057;">Pilih sumber data sheet A4:</div><label style="display:flex;align-items:center;gap:6px;margin-bottom:8px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="real" checked> Daftar antrian hari ini (dari app)</label><label style="display:flex;align-items:center;gap:6px;margin-bottom:10px;cursor:pointer;"><input type="radio" name="ext-op-sheet-src" value="blank"> Cetak kosong (tanpa record \u2014 tiket manual)</label><div id="ext-op-sheet-blank" style="display:none;border-top:1px solid #eee;padding-top:10px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;"><label style="font-weight:700;">Jenis:</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="T" checked> T</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer;"><input type="radio" name="ext-op-sheet-prefix" value="R"> R</label></div><div style="display:flex;align-items:center;gap:10px;"><label style="font-weight:700;">Jumlah (1\u2013200):</label><input id="ext-op-sheet-count" type="number" min="1" max="200" value="20" style="width:90px;padding:7px 10px;border:1px solid #ced4da;border-radius:8px;font-size:15px;"></div><div style="margin-top:8px;font-size:12px;color:#6c757d;">Mis. 89 \u2192 mencetak T-01 s/d T-89 tanpa record.</div></div>';
    openDialog('Cetak Sheet A4', body, (root) => {
      const src = root.querySelector('input[name="ext-op-sheet-src"]:checked').value;
      if (src === 'real') {
        printSheetA4();
        return;
      }
      const prefix = root.querySelector('input[name="ext-op-sheet-prefix"]:checked').value;
      const count = Math.min(
        200,
        Math.max(1, parseInt(root.querySelector('#ext-op-sheet-count').value, 10) || 1),
      );
      printBlankSheet(prefix, count);
    });
    document.querySelectorAll('input[name="ext-op-sheet-src"]').forEach((r) =>
      r.addEventListener('change', () => {
        const blank = document.getElementById('ext-op-sheet-blank');
        if (!blank) return;
        const src = document.querySelector('input[name="ext-op-sheet-src"]:checked')?.value;
        blank.style.display = src === 'blank' ? '' : 'none';
      }),
    );
  }
  function log(...args) {
    console.log('[MORBIS Ext] operator:', ...args);
  }
  function hideNative() {
    const isi = document.getElementById('isi');
    if (isi) isi.style.display = 'none';
    document.querySelectorAll('div.header, header, .header, .navbar, .topbar').forEach((el) => {
      if (!el.hasAttribute('data-ext-op-hidden')) {
        el.setAttribute('data-ext-op-hidden', '1');
        el.style.display = 'none';
      }
    });
    const header = document.querySelector('h1, h2, .page-header, .card-header');
    if (header && !header.hasAttribute('data-ext-op-hidden')) {
      header.setAttribute('data-ext-op-hidden', '1');
      header.style.display = 'none';
    }
  }
  function moveNativeButtons() {
    const bar = document.querySelector('#ext-op-actions');
    if (!bar || bar.querySelector('#ext-op-reset')) return;
    const wrap = document.createElement('span');
    wrap.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
    const reset = document.querySelector(
      'button[onclick*="reset_antrian"], input[onclick*="reset_antrian"]',
    );
    const display = document.querySelector(
      'button[onclick*="view-call-websocet"], input[onclick*="view-call-websocet"]',
    );
    if (reset) {
      const clone = reset.cloneNode(true);
      clone.id = 'ext-op-reset';
      clone.setAttribute(
        'data-tip',
        'Reset antrian DB app \u2014 semua antrian hari ini kembali ke status awal, nomor dipanggil ulang dari T-01/R-01',
      );
      clone.setAttribute('title', 'Reset Antrian (DB app) \u2014 aksi destruktif');
      clone.setAttribute(
        'style',
        'margin-left:28px;padding:7px 14px;border:1.5px solid #dc3545;background:#fff;color:#dc3545;border-radius:8px;cursor:pointer;font-weight:700;',
      );
      clone.addEventListener('click', () => {
        void resetQueueDb();
      });
      wrap.appendChild(clone);
    }
    if (display) {
      const clone = display.cloneNode(true);
      clone.id = 'ext-op-display';
      clone.setAttribute('data-tip', 'Buka layar TV (tab baru)');
      clone.setAttribute('title', 'Buka layar TV antrian');
      clone.setAttribute(
        'style',
        'padding:7px 14px;border:1px solid #00a65a;background:#00a65a;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;',
      );
      clone.addEventListener('click', () => {
        window.open('/public/antrian-farmasi-v2/view-call-websocet-v2', '_blank');
      });
      wrap.appendChild(clone);
    }
    if (wrap.children.length) bar.appendChild(wrap);
  }
  function iconBtn(ev, icon, title, num, eventId, opts) {
    return (
      '<button class="ext-op-act" data-ev="' +
      ev +
      '" data-num="' +
      num +
      '" data-eid="' +
      eventId +
      '" data-tip="' +
      title +
      '" title="' +
      title +
      '" aria-label="' +
      title +
      '" style="width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ced4da;background:#fff;color:' +
      (opts?.danger ? '#b02a37' : '#212529') +
      ';border-radius:8px;cursor:pointer;">' +
      svg(icon, 16, opts?.danger ? '#b02a37' : '#212529') +
      '</button>'
    );
  }
  function activeCard(r, cat) {
    const m = CAT_META[cat];
    return (
      '<div style="background:#fff;border:3px solid ' +
      m.accent +
      ';border-radius:16px;padding:14px 16px;margin-bottom:10px;box-shadow:0 4px 14px -6px rgba(16,24,40,.14);"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:' +
      m.accent +
      ';margin-bottom:2px;">Sedang Dipanggil</div><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;"><b style="font-size:52px;line-height:1.05;letter-spacing:-.02em;color:' +
      m.accent +
      ';font-variant-numeric:tabular-nums;">' +
      r.queue_number +
      '</b><div style="text-align:right;min-width:0;"><div style="font-weight:700;font-size:17px;color:#212529;line-height:1.2;">' +
      (r.nama_pasien || '-') +
      '</div><div style="font-size:12px;color:#6c757d;">' +
      (r.counter?.name ? 'Loket ' + r.counter.name : '') +
      (r.called_at ? ' \xB7 ' + (r.called_at.slice(11, 16) || '') : '') +
      '</div></div></div><div style="display:flex;gap:6px;margin-top:10px;justify-content:flex-end;">' +
      iconBtn('RECALL', 'recall', 'Panggil ulang', r.queue_number, 'op-recall-' + r.queue_number) +
      iconBtn('DEFER', 'pause', 'Tunda', r.queue_number, 'op-defer-' + r.queue_number) +
      iconBtn('DONE', 'check', 'Selesai', r.queue_number, 'op-done-' + r.queue_number) +
      '</div></div>'
    );
  }
  function miniRow(r, prefix) {
    const actions =
      r.status === 'WAITING'
        ? iconBtn(
            'CALL',
            'speaker',
            'Panggil',
            r.queue_number,
            prefix + '-call-' + r.queue_number,
          ) +
          iconBtn(
            'PRINT',
            'printer',
            'Cetak tiket',
            r.queue_number,
            prefix + '-print-' + r.queue_number,
          )
        : r.status === 'CALLED'
          ? iconBtn(
              'RECALL',
              'recall',
              'Panggil ulang',
              r.queue_number,
              prefix + '-recall-' + r.queue_number,
            ) +
            iconBtn(
              'DEFER',
              'pause',
              'Tunda',
              r.queue_number,
              prefix + '-defer-' + r.queue_number,
            ) +
            iconBtn('DONE', 'check', 'Selesai', r.queue_number, prefix + '-done-' + r.queue_number)
          : iconBtn(
              'RECALL',
              'recall',
              'Panggil ulang',
              r.queue_number,
              prefix + '-recall-' + r.queue_number,
            ) +
            (r.status === 'DEFERRED'
              ? iconBtn(
                  'BATAL',
                  'trash',
                  'Hapus (record dihapus dari antrian)',
                  r.queue_number,
                  prefix + '-batal-' + r.queue_number,
                  { danger: true },
                )
              : '');
    const badge =
      r.status === 'WAITING'
        ? ''
        : '<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;background:' +
          (STATUS_META[r.status]?.bg || '#e9ecef') +
          ';color:' +
          (STATUS_META[r.status]?.fg || '#495057') +
          ';margin-right:6px;"><span style="width:7px;height:7px;border-radius:50%;background:' +
          (STATUS_META[r.status]?.dot || '#495057') +
          ';display:inline-block;"></span>' +
          (STATUS_META[r.status]?.label || r.status) +
          '</span>';
    return (
      '<div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:#fff;border:1px solid #e9ecef;border-radius:10px;margin-bottom:6px;">' +
      badge +
      '<b style="font-size:15px;color:#212529;min-width:52px;">' +
      r.queue_number +
      '</b><span style="flex:1;font-size:13px;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
      (r.nama_pasien || '-') +
      '</span><span style="display:flex;gap:4px;flex-shrink:0;">' +
      actions +
      '</span></div>'
    );
  }
  function column(cat, active, next) {
    const m = CAT_META[cat];
    const nextList = next.slice(0, 5);
    const nextBtn = nextList.length
      ? '<button class="ext-op-act" data-ev="CALL" data-num="' +
        nextList[0].queue_number +
        '" data-eid="op-next-' +
        cat +
        '" data-tip="Panggil antrean berikutnya (' +
        nextList[0].queue_number +
        ')" title="Panggil antrean berikutnya" style="width:100%;margin-top:8px;padding:12px;border:none;border-radius:10px;background:' +
        m.accent +
        ';color:#fff;font-size:15px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;">' +
        svg('play', 16, '#fff') +
        'Selanjutnya \u2014 ' +
        nextList[0].queue_number +
        '</button>'
      : '';
    return (
      '<div style="background:#f1f3f5;border:1px solid #dee2e6;border-radius:16px;padding:12px;display:flex;flex-direction:column;min-width:0;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;"><span style="width:10px;height:10px;border-radius:50%;background:' +
      m.accent +
      ';"></span><b style="font-size:15px;color:#212529;">' +
      m.label +
      '</b></div>' +
      (active.length ? active.map((r) => activeCard(r, cat)).join('') : '') +
      (active.length
        ? ''
        : '<div style="padding:14px;background:#fff;border:1px dashed #ced4da;border-radius:12px;color:#6c757d;text-align:center;font-size:13px;margin-bottom:10px;">Belum ada panggilan aktif</div>') +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:4px 2px 6px;">Berikutnya</div>' +
      (nextList.length
        ? nextList.map((r) => miniRow(r, 'op-' + cat)).join('')
        : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada antrean berikutnya</div>') +
      nextBtn +
      '</div>'
    );
  }
  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'ext-farmasi-operator';
    p.style.cssText =
      'padding:14px;max-width:1500px;margin:0 auto;font:14px/1.5 system-ui,sans-serif;color:#212529;background:#f8f9fa;min-height:90vh;box-sizing:border-box;';
    p.innerHTML =
      '<style>#ext-farmasi-operator svg{display:inline-block !important;visibility:visible !important;width:16px;height:16px;flex:none;vertical-align:middle}#ext-farmasi-operator button{font-family:inherit}#ext-farmasi-operator button svg{pointer-events:none}#ext-farmasi-operator [data-tip]{position:relative}#ext-farmasi-operator [data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#212529;color:#fff;font-size:11px;font-weight:600;line-height:1.4;white-space:nowrap;padding:4px 8px;border-radius:6px;z-index:99;box-shadow:0 2px 8px rgba(0,0,0,.25)}#ext-farmasi-operator [data-tip]:hover::before{content:"";position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#212529;z-index:99}</style><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;"><b style="font-size:18px;color:#2193cf;">Antrian Farmasi \u2014 Operasional</b><div id="ext-op-actions" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span id="ext-op-status" style="color:#6c757d;font-size:12px;">memuat\u2026</span><button id="ext-op-print-sheet" data-tip="Cetak Sheet A4 \u2014 daftar hari ini atau kosong (T/R + jumlah)" style="padding:7px 14px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('printer', 14, '#fff') +
      'Cetak Sheet A4</button><button id="ext-op-set-counter" data-tip="Set nomor lanjutan setelah kendala (mati lampu dll) \u2014 antrian berikutnya lanjut dari nomor itu" style="padding:7px 14px;border:1px solid #0d6efd;background:#fff;color:#0d6efd;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">' +
      svg('refresh', 14, '#0d6efd') +
      'Set Nomor</button><button id="ext-op-refresh" data-tip="Segarkan data antrean dari app" style="padding:7px 14px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;">Segarkan</button></div></div><div id="ext-op-grid" style="display:grid;grid-template-columns:1fr 1fr 1.1fr;gap:12px;align-items:start;"><div id="ext-col-tunggal"></div><div id="ext-col-racikan"></div><div id="ext-col-panel" style="background:#fff;border:1px solid #dee2e6;border-radius:16px;padding:12px;min-width:0;"></div></div>';
    return p;
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
        const colT = document.getElementById('ext-col-tunggal');
        const colR = document.getElementById('ext-col-racikan');
        const colP = document.getElementById('ext-col-panel');
        if (colT && colR && colP) {
          const queues = d.queues || [];
          const sortNum = (a, b) =>
            a.queue_number.localeCompare(b.queue_number, void 0, { numeric: true });
          const byCat = (cat) => ({
            active: (d.current || []).filter((r) => catOf(r.queue_number) === cat),
            next: queues
              .filter((r) => catOf(r.queue_number) === cat && r.status === 'WAITING')
              .sort(sortNum),
          });
          const t = byCat('tunggal');
          const r2 = byCat('racikan');
          colT.innerHTML = column('tunggal', t.active, t.next);
          colR.innerHTML = column('racikan', r2.active, r2.next);
          const special = queues
            .filter((r) => r.status === 'DEFERRED' || r.status === 'SKIPPED')
            .sort(sortNum);
          colP.innerHTML =
            '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:8px;">Penerbitan & Kasus Khusus</div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="ext-op-print-sheet2" data-tip="Cetak daftar semua nomor antrian hari ini (format A4)" title="Cetak Sheet A4" style="flex:1;padding:9px;border:1px solid #2193cf;background:#2193cf;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:6px;">' +
            svg('printer', 14, '#fff') +
            'Sheet A4</button><button id="ext-op-refresh2" data-tip="Segarkan data antrean dari app" title="Segarkan" style="flex:1;padding:9px;border:1px solid #6c757d;background:#6c757d;color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">Segarkan</button></div><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin-bottom:6px;">Ditunda / Lewat</div>' +
            (special.length
              ? special.map((r) => miniRow(r, 'op-sp')).join('')
              : '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Tidak ada</div>') +
            '<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6c757d;margin:14px 0 6px;">Selesai Hari Ini</div><div style="max-height:180px;overflow:auto;">' +
            (queues
              .filter((r) => r.status === 'DONE')
              .sort(sortNum)
              .map((r) => miniRow(r, 'op-done'))
              .join('') ||
              '<div style="padding:10px;color:#adb5bd;text-align:center;font-size:12px;">Belum ada</div>') +
            '</div>';
        }
      }
      if (st) st.textContent = 'terhubung ke app (' + d.tanggal + ')';
    } catch (e) {
      if (st) st.textContent = 'gagal hubungi app \u2014 cek CORS/BASE';
      log('display gagal:', e.message);
    }
  }
  var ACT_COOLDOWN_MS = 1500;
  var actCooldown = /* @__PURE__ */ new Map();
  async function act(ev, num, eid) {
    if (ev === 'PRINT') {
      const row = lastRows.find((r) => r.queue_number === num);
      if (row) printTicket(row);
      return;
    }
    if (ev === 'BATAL') {
      if (
        !confirm(
          'Hapus antrian ' + num + ' dari DB? Record dihapus \u2014 resep bisa di-antrikan ulang.',
        )
      ) {
        return;
      }
    }
    const now = Date.now();
    const key = ev + '|' + num;
    const last = actCooldown.get(key) || 0;
    if (now - last < ACT_COOLDOWN_MS) {
      log('skip (cooldown) ' + key);
      return;
    }
    actCooldown.set(key, now);
    const btn = document.querySelector(`.ext-op-act[data-ev="${ev}"][data-num="${num}"]`);
    const prevLabel = btn?.textContent ?? '';
    const prevDisabled = btn?.disabled ?? false;
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.55';
      btn.style.cursor = 'wait';
      if (ev === 'CALL') btn.textContent = 'Memproses\u2026';
    }
    try {
      const apiEvent = ev === 'DEFER' ? 'TUNDA' : ev;
      const ok = await pushQueueEvent({
        event_id: eid + '-' + Date.now().toString(36),
        queue_number: num,
        event: apiEvent,
      });
      log(ev, num, ok ? 'OK' : 'gagal');
      if (ok) await render();
    } finally {
      const b2 = document.querySelector(`.ext-op-act[data-ev="${ev}"][data-num="${num}"]`);
      if (b2) {
        b2.disabled = prevDisabled;
        b2.style.opacity = '';
        b2.style.cursor = '';
        if (ev === 'CALL') b2.textContent = prevLabel;
      }
      window.setTimeout(() => actCooldown.delete(key), ACT_COOLDOWN_MS);
    }
  }
  async function resetQueueDb() {
    if (
      !confirm(
        'Reset antrian? Semua antrian hari ini akan kembali ke status awal dan bisa dipanggil ulang dari T-01/R-01. Record tidak dihapus. (Tidak menyentuh sistem MORBIS)',
      )
    ) {
      return;
    }
    try {
      const base = await probeFarmasiAppBase();
      const res = await fetch(base + '/api/queue/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        cache: 'no-store',
        credentials: 'omit',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const j = await res.json();
      log('reset DB:', j.ok ? 'OK' : 'gagal', 'reset', j.reset);
      await render();
    } catch (e) {
      alert('[MORBIS Ext] Gagal reset antrian: ' + String(e.message ?? e));
    }
  }
  function init() {
    const start = () => {
      if (!document.getElementById('isi')) return;
      hideNative();
      if (document.getElementById('ext-farmasi-operator')) return;
      const panel = buildPanel();
      (document.getElementById('isi')?.parentElement || document.body).appendChild(panel);
      moveNativeButtons();
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
      });
      document
        .getElementById('ext-op-print-sheet')
        ?.addEventListener('click', openPrintSheetDialog);
      document
        .getElementById('ext-op-set-counter')
        ?.addEventListener('click', openSetCounterDialog);
      document.getElementById('ext-op-refresh')?.addEventListener('click', () => void render());
      panel.addEventListener('click', (e) => {
        const s2 = e.target.closest('#ext-op-print-sheet2');
        if (s2) openPrintSheetDialog();
        const r2 = e.target.closest('#ext-op-refresh2');
        if (r2) void render();
      });
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
