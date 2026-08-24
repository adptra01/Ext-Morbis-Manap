import {
  _ as MessageTypes,
  a as SelectItem,
  b as require_react,
  c as X,
  d as Plus,
  g as require_jsx_runtime,
  h as ErrorBoundary,
  i as SelectContent,
  l as RotateCcw,
  n as Input,
  o as SelectTrigger,
  p as Switch,
  r as Select,
  s as SelectValue,
  t as Button,
  u as RefreshCw,
  v as sendMessage,
  x as __toESM,
  y as require_client,
} from './chunks/button-C27lgNH8.js';
//#region src/popup/StatusCard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_client = require_client();
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
  {
    value: 'casemix',
    label: 'Casemix',
  },
  {
    value: 'kasir',
    label: 'Kasir',
  },
  {
    value: 'dokter',
    label: 'Dokter',
  },
  {
    value: 'apotek',
    label: 'Apotek',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'labor',
    label: 'Labor',
  },
  {
    value: 'pendaftaran',
    label: 'Pendaftaran',
  },
];
var ROLE_LABELS = {
  casemix: 'Casemix',
  kasir: 'Kasir',
  dokter: 'Dokter',
  apotek: 'Apotek',
  admin: 'Admin',
  labor: 'Labor',
  pendaftaran: 'Pendaftaran',
};
function StatusCard({ enabled, role, onToggle, onRoleChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'flex items-center justify-between',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex items-center gap-2.5',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
            checked: enabled,
            onCheckedChange: onToggle,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                className: 'flex items-center gap-1.5',
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: `inline-block w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-muted-foreground'}`,
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: 'text-md-xs font-medium text-foreground',
                    children: enabled ? 'Aktif' : 'Non-Aktif',
                  }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('p', {
                className: 'text-[10px] text-muted-foreground mt-0.5',
                children: ['Role: ', ROLE_LABELS[role] || role],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
        value: role,
        onValueChange: (v) => onRoleChange(v),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
            className: 'w-[120px]',
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}),
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
            children: ROLES.map((r) =>
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                SelectItem,
                {
                  value: r.value,
                  children: r.label,
                },
                r.value,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
//#endregion
//#region src/popup/FeaturesPanel.tsx
function FeaturesPanel({ features, role, disabled, onToggle, onModeChange }) {
  const entries = Object.entries(features).filter(
    ([, f]) => role === 'admin' || f.allowedRoles?.includes(role),
  );
  const enabledCount = entries.filter(([, f]) => f.enabled && !f.comingSoon).length;
  if (entries.length === 0)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
      className: 'text-center py-4',
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
        className: 'text-md-xs text-muted-foreground',
        children: 'Tidak ada fitur untuk role ini',
      }),
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: disabled ? 'opacity-50 pointer-events-none' : '',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('p', {
        className: 'text-[10px] text-muted-foreground mb-1.5',
        children: [
          enabledCount,
          ' dari ',
          entries.filter(([, f]) => !f.comingSoon).length,
          ' fitur aktif',
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'space-y-0.5',
        children: entries.map(([key, feature]) => {
          const isComingSoon = feature.comingSoon === true;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            'div',
            {
              className: `flex items-center justify-between px-2.5 py-2 rounded ${feature.enabled && !isComingSoon ? 'bg-accent' : ''} ${isComingSoon ? 'opacity-60' : ''}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                  className: 'flex-1 min-w-0 mr-2',
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                      className: 'flex items-center gap-1.5',
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                          className: 'text-md-xs font-medium text-foreground',
                          children: feature.name || key,
                        }),
                        isComingSoon &&
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                            className:
                              'text-[9px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full',
                            children: 'CS',
                          }),
                      ],
                    }),
                    feature.description &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                        className: 'text-[10px] text-muted-foreground truncate mt-0.5',
                        children: feature.description,
                      }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                  className: 'flex items-center gap-1.5 shrink-0',
                  children: [
                    key === 'openDetailInNewTab' &&
                      feature.modes &&
                      feature.enabled &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
                        value: feature.mode || 'same-tab',
                        onValueChange: (v) => onModeChange(key, v),
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
                            className: 'h-6 text-[10px] w-[90px]',
                            onClick: (e) => e.stopPropagation(),
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}),
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
                            children: Object.entries(feature.modes).map(([k, v]) =>
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                SelectItem,
                                {
                                  value: k,
                                  className: 'text-[10px]',
                                  children: v,
                                },
                                k,
                              ),
                            ),
                          }),
                        ],
                      }),
                    !isComingSoon &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
                        checked: feature.enabled,
                        onCheckedChange: (val) => onToggle(key, val),
                        disabled,
                      }),
                  ],
                }),
              ],
            },
            key,
          );
        }),
      }),
    ],
  });
}
//#endregion
//#region src/popup/DomainPanel.tsx
function DomainPanel({ urls, onAdd, onRemove, onToggle }) {
  const [input, setInput] = (0, import_react.useState)('');
  const [error, setError] = (0, import_react.useState)(null);
  const isValidUrl = (url) => {
    try {
      const p = new URL(url);
      return p.protocol === 'http:' || p.protocol === 'https:';
    } catch {
      return false;
    }
  };
  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Masukkan URL terlebih dahulu');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('Format URL tidak valid');
      return;
    }
    if (urls.find((u) => u.url === trimmed)) {
      setError('URL sudah ada');
      return;
    }
    setError(null);
    onAdd(trimmed);
    setInput('');
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex gap-1.5 mb-1.5',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
            type: 'text',
            value: input,
            onChange: (e) => {
              setInput(e.target.value);
              setError(null);
            },
            onKeyDown: (e) => e.key === 'Enter' && handleAdd(),
            placeholder: 'http://example.com',
            className: 'flex-1',
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
            variant: 'default',
            size: 'sm',
            onClick: handleAdd,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: 'size-3.5' }),
              'Tambah',
            ],
          }),
        ],
      }),
      error &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
          className: 'text-[10px] text-destructive mb-1',
          role: 'alert',
          children: error,
        }),
      urls.length === 0
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
            className: 'text-center text-md-xs text-muted-foreground py-3',
            children: 'Belum ada URL',
          })
        : /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
            className: 'space-y-0.5',
            children: urls.map((item) =>
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                'div',
                {
                  className: `flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-accent group ${item.isDefault ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
                      checked: item.enabled,
                      onCheckedChange: (val) => onToggle(item.id, val),
                      className:
                        'h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3',
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                      className: 'flex-1 text-[10px] text-foreground truncate font-mono',
                      children: item.url,
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                      className: `text-[8px] font-semibold px-1 py-0.5 rounded ${item.isDefault ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-muted text-muted-foreground'}`,
                      children: item.isDefault ? 'DEFAULT' : 'CUSTOM',
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                      onClick: () => onRemove(item.id),
                      disabled: item.isDefault,
                      'aria-label': `Hapus ${item.url}`,
                      className: `p-0.5 rounded transition-colors ${item.isDefault ? 'opacity-0' : 'opacity-0 group-hover:opacity-100 hover:bg-accent'}`,
                      title: 'Hapus',
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
                        className: 'size-3 text-muted-foreground hover:text-destructive',
                      }),
                    }),
                  ],
                },
                item.id,
              ),
            ),
          }),
    ],
  });
}
//#endregion
//#region src/popup/Footer.tsx
function Footer({ onReload, onReset }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'flex items-center gap-2 px-4 py-2.5 border-t border-border',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
        variant: 'default',
        size: 'sm',
        className: 'flex-1',
        onClick: onReload,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: 'size-3.5' }),
          'Reload Halaman',
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
        variant: 'secondary',
        size: 'sm',
        className: 'flex-1',
        onClick: onReset,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: 'size-3.5' }),
          'Reset Default',
        ],
      }),
    ],
  });
}
//#endregion
//#region src/features/shared/usageLog.ts
var KEY = 'extUsageLog';
/** Ambil log (terbaru dulu) — utk viewer/console. */
async function getUsageLog() {
  try {
    const { [KEY]: entries } = await chrome.storage.local.get(KEY);
    return [...(entries ?? [])].reverse();
  } catch {
    return [];
  }
}
/** Bersihkan semua log. */
async function clearUsageLog() {
  try {
    await chrome.storage.local.remove(KEY);
  } catch {}
}
//#endregion
//#region src/popup/UsageLogPanel.tsx
function fmtTime(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getDate()}/${d.getMonth() + 1} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
/**
 * Panel log penggunaan & error fitur. Tersimpan lokal di browser ini
 * (chrome.storage.local), auto-hapus > 1 minggu. Utk diagnosa bug lapangan.
 */
function UsageLogPanel() {
  const [logs, setLogs] = (0, import_react.useState)([]);
  const [expanded, setExpanded] = (0, import_react.useState)(false);
  const refresh = (0, import_react.useCallback)(() => {
    getUsageLog().then((entries) => setLogs(entries.slice(0, 50)));
  }, []);
  (0, import_react.useEffect)(() => {
    if (expanded) refresh();
  }, [expanded, refresh]);
  const errors = logs.filter((l) => !l.ok).length;
  const handleClear = (0, import_react.useCallback)(() => {
    if (!confirm('Hapus semua log penggunaan di komputer ini?')) return;
    clearUsageLog().then(() => {
      setLogs([]);
      refresh();
    });
  }, [refresh]);
  if (!expanded)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('button', {
      onClick: () => setExpanded(true),
      className:
        'w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-md-xs',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
          className: 'text-muted-foreground',
          children: 'Log Penggunaan (7 hari)',
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
          className: `text-md-xs font-semibold ${errors > 0 ? 'text-red-500' : 'text-green-500'}`,
          children:
            logs.length === 0
              ? 'muat…'
              : `${logs.length} entri${errors > 0 ? ` · ${errors} error` : ''}`,
        }),
      ],
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'border border-border rounded-md bg-background',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex items-center justify-between px-3 py-1.5 border-b border-border',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
            className: 'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider',
            children: 'Log Penggunaan (7 hari terakhir)',
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            className: 'flex gap-1',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                onClick: handleClear,
                className:
                  'text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20',
                children: 'Hapus',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                onClick: () => setExpanded(false),
                className: 'text-[10px] px-2 py-0.5 rounded bg-accent text-foreground',
                children: 'Tutup',
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'max-h-[220px] overflow-y-auto p-1.5 space-y-1 font-mono text-[10px]',
        children: [
          logs.length === 0 &&
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
              className: 'text-muted-foreground p-1',
              children: 'Belum ada log.',
            }),
          logs.map((l, i) =>
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              'div',
              {
                className: `flex gap-1.5 items-start rounded px-1.5 py-1 ${l.ok ? 'bg-muted/40' : 'bg-destructive/10'}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: 'text-muted-foreground shrink-0',
                    children: fmtTime(l.ts),
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: l.ok ? 'text-foreground' : 'text-destructive',
                    children: l.feature,
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: 'text-muted-foreground',
                    children: l.event,
                  }),
                  l.detail &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                      className: 'text-muted-foreground truncate max-w-[140px]',
                      children: l.detail,
                    }),
                ],
              },
              i,
            ),
          ),
        ],
      }),
    ],
  });
}
//#endregion
//#region src/popup/App.tsx
async function loadAll() {
  try {
    const result = await sendMessage({ type: MessageTypes.GET_ALL });
    if (result?.config)
      return {
        config: result.config,
        urls: result.urls ?? [],
      };
  } catch {}
  const c = await chrome.storage.sync.get(['extensionConfig', 'extensionCustomUrls']);
  return {
    config: c.extensionConfig ?? {
      extensionEnabled: true,
      currentRole: 'admin',
      features: {},
    },
    urls: c.extensionCustomUrls ?? [],
  };
}
function reloadActiveTab() {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.reload(tabs[0].id);
        window.close();
      }
    },
  );
}
function App() {
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [config, setConfig] = (0, import_react.useState)(null);
  const [urls, setUrls] = (0, import_react.useState)([]);
  const [toast, setToast] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    loadAll().then((result) => {
      setConfig(result.config);
      setUrls(result.urls);
      setLoading(false);
    });
  }, []);
  const showToast = (0, import_react.useCallback)((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2e3);
  }, []);
  const handleToggleExtension = (0, import_react.useCallback)(() => {
    if (!config) return;
    const next = !config.extensionEnabled;
    setConfig({
      ...config,
      extensionEnabled: next,
    });
    sendMessage({
      type: MessageTypes.TOGGLE_EXTENSION,
      enabled: next,
    }).catch(() => showToast('Gagal mengubah status extension'));
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan');
    reloadActiveTab();
  }, [config, showToast]);
  const handleRoleChange = (0, import_react.useCallback)(
    (role) => {
      if (!config) return;
      setConfig({
        ...config,
        currentRole: role,
      });
      sendMessage({
        type: MessageTypes.SET_ROLE,
        role,
      }).catch(() => showToast('Gagal mengubah role'));
      showToast('Role berhasil diubah');
      setTimeout(() => reloadActiveTab(), 600);
    },
    [config, showToast],
  );
  const handleFeatureToggle = (0, import_react.useCallback)(
    (key, value) => {
      if (!config?.features[key]) return;
      setConfig({
        ...config,
        features: {
          ...config.features,
          [key]: {
            ...config.features[key],
            enabled: value,
          },
        },
      });
      sendMessage({
        type: MessageTypes.TOGGLE_FEATURE,
        key,
        enabled: value,
      }).catch(() => showToast('Gagal mengubah fitur'));
      reloadActiveTab();
    },
    [config, showToast],
  );
  const handleModeChange = (0, import_react.useCallback)(
    (key, mode) => {
      if (!config?.features[key]) return;
      setConfig({
        ...config,
        features: {
          ...config.features,
          [key]: {
            ...config.features[key],
            mode,
          },
        },
      });
      sendMessage({
        type: MessageTypes.CHANGE_FEATURE_MODE,
        key,
        mode,
      }).catch(() => showToast('Gagal mengubah mode'));
      showToast('Mode berhasil diubah');
    },
    [config, showToast],
  );
  const handleAddUrl = (0, import_react.useCallback)(
    (url) => {
      const newUrl = {
        id: 'url-' + Date.now(),
        url,
        enabled: true,
        isDefault: false,
      };
      setUrls((prev) => [...prev, newUrl]);
      sendMessage({
        type: MessageTypes.ADD_URL,
        url,
      }).catch(() => showToast('Gagal menambah URL'));
      showToast('URL berhasil ditambahkan');
      reloadActiveTab();
    },
    [showToast],
  );
  const handleRemoveUrl = (0, import_react.useCallback)(
    (id) => {
      setUrls((prev) => prev.filter((u) => u.id !== id));
      sendMessage({
        type: MessageTypes.DELETE_URL,
        id,
      }).catch(() => showToast('Gagal menghapus URL'));
      reloadActiveTab();
    },
    [showToast],
  );
  const handleToggleUrl = (0, import_react.useCallback)(
    (id, value) => {
      setUrls((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                enabled: value,
              }
            : u,
        ),
      );
      sendMessage({
        type: MessageTypes.TOGGLE_URL,
        id,
        enabled: value,
      }).catch(() => showToast('Gagal mengubah URL'));
      reloadActiveTab();
    },
    [showToast],
  );
  const handleReset = (0, import_react.useCallback)(() => {
    if (!confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) return;
    sendMessage({ type: MessageTypes.RESET_CONFIG }).catch(() =>
      showToast('Gagal mereset konfigurasi'),
    );
    setToast('Reset ke default');
    setTimeout(() => {
      loadAll().then((result) => {
        setConfig(result.config);
        setUrls(result.urls);
        reloadActiveTab();
      });
    }, 500);
  }, [showToast]);
  if (loading)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
      className: 'flex items-center justify-center h-[300px]',
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
        className: 'text-md-sm text-muted-foreground',
        children: 'Memuat...',
      }),
    });
  if (!config)
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
      className: 'flex items-center justify-center h-[300px]',
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
        className: 'text-md-sm text-destructive',
        children: 'Gagal memuat konfigurasi',
      }),
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
      className: 'w-[340px] min-h-[200px] max-h-[600px] overflow-y-auto',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'px-4 pt-3 pb-2 border-b border-border',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            className: 'flex items-center gap-2',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                className: 'w-5 h-5 rounded bg-[#2469f0] flex items-center justify-center',
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className: 'text-white text-[10px] font-bold',
                  children: 'M',
                }),
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('h1', {
                    className: 'text-md-sm font-semibold text-foreground',
                    children: 'MORBIS Ext',
                  }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                    className: 'text-[10px] text-muted-foreground',
                    children: 'Produktivitas SIMRS',
                  }),
                ],
              }),
            ],
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'px-4 py-2.5',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
            enabled: config.extensionEnabled,
            role: config.currentRole,
            onToggle: handleToggleExtension,
            onRoleChange: handleRoleChange,
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'px-4 pb-2',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'flex items-center justify-between mb-1',
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                className:
                  'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider',
                children: 'Fitur',
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesPanel, {
              features: config.features,
              role: config.currentRole,
              disabled: !config.extensionEnabled,
              onToggle: handleFeatureToggle,
              onModeChange: handleModeChange,
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'px-4 pb-2',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'flex items-center justify-between mb-1',
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                className:
                  'text-[10px] font-semibold text-muted-foreground uppercase tracking-wider',
                children: 'Domain',
              }),
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainPanel, {
              urls,
              onAdd: handleAddUrl,
              onRemove: handleRemoveUrl,
              onToggle: handleToggleUrl,
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'px-4 pb-2',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsageLogPanel, {}),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
          onReload: reloadActiveTab,
          onReset: handleReset,
        }),
        toast &&
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
            className: 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up',
            role: 'alert',
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'px-4 py-2 bg-foreground text-background text-md-xs rounded-lg shadow-lg',
              children: toast,
            }),
          }),
      ],
    }),
  });
}
//#endregion
//#region popup/main.tsx
var root = document.getElementById('root');
if (root)
  (0, import_client.createRoot)(root).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
//#endregion
