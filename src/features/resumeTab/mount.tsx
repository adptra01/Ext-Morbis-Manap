import { createRoot, type Root } from 'react-dom/client'
import { App } from './App'
import type { ResumeData, DiagnosaRow, TindakanRow } from './types'

const AUTOCOMPLETE_URLS = {
  icd10: '/v2/m-klaim/icd-10/search',
  icd9: '/v2/m-klaim/icd-9/search',
}

const ENDPOINT = '/v2/m-klaim/detail-v2-refaktor/simpan_resume'

let reactRoot: Root | null = null

function extractFormData(): ResumeData {
  const doc = document

  const getVal = (id: string) => (doc.getElementById(id) as HTMLInputElement)?.value || ''
  const getTextarea = (name: string) =>
    (doc.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement)?.value || ''

  const patientInfo = {
    norm: getVal('norm') || getVal('no_rm'),
    pasien: getVal('pasien') || getVal('nama_pasien'),
    nama_dokter: getVal('nama_dokter') || getVal('dokter'),
  }

  const clinicalNotes = {
    anamnesa: getTextarea('anamnesa'),
    pemeriksaan_fisik: getTextarea('pemeriksaan_fisik'),
    catatan: getTextarea('catatan'),
    tindakan: getTextarea('tindakan'),
    terapi_pengobatan: getTextarea('terapi_pengobatan'),
  }

  const vitalSigns = {
    tensi: getVal('tensi'),
    nadi: getVal('nadi'),
    suhu: getVal('suhu'),
    nafas: getVal('nafas'),
    tinggi: getVal('tinggi'),
    berat: getVal('berat'),
  }

  const diagnosa: DiagnosaRow[] = []
  const kode10Inputs = doc.querySelectorAll<HTMLInputElement>('input[name="kode10[]"]')
  kode10Inputs.forEach((inp) => {
    const row = inp.closest('tr')
    if (!row) return
    const idicd = (row.querySelector<HTMLInputElement>('input[name="idicd[]"]')?.value) || ''
    const kode10 = inp.value || ''
    const nama = (row.querySelector<HTMLInputElement>('input[name="namaDiagnosa[]"]')?.value) || ''
    const kasus = (row.querySelector<HTMLSelectElement>('select[name="kasus[]"]')?.value) || ''
    const komplikasi = (row.querySelector<HTMLSelectElement>('select[name="komplikasi[]"]')?.value) || ''
    if (kode10 || nama) {
      diagnosa.push({ idicd, kode10, namaDiagnosa: nama, kasus, komplikasi })
    }
  })

  const tindakan: TindakanRow[] = []
  const kode9Inputs = doc.querySelectorAll<HTMLInputElement>('input[name="kode9[]"]')
  kode9Inputs.forEach((inp) => {
    const row = inp.closest('tr')
    if (!row) return
    const kode9 = inp.value || ''
    if (!kode9) return
    const idicd = (row.querySelector<HTMLInputElement>('input[name="idicdTindakan[]"]')?.value) || ''
    const nama = (row.querySelector<HTMLInputElement>('input[name="namaTindakan[]"]')?.value) || ''
    const komorbid = (row.querySelector<HTMLSelectElement>('select[name="komorbid[]"]')?.value) || ''
    const kategori = (row.querySelector<HTMLSelectElement>('select[name="kategoriProsedur[]"]')?.value) || ''
    const snomed = (row.querySelector<HTMLInputElement>('input[name="snomedProsedur[]"]')?.value) || ''
    const codeProsedur = (row.querySelector<HTMLInputElement>('input[name="codeProsedur[]"]')?.value) || kode9
    tindakan.push({ idicdTindakan: idicd, kode9, namaTindakan: nama, komorbid, kategoriProsedur: kategori, snomedProsedur: snomed, codeProsedur })
  })

  return { patientInfo, clinicalNotes, vitalSigns, diagnosa, tindakan }
}

function serializeFormData(data: ResumeData): string {
  const pairs: [string, string][] = []

  const add = (name: string, value: string | number) => {
    pairs.push([name, String(value)])
  }

  add('id_visit', (document.getElementById('id_visit') as HTMLInputElement)?.value || '')
  add('id_rawat_jalan', (document.getElementById('id_rawat_jalan') as HTMLInputElement)?.value || '')
  add('id_user', (document.getElementById('id_user') as HTMLInputElement)?.value || '')
  add('id_dokter', (document.getElementById('id_dokter') as HTMLInputElement)?.value || '')
  add('id_bed', (document.getElementById('id_bed') as HTMLInputElement)?.value || '')

  const otherFields = ['noregis', 'norm', 'pasien', 'nama_dokter', 'waktu', 'alergiMakananJSON', 'alergiLingkunganJSON']
  otherFields.forEach((id) => {
    const v = (document.getElementById(id) as HTMLInputElement)?.value
    if (v) add(id, v)
  })

  const noteFields: Record<string, string> = {
    anamnesa: data.clinicalNotes.anamnesa,
    pemeriksaan_fisik: data.clinicalNotes.pemeriksaan_fisik,
    catatan: data.clinicalNotes.catatan,
    tindakan: data.clinicalNotes.tindakan,
    terapi_pengobatan: data.clinicalNotes.terapi_pengobatan,
  }
  Object.entries(noteFields).forEach(([name, val]) => {
    if (val) add(name, val)
  })

  const vitalFields: Record<string, string> = {
    tensi: data.vitalSigns.tensi,
    nadi: data.vitalSigns.nadi,
    suhu: data.vitalSigns.suhu,
    nafas: data.vitalSigns.nafas,
    tinggi: data.vitalSigns.tinggi,
    berat: data.vitalSigns.berat,
  }
  Object.entries(vitalFields).forEach(([name, val]) => {
    if (val) add(name, val)
  })

  data.diagnosa.forEach((d) => {
    add('idicd[]', d.idicd)
    add('kode10[]', d.kode10)
    add('namaDiagnosa[]', d.namaDiagnosa)
    add('kasus[]', d.kasus)
    add('komplikasi[]', d.komplikasi)
  })

  data.tindakan.forEach((t) => {
    add('idicdTindakan[]', t.idicdTindakan)
    add('kode9[]', t.kode9)
    add('namaTindakan[]', t.namaTindakan)
    add('komorbid[]', t.komorbid)
    add('kategoriProsedur[]', t.kategoriProsedur)
    add('snomedProsedur[]', t.snomedProsedur)
    add('codeProsedur[]', t.codeProsedur || t.kode9)
  })

  add('save', 'Simpan')

  return pairs.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&')
}

function mountReactApp(container: HTMLElement, data: ResumeData) {
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }

  const shadow = container.attachShadow({ mode: 'open' })

  const wrapper = document.createElement('div')
  wrapper.style.cssText = 'all: initial; display: block; width: 100%; height: 100%; pointer-events: auto;'

  const style = document.createElement('style')
  style.textContent = (typeof SHADOW_CSS !== 'undefined' ? SHADOW_CSS : '')
  shadow.appendChild(style)

  shadow.appendChild(wrapper)

  reactRoot = createRoot(wrapper)

  const handleSave = async (resumeData: ResumeData): Promise<void> => {
    const body = serializeFormData(resumeData)
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'same-origin',
    })
    if (!response.ok) throw new Error('HTTP ' + response.status)
    return
  }

  reactRoot.render(
    <App
      data={data}
      onSave={handleSave}
      onClose={() => {
        if (reactRoot) {
          reactRoot.unmount()
          reactRoot = null
        }
        container.innerHTML = ''
        container.style.display = 'none'
        document.body.classList.remove('ext-resume-open')
      }}
    />
  )

  document.body.classList.add('ext-resume-open')
}

function setupFloatingButton() {
  const existing = document.getElementById('ext-resume-float-btn')
  if (existing) return

  const container = document.createElement('div')
  container.id = 'ext-resume-container'
  // Container only passes clicks through; interactive content lives in shadow DOM
  container.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646; display: none; pointer-events: none;'
  document.body.appendChild(container)

  const btn = document.createElement('button')
  btn.id = 'ext-resume-float-btn'
  btn.textContent = 'RJ'
  btn.title = 'Resume Rajal'
  btn.style.cssText =
    'position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483645;' +
    'width:44px;height:44px;border-radius:10px;border:none;' +
    'background:#2469f0;color:white;font-size:13px;font-weight:700;' +
    'cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);' +
    'transition:transform .15s,box-shadow .15s;' +
    'font-family:Inter,-apple-system,sans-serif;'
  btn.onmouseenter = () => { btn.style.transform = 'translateY(-50%) scale(1.05)'; btn.style.boxShadow = '0 4px 16px rgba(36,105,240,.35)' }
  btn.onmouseleave = () => { btn.style.transform = 'translateY(-50%)'; btn.style.boxShadow = '0 2px 8px rgba(0,0,0,.2)' }

  btn.addEventListener('click', () => {
    const data = extractFormData()
    container.style.display = 'block'
    mountReactApp(container, data)
  })

  document.body.appendChild(btn)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.style.display === 'block') {
      if (reactRoot) {
        reactRoot.unmount()
        reactRoot = null
      }
      container.innerHTML = ''
      container.style.display = 'none'
      document.body.classList.remove('ext-resume-open')
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFloatingButton)
} else {
  setupFloatingButton()
}

export {}
