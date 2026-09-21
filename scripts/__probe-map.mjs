import { chromium } from 'playwright';
const EXE = 'C:/Users/adptra01/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe';
const b = await chromium.launch({ headless: true, executablePath: EXE });
const p = await b.newPage();
await p.goto('http://103.147.236.140/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1500);
await p.locator('#username').fill('irfan');
await p.locator('input[name=password]').fill('1234');
await p.locator('button[name=login_button]').click();
await p.waitForTimeout(3000);

async function scrapeList(label, url) {
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForTimeout(2500);
  const rows = await p.evaluate((label) => {
    const out = [];
    document.querySelectorAll('table tbody tr').forEach((tr) => {
      const aksi = tr.querySelector('td:last-child');
      if (
        !aksi ||
        !/edit_tanggal|cetakFormPermintaanLab|editFormPermintaanLab/.test(aksi.innerHTML)
      )
        return;
      const cells = [...tr.querySelectorAll('td')].map((td) =>
        td.textContent.trim().replace(/\s+/g, ' '),
      );
      const nolab = aksi.querySelector('.cetak_hasil')?.getAttribute('nolab') || '';
      out.push({
        nolab,
        text: cells.slice(0, 4).join(' | ').slice(0, 90),
        rowHtml: tr.outerHTML,
      });
    });
    return out;
  });
  console.log(`\n===== ${label} rows=${rows.length}`);
  for (const r of rows) {
    const m = r.rowHtml.match(
      /edit_tanggal\([^)]*\)|cetakFormPermintaanLab\([^)]*\)|editFormPermintaanLab\([^)]*\)|class="[^"]*cetak_hasil[^"]*"[^>]*/g,
    );
    console.log(`nolab=${r.nolab} | ${r.text}\n  buttons: ${JSON.stringify(m)}`);
  }
}

await scrapeList(
  'visit 203161',
  'http://103.147.236.140/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=203161&page=1&status_periksa=belum',
);
await scrapeList(
  'visit 200796',
  'http://103.147.236.140/admisi/pelaksanaan_pelayanan/laboratorium-data?id_visit=200796&page=1&status_periksa=belum',
);

// read DOM ids on input pages
for (const idLab of ['171730', '170747']) {
  await p.goto(`http://103.147.236.140/laboratorium/input-hasil/input-hasil-pa?id_lab=${idLab}`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  });
  await p.waitForTimeout(2500);
  const dom = await p.evaluate(() => {
    const read = (sel) => document.querySelector(sel)?.value?.trim?.() || '';
    const ids = [];
    document
      .querySelectorAll('input[name="id_visit"]')
      .forEach((el, i) =>
        ids.push({
          i,
          id_visit:
            read(`input[name="id_visit"]:nth-of-type(${i + 1})`) ||
            (i === 0 ? read('input[name="id_visit"]') : ''),
        }),
      );
    const hasils = [];
    document
      .querySelectorAll('input[name^="hasil["]')
      .forEach((el) => hasils.push(`${el.name}=${el.value}`));
    return {
      url: location.search,
      id_lab: read('input[name="id_lab"]'),
      id_visit_vals: [...document.querySelectorAll('input[name="id_visit"]')].map((e) => e.value),
      hasil: hasils.slice(0, 6),
    };
  });
  console.log(`\nid_lab=${idLab}`, JSON.stringify(dom));
}
await b.close();
