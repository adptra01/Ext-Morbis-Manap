const fs = require('fs');
const BASE = 'http://103.147.236.140';

async function main() {
  // First get a session and extract JS logic
  const loginResp = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
  });
  const html = await loginResp.text();
  const sessionId = loginResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
  console.log('Session:', sessionId);

  // Save for manual inspection
  fs.writeFileSync('login_page_full.html', html);

  // Extract external JS files
  const scriptSrcRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = scriptSrcRegex.exec(html)) !== null) {
    console.log('External script:', m[1]);
  }

  // Try to fetch login.js or main.js to see login logic
  const jsFiles = [
    '/assets/login/js/main.js',
    '/assets/js/login.js',
    '/assets/js/toastr.min.js',
  ];

  for (const jsFile of jsFiles) {
    try {
      const jsResp = await fetch(BASE + jsFile, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
      });
      if (jsResp.ok) {
        const jsContent = await jsResp.text();
        if (jsContent.toLowerCase().includes('login') || jsContent.toLowerCase().includes('submit') || jsContent.toLowerCase().includes('ajax')) {
          console.log(`\n=== ${jsFile} (relevant) ===`);
          console.log(jsContent.substring(0, 2000));
        } else {
          console.log(`\n=== ${jsFile} (no login logic, first 200) ===`);
          console.log(jsContent.substring(0, 200));
        }
      }
    } catch (e) {
      console.log(`Cannot fetch ${jsFile}: ${e.message}`);
    }
  }

  // Try a more careful POST
  console.log('\n=== Trying POST with minimal fields ===');
  const postResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': `PHPSESSID=${sessionId}`,
      'Origin': BASE,
      'Referer': BASE + '/login/',
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'manual',
  });

  const body = await postResp.text();
  console.log('POST status:', postResp.status);
  console.log('Has login title:', body.includes('<title>Morbis | Login</title>'));

  // Check for error
  const alertMatch = body.match(/<div[^>]*id="hidealert"[^>]*>([\s\S]*?)<\/div>/i);
  if (alertMatch) {
    const clean = alertMatch[1].replace(/<[^>]+>/g, '').trim();
    console.log('hidealert:', JSON.stringify(clean));
  }

  // Check for any alert/error in the body
  const dangerAlerts = body.match(/<div[^>]*class="[^"]*alert[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
  if (dangerAlerts) {
    for (const alert of dangerAlerts) {
      const clean = alert.replace(/<[^>]+>/g, '').trim();
      if (clean && !clean.includes('New Relic')) {
        console.log('Alert found:', clean);
      }
    }
  }

  // Try with one more variation - maybe POST to /login instead of /login/
  console.log('\n=== Trying POST to /login (no trailing slash) ===');
  const postResp2 = await fetch(BASE + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId}`,
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'manual',
  });
  console.log('POST2 status:', postResp2.status);
  console.log('POST2 location:', postResp2.headers.get('location'));
  const body2 = await postResp2.text();
  console.log('POST2 title:', body2.match(/<title>([^<]*)<\/title>/i)?.[1]);
}

main().catch(console.error);
