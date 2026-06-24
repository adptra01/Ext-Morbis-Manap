const BASE = 'http://103.147.236.140';
const fs = require('fs');

async function main() {
  // First GET to get initial session
  console.log('=== Step 1: GET login page to get PHP session ===');
  const getResp = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
    redirect: 'manual',
  });
  const sessionId = getResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
  console.log('Initial PHPSESSID:', sessionId);

  // POST using that session
  console.log('\n=== Step 2: POST login ===');
  const postResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId}`,
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'manual',
  });
  console.log('POST Status:', postResp.status);
  console.log('POST Location:', postResp.headers.get('location'));
  console.log('POST Set-Cookie:', postResp.headers.get('set-cookie'));

  // Check if redirect is to a non-login page
  const location = postResp.headers.get('location');
  if (location && !location.includes('login')) {
    console.log(`\nLOGIN SUCCESS! Following redirect to: ${location}`);
    const redirectResp = await fetch(BASE + location, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Cookie': `PHPSESSID=${sessionId}`,
      },
      redirect: 'manual',
    });
    const html = await redirectResp.text();
    console.log('Redirect status:', redirectResp.status);
    console.log('Redirect final URL:', redirectResp.url);
    console.log('Title:', html.match(/<title>([^<]*)<\/title>/i)?.[1]);
    fs.writeFileSync('login_success.html', html);
    console.log('Saved to login_success.html');
  } else if (location && location.includes('login')) {
    console.log('Login failed - redirected back to login page');
    // Get the login page to see the error
    const failResp = await fetch(BASE + location, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Cookie': `PHPSESSID=${sessionId}`,
      },
    });
    const failHtml = await failResp.text();
    // Look for error messages
    const alertMatch = failHtml.match(/<div[^>]*class="[^"]*alert[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (alertMatch) {
      console.log('Error alert:', alertMatch[1].replace(/<[^>]+>/g, '').trim());
    }
    // Look for any error-related text near the form
    const formMatch = failHtml.match(/<form[\s\S]*?<\/form>/i);
    if (formMatch) {
      const formText = formMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log('Form text:', formText);
    }
    fs.writeFileSync('login_failed.html', failHtml);
  } else {
    // No redirect - 302 without location or 200
    const body = await postResp.text();
    console.log('Response body (first 500):', body.substring(0, 500));
  }
}

main().catch(console.error);
