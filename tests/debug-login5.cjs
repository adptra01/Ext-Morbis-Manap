const fs = require('fs');
const BASE = 'http://103.147.236.140';

async function main() {
  const freshResp = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
  });
  const sessionId = freshResp.headers.get('set-cookie')?.match(/PHPSESSID=([^;]+)/)?.[1];
  console.log('Session:', sessionId);

  const body = new URLSearchParams();
  body.append('username', 'mbi');
  body.append('password', 'maintenis');
  body.append('last_link', '');
  body.append('login_button', '');

  const postResp = await fetch(BASE + '/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      'Cookie': 'PHPSESSID=' + sessionId,
    },
    body: body.toString(),
    redirect: 'manual',
  });

  console.log('POST Status:', postResp.status);
  console.log('POST Location:', postResp.headers.get('location'));
  const newSession = postResp.headers.get('set-cookie');
  console.log('New Set-Cookie:', newSession);

  const text = await postResp.text();
  const effectiveSession = newSession?.match(/PHPSESSID=([^;]+)/)?.[1] || sessionId;

  // Check the hidealert div
  const alertMatch = text.match(/<div[^>]*id="hidealert"[^>]*>([\s\S]*?)<\/div>/i);
  if (alertMatch) {
    const clean = alertMatch[1].replace(/<[^>]+>/g, '').trim();
    console.log('Hidealert content:', JSON.stringify(clean));
  }

  // Check for toastr notifications
  const toastMatch = text.match(/toastr\.(error|success|warning|info)\([^)]+\)/gi);
  if (toastMatch) {
    console.log('Toastr notifications:', toastMatch);
  }

  const location = postResp.headers.get('location');
  if (location && !location.includes('login')) {
    console.log('LOGIN SUCCESS!');
    const succResp = await fetch(BASE + location, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0',
        'Cookie': 'PHPSESSID=' + effectiveSession,
      },
    });
    const succHtml = await succResp.text();
    console.log('Final title:', succHtml.match(/<title>([^<]*)<\/title>/i)?.[1]);
    fs.writeFileSync('post_login_result.html', succHtml);
  } else {
    console.log('Login FAILED');
    // Check the PHP session variables - maybe we need to check what the server expects
    // Let's look at what's in the response body near the form
    const formMatch = text.match(/<form[\s\S]*?<\/form>/i);
    if (formMatch) {
      const formText = formMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log('Form text:', formText);
    }
    fs.writeFileSync('post_login_failed.html', text);
    console.log('Saved post_login_failed.html');
  }

  // Check if maybe there's a captcha or additional field
  const captchaMatch = text.match(/captcha|recaptcha|g-recaptcha/i);
  if (captchaMatch) {
    console.log('CAPTCHA FOUND!');
  }
}

main().catch(console.error);
