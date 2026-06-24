// Simulasi filter + dedup + serialize untuk verifikasi 4 test cases
// Mengecek apakah serializeRawatJalan menghasilkan payload yang benar

const BASE_PAYLOAD = {
  noregis: '00000001',
  norm: '00014530',
  pasien: 'LAELISA KUSUMA SARI',
  id_visit: '178020',
  id_bed: '5215',
  nama_dokter: 'dr. Yanrike Harahap, Sp. PD',
  id_dokter: '2299327',
  id_user: '1',
  id_rawat_jalan: '122502',
  tensi: '107/60',
  nadi: '72',
  suhu: '36.6',
  nafas: '18',
  tinggi: '160',
  berat: '60',
  jenis_kasus: '201',
  status_kasus: 'LAMA',
  tindak_lanjut: '56',
  anamnesa: 'test',
  pemeriksaan_fisik: 'test',
  catatan: 'test',
  tindakan: 'test',
  terapi_pengobatan: 'test',
  save: 'Simpan'
}

function serialize(diagnosa, tindakan, termasukKasus = false) {
  const pairs = []
  const add = (k, v) => pairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(v ?? ''))

  // Add base fields (simplified)
  Object.entries(BASE_PAYLOAD).forEach(([k, v]) => add(k, v))

  // Filter + dedup diagnosa (sama seperti di serializeRawatJalan)
  const cleanDiagnosa = diagnosa
    .filter(d => d.idicd?.trim() && d.kode10?.trim() && d.namaDiagnosa?.trim())
    .filter((d, i, arr) => arr.findIndex(x => x.idicd === d.idicd) === i)

  cleanDiagnosa.forEach(d => {
    add('nama[]', d.namaDiagnosa)
    add('idicd[]', d.idicd)
    add('kode10[]', d.kode10)
    add('kasus_diagnosa[]', termasukKasus ? (d.kasus ?? '') : '')
    add('komplikasi[]', '')
  })

  // Filter + dedup tindakan
  const cleanTindakan = tindakan
    .filter(t => t.idicdTindakan?.trim() && t.kode9?.trim() && t.namaTindakan?.trim())
    .filter((t, i, arr) => arr.findIndex(x => x.idicdTindakan === t.idicdTindakan && x.kode9 === t.kode9) === i)

  cleanTindakan.forEach(t => {
    add('namaTindakan[]', t.namaTindakan)
    add('kode9[]', t.kode9)
    add('idicdTindakan[]', t.idicdTindakan)
    add('kategoriProsedur[]', t.kategoriProsedur ?? '')
    add('komorbid[]', t.komorbid ?? '')
  })

  return decodeURIComponent(pairs.join('&'))
}

function getArrayValues(payload, fieldName) {
  const regex = new RegExp(fieldName.replace('[', '\\[').replace(']', '\\]') + '=([^&]*)', 'g')
  const matches = []
  let m
  while ((m = regex.exec(payload)) !== null) {
    matches.push(m[1])
  }
  return matches
}

let pass = 0, fail = 0

function test(name, fn) {
  try {
    fn()
    console.log(`✅ PASS: ${name}`)
    pass++
  } catch (e) {
    console.log(`❌ FAIL: ${name} — ${e.message}`)
    fail++
  }
}

// ── Case 1: Hapus I10, tambah J45 ──
test('Case 1: Replace diagnose (hapus I10, tambah J45)', () => {
  const input = [
    { idicd: '49981', kode10: 'J18.9', namaDiagnosa: 'Pneumonia' },
    { idicd: '37872', kode10: 'J45', namaDiagnosa: 'Asthma' },
  ]
  const payload = serialize(input, [])
  const kode10 = getArrayValues(payload, 'kode10[]')
  const nama = getArrayValues(payload, 'nama[]')

  if (kode10.length !== 2) throw new Error(`Expected 2 kode10, got ${kode10.length}: ${JSON.stringify(kode10)}`)
  if (!kode10.includes('J18.9')) throw new Error('J18.9 not found')
  if (!kode10.includes('J45')) throw new Error('J45 not found')
  if (kode10.includes('I10')) throw new Error('I10 should be removed')
  if (nama.length !== 2) throw new Error('Expected 2 nama')
})

// ── Case 2: Duplicate J45 ──
test('Case 2: Duplicate diagnose (J45 twice → only once)', () => {
  const input = [
    { idicd: '37872', kode10: 'J45', namaDiagnosa: 'Asthma' },
    { idicd: '37872', kode10: 'J45', namaDiagnosa: 'Asthma' },
  ]
  const payload = serialize(input, [])
  const kode10 = getArrayValues(payload, 'kode10[]')

  if (kode10.length !== 1) throw new Error(`Expected 1 kode10, got ${kode10.length}`)
  if (kode10[0] !== 'J45') throw new Error('Expected J45, got ' + kode10[0])
})

// ── Case 3: Hapus semua diagnosa ──
test('Case 3: Hapus semua diagnosa (empty array)', () => {
  const input = []
  const payload = serialize(input, [])
  const kode10 = getArrayValues(payload, 'kode10[]')
  const idicd = getArrayValues(payload, 'idicd[]')

  if (kode10.length !== 0) throw new Error(`Expected 0 kode10, got ${kode10.length}`)
  if (idicd.length !== 0) throw new Error(`Expected 0 idicd, got ${idicd.length}`)
})

// ── Case 4: Tambah 5 tindakan ──
test('Case 4: Tambah 5 tindakan (sync indexes)', () => {
  const input = [
    { idicdTindakan: '14762', kode9: '90.59', namaTindakan: 'Microscopic examination', kategoriProsedur: '409063005', komorbid: 'Primer' },
    { idicdTindakan: '15238', kode9: '98.0', namaTindakan: 'Removal of foreign body', kategoriProsedur: '409063005', komorbid: 'Primer' },
    { idicdTindakan: '13604', kode9: '76.68', namaTindakan: 'Augmentation genioplasty', kategoriProsedur: '', komorbid: '' },
    { idicdTindakan: '12277', kode9: '39.98', namaTindakan: 'Control of hemorrhage', kategoriProsedur: '', komorbid: '' },
    { idicdTindakan: '11178', kode9: '09.81', namaTindakan: 'Dacryocystorhinostomy', kategoriProsedur: '', komorbid: '' },
  ]
  const payload = serialize([], input)
  const nama = getArrayValues(payload, 'namaTindakan[]')
  const kode9 = getArrayValues(payload, 'kode9[]')
  const idicdT = getArrayValues(payload, 'idicdTindakan[]')

  if (nama.length !== 5) throw new Error(`Expected 5 namaTindakan, got ${nama.length}`)
  if (kode9.length !== 5) throw new Error(`Expected 5 kode9, got ${kode9.length} — indexes differ!`)
  if (idicdT.length !== 5) throw new Error(`Expected 5 idicdTindakan, got ${idicdT.length} — indexes differ!`)
})

// ── Extra: Empty row not sent ──
test('Extra: Empty diagnose row not sent', () => {
  const input = [
    { idicd: '37872', kode10: 'J45', namaDiagnosa: 'Asthma' },
    { idicd: '', kode10: '', namaDiagnosa: '' },
    { idicd: '', kode10: 'E11', namaDiagnosa: '' },
    { idicd: '37873', kode10: '', namaDiagnosa: 'Allergic asthma' },
  ]
  const payload = serialize(input, [])
  const kode10 = getArrayValues(payload, 'kode10[]')

  if (kode10.length !== 1) throw new Error(`Expected only 1 valid diagnose, got ${kode10.length}`)
  if (kode10[0] !== 'J45') throw new Error('Expected J45, got ' + kode10[0])
})

// ── Extra: Duplicate tindakan ──
test('Extra: Duplicate tindakan (90.59 twice → once)', () => {
  const input = [
    { idicdTindakan: '14762', kode9: '90.59', namaTindakan: 'Microscopic exam', kategoriProsedur: '409063005', komorbid: 'Primer' },
    { idicdTindakan: '14762', kode9: '90.59', namaTindakan: 'Microscopic exam', kategoriProsedur: '409063005', komorbid: 'Primer' },
  ]
  const payload = serialize([], input)
  const kode9 = getArrayValues(payload, 'kode9[]')

  if (kode9.length !== 1) throw new Error(`Expected 1 kode9, got ${kode9.length}`)
})

// ── Summary ──
console.log(`\n=== ${pass} passed, ${fail} failed ===`)
process.exit(fail > 0 ? 1 : 0)
