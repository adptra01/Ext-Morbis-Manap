'use strict';
var __morbis_feature = (() => {
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

  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  var cachedBase = null;
  var basePromise = null;
  var BASE_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
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
  function queueEventId(prefix, source, nomor) {
    return `${prefix}-${source}-${nomor}-${/* @__PURE__ */ new Date().toISOString().slice(0, 10)}`;
  }

  // src/features/penerimaanAntrolCetak.ts
  var ANTRL_URL = '/v2/antrol/search';
  var ANTRL_SUB = 'sub=update_v2';
  var LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  function log(...args) {
    console.log('[MORBIS Ext] penerimaanAntrolCetak:', ...args);
  }
  async function fetchDataResep(nomorResep) {
    const res = await fetch(
      `/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=${encodeURIComponent(nomorResep)}`,
      { credentials: 'include', cache: 'no-store' },
    );
    if (!res.ok) throw new Error('data-resep-new HTTP ' + res.status);
    return await res.json();
  }
  async function registerAntrian(idVisit) {
    const res = await fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
      credentials: 'include',
    });
    return res.ok;
  }
  async function fetchCheckAntrian() {
    const res = await fetch(LIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('check_antrian HTTP ' + res.status);
    const j = await res.json();
    if (!Array.isArray(j)) throw new Error('bukan array');
    return j;
  }
  function findRow(rows, idPasien, waktuPengajuan) {
    const w = String(waktuPengajuan ?? '');
    return rows.find((r) => {
      if (String(r.ID_PASIEN ?? '') !== String(idPasien)) return false;
      if (!w) return true;
      return String(r.WAKTU ?? '').slice(0, 16) === w.slice(0, 16);
    });
  }
  function extractShift(cell) {
    if (!cell) return '';
    const m = (cell.textContent || '').match(/Shift\s*:\s*([A-Za-z0-9]+)/i);
    return m ? m[1] : '';
  }
  function extractNativeNumber(cell) {
    if (!cell) return '';
    const m = (cell.textContent || '').match(/\b[A-Z]{2,3}-\d+\b/);
    return m ? m[0] : '';
  }
  function extractNamaPasienFromRow(tr) {
    if (!tr) return '';
    const tds = tr.querySelectorAll('td');
    let best = '';
    for (const td of Array.from(tds).slice(3, 5)) {
      const t = (td.textContent || '').trim();
      if (t.length > best.length && !/^[0-9\s.:-]+$/.test(t)) best = t;
    }
    return best;
  }
  function resolveNamaPasien(data, tr) {
    const fromApi = String(data.NAMA_PAS ?? data.NAMA_PASIEN ?? '').trim();
    return (fromApi || extractNamaPasienFromRow(tr)).toUpperCase();
  }
  async function handleNoAntrian(idResep) {
    try {
      const data = await fetchDataResep(idResep);
      const idVisit = String(data.ID_VISIT ?? '');
      if (!idVisit) throw new Error('ID_VISIT kosong');
      log('antrikan idVisit=' + idVisit, 'resep', idResep);
      const okAntrol = await registerAntrian(idVisit);
      log('antrol', okAntrol ? 'OK' : 'gagal');
      let row;
      for (let i = 0; i < 5 && !row; i++) {
        try {
          const rows = await fetchCheckAntrian();
          row =
            findRow(rows, String(data.ID_PASIEN ?? ''), String(data.WAKTU_PENGAJUAN ?? '')) ??
            rows.find((r) => String(r.ID ?? '') === idVisit);
        } catch {}
        if (!row) await new Promise((r) => setTimeout(r, 400));
      }
      const antrianId = row ? String(row.ID ?? '') : idVisit;
      const tr = document.querySelector(`tr[id="${idResep}"]`);
      const cells = tr ? Array.from(tr.querySelectorAll('td')) : [];
      const antrianCell = cells[2];
      const nomor = extractNativeNumber(antrianCell) || String(row?.NOMOR ?? '');
      if (!nomor) {
        log('nomor native belum ada utk', antrianId);
        alert('Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      log('nomor publik', nomor);
      const shift = row?.SHIFT || (antrianCell ? extractShift(antrianCell) : '') || '';
      const sync = await pushQueueEvent({
        event_id: queueEventId('enq', antrianId, nomor),
        event: 'ENQUEUE',
        resep_id: idResep,
        nama_pasien: resolveNamaPasien(data, tr),
        norm: String(data.ID_PASIEN ?? ''),
        shift,
        jenis: row?.JENIS ?? '',
        counter: '',
        payload: {
          idVisit,
          unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
          waktu: String(row?.WAKTU ?? data.WAKTU_PENGAJUAN ?? ''),
        },
      });
      if (!sync.ok)
        log('ENQUEUE app gagal (app tidak terjangkau?) \u2014 antrian tetap jalan di MORBIS');
      const publicNumber = sync.queue_number || nomor;
      log('nomor publik', publicNumber);
      if (antrianCell && !antrianCell.hasAttribute('data-ext-code')) {
        const btnInCell = antrianCell.querySelector('button');
        const btnHtml = btnInCell ? btnInCell.outerHTML : '';
        antrianCell.innerHTML =
          `${publicNumber}<br>Shift : ${shift || '-'}` + (btnHtml ? '<br>' + btnHtml : '');
        antrianCell.setAttribute('data-ext-code', publicNumber);
        antrianCell.setAttribute('data-ext-resep', idResep);
        markCetakUlang(antrianCell, publicNumber, idResep);
      }
      printKartuAntrian({
        nomorResep: idResep,
        nama: resolveNamaPasien(data, tr),
        jenis: row?.JENIS ?? '',
        unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
        tanggal: String(data.WAKTU_PENGAJUAN ?? '').slice(0, 10),
        code: publicNumber,
      });
    } catch (e) {
      log('gagal', e);
      alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String(e.message ?? e));
    }
  }
  function markCetakUlang(cell, code, idResep) {
    const btn = cell.querySelector('button');
    if (!btn) return;
    const klon = btn.cloneNode(true);
    klon.textContent = '\u{1F5A8} Cetak Kembali';
    klon.title = code + ' \u2014 cetak ulang kartu tanpa mengantrikan lagi';
    klon.style.cssText =
      'margin-top:4px;padding:3px 8px;font-size:11px;border:1px solid #0d6efd;background:#e7f1ff;color:#0d6efd;border-radius:6px;cursor:pointer;';
    klon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      void (async () => {
        try {
          const d = await fetchDataResep(idResep);
          printKartuAntrian({
            nomorResep: idResep,
            nama: resolveNamaPasien(d, cell.closest('tr')),
            jenis: '',
            unit: String(d.UNIT_TUJUAN_DEPO ?? ''),
            tanggal: String(d.WAKTU_PENGAJUAN ?? '').slice(0, 10),
            code,
          });
        } catch (err) {
          alert('[MORBIS Ext] Gagal cetak ulang: ' + String(err.message ?? err));
        }
      })();
    });
    btn.replaceWith(klon);
  }
  function wrapNoAntrian() {
    const g = window;
    if (!g.no_antrian || g.no_antrian.__ext) return;
    const orig = g.no_antrian;
    const wrapped = (id) => {
      void handleNoAntrian(String(id));
    };
    wrapped.__ext = true;
    g.no_antrian = wrapped;
    void orig;
  }
  function hideNoAntrianColumn() {
    try {
      const ths = document.querySelectorAll('thead th');
      if (!ths.length) return;
      let idx = -1;
      Array.from(ths).forEach((th, i) => {
        if (/no\s*antrian|nomor\s*antrian/i.test((th.textContent || '').trim())) idx = i;
      });
      if (idx < 0) return;
      const sheet = document.createElement('style');
      sheet.textContent = `table thead th:nth-child(${idx + 1}), table tbody td:nth-child(${idx + 1}) { display: none; }`;
      sheet.id = 'ext-hide-no-antrian';
      if (!document.getElementById('ext-hide-no-antrian')) {
        document.head.appendChild(sheet);
      }
    } catch {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        wrapNoAntrian();
        hideNoAntrianColumn();
      },
      { once: true },
    );
  } else {
    wrapNoAntrian();
    hideNoAntrianColumn();
  }
  window.setTimeout(wrapNoAntrian, 1e3);
  window.setTimeout(wrapNoAntrian, 3e3);
  window.setTimeout(hideNoAntrianColumn, 1e3);
  window.setTimeout(hideNoAntrianColumn, 3e3);
  function sweepCetakUlang() {
    try {
      document.querySelectorAll('tr[id]').forEach((tr) => {
        const cell = tr.children[2];
        if (!cell) return;
        const btn = cell.querySelector('button');
        if (!btn || btn.textContent?.includes('Cetak')) return;
        const code = cell.getAttribute('data-ext-code') || extractNativeNumber(cell);
        const idResep = tr.getAttribute('id') || '';
        if (!code || !idResep) return;
        cell.setAttribute('data-ext-code', code);
        cell.setAttribute('data-ext-resep', idResep);
        markCetakUlang(cell, code, idResep);
      });
    } catch {}
  }
  sweepCetakUlang();
  window.setInterval(sweepCetakUlang, 4e3);
})();
//# sourceMappingURL=penerimaanAntrolCetak.js.map
