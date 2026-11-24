import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { sendMessage, MessageTypes } from '../shared/messaging';
import type { Role, ExtensionConfig, CustomUrl } from './types';
import { ErrorBoundary } from '../ui/components/ErrorBoundary';
import { Button } from '../ui/components/button';
import { StatusCard } from './StatusCard';
import { FeaturesPanel } from './FeaturesPanel';
import { DomainPanel } from './DomainPanel';
import { UsageLogPanel } from './UsageLogPanel';
import { getVersionBadge } from '../shared/version';
import { cn } from '../ui/lib/utils';

async function loadAll(): Promise<{ config: ExtensionConfig | null; urls: CustomUrl[] }> {
  try {
    const result = await sendMessage<'GET_ALL'>({ type: MessageTypes.GET_ALL });
    if (result?.config) {
      return { config: result.config, urls: result.urls ?? [] };
    }
  } catch {
    // GET_ALL gagal (service worker mati dll) — fallback ke storage lokal.
  }
  // Config pindah ke storage.local (sync 8KB limit). Membaca sync di sini
  // bikin toggle jadi no-op / tampilan basi saat GET_ALL gagal.
  const c = (await chrome.storage.local.get(['extensionConfig', 'extensionCustomUrls'])) as {
    extensionConfig?: ExtensionConfig;
    extensionCustomUrls?: CustomUrl[];
  };
  return {
    config: c.extensionConfig ?? { extensionEnabled: true, currentRole: 'admin', features: {} },
    urls: c.extensionCustomUrls ?? [],
  };
}

function reloadActiveTab(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
      window.close();
    }
  });
}

type PopupTab = 'fitur' | 'domain';

export function App() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ExtensionConfig | null>(null);
  const [urls, setUrls] = useState<CustomUrl[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<PopupTab>('fitur');
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    loadAll().then((result) => {
      setConfig(result.config);
      setUrls(result.urls);
      setLoading(false);
    });
  }, []);

  // Blok "⚡ Aktif di Halaman Ini": tangkap tab aktif popup saat dibuka.
  useEffect(() => {
    let alive = true;
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs?.[0]?.url;
        if (alive && url) {
          try {
            setActivePath(new URL(url).pathname);
          } catch {
            // URL tidak valid — pertahankan path sebelumnya.
          }
        }
      });
    } catch {
      // chrome.tabs belum tersedia — blok kontekstual tetap bisa dihidupkan lewat pathname.
    }
    return () => {
      alive = false;
    };
  }, []);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const handleToggleExtension = useCallback(() => {
    if (!config) return;
    const next = !config.extensionEnabled;
    setConfig({ ...config, extensionEnabled: next });
    sendMessage<'TOGGLE_EXTENSION'>({ type: MessageTypes.TOGGLE_EXTENSION, enabled: next }).catch(
      () => showToast('Gagal mengubah status extension'),
    );
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan');
    reloadActiveTab();
  }, [config, showToast]);

  const handleRoleChange = useCallback(
    (role: Role) => {
      if (!config) return;
      setConfig({ ...config, currentRole: role });
      sendMessage<'SET_ROLE'>({ type: MessageTypes.SET_ROLE, role }).catch(() =>
        showToast('Gagal mengubah role'),
      );
      showToast('Role berhasil diubah');
    },
    [config, showToast],
  );

  const handleFeatureToggle = useCallback(
    (key: string, value: boolean) => {
      // Jangan kembali diam-diam kalau key belum ada di state lokal —
      // background yang memvalidasi & menulis config.
      if (!config) return;
      setConfig({
        ...config,
        features: {
          ...config.features,
          [key]: { ...config.features[key], enabled: value },
        },
      });
      sendMessage<'TOGGLE_FEATURE'>({
        type: MessageTypes.TOGGLE_FEATURE,
        key,
        enabled: value,
      })
        .then(() => reloadActiveTab())
        .catch(() => {
          setConfig(
            (prev) =>
              prev && {
                ...prev,
                features: {
                  ...prev.features,
                  [key]: { ...prev.features[key], enabled: !value },
                },
              },
          );
          showToast('Gagal mengubah fitur — state dikembalikan');
        });
    },
    [config, showToast],
  );

  const handleModeChange = useCallback(
    (key: string, mode: string) => {
      if (!config?.features[key]) return;
      setConfig({
        ...config,
        features: {
          ...config.features,
          [key]: { ...config.features[key], mode },
        },
      });
      sendMessage<'CHANGE_FEATURE_MODE'>({
        type: MessageTypes.CHANGE_FEATURE_MODE,
        key,
        mode,
      }).catch(() => showToast('Gagal mengubah mode'));
      showToast('Mode berhasil diubah');
    },
    [config, showToast],
  );

  const handleAddUrl = useCallback(
    (url: string) => {
      const newUrl: CustomUrl = {
        id: 'url-' + Date.now(),
        url,
        enabled: true,
        isDefault: false,
      };
      setUrls((prev) => [...prev, newUrl]);
      sendMessage<'ADD_URL'>({ type: MessageTypes.ADD_URL, url })
        .then(() => {
          showToast('URL berhasil ditambahkan');
          reloadActiveTab();
        })
        .catch(() => {
          setUrls((prev) => prev.filter((u) => u.id !== newUrl.id));
          showToast('Gagal menambah URL — perubahan dibatalkan');
        });
    },
    [showToast],
  );

  const handleRemoveUrl = useCallback(
    (id: string) => {
      const previous = urls.find((u) => u.id === id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
      sendMessage<'DELETE_URL'>({ type: MessageTypes.DELETE_URL, id })
        .then(() => reloadActiveTab())
        .catch(() => {
          if (previous) setUrls((prev) => [...prev, previous]);
          showToast('Gagal menghapus URL — perubahan dibatalkan');
        });
    },
    [showToast, urls],
  );

  const handleToggleUrl = useCallback(
    (id: string, value: boolean) => {
      setUrls((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: value } : u)));
      sendMessage<'TOGGLE_URL'>({ type: MessageTypes.TOGGLE_URL, id, enabled: value }).catch(() =>
        showToast('Gagal mengubah URL'),
      );
      reloadActiveTab();
    },
    [showToast],
  );

  const handleReset = useCallback(() => {
    if (!confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) return;
    sendMessage<'RESET_CONFIG'>({ type: MessageTypes.RESET_CONFIG }).catch(() =>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-md-sm text-muted-foreground">Memuat…</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-md-sm text-destructive">Gagal memuat konfigurasi</p>
      </div>
    );
  }

  const version = getVersionBadge();
  const featureKeys = Object.keys(config.features);
  const totalFeatures = featureKeys.length;
  const enabledFeatures = featureKeys.filter(
    (k) => config.features[k]?.enabled && !config.features[k]?.comingSoon,
  ).length;

  return (
    <ErrorBoundary>
      <div className="w-[340px] min-h-[200px] max-h-[600px] flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 shrink-0 bg-background border-b border-border">
          <div className="px-3 pt-2.5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#2469f0] flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-md-sm font-semibold text-foreground">MORBIS Ext</h1>
                  {version && (
                    <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1 py-0.5 rounded-full">
                      {version}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">Produktivitas SIMRS</p>
              </div>
            </div>
            <div className="mt-2">
              <StatusCard
                enabled={config.extensionEnabled}
                role={config.currentRole}
                onToggle={handleToggleExtension}
                onRoleChange={handleRoleChange}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground truncate">
              Halaman aktif: {activePath || '—'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="shrink-0 px-3 pt-2">
          <div className="flex gap-0.5 p-0.5 rounded-lg bg-muted">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'fitur'}
              onClick={() => setTab('fitur')}
              className={cn(
                'flex-1 h-7 rounded-md text-[11px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                tab === 'fitur'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              Fitur
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'domain'}
              onClick={() => setTab('domain')}
              className={cn(
                'flex-1 h-7 rounded-md text-[11px] font-medium transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                tab === 'domain'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              Domain & Sistem
            </button>
          </div>
        </div>

        {/* Scrollable panel */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-2">
          {tab === 'fitur' ? (
            <FeaturesPanel
              features={config.features}
              role={config.currentRole}
              disabled={!config.extensionEnabled}
              onToggle={handleFeatureToggle}
              onModeChange={handleModeChange}
              pathname={activePath}
            />
          ) : (
            <div className="pb-2">
              <DomainPanel
                urls={urls}
                onAdd={handleAddUrl}
                onRemove={handleRemoveUrl}
                onToggle={handleToggleUrl}
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={handleReset}
                  className="touch-manipulation"
                >
                  <RotateCcw className="size-3.5" />
                  Reset Default
                </Button>
              </div>
              <div className="mt-3">
                <UsageLogPanel />
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-border bg-background px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground truncate">
              {enabledFeatures} dari {totalFeatures} fitur aktif
            </p>
            <Button
              variant="default"
              size="xs"
              onClick={reloadActiveTab}
              className="shrink-0 touch-manipulation"
            >
              <RefreshCw className="size-3.5" />
              Reload
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
          role="alert"
        >
          <div className="px-4 py-2 bg-foreground text-background text-md-xs rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
