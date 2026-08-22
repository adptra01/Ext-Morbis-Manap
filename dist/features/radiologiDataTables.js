'use strict';
var __morbis_feature = (() => {
  var _ = 'https://code.jquery.com/jquery-3.7.1.min.js',
    L = 'https://cdn.datatables.net/1.13.11/css/jquery.dataTables.min.css',
    S = 'https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js',
    d = null;
  function A(e) {
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
  function y(e) {
    return (
      d ||
      ((d = (async () => {
        (console.log(`[${e}] loading deps...`), A(L));
        let a = window.$,
          t = window.jQuery;
        (await w(_),
          (window.__extJQ = window.jQuery),
          (window.$ = a),
          (window.jQuery = t),
          await w(S),
          console.log(`[${e}] deps loaded`));
      })()),
      d)
    );
  }
  function M() {
    return window.__extJQ;
  }
  function k(e) {
    return e
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function E(e, a) {
    let t = M();
    if (!t || !t.fn || !t.fn.DataTable) return !1;
    let l = e;
    if (l.dataset.extDt === '1') return !1;
    let b = e.querySelector('tr');
    if (!b) return !1;
    let u = b.querySelectorAll('th');
    if (u.length === 0) return !1;
    let T = u.length,
      f = e.querySelectorAll('tr'),
      p = [];
    for (let n = 0; n < f.length; n++) {
      let r = f[n].querySelectorAll('td');
      r.length !== 0 && (r[0].hasAttribute('colspan') || p.push(f[n]));
    }
    if (p.length === 0) return !1;
    let s = [];
    for (let n of p) {
      let r = n.querySelectorAll('td'),
        i = [];
      for (let o = 0; o < r.length; o++) i.push(k(r[o].innerHTML));
      i.length === T && s.push(i);
    }
    if (s.length === 0) return !1;
    t(e).empty();
    let m = t('<thead><tr></tr></thead>');
    for (let n of u) {
      let r = n.textContent?.trim() ?? '';
      m.find('tr').append(t('<th>').text(r));
    }
    t(e).append(m);
    let x = t('<tbody></tbody>');
    for (let n of s) {
      let r = t('<tr></tr>');
      for (let i of n) r.append(t('<td>').html(i));
      x.append(r);
    }
    t(e).append(x);
    let g = [];
    for (let n of a.columns) {
      let r = { targets: n.idx };
      if (
        (n.width && (r.width = n.width),
        n.orderable === !1 && (r.orderable = !1),
        n.align && (r.className = 'dt-' + n.align),
        n.truncate)
      ) {
        let i = n.truncate;
        r.render = function (o, D) {
          return D === 'display' && typeof o == 'string' && o.length > i
            ? '<span title="' + o.replace(/"/g, '&quot;') + '">' + o.slice(0, i) + '\u2026</span>'
            : o;
        };
      }
      g.push(r);
    }
    return (
      g.push({ targets: '_all', className: 'dt-left' }),
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
        columnDefs: g,
        order: [],
        destroy: !0,
      }),
      console.log(`[${a.logPrefix}] DataTable ready \u2014 ${s.length} rows`),
      !0
    );
  }
  function h(e) {
    let a = document.querySelectorAll(e.selector),
      t = 0;
    return (
      a.forEach((l) => {
        E(l, e) && t++;
      }),
      t
    );
  }
  var c = 'RadioDT',
    R = [
      { idx: 0, label: 'No', width: '30px', orderable: !1 },
      { idx: 1, label: 'Tgl Masuk', width: '100px' },
      { idx: 2, label: 'No. Registrasi', width: '100px' },
      { idx: 3, label: 'NO RM', width: '80px' },
      { idx: 4, label: 'Nama', width: '150px', truncate: 28 },
      { idx: 5, label: 'Unit Asal', width: '110px' },
      { idx: 6, label: 'Dokter Pengirim', width: '130px', truncate: 25 },
      { idx: 7, label: 'Asuransi', width: '100px' },
      { idx: 8, label: 'Golongan', width: '80px' },
      { idx: 9, label: 'Tindakan Pemeriksaan', truncate: 35 },
      { idx: 10, label: 'Bacaan Hasil', truncate: 35 },
      { idx: 11, label: 'Hasil Foto', width: '80px', orderable: !1 },
      { idx: 12, label: 'Pegawai Input', width: '110px', truncate: 20 },
      { idx: 13, label: 'Catatan', truncate: 30 },
      { idx: 14, label: 'Status Pembayaran', width: '100px' },
      { idx: 15, label: 'Aksi', width: '80px', orderable: !1 },
      { idx: 16, label: 'Aksi', width: '80px', orderable: !1 },
    ];
  (function () {
    if (!window.location.pathname.includes('admisi/radiologi/pemeriksaan')) return;
    if (document.documentElement.getAttribute('data-ext-radio-datatables') !== '1') {
      console.log('[' + c + '] disabled');
      return;
    }
    console.log('[' + c + '] start');
    let a = { selector: 'table.tabel', columns: R, pageLength: 25, logPrefix: c };
    y(c).then(() => h(a));
    let t = null;
    new MutationObserver(() => {
      (t && clearTimeout(t), (t = setTimeout(() => h(a), 600)));
    }).observe(document.body, { childList: !0, subtree: !0 });
  })();
})();
