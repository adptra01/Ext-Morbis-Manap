(function () {
  'use strict';

  /**
   * Gate fitur: hanya eksekusi bila fitur 'telaahResep' aktif (di-set oleh
   * init.js di world ISOLATED via data-ext-telaah). Karena halaman ini
   * content script world:MAIN (tanpa akses chrome.*), kita polling atribut
   * di <html> — pola sama dengan whenAntrianFarmasiActive().
   */
  async function apply() {
    const PAGE_GUARD = 'ext-telaah-proc';

    const root = document.querySelector('.halaman');
    if (!root || root.getAttribute(PAGE_GUARD)) return;
    const page: Element = root;
    page.setAttribute(PAGE_GUARD, '1'); // set awal agar tidak double-fire

    /** --- utilitas teks --- */
    const txt = (el: Element | null | undefined): string =>
      (el?.textContent || '').replace(/\s+/g, ' ').trim();

    function esc(s: unknown): string {
      return String(s ?? '').replace(
        /[&<>"']/g,
        (c) =>
          ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
      );
    }

    /** --- ekstraksi --- */
    // Header: logo + nama RS (<b>) + baris alamat/kontak (<br>).
    const logoImg = page.querySelector('#logo img');
    const logoSrc = logoImg?.getAttribute('src') || '/assets/images/logo/Kota Jambi.png';
    let hospitalName = 'RSUD H. ABDUL MANAP';
    let headBody: string[] = [];
    const headEl = page.querySelector<HTMLElement>('#head-cetak-logo');
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

    // Metadata: peta label → nilai dari dua nested table.
    const metaMap = new Map<string, string>();
    page.querySelectorAll('.halaman > table:first-of-type table').forEach((t) => {
      t.querySelectorAll('tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length < 2) return;
        const label = txt(tds[0]);
        const value = txt(tds[1]).replace(/^:\s*/, '');
        if (label && !metaMap.has(label)) metaMap.set(label, value);
      });
    });

    const DOCTOR_FIELDS = ['Dokter', 'SIP Dokter', 'Ruangan/Poli'];
    const PATIENT_FIELDS = [
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
    ];
    const getMeta = (label: string): string => metaMap.get(label) ?? '';

    // Daftar obat.
    const medsTables = Array.from(page.querySelectorAll('table.resep-item'));
    const medsTable = medsTables[0];
    interface SubMed {
      name: string;
      strength: string;
      dose: string;
      jmlPerR: string;
      sediaan: string;
    }

    interface Med {
      no: string;
      name: string;
      jml: string;
      aturan: string[];
      subMeds: SubMed[];
    }
    const meds: Med[] = [];
    if (medsTable) {
      const medsMap = new Map<string, Med>();
      let lastMed: Med | null = null;
      medsTable.querySelectorAll('tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        const left = txt(tds[0]);
        const rightEl = tds[1];
        const right = txt(rightEl);
        const numMatch = left.match(/^(?:R\/)?(\d+)/);
        if (numMatch) {
          const num = numMatch[1];
          if (medsMap.has(num)) {
            const existing = medsMap.get(num)!;
            if (right)
              existing.subMeds.push({
                name: right,
                strength: '',
                dose: '',
                jmlPerR: '',
                sediaan: '',
              });
            return;
          }
          const med: Med = { no: num, name: '', jml: '', aturan: [], subMeds: [] };
          medsMap.set(num, med);
          lastMed = med;
          const ps = rightEl ? Array.from(rightEl.querySelectorAll('p')) : [];
          med.name = ps.length ? (ps[0]?.textContent || right).trim() : right;
          const jmlT = ps.length ? ((ps[1] || ps[0]).textContent || '').trim() : '';
          const mJml = jmlT.match(/Jml\s*:\s*(.+)/i);
          med.jml = mJml ? mJml[1].trim() : '';
        } else if (lastMed && right) {
          lastMed.aturan.push(right);
        }
      });
      meds.push(...medsMap.values());
    }
    const adminTable = medsTables[1];

    // --- Fetch racikan detail dari halaman detail/edit ---
    // Halaman cetak hanya punya data obat utama (R/x + Jml).
    // Sub-obat racikan (Parasetamol + Amitriptilin + Codein) ada di
    // /inventory/resep/penerimaan/detail?id=...
    // Sekalian tangkap id_visit & id_kunjungan dari DOM halaman detail utk
    // fetch diagnosa pasien (utama & sekunder).
    let diagVisit = '';
    let diagKunjungan = '';
    async function fetchRacikanDetails(): Promise<Map<string, SubMed[]>> {
      const map = new Map<string, SubMed[]>();
      const params = new URLSearchParams(window.location.search);
      const resepId = params.get('id');
      if (!resepId) return map;

      try {
        const resp = await fetch('/inventory/resep/penerimaan/detail?id=' + resepId, {
          credentials: 'include',
        });
        if (!resp.ok) return map;
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Tangkap id_visit / id_kunjungan dari hidden input di halaman detail
        // (diisi MORBIS via AJAX setelah render, pola sama spt farmasiAntrolShift).
        const inVal = (name: string): string => {
          const el =
            doc.querySelector<HTMLInputElement>('#' + name) ||
            doc.querySelector<HTMLInputElement>('input[name="' + name + '"]') ||
            doc.querySelector<HTMLInputElement>('input[id*="' + name + '"]');
          return el?.value?.trim() || '';
        };
        diagVisit = inVal('id_visit') || params.get('visit') || '';
        diagKunjungan = inVal('id_kunjungan') || '';

        // Cari tabel yang punya header "R/" — ini tabel obat tebus / racikan.
        for (const table of doc.querySelectorAll('table')) {
          const headerRow = table.querySelector('tr');
          if (!headerRow) continue;
          const headers = Array.from(headerRow.querySelectorAll('td, th')).map((td) => txt(td));
          if (!headers.some((h) => /^R\//.test(h))) continue;

          // Tentukan indeks kolom dari header.
          const colName = headers.findIndex((h) => /Packing|Nama.*Obat|Obat/i.test(h));
          const colStrength = headers.findIndex((h) => /Kekuatan/i.test(h));
          const colDose = headers.findIndex((h) => /Dosis/i.test(h));
          const colJmlPerR = headers.findIndex((h) => /Jml.*per/i.test(h));
          const colSediaan = headers.findIndex((h) => /Sediaan/i.test(h));

          let currentNum = '';
          table.querySelectorAll('tr').forEach((tr, i) => {
            if (i === 0) return; // skip header
            const tds = tr.querySelectorAll('td');
            if (tds.length < 5) return;
            const leftText = txt(tds[0]);
            const numMatch = leftText.match(/(\d+)/);
            if (numMatch) {
              currentNum = numMatch[1];
              if (!map.has(currentNum)) map.set(currentNum, []);
              map.get(currentNum)!.push({
                name: colName >= 0 ? txt(tds[colName]) : txt(tds[1]),
                strength: colStrength >= 0 ? txt(tds[colStrength]) : '',
                dose: colDose >= 0 ? txt(tds[colDose]) : '',
                jmlPerR: colJmlPerR >= 0 ? txt(tds[colJmlPerR]) : '',
                sediaan: colSediaan >= 0 ? txt(tds[colSediaan]) : '',
              });
            }
          });
          break; // ketemu tabelnya, stop
        }
      } catch {
        /* fetch gagal — biarkan tanpa sub-obat */
      }
      return map;
    }

    /** Fetch diagnosa pasien (utama & sekunder) dari halaman admisi rawat
     *  jalan (halaman-utama → page 101 "pelaksanaan pelayanan"). Sumber data
     *  sama spt yang ditampilkan saat periksa; fallback ke kosong bila halaman
     *  tak terjangkau / id_visit tidak ada. */
    async function fetchDiagnosis(): Promise<{ utama: string[]; sekunder: string[] }> {
      const res = { utama: [] as string[], sekunder: [] as string[] };
      if (!diagVisit) return res;
      try {
        const qs = new URLSearchParams({
          id_visit: diagVisit,
          page: '101',
          status_periksa: 'belum',
        });
        if (diagKunjungan) qs.set('id_kunjungan', diagKunjungan);
        const resp = await fetch('/admisi/pelaksanaan_pelayanan/halaman-utama?' + qs.toString(), {
          credentials: 'include',
        });
        if (!resp.ok) return res;
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Cari blok "Diagnosa Utama" / "Diagnosa Sekunder". MORBIS biasanya
        // render sebagai label + list input/teks. Robust: cari teks label lalu
        // ambil nilai dari elemen sesudahnya (input, textarea, td, atau p).
        const grab = (
          label: string,
          out: { utama: string[]; sekunder: string[] },
          key: 'utama' | 'sekunder',
        ): void => {
          const found: string[] = [];
          doc.querySelectorAll('*').forEach((el: Element) => {
            if (el.children.length) return; // skip elemen yang punya child (label di parent)
            const t = txt(el);
            if (!t) return;
            if (new RegExp('^' + label + '\\s*:?$', 'i').test(t)) {
              // Nilai = teks elemen berikutnya dalam scope yang masuk akal.
              let cur: Element | null = el;
              for (let i = 0; i < 4; i++) {
                cur = cur.nextElementSibling;
                if (!cur) break;
                const v = txt(cur);
                if (v) {
                  found.push(
                    ...v
                      .split(/\s*[,;]\s*/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  );
                  break;
                }
              }
            }
          });
          out[key] = found;
        };
        grab('Diagnosa Utama', res, 'utama');
        grab('Diagnosa Sekunder', res, 'sekunder');
      } catch {
        /* fetch gagal — tanpa diagnosa */
      }
      return res;
    }

    const diagnosis = await fetchDiagnosis();
    const racikanMap = await fetchRacikanDetails();

    // Merge sub-obat racikan ke dalam meds.
    for (const med of meds) {
      const num = med.no.replace(/\D/g, '');
      const subs = racikanMap.get(num);
      if (subs && subs.length > 1) {
        med.subMeds = subs;
      }
    }

    // Checklist Telaah Resep & Telaah Obat.
    const chkForm = page.querySelector<HTMLFormElement>('#form_checklist_telaah_resep');
    const readCheck = (title: string): string[][] => {
      const rows: string[][] = [];
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

    // Footer.
    const footerEl = Array.from(page.querySelectorAll('center, strong')).find((el) =>
      /Obat tidak boleh diganti/i.test(txt(el)),
    );
    const footerText = footerEl
      ? txt(footerEl)
      : 'Obat tidak boleh diganti tanpa sepengetahuan Dokter';

    /** --- render (struktur template, CSS self-contained) --- */
    // Metadata format: label di baris atas, nilai di baris bawah (stacked) —
    // nilai bisa memanjang tanpa dibatasi lebar label.
    const metaLine = (label: string, value: string, vClass = ''): string =>
      '<div class="tm-row">' +
      '<span class="tm-label">' +
      esc(label) +
      '</span>' +
      '<span class="tm-val' +
      (vClass ? ' ' + vClass : '') +
      '">' +
      (value && value.trim() ? esc(value) : '-') +
      '</span>' +
      '</div>';

    // Diagnosa pasien (utama & sekunder) — dari halaman admisi. Tampil sebelum
    // daftar obat supaya konteks klinis jelas saat telaah.
    const diagHtml =
      '<section class="tm-card">' +
      '<div class="diag-title">Diagnosa</div>' +
      '<div class="tm-row"><span class="tm-label">Utama</span>' +
      '<span class="tm-val">' +
      (diagnosis.utama.length ? esc(diagnosis.utama.join(', ')) : '-') +
      '</span></div>' +
      (diagnosis.sekunder.length
        ? '<div class="tm-row"><span class="tm-label">Sekunder</span>' +
          '<span class="tm-val">' +
          esc(diagnosis.sekunder.join(', ')) +
          '</span></div>'
        : '') +
      '</section>';

    // Metadata: pasien (kiri, nyambung ke list obat) & dokter (kanan, nyambung
    // ke Telaah Resep). TANPA bold.
    const patientMetaHtml =
      '<section class="tm-card">' +
      '<div class="tm-col">' +
      PATIENT_FIELDS.map((f) => metaLine(f, getMeta(f))).join('') +
      '</div>' +
      '</section>';
    const doctorMetaHtml =
      '<section class="tm-card">' +
      '<div class="tm-col">' +
      DOCTOR_FIELDS.map((f) => metaLine(f, getMeta(f))).join('') +
      '</div>' +
      '</section>';

    const medListHtml = meds
      .map(
        (m) =>
          '<div class="med">' +
          '<div class="med-head">' +
          '<span class="med-txt"><span class="med-no">' +
          esc(m.no) +
          '</span> ' +
          '<span class="med-name">' +
          esc(m.name) +
          '</span></span>' +
          (m.jml ? '<span class="med-jml">Jml: ' + esc(m.jml) + '</span>' : '') +
          '</div>' +
          // Sub-obat racikan (detail dari halaman edit)
          (m.subMeds.length > 1
            ? '<div class="med-submeds">' +
              m.subMeds
                .map(
                  (s) =>
                    '<div class="med-submed">' +
                    '<span class="med-submed-name">' +
                    esc(s.name) +
                    '</span>' +
                    (s.strength
                      ? ' <span class="med-submed-detail">' + esc(s.strength) + '</span>'
                      : '') +
                    (s.dose ? ' <span class="med-submed-detail">' + esc(s.dose) + '</span>' : '') +
                    (s.jmlPerR
                      ? ' <span class="med-submed-jml">' +
                        esc(s.jmlPerR) +
                        (s.sediaan ? '/' + esc(s.sediaan) : '') +
                        '</span>'
                      : '') +
                    '</div>',
                )
                .join('') +
              '</div>'
            : '') +
          (m.aturan.length
            ? '<div class="med-aturan">' + m.aturan.map((a) => esc(a)).join('<br/>') + '</div>'
            : '') +
          '</div>',
      )
      .join('');

    // Tabel admin (Hitung/Timbang/Kemas/Paraf). Baris header sumber memuat sel
    // kosong → filter, lalu tambah kolom "Paraf" sesuai template priority (4).
    const adminHeads: string[] = adminTable
      ? Array.from(adminTable.querySelectorAll('tr:first-child td'))
          .map((td) => txt(td))
          .filter(Boolean)
      : ['Hitung', 'Timbang', 'Kemas'];
    if (!adminHeads.some((h) => /paraf/i.test(h))) adminHeads.push('Paraf');
    const adminCols = adminHeads.length;

    const adminHtml =
      '<table class="t-admin">' +
      '<thead><tr>' +
      adminHeads.map((h) => '<th class="l">' + esc(h) + '</th>').join('') +
      '</tr></thead><tbody><tr>' +
      Array.from({ length: adminCols })
        .map(() => '<td class="blk"></td>')
        .join('') +
      '</tr></tbody></table>';

    const checkTable = (title: string, rows: string[][]): string =>
      '<table class="t-check">' +
      '<thead><tr>' +
      '<th class="l" colspan="2">' +
      esc(title) +
      '</th>' +
      '<th class="yt">Y</th><th class="yt">T</th>' +
      '</tr></thead><tbody>' +
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

    const persetujuanHtml =
      '<div class="t-sub">Persetujuan Perubahan Resep</div>' +
      '<table class="t-check">' +
      '<thead>' +
      '<tr><th class="c" colspan="2">Perubahan resep</th></tr>' +
      '<tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr>' +
      '</thead><tbody>' +
      '<tr><td class="blk2"></td><td class="blk2"></td></tr>' +
      '<tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr>' +
      '<tr><td class="blk2"></td><td class="blk2"></td></tr>' +
      '</tbody></table>';

    const waktuHtml =
      '<table class="t-check">' +
      '<thead><tr><th class="c" colspan="2">Waktu Tunggu</th></tr></thead>' +
      '<tbody>' +
      '<tr><td class="third">Masuk</td><td></td></tr>' +
      '<tr><td>Diserahkan</td><td></td></tr>' +
      '</tbody></table>';

    const edukasiHtml =
      '<table class="t-check">' +
      '<thead><tr><th class="c" colspan="2">Edukasi</th><th class="yt"></th></tr></thead>' +
      '<tbody>' +
      [
        ['1', 'Nama Obat'],
        ['2', 'Kegunaan Obat'],
        ['3', 'Dosis&Sediaan Obat'],
        ['4', 'Rute & cara pakai'],
        ['5', 'Cara penyimpanan'],
        ['6', 'Efek samping'],
        ['7', 'Alergi obat'],
      ]
        .map(([n, item]) => '<tr><td class="num">' + n + '</td><td>' + item + '</td><td></td></tr>')
        .join('') +
      '</tbody></table>';

    const parafHtml =
      '<table class="t-check">' +
      '<tbody>' +
      '<tr><td class="twothird">Paraf dan Nama<br/>Pasien/Keluarga</td><td class="blk3"></td></tr>' +
      '</tbody></table>';

    const html =
      // HEADER (priority template: items-center, logo 80px, nama + alamat saja)
      '<header class="t-head">' +
      '<img class="t-logo" alt="Logo" src="' +
      esc(logoSrc) +
      '"/>' +
      '<div class="t-bhead">' +
      '<h1 class="t-hname">' +
      esc(hospitalName) +
      '</h1>' +
      (headBody[0] ? '<div class="t-hsub">' + esc(headBody[0]) + '</div>' : '') +
      '</div>' +
      '</header>' +
      // METADATA + MAIN (2 kolom, metadata nyambung ke isi kolom masing-masing)
      '<main class="t-main">' +
      '<section class="t-left">' +
      patientMetaHtml +
      diagHtml +
      '<div class="t-meds">' +
      medListHtml +
      '</div>' +
      adminHtml +
      '</section>' +
      '<section class="t-right">' +
      doctorMetaHtml +
      checkTable('Telaah Resep', telaahResep) +
      checkTable('Telaah Obat', telaahObat) +
      persetujuanHtml +
      waktuHtml +
      edukasiHtml +
      parafHtml +
      '</section>' +
      '</main>' +
      // FOOTER + CETAK
      '<footer class="t-footer">' +
      esc(footerText) +
      '</footer>' +
      '<div class="t-print no-print">' +
      '<button type="button" class="t-btn" onclick="window.print()">Cetak</button>' +
      '</div>';

    page.innerHTML = html;

    // CSS self-contained — dijamin 2 kolom & tampilan template tanpa CDN.
    const STYLE_ID = 'ext-telaah-style';
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = `
        .halaman{box-sizing:border-box;width:105mm!important;height:auto!important;margin:0!important;padding:0 3mm}
        @page{size:105mm 241mm;margin:0}
        .halaman *{box-sizing:border-box;font-size:11px!important}
        .halaman{font-family:'Inter',Arial,sans-serif;font-size:11px;line-height:1.25;color:#000;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}

        /* HEADER (priority: items-center, logo 80px) */
        .t-head{display:flex;align-items:center;padding-bottom:8px;border-bottom:1.5px solid #000;margin-bottom:12px;gap:14px}
        .t-logo{width:60px;height:60px;object-fit:contain;object-position:left top;flex:none}
        .t-bhead{flex:1;font-size:11px}
        .t-hname{font-size:13px;font-weight:800;margin:0 0 4px;letter-spacing:-.01em}
        .t-hsub{line-height:1.3}

  /* METADATA — tanpa border, tanpa bold. Label kecil di atas, nilai di bawah
        (stacked) sehingga isi bisa memanjang. Pasien kiri & dokter kanan. */
        .tm-card{background:#fff;padding:4px 0 6px;margin-bottom:6px;font-size:11px;border-bottom:0.5pt solid #333}
        .tm-col{display:flex;flex-direction:column;gap:5px}
        .tm-row{display:flex;flex-direction:column;gap:1px}
        .tm-label{color:#5b6470;font-size:10px;line-height:1.2}
        .tm-val{color:#000;line-height:1.3;word-wrap:break-word}
        /* DIAGNOSA — blok ringkas, label tebal di atas */
        .diag-title{font-weight:800;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#5b6470;margin-bottom:2px}

        /* MAIN 2 kolom — portrait 105mm: kolom lebih ramping, gap kecil */
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

        /* SUB-OBAT RACIKAN */
        .med-submeds{margin-left:16px;margin-top:3px;border-top:0.5pt dashed #9ca3af;padding-top:3px}
        .med-submed{font-size:10px;line-height:1.3;color:#374151;margin-bottom:1px}
        .med-submed-name{font-weight:600}
        .med-submed-detail{font-weight:400}
        .med-submed-jml{font-weight:600;color:#047857}

        /* TABEL — checklist */
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
      `;
      document.head.appendChild(s);
    }

    // Font Inter (fallback Arial bila offline).
    if (!document.querySelector('link[href*="family=Inter"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }

  // Jalankan segera jika tanda sudah ada; jika belum, polling sebentar.
  const run = apply;
  const t0 = Date.now();
  const iv = window.setInterval(() => {
    if (document.documentElement.getAttribute('data-ext-telaah') === '1') {
      window.clearInterval(iv);
      run();
    } else if (Date.now() - t0 > 5000) {
      window.clearInterval(iv); // fitur telaah resep tidak aktif -> biarkan halaman default
    }
  }, 200);
})();
