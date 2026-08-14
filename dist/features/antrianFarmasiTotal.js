'use strict';
var __morbis_feature = (() => {
  // src/features/shared/farmasiRenumber.ts
  var RACIKAN_RE = /racik/i;
  function isRacikanJenis(jenis) {
    return !!jenis && RACIKAN_RE.test(jenis);
  }

  // src/features/shared/farmasiQueue.ts
  var KEY = 'farmasiQueueV2';
  function assertCtxAlive() {
    const ok = typeof chrome !== 'undefined' && !!chrome.runtime?.id;
    if (!ok) {
      throw new Error('farmasiQueue: extension context invalidated (extension reloaded)');
    }
  }
  async function storageGet(key) {
    assertCtxAlive();
    return chrome.storage.local.get(key);
  }
  async function storageSet(items) {
    assertCtxAlive();
    await chrome.storage.local.set(items);
  }
  async function storageRemove(key) {
    assertCtxAlive();
    await chrome.storage.local.remove(key);
  }
  var LOCK_KEY = 'farmasiQueueV2:lock';
  var LOCK_TTL_MS = 1e4;
  var LOCK_DEADLINE_MS = 3e4;
  var LOCK_RETRY_MS = 80;
  async function acquireLock() {
    const token = `${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const deadline = Date.now() + LOCK_DEADLINE_MS;
    for (;;) {
      const res = await storageGet(LOCK_KEY);
      const cur = res[LOCK_KEY];
      if (!cur || Date.now() - cur.ts > LOCK_TTL_MS) {
        await storageSet({ [LOCK_KEY]: { token, ts: Date.now() } });
        const check = await storageGet(LOCK_KEY);
        if (check[LOCK_KEY]?.token === token) return token;
      }
      if (Date.now() > deadline) throw new Error('farmasiQueue: lock timeout');
      await new Promise((r) => setTimeout(r, LOCK_RETRY_MS));
    }
  }
  async function releaseLock(token) {
    const res = await storageGet(LOCK_KEY);
    if (res[LOCK_KEY]?.token === token) {
      await storageRemove(LOCK_KEY);
    }
  }
  async function withLock(fn) {
    const token = await acquireLock();
    try {
      return await fn();
    } finally {
      await releaseLock(token);
    }
  }
  function sessionOf(waktu) {
    if (waktu && /^\d{4}-\d{2}-\d{2}/.test(waktu)) return waktu.slice(0, 10);
    return /* @__PURE__ */ new Date().toISOString().slice(0, 10);
  }
  function empty(session) {
    return { session, nextByJenis: { tunggal: 1, racikan: 1 }, tickets: {} };
  }
  async function getQueueState() {
    const today = sessionOf();
    const res = await storageGet(KEY);
    const st = res[KEY] ?? empty(today);
    return st.session === today ? st : empty(today);
  }
  async function save(st) {
    await storageSet({ [KEY]: st });
  }
  function codeFor(num, isR) {
    return (isR ? 'R-' : 'T-') + String(num).padStart(2, '0');
  }
  function statusFromMorbsi(status, statusPanggil) {
    switch (String(status ?? '')) {
      case '0':
        return 'CANCELLED';
      case '1':
        return 'WAITING';
      case '2':
      case '3':
        return 'PROCESSING';
      case '4':
        return String(statusPanggil ?? '') === '1' ? 'CALLED' : 'READY';
      default:
        return 'ISSUED';
    }
  }
  function assignPending(st, rows) {
    const pending = rows
      .filter((r) => r.id && !r.selesai && st.tickets[r.id] == null)
      .sort((a, b) => (a.waktu || '').localeCompare(b.waktu || ''));
    let count = 0;
    for (const r of pending) {
      const isR = isRacikanJenis(r.jenis);
      const num = st.nextByJenis[isR ? 'racikan' : 'tunggal']++;
      st.tickets[r.id] = {
        num,
        code: codeFor(num, isR),
        type: isR ? 'racikan' : 'tunggal',
        status: statusFromMorbsi(r.status, r.statusPanggil),
        issuedAt: /* @__PURE__ */ new Date().toISOString(),
      };
      count++;
    }
    return { st, count };
  }
  async function issuePending(rows) {
    return withLock(async () => {
      const st = await getQueueState();
      const { st: nextSt, count } = assignPending(st, rows);
      if (count > 0) await save(nextSt);
      return count;
    });
  }
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

  // src/features/antrianFarmasiTotal.ts
  (function () {
    const CARD_SEL = '.counter-card';
    const TOTAL_SEL = '.total-number';
    const CURRENT_SEL = '.current-number';
    const ROWS_SEL = '.queue-table tbody tr';
    function fixTotals() {
      document.querySelectorAll(CARD_SEL).forEach((card) => {
        const totalEl = card.querySelector(TOTAL_SEL);
        if (!totalEl) return;
        const count = card.querySelectorAll(ROWS_SEL).length;
        if (count === 0) return;
        const want = '/ ' + count;
        if (totalEl.textContent.trim() !== want) totalEl.textContent = want;
      });
    }
    async function fixCurrents() {
      const rows = document.querySelectorAll(ROWS_SEL);
      if (rows.length === 0) return;
      try {
        await syncPublicNumbers(rows);
      } catch (err) {
        const msg = String(err.message ?? err);
        if (!/context invalidated|no reply/i.test(msg)) {
          console.warn('[AntrianFarmasiTotal] sync current gagal:', msg);
        }
      }
    }
    async function syncPublicNumbers(rows) {
      const morbis = Array.from(rows)
        .map((tr) =>
          toRowState({
            ID: tr.getAttribute('data-id') ?? '',
            NOMOR: tr.getAttribute('data-nomor') ?? '',
            STATUS_PANGGIL: tr.classList.contains('status-called') ? '1' : '0',
            JENIS: tr.getAttribute('data-jenis') ?? '',
          }),
        )
        .filter((r) => r.id);
      if (morbis.length === 0) return;
      await issuePending(
        morbis.map((r) => ({
          id: r.id,
          jenis: r.jenis,
          waktu: null,
          // tabel operator tak punya WAKTU → urut insertion tabel
        })),
      );
      const st = await getQueueState();
      for (const card of document.querySelectorAll(CARD_SEL)) {
        const curEl = card.querySelector(CURRENT_SEL);
        if (!curEl) continue;
        const counter = curEl.getAttribute('data-counter');
        const morbisNum = (curEl.textContent || '').trim();
        if (!counter || !morbisNum || morbisNum === '0') continue;
        const jenis = counter === '2' ? 'racikan' : 'tunggal';
        const id = resolveCalledId(morbis, morbisNum, jenis);
        if (!id) continue;
        const t = getTicket(st, id);
        if (t && curEl.textContent?.trim() !== t.code) curEl.textContent = t.code;
      }
    }
    fixTotals();
    void fixCurrents();
    const root = document.querySelector('#isi');
    if (root) {
      new MutationObserver(() => {
        fixTotals();
        void fixCurrents();
      }).observe(root, { childList: true, subtree: true });
    }
  })();
})();
//# sourceMappingURL=antrianFarmasiTotal.js.map
