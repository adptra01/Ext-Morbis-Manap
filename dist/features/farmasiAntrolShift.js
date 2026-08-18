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

  // src/features/farmasiAntrolShift.ts
  (() => {
    const ANTRL_URL = '/v2/antrol/search';
    const ANTRL_SUB = 'sub=update_v2';
    const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
    function isAntrolCall(url, body) {
      const u = String(url ?? '');
      const b = String(body ?? '');
      return u.includes(ANTRL_URL) && u.includes(ANTRL_SUB) && b.includes('taskid=6');
    }
    function blockAutoAntrol() {
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this.__extUrl = String(url);
        return origOpen.apply(this, [method, url, ...rest]);
      };
      XMLHttpRequest.prototype.send = function (body) {
        if (isAntrolCall(this.__extUrl, body)) {
          console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
          return;
        }
        return origSend.apply(this, [body]);
      };
      const origFetch = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url =
          typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
        if (isAntrolCall(url, init?.body)) {
          console.log('[MORBIS Ext] antrol otomatis diblokir (pakai tombol Antrian & Cetak)');
          return Promise.resolve(new Response(null, { status: 200 }));
        }
        return origFetch(input, init);
      };
    }
    function registerAntrian(idVisit) {
      return fetch(`${ANTRL_URL}?${ANTRL_SUB}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(idVisit)}&taskid=6`,
        credentials: 'include',
      })
        .then((r) => {
          console.log('[MORBIS Ext] antrian terdaftar id=' + idVisit, 'status', r.status);
          return true;
        })
        .catch((e) => {
          console.warn('[MORBIS Ext] gagal mendaftarkan antrian', e);
          return false;
        });
    }
    async function resolveAntrianRow(idPasien, waktu) {
      try {
        const res = await fetch(LIST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: 'type=check_antrian',
          cache: 'no-store',
          credentials: 'include',
        });
        if (!res.ok) return null;
        const rows = await res.json();
        if (!Array.isArray(rows)) return null;
        const w = String(waktu ?? '').slice(0, 16);
        return (
          rows.find(
            (r) =>
              String(r.ID_PASIEN ?? '') === String(idPasien) &&
              (!w || String(r.WAKTU ?? '').slice(0, 16) === w),
          ) ??
          rows.find((r) => String(r.ID_PASIEN ?? '') === String(idPasien)) ??
          null
        );
      } catch {
        return null;
      }
    }
    async function onAntrianCetakClick(idVisit, nomorResep) {
      const ok = await registerAntrian(idVisit);
      if (!ok) {
        alert('[MORBIS Ext] Gagal mengantrikan resep. Coba lagi.');
        return;
      }
      const idPasien = document.querySelector('#id_pasien')?.value ?? '';
      const waktu = document.querySelector('#waktu_pengajuan')?.value ?? '';
      let row = null;
      for (let i = 0; i < 5 && !row; i++) {
        row = await resolveAntrianRow(idPasien, waktu);
        if (!row) await new Promise((r) => setTimeout(r, 400));
      }
      const antrianId = row ? String(row.ID ?? '') : idVisit;
      const issued = await assignPublicNumber(antrianId, row?.JENIS ?? null, waktu || null);
      if (!issued.code) {
        alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      const code = issued.code;
      const nama = document.querySelector('#nama_pasien')?.value ?? '';
      printKartuAntrian({
        nomorResep,
        nama: String(nama).toUpperCase(),
        jenis: String(row?.JENIS ?? ''),
        unit: String(row?.NAMA_UNIT ?? ''),
        tanggal: waktu ? waktu.slice(0, 10) : '',
        code,
      });
    }
    function addAntrianCetakButton() {
      const tryInject = () => {
        const saveBtn = document.querySelector('#save');
        if (!saveBtn || document.querySelector('#ext-antrian-cetak')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'ext-antrian-cetak';
        btn.textContent = 'Antrian & Cetak';
        btn.className = 'btn btn-success';
        btn.style.cssText = 'margin-left:6px;';
        btn.addEventListener('click', () => {
          const idVisit = document.querySelector('#id_visit')?.value ?? '';
          const nomorResep = document.querySelector('#nomor_resep')?.value ?? '';
          if (!idVisit || !nomorResep) {
            alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
            return;
          }
          btn.disabled = true;
          btn.textContent = 'Memproses\u2026';
          void onAntrianCetakClick(idVisit, nomorResep).finally(() => {
            btn.disabled = false;
            btn.textContent = 'Antrian & Cetak';
          });
        });
        saveBtn.insertAdjacentElement('afterend', btn);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInject, { once: true });
      } else {
        tryInject();
      }
      window.setTimeout(tryInject, 2e3);
      window.setTimeout(tryInject, 5e3);
    }
    blockAutoAntrol();
    addAntrianCetakButton();
  })();
})();
//# sourceMappingURL=farmasiAntrolShift.js.map
