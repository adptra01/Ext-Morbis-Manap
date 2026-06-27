import type { DOMSnapshot, FieldChange, FieldDelta, PageType } from '../shared/types.js'

type FieldCategory = 'ID_KUNJUNGAN' | 'ID_VISIT' | 'ID_PERMINTAAN' | 'ID_INDUK_ALL' | 'ID_DETAIL_BILLING' | 'BILLING' | 'STATUS' | 'DATA_TINDAKAN' | 'OTHER'

const FIELD_CATEGORIES: Record<string, FieldCategory> = {
  id_kunjungan: 'ID_KUNJUNGAN',
  id_visit: 'ID_VISIT',
  id_permintaan: 'ID_PERMINTAAN',
  id_induk_all: 'ID_INDUK_ALL',
  'data[id_detail_billing][]': 'ID_DETAIL_BILLING',
}

function categorizeField(name: string): FieldCategory {
  if (FIELD_CATEGORIES[name]) return FIELD_CATEGORIES[name]
  if (name.includes('[id_detail_billing]')) return 'ID_DETAIL_BILLING'
  if (name.includes('billing') || name.includes('tarif') || name.includes('biaya')) return 'BILLING'
  if (name.includes('status') || name.includes('is_active')) return 'STATUS'
  if (name.startsWith('data[') || name.startsWith('tindakan')) return 'DATA_TINDAKAN'
  return 'OTHER'
}

export function compareSnapshots(A: DOMSnapshot, B: DOMSnapshot): FieldChange[] {
  const changes: FieldChange[] = []
  const allKeys = new Set([...Object.keys(A.form.inputs), ...Object.keys(B.form.inputs)])
  const category = categorizeField

  for (const key of allKeys) {
    const from = A.form.inputs[key] ?? ''
    const to = B.form.inputs[key] ?? ''
    if (from === '' && to !== '') continue
    if (from !== '' && to === '') continue
    if (from === to) continue

    changes.push({
      field: key,
      from,
      to,
      action: 'REPLACE',
      confidence: 0.5,
      category: category(key),
    })
  }

  // Track ID-level changes
  const idPairs: [keyof DOMSnapshot, string][] = [
    ['idIndukAll', 'id_induk_all'],
    ['idPermintaan', 'id_permintaan'],
    ['idVisit', 'id_visit'],
    ['idKunjungan', 'id_kunjungan'],
  ]
  for (const [prop, label] of idPairs) {
    if (A[prop] !== B[prop] && A[prop] !== null && B[prop] !== null) {
      changes.push({
        field: label,
        from: A[prop] ?? '',
        to: B[prop] ?? '',
        action: 'REPLACE',
        confidence: 1.0,
        category: category(label),
      })
    }
  }

  return changes
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
    if (valA !== undefined && valB === undefined) removed.push(key)
    else if (valA === undefined && valB !== undefined) added.push(key)
    else if (valA !== valB) changed.push(key)
    else unchanged.push(key)
  }

  for (const prop of ['idIndukAll', 'idPermintaan', 'idVisit', 'idKunjungan'] as const) {
    if (A[prop] !== B[prop]) changed.push(prop)
    else if (A[prop] || B[prop]) unchanged.push(prop)
  }

  return { changed, unchanged, added, removed }
}

export function findChangedFields(fieldChanges: FieldChange[], category?: FieldCategory): string[] {
  return fieldChanges
    .filter((c) => !category || c.category === category)
    .map((c) => c.field)
}

export function categorizeChanges(fieldChanges: FieldChange[]): Record<FieldCategory, FieldChange[]> {
  const map: Record<string, FieldChange[]> = {}
  for (const c of fieldChanges) {
    const cat = c.category
    if (!map[cat]) map[cat] = []
    map[cat].push(c)
  }
  return map as Record<FieldCategory, FieldChange[]>
}

export function getPageCategoryWeight(pt: PageType): string {
  if (pt.startsWith('SOURCE')) return 'source'
  if (pt.startsWith('CHILD')) return 'child'
  return 'other'
}
