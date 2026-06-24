// Test: Kirim array kosong untuk diagnosa
// Untuk verifikasi apakah backend menghapus ICD saat menerima kode10[]= bukan omit
import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';
const ID_VISIT = '178020';
const ID_RAWAT = '122502';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Capture all requests
  let capturedResponse = null;
  page.on('response', async (res) => {
    if (res.url().includes('rm-rawat-jalan') && res.request().method() === 'POST') {
      capturedResponse = { status: res.status(), location: res.headers()['location'] || '' };
    }
  });

  // 1. Login
  console.log('1. Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  await page.click('button[name="login_button"]');
  await page.waitForTimeout(3000);
  console.log('   URL:', page.url());

  // 2. Login should redirect away from /login/check
  const title = await page.title();
  if (title.includes('Login')) {
    console.log('   ❌ Login failed');
    await browser.close();
    return;
  }
  console.log('   ✅ Login OK');

  // 3. Send empty array POST directly via fetch
  console.log('\n2. Sending empty array POST...');
  const result = await page.evaluate(async ({ BASE, ID_VISIT, ID_RAWAT }) => {
    const f = new URLSearchParams();
    f.append('noregis', '00000001');
    f.append('norm', '00014530');
    f.append('pasien', 'LAELISA KUSUMA SARI');
    f.append('id_visit', ID_VISIT);
    f.append('id_bed', '5215');
    f.append('nama_dokter', 'dr. Yanrike Harahap, Sp. PD');
    f.append('id_dokter', '2299327');
    f.append('pulang_berkas', '');
    f.append('tensi', '107/60');
    f.append('nadi', '72');
    f.append('suhu', '36.6');
    f.append('nafas', '18');
    f.append('tinggi', '160');
    f.append('berat', '60');
    f.append('waktu', new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '/'));
    f.append('anamnesa', 'test');
    f.append('pemeriksaan_fisik', 'test');
    f.append('jenis_kasus', '201');
    f.append('status_kasus', 'LAMA');
    f.append('tindak_lanjut', '56');
    f.append('catatan', 'test');
    f.append('tindakan', '');
    f.append('terapi_pengobatan', '');
    f.append('alergiMakananJSON', '[]');
    f.append('alergiLingkunganJSON', '[]');
    f.append('composition_diet', '');
    f.append('id_user', '1');
    f.append('id_rawat_jalan', ID_RAWAT);
    
    // ⭐ Kirim array KOSONG (bukan omit)
    f.append('nama[]', ''); f.append('idicd[]', ''); f.append('kode10[]', '');
    f.append('kasus_diagnosa[]', ''); f.append('komplikasi[]', '');
    f.append('namaTindakan[]', ''); f.append('kode9[]', ''); f.append('idicdTindakan[]', '');
    f.append('kategoriProsedur[]', ''); f.append('komorbid[]', '');

    f.append('save', 'Simpan');

    const res = await fetch(BASE + '/rekam-medik/control/rm-rawat-jalan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: f.toString(),
      credentials: 'include',
      redirect: 'manual'
    });

    const body = await res.text();
    return {
      status: res.status,
      location: res.headers.get('location') || '',
      bodyPreview: body.substring(0, 300)
    };
  }, { BASE, ID_VISIT, ID_RAWAT });

  console.log('   Status:', result.status);
  console.log('   Location:', result.location);
  console.log('   Full body:', result.bodyPreview);

  if (result.location) {
    console.log('\n3. Following redirect to check result...');
    await page.goto(BASE + result.location, { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText.substring(0, 1000));
    console.log('   Page:', text.substring(0, 500));
  }

  // 4. Now check if ICD was deleted by fetching the form page
  console.log('\n4. Opening form page to verify ICD state...');
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=' + ID_RAWAT + '&id_visit=' + ID_VISIT, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const icdState = await page.evaluate(() => {
    const kode10Inputs = document.querySelectorAll('input[name="kode10[]"]');
    const namaInputs = document.querySelectorAll('input[name="nama[]"]');
    return {
      count: kode10Inputs.length,
      values: Array.from(kode10Inputs).map(i => i.value),
      namaValues: Array.from(namaInputs).map(i => i.value)
    };
  });
  console.log('   ICD state after POST:', JSON.stringify(icdState));

  if (icdState.count === 0 || icdState.values.every(v => v === '')) {
    console.log('\n✅ TEST PASSED: Backend menerima array kosong → ICD terhapus');
  } else {
    console.log('\n❌ TEST FAILED: ICD masih ada meski array kosong dikirim');
    console.log('   Current ICD:', icdState.values);
  }

  await browser.close();
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
