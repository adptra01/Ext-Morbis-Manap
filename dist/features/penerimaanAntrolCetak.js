'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueBridge.ts
  var REQ_SOURCE = 'MORBIS-FARMASI';
  var RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
  var REPLY_TIMEOUT_MS = 4e3;
  function post(type, payload) {
    const reqId = 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
    return new Promise((resolve, reject) => {
      const onMsg = (event) => {
        if (event.source !== window) return;
        const d = event.data;
        if (!d || d.source !== RES_SOURCE || d.type !== type || d.reqId !== reqId) return;
        window.removeEventListener('message', onMsg);
        clearTimeout(timer);
        if (!d.ok) return reject(new Error(d.error || type + ' gagal'));
        resolve(d);
      };
      window.addEventListener('message', onMsg);
      const timer = window.setTimeout(() => {
        window.removeEventListener('message', onMsg);
        reject(new Error('farmasiQueueBridge: no reply (extension reloaded?)'));
      }, REPLY_TIMEOUT_MS);
      window.postMessage({ source: REQ_SOURCE, type, reqId, ...payload }, '*');
    });
  }
  async function assignPublicNumber(id, jenis, waktu, issuedBy) {
    return post('QUEUE_ASSIGN_ONE', {
      id,
      jenis,
      waktu,
      issuedBy,
    }).then((r) => ({ code: r.code, issued: r.issued }));
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
  function sanitizeAntrianCells() {
    document.querySelectorAll('tr[id]').forEach((tr) => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const cell = cells[2];
      if (!cell || cell.hasAttribute('data-ext-code')) return;
      const btn = cell.querySelector('button');
      if (!btn || btn.hasAttribute('data-ext-shift')) return;
      const shift = extractShift(cell);
      if (shift) btn.setAttribute('data-ext-shift', shift);
      if (cell.hasAttribute('data-ext-sanitized')) return;
      cell.innerHTML = '';
      cell.appendChild(btn);
      cell.setAttribute('data-ext-sanitized', '1');
    });
  }
  function watchSanitize() {
    sanitizeAntrianCells();
    const observer = new MutationObserver(() => sanitizeAntrianCells());
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 6e4);
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
      const issued = await assignPublicNumber(antrianId, row?.JENIS ?? null, row?.WAKTU ?? null);
      const code = issued.code;
      if (!code) {
        log('nomor publik belum terbit utk', antrianId);
        alert('Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      log('nomor publik', code, '| baru:', issued.issued);
      const tr = document.querySelector(`tr[id="${idResep}"]`);
      const cells = tr ? Array.from(tr.querySelectorAll('td')) : [];
      const antrianCell = cells[2];
      const btnInCell = antrianCell?.querySelector('button');
      const shift =
        btnInCell?.getAttribute('data-ext-shift') ||
        (antrianCell ? extractShift(antrianCell) : '') ||
        '';
      if (antrianCell && !antrianCell.hasAttribute('data-ext-code')) {
        const btnHtml = btnInCell ? btnInCell.outerHTML : '';
        antrianCell.innerHTML =
          `${code}<br>Shift : ${shift || '-'}` + (btnHtml ? '<br>' + btnHtml : '');
        antrianCell.setAttribute('data-ext-code', code);
      }
      printKartuAntrian({
        nomorResep: idResep,
        nama: String(data.NAMA_PAS ?? '').toUpperCase(),
        jenis: row?.JENIS ?? '',
        unit: String(row?.NAMA_UNIT ?? data.UNIT_TUJUAN_DEPO ?? ''),
        tanggal: String(data.WAKTU_PENGAJUAN ?? '').slice(0, 10),
        code,
      });
    } catch (e) {
      log('gagal', e);
      alert('[MORBIS Ext] Gagal mengantrikan resep: ' + String(e.message ?? e));
    }
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
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        wrapNoAntrian();
        watchSanitize();
      },
      { once: true },
    );
  } else {
    wrapNoAntrian();
    watchSanitize();
  }
  window.setTimeout(wrapNoAntrian, 1e3);
  window.setTimeout(wrapNoAntrian, 3e3);
})();
//# sourceMappingURL=penerimaanAntrolCetak.js.map
