import { createRoot, type Root } from 'react-dom/client'
import { App } from './App'
import { ErrorBoundary } from './ErrorBoundary'
import type { ResumeData, DiagnosaRow, TindakanRow } from './types'

const isRj = location.pathname.includes('rm-rawat-jalan-new')

// ponytail: both pages use same ICD search endpoints
const AUTOCOMPLETE_URLS = {
  icd10: '/rekam-medik/search?opsi=clauseDiagnose_icd10&q=',
  icd9: '/rekam-medik/search?opsi=clauseDiagnose_icd9&q=',
}

const ENDPOINT = isRj
  ? '/rekam-medik/control/rm-rawat-jalan'
  : '/v2/m-klaim/detail-v2-refaktor/simpan_resume'

console.log('[RJ] setup — isRj:', isRj, 'ENDPOINT:', ENDPOINT)
console.log('[RJ] AUTOCOMPLETE_URLS:', AUTOCOMPLETE_URLS)

let reactRoot: Root | null = null
let overlayBtn: HTMLButtonElement | null = null

// ponytail: parse #resume-view tabel untuk ambil data yang sudah ter-render
function parseResumeView(): ResumeData | null {
  const view = document.getElementById('resume-view')
  if (!view) return null
  const txt = (label: string): string => {
    const rows = view.querySelectorAll('table table tr, fieldset table tr')
    for (const row of rows) {
      const cells = row.querySelectorAll('td')
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent?.trim() === label && cells[i + 1]) {
          const next = cells[i + 1]
          // skip the colon td
          const valCell = next.textContent?.trim() === ':' ? cells[i + 2] : next
          return valCell?.textContent?.trim() || ''
        }
      }
    }
    return ''
  }

  const getFisik = (): string => {
    const fisik = Array.from(view.querySelectorAll('tr')).find(r => r.textContent?.includes('Hasil Pemeriksaan Fisik'))
    if (!fisik) return ''
    const vtable = fisik.querySelector('td:last-child table, td[colspan] table')
    if (!vtable) return ''
    const lines: string[] = []
    const vitals = ['Tensi', 'Nadi', 'Suhu', 'Nafas', 'Tinggi', 'Berat']
    const vrows = vtable.querySelectorAll('tr')
    let lainnya = ''
    for (const row of vrows) {
      const cells = row.querySelectorAll('td')
      let firstInRow = true
      for (let i = 0; i < cells.length; i++) {
        const txt = cells[i].textContent?.trim() || ''
        if (vitals.includes(txt) && i + 2 < cells.length) {
          const colon = cells[i + 1]?.textContent?.trim() === ':' ? cells[i + 2] : null
          if (colon) {
            if (firstInRow) { lines.push(`${txt}: ${colon.textContent?.trim() || ''}`); firstInRow = false }
            else { lines.push(`${txt}: ${colon.textContent?.trim() || ''}`) }
            i += 2
            continue
          }
        }
        // ponytail: 'Lainnya' row has the actual fisik notes
        if (txt === 'Lainnya' && i + 2 < cells.length) {
          lainnya = cells[i + 2]?.textContent?.trim() || ''
        }
      }
    }
    if (lainnya && lainnya.toLowerCase() !== 'cm') lines.push('', lainnya)
    return lines.join('\n')
  }

  const getVital = (label: string): string => {
    const fisik = Array.from(view.querySelectorAll('tr')).find(r => r.textContent?.includes('Hasil Pemeriksaan Fisik'))
    if (!fisik) return ''
    // ponytail: vitals table is inside the 3rd <td> (colspan), not a sibling row
    const td = fisik.querySelector('td:last-child table, td[colspan] table')
    if (!td) return ''
    const rows = td.querySelectorAll('tr')
    for (const row of rows) {
      const cells = row.querySelectorAll('td')
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent?.trim() === label && cells[i + 1]) {
          const next = cells[i + 1]
          const valCell = next.textContent?.trim() === ':' ? cells[i + 2] : next
          return valCell?.textContent?.trim() || ''
        }
      }
    }
    return ''
  }

  // Parse ICD-10 diagnoses from the ICD X section
  const diagnosa: DiagnosaRow[] = []
  const icdSection = Array.from(view.querySelectorAll('tr')).find(r => r.textContent?.includes('ICD X'))
  if (icdSection) {
    // ponytail: ICD table is inside the last <td> of the same row
    const icdTable = icdSection.querySelector('td:last-child table, td[colspan] table')
    if (icdTable) {
      const items = icdTable.querySelectorAll('tr')
      for (const item of items) {
        const text = item.textContent?.trim() || ''
        // Format: "- Nama Diagnosa (KODE) -"
        const m = text.match(/-\s*(.+?)\s*\(([^)]+)\)\s*-/)
        if (m) {
          diagnosa.push({ idicd: '', kode10: m[2], namaDiagnosa: m[1], kasus: '', komplikasi: '' })
        }
      }
    }
  }

  return {
    patientInfo: {
      norm: txt('No. Rekam Medis'),
      pasien: txt('Nama Pasien'),
      nama_dokter: '',
    },
    clinicalNotes: {
      anamnesa: txt('Anamnesa'),
      pemeriksaan_fisik: getFisik(),
      catatan: txt('Diagnosa'),
      tindakan: txt('Tindakan'),
      terapi_pengobatan: txt('Terapi Pengobatan'),
    },
    vitalSigns: {
      tensi: getVital('Tensi'),
      nadi: getVital('Nadi'),
      suhu: getVital('Suhu'),
      nafas: getVital('Nafas'),
      tinggi: getVital('Tinggi'),
      berat: getVital('Berat'),
    },
    diagnosa,
    tindakan: [],
  }
}

function extractFormData(): ResumeData {
  console.log('[RJ] extractFormData — path:', location.pathname)
  const fromView = parseResumeView()

  const doc = document
  const getVal = (id: string) => (doc.getElementById(id) as HTMLInputElement)?.value || ''
  const getField = (name: string) => {
    const el = doc.querySelector(`textarea[name="${name}"], input[name="${name}"], #${name}`) as HTMLInputElement | HTMLTextAreaElement | null
    return el?.value || ''
  }

  const patientInfo = {
    norm: getVal('norm') || getVal('no_rm'),
    pasien: getVal('pasien') || getVal('nama_pasien'),
    nama_dokter: getVal('nama_dokter') || getVal('dokter'),
  }
  console.log('[RJ] patientInfo:', patientInfo)

  const clinicalNotes = {
    anamnesa: getField('anamnesa'),
    pemeriksaan_fisik: getField('pemeriksaan_fisik') || getField('pemeriksaan') || getField('fisik') || '',
    catatan: getField('catatan'),
    tindakan: getField('tindakan'),
    terapi_pengobatan: getField('terapi_pengobatan'),
  }
  console.log('[RJ] clinicalNotes:', clinicalNotes)

  const vitalSigns = {
    tensi: getVal('tensi'),
    nadi: getVal('nadi'),
    suhu: getVal('suhu'),
    nafas: getVal('nafas'),
    tinggi: getVal('tinggi'),
    berat: getVal('berat'),
  }
  console.log('[RJ] vitalSigns:', vitalSigns)

  console.log('[RJ] diagnosa extraction start')
  const diagnosa: DiagnosaRow[] = []
  const kode10Inputs = doc.querySelectorAll<HTMLInputElement>('input[name="kode10[]"], input[name="kode[]"]')
  if (kode10Inputs.length === 0) {
    console.log('[RJ] using numbered ID fallback for diagnosa')
    let i = 1
    while (doc.getElementById(`kode${i}`) || doc.querySelector(`input[name="kode10[]"]:nth-child(${i})`)) {
      const idicd = getVal(`idicd${i}`) || ''
      const kode10 = getVal(`kode${i}`) || ''
      const nama = getVal(`nama${i}`) || ''
      if (kode10 || nama) diagnosa.push({ idicd, kode10, namaDiagnosa: nama, kasus: '', komplikasi: '' })
      i++
    }
  } else {
    console.log('[RJ] using array-based diagnosa inputs, count:', kode10Inputs.length)
    kode10Inputs.forEach((inp) => {
      const row = inp.closest('tr')
      if (!row) return
      const idicd = (row.querySelector<HTMLInputElement>('input[name="idicd[]"], input[name="idicd"]')?.value) || ''
      const kode10 = inp.value || ''
      const nama = (row.querySelector<HTMLInputElement>('input[name="namaDiagnosa[]"], input[name="nama[]"]')?.value) || ''
      const kasus = (row.querySelector<HTMLSelectElement>('select[name="kasus[]"]')?.value) || ''
      const komplikasi = (row.querySelector<HTMLSelectElement>('select[name="komplikasi[]"]')?.value) || ''
      if (kode10 || nama) {
        diagnosa.push({ idicd, kode10, namaDiagnosa: nama, kasus, komplikasi })
      }
    })
  }
  console.log('[RJ] diagnosa found:', diagnosa.length, diagnosa)

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

  // Merge: form data is primary, view data fills gaps
  if (fromView) {
    console.log('[RJ] merging from view data')
    if (!patientInfo.norm) patientInfo.norm = fromView.patientInfo.norm
    if (!patientInfo.pasien) patientInfo.pasien = fromView.patientInfo.pasien
    if (!patientInfo.nama_dokter) patientInfo.nama_dokter = fromView.patientInfo.nama_dokter
    if (!clinicalNotes.anamnesa) clinicalNotes.anamnesa = fromView.clinicalNotes.anamnesa
    if (!clinicalNotes.pemeriksaan_fisik) clinicalNotes.pemeriksaan_fisik = fromView.clinicalNotes.pemeriksaan_fisik
    if (!clinicalNotes.catatan) clinicalNotes.catatan = fromView.clinicalNotes.catatan
    if (!clinicalNotes.tindakan) clinicalNotes.tindakan = fromView.clinicalNotes.tindakan
    if (!clinicalNotes.terapi_pengobatan) clinicalNotes.terapi_pengobatan = fromView.clinicalNotes.terapi_pengobatan
    if (!vitalSigns.tensi) vitalSigns.tensi = fromView.vitalSigns.tensi
    if (!vitalSigns.nadi) vitalSigns.nadi = fromView.vitalSigns.nadi
    if (!vitalSigns.suhu) vitalSigns.suhu = fromView.vitalSigns.suhu
    if (!vitalSigns.nafas) vitalSigns.nafas = fromView.vitalSigns.nafas
    if (!vitalSigns.tinggi) vitalSigns.tinggi = fromView.vitalSigns.tinggi
    if (!vitalSigns.berat) vitalSigns.berat = fromView.vitalSigns.berat
    if (diagnosa.length === 0) diagnosa.push(...fromView.diagnosa)
  }

  console.log('[RJ] final data:', { patientInfo, clinicalNotes, vitalSigns, diagnosa, tindakan })
  return { patientInfo, clinicalNotes, vitalSigns, diagnosa, tindakan }
}

function serializeKlaim(data: ResumeData): string {
  const pairs: [string, string][] = []
  const add = (name: string, value: string | number) => pairs.push([name, String(value)])

  add('id_visit', (document.getElementById('id_visit') as HTMLInputElement)?.value || '')
  add('id_rawat_jalan', (document.getElementById('id_rawat_jalan') as HTMLInputElement)?.value || '')
  add('id_user', (document.getElementById('id_user') as HTMLInputElement)?.value || '')
  add('id_dokter', (document.getElementById('id_dokter') as HTMLInputElement)?.value || '')
  add('id_bed', (document.getElementById('id_bed') as HTMLInputElement)?.value || '')

  ;['noregis', 'norm', 'pasien', 'nama_dokter', 'waktu', 'alergiMakananJSON', 'alergiLingkunganJSON'].forEach((id) => {
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
  Object.entries(noteFields).forEach(([name, val]) => { if (val) add(name, val) })

  const vitalFields: Record<string, string> = {
    tensi: data.vitalSigns.tensi,
    nadi: data.vitalSigns.nadi,
    suhu: data.vitalSigns.suhu,
    nafas: data.vitalSigns.nafas,
    tinggi: data.vitalSigns.tinggi,
    berat: data.vitalSigns.berat,
  }
  Object.entries(vitalFields).forEach(([name, val]) => { if (val) add(name, val) })

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

function serializeRawatJalan(data: ResumeData): string {
  const pairs: [string, string][] = []
  const add = (name: string, value: string | number) => pairs.push([name, String(value)])

  // Copy hidden fields from original form
  ;['id_visit', 'id_rawat_jalan', 'id_user', 'id_dokter', 'id_bed', 'norm', 'noregis', 'pasien', 'nama_dokter'].forEach((id) => {
    const v = (document.getElementById(id) as HTMLInputElement)?.value
    if (v) add(id, v)
  })

  // Waktu — generate current datetime in DD/MM/YYYY HH:mm:ss format
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  add('waktu', `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)

  // Clinical notes
  add('anamnesa', data.clinicalNotes.anamnesa)
  if (data.clinicalNotes.pemeriksaan_fisik) add('pemeriksaan_fisik', data.clinicalNotes.pemeriksaan_fisik)
  if (data.clinicalNotes.catatan) add('catatan', data.clinicalNotes.catatan)
  if (data.clinicalNotes.tindakan) add('tindakan', data.clinicalNotes.tindakan)
  if (data.clinicalNotes.terapi_pengobatan) add('terapi_pengobatan', data.clinicalNotes.terapi_pengobatan)

  // Vital signs
  add('tensi', data.vitalSigns.tensi)
  if (data.vitalSigns.nadi) add('nadi', data.vitalSigns.nadi)
  if (data.vitalSigns.suhu) add('suhu', data.vitalSigns.suhu)
  if (data.vitalSigns.nafas) add('nafas', data.vitalSigns.nafas)
  if (data.vitalSigns.tinggi) add('tinggi', data.vitalSigns.tinggi)
  if (data.vitalSigns.berat) add('berat', data.vitalSigns.berat)

  // Diagnosa — uses nama[], idicd[], kode10[], kasus_diagnosa[], komplikasi[]
  data.diagnosa.forEach((d) => {
    add('nama[]', d.namaDiagnosa)
    add('idicd[]', d.idicd)
    add('kode10[]', d.kode10)
    add('kasus_diagnosa[]', d.kasus || 'BARU')
    add('komplikasi[]', d.komplikasi || '')
  })

  // Tindakan — uses namaTindakan[], kode9[]
  data.tindakan.forEach((t) => {
    if (t.namaTindakan) add('namaTindakan[]', t.namaTindakan)
    add('kode9[]', t.kode9)
  })

  add('save', 'Simpan')
  return pairs.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&')
}

function serializeFormData(data: ResumeData): string {
  return isRj ? serializeRawatJalan(data) : serializeKlaim(data)
}

function closeOverlay(container: HTMLElement) {
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }
  container.innerHTML = ''
  container.style.display = 'none'
  document.body.classList.remove('ext-resume-open')
  if (overlayBtn) overlayBtn.disabled = false
}

function mountReactApp(container: HTMLElement, data: ResumeData) {
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }
  container.innerHTML = ''

  if (!document.getElementById('morbis-resume-css')) {
    const s = document.createElement('style')
    s.id = 'morbis-resume-css'
    s.textContent = (typeof SHADOW_CSS !== 'undefined' ? SHADOW_CSS : '') + `
      .resume-modal{background:#fff;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,.25);width:90%;max-width:800px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;animation:resume-slideup .25s ease;}
      .resume-modal textarea{resize:vertical!important;min-height:60px;}
      .resume-modal button:not([disabled]){cursor:pointer;}
      @keyframes resume-slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    `
    document.head.appendChild(s)
  }

  reactRoot = createRoot(container)

  const handleSave = async (resumeData: ResumeData): Promise<void> => {
    const body = serializeFormData(resumeData)
    console.log('[RJ] save — endpoint:', ENDPOINT)
    console.log('[RJ] save — body:', body)
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      credentials: 'same-origin',
    })
    if (!response.ok) {
      console.error('[RJ] save failed:', response.status)
      throw new Error('HTTP ' + response.status)
    }
    console.log('[RJ] save success')
  }

  reactRoot.render(
    <ErrorBoundary onError={() => setTimeout(() => closeOverlay(container), 0)}>
      <App
        data={data}
        onSave={handleSave}
        onClose={() => closeOverlay(container)}
      />
    </ErrorBoundary>
  )

  document.body.classList.add('ext-resume-open')

  // ponytail: auto-expand textareas inside our modal only
  setTimeout(() => {
    container.querySelectorAll('textarea').forEach((tx) => {
      tx.addEventListener('input', () => {
        tx.style.height = 'auto'
        tx.style.height = tx.scrollHeight + 'px'
      })
      tx.dispatchEvent(new Event('input'))
    })
  }, 50)
}

function setupFloatingButton() {
  if (document.getElementById('ext-resume-float-btn')) return

  const container = document.createElement('div')
  container.id = 'ext-resume-container'
  container.style.cssText = 'position: fixed; inset: 0; z-index: 2147483646; display: none; background: rgba(0,0,0,.4); align-items: center; justify-content: center;'
  document.body.appendChild(container)

  const btn = document.createElement('button')
  overlayBtn = btn
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
    if (btn.disabled) return
    console.log('[RJ] button clicked')
    btn.disabled = true
    try {
      const data = extractFormData()
      console.log('[RJ] extracted data:', data)
      container.style.display = 'flex'
      mountReactApp(container, data)
    } catch (e) {
      console.error('[RJ] click error:', e)
      container.style.display = 'none'
      btn.disabled = false
    }
  })

  document.body.appendChild(btn)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.style.display === 'block') {
      closeOverlay(container)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupFloatingButton)
} else {
  setupFloatingButton()
}

export {}
