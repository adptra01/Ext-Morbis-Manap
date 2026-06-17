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
} from './chunks/button-Lo_Q_Ev9.js';
var y = n(v(), 1),
  b = _(),
  x = s(),
  S = [
    { value: `casemix`, label: `Casemix` },
    { value: `kasir`, label: `Kasir` },
    { value: `dokter`, label: `Dokter` },
    { value: `apotek`, label: `Apotek` },
    { value: `admin`, label: `Admin` },
  ],
  C = { casemix: `Casemix`, kasir: `Kasir`, dokter: `Dokter`, apotek: `Apotek`, admin: `Admin` };
function w({ enabled: e, role: n, onToggle: r, onRoleChange: i }) {
  return (0, x.jsxs)(`div`, {
    className: `flex items-center justify-between`,
    children: [
      (0, x.jsxs)(`div`, {
        className: `flex items-center gap-2.5`,
        children: [
          (0, x.jsx)(a, { checked: e, onCheckedChange: r }),
          (0, x.jsxs)(`div`, {
            children: [
              (0, x.jsxs)(`div`, {
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
              (0, x.jsxs)(`p`, {
                className: `text-[10px] text-muted-foreground mt-0.5`,
                children: [`Role: `, C[n] || n],
              }),
            ],
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
function T({ features: e, role: n, disabled: r, onToggle: i, onModeChange: o }) {
  let s = Object.entries(e).filter(([, e]) => n === `admin` || e.allowedRoles?.includes(n)),
    l = s.filter(([, e]) => e.enabled && !e.comingSoon).length;
  return s.length === 0
    ? (0, x.jsx)(`div`, {
        className: `text-center py-4`,
        children: (0, x.jsx)(`p`, {
          className: `text-md-xs text-muted-foreground`,
          children: `Tidak ada fitur untuk role ini`,
        }),
      })
    : (0, x.jsxs)(`div`, {
        className: r ? `opacity-50 pointer-events-none` : ``,
        children: [
          (0, x.jsxs)(`p`, {
            className: `text-[10px] text-muted-foreground mb-1.5`,
            children: [l, ` dari `, s.filter(([, e]) => !e.comingSoon).length, ` fitur aktif`],
          }),
          (0, x.jsx)(`div`, {
            className: `space-y-0.5`,
            children: s.map(([e, n]) => {
              let s = n.comingSoon === !0;
              return (0, x.jsxs)(
                `div`,
                {
                  className: `flex items-center justify-between px-2.5 py-2 rounded ${n.enabled && !s ? `bg-accent` : ``} ${s ? `opacity-60` : ``}`,
                  children: [
                    (0, x.jsxs)(`div`, {
                      className: `flex-1 min-w-0 mr-2`,
                      children: [
                        (0, x.jsxs)(`div`, {
                          className: `flex items-center gap-1.5`,
                          children: [
                            (0, x.jsx)(`span`, {
                              className: `text-md-xs font-medium text-foreground`,
                              children: n.name || e,
                            }),
                            s &&
                              (0, x.jsx)(`span`, {
                                className: `text-[9px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full`,
                                children: `CS`,
                              }),
                          ],
                        }),
                        n.description &&
                          (0, x.jsx)(`p`, {
                            className: `text-[10px] text-muted-foreground truncate mt-0.5`,
                            children: n.description,
                          }),
                      ],
                    }),
                    (0, x.jsxs)(`div`, {
                      className: `flex items-center gap-1.5 shrink-0`,
                      children: [
                        e === `openDetailInNewTab` &&
                          n.modes &&
                          n.enabled &&
                          (0, x.jsxs)(p, {
                            value: n.mode || `same-tab`,
                            onValueChange: (t) => o(e, t),
                            children: [
                              (0, x.jsx)(f, {
                                className: `h-6 text-[10px] w-[90px]`,
                                onClick: (e) => e.stopPropagation(),
                                children: (0, x.jsx)(m, {}),
                              }),
                              (0, x.jsx)(c, {
                                children: Object.entries(n.modes).map(([e, n]) =>
                                  (0, x.jsx)(
                                    t,
                                    { value: e, className: `text-[10px]`, children: n },
                                    e,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        !s &&
                          (0, x.jsx)(a, {
                            checked: n.enabled,
                            onCheckedChange: (t) => i(e, t),
                            disabled: r,
                          }),
                      ],
                    }),
                  ],
                },
                e,
              );
            }),
          }),
        ],
      });
}
function E({ urls: e, onAdd: t, onRemove: n, onToggle: o }) {
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
function D({ onReload: e, onReset: t }) {
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
async function O() {
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
function k() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
    e[0]?.id && (chrome.tabs.reload(e[0].id), window.close());
  });
}
function A() {
  let [t, n] = (0, y.useState)(!0),
    [r, i] = (0, y.useState)(null),
    [a, s] = (0, y.useState)([]),
    [c, l] = (0, y.useState)(null);
  (0, y.useEffect)(() => {
    O().then((e) => {
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
        k());
    }, [r, d]),
    p = (0, y.useCallback)(
      (t) => {
        r &&
          (i({ ...r, currentRole: t }),
          e({ type: o.SET_ROLE, role: t }).catch(() => d(`Gagal mengubah role`)),
          d(`Role berhasil diubah`),
          k());
      },
      [r, d],
    ),
    m = (0, y.useCallback)(
      (t, n) => {
        r?.features[t] &&
          (i({ ...r, features: { ...r.features, [t]: { ...r.features[t], enabled: n } } }),
          e({ type: o.TOGGLE_FEATURE, key: t, enabled: n }).catch(() => d(`Gagal mengubah fitur`)),
          k());
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
          k());
      },
      [d],
    ),
    _ = (0, y.useCallback)(
      (t) => {
        (s((e) => e.filter((e) => e.id !== t)),
          e({ type: o.DELETE_URL, id: t }).catch(() => d(`Gagal menghapus URL`)),
          k());
      },
      [d],
    ),
    v = (0, y.useCallback)(
      (t, n) => {
        (s((e) => e.map((e) => (e.id === t ? { ...e, enabled: n } : e))),
          e({ type: o.TOGGLE_URL, id: t, enabled: n }).catch(() => d(`Gagal mengubah URL`)),
          k());
      },
      [d],
    ),
    b = (0, y.useCallback)(() => {
      confirm(`Apakah Anda yakin ingin mereset ke pengaturan default?`) &&
        (e({ type: o.RESET_CONFIG }).catch(() => d(`Gagal mereset konfigurasi`)),
        l(`Reset ke default`),
        setTimeout(() => {
          O().then((e) => {
            (i(e.config), s(e.urls), k());
          });
        }, 500));
    }, [d]);
  return t
    ? (0, x.jsx)(`div`, {
        className: `flex items-center justify-center h-[300px]`,
        children: (0, x.jsx)(`p`, {
          className: `text-md-sm text-muted-foreground`,
          children: `Memuat...`,
        }),
      })
    : r
      ? (0, x.jsx)(u, {
          children: (0, x.jsxs)(`div`, {
            className: `w-[340px] min-h-[200px] max-h-[600px] overflow-y-auto`,
            children: [
              (0, x.jsx)(`div`, {
                className: `px-4 pt-3 pb-2 border-b border-border`,
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
                          className: `text-md-sm font-semibold text-foreground`,
                          children: `MORBIS Ext`,
                        }),
                        (0, x.jsx)(`p`, {
                          className: `text-[10px] text-muted-foreground`,
                          children: `Produktivitas SIMRS`,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, x.jsx)(`div`, {
                className: `px-4 py-2.5`,
                children: (0, x.jsx)(w, {
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
                      className: `text-[10px] font-semibold text-muted-foreground uppercase tracking-wider`,
                      children: `Fitur`,
                    }),
                  }),
                  (0, x.jsx)(T, {
                    features: r.features,
                    role: r.currentRole,
                    disabled: !r.extensionEnabled,
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
                      className: `text-[10px] font-semibold text-muted-foreground uppercase tracking-wider`,
                      children: `Domain`,
                    }),
                  }),
                  (0, x.jsx)(E, { urls: a, onAdd: g, onRemove: _, onToggle: v }),
                ],
              }),
              (0, x.jsx)(D, { onReload: k, onReset: b }),
              c &&
                (0, x.jsx)(`div`, {
                  className: `fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up`,
                  role: `alert`,
                  children: (0, x.jsx)(`div`, {
                    className: `px-4 py-2 bg-foreground text-background text-md-xs rounded-lg shadow-lg`,
                    children: c,
                  }),
                }),
            ],
          }),
        })
      : (0, x.jsx)(`div`, {
          className: `flex items-center justify-center h-[300px]`,
          children: (0, x.jsx)(`p`, {
            className: `text-md-sm text-destructive`,
            children: `Gagal memuat konfigurasi`,
          }),
        });
}
var j = document.getElementById(`root`);
j && (0, b.createRoot)(j).render((0, x.jsx)(A, {}));
