const fs = require('fs');
const BASE = 'http://103.147.236.140';

async function main() {
  // Check if server is even responding
  console.log('=== Server Health Check ===');
  
  // Check homepage
  try {
    const rootResp = await fetch(BASE + '/', {
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
      redirect: 'manual',
    });
    console.log('GET / Status:', rootResp.status);
    console.log('GET / Location:', rootResp.headers.get('location'));
    const rootText = await rootResp.text();
    console.log('GET / Title:', rootText.match(/<title>([^<]*)<\/title>/i)?.[1]);
    console.log('GET / Length:', rootText.length);
  } catch (e) {
    console.log('GET / FAILED:', e.message);
  }

  // Try accessing one of the test URLs directly
  const testUrls = [
    '/rekam-medik/resume-rawat-inap?id=8065&id_visit=156687',
    '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new?id_visit=156106&id=115257&page=6',
    '/admisi/detail-rawat-inap/edit-resume-ri?idVisit=157627&id=8094',
    '/admisi/detail-rawat-inap/pengkajian-awal-ri/igd?idVisit=157627',
  ];

  for (const url of testUrls) {
    try {
      const resp = await fetch(BASE + url, {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
        redirect: 'manual',
      });
      const text = await resp.text();
      const title = text.match(/<title>([^<]*)<\/title>/i)?.[1];
      const isLoginPage = title?.includes('Login');
      console.log(`\nGET ${url}`);
      console.log(`  Status: ${resp.status}`);
      console.log(`  Title: ${title}`);
      console.log(`  Is Login Page: ${isLoginPage}`);
      console.log(`  Length: ${text.length}`);
    } catch (e) {
      console.log(`\nGET ${url} FAILED: ${e.message}`);
    }
  }

  // Try POST login with curl-like simplicity
  console.log('\n=== Simple POST login attempt ===');
  const loginResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Origin': BASE,
      'Referer': BASE + '/login/',
    },
    body: 'username=mbi&password=maintenis&last_link=103.147.236.140%3A80%2Flogin%2F',
    redirect: 'manual',
  });

  console.log('Status:', loginResp.status);
  console.log('Location:', loginResp.headers.get('location'));
  const cookies = loginResp.headers.get('set-cookie');
  console.log('Set-Cookie:', cookies);

  if (loginResp.status >= 300 && loginResp.status < 400) {
    const loc = loginResp.headers.get('location');
    console.log('Redirect detected to:', loc);
    if (!loc.includes('login')) {
      console.log('*** LOGIN APPEARS SUCCESSFUL ***');
    }
  } else {
    const body = await loginResp.text();
    const alertMatch = body.match(/toastr\.error\([^)]+\)/i);
    if (alertMatch) {
      console.log('Error:', alertMatch[0]);
    }
  }

  // Try the MCP server Python httpx style - POST to /login
  console.log('\n=== httpx-style POST to /login ===');
  const loginResp2 = await fetch(BASE + '/login', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'manual',
  });
  
  console.log('Status:', loginResp2.status);
  console.log('Location:', loginResp2.headers.get('location'));
  console.log('Set-Cookie:', loginResp2.headers.get('set-cookie'));
  
  const loc2 = loginResp2.headers.get('location');
  if (loc2 && !loc2.includes('login')) {
    console.log('*** LOGIN SUCCESSFUL ***');
    // Save the session
    const sessionId = loginResp2.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
    console.log('Session:', sessionId);
    fs.writeFileSync('login_session.txt', sessionId || '');
  }
}

main().catch(console.error);
