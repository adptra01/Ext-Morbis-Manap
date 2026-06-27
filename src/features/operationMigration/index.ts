import type { Observation } from './shared/types.js'
import { getMorbisGlobals } from '../shared/types.js'
import { detectPageType, getPageTypeLabel } from './observer/pageDetector.js'
import { captureSnapshot, saveSnapshotA, saveSnapshotB, clearSnapshots, getSnapshotA, getSnapshotB } from './observer/snapshot.js'
import { startNetworkObserver, getCapturedRequests } from './observer/networkSniffer.js'
import { saveObservation, computeDelta, updateDependencies, getObservations } from './storage/evidenceStore.js'
import { compareSnapshots, categorizeChanges } from './engine/compareEngine.js'
import { buildDependencyGraph, summarizeEvidence } from './engine/dependencyMapper.js'

const g = getMorbisGlobals()
const OBSERVER_PAGES = ['SOURCE', 'SOURCE_AWAL_RANAP', 'SOURCE_AWAL_RAJAL']

function log(msg: string): void {
  console.log('[Migration]', msg)
}

function generateObservationId(): string {
  return `obs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

function updatePanelPhase2(obs: Observation): void {
  const el = document.getElementById('ext-migration-engine')
  if (!el) return
  const fieldChanges = obs.snapshotA && obs.snapshotB ? compareSnapshots(obs.snapshotA, obs.snapshotB) : []
  const cat = categorizeChanges(fieldChanges)
  el.innerHTML = `
    <div style="color:#4fc3f7;font-weight:bold;margin:6px 0 4px">Phase 2 — Compare Engine</div>
    <div>Perubahan: ${fieldChanges.length} field</div>
    ${Object.entries(cat).map(([k, v]) => v.length > 0 ? `<div style="color:#888;font-size:10px;margin-left:8px">${k}: ${v.length}</div>` : '').join('')}
  `
}

async function refreshPanelSummary(): Promise<void> {
  const el = document.getElementById('ext-migration-summary')
  if (!el) return
  const obs = await getObservations()
  const graph = buildDependencyGraph(obs)
  el.innerHTML = `
    <div style="color:#4fc3f7;font-weight:bold;margin:6px 0 4px">Phase 2 — Dependency Mapper</div>
    <div>Observasi: ${obs.length}</div>
    <div>Dependensi: ${graph.links.length} link</div>
    <div>Confidence: ${(graph.confidence * 100).toFixed(0)}%</div>
    <div style="color:#888;font-size:10px;margin-top:2px">${summarizeEvidence(obs)}</div>
    ${graph.propagationPaths.length > 0 ? `<div style="color:#888;font-size:10px;margin-top:2px">Paths: ${graph.propagationPaths.map(p => p.join('→')).join(' | ')}</div>` : ''}
  `
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

  updatePanelPhase2(obs)
  refreshPanelSummary()
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
  toggle.title = 'Operation Migration Framework'
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
      <strong style="color:#4fc3f7">🔍 Migration Framework</strong>
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
    <div id="ext-migration-engine"></div>
    <div id="ext-migration-summary"></div>
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

  refreshPanelSummary()
}

async function init(): Promise<void> {
  const pageType = detectPageType()
  if (pageType === 'UNKNOWN') return

  log(`Init di halaman: ${getPageTypeLabel(pageType)}`)

  await onPageLoad()

  const b = await getSnapshotB()
  if (b) {
    await onPageReload()
  }
}

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

init()
