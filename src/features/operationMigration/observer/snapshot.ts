import type { DOMSnapshot, FormState } from '../shared/types.js'
import { detectPageType } from './pageDetector.js'

function captureFormState(): FormState {
  const form = document.querySelector('form#form-data') || document.querySelector('form')
  const inputs: Record<string, string> = {}
  if (form) {
    document.querySelectorAll('input[name], select[name], textarea[name]').forEach((el) => {
      const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      if (input.name) inputs[input.name] = input.value
    })
  }
  return {
    action: form ? form.action : null,
    method: form ? (form.method || 'get').toUpperCase() : 'get',
    inputs,
  }
}

export function captureSnapshot(): DOMSnapshot {
  const form = captureFormState()
  const detailBillingInputs = document.querySelectorAll('input[name*="[id_detail_billing]"]')
  const dataInputs = document.querySelectorAll('input[name^="data["]')

  const visibleText: Record<string, string> = {}
  document.querySelectorAll('input:not([name]):not([type="hidden"]):not([type="button"]):not([type="submit"])').forEach((el) => {
    const inp = el as HTMLInputElement
    if (inp.value && inp.value.length < 100) {
      visibleText[`input_${visibleText.length + 1}`] = inp.value
    }
  })

  const scriptCount = Array.from(document.querySelectorAll('script:not([src])'))
    .filter((s) => s.innerText.includes('id_visit') || s.innerText.includes('id_kunjungan')).length

  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    pageType: detectPageType(),
    form,
    idIndukAll: (document.getElementById('id_induk_all') as HTMLInputElement)?.value || null,
    idPermintaan: (document.querySelector('[name="id_permintaan"]') as HTMLInputElement)?.value || null,
    idVisit: (document.querySelector('[name="id_visit"]') as HTMLInputElement)?.value || null,
    idKunjungan: (document.querySelector('[name="id_kunjungan"], [name="id"]') as HTMLInputElement)?.value || null,
    detailBillingIds: Array.from(detailBillingInputs).map((el) => (el as HTMLInputElement).value),
    dataArray: Array.from(dataInputs).map((el) => `${(el as HTMLInputElement).name}=${(el as HTMLInputElement).value}`),
    visibleText,
    scriptsWithIdVisit: scriptCount,
  }
}

const SNAPSHOT_KEY_A = 'migration_snapshot_A'
const SNAPSHOT_KEY_B = 'migration_snapshot_B'

export async function saveSnapshotA(): Promise<void> {
  const snap = captureSnapshot()
  await chrome.storage.local.set({ [SNAPSHOT_KEY_A]: snap })
}

export async function saveSnapshotB(): Promise<void> {
  const snap = captureSnapshot()
  await chrome.storage.local.set({ [SNAPSHOT_KEY_B]: snap })
}

export async function getSnapshotA(): Promise<DOMSnapshot | null> {
  const result = await chrome.storage.local.get(SNAPSHOT_KEY_A)
  return result[SNAPSHOT_KEY_A] || null
}

export async function getSnapshotB(): Promise<DOMSnapshot | null> {
  const result = await chrome.storage.local.get(SNAPSHOT_KEY_B)
  return result[SNAPSHOT_KEY_B] || null
}

export async function clearSnapshots(): Promise<void> {
  await chrome.storage.local.remove([SNAPSHOT_KEY_A, SNAPSHOT_KEY_B])
}
