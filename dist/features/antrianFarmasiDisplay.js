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

  // src/features/shared/farmasiQueueBridge.ts
  var REQ_SOURCE = 'MORBIS-FARMASI';
  var RES_SOURCE = 'MORBIS-FARMASI-BRIDGE';
  var REPLY_TIMEOUT_MS = 4e3;
  function post(type, payload) {
    const id = 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
    return new Promise((resolve, reject) => {
      const onMsg = (event) => {
        if (event.source !== window) return;
        const d = event.data;
        if (!d || d.source !== RES_SOURCE || d.type !== type || d.id !== id) return;
        window.removeEventListener('message', onMsg);
        clearTimeout(timer);
        if (!d.ok) return reject(new Error(d.error || type + ' gagal'));
        resolve(d);
      };
      window.addEventListener('message', onMsg);
      const timer = window.setTimeout(() => {
        window.removeEventListener('message', onMsg);
        reject(new Error('farmasiQueueBridge: no reply (extension reloaded?)'));
      }, REPLY_TIMEOUT_MS);
      window.postMessage({ source: REQ_SOURCE, type, id, ...payload }, '*');
    });
  }
  async function issuePending(rows) {
    return post('QUEUE_ISSUE', { rows });
  }
  async function reset() {
    return post('QUEUE_RESET', {});
  }

  // src/features/shared/farmasiQueue.ts
  function getTicket(st, id) {
    return st.tickets[id] ?? null;
  }

  // src/features/shared/farmasiEvent.ts
  function toRowState(r) {
    const sp = String(r.STATUS_PANGGIL ?? '');
    return {
      id: String(r.ID ?? ''),
      nomor: String(r.NOMOR ?? ''),
      status: String(r.STATUS ?? ''),
      statusPanggil: sp,
      jenis: /racik/i.test(String(r.JENIS ?? '')) ? 'racikan' : 'tunggal',
      nama: String(r.NAMA_PASIEN ?? ''),
      diserahkan: r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '',
      called: sp === '1',
    };
  }
  function resolveCalledId(rows, morbisNum, jenis) {
    const cands = rows.filter(
      (r) => r.nomor === morbisNum && r.jenis === jenis && r.status !== '0',
    );
    if (cands.length === 0) return null;
    const called = cands.filter((r) => r.called);
    const pick = (called.length > 0 ? called : cands)
      .slice()
      .sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
    return pick[0].id;
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
      const h4Text = dl.getAttribute('data-nomor-morbis') || h4.textContent || '';
      const nomorMatch = h4Text.match(/(\d+)$/);
      if (!nomorMatch) continue;
      const nomor = nomorMatch[1];
      const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
      const nama = dd3
        ? Array.from(dd3.childNodes)
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent || '')
            .join('')
            .replace(/\s+/g, ' ')
            .trim()
        : '';
      const kode =
        dd3 && /[A-Za-z]/.test(h4Text.split('-')[0] || '')
          ? h4Text.split('-')[0].toUpperCase()
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
    const GAP_MS = 250;
    const CARD_MS = 600;
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
        updateDebugState({
          ttsMode: null,
          ttsEngine: null,
          ttsLastError: null,
          ttsAttempts: 0,
          lastTtsStart: null,
          lastTtsEnd: null,
        });
        queue.push({ kind: 'bell' }, { kind: 'voice', text: 'Tes suara antrian farmasi.' });
        next();
        window.setTimeout(() => setStatus('ok'), 6e3);
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
    let renumberCache = /* @__PURE__ */ new Map();
    const nextToCallByJenis = { tunggal: '', racikan: '' };
    async function updateRenumber(rows) {
      const { state: st } = await issuePending(
        rows.map((r) => ({
          id: String(r.ID ?? ''),
          jenis: r.JENIS ?? null,
          waktu: r.WAKTU ?? null,
          // display tahu kapan baris selesai (WAKTU_PENYERAHAN) — skip utk next-to-call
          selesai:
            (r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '') || false,
        })),
      );
      const next2 = /* @__PURE__ */ new Map();
      for (const r of rows) {
        const id = String(r.ID ?? '');
        const t = getTicket(st, id);
        if (t) next2.set(id, t.code);
      }
      renumberCache = next2;
      for (const j of ['tunggal', 'racikan']) {
        nextToCallByJenis[j] = '';
        const isR = j === 'racikan';
        const min = rows
          .filter(
            (r) =>
              r &&
              String(r.ID ?? '') !== '' &&
              (r.WAKTU_PENYERAHAN == null || String(r.WAKTU_PENYERAHAN).trim() === '') &&
              (isR
                ? /racik/i.test(String(r.JENIS ?? ''))
                : !/racik/i.test(String(r.JENIS ?? ''))) &&
              next2.get(String(r.ID ?? '')),
          )
          .map((r) => ({
            id: String(r.ID ?? ''),
            num: getTicket(st, String(r.ID ?? ''))?.num ?? Infinity,
          }))
          .sort((a, b) => a.num - b.num)[0];
        if (min) nextToCallByJenis[j] = next2.get(min.id) ?? '';
      }
    }
    function kodeTampil(jenis, num) {
      if (!num || num === '0') return num;
      if (/^[TR]-\d+$/.test(num)) return num;
      const id = resolveCalledId(morbisStates(), num, jenis);
      if (id) {
        const c = renumberCache.get(id);
        if (c) return c;
      }
      return nextToCallByJenis[jenis] || num;
    }
    function morbisStates() {
      return lastRows.map((r) => toRowState(r)).filter((r) => r.id);
    }
    async function fetchCallData() {
      const res = await fetch(LIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=check_antrian',
        cache: 'no-store',
        // harus segar (nama pasien recall)
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
          cache: 'no-store',
          // jangan pernah pakai cache browser: current-number harus segar
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
      const id = resolveCalledId(morbisStates(), morbisNum, jenis);
      if (!id) return '';
      const row = lastRows.find((r) => String(r.ID ?? '') === id);
      return row?.NAMA_PASIEN || '';
    }
    function readPanelNumber(sel) {
      const el = document.querySelector(sel);
      if (!el) return '';
      const m = (el.querySelector?.('.antrian-nomor')?.textContent || '').trim();
      return /^(?:[TR]-)?\d+$/.test(m) ? m : '';
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
        const num =
          ((dl.getAttribute('data-nomor-morbis') || h4?.textContent || '').match(/(\d+)$/) ||
            [])[1] || '';
        const dd3 = dl.querySelector('dd.col-3, dd.col-md-3');
        const d = (dd3?.textContent || '').replace(/\s+/g, ' ').trim();
        const matchNum = targets.some((n) => num && n === num);
        const matchName = names.some((nm) => nm && d === nm);
        dl.style.background = matchNum || matchName ? '#fde68a' : '';
      }
    }
    function patchListContentAntrian() {
      const lc = document.querySelector('#list-content');
      if (!lc) return;
      let unresolved = 0;
      for (const dl of lc.querySelectorAll('dl')) {
        const h4 = dl.querySelector('h4');
        if (!h4) continue;
        if (!dl.hasAttribute('data-nomor-morbis')) {
          dl.setAttribute('data-nomor-morbis', (h4.textContent || '').trim());
        }
        if (dl.hasAttribute('data-public-code')) continue;
        const rm =
          ((dl.querySelector('dd.col-3 p, dd.col-md-3 p')?.textContent || '').match(
            /RM\s*:\s*(\d+)/i,
          ) || [])[1] || '';
        const isR = dl.classList.contains('racikan');
        const row = lastRows.find(
          (r) =>
            String(r.ID_PASIEN ?? '') === rm &&
            (isR ? /racik/i.test(String(r.JENIS ?? '')) : !/racik/i.test(String(r.JENIS ?? ''))),
        );
        const id = row ? String(row.ID ?? '') : '';
        const code = id ? renumberCache.get(id) || '' : '';
        if (code) {
          h4.textContent = code;
          dl.setAttribute('data-public-code', code);
          dl.setAttribute('data-morbis-id', id);
        } else if (rm) {
          h4.textContent = '\u2014';
          dl.setAttribute('data-public-code', '\u2014');
          unresolved++;
        }
      }
      if (unresolved > 0) {
        console.warn(
          '[AFD] tabel antrian: ' +
            unresolved +
            ' baris tak bisa di-resolve ke publicCode (tampil \u2014)',
        );
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
    function processLocalRecall() {
      try {
        const raw = localStorage.getItem('ext-afd-recall');
        if (!raw) return;
        const sig = JSON.parse(raw);
        const key = `${sig.jenis}:${sig.nomor}`;
        const segar = Date.now() - (sig.ts || 0) < 8e3;
        if (segar && key !== lastLocalRecallKey) {
          lastLocalRecallKey = key;
          localStorage.removeItem('ext-afd-recall');
          const jenis = sig.jenis === 'racikan' ? 'racikan' : 'tunggal';
          const kode = kodeTampil(jenis, sig.nomor);
          const nama =
            currentPatientName(jenis, sig.nomor) ||
            (lastCalled && lastCalled.jenis === jenis ? lastCalled.namaPasien : '');
          updateDebugState({ lastAnnouncement: `recall:${jenis}:${kode}` });
          announce({
            id: `local-recall-${key}`,
            nomor: kode,
            kode: '',
            namaPasien: nama,
            unit: '',
            jenis,
            rm: '',
          });
        }
      } catch {}
    }
    async function refreshCardNumber() {
      setStatus('loading');
      processLocalRecall();
      try {
        const [{ current: cur }, rows] = await Promise.all([fetchCurrentNumber(), fetchCallData()]);
        lastRows = rows;
        await updateRenumber(rows);
        patchListContentAntrian();
        updateDebugState({ lastPoll: Date.now(), lastDataCount: rows.length });
        const g1 = cur.get('1')?.trim();
        const g2 = cur.get('2')?.trim();
        currentByJenis.tunggal = g1 && g1 !== '0' ? g1 : '';
        currentByJenis.racikan = g2 && g2 !== '0' ? g2 : '';
        let justReset = false;
        if (isReset(cur, prevCurrent)) {
          clearCallState();
          justReset = true;
          void resetQueueAfterAntrian();
        }
        prevCurrent.clear();
        for (const [c, v] of cur) prevCurrent.set(c, v);
        updateDebugState({
          currentByJenis: { ...currentByJenis },
          lastNormalKey,
        });
        const panelT = readPanelNumber(PANGGILAN_SEL);
        const panelR = readPanelNumber(SIAP_SEL);
        const recallT =
          !justReset &&
          currentByJenis.tunggal !== '' &&
          panelT &&
          panelT !== '0' &&
          panelT !== currentByJenis.tunggal &&
          panelT !== writtenByUs.tunggal;
        const recallR =
          !justReset &&
          currentByJenis.racikan !== '' &&
          panelR &&
          panelR !== '0' &&
          panelR !== currentByJenis.racikan &&
          panelR !== writtenByUs.racikan;
        if (recallT || recallR) {
          const jenis = recallT ? 'tunggal' : 'racikan';
          const panelNum = recallT ? panelT : panelR;
          const kode = kodeTampil(jenis, panelNum);
          const key = jenis + ':' + kode;
          if (key !== lastNativeCall) {
            lastNativeCall = key;
            const nama =
              currentPatientName(jenis, panelNum) ||
              (lastCalled && lastCalled.jenis === jenis ? lastCalled.namaPasien : '');
            announce({
              id: 'recall:' + key,
              nomor: kode,
              kode: '',
              namaPasien: nama,
              unit: '',
              jenis,
              rm: '',
            });
            updateDebugState({ lastAnnouncement: 'recall:' + key });
          }
          setStatus('ok');
          return;
        }
        for (const j of ['tunggal', 'racikan']) {
          const cur2 = currentByJenis[j];
          const prev = prevByJenis[j];
          if (cur2 && cur2 !== '0' && cur2 !== prev) {
            const kode = kodeTampil(j, cur2);
            const key = j + ':' + kode;
            if (key !== lastNormalKey) {
              lastNormalKey = key;
              lastNativeCall = null;
              const nama = currentPatientName(j, cur2);
              announce({
                id: key,
                nomor: kode,
                kode: '',
                namaPasien: nama,
                unit: '',
                jenis: j,
                rm: '',
              });
              updateDebugState({ lastAnnouncement: key });
            }
          }
          prevByJenis[j] = cur2 || '';
        }
        {
          renderCardPanel();
          highlightCurrents();
          writtenByUs.tunggal =
            kodeTampil('tunggal', currentByJenis.tunggal) || nextToCallByJenis.tunggal;
          writtenByUs.racikan =
            kodeTampil('racikan', currentByJenis.racikan) || nextToCallByJenis.racikan;
          updateDebugState({ writtenByUs: { ...writtenByUs } });
          onWeWrote();
          setStatus('ok');
        }
      } catch {
        setStatus('error');
      }
    }
    function renderDisplay(view, call) {
      renderCardPanel(view);
      if (call) {
        lastByJenis[call.jenis] = call;
        seedLastByJenis(view);
        const kodeT = kodeTampil('tunggal', currentByJenis.tunggal);
        const kodeR = kodeTampil('racikan', currentByJenis.racikan);
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
            kodeT,
            currentPatientName('tunggal', currentByJenis.tunggal),
          );
        const bawah = bawahRecall ? null : document.querySelector(SIAP_SEL);
        if (bawah)
          bawah.innerHTML = cardSection(
            'Obat Racikan',
            kodeR,
            currentPatientName('racikan', currentByJenis.racikan),
          );
        highlightCurrents();
        wireRowRecall();
        writtenByUs.tunggal = kodeT;
        writtenByUs.racikan = kodeR;
      }
      onWeWrote();
    }
    function renderCardPanel(_view) {
      const atas = document.querySelector(PANGGILAN_SEL);
      const bawah = document.querySelector(SIAP_SEL);
      const curT = currentByJenis.tunggal;
      const curR = currentByJenis.racikan;
      const t = kodeTampil('tunggal', curT) || nextToCallByJenis.tunggal;
      const r = kodeTampil('racikan', curR) || nextToCallByJenis.racikan;
      if (atas)
        atas.innerHTML = cardSection(
          'Obat Tunggal',
          t,
          curT ? currentPatientName('tunggal', curT) : '',
        );
      if (bawah)
        bawah.innerHTML = cardSection(
          'Obat Racikan',
          r,
          curR ? currentPatientName('racikan', curR) : '',
        );
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
    let lastLocalRecallKey = '';
    let lastRows = [];
    let lastNormalKey = '';
    let lastCalled = null;
    function clearCallState() {
      lastCalled = null;
      lastNativeCall = null;
      lastLocalRecallKey = '';
      announcedSig = '';
      lastNormalKey = '';
      prevByJenis.tunggal = '';
      prevByJenis.racikan = '';
      prevCurrent.clear();
      updateDebugState({
        lastCalledPatient: null,
        lastCalledNumber: null,
        lastRealtimeEvent: 'reset',
      });
    }
    let lastQueueResetAt = 0;
    function resetQueueAfterAntrian() {
      const now = Date.now();
      if (now - lastQueueResetAt < 3e3) return;
      lastQueueResetAt = now;
      void reset()
        .then(() => {
          renumberCache.clear();
          nextToCallByJenis.tunggal = '';
          nextToCallByJenis.racikan = '';
          updateDebugState({ lastRealtimeEvent: 'reset:queue' });
        })
        .catch((err) => {
          console.warn('[FarmasiDisplay] reset QueueManager gagal:', err);
        });
    }
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
      void playVoice(item.text).then(finish, finish);
    }
    let voicesCache = [];
    function ensureVoices() {
      if (voicesCache.length > 0) return Promise.resolve(voicesCache);
      return new Promise((resolve) => {
        const got = () => {
          const vs = synth.getVoices();
          if (vs.length > 0) {
            voicesCache = vs;
            resolve(vs);
            return true;
          }
          return false;
        };
        if (got()) return;
        let tries = 0;
        const timer = window.setInterval(() => {
          tries += 1;
          if (got() || tries >= 50) {
            window.clearInterval(timer);
            if (!voicesCache.length) {
              voicesCache = synth.getVoices();
              resolve(voicesCache);
            }
          }
        }, 100);
        synth.addEventListener('voiceschanged', () => {
          if (!voicesCache.length) got();
        });
      });
    }
    function pickVoice(prefer) {
      const vs = voicesCache;
      const low = (s) => (s || '').toLowerCase();
      if (prefer === 'id-local')
        return (
          vs.find((v) => low(v.lang).startsWith('id') && v.localService) ??
          vs.find((v) => /indonesia/i.test(v.name)) ??
          null
        );
      if (prefer === 'id-any') return vs.find((v) => low(v.lang).startsWith('id')) ?? null;
      if (prefer === 'any-local') return vs.find((v) => v.localService) ?? null;
      return vs[0] ?? null;
    }
    function speakSynth(text, voice, timeoutMs = 2e4) {
      return new Promise((resolve) => {
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = (voice && voice.lang) || 'id-ID';
          if (voice) u.voice = voice;
          u.rate = 0.8;
          u.volume = 1;
          let started2 = false;
          let done = false;
          const t0 = Date.now();
          const fin = (ok) => {
            if (done) return;
            done = true;
            window.clearTimeout(timer);
            updateDebugState({ lastTtsEnd: Date.now() });
            console.info(
              '[AFD] [TTS] speakSynth ' +
                (ok ? 'SUCCESS' : 'FAIL') +
                ' voice=' +
                (voice
                  ? voice.name + '/' + voice.lang + (voice.localService ? '/local' : '/net')
                  : 'null') +
                ' durasi=' +
                (Date.now() - t0) +
                'ms',
            );
            resolve(ok);
          };
          u.onstart = () => {
            started2 = true;
            updateDebugState({ lastTtsStart: Date.now() });
            console.info('[AFD] [TTS] onstart voice=' + (voice ? voice.name : 'null'));
          };
          u.onend = () => fin(true);
          u.onerror = (e) => {
            console.info('[AFD] [TTS] onerror started=' + started2 + ' err=' + (e.error || ''));
            fin(started2);
          };
          RealSpeak.call(synth, u);
          const timer = window.setTimeout(() => {
            console.info('[AFD] [TTS] timeout ' + timeoutMs + 'ms started=' + started2);
            fin(started2);
          }, timeoutMs);
        } catch (e) {
          console.info('[AFD] [TTS] speakSynth throw', e);
          resolve(false);
        }
      });
    }
    function speakGoogleMp3(text, timeoutMs = 15e3) {
      const url =
        'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=' +
        encodeURIComponent(text);
      return new Promise((resolve) => {
        let settled = false;
        let objUrl = null;
        let audio = null;
        const fin = (ok) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          if (audio) {
            audio.onended = null;
            audio.onerror = null;
            audio.oncanplay = null;
          }
          if (objUrl) URL.revokeObjectURL(objUrl);
          updateDebugState({ lastTtsEnd: Date.now() });
          console.info('[AFD] [TTS] google-mp3 ' + (ok ? 'SUCCESS' : 'FAIL'));
          resolve(ok);
        };
        const timer = window.setTimeout(() => fin(false), timeoutMs);
        const playAudio = (src) => {
          audio = new Audio(src);
          audio.onended = () => fin(true);
          audio.onerror = () => fin(false);
          audio.oncanplay = () => {
            void audio.play().catch(() => fin(false));
          };
          audio.load();
        };
        fetch(url, { mode: 'cors' })
          .then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.blob();
          })
          .then((blob) => {
            if (!blob || blob.size === 0) throw new Error('empty blob');
            objUrl = URL.createObjectURL(blob);
            playAudio(objUrl);
          })
          .catch(() => playAudio(url));
      });
    }
    function speakLocalService(text, timeoutMs = 1e4) {
      return new Promise((resolve) => {
        let settled = false;
        let objUrl = null;
        let audio = null;
        const fin = (ok, reason) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timer);
          if (audio) {
            audio.onended = null;
            audio.onerror = null;
            audio.oncanplay = null;
            audio.onplay = null;
          }
          if (objUrl) URL.revokeObjectURL(objUrl);
          updateDebugState({ lastTtsEnd: Date.now(), ttsTrace: [...ttsTrace, 'end:' + reason] });
          console.info('[AFD] [TTS] local-service ' + (ok ? 'SUCCESS' : 'FAIL ' + reason));
          resolve({ ok, reason });
        };
        const ttsTrace = ['start'];
        const timer = window.setTimeout(() => fin(false, 'timeout'), timeoutMs);
        const playAudio = (src) => {
          ttsTrace.push('audio-new');
          audio = new Audio(src);
          audio.onplay = () => {
            ttsTrace.push('play');
            updateDebugState({ lastTtsStart: Date.now(), ttsTrace: [...ttsTrace] });
          };
          audio.onended = () => fin(true, 'ended');
          audio.onerror = () =>
            fin(false, 'audio-error ' + (audio && audio.error ? audio.error.code : '?'));
          audio.oncanplay = () => {
            ttsTrace.push('canplay');
            audio.play().catch((e) => fin(false, 'play-rejected ' + String(e).slice(0, 60)));
          };
          audio.load();
        };
        try {
          const reqId = 'tts-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
          const onResult = (event) => {
            if (event.source !== window) return;
            const d = event.data;
            if (
              !d ||
              d.source !== 'MORBIS-FARMASI-BRIDGE' ||
              d.type !== 'TTS_RESULT' ||
              d.id !== reqId
            )
              return;
            window.removeEventListener('message', onResult);
            if (!d.ok) {
              fin(false, d.reason || 'message-error no-response');
              return;
            }
            if (!d.data || d.data.length === 0) {
              fin(false, 'blob-error empty-data');
              return;
            }
            ttsTrace.push('blob:' + d.data.length);
            const bytes = new Uint8Array(d.data);
            const blob = new Blob([bytes], { type: d.mime || 'audio/mpeg' });
            objUrl = URL.createObjectURL(blob);
            playAudio(objUrl);
          };
          window.addEventListener('message', onResult);
          window.postMessage(
            { source: 'MORBIS-FARMASI', type: 'TTS_REQUEST', id: reqId, text },
            '*',
          );
        } catch (e) {
          fin(false, 'message-error postmessage ' + String(e).slice(0, 40));
        }
      });
    }
    async function playVoice(text) {
      updateDebugState({ ttsAttempts: 0, ttsLastError: null, ttsEngine: null });
      try {
        synth.cancel();
      } catch {}
      await ensureVoices();
      console.info('[AFD] [TTS] voices=' + voicesCache.map((v) => v.name).join(', '));
      const svc = await speakLocalService(text);
      if (svc.ok) {
        updateDebugState({ ttsMode: 'local', ttsEngine: 'local-service:8765' });
        return;
      }
      const ttsFailDetail = 'local-service: ' + svc.reason;
      updateDebugState({ ttsLastError: ttsFailDetail });
      const idLocal = pickVoice('id-local');
      if (idLocal) {
        updateDebugState({ ttsMode: 'speech', ttsEngine: 'speech:' + idLocal.name });
        const ok = await speakSynth(text, idLocal);
        if (ok) return;
      }
      const idAny = pickVoice('id-any');
      if (idAny && idAny !== idLocal) {
        updateDebugState({ ttsMode: 'speech', ttsEngine: 'speech:' + idAny.name, ttsAttempts: 1 });
        const ok = await speakSynth(text, idAny);
        if (ok) return;
      }
      const anyLocal = pickVoice('any-local');
      if (anyLocal && anyLocal !== idLocal && anyLocal !== idAny) {
        updateDebugState({ ttsMode: 'local', ttsEngine: 'local:' + anyLocal.name, ttsAttempts: 2 });
        const ok = await speakSynth(text, anyLocal);
        if (ok) return;
      }
      updateDebugState({ ttsMode: 'mp3', ttsEngine: 'google-translate', ttsAttempts: 3 });
      const okMp3 = await speakGoogleMp3(text);
      if (okMp3) return;
      updateDebugState({
        ttsMode: 'error',
        ttsEngine: null,
        ttsLastError:
          'all engines failed \u2014 layer0=' +
          ttsFailDetail +
          ' (speech id-local/id-any/any-local, google-mp3)',
        ttsAttempts: 4,
      });
      updateDebugState({ lastTtsEnd: Date.now() });
      console.error('[AFD] [TTS] semua engine gagal utk:', text.slice(0, 40));
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
      const two = (x) => {
        if (x < 12) return N2W_SATUAN[x];
        if (x < 20) return N2W_SATUAN[x - 10] + ' belas';
        if (x < 100)
          return x % 10 === 0
            ? N2W_SATUAN[x / 10] + ' puluh'
            : N2W_SATUAN[Math.trunc(x / 10)] + ' puluh ' + N2W_SATUAN[x % 10];
        return '';
      };
      const nolPrefix = (digits) =>
        digits
          .split('')
          .map((d) => N2W_SATUAN[Number(d)])
          .join(' ');
      const raw = String(n);
      const m = raw.match(/^([TR])-(\d+)$/);
      if (m) {
        const kata = m[2].length > 1 && m[2][0] === '0' ? nolPrefix(m[2]) : two(Number(m[2]));
        return m[1] + ' ' + kata;
      }
      const clean = raw.replace(/^[TR]-/, '');
      const num = Math.abs(Math.trunc(Number(clean)));
      if (!Number.isFinite(num)) return String(clean);
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
      lastCalled = {
        id: String(row.id || ''),
        jenis: row.jenis,
        nomor: String(row.nomor),
        namaPasien: String(row.namaPasien || ''),
      };
      updateDebugState({
        lastCalledPatient: lastCalled.namaPasien,
        lastCalledNumber: lastCalled.nomor,
        lastRealtimeEvent: 'announce:' + row.id,
      });
      const kalimat =
        'Nomor antrian ' +
        numberToWords(row.nomor) +
        (row.namaPasien ? ', atas nama ' + titleCase(String(row.namaPasien)) : '') +
        ', silakan menuju farmasi.';
      for (let i = queue.length - 1; i >= 0; i--) {
        const qi = queue[i];
        if (qi.kind === 'voice' && qi.repeat) queue.splice(i, 1);
      }
      queue.push(
        { kind: 'bell' },
        { kind: 'voice', text: kalimat },
        { kind: 'voice', text: kalimat, repeat: true },
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
            window.setTimeout(() => {
              if (done) return;
              try {
                if (a.state === 'running') {
                  a.close().catch(() => {});
                  finish();
                }
              } catch {}
            }, 800);
          } else {
            finish();
          }
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
      ttsMode: null,
      ttsEngine: null,
      ttsLastError: null,
      ttsAttempts: 0,
      lastCalledPatient: null,
      lastCalledNumber: null,
      lastTtsStart: null,
      lastTtsEnd: null,
      lastRealtimeEvent: null,
      ttsTrace: null,
    };
    function updateDebugState(patch) {
      if (!debugEnabled) return;
      Object.assign(debugState, patch);
      window.__ANTRIAN_FARMASI_DEBUG__ = { ...debugState };
      document.documentElement.setAttribute('data-afd-debug', JSON.stringify(debugState));
      document.documentElement.setAttribute(
        'data-afd-world',
        typeof chrome !== 'undefined' && !!chrome.runtime ? 'isolated-has-cr' : 'no-cr',
      );
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
        await updateRenumber(rows);
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
            nomor: kodeTampil(mPat?.jenis || 'tunggal', num),
            // kode renumber (kertas)
            kode: (pr && pr.kode) || mPat?.kode || '',
            namaPasien: (pr && pr.nama) || mPat?.namaPasien || '',
            unit: mPat?.unit || '',
            jenis: mPat?.jenis || 'tunggal',
            rm: mPat?.rm || '',
          };
          if (!baselineSet) {
            baselineSet = true;
            currentCall = call;
            renderDisplay(view, currentCall);
          } else if (sig !== announcedSig && isNewCurrent(cur)) {
            if (isReset(cur, prevCurrent)) {
              clearCallState();
              resetQueueAfterAntrian();
              currentCall = call;
              renderDisplay(view, currentCall);
            } else {
              announcedSig = sig;
              currentCall = call;
              renderDisplay(view, currentCall);
              maybeAnnounce(view, currentCall);
            }
          } else {
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
      const states = rows.map((r) => toRowState(r)).filter((r) => r.id);
      const id =
        resolveCalledId(states, nomor, 'tunggal') ?? resolveCalledId(states, nomor, 'racikan');
      const hit = id ? rows.find((r) => String(r.ID ?? '') === id) : null;
      return hit ? toViewRow(hit) : null;
    }
    function maybeAnnounce(view, call) {
      if (!voiceEnabled) return;
      const key = call.jenis + ':' + call.nomor;
      if (key === lastNormalKey) {
        console.info('[AFD] duplicate ignored ' + key);
        return;
      }
      lastNormalKey = key;
      announcedSig = call.id;
      updateDebugState({ lastAnnouncement: key });
      console.info('[AFD] ANNOUNCE ' + key);
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
    function hideNativeSwal() {
      const s = document.createElement('style');
      s.id = 'ext-afd-hide-swal';
      s.textContent =
        '.swal2-container, .swal2-backdrop { display: none !important; visibility: hidden !important; }';
      (document.head || document.documentElement).appendChild(s);
      const mo = new MutationObserver(() => {
        document.querySelectorAll('.swal2-container').forEach((el) => {
          el.style.display = 'none';
        });
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
    function startWithRole() {
      if (started) return;
      started = true;
      updateDebugState({ started: true });
      hideNativeSwal();
      ensureStatusBadge();
      ensureToolbar();
      setStatus('loading');
      const lc = document.querySelector('#list-content');
      if (lc && !lc.hasAttribute('data-ext-afd-patch')) {
        lc.setAttribute('data-ext-afd-patch', '1');
        new MutationObserver(() => {
          patchListContentAntrian();
        }).observe(lc, { childList: true, subtree: true });
      }
      patchListContentAntrian();
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
