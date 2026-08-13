'use strict';
var __morbis_feature = (() => {
  // src/features/shared/wsHealth.ts
  function nextHealth(state, action, config) {
    if (action.type === 'we-wrote') {
      return {
        next: { ...state, nativeSig: action.signal, staleStreak: 0, ourSig: action.signal },
        startPolling: false,
        stopPolling: false,
      };
    }
    const sig = action.signal;
    if (sig !== state.nativeSig) {
      const recovered = sig !== state.ourSig;
      return {
        next: {
          ...state,
          nativeActive: recovered ? true : state.nativeActive,
          nativeSig: sig,
          staleStreak: 0,
          ourSig: recovered ? '' : state.ourSig,
        },
        startPolling: !state.nativeActive && !recovered,
        // masih fallback & bukan tulis sendiri → lanjut polling
        stopPolling: state.nativeActive === false && recovered,
        // pulih dari fallback → berhenti polling
      };
    }
    const streak = state.nativeActive ? state.staleStreak + 1 : state.staleStreak;
    if (state.nativeActive && streak >= config.staleMax) {
      return {
        next: { ...state, nativeActive: false, staleStreak: 0 },
        startPolling: true,
        stopPolling: false,
      };
    }
    return {
      next: { ...state, staleStreak: streak },
      startPolling: false,
      stopPolling: false,
    };
  }

  // src/features/shared/currentNumber.ts
  var CURRENT_RE = /current-number[^>]*data-counter="([^"]*)"[^>]*>([\s\S]*?)<\/span>/g;
  var ROW_RE = /<tr[^>]*data-nomor="([^"]*)"[^>]*>([\s\S]*?)<\/tr>/g;
  function parseListContentPatient(listContent) {
    const m = /* @__PURE__ */ new Map();
    if (!listContent) return m;
    for (const dl of listContent.querySelectorAll('dl')) {
      const h4 = dl.querySelector('h4');
      if (!h4) continue;
      const nomorMatch = (h4.textContent || '').match(/(\d+)$/);
      if (!nomorMatch) continue;
      const nomor = nomorMatch[1];
      const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
      const nama = dd3
        ? Array.from(dd3.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent || '')
            .join('')
            .replace(/\s+/g, ' ')
            .trim()
        : '';
      const kode =
        dd3 && /[A-Za-z]/.test((h4.textContent || '').split('-')[0] || '')
          ? (h4.textContent || '').split('-')[0].toUpperCase()
          : '';
      if (nomor) m.set(nomor, { nama, kode });
    }
    return m;
  }
  function parseCurrentNumbers(html) {
    const m = /* @__PURE__ */ new Map();
    for (const mm of html.matchAll(CURRENT_RE)) {
      const counter = mm[1].trim();
      const value = mm[2].replace(/\s+/g, ' ').trim();
      if (counter) m.set(counter, value);
    }
    return m;
  }
  function parsePatients(html) {
    const m = /* @__PURE__ */ new Map();
    for (const row of html.matchAll(ROW_RE)) {
      const nomor = row[1].trim();
      if (!nomor) continue;
      const tds = [...row[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((t) =>
        t[1]
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      );
      const kode = tds[0] && /[A-Za-z]/.test(tds[0]) ? tds[0].split('-')[0] : '';
      const nama =
        tds.find((t) => /[A-Za-z]{2,}/.test(t) && !/^[A-Z]{1,3}-\d+$/.test(t)) ||
        tds[tds.length - 2] ||
        '';
      if (nama || kode) m.set(nomor, { nama, kode });
    }
    return m;
  }
  function activeNumber(cur) {
    const prefer = ['1', '2'];
    for (const c of prefer) {
      const v = cur.get(c);
      if (v && v !== '0') return v;
    }
    for (const v of cur.values()) {
      if (v && v !== '0') return v;
    }
    return '';
  }
  function isReset(cur, prev) {
    if (prev.size === 0) return false;
    for (const [c, v] of cur) {
      const p = prev.get(c);
      if (p === void 0) continue;
      const pn = Number(p);
      const vn = Number(v);
      if (Number.isFinite(pn) && Number.isFinite(vn) && vn < pn) return true;
    }
    return false;
  }

  // src/features/antrianFarmasiDisplay.ts
  (function () {
    const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
    const POLL_LADDER_MS = [500, 1500, 3e3, 6e3];
    const GAP_MS = 400;
    const CARD_MS = 1e3;
    let statusBadge = null;
    let controlsHost = null;
    function ensureControlsHost() {
      if (controlsHost) return;
      if (!document.body) return;
      const side = document.querySelector('.side');
      const host = document.createElement('div');
      host.id = 'ext-afd-controls';
      host.style.cssText =
        'display:flex;flex-direction:column;gap:10px;margin:12px 4px 4px;padding:12px;background:#fff;border:1px solid #0f5132;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.08);';
      (side ?? document.body).appendChild(host);
      controlsHost = host;
    }
    function ensureStatusBadge() {
      if (statusBadge) return;
      ensureControlsHost();
      statusBadge = document.createElement('div');
      statusBadge.id = 'ext-afd-status';
      statusBadge.style.cssText =
        'padding:5px 12px;border-radius:999px;align-self:flex-start;font:700 12px/1.3 "Inter",system-ui,sans-serif;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,.15);color:#fff;';
      statusBadge.setAttribute('data-state', 'init');
      const sb = statusBadge;
      const mount = () => {
        if (!document.body) return;
        ensureControlsHost();
        if (sb && !sb.isConnected) controlsHost?.appendChild(sb);
      };
      document.addEventListener('DOMContentLoaded', mount);
      window.setInterval(mount, 300);
      mount();
    }
    function setStatus(state) {
      ensureStatusBadge();
      if (!statusBadge) return;
      statusBadge.setAttribute('data-state', state);
      const dot =
        '<span style="width:9px;height:9px;border-radius:999px;background:currentColor;display:inline-block;flex-shrink:0;"></span>';
      if (state === 'loading') {
        statusBadge.style.background = '#d97706';
        statusBadge.innerHTML = dot + 'MEMPERBARUI\u2026';
      } else if (state === 'ok') {
        statusBadge.style.background = '#0f5132';
        statusBadge.innerHTML =
          dot +
          'SIAP \xB7 ' +
          /* @__PURE__ */ new Date().toLocaleTimeString('id-ID', { hour12: false });
      } else {
        statusBadge.style.background = '#b91c1c';
        statusBadge.innerHTML = dot + 'GAGAL';
      }
    }
    let toolbar = null;
    function ensureToolbar() {
      if (toolbar) return;
      ensureControlsHost();
      toolbar = document.createElement('div');
      toolbar.id = 'ext-afd-toolbar';
      toolbar.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
      toolbar.innerHTML =
        '<button id="ext-afd-testsound" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#0f5132;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">\u{1F50A} Tes Suara</button><button id="ext-afd-fs" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#155e75;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">\u26F6 Full Screen</button>';
      const el = toolbar;
      const mount = () => {
        if (!el || el.isConnected) return;
        ensureControlsHost();
        controlsHost?.appendChild(el);
      };
      if (document.body) mount();
      else document.addEventListener('DOMContentLoaded', mount);
      window.setInterval(mount, 300);
      toolbar.querySelector('#ext-afd-testsound')?.addEventListener('click', () => {
        unlockAudio();
        setStatus('loading');
        announce({
          id: 'tes:suara',
          nomor: '99',
          kode: 'BT',
          namaPasien: 'Tes Suara Panggilan',
          unit: '',
          jenis: 'tunggal',
          rm: '',
        });
        window.setTimeout(() => setStatus('ok'), 5e3);
      });
      toolbar.querySelector('#ext-afd-fs')?.addEventListener('click', () => {
        const doc = document;
        const el2 = document.documentElement;
        if (document.fullscreenElement || doc.webkitFullscreenElement) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        } else if (el2.requestFullscreen) {
          void el2.requestFullscreen();
        } else if (el2.webkitRequestFullscreen) {
          el2.webkitRequestFullscreen();
        }
      });
    }
    const WATCH_MS = 1500;
    const STALE_MAX = 2;
    async function fetchCallData() {
      const res = await fetch(LIST_URL + '?type=data_call', {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Respons bukan array: ' + String(text).slice(0, 80));
      }
      return parsed;
    }
    function loket() {
      const el = document.querySelector('#no_loket');
      if (el && el.value) return el.value;
      return '4324';
    }
    async function fetchCurrentNumber() {
      const res = await fetch(
        '/antrian-farmasi/v2?section=isi&nomor=' + encodeURIComponent(loket()),
        {
          method: 'GET',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        },
      );
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      return { current: parseCurrentNumbers(html), patients: parsePatients(html) };
    }
    function toViewRow(r) {
      const j = /racik/i.test(String(r.JENIS ?? '')) ? 'racikan' : 'tunggal';
      return {
        id: String(r.ID),
        nomor: r.COUNTER != null ? String(r.COUNTER) : r.NOMOR != null ? String(r.NOMOR) : '',
        kode: r.KODE || r.NAMA || 'BT',
        namaPasien: r.NAMA_PASIEN ?? '',
        unit: r.NAMA_UNIT ?? '',
        jenis: j,
        rm: r.ID_PASIEN != null ? String(r.ID_PASIEN) : '',
      };
    }
    function normalize(rows) {
      const panggilan = [];
      const siapDiambil = [];
      for (const r of rows) {
        if (!r || r.ID == null) continue;
        const v = toViewRow(r);
        const st = String(r.STATUS).trim();
        const diterima = r.WAKTU_PENERIMAAN != null && String(r.WAKTU_PENERIMAAN).trim() !== '';
        const diserahkan = r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '';
        if (st === '0') panggilan.push(v);
        else if (diterima && !diserahkan) siapDiambil.push(v);
      }
      return { panggilan, siapDiambil };
    }
    const PANGGILAN_SEL = '#antrian-penyerahan';
    const SIAP_SEL = '#antrian-view';
    function cardSection(label, numText, nama) {
      return (
        '<div class="antrian-title">' +
        label +
        '</div><div class="antrian-nomor">' +
        (numText && numText !== '0' ? numText : '\u2014') +
        '</div>' +
        (nama ? '<div class="antrian-rm">' + nama + '</div>' : '')
      );
    }
    function currentPatientName(jenis, morbisNum) {
      if (!morbisNum || morbisNum === '0') return '';
      const isR = jenis === 'racikan';
      const row = lastRows.find(
        (r) =>
          (isR ? /racik/i.test(String(r.JENIS ?? '')) : !/racik/i.test(String(r.JENIS ?? ''))) &&
          (String(r.NOMOR ?? '') === morbisNum || String(r.COUNTER ?? '') === morbisNum),
      );
      return row?.NAMA_PASIEN || '';
    }
    function readPanelNumber(sel) {
      const el = document.querySelector(sel);
      if (!el) return '';
      const m = (el.querySelector?.('.antrian-nomor')?.textContent || '').trim();
      return m && m !== '\u2014' ? m : '';
    }
    function highlightCurrents() {
      const lc = document.querySelector('#list-content');
      if (!lc) return;
      const targets = [currentByJenis.tunggal, currentByJenis.racikan].filter(
        (n) => n && n !== '0',
      );
      const names = [
        lastByJenis.tunggal?.namaPasien || '',
        lastByJenis.racikan?.namaPasien || '',
      ].filter(Boolean);
      for (const dl of lc.querySelectorAll('dl')) {
        const h4 = dl.querySelector('h4');
        const num = ((h4?.textContent || '').match(/(\d+)$/) || [])[1] || '';
        const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
        const d = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
        const matchNum = targets.some((n) => num && n === num);
        const matchName = names.some((nm) => nm && d === nm);
        dl.style.background = matchNum || matchName ? '#fde68a' : '';
      }
    }
    async function recallPatient(row) {
      const noLoket = loket();
      const id = row.ID != null ? String(row.ID) : '';
      const nomor =
        row.COUNTER != null ? String(row.COUNTER) : row.NOMOR != null ? String(row.NOMOR) : '';
      const jenis = /racik/i.test(String(row.JENIS ?? '')) ? 'racikan' : 'tunggal';
      if (!id) return;
      if (!window.confirm('Panggil ulang ' + (row.NAMA_PASIEN || '') + ' (' + nomor + ')?')) return;
      try {
        const res = await fetch('/antrian-farmasi/control', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body:
            'id=' +
            encodeURIComponent(id) +
            '&nomor=' +
            encodeURIComponent(nomor) +
            '&jenis=' +
            encodeURIComponent(jenis) +
            '&loket=' +
            encodeURIComponent(noLoket),
        });
        if (!res.ok) {
          console.error('[AFD] recall gagal HTTP', res.status);
          return;
        }
        const loader = window;
        if (typeof loader.contentloader === 'function') {
          loader.contentloader('/antrian-farmasi/v2?section=isi&nomor=' + noLoket, '#isi');
        }
      } catch (e) {
        console.error('[AFD] recall error', e);
      }
    }
    function wireRowRecall() {
      const lc = document.querySelector('#list-content');
      if (!lc || lc.__afdRecall) return;
      lc.__afdRecall = true;
      const rows = lc.querySelectorAll('dl');
      for (const dl of rows) {
        const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
        const nameTxt = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
        if (!nameTxt || dl.__afdRec) continue;
        dl.__afdRec = true;
        dl.addEventListener('click', () => {
          const row = lastRows.find(
            (r) =>
              ((r.NAMA_PASIEN || '').replace(/\s+/g, ' ').trim() || '').indexOf(nameTxt) !== -1,
          );
          if (row) void recallPatient(row);
        });
      }
    }
    async function refreshCardNumber() {
      setStatus('loading');
      try {
        const [{ current: cur }, rows] = await Promise.all([fetchCurrentNumber(), fetchCallData()]);
        lastRows = rows;
        const g1 = cur.get('1')?.trim();
        const g2 = cur.get('2')?.trim();
        currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
        currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';
        const panelT = readPanelNumber(PANGGILAN_SEL);
        const panelR = readPanelNumber(SIAP_SEL);
        const recallT =
          panelT &&
          panelT !== '0' &&
          panelT !== currentByJenis.tunggal &&
          panelT !== writtenByUs.tunggal;
        const recallR =
          panelR &&
          panelR !== '0' &&
          panelR !== currentByJenis.racikan &&
          panelR !== writtenByUs.racikan;
        if (recallT || recallR) {
          const jenis = recallT ? 'tunggal' : 'racikan';
          const panelNum = recallT ? panelT : panelR;
          const key = jenis + ':' + panelNum;
          if (key !== lastNativeCall) {
            lastNativeCall = key;
            const nama = currentPatientName(jenis, panelNum);
            announce({
              id: 'recall:' + key,
              nomor: panelNum,
              kode: '',
              namaPasien: nama,
              unit: '',
              jenis,
              rm: '',
            });
            updateDebugState({ lastAnnouncement: 'recall:' + key });
          }
          writtenByUs[jenis] = panelNum;
          setStatus('ok');
          return;
        }
        for (const j of ['tunggal', 'racikan']) {
          const cur2 = currentByJenis[j];
          const prev = prevByJenis[j];
          if (cur2 && cur2 !== '0' && cur2 !== prev) {
            lastNativeCall = null;
            const nama = currentPatientName(j, cur2);
            announce({
              id: j + ':' + cur2,
              nomor: cur2,
              kode: '',
              namaPasien: nama,
              unit: '',
              jenis: j,
              rm: '',
            });
          }
          prevByJenis[j] = cur2 || '';
        }
        const atas = document.querySelector(PANGGILAN_SEL);
        if (atas)
          atas.innerHTML = cardSection(
            'Obat Tunggal',
            currentByJenis.tunggal,
            currentPatientName('tunggal', currentByJenis.tunggal),
          );
        const bawah = document.querySelector(SIAP_SEL);
        if (bawah)
          bawah.innerHTML = cardSection(
            'Obat Racikan',
            currentByJenis.racikan,
            currentPatientName('racikan', currentByJenis.racikan),
          );
        highlightCurrents();
        writtenByUs.tunggal = currentByJenis.tunggal;
        writtenByUs.racikan = currentByJenis.racikan;
        onWeWrote();
        setStatus('ok');
      } catch {
        setStatus('error');
      }
    }
    function renderDisplay(view, call) {
      if (call) {
        lastByJenis[call.jenis] = call;
        seedLastByJenis(view);
        const atasRecall =
          readPanelNumber(PANGGILAN_SEL) &&
          readPanelNumber(PANGGILAN_SEL) !== currentByJenis.tunggal &&
          readPanelNumber(PANGGILAN_SEL) !== writtenByUs.tunggal;
        const bawahRecall =
          readPanelNumber(SIAP_SEL) &&
          readPanelNumber(SIAP_SEL) !== currentByJenis.racikan &&
          readPanelNumber(SIAP_SEL) !== writtenByUs.racikan;
        const atas = atasRecall ? null : document.querySelector(PANGGILAN_SEL);
        if (atas)
          atas.innerHTML = cardSection(
            'Obat Tunggal',
            currentByJenis.tunggal,
            currentPatientName('tunggal', currentByJenis.tunggal),
          );
        const bawah = bawahRecall ? null : document.querySelector(SIAP_SEL);
        if (bawah)
          bawah.innerHTML = cardSection(
            'Obat Racikan',
            currentByJenis.racikan,
            currentPatientName('racikan', currentByJenis.racikan),
          );
        highlightCurrents();
        wireRowRecall();
        writtenByUs.tunggal = currentByJenis.tunggal;
        writtenByUs.racikan = currentByJenis.racikan;
      }
      onWeWrote();
    }
    function seedLastByJenis(view) {
      for (const row of view.panggilan) {
        if (!lastByJenis[row.jenis]) lastByJenis[row.jenis] = row;
      }
      for (const row of lastRows) {
        const v = toViewRow(row);
        lastByJenis[v.jenis] = v;
      }
    }
    let announcedSig = '';
    const prevCurrent = /* @__PURE__ */ new Map();
    let currentCall = null;
    let baselineSet = false;
    const lastByJenis = {
      tunggal: null,
      racikan: null,
    };
    const currentByJenis = {
      tunggal: '',
      racikan: '',
    };
    const prevByJenis = { tunggal: '', racikan: '' };
    const writtenByUs = { tunggal: '', racikan: '' };
    let lastNativeCall = null;
    let lastRows = [];
    const synth = window.speechSynthesis;
    const RealSpeak = synth.speak.bind(synth);
    let busy = false;
    const queue = [];
    function next() {
      if (busy || queue.length === 0) return;
      busy = true;
      const item = queue.shift();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        busy = false;
        setTimeout(() => next(), GAP_MS);
      };
      if (item.kind === 'bell') {
        ringBell(finish);
        return;
      }
      try {
        const u = new SpeechSynthesisUtterance(item.text);
        const v = synth.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith('id'));
        if (v) u.voice = v;
        u.lang = 'id-ID';
        u.rate = 0.8;
        u.volume = 1;
        u.onend = finish;
        u.onerror = finish;
        RealSpeak.call(synth, u);
        setTimeout(finish, 2e4);
      } catch {
        finish();
      }
    }
    const N2W_SATUAN = [
      '',
      'satu',
      'dua',
      'tiga',
      'empat',
      'lima',
      'enam',
      'tujuh',
      'delapan',
      'sembilan',
      'sepuluh',
      'sebelas',
    ];
    function numberToWords(n) {
      const num = Math.abs(Math.trunc(Number(n)));
      if (!Number.isFinite(num)) return String(n);
      const two = (x) => {
        if (x < 12) return N2W_SATUAN[x];
        if (x < 20) return N2W_SATUAN[x - 10] + ' belas';
        if (x < 100)
          return x % 10 === 0
            ? N2W_SATUAN[x / 10] + ' puluh'
            : N2W_SATUAN[Math.trunc(x / 10)] + ' puluh ' + N2W_SATUAN[x % 10];
        return '';
      };
      if (num === 0) return 'nol';
      if (num < 100) return two(num);
      if (num < 1e3) {
        const r = num % 100;
        return (
          (num < 200 ? 'seratus' : two(Math.trunc(num / 100)) + ' ratus') + (r ? ' ' + two(r) : '')
        );
      }
      return String(num);
    }
    let bellCtx = null;
    function ringBell(onDone) {
      try {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return onDone();
        bellCtx = bellCtx || new Ctor();
        void bellCtx.resume();
        const now = bellCtx.currentTime;
        const notes = [
          [1318.5, now],
          [1760, now + 0.28],
        ];
        for (const [freq, t0] of notes) {
          const osc = bellCtx.createOscillator();
          const g = bellCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t0);
          g.gain.setValueAtTime(1e-4, t0);
          g.gain.exponentialRampToValueAtTime(0.45, t0 + 0.02);
          g.gain.exponentialRampToValueAtTime(1e-4, t0 + 0.3);
          osc.connect(g);
          g.connect(bellCtx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.32);
        }
        const totalMs = 280 + 300 + 80;
        setTimeout(onDone, totalMs);
      } catch {
        onDone();
      }
    }
    function titleCase(s) {
      return s
        .split(/\s+/)
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
        .join(' ');
    }
    function announce(row) {
      if (!audioUnlocked) {
        console.warn('[FarmasiDisplay] audio belum unlocked \u2014 TTS/bell dilewati');
        return;
      }
      const kalimat =
        'Nomor antrian ' +
        numberToWords(row.nomor) +
        (row.namaPasien ? ', atas nama ' + titleCase(String(row.namaPasien)) : '') +
        ', silakan menuju farmasi.';
      queue.push(
        { kind: 'bell' },
        { kind: 'voice', text: kalimat },
        { kind: 'voice', text: kalimat },
      );
      next();
    }
    let audioUnlocked = false;
    function unlockAudio() {
      if (audioUnlocked) return;
      audioUnlocked = true;
      updateDebugState({ audioUnlocked: true });
      document.removeEventListener('pointerdown', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      console.log('[FarmasiDisplay] audio unlocked via gesture');
    }
    document.addEventListener('pointerdown', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    (function tryAutoUnlock() {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        unlockAudio();
      };
      const run = () => {
        try {
          const Ctor = window.AudioContext;
          if (Ctor) {
            const a = new Ctor();
            a.onstatechange = () => {
              if (a.state === 'running') {
                a.close().catch(() => {});
                finish();
              }
            };
            void a.resume().catch(() => {});
          } else {
            finish();
          }
          window.setTimeout(() => {
            if (done) return;
            try {
              const u = new SpeechSynthesisUtterance(' ');
              const s = window.speechSynthesis;
              s.speak(u);
              window.setTimeout(() => {
                s.cancel();
                if (audioUnlocked === false) finish();
              }, 250);
            } catch {
              finish();
            }
          }, 400);
        } catch {
          finish();
        }
      };
      if (document.readyState !== 'loading') run();
      else document.addEventListener('DOMContentLoaded', run);
    })();
    let voiceEnabled = false;
    let started = false;
    let watchTimer = null;
    let pollTimer = null;
    let cardTimer = null;
    const healthCfg = { staleMax: STALE_MAX };
    let health = { nativeActive: true, staleStreak: 0, nativeSig: '', ourSig: '' };
    const debugEnabled = new URLSearchParams(window.location.search).get('debug') === '1';
    const debugState = {
      started: false,
      mode: 'NATIVE',
      nativeActive: true,
      pollingActive: false,
      lastNativeActivity: null,
      lastPoll: null,
      lastDataCount: null,
      lastAnnouncement: null,
      audioUnlocked: false,
    };
    function updateDebugState(patch) {
      if (!debugEnabled) return;
      Object.assign(debugState, patch);
      window.__ANTRIAN_FARMASI_DEBUG__ = { ...debugState };
    }
    function domSignal() {
      const p = document.querySelector(PANGGILAN_SEL);
      const s = document.querySelector(SIAP_SEL);
      return (p ? (p.textContent ?? '') : '') + '|' + (s ? (s.textContent ?? '') : '');
    }
    function onWeWrote() {
      health = nextHealth(health, { type: 'we-wrote', signal: domSignal() }, healthCfg).next;
    }
    function stopPolling() {
      if (pollTimer) {
        window.clearTimeout(pollTimer);
        pollTimer = null;
      }
    }
    function schedulePoll() {
      if (health.nativeActive || pollTimer) return;
      if (!voiceEnabled) return;
      pollTimer = window.setTimeout(() => void pollFallback(), POLL_LADDER_MS[ladderIdx]);
    }
    let ladderIdx = 0;
    async function pollFallback() {
      pollTimer = null;
      try {
        const [{ current: cur, patients }, rows] = await Promise.all([
          fetchCurrentNumber(),
          fetchCallData(),
        ]);
        ladderIdx = 0;
        updateDebugState({ lastPoll: Date.now(), lastDataCount: rows.length });
        lastRows = rows;
        const view = normalize(rows);
        const num = activeNumber(cur);
        const g1 = cur.get('1')?.trim();
        const g2 = cur.get('2')?.trim();
        currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
        currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';
        const sig =
          num !== ''
            ? [...cur.entries()]
                .filter(([, v]) => v === num)
                .map(([c]) => c + ':' + num)
                .join('|')
            : '';
        if (num !== '') {
          const domNames = parseListContentPatient(document.querySelector('#list-content'));
          let pr = domNames.get(num);
          if (!pr || !pr.nama) pr = patients.get(num);
          const mPat = matchPatient(rows, num);
          const call = {
            id: 'cur-' + num,
            nomor: num,
            kode: (pr && pr.kode) || mPat?.kode || '',
            namaPasien: (pr && pr.nama) || mPat?.namaPasien || '',
            unit: mPat?.unit || '',
            jenis: mPat?.jenis || 'tunggal',
            rm: mPat?.rm || '',
          };
          if (!baselineSet) {
            baselineSet = true;
            currentCall = call;
            prevCurrent.clear();
            for (const [c, v] of cur) prevCurrent.set(c, v);
            renderDisplay(view, currentCall);
          } else if (sig !== announcedSig && isNewCurrent(cur)) {
            if (isReset(cur, prevCurrent)) {
              currentCall = call;
              prevCurrent.clear();
              for (const [c, v] of cur) prevCurrent.set(c, v);
              renderDisplay(view, currentCall);
            } else {
              announcedSig = sig;
              currentCall = call;
              prevCurrent.clear();
              for (const [c, v] of cur) prevCurrent.set(c, v);
              renderDisplay(view, currentCall);
              maybeAnnounce(view, currentCall);
            }
          } else {
            prevCurrent.clear();
            for (const [c, v] of cur) prevCurrent.set(c, v);
            if (currentCall) renderDisplay(view, currentCall);
            else {
              currentCall = call;
              renderDisplay(view, currentCall);
            }
          }
        } else if (view.siapDiambil.length > 0) {
          if (currentCall) renderDisplay(view, currentCall);
        }
      } catch (error) {
        ladderIdx = Math.min(ladderIdx + 1, POLL_LADDER_MS.length - 1);
        console.warn(
          '[FarmasiDisplay] fallback gagal (backoff ' + POLL_LADDER_MS[ladderIdx] + 'ms):',
          error,
        );
      } finally {
        schedulePoll();
      }
    }
    function isNewCurrent(cur) {
      if (prevCurrent.size === 0) return false;
      for (const [c, v] of cur) {
        if (prevCurrent.get(c) !== v) return true;
      }
      return false;
    }
    function matchPatient(rows, nomor) {
      const byCounter = rows.find(
        (r) => r && r.COUNTER != null && String(r.COUNTER).trim() === nomor,
      );
      const hit =
        byCounter ?? rows.find((r) => r && r.NOMOR != null && String(r.NOMOR).trim() === nomor);
      return hit ? toViewRow(hit) : null;
    }
    function maybeAnnounce(view, call) {
      if (!voiceEnabled) return;
      if (call.id === announcedSig) {
        console.info('[AFD] duplicate ignored ' + announcedSig);
        return;
      }
      announcedSig = call.id;
      updateDebugState({ lastAnnouncement: announcedSig });
      console.info('[AFD] ANNOUNCE ' + announcedSig);
      announce(call);
    }
    let lastMode = 'NATIVE';
    function watch() {
      const result = nextHealth(health, { type: 'observe', signal: domSignal() }, healthCfg);
      health = result.next;
      if (result.startPolling) {
        ladderIdx = 0;
        schedulePoll();
        if (lastMode !== 'FALLBACK') {
          lastMode = 'FALLBACK';
          console.info('[AFD] MODE=FALLBACK');
        }
        updateDebugState({ mode: 'FALLBACK', nativeActive: false, pollingActive: true });
      } else if (result.stopPolling) {
        stopPolling();
        if (lastMode !== 'NATIVE') {
          lastMode = 'NATIVE';
          console.info('[AFD] MODE=NATIVE');
        }
        updateDebugState({
          mode: 'NATIVE',
          nativeActive: true,
          pollingActive: false,
          lastNativeActivity: Date.now(),
        });
      } else if (!health.nativeActive && lastMode !== 'FALLBACK') {
        lastMode = 'FALLBACK';
        updateDebugState({ mode: 'FALLBACK', nativeActive: false, pollingActive: true });
      }
    }
    function startWithRole() {
      if (started) return;
      started = true;
      updateDebugState({ started: true });
      ensureStatusBadge();
      ensureToolbar();
      setStatus('loading');
      voiceEnabled = true;
      health = { ...health, nativeSig: domSignal() };
      if (watchTimer === null) {
        watchTimer = setInterval(watch, WATCH_MS);
      }
      if (cardTimer === null) {
        cardTimer = setInterval(() => void refreshCardNumber(), CARD_MS);
        void refreshCardNumber();
      }
    }
    startWithRole();
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplay.js.map
