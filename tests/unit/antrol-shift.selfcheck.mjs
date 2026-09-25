// Self-check: farmasiAntrolShift — blokir antrol otomatis + tombol "Antrian & Cetak"
// (antrol → issue nomor publik via bridge → cetak kartu format kita).
// Jalankan: node tests/unit/antrol-shift.selfcheck.mjs
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const calls = { xhrSent: [], fetched: [], opened: [], issue: [], codes: [] };

class FakeXHR {
  constructor() {
    this.url = '';
  }
  open(method, url, ...rest) {
    this.url = String(url);
    this.__extUrl = String(url);
  }
  send(body) {
    calls.xhrSent.push({ url: this.url, body });
  }
}
// Simulasi DOM minimal: #save, #id_visit, #nomor_resep
const domEls = new Map();
const qs = (sel) => domEls.get(sel) ?? null;
function makeEl(tag) {
  return {
    tagName: String(tag || 'button').toUpperCase(),
    type: '',
    id: '',
    textContent: '',
    className: '',
    style: { cssText: '' },
    disabled: false,
    value: '',
    listeners: {},
    addEventListener(type, fn) {
      (this.listeners[type] ||= []).push(fn);
    },
    insertAdjacentElement(_pos, el) {
      domEls.set('#' + el.id, el);
    },
  };
}
const saveBtn = makeEl('button');
saveBtn.id = 'save';
domEls.set('#save', saveBtn);
const visitInput = makeEl('input');
visitInput.value = '190919';
domEls.set('#id_visit', visitInput);
const nomorInput = makeEl('input');
nomorInput.value = '204608';
domEls.set('#nomor_resep', nomorInput);
const pasienInput = makeEl('input');
pasienInput.value = '49713';
domEls.set('#id_pasien', pasienInput);
const waktuInput = makeEl('input');
waktuInput.value = '2026-08-10 09:36:34';
domEls.set('#waktu_pengajuan', waktuInput);
const namaInput = makeEl('input');
namaInput.value = 'ALZIO';
domEls.set('#nama_pasien', namaInput);
const dokterInput = makeEl('input');
dokterInput.value = 'dr. X';
domEls.set('#dokter', dokterInput);

const sandbox = {
  console,
  XMLHttpRequest: FakeXHR,
  window: {},
  setTimeout: () => {},
  clearTimeout: () => {},
  document: {
    readyState: 'complete',
    querySelector: qs,
    querySelectorAll: () => [],
    addEventListener() {},
    createElement: makeEl,
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
  fetch: async (url, init) => {
    calls.fetched.push({ url: String(url), init });
    const u = String(url);
    if (u.includes('list-antrian-v2')) {
      return new sandbox.Response(
        JSON.stringify([
          { ID: '190919', ID_PASIEN: '49713', WAKTU: '2026-08-10 09:36:34', JENIS: 'racik' },
        ]),
        { status: 200 },
      );
    }
    return new sandbox.Response('ok', { status: 200 });
  },
  alert: (m) => {
    calls.opened.push('alert:' + m);
  },
  window_open_calls: [],
};
sandbox.window.fetch = sandbox.fetch;
sandbox.window.open = (u) => {
  calls.opened.push(String(u));
  return {
    document: { write: () => {}, close: () => {} },
    focus: () => {},
    print: () => {},
    close: () => {},
  };
};
sandbox.window.location = { replace: () => {} };
sandbox.window.setTimeout = (fn) => {
  /* jangan jalan di test */
};
const msgListeners = [];
sandbox.window.addEventListener = (type, fn) => {
  if (type === 'message') msgListeners.push(fn);
};
sandbox.window.removeEventListener = (type, fn) => {
  const i = msgListeners.indexOf(fn);
  if (i >= 0) msgListeners.splice(i, 1);
};
sandbox.window.postMessage = (msg) => {
  if (msg.type === 'QUEUE_ASSIGN_ONE') calls.issue.push([{ id: msg.id, jenis: msg.jenis }]);
  if (msg.type === 'QUEUE_GET_CODE') calls.codes.push(msg.id);
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

const code = readFileSync(
  new URL('../../dist/features/farmasiAntrolShift.js', import.meta.url),
  'utf8',
);
vm.runInNewContext(code, sandbox, { filename: 'farmasiAntrolShift.js' });

const XHRProto = sandbox.XMLHttpRequest.prototype;

// 1. XHR antrol otomatis (taskid=6) → diblokir
{
  const before = calls.xhrSent.length;
  const xhr = new sandbox.XMLHttpRequest();
  XHRProto.open.call(xhr, 'POST', 'http://103.147.236.140/v2/antrol/search?sub=update_v2');
  XHRProto.send.call(xhr, 'id=190919&taskid=6');
  assert.equal(calls.xhrSent.length, before, 'antrol taskid=6 harus diblokir');
}

// 2. XHR biasa → tetap terkirim
{
  const before = calls.xhrSent.length;
  const xhr = new sandbox.XMLHttpRequest();
  XHRProto.open.call(
    xhr,
    'GET',
    'http://103.147.236.140/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new',
  );
  XHRProto.send.call(xhr, null);
  assert.equal(calls.xhrSent.length, before + 1, 'request biasa harus tetap terkirim');
}

// 3. fetch antrol otomatis → diblokir
{
  const before = calls.fetched.length;
  await sandbox.window.fetch('http://103.147.236.140/v2/antrol/search?sub=update_v2', {
    method: 'POST',
    body: 'id=190919&taskid=6',
  });
  assert.equal(calls.fetched.length, before, 'fetch antrol taskid=6 harus diblokir');
}

// 4. fetch biasa → diteruskan
{
  const before = calls.fetched.length;
  await sandbox.window.fetch(
    'http://103.147.236.140/inventory/resep/akses/penerimaan?opsi=data-resep-new',
    { method: 'GET' },
  );
  assert.equal(calls.fetched.length, before + 1, 'fetch biasa harus diteruskan');
}

// 5. Tombol "Antrian & Cetak" tersuntik setelah #save
{
  const btn = domEls.get('#ext-antrian-cetak');
  assert.ok(btn, 'tombol ext-antrian-cetak harus ada');
  assert.equal(btn.textContent, 'Antrian & Cetak');
}

// 6. Klik tombol → antrol (fetch) → check_antrian → issue → getCode → cetak kartu
{
  const beforeFetch = calls.fetched.length;
  const beforeOpen = calls.opened.length;
  const btn = domEls.get('#ext-antrian-cetak');
  const click = (btn.listeners.click || [])[0];
  assert.ok(click, 'handler click harus terpasang');
  await click.call(btn, {});

  const waitFor = async (fn, label, ms = 3000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (fn()) return;
      await new Promise((r) => setTimeout(r, 10));
    }
    assert.fail('timeout menunggu ' + label);
  };
  await waitFor(() => calls.issue.length > 0, 'issue nomor publik');

  assert.equal(calls.fetched.length, beforeFetch + 2, 'klik → fetch antrol + check_antrian');
  assert.ok(
    calls.fetched.some((f) => f.url.includes('antrol/search?sub=update_v2')),
    'URL antrol update_v2',
  );
  const antrol = calls.fetched.find((f) => f.url.includes('antrol/search'));
  assert.match(antrol.init.body, /id=190919&taskid=6/, 'body = id visit + taskid 6');
  assert.ok(
    calls.fetched.some((f) => f.url.includes('list-antrian-v2')),
    'fetch check_antrian',
  );
  assert.equal(calls.issue.length, 1, 'assignPublicNumber dipanggil');
  assert.equal(calls.issue[0][0].id, '190919', 'resolve id antrian = 190919');
  assert.equal(calls.codes.length, 0, 'assignPublicNumber (bukan issuePending+getCode)');
  assert.equal(calls.opened.length, beforeOpen + 1, 'klik → buka popup kartu');
  const winDoc = calls.opened.at(-1);
  assert.equal(
    typeof winDoc === 'string' && winDoc.includes('cetak-antrian'),
    false,
    'bukan cetak-antrian MORBIS',
  );
}

console.log('PASS: 6/6 skenario antrol-shift OK');
