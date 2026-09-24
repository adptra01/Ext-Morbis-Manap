'use strict';
var __morbis_feature = (() => {
  (function () {
    'use strict';
    async function Y() {
      let D = 'ext-pa-print-proc';
      if (document.documentElement.getAttribute(D)) return;
      document.documentElement.setAttribute(D, '1');
      let g = (t) => y(t?.textContent || '');
      function z(t) {
        return t.replace(/<[^>]+>/g, ' ');
      }
      function Z(t) {
        return t.replace(/\b(?:KH\.?|H\.)\s*(?=ABDUL\s+MANAP)/gi, 'H. ');
      }
      function y(t) {
        return Z(t)
          .replace(
            /\b(?:Notice|Warning|Fatal error|Parse error|Deprecated)\s*:[\s\S]*?\.php\s*on\s*line\s*\d+/gi,
            ' ',
          )
          .replace(/\b(?:Notice|Warning)\s*:\s*Undefined\s+(?:index|variable)\s*:.*$/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      function s(t) {
        return String(t ?? '').replace(
          /[&<>"']/g,
          (e) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[e],
        );
      }
      let q =
          document.querySelector('#logo img')?.getAttribute('src') ||
          '/assets/images/logo/Kota Jambi.png',
        v = Array.from(document.querySelectorAll('h1.kop-atas'))
          .map((t) => g(t))
          .filter(Boolean);
      for (; v.length < 3;) v.push('');
      let w = [],
        M = document.querySelector('#head-cetak-logo center, #head-cetak-logo');
      if (M) {
        let t = document.createElement('div');
        ((t.innerHTML = M.innerHTML),
          t.querySelectorAll('h1').forEach((e) => e.remove()),
          (w = (t.innerHTML || '')
            .split(/<br\s*\/?>/gi)
            .map((e) => t.textContent && e.replace(/<[^>]+>/g, '').trim())
            .map((e) => String(e || '').trim())
            .filter(Boolean)));
      }
      let A = w.join(' '),
        U = (t) => {
          let e = A.match(new RegExp(t + '\\s*:([\\d\\s().+-]+)', 'i'));
          return e ? e[1].trim() : '';
        },
        B = U('telp'),
        N = U('fax'),
        E = (A.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/) || [''])[0],
        S = (A.match(/https?:\/\/[^\s;,]+/) || [''])[0],
        h = A.replace(/telp\s*:[\d\s().+-]+/gi, '')
          .replace(/fax\s*:[\d\s().+-]+/gi, '')
          .replace(/website\s*:?/gi, '')
          .replace(/email\s*:?/gi, '');
      (E && (h = h.split(E).join('')),
        S && (h = h.split(S).join('')),
        (h = h
          .split(/[;]+/)
          .map((t) => t.replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(', ')
          .replace(/,\s*,+/g, ',')
          .replace(/^[,;\s]+|[,;\s]+$/g, '')));
      let tt = ['Alamat: ' + h, B ? 'Telp: ' + B : '', N ? 'Fax: ' + N : '']
          .filter(Boolean)
          .join(', '),
        et = [E ? 'Email: ' + E : '', S ? 'Website: ' + S : ''].filter(Boolean).join(', ');
      w = [tt, et].filter(Boolean);
      let R = g(document.querySelector('.head-cetak-instansi')) || 'LAPORAN HASIL PEMERIKSAAN',
        T = [];
      document.querySelectorAll('.table-outer tr').forEach((t) => {
        let e = t.querySelectorAll('td');
        if (e.length >= 6) {
          let i = g(e[0]),
            l = g(e[2]),
            p = g(e[3]),
            a = g(e[5]);
          (i && T.push([i, l]), p && T.push([p, a]));
        }
      });
      let b = ['makroskopik', 'mikroskopik', 'kesimpulan', 'icdo', 'catatan', 'saran'],
        u = (t) =>
          t
            .toLowerCase()
            .replace(/0/g, 'o')
            .replace(/[^a-z]/g, ''),
        f = [];
      document.querySelectorAll('.contentlab td').forEach((t) => {
        let e = '',
          i = !1,
          l = t.querySelector('.section-title');
        if (l) ((e = g(l)), (i = !0));
        else {
          let r = (m) => m.split(':')[0].trim();
          for (let m of Array.from(t.children).slice(0, 3)) {
            let d = g(m);
            if (d && d.length <= 24 && b.includes(u(r(d)))) {
              e = r(d);
              break;
            }
          }
          if (!e) {
            let m =
              (t.textContent || '')
                .split(
                  `
`,
                )
                .map((d) => d.trim())
                .find(Boolean) || '';
            m && b.includes(u(r(m))) && (e = r(m));
          }
          if (!e) return;
        }
        let p = document.createElement('div');
        ((p.innerHTML = t.innerHTML), p.querySelector('.section-title')?.remove());
        let a = p.innerHTML
            .replace(
              /\r\n?/g,
              `
`,
            )
            .replace(
              /<br\s*\/?>[ \t]*\n?/gi,
              `
`,
            )
            .replace(/\n(?:[ \t]*\n)+/g, '\u2028')
            .split('\u2028')
            .map((r) =>
              r
                .split(/<br\s*\/?>|\n/)
                .map((m) => y(m.replace(/<[^>]+>/g, ' ')))
                .filter(Boolean),
            )
            .filter((r) => r.length),
          c = [],
          n = [];
        a.forEach((r, m) => {
          r.forEach((d, P) => {
            (m > 0 && P === 0 && c.length && n.push(c.length), c.push(d));
          });
        });
        let o = c;
        if (!i && o.length && u(o[0]) === u(e)) {
          o.shift();
          for (let r = 0; r < n.length; r++) n[r] -= 1;
          for (; n.length && n[0] <= 0;) n.shift();
        }
        (o.length > 1 &&
          !/^[IVXLC]+\.\s/.test(o[0]) &&
          o.slice(1).some((r) => /^II\.\s/.test(r)) &&
          (o[0] = 'I. ' + o[0]),
          e && f.push({ title: e, items: o, para: n }));
      });
      let nt = /^catatan\s*:?/i,
        it = /^icd[\s-]*o\b\s*:?/i,
        I = [];
      for (let t of f) {
        let e = [{ title: t.title, items: [], para: [] }],
          i = e[0],
          l = !1,
          p = (a, c) => {
            ((i = { title: a, items: [], para: [], bare: c }), e.push(i), (l = !0));
          };
        if (
          (t.items.forEach((a, c) => {
            let n = a.match(nt),
              o = n ? null : a.match(it);
            if (n) {
              u(i.title) !== 'catatan' && p('Catatan');
              let r = a.slice(n[0].length).trim();
              r && (t.para.includes(c) && i.para.push(i.items.length), i.items.push(r));
              return;
            }
            if (o) {
              (u(i.title) !== 'icdo' && p('ICD-0', !0),
                t.para.includes(c) && i.para.push(i.items.length),
                i.items.push(a));
              return;
            }
            (t.para.includes(c) && i.para.push(i.items.length), i.items.push(a));
          }),
          l)
        )
          for (let a of e) a.items.length && I.push(a);
        else I.push(e[0]);
      }
      ((f.length = 0),
        f.push(...I),
        f.forEach((t, e) => (t._i = e)),
        f.sort((t, e) => {
          let i = t._i ?? 0,
            l = e._i ?? 0,
            p = b.indexOf(u(t.title)),
            a = b.indexOf(u(e.title)),
            c = p === -1 ? b.length : p,
            n = a === -1 ? b.length : a;
          return c !== n ? c - n : i - l;
        }));
      function at(t) {
        let e = '';
        t instanceof HTMLSelectElement
          ? (e = (
              (t.selectedIndex >= 0 ? t.options[t.selectedIndex] : void 0)?.textContent ||
              t.value ||
              ''
            ).trim())
          : (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) &&
            (e = (t.value || '').trim());
        let i = (t.getAttribute('name') || '') + ' ' + (t.getAttribute('id') || ''),
          l = t.getAttribute('placeholder') || '',
          p = t.closest('tr, .form-group, .form-row, div')?.textContent || '';
        return { val: e, ctx: (i + ' ' + l + ' ' + p).slice(0, 300) };
      }
      function ot(t, e, i) {
        let l = e
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(
            (n) =>
              n.length >= 4 &&
              !/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(
                n,
              ),
          );
        if (!l.length) return '';
        let p = l.sort((n, o) => o.length - n.length)[0],
          a = '',
          c = -1;
        return (
          t.querySelectorAll('input, textarea, select').forEach((n) => {
            let { val: o, ctx: r } = at(n);
            if (!o || o === e || !o.toLowerCase().includes(p)) return;
            let m = i.test(r) ? 2 : 0;
            m > c && ((c = m), (a = o));
          }),
          a
        );
      }
      function rt(t, e) {
        return (t.querySelector(e)?.value || '').trim();
      }
      async function st(t) {
        let e = new URLSearchParams(window.location.search).get('id');
        if (!e) return;
        let i = (n) => /ket\w*\s*klinis/i.test(n),
          l = (n) => /^dokter/i.test(n) || /^rs\b/i.test(n),
          p = t
            .map(([n, o], r) => ({ label: n, value: o, idx: r }))
            .filter((n) => (l(n.label) ? !!n.value : i(n.label)));
        if (!p.length) return;
        let a = new AbortController(),
          c = window.setTimeout(() => a.abort(), 6e3);
        try {
          let n = new URL(
              '/laboratorium/input-hasil/input-hasil-pa?id_lab=' + encodeURIComponent(e),
              window.location.href,
            ),
            o = await fetch(n.toString(), { credentials: 'same-origin', signal: a.signal });
          if (!o.ok) {
            window.console.info('[paPrint] override: fetch input status ' + o.status);
            return;
          }
          let r = await o.text(),
            m = new DOMParser().parseFromString(r, 'text/html');
          window.console.info(
            '[paPrint] override: input title="' +
              (m.title || '').slice(0, 60) +
              '" len=' +
              r.length +
              ' fields=' +
              m.querySelectorAll('input, textarea, select').length,
          );
          for (let d of p) {
            if (i(d.label)) {
              let ft = rt(
                  m,
                  '#keterangan_klinis, textarea[name="keterangan_klinis"], input[name="keterangan_klinis"]',
                ),
                j = y(z(ft));
              (window.console.info(
                '[paPrint] override: ' + d.label + ' cetak="' + d.value + '" input="' + j + '"',
              ),
                j && j !== d.value && (t[d.idx][1] = j));
              continue;
            }
            let P = /^dokter/i.test(d.label)
                ? /dokter|pengirim|luar|dalam|rujuk/i
                : /rs\b|rumah\s*sakit|faskes|asal/i,
              ut = ot(m, d.value, P),
              C = y(z(ut || ''));
            (window.console.info(
              '[paPrint] override: ' + d.label + ' cetak="' + d.value + '" input="' + C + '"',
            ),
              C && C !== d.value && (t[d.idx][1] = C));
          }
        } catch {
          window.console.info('[paPrint] override: fetch gagal, pakai nilai server');
        } finally {
          window.clearTimeout(c);
        }
      }
      await st(T).catch(() => {});
      let x = Array.from(document.querySelectorAll('.contentlab ~ div table td'))
          .map((t) => g(t))
          .filter(Boolean),
        _ = x[0] || '',
        O = x[1] || '',
        L = document.querySelector('.contentlab ~ div table img')?.getAttribute('src') || '',
        K = x.find((t) => /^\(.*\)$/.test(t)) || x[2] || '',
        F = x.find((t) => /^nip\.?/i.test(t)) || x[3] || '',
        W =
          document.querySelector('a.tombol[href*="export"]')?.getAttribute('href') ||
          window.location.href + '&export=word',
        lt = Array.from(document.body.querySelectorAll('script')),
        ct = (t) =>
          t
            .toLowerCase()
            .split(/\s+/)
            .map((e) => e && e.charAt(0).toUpperCase() + e.slice(1))
            .join(' '),
        k = T.map(([t, e]) => {
          if (!/^ruang/i.test(t)) return [t, e];
          let i = e.replace(/^poli\s+.+?-\s*(?=klinik)/i, '').trim() || e,
            p = i.replace(/^(\S+)\s+-\s*(?=\1\b)/i, '').trim() || i,
            a = p.split(/\s+-\s*/);
          if (a.length >= 3 && /rawat\s+inap/i.test(a[1])) {
            let c = ct(a[1].trim()),
              n = a.slice(2).join(' - ').trim(),
              o = n ? c + ' - ' + n : c;
            if (o) return [t, o];
          }
          return [t, p];
        }),
        pt = k
          .map(
            ([t, e]) =>
              '<div class="info-item"><div class="info-label">' +
              s(t) +
              '</div><div class="info-colon">:</div><div class="info-value">' +
              s(e) +
              '</div></div>',
          )
          .join(''),
        V = (t) => (/^icd-?o\s*:/i.test(t) ? '<strong>' + s(t) + '</strong>' : s(t)),
        $ = (t) => /^catatan/i.test(t.trim()),
        G = (t) =>
          t
            .replace(/^catatan\s*:?\s*/i, '')
            .replace(/^[-•–—*]+\s*/, '')
            .trim(),
        dt = k.find(([t]) => /^no\.?pa/i.test(t))?.[1].replace(/[^a-zA-Z0-9]+/g, '-') || 'tanpa-no';
      function Q(t) {
        if (/^data:/i.test(t)) return Promise.resolve(t);
        let e = new URL(t, window.location.href).href;
        return fetch(e)
          .then((i) => {
            if (!i.ok) throw new Error('img ' + i.status);
            return i.blob();
          })
          .then(
            (i) =>
              new Promise((l, p) => {
                let a = new FileReader();
                ((a.onload = () => l(String(a.result))),
                  (a.onerror = () => p(a.error)),
                  a.readAsDataURL(i));
              }),
          )
          .catch(() => e);
      }
      async function mt() {
        let [t, e] = await Promise.all([Q(q), L ? Q(L) : Promise.resolve('')]),
          i = '';
        for (let n = 0; n < k.length; n += 2) {
          let o = k[n],
            r = k[n + 1];
          i +=
            '<tr><td>' +
            s(o[0]) +
            '</td><td>:</td><td>' +
            s(o[1]) +
            '</td>' +
            (r
              ? '<td>' + s(r[0]) + '</td><td>:</td><td>' + s(r[1]) + '</td>'
              : '<td></td><td></td><td></td>') +
            '</tr>';
        }
        let l = '';
        for (let n of f) {
          if ($(n.title)) {
            let o = n.items.length ? n.items : ['Tidak ada'];
            l +=
              '<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top"><b><u>CATATAN:</u></b></td><td>' +
              o.map((r) => '- ' + s(G(r) || 'Tidak ada')).join('<br>') +
              '</td></tr></table>';
            continue;
          }
          if (n.bare) {
            n.items.forEach((o, r) => {
              l +=
                '<p style="margin:' +
                (r === 0 ? '12pt' : '0') +
                ' 0 6pt 0;font-size:11pt;"><b>' +
                s(o.toUpperCase()) +
                '</b></p>';
            });
            continue;
          }
          ((l +=
            '<p style="margin:12pt 0 0 0;font-size:11pt;"><b><u>' +
            s(n.title.toUpperCase()) +
            '</u></b></p>'),
            n.items.forEach((o, r) => {
              l +=
                '<p style="margin:' +
                (n.para.includes(r) ? '14pt' : '0') +
                ' 0 6pt 0;text-align:justify;">' +
                V(o) +
                '</p>';
            }));
        }
        let p =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' +
            s(R) +
            '</title></head><body style="font-family:Arial,sans-serif;font-size:11pt;"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="' +
            t +
            '" width="90"></td><td align="center">' +
            v
              .slice(0, 3)
              .map((n) => '<b style="font-size:16pt;">' + s(n) + '</b>')
              .join('<br>') +
            '<br><span style="font-size:9pt;">' +
            w.map((n) => s(n)).join('<br>') +
            '</span></td></tr></table><hr><p align="center"><b><u>' +
            s(R.toUpperCase()) +
            '</u></b></p><table border="0" cellspacing="0" cellpadding="2">' +
            i +
            '</table>' +
            l +
            '<table border="0" width="100%" cellspacing="0" cellpadding="0"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">' +
            s(_) +
            '</p><p style="margin:0 0 6pt 0;">' +
            s(O) +
            '</p>' +
            (e
              ? '<p style="margin:0 0 6pt 0;"><img src="' + e + '" width="80" height="80"></p>'
              : '') +
            '<p style="margin:0 0 6pt 0;"><b>' +
            s(K) +
            '</b></p><p style="margin:0 0 6pt 0;">' +
            s(F) +
            '</p></td></tr></table></body></html>',
          a = new Blob(['\uFEFF' + p], { type: 'application/msword' }),
          c = document.createElement('a');
        ((c.href = URL.createObjectURL(a)),
          (c.download = 'Hasil-PA-' + dt + '.doc'),
          document.body.appendChild(c),
          c.click(),
          window.setTimeout(() => {
            (URL.revokeObjectURL(c.href), c.remove());
          }, 4e3));
      }
      let gt = f
        .map((t) => {
          if ($(t.title))
            return (
              '<div class="section-catatan"><span class="catatan-label">Catatan:</span><div class="catatan-list">' +
              (t.items.length ? t.items : ['Tidak ada'])
                .map(
                  (l) =>
                    '<div class="catatan-item"><span class="catatan-dash">-</span><span>' +
                    s(G(l) || 'Tidak ada') +
                    '</span></div>',
                )
                .join('') +
              '</div></div>'
            );
          let e =
            '<div class="' +
            (t.bare ? 'section-isi section-isi-bare' : 'section-isi') +
            '">' +
            t.items
              .map(
                (i, l) =>
                  '<div class="item-list' +
                  (t.para.includes(l) ? ' item-para' : '') +
                  '">' +
                  V(i) +
                  '</div>',
              )
              .join('') +
            '</div>';
          return t.bare ? e : '<div class="section-judul">' + s(t.title) + '</div>' + e;
        })
        .join('');
      ((document.body.innerHTML =
        '<a href="' +
        s(W) +
        '" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="' +
        s(q) +
        '" alt="Logo"></div><div class="kop-text">' +
        v
          .slice(0, 3)
          .map((t) => '<h1 class="kop-atas">' + s(t) + '</h1>')
          .join('') +
        '<div class="kop-alamat">' +
        w.map((t) => s(t)).join('<br>') +
        '</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">' +
        s(R) +
        '</div><div class="patient-info-container">' +
        pt +
        '</div><div class="hasil-pa">' +
        gt +
        '</div><div class="ttd-container clearfix"><div class="ttd-box"><p>' +
        s(_) +
        '</p><p>' +
        s(O) +
        '</p>' +
        (L ? '<img src="' + s(L) + '" alt="QR Code TTD">' : '') +
        '<p style="font-weight: bold; margin-bottom: 0;">' +
        s(K) +
        '</p><p style="margin-top: 2px;">' +
        s(F) +
        '</p></div></div></div>'),
        lt.forEach((t) => document.body.appendChild(t)),
        document.querySelector('#btn-word')?.addEventListener('click', (t) => {
          (t.preventDefault(),
            mt().catch(() => {
              window.location.href = W;
            }));
        }),
        document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((t) => t.remove()));
      let J = 'ext-pa-print-style';
      if (!document.getElementById(J)) {
        let t = document.createElement('style');
        ((t.id = J),
          (t.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

        /* Pengaturan Font dan Kertas untuk Cetak */
        body {
            font-family: 'Roboto', sans-serif;
            font-size: 9pt;
            color: #000;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
        }

        .page-a4 {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            border-radius: 4px;
        }

        /* User Header Styles */
        .head-cetak {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin-bottom: 5px;
            width: 100%;
        }

        #logo img {
            height: 90px;
            width: auto;
        }

        .kop-text {
            text-align: center;
        }

        .kop-atas {
            font-size: 16pt;
            margin: 0;
            line-height: 1.2;
            font-weight: bold;
            color: #000;
        }

        .kop-alamat {
            font-size: 7.5pt;
            margin-top: 5px;
            color: #334155;
            line-height: 1.3;
        }

        hr.kop-hr {
            border: none;
            border-top: 2px solid #000;
            margin: 10px 0;
            width: 100%;
        }

        .head-cetak-instansi {
            font-size: 12pt;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 20px 0;
            text-decoration: underline;
            text-transform: uppercase;
        }

        /* Kontainer utama dengan 2 kolom */
        .patient-info-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 40px;
            font-family: Arial, sans-serif;
            max-width: 900px;
        }

        /* Tata letak untuk setiap baris data (Label : Nilai) */
        .info-item {
            display: grid;
            grid-template-columns: 110px 15px 1fr;
            align-items: start;
        }

        .info-label {
            font-weight: 500;
        }

        .info-colon {
            text-align: center;
        }

        /* Responsif: Ubah jadi 1 kolom di layar HP (lebar maksimal 768px) */
        @media (max-width: 768px) {
            .patient-info-container {
                grid-template-columns: 1fr;
            }
        }

        /* Result Sections */
        .hasil-pa {
            margin-top: 20px;
        }

        .hasil-title {
            text-align: center;
            font-weight: bold;
            font-size: 11pt;
            margin-bottom: 20px;
            text-decoration: underline;
        }

        .section-judul {
            font-weight: bold;
            margin-top: 12px;
            font-size: 9pt;
            text-decoration: underline;
            text-transform: uppercase;
        }

        .section-isi {
            margin-top: 8px;
            text-align: justify;
            line-height: 1.5;
        }

        .item-list {
            margin-bottom: 12px;
        }

        .group-title {
            margin-bottom: 6px;
            font-weight: 500;
        }

        .empty-field {
            color: #9ca3af;
            font-style: italic;
        }

        /* Signature Section */
        .ttd-container {
            margin-top: 15px;
        }

        .ttd-box {
            float: right;
            width: 300px;
            text-align: center;
        }

        .ttd-box p {
            margin: 5px 0;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        @media print {
            body {
                background-color: transparent;
                padding: 0;
            }

            .page-a4 {
                margin: 0;
                box-shadow: none;
                width: 100%;
                padding: 10mm;
            }

            .nav-container,
            .nav-button,
            .btn-print,
            .btn-back {
                display: none !important;
            }
        }

        /* Buttons */
        .nav-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #64748b;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px;
            transition: background 0.2s;
        }

        .nav-button:hover {
            background-color: #475569;
        }

        .btn-print {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1e293b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
        }

        .btn-print:hover {
            background: #0f172a;
        }

        .btn-back {
            position: fixed;
            top: 20px;
            right: 170px;
            background: #64748b;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: background 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-back:hover {
            background: #475569;
        }

        /* === OVERRIDE: QR sedang + info rapat + print 2 kolom ===
           Layout tetap prioritas; hanya: QR 80px, jarak baris info
           rapat, info pasien tetap grid 2 kolom saat cetak. */
        .ttd-box img {
            width: 80px;
            height: 80px;
        }

        .patient-info-container {
            font-size: 10pt;
            line-height: 1;
            gap: 4px 40px;
            border: 1px solid #000;
            padding: 10px 12px;
        }

        @media print {
            .patient-info-container {
                grid-template-columns: 1fr 1fr !important;
            }

            .section-judul {
                break-after: avoid;
            }
        }

        .section-judul {
            font-size: 11pt;
        }

        .section-isi {
            font-size: 10pt;
            line-height: 1.5;
        }

        .item-list {
            margin-bottom: 6px;
        }

        /* Awal paragraf baru (baris kosong di input): gap ekstra. */
        .item-list.item-para {
            margin-top: 14px;
        }

        /* ICD-O tanpa judul (bare, id=154696): "ICD-O : \u2026" saja tanpa
           dobel judul "ICD-0" \u2014 font, margin & padding sama persis
           seperti section-judul (minus garis bawah). */
        .section-isi-bare {
            margin: 12px 0 0;
            padding: 0;
            font-size: 11pt;
            font-weight: bold;
            line-height: 1.4;
            text-transform: uppercase;
        }

        .section-isi-bare .item-list {
            margin: 0;
            padding: 0;
        }

        /* CATATAN: label + list gantung \u2014 baris lanjutan rata di bawah
           dash pertama ("Catatan: - \u2026" lalu "- \u2026" sejajar di bawahnya). */
        .section-catatan {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 12px;
            font-size: 10pt;
            line-height: 1.5;
            text-align: justify;
        }

        .catatan-label {
            flex-shrink: 0;
            font-weight: bold;
            font-size: 11pt;
            text-transform: uppercase;
        }

        .catatan-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            min-width: 0;
        }

        .catatan-item {
            display: flex;
            gap: 6px;
        }

        .catatan-dash {
            flex-shrink: 0;
        }

        /* Cetak 16px khusus fitur PA (ramah lansia): blok ini SENGAJA
           paling akhir \u2014 rule dasar (10/11pt) di atasnya berspesifisitas
           sama sehingga hanya menang bila muncul belakangan. HANYA
           @media print: tampilan layar tidak berubah, fitur lain tak
           tersentuh (<style> ini hanya ada di halaman cetak PA). */
        @media print {
            .section-isi,
            .section-isi-bare,
            .section-catatan,
            .patient-info-container,
            .ttd-box {
                font-size: 16px;
            }

            .section-judul,
            .catatan-label {
                font-size: 13pt;
            }
        }
      `),
          document.head.appendChild(t));
      }
    }
    let X = Date.now(),
      H = window.setInterval(() => {
        document.documentElement.getAttribute('data-ext-pa-print') === '1'
          ? (window.clearInterval(H), Y().catch(() => {}))
          : Date.now() - X > 5e3 && window.clearInterval(H);
      }, 200);
  })();
})();
