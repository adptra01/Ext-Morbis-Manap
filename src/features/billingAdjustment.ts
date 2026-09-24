/**
 * Billing Adjustment — Total Jasa editable, Pembulatan editable,
 * realtime recalculation + regenerate dari baris item.
 *
 * Halaman: /billing/pembayaran-new/index
 * 1. Total Jasa (TABLE1 <b>) jadi form input, sinkron hidden #total_billing
 * 2. Pembulatan (#pembulatanShow) dilepas dari readonly, mode AUTO/MANUAL
 * 3. Total Belum Dibayar update realtime saat form mana pun berubah
 * 4. Tombol "Regenerate Total" hitung ulang total tagihan dari item
 * 5. Kolom Frek (#frekuensi_N): ubah frek/harga/diskon -> total baris realtime
 *
 * Gating: jalan hanya bila init.ts (ISOLATED) set
 * `data-ext-billing-adj="1"` (fitur enabled + role admin).
 */
(function () {
  'use strict';

  const ATTR = 'data-ext-billing-adj';
  const MAX_WAIT = 150;
  const FIELD_WAIT_MS = 100;

  let waited = 0;
  let pollId: number | null = null;
  let initialized = false;

  function stopPolling(): void {
    if (pollId !== null) {
      clearInterval(pollId);
      pollId = null;
    }
  }

  function isEnabled(): boolean {
    return document.documentElement.getAttribute(ATTR) === '1';
  }

  function valOf(selector: string): string {
    const el = document.querySelector<HTMLInputElement>(selector);
    return el?.value ?? '';
  }

  function parseCurrency(str: string | undefined): number {
    if (!str) return 0;
    // Invariant: parseCurrency(formatCurrency(x)) === x (untuk desimal + ribuan).
    // Buang HANYA separator RIBUAN (titik/koma diikuti tepat 3 digit lalu
    // `.` `,` atau akhir string) — benar untuk "1.234,5" (id-ID) maupun
    // "1,234.5" (en-US); separator DESIMAL terakhir dinormalisasi ke ".".
    // Contoh: "1.234,5" → 1234.5, "1,234.5" → 1234.5, "1.234" → 1234.
    const noThousands = String(str).replace(/[.,](?=\d{3}(?:[.,]|$))/g, '');
    const normalized = noThousands.replace(/[.,](?=\d{1,2}$)/, '.');
    return parseFloat(normalized) || 0;
  }

  function formatCurrency(num: number): string {
    return num.toLocaleString('id-ID').replace(/,/g, '.');
  }

  /** Ambil suffix angka dari id mis. "frekuensi_12" -> "12". */
  function idSuffix(id: string, prefix: string): string | null {
    const m = id.match(new RegExp('^' + prefix + '_(\\d+)$'));
    return m ? m[1] : null;
  }

  function injectStyles(): void {
    if (document.getElementById('ext-billing-adj-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-billing-adj-css';
    s.textContent = `
      #totalharga.ext-billing-editable,
      #pembulatanShow.ext-billing-editable,
      #ext-total-jasa.ext-billing-editable {
        background: #fef3c7 !important;
        border: 2px solid #f59e0b !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 600;
        color: #92400e;
        cursor: text;
        min-width: 100px;
        text-align: right;
      }
      #totalharga.ext-billing-editable:focus,
      #pembulatanShow.ext-billing-editable:focus,
      #ext-total-jasa.ext-billing-editable:focus {
        border-color: #d97706 !important;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
        outline: none;
      }
      .ext-billing-total-display {
        background: #dbeafe !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 4px;
        padding: 4px 8px;
        font-weight: 700;
        color: #1e40af;
        min-width: 120px;
        text-align: right;
        display: inline-block;
      }
      .ext-billing-regen-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
      }
      .ext-billing-regen-btn:hover { background: #1d4ed8; }
      .ext-billing-regen-btn:active { background: #1e40af; }
      .ext-billing-regen-btn svg { width: 14px; height: 14px; }
      .ext-billing-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 8px;
      }
      .ext-billing-status.ok { background: #d1fae5; color: #065f46; }
      .ext-billing-status.warning { background: #fef3c7; color: #92400e; }
      .ext-billing-auto-mode {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        margin-left: 4px;
        background: #e0e7ff;
        color: #3730a3;
      }
    `;
    document.head.appendChild(s);
  }

  function showStatus(text: string, type: string): void {
    document.querySelector('.ext-billing-status')?.remove();
    const status = document.createElement('span');
    status.className = 'ext-billing-status ' + type;
    status.textContent = text;
    const btn = document.querySelector('.ext-billing-regen-btn');
    if (btn?.parentElement) {
      btn.parentElement.insertBefore(status, btn.nextSibling);
    }
    setTimeout(() => status.remove(), 3000);
  }

  // ---------- Rantai hitung ----------

  /** Total satu baris jasa: harga x frekuensi - diskon. */
  function recalcRow(suffix: string): number {
    const harga = parseCurrency(valOf('#harga_' + suffix));
    const frek = parseCurrency(valOf('#frekuensi_' + suffix));
    const diskon = parseCurrency(valOf('#diskon_' + suffix));
    const total = harga * frek - diskon;
    const totalEl = document.querySelector<HTMLInputElement>('#total_' + suffix);
    if (totalEl) totalEl.value = formatCurrency(total);
    return total;
  }

  /** Jumlahkan semua total baris jasa (#total_N). */
  function sumJasaRows(): number {
    let sum = 0;
    document.querySelectorAll<HTMLInputElement>('input[id^="total_"]').forEach((el) => {
      if (!idSuffix(el.id, 'total')) return;
      sum += parseCurrency(el.value);
    });
    return sum;
  }

  /** Baca Total obat (Tunai) dari tabel obat. */
  function readObatTotal(): number {
    const tables = document.querySelectorAll('table');
    for (const t of Array.from(tables)) {
      for (const r of Array.from(t.querySelectorAll('tr'))) {
        const cells = r.querySelectorAll('td');
        if (!cells.length || cells[0].textContent.trim() !== 'Total') continue;
        const m = (cells[1]?.textContent ?? '').match(/Tunai\s*:?\s*([\d.]+)/);
        if (m) return parseCurrency(m[1]);
      }
    }
    return 0;
  }

  /** Tulis tampilan Total Jasa (TABLE1) + hidden #total_billing. */
  function writeJasaTotal(v: number): void {
    const tables = document.querySelectorAll('table');
    const b = tables[1]?.querySelector('b');
    const input = document.querySelector<HTMLInputElement>('#ext-total-jasa');
    if (input) {
      input.value = formatCurrency(v);
    } else if (b) {
      b.textContent = formatCurrency(v);
    }
    const hidden = document.querySelector<HTMLInputElement>('#total_billing');
    if (hidden) hidden.value = String(Math.round(v));
  }

  /** Hitung Total Belum Dibayar + kembalian + sisa, tulis ke semua target. */
  function calculateTotal(): void {
    const totalTagihan = parseCurrency(valOf('#totalharga'));
    const biayaAdm = parseCurrency(valOf('#biaya_adm'));
    const biayaMaterai = parseCurrency(valOf('#biaya_materai'));
    const diskon = parseCurrency(valOf('#diskon'));
    const klaimAsuransi = parseCurrency(valOf('#klaim_bpjs'));
    const uangPendaftaran = parseCurrency(valOf('#tarik_uang_muka'));
    const pembulatan = parseCurrency(valOf('#pembulatanShow'));
    const bayar = parseCurrency(valOf('#bayar'));

    const totalBelumDibayar =
      totalTagihan +
      biayaAdm +
      biayaMaterai -
      diskon -
      klaimAsuransi +
      uangPendaftaran +
      pembulatan;

    const hidden = document.querySelector<HTMLInputElement>('#total_belum_dibayar');
    if (hidden) hidden.value = String(Math.round(totalBelumDibayar));

    // Sinkron hidden #pembulatan agar hitungTotalAkhir() bawaan memakai nilai benar.
    const pembHidden = document.querySelector<HTMLInputElement>('#pembulatan');
    const pembVisible = document.querySelector<HTMLInputElement>('#pembulatanShow');
    if (pembHidden && pembVisible) pembHidden.value = pembVisible.value;

    const labelCell = Array.from(document.querySelectorAll('td')).find(
      (c) => c.textContent.trim().toLowerCase() === 'total belum dibayar',
    );
    const lastCell = labelCell?.parentElement?.querySelector('td:last-child');
    if (lastCell && !lastCell.querySelector('input')) {
      let display = lastCell.querySelector('.ext-billing-total-display');
      if (!display) {
        lastCell.textContent = '';
        display = document.createElement('span');
        display.className = 'ext-billing-total-display';
        lastCell.appendChild(display);
      }
      display.textContent = formatCurrency(totalBelumDibayar);
    }

    const kembali = Math.max(0, bayar - totalBelumDibayar);
    const kembaliEl = document.querySelector<HTMLInputElement>('#kembali2');
    const kembaliDisplay = document.querySelector('#kembali1');
    if (kembaliEl) kembaliEl.value = String(kembali);
    if (kembaliDisplay) kembaliDisplay.textContent = formatCurrency(kembali);

    const sisa = Math.max(0, totalBelumDibayar - bayar);
    const sisaEl = document.querySelector<HTMLInputElement>('#sisaTagihan2');
    const sisaDisplay = document.querySelector('#sisaTagihan1');
    if (sisaEl) sisaEl.value = String(sisa);
    if (sisaDisplay) sisaDisplay.textContent = formatCurrency(sisa);

    // #total1 = sisa tagihan (0 bila lunas) — samakan dgn tampilan bawaan.
    const total1 = document.querySelector('#total1');
    if (total1) total1.textContent = bayar >= totalBelumDibayar ? '0' : formatCurrency(sisa);
  }

  /**
   * Ikat input+keyup+change sekaligus. Handler bawaan halaman terdaftar duluan
   * (inline oninput/onkeyup), jadi milik kita selalu jalan TERAKHIR dan menang.
   */
  function bindRealtime(el: HTMLInputElement, fn: () => void): void {
    if (el.dataset.extRtBound === '1') return;
    el.dataset.extRtBound = '1';
    el.addEventListener('input', fn);
    el.addEventListener('keyup', fn);
    el.addEventListener('change', fn);
  }

  /** Regenerate: hitung ulang total tagihan dari baris item + obat. */
  function regenerate(): void {
    // 1. Hitung ulang tiap baris jasa dari frek/harga/diskon
    document.querySelectorAll<HTMLInputElement>('input[id^="frekuensi_"]').forEach((el) => {
      const sfx = idSuffix(el.id, 'frekuensi');
      if (sfx) recalcRow(sfx);
    });

    // 2. Total jasa -> input + hidden
    const jasa = sumJasaRows();
    const jasaInput = document.querySelector<HTMLInputElement>('#ext-total-jasa');
    if (jasaInput) {
      jasaInput.value = formatCurrency(jasa);
      jasaInput.dataset.autoMode = 'true';
      const ind = document.querySelector<HTMLElement>('#totaljasa-auto-indicator');
      if (ind) ind.style.display = '';
    }
    writeJasaTotal(jasa);

    // 3. Total tagihan = jasa + obat
    const totalTagihan = jasa + readObatTotal();
    const totalEl = document.querySelector<HTMLInputElement>('#totalharga');
    if (totalEl) {
      totalEl.value = formatCurrency(totalTagihan);
      totalEl.dataset.original = totalEl.value;
    }

    // 4. Pembulatan TIDAK disentuh — ikut nilai awal / edit manual user.
    calculateTotal();
    showStatus('Regenerated: ' + formatCurrency(totalTagihan), 'ok');
  }

  // ---------- Setup field ----------

  /** Total Jasa: <b>50.000</b> -> <input>, sinkron #total_billing. */
  function setupTotalJasa(): void {
    const tables = document.querySelectorAll('table');
    const cell = tables[1]?.querySelector('td:last-child');
    const b = tables[1]?.querySelector('b');
    if (!cell || document.querySelector('#ext-total-jasa')) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'ext-total-jasa';
    input.className = 'ext-billing-editable';
    input.value = b?.textContent.trim() ?? valOf('#total_billing');
    input.dataset.autoMode = 'true';
    if (b) b.replaceWith(input);
    else cell.prepend(input);

    const ind = document.createElement('span');
    ind.className = 'ext-billing-auto-mode';
    ind.textContent = 'AUTO';
    ind.id = 'totaljasa-auto-indicator';
    input.after(ind);

    bindRealtime(input, () => {
      input.dataset.autoMode = 'false';
      ind.style.display = 'none';
      writeJasaTotal(parseCurrency(input.value));
      calculateTotal();
    });
    input.addEventListener('blur', () => showStatus('Total jasa diupdate', 'ok'));
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        input.blur();
      }
    });
  }

  function setupTotalTagihan(): void {
    const el = document.querySelector<HTMLInputElement>('#totalharga');
    if (!el || el.dataset.extBillingBound === '1') return;
    el.dataset.extBillingBound = '1';
    el.classList.add('ext-billing-editable');
    el.dataset.original = el.value;
    bindRealtime(el, () => {
      calculateTotal();
    });
    el.addEventListener('blur', () => {
      el.dataset.original = el.value;
      showStatus('Total diupdate', 'ok');
    });
    el.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  }

  function setupPembulatan(): void {
    const el = document.querySelector<HTMLInputElement>('#pembulatanShow');
    if (!el || el.dataset.extBillingBound === '1') return;
    el.dataset.extBillingBound = '1';
    el.removeAttribute('readonly');
    (el as HTMLInputElement).readOnly = false;
    el.removeAttribute('disabled');
    (el as HTMLInputElement).disabled = false;
    el.classList.add('ext-billing-editable');
    el.dataset.original = el.value;

    // Pembulatan murni manual: hanya berubah saat user mengetik.
    bindRealtime(el, () => {
      calculateTotal();
    });
    el.addEventListener('blur', () => {
      el.dataset.original = el.value;
    });
    el.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      }
    });
  }

  /** Delegasi: frek/harga/diskon baris mana pun -> total baris + rantai. */
  function setupRowListener(): void {
    if (document.documentElement.dataset.extBillingRows === '1') return;
    document.documentElement.dataset.extBillingRows = '1';
    const onRowField = (e: Event): void => {
      const t = e.target as HTMLElement;
      if (!(t instanceof HTMLInputElement)) return;
      const sfx =
        idSuffix(t.id, 'frekuensi') ?? idSuffix(t.id, 'harga') ?? idSuffix(t.id, 'diskon');
      if (!sfx) return;
      recalcRow(sfx);
      const jasa = sumJasaRows();
      const jasaInput = document.querySelector<HTMLInputElement>('#ext-total-jasa');
      if (jasaInput && jasaInput.dataset.autoMode !== 'false') {
        jasaInput.value = formatCurrency(jasa);
      }
      writeJasaTotal(jasa);
      // Data baris (frek) selalu menang: total tagihan ikut dihitung ulang.
      // Pembulatan TIDAK disentuh — ikut nilai awal / edit manual user.
      const totalEl = document.querySelector<HTMLInputElement>('#totalharga');
      if (totalEl) {
        totalEl.value = formatCurrency(jasa + readObatTotal());
      }
      calculateTotal();
    };
    document.addEventListener('input', onRowField);
    document.addEventListener('keyup', onRowField);
    document.addEventListener('change', onRowField);
  }

  /** Field ringkasan (adm/materai/diskon/%/klaim/pendaftaran/bayar) -> realtime. */
  function setupSummaryListeners(): void {
    ['biaya_adm', 'biaya_materai', 'diskon', 'klaim_bpjs', 'tarik_uang_muka', 'bayar'].forEach(
      (id) => {
        const el = document.querySelector<HTMLInputElement>('#' + id);
        if (!el) return;
        bindRealtime(el, calculateTotal);
      },
    );
    const pct = document.querySelector<HTMLInputElement>('#diskon_dalam_persen');
    if (pct) {
      bindRealtime(pct, () => {
        const p = parseCurrency(pct.value);
        const total = parseCurrency(valOf('#totalharga'));
        const diskonEl = document.querySelector<HTMLInputElement>('#diskon');
        if (diskonEl) diskonEl.value = formatCurrency((total * p) / 100);
        calculateTotal();
      });
    }
  }

  function addRegenerateButton(): void {
    if (document.querySelector('.ext-billing-regen-btn')) return;
    const simpanBtn = document.querySelector('button');
    if (!simpanBtn?.parentElement) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ext-billing-regen-btn';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>' +
      '</svg> Regenerate Total';
    btn.addEventListener('click', regenerate);
    simpanBtn.parentElement.insertBefore(btn, simpanBtn.nextSibling);
  }

  function addKeyboardShortcuts(): void {
    if (document.documentElement.dataset.extBillingKeys === '1') return;
    document.documentElement.dataset.extBillingKeys = '1';
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        regenerate();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>('#totalharga');
        el?.focus();
        el?.select();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>('#pembulatanShow');
        el?.focus();
        el?.select();
      }
    });
  }

  function init(): void {
    if (initialized) return;
    initialized = true;
    injectStyles();
    setupTotalJasa();
    setupTotalTagihan();
    setupPembulatan();
    setupRowListener();
    setupSummaryListeners();
    addRegenerateButton();
    addKeyboardShortcuts();
    calculateTotal();

    console.log('[BillingAdj] initialized');
  }

  pollId = window.setInterval(() => {
    waited++;
    if (!isEnabled()) {
      if (waited >= MAX_WAIT) stopPolling();
      return;
    }
    if (document.querySelector('#totalharga') && document.querySelector('#pembulatanShow')) {
      stopPolling();
      init();
    } else if (waited >= MAX_WAIT) {
      stopPolling();
    }
  }, FIELD_WAIT_MS);
})();
