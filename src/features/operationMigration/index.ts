import { getMorbisGlobals } from '../shared/types.js'
import { detectPageType, getPageTypeLabel } from './observer/pageDetector.js'
import { captureSnapshot, saveSnapshotA, saveSnapshotB, clearSnapshots, getSnapshotA, getSnapshotB } from './observer/snapshot.js'
import { startNetworkObserver, getCapturedRequests } from './observer/networkSniffer.js'
import { saveObservation, computeDelta, updateDependencies } from './storage/evidenceStore.js'

const g = getMorbisGlobals()
const OBSERVER_PAGES = ['SOURCE', 'SOURCE_AWAL_RANAP', 'SOURCE_AWAL_RAJAL']

function log(msg: string): void {
  console.log('[Migration]', msg)
}

function generateObservationId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

async function onPageLoad(): Promise<void> {
  const pageType = detectPageType()
  const label = getPageTypeLabel(pageType)

  if (pageType === 'UNKNOWN') return

  log(`Halaman: ${label} (${pageType})`)

  const snap = captureSnapshot()
  log(`id_visit=${snap.idVisit} id_permintaan=${snap.idPermintaan} id_kunjungan=${snap.idKunjungan} id_induk_all=${snap.idIndukAll}`)

  if (OBSERVER_PAGES.includes(pageType)) {
    await saveSnapshotA()
    log('Snapshot A disimpan')
    startNetworkObserver()
  }

  if (pageType === 'SOURCE') {
    injectObserverPanel(label, snap)
  }
}

async function onPageReload(): Promise<void> {
  const pageType = detectPageType()
  if (!OBSERVER_PAGES.includes(pageType)) return

  await saveSnapshotB()

  const a = await getSnapshotA()
  const b = await getSnapshotB()

  if (!a || !b) {
    log('Snapshot tidak lengkap, skip')
    return
  }

  const delta = computeDelta(a, b)
  const networkRecords = getCapturedRequests()
  const bpjsRequests = networkRecords.filter((r) => r.isBpjsRequest)

  const obs = {
    id: generateObservationId(),
    timestamp: new Date().toISOString(),
    pageType,
    action: 'SUBMIT' as const,
    snapshotA: a,
    snapshotB: b,
    network: networkRecords.length > 0 ? networkRecords[0] : null,
    delta,
    confidence: 1.0,
  }

  await saveObservation(obs)
  await updateDependencies(obs)

  log(`Observasi: ${obs.id}`)
  log(`Berubah: ${delta.changed.length} | Tetap: ${delta.unchanged.length}`)
  if (delta.changed.length > 0) log(`Field: ${delta.changed.join(', ')}`)
  if (bpjsRequests.length > 0) log(`⚠️  BPJS: ${bpjsRequests.length} request`)

  await clearSnapshots()
}

function injectObserverPanel(label: string, snap: ReturnType<typeof captureSnapshot>): void {
  if (document.getElementById('ext-migration-panel')) return

  const panel = document.createElement('div')
  panel.id = 'ext-migration-panel'
  panel.style.cssText = `
    position: fixed; top: 10px; right: 10px; z-index: 99999;
    background: #1a1a2e; color: #e0e0e0; border-radius: 8px;
    padding: 12px 16px; font-size: 12px; font-family: monospace;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3); max-width: 380px;
    border: 1px solid #333; display: none;
  `

  const toggle = document.createElement('button')
  toggle.id = 'ext-migration-toggle'
  toggle.textContent = '🔍'
  toggle.title = 'Operation Migration Framework - Observer'
  toggle.style.cssText = `
    position: fixed; top: 10px; right: 10px; z-index: 100000;
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a1a2e; color: #4fc3f7; border: 1px solid #333;
    cursor: pointer; font-size: 16px; display: flex;
    align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  `

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid #333;padding-bottom:6px">
      <strong style="color:#4fc3f7">🔍 Migration Observer</strong>
      <span id="ext-migration-close" style="cursor:pointer;color:#888;font-size:14px">✕</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">Halaman:</span>
      <span style="color:#4fc3f7">${label}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_permintaan:</span>
      <span style="color:#fff">${snap.idPermintaan || '—'}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_visit:</span>
      <span style="color:#fff">${snap.idVisit || '—'}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_kunjungan:</span>
      <span style="color:#fff">${snap.idKunjungan || '—'}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">id_induk_all:</span>
      <span style="color:#fff">${snap.idIndukAll || '—'}</span>
    </div>
    <div style="margin-bottom:6px">
      <span style="color:#888">Detail billing:</span>
      <span style="color:#fff">${snap.detailBillingIds.length} item</span>
    </div>
    <div id="ext-migration-status" style="margin-top:6px;padding-top:6px;border-top:1px solid #333;color:#888;font-size:11px">
      Mode: AUDIT (read-only)
    </div>
  `

  document.body.appendChild(toggle)
  document.body.appendChild(panel)

  toggle.addEventListener('click', () => {
    const p = document.getElementById('ext-migration-panel')
    if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none'
  })

  panel.querySelector('#ext-migration-close')?.addEventListener('click', () => {
    panel.style.display = 'none'
  })
}

async function init(): Promise<void> {
  const pageType = detectPageType()
  if (pageType === 'UNKNOWN') return

  log(`Init di halaman: ${getPageTypeLabel(pageType)}`)

  await onPageLoad()

  // Cek apakah ini post-submit reload (Snapshot B sudah ada)
  const b = await getSnapshotB()
  if (b) {
    await onPageReload()
  }
}

// Register sebagai FeatureModule (untuk flow konfigurasi nanti)
if (typeof g.featureModules !== 'undefined') {
  g.featureModules.operationMigration = {
    id: 'operationMigration',
    name: 'Operation Migration Framework',
    description: 'Framework observasi relasi data operasi, visit, dan billing',
    match: {
      oneOf: [
        { prefix: '/admisi/pelaksanaan-operasi' },
        { prefix: '/admisi/pelaksanaan_pelayanan/input-tindakan-oprasi' },
        { prefix: '/admisi/detail-rawat-inap/pengajuan-operasi' },
        { prefix: '/admisi/informasi/data-kunjungan' },
        { prefix: '/admisi/edit-kunjungan' },
        { prefix: '/billing/billing' },
        { prefix: '/admisi/detail-rawat-inap/new-pemeriksaan-lab' },
      ],
    },
    run: init,
  }
}

// Self-execute tanpa perlu config (Phase 1: Observer)
init()
