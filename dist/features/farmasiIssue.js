'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiRenumber.ts
  var RACIKAN_COUNTERS = /* @__PURE__ */ new Set(['2']);
  var RACIKAN_RE = /racik/i;
  function isRacikanByCounter(counter) {
    return RACIKAN_COUNTERS.has(String(counter ?? ''));
  }
  function isRacikanJenis(jenis) {
    return !!jenis && RACIKAN_RE.test(jenis);
  }
  function ts(w) {
    if (!w) return 0;
    const n = Date.parse(w.replace(' ', 'T'));
    return Number.isFinite(n) ? n : 0;
  }
  function renumberFarmasi(rows) {
    const sorted = [...rows].sort((a, b) => ts(a.waktu) - ts(b.waktu));
    const byId = /* @__PURE__ */ new Map();
    const urutan = [];
    let r = 0;
    let t = 0;
    for (const row of sorted) {
      if (!row.id) continue;
      const isR =
        isRacikanByCounter(row.counter) || (row.counter == null && isRacikanJenis(row.jenis));
      const kode = isR ? 'R-' + String(++r).padStart(2, '0') : 'T-' + String(++t).padStart(2, '0');
      byId.set(String(row.id), kode);
      urutan.push(kode);
    }
    return { byId, urutan };
  }

  // src/features/farmasiIssue.ts
  var LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
  async function fetchRows() {
    const res = await fetch(LIST_URL + '?type=data_call', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    if (!Array.isArray(j)) throw new Error('bukan array');
    return j;
  }
  function buildPanel() {
    const p = document.createElement('div');
    p.id = 'ext-farmasi-issue';
    p.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:99999;background:#fff;border:1px solid #0f5132;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:14px 16px;max-width:340px;font:13px/1.5 "Inter",system-ui,sans-serif;color:#212529;display:none;';
    p.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px;"><b style="color:#0f5132;font-size:14px;">Penerbitan Antrian</b><button id="ext-issue-collapse" style="border:none;background:none;font-size:16px;cursor:pointer;line-height:1;" title="Tutup">\u2013</button></div><div id="ext-issue-status" style="color:#6c757d;font-size:12px;margin-bottom:8px;">Memuat\u2026</div><div id="ext-issue-list" style="max-height:240px;overflow:auto;border:1px solid #e9ecef;border-radius:8px;margin-bottom:10px;"></div><div style="display:flex;gap:8px;"><button id="ext-issue-refresh" style="flex:1;padding:7px;border:1px solid #0f5132;background:#fff;color:#0f5132;border-radius:8px;cursor:pointer;">Segarkan</button><button id="ext-issue-print" style="flex:1;padding:7px;border:none;background:#0f5132;color:#fff;border-radius:8px;cursor:pointer;">Cetak Sheet A4</button></div>';
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
  function renderRows(rows) {
    const { byId, urutan } = renumberFarmasi(
      rows.map((r) => ({
        id: String(r.ID ?? ''),
        counter: r.COUNTER ?? null,
        jenis: r.JENIS ?? null,
        status: r.STATUS ?? null,
        waktu: r.WAKTU ?? null,
      })),
    );
    const list = document.getElementById('ext-issue-list');
    const status = document.getElementById('ext-issue-status');
    if (!list || !status) return;
    if (urutan.length === 0) {
      status.textContent = 'Tidak ada antrian aktif.';
      list.innerHTML = '';
      return;
    }
    status.textContent = `${urutan.length} antrian aktif \xB7 ${countOf(urutan, 'R-')} racikan, ${countOf(urutan, 'T-')} tunggal`;
    const name = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_PASIEN ?? '')]));
    list.innerHTML =
      urutan
        .map((kode) => {
          const id = [...byId].find(([, v]) => v === kode)?.[0] ?? '';
          return (
            '<div style="display:flex;justify-content:space-between;padding:4px 8px;' +
            (byId.get(id) === kode ? '' : '') +
            '"><b style="color:#0f5132;min-width:52px;">' +
            kode.replace('-', '-') +
            '</b><span style="color:#495057;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:190px;">' +
            (name.get(id) || '') +
            '</span></div>'
          );
        })
        .join('') || '<div style="padding:6px;color:#6c757d;">kosong</div>';
    document.getElementById('ext-issue-print')?.setAttribute('data-urutan', JSON.stringify(urutan));
    document.getElementById('ext-issue-print')?.setAttribute('data-rows', JSON.stringify(rows));
  }
  function countOf(arr, prefix) {
    return arr.filter((k) => k.startsWith(prefix)).length;
  }
  function toRows(rows) {
    return rows.map((r) => ({
      id: String(r.ID ?? ''),
      counter: r.COUNTER ?? null,
      jenis: r.JENIS ?? null,
      status: r.STATUS ?? null,
      waktu: r.WAKTU ?? null,
    }));
  }
  function inRange(kode, prefix, from, to) {
    if (!kode.startsWith(prefix)) return false;
    const n = parseInt(kode.slice(2), 10);
    return Number.isFinite(n) && n >= from && n <= to;
  }
  function openPrint(rows) {
    const { byId, urutan } = renumberFarmasi(toRows(rows));
    const name = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_PASIEN ?? '')]));
    const unit = new Map(rows.map((r) => [String(r.ID), String(r.NAMA_UNIT ?? '')]));
    const rCodes = urutan.filter((k) => k.startsWith('R-'));
    const tCodes = urutan.filter((k) => k.startsWith('T-'));
    const pick = (label, codes) => {
      if (codes.length === 0) return '';
      const inp = window.prompt(
        `${label} (${codes[0].slice(2)}\u2013${codes[codes.length - 1].slice(2)}) \u2014 kosongkan = semua`,
      );
      return inp ?? '';
    };
    const rFrom = parseInt(pick('Rentang R-', rCodes), 10) || 0;
    const rTo = parseInt(pick('sampai R-', rCodes), 10) || Infinity;
    const tFrom = parseInt(pick('Rentang T-', tCodes), 10) || 0;
    const tTo = parseInt(pick('sampai T-', tCodes), 10) || Infinity;
    const sel = urutan.filter((k) => inRange(k, 'R-', rFrom, rTo) || inRange(k, 'T-', tFrom, tTo));
    const grid = sel
      .map((k) => {
        const id = [...byId].find(([, v]) => v === k)?.[0] ?? '';
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
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) {
      alert('Popup diblokir \u2014 izinkan popup utk mencetak.');
      return;
    }
    win.document.write(
      '<style>@page{size:A4;margin:5mm;}body{font-family:Arial,Helvetica,sans-serif;}@media print{.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:3mm;}}</style><div class="grid">' +
        (grid || '<div style="padding:20px;color:#666;">Tidak ada nomor dalam rentang.</div>') +
        '</div><script>setTimeout(()=>{window.print();},300);<\/script>',
    );
    win.document.close();
  }
  function init() {
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
    panel.querySelector('#ext-issue-refresh')?.addEventListener('click', async () => {
      const status = document.getElementById('ext-issue-status');
      if (status) status.textContent = 'Memuat\u2026';
      try {
        renderRows(await fetchRows());
      } catch (e) {
        if (status) status.textContent = 'Gagal: ' + String(e.message);
      }
    });
    panel.querySelector('#ext-issue-print')?.addEventListener('click', () => {
      const raw = (panel.querySelector('#ext-issue-print')?.getAttribute('data-rows') || '').trim();
      if (!raw) return;
      try {
        openPrint(JSON.parse(raw));
      } catch {}
    });
    fetchRows()
      .then(renderRows)
      .catch((e) => {
        const s = document.getElementById('ext-issue-status');
        if (s) s.textContent = 'Gagal: ' + String(e.message);
      });
  }
  init();
})();
//# sourceMappingURL=farmasiIssue.js.map
