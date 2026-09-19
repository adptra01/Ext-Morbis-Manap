'use strict';
var __morbis_feature = (() => {
  // src/features/paLabPrint.ts
  (function () {
    'use strict';
    function apply() {
      const PAGE_GUARD = 'ext-pa-print-proc';
      if (document.documentElement.getAttribute(PAGE_GUARD)) return;
      const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
      function esc(s) {
        return String(s ?? '').replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
        );
      }
      const logoSrc =
        document.querySelector('#logo img')?.getAttribute('src') ||
        '/assets/images/logo/Kota Jambi.png';
      const kopLines = Array.from(document.querySelectorAll('h1.kop-atas'))
        .map((h) => txt(h))
        .filter(Boolean);
      while (kopLines.length < 3) kopLines.push('');
      let addrLines = [];
      const headLogo = document.querySelector('#head-cetak-logo center, #head-cetak-logo');
      if (headLogo) {
        const tmp = document.createElement('div');
        tmp.innerHTML = headLogo.innerHTML;
        tmp.querySelectorAll('h1').forEach((h) => h.remove());
        addrLines = (tmp.innerHTML || '')
          .split(/<br\s*\/?>/gi)
          .map((l) => tmp.textContent && l.replace(/<[^>]+>/g, '').trim())
          .map((l) => String(l || '').trim())
          .filter(Boolean);
      }
      const addrText = addrLines.join(' ');
      const pickPhone = (label) => {
        const m = addrText.match(new RegExp(label + '\\s*:([\\d\\s().+-]+)', 'i'));
        return m ? m[1].trim() : '';
      };
      const telp = pickPhone('telp');
      const fax = pickPhone('fax');
      const email = (addrText.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/) || [''])[0];
      const website = (addrText.match(/https?:\/\/[^\s;,]+/) || [''])[0];
      let street = addrText
        .replace(/telp\s*:[\d\s().+-]+/gi, '')
        .replace(/fax\s*:[\d\s().+-]+/gi, '')
        .replace(/website\s*:?/gi, '')
        .replace(/email\s*:?/gi, '');
      if (email) street = street.split(email).join('');
      if (website) street = street.split(website).join('');
      street = street
        .split(/[;]+/)
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join(', ')
        .replace(/,\s*,+/g, ',')
        .replace(/^[,;\s]+|[,;\s]+$/g, '');
      const addrLine1 = ['Alamat: ' + street, telp ? 'Telp: ' + telp : '', fax ? 'Fax: ' + fax : '']
        .filter(Boolean)
        .join(', ');
      const addrLine2 = [email ? 'Email: ' + email : '', website ? 'Website: ' + website : '']
        .filter(Boolean)
        .join(', ');
      addrLines = [addrLine1, addrLine2].filter(Boolean);
      const judul =
        txt(document.querySelector('.head-cetak-instansi')) || 'LAPORAN HASIL PEMERIKSAAN';
      const infoItems = [];
      document.querySelectorAll('.table-outer tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length >= 6) {
          const l1 = txt(tds[0]);
          const v1 = txt(tds[2]);
          const l2 = txt(tds[3]);
          const v2 = txt(tds[5]);
          if (l1) infoItems.push([l1, v1]);
          if (l2) infoItems.push([l2, v2]);
        }
      });
      const sections = [];
      document.querySelectorAll('.contentlab .section-title').forEach((st) => {
        const title = txt(st);
        let p = st.nextElementSibling;
        while (p && p.tagName !== 'P') p = p.nextElementSibling;
        const items = [];
        if (p) {
          (p.innerHTML || '')
            .split(/<br\s*\/?>/gi)
            .map((l) =>
              l
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim(),
            )
            .filter(Boolean)
            .forEach((l) => items.push(l));
        }
        if (title) sections.push({ title, items });
      });
      const sigTds = Array.from(document.querySelectorAll('.contentlab ~ div table td'));
      const sigTexts = sigTds.map((td) => txt(td)).filter(Boolean);
      const thanks = sigTexts[0] || '';
      const dateLine = sigTexts[1] || '';
      const qrSrc =
        document.querySelector('.contentlab ~ div table img')?.getAttribute('src') || '';
      const docName = sigTexts.find((t) => /^\(.*\)$/.test(t)) || sigTexts[2] || '';
      const nip = sigTexts.find((t) => /^nip\.?/i.test(t)) || sigTexts[3] || '';
      const exportHref =
        document.querySelector('a.tombol[href*="export"]')?.getAttribute('href') ||
        window.location.href + '&export=word';
      const bodyScripts = Array.from(document.body.querySelectorAll('script'));
      document.documentElement.setAttribute(PAGE_GUARD, '1');
      const infoClean = infoItems.map(([l, v]) =>
        /^ruang/i.test(l) ? [l, v.replace(/^poli\s+.+?-\s*(?=klinik)/i, '').trim() || v] : [l, v],
      );
      const infoHtml = infoClean
        .map(
          ([l, v]) =>
            '<div class="info-item"><div class="info-label">' +
            esc(l) +
            '</div><div class="info-colon">:</div><div class="info-value">' +
            esc(v) +
            '</div></div>',
        )
        .join('');
      const hasilHtml = sections
        .map(
          (s) =>
            '<div class="section-judul">' +
            esc(s.title) +
            '</div><div class="section-isi">' +
            s.items.map((it) => '<div class="item-list">' + esc(it) + '</div>').join('') +
            '</div>',
        )
        .join('');
      document.body.innerHTML =
        '<a href="' +
        esc(exportHref) +
        '" class="btn-back">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="' +
        esc(logoSrc) +
        '" alt="Logo"></div><div class="kop-text">' +
        kopLines
          .slice(0, 3)
          .map((l) => '<h1 class="kop-atas">' + esc(l) + '</h1>')
          .join('') +
        '<div class="kop-alamat">' +
        addrLines.map((l) => esc(l)).join('<br>') +
        '</div></div></div><hr class="kop-hr"><div class="head-cetak-instansi">' +
        esc(judul) +
        '</div><div class="patient-info-container">' +
        infoHtml +
        '</div><hr style="border: 0; border-top: 1px dashed #cbd5e1; margin-bottom: 25px;"><div class="hasil-pa">' +
        hasilHtml +
        '</div><div class="ttd-container clearfix"><div class="ttd-box"><p>' +
        esc(thanks) +
        '</p><p>' +
        esc(dateLine) +
        '</p>' +
        (qrSrc ? '<img src="' + esc(qrSrc) + '" alt="QR Code TTD">' : '') +
        '<p style="font-weight: bold; margin-bottom: 0;">' +
        esc(docName) +
        '</p><p style="margin-top: 2px;">' +
        esc(nip) +
        '</p></div></div></div>';
      bodyScripts.forEach((s) => document.body.appendChild(s));
      document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());
      const STYLE_ID = 'ext-pa-print-style';
      if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `
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
            margin-top: 50px;
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
            font-size: 9pt;
            gap: 4px 40px;
        }

        @media print {
            .patient-info-container {
                grid-template-columns: 1fr 1fr !important;
            }
        }

        .section-judul {
            font-size: 11pt;
        }

        .section-isi {
            font-size: 11pt;
            line-height: 1.7;
        }

        .item-list {
            margin-bottom: 6px;
        }
      `;
        document.head.appendChild(s);
      }
    }
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (document.documentElement.getAttribute('data-ext-pa-print') === '1') {
        window.clearInterval(iv);
        apply();
      } else if (Date.now() - t0 > 5e3) {
        window.clearInterval(iv);
      }
    }, 200);
  })();
})();
//# sourceMappingURL=paLabPrint.js.map
