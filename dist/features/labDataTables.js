'use strict';
var __morbis_feature = (() => {
  var D = 'https://code.jquery.com/jquery-3.7.1.min.js',
    S = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    E = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    d = null;
  function L(e) {
    if (document.querySelector(`link[href="${e}"]`)) return;
    let a = document.createElement('link');
    ((a.rel = 'stylesheet'), (a.href = e), document.head.appendChild(a));
  }
  function w(e) {
    return new Promise((a, t) => {
      if (document.querySelector(`script[src="${e}"]`)) return a();
      let l = document.createElement('script');
      ((l.src = e),
        (l.onload = () => a()),
        (l.onerror = () => t(new Error('Failed to load ' + e))),
        document.head.appendChild(l));
    });
  }
  function T(e) {
    return (
      d ||
      ((d = (async () => {
        (console.log(`[${e}] loading deps...`), L(S));
        let a = window.$,
          t = window.jQuery;
        (await w(D),
          (window.__extJQ = window.jQuery),
          (window.$ = a),
          (window.jQuery = t),
          await w(E),
          console.log(`[${e}] deps loaded`));
      })()),
      d)
    );
  }
  function _() {
    return window.__extJQ;
  }
  function M(e) {
    return e
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function N(e, a) {
    let t = _();
    if (!t || !t.fn || !t.fn.DataTable) return !1;
    let l = e;
    if (l.dataset.extDt === '1') return !1;
    let g = e.querySelector('tr');
    if (!g) return !1;
    let u = g.querySelectorAll('th');
    if (u.length === 0) return !1;
    let y = u.length,
      f = e.querySelectorAll('tr'),
      p = [];
    for (let n = 0; n < f.length; n++) {
      let r = f[n].querySelectorAll('td');
      r.length !== 0 && (r[0].hasAttribute('colspan') || p.push(f[n]));
    }
    if (p.length === 0) return !1;
    let i = [];
    for (let n of p) {
      let r = n.querySelectorAll('td'),
        s = [];
      for (let o = 0; o < r.length; o++) s.push(M(r[o].innerHTML));
      s.length === y && i.push(s);
    }
    if (i.length === 0) return !1;
    t(e).empty();
    let m = t('<thead><tr></tr></thead>');
    for (let n of u) {
      let r = n.textContent?.trim() ?? '';
      m.find('tr').append(t('<th>').text(r));
    }
    t(e).append(m);
    let x = t('<tbody></tbody>');
    for (let n of i) {
      let r = t('<tr></tr>');
      for (let s of n) r.append(t('<td>').html(s));
      x.append(r);
    }
    t(e).append(x);
    let h = [];
    for (let n of a.columns) {
      let r = { targets: n.idx };
      if (
        (n.width && (r.width = n.width),
        n.orderable === !1 && (r.orderable = !1),
        n.align && (r.className = 'dt-' + n.align),
        n.truncate)
      ) {
        let s = n.truncate;
        r.render = function (o, A) {
          return A === 'display' && typeof o == 'string' && o.length > s
            ? '<span title="' + o.replace(/"/g, '&quot;') + '">' + o.slice(0, s) + '\u2026</span>'
            : o;
        };
      }
      h.push(r);
    }
    return (
      h.push({ targets: '_all', className: 'dt-left' }),
      (l.dataset.extDt = '1'),
      t(e).DataTable({
        pageLength: a.pageLength ?? 25,
        lengthMenu: [
          [10, 25, 50, 100, -1],
          [10, 25, 50, 100, 'Semua'],
        ],
        language: {
          search: 'Cari:',
          lengthMenu: 'Tampilkan _MENU_ data',
          info: 'Menampilkan _START_ \u2013 _END_ dari _TOTAL_ data',
          infoEmpty: 'Tidak ada data',
          infoFiltered: '(difilter dari _MAX_ total data)',
          paginate: { first: 'Awal', last: 'Akhir', next: '\u2192', previous: '\u2190' },
          zeroRecords: 'Data tidak ditemukan',
        },
        columnDefs: h,
        order: [],
        destroy: !0,
      }),
      console.log(`[${a.logPrefix}] DataTable ready \u2014 ${i.length} rows`),
      !0
    );
  }
  function b(e) {
    let a = document.querySelectorAll(e.selector),
      t = 0;
    return (
      a.forEach((l) => {
        N(l, e) && t++;
      }),
      t
    );
  }
  var c = 'LabDT',
    R = [
      { idx: 0, label: 'NO', width: '30px', orderable: !1 },
      { idx: 1, label: 'AKSI', width: '110px', orderable: !1 },
      { idx: 2, label: 'NO RM', width: '80px' },
      { idx: 3, label: 'No Visit', width: '80px' },
      { idx: 4, label: 'NAMA', width: '160px', truncate: 30 },
      { idx: 5, label: 'TANGGAL PERMINTAAN', width: '120px' },
      { idx: 6, label: 'STATUS', width: '90px' },
      { idx: 7, label: 'UNIT ASAL', width: '110px' },
      { idx: 8, label: 'DOKTER PENGIRIM', width: '130px', truncate: 25 },
      { idx: 9, label: 'DIAGNOSA', truncate: 35 },
      { idx: 10, label: 'PEMERIKSAAN', truncate: 35 },
      { idx: 11, label: 'PENJAMIN', width: '100px' },
      { idx: 12, label: 'PEGAWAI INPUT', width: '110px', truncate: 20 },
      { idx: 13, label: 'Invoice', width: '60px', orderable: !1 },
      { idx: 14, label: 'Dokumen Pasien', width: '90px', orderable: !1 },
    ];
  (function () {
    if (!window.location.pathname.includes('laboratorium/input-hasil/view-lab')) return;
    if (document.documentElement.getAttribute('data-ext-lab-datatables') !== '1') {
      console.log(`[${c}] disabled`);
      return;
    }
    console.log(`[${c}] start`);
    let a = { selector: 'table.tabel', columns: R, pageLength: 25, logPrefix: c };
    T(c).then(() => b(a));
    let t = null;
    new MutationObserver(() => {
      (t && clearTimeout(t), (t = setTimeout(() => b(a), 600)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
