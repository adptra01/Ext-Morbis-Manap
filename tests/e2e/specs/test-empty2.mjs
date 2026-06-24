// Test using Playwright context.request (sends cookies automatically)
import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // 1. Login
  console.log('Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  await page.click('button[name="login_button"]');
  await page.waitForTimeout(3000);

  const title = await page.title();
  if (title.includes('Login')) { console.log('Login failed'); await browser.close(); return; }
  console.log('Login OK');

  // 2. Build form data
  const f = new URLSearchParams();
  f.append('noregis', '00000001');
  f.append('norm', '00014530');
  f.append('pasien', 'LAELISA KUSUMA SARI');
  f.append('id_visit', '178020');
  f.append('id_bed', '5215');
  f.append('nama_dokter', 'dr. Yanrike Harahap, Sp. PD');
  f.append('id_dokter', '2299327');
  f.append('tensi', '107/60');
  f.append('nadi', '72');
  f.append('suhu', '36.6');
  f.append('nafas', '18');
  f.append('tinggi', '160');
  f.append('berat', '60');
  f.append('waktu', new Date().toLocaleString('id-ID', { hour12: false }).replace(/\//g, '/'));
  f.append('anamnesa', 'test delete');
  f.append('pemeriksaan_fisik', 'test delete');
  f.append('jenis_kasus', '201');
  f.append('status_kasus', 'LAMA');
  f.append('tindak_lanjut', '56');
  f.append('catatan', 'test delete');
  f.append('tindakan', '');
  f.append('terapi_pengobatan', '');
  f.append('alergiMakananJSON', '[]');
  f.append('alergiLingkunganJSON', '[]');
  f.append('composition_diet', '');
  f.append('id_user', '1');
  f.append('id_rawat_jalan', '122502');
  // ⭐ Array kosong
  f.append('nama[]', ''); f.append('idicd[]', ''); f.append('kode10[]', '');
  f.append('kasus_diagnosa[]', ''); f.append('komplikasi[]', '');
  f.append('namaTindakan[]', ''); f.append('kode9[]', ''); f.append('idicdTindakan[]', '');
  f.append('kategoriProsedur[]', ''); f.append('komorbid[]', '');
  f.append('save', 'Simpan');

  // 3. Send via context.request
  console.log('Sending POST...');
  const res = await context.request.fetch(BASE + '/rekam-medik/control/rm-rawat-jalan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: f.toString()
  });
  console.log('Status:', res.status());
  console.log('Location:', res.headers()['location'] || 'none');
  const body = await res.text();
  console.log('Body len:', body.length);

  if (body.includes('error') || body.includes('Error')) {
    console.log('Response contains error');
  }

  // 4. Follow redirect if any
  const loc = res.headers()['location'];
  if (loc) {
    await page.goto(BASE + loc, { waitUntil: 'networkidle' });
    const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Redirect page:', text.substring(0, 200));
  }

  // 5. Verify ICD state via form page
  if (loc && loc.includes('msg=1')) {
    console.log('\nPOST succeeded! Checking ICD state...');
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
