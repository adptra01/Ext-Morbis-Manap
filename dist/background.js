// MORBIS Ext Unofficial - background.js (Built with esbuild)
'use strict';
var __morbis_bg = (() => {
  var L = {
    GET_ALL: 'GET_ALL',
    GET_CONFIG: 'GET_CONFIG',
    GET_URLS: 'GET_URLS',
    SET_ROLE: 'SET_ROLE',
    TOGGLE_EXTENSION: 'TOGGLE_EXTENSION',
    TOGGLE_FEATURE: 'TOGGLE_FEATURE',
    CHANGE_FEATURE_MODE: 'CHANGE_FEATURE_MODE',
    RESET_CONFIG: 'RESET_CONFIG',
    ADD_URL: 'ADD_URL',
    DELETE_URL: 'DELETE_URL',
    TOGGLE_URL: 'TOGGLE_URL',
    OPEN_SIDE_PANEL: 'OPEN_SIDE_PANEL',
    CONFIG_CHANGED: 'CONFIG_CHANGED',
    PAGE_CONTEXT: 'PAGE_CONTEXT',
    GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
    TAB_ACTION: 'TAB_ACTION',
    TAB_ACTION_RESULT: 'TAB_ACTION_RESULT',
    BATCH_UPLOAD_ACTION: 'BATCH_UPLOAD_ACTION',
    BATCH_DELETE_ACTION: 'BATCH_DELETE_ACTION',
    PROXY_FETCH: 'PROXY_FETCH',
    TTS_LOCAL: 'TTS_LOCAL',
    LOG_TO_TELEGRAM: 'LOG_TO_TELEGRAM',
  };
  function O(n) {
    let s = `[MORBIS Ext] [${n}]`;
    return {
      log: (...t) => console.log(s, ...t),
      warn: (...t) => console.warn(s, ...t),
      error: (...t) => console.error(s, ...t),
    };
  }
  function C(n) {
    return n
      ? n
          .replace(/\b\d{2}-\d{2}-\d{2}\b/g, '[NO_RM_REDACTED]')
          .replace(/\b\d{6,16}\b/g, '[NUMERIC_DATA_REDACTED]')
      : '';
  }
  var d = O('Background'),
    p = new Map(),
    I = 5,
    D = 6e4;
  async function P(n, s, t) {}
  var G = 720 * 60 * 1e3,
    R = 'ttsCache:',
    w = 60;
  function k(n) {
    return R + n;
  }
  async function U(n) {
    try {
      let s = k(n),
        a = (await chrome.storage.local.get(s))[s];
      return a ? (Date.now() - a.ts > G ? (await chrome.storage.local.remove(s), null) : a) : null;
    } catch {
      return null;
    }
  }
  async function M(n, s, t) {
    try {
      let a = { mime: s, data: t, ts: Date.now() };
      await chrome.storage.local.set({ [k(n)]: a });
      let e = await chrome.storage.local.get(null),
        r = Object.keys(e).filter((i) => i.startsWith(R));
      if (r.length > w) {
        let i = r
          .map((o) => ({ k: o, ts: e[o].ts }))
          .sort((o, l) => o.ts - l.ts)
          .slice(0, r.length - w);
        await chrome.storage.local.remove(i.map((o) => o.k));
      }
    } catch {}
  }
  async function x() {
    try {
      let n = await chrome.storage.local.get(null),
        s = Date.now(),
        t = Object.entries(n)
          .filter(([a, e]) => a.startsWith(R) && s - e.ts > G)
          .map(([a]) => a);
      t.length > 0 && (await chrome.storage.local.remove(t));
    } catch {}
  }
  var A = new Map(),
    u = 'extensionConfig',
    f = 'extensionCustomUrls',
    h = {
      CASEMIX: 'casemix',
      KASIR: 'kasir',
      DOKTER: 'dokter',
      APOTEK: 'apotek',
      ADMIN: 'admin',
      LABOR: 'labor',
      PENDAFTARAN: 'pendaftaran',
    },
    b = [
      { id: 'default-1', url: 'http://192.168.8.4', enabled: !0, isDefault: !0 },
      { id: 'default-2', url: 'http://103.147.236.140', enabled: !0, isDefault: !0 },
    ],
    T = {
      extensionEnabled: !0,
      currentRole: 'admin',
      features: {
        openDetailInNewTab: {
          enabled: !0,
          name: 'Open Detail Mode',
          description: 'Pilih mode buka detail: tab baru / tab sama',
          allowedRoles: ['casemix'],
          mode: 'same-tab',
          modes: { 'same-tab': 'Buka di Tab Sama (Default)', 'new-tab': 'Buka di Tab Baru' },
        },
        shortcutButtons: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Shortcut Buttons',
          description: 'Tampilkan tombol shortcut ke pelaksanaan Rajal/Ranap',
        },
        filterPersistence: {
          enabled: !0,
          allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
          name: 'Filter Persistence State',
          description: 'Simpan otomatis kolom pencarian agar tidak perlu diketik ulang',
        },
        scrollButtons: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Scroll Buttons (Top/Bottom)',
          description: 'Tombol scroll otomatis ke atas dan bawah halaman detail',
        },
        batchUpload: {
          enabled: !1,
          allowedRoles: ['casemix'],
          name: 'Upload Dokumen Ulang',
          description: 'Upload batch dokumen via paste URL dengan metadata extraction otomatis',
        },
        batchDelete: {
          enabled: !1,
          allowedRoles: ['casemix'],
          name: 'Batch Delete Dokumen',
          description: 'Hapus dokumen yang sudah diupload (safety measures)',
        },
        billingFilterPersistence: {
          enabled: !0,
          allowedRoles: ['kasir', 'casemix'],
          name: 'Billing Filter Persistence',
          description: 'Simpan otomatis filter verifikasi billing agar tidak perlu diketik ulang',
        },
        doctorFilterPersistence: {
          enabled: !0,
          allowedRoles: ['casemix', 'kasir', 'dokter', 'apotek'],
          name: 'Doctor Filter Persistence',
          description: 'Simpan otomatis filter pelaksanaan dokter agar tidak perlu diketik ulang',
        },
        resepTools: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Resep Tools',
          description: 'Validasi aturan pakai, UI dosis kondisional, print safety lock',
        },
        fixJasaPelayanan: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Fix Jasa Pelayanan Reset',
          description: 'Cegah reset otomatis kolom Jasa Pelayanan ke 0 pada penjualan bebas',
        },
        consultationEnhancer: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Konsultasi Enhancer',
          description:
            'Tampilkan tabel konsultasi dengan DataTables, modal detail, dan info pasien',
        },
        cpptSearchFilter: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'CPPT Search & Filter',
          description: 'Cari dan filter data CPPT berdasarkan dokter & tanggal (RAJAL/RANAP)',
        },
        resumeValidator: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'Resume Validator',
          description: 'Validasi ketat form resume rawat inap agar tidak gagal simpan tanpa error',
        },
        antrianTools: {
          enabled: !0,
          allowedRoles: ['admin', 'pendaftaran'],
          name: 'Antrian Tools',
          description:
            'Penomoran unik per loket (L1-001), polling layar antrian, auto cetak, fullscreen',
        },
        antrianFarmasi: {
          enabled: !0,
          allowedRoles: ['apotek'],
          name: 'Antrian Farmasi Voice',
          description:
            'Display farmasi: fallback polling saat WS mati + TTS panggil pasien (nomor + nama + depo, 2\xD7)',
        },
        ttvEditor: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'TTV Editor (Surat Pengantar)',
          description: 'Buka field TTV read-only jadi editable di Surat Transfer Pasien Internal',
        },
        resumeModal: {
          enabled: !0,
          allowedRoles: ['casemix'],
          name: 'Resume Rajal Tab',
          description: 'Tab resume rawat jalan di halaman detail M-KLAIM',
        },
        resumeRanap: {
          enabled: !0,
          allowedRoles: ['casemix', 'dokter'],
          name: 'Resume Ranap Tab',
          description: 'Popup edit resume rawat inap di halaman detail M-KLAIM',
        },
        labHistory: {
          enabled: !0,
          allowedRoles: ['labor'],
          name: 'Riwayat Permintaan Lab',
          description: 'Tombol lihat riwayat permintaan lab di halaman input hasil',
        },
        labDataTables: {
          enabled: !1,
          allowedRoles: ['labor', 'kasir', 'admin'],
          name: 'DataTables Input Hasil Lab',
          description: 'Search, pagination, page length, dan tampilan rapi untuk tabel hasil lab',
        },
        radiologiDataTables: {
          enabled: !1,
          allowedRoles: ['admin', 'dokter'],
          name: 'DataTables Radiologi',
          description: 'Search, pagination, page length, dan tampilan rapi untuk tabel radiologi',
        },
        konsulDataTables: {
          enabled: !1,
          allowedRoles: ['casemix'],
          name: 'DataTables Konsultasi',
          description: 'Search, pagination, page length untuk tabel jawaban konsultasi',
        },
        laporanKasirTime: {
          enabled: !0,
          allowedRoles: ['kasir', 'admin'],
          name: 'Laporan Kasir Time Integration',
          description:
            'Flatpickr datetime, auto-fill kemarin/hari ini 12:00, tampilkan waktu di tabel',
        },
        cancelBatal: {
          enabled: !1,
          allowedRoles: ['admin'],
          name: 'Tombol Batal (Lab & Radiologi)',
          description: 'Tambahkan tombol Batal pada tab Sudah Diinput di Lab dan Radiologi',
        },
      },
    };
  function F(n) {
    if (!n || !n.features) return structuredClone(T);
    let s = Object.keys(T.features),
      t = {};
    for (let e of s)
      n.features[e]
        ? (t[e] = structuredClone(n.features[e]))
        : (t[e] = structuredClone(T.features[e]));
    let a = Object.values(h);
    for (let e of s) {
      let r = T.features[e].allowedRoles,
        i = t[e].allowedRoles;
      !Array.isArray(i) || i.length === 0
        ? (t[e].allowedRoles = [...r])
        : i.filter((l) => !a.includes(l)).length > 0 &&
          (t[e].allowedRoles = i.filter((l) => a.includes(l)));
    }
    for (let e of ['filterPersistence', 'doctorFilterPersistence'])
      t[e] && (t[e].allowedRoles = [...Object.values(h)]);
    if (t.antrianTools) {
      let e = t.antrianTools;
      for (let r of ['admin', 'pendaftaran']) e.allowedRoles.includes(r) || e.allowedRoles.push(r);
    }
    return (
      n.currentRole || (n.currentRole = 'admin'),
      a.includes(n.currentRole) || (n.currentRole = 'admin'),
      (n.features = t),
      n
    );
  }
  async function g() {
    try {
      let n = await chrome.storage.sync.get(u);
      if (!n[u]) {
        let t = structuredClone(T);
        return (await chrome.storage.sync.set({ [u]: t }), t);
      }
      let s = F(structuredClone(n[u]));
      return (await chrome.storage.sync.set({ [u]: s }), s);
    } catch (n) {
      return (d.error('Error loading config:', n), structuredClone(T));
    }
  }
  async function _() {
    try {
      let n = await chrome.storage.sync.get(f);
      if (!n[f]) {
        let a = structuredClone(b);
        return (await chrome.storage.sync.set({ [f]: a }), a);
      }
      let s = n[f],
        t = structuredClone(b);
      return (
        s.forEach((a) => {
          a.isDefault || t.push(a);
        }),
        t.forEach((a) => {
          let e = s.find((r) => r.id === a.id);
          e && a.isDefault && (a.enabled = e.enabled);
        }),
        t
      );
    } catch (n) {
      return (d.error('Error loading URLs:', n), structuredClone(b));
    }
  }
  async function m() {
    let [n, s] = await Promise.all([chrome.tabs.query({}), _()]),
      t = s.filter((a) => a.enabled).map((a) => a.url);
    if (t.length !== 0)
      for (let a of n)
        a.id &&
          a.url &&
          t.some((e) => a.url.startsWith(e)) &&
          chrome.tabs.sendMessage(a.id, { type: 'CONFIG_CHANGED' }).catch(() => {});
  }
  chrome.runtime.onMessage.addListener((n, s, t) => {
    let a = X(n);
    if (!a) return (t({ error: 'Invalid message' }), !1);
    switch ((v(a.type), a.type)) {
      case 'GET_ALL':
        return (
          (async () => {
            let [e, r] = await Promise.all([g(), _()]);
            t({ config: e, urls: r, defaultConfig: T });
          })(),
          !0
        );
      case 'GET_CONFIG':
        return (g().then((e) => t({ config: e })), !0);
      case 'GET_URLS':
        return (_().then((e) => t({ urls: e })), !0);
      case 'SET_ROLE':
        return (
          (async () => {
            let e = await g();
            ((e.currentRole = a.role),
              await chrome.storage.sync.set({ [u]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_EXTENSION':
        return (
          (async () => {
            let e = await g();
            ((e.extensionEnabled = a.enabled),
              await chrome.storage.sync.set({ [u]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_FEATURE':
        return (
          (async () => {
            let e = await g();
            (e.features[a.key] &&
              ((e.features[a.key].enabled = a.enabled),
              await chrome.storage.sync.set({ [u]: e }),
              m()),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'CHANGE_FEATURE_MODE':
        return (
          (async () => {
            let e = await g();
            (e.features[a.key] &&
              ((e.features[a.key].mode = a.mode), await chrome.storage.sync.set({ [u]: e })),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'RESET_CONFIG':
        return (
          (async () => (
            await chrome.storage.sync.set({ [u]: structuredClone(T) }),
            m(),
            t({ success: !0 })
          ))(),
          !0
        );
      case 'ADD_URL':
        return (
          (async () => {
            let e = await _();
            (e.push({
              id: 'url-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
              url: a.url,
              enabled: !0,
              isDefault: !1,
            }),
              await chrome.storage.sync.set({ [f]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'DELETE_URL':
        return (
          (async () => {
            let e = await _();
            ((e = e.filter((r) => r.id !== a.id || r.isDefault)),
              await chrome.storage.sync.set({ [f]: e }),
              m(),
              t({ success: !0 }));
          })(),
          !0
        );
      case 'TOGGLE_URL':
        return (
          (async () => {
            let e = await _();
            for (let r of e) r.id === a.id && (r.enabled = a.enabled);
            (await chrome.storage.sync.set({ [f]: e }), m(), t({ success: !0 }));
          })(),
          !0
        );
      case 'OPEN_SIDE_PANEL':
        return (
          (async () => {
            let e = s.tab;
            (e?.id && (await chrome.sidePanel.open({ tabId: e.id })), t({ success: !0 }));
          })(),
          !0
        );
      case 'PAGE_CONTEXT': {
        let e = s.tab?.id;
        if (e && a.feature) {
          let r = a;
          (A.set(e, { feature: a.feature, data: r.data }),
            d.log('Page context stored for tab', e, ':', a.feature));
        }
        return (t({ success: !0 }), !0);
      }
      case 'GET_PAGE_CONTEXT':
        return (
          (async () => {
            let r = (await chrome.tabs.query({ active: !0, currentWindow: !0 }))[0]?.id;
            r && A.has(r) ? t({ context: A.get(r) }) : t({ context: null });
          })(),
          !0
        );
      case 'PROXY_FETCH':
        return (
          (async () => {
            try {
              let { url: e, method: r = 'GET', data: i } = a,
                o = e,
                l = { method: r, credentials: 'include' };
              if (i && typeof i == 'object') {
                let c = new URLSearchParams(i);
                r === 'POST'
                  ? ((l.body = c),
                    (l.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }))
                  : (o += '?' + c.toString());
              }
              let E = await (await fetch(o, l)).text();
              t({ success: !0, html: E });
            } catch (e) {
              t({ success: !1, error: String(e) });
            }
          })(),
          !0
        );
      case 'TTS_LOCAL':
        return (
          (async () => {
            try {
              let { text: e } = a,
                r = await U(e);
              if (r) {
                t({ ok: !0, mime: r.mime, data: r.data });
                return;
              }
              let i = async (l, y = 5e3) => {
                  let E = await fetch(l, { mode: 'cors', signal: AbortSignal.timeout(y) });
                  if (!E.ok) throw new Error('http ' + E.status);
                  let c = await E.arrayBuffer();
                  if (!c || c.byteLength === 0) throw new Error('empty');
                  return {
                    mime: E.headers.get('content-type') || 'audio/mpeg',
                    data: Array.from(new Uint8Array(c)),
                  };
                },
                o;
              try {
                o = await i('http://127.0.0.1:8765/tts?text=' + encodeURIComponent(e), 3e3);
              } catch {
                let l =
                  'https://morbis-antrian-relay.testingbae66.workers.dev/?text=' +
                  encodeURIComponent(e) +
                  '&lang=id';
                o = await i(l);
              }
              (M(e, o.mime, o.data), t({ ok: !0, mime: o.mime, data: o.data }));
            } catch (e) {
              t({ ok: !1, reason: 'worker-fetch ' + String(e).slice(0, 60) });
            }
          })(),
          !0
        );
      case 'TAB_ACTION':
        return (
          (async () => {
            let e = a.tabId;
            if (!e) {
              t({ success: !1 });
              return;
            }
            try {
              (await chrome.tabs.sendMessage(e, a), t({ success: !0 }));
            } catch (r) {
              (d.log('TAB_ACTION forward failed:', r), t({ success: !1 }));
            }
          })(),
          !0
        );
      case 'TAB_ACTION_RESULT':
        return (chrome.runtime.sendMessage(a).catch(() => {}), t({ success: !0 }), !0);
      case 'LOG_TO_TELEGRAM': {
        let e = a;
        return (
          P(e.level ?? 'error', e.feature ?? 'unknown', e.message ?? ''),
          t({ success: !0 }),
          !0
        );
      }
      default:
        return !1;
    }
  });
  var B = 1;
  chrome.runtime.onInstalled.addListener(function () {
    (chrome.alarms.create('morbis-heartbeat', { periodInMinutes: B }),
      chrome.alarms.create('morbis-state-sync', { periodInMinutes: 5 }),
      d.log('Heartbeat and state-sync alarms registered'));
  });
  chrome.alarms.onAlarm.addListener(function (n) {
    (n.name === 'morbis-heartbeat' && d.log('Heartbeat: SW alive'),
      n.name === 'morbis-state-sync' && (N().catch(function () {}), x().catch(function () {})));
  });
  async function N() {
    try {
      let n = await g();
      await chrome.storage.session.set({
        lastHeartbeat: Date.now(),
        lastSync: Date.now(),
        currentRole: n.currentRole,
        extensionEnabled: n.extensionEnabled,
      });
    } catch (n) {
      d.error('State sync failed:', n);
    }
  }
  async function v(n) {
    [
      'SET_ROLE',
      'TOGGLE_EXTENSION',
      'TOGGLE_FEATURE',
      'CHANGE_FEATURE_MODE',
      'RESET_CONFIG',
    ].includes(n) && (await N());
  }
  var H = Object.values(L).filter((n) => n !== 'CONFIG_CHANGED');
  function X(n) {
    if (!n || typeof n != 'object') return null;
    let s = n;
    return typeof s.type != 'string' || !H.includes(s.type) ? null : s;
  }
  chrome.action.onClicked.addListener(function (n) {
    n.id && chrome.sidePanel.open({ tabId: n.id }).catch(function () {});
  });
  d.log('Service worker started');
})();
