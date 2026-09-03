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
    // Nilai Diagnosa, dipecah per <br> (server render telaah → baris "Diagnosa"):
    let serverDiag: string[] = [];
    page.querySelectorAll('.halaman > table:first-of-type table').forEach((t) => {
      t.querySelectorAll('tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length < 2) return;
        const label = txt(tds[0]);
        const value = txt(tds[1]).replace(/^:\s*/, '');
        if (label && !metaMap.has(label)) metaMap.set(label, value);
        if (/^diagnosa$/i.test(label)) {
          // Preserve per-baris (server render pakai <br>) utk daftar diagnosa.
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

    const getMeta = (label: string): string => metaMap.get(label) ?? '';

    // Daftar obat — dibangun dari data-resep-new (bukan dari table.resep-item).
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
      jumlahJadi: string; // jumlah jadi racik (total racikan)
      sediaan: string; // bentuk sediaan racikan (mis. "Tablet")
      aturan: string[];
      subMeds: SubMed[];
    }
    const meds: Med[] = [];
    const medsTables = Array.from(page.querySelectorAll('table.resep-item'));
    const adminTable = medsTables[1];

    // --- Fetch racikan detail & diagnosa dari halaman detail/edit ---
    // Halaman cetak hanya punya data obat utama (R/x + Jml).
    // Sub-obat racikan + diagnosa (fieldset#perhatian > Riwayat Diagnosa Pasien) ada di
    // /inventory/resep/penerimaan/detail?id=... ATAU /inventory/penjualan-resep-edit/detail?...
    // Sekalian tangkap id_visit & id_kunjungan dari hidden input utk fallback.
    let diagVisit = '';
    let diagKunjungan = '';
    let diagnosisUtama: string[] = [];
    let diagnosisSekunder: string[] = [];
    let antrianNumber = '';
    let noSep = '';

    async function fetchRacikanDetails(): Promise<void> {
      const params = new URLSearchParams(window.location.search);
      // Param bisa 'id_resep' (telaah print) ATAU 'id' (endpoint lain) & 'penjualan'
      const resepId = params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
      if (!resepId) return;

      // Coba 2 endpoint detail: penerimaan & penjualan-edit (keduanya punya fieldset#perhatian)
      const detailUrls = [
        '/inventory/resep/penerimaan/detail?id=' + resepId,
        '/inventory/penjualan-resep-edit/detail?id=' + resepId,
      ];

      for (const url of detailUrls) {
        try {
          const resp = await fetch(url, { credentials: 'include' });
          if (!resp.ok) continue;
          const html = await resp.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');

          // Tangkap id_visit / id_kunjungan dari hidden input
          const inVal = (name: string): string => {
            const el =
              doc.querySelector<HTMLInputElement>('#' + name) ||
              doc.querySelector<HTMLInputElement>('input[name="' + name + '"]') ||
              doc.querySelector<HTMLInputElement>('input[id*="' + name + '"]');
            return el?.value?.trim() || '';
          };
          diagVisit = inVal('id_visit') || params.get('visit') || diagVisit;
          diagKunjungan = inVal('id_kunjungan') || diagKunjungan;
          noSep = inVal('no_sep') || noSep;

          // Ambil diagnosa dari fieldset#perhatian yg punya legend "Riwayat Diagnosa Pasien"
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

          if (diagnosisUtama.length) break;
        } catch {
          /* coba url berikutnya */
        }
      }
    }

    // Endpoint AJAX data-resep-new: sumber utama utk daftar obat, aturan, & sediaan.
    // Mengembalikan array resep lengkap — dipakai utk build meds langsung.
    type ResepItem = Record<string, unknown>;
    async function fetchResepItems(): Promise<ResepItem[]> {
      const resepId = params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
      if (!resepId) return [];
      try {
        const resp = await fetch(
          '/inventory/resep/akses/penerimaan?type=ajax&opsi=data-resep-new&q=1&id=' +
            encodeURIComponent(resepId),
          { credentials: 'include', cache: 'no-store' },
        );
        if (!resp.ok) return [];
        const j = (await resp.json()) as { resep?: ResepItem[] };
        return Array.isArray(j?.resep) ? j.resep : [];
      } catch {
        return [];
      }
    }

    // Fetch nomor antrian dari App Antrian (Reports SIMRS) via resep_id
    async function fetchAntrianNumber(resepId: string): Promise<string> {
      try {
        // Probe base URL app antrian (sama spt farmasiQueueSync)
        let base = 'http://dev.rsudkotajambi.id/rs';
        try {
          const ov = localStorage.getItem('ext-farmasi-app-base');
          if (ov && /^https?:\/\//.test(ov)) base = ov.replace(/\/+$/, '');
        } catch {
          /* ignore localStorage error */
        }
        const resp = await fetch(
          base + '/api/queue/lookup?resep_id=' + encodeURIComponent(resepId),
          {
            cache: 'no-store',
            credentials: 'omit',
          },
        );
        if (!resp.ok) return '';
        const j = (await resp.json()) as {
          ok?: boolean;
          found?: boolean;
          queue?: { queue_number?: string };
        };
        if (j.ok && j.found && j.queue?.queue_number) return j.queue.queue_number;
      } catch {
        /* app tidak terjangkau */
      }
      return '';
    }

    // Fetch nomor antrian dari App Antrian (Reports SIMRS) via resep_id
    const params = new URLSearchParams(window.location.search);
    const resepIdForQueue =
      params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
    antrianNumber = resepIdForQueue ? await fetchAntrianNumber(resepIdForQueue) : '';

    await fetchRacikanDetails(); // fetch diagnosa from detail page

    // Sumber data obat: endpoint AJAX data-resep-new (sama dgn yg populate
    // tabel resep obat di halaman detail). Build meds langsung dari sini —
    // grouping by NO_R, discriminator: JENIS_R ("Racikan"/"Tunggal").
    const resepItems = await fetchResepItems();
    if (resepItems.length) {
      meds.length = 0; // reset meds dari table.resep-item
      const groups = new Map<string, ResepItem[]>();
      for (const it of resepItems) {
        const noR = String(it.NO_R ?? '').trim();
        if (!noR) continue;
        if (!groups.has(noR)) groups.set(noR, []);
        groups.get(noR)!.push(it);
      }
      for (const [noR, items] of groups) {
        const first = items[0];
        const isRacikan =
          String(first.JENIS_R ?? '').toLowerCase() === 'racikan' ||
          String(first.JENIS_RSP ?? '').toLowerCase() === 'racikan';
        const sediaanRacikan = String(first.NAMA_RACIKAN ?? '').trim();
        // Aturan: ambil dari ATURAN_PAKAI_MANUAL, buang leading "- "
        const rawAturan = String(first.ATURAN_PAKAI_MANUAL ?? '').trim();
        const aturanTxt = rawAturan.replace(/^-\s*/, '').trim();

        if (isRacikan || items.length > 1) {
          // Racikan: tiap item = subMed (bahan)
          const med: Med = {
            no: 'R/' + noR,
            name: sediaanRacikan || '',
            jml: '',
            jumlahJadi: String(first.JUMLAH_RACIKAN ?? '').trim() || '',
            sediaan: sediaanRacikan,
            aturan: aturanTxt ? [aturanTxt] : [],
            subMeds: items.map((it) => ({
              name: String(it.NAMA ?? '').trim(),
              strength: String(it.KEKUATAN_R_RACIK ?? it.KEKUATAN ?? '').trim(),
              dose: '',
              jmlPerR: String(it.JUMLAH_R_PAKAI ?? '').trim(),
              sediaan: String(it.SEDIAAN ?? '').trim(),
            })),
          };
          meds.push(med);
        } else {
          // Tunggal: satu item
          const med: Med = {
            no: 'R/' + noR,
            name: String(first.NAMA ?? '').trim(),
            jml: String(first.JUMLAH_R_RESEP ?? first.JUMLAH_R_PAKAI ?? '').trim(),
            jumlahJadi: '',
            sediaan: String(first.SEDIAAN ?? '').trim(),
            aturan: aturanTxt ? [aturanTxt] : [],
            subMeds: [],
          };
          meds.push(med);
        }
      }
    }

    // Fallback: kalau fetch detail tidak dapat diagnosa, pakai baris "Diagnosa"
    // yang sudah di-render server di halaman telaah (reliable, tanpa network).
    if (!diagnosisUtama.length && serverDiag.length) diagnosisUtama = serverDiag;

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
    // Metadata format: grid (label kiri + titik dua, nilai kanan). field panjang pakai 'long' class.
    const metaLine = (label: string, value: string, vClass = '', rowClass = ''): string =>
      '<div class="tm-row' +
      (rowClass ? ' ' + rowClass : '') +
      '">' +
      '<span class="tm-label">' +
      esc(label) +
      ':</span>' +
      '<span class="tm-val' +
      (vClass ? ' ' + vClass : '') +
      '">' +
      (value && value.trim() ? esc(value) : '-') +
      '</span>' +
      '</div>';

    // Diagnosa pasien (utama & sekunder) — dari fieldset#perhatian halaman detail.
    // Tampil sebelum daftar obat supaya konteks klinis jelas saat telaah.
    // Diagnosa: Utama + Sekunder disatukan dalam satu nilai, tanpa label
    // "Utama"/"Sekunder" (menyatu sesuai permintaan).
    const diagValues = [
      ...(diagnosisUtama.length ? [diagnosisUtama.join(', ')] : []),
      ...(diagnosisSekunder.length ? [diagnosisSekunder.join(', ')] : []),
    ];

    // Metadata: pasien (kiri) & dokter (kanan). No HP tetap kiri; data pasien
    // lain (No Resep, Tanggal & Jam, Penjamin) pindah kanan. TANPA bold.
    const g = (l: string): string => getMeta(l);

    // Pasien & JK digabung: "ADI PUTRA (L)"
    const jk = g('Jenis Kelamin');
    const jkShort = /^perempuan$/i.test(jk) ? 'P' : /^laki-laki$/i.test(jk) ? 'L' : jk;
    const pasienJK = (g('Nama Pasien') || '-') + (jk ? ' (' + jkShort + ')' : '');

    // Dokter & Ruangan digabung: "dr. X / Poli Dalam"
    const dokterRuang = (g('Dokter') || '-') + (g('Ruangan/Poli') ? ' / ' + g('Ruangan/Poli') : '');

    // Alergi & BB digabung 1 baris. Lookup label tahan variasi dari server
    // (misal "Berat Badan / Umur", "BB", "Riwayat Alergi", dll).
    const look = (re: RegExp): string => {
      for (const k of metaMap.keys()) if (re.test(k)) return metaMap.get(k) || '';
      return '';
    };
    const alergi = look(/alergi/i);
    const bb = look(/berat|\bbb\b/i);
    // "Paracetamol, Amlodipin, Injeksi, ... / BB 72 kg".
    // Tanpa BB: " / - kg". Selalu sertakan satuan kg.
    const bbTxt = bb ? (/\bkg\b/i.test(bb) ? bb : bb + ' kg') : '- kg';
    const alergiBB = (alergi ? alergi : '-') + ' / ' + (bb ? 'BB ' + bbTxt : bbTxt);
    // ==== KIRI (pasien) — 6 baris ====
    const patientRows: [string, string, string][] = [
      ['Pasien', pasienJK, ''],
      ['No. RM', g('No. RM'), ''],
      ['Tgl. Lahir', g('Tgl. Lahir/Umur'), ''],
      ['Alergi & BB', alergiBB, ''],
      ['Alamat', g('Alamat'), 'long'],
      ['No HP', g('No HP'), ''],
    ];
    // ==== KANAN (dokter + data pasien pindahan) — 6 baris ====
    const doctorRows: [string, string, string][] = [
      ['Dokter', dokterRuang, ''],
      ['SIP Dokter', g('SIP Dokter'), ''],
      ['No Resep', g('No Resep'), ''],
      ['No SEP', noSep || '-', ''],
      ['Tanggal', g('Tanggal & Jam'), ''],
      ['Penjamin', g('Penjamin'), ''],
    ];

    // Diagnosa digabung jadi baris terakhir di kolom pasien (tanpa border/card),
    // menyatu setelah No HP. Label "Diagnosa", nilai di bawah. Pakai 'long' class.
    const diagThen = metaLine(
      'Diagnosa',
      diagValues.length ? diagValues.join(', ') : '-',
      '',
      'long',
    );

    const patientMetaHtml =
      '<section class="tm-card tm-card--small tm-card--left">' +
      '<div class="tm-col">' +
      patientRows.map(([l, v, rc]) => metaLine(l, v, '', rc)).join('') +
      diagThen +
      '</div>' +
      '</section>';
    const doctorMetaHtml =
      '<section class="tm-card tm-card--right">' +
      '<div class="tm-col">' +
      doctorRows.map(([l, v, rc]) => metaLine(l, v, '', rc)).join('') +
      '</div>' +
      '</section>';

    const medListHtml = meds
      .map((m) => {
        // Racikan: label "Racikan", tiap bahan "R/N Nama - qty" (pertama) /
        // "Nama - qty" (indent), lalu "N Racikan - aturan".
        if (m.subMeds.length) {
          const lines = m.subMeds
            .map((s, i) => {
              const jml = s.jmlPerR || '';
              return (
                '<div class="med-line' +
                (i > 0 ? ' indent' : '') +
                '">' +
                (i === 0 ? '<span class="med-no">' + esc(m.no) + '</span> ' : '') +
                '<span class="med-name">' +
                esc(s.name) +
                '</span>' +
                (jml ? ', <span class="med-jml">Jml: ' + esc(jml) + '</span>' : '') +
                '</div>'
              );
            })
            .join('');
          // "10 Tablet - (3x1)": total + sediaan + aturan (dalam kurung).
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
        // Tunggal: "R/N Nama - qty" + aturan.
        const jml = m.jml || '';
        return (
          '<div class="med">' +
          '<div class="med-line">' +
          '<span class="med-no">' +
          esc(m.no) +
          '</span> ' +
          '<span class="med-name">' +
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
      '<th class="yt">Y/T</th>' +
      '</tr></thead><tbody>' +
      rows
        .map(
          ([num, item]) =>
            '<tr><td class="num">' +
            esc(num) +
            '</td><td>' +
            esc(item) +
            '</td><td class="yt"></td></tr>',
        )
        .join('') +
      '</tbody></table>';

    // Bagian bawah digabung jadi 1 tabel: Persetujuan Perubahan Resep +
    // Waktu Tunggu + Paraf Pasien/Keluarga.
    const bawahHtml =
      '<table class="t-check">' +
      '<thead>' +
      '<tr><th class="c" colspan="2">Perubahan resep</th></tr>' +
      '<tr><th class="c half">Tertulis</th><th class="c half">Menjadi</th></tr>' +
      '</thead><tbody>' +
      '<tr><td class="blk4"></td><td class="blk4"></td></tr>' +
      '<tr><td class="c">Apoteker</td><td class="c">Disetujui Dokter</td></tr>' +
      '<tr><td class="blk4"></td><td class="blk4"></td></tr>' +
      '<tr><td class="c" colspan="2">Waktu Tunggu</td></tr>' +
      '<tr><td class="third">Masuk</td><td></td></tr>' +
      '<tr><td>Diserahkan</td><td></td></tr>' +
      '<tr><td class="twothird">Paraf Pasien/Keluarga</td><td class="blk3"></td></tr>' +
      '</tbody></table>';

    const html =
      // HEADER 3 kolom: logo | brand & alamat | no antrian
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
      (antrianNumber
        ? '<div class="t-antrian">' +
          esc(antrianNumber.replace(/^(.*?)(\d+)$/, '$1\n$2')) +
          '</div>'
        : '') +
      '</header>' +
      // METADATA + MAIN (2 kolom, metadata nyambung ke isi kolom masing-masing)
      '<main class="t-main">' +
      '<section class="t-left">' +
      patientMetaHtml +
      '<div class="t-meds">' +
      medListHtml +
      '</div>' +
      adminHtml +
      '</section>' +
      '<section class="t-right">' +
      doctorMetaHtml +
      checkTable('Telaah Resep', telaahResep) +
      checkTable('Telaah Obat', telaahObat) +
      bawahHtml +
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

    // === ADAPTIVE DENSITY:ukur tinggi DOM, pilih kelas yang sesuai ===
    // Target: 241mm = 912px (pada 96dpi). Beri buffer 5% utk sub-pixel.
    const TARGET_HEIGHT_PX = 866; // 241mm * 96dpi / 25.4 * 0.95
    const pageH = page.scrollHeight;
    if (pageH > TARGET_HEIGHT_PX) {
      page.classList.add('compact');
      // Force reflow agar CSS compact diterapkan sebelum ukur ulang
      void (page as HTMLElement).offsetHeight;
      // Ukur lagi setelah CSS compact diterapkan
      if (page.scrollHeight > TARGET_HEIGHT_PX) {
        page.classList.remove('compact');
        page.classList.add('ultra');
      }
    }

    // CSS self-contained — dijamin 2 kolom & tampilan template tanpa CDN.
    const STYLE_ID = 'ext-telaah-style';
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement('style');
      s.id = STYLE_ID;
      s.textContent = `
        /* === PRINT CONTRACT: 105mm × 241mm === */
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

        /* METADATA — grid: label kiri, nilai kanan (efisien tinggi) */
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

        /* MAIN 2 kolom — kiri lebih lebar utk nama obat */
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

        /* TABEL — checklist (font sama dengan info pasien & dokter = 10px) */
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
      `;
      document.head.appendChild(s);
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
