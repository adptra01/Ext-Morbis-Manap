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
    if (document.getElementById('ext-fullscreen-btn')) return; // anti-duplikat
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
  // Pilih suara online (Google) lebih dulu — jauh lebih natural daripada espeak offline.
  // Chrome memuat daftar suara async; unlockTts() memicu getVoices() + voiceschanged.
  // espeak (localService) sengaja TIDAK dipakai — robotik; kalau tak ada voice online,
  // kembalikan null dan speak() langsung beralih ke MP3 Google TTS.
  function pickVoice(): SpeechSynthesisVoice | null {
    try {
      const vs = speechSynthesis.getVoices() || [];
      const idLang = (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('id');
      const online = (v: SpeechSynthesisVoice) => !v.localService;
      return vs.find((v) => idLang(v) && online(v)) || vs.find((v) => online(v)) || null;
    } catch {
      return null;
    }
  }

  // ponytail: fallback MP3 Google TTS — hanya jika speechSynthesis macet/error.
  // Ceiling: endpoint translate_tts tidak resmi, bisa kena rate-limit; upgrade ke
  // provider berbayar (ResponsiveVoice dll) jika sering gagal di lapangan.
  let _ttsDead = false;
  // Lapis 3: suara lokal sistem (espeak/Microsoft) — jaring terakhir saat internet mati.
  // Robotik, tapi lebih baik daripada diam. Hanya dipakai kalau MP3 Google pun gagal.
  function pickLocalVoice(): SpeechSynthesisVoice | null {
    try {
      const vs = speechSynthesis.getVoices() || [];
      const idLang = (v: SpeechSynthesisVoice) => (v.lang || '').toLowerCase().startsWith('id');
      const local = (v: SpeechSynthesisVoice) => !!v.localService;
      return vs.find((v) => idLang(v) && local(v)) || vs.find((v) => local(v)) || null;
    } catch {
      return null;
    }
  }

  function speakLocal(msg: string): void {
    try {
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = 'id';
      const v = pickLocalVoice();
      if (v) u.voice = v;
      u.volume = 1;
      u.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  function speakGoogleMp3(msg: string): void {
    try {
      const a = new Audio(
        'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=' +
          encodeURIComponent(msg),
      );
      a.onerror = () => speakLocal(msg); // internet mati / endpoint ditolak → suara lokal
      void a.play().catch(() => speakLocal(msg)); // gagal mulai (autoplay/network) → suara lokal
    } catch {
      speakLocal(msg);
    }
  }

  function speak(msg: string): void {
    if ('speechSynthesis' in window && !_ttsDead) {
      try {
        const voice = pickVoice();
        // voice online (Google) belum siap → langsung MP3, jangan espeak robotik
        if (!voice) {
          speakGoogleMp3(msg);
          return;
        }
        const u = new SpeechSynthesisUtterance(msg);
        u.lang = 'id';
        u.voice = voice;
        u.volume = 1;
        u.rate = 0.9;
        let started = false;
        const fallback = () => {
          if (!started && !speechSynthesis.speaking) {
            _ttsDead = true; // sesi ini: speechSynthesis nyangkut, pakai MP3
            speechSynthesis.cancel();
            speakGoogleMp3(msg);
          }
        };
        u.onstart = () => {
          started = true;
        };
        u.onerror = fallback;
        setTimeout(fallback, 1500); // tak pernah mulai dalam 1.5s → MP3
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      } catch {
        speakGoogleMp3(msg);
      }
    } else {
      speakGoogleMp3(msg);
    }
  }

  let _audioCtx: AudioContext | null = null; // dibuka di gesture pertama (unlockTts)

  function unlockTts(): void {
    // Chrome autoplay policy: speechSynthesis + AudioContext diblokir tanpa user gesture.
    // Layar kiosk display tidak pernah diklik — unlock di gesture pertama (fullscreen btn/badge).
    const unlock = () => {
      try {
        speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      } catch {
        /* ignore */
      }
      // AudioContext hanya boleh dibuat/diresume DI DALAM gesture yang sama.
      // chime() hanya berbunyi setelah ini (state 'running').
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx && !_audioCtx) _audioCtx = new Ctx();
        void _audioCtx?.resume().catch(() => {
          /* tetap diam jika masih diblokir */
        });
      } catch {
        /* ignore */
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      extLog('tts_unlocked', true);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    // Muat daftar suara sejak awal — voice Google (online) baru muncul setelah
    // voiceschanged; tanpa ini pickVoice() hanya melihat suara offline saat speak pertama.
    try {
      speechSynthesis.getVoices();
      speechSynthesis.addEventListener?.('voiceschanged', () => {
        // Chrome butuh beberapa detik setelah startup untuk memuat mesin suara Google.
        // Begitu voice online siap, izinkan speechSynthesis lagi (fallback MP3 di-bypass).
        if (pickVoice()) _ttsDead = false;
      });
    } catch {
      /* ignore */
    }
    // ponytail: keepalive — Chrome mengunci speechSynthesis setelah diam ~15 detik;
    // utterance kosong rutin saat idle menjaganya tetap hidup di kiosk.
    setInterval(() => {
      if (!speechSynthesis.speaking && !speechSynthesis.pending) {
        speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      }
    }, 10000);
  }

  function buildSpokenText(nomor: string, loket: string): string {
    const n = nomor || '';
    if (!loket) return `Nomor antrian ${n}`;
    return `Nomor antrian ${n}, ke loket ${loket.toUpperCase()}`;
  }

  /* ---- CHIME (bel 2 nada sebelum TTS) ---- */
  // Sintesis bell "ding-dong": nada E5 → C5 dengan harmonik + decay eksponensial
  // (timbre bel nyata, bukan bip sinus polos). WebAudio murni → jalan offline,
  // tanpa file audio eksternal.
  function bellNote(
    ctx: AudioContext,
    freq: number,
    at: number,
    dur: number,
    vol: number,
  ): void {
    // harmonik bell: fundamental + 2x + 2.76x (inharmonik, karakter bel) + 5.4x
    [1, 2, 2.76, 5.4].forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * h;
      const amp = vol * [1, 0.5, 0.3, 0.15][i] * (i === 0 ? 1 : 0.6);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(amp, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + dur + 0.05);
    });
  }

  function chime(): void {
    try {
      // TIDAK pernah resume() di sini — Chrome mencatat error "not allowed to start"
      // setiap resume tanpa gesture, dan resume() dari polling tidak pernah berhasil.
      // Hanya unlockTts() (di dalam gesture) yang membuat & me-resume context.
      if (!_audioCtx || _audioCtx.state !== 'running') return; // belum di-unlock → diam
      const now = _audioCtx.currentTime;
      // "ding" (E5) → 0.28s → "dong" (C5), durasi lebih panjang agar terdengar natural
      bellNote(_audioCtx, 659.25, now, 0.9, 0.5);
      bellNote(_audioCtx, 523.25, now + 0.28, 1.1, 0.5);
    } catch {
      /* audio tak tersedia */
    }
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
    // redesign display HANYA di view-antrian v1 (bukan view-antrian-v2)
    const isViewAntrian = path.endsWith('/counter-antrian/view-antrian');
    showActiveBadge();
    /* ---- MESIN (auto-print saat card antrian diklik) ---- */
    const initMesin = () => {
      addFullscreenButton();
      intervalPoll(attachPrintClick);
    };
    const attachPrintClick = () => {
      // ponytail: anti print ganda — klik ganda sebelum reload 1s (server reload setelah simpan)
      let lastPrintKey = '';
      let lastPrintAt = 0;
      // card mesin punya onclick="antrian(N)"; klik di mana pun di card = ambil antrian
      document.querySelectorAll('[onclick^="antrian("]').forEach((card) => {
        if ((card as any).__extPrintHooked) return;
        (card as any).__extPrintHooked = true;
        card.addEventListener(
          'click',
          () => {
            const nomorEl = card.querySelector('[id^="nomortampil-"]');
            const nomor =
              onlyDigits(nomorEl?.textContent || '') ||
              onlyDigits(card.querySelector('[id^="nomor-"]')?.getAttribute('value') || '');
            if (!nomor) return;
            const m = String((card as HTMLElement).getAttribute('onclick') || '').match(
              /antrian\((\d+)\)/,
            );
            const idx = m ? m[1] : '';
            const loket = String(
              card.querySelector('[id^="polinama-"]')?.getAttribute('value') || '',
            )
              .trim()
              .toUpperCase();
            const key = nomor + '|' + loket;
            const isDup = key === lastPrintKey && Date.now() - lastPrintAt <= 4000;
            lastPrintKey = key;
            lastPrintAt = Date.now();
            if (isDup) return; // skip print ganda untuk nomor sama
            cetakStrukAntrian(nomor, loket);
            extLog('mesin_ticket', true, { idx, nomor, loket });
          },
          true, // capture: jalan sebelum event server (antrian) & sebelum reload
        );
      });
    };
    /* ---- COUNTER ---- */
    const initCounter = () => {
      addFullscreenButton();
      hookCallTTS(); // sudah punya retry intervalPoll internal
    };
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
    const initDisplay = () => {
      addFullscreenButton();
      unlockTts(); // kiosk tanpa klik: buka kunci speechSynthesis di gesture pertama
      // REDESIGN TOTAL: overlay UI lengkap (fixed, menutup halaman server sepenuhnya).
      // Tidak bergantung DOM asli — header, card, footer dibangun sendiri dengan konsep
      // referensi gambar kedua (clean white + deep blue + teal accent + soft shadow).
      const ui = document.createElement('div');
      ui.id = 'ext-display-ui';
      ui.innerHTML =
        '<div class="ext-head">' +
        '  <div class="ext-brand">' +
        '    <img class="ext-logo" alt="logo RSUD" />' +
        '    <div class="ext-titles"><h1>RSUD H. ABDUL MANAP</h1><p>Melayani Dengan Sepenuh Hati</p></div>' +
        '  </div>' +
        '  <div class="ext-clock"><span class="ext-date"></span><span class="ext-time"></span></div>' +
        '</div>' +
        '<main class="ext-main">' +
        '  <section class="ext-card">' +
        '    <h2 class="ext-label">Antrian Saat Ini</h2>' +
        '    <div class="ext-number">--</div>' +
        '  </section>' +
        '</main>' +
        '<footer class="ext-foot"><div class="ext-marquee"><span>Mohon tetap menjaga protokol kesehatan. Untuk informasi lebih lanjut, silahkan menghubungi Call Center 0741-5910180 atau kunjungi website kami https://simanap.rsudkotajambi.id/</span></div></footer>';
      document.body.appendChild(ui);

      // logo: pakai dari halaman server bila ada, fallback sembunyikan gambar
      const logoEl = ui.querySelector('.ext-logo') as HTMLImageElement;
      const serverLogo = document.querySelector(
        'img[src*="logo" i], .logo img, img[alt*="logo" i]',
      ) as HTMLImageElement | null;
      if (serverLogo?.src) logoEl.src = serverLogo.src;
      else logoEl.style.display = 'none';

      // jam & tanggal live
      const dateEl = ui.querySelector('.ext-date') as HTMLElement;
      const timeEl = ui.querySelector('.ext-time') as HTMLElement;
      const tick = () => {
        const d = new Date();
        dateEl.textContent = d
          .toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
          .toUpperCase();
        timeEl.textContent =
          d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' WIB';
      };
      tick();
      setInterval(tick, 1000);

      injectCSS('ext-display-ui-css', [
        // layout overlay: header (auto) / main (flex-1, card kiri) / footer (40px)
        '#ext-display-ui{position:fixed;inset:0;z-index:999998;display:flex;flex-direction:column;background:#F8FAFC;font-family:"Segoe UI",system-ui,sans-serif;overflow:hidden;}',
        // header flat putih, garis tipis, logo kiri + jam kanan
        '.ext-head{display:flex;align-items:center;justify-content:space-between;background:#fff;border-bottom:1px solid #E2E8F0;box-shadow:0 1px 3px rgba(15,23,42,.06);padding:14px 28px;z-index:1;}',
        '.ext-brand{display:flex;align-items:center;gap:16px;min-width:0;}',
        '.ext-logo{height:56px;width:56px;object-fit:contain;flex-shrink:0;}',
        '.ext-titles h1{margin:0;font-size:clamp(18px,2vw,24px);font-weight:700;color:#0F172A;letter-spacing:.02em;}',
        '.ext-titles p{margin:2px 0 0;font-size:clamp(11px,1.2vw,14px);color:#64748B;}',
        '.ext-clock{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;}',
        '.ext-date{font-size:clamp(11px,1.2vw,14px);font-weight:600;color:#64748B;}',
        '.ext-time{font-size:clamp(20px,2.6vw,30px);font-weight:700;color:#0F172A;line-height:1;}',
        // main: card kiri 40%, area kanan kosong (negative space)
        '.ext-main{flex:1;display:flex;align-items:center;padding:40px 6vw;}',
        '.ext-card{width:40%;min-width:280px;background:linear-gradient(135deg,#173B8F 0%,#145E9E 55%,#0E8F9A 100%);border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 12px 32px rgba(15,23,42,.14);padding:48px 32px;text-align:center;color:#fff;}',
        '.ext-label{margin:0 0 20px;font-size:clamp(18px,2vw,26px);font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.85);}',
        '.ext-number{font-size:clamp(110px,16vw,150px);font-weight:700;line-height:.95;letter-spacing:-4px;color:#fff;word-break:break-all;}',
        // footer marquee biru tua
        '.ext-foot{height:40px;background:#0F2F6F;border-top:1px solid rgba(255,255,255,.08);overflow:hidden;z-index:1;}',
        '.ext-marquee{display:flex;width:max-content;height:100%;align-items:center;padding-left:100%;white-space:nowrap;animation:extMarquee 25s linear infinite;}',
        '.ext-marquee span{display:inline-block;padding:0 48px;font-size:clamp(12px,1.4vw,15px);font-weight:500;color:rgba(255,255,255,.85);}',
        '@keyframes extMarquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}',
        '@media(max-width:768px){.ext-main{padding:24px 4vw;}.ext-card{width:90%;padding:32px 20px;}.ext-number{font-size:clamp(80px,24vw,110px);}.ext-head{padding:10px 16px;}.ext-logo{height:40px;width:40px;}.ext-foot{height:32px;}.ext-marquee span{font-size:11px;}}',
      ]);
      // TTS saat nomor panggilan berubah (suara TV)
      let lastCallId = '';
      // offline indicator: 3x gagal berturut-turut → badge "KONEKSI TERPUTUS"
      let failCount = 0;
      const offlineBadge = () => {
        let el = document.getElementById('ext-offline-badge');
        if (!el) {
          el = document.createElement('div');
          el.id = 'ext-offline-badge';
          Object.assign(el.style, {
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '999999',
            padding: '8px 20px',
            borderRadius: '999px',
            background: 'rgba(180,0,0,.85)',
            color: '#fff',
            font: '700 14px/1.4 system-ui, sans-serif',
          });
          document.body.appendChild(el);
        }
        el.textContent = 'KONEKSI TERPUTUS';
      };
      const hideOfflineBadge = () => {
        document.getElementById('ext-offline-badge')?.remove();
      };
      // elemen nomor di overlay redesign (bukan .isi halaman server)
      const numberEl = ui.querySelector('.ext-number') as HTMLElement;
      const pollActive = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/public/counter-antrian/data', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        const onFail = () => {
          if (++failCount >= 3) offlineBadge();
          extLog('display_poll_fail', true, { failCount });
        };
        xhr.onerror = onFail;
        xhr.ontimeout = onFail;
        xhr.onload = () => {
          try {
            // server balas JSON dengan Content-Type text/html — jangan guard header,
            // cek isi body mulai '{' (halaman login HTML / error terlewat aman)
            const txt = String(xhr.responseText || '').trim();
            if (!txt.startsWith('{')) return;
            const r: any = JSON.parse(txt);
            failCount = 0;
            hideOfflineBadge();
            const nomor = onlyDigits(r.NOMOR || '0');
            numberEl.textContent = nomor || '--';
            // TTS pakai NOMOR LOKET pemanggil (r.LOKET), bukan nama klinik (r.NAMA)
            const loket =
              String(r.LOKET || '')
                .replace(/^LOKET\s+/i, '')
                .toUpperCase()
                .trim() || '-';
            // dedup via ID panggilan: nomor sama dipanggil ulang tetap bersuara
            const callId = String(r.ID || '');
            if (callId && callId !== lastCallId) {
              lastCallId = callId;
              chime(); // bel dulu, baru suara (perhatian di ruang tunggu)
              setTimeout(() => speak(buildSpokenText(nomor, loket)), 450);
              extLog('display_active', true, { nomor, loket, id: callId });
            }
          } catch {
            /* parse error */
          }
        };
        const loketFromUrl = new URLSearchParams(window.location.search).get('loket') || '';
        xhr.send('option=get_data_call&loket=' + encodeURIComponent(loketFromUrl));
      };
      pollActive();
      // ponytail: polling permanen — intervalPoll() mati setelah 5 detik (bug TTS mati)
      setInterval(pollActive, 1500);
    };
    /* ---- ROUTING ---- */
    if (path.includes('/mesin-antrian')) {
      initMesin();
    } else if (isViewAntrian) {
      initDisplay();
    } else if (path.includes('/counter-antrian/counter')) {
      initCounter();
    }
  }

  window.addEventListener('beforeunload', () => {
    extLog('page_unload', true);
  });
  init();
})();
