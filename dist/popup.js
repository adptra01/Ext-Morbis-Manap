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
  r as p,
  s as m,
  t as h,
  u as g,
  v as _,
  y as v,
} from './chunks/button-oeVl7aqx.js';
var y = n(v(), 1),
  b = _(),
  x = s(),
  S = [
    { value: `casemix`, label: `Casemix` },
    { value: `kasir`, label: `Kasir` },
    { value: `dokter`, label: `Dokter` },
    { value: `apotek`, label: `Apotek` },
    { value: `admin`, label: `Admin` },
  ];
function C({ enabled: e, role: n, onToggle: r, onRoleChange: i }) {
  return (0, x.jsxs)(`div`, {
    className: `flex items-center justify-between`,
    children: [
      (0, x.jsxs)(`div`, {
        className: `flex items-center gap-2.5`,
        children: [
          (0, x.jsx)(a, { checked: e, onCheckedChange: r }),
          (0, x.jsx)(`div`, {
            children: (0, x.jsxs)(`div`, {
              className: `flex items-center gap-1.5`,
              children: [
                (0, x.jsx)(`span`, {
                  className: `inline-block w-2 h-2 rounded-full ${e ? `bg-green-500` : `bg-muted-foreground`}`,
                }),
                (0, x.jsx)(`span`, {
                  className: `text-md-xs font-medium text-foreground`,
                  children: e ? `Aktif` : `Non-Aktif`,
                }),
              ],
            }),
          }),
        ],
      }),
      (0, x.jsxs)(p, {
        value: n,
        onValueChange: (e) => i(e),
        children: [
          (0, x.jsx)(f, { className: `w-[120px]`, children: (0, x.jsx)(m, {}) }),
          (0, x.jsx)(c, {
            children: S.map((e) => (0, x.jsx)(t, { value: e.value, children: e.label }, e.value)),
          }),
        ],
      }),
    ],
  });
}
function w({ features: e, role: t, onToggle: n, onModeChange: r }) {
  let i = Object.entries(e).filter(([, e]) => t === `admin` || e.allowedRoles?.includes(t)),
    a = i.filter(([, e]) => e.enabled && !e.comingSoon).length;
  return i.length === 0
    ? (0, x.jsx)(`div`, {
        className: `text-center py-4`,
        children: (0, x.jsx)(`p`, {
          className: `text-md-xs text-[var(--md-gray-400)]`,
          children: `Tidak ada fitur untuk role ini`,
        }),
      })
    : (0, x.jsxs)(`div`, {
        children: [
          (0, x.jsxs)(`p`, {
            className: `text-[10px] text-[var(--md-gray-500)] mb-1.5`,
            children: [a, ` dari `, i.filter(([, e]) => !e.comingSoon).length, ` fitur aktif`],
          }),
          (0, x.jsx)(`div`, {
            className: `space-y-0.5`,
            children: i.map(([e, t]) => {
              let i = t.comingSoon === !0,
                a = t.enabled && !i;
              return (
                t.enabled,
                (0, x.jsxs)(
                  `div`,
                  {
                    className: `flex items-center justify-between px-2.5 py-2 rounded ${a ? `bg-[var(--md-gray-50)]` : ``} ${i ? `opacity-60` : ``}`,
                    children: [
                      (0, x.jsxs)(`div`, {
                        className: `flex-1 min-w-0 mr-2`,
                        children: [
                          (0, x.jsxs)(`div`, {
                            className: `flex items-center gap-1.5`,
                            children: [
                              (0, x.jsx)(`span`, {
                                className: `text-md-xs font-medium text-[var(--md-gray-800)]`,
                                children: t.name || e,
                              }),
                              i &&
                                (0, x.jsx)(`span`, {
                                  className: `text-[9px] font-semibold text-[#c47a1a] bg-[#fef4e4] px-1.5 py-0.5 rounded-full`,
                                  children: `CS`,
                                }),
                            ],
                          }),
                          t.description &&
                            (0, x.jsx)(`p`, {
                              className: `text-[10px] text-[var(--md-gray-500)] truncate mt-0.5`,
                              children: t.description,
                            }),
                        ],
                      }),
                      (0, x.jsxs)(`div`, {
                        className: `flex items-center gap-1.5 shrink-0`,
                        children: [
                          e === `openDetailInNewTab` &&
                            t.modes &&
                            t.enabled &&
                            (0, x.jsx)(`select`, {
                              value: t.mode || `same-tab`,
                              onChange: (t) => r(e, t.target.value),
                              onClick: (e) => e.stopPropagation(),
                              className: `text-[10px] px-1.5 py-1 rounded border border-[var(--md-gray-200)] bg-white text-[var(--md-gray-700)] cursor-pointer focus:outline-none`,
                              children: Object.entries(t.modes).map(([e, t]) =>
                                (0, x.jsx)(`option`, { value: e, children: t }, e),
                              ),
                            }),
                          !i &&
                            (0, x.jsx)(`button`, {
                              type: `button`,
                              role: `switch`,
                              'aria-checked': t.enabled,
                              onClick: () => n(e, !t.enabled),
                              className: `relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${t.enabled ? `bg-[#2469f0]` : `bg-[var(--md-gray-200)]`}`,
                              children: (0, x.jsx)(`span`, {
                                className: `pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ${t.enabled ? `translate-x-3` : `translate-x-0`}`,
                              }),
                            }),
                        ],
                      }),
                    ],
                  },
                  e,
                )
              );
            }),
          }),
        ],
      });
}
function T({ urls: e, onAdd: t, onRemove: n, onToggle: o }) {
  let [s, c] = (0, y.useState)(``),
    [l, u] = (0, y.useState)(null),
    f = (e) => {
      try {
        let t = new URL(e);
        return t.protocol === `http:` || t.protocol === `https:`;
      } catch {
        return !1;
      }
    },
    p = () => {
      let n = s.trim();
      if (!n) {
        u(`Masukkan URL terlebih dahulu`);
        return;
      }
      if (!f(n)) {
        u(`Format URL tidak valid`);
        return;
      }
      if (e.find((e) => e.url === n)) {
        u(`URL sudah ada`);
        return;
      }
      (u(null), t(n), c(``));
    };
  return (0, x.jsxs)(`div`, {
    children: [
      (0, x.jsxs)(`div`, {
        className: `flex gap-1.5 mb-1.5`,
        children: [
          (0, x.jsx)(d, {
            type: `text`,
            value: s,
            onChange: (e) => {
              (c(e.target.value), u(null));
            },
            onKeyDown: (e) => e.key === `Enter` && p(),
            placeholder: `http://example.com`,
            className: `flex-1`,
          }),
          (0, x.jsxs)(h, {
            variant: `default`,
            size: `sm`,
            onClick: p,
            children: [(0, x.jsx)(i, { className: `size-3.5` }), `Tambah`],
          }),
        ],
      }),
      l &&
        (0, x.jsx)(`p`, {
          className: `text-[10px] text-destructive mb-1`,
          role: `alert`,
          children: l,
        }),
      e.length === 0
        ? (0, x.jsx)(`p`, {
            className: `text-center text-md-xs text-muted-foreground py-3`,
            children: `Belum ada URL`,
          })
        : (0, x.jsx)(`div`, {
            className: `space-y-0.5`,
            children: e.map((e) =>
              (0, x.jsxs)(
                `div`,
                {
                  className: `flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-accent group ${e.isDefault ? `bg-blue-50 dark:bg-blue-950/20` : ``}`,
                  children: [
                    (0, x.jsx)(a, {
                      checked: e.enabled,
                      onCheckedChange: (t) => o(e.id, t),
                      className: `h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3`,
                    }),
                    (0, x.jsx)(`span`, {
                      className: `flex-1 text-[10px] text-foreground truncate font-mono`,
                      children: e.url,
                    }),
                    (0, x.jsx)(`span`, {
                      className: `text-[8px] font-semibold px-1 py-0.5 rounded ${e.isDefault ? `bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300` : `bg-muted text-muted-foreground`}`,
                      children: e.isDefault ? `DEFAULT` : `CUSTOM`,
                    }),
                    (0, x.jsx)(`button`, {
                      onClick: () => n(e.id),
                      disabled: e.isDefault,
                      'aria-label': `Hapus ${e.url}`,
                      className: `p-0.5 rounded transition-colors ${e.isDefault ? `opacity-0` : `opacity-0 group-hover:opacity-100 hover:bg-accent`}`,
                      title: `Hapus`,
                      children: (0, x.jsx)(r, {
                        className: `size-3 text-muted-foreground hover:text-destructive`,
                      }),
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
function E({ onReload: e, onReset: t }) {
  return (0, x.jsxs)(`div`, {
    className: `flex items-center gap-2 px-4 py-2.5 border-t border-border`,
    children: [
      (0, x.jsxs)(h, {
        variant: `default`,
        size: `sm`,
        className: `flex-1`,
        onClick: e,
        children: [(0, x.jsx)(g, { className: `size-3.5` }), `Reload Halaman`],
      }),
      (0, x.jsxs)(h, {
        variant: `secondary`,
        size: `sm`,
        className: `flex-1`,
        onClick: t,
        children: [(0, x.jsx)(l, { className: `size-3.5` }), `Reset Default`],
      }),
    ],
  });
}
async function D() {
  try {
    let t = await e({ type: o.GET_ALL });
    if (t?.config) return { config: t.config, urls: t.urls ?? [] };
  } catch {}
  let t = await chrome.storage.sync.get([`extensionConfig`, `extensionCustomUrls`]);
  return {
    config: t.extensionConfig ?? { extensionEnabled: !0, currentRole: `casemix`, features: {} },
    urls: t.extensionCustomUrls ?? [],
  };
}
function O() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
    e[0]?.id && (chrome.tabs.reload(e[0].id), window.close());
  });
}
function k() {
  let [t, n] = (0, y.useState)(!0),
    [r, i] = (0, y.useState)(null),
    [a, s] = (0, y.useState)([]),
    [c, l] = (0, y.useState)(null);
  (0, y.useEffect)(() => {
    D().then((e) => {
      (i(e.config), s(e.urls), n(!1));
    });
  }, []);
  let d = (0, y.useCallback)((e) => {
      (l(e), setTimeout(() => l(null), 2e3));
    }, []),
    f = (0, y.useCallback)(() => {
      if (!r) return;
      let t = !r.extensionEnabled;
      (i({ ...r, extensionEnabled: t }),
        e({ type: o.TOGGLE_EXTENSION, enabled: t }).catch(() =>
          d(`Gagal mengubah status extension`),
        ),
        d(t ? `Extension diaktifkan` : `Extension dinonaktifkan`),
        O());
    }, [r, d]),
    p = (0, y.useCallback)(
      (t) => {
        r &&
          (i({ ...r, currentRole: t }),
          e({ type: o.SET_ROLE, role: t }).catch(() => d(`Gagal mengubah role`)),
          d(`Role berhasil diubah`),
          O());
      },
      [r, d],
    ),
    m = (0, y.useCallback)(
      (t, n) => {
        r?.features[t] &&
          (i({ ...r, features: { ...r.features, [t]: { ...r.features[t], enabled: n } } }),
          e({ type: o.TOGGLE_FEATURE, key: t, enabled: n }).catch(() => d(`Gagal mengubah fitur`)),
          O());
      },
      [r, d],
    ),
    h = (0, y.useCallback)(
      (t, n) => {
        r?.features[t] &&
          (i({ ...r, features: { ...r.features, [t]: { ...r.features[t], mode: n } } }),
          e({ type: o.CHANGE_FEATURE_MODE, key: t, mode: n }).catch(() => d(`Gagal mengubah mode`)),
          d(`Mode berhasil diubah`));
      },
      [r, d],
    ),
    g = (0, y.useCallback)(
      (t) => {
        let n = { id: `url-` + Date.now(), url: t, enabled: !0, isDefault: !1 };
        (s((e) => [...e, n]),
          e({ type: o.ADD_URL, url: t }).catch(() => d(`Gagal menambah URL`)),
          d(`URL berhasil ditambahkan`),
          O());
      },
      [d],
    ),
    _ = (0, y.useCallback)(
      (t) => {
        (s((e) => e.filter((e) => e.id !== t)),
          e({ type: o.DELETE_URL, id: t }).catch(() => d(`Gagal menghapus URL`)),
          O());
      },
      [d],
    ),
    v = (0, y.useCallback)(
      (t, n) => {
        (s((e) => e.map((e) => (e.id === t ? { ...e, enabled: n } : e))),
          e({ type: o.TOGGLE_URL, id: t, enabled: n }).catch(() => d(`Gagal mengubah URL`)),
          O());
      },
      [d],
    ),
    b = (0, y.useCallback)(() => {
      confirm(`Apakah Anda yakin ingin mereset ke pengaturan default?`) &&
        (e({ type: o.RESET_CONFIG }).catch(() => d(`Gagal mereset konfigurasi`)),
        l(`Reset ke default`),
        setTimeout(() => {
          D().then((e) => {
            (i(e.config), s(e.urls), O());
          });
        }, 500));
    }, [d]);
  return t
    ? (0, x.jsx)(`div`, {
        className: `flex items-center justify-center h-[300px]`,
        children: (0, x.jsx)(`p`, {
          className: `text-md-sm text-[var(--md-gray-400)]`,
          children: `Memuat...`,
        }),
      })
    : r
      ? (0, x.jsx)(u, {
          children: (0, x.jsxs)(`div`, {
            className: `w-[340px] min-h-[200px] max-h-[600px] overflow-y-auto`,
            children: [
              (0, x.jsx)(`div`, {
                className: `px-4 pt-3 pb-2 border-b border-[var(--md-gray-200)]`,
                children: (0, x.jsxs)(`div`, {
                  className: `flex items-center gap-2`,
                  children: [
                    (0, x.jsx)(`div`, {
                      className: `w-5 h-5 rounded bg-[#2469f0] flex items-center justify-center`,
                      children: (0, x.jsx)(`span`, {
                        className: `text-white text-[10px] font-bold`,
                        children: `M`,
                      }),
                    }),
                    (0, x.jsxs)(`div`, {
                      children: [
                        (0, x.jsx)(`h1`, {
                          className: `text-md-sm font-semibold text-[var(--md-gray-800)]`,
                          children: `MORBIS Ext`,
                        }),
                        (0, x.jsx)(`p`, {
                          className: `text-[10px] text-[var(--md-gray-500)]`,
                          children: `Produktivitas SIMRS`,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, x.jsx)(`div`, {
                className: `px-4 py-2.5`,
                children: (0, x.jsx)(C, {
                  enabled: r.extensionEnabled,
                  role: r.currentRole,
                  onToggle: f,
                  onRoleChange: p,
                }),
              }),
              (0, x.jsxs)(`div`, {
                className: `px-4 pb-2`,
                children: [
                  (0, x.jsx)(`div`, {
                    className: `flex items-center justify-between mb-1`,
                    children: (0, x.jsx)(`span`, {
                      className: `text-[10px] font-semibold text-[var(--md-gray-500)] uppercase tracking-wider`,
                      children: `Fitur`,
                    }),
                  }),
                  (0, x.jsx)(w, {
                    features: r.features,
                    role: r.currentRole,
                    onToggle: m,
                    onModeChange: h,
                  }),
                ],
              }),
              (0, x.jsxs)(`div`, {
                className: `px-4 pb-2`,
                children: [
                  (0, x.jsx)(`div`, {
                    className: `flex items-center justify-between mb-1`,
                    children: (0, x.jsx)(`span`, {
                      className: `text-[10px] font-semibold text-[var(--md-gray-500)] uppercase tracking-wider`,
                      children: `Domain`,
                    }),
                  }),
                  (0, x.jsx)(T, { urls: a, onAdd: g, onRemove: _, onToggle: v }),
                ],
              }),
              (0, x.jsx)(E, { onReload: O, onReset: b }),
              c &&
                (0, x.jsx)(`div`, {
                  className: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up`,
                  role: `alert`,
                  children: (0, x.jsx)(`div`, {
                    className: `px-4 py-2 bg-[var(--md-gray-800)] text-white text-md-xs rounded-lg shadow-lg`,
                    children: c,
                  }),
                }),
            ],
          }),
        })
      : (0, x.jsx)(`div`, {
          className: `flex items-center justify-center h-[300px]`,
          children: (0, x.jsx)(`p`, {
            className: `text-md-sm text-[var(--md-red-500)]`,
            children: `Gagal memuat konfigurasi`,
          }),
        });
}
var A = document.getElementById(`root`);
A && (0, b.createRoot)(A).render((0, x.jsx)(k, {}));
