// Probe TTS: load extension (dist), buka halaman display, trigger TTS via
// jalur yang sama persis dengan kiosk, cek respon worker.
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXT_PATH = path.resolve('/mnt/DiskD/Projects/Ext-Morbis-Manap/dist');
const BASE = 'http://103.147.236.140';
const DISPLAY_URL = BASE + '/public/antrian-farmasi-v2/view-call-websocet-v2';

const results = { bridge: false, sw: false, worker: false, audio: false, logs: [] };

async function main() {
  const context = await chromium.launchPersistentContext('/tmp/pw-tts-probe', {
    headless: false,
    executablePath:
      '/mnt/DiskD/Workspace/Applications/misc/cache/ms-playwright/chromium-1234/chrome-linux64/chrome',
    args: [
      `--disable-extensions-except=${EXT_PATH}`,
      `--load-extension=${EXT_PATH}`,
      '--autoplay-policy=no-user-gesture-required',
      '--no-sandbox',
    ],
  });

  const page = await context.newPage();
  page.on('console', (msg) => {
    const t = msg.text();
    if (t.includes('[AFD]') || t.includes('[TTS]') || t.includes('[Bridge]')) {
      results.logs.push(t);
      console.log('  [CONSOLE]', t);
    }
  });
  page.on('pageerror', (e) => console.log('  [PAGEERROR]', e.message));

  // 1. Cek apakah extension ter-load: query service worker
  const sws = context.serviceWorkers();
  console.log('Service workers saat init:', sws.length);

  // 2. Buka display page
  console.log('\n1. Buka display page...');
  await page.goto(DISPLAY_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // 3. Cek apakah content script display + bridge ter-inject
  const injected = await page
    .evaluate(() => ({
      hasAFD: !!window.__AFD_MARKER__ || typeof window.announce === 'function',
      hasBridge: !!window.__MORBIS_BRIDGE__,
    }))
    .catch(() => ({ hasAFD: false, hasBridge: false }));
  results.bridge = injected.hasBridge;
  console.log('  injected:', JSON.stringify(injected));

  // 4. Cek voices speechSynthesis
  const voices = await page.evaluate(() => speechSynthesis.getVoices().length).catch(() => -1);
  console.log('  speechSynthesis voices:', voices);

  // 5. Trigger TTS lewat postMessage persis seperti speakLocalService
  console.log('\n2. Trigger TTS_REQUEST via postMessage (jalur bridge→SW)...');
  const tts = await page.evaluate(
    (text) =>
      new Promise((resolve) => {
        const reqId = 'probe-' + Date.now();
        const timer = setTimeout(() => resolve({ ok: false, reason: 'timeout-10s' }), 10000);
        const onResult = (ev) => {
          const d = ev.data;
          if (
            d &&
            d.source === 'MORBIS-FARMASI-BRIDGE' &&
            d.type === 'TTS_RESULT' &&
            d.id === reqId
          ) {
            clearTimeout(timer);
            window.removeEventListener('message', onResult);
            resolve({
              ok: d.ok,
              reason: d.reason || '',
              bytes: d.data ? d.data.length : 0,
              mime: d.mime || '',
            });
          }
        };
        window.addEventListener('message', onResult);
        window.postMessage({ source: 'MORBIS-FARMASI', type: 'TTS_REQUEST', id: reqId, text }, '*');
      }),
    'Nomor antrian T dua belas, atas nama Vir',
  );
  results.sw = tts.ok;
  console.log('  TTS via bridge→SW:', JSON.stringify(tts));

  // 6. Test jalur Layer 4 display langsung (worker fetch)
  console.log('\n3. Test worker fetch langsung dari halaman (Layer 4)...');
  const w = await page.evaluate(async (text) => {
    try {
      const url =
        'https://morbis-antrian-relay.testingbae66.workers.dev/?text=' +
        encodeURIComponent(text) +
        '&lang=id';
      const r = await fetch(url, { mode: 'cors' });
      const buf = await r.arrayBuffer();
      return {
        ok: r.ok,
        status: r.status,
        mime: r.headers.get('content-type'),
        bytes: buf.byteLength,
      };
    } catch (e) {
      return { ok: false, err: String(e).slice(0, 120) };
    }
  }, 'Nomor antrian T dua belas');
  results.worker = w.ok;
  console.log('  worker direct fetch:', JSON.stringify(w));

  // 7. Audio playback test: mainkan blob dari worker
  if (w.ok && w.bytes > 0) {
    console.log('\n4. Test audio playback dari blob worker...');
    const a = await page.evaluate(async (text) => {
      try {
        const url =
          'https://morbis-antrian-relay.testingbae66.workers.dev/?text=' +
          encodeURIComponent(text) +
          '&lang=id';
        const r = await fetch(url);
        const blob = await r.blob();
        const objUrl = URL.createObjectURL(blob);
        return await new Promise((resolve) => {
          const audio = new Audio(objUrl);
          const t = setTimeout(() => resolve({ ok: false, reason: 'timeout-8s' }), 8000);
          audio.oncanplay = () => {
            audio
              .play()
              .then(() => {
                setTimeout(() => {
                  clearTimeout(t);
                  audio.pause();
                  resolve({ ok: true, played: true, duration: audio.duration });
                }, 500);
              })
              .catch((e) => {
                clearTimeout(t);
                resolve({ ok: false, reason: 'play-rejected ' + String(e).slice(0, 80) });
              });
          };
          audio.onerror = () => {
            clearTimeout(t);
            resolve({ ok: false, reason: 'audio-error' });
          };
          audio.load();
        });
      } catch (e) {
        return { ok: false, reason: String(e).slice(0, 100) };
      }
    }, 'Nomor antrian T dua belas');
    results.audio = a.ok;
    console.log('  audio playback:', JSON.stringify(a));
  }

  await context.close();
  console.log('\n=== RESULT ===');
  console.log(JSON.stringify(results, null, 1));
  process.exit(0);
}

main().catch((e) => {
  console.error('PROBE FAILED:', e);
  process.exit(1);
});
