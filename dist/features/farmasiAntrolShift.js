'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueueSync.ts
  var FARMASI_APP_BASE = 'http://dev.rsudkotajambi.id/rs';
  var cachedBase = null;
  var basePromise = null;
  async function storedBaseCandidates() {
    try {
      const result = await chrome.storage.sync.get('extensionCustomUrls');
      const urls = (result.extensionCustomUrls ?? []).filter((u) => u.url && u.enabled !== false);
      return urls.map((u) => u.url.replace(/\/+$/, '') + '/rs');
    } catch {
      return [];
    }
  }
  var FALLBACK_CANDIDATES = ['http://dev.rsudkotajambi.id/rs', 'http://103.147.236.138/rs'];
  function probeFarmasiAppBase() {
    if (basePromise) return basePromise;
    basePromise = (async () => {
      try {
        const ov = localStorage.getItem('ext-farmasi-app-base');
        if (ov && /^https?:\/\//.test(ov)) return ov.replace(/\/+$/, '');
      } catch {}
      const stored = await storedBaseCandidates();
      const candidates = [.../* @__PURE__ */ new Set([...stored, ...FALLBACK_CANDIDATES])];
      for (const base of candidates) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 2500);
          const res = await fetch(base + '/api/queue/lookup?resep_id=probe', {
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
          });
          clearTimeout(t);
          const ct = res.headers.get('content-type') || '';
          if ((res.status === 200 || res.status === 422) && ct.includes('application/json')) {
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
  if (window.__extAntrolShift) {
    throw new Error('skip double inject farmasiAntrolShift');
  }
  window.__extAntrolShift = true;
  function resolveNamaPasien() {
    const fromInput = document.querySelector('#nama_pasien')?.value?.trim();
    if (fromInput) return fromInput.toUpperCase();
    const fromNama = document.querySelector('#nama')?.value?.trim();
    if (fromNama) return fromNama.toUpperCase();
    const labeled = Array.from(document.querySelectorAll('th, td, label, strong, b, span'));
    for (const el of labeled) {
      const label = (el.textContent || '').trim();
      if (!/^nama\s*pasien$/i.test(label)) continue;
      const next =
        el.nextElementSibling ||
        el.parentElement?.querySelector('input, select') ||
        el.parentElement?.nextElementSibling;
      const val = (next?.textContent || next?.value || '').trim();
      if (val) return val.toUpperCase();
    }
    const PAGE_KEYWORDS =
      /(resep|penjualan|antrian|farmasi|penerimaan|pendaftaran|detail|edit|input|rekap|daftar|shift|cetak|pembayaran|penyerahan|racik|racikan|obat|kasir|pilih|aturan|pakai|dosis|jumlah|satuan|harga|total|biaya|unit|depo|kekuatan|tipe|standar|kronis|klaim|inacbgs|batch|aksi|tambah|selesai|hapus|kembali|simpan)/i;
    const headers = Array.from(document.querySelectorAll('h1, h2, h3, .page-title, .card-title'));
    for (const h of headers) {
      if (
        h.closest('.modal, .modal-header, .modal-body, .dropdown, .dropdown-menu, [role="dialog"]')
      ) {
        continue;
      }
      const t = (h.textContent || '').trim();
      if (!t || t.length < 4 || t.length > 60) continue;
      if (PAGE_KEYWORDS.test(t)) continue;
      const words = t.split(/\s+/).filter(Boolean);
      if (words.length < 2) continue;
      return t.toUpperCase();
    }
    return '';
  }
  async function lookupAntrian(resepId) {
    try {
      const res = await fetch(
        (await probeFarmasiAppBase()) + '/api/queue/lookup?resep_id=' + encodeURIComponent(resepId),
        { cache: 'no-store', credentials: 'omit' },
      );
      if (!res.ok) return null;
      const j = await res.json();
      if (!j.ok || !j.found || !j.queue?.queue_number) return null;
      return { queue_number: j.queue.queue_number, status: j.queue.status ?? '' };
    } catch {
      return null;
    }
  }
  async function lookupAntrianAny() {
    const candidates = [
      document.querySelector('#id_resep')?.value?.trim() || '',
      document.querySelector('input[name="nomor_resep"]')?.value?.trim() ||
        document.querySelector('input[name="id_resep"]')?.value?.trim() ||
        '',
      new URLSearchParams(location.search).get('id') ?? '',
    ].filter((v) => v && v.length >= 3);
    for (const c of candidates) {
      const info = await lookupAntrian(c);
      if (info) return info;
    }
    return null;
  }
  function isResepBatal(antrianStatus) {
    if (antrianStatus === 'DIBATALKAN') return true;
    try {
      const area = document.querySelector('#isi, .card, .panel, .form-horizontal, form, table');
      const root = area || document.body;
      const nodes = root.querySelectorAll('span, b, strong, td, .label, .badge, h3, h4');
      for (const el of nodes) {
        const t = (el.textContent || '').trim();
        if (!/^(batal|dibatalkan|resep batal|sudah dibatalkan)$/i.test(t)) continue;
        if (el.closest('button, input, a')) continue;
        return true;
      }
    } catch {}
    return false;
  }
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
    async function onAntrianCetakClick(idVisit, nomorResep, jenis) {
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
      const nama = resolveNamaPasien();
      const jenisLabel = jenis === 'racik' ? 'racikan' : 'tunggal';
      const sync = await pushQueueEvent({
        event_id:
          queueEventId('enq', antrianId, idVisit + '-' + jenisLabel) +
          '-' +
          Date.now().toString(36),
        event: 'ENQUEUE',
        resep_id: nomorResep,
        nama_pasien: nama,
        norm: idPasien || void 0,
        shift: '',
        jenis: jenisLabel,
        counter: '',
        payload: {
          idVisit,
          unit: String(row?.NAMA_UNIT ?? ''),
          waktu: waktu || '',
        },
      });
      if (!sync.ok) {
        alert('[MORBIS Ext] Gagal terhubung ke App Antrian. Coba lagi.');
        return;
      }
      const code = sync.queue_number || '';
      if (!code) {
        alert('[MORBIS Ext] Nomor antrian belum terbit. Coba lagi.');
        return;
      }
      printKartuAntrian({
        nomorResep,
        nama,
        jenis: jenisLabel,
        unit: String(row?.NAMA_UNIT ?? ''),
        tanggal: waktu ? waktu.slice(0, 10) : '',
        code,
      });
      renderActionBar('issued', code);
    }
    async function onBatalAntrian(code, nomorResep) {
      const sync = await pushQueueEvent({
        event_id: queueEventId('bat', nomorResep, code),
        event: 'BATAL',
        queue_number: code,
        resep_id: nomorResep,
      });
      if (!sync.ok) {
        const info = await lookupAntrianAny();
        if (!info) {
          renderActionBar('ready');
          return;
        }
        alert('[MORBIS Ext] Gagal membatalkan antrian. Coba lagi.');
        return;
      }
      renderActionBar('ready');
    }
    function getField(id, fallbackName) {
      const el =
        document.querySelector('#' + id) ||
        (fallbackName ? document.querySelector('input[name="' + fallbackName + '"]') : null);
      return (el?.value ?? '').trim();
    }
    function renderActionBar(state, code) {
      const bar = document.querySelector('#ext-antrian-bar');
      if (!bar) return;
      const nomorResep = getField('nomor_resep', 'id_resep');
      if (state === 'issued' && code) {
        bar.innerHTML =
          '<div style="display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 6px;"><span style="font-size:18px;font-weight:800;color:#198754;line-height:1.3;">\u2713 Sudah antri \u2014 ' +
          code +
          '</span><div style="display: flex; gap: 6px;"><button id="ext-antrian-cetak" class="btn" style="margin:0;background:#6c757d;color:#fff;border-color:#6c757d;" title="Cetak ulang kartu tanpa mengantrikan lagi">Cetak Kembali</button><button id="ext-antrian-batal" class="btn" style="margin:0;background:#dc3545;color:#fff;border-color:#dc3545;" title="Hapus antrian dari DB \u2014 resep bisa di-antrikan ulang">Batal antrian</button></div></div>';
        bar.querySelector('#ext-antrian-cetak')?.addEventListener('click', () => {
          if (!nomorResep) return;
          try {
            printKartuAntrian({
              nomorResep,
              nama: resolveNamaPasien(),
              jenis: '',
              unit: '',
              tanggal: '',
              code: code || '',
            });
          } catch {}
        });
        bar.querySelector('#ext-antrian-batal')?.addEventListener('click', () => {
          if (!confirm('Batalkan antrian ' + code + '? Resep akan keluar dari daftar panggilan.'))
            return;
          void onBatalAntrian(code || '', nomorResep);
        });
        return;
      }
      bar.innerHTML =
        '<button id="ext-antrian-racik" class="btn" style="margin:2px 6px 2px 0;background:#d97706;color:#fff;border-color:#d97706;" title="Antrikan sebagai obat RACIKAN (nomor R-XX)">Antrikan obat racik</button><button id="ext-antrian-tunggal" class="btn" style="margin:2px 0;background:#2193cf;color:#fff;border-color:#2193cf;" title="Antrikan sebagai obat TUNGGAL (nomor T-XX)">Antrikan obat tunggal</button>';
      const klik = (jenis) => {
        const idVisit = getField('id_visit');
        const nomorResep2 = getField('id_resep', 'nomor_resep');
        if (!idVisit || !nomorResep2) {
          alert('[MORBIS Ext] data resep belum dimuat. Coba lagi.');
          return;
        }
        const btn = document.querySelector(
          jenis === 'racik' ? '#ext-antrian-racik' : '#ext-antrian-tunggal',
        );
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Memproses\u2026';
        }
        void onAntrianCetakClick(idVisit, nomorResep2, jenis).finally(() => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = jenis === 'racik' ? 'Antrikan obat racik' : 'Antrikan obat tunggal';
          }
        });
      };
      bar.querySelector('#ext-antrian-racik')?.addEventListener('click', () => klik('racik'));
      bar.querySelector('#ext-antrian-tunggal')?.addEventListener('click', () => klik('tunggal'));
    }
    function addAntrianBar() {
      const findHost = () => {
        const td = Array.from(document.querySelectorAll('td[valign="top"]')).find((c) =>
          c.querySelector('fieldset#perhatian, fieldset[id="perhatian"]'),
        );
        if (!td) return null;
        const fieldset = document.createElement('fieldset');
        fieldset.id = 'ext-antrian-fieldset';
        fieldset.style.cssText = 'margin-top:6px;';
        fieldset.innerHTML = '<legend>Antrian Farmasi</legend>';
        const bar = document.createElement('div');
        bar.id = 'ext-antrian-bar';
        bar.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;';
        fieldset.appendChild(bar);
        td.appendChild(fieldset);
        return bar;
      };
      const tryInject = () => {
        const existing = document.querySelector('#ext-antrian-bar');
        const bar = existing || findHost();
        if (!bar) return;
        const check = (attempt) => {
          const nomorResep = getField('id_resep', 'nomor_resep');
          if (!nomorResep) {
            if (attempt < 10) window.setTimeout(() => check(attempt + 1), 800);
            else renderActionBar('ready');
            return;
          }
          void lookupAntrianAny().then((info) => {
            if (isResepBatal(info?.status)) {
              bar.innerHTML =
                '<span style="color:#b02a37;font-weight:700;">Resep dibatalkan \u2014 antrian tidak tersedia</span>';
              return;
            }
            if (info) {
              renderActionBar('issued', info.queue_number);
            } else if (attempt < 10) {
              window.setTimeout(() => check(attempt + 1), 800);
            } else {
              renderActionBar('ready');
            }
          });
        };
        check(0);
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
    addAntrianBar();
  })();
})();
//# sourceMappingURL=farmasiAntrolShift.js.map
