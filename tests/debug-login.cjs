const BASE = 'http://103.147.236.140';
const fs = require('fs');

async function main() {
  // Step 1: Get login page and extract form fields
  const loginPage = await fetch(BASE + '/login/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    },
  });
  const loginHtml = await loginPage.text();
  console.log('=== LOGIN PAGE ===');
  console.log('Status:', loginPage.status);
  console.log('Set-Cookie from GET:', loginPage.headers.get('set-cookie'));
  
  // Find form action
  const actionMatch = loginHtml.match(/<form[^>]+action=["']([^"']*)["'][^>]*>/i);
  if (actionMatch) {
    console.log('Form action:', actionMatch[1]);
  }

  // Find all input fields with their attributes
  const inputMatches = loginHtml.matchAll(/<input[^>]*>/gi);
  const inputs = [];
  for (const m of inputMatches) {
    const nameM = m[0].match(/name\s*=\s*["']([^"']+)["']/i);
    const typeM = m[0].match(/type\s*=\s*["']([^"']+)["']/i);
    const idM = m[0].match(/id\s*=\s*["']([^"']+)["']/i);
    const placeholderM = m[0].match(/placeholder\s*=\s*["']([^"']+)["']/i);
    inputs.push({
      name: nameM ? nameM[1] : null,
      type: typeM ? typeM[1] : null,
      id: idM ? idM[1] : null,
      placeholder: placeholderM ? placeholderM[1] : null,
      full: m[0].substring(0, 150),
    });
  }

  console.log('\nInput fields:');
  inputs.forEach((inp, i) => {
    console.log(`  ${i+1}. name="${inp.name}" type="${inp.type}" id="${inp.id}" placeholder="${inp.placeholder}"`);
  });

  // Look for CSRF token
  const csrfMatch = loginHtml.match(/<input[^>]*name=["'](_token|csrf_token|_csrf_token)["'][^>]*value=["']([^"']+)["']/i);
  if (csrfMatch) {
    console.log(`\nCSRF token found: name="${csrfMatch[1]}", value="${csrfMatch[2].substring(0, 30)}..."`);
  }

  // Also check for hidden inputs with CSRF-like names
  const hiddenInputs = loginHtml.matchAll(/<input[^>]*type=["']hidden["'][^>]*>/gi);
  for (const m of hiddenInputs) {
    const nameM = m[0].match(/name\s*=\s*["']([^"']+)["']/i);
    const valueM = m[0].match(/value\s*=\s*["']([^"']*)["']/i);
    if (nameM) {
      console.log(`  Hidden: name="${nameM[1]}" value="${valueM ? valueM[1].substring(0, 30) : 'N/A'}"`);
    }
  }

  // Save for inspection
  fs.writeFileSync('login_page.html', loginHtml);
  console.log('\nSaved full login page to login_page.html');
}

main().catch(console.error);
