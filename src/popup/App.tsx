import { useState, useEffect, useCallback } from 'react'
import type { Role, ExtensionConfig, CustomUrl } from './types'
import { StatusCard } from './StatusCard'
import { FeaturesPanel } from './FeaturesPanel'
import { DomainPanel } from './DomainPanel'
import { Footer } from './Footer'

function bgMessage(msg: Record<string, unknown>): Promise<unknown> {
  try {
    return chrome.runtime.sendMessage(msg)
  } catch {
    return Promise.resolve(null)
  }
}

async function loadAll(): Promise<{ config: ExtensionConfig | null; urls: CustomUrl[] }> {
  try {
    const result = (await bgMessage({ type: 'GET_ALL' })) as {
      config?: ExtensionConfig
      urls?: CustomUrl[]
    } | null
    if (result?.config) {
      return { config: result.config, urls: result.urls ?? [] }
    }
  } catch {}
  const c = (await chrome.storage.sync.get(['extensionConfig', 'extensionCustomUrls'])) as {
    extensionConfig?: ExtensionConfig
    extensionCustomUrls?: CustomUrl[]
  }
  return {
    config: c.extensionConfig ?? { extensionEnabled: true, currentRole: 'casemix', features: {} },
    urls: c.extensionCustomUrls ?? [],
  }
}

function reloadActiveTab(): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id)
      window.close()
    }
  })
}

export function App() {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<ExtensionConfig | null>(null)
  const [urls, setUrls] = useState<CustomUrl[]>([])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    loadAll().then((result) => {
      setConfig(result.config)
      setUrls(result.urls)
      setLoading(false)
    })
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const handleToggleExtension = useCallback(() => {
    if (!config) return
    const next = !config.extensionEnabled
    setConfig({ ...config, extensionEnabled: next })
    bgMessage({ type: 'TOGGLE_EXTENSION', enabled: next })
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan')
    reloadActiveTab()
  }, [config, showToast])

  const handleRoleChange = useCallback((role: Role) => {
    if (!config) return
    setConfig({ ...config, currentRole: role })
    bgMessage({ type: 'SET_ROLE', role })
    showToast('Role berhasil diubah')
    reloadActiveTab()
  }, [config, showToast])

  const handleFeatureToggle = useCallback((key: string, value: boolean) => {
    if (!config?.features[key]) return
    setConfig({
      ...config,
      features: {
        ...config.features,
        [key]: { ...config.features[key], enabled: value },
      },
    })
    bgMessage({ type: 'TOGGLE_FEATURE', key, enabled: value })
    reloadActiveTab()
  }, [config])

  const handleModeChange = useCallback((key: string, mode: string) => {
    if (!config?.features[key]) return
    setConfig({
      ...config,
      features: {
        ...config.features,
        [key]: { ...config.features[key], mode },
      },
    })
    bgMessage({ type: 'CHANGE_FEATURE_MODE', key, mode })
    showToast('Mode berhasil diubah')
  }, [config, showToast])

  const handleAddUrl = useCallback((url: string) => {
    const newUrl: CustomUrl = {
      id: 'url-' + Date.now(),
      url,
      enabled: true,
      isDefault: false,
    }
    setUrls((prev) => [...prev, newUrl])
    bgMessage({ type: 'ADD_URL', url })
    showToast('URL berhasil ditambahkan')
    reloadActiveTab()
  }, [showToast])

  const handleRemoveUrl = useCallback((id: string) => {
    setUrls((prev) => prev.filter((u) => u.id !== id))
    bgMessage({ type: 'DELETE_URL', id })
    reloadActiveTab()
  }, [])

  const handleToggleUrl = useCallback((id: string, value: boolean) => {
    setUrls((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: value } : u)))
    bgMessage({ type: 'TOGGLE_URL', id, enabled: value })
    reloadActiveTab()
  }, [])

  const handleReset = useCallback(() => {
    if (!confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) return
    bgMessage({ type: 'RESET_CONFIG' })
    setToast('Reset ke default')
    setTimeout(() => {
      loadAll().then((result) => {
        setConfig(result.config)
        setUrls(result.urls)
        reloadActiveTab()
      })
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-md-sm text-[var(--md-gray-400)]">Memuat...</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-md-sm text-[var(--md-red-500)]">Gagal memuat konfigurasi</p>
      </div>
    )
  }

  return (
    <div className="w-[340px] min-h-[200px] max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-[var(--md-gray-200)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#2469f0] flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">M</span>
          </div>
          <div>
            <h1 className="text-md-sm font-semibold text-[var(--md-gray-800)]">MORBIS Ext</h1>
            <p className="text-[10px] text-[var(--md-gray-500)]">Produktivitas SIMRS</p>
          </div>
        </div>
      </div>

      {/* Status & Role */}
      <div className="px-4 py-2.5">
        <StatusCard
          enabled={config.extensionEnabled}
          role={config.currentRole}
          onToggle={handleToggleExtension}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Features Section */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-[var(--md-gray-500)] uppercase tracking-wider">
            Fitur
          </span>
        </div>
        <FeaturesPanel
          features={config.features}
          role={config.currentRole}
          onToggle={handleFeatureToggle}
          onModeChange={handleModeChange}
        />
      </div>

      {/* Domain Section */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-[var(--md-gray-500)] uppercase tracking-wider">
            Domain
          </span>
        </div>
        <DomainPanel
          urls={urls}
          onAdd={handleAddUrl}
          onRemove={handleRemoveUrl}
          onToggle={handleToggleUrl}
        />
      </div>

      {/* Footer */}
      <Footer onReload={reloadActiveTab} onReset={handleReset} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-4 py-2 bg-[var(--md-gray-800)] text-white text-md-xs rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
