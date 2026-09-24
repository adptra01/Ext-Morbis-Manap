'use strict';
var __morbis_feature = (() => {
  (function () {
    'use strict';
    async function tt() {
      let H = 'ext-telaah-proc',
        _ = document.querySelector('.halaman');
      if (!_ || _.getAttribute(H)) return;
      let c = _;
      c.setAttribute(H, '1');
      let g = (t) => (t?.textContent || '').replace(/\s+/g, ' ').trim();
      function r(t) {
        return String(t ?? '').replace(
          /[&<>"']/g,
          (a) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[a],
        );
      }
      let nt =
          c.querySelector('#logo img')?.getAttribute('src') || '/assets/images/logo/Kota Jambi.png',
        w = 'RSUD H. ABDUL MANAP',
        E = [],
        v = c.querySelector('#head-cetak-logo');
      if (v) {
        let t = v.querySelector('b');
        w = t ? g(t) : w;
        let a = document.createElement('div');
        ((a.innerHTML = v.innerHTML.replace(
          /<br\s*\/?>/gi,
          `
`,
        )),
          (E = (a.textContent || '')
            .split(
              `
`,
            )
            .map((e) => e.trim())
            .filter(Boolean)
            .filter((e) => e !== w)));
      }
      let k = new Map(),
        I = [];
      c.querySelectorAll('.halaman > table:first-of-type table').forEach((t) => {
        t.querySelectorAll('tr').forEach((a) => {
          let e = a.querySelectorAll('td');
          if (e.length < 2) return;
          let n = g(e[0]),
            i = g(e[1]).replace(/^:\s*/, '');
          if ((n && !k.has(n) && k.set(n, i), /^diagnosa$/i.test(n))) {
            let l = (e[1].innerHTML || '').replace(
                /<br\s*\/?>/gi,
                `
`,
              ),
              s = document.createElement('div');
            ((s.innerHTML = l),
              (I = (s.textContent || '')
                .split(
                  `
`,
                )
                .map((o) => o.trim())
                .filter((o) => o && !/^:/.test(o) && !/tidak ada/i.test(o))));
          }
        });
      });
      let it = (t) => k.get(t) ?? '',
        R = [],
        q = Array.from(c.querySelectorAll('table.resep-item'))[1],
        z = '',
        U = '',
        b = [],
        T = [],
        M = '',
        N = '';
      async function rt() {
        let t = new URLSearchParams(window.location.search),
          a = t.get('id_resep') || t.get('id') || t.get('penjualan') || '';
        if (!a) return;
        let e = ['/inventory/resep/penerimaan/detail?id=' + a];
        for (let n of e)
          try {
            let i = await fetch(n, { credentials: 'include' });
            if (!i.ok) continue;
            let l = await i.text(),
              s = new DOMParser().parseFromString(l, 'text/html'),
              o = (d) =>
                (
                  s.querySelector('#' + d) ||
                  s.querySelector('input[name="' + d + '"]') ||
                  s.querySelector('input[id*="' + d + '"]')
                )?.value?.trim() || '';
            ((z = o('id_visit') || t.get('visit') || z),
              (U = o('id_kunjungan') || U),
              (N = o('no_sep') || N));
            let m = Array.from(s.querySelectorAll('fieldset#perhatian')).find((d) => {
              let h = d.querySelector('legend');
              return h && /riwayat\s*diagnosa\s*pasien/i.test(g(h));
            });
            if (m) {
              let d = Array.from(m.querySelectorAll('li'))
                  .map((f) => g(f))
                  .filter(Boolean),
                h = -1,
                vt = Array.from(m.querySelectorAll('strong, b'));
              for (let f of vt)
                if (/diagnosa\s*sekunder/i.test(g(f))) {
                  let Q = f.closest('li');
                  if (Q) {
                    let A = Array.from(m.querySelectorAll('li')).indexOf(Q);
                    A >= 0 && (h = A);
                  } else {
                    let A = f.nextElementSibling;
                    if (A && A.tagName === 'OL') {
                      let X = A.querySelector('li');
                      if (X) {
                        let Z = Array.from(m.querySelectorAll('li')).indexOf(X);
                        Z >= 0 && (h = Z);
                      }
                    }
                  }
                  break;
                }
              h >= 0 && h < d.length
                ? ((b = d.slice(0, h)), (T = d.slice(h).filter((f) => f && !/tidak ada/i.test(f))))
                : d.length && (b = d);
            }
            if (b.length) break;
          } catch {}
      }
      function ot(t) {
        let a = (s) => (typeof s == 'string' ? s.trim() : ''),
          e = a(t.nama_barang),
          n = a(t.kekuatan),
          i = a(t.sediaan),
          l = a(t.satuan);
        return (
          n && (e += (e ? ' ' : '') + n),
          i && (e += (e ? ', ' : '') + i),
          l && (e += (e ? ' @' : '') + l),
          e
        );
      }
      function st(t) {
        return {
          NO_R: t.no_r,
          JENIS_R: t.jenis_r,
          JENIS_RSP: t.jenis_r,
          NAMA_RACIKAN: t.nama_racikan,
          ATURAN_PAKAI_MANUAL: t.aturan_pakai_manual,
          JUMLAH_RACIKAN: t.jumlah_racikan,
          NAMA: ot(t),
          KEKUATAN_R_RACIK: t.kekuatan_r_racik,
          KEKUATAN: t.kekuatan,
          JUMLAH_R_PAKAI: t.jumlah_r_pakai,
          SEDIAAN: t.sediaan,
          JUMLAH_R_RESEP: t.jumlah_r_resep,
        };
      }
      async function lt(t) {
        try {
          let a = await fetch(
            '/inventory/search?opsi=tabel_penjualan_lama&&id_penjualan=' + encodeURIComponent(t),
            { credentials: 'include', cache: 'no-store' },
          );
          if (!a.ok) return [];
          let e = await a.json();
          return (Array.isArray(e) ? e : Object.values(e ?? {}))
            .filter((i) => typeof i == 'object' && i !== null)
            .map(st)
            .filter((i) => String(i.NO_R ?? '').trim() !== '');
        } catch {
          return [];
        }
      }
      async function ct() {
        let t = x.get('id_resep') || x.get('id') || x.get('penjualan') || '';
        if (!t) return [];
        try {
          let a = await fetch(
            '/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=' +
              encodeURIComponent(t),
            { credentials: 'include', cache: 'no-store' },
          );
          if (!a.ok) return [];
          let e = await a.json(),
            n = String(e?.ID_PENJUALAN ?? '').trim();
          if (n && n !== '0') {
            let i = await lt(n);
            if (i.length) return i;
          }
          return Array.isArray(e?.resep) ? e.resep : [];
        } catch {
          return [];
        }
      }
      function mt(t) {
        try {
          let a = new URL(t);
          if (a.protocol !== 'http:' && a.protocol !== 'https:') return !1;
          let e = a.hostname.toLowerCase();
          return ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'].includes(e)
            ? !0
            : e.endsWith('.rsudkotajambi.id') || e.endsWith('.ddev.site');
        } catch {
          return !1;
        }
      }
      async function dt(t) {
        try {
          let a = 'http://dev.rsudkotajambi.id/rs';
          try {
            let i = localStorage.getItem('ext-farmasi-app-base');
            i && mt(i) && (a = i.replace(/\/+$/, ''));
          } catch {}
          let e = await fetch(a + '/api/queue/lookup?resep_id=' + encodeURIComponent(t), {
            cache: 'no-store',
            credentials: 'omit',
          });
          if (!e.ok) return '';
          let n = await e.json();
          if (n.ok && n.found && n.queue?.queue_number) return n.queue.queue_number;
        } catch {}
        return '';
      }
      let x = new URLSearchParams(window.location.search),
        D = x.get('id_resep') || x.get('id') || x.get('penjualan') || '';
      ((M = D ? await dt(D) : ''), await rt());
      let J = await ct();
      if (J.length) {
        R.length = 0;
        let t = new Map();
        for (let a of J) {
          let e = String(a.NO_R ?? '').trim();
          e && (t.has(e) || t.set(e, []), t.get(e).push(a));
        }
        for (let [a, e] of t) {
          let n = e[0],
            i =
              String(n.JENIS_R ?? '').toLowerCase() === 'racikan' ||
              String(n.JENIS_RSP ?? '').toLowerCase() === 'racikan',
            l = String(n.NAMA_RACIKAN ?? '').trim(),
            o = String(n.ATURAN_PAKAI_MANUAL ?? '')
              .trim()
              .replace(/^-\s*/, '')
              .trim();
          if (i || e.length > 1) {
            let u = {
              no: 'R/' + a,
              name: l || '',
              jml: '',
              jumlahJadi: String(n.JUMLAH_RACIKAN ?? '').trim() || '',
              sediaan: l,
              aturan: o ? [o] : [],
              subMeds: e.map((m) => ({
                name: String(m.NAMA ?? '').trim(),
                strength: String(m.KEKUATAN_R_RACIK ?? m.KEKUATAN ?? '').trim(),
                dose: '',
                jmlPerR: String(m.JUMLAH_R_PAKAI ?? '').trim(),
                sediaan: String(m.SEDIAAN ?? '').trim(),
              })),
            };
            R.push(u);
          } else {
            let u = {
              no: 'R/' + a,
              name: String(n.NAMA ?? '').trim(),
              jml: String(n.JUMLAH_R_RESEP ?? n.JUMLAH_R_PAKAI ?? '').trim(),
              jumlahJadi: '',
              sediaan: String(n.SEDIAAN ?? '').trim(),
              aturan: o ? [o] : [],
              subMeds: [],
            };
            R.push(u);
          }
        }
      }
      !b.length && I.length && (b = I);
      let K = c.querySelector('#form_checklist_telaah_resep'),
        C = (t) => {
          let a = [];
          if (!K) return a;
          let e = Array.from(K.querySelectorAll('table')).find(
            (n) => g(n.querySelector('tr td')) === t,
          );
          return (
            e &&
              e.querySelectorAll('tr').forEach((n, i) => {
                if (i === 0) return;
                let l = n.querySelectorAll('td');
                if (l.length < 2) return;
                let s = g(l[0]),
                  o = g(l[1]);
                s && o && o !== t && a.push([s, o]);
              }),
            a
          );
        },
        pt = C('Telaah Resep'),
        gt = C('Telaah Obat'),
        O = Array.from(c.querySelectorAll('center, strong')).find((t) =>
          /Obat tidak boleh diganti/i.test(g(t)),
        ),
        ht = O ? g(O) : 'Obat tidak boleh diganti tanpa sepengetahuan Dokter',
        L = (t, a, e = '', n = '') =>
          '<div class="tm-row' +
          (n ? ' ' + n : '') +
          '"><span class="tm-label">' +
          r(t) +
          ':</span><span class="tm-val' +
          (e ? ' ' + e : '') +
          '">' +
          (a && a.trim() ? r(a) : '-') +
          '</span></div>',
        B = [...(b.length ? [b.join(', ')] : []), ...(T.length ? [T.join(', ')] : [])],
        p = (t) => it(t),
        S = p('Jenis Kelamin'),
        ut = /^perempuan$/i.test(S) ? 'P' : /^laki-laki$/i.test(S) ? 'L' : S,
        ft = (p('Nama Pasien') || '-') + (S ? ' (' + ut + ')' : ''),
        bt = (p('Dokter') || '-') + (p('Ruangan/Poli') ? ' / ' + p('Ruangan/Poli') : ''),
        $ = (t) => {
          for (let a of k.keys()) if (t.test(a)) return k.get(a) || '';
          return '';
        },
        F = $(/alergi/i),
        y = $(/berat|\bbb\b/i),
        G = y ? (/\bkg\b/i.test(y) ? y : y + ' kg') : '- kg',
        xt = (F || '-') + ' / ' + (y ? 'BB ' + G : G),
        At = [
          ['Pasien', ft, ''],
          ['No. RM', p('No. RM'), ''],
          ['Tgl. Lahir', p('Tgl. Lahir/Umur'), ''],
          ['Alergi & BB', xt, ''],
          ['Alamat', p('Alamat'), 'long'],
          ['No HP', p('No HP'), ''],
        ],
        kt = [
          ['Dokter', bt, ''],
          ['SIP Dokter', p('SIP Dokter'), ''],
          ['No Resep', p('No Resep'), ''],
          ['No SEP', N || '-', ''],
          ['Tanggal', p('Tanggal & Jam'), ''],
          ['Penjamin', p('Penjamin'), ''],
        ],
        yt = L('Diagnosa', B.length ? B.join(', ') : '-', '', 'long'),
        wt =
          '<section class="tm-card tm-card--small tm-card--left"><div class="tm-col">' +
          At.map(([t, a, e]) => L(t, a, '', e)).join('') +
          yt +
          '</div></section>',
        Rt =
          '<section class="tm-card tm-card--right"><div class="tm-col">' +
          kt.map(([t, a, e]) => L(t, a, '', e)).join('') +
          '</div></section>',
        St = R.map((t) => {
          if (t.subMeds.length) {
            let e = t.subMeds
                .map((u, m) => {
                  let d = u.jmlPerR || '';
                  return (
                    '<div class="med-line' +
                    (m > 0 ? ' indent' : '') +
                    '">' +
                    (m === 0 ? '<span class="med-no">' + r(t.no) + '</span> ' : '') +
                    '<span class="med-name">' +
                    r(u.name) +
                    '</span>' +
                    (d ? ', <span class="med-jml">Jml: ' + r(d) + '</span>' : '') +
                    '</div>'
                  );
                })
                .join(''),
              n = t.jumlahJadi ? r(t.jumlahJadi) : '',
              i = t.sediaan ? r(t.sediaan) : 'Racikan',
              l = t.aturan.length
                ? t.aturan.map((u) => r(u.replace(/^\(|\)$/g, ''))).join(' ')
                : '',
              s = n ? 'Jml ' + n + ' ' + i + (l ? ' - (' + l + ')' : '') : '',
              o = s ? '<div class="med-jadiracik">' + s + '</div>' : '';
            return '<div class="med">' + e + o + '</div>';
          }
          let a = t.jml || '';
          return (
            '<div class="med"><div class="med-line"><span class="med-no">' +
            r(t.no) +
            '</span> <span class="med-name">' +
            r(t.name) +
            '</span>' +
            (a ? ', <span class="med-jml">Jml: ' + r(a) + '</span>' : '') +
            '</div>' +
            (t.aturan.length
              ? '<div class="med-aturan">' + t.aturan.map((e) => r(e)).join('<br/>') + '</div>'
              : '') +
            '</div>'
          );
        }).join(''),
        j = q
          ? Array.from(q.querySelectorAll('tr:first-child td'))
              .map((t) => g(t))
              .filter(Boolean)
          : ['Hitung', 'Timbang', 'Kemas'];
      j.some((t) => /paraf/i.test(t)) || j.push('Paraf');
      let jt = j.length,
        _t =
          '<table class="t-admin"><thead><tr>' +
          j.map((t) => '<th class="l">' + r(t) + '</th>').join('') +
          '</tr></thead><tbody><tr>' +
          Array.from({ length: jt })
            .map(() => '<td class="blk"></td>')
            .join('') +
          '</tr></tbody></table>',
        V = (t, a) =>
          '<table class="t-check"><thead><tr><th class="l" colspan="2">' +
          r(t) +
          '</th><th class="yt">Y/T</th></tr></thead><tbody>' +
          a
            .map(
              ([e, n]) =>
                '<tr><td class="num">' +
                r(e) +
                '</td><td>' +
                r(n) +
                '</td><td class="yt"></td></tr>',
            )
            .join('') +
          '</tbody></table>',
        Et =
          '<header class="t-head"><img class="t-logo" alt="Logo" src="' +
          r(nt) +
          '"/><div class="t-bhead"><h1 class="t-hname">' +
          r(w) +
          '</h1>' +
          (E[0] ? '<div class="t-hsub">' + r(E[0]) + '</div>' : '') +
          '</div>' +
          (M
            ? '<div class="t-antrian">' +
              r(
                M.replace(
                  /^(.*?)(\d+)$/,
                  `$1
$2`,
                ),
              ) +
              '</div>'
            : '') +
          '</header><main class="t-main"><section class="t-left">' +
          wt +
          '<div class="t-meds">' +
          St +
          '</div>' +
          _t +
          '</section><section class="t-right">' +
          Rt +
          V('Telaah Resep', pt) +
          V('Telaah Obat', gt) +
          '<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>' +
          '</section></main><footer class="t-footer">' +
          r(ht) +
          '</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';
      c.innerHTML = Et;
      let W = 866;
      c.scrollHeight > W &&
        (c.classList.add('compact'),
        c.offsetHeight,
        c.scrollHeight > W && (c.classList.remove('compact'), c.classList.add('ultra')));
      let Y = 'ext-telaah-style';
      if (!document.getElementById(Y)) {
        let t = document.createElement('style');
        ((t.id = Y),
          (t.textContent = `
        /* === PRINT CONTRACT: 105mm \xD7 241mm === */
        .halaman{box-sizing:border-box;width:105mm!important;height:auto!important;max-height:241mm;margin:0!important;padding:0 3mm}
        @page{size:105mm 241mm;margin:0}
        .halaman *{box-sizing:border-box;font-size:11px!important}
        .halaman{font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

        /* HEADER 3 kolom: logo | brand & alamat | no antrian */
        .t-head{display:flex;align-items:center;padding-bottom:6px;border-bottom:1.5px solid #000;margin-bottom:8px;gap:10px}
        .t-logo{width:50px;height:50px;object-fit:contain;object-position:left top;flex:none}
        .t-bhead{flex:1;font-size:11px;min-width:0}
        .t-hname{font-size:12px;font-weight:800;margin:0 0 2px;letter-spacing:-.01em}
        .t-hsub{line-height:1.2;font-size:10px}
        .t-antrian{flex:none;text-align:right;font-size:36px!important;font-weight:800;color:#198754;letter-spacing:-.02em;font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere;line-height:1;white-space:pre-line}

        /* METADATA \u2014 grid: label kiri, nilai kanan (efisien tinggi) */
        .tm-card{background:#fff;padding:2px 0 4px;margin-bottom:4px;font-size:11px;border-bottom:0.5pt solid #333}
        .tm-card--small .tm-label{font-size:9px!important}
        .tm-card--small .tm-val{font-size:10px!important}
        .tm-col{display:flex;flex-direction:column;gap:3px}
        .tm-row{display:grid;grid-template-columns:35% 65%;column-gap:4px;align-items:start}
        .tm-card--left .tm-row{grid-template-columns:20% 65%}
        .tm-card--right .tm-row{grid-template-columns:30% 65%}
        .tm-label{color:#5b6470;font-size:10px;line-height:1.25;text-align:left}
        .tm-val{color:#000;line-height:1.25;word-wrap:break-word;overflow-wrap:anywhere}
        /* field panjang (alamat, diagnosa) tetap di grid 2 kolom biar wrap di kanan */
        .tm-row.long{display:grid}
        .tm-row.long .tm-label{display:block}

        /* MAIN 2 kolom \u2014 kiri lebih lebar utk nama obat */
        .t-main{display:grid;grid-template-columns:62% 38%;gap:6px;align-items:start}
        .t-left,.t-right{display:flex;flex-direction:column;gap:5px;min-width:0}
        .t-right .t-check{margin-bottom:0}
        .t-meds{margin-bottom:8px;font-size:11px;min-width:0}

        /* DAFTAR OBAT */
        .med{margin-bottom:6px}
        .med-line{font-size:11px;line-height:1.35;text-align:left}
        .med-line.indent{margin-left:0}
        .med-no{font-weight:400}
        .med-name{font-weight:600}
        .med-sep{color:#374151}
        .med-jml{white-space:nowrap;font-weight:600;color:#047857}
        .med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}
        .med-jadiracik{margin-top:3px;padding-top:1px;font-size:11px;font-weight:700}

        /* TABEL \u2014 checklist (font sama dengan info pasien & dokter = 10px) */
        table{width:100%;border-collapse:collapse;font-size:10px}
        .halaman th,.halaman td{border:0.5pt solid #333;padding:1px 3px;font-weight:400;font-size:10px!important;line-height:1.2}
        thead th{font-weight:400}
        .yt{width:32px;text-align:center}
        .num{width:16px;text-align:center}
        .l{text-align:left}
        .c{text-align:center}
        .half{width:50%}
        .third{width:33.333%}
        .twothird{width:66.667%}
        .blk{height:40px;padding:.5pt 3px}
        .blk2{min-height:10px}
        .blk3{min-height:35px}
        .blk4{height:40px;padding:.5pt 3px}
        .t-sub{text-align:center;font-size:10px!important;margin:3px 0}

        /* FOOTER + BUTTON */
        .t-footer{margin-top:10px;text-align:center;font-weight:700;font-style:italic;font-size:11px}
        .t-print{margin-top:24px;display:flex;gap:8px}
        .t-btn{border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:6px 14px;font-size:11px;cursor:pointer}
        .t-btn:hover{background:#f9fafb}
        @media print{.no-print{display:none!important}}

        /* === ADAPTIVE DENSITY (gentle fallback) === */
        .halaman.compact .t-head{padding-bottom:4px;margin-bottom:6px;gap:8px}
        .halaman.compact .t-logo{width:45px;height:45px}
        .halaman.compact .t-hname{font-size:11px!important}
        .halaman.compact .t-antrian{font-size:30px!important}
        .halaman.compact .tm-card{padding:1px 0 2px;margin-bottom:2px}
        .halaman.compact .tm-col{gap:2px}
        .halaman.compact .tm-label{font-size:9px!important}
        .halaman.compact .tm-val{font-size:10px!important}
        .halaman.compact .t-main{gap:4px}
        .halaman.compact .t-left,.halaman.compact .t-right{gap:3px}
        .halaman.compact .t-meds{margin-bottom:4px}
        .halaman.compact .med{margin-bottom:3px}
        .halaman.compact .blk{height:30px}
        .halaman.compact .blk3{min-height:25px}
        .halaman.compact .blk4{height:30px}
        .halaman.compact .t-footer{margin-top:6px}

        .halaman.ultra .t-head{padding-bottom:3px;margin-bottom:4px;gap:6px}
        .halaman.ultra .t-logo{width:40px;height:40px}
        .halaman.ultra .t-hname{font-size:10px!important}
        .halaman.ultra .t-antrian{font-size:26px!important}
        .halaman.ultra .tm-card{padding:1px 0;margin-bottom:1px}
        .halaman.ultra .tm-col{gap:1px}
        .halaman.ultra .tm-label{font-size:8px!important}
        .halaman.ultra .tm-val{font-size:9px!important}
        .halaman.ultra .t-main{gap:3px}
        .halaman.ultra .t-left,.halaman.ultra .t-right{gap:2px}
        .halaman.ultra .t-meds{margin-bottom:2px}
        .halaman.ultra .med{margin-bottom:2px}
        .halaman.ultra .med-line{font-size:10px!important}
        .halaman.ultra .blk{height:30px}
        .halaman.ultra .blk3{min-height:20px}
        .halaman.ultra .blk4{height:30px}
        .halaman.ultra .t-footer{margin-top:4px;font-size:10px!important}
      `),
          document.head.appendChild(t));
      }
    }
    let et = tt,
      at = Date.now(),
      P = window.setInterval(() => {
        document.documentElement.getAttribute('data-ext-telaah') === '1'
          ? (window.clearInterval(P), et())
          : Date.now() - at > 5e3 && window.clearInterval(P);
      }, 200);
  })();
})();
