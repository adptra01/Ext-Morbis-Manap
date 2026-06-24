import { chromium } from 'playwright';

const BASE = 'http://103.147.236.140';

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  const results = [];

  // Track POST requests — log full payload
  page.on('request', req => {
    if (req.method() === 'POST' && req.url().includes('rm-rawat-jalan')) {
      const data = req.postData() || '';
      console.log('\n=== CAPTURED PAYLOAD ===');
      // Log just the ICD-related parts
      const lines = data.split('&').filter(l => 
        l.includes('nama[') || l.includes('idicd[') || l.includes('kode10[') || 
        l.includes('kode9[') || l.includes('namaTindakan[') || 
        l.includes('kategori') || l.includes('komorbid') ||
        l.includes('kasus') || l.includes('komplikasi')
      );
      console.log(lines.join('\n'));
      if (lines.length === 0) console.log('  (no ICD-related fields in payload)');
    }
  });

  // 1. Login
  console.log('Login...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  await page.click('button[name="login_button"]');
  await page.waitForTimeout(3000);
  console.log('Login OK');

  // 2. Go to form page
  console.log('\nNavigating to form page...');
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=122502&id_visit=178020', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 3. Clear all existing ICD inputs from the native form
  console.log('Clearing ICD inputs...');
  await page.evaluate(() => {
    // Clear diagnosa inputs
    document.querySelectorAll('input[name="nama[]"], input[name="idicd[]"], input[name="kode10[]"]').forEach(el => el.value = '');
    document.querySelectorAll('select[name="kasus_diagnosa[]"], select[name="komplikasi[]"]').forEach(el => el.value = '');
    // Clear tindakan inputs
    document.querySelectorAll('input[name="namaTindakan[]"], input[name="idicdTindakan[]"], input[name="kode9[]"]').forEach(el => el.value = '');
    document.querySelectorAll('select[name="komorbid[]"], select[name="kategoriProsedur[]"]').forEach(el => el.value = '');
  });

  // 4. Click native save
  console.log('Clicking native Simpan...');
  await page.click('#save');
  await page.waitForTimeout(5000);
  console.log('After save URL:', page.url());

  // 5. Check result
  const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
  console.log('Page:', text.substring(0, 300));

  // 6. Check if ICD inputs still have values on the info page
  // (The form page is gone, we're on the info page now)
  console.log('\nNavigating to form page again to verify ICD state...');
  await page.goto(BASE + '/rekam-medik/rm-rawat-jalan-new?id=122502&id_visit=178020', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const icdState = await page.evaluate(() => {
    const kode10 = Array.from(document.querySelectorAll('input[name="kode10[]"]')).map(i => i.value).filter(Boolean);
    const nama = Array.from(document.querySelectorAll('input[name="nama[]"]')).map(i => i.value).filter(Boolean);
    const kode9 = Array.from(document.querySelectorAll('input[name="kode9[]"]')).map(i => i.value).filter(Boolean);
    return { kode10, nama, kode9 };
  });
  console.log('ICD state:', JSON.stringify(icdState));

  if (icdState.kode10.length === 0 && icdState.nama.length === 0) {
    console.log('\n✅ TEST PASSED: ICD berhasil dihapus (native form — cleared inputs)');
  } else {
    console.log('\n❌ TEST FAILED: ICD masih ada:', icdState.kode10);
    console.log('   Nama:', icdState.nama);
    console.log('   Tindakan:', icdState.kode9);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
