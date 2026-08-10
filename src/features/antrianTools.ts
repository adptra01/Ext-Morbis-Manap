/* AntrianTools – rewrite sederhana (build 2026‑08‑10) */
(function () {
  /* ---- UTILS ---- */
  function onlyDigits(s: unknown): string {
    return String(s || '').replace(/\D/g, '');
  }

  function injectCSS(id: string, rules: string[]): void {
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = rules.join('\n');
    document.head.appendChild(s);
  }

  function intervalPoll(cb: () => void): void {
    const tries = setInterval(() => cb(), 500);
    setTimeout(() => clearInterval(tries), 5000);
  }

  function extLog(event: string, ok: boolean, detail?: unknown): void {
    try {
      window.postMessage?.(
        {
          __extUsageLog: { feature: 'antrianTools', event, ok, detail },
        },
        '*',
      );
    } catch {
      /* ignore */
    }
  }

  function enterFullscreen(): void {
    const doc = document as Document & {
      webkitFullscreenElement?: any;
      webkitExitFullscreen?: () => void;
    };
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  }

  function addFullscreenButton(): void {
    const btn = document.createElement('button');
    btn.id = 'ext-fullscreen-btn';
    btn.title = 'Fullscreen / Fit Screen Device';
    btn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: '999999',
      width: '48px',
      height: '48px',
      border: 'none',
      borderRadius: '12px',
      background: 'rgba(0,0,0,0.55)',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    });
    btn.addEventListener('click', enterFullscreen);
    document.body.appendChild(btn);
  }

  function showActiveBadge(): void {
    const badge = document.createElement('div');
    badge.id = 'ext-antrian-badge';
    badge.textContent = 'ANTRIAN TOOLS AKTIF';
    Object.assign(badge.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: '999999',
      padding: '8px 16px',
      borderRadius: '10px',
      background: 'rgba(0,100,0,0.8)',
      color: '#fff',
      font: '700 12px/1.4 monospace',
      backdropFilter: 'blur(3px)',
      cursor: 'pointer',
    });
    badge.title = 'Fullscreen mode';
    badge.addEventListener('click', enterFullscreen);
    document.body.appendChild(badge);
  }

  /* ---- SPEECH (TTS) ---- */
  function speak(msg: string): void {
    try {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(msg);
        u.lang = 'id';
        u.volume = 1;
        u.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }
    } catch {
      /* ignore */
    }
  }

  function buildSpokenText(nomor: string, loket: string): string {
    const n = nomor || '';
    if (!loket) return `nomor antrian ${n}`;
    return `nomor antrian ${n} di loket ${loket.toUpperCase()}`;
  }

  /* ---- AUTO-PRINT (mesin) ---- */
  function buildStrukHtml(nomor: string, loket: string): string {
    return `<html><head><style>@page{ size: 80mm 120mm; margin:0; } body{font-family:"Courier New",Courier,monospace;width:70mm;margin:0 auto;padding:20px 10px;text-align:center;color:#000;} .header{border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:15px;} .nomor{font-size:64px;font-weight:bold;margin:20px 0;} .loket{font-size:20px;font-weight:bold;margin-bottom:10px;} .footer{border-top:2px dashed #000;padding-top:10px;margin-top:20px;font-size:13px;}</style></head><body><div class="header"><h2>RSUD H. ABDUL MANAP</h2><small>SISTEM ANTRIAN</small></div>${loket ? `<div class="loket">${loket.toUpperCase()}</div>` : ''}<div>NOMOR ANTRIAN ANDA</div><div class="nomor">${nomor}</div><div>Mohon menunggu nomor Anda dipanggil</div><div class="footer">${new Date().toLocaleString('id-ID')}</div></body></html>`;
  }

  function cetakStrukAntrian(nomor: string, loket: string): void {
    const html = buildStrukHtml(nomor, loket);
    // print via window terpisah: tidak hilang saat halaman mesin reload 1 detik setelah klik
    const w = window.open('', '_blank', 'width=340,height=520');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch (e) {
          console.warn('[antrianTools] print gagal', e);
        }
      }, 250);
      return;
    }
    // ponytail: fallback iframe bila popup diblokir
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('[antrianTools] print gagal', e);
      }
      setTimeout(() => iframe.remove(), 500);
    }, 300);
  }

  /* ---- INIT (no external calls) ---- */
  function init(): void {
    const path = window.location.pathname;
    showActiveBadge();
    if (path.includes('/mesin-antrian')) addFullscreenButton();
    if (path.includes('/view-antrian') || path.includes('/display-val')) addFullscreenButton();
    if (path.includes('/counter-antrian/counter')) addFullscreenButton();
    /* ---- MESIN (print saat card antrian diklik) ---- */
    const attachPrintClick = () => {
      // card mesin punya onclick="antrian(N)"; klik di mana pun di card = ambil antrian
      document.querySelectorAll('[onclick^="antrian("]').forEach((card) => {
        if ((card as any).__extPrintHooked) return;
        (card as any).__extPrintHooked = true;
        card.addEventListener(
          'click',
          () => {
            const nomorEl = card.querySelector('[id^="nomortampil-"]');
            const nomor = onlyDigits(nomorEl?.textContent || '');
            if (!nomor) return;
            const idx = (card as HTMLElement).id.replace('nomortampil-', '');
            // ponytail: nomor tampil = antrian yang baru diambil, bukan panggilan loket
            cetakStrukAntrian(nomor, '');
            extLog('mesin_ticket', true, { idx, nomor });
          },
          true, // capture: jalan sebelum event server (antrian) & sebelum reload
        );
      });
    };
    intervalPoll(attachPrintClick);
    /* ---- COUNTER ---- */
    function hookCallTTS(): void {
      intervalPoll(() => {
        const w = window as unknown as Record<string, unknown>;
        const origCall = w.call as ((antrian: string, nama: string) => unknown) | undefined;
        if (typeof origCall !== 'function') return;
        if ((origCall as any).__extTtsHooked) return;
        const sel = document.querySelector('select#no_loket') as HTMLSelectElement | null;
        if (!sel) return;
        const opt = sel.options[sel.selectedIndex];
        const loketName = String(
          (opt?.text || opt.value || '').replace(/^LOKET\s+/i, '').toUpperCase(),
        );
        const wrapped = function (this: unknown, antrian: string, nama: string) {
          const spoken = buildSpokenText(antrian, loketName);
          speak(spoken);
          extLog('tts_call', true, { antrian, loket: loketName, spoken });
          return origCall.apply(this, [antrian, nama]);
        };
        (wrapped as any).__extTtsHooked = true;
        w.call = wrapped;
      });
    }
    /* ---- DISPLAY (v1) ---- */
    function initDisplay(): void {
      addFullscreenButton();
      // poles elemen asli display-val (dimuat AJAX ke #isi-val): gradient biru + font besar putih
      injectCSS('ext-antrian-display-css', [
        '#isi-val .card, .carousel-item .card{background:linear-gradient(135deg,#1e3a8a 0%,#2dd4bf 100%);box-shadow:0 12px 36px rgba(0,0,0,.35);border-radius:20px;width:90%;min-width:0;margin:24px auto;float:none;border:none;}',
        '#isi-val .head, .carousel-item .head{text-align:center;padding:40px;color:#fff;}',
        '#isi-val .judul, .carousel-item .judul{font-size:2.2em;color:rgba(255,255,255,.85);margin:0 0 12px;letter-spacing:.05em;}',
        '#isi-val .isi, .carousel-item .isi{font-size:10em;font-weight:700;color:#fff;line-height:1;text-shadow:0 6px 24px rgba(0,0,0,.3);}',
        '#isi-val .nama-antrian, .carousel-item .nama-antrian{font-size:3em;color:#fff;margin:16px 0 0;text-transform:uppercase;text-shadow:0 4px 16px rgba(0,0,0,.3);}',
        '@media(max-width:768px){#isi-val .isi,.carousel-item .isi{font-size:5em;}#isi-val .nama-antrian,.carousel-item .nama-antrian{font-size:1.6em;}}',
      ]);
      // TTS saat nomor panggilan berubah (suara TV)
      let lastActive = '';
      const pollActive = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/public/counter-antrian/data', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.onload = () => {
          try {
            const ct = xhr.getResponseHeader('Content-Type') || '';
            if (ct.includes('text/html') || ct.includes('text/plain')) return;
            const r: any = JSON.parse(xhr.responseText);
            const nomor = onlyDigits(r.NOMOR || '0');
            const loket =
              String(r.NAMA || '')
                .replace(/^LOKET\s+/i, '')
                .toUpperCase()
                .trim() || '-';
            if (lastActive !== nomor + '|' + loket) {
              lastActive = nomor + '|' + loket;
              speak(buildSpokenText(nomor, loket));
              extLog('display_active', true, { nomor, loket });
            }
          } catch {
            /* parse error */
          }
        };
        const loketFromUrl = new URLSearchParams(window.location.search).get('loket') || '';
        xhr.send('option=get_data_call&loket=' + encodeURIComponent(loketFromUrl));
      };
      pollActive();
      intervalPoll(pollActive);
    }
    /* ---- ROUTING ---- */
    if (path.includes('/mesin-antrian')) {
      addFullscreenButton();
    } else if (path.includes('/view-antrian') || path.includes('/display-val')) {
      initDisplay();
    } else if (path.includes('/counter-antrian/counter')) {
      hookCallTTS();
    }
  }

  window.addEventListener('beforeunload', () => {
    extLog('page_unload', true);
  });
  init();
})();
