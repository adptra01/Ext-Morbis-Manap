(function () {
  const MAX_WAIT = 100;
  let waited = 0;

  const check = setInterval(function () {
    waited++;
    const enabled = document.documentElement.getAttribute('data-ext-antrian-tools');
    if (enabled !== null) {
      clearInterval(check);
      if (enabled !== '1') return;
      init();
    } else if (waited >= MAX_WAIT) {
      clearInterval(check);
    }
  }, 50);

  function init(): void {
    const path = window.location.pathname;
    console.log('[AntrianTools] Init on:', path);

    if (path.includes('/login') || document.title.includes('Login')) {
      try {
        var returnUrl = sessionStorage.getItem('ext_reset_return_url');
        if (returnUrl) {
          sessionStorage.removeItem('ext_reset_return_url');
          console.log('[AntrianTools] Detected login page after reset, redirecting back to:', returnUrl);
          window.location.href = returnUrl;
          return;
        }
      } catch (_eL) { /* ignore */ }
    }

    if (path.includes('/mesin-antrian')) {
      simplifyMesinAntrian();
      return;
    }
    if (path.includes('/counter-antrian/view-antrian')) {
      simplifyViewAntrian();
      return;
    }
    if (path.includes('/counter-antrian/counter')) {
      fixCounter();
      return;
    }

    if (path.includes('/antrian')) {
      console.log('[AntrianTools] Unknown antrian page, trying all modes');
      simplifyMesinAntrian();
      simplifyViewAntrian();
      fixCounter();
    }
  }

  // ==================== MESIN ANTRIAN ====================

  function simplifyMesinAntrian(): void {
    injectCSS('ext-antrian-mesin-css', [
      '.card1.row > div:nth-child(n+2) { display: none !important; }',
      '.card1.row > div:first-child { width: 100% !important; max-width: 600px; margin: 0 auto; }',
    ]);

    let tries = 0;
    var poll = setInterval(function () {
      tries++;
      const h3 = document.querySelector('.card1 .card-body h3');
      if (h3) {
        clearInterval(poll);
        h3.textContent = 'ANTRIAN RUMAH SAKIT RSUD ABDUL MANAP';
        (h3 as HTMLElement).style.fontSize = '22px';
      }
      const card = document.querySelector('.card1 .card');
      if (card) (card as HTMLElement).style.background = '#00A65A';
      if (tries >= 25) clearInterval(poll);
    }, 200);

    patchAntrianGlobal();
  }

  function patchAntrianGlobal(): void {
    intervalPoll(function () {
      var w = window as unknown as Record<string, Function>;
      if (typeof w.antrian === 'function') {
        var origAntrian = w.antrian;
        w.antrian = function (a: number) {
          var retries = 0;
          function attempt(): void {
            try {
              origAntrian(a);
            } catch (_e) {
              retries++;
              if (retries < 3) {
                console.warn('[AntrianTools] antrian(' + a + ') failed, retry ' + retries + '/3');
                setTimeout(attempt, 1000);
              } else {
                alert('Gagal mengambil nomor antrian. Silakan coba lagi atau hubungi petugas.');
              }
            }
          }
          attempt();
        };
      }
    });
  }

  // ==================== VIEW ANTRIAN ====================

  function simplifyViewAntrian(): void {
    injectCSS('ext-antrian-view-css', [
      '#isi-val .card, #isi-val [class*="card"] { width:100%!important;max-width:100%!important; }',
      '#isi-val [class*="col-"] { width:100%!important;max-width:100%!important;flex:0 0 100%!important; }',
      '#isi-val .container, #isi-val [class*="container"] { max-width:100%!important;padding:10px!important; }',
    ]);

    injectCSS('ext-antrian-visual-css', [
      '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");',
      '#isi-val .card, #isi-val [class*="card"] { border-radius:24px!important;box-shadow:0 8px 30px rgba(0,0,0,0.06)!important;background:#ffffff!important;font-family:Inter,system-ui,sans-serif!important; }',
      '#isi-val .head { background:linear-gradient(135deg,#f0f9ff,#e0f2fe)!important;border-radius:24px 24px 0 0!important;border-bottom:1px solid #bae6fd!important; }',
      '#isi-val .isi { font-family:Inter,system-ui,sans-serif!important;font-weight:900!important;color:#0f172a!important;font-size:180px!important;letter-spacing:-4px!important;line-height:1!important;transition:transform 0.3s ease,opacity 0.3s ease!important; }',
      '#isi-val .isi[data-changed] { animation:ext-number-pop 0.5s cubic-bezier(0.16,1,0.3,1)!important; }',
      '@keyframes ext-number-pop { 0%{transform:scale(0.95);opacity:0.6} 50%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }',
      '#isi-val .nama-antrian,#isi-val .judul,#isi-val h3 { font-family:Inter,system-ui,sans-serif!important;font-weight:500!important;font-size:18px!important;color:#64748b!important;letter-spacing:-0.3px!important; }',
      '.text-judul { font-family:Inter,system-ui,sans-serif!important;color:#111827!important;font-size:36px!important;font-weight:900!important;letter-spacing:-1px!important; }',
      'body { background:#f8fafc!important;font-family:Inter,system-ui,sans-serif!important; }',
      '.clock { font-size:16px!important;color:#94a3b8!important; }',
      '.clock span { background:#f1f5f9!important;color:#64748b!important; }',
    ]);

    const target = document.getElementById('isi-val');
    if (!target) {
      console.log('[AntrianTools] #isi-val not found');
      return;
    }
    console.log('[AntrianTools] View-antrian: #isi-val found');

    function reformatContent(): void {
      for (let i = 2; i <= 10; i++) {
        const slider = document.getElementById('slider' + i);
        if (slider) slider.style.display = 'none';
        const sliderAlt = document.querySelector('[id="slider' + i + '"]');
        if (sliderAlt) (sliderAlt as HTMLElement).style.display = 'none';
      }
      var allSliders = target.querySelectorAll('[id^="slider"]');
      for (var s = 1; s < allSliders.length; s++) {
        (allSliders[s] as HTMLElement).style.display = 'none';
      }
      const slider1 = document.getElementById('slider1');
      if (slider1) slider1.style.display = 'block';

      const cards = target.querySelectorAll('.card, [class*="card"]');
      if (cards.length > 1) {
        for (let j = 1; j < cards.length; j++) {
          (cards[j] as HTMLElement).style.display = 'none';
        }
      }
      if (cards.length >= 1) {
        const first = cards[0] as HTMLElement;
        first.style.width = '100%';
        first.style.maxWidth = '100%';
        const parent = first.parentElement;
        if (parent) {
          parent.querySelectorAll('[class*="col-"]').forEach(function (col) {
            (col as HTMLElement).style.width = '100%';
            (col as HTMLElement).style.maxWidth = '100%';
            (col as HTMLElement).style.flex = '0 0 100%';
          });
        }
      }
      if (cards.length === 0) {
        target.innerHTML = '<div style="text-align:center;padding:60px 20px;font-size:24px;color:#64748b;font-weight:600;">BELUM ADA ANTRIAN</div>';
      }

      const isiEl = target.querySelector('.isi') as HTMLElement | null;
      if (isiEl) {
        var numText = isiEl.textContent?.trim() || '';
        var prevText = isiEl.getAttribute('data-ext-prev') || '';
        if (numText !== prevText && prevText !== '') {
          isiEl.setAttribute('data-changed', '1');
          setTimeout(function () { isiEl.removeAttribute('data-changed'); }, 600);
        }
        isiEl.setAttribute('data-ext-prev', numText);
      }

      const names = target.querySelectorAll('.nama-antrian, .judul, h3');
      for (let k = 0; k < names.length; k++) {
        const el = names[k] as HTMLElement;
        if (el.textContent && el.textContent.trim() && !el.textContent.includes('RSUD')) {
          el.textContent = 'Nomor Antrian Saat Ini';
        }
      }
    }

    reformatContent();

    const observer = new MutationObserver(function () {
      setTimeout(reformatContent, 600);
    });
    observer.observe(target, { childList: true, subtree: true });

    for (let r = 1; r <= 8; r++) {
      setTimeout(reformatContent, r * 3500);
    }

    setInterval(reformatContent, 15000);

    monkeypatchSetIntervals();

    injectCSS('ext-refresh-btn-css', [
      '#ext-refresh-view { position:fixed;bottom:20px;right:20px;z-index:99999;width:44px;height:44px;background:#1e293b;color:#fbbf24;border:none;border-radius:12px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:all 0.15s ease; }',
      '#ext-refresh-view:hover { background:#334155;transform:scale(1.08); }',
      '#ext-refresh-view:active { transform:scale(0.95); }',
    ]);
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'ext-refresh-view';
    refreshBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>';
    refreshBtn.title = 'Refresh Tampilan Antrian';
    refreshBtn.addEventListener('click', reformatContent);
    document.body.appendChild(refreshBtn);

    addCallLogTable();

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        reformatContent();
      }
    });
  }

  // ==================== CALL LOG TABLE ====================

  interface CallLogEntry {
    nomor: string;
    nama: string;
    loket: string;
    waktu: string;
  }

  const LOG_STORAGE_PREFIX = 'ext_antrian_call_log_';
  const MAX_LOG_ENTRIES = 50;

  function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getLogStorageKey(): string {
    return LOG_STORAGE_PREFIX + new Date().toISOString().slice(0, 10);
  }

  function getSavedLog(): CallLogEntry[] {
    try {
      var key = getLogStorageKey();
      var raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
      var backup = sessionStorage.getItem(key + '_backup') || localStorage.getItem(key + '_backup');
      if (backup) return JSON.parse(backup);
      return [];
    } catch (_e) {
      try {
        var bkey = getLogStorageKey() + '_backup';
        var bb = sessionStorage.getItem(bkey) || localStorage.getItem(bkey);
        return bb ? JSON.parse(bb) : [];
      } catch (_e2) {
        return [];
      }
    }
  }

  function saveLog(entries: CallLogEntry[]): void {
    try {
      var key = getLogStorageKey();
      var data = JSON.stringify(entries.slice(-MAX_LOG_ENTRIES));
      sessionStorage.setItem(key, data);
      sessionStorage.setItem(key + '_backup', data);
      try { localStorage.setItem(key, data); } catch (_eL) { /* quota */ }
      try { localStorage.setItem(key + '_backup', data); } catch (_eL2) { /* quota */ }
      cleanupOldLogKeys();
    } catch (_e) {
      console.warn('[AntrianTools] storage save failed:', _e);
    }
  }

  function cleanupOldLogKeys(): void {
    const today = new Date().toISOString().slice(0, 10);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LOG_STORAGE_PREFIX) && !key.endsWith(today) && !key.endsWith(today + '_backup')) {
        localStorage.removeItem(key);
      }
    }
  }

  function addCallLogTable(): void {
    if (document.getElementById('ext-log-container')) return;
    let logEntries: CallLogEntry[] = getSavedLog();

    injectCSS('ext-log-table-css', [
      '#ext-log-container { background:#fff;margin-top:20px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.04);font-family:Inter,system-ui,sans-serif!important; }',
      '#ext-log-header { display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:#0f172a;color:#e2e8f0;font-weight:700;font-size:15px;letter-spacing:-0.2px; }',
      '#ext-log-clear { color:#94a3b8;font-size:11px;cursor:pointer;font-weight:500; }',
      '#ext-log-clear:hover { color:#fbbf24; }',
      '#ext-log-list { padding:16px 20px;max-height:260px;overflow-y:auto; }',
      '#ext-log-list div { padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:20px;color:#475569;font-weight:500;display:flex;align-items:center;gap:12px; }',
      '#ext-log-list div:last-child { border-bottom:none; }',
      '#ext-log-list .ext-log-arrow { color:#0ea5e9;font-weight:700;flex-shrink:0;font-size:22px; }',
      '#ext-log-list .ext-log-row-latest { color:#0369a1;font-weight:700; }',
      '#ext-log-list .ext-log-row-latest .ext-log-arrow { color:#0284c7; }',
      '#ext-log-list .ext-log-number { font-weight:800;color:#0f172a;min-width:50px; }',
      '#ext-log-list .ext-log-loket { background:#f0f9ff;color:#0369a1;padding:2px 12px;border-radius:20px;font-size:16px;font-weight:700;margin-left:auto; }',
    ]);

    const container = document.createElement('div');
    container.id = 'ext-log-container';
    container.innerHTML = [
      '<div id="ext-log-header">',
      '<span id="ext-log-title">Riwayat Panggilan</span>',
      '<span id="ext-log-clear">Bersihkan</span>',
      '</div>',
      '<div id="ext-log-list"></div>',
    ].join('');
    container.querySelector('#ext-log-clear')?.addEventListener('click', function () {
      logEntries = [];
      saveLog(logEntries);
      renderLogList(logEntries);
    });

    const target = document.getElementById('isi-val');
    if (target && target.parentNode) {
      target.parentNode.insertBefore(container, target.nextSibling);
    } else {
      document.body.appendChild(container);
    }

    function render(): void {
      renderLogList(logEntries);
    }

    render();
    pollCallLog(function (entry) {
      if (!entry) return;
      const exists = logEntries.some(function (e) {
        return e.nomor === entry.nomor && e.nama === entry.nama && e.loket === entry.loket;
      });
      if (!exists) {
        logEntries.push(entry);
        saveLog(logEntries);
        renderLogList(logEntries);
      }
    });
  }

  function renderLogList(entries: CallLogEntry[]): void {
    const listEl = document.getElementById('ext-log-list');
    if (!listEl) return;

    if (entries.length === 0) {
      listEl.innerHTML = '<div style="justify-content:center;color:#94a3b8;font-size:16px;">Belum ada panggilan</div>';
      syncLoketHeader(entries);
      return;
    }

    const recent = entries.slice(-5);
    const parts: string[] = [];
    for (let i = recent.length - 1; i >= 0; i--) {
      const e = recent[i];
      const isLatest = i === recent.length - 1;
      parts.push(
        '<div class="' + (isLatest ? 'ext-log-row-latest' : '') + '">' +
        '<span class="ext-log-arrow">' + (isLatest ? '\u25B6' : '\u2192') + '</span>' +
        '<span class="ext-log-number">' + escapeHtml(e.nomor) + '</span>' +
        escapeHtml(e.nama) +
        '<span class="ext-log-loket">Loket ' + escapeHtml(e.loket) + '</span>' +
        '</div>',
      );
    }
    listEl.innerHTML = parts.join('');

    var titleEl = document.getElementById('ext-log-title');
    if (titleEl) {
      titleEl.textContent = 'Riwayat Panggilan \u2014 ' + entries.length + ' data';
    }

    syncLoketHeader(entries);
  }

  function syncLoketHeader(entries: CallLogEntry[]): void {
    const judul = document.querySelector('.text-judul') as HTMLElement | null;
    if (!judul) return;

    judul.style.color = '#111827';

    if (entries.length === 0) {
      judul.textContent = 'MENUNGGU PANGGILAN';
      return;
    }

    const displayEl = document.querySelector('#isi-val .isi') as HTMLElement | null;
    const displayNum = displayEl?.textContent?.trim() || '';
    const cleanNum = displayNum.replace(/[^0-9]/g, '');

    const match = entries.find(function (e) {
      return e.nomor === displayNum || e.nomor === cleanNum ||
        displayNum.includes(e.nomor) || cleanNum.includes(e.nomor);
    });

    judul.textContent = match ? 'LOKET ' + match.loket : 'LOKET';
  }

  function pollCallLog(callback: (entry: CallLogEntry | null) => void): void {
    function fetchLatest(): void {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/public/view-antrian-call/control-call', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.timeout = 10000;

      xhr.onload = function () {
        try {
          var ct = xhr.getResponseHeader('Content-Type') || '';
          if (ct.includes('text/html') || ct.includes('text/plain')) {
            console.warn('[AntrianTools] Poll returned HTML instead of JSON — session may have expired');
            return;
          }
          const data = JSON.parse(xhr.responseText);
          if (data && data.NOMOR) {
            const now = new Date();
            const timel = now.getHours().toString().padStart(2, '0') + ':' +
              now.getMinutes().toString().padStart(2, '0') + ':' +
              now.getSeconds().toString().padStart(2, '0');
            callback({
              nomor: data.NOMOR || '?',
              nama: data.NAMA || '?',
              loket: data.LOKET || '?',
              waktu: timel,
            });
          }
        } catch (_e) { /* parse error */ }
      };

      xhr.onerror = function () { /* network error */ };
      xhr.send('type=check_antrian');
    }

    fetchLatest();
    setInterval(fetchLatest, 4000);
  }

  // ==================== COUNTER FIX ====================

  function fixCounter(): void {
    console.log('[AntrianTools] Counter page, looking for reset button...');

    const poll = setInterval(function () {
      const resetBtn = document.querySelector(
        'button[onclick*="reset_antrian"], .tombol[onclick*="reset"]',
      ) as HTMLButtonElement | null;
      if (resetBtn) {
        console.log('[AntrianTools] Reset button found');
        clearInterval(poll);
        fixResetButton(resetBtn);
      }
    }, 300);

    setTimeout(function () {
      clearInterval(poll);
      var nativeBtn = document.querySelector('button[onclick*="reset_antrian"]');
      if (!nativeBtn) {
        console.log('[AntrianTools] Native reset button not found, injecting fallback');
        injectFallbackResetButton();
      }
    }, 60000);

    startWebSocketFallback();
    addButtonTooltips();
  }

  function addButtonTooltips(): void {
    intervalPoll(function () {
      var nextBtn = document.querySelector('.tombol[onclick*="next"]') as HTMLElement;
      if (nextBtn && !nextBtn.hasAttribute('data-ext-tooltip')) {
        nextBtn.setAttribute('data-ext-tooltip', '1');
        nextBtn.style.cssText += ';position:relative;';
        var tip = document.createElement('div');
        tip.style.cssText = 'font-size:11px;color:#64748b;text-align:center;margin-top:-8px;margin-bottom:8px;';
        tip.textContent = 'Klik untuk memanggil antrian selanjutnya';
        nextBtn.parentNode?.insertBefore(tip, nextBtn.nextSibling);
      }
    });
  }

  function startWebSocketFallback(): void {
    var w = window as unknown as Record<string, unknown>;
    setInterval(function () {
      if (typeof w.contentloader === 'function') {
        var wsAny = (w as Record<string, { readyState?: number }>).ws as { readyState?: number } | undefined;
        if (wsAny && wsAny.readyState !== 1) {
          console.log('[AntrianTools] WebSocket disconnected, triggering fallback content refresh');
          (w.contentloader as Function)('/counter-antrian/counter?section=isi', '#isi');
        }
      }
    }, 10000);
  }

  function injectFallbackResetButton(): void {
    var container = document.querySelector('.card .container, .ext-modal-buttons, #isi');
    if (!container) container = document.body;

    var btn = document.createElement('button');
    btn.className = 'tombol';
    btn.textContent = 'Reset Semua Antrian';
    btn.style.cssText = 'width:100%;padding:12px;margin:10px 0;background:#dc2626;color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;';
    btn.addEventListener('mouseenter', function () { btn.style.background = '#991b1b'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#dc2626'; });
    fixResetButton(btn);

    if (container) container.appendChild(btn);
    console.log('[AntrianTools] Fallback reset button injected');
  }

  function fixResetButton(resetBtn: HTMLButtonElement): void {
    let isResetting = false;

    resetBtn.onclick = function (e: Event) {
      e.preventDefault();
      if (isResetting) return;
      const w = window as unknown as Record<string, unknown>;
      const swal = typeof w.swal === 'function' ? (w.swal as Function) : null;

      function doReset(): void {
        if (isResetting) return;
        isResetting = true;

        try { sessionStorage.setItem('ext_reset_return_url', window.location.href); } catch (_eS) { /* ignore */ }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'control-call', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 15000;

        if (swal) {
          swal({
            title: 'Memproses Reset...',
            text: 'Mengosongkan semua antrian',
            icon: 'info',
            buttons: false,
            closeOnClickOutside: false,
          });
        }

        xhr.onload = function () {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.status === 200) {
              if (swal) {
                swal({
                  title: 'Reset Berhasil',
                  text: 'Semua antrian telah dikosongkan. Halaman akan dimuat ulang.',
                  icon: 'success',
                  timer: 2000,
                });
              }
              setTimeout(function () { window.location.reload(); }, 2000);
            } else {
              if (swal) {
                swal({
                  title: 'Reset Gagal',
                  text: 'Server mengembalikan status: ' + (data.status || 'unknown'),
                  icon: 'error',
                });
              }
            }
          } catch (_e) {
            if (swal) {
              swal({
                title: 'Reset Gagal',
                text: 'Response server tidak valid',
                icon: 'error',
              });
            }
          }
        };

        xhr.onerror = function () {
          let msg = 'Gagal menghubungi server (HTTP ' + xhr.status + ')';
          if (xhr.status === 500) msg = 'Server error — hubungi IT';
          if (xhr.status === 0) msg = 'Tidak dapat terhubung ke server. Cek koneksi.';
          if (swal) {
            swal({ title: 'Reset Gagal', text: msg, icon: 'error' });
          }
        };

        xhr.send('type=reset_antrian');
      }

      if (swal) {
        swal({
          title: 'Reset Semua Antrian?',
          text: 'Semua nomor antrian hari ini akan DIHAPUS permanen.',
          icon: 'warning',
          buttons: ['Batal', 'Ya, Reset'],
          dangerMode: true,
          closeOnClickOutside: false,
        }).then(function (yes: boolean) {
          if (yes) doReset();
        });
      } else if (confirm('Reset semua antrian hari ini?')) {
        doReset();
      }
    };
  }

  // ==================== UTILITY ====================

  function injectCSS(id: string, rules: string[]): void {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = rules.join('\n');
    document.head.appendChild(s);
  }

  function intervalPoll(cb: () => void): void {
    let tries = 0;
    var poll = setInterval(function () {
      tries++;
      cb();
      if (tries >= 10) clearInterval(poll);
    }, 500);
  }

  function monkeypatchSetIntervals(): void {
    intervalPoll(function () {
      var w = window as unknown as Record<string, unknown>;
      if (typeof w.setIntervals === 'function') {
        var orig = w.setIntervals as Function;
        w.setIntervals = function () { orig(1); };
      }
    });
  }
})();
