const fs = require('fs');
const BASE = 'http://103.147.236.140';

async function main() {
  // Approach 1: Get session, then POST with follow_redirects
  console.log('=== Approach 1: GET → POST (follow_redirects=true) ===');
  const getResp = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const sessionId = getResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
  console.log('Initial session:', sessionId);

  // POST with redirect following
  const postResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Cookie': `PHPSESSID=${sessionId}`,
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'follow',
  });
  console.log('Final URL after POST:', postResp.url);
  console.log('Status:', postResp.status);
  console.log('Title:', (await postResp.text()).match(/<title>([^<]*)<\/title>/i)?.[1]);

  // Approach 2: Try posting to /login with trailing slash + last_link
  console.log('\n=== Approach 2: POST with last_link and login_button ===');
  const getResp2 = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
    },
  });
  const sessionId2 = getResp2.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
  console.log('Session:', sessionId2);

  const params = new URLSearchParams();
  params.append('username', 'mbi');
  params.append('password', 'maintenis');
  params.append('last_link', '');

  const postResp2 = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId2}`,
    },
    body: params.toString(),
    redirect: 'follow',
  });
  console.log('Final URL:', postResp2.url);
  console.log('Status:', postResp2.status);
  const html2 = await postResp2.text();
  console.log('Title:', html2.match(/<title>([^<]*)<\/title>/i)?.[1]);

  const alertMatch2 = html2.match(/<div[^>]*id="hidealert"[^>]*>([\s\S]*?)<\/div>/i);
  if (alertMatch2) {
    const clean = alertMatch2[1].replace(/<[^>]+>/g, '').trim();
    console.log('Error:', clean.substring(0, 200));
  }

  // Approach 3: Check if maybe the MCP server code works - POST to /login
  console.log('\n=== Approach 3: MCP server style - POST /login no redirect ===');
  const getResp3 = await fetch(BASE + '/login/', {
    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
  });
  const sessionId3 = getResp3.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];

  const postResp3 = await fetch(BASE + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId3}`,
    },
    body: 'username=mbi&password=maintenis',
    redirect: 'manual',
  });
  console.log('Status:', postResp3.status);
  console.log('Location:', postResp3.headers.get('location'));
  const loc3 = postResp3.headers.get('location');
  
  if (loc3 && !loc3.includes('login')) {
    console.log('LOGIN SUCCESS!');
    const succResp = await fetch((loc3.startsWith('http') ? '' : BASE) + loc3, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0',
        'Cookie': `PHPSESSID=${sessionId3}`,
      },
    });
    console.log('Dashboard title:', (await succResp.text()).match(/<title>([^<]*)<\/title>/i)?.[1]);
  }

  // Approach 4: Check if login requires the correct last_link value
  console.log('\n=== Approach 4: POST with correct last_link ===');
  const getResp4 = await fetch(BASE + '/login/', {
    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
  });
  const sessionId4 = getResp4.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];

  const params4 = new URLSearchParams();
  params4.append('username', 'mbi');
  params4.append('password', 'maintenis');
  params4.append('last_link', '103.147.236.140:80/login/');

  const postResp4 = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Cookie': `PHPSESSID=${sessionId4}`,
    },
    body: params4.toString(),
    redirect: 'manual',
  });
  console.log('Status:', postResp4.status);
  console.log('Location:', postResp4.headers.get('location'));
  
  const html4 = await postResp4.text();
  const alertMatch4 = html4.match(/<div[^>]*id="hidealert"[^>]*>([\s\S]*?)<\/div>/i);
  if (alertMatch4) {
    const clean = alertMatch4[1].replace(/<[^>]+>/g, '').trim();
    console.log('Error:', clean.substring(0, 200));
  }

  // Try following the redirect
  const loc4 = postResp4.headers.get('location');
  if (loc4) {
    const followResp = await fetch(BASE + loc4, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0',
        'Cookie': `PHPSESSID=${sessionId4}`,
      },
    });
    const followHtml = await followResp.text();
    console.log('Follow URL:', followResp.url);
    console.log('Follow title:', followHtml.match(/<title>([^<]*)<\/title>/i)?.[1]);
  }
}

main().catch(console.error);
