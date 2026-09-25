// Self-check: penerimaanAntrolCetak — wrap no_antrian, resolve ID antrian, extractShift.
// Jalankan: node tests/unit/penerimaan-antrol-cetak.selfcheck.mjs
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const calls = { fetched: [], opened: [], alerts: [], issue: [], codes: [] };

function makeCell(html) {
  const btn = {
    outerHTML: '<button class="btn btn-warning">No. Antrian</button>',
    attrs: {},
    getAttribute: (a) => (a in btn.attrs ? btn.attrs[a] : null),
    setAttribute: (a, v) => {
      btn.attrs[a] = v;
    },
    hasAttribute: (a) => a in btn.attrs,
  };
  const el = { innerHTML: html, attrs: {}, textContent: html.replace(/<[^>]+>/g, ' ') };
  el.hasAttribute = (a) => a in el.attrs;
  el.querySelector = () => btn;
  el.setAttribute = (a, v) => {
    el.attrs[a] = v;
  };
  el.appendChild = (child) => {
    el.innerHTML = '';
    el.children = [child];
    return child;
  };
  el.children = [];
  return el;
}
const antrianCell = makeCell(
  'UT-001<br> Shift : ML <button class="btn btn-warning">No. Antrian</button>',
);
const tr = { id: '206825', querySelectorAll: () => [null, null, antrianCell] };

const sandbox = {
  console,
  window: {},
  setTimeout: () => {},
  clearTimeout: () => {},
  MutationObserver: class {
    observe() {}
    disconnect() {}
  },
  document: {
    readyState: 'complete',
    querySelector: (sel) => (sel === 'tr[id="206825"]' ? tr : null),
    querySelectorAll: (sel) => (sel === 'tr[id]' ? [tr] : []),
    body: {},
    addEventListener() {},
  },
  alert: (m) => calls.alerts.push(m),
  fetch: async (url, init) => {
    calls.fetched.push({ url: String(url), init });
    const u = String(url);
    if (u.includes('data-resep-new')) {
      return new sandbox.Response(
        JSON.stringify({
          ID_VISIT: '190919',
          ID_PASIEN: '49713',
          NAMA_PAS: 'ALZIO',
          WAKTU_PENGAJUAN: '2026-08-10 09:36:34',
          DOKTER: 'dr. X',
          UNIT_TUJUAN_DEPO: 'DEPO RAJAL',
        }),
        { status: 200 },
      );
    }
    if (u.includes('list-antrian-v2')) {
      return new sandbox.Response(
        JSON.stringify([
          {
            ID: '190919',
            ID_PASIEN: '49713',
            WAKTU: '2026-08-10 09:36:34',
            JENIS: 'racik',
            KODE: 'UT',
            NOMOR: '1',
            NAMA_PASIEN: 'ALZIO',
          },
        ]),
        { status: 200 },
      );
    }
    if (u.includes('antrol/search')) return new sandbox.Response('ok', { status: 200 });
    return new sandbox.Response('notfound', { status: 404 });
  },
  Response: class {
    constructor(body, init) {
      this.body = body;
      this.ok = (init?.status ?? 200) < 400;
      this.status = init?.status ?? 200;
    }
    async json() {
      return JSON.parse(this.body);
    }
  },
};
sandbox.window.open = (u) => {
  calls.opened.push(String(u));
  return {
    document: { write: () => {}, close: () => {} },
    focus: () => {},
    print: () => {},
    close: () => {},
  };
};
sandbox.window.setTimeout = () => {};
sandbox.window.no_antrian = (id) => {
  calls.opened.push('orig:' + id);
};
sandbox.window.postMessage = (msg) => {
  if (msg.type === 'QUEUE_ASSIGN_ONE') calls.issue.push([{ id: msg.id, jenis: msg.jenis }]);
  if (msg.type === 'QUEUE_GET_CODE') calls.codes.push(msg.id);
};
sandbox.window.addEventListener = () => {};

const msgListeners = [];
sandbox.window.addEventListener = (type, fn) => {
  if (type === 'message') msgListeners.push(fn);
};
sandbox.window.removeEventListener = (type, fn) => {
  const i = msgListeners.indexOf(fn);
  if (i >= 0) msgListeners.splice(i, 1);
};

const code = readFileSync(
  new URL('../../dist/features/penerimaanAntrolCetak.js', import.meta.url),
  'utf8',
);
vm.runInNewContext(code, sandbox, { filename: 'penerimaanAntrolCetak.js' });

// 1. wrap no_antrian terpasang
{
  const g = sandbox.window.no_antrian;
  assert.equal(typeof g, 'function', 'no_antrian harus ter-wrap');
  assert.equal(g.__ext, true, 'tanda __ext ada');
}

// 1b. sanitize: UT-001 + Shift disembunyikan, tombol dipertahankan, shift tersimpan
{
  assert.equal(antrianCell.innerHTML, '', 'sel dikosongkan (UT-001 hilang)');
  assert.equal(antrianCell.children.length, 1, 'tombol dipertahankan di sel');
  const btn = antrianCell.querySelector('button');
  assert.equal(btn.getAttribute('data-ext-shift'), 'ML', 'shift disimpan di tombol');
}

// 2. handler: fetch data → antrol → check_antrian → issue → getCode → kartu
{
  const origPost = sandbox.window.postMessage;
  sandbox.window.postMessage = (msg) => {
    origPost(msg);
    queueMicrotask(() => {
      const reply = { source: 'MORBIS-FARMASI-BRIDGE', reqId: msg.reqId, type: msg.type, ok: true };
      if (msg.type === 'QUEUE_ASSIGN_ONE') {
        reply.code = 'T-01';
        reply.issued = true;
      }
      if (msg.type === 'QUEUE_GET_CODE') reply.code = 'T-01';
      msgListeners.slice().forEach((fn) => fn({ source: sandbox.window, data: reply }));
    });
  };

  const waitFor = async (fn, label, ms = 3000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (fn()) return;
      await new Promise((r) => setTimeout(r, 10));
    }
    assert.fail('timeout menunggu ' + label);
  };

  sandbox.window.no_antrian('206825');
  await waitFor(() => calls.fetched.some((f) => f.url.includes('antrol/search')), 'POST antrol');
  await waitFor(() => calls.opened.length > 0, 'kartu dibuka');

  assert.ok(
    calls.fetched.some((f) => f.url.includes('data-resep-new')),
    'fetch data-resep-new',
  );
  assert.ok(
    calls.fetched.some((f) => f.url.includes('antrol/search')),
    'POST antrol',
  );
  assert.ok(
    calls.fetched.some((f) => f.url.includes('list-antrian-v2')),
    'fetch check_antrian',
  );
  assert.equal(calls.issue.length, 1, 'assignPublicNumber dipanggil');
  assert.equal(calls.issue[0][0].id, '190919', 'id antrian = ID antrian hasil resolve');
  assert.equal(calls.issue[0][0].jenis, 'racik', 'jenis dari check_antrian');
  assert.equal(calls.codes.length, 0, 'assignPublicNumber (bukan issuePending+getCode)');
  assert.equal(calls.opened.length, 1, 'kartu dibuka');
  assert.equal(antrianCell.innerHTML.includes('T-01'), true, 'kolom No Antrian = T-01');
  assert.equal(antrianCell.innerHTML.includes('Shift : ML'), true, 'shift dipertahankan');
  assert.equal(antrianCell.hasAttribute('data-ext-code'), true, 'data-ext-code ditandai');
}

console.log('PASS: penerimaan-antrol-cetak OK (2 skenario)');
