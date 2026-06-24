const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const extensionPath = path.resolve(__dirname, '..', 'dist');
  console.log('Loading extension from:', extensionPath);
  
  const browserContext = await chromium.launchPersistentContext('', {
    // headless: false is normally required for extensions, but let's see if it works.
    headless: false, 
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  const page = await browserContext.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR] Name: ${err.name}, Message: ${err.message}`);
    console.log(`[BROWSER ERROR STACK] ${err.stack}`);
  });

  console.log('Navigating to login page...');
  await page.goto('http://103.147.236.140/login/');
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Fill login form
  console.log('Filling login form...');
  await page.fill('#username', 'mbi');
  await page.fill('input[type="password"]', 'maintenis');
  
  // Take screenshot before login
  await page.screenshot({ path: 'login-before.png' });
  
  // Click login
  console.log('Clicking login button...');
  await Promise.all([
    page.waitForNavigation(),
    page.click('.login100-form-btn')
  ]);
  
  console.log('URL after login:', page.url());
  await page.screenshot({ path: 'login-after.png' });
  
  // Check if we are logged in or if there is an error
  const title = await page.title();
  console.log('Page title after login:', title);
  
  // Now navigate to the consultation page
  console.log('Navigating to consultation page...');
  await page.goto('http://103.147.236.140/admisi/pengajuan_konsultasi/konsultasi/?poli_unit=4344&dokter=&id_dokter=&noRm=&pasien=');
  await page.waitForLoadState('networkidle');
  
  console.log('Consultation page URL:', page.url());
  await page.screenshot({ path: 'consultation-page.png' });
  
  // Check if there are any tables loaded
  const tables = await page.$$eval('table', els => els.map(el => ({
    className: el.className,
    id: el.id,
    parentClass: el.parentElement.className,
    parentId: el.parentElement.id,
    rowsCount: el.rows.length
  })));
  console.log('Tables found on page:', tables);

  // Click search button if it exists to load tables
  const searchBtn = await page.$('#search');
  if (searchBtn) {
    console.log('Clicking Cari button...');
    await searchBtn.click();
    await page.waitForTimeout(4000); // wait for AJAX
    await page.screenshot({ path: 'after-search.png' });
    
    // Check tables again after search
    const tablesAfter = await page.$$eval('table', els => els.map(el => ({
      className: el.className,
      id: el.id,
      parentClass: el.parentElement.className,
      parentId: el.parentElement.id,
      rowsCount: el.rows.length
    })));
    console.log('Tables found after search:', tablesAfter);
  }
  
  await browserContext.close();
}

main().catch(console.error);
