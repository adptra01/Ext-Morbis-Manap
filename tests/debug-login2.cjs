const BASE = 'http://103.147.236.140';
const fs = require('fs');

async function main() {
  // Try different login field combinations
  const attempts = [
    { username: 'mbi', password: 'maintenis', last_link: '' },
    { username: 'admin', password: 'admin', last_link: '' },
    { username: 'mbi', password: 'maintenis', last_link: '103.147.236.140:80/login/', login_button: 'Login' },
  ];

  for (const attempt of attempts) {
    console.log(`\n--- Attempt: ${JSON.stringify(attempt)} ---`);
    const postResp = await fetch(BASE + '/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      },
      body: new URLSearchParams(attempt).toString(),
      redirect: 'manual',
    });

    const sessionId = postResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
    console.log('Status:', postResp.status);
    console.log('Location:', postResp.headers.get('location'));
    console.log('Session:', sessionId);

    if (postResp.status >= 300 && postResp.status < 400) {
      const location = postResp.headers.get('location') || '';
      if (!location.includes('login')) {
        console.log('LOGIN SUCCESSFUL! Following redirect...');
        const redirectResp = await fetch(BASE + location, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
            'Cookie': `PHPSESSID=${sessionId}`,
          },
          redirect: 'manual',
        });
        const html = await redirectResp.text();
        console.log('Redirect status:', redirectResp.status);
        console.log('Redirect URL:', redirectResp.url);
        console.log('Title:', html.match(/<title>([^<]*)<\/title>/i)?.[1]);
        fs.writeFileSync(`login_success_${sessionId}.html`, html);
        console.log('Saved to login_success_.html');
      } else {
        console.log('Login failed - redirected to login page');
      }
    }
  }
}

main().catch(console.error);
