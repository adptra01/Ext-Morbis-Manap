import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXT_PATH = path.resolve('/mnt/DiskD/Projects/Ext-Morbis-Manap/dist');
const BASE = 'http://103.147.236.140';

async function main() {
  console.log('=== Starting extension test ===\n');

  const context = await chromium.launchPersistentContext('/tmp/pw-ext-test', {
    headless: false,  // Need headless=false for extension to load
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
    ],
  });

  const page = await context.newPage();
  let capturedPayloads = [];

  // Intercept POST to rm-rawat-jalan
  await page.route('**/rm-rawat-jalan', async (route) => {
    if (route.request().method() === 'POST') {
      const data = route.request().postData() || '';
      capturedPayloads.push(data);
      console.log('  [HOOK] POST captured, length:', data.length);
    }
    await route.continue();
  });

  // Log console from page
  page.on('console', msg => {
    if (msg.text().includes('[RJ]') || msg.text().includes('[PICK]')) {
      console.log('  [CONSOLE]', msg.text());
    }
  });

  // 1. Login
  console.log('1. Logging in...');
  await page.goto(BASE + '/login/check', { waitUntil: 'networkidle' });
  await page.waitForSelector('input[name="username"]');
  await page.fill('input[name="username"]', 'mbi');
  await page.fill('input[name="password"]', 'maintenis');
  await page.click('button[name="login_button"]');
  await page.waitForTimeout(3000);
  console.log('   URL:', page.url());

  // 2. Navigate to detail page
  console.log('2. Opening detail page...');
  await page.goto(BASE + '/v2/m-klaim/detail-v2-refaktor?id_visit=178264&tanggalAwal=20%2F06%2F2026&tanggalAkhir=23%2F06%2F2026&norm=&nama=&reg=&billing=all&status=rj&id_poli_cari=4016&poli_cari=undefined', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('   URL:', page.url());

  // Wait for extension to inject
  await page.waitForTimeout(2000);

  // 3. Click RJ button
  console.log('3. Looking for ext-resume-float-btn...');
  const rjBtn = page.locator('#ext-resume-float-btn');
  try {
    await rjBtn.waitFor({ state: 'visible', timeout: 15000 });
    await rjBtn.click();
    console.log('   RJ button clicked');
  } catch (e) {
    console.log('   RJ button not found, checking DOM...');
    const buttons = await page.evaluate(() => 
      Array.from(document.querySelectorAll('button')).map(b => b.id || b.textContent?.trim()).filter(Boolean)
    );
    console.log('   Available buttons:', buttons);
    await browser.close();
    return;
  }

  // Wait for modal
  await page.waitForTimeout(3000);
  const modal = page.locator('.resume-modal');
  try {
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    console.log('   Modal opened');
  } catch (e) {
    console.log('   Modal not visible');
    // Try clicking RJ button again
    await rjBtn.click();
    await page.waitForTimeout(3000);
  }

  // Check if there are existing diagnoses
  const existingDiagnosa = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[name="nama[]"]')).map(i => i.value).filter(Boolean);
  });
  console.log('   Existing diagnoses:', existingDiagnosa.length);

  // 4. Test A: Save without changes to capture baseline
  console.log('\n4. TEST A — Save without changes...');
  const simpanBtn = modal.locator('button', { hasText: 'Simpan' });
  try {
    await simpanBtn.waitFor({ state: 'visible', timeout: 5000 });
    await simpanBtn.click();
    await page.waitForTimeout(3000);
  } catch (e) {
    console.log('   Simpan button not found');
  }

  if (capturedPayloads.length > 0) {
    console.log('\n=== PAYLOAD A (save without changes) ===');
    const dec = decodeURIComponent(capturedPayloads[0]);
    console.log(dec.substring(0, 1000));

    // Check counts
    const countKode10 = (dec.match(/kode10\[\]/g) || []).length;
    const countKode9 = (dec.match(/kode9\[\]/g) || []).length;
    const countIdicd = (dec.match(/idicd\[\]/g) || []).length;
    const countIdicdT = (dec.match(/idicdTindakan\[\]/g) || []).length;
    console.log(`\n   kode10[]: ${countKode10}, idicd[]: ${countIdicd}, kode9[]: ${countKode9}, idicdTindakan[]: ${countIdicdT}`);

    // Check for duplicate
    const countKProsedur = (dec.match(/kategoriProsedur\[\]/g) || []).length;
    const countKomorbid = (dec.match(/komorbid\[\]/g) || []).length;
    console.log(`   kategoriProsedur[]: ${countKProsedur}, komorbid[]: ${countKomorbid}`);

    if (countKode10 === countIdicd) {
      console.log('   ✅ Diagnosa indexes match');
    } else {
      console.log(`   ❌ Diagnosa indexes MISMATCH: kode10=${countKode10}, idicd=${countIdicd}`);
    }
    if (countKode9 === countIdicdT) {
      console.log('   ✅ Tindakan indexes match');
    } else {
      console.log(`   ❌ Tindakan indexes MISMATCH: kode9=${countKode9}, idicdT=${countIdicdT}`);
    }
    if (countKProsedur === countKode9) {
      console.log('   ✅ kategoriProsedur + komorbid indexes match');
    } else {
      console.log(`   ❌ kategoriProsedur/komorbid MISMATCH: kProsedur=${countKProsedur}, kode9=${countKode9}`);
    }
  } else {
    console.log('   No POST captured');
  }

  console.log('\n=== Test complete ===');
  await context.close();
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
