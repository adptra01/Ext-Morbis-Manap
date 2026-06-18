import { useState, useEffect, useCallback } from 'react';
import { useDarkMode } from '../../ui/hooks/useDarkMode';
import { sendMessage, MessageTypes } from '../../shared/messaging';
import { ErrorBoundary } from '../../ui/components/ErrorBoundary';
import { StatusCard } from './StatusCard';
import { FeaturesPanel } from './FeaturesPanel';
import { DomainPanel } from './DomainPanel';
import { BatchUploadPanel } from './BatchUploadPanel';
import { BatchDeletePanel } from './BatchDeletePanel';
import { ConsultationDetailPanel } from './ConsultationDetailPanel';
import { ConsultationInfoPanel } from './ConsultationInfoPanel';
import { Footer } from './Footer';
import { configToFeatureList, configToToggles } from './utils';
import type { FeatureConfig, Role, CustomUrl } from './types';

// Fallback feature list (for offline or when background unavailable)
const FALLBACK_FEATURES: FeatureConfig[] = [
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
  { key: 'ttvEditor', name: 'TTV Editor', desc: 'Edit tanda vital', roles: ['dokter', 'admin'] },
  { key: 'cpptSearchFilter', name: 'CPPT Search', desc: 'Cari & filter CPPT', roles: ['casemix'] },
  { key: 'antrianTools', name: 'Antrian Tools', desc: 'Tools halaman antrian', roles: ['admin'] },
  {
    key: 'consultationEnhancer',
    name: 'Konsultasi',
    desc: 'Enhancer halaman konsultasi',
    roles: ['dokter'],
  },
  { key: 'batchDelete', name: 'Batch Delete', desc: 'Hapus file massal', roles: ['admin'] },
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

const DEFAULT_URLS: CustomUrl[] = [
  { id: 'default-1', url: 'http://103.147.236.140', enabled: true, isDefault: true },
  { id: 'default-2', url: 'http://192.168.8.4', enabled: true, isDefault: true },
];

export function App() {
  const [enabled, setEnabled] = useState(true);
  const [role, setRole] = useState<Role>('casemix');
  const [activeTab, setActiveTab] = useState<'features' | 'domain' | 'tools'>('features');
  const [toolsSubTab, setToolsSubTab] = useState<'upload' | 'delete'>('upload');
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [featuresList, setFeaturesList] = useState<FeatureConfig[]>(FALLBACK_FEATURES);
  const [urls, setUrls] = useState<CustomUrl[]>(DEFAULT_URLS);
  const [toast, setToast] = useState<string | null>(null);
  const [tabId, setTabId] = useState<number | null>(null);
  const [pageContext, setPageContext] = useState<{ feature: string; data: Record<string, unknown> } | null>(null);
  const { theme, resolved, setTheme } = useDarkMode();

  // Load active tab ID & context
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;
      if (activeTabId) {
        setTabId(activeTabId);
        sendMessage<'GET_PAGE_CONTEXT'>({ type: 'GET_PAGE_CONTEXT' as any })
          .then((res: any) => {
            if (res?.context) {
              setPageContext(res.context);
              setActiveTab('tools');
            }
          })
          .catch(console.error);
      }
    });

    const handleMessage = (message: any) => {
      if (message.type === 'PAGE_CONTEXT') {
        setPageContext({ feature: message.feature, data: message.data });
        setActiveTab('tools');
      }
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  useEffect(() => {
    // Load config from background (unified source of truth)
    sendMessage<'GET_ALL'>({ type: MessageTypes.GET_ALL })
      .then((result) => {
        if (result?.config) {
          setEnabled(result.config.extensionEnabled);
          setRole(result.config.currentRole);
          setFeatures(configToToggles(result.config.features || {}));
          if (result.config.features) {
            setFeaturesList(configToFeatureList(result.config.features));
          }
        }
        if (result?.urls) {
          setUrls(result.urls);
        }
      })
      .catch(() => {
        // Fallback: load from local storage if background is unavailable
        chrome.storage.sync.get(['extensionConfig', 'extensionCustomUrls'], (fallback) => {
          if (fallback.extensionConfig) {
            setEnabled(fallback.extensionConfig.extensionEnabled);
            setRole(fallback.extensionConfig.currentRole);
            setFeatures(configToToggles(fallback.extensionConfig.features || {}));
            if (fallback.extensionConfig.features) {
              setFeaturesList(configToFeatureList(fallback.extensionConfig.features));
            }
          }
          if (fallback.extensionCustomUrls) {
            setUrls(fallback.extensionCustomUrls);
          }
        });
      });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handleToggleExtension = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    sendMessage<'TOGGLE_EXTENSION'>({ type: MessageTypes.TOGGLE_EXTENSION, enabled: next }).catch(
      () => showToast('Gagal mengubah status extension'),
    );
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan');
  }, [enabled, showToast]);

  const handleRoleChange = useCallback(
    (newRole: Role) => {
      setRole(newRole);
      sendMessage<'SET_ROLE'>({ type: MessageTypes.SET_ROLE, role: newRole }).catch(() =>
        showToast('Gagal mengubah role'),
      );
    },
    [showToast],
  );

  const handleFeatureToggle = useCallback(
    (key: string, val: boolean) => {
      const next = { ...features, [key]: val };
      setFeatures(next);
      sendMessage<'TOGGLE_FEATURE'>({ type: MessageTypes.TOGGLE_FEATURE, key, enabled: val }).catch(
        () => showToast('Gagal mengubah fitur'),
      );
      showToast(val ? `${key} diaktifkan` : `${key} dinonaktifkan`);
    },
    [features, showToast],
  );

  const handleAddUrl = useCallback(
    (url: string) => {
      const id = 'url-' + Date.now();
      const next = [...urls, { id, url, enabled: true, isDefault: false } as CustomUrl];
      setUrls(next);
      sendMessage<'ADD_URL'>({ type: MessageTypes.ADD_URL, url }).catch(() =>
        showToast('Gagal menambah domain'),
      );
      showToast('Domain ditambahkan');
    },
    [urls, showToast],
  );

  const handleRemoveUrl = useCallback(
    (id: string) => {
      const next = urls.filter((u) => u.id !== id);
      setUrls(next);
      sendMessage<'DELETE_URL'>({ type: MessageTypes.DELETE_URL, id }).catch(() =>
        showToast('Gagal menghapus domain'),
      );
      showToast('Domain dihapus');
    },
    [urls, showToast],
  );

  const handleToggleUrl = useCallback(
    (id: string, val: boolean) => {
      const next = urls.map((u) => (u.id === id ? { ...u, enabled: val } : u));
      setUrls(next);
      sendMessage<'TOGGLE_URL'>({ type: MessageTypes.TOGGLE_URL, id, enabled: val }).catch(() =>
        showToast('Gagal mengubah domain'),
      );
    },
    [urls, showToast],
  );

  const handleModeChange = useCallback(
    (key: string, mode: string) => {
      sendMessage<'CHANGE_FEATURE_MODE'>({
        type: MessageTypes.CHANGE_FEATURE_MODE,
        key,
        mode,
      }).catch(() => showToast('Gagal mengubah mode'));
      showToast('Mode berhasil diubah');
    },
    [showToast],
  );

  const handleReload = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id);
    });
  }, []);

  const handleReset = useCallback(() => {
    if (!confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) return;
    sendMessage<'RESET_CONFIG'>({ type: MessageTypes.RESET_CONFIG })
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

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2469f0] flex items-center justify-center">
              <span className="text-white text-md-xs font-bold">M</span>
            </div>
            <span className="text-md-sm font-semibold text-foreground">MORBIS Ext</span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
              v1.2
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Toggle dark mode"
            >
              {resolved ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="px-4 py-3">
          <StatusCard
            enabled={enabled}
            role={role}
            onToggle={handleToggleExtension}
            onRoleChange={handleRoleChange}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-4 border-b border-border">
          <button
            onClick={() => setActiveTab('features')}
            className={`px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${
              activeTab === 'features'
                ? 'text-[#2469f0] border-[#2469f0]'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Fitur
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${
              activeTab === 'domain'
                ? 'text-[#2469f0] border-[#2469f0]'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            Domain
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'text-[#2469f0] border-[#2469f0]'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <span>Aksi Halaman</span>
            {pageContext && (
              <span className="size-1.5 bg-primary rounded-full inline-block animate-pulse shrink-0" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {activeTab === 'features' && (
            <FeaturesPanel
              features={featuresList}
              enabledFeatures={features}
              role={role}
              disabled={!enabled}
              onToggle={handleFeatureToggle}
              onModeChange={handleModeChange}
            />
          )}
          {activeTab === 'domain' && (
            <DomainPanel
              urls={urls}
              onAdd={handleAddUrl}
              onRemove={handleRemoveUrl}
              onToggle={handleToggleUrl}
            />
          )}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              {pageContext?.feature === 'mKlaimDetail' && tabId && (
                <div className="space-y-4">
                  <div className="flex p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => setToolsSubTab('upload')}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${
                        toolsSubTab === 'upload'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Upload Dokumen
                    </button>
                    <button
                      onClick={() => setToolsSubTab('delete')}
                      className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${
                        toolsSubTab === 'delete'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Hapus Dokumen
                    </button>
                  </div>
                  {toolsSubTab === 'upload' ? (
                    <BatchUploadPanel tabId={tabId} />
                  ) : (
                    <BatchDeletePanel tabId={tabId} />
                  )}
                </div>
              )}
              {pageContext?.feature === 'batchUpload' && tabId && (
                <BatchUploadPanel tabId={tabId} />
              )}
              {pageContext?.feature === 'batchDelete' && tabId && (
                <BatchDeletePanel tabId={tabId} />
              )}
              {pageContext?.feature === 'consultationDetail' && pageContext?.data && (
                <ConsultationDetailPanel data={pageContext.data as Record<string, string>} />
              )}
              {pageContext?.feature === 'consultationInfo' && pageContext?.data && (
                <ConsultationInfoPanel data={pageContext.data as Record<string, string>} />
              )}
              {(!pageContext || !tabId) && (
                <div className="text-center py-12 px-4 space-y-2.5">
                  <div className="size-10 rounded-full bg-accent flex items-center justify-center mx-auto text-muted-foreground">
                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-md-sm font-semibold text-foreground">Tidak Ada Aksi Halaman</h3>
                  <p className="text-md-xs text-muted-foreground leading-relaxed">
                    Buka halaman detail rekam medis pasien di SIMRS Morbis untuk mengaktifkan peralatan halaman (batch upload / batch delete).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <Footer onReload={handleReload} onReset={handleReset} />

        {/* Toast */}
        {toast && (
          <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
            role="alert"
          >
            <div className="px-4 py-2 bg-foreground text-background text-md-sm rounded-lg shadow-lg">
              {toast}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
