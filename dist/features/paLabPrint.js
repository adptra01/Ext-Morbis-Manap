'use strict';
var __morbis_feature = (() => {
  // src/features/paLabPrint.ts
  (function () {
    'use strict';
    async function apply() {
      const PAGE_GUARD = 'ext-pa-print-proc';
      if (document.documentElement.getAttribute(PAGE_GUARD)) return;
      document.documentElement.setAttribute(PAGE_GUARD, '1');
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
      const ORDER = ['makroskopik', 'mikroskopik', 'kesimpulan', 'icdo', 'catatan', 'saran'];
      const normTitle = (t) =>
        t
          .toLowerCase()
          .replace(/0/g, 'o')
          .replace(/[^a-z]/g, '');
      const sections = [];
      document.querySelectorAll('.contentlab td').forEach((td) => {
        let title = '';
        let hasSt = false;
        const st = td.querySelector('.section-title');
        if (st) {
          title = txt(st);
          hasSt = true;
        } else {
          const head = (t) => t.split(':')[0].trim();
          for (const el of Array.from(td.children).slice(0, 3)) {
            const t = txt(el);
            if (t && t.length <= 24 && ORDER.includes(normTitle(head(t)))) {
              title = head(t);
              break;
            }
          }
          if (!title) {
            const firstLine =
              (td.textContent || '')
                .split('\n')
                .map((l) => l.trim())
                .find(Boolean) || '';
            if (firstLine && ORDER.includes(normTitle(head(firstLine)))) title = head(firstLine);
          }
          if (!title) return;
        }
        const tmp = document.createElement('div');
        tmp.innerHTML = td.innerHTML;
        tmp.querySelector('.section-title')?.remove();
        const paras = tmp.innerHTML
          .replace(/\r\n?/g, '\n')
          .replace(/<br\s*\/?>[ \t]*\n?/gi, '\n')
          .replace(/\n(?:[ \t]*\n)+/g, '\u2028')
          .split('\u2028')
          .map((block) =>
            block
              .split(/<br\s*\/?>|\n/)
              .map((l) =>
                l
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim(),
              )
              .filter(Boolean),
          )
          .filter((b) => b.length);
        const items = [];
        const paraIdx = [];
        paras.forEach((block, bi) => {
          block.forEach((it, ii) => {
            if (bi > 0 && ii === 0 && items.length) paraIdx.push(items.length);
            items.push(it);
          });
        });
        const finalItems = items;
        if (!hasSt && finalItems.length && normTitle(finalItems[0]) === normTitle(title)) {
          finalItems.shift();
          for (let k = 0; k < paraIdx.length; k++) paraIdx[k] -= 1;
          while (paraIdx.length && paraIdx[0] <= 0) paraIdx.shift();
        }
        if (
          finalItems.length > 1 &&
          !/^[IVXLC]+\.\s/.test(finalItems[0]) &&
          finalItems.slice(1).some((it) => /^II\.\s/.test(it))
        ) {
          finalItems[0] = 'I. ' + finalItems[0];
        }
        if (title) sections.push({ title, items: finalItems, para: paraIdx });
      });
      const MARK_CATATAN = /^catatan\s*:?/i;
      const MARK_ICDO = /^icd[\s-]*o\b\s*:?/i;
      const splitSections = [];
      for (const s of sections) {
        const parts = [{ title: s.title, items: [], para: [] }];
        let cur = parts[0];
        let openedVirtual = false;
        const open = (t, bare) => {
          cur = { title: t, items: [], para: [], bare };
          parts.push(cur);
          openedVirtual = true;
        };
        s.items.forEach((it, i) => {
          const mCat = it.match(MARK_CATATAN);
          const mIc = mCat ? null : it.match(MARK_ICDO);
          if (mCat) {
            if (normTitle(cur.title) !== 'catatan') open('Catatan');
            const rest = it.slice(mCat[0].length).trim();
            if (rest) {
              if (s.para.includes(i)) cur.para.push(cur.items.length);
              cur.items.push(rest);
            }
            return;
          }
          if (mIc) {
            if (normTitle(cur.title) !== 'icdo') open('ICD-0', true);
            if (s.para.includes(i)) cur.para.push(cur.items.length);
            cur.items.push(it);
            return;
          }
          if (s.para.includes(i)) cur.para.push(cur.items.length);
          cur.items.push(it);
        });
        if (openedVirtual) {
          for (const p of parts) if (p.items.length) splitSections.push(p);
        } else {
          splitSections.push(parts[0]);
        }
      }
      sections.length = 0;
      sections.push(...splitSections);
      sections.forEach((s, i) => (s._i = i));
      sections.sort((a, b) => {
        const ai = a._i ?? 0;
        const bi = b._i ?? 0;
        const ao = ORDER.indexOf(normTitle(a.title));
        const bo = ORDER.indexOf(normTitle(b.title));
        const ra = ao === -1 ? ORDER.length : ao;
        const rb = bo === -1 ? ORDER.length : bo;
        return ra !== rb ? ra - rb : ai - bi;
      });
      function fieldText(el) {
        let val = '';
        if (el instanceof HTMLSelectElement) {
          const opt = el.selectedIndex >= 0 ? el.options[el.selectedIndex] : void 0;
          val = (opt?.textContent || el.value || '').trim();
        } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          val = (el.value || '').trim();
        }
        const ids = (el.getAttribute('name') || '') + ' ' + (el.getAttribute('id') || '');
        const ph = el.getAttribute('placeholder') || '';
        const row = el.closest('tr, .form-group, .form-row, div')?.textContent || '';
        return { val, ctx: (ids + ' ' + ph + ' ' + row).slice(0, 300) };
      }
      function originalValue(doc2, printVal, ctxRe) {
        const toks = printVal
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(
            (t) =>
              t.length >= 4 &&
              !/^(dokter|pengirim|rumah|sakit|klinik|tanpa|kelas|rsud|rs|sp|dr|dalam|luar)$/.test(
                t,
              ),
          );
        if (!toks.length) return '';
        const anchor = toks.sort((a, b) => b.length - a.length)[0];
        let best = '';
        let bestScore = -1;
        doc2.querySelectorAll('input, textarea, select').forEach((el) => {
          const { val, ctx } = fieldText(el);
          if (!val || val === printVal) return;
          if (!val.toLowerCase().includes(anchor)) return;
          const score = ctxRe.test(ctx) ? 2 : 0;
          if (score > bestScore) {
            bestScore = score;
            best = val;
          }
        });
        return best;
      }
      async function overrideFromInput(info) {
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) return;
        const targets = info
          .map(([l, v], i) => ({ label: l, value: v, idx: i }))
          .filter((t) => t.value && (/^dokter/i.test(t.label) || /^rs\b/i.test(t.label)));
        if (!targets.length) return;
        const ctrl = new AbortController();
        const timer = window.setTimeout(() => ctrl.abort(), 6e3);
        try {
          const url = new URL(
            '/laboratorium/input-hasil/input-hasil-pa?id_lab=' + encodeURIComponent(id),
            window.location.href,
          );
          const res = await fetch(url.toString(), {
            credentials: 'same-origin',
            signal: ctrl.signal,
          });
          if (!res.ok) return;
          const doc2 = new DOMParser().parseFromString(await res.text(), 'text/html');
          for (const t of targets) {
            const ctxRe = /^dokter/i.test(t.label)
              ? /dokter|pengirim|luar|dalam|rujuk/i
              : /rs\b|rumah\s*sakit|faskes|asal/i;
            const orig = originalValue(doc2, t.value, ctxRe);
            if (orig && orig !== t.value) info[t.idx][1] = orig;
          }
        } catch {
        } finally {
          window.clearTimeout(timer);
        }
      }
      await overrideFromInput(infoItems).catch(() => {});
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
      const infoClean = infoItems.map(([l, v]) => {
        if (!/^ruang/i.test(l)) return [l, v];
        const dedup = v.replace(/^poli\s+.+?-\s*(?=klinik)/i, '').trim() || v;
        const segDup = dedup.replace(/^(\S+)\s+-\s*(?=\1\b)/i, '').trim();
        return [l, segDup || dedup];
      });
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
      const fmtItem = (it) =>
        // Baris ICD-O tampil bold seperti prototype (ICD-0: 8210/0 …).
        /^icd-?o\s*:/i.test(it) ? '<strong>' + esc(it) + '</strong>' : esc(it);
      const isCatatan = (t) => /^catatan/i.test(t.trim());
      const stripBullet = (it) =>
        it
          .replace(/^catatan\s*:?\s*/i, '')
          .replace(/^[-•–—*]+\s*/, '')
          .trim();
      const noPA =
        infoClean.find(([l]) => /^no\.?pa/i.test(l))?.[1].replace(/[^a-zA-Z0-9]+/g, '-') ||
        'tanpa-no';
      function dataUrl(src) {
        if (/^data:/i.test(src)) return Promise.resolve(src);
        const abs = new URL(src, window.location.href).href;
        return fetch(abs)
          .then((res) => {
            if (!res.ok) throw new Error('img ' + res.status);
            return res.blob();
          })
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onload = () => resolve(String(fr.result));
                fr.onerror = () => reject(fr.error);
                fr.readAsDataURL(blob);
              }),
          )
          .catch(() => abs);
      }
      async function exportWord() {
        const [logo, qr] = await Promise.all([
          dataUrl(logoSrc),
          qrSrc ? dataUrl(qrSrc) : Promise.resolve(''),
        ]);
        let infoTbl = '';
        for (let r = 0; r < infoClean.length; r += 2) {
          const a2 = infoClean[r];
          const b = infoClean[r + 1];
          infoTbl +=
            '<tr><td>' +
            esc(a2[0]) +
            '</td><td>:</td><td>' +
            esc(a2[1]) +
            '</td>' +
            (b
              ? '<td>' + esc(b[0]) + '</td><td>:</td><td>' + esc(b[1]) + '</td>'
              : '<td></td><td></td><td></td>') +
            '</tr>';
        }
        let hasilDoc = '';
        for (const s of sections) {
          if (isCatatan(s.title)) {
            const rows = s.items.length ? s.items : ['Tidak ada'];
            hasilDoc +=
              '<table border="0" cellspacing="0" cellpadding="2"><tr><td valign="top"><b><u>CATATAN:</u></b></td><td>' +
              rows.map((it) => '- ' + esc(stripBullet(it) || 'Tidak ada')).join('<br>') +
              '</td></tr></table>';
            continue;
          }
          if (s.bare) {
            s.items.forEach((it, i) => {
              hasilDoc +=
                '<p style="margin:' +
                (i === 0 ? '12pt' : '0') +
                ' 0 6pt 0;font-size:11pt;"><b>' +
                esc(it.toUpperCase()) +
                '</b></p>';
            });
            continue;
          }
          hasilDoc +=
            '<p style="margin:12pt 0 0 0;font-size:11pt;"><b><u>' +
            esc(s.title.toUpperCase()) +
            '</u></b></p>';
          s.items.forEach((it, i) => {
            hasilDoc +=
              '<p style="margin:' +
              (s.para.includes(i) ? '14pt' : '0') +
              ' 0 6pt 0;text-align:justify;">' +
              fmtItem(it) +
              '</p>';
          });
        }
        const doc =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' +
          esc(judul) +
          '</title></head><body style="font-family:Arial,sans-serif;font-size:11pt;"><table border="0" width="100%" cellspacing="0" cellpadding="4"><tr><td width="110" valign="middle"><img src="' +
          logo +
          '" width="90"></td><td align="center">' +
          kopLines
            .slice(0, 3)
            .map((l) => '<b style="font-size:16pt;">' + esc(l) + '</b>')
            .join('<br>') +
          '<br><span style="font-size:9pt;">' +
          addrLines.map((l) => esc(l)).join('<br>') +
          '</span></td></tr></table><hr><p align="center"><b><u>' +
          esc(judul.toUpperCase()) +
          '</u></b></p><table border="0" cellspacing="0" cellpadding="2">' +
          infoTbl +
          '</table>' +
          hasilDoc +
          '<table border="0" width="100%" cellspacing="0" cellpadding="0"><tr><td width="60%"></td><td align="center"><p style="margin:0 0 6pt 0;">' +
          esc(thanks) +
          '</p><p style="margin:0 0 6pt 0;">' +
          esc(dateLine) +
          '</p>' +
          (qr
            ? '<p style="margin:0 0 6pt 0;"><img src="' + qr + '" width="80" height="80"></p>'
            : '') +
          '<p style="margin:0 0 6pt 0;"><b>' +
          esc(docName) +
          '</b></p><p style="margin:0 0 6pt 0;">' +
          esc(nip) +
          '</p></td></tr></table></body></html>';
        const blob = new Blob(['\uFEFF' + doc], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Hasil-PA-' + noPA + '.doc';
        document.body.appendChild(a);
        a.click();
        window.setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.remove();
        }, 4e3);
      }
      const hasilHtml = sections
        .map((s) => {
          if (isCatatan(s.title)) {
            const rows = s.items.length ? s.items : ['Tidak ada'];
            return (
              '<div class="section-catatan"><span class="catatan-label">Catatan:</span><div class="catatan-list">' +
              rows
                .map(
                  (it) =>
                    '<div class="catatan-item"><span class="catatan-dash">-</span><span>' +
                    esc(stripBullet(it) || 'Tidak ada') +
                    '</span></div>',
                )
                .join('') +
              '</div></div>'
            );
          }
          const isi =
            '<div class="' +
            (s.bare ? 'section-isi section-isi-bare' : 'section-isi') +
            '">' +
            s.items
              .map(
                (it, i) =>
                  '<div class="item-list' +
                  (s.para.includes(i) ? ' item-para' : '') +
                  '">' +
                  fmtItem(it) +
                  '</div>',
              )
              .join('') +
            '</div>';
          if (s.bare) return isi;
          return '<div class="section-judul">' + esc(s.title) + '</div>' + isi;
        })
        .join('');
      document.body.innerHTML =
        '<a href="' +
        esc(exportHref) +
        '" class="btn-back" id="btn-word">Export Word</a><span id="SCETAK"><button onclick="cetak()" class="btn-print">Cetak Dokumen</button></span><div class="page-a4"><div class="head-cetak"><div id="logo"><img src="' +
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
        '</div><div class="hasil-pa">' +
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
      document.querySelector('#btn-word')?.addEventListener('click', (e) => {
        e.preventDefault();
        exportWord().catch(() => {
          window.location.href = exportHref;
        });
      });
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
      `;
        document.head.appendChild(s);
      }
    }
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (document.documentElement.getAttribute('data-ext-pa-print') === '1') {
        window.clearInterval(iv);
        apply().catch(() => {});
      } else if (Date.now() - t0 > 5e3) {
        window.clearInterval(iv);
      }
    }, 200);
  })();
})();
//# sourceMappingURL=paLabPrint.js.map
