(function () {
  const MAX_WAIT = 100;
  let waited = 0;
  let originalSwal: ((...args: unknown[]) => unknown) | null = null;
  let isAutoMode = false;
  let isBatalMode = false;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-auto-verif-billing');
    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;

      if (window.location.pathname.indexOf('/billing/pembayaran-new/billing-verifikasi/index') !== -1) {
        waitForForm();
      } else if (window.location.pathname.indexOf('/billing/pembayaran-new/billing-verifikasi') !== -1) {
        initListPage();
      }
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function injectStyle(): void {
    if (document.getElementById('ext-avb-css')) return;
    const s = document.createElement('style');
    s.id = 'ext-avb-css';
    s.textContent = [
      '.ext-avb-wrap { display:inline-flex; align-items:center; gap:10px; margin-left:12px; }',
      '.ext-avb-btn { padding:7px 16px; font-size:12px; font-weight:700; border:none; border-radius:5px; cursor:pointer; text-transform:uppercase; letter-spacing:0.3px; transition:all 0.2s; }',
      '.ext-avb-btn:disabled { opacity:0.5; cursor:not-allowed; }',
      '.ext-avb-primary { background:#10b981; color:#fff; }',
      '.ext-avb-primary:hover { background:#059669; }',
      '.ext-avb-danger { background:#ef4444; color:#fff; }',
      '.ext-avb-danger:hover { background:#dc2626; }',
      '.ext-avb-warning { background:#f59e0b; color:#fff; }',
      '.ext-avb-warning:hover { background:#d97706; }',
      '.ext-avb-status { display:inline-block; padding:5px 12px; font-size:11px; font-weight:600; border-radius:4px; display:none; }',
      '.ext-avb-info { background:#dbeafe; color:#1e40af; }',
      '.ext-avb-ok { background:#d1fae5; color:#065f46; }',
      '.ext-avb-err { background:#fee2e2; color:#991b1b; }',
      '.ext-avb-warn { background:#fef3c7; color:#92400e; }',

    ].join('\n');
    document.head.appendChild(s);
  }

  function fireEvents(el: HTMLElement): void {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function getSaveParent(): HTMLElement | null {
    const save = document.getElementById('save') as HTMLElement | null;
    if (!save) return null;
    return save.parentElement || save.closest('td') || save.closest('div') || null;
  }

  function makeStatusEl(): HTMLSpanElement {
    const el = document.createElement('span');
    el.className = 'ext-avb-status';
    return el;
  }

  function setStatus(el: HTMLElement, msg: string, cls: string): void {
    el.textContent = msg;
    el.className = 'ext-avb-status ext-avb-' + cls;
    el.style.display = 'inline-block';
  }

  function overrideSwal(): void {
    const w = window as unknown as Record<string, unknown>;
    if (typeof w.swal !== 'function') return;
    if (originalSwal) return;

    originalSwal = w.swal as (...args: unknown[]) => unknown;
    w.swal = function swalOverride(...args: unknown[]): unknown {
      if (!isAutoMode && !isBatalMode) {
        return originalSwal!.apply(this, args);
      }

      const msgText = args.length === 1 && typeof args[0] === 'object'
        ? ((args[0] as Record<string, string>).title || '') + ' ' + ((args[0] as Record<string, string>).text || '')
        : '';

      if (msgText.toLowerCase().indexOf('resep') !== -1 && msgText.indexOf('belum diproses') !== -1) {
        isAutoMode = false;
        isBatalMode = false;
        return { then: function (cb: (v: boolean) => void) { cb(true); } };
      }

      return { then: function (cb: (v: boolean) => void) { cb(true); } };
    };
  }

  function setupSwalObserver(): void {
    const target = document.body || document.documentElement;
    if (!target) return;

    const obs = new MutationObserver(function () {
      const swalEl = document.querySelector('.sweet-alert, .swal-overlay, .swal-modal');
      if (!swalEl || (!isAutoMode && !isBatalMode)) return;

      const confirmBtn = swalEl.querySelector('.confirm, .swal-button--confirm, .btn-primary');
      const okBtn = swalEl.querySelector('button:not(.cancel):not(.swal-button--cancel)');
      const btn = (confirmBtn || okBtn) as HTMLElement | null;

      if (btn && (isAutoMode || isBatalMode)) {
        setTimeout(function () { btn.click(); }, 100);
      }
    });

    obs.observe(target, { childList: true, subtree: true });
  }

  function checkLunasStatus(): boolean {
    const batalBtn = document.querySelector(
      '[onclick*="batal_verif"], .btn-batal-verif, [href*="batal-control"]'
    );
    if (batalBtn) return false;

    const parent = getSaveParent();
    if (!parent) return true;

    const wrap = document.createElement('span');
    wrap.className = 'ext-avb-wrap';

    const msg = document.createElement('span');
    msg.className = 'ext-avb-status ext-avb-err';
    msg.style.display = 'inline-block';
    msg.textContent = 'Data lunas / tidak bisa diubah';
    wrap.appendChild(msg);
    parent.appendChild(wrap);
    return true;
  }

  function checkDischargeStatus(callback: (blocked: boolean) => void): void {
    const bodyText = document.body?.textContent || '';
    if (
      bodyText.indexOf('Belum Discharge') === -1 &&
      bodyText.indexOf('belum di-discharge') === -1 &&
      bodyText.indexOf('belum keluar') === -1
    ) {
      callback(false);
      return;
    }

    const parent = getSaveParent();
    if (!parent) { callback(false); return; }

    const wrap = document.createElement('span');
    wrap.className = 'ext-avb-wrap';

    const warn = document.createElement('span');
    warn.className = 'ext-avb-status ext-avb-warn';
    warn.style.display = 'inline-block';
    warn.textContent = 'Pasien Belum Discharge';

    const forceBtn = document.createElement('button');
    forceBtn.className = 'ext-avb-btn ext-avb-warning';
    forceBtn.textContent = 'Force Auto Verif';
    forceBtn.title = 'Pasien belum discharge, verifikasi mungkin ditolak server';
    forceBtn.onclick = function () {
      addAutoVerifButtonInternal();
    };

    wrap.appendChild(warn);
    wrap.appendChild(forceBtn);
    parent.appendChild(wrap);

    callback(true);
  }

  function addAutoVerifButton(): void {
    if (checkLunasStatus()) return;
    addAutoVerifButtonInternal();
  }

  function addAutoVerifButtonInternal(): void {
    const parent = getSaveParent();
    if (!parent) return;
    if (parent.querySelector('.ext-avb-wrap')) return;

    const wrap = document.createElement('span');
    wrap.className = 'ext-avb-wrap';

    const btn = document.createElement('button');
    btn.className = 'ext-avb-btn ext-avb-primary';
    btn.textContent = 'Auto Verif';
    btn.onclick = function () {
      runAutoVerif(btn, document.getElementById('save') as HTMLElement);
    };

    const st = makeStatusEl();
    wrap.appendChild(btn);
    wrap.appendChild(st);
    parent.appendChild(wrap);
  }

  function addBatalButton(): void {
    const parent = getSaveParent();
    if (!parent) return;
    if (parent.querySelector('.ext-avb-wrap')) return;

    if (checkLunasStatus()) return;

    const wrap = document.createElement('span');
    wrap.className = 'ext-avb-wrap';

    const btn = document.createElement('button');
    btn.className = 'ext-avb-btn ext-avb-danger';
    btn.textContent = 'Batal & Auto Verif Ulang';
    btn.onclick = function () { runBatalAutoVerif(btn); };

    const st = makeStatusEl();
    wrap.appendChild(btn);
    wrap.appendChild(st);
    parent.appendChild(wrap);
  }

  function fillMultiAsuransi(fields: NodeListOf<HTMLInputElement>, totalNum: number): void {
    const existingValues: number[] = [];
    let hasExisting = false;

    for (let i = 0; i < fields.length; i++) {
      const v = parseInt(fields[i].value.replace(/\D/g, '')) || 0;
      existingValues.push(v);
      if (v > 0) hasExisting = true;
    }

    if (hasExisting) {
      let existingSum = 0;
      for (let i = 0; i < existingValues.length; i++) existingSum += existingValues[i];

      if (existingSum > 0) {
        let allocated = 0;
        for (let i = 0; i < fields.length; i++) {
          const portion = i < fields.length - 1
            ? Math.floor((existingValues[i] / existingSum) * totalNum)
            : totalNum - allocated;
          fields[i].value = portion.toString();
          fireEvents(fields[i]);
          allocated += portion;
        }
        return;
      }
    }

    for (let i = 0; i < fields.length; i++) {
      fields[i].value = i === 0 ? totalNum.toString() : '0';
      fireEvents(fields[i]);
    }
  }

  function fixRounding(targetTotal: number): void {
    const nomFields = document.querySelectorAll<HTMLInputElement>('input.nominalPerAsuransi');
    if (nomFields.length === 0) return;

    let sum = 0;
    for (let i = 0; i < nomFields.length; i++) {
      sum += parseInt(nomFields[i].value.replace(/\D/g, '')) || 0;
    }

    const diff = targetTotal - sum;
    if (diff !== 0) {
      const idx = nomFields.length - 1;
      let newVal = (parseInt(nomFields[idx].value.replace(/\D/g, '')) || 0) + diff;
      if (newVal < 0) newVal = 0;
      nomFields[idx].value = newVal.toString();
      fireEvents(nomFields[idx]);
    }
  }

  function autoFill(totalAll: string): boolean {
    const klaimBpjs = document.getElementById('klaim_bpjs') as HTMLInputElement | null;
    if (!klaimBpjs) return false;

    const totalNum = parseInt(totalAll) || 0;

    klaimBpjs.value = totalAll;
    fireEvents(klaimBpjs);

    const nomFields = document.querySelectorAll<HTMLInputElement>('input.nominalPerAsuransi');
    if (nomFields.length === 1) {
      nomFields[0].value = totalAll;
      fireEvents(nomFields[0]);
    } else if (nomFields.length > 1) {
      fillMultiAsuransi(nomFields, totalNum);
    }

    fixRounding(totalNum);
    return true;
  }

  function runAutoVerif(btn: HTMLElement, saveBtn: HTMLElement | null): void {
    const st = btn.parentElement?.querySelector('.ext-avb-status') as HTMLElement | null;
    if (!st || !saveBtn) return;

    btn.setAttribute('disabled', 'disabled');
    setStatus(st, 'Memproses...', 'info');

    const totalAllEl = document.getElementById('total_all') as HTMLInputElement | null;
    if (!totalAllEl) {
      setStatus(st, 'Gagal: total_all?', 'err');
      btn.removeAttribute('disabled');
      return;
    }

    const totalValue = totalAllEl.value;
    if (!totalValue || parseInt(totalValue) <= 0) {
      setStatus(st, 'Nilai total tidak valid', 'err');
      btn.removeAttribute('disabled');
      return;
    }

    autoFill(totalValue);

    const klaimBpjs = document.getElementById('klaim_bpjs') as HTMLInputElement | null;
    const klaimVal = parseInt(klaimBpjs?.value.replace(/\D/g, '') || '0') || 0;
    const noms = document.querySelectorAll<HTMLInputElement>('input.nominalPerAsuransi');
    let sum = 0;
    for (let i = 0; i < noms.length; i++) sum += parseInt(noms[i].value.replace(/\D/g, '')) || 0;

    if (sum !== klaimVal) {
      setStatus(st, 'Koreksi rounding...', 'info');
      fixRounding(klaimVal);
    }

    setStatus(st, 'Mengirim...', 'info');
    isAutoMode = true;

    const $ = (window as unknown as Record<string, unknown>).jQuery as JQueryStatic | undefined;
    if ($) {
      $('body').css('cursor', 'wait');
      $(saveBtn).trigger('click');
    } else {
      saveBtn.click();
    }
  }

  function runBatalAutoVerif(btn: HTMLElement): void {
    const st = btn.parentElement?.querySelector('.ext-avb-status') as HTMLElement | null;
    if (!st) return;

    btn.setAttribute('disabled', 'disabled');
    setStatus(st, 'Membatalkan...', 'info');
    isBatalMode = true;

    const params = new URLSearchParams(window.location.search);
    const visitId = params.get('id_visit');
    if (!visitId) {
      setStatus(st, 'Gagal: id_visit?', 'err');
      btn.removeAttribute('disabled');
      isBatalMode = false;
      return;
    }

    const w = window as unknown as Record<string, unknown>;
    if (typeof w.batal_verif === 'function') {
      (w.batal_verif as (id: string) => void)(visitId);
      return;
    }

    const $ = (window as unknown as Record<string, unknown>).jQuery as JQueryStatic | undefined;
    if (!$) {
      setStatus(st, 'jQuery tidak tersedia', 'err');
      btn.removeAttribute('disabled');
      isBatalMode = false;
      return;
    }

    $.ajax({
      url: '/billing/verifikasi-billing/control/batal-control',
      type: 'GET',
      data: { id: visitId },
      success: function () {
        setStatus(st, 'OK, reload...', 'ok');
        isBatalMode = false;
        setTimeout(function () { window.location.reload(); }, 800);
      },
      error: function () {
        setStatus(st, 'Gagal batal verif', 'err');
        btn.removeAttribute('disabled');
        isBatalMode = false;
      },
    });
  }

  // ============== FORM PAGE ==============

  function waitForForm(): void {
    const poll = setInterval(function () {
      const klaimBpjs = document.getElementById('klaim_bpjs') as HTMLInputElement | null;
      const saveBtn = document.getElementById('save') as HTMLElement | null;
      if (klaimBpjs && saveBtn) {
        clearInterval(poll);
        initForm(klaimBpjs, saveBtn);
      }
    }, 200);
  }

  function initForm(klaimBpjs: HTMLInputElement, _saveBtn: HTMLElement): void {
    injectStyle();
    overrideSwal();
    setupSwalObserver();

    if (klaimBpjs.disabled || klaimBpjs.readOnly) {
      addBatalButton();
    } else {
      checkDischargeStatus(function (blocked: boolean) {
        if (!blocked) {
          addAutoVerifButton();
          checkAutoTrigger();
        }
      });
    }
  }

  function checkAutoTrigger(): void {
    const params = new URLSearchParams(window.location.search);
    if (params.get('avb') !== '1') return;

    document.body.style.cursor = 'wait';

    const poll = setInterval(function () {
      const btn = document.querySelector('.ext-avb-primary') as HTMLElement | null;
      if (btn) {
        clearInterval(poll);
        setTimeout(function () {
          document.body.style.cursor = 'default';
          btn.click();
        }, 300);
      }
    }, 200);
  }

  // ============== LIST PAGE ==============

  let listObserver: MutationObserver | null = null;

  function initListPage(): void {
    injectStyle();
    addListPageButtons();

    listObserver = new MutationObserver(function () {
      addListPageButtons();
    });
    listObserver.observe(document.body, { childList: true, subtree: true });
  }

  function getVisitIdFromRow(row: Element): string | null {
    const links = row.querySelectorAll<HTMLAnchorElement>('a');
    for (let i = 0; i < links.length; i++) {
      const m = links[i].getAttribute('href')?.match(/[?&]id_visit=(\d+)/);
      if (m) return m[1];
    }
    const els = row.querySelectorAll<HTMLElement>('[onclick]');
    for (let i = 0; i < els.length; i++) {
      const m = els[i].getAttribute('onclick')?.match(/['"]?(\d+)['"]?\s*\)/);
      if (m) return m[1];
    }
    const m = row.innerHTML.match(/id_visit[\\?&]*=(\d+)/);
    return m ? m[1] : null;
  }

  function getActionCellParent(row: Element): HTMLElement | null {
    const allTds = row.querySelectorAll('td');
    let lastWithLinks: HTMLElement | null = null;
    for (let i = 0; i < allTds.length; i++) {
      const td = allTds[i] as HTMLElement;
      if (td.querySelectorAll('a, button').length > 0) lastWithLinks = td;
    }
    return lastWithLinks;
  }

  function addListPageButtons(): void {
    const tables = document.querySelectorAll('table');
    for (let t = 0; t < tables.length; t++) {
      const rows = tables[t].querySelectorAll('tbody tr');
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (row.querySelector('.ext-avb-list-btn')) continue;

        const actionCell = getActionCellParent(row);
        if (!actionCell) continue;

        let autoUrl = '';

        const verifLink = row.querySelector<HTMLAnchorElement>(
          'a[href*="verifikasi-billing/index"], a[href*="billing-verifikasi/index"]'
        );
        if (verifLink) {
          const href = verifLink.getAttribute('href') || '';
          autoUrl = href + (href.indexOf('?') >= 0 ? '&' : '?') + 'avb=1';
        } else {
          const visitId = getVisitIdFromRow(row);
          if (!visitId) continue;
          const nama = row.textContent?.trim().split(/\s+/).slice(0, 3).join(' ') || '';
          autoUrl = '/billing/verifikasi-billing/index?id_visit=' + visitId + '&pasien=' + encodeURIComponent(nama) + '&avb=1';
        }

        const autoBtn = document.createElement('button');
        autoBtn.className = 'ext-avb-list-btn btn btn-success btn-xs';
        autoBtn.textContent = 'Auto';
        autoBtn.onclick = function () { window.location.href = autoUrl; };

        actionCell.appendChild(autoBtn);
      }
    }
  }
})();
