'use strict';
var __morbis_feature = (() => {
  function ht(a, u, g) {
    if (u.type === 'we-wrote')
      return {
        next: { ...a, nativeSig: u.signal, staleStreak: 0, ourSig: u.signal },
        startPolling: !1,
        stopPolling: !1,
      };
    let S = u.signal;
    if (S !== a.nativeSig) {
      let d = S !== a.ourSig;
      return {
        next: {
          ...a,
          nativeActive: d ? !0 : a.nativeActive,
          nativeSig: S,
          staleStreak: 0,
          ourSig: d ? '' : a.ourSig,
        },
        startPolling: !a.nativeActive && !d,
        stopPolling: a.nativeActive === !1 && d,
      };
    }
    let w = a.nativeActive ? a.staleStreak + 1 : a.staleStreak;
    return a.nativeActive && w >= g.staleMax
      ? { next: { ...a, nativeActive: !1, staleStreak: 0 }, startPolling: !0, stopPolling: !1 }
      : { next: { ...a, staleStreak: w }, startPolling: !1, stopPolling: !1 };
  }
  var he = 'http://dev.rsudkotajambi.id/rs',
    Ee = 'ext-farmasi-app-base';
  var ve = ['dev.rsudkotajambi.id', '103.147.236.138', 'localhost', '127.0.0.1'],
    Te = '.rsudkotajambi.id';
  function Re(a) {
    try {
      let u = new URL(a);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return !1;
      let g = u.hostname.toLowerCase();
      return ve.includes(g) ? !0 : g.endsWith(Te);
    } catch {
      return !1;
    }
  }
  function xe() {
    try {
      let a = localStorage.getItem(Ee);
      if (a && Re(a)) return a.replace(/\/+$/, '');
    } catch {}
    return he;
  }
  function Vt(a, u = 'id') {
    return xe() + '/api/tts?text=' + encodeURIComponent(a) + '&lang=' + encodeURIComponent(u);
  }
  var Pe = 'MORBIS-FARMASI',
    Ce = 'MORBIS-FARMASI-BRIDGE';
  function Et(a, u) {
    let g = 'q-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
    return new Promise((S, w) => {
      let d = (y) => {
        if (y.source !== window) return;
        let v = y.data;
        if (!(!v || v.source !== Ce || v.type !== a || v.reqId !== g)) {
          if ((window.removeEventListener('message', d), clearTimeout(b), !v.ok))
            return w(new Error(v.error || a + ' gagal'));
          S(v);
        }
      };
      window.addEventListener('message', d);
      let b = window.setTimeout(() => {
        (window.removeEventListener('message', d),
          w(new Error('farmasiQueueBridge: no reply (extension reloaded?)')));
      }, 4e3);
      window.postMessage({ source: Pe, type: a, reqId: g, ...u }, '*');
    });
  }
  async function Kt() {
    return Et('QUEUE_GET_STATE', {}).then((a) => a.state);
  }
  async function Gt(a) {
    await Et('QUEUE_MARK_CALLED', { id: a });
  }
  async function vt() {
    return Et('QUEUE_RESET', {}).then((a) => a.state);
  }
  function it(a, u) {
    return a.tickets[u] ?? null;
  }
  function Tt(a) {
    let u = String(a.STATUS_PANGGIL ?? '');
    return {
      id: String(a.ID ?? ''),
      nomor: String(a.NOMOR ?? ''),
      status: String(a.STATUS ?? ''),
      statusPanggil: u,
      jenis: /racik/i.test(String(a.JENIS ?? '')) ? 'racikan' : 'tunggal',
      nama: String(a.NAMA_PASIEN ?? ''),
      diserahkan: a.WAKTU_PENYERAHAN != null && String(a.WAKTU_PENYERAHAN).trim() !== '',
      called: u === '1',
    };
  }
  function X(a, u, g) {
    let S = a.filter((b) => b.nomor === u && b.jenis === g && b.status !== '0');
    if (S.length === 0) return null;
    let w = S.filter((b) => b.called);
    return (w.length > 0 ? w : S)
      .slice()
      .sort((b, y) => Number(b.id) - Number(y.id) || b.id.localeCompare(y.id))[0].id;
  }
  var Me = /current-number[^>]*data-counter="([^"]*)"[^>]*>([\s\S]*?)<\/span>/g,
    Le = /<tr[^>]*data-nomor="([^"]*)"[^>]*>([\s\S]*?)<\/tr>/g;
  function Wt(a) {
    let u = new Map();
    if (!a) return u;
    for (let g of a.querySelectorAll('dl')) {
      let S = g.querySelector('h4');
      if (!S) continue;
      let w = g.getAttribute('data-nomor-morbis') || S.textContent || '',
        d = w.match(/(\d+)$/);
      if (!d) continue;
      let b = d[1],
        y = g.querySelector('dd.col-3, dd.col-md-3'),
        v = y
          ? Array.from(y.childNodes)
              .filter((T) => T.nodeType === 3)
              .map((T) => T.textContent || '')
              .join('')
              .replace(/\s+/g, ' ')
              .trim()
          : '',
        x = y && /[A-Za-z]/.test(w.split('-')[0] || '') ? w.split('-')[0].toUpperCase() : '';
      b && u.set(b, { nama: v, kode: x });
    }
    return u;
  }
  function Jt(a) {
    let u = new Map();
    for (let g of a.matchAll(Me)) {
      let S = g[1].trim(),
        w = g[2].replace(/\s+/g, ' ').trim();
      S && u.set(S, w);
    }
    return u;
  }
  function $t(a) {
    let u = new Map();
    for (let g of a.matchAll(Le)) {
      let S = g[1].trim();
      if (!S) continue;
      let w = [...g[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((y) =>
          y[1]
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim(),
        ),
        d = w[0] && /[A-Za-z]/.test(w[0]) ? w[0].split('-')[0] : '',
        b =
          w.find((y) => /[A-Za-z]{2,}/.test(y) && !/^[A-Z]{1,3}-\d+$/.test(y)) ||
          w[w.length - 2] ||
          '';
      (b || d) && u.set(S, { nama: b, kode: d });
    }
    return u;
  }
  function Yt(a) {
    let u = ['1', '2'];
    for (let g of u) {
      let S = a.get(g);
      if (S && S !== '0') return S;
    }
    for (let g of a.values()) if (g && g !== '0') return g;
    return '';
  }
  function Rt(a, u) {
    if (u.size === 0) return !1;
    for (let [g, S] of a) {
      let w = u.get(g);
      if (w === void 0) continue;
      let d = Number(w),
        b = Number(S);
      if (Number.isFinite(d) && Number.isFinite(b) && b < d && b <= 1) return !0;
    }
    return !1;
  }
  (function () {
    let a = '/public/antrian-farmasi-v2/list-antrian-v2',
      u = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return this.id === 'unine' ? ((this.muted = !0), Promise.resolve()) : u.call(this);
    };
    let g = [500, 1500, 3e3, 6e3],
      S = 0,
      w = 1e3,
      d = null,
      b = null;
    function y() {
      if (b || !document.body) return;
      let t = document.querySelector('.side'),
        e = document.createElement('div');
      ((e.id = 'ext-afd-controls'),
        (e.style.cssText =
          'display:flex;flex-direction:column;gap:10px;margin:12px 4px 4px;padding:12px;background:#fff;border:1px solid #0f5132;border-radius:16px;box-shadow:0 2px 10px rgba(0,0,0,.08);'),
        (t ?? document.body).appendChild(e),
        (b = e));
    }
    function v() {
      if (d) return;
      (y(),
        (d = document.createElement('div')),
        (d.id = 'ext-afd-status'),
        (d.style.cssText =
          'padding:5px 12px;border-radius:999px;align-self:flex-start;font:700 12px/1.3 "Inter",system-ui,sans-serif;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,.15);color:#fff;'),
        d.setAttribute('data-state', 'init'));
      let t = d,
        e = () => {
          document.body && (y(), t && !t.isConnected && b?.appendChild(t));
        };
      (document.addEventListener('DOMContentLoaded', e), (wt = window.setInterval(e, 300)), e());
    }
    function x(t) {
      if ((v(), !d)) return;
      d.setAttribute('data-state', t);
      let e =
        '<span style="width:9px;height:9px;border-radius:999px;background:currentColor;display:inline-block;flex-shrink:0;"></span>';
      t === 'loading'
        ? ((d.style.background = '#d97706'), (d.innerHTML = e + 'MEMPERBARUI\u2026'))
        : t === 'slow'
          ? ((d.style.background = '#b45309'),
            (d.innerHTML = e + 'MEMPERBARUI (JARINGAN LAMBAT)\u2026'))
          : t === 'ok'
            ? ((d.style.background = '#0f5132'),
              (d.innerHTML =
                e + 'SIAP \xB7 ' + new Date().toLocaleTimeString('id-ID', { hour12: !1 })))
            : ((d.style.background = '#b91c1c'), (d.innerHTML = e + 'GAGAL'));
    }
    let T = null;
    function Xt() {
      if (T) return;
      (y(),
        (T = document.createElement('div')),
        (T.id = 'ext-afd-toolbar'),
        (T.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;'),
        (T.innerHTML =
          '<button id="ext-afd-testsound" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#0f5132;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">\u{1F50A} Tes Suara</button><button id="ext-afd-fs" style="flex:1;min-width:120px;padding:8px 12px;border:none;border-radius:12px;background:#155e75;color:#fff;font:700 12px/1.3 Inter,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2);">\u26F6 Full Screen</button>'));
      let t = T,
        e = () => {
          !t || t.isConnected || (y(), b?.appendChild(t));
        };
      (document.body ? e() : document.addEventListener('DOMContentLoaded', e),
        (St = window.setInterval(e, 300)),
        T.querySelector('#ext-afd-testsound')?.addEventListener('click', () => {
          (W(),
            x('loading'),
            m({
              ttsMode: null,
              ttsEngine: null,
              ttsLastError: null,
              ttsAttempts: 0,
              lastTtsStart: null,
              lastTtsEnd: null,
            }),
            q.push({ kind: 'bell' }, { kind: 'voice', text: 'Tes suara antrian farmasi.' }),
            dt(),
            window.setTimeout(() => x('ok'), 6e3));
        }),
        T.querySelector('#ext-afd-fs')?.addEventListener('click', () => {
          let n = document,
            r = document.documentElement;
          document.fullscreenElement || n.webkitFullscreenElement
            ? document.exitFullscreen
              ? document.exitFullscreen()
              : document.webkitExitFullscreen && document.webkitExitFullscreen()
            : r.requestFullscreen
              ? r.requestFullscreen()
              : r.webkitRequestFullscreen && r.webkitRequestFullscreen();
        }));
      try {
        let n = new BroadcastChannel('morbis-antrian-display');
        n.onmessage = (r) => {
          if (r.data?.type === 'toggleFullscreen') {
            let o = document,
              i = document.documentElement;
            document.fullscreenElement || o.webkitFullscreenElement
              ? document.exitFullscreen
                ? document.exitFullscreen()
                : document.webkitExitFullscreen && document.webkitExitFullscreen()
              : i.requestFullscreen
                ? i.requestFullscreen()
                : i.webkitRequestFullscreen && i.webkitRequestFullscreen();
          }
        };
      } catch {}
    }
    let zt = 1500,
      Zt = 2,
      z = new Map(),
      Z = new Map(),
      D = { tunggal: '', racikan: '' };
    async function xt(t) {
      let e = await Kt(),
        n = new Map();
      for (let r of t) {
        let o = String(r.ID ?? ''),
          i = it(e, o);
        i && n.set(o, i.code);
      }
      z = n;
      for (let r of t) {
        let o = String(r.ID ?? ''),
          i = it(e, o);
        if (!i) continue;
        let s = String(r.NOMOR ?? '').trim();
        if (!s) continue;
        let c = /racik/i.test(String(r.JENIS ?? '')) ? 'racikan' : 'tunggal';
        Z.set(`${c}:${s}`, { code: i.code, nama: String(r.NAMA_PASIEN ?? '') });
      }
    }
    function P(t, e) {
      if (!e || e === '0' || /^[TR]-\d+$/.test(e)) return e;
      let n = X(Pt(), e, t);
      if (n) {
        let o = z.get(n);
        if (o) return o;
      }
      let r = Z.get(`${t}:${e}`);
      return r?.code ? r.code : D[t] || e;
    }
    function Pt() {
      return Q.map((t) => Tt(t)).filter((t) => t.id);
    }
    async function Ct() {
      let t = await fetch(a, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=check_antrian',
        cache: 'no-store',
      });
      if (!t.ok) throw new Error('HTTP ' + t.status);
      let e = await t.text(),
        n = JSON.parse(e);
      if (!Array.isArray(n)) throw new Error('Respons bukan array: ' + String(e).slice(0, 80));
      return n;
    }
    function Mt() {
      let t = document.querySelector('#no_loket');
      return t && t.value ? t.value : '4324';
    }
    async function Lt() {
      let t = await fetch('/antrian-farmasi/v2?section=isi&nomor=' + encodeURIComponent(Mt()), {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        cache: 'no-store',
      });
      if (!t.ok) throw new Error('HTTP ' + t.status);
      let e = await t.text();
      return { current: Jt(e), patients: $t(e) };
    }
    function st(t) {
      let e = /racik/i.test(String(t.JENIS ?? '')) ? 'racikan' : 'tunggal';
      return {
        id: String(t.ID),
        nomor: t.COUNTER != null ? String(t.COUNTER) : t.NOMOR != null ? String(t.NOMOR) : '',
        kode: t.KODE || t.NAMA || 'BT',
        namaPasien: t.NAMA_PASIEN ?? '',
        unit: t.NAMA_UNIT ?? '',
        jenis: e,
        rm: t.ID_PASIEN != null ? String(t.ID_PASIEN) : '',
      };
    }
    function te(t) {
      let e = [],
        n = [];
      for (let r of t) {
        if (!r || r.ID == null) continue;
        let o = st(r),
          i = String(r.STATUS).trim(),
          s = r.WAKTU_PENERIMAAN != null && String(r.WAKTU_PENERIMAAN).trim() !== '',
          c = r.WAKTU_PENYERAHAN != null && String(r.WAKTU_PENYERAHAN).trim() !== '';
        i === '0' ? e.push(o) : s && !c && n.push(o);
      }
      return { panggilan: e, siapDiambil: n };
    }
    let U = '#antrian-penyerahan',
      O = '#antrian-view';
    function tt(t, e, n) {
      return (
        '<div class="antrian-title">' +
        t +
        '</div><div class="antrian-nomor">' +
        (e && e !== '0' ? e : '\u2014') +
        '</div>' +
        (n ? '<div class="antrian-rm">' + n + '</div>' : '')
      );
    }
    function F(t, e) {
      if (!e || e === '0') return '';
      let n = X(Pt(), e, t);
      if (!n) return '';
      let r = Q.find((o) => String(o.ID ?? '') === n);
      return r?.NAMA_PASIEN ? String(r.NAMA_PASIEN) : Z.get(`${t}:${e}`)?.nama || '';
    }
    function N(t) {
      let e = document.querySelector(t);
      if (!e) return '';
      let n = (e.querySelector?.('.antrian-nomor')?.textContent || '').trim();
      return /^(?:[TR]-)?\d+$/.test(n) ? n : '';
    }
    function Nt() {
      let t = document.querySelector('#list-content');
      if (!t) return;
      let e = [k.tunggal, k.racikan].filter((o) => o && o !== '0'),
        n = [K.tunggal?.namaPasien || '', K.racikan?.namaPasien || ''].filter(Boolean),
        r = null;
      for (let o of t.querySelectorAll('dl')) {
        let i = o.querySelector('h4'),
          s =
            ((o.getAttribute('data-nomor-morbis') || i?.textContent || '').match(/(\d+)$/) ||
              [])[1] || '',
          p = (o.querySelector('dd.col-3, dd.col-md-3')?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim(),
          A = e.some((R) => s && R === s),
          l = n.some((R) => R && p === R),
          f = A || l;
        ((o.style.background = f ? '#fde68a' : ''),
          (o.style.fontSize = f ? '1.35em' : ''),
          f
            ? ((r = o), (o.style.outline = '3px solid #b45309'), (o.style.outlineOffset = '2px'))
            : (o.style.outline = ''));
      }
      r &&
        (r.scrollIntoView({ behavior: 'smooth', block: 'center' }),
        r.focus?.(),
        r.setAttribute('tabindex', '-1'),
        r.focus());
    }
    function at() {
      let t = document.querySelector('#list-content');
      if (!t) return;
      let e = 0;
      for (let n of t.querySelectorAll('dl')) {
        let r = n.querySelector('h4');
        if (
          !r ||
          (n.hasAttribute('data-nomor-morbis') ||
            n.setAttribute('data-nomor-morbis', (r.textContent || '').trim()),
          n.hasAttribute('data-public-code'))
        )
          continue;
        let o =
            ((n.querySelector('dd.col-3 p, dd.col-md-3 p')?.textContent || '').match(
              /RM\s*:\s*(\d+)/i,
            ) || [])[1] || '',
          i = n.classList.contains('racikan'),
          s = Q.find(
            (A) =>
              String(A.ID_PASIEN ?? '') === o &&
              (i ? /racik/i.test(String(A.JENIS ?? '')) : !/racik/i.test(String(A.JENIS ?? ''))),
          ),
          c = s ? String(s.ID ?? '') : '',
          p = (c && z.get(c)) || '';
        p
          ? ((r.textContent = p),
            n.setAttribute('data-public-code', p),
            n.setAttribute('data-morbis-id', c))
          : o && ((r.textContent = '\u2014'), n.setAttribute('data-public-code', '\u2014'), e++);
      }
      e > 0 &&
        console.warn(
          '[AFD] tabel antrian: ' + e + ' baris tak bisa di-resolve ke publicCode (tampil \u2014)',
        );
    }
    async function ee(t) {
      let e = Mt(),
        n = t.ID != null ? String(t.ID) : '',
        r = t.COUNTER != null ? String(t.COUNTER) : t.NOMOR != null ? String(t.NOMOR) : '',
        o = /racik/i.test(String(t.JENIS ?? '')) ? 'racikan' : 'tunggal';
      if (n && window.confirm('Panggil ulang ' + (t.NAMA_PASIEN || '') + ' (' + r + ')?'))
        try {
          let i = await fetch('/antrian-farmasi/control', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body:
              'id=' +
              encodeURIComponent(n) +
              '&nomor=' +
              encodeURIComponent(r) +
              '&jenis=' +
              encodeURIComponent(o) +
              '&loket=' +
              encodeURIComponent(e),
          });
          if (!i.ok) {
            console.error('[AFD] recall gagal HTTP', i.status);
            return;
          }
          let s = window;
          typeof s.contentloader == 'function' &&
            s.contentloader('/antrian-farmasi/v2?section=isi&nomor=' + e, '#isi');
        } catch (i) {
          console.error('[AFD] recall error', i);
        }
    }
    function ne() {
      let t = document.querySelector('#list-content');
      if (!t || t.__afdRecall) return;
      t.__afdRecall = !0;
      let e = t.querySelectorAll('dl');
      for (let n of e) {
        let o = (n.querySelector('dd.col-3, dd.col-md-3')?.textContent || '')
          .replace(/\s+/g, ' ')
          .trim();
        !o ||
          n.__afdRec ||
          ((n.__afdRec = !0),
          n.addEventListener('click', () => {
            let i = Q.find(
              (s) => ((s.NAMA_PASIEN || '').replace(/\s+/g, ' ').trim() || '').indexOf(o) !== -1,
            );
            i && ee(i);
          }));
      }
    }
    function re() {
      try {
        let t = localStorage.getItem('ext-afd-recall');
        if (!t) return;
        let e = JSON.parse(t),
          n = `${e.jenis}:${e.nomor}`;
        if (Date.now() - (e.ts || 0) < 8e3 && n !== ct) {
          ((ct = n), localStorage.removeItem('ext-afd-recall'));
          let o = e.jenis === 'racikan' ? 'racikan' : 'tunggal',
            i = P(o, e.nomor),
            s = F(o, e.nomor) || (C && C.jenis === o ? C.namaPasien : '');
          (m({ lastAnnouncement: `recall:${o}:${i}` }),
            ot({
              id: `local-recall-${n}`,
              nomor: i,
              kode: '',
              namaPasien: s,
              unit: '',
              jenis: o,
              rm: '',
            }));
        }
      } catch {}
    }
    async function lt() {
      let t = Date.now();
      if (document.hidden) {
        bt = window.setTimeout(() => {
          lt();
        }, w);
        return;
      }
      (x('loading'), re());
      try {
        let [{ current: e }, n] = await Promise.all([Lt(), Ct()]);
        ((Q = n), await xt(n), at(), m({ lastPoll: Date.now(), lastDataCount: n.length }));
        let r = e.get('1')?.trim(),
          o = e.get('2')?.trim();
        ((k.tunggal = r && r !== '0' ? r : ''), (k.racikan = o && o !== '0' ? o : ''));
        let i = !1;
        (Rt(e, H) && (Dt(), (i = !0), Ot()), H.clear());
        for (let [l, f] of e) H.set(l, f);
        m({ currentByJenis: { ...k }, lastNormalKey: G });
        let s = N(U),
          c = N(O),
          p = !i && k.tunggal !== '' && s && s !== '0' && s !== k.tunggal && s !== M.tunggal,
          A = !i && k.racikan !== '' && c && c !== '0' && c !== k.racikan && c !== M.racikan;
        if (p || A) {
          let l = p ? 'tunggal' : 'racikan',
            f = p ? s : c,
            R = P(l, f),
            h = l + ':' + R;
          if (h !== rt) {
            rt = h;
            let _ = F(l, f) || (C && C.jenis === l ? C.namaPasien : '');
            (ot({
              id: 'recall:' + h,
              nomor: R,
              kode: '',
              namaPasien: _,
              unit: '',
              jenis: l,
              rm: '',
            }),
              m({ lastAnnouncement: 'recall:' + h }));
          }
          x('ok');
          return;
        }
        for (let l of ['tunggal', 'racikan']) {
          let f = k[l],
            R = nt[l];
          if (f && f !== '0' && f !== R) {
            let h = P(l, f),
              _ = l + ':' + h;
            if (_ !== G) {
              ((G = _), (rt = null));
              let yt = F(l, f);
              (ot({ id: _, nomor: h, kode: '', namaPasien: yt, unit: '', jenis: l, rm: '' }),
                m({ lastAnnouncement: _ }));
            }
          }
          nt[l] = f || '';
        }
        (It(),
          Nt(),
          (M.tunggal = P('tunggal', k.tunggal) || D.tunggal),
          (M.racikan = P('racikan', k.racikan) || D.racikan),
          m({ writtenByUs: { ...M } }),
          qt(),
          x('ok'));
      } catch {
        x('error');
      } finally {
        (Date.now() - t > 1e3 && d?.getAttribute('data-state') !== 'error' && x('slow'),
          (bt = window.setTimeout(() => {
            lt();
          }, w)));
      }
    }
    function V(t, e) {
      if ((It(t), e)) {
        ((K[e.jenis] = e), oe(t));
        let n = P('tunggal', k.tunggal),
          r = P('racikan', k.racikan),
          o = N(U) && N(U) !== k.tunggal && N(U) !== M.tunggal,
          i = N(O) && N(O) !== k.racikan && N(O) !== M.racikan,
          s = o ? null : document.querySelector(U);
        s && (s.innerHTML = tt('Obat Tunggal', n, F('tunggal', k.tunggal)));
        let c = i ? null : document.querySelector(O);
        (c && (c.innerHTML = tt('Obat Racikan', r, F('racikan', k.racikan))),
          Nt(),
          ne(),
          (M.tunggal = n),
          (M.racikan = r));
      }
      qt();
    }
    function It(t) {
      let e = document.querySelector(U),
        n = document.querySelector(O),
        r = k.tunggal,
        o = k.racikan,
        i = P('tunggal', r) || D.tunggal,
        s = P('racikan', o) || D.racikan;
      (e && (e.innerHTML = tt('Obat Tunggal', i, r ? F('tunggal', r) : '')),
        n && (n.innerHTML = tt('Obat Racikan', s, o ? F('racikan', o) : '')));
    }
    function oe(t) {
      for (let e of t.panggilan) K[e.jenis] || (K[e.jenis] = e);
      for (let e of Q) {
        let n = st(e);
        K[n.jenis] = n;
      }
    }
    let et = '',
      H = new Map(),
      E = null,
      _t = !1,
      K = { tunggal: null, racikan: null },
      k = { tunggal: '', racikan: '' },
      nt = { tunggal: '', racikan: '' },
      M = { tunggal: '', racikan: '' },
      rt = null,
      ct = '',
      Q = [],
      G = '',
      C = null;
    function Dt() {
      ((C = null),
        (rt = null),
        (ct = ''),
        (et = ''),
        (G = ''),
        (nt.tunggal = ''),
        (nt.racikan = ''),
        H.clear(),
        m({ lastCalledPatient: null, lastCalledNumber: null, lastRealtimeEvent: 'reset' }));
    }
    let Ut = 0;
    function Ot() {
      let t = Date.now();
      t - Ut < 3e3 ||
        ((Ut = t),
        vt()
          .then(() => {
            (z.clear(),
              Z.clear(),
              (D.tunggal = ''),
              (D.racikan = ''),
              m({ lastRealtimeEvent: 'reset:queue' }));
          })
          .catch((e) => {
            console.warn('[FarmasiDisplay] reset QueueManager gagal:', e);
          }));
    }
    let B = window.speechSynthesis,
      ie = B.speak.bind(B),
      ut = !1,
      q = [];
    function dt() {
      if (ut || q.length === 0) return;
      ut = !0;
      let t = q.shift(),
        e = !1,
        n = () => {
          e || ((e = !0), (ut = !1), setTimeout(() => dt(), S));
        };
      if (t.kind === 'bell') {
        ue(n);
        return;
      }
      ce(t.text).then(n, n);
    }
    let L = [];
    function Ft() {
      return L.length > 0
        ? Promise.resolve(L)
        : new Promise((t) => {
            let e = () => {
              let o = B.getVoices();
              return o.length > 0 ? ((L = o), t(o), !0) : !1;
            };
            if (e()) return;
            let n = 0,
              r = window.setInterval(() => {
                ((n += 1),
                  (e() || n >= 50) &&
                    (window.clearInterval(r), L.length || ((L = B.getVoices()), t(L))));
              }, 100);
            B.addEventListener('voiceschanged', () => {
              L.length || e();
            });
          });
    }
    function gt(t) {
      let e = L,
        n = (r) => (r || '').toLowerCase();
      return t === 'id-local'
        ? (e.find((r) => n(r.lang).startsWith('id') && r.localService) ??
            e.find((r) => /indonesia/i.test(r.name)) ??
            null)
        : t === 'id-any'
          ? (e.find((r) => n(r.lang).startsWith('id')) ?? null)
          : t === 'any-local'
            ? (e.find((r) => r.localService) ?? null)
            : (e[0] ?? null);
    }
    function mt(t, e, n = 2e4) {
      return new Promise((r) => {
        try {
          let o = new SpeechSynthesisUtterance(t);
          ((o.lang = (e && e.lang) || 'id-ID'), e && (o.voice = e), (o.rate = 0.8), (o.volume = 1));
          let i = !1,
            s = !1,
            c = Date.now(),
            p = (l) => {
              s ||
                ((s = !0),
                window.clearTimeout(A),
                m({ lastTtsEnd: Date.now() }),
                console.info(
                  '[AFD] [TTS] speakSynth ' +
                    (l ? 'SUCCESS' : 'FAIL') +
                    ' voice=' +
                    (e ? e.name + '/' + e.lang + (e.localService ? '/local' : '/net') : 'null') +
                    ' durasi=' +
                    (Date.now() - c) +
                    'ms',
                ),
                r(l));
            };
          ((o.onstart = () => {
            ((i = !0),
              m({ lastTtsStart: Date.now() }),
              console.info('[AFD] [TTS] onstart voice=' + (e ? e.name : 'null')));
          }),
            (o.onend = () => p(!0)),
            (o.onerror = (l) => {
              (console.info('[AFD] [TTS] onerror started=' + i + ' err=' + (l.error || '')), p(i));
            }),
            ie.call(B, o));
          let A = window.setTimeout(() => {
            (console.info('[AFD] [TTS] timeout ' + n + 'ms started=' + i), p(i));
          }, n);
        } catch (o) {
          (console.info('[AFD] [TTS] speakSynth throw', o), r(!1));
        }
      });
    }
    function se() {
      try {
        return document.documentElement.getAttribute('data-ext-tts-server') !== '0';
      } catch {
        return !0;
      }
    }
    function ae(t, e = 15e3) {
      let n = Vt(t);
      return new Promise((r) => {
        let o = !1,
          i = null,
          s = null,
          c = (l) => {
            o ||
              ((o = !0),
              window.clearTimeout(p),
              s && ((s.onended = null), (s.onerror = null), (s.oncanplay = null)),
              i && URL.revokeObjectURL(i),
              m({ lastTtsEnd: Date.now() }),
              console.info('[AFD] [TTS] server-mp3 ' + (l ? 'SUCCESS' : 'FAIL')),
              r(l));
          },
          p = window.setTimeout(() => c(!1), e),
          A = (l) => {
            ((s = new Audio(l)),
              (s.onended = () => c(!0)),
              (s.onerror = () => c(!1)),
              (s.oncanplay = () => {
                s.play().catch(() => c(!1));
              }),
              s.load());
          };
        fetch(n, { mode: 'cors' })
          .then((l) => {
            if (!l.ok) throw new Error('HTTP ' + l.status);
            return l.blob();
          })
          .then((l) => {
            if (!l || l.size === 0) throw new Error('empty blob');
            ((i = URL.createObjectURL(l)), A(i));
          })
          .catch(() => A(n));
      });
    }
    function le(t, e = 1e4) {
      return new Promise((n) => {
        let r = !1,
          o = null,
          i = null,
          s = (l, f) => {
            r ||
              ((r = !0),
              window.clearTimeout(p),
              i &&
                ((i.onended = null), (i.onerror = null), (i.oncanplay = null), (i.onplay = null)),
              o && URL.revokeObjectURL(o),
              m({ lastTtsEnd: Date.now(), ttsTrace: [...c, 'end:' + f] }),
              console.info('[AFD] [TTS] local-service ' + (l ? 'SUCCESS' : 'FAIL ' + f)),
              n({ ok: l, reason: f }));
          },
          c = ['start'],
          p = window.setTimeout(() => s(!1, 'timeout'), e),
          A = (l) => {
            (c.push('audio-new'),
              (i = new Audio(l)),
              (i.onplay = () => {
                (c.push('play'), m({ lastTtsStart: Date.now(), ttsTrace: [...c] }));
              }),
              (i.onended = () => s(!0, 'ended')),
              (i.onerror = () => s(!1, 'audio-error ' + (i && i.error ? i.error.code : '?'))),
              (i.oncanplay = () => {
                (c.push('canplay'),
                  i.play().catch((f) => s(!1, 'play-rejected ' + String(f).slice(0, 60))));
              }),
              i.load());
          };
        try {
          let l = 'tts-' + Date.now() + '-' + Math.floor(Math.random() * 1e6),
            f = (R) => {
              if (R.source !== window) return;
              let h = R.data;
              if (
                !h ||
                h.source !== 'MORBIS-FARMASI-BRIDGE' ||
                h.type !== 'TTS_RESULT' ||
                h.id !== l
              )
                return;
              if ((window.removeEventListener('message', f), !h.ok)) {
                s(!1, h.reason || 'message-error no-response');
                return;
              }
              if (!h.data || h.data.length === 0) {
                s(!1, 'blob-error empty-data');
                return;
              }
              c.push('blob:' + h.data.length);
              let _ = new Uint8Array(h.data),
                yt = new Blob([_], { type: h.mime || 'audio/mpeg' });
              ((o = URL.createObjectURL(yt)), A(o));
            };
          (window.addEventListener('message', f),
            window.postMessage(
              { source: 'MORBIS-FARMASI', type: 'TTS_REQUEST', id: l, text: t },
              '*',
            ));
        } catch (l) {
          s(!1, 'message-error postmessage ' + String(l).slice(0, 40));
        }
      });
    }
    async function ce(t) {
      m({ ttsAttempts: 0, ttsLastError: null, ttsEngine: null });
      try {
        B.cancel();
      } catch {}
      (await Ft(), console.info('[AFD] [TTS] voices=' + L.map((c) => c.name).join(', ')));
      let e = await le(t);
      if (e.ok) {
        m({ ttsMode: 'local', ttsEngine: 'local-service:8765' });
        return;
      }
      let n = 'local-service: ' + e.reason;
      m({ ttsLastError: n });
      let r = gt('id-local');
      if (r && (m({ ttsMode: 'speech', ttsEngine: 'speech:' + r.name }), await mt(t, r))) return;
      let o = se(),
        i = gt('id-any');
      if (
        i &&
        i !== r &&
        (o || i.localService) &&
        (m({ ttsMode: 'speech', ttsEngine: 'speech:' + i.name, ttsAttempts: 1 }), await mt(t, i))
      )
        return;
      let s = gt('any-local');
      (s &&
        s !== r &&
        s !== i &&
        (m({ ttsMode: 'local', ttsEngine: 'local:' + s.name, ttsAttempts: 2 }), await mt(t, s))) ||
        (o && (m({ ttsMode: 'mp3', ttsEngine: 'rs-server', ttsAttempts: 3 }), await ae(t))) ||
        (m({
          ttsMode: 'error',
          ttsEngine: null,
          ttsLastError:
            'all engines failed \u2014 layer0=' +
            n +
            ' (speech id-local/id-any/any-local, server-mp3' +
            (o ? '' : ' nonaktif') +
            ')',
          ttsAttempts: 4,
        }),
        m({ lastTtsEnd: Date.now() }),
        console.error('[AFD] [TTS] semua engine gagal utk:', t.slice(0, 40)));
    }
    let j = null;
    function ue(t) {
      try {
        let e = window.AudioContext || window.webkitAudioContext;
        if (!e) return t();
        ((j = j || new e()), j.resume());
        let n = j.currentTime,
          r = [
            [1318.5, n],
            [1760, n + 0.14],
          ];
        for (let [i, s] of r) {
          let c = j.createOscillator(),
            p = j.createGain();
          ((c.type = 'sine'),
            c.frequency.setValueAtTime(i, s),
            p.gain.setValueAtTime(1e-4, s),
            p.gain.exponentialRampToValueAtTime(0.45, s + 0.02),
            p.gain.exponentialRampToValueAtTime(1e-4, s + 0.16),
            c.connect(p),
            p.connect(j.destination),
            c.start(s),
            c.stop(s + 0.18));
        }
        setTimeout(t, 350);
      } catch {
        t();
      }
    }
    function de(t) {
      return t
        .split(/\s+/)
        .map((e) => e && e[0].toUpperCase() + e.slice(1).toLowerCase())
        .join(' ');
    }
    function ot(t) {
      if (!ft) {
        console.warn('[FarmasiDisplay] audio belum unlocked \u2014 TTS/bell dilewati');
        return;
      }
      C = {
        id: String(t.id || ''),
        jenis: t.jenis,
        nomor: String(t.nomor),
        namaPasien: String(t.namaPasien || ''),
      };
      let e = String(t.id || '');
      (e && !e.startsWith('cur-') && Gt(e).catch(() => {}),
        m({
          lastCalledPatient: C.namaPasien,
          lastCalledNumber: C.nomor,
          lastRealtimeEvent: 'announce:' + t.id,
        }));
      let n = t.namaPasien
        ? 'Antrian resep obat, atas nama ' +
          de(String(t.namaPasien)) +
          '. Silakan ke loket farmasi.'
        : 'Antrian resep obat. Silakan ke loket farmasi.';
      for (let r = q.length - 1; r >= 0; r--) q[r].kind === 'voice' && q.splice(r, 1);
      (q.push({ kind: 'bell' }, { kind: 'voice', text: n }, { kind: 'voice', text: n, repeat: !0 }),
        dt());
    }
    let ft = !1;
    function W() {
      ft ||
        ((ft = !0),
        m({ audioUnlocked: !0 }),
        document.removeEventListener('pointerdown', W),
        document.removeEventListener('keydown', W),
        console.log('[FarmasiDisplay] audio unlocked via gesture'));
    }
    (document.addEventListener('pointerdown', W),
      document.addEventListener('keydown', W),
      (function () {
        let e = !1,
          n = () => {
            e || ((e = !0), W());
          },
          r = () => {
            try {
              let o = window.AudioContext;
              if (o) {
                let i = new o();
                ((i.onstatechange = () => {
                  i.state === 'running' && (i.close().catch(() => {}), n());
                }),
                  i.resume().catch(() => {}),
                  window.setTimeout(() => {
                    if (!e)
                      try {
                        i.state === 'running' && (i.close().catch(() => {}), n());
                      } catch {}
                  }, 800));
              } else n();
            } catch {
              n();
            }
          };
        document.readyState !== 'loading' ? r() : document.addEventListener('DOMContentLoaded', r);
      })());
    let pt = !1,
      Ht = !1,
      Qt = null,
      wt = null,
      St = null,
      J = null,
      bt = null,
      Bt = { staleMax: Zt },
      I = { nativeActive: !0, staleStreak: 0, nativeSig: '', ourSig: '' },
      ge = new URLSearchParams(window.location.search).get('debug') === '1',
      kt = {
        started: !1,
        mode: 'NATIVE',
        nativeActive: !0,
        pollingActive: !1,
        lastNativeActivity: null,
        lastPoll: null,
        lastDataCount: null,
        lastAnnouncement: null,
        audioUnlocked: !1,
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
    function m(t) {
      ge &&
        (Object.assign(kt, t),
        (window.__ANTRIAN_FARMASI_DEBUG__ = { ...kt }),
        document.documentElement.setAttribute('data-afd-debug', JSON.stringify(kt)),
        document.documentElement.setAttribute(
          'data-afd-world',
          typeof chrome < 'u' && chrome.runtime ? 'isolated-has-cr' : 'no-cr',
        ));
    }
    function At() {
      let t = document.querySelector(U),
        e = document.querySelector(O);
      return (t ? (t.textContent ?? '') : '') + '|' + (e ? (e.textContent ?? '') : '');
    }
    function qt() {
      I = ht(I, { type: 'we-wrote', signal: At() }, Bt).next;
    }
    function me() {
      J && (window.clearTimeout(J), (J = null));
    }
    function jt() {
      I.nativeActive ||
        J ||
        (pt &&
          (J = window.setTimeout(() => {
            fe();
          }, g[$])));
    }
    let $ = 0;
    async function fe() {
      J = null;
      try {
        let [{ current: t, patients: e }, n] = await Promise.all([Lt(), Ct()]);
        (($ = 0), m({ lastPoll: Date.now(), lastDataCount: n.length }), (Q = n), await xt(n));
        let r = te(n),
          o = Yt(t),
          i = t.get('1')?.trim(),
          s = t.get('2')?.trim();
        ((k.tunggal = i && i !== '0' ? i : ''), (k.racikan = s && s !== '0' ? s : ''));
        let c =
          o !== ''
            ? [...t.entries()]
                .filter(([, p]) => p === o)
                .map(([p]) => p + ':' + o)
                .join('|')
            : '';
        if (o !== '') {
          let A = Wt(document.querySelector('#list-content')).get(o);
          (!A || !A.nama) && (A = e.get(o));
          let l = we(n, o),
            f = {
              id: 'cur-' + o,
              nomor: P(l?.jenis || 'tunggal', o),
              kode: (A && A.kode) || l?.kode || '',
              namaPasien: (A && A.nama) || l?.namaPasien || '',
              unit: l?.unit || '',
              jenis: l?.jenis || 'tunggal',
              rm: l?.rm || '',
            };
          _t
            ? c !== et && pe(t)
              ? Rt(t, H)
                ? (Dt(), Ot(), (E = f), V(r, E))
                : ((et = c), (E = f), V(r, E), Se(r, E))
              : (E || (E = f), V(r, E))
            : ((_t = !0), (E = f), V(r, E));
        } else r.siapDiambil.length > 0 && E && V(r, E);
      } catch (t) {
        (($ = Math.min($ + 1, g.length - 1)),
          console.warn('[FarmasiDisplay] fallback gagal (backoff ' + g[$] + 'ms):', t));
      } finally {
        jt();
      }
    }
    function pe(t) {
      if (H.size === 0) return !1;
      for (let [e, n] of t) if (H.get(e) !== n) return !0;
      return !1;
    }
    function we(t, e) {
      let n = t.map((i) => Tt(i)).filter((i) => i.id),
        r = X(n, e, 'tunggal') ?? X(n, e, 'racikan'),
        o = r ? t.find((i) => String(i.ID ?? '') === r) : null;
      return o ? st(o) : null;
    }
    function Se(t, e) {
      if (!pt) return;
      let n = e.jenis + ':' + e.nomor;
      if (n === G) {
        console.info('[AFD] duplicate ignored ' + n);
        return;
      }
      ((G = n),
        (et = e.id),
        m({ lastAnnouncement: n }),
        console.info('[AFD] ANNOUNCE ' + n),
        ot(e));
    }
    let Y = 'NATIVE';
    function be() {
      let t = ht(I, { type: 'observe', signal: At() }, Bt);
      ((I = t.next),
        t.startPolling
          ? (($ = 0),
            jt(),
            Y !== 'FALLBACK' && ((Y = 'FALLBACK'), console.info('[AFD] MODE=FALLBACK')),
            m({ mode: 'FALLBACK', nativeActive: !1, pollingActive: !0 }))
          : t.stopPolling
            ? (me(),
              Y !== 'NATIVE' && ((Y = 'NATIVE'), console.info('[AFD] MODE=NATIVE')),
              m({
                mode: 'NATIVE',
                nativeActive: !0,
                pollingActive: !1,
                lastNativeActivity: Date.now(),
              }))
            : !I.nativeActive &&
              Y !== 'FALLBACK' &&
              ((Y = 'FALLBACK'), m({ mode: 'FALLBACK', nativeActive: !1, pollingActive: !0 })));
    }
    function ke() {
      let t = document.createElement('style');
      ((t.id = 'ext-afd-hide-swal'),
        (t.textContent =
          '.swal2-container, .swal2-backdrop { display: none !important; visibility: hidden !important; }'),
        (document.head || document.documentElement).appendChild(t),
        new MutationObserver(() => {
          document.querySelectorAll('.swal2-container').forEach((n) => {
            n.style.display = 'none';
          });
        }).observe(document.documentElement, { childList: !0, subtree: !0 }));
    }
    function Ae() {
      if (Ht) return;
      ((Ht = !0), m({ started: !0 }), ke());
      let t = new URLSearchParams(window.location.search);
      if (t.get('extReset') === '1') {
        t.delete('extReset');
        let n = t.toString();
        (window.history.replaceState(null, '', window.location.pathname + (n ? '?' + n : '')),
          vt().then((r) => {
            console.log(
              '[MORBIS Ext] queue di-reset (tiket aktif: ' +
                Object.keys(r.tickets ?? {}).length +
                ')',
            );
          }));
      }
      (v(), Xt(), x('loading'));
      let e = document.querySelector('#list-content');
      (e &&
        !e.hasAttribute('data-ext-afd-patch') &&
        (e.setAttribute('data-ext-afd-patch', '1'),
        new MutationObserver(() => {
          at();
        }).observe(e, { childList: !0, subtree: !0 })),
        at(),
        (pt = !0),
        Ft().catch(() => {}),
        (I = { ...I, nativeSig: At() }),
        Qt === null && (Qt = setInterval(be, zt)),
        bt === null && lt());
    }
    Ae();
    let ye = () => {
      (wt !== null && clearInterval(wt), St !== null && clearInterval(St));
    };
    window.addEventListener('beforeunload', ye);
  })();
})();
