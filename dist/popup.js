import {
  _ as e,
  a as t,
  b as n,
  c as r,
  d as i,
  g as a,
  h as o,
  i as s,
  l as c,
  n as l,
  o as u,
  p as d,
  r as f,
  s as p,
  t as m,
  u as h,
  v as g,
  x as _,
  y as v,
} from './chunks/button-CBl3pa4n.js';
var y = _(n(), 1),
  b = v(),
  x = a(),
  S = [
    { value: `casemix`, label: `Casemix` },
    { value: `kasir`, label: `Kasir` },
    { value: `dokter`, label: `Dokter` },
    { value: `apotek`, label: `Apotek` },
    { value: `admin`, label: `Admin` },
    { value: `labor`, label: `Labor` },
    { value: `pendaftaran`, label: `Pendaftaran` },
  ],
  C = {
    casemix: `Casemix`,
    kasir: `Kasir`,
    dokter: `Dokter`,
    apotek: `Apotek`,
    admin: `Admin`,
    labor: `Labor`,
    pendaftaran: `Pendaftaran`,
  };
function w({ enabled: e, role: n, onToggle: r, onRoleChange: i }) {
  return (0, x.jsxs)(`div`, {
    className: `flex items-center justify-between`,
    children: [
      (0, x.jsxs)(`div`, {
        className: `flex items-center gap-2.5`,
        children: [
          (0, x.jsx)(d, { checked: e, onCheckedChange: r }),
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
      (0, x.jsxs)(f, {
        value: n,
        onValueChange: (e) => i(e),
        children: [
          (0, x.jsx)(u, { className: `w-[120px]`, children: (0, x.jsx)(p, {}) }),
          (0, x.jsx)(s, {
            children: S.map((e) => (0, x.jsx)(t, { value: e.value, children: e.label }, e.value)),
          }),
        ],
      }),
    ],
  });
}
function T({ features: e, role: n, disabled: r, onToggle: i, onModeChange: a }) {
  let o = Object.entries(e).filter(([, e]) => n === `admin` || e.allowedRoles?.includes(n)),
    c = o.filter(([, e]) => e.enabled && !e.comingSoon).length;
  return o.length === 0
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
            children: [c, ` dari `, o.filter(([, e]) => !e.comingSoon).length, ` fitur aktif`],
          }),
          (0, x.jsx)(`div`, {
            className: `space-y-0.5`,
            children: o.map(([e, n]) => {
              let o = n.comingSoon === !0;
              return (0, x.jsxs)(
                `div`,
                {
                  className: `flex items-center justify-between px-2.5 py-2 rounded ${n.enabled && !o ? `bg-accent` : ``} ${o ? `opacity-60` : ``}`,
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
                            o &&
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
                          (0, x.jsxs)(f, {
                            value: n.mode || `same-tab`,
                            onValueChange: (t) => a(e, t),
                            children: [
                              (0, x.jsx)(u, {
                                className: `h-6 text-[10px] w-[90px]`,
                                onClick: (e) => e.stopPropagation(),
                                children: (0, x.jsx)(p, {}),
                              }),
                              (0, x.jsx)(s, {
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
                        !o &&
                          (0, x.jsx)(d, {
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
function E({ urls: e, onAdd: t, onRemove: n, onToggle: a }) {
  let [o, s] = (0, y.useState)(``),
    [c, u] = (0, y.useState)(null),
    f = (e) => {
      try {
        let t = new URL(e);
        return t.protocol === `http:` || t.protocol === `https:`;
      } catch {
        return !1;
      }
    },
    p = () => {
      let n = o.trim();
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
      (u(null), t(n), s(``));
    };
  return (0, x.jsxs)(`div`, {
    children: [
      (0, x.jsxs)(`div`, {
        className: `flex gap-1.5 mb-1.5`,
        children: [
          (0, x.jsx)(l, {
            type: `text`,
            value: o,
            onChange: (e) => {
              (s(e.target.value), u(null));
            },
            onKeyDown: (e) => e.key === `Enter` && p(),
            placeholder: `http://example.com`,
            className: `flex-1`,
          }),
          (0, x.jsxs)(m, {
            variant: `default`,
            size: `sm`,
            onClick: p,
            children: [(0, x.jsx)(i, { className: `size-3.5` }), `Tambah`],
          }),
        ],
      }),
      c &&
        (0, x.jsx)(`p`, {
          className: `text-[10px] text-destructive mb-1`,
          role: `alert`,
          children: c,
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
                    (0, x.jsx)(d, {
                      checked: e.enabled,
                      onCheckedChange: (t) => a(e.id, t),
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
      (0, x.jsxs)(m, {
        variant: `default`,
        size: `sm`,
        className: `flex-1`,
        onClick: e,
        children: [(0, x.jsx)(h, { className: `size-3.5` }), `Reload Halaman`],
      }),
      (0, x.jsxs)(m, {
        variant: `secondary`,
        size: `sm`,
        className: `flex-1`,
        onClick: t,
        children: [(0, x.jsx)(c, { className: `size-3.5` }), `Reset Default`],
      }),
    ],
  });
}
var O = `extUsageLog`;
async function k() {
  try {
    let { [O]: e } = await chrome.storage.local.get(O);
    return [...(e ?? [])].reverse();
  } catch {
    return [];
  }
}
async function A() {
  try {
    await chrome.storage.local.remove(O);
  } catch {}
}
function j(e) {
  let t = new Date(e),
    n = (e) => String(e).padStart(2, `0`);
  return `${t.getDate()}/${t.getMonth() + 1} ${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}`;
}
function M() {
  let [e, t] = (0, y.useState)([]),
    [n, r] = (0, y.useState)(!1),
    i = (0, y.useCallback)(() => {
      k().then((e) => t(e.slice(0, 50)));
    }, []);
  (0, y.useEffect)(() => {
    n && i();
  }, [n, i]);
  let a = e.filter((e) => !e.ok).length,
    o = (0, y.useCallback)(() => {
      confirm(`Hapus semua log penggunaan di komputer ini?`) &&
        A().then(() => {
          (t([]), i());
        });
    }, [i]);
  return n
    ? (0, x.jsxs)(`div`, {
        className: `border border-border rounded-md bg-background`,
        children: [
          (0, x.jsxs)(`div`, {
            className: `flex items-center justify-between px-3 py-1.5 border-b border-border`,
            children: [
              (0, x.jsx)(`span`, {
                className: `text-[10px] font-semibold text-muted-foreground uppercase tracking-wider`,
                children: `Log Penggunaan (7 hari terakhir)`,
              }),
              (0, x.jsxs)(`div`, {
                className: `flex gap-1`,
                children: [
                  (0, x.jsx)(`button`, {
                    onClick: o,
                    className: `text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20`,
                    children: `Hapus`,
                  }),
                  (0, x.jsx)(`button`, {
                    onClick: () => r(!1),
                    className: `text-[10px] px-2 py-0.5 rounded bg-accent text-foreground`,
                    children: `Tutup`,
                  }),
                ],
              }),
            ],
          }),
          (0, x.jsxs)(`div`, {
            className: `max-h-[220px] overflow-y-auto p-1.5 space-y-1 font-mono text-[10px]`,
            children: [
              e.length === 0 &&
                (0, x.jsx)(`p`, {
                  className: `text-muted-foreground p-1`,
                  children: `Belum ada log.`,
                }),
              e.map((e, t) =>
                (0, x.jsxs)(
                  `div`,
                  {
                    className: `flex gap-1.5 items-start rounded px-1.5 py-1 ${e.ok ? `bg-muted/40` : `bg-destructive/10`}`,
                    children: [
                      (0, x.jsx)(`span`, {
                        className: `text-muted-foreground shrink-0`,
                        children: j(e.ts),
                      }),
                      (0, x.jsx)(`span`, {
                        className: e.ok ? `text-foreground` : `text-destructive`,
                        children: e.feature,
                      }),
                      (0, x.jsx)(`span`, { className: `text-muted-foreground`, children: e.event }),
                      e.detail &&
                        (0, x.jsx)(`span`, {
                          className: `text-muted-foreground truncate max-w-[140px]`,
                          children: e.detail,
                        }),
                    ],
                  },
                  t,
                ),
              ),
            ],
          }),
        ],
      })
    : (0, x.jsxs)(`button`, {
        onClick: () => r(!0),
        className: `w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-md-xs`,
        children: [
          (0, x.jsx)(`span`, {
            className: `text-muted-foreground`,
            children: `Log Penggunaan (7 hari)`,
          }),
          (0, x.jsx)(`span`, {
            className: `text-md-xs font-semibold ${a > 0 ? `text-red-500` : `text-green-500`}`,
            children: e.length === 0 ? `muat…` : `${e.length} entri${a > 0 ? ` · ${a} error` : ``}`,
          }),
        ],
      });
}
async function N() {
  try {
    let t = await g({ type: e.GET_ALL });
    if (t?.config) return { config: t.config, urls: t.urls ?? [] };
  } catch {}
  let t = await chrome.storage.sync.get([`extensionConfig`, `extensionCustomUrls`]);
  return {
    config: t.extensionConfig ?? { extensionEnabled: !0, currentRole: `casemix`, features: {} },
    urls: t.extensionCustomUrls ?? [],
  };
}
function P() {
  chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
    e[0]?.id && (chrome.tabs.reload(e[0].id), window.close());
  });
}
function F() {
  let [t, n] = (0, y.useState)(!0),
    [r, i] = (0, y.useState)(null),
    [a, s] = (0, y.useState)([]),
    [c, l] = (0, y.useState)(null);
  (0, y.useEffect)(() => {
    N().then((e) => {
      (i(e.config), s(e.urls), n(!1));
    });
  }, []);
  let u = (0, y.useCallback)((e) => {
      (l(e), setTimeout(() => l(null), 2e3));
    }, []),
    d = (0, y.useCallback)(() => {
      if (!r) return;
      let t = !r.extensionEnabled;
      (i({ ...r, extensionEnabled: t }),
        g({ type: e.TOGGLE_EXTENSION, enabled: t }).catch(() =>
          u(`Gagal mengubah status extension`),
        ),
        u(t ? `Extension diaktifkan` : `Extension dinonaktifkan`),
        P());
    }, [r, u]),
    f = (0, y.useCallback)(
      (t) => {
        r &&
          (i({ ...r, currentRole: t }),
          g({ type: e.SET_ROLE, role: t }).catch(() => u(`Gagal mengubah role`)),
          u(`Role berhasil diubah`),
          P());
      },
      [r, u],
    ),
    p = (0, y.useCallback)(
      (t, n) => {
        r?.features[t] &&
          (i({ ...r, features: { ...r.features, [t]: { ...r.features[t], enabled: n } } }),
          g({ type: e.TOGGLE_FEATURE, key: t, enabled: n }).catch(() => u(`Gagal mengubah fitur`)),
          P());
      },
      [r, u],
    ),
    m = (0, y.useCallback)(
      (t, n) => {
        r?.features[t] &&
          (i({ ...r, features: { ...r.features, [t]: { ...r.features[t], mode: n } } }),
          g({ type: e.CHANGE_FEATURE_MODE, key: t, mode: n }).catch(() => u(`Gagal mengubah mode`)),
          u(`Mode berhasil diubah`));
      },
      [r, u],
    ),
    h = (0, y.useCallback)(
      (t) => {
        let n = { id: `url-` + Date.now(), url: t, enabled: !0, isDefault: !1 };
        (s((e) => [...e, n]),
          g({ type: e.ADD_URL, url: t }).catch(() => u(`Gagal menambah URL`)),
          u(`URL berhasil ditambahkan`),
          P());
      },
      [u],
    ),
    _ = (0, y.useCallback)(
      (t) => {
        (s((e) => e.filter((e) => e.id !== t)),
          g({ type: e.DELETE_URL, id: t }).catch(() => u(`Gagal menghapus URL`)),
          P());
      },
      [u],
    ),
    v = (0, y.useCallback)(
      (t, n) => {
        (s((e) => e.map((e) => (e.id === t ? { ...e, enabled: n } : e))),
          g({ type: e.TOGGLE_URL, id: t, enabled: n }).catch(() => u(`Gagal mengubah URL`)),
          P());
      },
      [u],
    ),
    b = (0, y.useCallback)(() => {
      confirm(`Apakah Anda yakin ingin mereset ke pengaturan default?`) &&
        (g({ type: e.RESET_CONFIG }).catch(() => u(`Gagal mereset konfigurasi`)),
        l(`Reset ke default`),
        setTimeout(() => {
          N().then((e) => {
            (i(e.config), s(e.urls), P());
          });
        }, 500));
    }, [u]);
  return t
    ? (0, x.jsx)(`div`, {
        className: `flex items-center justify-center h-[300px]`,
        children: (0, x.jsx)(`p`, {
          className: `text-md-sm text-muted-foreground`,
          children: `Memuat...`,
        }),
      })
    : r
      ? (0, x.jsx)(o, {
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
                  onToggle: d,
                  onRoleChange: f,
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
                    onToggle: p,
                    onModeChange: m,
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
                  (0, x.jsx)(E, { urls: a, onAdd: h, onRemove: _, onToggle: v }),
                ],
              }),
              (0, x.jsx)(`div`, { className: `px-4 pb-2`, children: (0, x.jsx)(M, {}) }),
              (0, x.jsx)(D, { onReload: P, onReset: b }),
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
var I = document.getElementById(`root`);
I && (0, b.createRoot)(I).render((0, x.jsx)(F, {}));
