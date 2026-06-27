import type { Observation, DependencyLink, DependencyGraph, FieldChange } from '../shared/types.js'

const ID_ENTITIES = ['id_kunjungan', 'id_visit', 'id_permintaan', 'id_induk_all', 'id_detail_billing']

function findIdField(changes: FieldChange[]): string | null {
  const idChange = changes.find((c) => ID_ENTITIES.includes(c.field))
  return idChange?.field ?? null
}

function findRelatedFields(changes: FieldChange[], idField: string): string[] {
  return changes.filter((c) => c.field !== idField && c.category !== 'OTHER').map((c) => c.field)
}

export function buildDependencyGraph(observations: Observation[]): DependencyGraph {
  const links: DependencyLink[] = []
  const linkMap = new Map<string, DependencyLink>()

  for (const obs of observations) {
    if (!obs.snapshotA || !obs.snapshotB) continue
    const allKeys = new Set([
      ...Object.keys(obs.snapshotA.form.inputs),
      ...Object.keys(obs.snapshotB.form.inputs),
    ])
    const changedFields = [...allKeys].filter(
      (k) => obs.snapshotA!.form.inputs[k] !== obs.snapshotB!.form.inputs[k]
    )

    const idField = findIdField(changedFields.map((f) => ({ field: f, category: 'OTHER' as const })))
    if (!idField) continue

    const related = findRelatedFields(
      changedFields.map((f) => ({
        field: f,
        from: obs.snapshotA!.form.inputs[f] ?? '',
        to: obs.snapshotB!.form.inputs[f] ?? '',
        action: 'REPLACE' as const,
        confidence: 0,
        category: 'OTHER' as const,
      })),
      idField
    )

    for (const relatedField of related) {
      const key = `${idField}->${relatedField}`
      const existing = linkMap.get(key)
      if (existing) {
        existing.count++
        existing.confidence = Math.min(existing.count / observations.length, 1)
      } else {
        linkMap.set(key, {
          fromId: idField,
          toId: relatedField,
          via: obs.pageType,
          pageType: obs.pageType,
          count: 1,
          confidence: 1 / observations.length,
        })
      }
    }
  }

  for (const link of linkMap.values()) {
    links.push(link)
  }

  // Build propagation paths
  const propagationPaths: string[][] = []
  for (const start of ID_ENTITIES) {
    const path = [start]
    const outgoing = links.filter((l) => l.fromId === start)
    for (const link of outgoing) {
      if (!path.includes(link.toId)) path.push(link.toId)
    }
    if (path.length > 1) propagationPaths.push(path)
  }

  const confidence = links.length > 0
    ? links.reduce((sum, l) => sum + l.confidence, 0) / links.length
    : 0

  return { links, idEntities: [...ID_ENTITIES], propagationPaths, confidence }
}

export function getMigratableIds(obs: Observation): string[] {
  const ids: string[] = []
  if (obs.snapshotA?.idKunjungan) ids.push('id_kunjungan')
  if (obs.snapshotA?.idVisit) ids.push('id_visit')
  if (obs.snapshotA?.idPermintaan) ids.push('id_permintaan')
  if (obs.snapshotA?.idIndukAll) ids.push('id_induk_all')
  return ids
}

export function getPageDependencies(pt: string): string[] {
  const map: Record<string, string[]> = {
    SOURCE: ['id_visit', 'id_permintaan'],
    SOURCE_AWAL_RANAP: ['id_visit', 'id_permintaan'],
    SOURCE_AWAL_RAJAL: ['id_visit', 'id_permintaan'],
    CHILD_CPPT: ['id_visit'],
    CHILD_CEKLIST_PRE: ['id_visit'],
    CHILD_CEKLIST_ANASTESI: ['id_visit'],
    CHILD_CEKLIST_KESELAMATAN: ['id_visit'],
    CHILD_PENUNJANG: ['id_visit'],
    CHILD_LAB: ['id_visit', 'id_kunjungan'],
    CHILD_RESUME: ['id_visit'],
    CHILD_BHP: [],
    CHILD_LAPORAN: [],
    CHILD_SURAT_PERSETUJUAN: [],
    CHILD_INFORMASI_KEDOKTERAN: [],
    BILLING_SOURCE: ['id_kunjungan', 'id_induk_all'],
    EDIT_KUNJUNGAN: ['id_kunjungan'],
    TARGET_LIST: [],
  }
  return map[pt] ?? []
}

export function summarizeEvidence(observations: Observation[]): string {
  const total = observations.length
  if (total === 0) return 'Belum ada observasi'
  const byPage: Record<string, number> = {}
  for (const o of observations) {
    byPage[o.pageType] = (byPage[o.pageType] || 0) + 1
  }
  const pageSummary = Object.entries(byPage)
    .sort((a, b) => b[1] - a[1])
    .map(([p, c]) => `${p}=${c}`)
    .join(', ')
  const withDelta = observations.filter((o) => o.delta && o.delta.changed.length > 0).length
  return `${total} observasi, ${withDelta} dengan perubahan, per halaman: ${pageSummary}`
}
