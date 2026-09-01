'use strict';
var __morbis_feature = (() => {
  // src/features/telaahResepPrint.ts
  (function () {
    'use strict';
    async function apply() {
      const PAGE_GUARD = 'ext-telaah-proc';
      const root = document.querySelector('.halaman');
      if (!root || root.getAttribute(PAGE_GUARD)) return;
      const page = root;
      page.setAttribute(PAGE_GUARD, '1');
      const txt = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
      function esc(s) {
        return String(s ?? '').replace(
          /[&<>"']/g,
          (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
        );
      }
      const logoImg = page.querySelector('#logo img');
      const logoSrc = logoImg?.getAttribute('src') || '/assets/images/logo/Kota Jambi.png';
      let hospitalName = 'RSUD H. ABDUL MANAP';
      let headBody = [];
      const headEl = page.querySelector('#head-cetak-logo');
      if (headEl) {
        const b = headEl.querySelector('b');
        hospitalName = b ? txt(b) : hospitalName;
        const tmp = document.createElement('div');
        tmp.innerHTML = headEl.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        headBody = (tmp.textContent || '')
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .filter((l) => l !== hospitalName);
      }
      const metaMap = /* @__PURE__ */ new Map();
      let serverDiag = [];
      page.querySelectorAll('.halaman > table:first-of-type table').forEach((t) => {
        t.querySelectorAll('tr').forEach((tr) => {
          const tds = tr.querySelectorAll('td');
          if (tds.length < 2) return;
          const label = txt(tds[0]);
          const value = txt(tds[1]).replace(/^:\s*/, '');
          if (label && !metaMap.has(label)) metaMap.set(label, value);
          if (/^diagnosa$/i.test(label)) {
            const raw = (tds[1].innerHTML || '').replace(/<br\s*\/?>/gi, '\n');
            const cd = document.createElement('div');
            cd.innerHTML = raw;
            serverDiag = (cd.textContent || '')
              .split('\n')
              .map((l) => l.trim())
              .filter((l) => l && !/^:/.test(l) && !/tidak ada/i.test(l));
          }
        });
      });
      const getMeta = (label) => metaMap.get(label) ?? '';
      const medsTables = Array.from(page.querySelectorAll('table.resep-item'));
      const medsTable = medsTables[0];
      const meds = [];
      if (medsTable) {
        const medsMap = /* @__PURE__ */ new Map();
        let lastMed = null;
        medsTable.querySelectorAll('tr').forEach((tr) => {
          const tds = tr.querySelectorAll('td');
          if (tds.length < 2) return;
          const left = txt(tds[0]);
          const rightEl = tds[1];
          const right = txt(rightEl);
          const numMatch = left.match(/^(?:R\/)?(\d+)/);
          if (numMatch) {
            const num = numMatch[1];
            const med = {
              no: 'R/' + num,
              name: '',
              jml: '',
              jumlahJadi: '',
              sediaan: '',
              aturan: [],
              subMeds: [],
            };
            medsMap.set(num, med);
            lastMed = med;
            const ps2 = rightEl ? Array.from(rightEl.querySelectorAll('p')) : [];
            med.name = ps2.length ? (ps2[0]?.textContent || right).trim() : right;
            const jmlT = ps2.length > 1 ? (ps2[1]?.textContent || '').trim() : '';
            const mJml = jmlT.match(/Jml\s*:\s*(.+)/i);
            med.jml = mJml ? mJml[1].trim() : '';
            if (ps2.length && !mJml && med.name) {
              med.subMeds.push({
                name: med.name,
                strength: '',
                dose: '',
                jmlPerR: '',
                sediaan: '',
              });
              med.name = '';
            }
            return;
          }
          if (!lastMed || !right) return;
          const ps = rightEl ? Array.from(rightEl.querySelectorAll('p')) : [];
          if (ps.length) {
            const ingName = (ps[0]?.textContent || '').trim();
            if (!ingName) return;
            const ingJml = ps.length > 1 ? (ps[1]?.textContent || '').trim() : '';
            const ingJmlMatch = ingJml.match(/Jml\s*:\s*(.+)/i);
            lastMed.subMeds.push({
              name: ingName,
              strength: '',
              dose: '',
              jmlPerR: ingJmlMatch ? ingJmlMatch[1].trim() : '',
              sediaan: '',
            });
            return;
          }
          const jmlJadi = right.match(/^Jumlah\s*:\s*(.+)$/i);
          if (jmlJadi) {
            lastMed.jumlahJadi = jmlJadi[1].trim();
            return;
          }
          if (
            /^(tablet|kapsul|kaplet|puyer|salep|sirup|drops?|supp|botol|tube|tab|obat\s+(luar|dalam))\b/i.test(
              right,
            )
          ) {
            lastMed.sediaan = right;
            return;
          }
          lastMed.aturan.push(right.replace(/^\(|\)$/g, ''));
        });
        meds.push(...medsMap.values());
      }
      const adminTable = medsTables[1];
      let diagVisit = '';
      let diagKunjungan = '';
      let diagnosisUtama = [];
      let diagnosisSekunder = [];
      let antrianNumber = '';
      let noSep = '';
      async function fetchRacikanDetails() {
        const map = /* @__PURE__ */ new Map();
        const params2 = new URLSearchParams(window.location.search);
        const resepId =
          params2.get('id_resep') || params2.get('id') || params2.get('penjualan') || '';
        if (!resepId) return map;
        const detailUrls = [
          '/inventory/resep/penerimaan/detail?id=' + resepId,
          '/inventory/penjualan-resep-edit/detail?id=' + resepId,
        ];
        for (const url of detailUrls) {
          try {
            const resp = await fetch(url, { credentials: 'include' });
            if (!resp.ok) continue;
            const html2 = await resp.text();
            const doc = new DOMParser().parseFromString(html2, 'text/html');
            const inVal = (name) => {
              const el =
                doc.querySelector('#' + name) ||
                doc.querySelector('input[name="' + name + '"]') ||
                doc.querySelector('input[id*="' + name + '"]');
              return el?.value?.trim() || '';
            };
            diagVisit = inVal('id_visit') || params2.get('visit') || diagVisit;
            diagKunjungan = inVal('id_kunjungan') || diagKunjungan;
            noSep = inVal('no_sep') || noSep;
            const fieldsets = Array.from(doc.querySelectorAll('fieldset#perhatian'));
            const fs = fieldsets.find((f) => {
              const leg = f.querySelector('legend');
              return leg && /riwayat\s*diagnosa\s*pasien/i.test(txt(leg));
            });
            if (fs) {
              const allLis = Array.from(fs.querySelectorAll('li'))
                .map((li) => txt(li))
                .filter(Boolean);
              let sekunderStartIdx = -1;
              const strongs = Array.from(fs.querySelectorAll('strong, b'));
              for (const s of strongs) {
                if (/diagnosa\s*sekunder/i.test(txt(s))) {
                  const parentLi = s.closest('li');
                  if (parentLi) {
                    const idx = Array.from(fs.querySelectorAll('li')).indexOf(parentLi);
                    if (idx >= 0) sekunderStartIdx = idx;
                  } else {
                    const nextOl = s.nextElementSibling;
                    if (nextOl && nextOl.tagName === 'OL') {
                      const firstSekunderLi = nextOl.querySelector('li');
                      if (firstSekunderLi) {
                        const idx = Array.from(fs.querySelectorAll('li')).indexOf(firstSekunderLi);
                        if (idx >= 0) sekunderStartIdx = idx;
                      }
                    }
                  }
                  break;
                }
              }
              if (sekunderStartIdx >= 0 && sekunderStartIdx < allLis.length) {
                diagnosisUtama = allLis.slice(0, sekunderStartIdx);
                diagnosisSekunder = allLis
                  .slice(sekunderStartIdx)
                  .filter((v) => v && !/tidak ada/i.test(v));
              } else if (allLis.length) {
                diagnosisUtama = allLis;
              }
            }
            for (const table of doc.querySelectorAll('table')) {
              const headerRow = table.querySelector('tr');
              if (!headerRow) continue;
              const headers = Array.from(headerRow.querySelectorAll('td, th')).map((td) => txt(td));
              if (!headers.some((h) => /^R\//.test(h))) continue;
              const colName = headers.findIndex((h) => /Packing|Nama.*Obat|Obat/i.test(h));
              const colStrength = headers.findIndex((h) => /Kekuatan/i.test(h));
              const colDose = headers.findIndex((h) => /Dosis/i.test(h));
              const colJmlPerR = headers.findIndex((h) => /Jml.*per/i.test(h));
              const colSediaan = headers.findIndex((h) => /Sediaan/i.test(h));
              let currentNum = '';
              table.querySelectorAll('tr').forEach((tr, i) => {
                if (i === 0) return;
                const tds = tr.querySelectorAll('td');
                if (tds.length < 5) return;
                const leftText = txt(tds[0]);
                const numMatch = leftText.match(/(\d+)/);
                if (numMatch) {
                  currentNum = numMatch[1];
                  if (!map.has(currentNum)) map.set(currentNum, []);
                  map.get(currentNum).push({
                    name: colName >= 0 ? txt(tds[colName]) : txt(tds[1]),
                    strength: colStrength >= 0 ? txt(tds[colStrength]) : '',
                    dose: colDose >= 0 ? txt(tds[colDose]) : '',
                    jmlPerR: colJmlPerR >= 0 ? txt(tds[colJmlPerR]) : '',
                    sediaan: colSediaan >= 0 ? txt(tds[colSediaan]) : '',
                  });
                }
              });
              break;
            }
            if (diagnosisUtama.length || map.size) break;
          } catch {}
        }
        return map;
      }
      const normName = (s) =>
        String(s || '')
          .toLowerCase()
          .replace(/\b(tablet|drops|kaplet|kapsul|puyer|salep)\b/g, '')
          .replace(/[^a-z0-9]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      const namesMatch = (a, b) => {
        const na = normName(a);
        const nb = normName(b);
        if (!na || !nb) return false;
        return na.includes(nb) || nb.includes(na);
      };
      function parseRacikanAsli(doc, map) {
        let tbl = null;
        for (const t of Array.from(doc.querySelectorAll('table'))) {
          const lefts = Array.from(t.querySelectorAll('tr > td:first-child'));
          if (lefts.some((td) => /^R\/\d+/.test(txt(td)))) {
            tbl = t;
            break;
          }
        }
        if (!tbl) return;
        let cur = null;
        tbl.querySelectorAll('tr').forEach((tr) => {
          const tds = tr.querySelectorAll('td');
          if (tds.length < 2) return;
          const left = txt(tds[0]);
          const numMatch = left.match(/^R\/(\d+)/);
          if (numMatch) {
            cur = { ingredients: [], aturan: [], jumlahRacikan: '' };
            map.set(numMatch[1], cur);
            tds[1].innerHTML.split(/<br\s*\/?>/i).forEach((p) => {
              const clean = p
                .replace(/&nbsp;/g, ' ')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              if (!clean || /^Dosis/i.test(clean)) return;
              const m = clean.match(/^(.+?)\s*Jml\.\s*([\d.,]+)$/i);
              if (m) cur.ingredients.push({ name: m[1].trim(), jml: m[2].trim() });
            });
            return;
          }
          if (!cur) return;
          const right = txt(tds[1]);
          const jr = right.match(/(?:Jumlah|Jml\.)\s*Racikan\s*:\s*([\d.,]+)/i);
          if (jr) {
            cur.jumlahRacikan = jr[1].trim();
            return;
          }
          const aturanTxt = right.replace(/(?:Jumlah|Jml\.)\s*Racikan\s*:.*/i, '').trim();
          if (aturanTxt && !/^Dosis/i.test(aturanTxt)) cur.aturan.push(aturanTxt);
        });
      }
      const RACIKAN_ASLI_URLS = [
        (id) => '/inventory/print/cetak-resep-asli?id=' + encodeURIComponent(id),
        (id) => '/inventory/print/cetak-resep?id_resep=' + encodeURIComponent(id),
      ];
      async function fetchRacikanAsli() {
        const map = /* @__PURE__ */ new Map();
        const resepId = params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
        if (!resepId) return map;
        for (const build of RACIKAN_ASLI_URLS) {
          try {
            const resp = await fetch(build(resepId), { credentials: 'include' });
            if (!resp.ok) continue;
            const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
            parseRacikanAsli(doc, map);
            if (map.size > 0) break;
          } catch {}
        }
        return map;
      }
      async function fetchAntrianNumber(resepId) {
        try {
          let base = 'http://dev.rsudkotajambi.id/rs';
          try {
            const ov = localStorage.getItem('ext-farmasi-app-base');
            if (ov && /^https?:\/\//.test(ov)) base = ov.replace(/\/+$/, '');
          } catch {}
          const resp = await fetch(
            base + '/api/queue/lookup?resep_id=' + encodeURIComponent(resepId),
            {
              cache: 'no-store',
              credentials: 'omit',
            },
          );
          if (!resp.ok) return '';
          const j = await resp.json();
          if (j.ok && j.found && j.queue?.queue_number) return j.queue.queue_number;
        } catch {}
        return '';
      }
      const params = new URLSearchParams(window.location.search);
      const resepIdForQueue =
        params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
      antrianNumber = resepIdForQueue ? await fetchAntrianNumber(resepIdForQueue) : '';
      const racikanMap = await fetchRacikanDetails();
      const asliMap = await fetchRacikanAsli();
      if (!diagnosisUtama.length && serverDiag.length) diagnosisUtama = serverDiag;
      for (const med of meds) {
        const num = med.no.replace(/\D/g, '');
        const subs = racikanMap.get(num);
        if (subs && subs.length > 1 && med.subMeds.length === 0) {
          med.subMeds = subs;
        }
      }
      for (const med of meds) {
        const num = med.no.replace(/\D/g, '');
        const block = asliMap.get(num);
        if (!block) continue;
        if (block.jumlahRacikan) med.jumlahJadi = block.jumlahRacikan;
        if (block.aturan.length) med.aturan = block.aturan;
        if (med.subMeds.length === 0 && block.ingredients.length > 0) {
          if (block.ingredients.length > 1) {
            med.subMeds = block.ingredients.map((i) => ({
              name: i.name,
              strength: '',
              dose: '',
              sediaan: '',
              jmlPerR: i.jml,
            }));
          } else if (!med.jml && block.ingredients[0].jml) {
            med.jml = block.ingredients[0].jml;
          }
        } else {
          for (const s of med.subMeds) {
            const hit = block.ingredients.find((i) => namesMatch(s.name, i.name));
            if (hit && !s.jmlPerR) s.jmlPerR = hit.jml;
          }
        }
      }
      const chkForm = page.querySelector('#form_checklist_telaah_resep');
      const readCheck = (title) => {
        const rows = [];
        if (!chkForm) return rows;
        const tbl = Array.from(chkForm.querySelectorAll('table')).find((t) => {
          const th = txt(t.querySelector('tr td'));
          return th === title;
        });
        if (!tbl) return rows;
        tbl.querySelectorAll('tr').forEach((tr, i) => {
          if (i === 0) return;
          const tds = tr.querySelectorAll('td');
          if (tds.length < 2) return;
          const num = txt(tds[0]);
          const item = txt(tds[1]);
          if (num && item && item !== title) rows.push([num, item]);
        });
        return rows;
      };
      const telaahResep = readCheck('Telaah Resep');
      const telaahObat = readCheck('Telaah Obat');
      const footerEl = Array.from(page.querySelectorAll('center, strong')).find((el) =>
        /Obat tidak boleh diganti/i.test(txt(el)),
      );
      const footerText = footerEl
        ? txt(footerEl)
        : 'Obat tidak boleh diganti tanpa sepengetahuan Dokter';
      const metaLine = (label, value, vClass = '') =>
        '<div class="tm-row"><span class="tm-label">' +
        esc(label) +
        '</span><span class="tm-val' +
        (vClass ? ' ' + vClass : '') +
        '">' +
        (value && value.trim() ? esc(value) : '-') +
        '</span></div>';
      const diagValues = [
        ...(diagnosisUtama.length ? [diagnosisUtama.join(', ')] : []),
        ...(diagnosisSekunder.length ? [diagnosisSekunder.join(', ')] : []),
      ];
      const g = (l) => getMeta(l);
      const jk = g('Jenis Kelamin');
      const jkShort = /^perempuan$/i.test(jk) ? 'P' : /^laki-laki$/i.test(jk) ? 'L' : jk;
      const pasienJK = (g('Nama Pasien') || '-') + (jk ? ' (' + jkShort + ')' : '');
      const dokterRuang =
        (g('Dokter') || '-') + (g('Ruangan/Poli') ? ' / ' + g('Ruangan/Poli') : '');
      const look = (re) => {
        for (const k of metaMap.keys()) if (re.test(k)) return metaMap.get(k) || '';
        return '';
      };
      const alergi = look(/alergi/i);
      const bb = look(/berat|\bbb\b/i);
      const bbTxt = bb ? (/\bkg\b/i.test(bb) ? bb : bb + ' kg') : '- kg';
      const alergiBB = (alergi ? alergi : '-') + ' / ' + (bb ? 'BB ' + bbTxt : bbTxt);
      const patientRows = [
        ['Pasien', pasienJK],
        ['No. RM', g('No. RM')],
        ['Tgl. Lahir/Umur', g('Tgl. Lahir/Umur')],
        ['Riwayat Alergi & BB', alergiBB],
        ['Alamat', g('Alamat')],
        ['No HP', g('No HP')],
      ];
      const doctorRows = [
        ['Dokter', dokterRuang],
        ['SIP Dokter', g('SIP Dokter')],
        ['No Resep', g('No Resep')],
        ['No SEP', noSep || '-'],
        ['Tanggal & Jam', g('Tanggal & Jam')],
        ['Penjamin', g('Penjamin')],
      ];
      const diagThen = metaLine('Diagnosa', diagValues.length ? diagValues.join(', ') : '-');
      const patientMetaHtml =
        '<section class="tm-card"><div class="tm-col">' +
        patientRows.map(([l, v]) => metaLine(l, v)).join('') +
        diagThen +
        '</div></section>';
      const doctorMetaHtml =
        '<section class="tm-card"><div class="tm-col">' +
        doctorRows.map(([l, v]) => metaLine(l, v)).join('') +
        '</div></section>';
      const medListHtml = meds
        .map((m) => {
          if (m.subMeds.length) {
            const lines = m.subMeds
              .map((s, i) => {
                const jml2 = s.jmlPerR || '';
                return (
                  '<div class="med-line' +
                  (i > 0 ? ' indent' : '') +
                  '">' +
                  (i === 0 ? '<span class="med-no">' + esc(m.no) + '</span> ' : '') +
                  '<span class="med-name">' +
                  esc(s.name) +
                  '</span>' +
                  (jml2 ? ', <span class="med-jml">Jml: ' + esc(jml2) + '</span>' : '') +
                  '</div>'
                );
              })
              .join('');
            const total = m.jumlahJadi ? esc(m.jumlahJadi) : '';
            const satuan = m.sediaan ? esc(m.sediaan) : 'Racikan';
            const aturan = m.aturan.length
              ? m.aturan.map((a) => esc(a.replace(/^\(|\)$/g, ''))).join(' ')
              : '';
            const jadiTxt = total
              ? 'Jml ' + total + ' ' + satuan + (aturan ? ' - (' + aturan + ')' : '')
              : '';
            const jadi = jadiTxt ? '<div class="med-jadiracik">' + jadiTxt + '</div>' : '';
            return '<div class="med">' + lines + jadi + '</div>';
          }
          const jml = m.jml || '';
          return (
            '<div class="med"><div class="med-line"><span class="med-no">' +
            esc(m.no) +
            '</span> <span class="med-name">' +
            esc(m.name) +
            '</span>' +
            (jml ? ', <span class="med-jml">Jml: ' + esc(jml) + '</span>' : '') +
            '</div>' +
            (m.aturan.length
              ? '<div class="med-aturan">' + m.aturan.map((a) => esc(a)).join('<br/>') + '</div>'
              : '') +
            '</div>'
          );
        })
        .join('');
      const adminHeads = adminTable
        ? Array.from(adminTable.querySelectorAll('tr:first-child td'))
            .map((td) => txt(td))
            .filter(Boolean)
        : ['Hitung', 'Timbang', 'Kemas'];
      if (!adminHeads.some((h) => /paraf/i.test(h))) adminHeads.push('Paraf');
      const adminCols = adminHeads.length;
      const adminHtml =
        '<table class="t-admin"><thead><tr>' +
        adminHeads.map((h) => '<th class="l">' + esc(h) + '</th>').join('') +
        '</tr></thead><tbody><tr>' +
        Array.from({ length: adminCols })
          .map(() => '<td class="blk"></td>')
          .join('') +
        '</tr></tbody></table>';
      const checkTable = (title, rows) =>
        '<table class="t-check"><thead><tr><th class="l" colspan="2">' +
        esc(title) +
        '</th><th class="yt">Y</th><th class="yt">T</th></tr></thead><tbody>' +
        rows
          .map(
            ([num, item]) =>
              '<tr><td class="num">' +
              esc(num) +
              '</td><td>' +
              esc(item) +
              '</td><td></td><td></td></tr>',
          )
          .join('') +
        '</tbody></table>';
      const bawahHtml =
        '<table class="t-check"><thead><tr><th class="c" colspan="2">Perubahan resep</th></tr><tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr></thead><tbody><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr><tr><td class="blk4"></td><td class="blk4"></td></tr><tr><td class="c" colspan="2">Waktu Tunggu</td></tr><tr><td class="third">Masuk</td><td></td></tr><tr><td>Diserahkan</td><td></td></tr><tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr></tbody></table>';
      const html =
        // HEADER 3 kolom: logo | brand & alamat | no antrian
        '<header class="t-head"><img class="t-logo" alt="Logo" src="' +
        esc(logoSrc) +
        '"/><div class="t-bhead"><h1 class="t-hname">' +
        esc(hospitalName) +
        '</h1>' +
        (headBody[0] ? '<div class="t-hsub">' + esc(headBody[0]) + '</div>' : '') +
        '</div>' +
        (antrianNumber ? '<div class="t-antrian">' + esc(antrianNumber) + '</div>' : '') +
        '</header><main class="t-main"><section class="t-left">' +
        patientMetaHtml +
        '<div class="t-meds">' +
        medListHtml +
        '</div>' +
        adminHtml +
        '</section><section class="t-right">' +
        doctorMetaHtml +
        checkTable('Telaah Resep', telaahResep) +
        checkTable('Telaah Obat', telaahObat) +
        bawahHtml +
        '</section></main><footer class="t-footer">' +
        esc(footerText) +
        '</footer><div class="t-print no-print"><button type="button" class="t-btn" onclick="window.print()">Cetak</button></div>';
      page.innerHTML = html;
      const STYLE_ID = 'ext-telaah-style';
      if (!document.getElementById(STYLE_ID)) {
        const s = document.createElement('style');
        s.id = STYLE_ID;
        s.textContent = `
        .halaman{box-sizing:border-box;width:105mm!important;height:auto!important;margin:0!important;padding:0 3mm}
        @page{size:105mm 241mm;margin:0}
        .halaman *{box-sizing:border-box;font-size:11px!important}
        .halaman{font-family:'Inter',Arial,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

        /* HEADER 3 kolom: logo | brand & alamat | no antrian */
        .t-head{display:flex;align-items:center;padding-bottom:8px;border-bottom:1.5px solid #000;margin-bottom:12px;gap:14px}
        .t-logo{width:60px;height:60px;object-fit:contain;object-position:left top;flex:none}
        .t-bhead{flex:1;font-size:11px;min-width:0}
        .t-hname{font-size:13px;font-weight:800;margin:0 0 4px;letter-spacing:-.01em}
        .t-hsub{line-height:1.3}
        /* ANTRIAN (kolom kanan) \u2014 tanpa label, besar & tebal, contoh "T/R-XX" */
        .t-antrian{flex:none;text-align:right;font-size:34px!important;font-weight:800;color:#198754;letter-spacing:-.02em;font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere;line-height:1.1}

  /* METADATA \u2014 tanpa border, tanpa bold. Label kecil di atas, nilai di bawah
        (stacked) sehingga isi bisa memanjang. Pasien kiri & dokter kanan. */
        .tm-card{background:#fff;padding:4px 0 6px;margin-bottom:6px;font-size:11px;border-bottom:0.5pt solid #333}
        .tm-col{display:flex;flex-direction:column;gap:5px}
        .tm-row{display:flex;flex-direction:column;gap:1px}
        .tm-label{color:#5b6470;font-size:10px;line-height:1.2}
        .tm-val{color:#000;line-height:1.3;word-wrap:break-word}
        /* MAIN 2 kolom \u2014 portrait 105mm: kolom lebih ramping, gap kecil.
           Kolom TIDAK dipaksa sama tinggi (align-items:start) agar bagian bawah
           paraf/tanda tangan tidak membentang kosong. */
        .t-main{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}
        .t-left,.t-right{display:flex;flex-direction:column;gap:6px}
        .t-right .t-check{margin-bottom:0}
        .t-meds{margin-bottom:16px;font-size:11px;min-width:0}

        /* DAFTAR OBAT \u2014 format berurutan R/1, R/4, dst. */
        .med{margin-bottom:8px}
        .med-line{font-size:11px;line-height:1.35;text-align:left}
        .med-line.indent{margin-left:0}
        .med-no{font-weight:400}
        .med-name{font-weight:600}
        .med-sep{color:#374151}
        .med-jml{white-space:nowrap;font-weight:600;color:#047857}
        .med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}
        /* JUMLAH JADI RACIK \u2014 di bawah blok racikan */
        .med-jadiracik{margin-top:4px;padding-top:2px;font-size:11px;font-weight:700}

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
        /* Sel kosong isi tangan \u2014 height eksplisit (min-height tak andal utk
           <td>). Baris admin Hitung/Timbang/Kemas/Paraf. */
        .blk{height:20px;padding:.5pt 3px}
        .blk2{min-height:11px}
        .blk3{min-height:45px}
        .blk4{height:20px;padding:.5pt 3px}
        .t-sub{text-align:center;font-size:11px;margin:4px 0}

        /* FOOTER + BUTTON */
        .t-footer{margin-top:14px;text-align:center;font-weight:700;font-style:italic;font-size:11px}
        .t-print{margin-top:32px;display:flex;gap:8px}
        .t-btn{border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:8px 16px;font-size:11px;cursor:pointer}
        .t-btn:hover{background:#f9fafb}
        @media print{.no-print{display:none!important}}
      `;
        document.head.appendChild(s);
      }
      if (!document.querySelector('link[href*="family=Inter"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap';
        document.head.appendChild(link);
      }
    }
    const run = apply;
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      if (document.documentElement.getAttribute('data-ext-telaah') === '1') {
        window.clearInterval(iv);
        run();
      } else if (Date.now() - t0 > 5e3) {
        window.clearInterval(iv);
      }
    }, 200);
  })();
})();
//# sourceMappingURL=telaahResepPrint.js.map
