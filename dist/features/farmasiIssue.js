'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiQueue.ts
  var KEY = 'farmasiQueueV2';
  function assertCtxAlive() {
    const ok = typeof chrome !== 'undefined' && !!chrome.runtime?.id;
    if (!ok) {
      throw new Error('farmasiQueue: extension context invalidated (extension reloaded)');
    }
  }
  async function storageGet(key) {
    assertCtxAlive();
    return chrome.storage.local.get(key);
  }
  function sessionOf(waktu) {
    if (waktu && /^\d{4}-\d{2}-\d{2}/.test(waktu)) return waktu.slice(0, 10);
    return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
  }
  function empty(session) {
    return { session, nextByJenis: { tunggal: 1, racikan: 1 }, tickets: {} };
  }
  async function getQueueState() {
    const today = sessionOf();
    const res = await storageGet(KEY);
    const st = res[KEY] ?? empty(today);
    return st.session === today ? st : empty(today);
  }
  function getTicket(st, id) {
    return st.tickets[id] ?? null;
  }

  // src/features/farmasiIssue.ts
  var LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  async function fetchRows() {
    const res = await fetch(LIST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: 'type=check_antrian',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    if (!Array.isArray(j)) throw new Error('bukan array');
    return j;
  }
  async function loadTickets(rows) {
    const st = await getQueueState();
    const m = /* @__PURE__ */ new Map();
    for (const r of rows) {
      const tid = String(r.ID ?? '');
      const t = getTicket(st, tid);
      if (t) m.set(tid, t);
    }
    return m;
  }
  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'ext-farmasi-issue';
    p.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:99999;background:#fff;border:1px solid #0f5132;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:14px 16px;max-width:340px;font:13px/1.5 "Inter",system-ui,sans-serif;color:#212529;display:none;';
    p.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;"><b style="color:#0f5132;font-size:14px;">Penerbitan Antrian</b><button id="ext-issue-collapse" style="border:none;background:none;font-size:16px;cursor:pointer;line-height:1;" title="Tutup">\u2013</button></div><div id="ext-issue-status" style="color:#6c757d;font-size:12px;margin-bottom:8px;">Memuat\u2026</div><div style="display:flex;gap:6px;margin-bottom:8px;"><button id="ext-issue-tab-active" class="ext-issue-tab" style="flex:1;padding:6px;border:1px solid #0f5132;background:#0f5132;color:#fff;border-radius:8px;cursor:pointer;font:inherit;">Aktif</button><button id="ext-issue-tab-pending" class="ext-issue-tab" style="flex:1;padding:6px;border:1px solid #ced4da;background:#fff;color:#495057;border-radius:8px;cursor:pointer;font:inherit;">Tertunda</button></div><input id="ext-issue-search" type="search" placeholder="Cari nama / no antrian\u2026" style="width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #ced4da;border-radius:8px;font:13px/1.4 inherit;margin-bottom:8px;" /><div id="ext-issue-list" style="max-height:240px;overflow:auto;border:1px solid #e9ecef;border-radius:8px;margin-bottom:10px;"></div><div style="display:flex;gap:8px;"><button id="ext-issue-refresh" style="flex:1;padding:7px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button><button id="ext-issue-print" style="flex:1;padding:7px;border:none;background:#0f5132;color:#fff;border-radius:8px;cursor:pointer;">Cetak Sheet A4</button></div>';
    return p;
  }
  function buildToggle() {
    const b = document.createElement('button');
    b.id = 'ext-issue-toggle';
    b.textContent = 'Antrian';
    b.title = 'Buka/Tutup panel Penerbitan Antrian';
    b.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:100000;padding:10px 18px;border:none;border-radius:999px;background:#0f5132;color:#fff;font:700 13px/1 "Inter",system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px rgba(15,81,50,.4);';
    return b;
  }
  var currentTab = 'active';
  function callRow(id, jenis, nomor, nomorTeks) {
    try {
      localStorage.setItem(
        'ext-afd-recall',
        JSON.stringify({ jenis, nomor, nomorTeks, ts: Date.now() }),
      );
    } catch {}
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  }
  async function renderRows(rows) {
    const tickets = await loadTickets(rows);
    const byNum = [...tickets.entries()].sort((a, b) => a[1].num - b[1].num);
    const list = document.getElementById('ext-issue-list');
    const status = document.getElementById('ext-issue-status');
    if (!list || !status) return;
    const isPending = (st) => st === 'CALLED' || st === 'RECALLED' || st === 'MISSED';
    const aktif = byNum.filter(([, t]) => !isPending(t.status));
    const tertunda = byNum.filter(([, t]) => isPending(t.status));
    const urutan = currentTab === 'pending' ? tertunda : aktif;
    if (byNum.length === 0) {
      status.textContent = 'Tidak ada antrian aktif.';
      list.innerHTML = '';
      return;
    }
    status.textContent = `${byNum.length} antrian \xB7 ${aktif.length} aktif, ${tertunda.length} tertunda`;
    const name = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_PASIEN ?? '')]));
    const panel = document.getElementById('ext-farmasi-issue');
    const printOneBtn = document.getElementById('ext-issue-printone');
    if (panel) panel.setAttribute('data-rows', JSON.stringify(rows));
    const q = document.getElementById('ext-issue-search')?.value.trim().toLowerCase();
    const visible = urutan.filter(([id, t]) => {
      if (!q) return true;
      return t.code.toLowerCase().includes(q) || (name.get(id) || '').toLowerCase().includes(q);
    });
    list.innerHTML =
      visible
        .map(([id, t]) => {
          const idx = rows.findIndex((r) => String(r.ID) === id);
          return (
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;padding:4px 6px;"><b style="color:#0f5132;min-width:52px;">' +
            t.code +
            '</b><span style="flex:1;color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' +
            (name.get(id) || '') +
            '</span><button class="ext-issue-call" data-idx="' +
            idx +
            '" style="flex-shrink:0;padding:3px 8px;border:none;border-radius:8px;background:#0f5132;color:#fff;cursor:pointer;font-size:12px;" title="Panggil pasien ini">\u{1F4E2}</button><button class="ext-issue-printone" data-idx="' +
            idx +
            '" style="flex-shrink:0;padding:3px 8px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;font-size:12px;" title="Cetak tiket pasien ini">\u{1F5A8}</button></div>'
          );
        })
        .join('') || '<div style="padding:6px;color:#6c757d;">tidak ada yang cocok</div>';
    document
      .getElementById('ext-issue-print')
      ?.setAttribute('data-urutan', JSON.stringify(urutan.map(([, t]) => t.code)));
    document.getElementById('ext-issue-print')?.setAttribute('data-rows', JSON.stringify(rows));
    void printOneBtn;
  }
  function inRange(kode, prefix, from, to) {
    if (!kode.startsWith(prefix)) return false;
    const n = parseInt(kode.slice(2), 10);
    return Number.isFinite(n) && n >= from && n <= to;
  }
  function openPrint(rows) {
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup utk mencetak.');
      return;
    }
    void (async () => {
      try {
        const tickets = await loadTickets(rows);
        const urutan = [...tickets.entries()]
          .sort((a, b) => a[1].num - b[1].num)
          .map(([, t2]) => t2.code);
        const name = new Map(rows.map((r2) => [String(r2.ID), String(r2.NAMA_PASIEN ?? '')]));
        const unit = new Map(rows.map((r2) => [String(r2.ID), String(r2.NAMA_UNIT ?? '')]));
        const rCodes = urutan.filter((k) => k.startsWith('R-'));
        const tCodes = urutan.filter((k) => k.startsWith('T-'));
        const parseRange = (input) => {
          const g = input.match(/(\d+)\s*[-–]\s*(\d+)/);
          if (g) return { from: Math.min(+g[1], +g[2]), to: Math.max(+g[1], +g[2]) };
          const single = input.match(/(\d+)/);
          if (single) return { from: +single[1], to: +single[1] };
          return { from: 0, to: Infinity };
        };
        const rInp = rCodes.length
          ? (window.prompt(
              `Rentang R- (${rCodes[0].slice(2)}\u2013${rCodes[rCodes.length - 1].slice(2)}). Kosong = semua`,
              '',
            ) ?? '')
          : '';
        const tInp = tCodes.length
          ? (window.prompt(
              `Rentang T- (${tCodes[0].slice(2)}\u2013${tCodes[tCodes.length - 1].slice(2)}). Kosong = semua`,
              '',
            ) ?? '')
          : '';
        const r = parseRange(rInp);
        const t = parseRange(tInp);
        const sel = urutan.filter(
          (k) => inRange(k, 'R-', r.from, r.to) || inRange(k, 'T-', t.from, t.to),
        );
        const grid = sel
          .map((k) => {
            const id = [...tickets].find(([, v]) => v.code === k)?.[0] ?? '';
            return (
              '<div style="width:92mm;height:48mm;border:1px solid #000;box-sizing:border-box;padding:8px 10px;text-align:center;page-break-inside:avoid;display:flex;flex-direction:column;justify-content:center;"><div style="font-size:10px;font-weight:600;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:9px;margin-bottom:4px;">Antrian Farmasi</div><div style="font-size:30px;font-weight:700;letter-spacing:1px;">' +
              k +
              '</div><div style="font-size:11px;margin-top:3px;">' +
              (name.get(id) || '') +
              '</div><div style="font-size:9px;color:#333;">' +
              (unit.get(id) || '') +
              '</div></div>'
            );
          })
          .join('');
        win.document.write(
          '<style>@page{size:A4;margin:5mm;}body{font-family:Arial,Helvetica,sans-serif;}@media print{.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:3mm;}}</style><div class="grid">' +
            (grid || '<div style="padding:20px;color:#666;">Tidak ada nomor dalam rentang.</div>') +
            '</div>',
        );
        win.document.close();
        window.setTimeout(() => {
          try {
            win.focus();
            win.print();
          } catch {}
        }, 300);
      } catch {
        win.close();
      }
    })();
  }
  function openPrintOne(rows, idx) {
    const row = rows[idx];
    if (!row) return;
    const win = window.open('', '_blank', 'width=500,height=700');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup utk mencetak.');
      return;
    }
    void (async () => {
      try {
        const tickets = await loadTickets(rows);
        const tid = String(row.ID ?? '');
        const t = tickets.get(tid);
        const nomorKe = t?.code ?? '';
        const jenis = /racik/i.test(String(row.JENIS ?? '')) ? 'Racikan' : 'Non Racikan';
        const nama = String(row.NAMA_PASIEN ?? '');
        const unit = String(row.NAMA_UNIT ?? '');
        const body =
          '<div style="width:92mm;height:48mm;border:1px solid #000;box-sizing:border-box;margin:0 auto;padding:14px 12px;text-align:center;display:flex;flex-direction:column;justify-content:center;gap:4px;font-family:Arial,Helvetica,sans-serif;"><div style="font-size:11px;font-weight:600;text-transform:uppercase;">RSUD H. Abdul Manap</div><div style="font-size:10px;">Antrian Farmasi</div><div style="font-size:34px;font-weight:700;letter-spacing:1px;margin:6px 0;">' +
          (nomorKe || '') +
          '</div><div style="font-size:13px;">' +
          nama +
          '</div><div style="font-size:10px;color:#333;">' +
          (jenis + (unit ? ' \xB7 ' + unit : '')) +
          '</div><div style="font-size:9px;color:#555;margin-top:6px;">Silakan menunggu panggilan</div></div>';
        win.document.write(
          '<style>@page{size:A5 landscape;margin:4mm;}body{margin:0;padding:8px;}</style>' + body,
        );
        win.document.close();
        window.setTimeout(() => {
          try {
            win.focus();
            win.print();
          } catch {}
        }, 300);
      } catch {
        win.close();
      }
    })();
  }
  function ensureRecallDelegation() {
    if (document.getElementById('ext-afd-recall-deleg')) return;
    const s = document.createElement('script');
    s.id = 'ext-afd-recall-deleg';
    s.src = chrome.runtime.getURL('features/farmasiRecallDeleg.js');
    s.onerror = () => console.error('[FarmasiIssue] recall deleg inject failed');
    (document.head || document.documentElement).appendChild(s);
  }
  function init() {
    ensureRecallDelegation();
    const panel = buildPanel();
    const toggle = buildToggle();
    document.body.appendChild(panel);
    document.body.appendChild(toggle);
    const setOpen = (open) => {
      panel.style.display = open ? 'block' : 'none';
      toggle.style.display = open ? 'none' : 'block';
    };
    toggle.addEventListener('click', () => setOpen(true));
    panel.querySelector('#ext-issue-collapse')?.addEventListener('click', () => setOpen(false));
    const setTab = (tab) => {
      currentTab = tab;
      panel.querySelectorAll('.ext-issue-tab').forEach((btn) => {
        const active = btn.id === 'ext-issue-tab-' + tab;
        btn.style.background = active ? '#0f5132' : '#fff';
        btn.style.color = active ? '#fff' : '#495057';
        btn.style.borderColor = active ? '#0f5132' : '#ced4da';
      });
      const raw = (panel.getAttribute('data-rows') || '').trim();
      if (!raw) return;
      void renderRows(JSON.parse(raw));
    };
    panel.querySelector('#ext-issue-tab-active')?.addEventListener('click', () => setTab('active'));
    panel
      .querySelector('#ext-issue-tab-pending')
      ?.addEventListener('click', () => setTab('pending'));
    panel.querySelector('#ext-issue-search')?.addEventListener('input', () => {
      const raw = (panel.getAttribute('data-rows') || '').trim();
      if (!raw) return;
      void renderRows(JSON.parse(raw));
    });
    panel.querySelector('#ext-issue-refresh')?.addEventListener('click', async () => {
      const status = document.getElementById('ext-issue-status');
      if (status) status.textContent = 'Memuat\u2026';
      try {
        await renderRows(await fetchRows());
      } catch (e) {
        if (status) status.textContent = 'Gagal: ' + String(e.message);
      }
    });
    panel.querySelector('#ext-issue-print')?.addEventListener('click', () => {
      const raw = (panel.querySelector('#ext-issue-print')?.getAttribute('data-rows') || '').trim();
      if (!raw) return;
      openPrint(JSON.parse(raw));
    });
    document.getElementById('ext-issue-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.ext-issue-printone, .ext-issue-call');
      if (!btn) return;
      const raw = (
        document.getElementById('ext-farmasi-issue')?.getAttribute('data-rows') || ''
      ).trim();
      if (!raw) return;
      const rows = JSON.parse(raw);
      const idx = Number(btn.getAttribute('data-idx') ?? '-1');
      const row = rows[idx];
      if (!row) return;
      if (btn.classList.contains('ext-issue-call')) {
        callRow(String(row.ID ?? ''), String(row.JENIS ?? ''), String(row.NOMOR ?? ''), '');
        return;
      }
      openPrintOne(rows, idx);
    });
    fetchRows()
      .then((rows) => void renderRows(rows))
      .catch((e) => {
        const s = document.getElementById('ext-issue-status');
        if (s) s.textContent = 'Gagal: ' + String(e.message);
      });
  }
  init();
})();
//# sourceMappingURL=farmasiIssue.js.map
