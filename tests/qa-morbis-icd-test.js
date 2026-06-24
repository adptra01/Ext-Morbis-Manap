/**
 * Morbis HIS QA Automation Test — ICD Diagnosis & Procedure Field Testing
 *
 * Tests 4 URLs for ICD input fields, validation errors, and submission behavior.
 * Uses Node.js native fetch (v18+).
 */

const BASE_URL = 'http://103.147.236.140';
const CREDENTIALS = {
  username: 'mbi',
  password: 'maintenis',
};

const TEST_URLS = [
  {
    name: 'Resume Rawat Inap',
    url: '/rekam-medik/resume-rawat-inap?id=8065&id_visit=156687',
    id: 'url1',
  },
  {
    name: 'RM Rawat Jalan New',
    url: '/admisi/pelaksanaan_pelayanan/rm-rawat-jalan-new?id_visit=156106&id=115257&page=6',
    id: 'url2',
  },
  {
    name: 'Edit Resume RI',
    url: '/admisi/detail-rawat-inap/edit-resume-ri?idVisit=157627&id=8094',
    id: 'url3',
  },
  {
    name: 'Pengkajian Awal RI IGD',
    url: '/admisi/detail-rawat-inap/pengkajian-awal-ri/igd?idVisit=157627',
    id: 'url4',
  },
];

const DIAGNOSIS_KEYWORDS = [
  'diagnosis', 'icd', 'icd-10', 'icd10', 'icd_x',
  'diagnosa', 'diag', 'kode_diagnosis', 'kode_icd',
  'diagnosis_code', 'icd_code', 'icd_code_',
  'diagnosa_utama', 'diagnosa_sekunder', 'diagnosa_penyerta',
  'primary_diagnosis', 'secondary_diagnosis',
  'mdm_diagnosis', 'icd_diagnosis',
];

const PROCEDURE_KEYWORDS = [
  'tindakan', 'icd-9', 'icd9', 'icd_ix', 'icd_9',
  'procedure', 'action', 'prosedur', 'tind',
  'kode_tindakan', 'icd_action', 'icd_procedure',
  'procedure_code', 'action_code',
  'mdm_procedure', 'mdm_action',
  'tindakan_icd', 'icd_tindakan',
];

const SUBMIT_KEYWORDS = [
  'submit', 'save', 'simpan', 'update', 'store',
  'process', 'proses', 'daftar', 'register',
  'input_icd', 'tambah_icd', 'add_icd',
];

const FIELD_PATTERNS = [
  /<(?:input|select|textarea)[^>]*?(?:name|id)["'\s]*=[\"'\s]*([^\"'\s>]+)[^>]*?>/gi,
  /<(?:input|select|textarea)[^>]*?(?:name|id)\s*=\s*["']([^"']+)["'][^>]*?>/gi,
];

class MorbisQATester {
  constructor() {
    this.cookies = {};
    this.sessionId = null;
    this.results = [];
    this.errors = [];
  }

  getCookieString() {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  parseCookies(response) {
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    for (const header of setCookieHeaders) {
      const match = header.match(/^([^=]+)=([^;]+)/);
      if (match) {
        this.cookies[match[1]] = match[2];
        if (match[1] === 'PHPSESSID') {
          this.sessionId = match[2];
        }
      }
    }
  }

  async request(url, options = {}) {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...options.headers,
    };

    if (this.sessionId) {
      headers['Cookie'] = `PHPSESSID=${this.sessionId}`;
    }

    const fetchUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const response = await fetch(fetchUrl, {
      ...options,
      headers,
      redirect: 'manual',
    });

    this.parseCookies(response);
    return response;
  }

  async login() {
    console.log(`\n🔑 Logging in as ${CREDENTIALS.username}...`);
    const response = await this.request('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(CREDENTIALS).toString(),
    });

    const isRedirect = response.status >= 301 && response.status <= 303;
    const location = response.headers.get('location') || '';

    if (isRedirect && !location.toLowerCase().includes('login')) {
      console.log(`  ✅ Login successful (redirected to: ${location})`);
      console.log(`  🍪 PHPSESSID: ${this.sessionId}`);
      return true;
    }

    if (response.status === 200) {
      const text = await response.text();
      if (!text.toLowerCase().includes('login')) {
        console.log(`  ✅ Login successful (no redirect to login)`);
        console.log(`  🍪 PHPSESSID: ${this.sessionId}`);
        return true;
      }
    }

    console.log(`  ❌ Login failed (status: ${response.status})`);
    return false;
  }

  extractInputFields(html) {
    const fields = [];
    const inputRegex = /<input[^>]*?>/gi;
    const selectRegex = /<select[^>]*?>/gi;
    const textareaRegex = /<textarea[^>]*?>/gi;
    const labelRegex = /<label[^>]*?>([\s\S]*?)<\/label>/gi;
    const allElements = [];

    let match;
    for (const regex of [inputRegex, selectRegex, textareaRegex]) {
      regex.lastIndex = 0;
      while ((match = regex.exec(html)) !== null) {
        allElements.push(match[0]);
      }
    }

    const labels = [];
    let lMatch;
    while ((lMatch = labelRegex.exec(html)) !== null) {
      labels.push(lMatch[1].replace(/<[^>]+>/g, '').trim().toLowerCase());
    }

    for (const el of allElements) {
      const nameMatch = el.match(/name\s*=\s*["']([^"']+)["']/i);
      const idMatch = el.match(/id\s*=\s*["']([^"']+)["']/i);
      const typeMatch = el.match(/type\s*=\s*["']([^"']+)["']/i);
      const valueMatch = el.match(/value\s*=\s*["']([^"']*)["']/i);
      const classMatch = el.match(/class\s*=\s*["']([^"']+)["']/i);

      fields.push({
        html: el.substring(0, 200),
        name: nameMatch ? nameMatch[1].toLowerCase() : null,
        id: idMatch ? idMatch[1].toLowerCase() : null,
        type: typeMatch ? typeMatch[1].toLowerCase() : 'text',
        value: valueMatch ? valueMatch[1] : null,
        class: classMatch ? classMatch[1] : null,
      });
    }

    return { fields, labels };
  }

  matchFieldType(field, labels, keywords) {
    const name = field.name || '';
    const id = field.id || '';
    const cls = field.class || '';

    for (const kw of keywords) {
      if (name.includes(kw)) return { matched: true, match: kw, source: 'name' };
      if (id.includes(kw)) return { matched: true, match: kw, source: 'id' };
      if (cls && cls.includes(kw)) return { matched: true, match: kw, source: 'class' };
    }

    for (const label of labels) {
      for (const kw of keywords) {
        if (label.includes(kw)) return { matched: true, match: kw, source: 'label' };
      }
    }

    return { matched: false };
  }

  findICDFields(html) {
    const { fields, labels } = this.extractInputFields(html);

    const diagnosisFields = [];
    const procedureFields = [];

    for (const field of fields) {
      const dMatch = this.matchFieldType(field, labels, DIAGNOSIS_KEYWORDS);
      if (dMatch.matched) {
        diagnosisFields.push({ field, matchDetail: dMatch });
      }

      const pMatch = this.matchFieldType(field, labels, PROCEDURE_KEYWORDS);
      if (pMatch.matched) {
        procedureFields.push({ field, matchDetail: pMatch });
      }
    }

    return { diagnosisFields, procedureFields, allFields: fields };
  }

  async testSubmission(url, field, fieldType, html) {
    const formRegex = /<form[^>]*?>/gi;
    const forms = [];
    let m;
    while ((m = formRegex.exec(html)) !== null) {
      forms.push({ tag: m[0], position: m.index });
    }

    const name = field.name || field.id;
    const value = `TEST_QA_${Date.now()}`;

    let formAction = null;
    for (const form of forms) {
      const actionMatch = form.tag.match(/action\s*=\s*["']([^"']+)["']/i);
      if (actionMatch) {
        formAction = actionMatch[1];
      }
    }

    if (!formAction) {
      formAction = url;
    }

    const submitUrl = formAction.startsWith('http')
      ? formAction
      : formAction.startsWith('/')
        ? `${BASE_URL}${formAction}`
        : `${BASE_URL}/${formAction}`;

    const formData = new URLSearchParams();
    formData.append(name, value);

    try {
      const response = await this.request(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Testing': 'qa-automation',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      const responsePreview = responseText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);

      const hasError =
        this.containsError(responseText) ||
        response.status >= 400;

      return {
        status: response.status,
        hasError,
        responsePreview,
        formAction,
        submittedData: { [name]: value },
      };
    } catch (err) {
      return {
        status: 0,
        hasError: true,
        responsePreview: `EXCEPTION: ${err.message}`,
        formAction,
        submittedData: { [name]: value },
      };
    }
  }

  containsError(text) {
    const errorIndicators = [
      'error', 'warning', 'notice', 'fatal', 'exception',
      'stack trace', 'call stack', 'undefined variable',
      'tidak ditemukan', 'gagal', 'kesalahan',
      'internal server error', '500', 'error!',
      'invalid', 'validation', 'required field',
      'data tidak valid', 'syntax error',
      'unexpected', 'cannot', 'unable',
      'query error', 'database error',
      'sql', 'mysql_fetch', 'mysql_error',
      'parseerror', 'null reference',
    ];
    const lower = text.toLowerCase();
    return errorIndicators.some((ind) => lower.includes(ind));
  }

  extractTableData(html) {
    const tables = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let tMatch;
    while ((tMatch = tableRegex.exec(html)) !== null) {
      const rows = [];
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let rMatch;
      while ((rMatch = rowRegex.exec(tMatch[1])) !== null) {
        const cells = [];
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        let cMatch;
        while ((cMatch = cellRegex.exec(rMatch[1])) !== null) {
          cells.push(cMatch[1].replace(/<[^>]+>/g, '').trim());
        }
        if (cells.length > 0) rows.push(cells);
      }
      if (rows.length > 0) tables.push(rows);
    }
    return tables;
  }

  formatUrlResult(result) {
    let output = `\n${'='.repeat(72)}\n`;
    output += `📍 TEST: ${result.name}\n`;
    output += `   URL: ${result.url}\n`;
    output += `   Load: ${result.loaded ? '✅ SUCCESS' : '❌ FAILED'} (HTTP ${result.statusCode})\n`;
    output += `   Redirected to login: ${result.redirectedToLogin ? '⚠️ YES' : '✅ No'}\n`;

    if (result.loaded) {
      output += `   Page Title: ${result.pageTitle}\n`;
      output += `   Content Length: ${result.contentLength} bytes\n`;

      output += `\n   🔍 ICD Diagnosis Fields: ${result.diagnosisFields.length > 0 ? result.diagnosisFields.length : '⚠️ NONE FOUND'}\n`;
      if (result.diagnosisFields.length > 0) {
        for (const df of result.diagnosisFields) {
          output += `      - name="${df.field.name}", id="${df.field.id}", type="${df.field.type}" (match: ${df.matchDetail.source}:"${df.matchDetail.match}")\n`;
        }
      }

      output += `   🔍 ICD Procedure/Action Fields: ${result.procedureFields.length > 0 ? result.procedureFields.length : '⚠️ NONE FOUND'}\n`;
      if (result.procedureFields.length > 0) {
        for (const pf of result.procedureFields) {
          output += `      - name="${pf.field.name}", id="${pf.field.id}", type="${pf.field.type}" (match: ${pf.matchDetail.source}:"${pf.matchDetail.match}")\n`;
        }
      }

      if (result.submitErrors.length > 0) {
        output += `\n   ❌ SUBMISSION ERRORS (${result.submitErrors.length}):\n`;
        for (const se of result.submitErrors) {
          output += `      • Field: ${se.fieldName}\n`;
          output += `        Type: ${se.fieldType}\n`;
          output += `        Status: HTTP ${se.status}\n`;
          output += `        Response: ${se.responsePreview}\n`;
        }
      }

      if (result.phpErrors.length > 0) {
        output += `\n   ⚠️ PHP ERRORS FOUND (${result.phpErrors.length}):\n`;
        for (const pe of result.phpErrors) {
          output += `      • ${pe}\n`;
        }
      }
    }

    output += `\n${'='.repeat(72)}\n`;
    return output;
  }

  async testUrl(testCase) {
    console.log(`\n📍 Testing: ${testCase.name}`);
    console.log(`   ${BASE_URL}${testCase.url}`);

    const result = {
      name: testCase.name,
      url: `${BASE_URL}${testCase.url}`,
      loaded: false,
      statusCode: null,
      redirectedToLogin: false,
      pageTitle: '',
      contentLength: 0,
      diagnosisFields: [],
      procedureFields: [],
      allFields: [],
      tables: [],
      phpErrors: [],
      submitErrors: [],
      rawHtml: '',
    };

    try {
      const response = await this.request(testCase.url);
      result.statusCode = response.status;

      if (response.status >= 301 && response.status <= 303) {
        const location = response.headers.get('location') || '';
        result.redirectedToLogin = location.toLowerCase().includes('login');
        result.loaded = false;

        if (result.redirectedToLogin) {
          result.errorMsg = `Redirected to login page: ${location}`;
        }
        return result;
      }

      const html = await response.text();
      result.rawHtml = html.substring(0, 50000);
      result.contentLength = html.length;

      if (response.status === 200 && !html.toLowerCase().includes('login')) {
        result.loaded = true;
      } else if (html.toLowerCase().includes('login')) {
        result.redirectedToLogin = true;
        return result;
      }

      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      result.pageTitle = titleMatch ? titleMatch[1].trim() : '(no title)';

      const icdResult = this.findICDFields(html);
      result.diagnosisFields = icdResult.diagnosisFields;
      result.procedureFields = icdResult.procedureFields;
      result.allFields = icdResult.allFields;

      result.tables = this.extractTableData(html);

      const phpErrors = this.extractPhpErrors(html);
      result.phpErrors = phpErrors;

      const fieldsToTest = [
        ...result.diagnosisFields.map((f) => ({ field: f.field, type: 'diagnosis' })),
        ...result.procedureFields.map((f) => ({ field: f.field, type: 'procedure' })),
      ];

      if (fieldsToTest.length > 0) {
        for (const ft of fieldsToTest) {
          const subResult = await this.testSubmission(
            testCase.url,
            ft.field,
            ft.type,
            html
          );
          if (subResult.hasError || subResult.status >= 400) {
            result.submitErrors.push({
              fieldName: ft.field.name || ft.field.id || '(unknown)',
              fieldType: ft.type,
              status: subResult.status,
              responsePreview: subResult.responsePreview,
              formAction: subResult.formAction,
            });
          }
          console.log(
            `   ${subResult.hasError ? '❌' : '✅'} Submit ${ft.type} field "${ft.field.name || ft.field.id}": HTTP ${subResult.status}${subResult.hasError ? ' (has error)' : ''}`
          );
        }
      }

      this.results.push(result);
    } catch (err) {
      result.loaded = false;
      result.errorMsg = err.message;
      this.results.push(result);
    }

    return result;
  }

  extractPhpErrors(html) {
    const errors = [];
    const patterns = [
      /(Notice|Warning|Fatal error|Parse error|Error):\s*[^<]+/gi,
      /(Undefined variable|Undefined index|Undefined offset)[^<]*/gi,
      /(Call to undefined|Cannot redeclare|Cannot use)[^<]*/gi,
      /(mysql_error|mysqli_error|PDOException)[^<]*/gi,
      /(Stack trace)[^<]*(?:<br\s*\/?>|\n)[^<]*/gi,
    ];

    for (const pattern of patterns) {
      let m;
      while ((m = pattern.exec(html)) !== null) {
        errors.push(m[0].trim().substring(0, 200));
      }
    }
    return [...new Set(errors)];
  }

  async run() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║    Morbis HIS QA Automation - ICD Field Testing             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    const loggedIn = await this.login();
    if (!loggedIn) {
      console.error('❌ Cannot proceed without login. Aborting.');
      return;
    }

    for (const testCase of TEST_URLS) {
      const result = await this.testUrl(testCase);
      console.log(this.formatUrlResult(result));
    }

    this.generateReport();
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: {
        baseUrl: BASE_URL,
        username: CREDENTIALS.username,
      },
      summary: {
        totalUrls: TEST_URLS.length,
        loadedSuccessfully: this.results.filter((r) => r.loaded).length,
        failedToLoad: this.results.filter((r) => !r.loaded).length,
        totalDiagnosisFields: this.results.reduce((s, r) => s + r.diagnosisFields.length, 0),
        totalProcedureFields: this.results.reduce((s, r) => s + r.procedureFields.length, 0),
        totalSubmitErrors: this.results.reduce((s, r) => s + r.submitErrors.length, 0),
        totalPhpErrors: this.results.reduce((s, r) => s + r.phpErrors.length, 0),
      },
      urlResults: this.results.map((r) => ({
        name: r.name,
        url: r.url,
        loaded: r.loaded,
        statusCode: r.statusCode,
        redirectedToLogin: r.redirectedToLogin,
        pageTitle: r.pageTitle,
        diagnosisFieldCount: r.diagnosisFields.length,
        procedureFieldCount: r.procedureFields.length,
        diagnosisFields: r.diagnosisFields.map((f) => ({
          name: f.field.name,
          id: f.field.id,
          type: f.field.type,
          matchSource: f.matchDetail.source,
          matchKeyword: f.matchDetail.match,
        })),
        procedureFields: r.procedureFields.map((f) => ({
          name: f.field.name,
          id: f.field.id,
          type: f.field.type,
          matchSource: f.matchDetail.source,
          matchKeyword: f.matchDetail.match,
        })),
        submitErrors: r.submitErrors,
        phpErrors: r.phpErrors,
        errorMsg: r.errorMsg || null,
      })),
    };

    const reportJson = JSON.stringify(report, null, 2);
    require('fs').writeFileSync('qa-test-report.json', reportJson);
    console.log('📄 JSON Report saved to qa-test-report.json');

    const mdReport = this.generateMarkdownReport(report);
    require('fs').writeFileSync('qa-test-report.md', mdReport);
    console.log('📄 Markdown Report saved to qa-test-report.md');

    console.log(mdReport);
  }

  generateMarkdownReport(report) {
    const s = report.summary;
    let md = `# Morbis HIS QA Test Report — ICD Diagnosis & Procedure Fields

**Date:** ${report.timestamp}  
**Environment:** ${report.environment.baseUrl}  
**User:** ${report.environment.username}

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total URLs Tested | ${s.totalUrls} |
| Loaded Successfully | ${s.loadedSuccessfully} |
| Failed to Load | ${s.failedToLoad} |
| Total ICD Diagnosis Fields Found | ${s.totalDiagnosisFields} |
| Total ICD Procedure/Action Fields Found | ${s.totalProcedureFields} |
| Total Submission Errors | ${s.totalSubmitErrors} |
| Total PHP Errors/Notices | ${s.totalPhpErrors} |

---

## Detailed Results

`;

    for (const urlResult of report.urlResults) {
      md += `### ${urlResult.loaded ? '✅' : '❌'} ${urlResult.name}\n\n`;
      md += `**URL:** \`${urlResult.url}\`  \n`;
      md += `**Status:** HTTP ${urlResult.statusCode}  \n`;
      md += `**Page Title:** ${urlResult.pageTitle || 'N/A'}  \n`;
      md += `**Loaded:** ${urlResult.loaded ? 'Yes' : 'No'}  \n`;
      md += `**Redirected to Login:** ${urlResult.redirectedToLogin ? '⚠️ Yes' : 'No'}  \n`;

      if (urlResult.errorMsg) {
        md += `**Error:** ${urlResult.errorMsg}  \n`;
      }

      md += '\n';

      // Diagnosis Fields
      md += `#### 🔍 ICD Diagnosis Fields Found: ${urlResult.diagnosisFieldCount}\n\n`;
      if (urlResult.diagnosisFields.length > 0) {
        md += `| # | Field Name | Field ID | Type | Match |\n`;
        md += `|---|-----------|---------|------|-------|\n`;
        urlResult.diagnosisFields.forEach((f, i) => {
          md += `| ${i + 1} | \`${f.name || '-'}\` | \`${f.id || '-'}\` | ${f.type} | ${f.matchSource}:"${f.matchKeyword}" |\n`;
        });
      } else {
        md += `⚠️ **No ICD Diagnosis fields detected on this page.**\n\n`;
      }
      md += '\n';

      // Procedure Fields
      md += `#### 🔍 ICD Procedure/Action Fields Found: ${urlResult.procedureFieldCount}\n\n`;
      if (urlResult.procedureFields.length > 0) {
        md += `| # | Field Name | Field ID | Type | Match |\n`;
        md += `|---|-----------|---------|------|-------|\n`;
        urlResult.procedureFields.forEach((f, i) => {
          md += `| ${i + 1} | \`${f.name || '-'}\` | \`${f.id || '-'}\` | ${f.type} | ${f.matchSource}:"${f.matchKeyword}" |\n`;
        });
      } else {
        md += `⚠️ **No ICD Procedure/Action fields detected on this page.**\n\n`;
      }
      md += '\n';

      // Submission Errors
      if (urlResult.submitErrors.length > 0) {
        md += `#### ❌ Submission Errors: ${urlResult.submitErrors.length}\n\n`;
        md += `| # | Field Name | Field Type | HTTP Status | Error Preview |\n`;
        md += `|---|-----------|-----------|------------|--------------|\n`;
        urlResult.submitErrors.forEach((e, i) => {
          md += `| ${i + 1} | \`${e.fieldName}\` | ${e.fieldType} | ${e.status} | \`${e.responsePreview.substring(0, 100)}\` |\n`;
        });
        md += '\n';
      }

      // PHP Errors
      if (urlResult.phpErrors.length > 0) {
        md += `#### ⚠️ PHP Errors/Notices: ${urlResult.phpErrors.length}\n\n`;
        urlResult.phpErrors.forEach((e, i) => {
          md += `${i + 1}. \`${e}\`\n`;
        });
        md += '\n';
      }

      md += `---\n\n`;
    }

    // Conclusion
    md += `## Conclusion\n\n`;

    const totalBugs = s.totalSubmitErrors + s.totalPhpErrors;
    if (totalBugs > 0) {
      md += `**${totalBugs} issue(s)** detected during ICD Diagnosis & Procedure field testing:\n\n`;
      md += `- **${s.totalSubmitErrors} submission error(s)** — fields that returned errors when submitting test data\n`;
      md += `- **${s.totalPhpErrors} PHP error(s)/notice(s)** — backend errors visible in page output\n`;
      md += `- **${s.totalDiagnosisFields} diagnosis field(s)** identified across all URLs\n`;
      md += `- **${s.totalProcedureFields} procedure field(s)** identified across all URLs\n\n`;
      if (s.failedToLoad > 0) {
        md += `- **${s.failedToLoad} URL(s) failed to load** — may indicate expired session, wrong parameters, or server issues\n`;
      }
    } else {
      md += `**No issues detected.** All ICD fields loaded and submitted without errors.\n`;
    }

    return md;
  }
}

const tester = new MorbisQATester();
tester
  .run()
  .then(() => {
    console.log('\n✅ QA testing complete.');
    console.log('📄 Reports: qa-test-report.json, qa-test-report.md');
  })
  .catch((err) => {
    console.error('❌ QA testing failed:', err);
  });
