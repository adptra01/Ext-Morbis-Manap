'use strict';
var __morbis_feature = (() => {
  (function () {
    'use strict';
    let u = 'ext-telaah-proc',
      h = document.querySelector('.halaman');
    if (!h || h.getAttribute(u)) return;
    let r = h,
      l = (t) => (t?.textContent || '').replace(/\s+/g, ' ').trim();
    function n(t) {
      return String(t ?? '').replace(
        /[&<>"']/g,
        (e) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[e],
      );
    }
    let M =
        r.querySelector('#logo img')?.getAttribute('src') || '/assets/images/logo/Kota Jambi.png',
      d = 'RSUD H. ABDUL MANAP',
      g = [],
      b = r.querySelector('#head-cetak-logo');
    if (b) {
      let t = b.querySelector('b');
      d = t ? l(t) : d;
      let e = document.createElement('div');
      ((e.innerHTML = b.innerHTML.replace(
        /<br\s*\/?>/gi,
        `
`,
      )),
        (g = (e.textContent || '')
          .split(
            `
`,
          )
          .map((a) => a.trim())
          .filter(Boolean)
          .filter((a) => a !== d)));
    }
    let f = new Map();
    r.querySelectorAll('.halaman > table:first-of-type table').forEach((t) => {
      t.querySelectorAll('tr').forEach((e) => {
        let a = e.querySelectorAll('td');
        if (a.length < 2) return;
        let s = l(a[0]),
          o = l(a[1]).replace(/^:\s*/, '');
        s && !f.has(s) && f.set(s, o);
      });
    });
    let D = ['Dokter', 'SIP Dokter', 'Ruangan/Poli'],
      R = [
        'No Resep',
        'Tanggal & Jam',
        'No. RM',
        'Nama Pasien',
        'Jenis Kelamin',
        'Tgl. Lahir/Umur',
        'No HP',
        'Penjamin',
        'Berat Badan',
        'Riwayat Alergi',
        'Alamat',
      ],
      x = (t) => f.get(t) ?? '',
      y = Array.from(r.querySelectorAll('table.resep-item')),
      k = y[0],
      A = [];
    if (k) {
      let t = null;
      k.querySelectorAll('tr').forEach((e) => {
        let a = e.querySelectorAll('td'),
          s = l(a[0]),
          o = a[1],
          i = l(o);
        if (/^R\/\d+/.test(s)) {
          t = { no: s, name: '', jml: '', aturan: [] };
          let c = o ? Array.from(o.querySelectorAll('p')) : [];
          t.name = c.length ? (c[0]?.textContent || i).trim() : i;
          let H = (c.length ? ((c[1] || c[0]).textContent || '').trim() : '').match(
            /Jml\s*:\s*(.+)/i,
          );
          ((t.jml = H ? H[1].trim() : ''), A.push(t));
        } else t && i && t.aturan.push(i);
      });
    }
    let w = y[1],
      T = r.querySelector('#form_checklist_telaah_resep'),
      j = (t) => {
        let e = [];
        if (!T) return e;
        let a = Array.from(T.querySelectorAll('table')).find(
          (s) => l(s.querySelector('tr td')) === t,
        );
        return (
          a &&
            a.querySelectorAll('tr').forEach((s, o) => {
              if (o === 0) return;
              let i = s.querySelectorAll('td');
              if (i.length < 2) return;
              let c = l(i[0]),
                p = l(i[1]);
              c && p && p !== t && e.push([c, p]);
            }),
          e
        );
      },
      z = j('Telaah Resep'),
      L = j('Telaah Obat'),
      E = Array.from(r.querySelectorAll('center, strong')).find((t) =>
        /Obat tidak boleh diganti/i.test(l(t)),
      ),
      P = E ? l(E) : 'Obat tidak boleh diganti tanpa sepengetahuan Dokter',
      S = (t, e, a = '') =>
        '<div class="tm-row"><span class="tm-label">' +
        n(t) +
        '</span><span class="tm-val' +
        (a ? ' ' + a : '') +
        '">' +
        (e && e.trim() ? n(e) : '-') +
        '</span></div>',
      O =
        '<section class="tm-card"><div class="tm-col">' +
        R.map((t) => S(t, x(t))).join('') +
        '</div></section>',
      I =
        '<section class="tm-card"><div class="tm-col">' +
        D.map((t) => S(t, x(t))).join('') +
        '</div></section>',
      C = A.map(
        (t) =>
          '<div class="med"><div class="med-head"><span class="med-txt"><span class="med-no">' +
          n(t.no) +
          '</span> <span class="med-name">' +
          n(t.name) +
          '</span></span>' +
          (t.jml ? '<span class="med-jml">Jml: ' + n(t.jml) + '</span>' : '') +
          '</div>' +
          (t.aturan.length
            ? '<div class="med-aturan">' + t.aturan.map((e) => n(e)).join('<br/>') + '</div>'
            : '') +
          '</div>',
      ).join(''),
      m = w
        ? Array.from(w.querySelectorAll('tr:first-child td'))
            .map((t) => l(t))
            .filter(Boolean)
        : ['Hitung', 'Timbang', 'Kemas'];
    m.some((t) => /paraf/i.test(t)) || m.push('Paraf');
    let N = m.length,
      B =
        '<table class="t-admin"><thead><tr>' +
        m.map((t) => '<th class="l">' + n(t) + '</th>').join('') +
        '</tr></thead><tbody><tr>' +
        Array.from({ length: N })
          .map(() => '<td class="blk"></td>')
          .join('') +
        '</tr></tbody></table>',
      v = (t, e) =>
        '<table class="t-check"><thead><tr><th class="l" colspan="2">' +
        n(t) +
        '</th><th class="yt">Y</th><th class="yt">T</th></tr></thead><tbody>' +
        e
          .map(
            ([a, s]) =>
              '<tr><td class="num">' + n(a) + '</td><td>' + n(s) + '</td><td></td><td></td></tr>',
          )
          .join('') +
        '</tbody></table>',
      _ =
        '<div class="t-sub">Persetujuan Perubahan Resep</div><table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk2"></td><td class="blk2"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk2"></td><td class="blk2"></td></tr></tbody></table>',
      F =
        '<table class="t-check"><thead><tr><th class="c" colspan="2">Waktu Tunggu</th></tr></thead><tbody><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr></tbody></table>',
      J =
        '<table class="t-check"><thead><tr><th class="c" colspan="2">Edukasi</th><th class="yt"></th></tr></thead><tbody>' +
        [
          ['1', 'Nama Obat'],
          ['2', 'Kegunaan Obat'],
          ['3', 'Dosis&Sediaan Obat'],
          ['4', 'Rute & cara pakai'],
          ['5', 'Cara penyimpanan'],
          ['6', 'Efek samping'],
          ['7', 'Alergi obat'],
        ]
          .map(([t, e]) => '<tr><td class="num">' + t + '</td><td>' + e + '</td><td></td></tr>')
          .join('') +
        '</tbody></table>',
      K =
        '<header class="t-head"><img class="t-logo" alt="Logo" src="' +
        n(M) +
        '"/><div class="t-bhead"><h1 class="t-hname">' +
        n(d) +
        '</h1>' +
        (g[0] ? '<div class="t-hsub">' + n(g[0]) + '</div>' : '') +
        '</div></header><main class="t-main"><section class="t-left">' +
        O +
        '<div class="t-meds">' +
        C +
        '</div>' +
        B +
        '</section><section class="t-right">' +
        I +
        v('Telaah Resep', z) +
        v('Telaah Obat', L) +
        _ +
        F +
        J +
        '<table class="t-check"><tbody><tr><td class="twothird">Paraf dan Nama<br/>Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>' +
        '</section></main><footer class="t-footer">' +
        n(P) +
        '</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';
    (r.setAttribute(u, '1'), (r.innerHTML = K));
    let q = 'ext-telaah-style';
    if (!document.getElementById(q)) {
      let t = document.createElement('style');
      ((t.id = q),
        (t.textContent = `
      .halaman{box-sizing:border-box;width:105mm!important;height:auto!important;margin:0!important;padding:0 3mm}
      @page{size:105mm 241mm;margin:0}
      .halaman *{box-sizing:border-box;font-size:11px!important}
      .halaman{font-family:'Inter',Arial,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

      /* HEADER (priority: items-center, logo 80px) */
      .t-head{display:flex;align-items:center;padding-bottom:8px;border-bottom:1.5px solid #000;margin-bottom:12px;gap:14px}
      .t-logo{width:80px;height:80px;object-fit:contain;object-position:left top;flex:none}
      .t-bhead{flex:1;font-size:11px}
      .t-hname{font-size:13px;font-weight:800;margin:0 0 4px;letter-spacing:-.01em}
      .t-hsub{line-height:1.3}

/* METADATA \u2014 tanpa border, tanpa bold. Label kecil di atas, nilai di bawah
      (stacked) sehingga isi bisa memanjang. Pasien kiri & dokter kanan. */
      .tm-card{background:#fff;padding:4px 0;margin-bottom:6px;font-size:11px}
      .tm-col{display:flex;flex-direction:column;gap:5px}
      .tm-row{display:flex;flex-direction:column;gap:1px}
      .tm-label{color:#5b6470;font-size:10px;line-height:1.2}
      .tm-val{color:#000;line-height:1.3;word-wrap:break-word}

      /* MAIN 2 kolom \u2014 portrait 105mm: kolom lebih ramping, gap kecil */
      .t-main{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}
      .t-left,.t-right{display:flex;flex-direction:column;gap:6px}
      .t-right .t-check{margin-bottom:0}

      /* DAFTAR OBAT */
      .t-meds{margin-bottom:16px;font-size:11px}
      .med{margin-bottom:7px}
      .med-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
      .med-no{font-weight:400}
      .med-name{font-weight:700}
      .med-jml{white-space:nowrap;font-weight:400}
      .med-aturan{margin-left:0}

      /* TABEL \u2014 checklist */
      table{width:100%;border-collapse:collapse;font-size:11px}
      th,td{border:0.5pt solid #333;padding:1px 3px;font-weight:400;font-size:11px;line-height:11px}
      thead th{font-weight:400}
      .yt{width:18px;text-align:center}
      .num{width:16px;text-align:center}
      .l{text-align:left}
      .c{text-align:center}
      .half{width:50%}
      .third{width:33.333%}
      .twothird{width:66.667%}
      .blk{height:28px}
      .blk2{height:11px}
      .blk3{height:24px}
      .t-sub{text-align:center;font-size:11px;margin:4px 0}

      /* FOOTER + BUTTON */
      .t-footer{margin-top:14px;text-align:center;font-weight:700;font-style:italic;font-size:11px}
      .t-print{margin-top:32px;display:flex;gap:8px}
      .t-btn{border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:8px 16px;font-size:11px;cursor:pointer}
      .t-btn:hover{background:#f9fafb}
      @media print{.no-print{display:none!important}}
    `),
        document.head.appendChild(t));
    }
    if (!document.querySelector('link[href*="family=Inter"]')) {
      let t = document.createElement('link');
      ((t.rel = 'stylesheet'),
        (t.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'),
        document.head.appendChild(t));
    }
  })();
})();
