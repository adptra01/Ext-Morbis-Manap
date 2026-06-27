import type { Observation, EvidenceStore, Dependency, MigrationRule, FieldDelta, DOMSnapshot } from '../shared/types.js'

const STORAGE_KEY = 'migration_evidence'
const VERSION = 1

function getDefaultStore(): EvidenceStore {
  return {
    version: VERSION,
    observations: [],
    dependencies: [],
    rules: [],
    lastUpdated: new Date().toISOString(),
  }
}

async function getStore(): Promise<EvidenceStore> {
  const result = await chrome.storage.local.get(STORAGE_KEY)
  return result[STORAGE_KEY] || getDefaultStore()
}

async function saveStore(store: EvidenceStore): Promise<void> {
  store.lastUpdated = new Date().toISOString()
  await chrome.storage.local.set({ [STORAGE_KEY]: store })
}

export async function saveObservation(obs: Observation): Promise<void> {
  const store = await getStore()
  store.observations.push(obs)
  await saveStore(store)
}

export async function getObservations(pageType?: string): Promise<Observation[]> {
  const store = await getStore()
  if (pageType) return store.observations.filter((o) => o.pageType === pageType)
  return store.observations
}

export async function getAllEvidence(): Promise<EvidenceStore> {
  return getStore()
}

export async function resetEvidence(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY)
}

export async function updateDependencies(obs: Observation): Promise<void> {
  const store = await getStore()
  if (!obs.delta) return

  for (const field of obs.delta.changed) {
    const existing = store.dependencies.find((d) => d.from === field)
    if (existing) {
      existing.observationsCount++
      existing.confidence = Math.min(existing.observationsCount / (store.observations.length || 1), 1)
    } else {
      store.dependencies.push({
        from: field,
        to: field,
        type: 'DIRECT',
        confidence: 1 / (store.observations.length || 1),
        observationsCount: 1,
      })
    }
  }

  for (const field of obs.delta.unchanged) {
    const existing = store.dependencies.find((d) => d.from === field)
    if (!existing) {
      store.dependencies.push({
        from: field,
        to: field,
        type: 'UNCHANGED',
        confidence: 1 / (store.observations.length || 1),
        observationsCount: 1,
      })
    } else {
      existing.observationsCount++
    }

    let rule = store.rules.find((r) => r.field === field)
    if (!rule) {
      rule = {
        id: `rule_${field}`,
        field,
        action: 'KEEP',
        confidence: 0,
        firstObserved: obs.timestamp,
        lastVerified: obs.timestamp,
        observationIds: [],
      }
      store.rules.push(rule)
    }
    rule.observationsCount = (rule.observationsCount || 0) + 1
    rule.confidence = Math.min(rule.observationsCount / store.observations.length, 1)
    rule.lastVerified = obs.timestamp
    rule.observationIds.push(obs.id)
  }

  await saveStore(store)
}

export async function addRule(rule: MigrationRule): Promise<void> {
  const store = await getStore()
  store.rules.push(rule)
  await saveStore(store)
}

export async function getDependencies(): Promise<Dependency[]> {
  const store = await getStore()
  return store.dependencies
}

export async function getRules(): Promise<MigrationRule[]> {
  const store = await getStore()
  return store.rules
}

export function computeDelta(A: DOMSnapshot, B: DOMSnapshot): FieldDelta {
  const changed: string[] = []
  const unchanged: string[] = []
  const added: string[] = []
  const removed: string[] = []

  const allKeys = new Set([...Object.keys(A.form.inputs), ...Object.keys(B.form.inputs)])

  for (const key of allKeys) {
    const valA = A.form.inputs[key]
    const valB = B.form.inputs[key]
    if (valA !== undefined && valB === undefined) {
      removed.push(key)
    } else if (valA === undefined && valB !== undefined) {
      added.push(key)
    } else if (valA !== valB) {
      changed.push(key)
    } else {
      unchanged.push(key)
    }
  }

  if (A.idIndukAll !== B.idIndukAll) changed.push('id_induk_all')
  else if (A.idIndukAll || B.idIndukAll) unchanged.push('id_induk_all')

  if (A.idPermintaan !== B.idPermintaan) changed.push('id_permintaan')
  else if (A.idPermintaan || B.idPermintaan) unchanged.push('id_permintaan')

  if (A.idVisit !== B.idVisit) changed.push('id_visit')
  else if (A.idVisit || B.idVisit) unchanged.push('id_visit')

  return { changed, unchanged, added, removed }
}
