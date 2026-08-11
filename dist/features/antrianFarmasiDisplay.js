'use strict';
var __morbis_feature = (() => {
  // src/features/shared/queueRule.ts
  function pickAnnounce(rows, lastAnnouncedSignature) {
    if (!Array.isArray(rows) || rows.length === 0) return { row: null, signature: '' };
    const newest = rows
      .filter((r) => r && r.ID != null && r.ID !== '')
      .sort((a, b) => Number(b.ID) - Number(a.ID))[0];
    if (!newest) return { row: null, signature: '' };
    const signature = `${newest.ID}-${newest.COUNTER ?? 0}`;
    if (signature === lastAnnouncedSignature) return { row: null, signature };
    return { row: newest, signature };
  }

  // src/features/antrianFarmasiDisplay.ts
  (function () {
    const LIST_URL = '/public/antrian-farmasi-v2/list-antrian-v2';
    const POLL_MS = 5e3;
    const MAX_BACKOFF_MS = 6e4;
    const CALL_DELAY_MS = 1200;
    const GAP_MS = 400;
    async function fetchCallData() {
      const res = await fetch(LIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: 'type=data_call',
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        throw new Error('Respons bukan array: ' + String(text).slice(0, 80));
      }
      return parsed;
    }
    function normalize(rows) {
      const panggilan = [];
      const siapDiambil = [];
      for (const r of rows) {
        if (!r || r.ID == null) continue;
        const v = {
          id: String(r.ID),
          nomor: r.COUNTER != null ? String(r.COUNTER) : r.NOMOR != null ? String(r.NOMOR) : '',
          kode: r.NAMA || 'BT',
          namaPasien: r.NAMA_PASIEN ?? '',
          unit: r.NAMA_UNIT ?? '',
          jenis: r.JENIS === 'tunggal' ? 'tunggal' : 'racikan',
          rm: r.ID_PASIEN != null ? String(r.ID_PASIEN) : '',
        };
        const st = String(r.STATUS).trim();
        if (st === '0') panggilan.push(v);
        else if (st === '1') siapDiambil.push(v);
      }
      return { panggilan, siapDiambil };
    }
    const PANGGILAN_SEL = '#antrian-view';
    const SIAP_SEL = '#antrian-penyerahan';
    function panelHtml(title, rows) {
      const r = rows[0];
      return (
        '<div class="antrian-title">' +
        title +
        '</div><div class="antrian-nomor">' +
        r.kode +
        '-' +
        r.nomor +
        '</div><div class="antrian-rm">' +
        r.namaPasien +
        '</div><div class="antrian-rm">' +
        (r.unit || 'RM : ' + r.rm) +
        '</div><img class="antrian-icon" src="/assets/antrian/assets/img/thumb.svg" alt="icon">'
      );
    }
    function renderDisplay(view) {
      if (view.panggilan.length > 0) {
        const p = document.querySelector(PANGGILAN_SEL);
        if (p) p.innerHTML = panelHtml('Panggilan Farmasi', view.panggilan);
      }
      if (view.siapDiambil.length > 0) {
        const s = document.querySelector(SIAP_SEL);
        if (s) s.innerHTML = panelHtml('Siap Diambil', view.siapDiambil);
      }
    }
    let announcedId = '';
    const synth = window.speechSynthesis;
    const RealSpeak = synth.speak.bind(synth);
    let busy = false;
    let queue = [];
    function next() {
      if (busy || queue.length === 0) return;
      busy = true;
      const text = queue.shift();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        busy = false;
        setTimeout(() => next(), GAP_MS);
      };
      try {
        const u = new SpeechSynthesisUtterance(text);
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
    function speak(text) {
      queue.push(text);
      next();
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
    function ringBell() {
      try {
        const audio = document.getElementById('unine');
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          void audio.play().catch(() => {});
        }
      } catch {}
    }
    function announce(row) {
      const kalimat =
        'Nomor antrian ' +
        numberToWords(row.nomor) +
        ', atas nama ' +
        (row.namaPasien || '') +
        ', silakan menuju farmasi.';
      ringBell();
      setTimeout(() => {
        speak(kalimat);
        speak(kalimat);
      }, CALL_DELAY_MS);
    }
    function unlockTts() {
      const unlock = () => {
        try {
          synth.getVoices();
          RealSpeak.call(synth, new SpeechSynthesisUtterance(''));
        } catch {}
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
      };
      document.addEventListener('pointerdown', unlock);
      document.addEventListener('keydown', unlock);
    }
    let voiceEnabled = false;
    let timer = null;
    let backoff = POLL_MS;
    function schedule() {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => void tick(), backoff);
    }
    async function tick() {
      try {
        const rows = await fetchCallData();
        backoff = POLL_MS;
        const view = normalize(rows);
        if (view.panggilan.length > 0 || view.siapDiambil.length > 0) {
          renderDisplay(view);
        }
        if (voiceEnabled && view.panggilan.length > 0) {
          const { row, signature } = pickAnnounce(
            view.panggilan.map((r) => ({
              ID: r.id,
              NOMOR: r.nomor,
              COUNTER: r.nomor,
              NAMA_PASIEN: r.namaPasien,
            })),
            announcedId,
          );
          if (row && signature) {
            announcedId = signature;
            const hit = view.panggilan.find((x) => x.id === row.ID);
            if (hit) announce(hit);
          }
        }
      } catch (error) {
        backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
        console.warn('[FarmasiDisplay] data_call gagal (backoff ' + backoff + 'ms):', error);
      }
      schedule();
    }
    function startWithRole() {
      voiceEnabled = true;
      unlockTts();
      void tick();
    }
    const gateTimer = setInterval(() => {
      if (document.documentElement.getAttribute('data-ext-antrian-farmasi') === '1') {
        clearInterval(gateTimer);
        startWithRole();
      }
    }, 200);
    setTimeout(() => clearInterval(gateTimer), 8e3);
  })();
})();
//# sourceMappingURL=antrianFarmasiDisplay.js.map
