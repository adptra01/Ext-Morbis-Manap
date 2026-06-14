import { useState, useEffect, useCallback } from 'react'
import { useDarkMode } from '../../ui/hooks/useDarkMode'
import { StatusCard } from './StatusCard'
import { FeaturesPanel } from './FeaturesPanel'
import { DomainPanel } from './DomainPanel'
import { Footer } from './Footer'
import type { FeatureConfig, Role, CustomUrl } from './types'

const ALL_FEATURES: FeatureConfig[] = [
  { key: 'openDetail', name: 'Open Detail', desc: 'Buka detail di tab baru', roles: ['Casemix', 'Kasir', 'Dokter', 'Admin'] },
  { key: 'shortcutButtons', name: 'Shortcut Buttons', desc: 'Tombol akses cepat di tabel', roles: ['Casemix', 'Kasir', 'Admin'] },
  { key: 'filterPersistence', name: 'Filter Persistence', desc: 'Simpan state filter', roles: ['Casemix', 'Kasir', 'Apotek', 'Dokter', 'Admin'] },
  { key: 'simplifyBilling', name: 'Simplify Billing', desc: 'Tampilan billing lebih bersih', roles: ['Kasir'] },
  { key: 'scrollButtons', name: 'Scroll Buttons', desc: 'Tombol scroll cepat', roles: ['Casemix', 'Kasir', 'Apotek', 'Dokter', 'Admin'] },
  { key: 'printOptimization', name: 'Print Optimization', desc: 'Optimasi tampilan print', roles: ['Casemix', 'Kasir', 'Apotek', 'Dokter', 'Admin'] },
  { key: 'batchUploadUrl', name: 'Batch Upload URL', desc: 'Upload URL berkas', roles: ['Casemix', 'Admin'] },
  { key: 'resumeValidator', name: 'Resume Validator', desc: 'Validasi resume rawat inap', roles: ['Casemix', 'Dokter'] },
  { key: 'resumeTab', name: 'Resume Rajal', desc: 'Edit resume rawat jalan', roles: ['Casemix', 'Dokter'] },
  { key: 'ttvEditor', name: 'TTV Editor', desc: 'Edit tanda vital', roles: ['Dokter', 'Admin'] },
  { key: 'antrianTools', name: 'Antrian Tools', desc: 'Tools halaman antrian', roles: ['Admin'] },
  { key: 'autoVerifBilling', name: 'Auto Verif Billing', desc: 'Verifikasi billing otomatis', roles: ['Kasir', 'Admin'] },
  { key: 'consultationEnhancer', name: 'Konsultasi', desc: 'Enhancer halaman konsultasi', roles: ['Dokter'] },
]

const DEFAULT_URLS: CustomUrl[] = [
  { id: 'default-1', url: 'http://103.147.236.140', enabled: true },
  { id: 'default-2', url: 'http://192.168.8.4', enabled: true },
]

export function App() {
  const [enabled, setEnabled] = useState(true)
  const [role, setRole] = useState<Role>('Casemix')
  const [activeTab, setActiveTab] = useState<'features' | 'domain'>('features')
  const [features, setFeatures] = useState<Record<string, boolean>>({})
  const [urls, setUrls] = useState<CustomUrl[]>(DEFAULT_URLS)
  const [toast, setToast] = useState<string | null>(null)
  const { theme, resolved, setTheme } = useDarkMode()

  useEffect(() => {
    chrome.storage.sync.get(['md-features', 'md-urls', 'md-role', 'md-enabled'], (result) => {
      if (result['md-features']) setFeatures(result['md-features'])
      if (result['md-urls']) setUrls(result['md-urls'])
      if (result['md-role']) setRole(result['md-role'] as Role)
      if (result['md-enabled'] !== undefined) setEnabled(result['md-enabled'])
    })
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const saveConfig = useCallback((update: Record<string, unknown>) => {
    chrome.storage.sync.set(update)
  }, [])

  const handleToggleExtension = useCallback(() => {
    const next = !enabled
    setEnabled(next)
    saveConfig({ 'md-enabled': next })
    showToast(next ? 'Extension diaktifkan' : 'Extension dinonaktifkan')
  }, [enabled, saveConfig, showToast])

  const handleRoleChange = useCallback((newRole: Role) => {
    setRole(newRole)
    saveConfig({ 'md-role': newRole })
    chrome.runtime.sendMessage({ action: 'SET_ROLE', role: newRole })
  }, [saveConfig])

  const handleFeatureToggle = useCallback((key: string, val: boolean) => {
    const next = { ...features, [key]: val }
    setFeatures(next)
    saveConfig({ 'md-features': next })
    chrome.runtime.sendMessage({ action: 'SET_FEATURE', key, enabled: val }, () => {
      if (chrome.runtime.lastError) return
    })
    showToast(val ? `${key} diaktifkan` : `${key} dinonaktifkan`)
  }, [features, saveConfig, showToast])

  const handleAddUrl = useCallback((url: string) => {
    const id = 'url-' + Date.now()
    const next = [...urls, { id, url, enabled: true }]
    setUrls(next)
    saveConfig({ 'md-urls': next })
    chrome.runtime.sendMessage({ action: 'ADD_URL', url })
    showToast('Domain ditambahkan')
  }, [urls, saveConfig, showToast])

  const handleRemoveUrl = useCallback((id: string) => {
    const next = urls.filter((u) => u.id !== id)
    setUrls(next)
    saveConfig({ 'md-urls': next })
    showToast('Domain dihapus')
  }, [urls, saveConfig, showToast])

  const handleToggleUrl = useCallback((id: string, val: boolean) => {
    const next = urls.map((u) => (u.id === id ? { ...u, enabled: val } : u))
    setUrls(next)
    saveConfig({ 'md-urls': next })
  }, [urls, saveConfig])

  const handleReload = useCallback(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id)
    })
  }, [])

  const handleReset = useCallback(() => {
    chrome.storage.sync.clear()
    setFeatures({})
    setUrl(DEFAULT_URLS)
    setRole('Casemix')
    setEnabled(true)
    showToast('Reset ke default')
    handleReload()
  }, [handleReload, showToast])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[var(--md-gray-900)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--md-gray-200)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#2469f0] flex items-center justify-center">
            <span className="text-white text-md-xs font-bold">M</span>
          </div>
          <span className="text-md-sm font-semibold text-[var(--md-gray-800)]">MORBIS Ext</span>
          <span className="md-badge md-badge--primary">v1.2</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-md text-[var(--md-gray-400)] hover:text-[var(--md-gray-600)] hover:bg-[var(--md-gray-100)] transition-colors"
            title="Toggle dark mode"
          >
            {resolved ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <div className="flex gap-0 px-4 border-b border-[var(--md-gray-200)]">
        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${
            activeTab === 'features'
              ? 'text-[#2469f0] border-[#2469f0]'
              : 'text-[var(--md-gray-500)] border-transparent hover:text-[var(--md-gray-700)]'
          }`}
        >
          Fitur
        </button>
        <button
          onClick={() => setActiveTab('domain')}
          className={`px-4 py-2 text-md-sm font-medium border-b-2 transition-colors -mb-[1px] ${
            activeTab === 'domain'
              ? 'text-[#2469f0] border-[#2469f0]'
              : 'text-[var(--md-gray-500)] border-transparent hover:text-[var(--md-gray-700)]'
          }`}
        >
          Domain
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {activeTab === 'features' && (
          <FeaturesPanel
            features={ALL_FEATURES}
            enabledFeatures={features}
            role={role}
            onToggle={handleFeatureToggle}
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
      </div>

      {/* Footer */}
      <Footer onReload={handleReload} onReset={handleReset} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="px-4 py-2 bg-[var(--md-gray-800)] text-white text-md-sm rounded-lg shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
