import {
  _ as e,
  a as t,
  b as n,
  c as r,
  d as i,
  f as a,
  g as o,
  h as s,
  i as c,
  l,
  m as u,
  n as d,
  o as f,
  p,
  r as m,
  s as h,
  t as g,
  u as _,
  v,
  y,
} from './chunks/button-oeVl7aqx.js';
var b = v(),
  x = n(y(), 1);
function S() {
  let [e, t] = (0, x.useState)(() => (typeof chrome < `u` && chrome.storage?.sync, `system`)),
    [n, r] = (0, x.useState)(!1);
  (0, x.useEffect)(() => {
    chrome.storage.sync.get(`md-theme`, (e) => {
      let n = e[`md-theme`] || `system`;
      (t(n), i(n));
    });
  }, []);
  let i = (0, x.useCallback)((e) => {
      let t;
      ((t =
        e === `system` ? window.matchMedia(`(prefers-color-scheme: dark)`).matches : e === `dark`),
        document.documentElement.classList.toggle(`dark`, t),
        r(t));
    }, []),
    a = (0, x.useCallback)(
      (e) => {
        (t(e), i(e), chrome.storage.sync.set({ 'md-theme': e }));
      },
      [i],
    );
  return (
    (0, x.useEffect)(() => {
      let t = window.matchMedia(`(prefers-color-scheme: dark)`),
        n = () => {
          e === `system` && i(`system`);
        };
      return (t.addEventListener(`change`, n), () => t.removeEventListener(`change`, n));
    }, [e, i]),
    { theme: e, resolved: n, setTheme: a }
  );
}
var C = s(),
  w = {
    default: `md-badge--primary`,
    success: `md-badge--green`,
    warning: `md-badge--amber`,
    danger: `md-badge--red`,
  };
function T({ className: e, variant: t = `default`, children: n, ...r }) {
  return (0, C.jsx)(`span`, { className: p(`md-badge`, w[t], e), ...r, children: n });
}
var E = [
  { value: `casemix`, label: `Casemix` },
  { value: `kasir`, label: `Kasir` },
  { value: `dokter`, label: `Dokter` },
  { value: `apotek`, label: `Apotek` },
  { value: `admin`, label: `Admin` },
];
function D({ value: e, onChange: n }) {
  return (0, C.jsxs)(m, {
    value: e,
    onValueChange: (e) => n(e),
    children: [
      (0, C.jsx)(f, { className: `w-[120px]`, children: (0, C.jsx)(h, {}) }),
      (0, C.jsx)(c, {
        children: E.map((e) => (0, C.jsx)(t, { value: e.value, children: e.label }, e.value)),
      }),
    ],
  });
}
function O({ enabled: e, role: t, onToggle: n, onRoleChange: r }) {
  return (0, C.jsxs)(`div`, {
    className: `md-card p-3 flex items-center justify-between`,
    children: [
      (0, C.jsxs)(`div`, {
        className: `flex items-center gap-3`,
        children: [
          (0, C.jsx)(a, { checked: e, onCheckedChange: n }),
          (0, C.jsxs)(`div`, {
            children: [
              (0, C.jsxs)(`div`, {
                className: `flex items-center gap-2`,
                children: [
                  (0, C.jsx)(`span`, {
                    className: `text-md-sm font-semibold text-foreground`,
                    children: `MORBIS Ext`,
                  }),
                  e && (0, C.jsx)(T, { variant: `success`, children: `Aktif` }),
                ],
              }),
              (0, C.jsx)(`p`, {
                className: `text-md-xs text-muted-foreground mt-0.5`,
                children: e ? `Extension aktif di halaman ini` : `Extension tidak aktif`,
              }),
            ],
          }),
        ],
      }),
      (0, C.jsx)(D, { value: t, onChange: (e) => r(e) }),
    ],
  });
}
function k({ features: e, enabledFeatures: t, role: n, onToggle: r }) {
  let i = e.filter((e) => e.roles.includes(n)),
    a = i.filter((e) => t[e.key]).length;
  return (0, C.jsxs)(`div`, {
    children: [
      (0, C.jsx)(`div`, {
        className: `flex items-center justify-between mb-3`,
        children: (0, C.jsxs)(`p`, {
          className: `text-md-xs text-[var(--md-gray-500)] font-medium`,
          children: [a, ` dari `, i.length, ` aktif`],
        }),
      }),
      i.length === 0 &&
        (0, C.jsx)(`div`, {
          className: `text-center py-8`,
          children: (0, C.jsx)(`p`, {
            className: `text-md-sm text-[var(--md-gray-400)]`,
            children: `Tidak ada fitur untuk role ini`,
          }),
        }),
      (0, C.jsx)(`div`, {
        className: `space-y-0.5`,
        children: i.map((e) => {
          let n = !!t[e.key];
          return (0, C.jsxs)(
            `div`,
            {
              className: `
                flex items-center justify-between px-3 py-2.5 rounded-md
                ${n ? `bg-[var(--md-gray-50)]` : ``}
                ${e.comingSoon ? `opacity-60` : `cursor-pointer hover:bg-[var(--md-gray-50)]`}
              `,
              onClick: () => {
                e.comingSoon || r(e.key, !n);
              },
              children: [
                (0, C.jsxs)(`div`, {
                  className: `flex-1 min-w-0 mr-3`,
                  children: [
                    (0, C.jsxs)(`div`, {
                      className: `flex items-center gap-2`,
                      children: [
                        (0, C.jsx)(`span`, {
                          className: `text-md-sm font-medium text-[var(--md-gray-800)]`,
                          children: e.name,
                        }),
                        e.comingSoon &&
                          (0, C.jsx)(`span`, {
                            className: `md-badge md-badge--amber`,
                            children: `CS`,
                          }),
                      ],
                    }),
                    (0, C.jsx)(`p`, {
                      className: `text-md-xs text-[var(--md-gray-500)] mt-0.5 truncate`,
                      children: e.desc,
                    }),
                  ],
                }),
                (0, C.jsx)(`button`, {
                  type: `button`,
                  role: `switch`,
                  'aria-checked': n,
                  onClick: (t) => {
                    (t.stopPropagation(), e.comingSoon || r(e.key, !n));
                  },
                  className: `
                  relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2469f0] focus:ring-offset-1
                  ${n ? `bg-[#2469f0]` : `bg-[var(--md-gray-200)]`}
                `,
                  children: (0, C.jsx)(`span`, {
                    className: `
                    pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
                    transition duration-200 ease-in-out
                    ${n ? `translate-x-4` : `translate-x-0`}
                  `,
                  }),
                }),
              ],
            },
            e.key,
          );
        }),
      }),
    ],
  });
}
function A({ urls: e, onAdd: t, onRemove: n, onToggle: o }) {
  let [s, c] = (0, x.useState)(``),
    l = () => {
      let e = s.trim();
      e && (t(e), c(``));
    };
  return (0, C.jsxs)(`div`, {
    className: `space-y-3`,
    children: [
      (0, C.jsxs)(`div`, {
        className: `flex gap-2`,
        children: [
          (0, C.jsx)(d, {
            type: `text`,
            value: s,
            onChange: (e) => c(e.target.value),
            onKeyDown: (e) => e.key === `Enter` && l(),
            placeholder: `http://192.168.1.100`,
            className: `flex-1`,
          }),
          (0, C.jsxs)(g, {
            variant: `default`,
            size: `sm`,
            onClick: l,
            children: [(0, C.jsx)(i, { className: `size-3.5` }), `Add`],
          }),
        ],
      }),
      e.length === 0 &&
        (0, C.jsx)(`div`, {
          className: `text-center py-8`,
          children: (0, C.jsx)(`p`, {
            className: `text-md-sm text-muted-foreground`,
            children: `Belum ada domain`,
          }),
        }),
      (0, C.jsx)(`div`, {
        className: `space-y-1`,
        children: e.map((e) =>
          (0, C.jsxs)(
            `div`,
            {
              className: `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent group`,
              children: [
                (0, C.jsx)(a, { checked: e.enabled, onCheckedChange: (t) => o(e.id, t) }),
                (0, C.jsx)(`span`, {
                  className: `flex-1 text-md-sm text-foreground truncate font-mono text-md-xs`,
                  children: e.url,
                }),
                (0, C.jsx)(`button`, {
                  onClick: () => n(e.id),
                  'aria-label': `Hapus ${e.url}`,
                  className: `opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1`,
                  title: `Hapus`,
                  children: (0, C.jsx)(r, { className: `size-3.5` }),
                }),
              ],
            },
            e.id,
          ),
        ),
      }),
    ],
  });
}
function j({ onReload: e, onReset: t }) {
  return (0, C.jsxs)(`div`, {
    className: `flex items-center justify-between px-4 py-3 border-t border-border`,
    children: [
      (0, C.jsxs)(g, {
        variant: `ghost`,
        size: `sm`,
        onClick: e,
        children: [(0, C.jsx)(_, { className: `size-3.5` }), `Reload Halaman`],
      }),
      (0, C.jsxs)(g, {
        variant: `ghost`,
        size: `sm`,
        onClick: t,
        children: [(0, C.jsx)(l, { className: `size-3.5` }), `Reset Default`],
      }),
    ],
  });
}
var M = [
    {
      key: `openDetail`,
      name: `Open Detail`,
      desc: `Buka detail di tab baru`,
      roles: [`casemix`, `kasir`, `dokter`, `admin`],
    },
    {
      key: `shortcutButtons`,
      name: `Shortcut Buttons`,
      desc: `Tombol akses cepat di tabel`,
      roles: [`casemix`, `kasir`, `admin`],
    },
    {
      key: `filterPersistence`,
      name: `Filter Persistence`,
      desc: `Simpan state filter`,
      roles: [`casemix`, `kasir`, `apotek`, `dokter`, `admin`],
    },
    {
      key: `simplifyBilling`,
      name: `Simplify Billing`,
      desc: `Tampilan billing lebih bersih`,
      roles: [`kasir`],
    },
    {
      key: `scrollButtons`,
      name: `Scroll Buttons`,
      desc: `Tombol scroll cepat`,
      roles: [`casemix`, `kasir`, `apotek`, `dokter`, `admin`],
    },
    {
      key: `printOptimization`,
      name: `Print Optimization`,
      desc: `Optimasi tampilan print`,
      roles: [`casemix`, `kasir`, `apotek`, `dokter`, `admin`],
    },
    {
      key: `batchUploadUrl`,
      name: `Batch Upload URL`,
      desc: `Upload URL berkas`,
      roles: [`casemix`, `admin`],
    },
    {
      key: `resumeValidator`,
      name: `Resume Validator`,
      desc: `Validasi resume rawat inap`,
      roles: [`casemix`, `dokter`],
    },
    {
      key: `resumeTab`,
      name: `Resume Rajal`,
      desc: `Edit resume rawat jalan`,
      roles: [`casemix`, `dokter`],
    },
    { key: `ttvEditor`, name: `TTV Editor`, desc: `Edit tanda vital`, roles: [`dokter`, `admin`] },
    { key: `antrianTools`, name: `Antrian Tools`, desc: `Tools halaman antrian`, roles: [`admin`] },
    {
      key: `autoVerifBilling`,
      name: `Auto Verif Billing`,
      desc: `Verifikasi billing otomatis`,
      roles: [`kasir`, `admin`],
    },
    {
      key: `consultationEnhancer`,
      name: `Konsultasi`,
      desc: `Enhancer halaman konsultasi`,
      roles: [`dokter`],
    },
    { key: `batchDeleteFiles`, name: `Batch Delete`, desc: `Hapus file massal`, roles: [`admin`] },
    {
      key: `fixJasaPelayanan`,
      name: `Fix Jasa Pelayanan`,
      desc: `Perbaikan jasa pelayanan`,
      roles: [`admin`],
    },
    {
      key: `doctorFilterPersistence`,
      name: `Doctor Filter`,
      desc: `Simpan filter dokter`,
      roles: [`dokter`],
    },
    {
      key: `billingFilterPersistence`,
      name: `Billing Filter`,
      desc: `Simpan filter billing`,
      roles: [`kasir`],
    },
    {
      key: `penerimaanResep`,
      name: `Penerimaan Resep`,
      desc: `Tools penerimaan resep`,
      roles: [`admin`],
    },
  ],
  N = [
    { id: `default-1`, url: `http://103.147.236.140`, enabled: !0, isDefault: !0 },
    { id: `default-2`, url: `http://192.168.8.4`, enabled: !0, isDefault: !0 },
  ];
function P() {
  let [t, n] = (0, x.useState)(!0),
    [r, i] = (0, x.useState)(`casemix`),
    [a, s] = (0, x.useState)(`features`),
    [c, l] = (0, x.useState)({}),
    [d, f] = (0, x.useState)(M),
    [p, m] = (0, x.useState)(N),
    [h, g] = (0, x.useState)(null),
    { theme: _, resolved: v, setTheme: y } = S();
  (0, x.useEffect)(() => {
    e({ type: o.GET_ALL })
      .then((e) => {
        if (e?.config) {
          (n(e.config.extensionEnabled), i(e.config.currentRole));
          let t = {};
          for (let [n, r] of Object.entries(e.config.features || {})) t[n] = r.enabled ?? !1;
          (l(t),
            e.config.features &&
              f(
                Object.entries(e.config.features).map(([e, t]) => ({
                  key: e,
                  name: t.name || e,
                  desc: t.description || ``,
                  roles: t.allowedRoles || [],
                })),
              ));
        }
        e?.urls && m(e.urls);
      })
      .catch(() => {
        chrome.storage.sync.get([`extensionConfig`, `extensionCustomUrls`], (e) => {
          if (e.extensionConfig) {
            (n(e.extensionConfig.extensionEnabled), i(e.extensionConfig.currentRole));
            let t = {};
            for (let [n, r] of Object.entries(e.extensionConfig.features || {}))
              t[n] = r.enabled ?? !1;
            (l(t),
              e.extensionConfig.features &&
                f(
                  Object.entries(e.extensionConfig.features).map(([e, t]) => ({
                    key: e,
                    name: t.name || e,
                    desc: t.description || ``,
                    roles: t.allowedRoles || [],
                  })),
                ));
          }
          e.extensionCustomUrls && m(e.extensionCustomUrls);
        });
      });
  }, []);
  let b = (0, x.useCallback)((e) => {
      (g(e), setTimeout(() => g(null), 2500));
    }, []),
    w = (0, x.useCallback)(() => {
      let r = !t;
      (n(r),
        e({ type: o.TOGGLE_EXTENSION, enabled: r }).catch(() =>
          b(`Gagal mengubah status extension`),
        ),
        b(r ? `Extension diaktifkan` : `Extension dinonaktifkan`));
    }, [t, b]),
    T = (0, x.useCallback)(
      (t) => {
        (i(t), e({ type: o.SET_ROLE, role: t }).catch(() => b(`Gagal mengubah role`)));
      },
      [b],
    ),
    E = (0, x.useCallback)(
      (t, n) => {
        (l({ ...c, [t]: n }),
          e({ type: o.TOGGLE_FEATURE, key: t, enabled: n }).catch(() => b(`Gagal mengubah fitur`)),
          b(n ? `${t} diaktifkan` : `${t} dinonaktifkan`));
      },
      [c, b],
    ),
    D = (0, x.useCallback)(
      (t) => {
        let n = `url-` + Date.now();
        (m([...p, { id: n, url: t, enabled: !0, isDefault: !1 }]),
          e({ type: o.ADD_URL, url: t }).catch(() => b(`Gagal menambah domain`)),
          b(`Domain ditambahkan`));
      },
      [p, b],
    ),
    P = (0, x.useCallback)(
      (t) => {
        (m(p.filter((e) => e.id !== t)),
          e({ type: o.DELETE_URL, id: t }).catch(() => b(`Gagal menghapus domain`)),
          b(`Domain dihapus`));
      },
      [p, b],
    ),
    F = (0, x.useCallback)(
      (t, n) => {
        (m(p.map((e) => (e.id === t ? { ...e, enabled: n } : e))),
          e({ type: o.TOGGLE_URL, id: t, enabled: n }).catch(() => b(`Gagal mengubah domain`)));
      },
      [p, b],
    ),
    I = (0, x.useCallback)(() => {
      chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
        e[0]?.id && chrome.tabs.reload(e[0].id);
      });
    }, []),
    L = (0, x.useCallback)(() => {
      confirm(`Apakah Anda yakin ingin mereset ke pengaturan default?`) &&
        e({ type: o.RESET_CONFIG })
          .then(() => {
            (l({}), m(N), i(`casemix`), n(!0), b(`Reset ke default`), I());
          })
          .catch(() => {
            b(`Gagal mereset konfigurasi`);
          });
    }, [I, b]);
  return (0, C.jsx)(u, {
    children: (0, C.jsxs)(`div`, {
      className: `flex flex-col h-full bg-white dark:bg-[var(--md-gray-900)]`,
      children: [
        (0, C.jsxs)(`div`, {
          className: `flex items-center justify-between px-4 py-2.5 border-b border-[var(--md-gray-200)]`,
          children: [
            (0, C.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, C.jsx)(`div`, {
                  className: `w-6 h-6 rounded-md bg-[#2469f0] flex items-center justify-center`,
                  children: (0, C.jsx)(`span`, {
                    className: `text-white text-md-xs font-bold`,
                    children: `M`,
                  }),
                }),
                (0, C.jsx)(`span`, {
                  className: `text-md-sm font-semibold text-[var(--md-gray-800)]`,
                  children: `MORBIS Ext`,
                }),
                (0, C.jsx)(`span`, { className: `md-badge md-badge--primary`, children: `v1.2` }),
              ],
            }),
            (0, C.jsx)(`div`, {
              className: `flex items-center gap-1`,
              children: (0, C.jsx)(`button`, {
                onClick: () => y(_ === `dark` ? `light` : `dark`),
                className: `p-1.5 rounded-md text-[var(--md-gray-400)] hover:text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] transition-colors`,
                title: `Toggle dark mode`,
                children: v
                  ? (0, C.jsxs)(`svg`, {
                      width: `16`,
                      height: `16`,
                      viewBox: `0 0 24 24`,
                      fill: `none`,
                      stroke: `currentColor`,
                      strokeWidth: `2`,
                      children: [
                        (0, C.jsx)(`circle`, { cx: `12`, cy: `12`, r: `5` }),
                        (0, C.jsx)(`path`, {
                          d: `M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42`,
                        }),
                      ],
                    })
                  : (0, C.jsx)(`svg`, {
                      width: `16`,
                      height: `16`,
                      viewBox: `0 0 24 24`,
                      fill: `none`,
                      stroke: `currentColor`,
                      strokeWidth: `2`,
                      children: (0, C.jsx)(`path`, {
                        d: `M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z`,
                      }),
                    }),
              }),
            }),
          ],
        }),
        (0, C.jsx)(`div`, {
          className: `px-4 py-3`,
          children: (0, C.jsx)(O, { enabled: t, role: r, onToggle: w, onRoleChange: T }),
        }),
        (0, C.jsxs)(`div`, {
          className: `flex gap-0 px-4 border-b border-[var(--md-gray-200)]`,
          children: [
            (0, C.jsx)(`button`, {
              onClick: () => s(`features`),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${a === `features` ? `text-[#2469f0] border-[#2469f0]` : `text-[var(--md-gray-500)] border-transparent hover:text-[var(--md-gray-700)]`}`,
              children: `Fitur`,
            }),
            (0, C.jsx)(`button`, {
              onClick: () => s(`domain`),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${a === `domain` ? `text-[#2469f0] border-[#2469f0]` : `text-[var(--md-gray-500)] border-transparent hover:text-[var(--md-gray-700)]`}`,
              children: `Domain`,
            }),
          ],
        }),
        (0, C.jsxs)(`div`, {
          className: `flex-1 overflow-y-auto px-4 py-3`,
          children: [
            a === `features` &&
              (0, C.jsx)(k, { features: d, enabledFeatures: c, role: r, onToggle: E }),
            a === `domain` && (0, C.jsx)(A, { urls: p, onAdd: D, onRemove: P, onToggle: F }),
          ],
        }),
        (0, C.jsx)(j, { onReload: I, onReset: L }),
        h &&
          (0, C.jsx)(`div`, {
            className: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up`,
            role: `alert`,
            children: (0, C.jsx)(`div`, {
              className: `px-4 py-2 bg-[var(--md-gray-800)] text-white text-md-sm rounded-lg shadow-lg`,
              children: h,
            }),
          }),
      ],
    }),
  });
}
var F = document.getElementById(`app`);
F && (0, b.createRoot)(F).render((0, C.jsx)(P, {}));
