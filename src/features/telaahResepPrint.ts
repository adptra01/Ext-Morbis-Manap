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
      jumlahJadi: string; // jumlah jadi racik (total racikan)
      aturan: string[];
      subMeds: SubMed[];
    }
    const meds: Med[] = [];
    if (medsTable) {
      const medsMap = new Map<string, Med>();
      let lastMed: Med | null = null;
      medsTable.querySelectorAll('tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length < 2) return;
        const left = txt(tds[0]);
        const rightEl = tds[1];
        const right = txt(rightEl);
        const numMatch = left.match(/^(?:R\/)?(\d+)/);
        if (numMatch) {
          const num = numMatch[1];
          const med: Med = { no: num, name: '', jml: '', jumlahJadi: '', aturan: [], subMeds: [] };
          medsMap.set(num, med);
          lastMed = med;
          // Baris pertama racikan: bisa nama obat TUNGGAL (R/x + Jml) atau
          // bahan pertama dari racikan (R/1 + ingredient pertama).
          const ps = rightEl ? Array.from(rightEl.querySelectorAll('p')) : [];
          med.name = ps.length ? (ps[0]?.textContent || right).trim() : right;
          const jmlT = ps.length > 1 ? (ps[1]?.textContent || '').trim() : '';
          const mJml = jmlT.match(/Jml\s*:\s*(.+)/i);
          med.jml = mJml ? mJml[1].trim() : '';
          // Kalau ada Jml pada baris pertama → obat TUNGGAL (bukan racikan).
          // Kalau tidak, maka ia bahan pertama racikan → jadikan subMeds.
          if (ps.length && !mJml && med.name) {
            med.subMeds.push({
              name: med.name,
              strength: '',
              dose: '',
              jmlPerR: '',
              sediaan: '',
            });
            med.name = ''; // nama racikan kosong → tampilkan lewat subMeds
          }
          return;
        }
        if (!lastMed || !right) return;
        // Baris lanjutan (tanpa nomor R/):
        // - Racikan: sel kanan memakai <div style='display:flex'><p>nama</p><p>Jml:N</p></div>
        // - Sediaan/Jumlah/Aturan: sel polos (Tanpa <p>).
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
        // Sel polos: "Tablet" (sediaan) / "Jumlah : 10" (total racikan) / "(3x1)" (aturan)
        const jmlJadi = right.match(/^Jumlah\s*:\s*(.+)$/i);
        if (jmlJadi) {
          lastMed.jumlahJadi = jmlJadi[1].trim();
          return;
        }
        lastMed.aturan.push(right);
      });
      meds.push(...medsMap.values());
    }
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

    async function fetchRacikanDetails(): Promise<Map<string, SubMed[]>> {
      const map = new Map<string, SubMed[]>();
      const params = new URLSearchParams(window.location.search);
      // Param bisa 'id_resep' (telaah print) ATAU 'id' (endpoint lain) & 'penjualan'
      const resepId = params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
      if (!resepId) return map;

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

          // Ambil diagnosa dari fieldset#perhatian yg punya legend "Riwayat Diagnosa Pasien"
          // (ada beberapa fieldset#perhatian di halaman, pilih yg benar).
          const fieldsets = Array.from(doc.querySelectorAll('fieldset#perhatian'));
          const fs = fieldsets.find((f) => {
            const leg = f.querySelector('legend');
            return leg && /riwayat\s*diagnosa\s*pasien/i.test(txt(leg));
          });
          if (fs) {
            // Ambil SEMUA li dari fieldset ini, lalu pisahkan utama vs sekunder
            // Struktur bisa 2 macam:
            // A) <ol><li>utama</li></ol> + <strong>Sekunder</strong><ol><li>sekunder</li></ol> (sibling ol)
            // B) <ol><li>utama</li><br><strong>Sekunder</strong><ol><li>sekunder</li></ol></ol> (nested di dalam ol pertama)
            const allLis = Array.from(fs.querySelectorAll('li'))
              .map((li) => txt(li))
              .filter(Boolean);

            // Cari index dimana "Diagnosa Sekunder" muncul (di dalam li atau di strong terpisah)
            let sekunderStartIdx = -1;
            const strongs = Array.from(fs.querySelectorAll('strong, b'));
            for (const s of strongs) {
              if (/diagnosa\s*sekunder/i.test(txt(s))) {
                // Cari li yang mengandung strong ini, atau li setelahnya
                const parentLi = s.closest('li');
                if (parentLi) {
                  const idx = Array.from(fs.querySelectorAll('li')).indexOf(parentLi);
                  if (idx >= 0) sekunderStartIdx = idx;
                } else {
                  // Strong terpisah - cari ol berikutnya
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
              // Fallback: semua dianggap utama jika tidak ketemu pemisah
              diagnosisUtama = allLis;
            }
          }

          // Cari tabel racikan (header "R/")
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
                map.get(currentNum)!.push({
                  name: colName >= 0 ? txt(tds[colName]) : txt(tds[1]),
                  strength: colStrength >= 0 ? txt(tds[colStrength]) : '',
                  dose: colDose >= 0 ? txt(tds[colDose]) : '',
                  jmlPerR: colJmlPerR >= 0 ? txt(tds[colJmlPerR]) : '',
                  sediaan: colSediaan >= 0 ? txt(tds[colSediaan]) : '',
                });
              }
            });
            break; // ketemu tabel racikan, stop
          }

          // Kalau sudah dapat diagnosa & racikan, cukup
          if (diagnosisUtama.length || map.size) break;
        } catch {
          /* coba url berikutnya */
        }
      }
      return map;
    }

    // Sumber data per-obat racikan yang LENGKAP & terpercaya: halaman
    // /inventory/print/cetak-resep-asli?id=<resep> — di-render server, berisi
    // Jml masing-masing bahan (10/10/5), aturan (3x1), & total racikan (10).
    // Tidak butuh id_penjualan (telaah print hanya punya id_resep).
    const normName = (s: string): string =>
      String(s || '')
        .toLowerCase()
        .replace(/\b(tablet|drops|kaplet|kapsul|puyer|salep)\b/g, '')
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const namesMatch = (a: string, b: string): boolean => {
      const na = normName(a);
      const nb = normName(b);
      if (!na || !nb) return false;
      return na.includes(nb) || nb.includes(na);
    };

    // Parse satu dokumen salinan/asli resep ke dalam map { R/N -> {ingredients, aturan, jumlahRacikan} }.
    function parseRacikanAsli(
      doc: Document,
      map: Map<
        string,
        { ingredients: { name: string; jml: string }[]; aturan: string[]; jumlahRacikan: string }
      >,
    ): void {
      // Cari tabel yang punya sel kiri "R/N".
      let tbl: Element | null = null;
      for (const t of Array.from(doc.querySelectorAll('table'))) {
        const lefts = Array.from(t.querySelectorAll('tr > td:first-child'));
        if (lefts.some((td) => /^R\/\d+/.test(txt(td)))) {
          tbl = t;
          break;
        }
      }
      if (!tbl) return;

      let cur: {
        ingredients: { name: string; jml: string }[];
        aturan: string[];
        jumlahRacikan: string;
      } | null = null;
      tbl.querySelectorAll('tr').forEach((tr) => {
        const tds = tr.querySelectorAll('td');
        if (tds.length < 2) return;
        const left = txt(tds[0]);
        const numMatch = left.match(/^R\/(\d+)/);
        if (numMatch) {
          cur = { ingredients: [], aturan: [], jumlahRacikan: '' };
          map.set(numMatch[1], cur);
          // Baris ini berisi bahan-bahan (dipisah <br>).
          tds[1].innerHTML.split(/<br\s*\/?>/i).forEach((p) => {
            const clean = p
              .replace(/&nbsp;/g, ' ')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (!clean || /^Dosis/i.test(clean)) return;
            const m = clean.match(/^(.+?)\s*Jml\.\s*([\d.,]+)$/i);
            if (m) cur!.ingredients.push({ name: m[1].trim(), jml: m[2].trim() });
          });
          return;
        }
        if (!cur) return;
        // Baris lanjutan blok: aturan &/atau "Jumlah/Jml. Racikan : N".
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

    // Sumber per-obat racikan lengkap. Menurut standar operasional farmasi &
    // keselamatan pasien, Telaah Resep harus memakai RESEP ASLI (resep baru di
    // kunjungan saat itu) → cetak-resep-asli diutamakan; salinan resep sebagai
    // cadangan. Keduanya di-render server & cukup butuh id_resep.
    const RACIKAN_ASLI_URLS = [
      (id: string) => '/inventory/print/cetak-resep-asli?id=' + encodeURIComponent(id),
      (id: string) => '/inventory/print/cetak-resep?id_resep=' + encodeURIComponent(id),
    ];
    async function fetchRacikanAsli(): Promise<
      Map<
        string,
        { ingredients: { name: string; jml: string }[]; aturan: string[]; jumlahRacikan: string }
      >
    > {
      const map = new Map<
        string,
        { ingredients: { name: string; jml: string }[]; aturan: string[]; jumlahRacikan: string }
      >();
      const resepId = params.get('id_resep') || params.get('id') || params.get('penjualan') || '';
      if (!resepId) return map;
      for (const build of RACIKAN_ASLI_URLS) {
        try {
          const resp = await fetch(build(resepId), { credentials: 'include' });
          if (!resp.ok) continue;
          const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
          parseRacikanAsli(doc, map);
          if (map.size > 0) break; // cukup satu sumber yang berhasil
        } catch {
          /* coba sumber berikutnya */
        }
      }
      return map;
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

    const racikanMap = await fetchRacikanDetails();
    // Sumber per-obat racikan yang LENGKAP (Jml tiap bahan + aturan + total
    // racikan) dari halaman salinan/asli resep — andalan utama utk format baru.
    const asliMap = await fetchRacikanAsli();

    // Fallback: kalau fetch detail tidak dapat diagnosa, pakai baris "Diagnosa"
    // yang sudah di-render server di halaman telaah (reliable, tanpa network).
    if (!diagnosisUtama.length && serverDiag.length) diagnosisUtama = serverDiag;

    // Merge sub-obat racikan dari fetch detail (hanya kalau belum terisi dari
    // parse tabel halaman telaah — parse lokal lebih akurat utk racikan).
    for (const med of meds) {
      const num = med.no.replace(/\D/g, '');
      const subs = racikanMap.get(num);
      if (subs && subs.length > 1 && med.subMeds.length === 0) {
        med.subMeds = subs;
      }
    }

    // Merge per-obat Jml + aturan + total racikan dari salinan/asli resep.
    // Cocokkan per nama (bukan index) — urutan bisa beda antar halaman.
    for (const med of meds) {
      const num = med.no.replace(/\D/g, '');
      const block = asliMap.get(num);
      if (!block) continue;
      if (block.jumlahRacikan) med.jumlahJadi = block.jumlahRacikan;
      if (block.aturan.length) med.aturan = block.aturan;
      if (med.subMeds.length === 0 && block.ingredients.length > 0) {
        if (block.ingredients.length > 1) {
          // Racikan: seluruh bahan jadi subMeds (lengkap dgn jml).
          med.subMeds = block.ingredients.map((i) => ({
            name: i.name,
            strength: '',
            dose: '',
            sediaan: '',
            jmlPerR: i.jml,
          }));
        } else if (!med.jml && block.ingredients[0].jml) {
          // Tunggal: satu bahan → isi jml med, bukan subMeds.
          med.jml = block.ingredients[0].jml;
        }
      } else {
        for (const s of med.subMeds) {
          const hit = block.ingredients.find((i) => namesMatch(s.name, i.name));
          if (hit && !s.jmlPerR) s.jmlPerR = hit.jml;
        }
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

    // Diagnosa pasien (utama & sekunder) — dari fieldset#perhatian halaman detail.
    // Tampil sebelum daftar obat supaya konteks klinis jelas saat telaah.
    const diagHtml =
      '<section class="tm-card">' +
      '<div class="diag-title">Diagnosa</div>' +
      '<div class="tm-row"><span class="tm-label">Utama</span>' +
      '<span class="tm-val">' +
      (diagnosisUtama.length ? esc(diagnosisUtama.join(', ')) : '-') +
      '</span></div>' +
      (diagnosisSekunder.length
        ? '<div class="tm-row"><span class="tm-label">Sekunder</span>' +
          '<span class="tm-val">' +
          esc(diagnosisSekunder.join(', ')) +
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
                (jml
                  ? ' <span class="med-sep">-</span> <span class="med-jml">' + esc(jml) + '</span>'
                  : '') +
                '</div>'
              );
            })
            .join('');
          const total = m.jumlahJadi ? esc(m.jumlahJadi) + ' Racikan' : 'Racikan';
          const aturan = m.aturan.length ? m.aturan.map((a) => esc(a)).join(' ') : '';
          const jadi = total + (aturan ? ' - ' + aturan : '');
          return (
            '<div class="med med-racik">' +
            '<div class="med-block-label">Racikan</div>' +
            lines +
            (jadi ? '<div class="med-jadiracik">' + jadi + '</div>' : '') +
            '</div>'
          );
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
          (jml
            ? ' <span class="med-sep">-</span> <span class="med-jml">' + esc(jml) + '</span>'
            : '') +
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
      (antrianNumber
        ? '<div class="t-antrian">' +
          '<span class="t-antrian-label">No. Antrian</span>' +
          '<span class="t-antrian-val">' +
          esc(antrianNumber) +
          '</span>' +
          '</div>'
        : '') +
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
        .t-head{display:flex;align-items:center;padding-bottom:8px;border-bottom:1.5px solid #000;margin-bottom:12px;gap:14px;position:relative}
        .t-logo{width:60px;height:60px;object-fit:contain;object-position:left top;flex:none}
        .t-bhead{flex:1;font-size:11px}
        .t-hname{font-size:13px;font-weight:800;margin:0 0 4px;letter-spacing:-.01em}
        .t-hsub{line-height:1.3}
        /* ANTRIAN number top-right */
        .t-antrian{position:absolute;top:0;right:0;text-align:right;font-size:10px;line-height:1.2}
        .t-antrian-label{display:block;color:#5b6470;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
        .t-antrian-val{display:block;font-size:18px;font-weight:800;color:#198754;letter-spacing:-.02em;font-variant-numeric:tabular-nums}

  /* METADATA — tanpa border, tanpa bold. Label kecil di atas, nilai di bawah
        (stacked) sehingga isi bisa memanjang. Pasien kiri & dokter kanan. */
        .tm-card{background:#fff;padding:4px 0 6px;margin-bottom:6px;font-size:11px;border-bottom:0.5pt solid #333}
        .tm-col{display:flex;flex-direction:column;gap:5px}
        .tm-row{display:flex;flex-direction:column;gap:1px}
        .tm-label{color:#5b6470;font-size:10px;line-height:1.2}
        .tm-val{color:#000;line-height:1.3;word-wrap:break-word}
        /* DIAGNOSA — blok ringkas, label tebal di atas */
        .diag-title{font-weight:800;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#5b6470;margin-bottom:2px}

        /* MAIN 2 kolom — portrait 105mm: kolom lebih ramping, gap kecil.
           Kolom TIDAK dipaksa sama tinggi (align-items:start) agar bagian bawah
           paraf/tanda tangan tidak membentang kosong. */
        .t-main{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:start}
        .t-left,.t-right{display:flex;flex-direction:column;gap:6px}
        .t-right .t-check{margin-bottom:0}
        .t-meds{margin-bottom:16px;font-size:11px;min-width:0}

        /* DAFTAR OBAT — format per-blok (racikan & tunggal) */
        .med{margin-bottom:8px}
        .med-racik{border:0.5pt solid #9ca3af;border-radius:3px;padding:4px 5px}
        .med-block-label{font-weight:700;font-size:11px;margin-bottom:2px}
        .med-line{font-size:11px;line-height:1.35}
        .med-line.indent{margin-left:18px}
        .med-no{font-weight:400}
        .med-name{font-weight:600}
        .med-sep{color:#374151}
        .med-jml{white-space:nowrap;font-weight:600;color:#047857}
        .med-aturan{margin-left:0;font-size:10px;color:#374151;margin-top:1px}
        /* JUMLAH JADI RACIK — di bawah blok racikan */
        .med-jadiracik{margin-top:4px;border-top:0.5pt solid #333;padding-top:3px;font-size:11px;font-weight:700}

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
        .blk{min-height:18px}
        .blk2{min-height:11px}
        .blk3{min-height:45px}
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
