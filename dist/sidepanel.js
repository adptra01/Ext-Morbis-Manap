import {
  _ as MessageTypes,
  a as SelectItem,
  b as require_react,
  c as X,
  d as Plus,
  f as createLucideIcon,
  g as require_jsx_runtime,
  h as ErrorBoundary,
  i as SelectContent,
  l as RotateCcw,
  m as cn,
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
} from './chunks/button-BR1zt3H2.js';
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Check = createLucideIcon('check', [
  [
    'path',
    {
      d: 'M20 6 9 17l-5-5',
      key: '1gmf2c',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var CircleAlert = createLucideIcon('circle-alert', [
  [
    'circle',
    {
      cx: '12',
      cy: '12',
      r: '10',
      key: '1mglay',
    },
  ],
  [
    'line',
    {
      x1: '12',
      x2: '12',
      y1: '8',
      y2: '12',
      key: '1pkeuh',
    },
  ],
  [
    'line',
    {
      x1: '12',
      x2: '12.01',
      y1: '16',
      y2: '16',
      key: '4dfq90',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Eye = createLucideIcon('eye', [
  [
    'path',
    {
      d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
      key: '1nclc0',
    },
  ],
  [
    'circle',
    {
      cx: '12',
      cy: '12',
      r: '3',
      key: '1v7zrd',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Info = createLucideIcon('info', [
  [
    'circle',
    {
      cx: '12',
      cy: '12',
      r: '10',
      key: '1mglay',
    },
  ],
  [
    'path',
    {
      d: 'M12 16v-4',
      key: '1dtifu',
    },
  ],
  [
    'path',
    {
      d: 'M12 8h.01',
      key: 'e9boi3',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Search = createLucideIcon('search', [
  [
    'path',
    {
      d: 'm21 21-4.34-4.34',
      key: '14j7rj',
    },
  ],
  [
    'circle',
    {
      cx: '11',
      cy: '11',
      r: '8',
      key: '4ej97u',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Trash2 = createLucideIcon('trash-2', [
  [
    'path',
    {
      d: 'M10 11v6',
      key: 'nco0om',
    },
  ],
  [
    'path',
    {
      d: 'M14 11v6',
      key: 'outv1u',
    },
  ],
  [
    'path',
    {
      d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
      key: 'miytrc',
    },
  ],
  [
    'path',
    {
      d: 'M3 6h18',
      key: 'd0wm0j',
    },
  ],
  [
    'path',
    {
      d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      key: 'e791ji',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var TriangleAlert = createLucideIcon('triangle-alert', [
  [
    'path',
    {
      d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
      key: 'wmoenq',
    },
  ],
  [
    'path',
    {
      d: 'M12 9v4',
      key: 'juzpu7',
    },
  ],
  [
    'path',
    {
      d: 'M12 17h.01',
      key: 'p32p05',
    },
  ],
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Upload = createLucideIcon('upload', [
  [
    'path',
    {
      d: 'M12 3v12',
      key: '1x0j5s',
    },
  ],
  [
    'path',
    {
      d: 'm17 8-5-5-5 5',
      key: '7q97r8',
    },
  ],
  [
    'path',
    {
      d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
      key: 'ih7n3h',
    },
  ],
]);
//#endregion
//#region src/ui/hooks/useDarkMode.ts
var import_client = require_client();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var STORAGE_KEY = 'theme';
function useDarkMode() {
  const [theme, setTheme] = (0, import_react.useState)(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) return 'system';
    return 'system';
  });
  const [resolved, setResolved] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    chrome.storage.sync.get(STORAGE_KEY, (result) => {
      const stored = result[STORAGE_KEY] || 'system';
      setTheme(stored);
      applyTheme(stored);
    });
  }, []);
  const applyTheme = (0, import_react.useCallback)((t) => {
    let isDark;
    if (t === 'system') isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    else isDark = t === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    setResolved(isDark);
  }, []);
  const setAndStore = (0, import_react.useCallback)(
    (t) => {
      setTheme(t);
      applyTheme(t);
      chrome.storage.sync.set({ [STORAGE_KEY]: t });
    },
    [applyTheme],
  );
  (0, import_react.useEffect)(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);
  return {
    theme,
    resolved,
    setTheme: setAndStore,
  };
}
//#endregion
//#region src/ui/components/Badge.tsx
var import_jsx_runtime = require_jsx_runtime();
var variants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  success:
    'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
  warning:
    'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  danger: 'bg-destructive/10 text-destructive border-destructive/20',
};
var icons = {
  default: Info,
  success: Check,
  warning: TriangleAlert,
  danger: X,
};
function Badge({ variant = 'default', icon, children, className, onDismiss }) {
  const Icon = icons[variant];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
    className: cn(
      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
      variants[variant],
      className,
    ),
    children: [
      icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: 'size-3' }),
      children,
      onDismiss &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
          onClick: onDismiss,
          className: 'ml-0.5 hover:opacity-70',
          'aria-label': 'Dismiss',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: 'size-2.5' }),
        }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/RoleSelector.tsx
var roleOptions = [
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
    value: 'pendaftaran',
    label: 'Pendaftaran',
  },
];
function RoleSelector({ value, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
    value,
    onValueChange: (v) => onChange(v),
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
        className: 'w-[120px]',
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
        children: roleOptions.map((opt) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            SelectItem,
            {
              value: opt.value,
              children: opt.label,
            },
            opt.value,
          ),
        ),
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/StatusCard.tsx
function StatusCard({ enabled, role, onToggle, onRoleChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className:
      'rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex items-center justify-between',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex items-center gap-3',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
            checked: enabled,
            onCheckedChange: onToggle,
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                className: 'flex items-center gap-2',
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: 'text-md-sm font-semibold text-foreground',
                    children: 'MORBIS Ext',
                  }),
                  enabled &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
                      variant: 'success',
                      children: 'Aktif',
                    }),
                ],
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                className: 'text-md-xs text-muted-foreground mt-0.5',
                children: enabled ? 'Extension aktif di halaman ini' : 'Extension tidak aktif',
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSelector, {
        value: role,
        onChange: (v) => onRoleChange(v),
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/FeaturesPanel.tsx
function FeaturesPanel({ features, enabledFeatures, role, disabled, onToggle, onModeChange }) {
  const visible = features.filter((f) => f.roles.includes(role));
  const activeCount = visible.filter((f) => enabledFeatures[f.key]).length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'flex items-center justify-between mb-3',
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('p', {
          className: 'text-md-xs text-muted-foreground font-medium',
          children: [activeCount, ' dari ', visible.length, ' aktif'],
        }),
      }),
      visible.length === 0 &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'text-center py-8',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
            className: 'text-md-sm text-muted-foreground',
            children: 'Tidak ada fitur untuk role ini',
          }),
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'space-y-0.5',
        children: visible.map((feature) => {
          const isEnabled = !!enabledFeatures[feature.key];
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            'div',
            {
              className: `
                flex items-center justify-between px-3 py-2.5 rounded-md
                ${isEnabled ? 'bg-accent' : ''}
                ${feature.comingSoon ? 'opacity-60' : 'cursor-pointer hover:bg-accent'}
              `,
              onClick: () => {
                if (!feature.comingSoon && !disabled) onToggle(feature.key, !isEnabled);
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                  className: 'flex-1 min-w-0 mr-3',
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                          className: 'text-md-sm font-medium text-foreground',
                          children: feature.name,
                        }),
                        feature.comingSoon &&
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                            className:
                              'text-[10px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 px-1.5 py-0.5 rounded-full',
                            children: 'CS',
                          }),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                      className: 'text-md-xs text-muted-foreground mt-0.5 truncate',
                      children: feature.desc,
                    }),
                  ],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                  className: 'flex items-center gap-1.5 shrink-0',
                  children: [
                    feature.key === 'openDetailInNewTab' &&
                      feature.modes &&
                      enabledFeatures[feature.key] &&
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
                        value: feature.mode || 'same-tab',
                        onValueChange: (v) => onModeChange(feature.key, v),
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
                            className: 'h-7 text-md-xs w-[100px]',
                            onClick: (e) => e.stopPropagation(),
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}),
                          }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
                            children: Object.entries(feature.modes).map(([k, v]) =>
                              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                SelectItem,
                                {
                                  value: k,
                                  className: 'text-md-xs',
                                  children: v,
                                },
                                k,
                              ),
                            ),
                          }),
                        ],
                      }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
                      checked: isEnabled,
                      onCheckedChange: (val) => {
                        if (!feature.comingSoon) onToggle(feature.key, val);
                      },
                      disabled: disabled || feature.comingSoon,
                    }),
                  ],
                }),
              ],
            },
            feature.key,
          );
        }),
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/DomainPanel.tsx
var isValidUrl = (url) => {
  try {
    const p = new URL(url);
    return p.protocol === 'http:' || p.protocol === 'https:';
  } catch {
    return false;
  }
};
function DomainPanel({ urls, onAdd, onRemove, onToggle }) {
  const [input, setInput] = (0, import_react.useState)('');
  const [error, setError] = (0, import_react.useState)(null);
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
    className: 'space-y-3',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex gap-2',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
            type: 'text',
            value: input,
            onChange: (e) => {
              setInput(e.target.value);
              setError(null);
            },
            onKeyDown: (e) => e.key === 'Enter' && handleAdd(),
            placeholder: 'http://192.168.1.100',
            className: 'flex-1',
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
            variant: 'default',
            size: 'sm',
            onClick: handleAdd,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: 'size-3.5' }),
              'Add',
            ],
          }),
        ],
      }),
      error &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
          className: 'text-md-xs text-destructive',
          role: 'alert',
          children: error,
        }),
      urls.length === 0 &&
        !error &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'text-center py-8',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
            className: 'text-md-sm text-muted-foreground',
            children: 'Belum ada domain',
          }),
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'space-y-1',
        children: urls.map((item) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            'div',
            {
              className: `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent group ${item.isDefault ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
                  checked: item.enabled,
                  onCheckedChange: (val) => onToggle(item.id, val),
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className: 'flex-1 text-md-xs text-foreground truncate font-mono',
                  children: item.url,
                }),
                item.isDefault &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className:
                      'text-[10px] font-semibold text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 px-1.5 py-0.5 rounded',
                    children: 'DEFAULT',
                  }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                  onClick: () => onRemove(item.id),
                  disabled: item.isDefault,
                  'aria-label': `Hapus ${item.url}`,
                  className: `p-1 rounded transition-colors ${item.isDefault ? 'opacity-30 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive'}`,
                  title: item.isDefault ? 'URL default tidak dapat dihapus' : 'Hapus',
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
                    className: 'size-3.5',
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
//#region src/features/sidepanel/BatchUploadPanel.tsx
function BatchUploadPanel({ tabId }) {
  const [mode, setMode] = (0, import_react.useState)('manual');
  const [inputText, setInputText] = (0, import_react.useState)('');
  const [items, setItems] = (0, import_react.useState)([]);
  const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
  const [progress, setProgress] = (0, import_react.useState)(0);
  const [statusText, setStatusText] = (0, import_react.useState)('');
  const [searchQuery, setSearchQuery] = (0, import_react.useState)('');
  const [showFinishedReload, setShowFinishedReload] = (0, import_react.useState)(false);
  const sendTabAction = (0, import_react.useCallback)(
    async (action, payload) => {
      try {
        await chrome.runtime.sendMessage({
          type: 'TAB_ACTION',
          tabId,
          action,
          payload,
        });
      } catch (err) {
        console.error('Error sending tab action:', err);
      }
    },
    [tabId],
  );
  (0, import_react.useEffect)(() => {
    const handleMessage = (message) => {
      if (message.type === 'TAB_ACTION_RESULT') {
        const { action, data } = message;
        if (action === 'BATCH_UPLOAD_PROGRESS') {
          const { percent, status, items: updatedItems, finished } = data;
          setProgress(percent);
          setStatusText(status);
          if (updatedItems) setItems(updatedItems);
          if (finished) {
            setIsProcessing(false);
            setShowFinishedReload(true);
          }
        } else if (action === 'BATCH_UPLOAD_ANALYZE_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} URL siap diproses`);
          setIsProcessing(false);
        } else if (action === 'BATCH_UPLOAD_CRAWL_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} dokumen berhasil ditemukan!`);
          setIsProcessing(false);
        } else if (action === 'BATCH_UPLOAD_ERROR') {
          setStatusText(`Error: ${data.error}`);
          setIsProcessing(false);
        }
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);
  const handleAnalyze = () => {
    if (!inputText.trim()) {
      alert('Silakan paste URL terlebih dahulu');
      return;
    }
    setIsProcessing(true);
    setStatusText('Menganalisis URL...');
    sendTabAction('BATCH_UPLOAD_ANALYZE', { inputText });
  };
  const handleCrawl = () => {
    setIsProcessing(true);
    setStatusText('Mencari dokumen di rekam medis...');
    sendTabAction('BATCH_UPLOAD_CRAWL', null);
  };
  const handleToggleItem = (index) => {
    const updated = [...items];
    updated[index].selected = !updated[index].selected;
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };
  const handleKeteranganChange = (index, val) => {
    const updated = [...items];
    updated[index].keterangan = val;
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };
  const handleRemoveItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
    sendTabAction('BATCH_UPLOAD_UPDATE_ITEMS', { items: updated });
  };
  const handlePreview = (item) => {
    sendTabAction('BATCH_UPLOAD_PREVIEW', {
      url: item.url,
      filename: item.filename,
    });
  };
  const handleStartUpload = () => {
    const selectedCount = items.filter((i) => i.selected !== false).length;
    if (selectedCount === 0) {
      alert('Tidak ada dokumen yang dipilih untuk diupload.');
      return;
    }
    if (confirm(`Upload ${selectedCount} dokumen? Proses ini tidak dapat dibatalkan.`)) {
      setIsProcessing(true);
      setProgress(0);
      setStatusText('Memulai upload...');
      sendTabAction('BATCH_UPLOAD_START', null);
    }
  };
  const handleTestSingle = () => {
    if (items.length === 0) {
      alert('Tidak ada URL untuk ditest');
      return;
    }
    setIsProcessing(true);
    setStatusText('Testing single upload...');
    sendTabAction('BATCH_UPLOAD_TEST_SINGLE', null);
  };
  const handleReload = () => {
    chrome.tabs.reload(tabId);
  };
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.filename.toLowerCase().includes(query) ||
      item.keterangan.toLowerCase().includes(query) ||
      item.norm.toLowerCase().includes(query)
    );
  });
  const selectedCount = items.filter((i) => i.selected !== false).length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'space-y-4',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className: 'flex gap-4 border-b border-border pb-2',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
            onClick: () => {
              if (!isProcessing) setMode('manual');
            },
            className: `flex-1 pb-1.5 text-md-xs font-semibold border-b-2 text-center transition-all ${mode === 'manual' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`,
            disabled: isProcessing,
            children: 'Mode Manual (Paste URL)',
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
            onClick: () => {
              if (!isProcessing) setMode('auto');
            },
            className: `flex-1 pb-1.5 text-md-xs font-semibold border-b-2 text-center transition-all ${mode === 'auto' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`,
            disabled: isProcessing,
            children: 'Auto-Crawl Rekam Medis',
          }),
        ],
      }),
      mode === 'manual'
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            className: 'space-y-2',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('label', {
                className: 'text-md-xs font-medium text-muted-foreground',
                children: 'Paste URL Dokumen (satu per baris):',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('textarea', {
                value: inputText,
                onChange: (e) => setInputText(e.target.value),
                disabled: isProcessing,
                placeholder: 'https://example.com/dokumen1.pdf\nhttps://example.com/dokumen2.jpg',
                className:
                  'w-full h-24 p-2 text-md-xs border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                size: 'sm',
                onClick: handleAnalyze,
                disabled: isProcessing || !inputText.trim(),
                className: 'w-full',
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
                    className: 'size-3.5 mr-1',
                  }),
                  ' Analisis URL',
                ],
              }),
            ],
          })
        : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            className: 'space-y-2',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                className: 'text-md-xs text-muted-foreground',
                children: 'Mendeteksi dokumen otomatis dari halaman Rekam Medis pasien ini.',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                size: 'sm',
                variant: 'outline',
                onClick: handleCrawl,
                disabled: isProcessing,
                className: 'w-full border-primary/20 hover:bg-primary/5 text-primary',
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
                    className: 'size-3.5 mr-1',
                  }),
                  ' Cari Dokumen Pasien Otomatis',
                ],
              }),
            ],
          }),
      statusText &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className:
            'p-2.5 bg-accent/40 rounded-md border border-border space-y-1.5 animate-in fade-in duration-200',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className: 'text-[11px] font-medium text-foreground truncate max-w-[200px]',
                  children: statusText,
                }),
                isProcessing &&
                  progress > 0 &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                    className: 'text-[10px] font-semibold text-primary',
                    children: [Math.round(progress), '%'],
                  }),
              ],
            }),
            isProcessing &&
              progress > 0 &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                className: 'w-full h-1 bg-muted rounded-full overflow-hidden',
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                  className: 'h-full bg-primary transition-all duration-300',
                  style: { width: `${progress}%` },
                }),
              }),
          ],
        }),
      items.length > 0 &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'space-y-2',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                  className: 'text-md-xs font-semibold',
                  children: ['Preview (', selectedCount, ' / ', items.length, ' dipilih)'],
                }),
                mode === 'auto' &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                    placeholder: 'Cari...',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: 'h-6 max-w-[120px] text-[11px]',
                  }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className:
                'max-h-60 overflow-y-auto border border-border rounded-md divide-y divide-border bg-card',
              children: [
                filteredItems.map((item, idx) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    'div',
                    {
                      className: `p-2 text-md-xs flex items-start gap-2 transition-colors ${item.selected !== false ? 'bg-accent/20' : 'opacity-60'}`,
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('input', {
                          type: 'checkbox',
                          checked: item.selected !== false,
                          onChange: () => handleToggleItem(idx),
                          disabled: isProcessing,
                          className:
                            'mt-0.5 rounded border-input text-primary focus:ring-primary size-3.5',
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                          className: 'flex-1 min-w-0 space-y-1',
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                              className: 'flex items-start justify-between gap-1',
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                  className: 'font-medium text-foreground truncate block',
                                  title: item.filename,
                                  children: [idx + 1, '. ', item.filename],
                                }),
                                item.status !== 'pending' &&
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
                                    variant: item.status === 'success' ? 'success' : 'danger',
                                    className: 'shrink-0 scale-90',
                                    children: item.status === 'success' ? 'Sukses' : 'Gagal',
                                  }),
                              ],
                            }),
                            item.tglFileTabel
                              ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                                  className: 'text-[10px] text-muted-foreground flex gap-1.5',
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                      children: ['Dibuat: ', item.tglFileTabel],
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                                      children: '|',
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                      children: ['Unggah: ', item.tglUploadTabel],
                                    }),
                                  ],
                                })
                              : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                                  className: 'text-[10px] text-muted-foreground flex gap-1.5',
                                  children: [
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                      children: ['NORM: ', item.norm || '-'],
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                                      children: '|',
                                    }),
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                      children: ['Tgl Klaim: ', item.tanggal],
                                    }),
                                  ],
                                }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                              value: item.keterangan,
                              onChange: (e) => handleKeteranganChange(idx, e.target.value),
                              placeholder: 'Keterangan...',
                              disabled: isProcessing,
                              className: 'h-6 text-[10px] py-0 px-1.5',
                            }),
                            item.error &&
                              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('p', {
                                className: 'text-[10px] text-destructive flex items-center gap-1',
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
                                    className: 'size-3 shrink-0',
                                  }),
                                  ' ',
                                  item.error,
                                ],
                              }),
                          ],
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                          className: 'flex flex-col gap-1.5 shrink-0',
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => handlePreview(item),
                              className:
                                'p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all',
                              title: 'Preview File',
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
                                className: 'size-3.5',
                              }),
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => handleRemoveItem(idx),
                              disabled: isProcessing,
                              className:
                                'p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-all disabled:opacity-50',
                              title: 'Buang dari Antrian',
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
                                className: 'size-3.5',
                              }),
                            }),
                          ],
                        }),
                      ],
                    },
                    idx,
                  ),
                ),
                filteredItems.length === 0 &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                    className: 'p-4 text-center text-muted-foreground text-md-xs',
                    children: 'Tidak ada dokumen yang cocok.',
                  }),
              ],
            }),
          ],
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'flex gap-2',
        children: showFinishedReload
          ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
              onClick: handleReload,
              variant: 'default',
              className: 'w-full bg-green-600 hover:bg-green-700 text-white',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
                  className: 'size-3.5 mr-1',
                }),
                ' Reload Halaman',
              ],
            })
          : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                  variant: 'outline',
                  size: 'sm',
                  onClick: handleTestSingle,
                  disabled: isProcessing || items.length === 0,
                  className:
                    'flex-1 text-amber-700 border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/20',
                  children: 'Test 1 URL',
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
                  variant: 'default',
                  size: 'sm',
                  onClick: handleStartUpload,
                  disabled: isProcessing || items.length === 0 || selectedCount === 0,
                  className: 'flex-1',
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
                      className: 'size-3.5 mr-1',
                    }),
                    ' Mulai Upload',
                  ],
                }),
              ],
            }),
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/BatchDeletePanel.tsx
function BatchDeletePanel({ tabId }) {
  const [items, setItems] = (0, import_react.useState)([]);
  const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
  const [progress, setProgress] = (0, import_react.useState)(0);
  const [statusText, setStatusText] = (0, import_react.useState)('');
  const [searchQuery, setSearchQuery] = (0, import_react.useState)('');
  const [showFinishedReload, setShowFinishedReload] = (0, import_react.useState)(false);
  const sendTabAction = (0, import_react.useCallback)(
    async (action, payload) => {
      try {
        await chrome.runtime.sendMessage({
          type: 'TAB_ACTION',
          tabId,
          action,
          payload,
        });
      } catch (err) {
        console.error('Error sending tab action:', err);
      }
    },
    [tabId],
  );
  (0, import_react.useEffect)(() => {
    const handleMessage = (message) => {
      if (message.type === 'TAB_ACTION_RESULT') {
        const { action, data } = message;
        if (action === 'BATCH_DELETE_PROGRESS') {
          const { percent, status, items: updatedItems, finished } = data;
          setProgress(percent);
          setStatusText(status);
          if (updatedItems) setItems(updatedItems);
          if (finished) {
            setIsProcessing(false);
            setShowFinishedReload(true);
          }
        } else if (action === 'BATCH_DELETE_CRAWL_RESULT') {
          setItems(data.items);
          setStatusText(`${data.items.length} dokumen ditemukan.`);
          setIsProcessing(false);
        } else if (action === 'BATCH_DELETE_SINGLE_RESULT') {
          const { index, success, error } = data;
          const updated = [...items];
          if (success) {
            updated.splice(index, 1);
            setStatusText('Dokumen berhasil dihapus.');
          } else {
            updated[index].status = 'error';
            setStatusText(`Gagal menghapus: ${error}`);
          }
          setItems(updated);
          setIsProcessing(false);
        } else if (action === 'BATCH_DELETE_ERROR') {
          setStatusText(`Error: ${data.error}`);
          setIsProcessing(false);
        }
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [items]);
  const handleCrawl = () => {
    setIsProcessing(true);
    setStatusText('Mencari dokumen pasien...');
    sendTabAction('BATCH_DELETE_CRAWL', null);
  };
  const handleToggleItem = (index) => {
    const updated = [...items];
    updated[index].selected = !updated[index].selected;
    setItems(updated);
    sendTabAction('BATCH_DELETE_UPDATE_ITEMS', { items: updated });
  };
  const handlePreview = (item) => {
    sendTabAction('BATCH_DELETE_PREVIEW', {
      url: item.url,
      filename: item.filename,
    });
  };
  const handleSingleDelete = (index) => {
    const item = items[index];
    if (!item) return;
    if (
      confirm(
        `Hapus dokumen ini?\n\n${item.filename}\nID: ${item.id_dokumen}\n\nTindakan ini tidak bisa di-undo.`,
      )
    ) {
      setIsProcessing(true);
      setStatusText(`Menghapus: ${item.filename}...`);
      sendTabAction('BATCH_DELETE_SINGLE', {
        index,
        id_dokumen: item.id_dokumen,
      });
    }
  };
  const handleStartDelete = () => {
    const selectedCount = items.filter((i) => i.selected).length;
    if (selectedCount === 0) {
      alert('Pilih dokumen untuk dihapus');
      return;
    }
    if (
      confirm(
        `Hapus ${selectedCount} dokumen? TINDAKAN INI BERSIFAT PERMANEN DAN TIDAK BISA DIUNDO!`,
      )
    ) {
      setIsProcessing(true);
      setProgress(0);
      setStatusText('Memulai penghapusan massal...');
      sendTabAction('BATCH_DELETE_START', null);
    }
  };
  const handleReload = () => {
    chrome.tabs.reload(tabId);
  };
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.filename.toLowerCase().includes(query) ||
      item.keterangan.toLowerCase().includes(query) ||
      item.id_dokumen.toLowerCase().includes(query)
    );
  });
  const selectedCount = items.filter((i) => i.selected).length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'space-y-4',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
        className:
          'p-3 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-md space-y-1.5',
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
            className:
              'flex items-center gap-1.5 font-semibold text-md-xs text-red-900 dark:text-red-200',
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
                className: 'size-4 shrink-0',
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', { children: 'PERHATIAN!' }),
            ],
          }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('p', {
            className: 'text-[11px] leading-relaxed opacity-90',
            children: [
              'File yang dihapus ',
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('strong', {
                children: 'tidak dapat dikembalikan',
              }),
              '. Tindakan ini bersifat permanen dan seketika menghapus dari database server.',
            ],
          }),
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'space-y-2',
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
          size: 'sm',
          variant: 'outline',
          onClick: handleCrawl,
          disabled: isProcessing,
          className: 'w-full border-primary/20 hover:bg-primary/5 text-primary',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: 'size-3.5 mr-1' }),
            ' Cari Dokumen Pasien',
          ],
        }),
      }),
      statusText &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className:
            'p-2.5 bg-accent/40 rounded-md border border-border space-y-1.5 animate-in fade-in duration-200',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className: 'text-[11px] font-medium text-foreground truncate max-w-[200px]',
                  children: statusText,
                }),
                isProcessing &&
                  progress > 0 &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                    className: 'text-[10px] font-semibold text-primary',
                    children: [Math.round(progress), '%'],
                  }),
              ],
            }),
            isProcessing &&
              progress > 0 &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                className: 'w-full h-1 bg-muted rounded-full overflow-hidden',
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                  className: 'h-full bg-primary transition-all duration-300',
                  style: { width: `${progress}%` },
                }),
              }),
          ],
        }),
      items.length > 0 &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'space-y-2',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className: 'flex items-center justify-between',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                  className: 'text-md-xs font-semibold',
                  children: ['Preview (', selectedCount, ' / ', items.length, ' dipilih)'],
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
                  placeholder: 'Cari...',
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: 'h-6 max-w-[120px] text-[11px]',
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className:
                'max-h-60 overflow-y-auto border border-border rounded-md divide-y divide-border bg-card',
              children: [
                filteredItems.map((item, idx) =>
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    'div',
                    {
                      className: `p-2 text-md-xs flex items-start gap-2 transition-colors ${item.selected ? 'bg-red-500/5 border-l-2 border-red-500' : 'opacity-85'}`,
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('input', {
                          type: 'checkbox',
                          checked: item.selected,
                          onChange: () => handleToggleItem(idx),
                          disabled: isProcessing,
                          className:
                            'mt-0.5 rounded border-input text-red-600 focus:ring-red-500 size-3.5',
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                          className: 'flex-1 min-w-0 space-y-1',
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                              className: 'flex items-start justify-between gap-1',
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                  className: 'font-medium text-foreground truncate block',
                                  title: item.filename,
                                  children: [idx + 1, '. ', item.filename],
                                }),
                                item.status !== 'pending' &&
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
                                    variant:
                                      item.status === 'success'
                                        ? 'success'
                                        : item.status === 'deleting'
                                          ? 'warning'
                                          : 'danger',
                                    className: 'shrink-0 scale-90',
                                    children:
                                      item.status === 'success'
                                        ? 'Sukses'
                                        : item.status === 'deleting'
                                          ? '...'
                                          : 'Gagal',
                                  }),
                              ],
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                              className: 'text-[10px] text-muted-foreground flex gap-1.5',
                              children: [
                                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('span', {
                                  children: [
                                    'ID: ',
                                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)('strong', {
                                      className: 'text-foreground',
                                      children: item.id_dokumen,
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                                  children: '|',
                                }),
                                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                                  children: item.tglFile,
                                }),
                              ],
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                              className: 'text-[10px] text-muted-foreground truncate',
                              children: item.keterangan || '-',
                            }),
                          ],
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                          className: 'flex flex-col gap-1.5 shrink-0',
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => handlePreview(item),
                              className:
                                'p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-all',
                              title: 'Preview File',
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
                                className: 'size-3.5',
                              }),
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => handleSingleDelete(idx),
                              disabled: isProcessing,
                              className:
                                'p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-600 transition-all disabled:opacity-50',
                              title: 'Hapus Dokumen',
                              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
                                className: 'size-3.5',
                              }),
                            }),
                          ],
                        }),
                      ],
                    },
                    idx,
                  ),
                ),
                filteredItems.length === 0 &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                    className: 'p-4 text-center text-muted-foreground text-md-xs',
                    children: 'Tidak ada dokumen yang cocok.',
                  }),
              ],
            }),
          ],
        }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'flex gap-2',
        children: showFinishedReload
          ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
              onClick: handleReload,
              variant: 'default',
              className: 'w-full bg-green-600 hover:bg-green-700 text-white',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
                  className: 'size-3.5 mr-1',
                }),
                ' Reload Halaman',
              ],
            })
          : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
              variant: 'destructive',
              size: 'sm',
              onClick: handleStartDelete,
              disabled: isProcessing || items.length === 0 || selectedCount === 0,
              className: 'w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: 'size-3.5 mr-1' }),
                ' Hapus Terpilih (',
                selectedCount,
                ')',
              ],
            }),
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/ConsultationDetailPanel.tsx
function ConsultationDetailPanel({ data }) {
  const fields = [
    {
      label: 'No. RM / Nama',
      value: `${data.noRm ?? ''} — ${data.nama ?? ''}`,
    },
    {
      label: 'Unit Asal → Unit Tujuan',
      value: `${data.unitAsal ?? '-'} → ${data.unitTujuan ?? '-'}`,
    },
    {
      label: 'Dokter',
      value: `${data.dokterMengajukan ?? '-'} → ${data.dokterKonsultasi ?? '-'}`,
    },
    {
      label: 'Tanggal Pengajuan',
      value: data.tanggal ?? '-',
    },
  ];
  if (data.permintaan)
    fields.push({
      label: 'Permintaan Konsultasi',
      value: data.permintaan,
    });
  if (data.kesan)
    fields.push({
      label: 'Kesan',
      value: data.kesan,
    });
  if (data.anjuran)
    fields.push({
      label: 'Anjuran',
      value: data.anjuran,
    });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'space-y-3',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('h3', {
        className: 'text-md-sm font-semibold text-foreground',
        children: 'Detail Konsultasi',
      }),
      fields.map((f, i) =>
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          'div',
          {
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('label', {
                className:
                  'text-[11px] font-semibold text-muted-foreground uppercase tracking-wide',
                children: f.label,
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                className:
                  'mt-0.5 text-md-sm text-foreground bg-accent/50 rounded-md px-3 py-2 leading-relaxed whitespace-pre-wrap break-words',
                children: f.value,
              }),
            ],
          },
          i,
        ),
      ),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/ConsultationInfoPanel.tsx
var TABS = [
  {
    id: 'resep',
    label: 'History Resep',
  },
  {
    id: 'dokumen',
    label: 'Dokumen Pasien',
  },
  {
    id: 'cppt',
    label: 'CPPT',
  },
  {
    id: 'penunjang',
    label: 'Penunjang Medis',
  },
];
var TAB_EP = {
  resep: {
    url: '/admisi/pengajuan_konsultasi/tabel-resep',
    method: 'POST',
    getData: (d) => ({
      id_visit: d.visit,
      id_pasien: d.noRm,
      page: '1',
    }),
  },
  dokumen: {
    url: '/admisi/pengajuan_konsultasi/tabel-dok',
    method: 'POST',
    getData: (d) => ({
      id_visit: d.visit,
      id_pasien: d.noRm,
      page: '1',
    }),
  },
  cppt: {
    url: '/admisi/pengajuan_konsultasi/tabel-cppt',
    method: 'POST',
    getData: (d) => ({
      id_visit: d.visit,
      id_pasien: d.noRm,
      page: '1',
    }),
  },
  penunjang: {
    url: '/admisi/modal/modal-history-penunjang-v2',
    method: 'GET',
    getData: (d) => ({
      norm: d.noRm,
      id_visit: d.visit,
    }),
  },
};
function ConsultationInfoPanel({ data }) {
  const [activeTab, setActiveTab] = (0, import_react.useState)(TABS[0].id);
  const [contents, setContents] = (0, import_react.useState)({});
  const [loading, setLoading] = (0, import_react.useState)({});
  const loadTab = async (tabId) => {
    if (contents[tabId] || loading[tabId]) return;
    setLoading((prev) => ({
      ...prev,
      [tabId]: true,
    }));
    const ep = TAB_EP[tabId];
    const url = `${data.baseUrl || ''}${ep.url}`;
    const formData = ep.getData(data);
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'PROXY_FETCH',
        url,
        method: ep.method,
        data: formData,
      });
      setContents((prev) => ({
        ...prev,
        [tabId]: res?.success
          ? res.html
          : `<div style="color:red;padding:20px;">Gagal memuat</div>`,
      }));
    } catch {
      setContents((prev) => ({
        ...prev,
        [tabId]: `<div style="color:red;padding:20px;">Gagal memuat</div>`,
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        [tabId]: false,
      }));
    }
  };
  if (!contents[TABS[0].id] && !loading[TABS[0].id]) loadTab(TABS[0].id);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'space-y-3',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('h3', {
        className: 'text-md-sm font-semibold text-foreground',
        children: 'Info Pasien',
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        className: 'flex border-b border-border',
        children: TABS.map((tab) =>
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            'button',
            {
              onClick: () => {
                setActiveTab(tab.id);
                loadTab(tab.id);
              },
              className: `px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors -mb-[1px] ${activeTab === tab.id ? 'text-foreground border-foreground' : 'text-muted-foreground border-transparent hover:text-foreground'}`,
              children: tab.label,
            },
            tab.id,
          ),
        ),
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
        children: loading[activeTab]
          ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'text-center py-12 text-muted-foreground text-md-sm',
              children: 'Memuat...',
            })
          : contents[activeTab]
            ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                className: 'text-md-sm leading-relaxed',
                dangerouslySetInnerHTML: { __html: contents[activeTab] },
              })
            : null,
      }),
    ],
  });
}
//#endregion
//#region src/features/sidepanel/Footer.tsx
function Footer({ onReload, onReset }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
    className: 'flex items-center justify-between px-4 py-3 border-t border-border',
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
        variant: 'ghost',
        size: 'sm',
        onClick: onReload,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: 'size-3.5' }),
          'Reload Halaman',
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
        variant: 'ghost',
        size: 'sm',
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
//#region src/features/sidepanel/utils.ts
function configToFeatureList(features) {
  return Object.entries(features).map(([key, f]) => ({
    key,
    name: f.name || key,
    desc: f.description || '',
    roles: f.allowedRoles || [],
    mode: f.mode,
    modes: f.modes,
    comingSoon: f.comingSoon,
  }));
}
function configToToggles(features) {
  const toggles = {};
  for (const [key, f] of Object.entries(features || {})) toggles[key] = f.enabled ?? false;
  return toggles;
}
//#endregion
//#region src/features/sidepanel/App.tsx
var FALLBACK_FEATURES = [
  {
    key: 'openDetailInNewTab',
    name: 'Open Detail',
    desc: 'Buka detail di tab baru',
    roles: ['casemix', 'kasir', 'dokter', 'admin'],
  },
  {
    key: 'shortcutButtons',
    name: 'Shortcut Buttons',
    desc: 'Tombol akses cepat di tabel',
    roles: ['casemix', 'kasir', 'admin'],
  },
  {
    key: 'filterPersistence',
    name: 'Filter Persistence',
    desc: 'Simpan state filter',
    roles: ['casemix', 'kasir', 'apotek', 'dokter', 'admin'],
  },
  {
    key: 'scrollButtons',
    name: 'Scroll Buttons',
    desc: 'Tombol scroll cepat',
    roles: ['casemix', 'kasir', 'apotek', 'dokter', 'admin'],
  },
  {
    key: 'batchUpload',
    name: 'Batch Upload URL',
    desc: 'Upload URL berkas',
    roles: ['casemix', 'admin'],
  },
  {
    key: 'resumeValidator',
    name: 'Resume Validator',
    desc: 'Validasi resume rawat inap',
    roles: ['casemix', 'dokter'],
  },
  {
    key: 'resumeModal',
    name: 'Resume Rajal',
    desc: 'Edit resume rawat jalan',
    roles: ['casemix', 'dokter'],
  },
  {
    key: 'resumeRanap',
    name: 'Resume Ranap',
    desc: 'Popup edit resume rawat inap',
    roles: ['casemix', 'dokter'],
  },
  {
    key: 'ttvEditor',
    name: 'TTV Editor',
    desc: 'Edit tanda vital',
    roles: ['dokter', 'admin'],
  },
  {
    key: 'cpptSearchFilter',
    name: 'CPPT Search',
    desc: 'Cari & filter CPPT',
    roles: ['casemix'],
  },
  {
    key: 'antrianTools',
    name: 'Antrian Tools',
    desc: 'Penomoran unik per loket (L1-001) + auto cetak',
    roles: ['admin', 'pendaftaran'],
  },
  {
    key: 'consultationEnhancer',
    name: 'Konsultasi',
    desc: 'Enhancer halaman konsultasi',
    roles: ['dokter'],
  },
  {
    key: 'batchDelete',
    name: 'Batch Delete',
    desc: 'Hapus file massal',
    roles: ['admin'],
  },
  {
    key: 'fixJasaPelayanan',
    name: 'Fix Jasa Pelayanan',
    desc: 'Perbaikan jasa pelayanan',
    roles: ['admin'],
  },
  {
    key: 'doctorFilterPersistence',
    name: 'Doctor Filter',
    desc: 'Simpan filter dokter',
    roles: ['dokter'],
  },
  {
    key: 'billingFilterPersistence',
    name: 'Billing Filter',
    desc: 'Simpan filter billing',
    roles: ['kasir'],
  },
  {
    key: 'resepTools',
    name: 'Penerimaan Resep',
    desc: 'Tools penerimaan resep',
    roles: ['admin'],
  },
];
var DEFAULT_URLS = [
  {
    id: 'default-1',
    url: 'http://103.147.236.140',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'default-2',
    url: 'http://192.168.8.4',
    enabled: true,
    isDefault: true,
  },
];
function App() {
  const [enabled, setEnabled] = (0, import_react.useState)(true);
  const [role, setRole] = (0, import_react.useState)('casemix');
  const [activeTab, setActiveTab] = (0, import_react.useState)('features');
  const [toolsSubTab, setToolsSubTab] = (0, import_react.useState)('upload');
  const [features, setFeatures] = (0, import_react.useState)({});
  const [featuresList, setFeaturesList] = (0, import_react.useState)(FALLBACK_FEATURES);
  const [urls, setUrls] = (0, import_react.useState)(DEFAULT_URLS);
  const [toast, setToast] = (0, import_react.useState)(null);
  const [tabId, setTabId] = (0, import_react.useState)(null);
  const [pageContext, setPageContext] = (0, import_react.useState)(null);
  const { theme, resolved, setTheme } = useDarkMode();
  (0, import_react.useEffect)(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const activeTabId = tabs[0]?.id;
        if (activeTabId) {
          setTabId(activeTabId);
          sendMessage({ type: 'GET_PAGE_CONTEXT' })
            .then((res) => {
              if (res?.context) {
                setPageContext(res.context);
                setActiveTab('tools');
              }
            })
            .catch(console.error);
        }
      },
    );
    const handleMessage = (message) => {
      if (message.type === 'PAGE_CONTEXT') {
        setPageContext({
          feature: message.feature,
          data: message.data,
        });
        setActiveTab('tools');
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);
  (0, import_react.useEffect)(() => {
    sendMessage({ type: MessageTypes.GET_ALL })
      .then((result) => {
        if (result?.config) {
          setEnabled(result.config.extensionEnabled);
          setRole(result.config.currentRole);
          setFeatures(configToToggles(result.config.features || {}));
          if (result.config.features) setFeaturesList(configToFeatureList(result.config.features));
        }
        if (result?.urls) setUrls(result.urls);
      })
      .catch(() => {
        chrome.storage.sync.get(['extensionConfig', 'extensionCustomUrls'], (fallback) => {
          if (fallback.extensionConfig) {
            setEnabled(fallback.extensionConfig.extensionEnabled);
            setRole(fallback.extensionConfig.currentRole);
            setFeatures(configToToggles(fallback.extensionConfig.features || {}));
            if (fallback.extensionConfig.features)
              setFeaturesList(configToFeatureList(fallback.extensionConfig.features));
          }
          if (fallback.extensionCustomUrls) setUrls(fallback.extensionCustomUrls);
        });
      });
  }, []);
  const showToast = (0, import_react.useCallback)((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);
  const handleToggleExtension = (0, import_react.useCallback)(() => {
    const next = !enabled;
    setEnabled(next);
    sendMessage({
      type: MessageTypes.TOGGLE_EXTENSION,
      enabled: next,
    }).catch(() => showToast('Gagal mengubah status extension'));
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan');
  }, [enabled, showToast]);
  const handleRoleChange = (0, import_react.useCallback)(
    (newRole) => {
      setRole(newRole);
      sendMessage({
        type: MessageTypes.SET_ROLE,
        role: newRole,
      }).catch(() => showToast('Gagal mengubah role'));
    },
    [showToast],
  );
  const handleFeatureToggle = (0, import_react.useCallback)(
    (key, val) => {
      const next = {
        ...features,
        [key]: val,
      };
      setFeatures(next);
      sendMessage({
        type: MessageTypes.TOGGLE_FEATURE,
        key,
        enabled: val,
      }).catch(() => showToast('Gagal mengubah fitur'));
      showToast(val ? `${key} diaktifkan` : `${key} dinonaktifkan`);
    },
    [features, showToast],
  );
  const handleAddUrl = (0, import_react.useCallback)(
    (url) => {
      const id = 'url-' + Date.now();
      const next = [
        ...urls,
        {
          id,
          url,
          enabled: true,
          isDefault: false,
        },
      ];
      setUrls(next);
      sendMessage({
        type: MessageTypes.ADD_URL,
        url,
      }).catch(() => showToast('Gagal menambah domain'));
      showToast('Domain ditambahkan');
    },
    [urls, showToast],
  );
  const handleRemoveUrl = (0, import_react.useCallback)(
    (id) => {
      const next = urls.filter((u) => u.id !== id);
      setUrls(next);
      sendMessage({
        type: MessageTypes.DELETE_URL,
        id,
      }).catch(() => showToast('Gagal menghapus domain'));
      showToast('Domain dihapus');
    },
    [urls, showToast],
  );
  const handleToggleUrl = (0, import_react.useCallback)(
    (id, val) => {
      const next = urls.map((u) =>
        u.id === id
          ? {
              ...u,
              enabled: val,
            }
          : u,
      );
      setUrls(next);
      sendMessage({
        type: MessageTypes.TOGGLE_URL,
        id,
        enabled: val,
      }).catch(() => showToast('Gagal mengubah domain'));
    },
    [urls, showToast],
  );
  const handleModeChange = (0, import_react.useCallback)(
    (key, mode) => {
      sendMessage({
        type: MessageTypes.CHANGE_FEATURE_MODE,
        key,
        mode,
      }).catch(() => showToast('Gagal mengubah mode'));
      showToast('Mode berhasil diubah');
    },
    [showToast],
  );
  const handleReload = (0, import_react.useCallback)(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
      },
    );
  }, []);
  const handleReset = (0, import_react.useCallback)(() => {
    if (!confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) return;
    sendMessage({ type: MessageTypes.RESET_CONFIG })
      .then(() => {
        setFeatures({});
        setUrls(DEFAULT_URLS);
        setRole('casemix');
        setEnabled(true);
        showToast('Reset ke default');
        handleReload();
      })
      .catch(() => {
        showToast('Gagal mereset konfigurasi');
      });
  }, [handleReload, showToast]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorBoundary, {
    children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
      className: 'flex flex-col h-full bg-background',
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'flex items-center justify-between px-4 py-2.5 border-b border-border',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
              className: 'flex items-center gap-2',
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                  className: 'w-6 h-6 rounded-md bg-[#2469f0] flex items-center justify-center',
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className: 'text-white text-md-xs font-bold',
                    children: 'M',
                  }),
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className: 'text-md-sm font-semibold text-foreground',
                  children: 'MORBIS Ext',
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                  className:
                    'text-[10px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded-full',
                  children: 'v1.2',
                }),
              ],
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'flex items-center gap-1',
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
                className:
                  'p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
                title: 'Toggle dark mode',
                children: resolved
                  ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('svg', {
                      width: '16',
                      height: '16',
                      viewBox: '0 0 24 24',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: '2',
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('circle', {
                          cx: '12',
                          cy: '12',
                          r: '5',
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('path', {
                          d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
                        }),
                      ],
                    })
                  : /* @__PURE__ */ (0, import_jsx_runtime.jsx)('svg', {
                      width: '16',
                      height: '16',
                      viewBox: '0 0 24 24',
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeWidth: '2',
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('path', {
                        d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
                      }),
                    }),
              }),
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
          className: 'px-4 py-3',
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusCard, {
            enabled,
            role,
            onToggle: handleToggleExtension,
            onRoleChange: handleRoleChange,
          }),
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'flex gap-0 px-4 border-b border-border',
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
              onClick: () => setActiveTab('features'),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${activeTab === 'features' ? 'text-[#2469f0] border-[#2469f0]' : 'text-muted-foreground border-transparent hover:text-foreground'}`,
              children: 'Fitur',
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
              onClick: () => setActiveTab('domain'),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${activeTab === 'domain' ? 'text-[#2469f0] border-[#2469f0]' : 'text-muted-foreground border-transparent hover:text-foreground'}`,
              children: 'Domain',
            }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('button', {
              onClick: () => setActiveTab('tools'),
              className: `px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] flex items-center gap-1.5 ${activeTab === 'tools' ? 'text-[#2469f0] border-[#2469f0]' : 'text-muted-foreground border-transparent hover:text-foreground'}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', { children: 'Aksi Halaman' }),
                pageContext &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)('span', {
                    className:
                      'size-1.5 bg-primary rounded-full inline-block animate-pulse shrink-0',
                  }),
              ],
            }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
          className: 'flex-1 overflow-y-auto px-4 py-3',
          children: [
            activeTab === 'features' &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesPanel, {
                features: featuresList,
                enabledFeatures: features,
                role,
                disabled: !enabled,
                onToggle: handleFeatureToggle,
                onModeChange: handleModeChange,
              }),
            activeTab === 'domain' &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainPanel, {
                urls,
                onAdd: handleAddUrl,
                onRemove: handleRemoveUrl,
                onToggle: handleToggleUrl,
              }),
            activeTab === 'tools' &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                className: 'space-y-4',
                children: [
                  pageContext?.feature === 'mKlaimDetail' &&
                    tabId &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                      className: 'space-y-4',
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                          className: 'flex p-1 bg-muted rounded-lg',
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => setToolsSubTab('upload'),
                              className: `flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${toolsSubTab === 'upload' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`,
                              children: 'Upload Dokumen',
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)('button', {
                              onClick: () => setToolsSubTab('delete'),
                              className: `flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${toolsSubTab === 'delete' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`,
                              children: 'Hapus Dokumen',
                            }),
                          ],
                        }),
                        toolsSubTab === 'upload'
                          ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchUploadPanel, { tabId })
                          : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchDeletePanel, {
                              tabId,
                            }),
                      ],
                    }),
                  pageContext?.feature === 'batchUpload' &&
                    tabId &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchUploadPanel, { tabId }),
                  pageContext?.feature === 'batchDelete' &&
                    tabId &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchDeletePanel, { tabId }),
                  pageContext?.feature === 'consultationDetail' &&
                    pageContext?.data &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultationDetailPanel, {
                      data: pageContext.data,
                    }),
                  pageContext?.feature === 'consultationInfo' &&
                    pageContext?.data &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultationInfoPanel, {
                      data: pageContext.data,
                    }),
                  (!pageContext || !tabId) &&
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)('div', {
                      className: 'text-center py-12 px-4 space-y-2.5',
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
                          className:
                            'size-10 rounded-full bg-accent flex items-center justify-center mx-auto text-muted-foreground',
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('svg', {
                            className: 'size-5',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2.5',
                            viewBox: '0 0 24 24',
                            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('path', {
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                              d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
                            }),
                          }),
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('h3', {
                          className: 'text-md-sm font-semibold text-foreground',
                          children: 'Tidak Ada Aksi Halaman',
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)('p', {
                          className: 'text-md-xs text-muted-foreground leading-relaxed',
                          children:
                            'Buka halaman detail rekam medis pasien di SIMRS Morbis untuk mengaktifkan peralatan halaman (batch upload / batch delete).',
                        }),
                      ],
                    }),
                ],
              }),
          ],
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {
          onReload: handleReload,
          onReset: handleReset,
        }),
        toast &&
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
            className: 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up',
            role: 'alert',
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)('div', {
              className: 'px-4 py-2 bg-foreground text-background text-md-sm rounded-lg shadow-lg',
              children: toast,
            }),
          }),
      ],
    }),
  });
}
//#endregion
//#region src/features/sidepanel/main.tsx
var root = document.getElementById('app');
if (root)
  (0, import_client.createRoot)(root).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}));
//#endregion
