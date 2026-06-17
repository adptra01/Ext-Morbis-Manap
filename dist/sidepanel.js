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
  x as y,
  y as b,
} from './chunks/button-1pt39gqw.js';
var x = a(`check`, [[`path`, { d: `M20 6 9 17l-5-5`, key: `1gmf2c` }]]),
  S = a(`info`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M12 16v-4`, key: `1dtifu` }],
    [`path`, { d: `M12 8h.01`, key: `e9boi3` }],
  ]),
  C = a(`triangle-alert`, [
    [
      `path`,
      {
        d: `m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,
        key: `wmoenq`,
      },
    ],
    [`path`, { d: `M12 9v4`, key: `juzpu7` }],
    [`path`, { d: `M12 17h.01`, key: `p32p05` }],
  ]),
  w = b(),
  T = y(n(), 1),
  E = `theme`;
function D() {
  let [e, t] = (0, T.useState)(() => (typeof chrome < `u` && chrome.storage?.sync, `system`)),
    [n, r] = (0, T.useState)(!1);
  (0, T.useEffect)(() => {
    chrome.storage.sync.get(E, (e) => {
      let n = e[E] || `system`;
      (t(n), i(n));
    });
  }, []);
  let i = (0, T.useCallback)((e) => {
      let t;
      ((t =
        e === `system` ? window.matchMedia(`(prefers-color-scheme: dark)`).matches : e === `dark`),
        document.documentElement.classList.toggle(`dark`, t),
        r(t));
    }, []),
    a = (0, T.useCallback)(
      (e) => {
        (t(e), i(e), chrome.storage.sync.set({ [E]: e }));
      },
      [i],
    );
  return (
    (0, T.useEffect)(() => {
      let t = window.matchMedia(`(prefers-color-scheme: dark)`),
        n = () => {
          e === `system` && i(`system`);
        };
      return (t.addEventListener(`change`, n), () => t.removeEventListener(`change`, n));
    }, [e, i]),
    { theme: e, resolved: n, setTheme: a }
  );
}
var O = o(),
  k = {
    default: `bg-primary/10 text-primary border-primary/20`,
    success: `bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800`,
    warning: `bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800`,
    danger: `bg-destructive/10 text-destructive border-destructive/20`,
  },
  A = { default: S, success: x, warning: C, danger: r };
function j({ variant: e = `default`, icon: t, children: n, className: i, onDismiss: a }) {
  let o = A[e];
  return (0, O.jsxs)(`span`, {
    className: u(
      `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold`,
      k[e],
      i,
    ),
    children: [
      t && (0, O.jsx)(o, { className: `size-3` }),
      n,
      a &&
        (0, O.jsx)(`button`, {
          onClick: a,
          className: `ml-0.5 hover:opacity-70`,
          'aria-label': `Dismiss`,
          children: (0, O.jsx)(r, { className: `size-2.5` }),
        }),
    ],
  });
}
var M = [
  { value: `casemix`, label: `Casemix` },
  { value: `kasir`, label: `Kasir` },
  { value: `dokter`, label: `Dokter` },
  { value: `apotek`, label: `Apotek` },
  { value: `admin`, label: `Admin` },
];
function N({ value: e, onChange: n }) {
  return (0, O.jsxs)(m, {
    value: e,
    onValueChange: (e) => n(e),
    children: [
      (0, O.jsx)(f, { className: `w-[120px]`, children: (0, O.jsx)(h, {}) }),
      (0, O.jsx)(c, {
        children: M.map((e) => (0, O.jsx)(t, { value: e.value, children: e.label }, e.value)),
      }),
    ],
  });
}
function P({ enabled: e, role: t, onToggle: n, onRoleChange: r }) {
  return (0, O.jsxs)(`div`, {
    className: `rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex items-center justify-between`,
    children: [
      (0, O.jsxs)(`div`, {
        className: `flex items-center gap-3`,
        children: [
          (0, O.jsx)(p, { checked: e, onCheckedChange: n }),
          (0, O.jsxs)(`div`, {
            children: [
              (0, O.jsxs)(`div`, {
                className: `flex items-center gap-2`,
                children: [
                  (0, O.jsx)(`span`, {
                    className: `text-md-sm font-semibold text-foreground`,
                    children: `MORBIS Ext`,
                  }),
                  e && (0, O.jsx)(j, { variant: `success`, children: `Aktif` }),
                ],
              }),
              (0, O.jsx)(`p`, {
                className: `text-md-xs text-muted-foreground mt-0.5`,
                children: e ? `Extension aktif di halaman ini` : `Extension tidak aktif`,
              }),
            ],
          }),
        ],
      }),
      (0, O.jsx)(N, { value: t, onChange: (e) => r(e) }),
    ],
  });
}
function F({
  features: e,
  enabledFeatures: n,
  role: r,
  disabled: i,
  onToggle: a,
  onModeChange: o,
}) {
  let s = e.filter((e) => e.roles.includes(r)),
    l = s.filter((e) => n[e.key]).length;
  return (0, O.jsxs)(`div`, {
    children: [
      (0, O.jsx)(`div`, {
        className: `flex items-center justify-between mb-3`,
        children: (0, O.jsxs)(`p`, {
          className: `text-md-xs text-muted-foreground font-medium`,
          children: [l, ` dari `, s.length, ` aktif`],
        }),
      }),
      s.length === 0 &&
        (0, O.jsx)(`div`, {
          className: `text-center py-8`,
          children: (0, O.jsx)(`p`, {
            className: `text-md-sm text-muted-foreground`,
            children: `Tidak ada fitur untuk role ini`,
          }),
        }),
      (0, O.jsx)(`div`, {
        className: `space-y-0.5`,
        children: s.map((e) => {
          let r = !!n[e.key];
          return (0, O.jsxs)(
            `div`,
            {
              className: `
                flex items-center justify-between px-3 py-2.5 rounded-md
                ${r ? `bg-accent` : ``}
                ${e.comingSoon ? `opacity-60` : `cursor-pointer hover:bg-accent`}
              `,
              onClick: () => {
                !e.comingSoon && !i && a(e.key, !r);
              },
              children: [
                (0, O.jsxs)(`div`, {
                  className: `flex-1 min-w-0 mr-3`,
                  children: [
                    (0, O.jsxs)(`div`, {
                      className: `flex items-center gap-2`,
                      children: [
                        (0, O.jsx)(`span`, {
                          className: `text-md-sm font-medium text-foreground`,
                          children: e.name,
                        }),
                        e.comingSoon &&
                          (0, O.jsx)(`span`, {
                            className: `text-[10px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full`,
                            children: `CS`,
                          }),
                      ],
                    }),
                    (0, O.jsx)(`p`, {
                      className: `text-md-xs text-muted-foreground mt-0.5 truncate`,
                      children: e.desc,
                    }),
                  ],
                }),
                (0, O.jsxs)(`div`, {
                  className: `flex items-center gap-1.5 shrink-0`,
                  children: [
                    e.key === `openDetailInNewTab` &&
                      e.modes &&
                      n[e.key] &&
                      (0, O.jsxs)(m, {
                        value: e.mode || `same-tab`,
                        onValueChange: (t) => o(e.key, t),
                        children: [
                          (0, O.jsx)(f, {
                            className: `h-7 text-md-xs w-[100px]`,
                            onClick: (e) => e.stopPropagation(),
                            children: (0, O.jsx)(h, {}),
                          }),
                          (0, O.jsx)(c, {
                            children: Object.entries(e.modes).map(([e, n]) =>
                              (0, O.jsx)(t, { value: e, className: `text-md-xs`, children: n }, e),
                            ),
                          }),
                        ],
                      }),
                    (0, O.jsx)(p, {
                      checked: r,
                      onCheckedChange: (t) => {
                        e.comingSoon || a(e.key, t);
                      },
                      disabled: i || e.comingSoon,
                    }),
                  ],
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
var I = (e) => {
  try {
    let t = new URL(e);
    return t.protocol === `http:` || t.protocol === `https:`;
  } catch {
    return !1;
  }
};
function L({ urls: e, onAdd: t, onRemove: n, onToggle: a }) {
  let [o, s] = (0, T.useState)(``),
    [c, l] = (0, T.useState)(null),
    u = () => {
      let n = o.trim();
      if (!n) {
        l(`Masukkan URL terlebih dahulu`);
        return;
      }
      if (!I(n)) {
        l(`Format URL tidak valid`);
        return;
      }
      if (e.find((e) => e.url === n)) {
        l(`URL sudah ada`);
        return;
      }
      (l(null), t(n), s(``));
    };
  return (0, O.jsxs)(`div`, {
    className: `space-y-3`,
    children: [
      (0, O.jsxs)(`div`, {
        className: `flex gap-2`,
        children: [
          (0, O.jsx)(d, {
            type: `text`,
            value: o,
            onChange: (e) => {
              (s(e.target.value), l(null));
            },
            onKeyDown: (e) => e.key === `Enter` && u(),
            placeholder: `http://192.168.1.100`,
            className: `flex-1`,
          }),
          (0, O.jsxs)(g, {
            variant: `default`,
            size: `sm`,
            onClick: u,
            children: [(0, O.jsx)(i, { className: `size-3.5` }), `Add`],
          }),
        ],
      }),
      c &&
        (0, O.jsx)(`p`, { className: `text-md-xs text-destructive`, role: `alert`, children: c }),
      e.length === 0 &&
        !c &&
        (0, O.jsx)(`div`, {
          className: `text-center py-8`,
          children: (0, O.jsx)(`p`, {
            className: `text-md-sm text-muted-foreground`,
            children: `Belum ada domain`,
          }),
        }),
      (0, O.jsx)(`div`, {
        className: `space-y-1`,
        children: e.map((e) =>
          (0, O.jsxs)(
            `div`,
            {
              className: `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent group ${e.isDefault ? `bg-blue-50 dark:bg-blue-950/20` : ``}`,
              children: [
                (0, O.jsx)(p, { checked: e.enabled, onCheckedChange: (t) => a(e.id, t) }),
                (0, O.jsx)(`span`, {
                  className: `flex-1 text-md-xs text-foreground truncate font-mono`,
                  children: e.url,
                }),
                e.isDefault &&
                  (0, O.jsx)(`span`, {
                    className: `text-[10px] font-semibold text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 px-1.5 py-0.5 rounded`,
                    children: `DEFAULT`,
                  }),
                (0, O.jsx)(`button`, {
                  onClick: () => n(e.id),
                  disabled: e.isDefault,
                  'aria-label': `Hapus ${e.url}`,
                  className: `p-1 rounded transition-colors ${e.isDefault ? `opacity-30 cursor-not-allowed` : `opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive`}`,
                  title: e.isDefault ? `URL default tidak dapat dihapus` : `Hapus`,
                  children: (0, O.jsx)(r, { className: `size-3.5` }),
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
function R({ onReload: e, onReset: t }) {
  return (0, O.jsxs)(`div`, {
    className: `flex items-center justify-between px-4 py-3 border-t border-border`,
    children: [
      (0, O.jsxs)(g, {
        variant: `ghost`,
        size: `sm`,
        onClick: e,
        children: [(0, O.jsx)(_, { className: `size-3.5` }), `Reload Halaman`],
      }),
      (0, O.jsxs)(g, {
        variant: `ghost`,
        size: `sm`,
        onClick: t,
        children: [(0, O.jsx)(l, { className: `size-3.5` }), `Reset Default`],
      }),
    ],
  });
}
function z(e) {
  return Object.entries(e).map(([e, t]) => ({
    key: e,
    name: t.name || e,
    desc: t.description || ``,
    roles: t.allowedRoles || [],
    mode: t.mode,
    modes: t.modes,
    comingSoon: t.comingSoon,
  }));
}
function B(e) {
  let t = {};
  for (let [n, r] of Object.entries(e || {})) t[n] = r.enabled ?? !1;
  return t;
}
var V = [
    {
      key: `openDetailInNewTab`,
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
      key: `scrollButtons`,
      name: `Scroll Buttons`,
      desc: `Tombol scroll cepat`,
      roles: [`casemix`, `kasir`, `apotek`, `dokter`, `admin`],
    },
    {
      key: `batchUpload`,
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
      key: `resumeModal`,
      name: `Resume Rajal`,
      desc: `Edit resume rawat jalan`,
      roles: [`casemix`, `dokter`],
    },
    { key: `ttvEditor`, name: `TTV Editor`, desc: `Edit tanda vital`, roles: [`dokter`, `admin`] },
    {
      key: `cpptSearchFilter`,
      name: `CPPT Search`,
      desc: `Cari & filter CPPT`,
      roles: [`casemix`],
    },
    { key: `antrianTools`, name: `Antrian Tools`, desc: `Tools halaman antrian`, roles: [`admin`] },
    {
      key: `consultationEnhancer`,
      name: `Konsultasi`,
      desc: `Enhancer halaman konsultasi`,
      roles: [`dokter`],
    },
    { key: `batchDelete`, name: `Batch Delete`, desc: `Hapus file massal`, roles: [`admin`] },
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
      key: `resepTools`,
      name: `Penerimaan Resep`,
      desc: `Tools penerimaan resep`,
      roles: [`admin`],
    },
  ],
  H = [
    { id: `default-1`, url: `http://103.147.236.140`, enabled: !0, isDefault: !0 },
    { id: `default-2`, url: `http://192.168.8.4`, enabled: !0, isDefault: !0 },
  ];
function U() {
  let [t, n] = (0, T.useState)(!0),
    [r, i] = (0, T.useState)(`casemix`),
    [a, o] = (0, T.useState)(`features`),
    [c, l] = (0, T.useState)({}),
    [u, d] = (0, T.useState)(V),
    [f, p] = (0, T.useState)(H),
    [m, h] = (0, T.useState)(null),
    { theme: g, resolved: _, setTheme: y } = D();
  (0, T.useEffect)(() => {
    v({ type: e.GET_ALL })
      .then((e) => {
        (e?.config &&
          (n(e.config.extensionEnabled),
          i(e.config.currentRole),
          l(B(e.config.features || {})),
          e.config.features && d(z(e.config.features))),
          e?.urls && p(e.urls));
      })
      .catch(() => {
        chrome.storage.sync.get([`extensionConfig`, `extensionCustomUrls`], (e) => {
          (e.extensionConfig &&
            (n(e.extensionConfig.extensionEnabled),
            i(e.extensionConfig.currentRole),
            l(B(e.extensionConfig.features || {})),
            e.extensionConfig.features && d(z(e.extensionConfig.features))),
            e.extensionCustomUrls && p(e.extensionCustomUrls));
        });
      });
  }, []);
  let b = (0, T.useCallback)((e) => {
      (h(e), setTimeout(() => h(null), 2500));
    }, []),
    x = (0, T.useCallback)(() => {
      let r = !t;
      (n(r),
        v({ type: e.TOGGLE_EXTENSION, enabled: r }).catch(() =>
          b(`Gagal mengubah status extension`),
        ),
        b(r ? `Extension diaktifkan` : `Extension dinonaktifkan`));
    }, [t, b]),
    S = (0, T.useCallback)(
      (t) => {
        (i(t), v({ type: e.SET_ROLE, role: t }).catch(() => b(`Gagal mengubah role`)));
      },
      [b],
    ),
    C = (0, T.useCallback)(
      (t, n) => {
        (l({ ...c, [t]: n }),
          v({ type: e.TOGGLE_FEATURE, key: t, enabled: n }).catch(() => b(`Gagal mengubah fitur`)),
          b(n ? `${t} diaktifkan` : `${t} dinonaktifkan`));
      },
      [c, b],
    ),
    w = (0, T.useCallback)(
      (t) => {
        let n = `url-` + Date.now();
        (p([...f, { id: n, url: t, enabled: !0, isDefault: !1 }]),
          v({ type: e.ADD_URL, url: t }).catch(() => b(`Gagal menambah domain`)),
          b(`Domain ditambahkan`));
      },
      [f, b],
    ),
    E = (0, T.useCallback)(
      (t) => {
        (p(f.filter((e) => e.id !== t)),
          v({ type: e.DELETE_URL, id: t }).catch(() => b(`Gagal menghapus domain`)),
          b(`Domain dihapus`));
      },
      [f, b],
    ),
    k = (0, T.useCallback)(
      (t, n) => {
        (p(f.map((e) => (e.id === t ? { ...e, enabled: n } : e))),
          v({ type: e.TOGGLE_URL, id: t, enabled: n }).catch(() => b(`Gagal mengubah domain`)));
      },
      [f, b],
    ),
    A = (0, T.useCallback)(
      (t, n) => {
        (v({ type: e.CHANGE_FEATURE_MODE, key: t, mode: n }).catch(() => b(`Gagal mengubah mode`)),
          b(`Mode berhasil diubah`));
      },
      [b],
    ),
    j = (0, T.useCallback)(() => {
      chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
        e[0]?.id && chrome.tabs.reload(e[0].id);
      });
    }, []),
    M = (0, T.useCallback)(() => {
      confirm(`Apakah Anda yakin ingin mereset ke pengaturan default?`) &&
        v({ type: e.RESET_CONFIG })
          .then(() => {
            (l({}), p(H), i(`casemix`), n(!0), b(`Reset ke default`), j());
          })
          .catch(() => {
            b(`Gagal mereset konfigurasi`);
          });
    }, [j, b]);
  return (0, O.jsx)(s, {
    children: (0, O.jsxs)(`div`, {
      className: `flex flex-col h-full bg-background`,
      children: [
        (0, O.jsxs)(`div`, {
          className: `flex items-center justify-between px-4 py-2.5 border-b border-border`,
          children: [
            (0, O.jsxs)(`div`, {
              className: `flex items-center gap-2`,
              children: [
                (0, O.jsx)(`div`, {
                  className: `w-6 h-6 rounded-md bg-[#2469f0] flex items-center justify-center`,
                  children: (0, O.jsx)(`span`, {
                    className: `text-white text-md-xs font-bold`,
                    children: `M`,
                  }),
                }),
                (0, O.jsx)(`span`, {
                  className: `text-md-sm font-semibold text-foreground`,
                  children: `MORBIS Ext`,
                }),
                (0, O.jsx)(`span`, {
                  className: `text-[10px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded-full`,
                  children: `v1.2`,
                }),
              ],
            }),
            (0, O.jsx)(`div`, {
              className: `flex items-center gap-1`,
              children: (0, O.jsx)(`button`, {
                onClick: () => y(g === `dark` ? `light` : `dark`),
                className: `p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors`,
                title: `Toggle dark mode`,
                children: _
                  ? (0, O.jsxs)(`svg`, {
                      width: `16`,
                      height: `16`,
                      viewBox: `0 0 24 24`,
                      fill: `none`,
                      stroke: `currentColor`,
                      strokeWidth: `2`,
                      children: [
                        (0, O.jsx)(`circle`, { cx: `12`, cy: `12`, r: `5` }),
                        (0, O.jsx)(`path`, {
                          d: `M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42`,
                        }),
                      ],
                    })
                  : (0, O.jsx)(`svg`, {
                      width: `16`,
                      height: `16`,
                      viewBox: `0 0 24 24`,
                      fill: `none`,
                      stroke: `currentColor`,
                      strokeWidth: `2`,
                      children: (0, O.jsx)(`path`, {
                        d: `M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z`,
                      }),
                    }),
              }),
            }),
          ],
        }),
        (0, O.jsx)(`div`, {
          className: `px-4 py-3`,
          children: (0, O.jsx)(P, { enabled: t, role: r, onToggle: x, onRoleChange: S }),
        }),
        (0, O.jsxs)(`div`, {
          className: `flex gap-0 px-4 border-b border-border`,
          children: [
            (0, O.jsx)(`button`, {
              onClick: () => o(`features`),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${a === `features` ? `text-[#2469f0] border-[#2469f0]` : `text-muted-foreground border-transparent hover:text-foreground`}`,
              children: `Fitur`,
            }),
            (0, O.jsx)(`button`, {
              onClick: () => o(`domain`),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${a === `domain` ? `text-[#2469f0] border-[#2469f0]` : `text-muted-foreground border-transparent hover:text-foreground`}`,
              children: `Domain`,
            }),
          ],
        }),
        (0, O.jsxs)(`div`, {
          className: `flex-1 overflow-y-auto px-4 py-3`,
          children: [
            a === `features` &&
              (0, O.jsx)(F, {
                features: u,
                enabledFeatures: c,
                role: r,
                disabled: !t,
                onToggle: C,
                onModeChange: A,
              }),
            a === `domain` && (0, O.jsx)(L, { urls: f, onAdd: w, onRemove: E, onToggle: k }),
          ],
        }),
        (0, O.jsx)(R, { onReload: j, onReset: M }),
        m &&
          (0, O.jsx)(`div`, {
            className: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up`,
            role: `alert`,
            children: (0, O.jsx)(`div`, {
              className: `px-4 py-2 bg-foreground text-background text-md-sm rounded-lg shadow-lg`,
              children: m,
            }),
          }),
      ],
    }),
  });
}
var W = document.getElementById(`app`);
W && (0, w.createRoot)(W).render((0, O.jsx)(U, {}));
