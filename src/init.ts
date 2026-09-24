import type { ExtensionConfig, CustomUrl, Role, FeatureModule, FeatureContext } from './types.js';
import { matchPage, normalizePath } from './features/shared/featureMatch.js';
import { logUsage } from './features/shared/usageLog.js';

declare global {
  interface Window {
    featureModules: Record<string, FeatureModule>;
    ExtensionCore: {
      ROLES: Record<string, Role>;
      getCurrentRole: () => Role;
      setCurrentRole: (role: Role) => Promise<Role>;
      isFeatureAllowed: (featureKey: string, role?: Role) => boolean;
      getConfig: () => ExtensionConfig | null;
    };
    currentConfig: ExtensionConfig | null;
    isExtensionEnabled: boolean;
    loadConfig: () => Promise<ExtensionConfig>;
    loadCustomUrls: () => Promise<CustomUrl[]>;
    log: (...args: unknown[]) => void;
    OpenDetailExtension: {
      getConfig: () => ExtensionConfig | null;
      getFeatures: () => Record<string, FeatureModule>;
      isEnabled: () => boolean;
      refresh: () => Promise<void>;
    };
  }
}

async function initExtension(): Promise<void> {
  window.log('Menginisialisasi Open Detail Extension (Modular)');

  await window.loadConfig();
  const customUrls = await window.loadCustomUrls();

  if (!window.isExtensionEnabled) {
    window.log('Extension disabled globally, skipping all features');
    return;
  }

  const currentHost = window.location.origin;
  const isAllowedUrl = customUrls.some((url) => url.enabled && currentHost.startsWith(url.url));

  if (!isAllowedUrl) {
    window.log('URL tidak ada dalam daftar diizinkan, skip semua fitur');
    return;
  }

  const path = window.location.pathname.toLowerCase();
  const loginPaths = ['/login', '/auth', '/signin', '/masuk', '/keluar', '/logout'];
  const hasPwField = document.querySelectorAll('input[type="password"]').length > 0;
  if (loginPaths.some((p) => path.includes(p)) || hasPwField) {
    window.log('Halaman login terdeteksi, skip semua fitur');
    return;
  }

  const cfg = window.currentConfig;
  const fixJasaCfg = cfg?.features?.fixJasaPelayanan;
  if (fixJasaCfg?.enabled && window.ExtensionCore.isFeatureAllowed('fixJasaPelayanan')) {
    document.documentElement.setAttribute('data-ext-fix-jasa', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-fix-jasa');
  }

  const consulCfg = cfg?.features?.consultationEnhancer;
  if (consulCfg?.enabled && window.ExtensionCore.isFeatureAllowed('consultationEnhancer')) {
    document.documentElement.setAttribute('data-ext-consul-enhancer', '1');
    document.documentElement.setAttribute('data-ext-base-url', chrome.runtime.getURL('/'));
  } else {
    document.documentElement.removeAttribute('data-ext-consul-enhancer');
    document.documentElement.removeAttribute('data-ext-base-url');
  }

  const rvCfg = cfg?.features?.resumeValidator;
  const rvOn = !!rvCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeValidator');
  if (rvOn) {
    document.documentElement.setAttribute('data-ext-resume-validator', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-resume-validator');
  }

  // Riwayat resume jalan sendiri: aktif bila fitur resumeHistory nyala,
  // ATAU bila validator nyala (kompatibel lama — validator selalu bawa riwayat).
  const rhCfg = cfg?.features?.resumeHistory;
  const rhOn = (!!rhCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeHistory')) || rvOn;
  if (rhOn) {
    document.documentElement.setAttribute('data-ext-resume-history', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-resume-history');
  }

  const atCfg = cfg?.features?.antrianTools;
  if (atCfg?.enabled && window.ExtensionCore.isFeatureAllowed('antrianTools')) {
    document.documentElement.setAttribute('data-ext-antrian-tools', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-antrian-tools');
  }

  const afCfg = cfg?.features?.antrianFarmasi;
  if (afCfg?.enabled && window.ExtensionCore.isFeatureAllowed('antrianFarmasi')) {
    document.documentElement.setAttribute('data-ext-antrian-farmasi', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-antrian-farmasi');
  }

  // Suara server cadangan (display farmasi + loket): '1' nyala, '0' mati.
  // SELALU tulis eksplisit (jangan removeAttribute): pembaca MAIN-world
  // membedakan mati lewat nilai '0'; atribut hilang = nyala (kompatibel
  // mundur). First-party server RS, bukan pihak ketiga.
  const tsCfg = cfg?.features?.ttsServer;
  if (!tsCfg || tsCfg.enabled) {
    document.documentElement.setAttribute('data-ext-tts-server', '1');
  } else {
    document.documentElement.setAttribute('data-ext-tts-server', '0');
  }

  const peCfg = cfg?.features?.penerimaanExport;
  if (peCfg?.enabled && window.ExtensionCore.isFeatureAllowed('penerimaanExport')) {
    document.documentElement.setAttribute('data-ext-penerimaan-export', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-penerimaan-export');
  }

  const ttvCfg = cfg?.features?.ttvEditor;
  if (ttvCfg?.enabled && window.ExtensionCore.isFeatureAllowed('ttvEditor')) {
    document.documentElement.setAttribute('data-ext-ttv-editor', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-ttv-editor');
  }

  const rmCfg = cfg?.features?.resumeModal;
  if (rmCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeModal')) {
    document.documentElement.setAttribute('data-ext-resume-modal', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-resume-modal');
  }

  const rrCfg = cfg?.features?.resumeRanap;
  if (rrCfg?.enabled && window.ExtensionCore.isFeatureAllowed('resumeRanap')) {
    document.documentElement.setAttribute('data-ext-resume-ranap', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-resume-ranap');
  }

  const lhCfg = cfg?.features?.labHistory;
  if (lhCfg?.enabled && window.ExtensionCore.isFeatureAllowed('labHistory')) {
    document.documentElement.setAttribute('data-ext-lab-history', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-lab-history');
  }

  const lkCfg = cfg?.features?.laporanKasirTime;
  if (lkCfg?.enabled && window.ExtensionCore.isFeatureAllowed('laporanKasirTime')) {
    document.documentElement.setAttribute('data-ext-laporan-kasir-time', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-laporan-kasir-time');
  }

  const cbCfg = cfg?.features?.cancelBatal;
  console.log('[CancelBatal] init check - cfg?.features?.cancelBatal:', cbCfg);
  if (cbCfg?.enabled && window.ExtensionCore.isFeatureAllowed('cancelBatal')) {
    document.documentElement.setAttribute('data-ext-cancel-batal', '1');
    console.log('[CancelBatal] ENABLED - attribute set to 1');
  } else {
    document.documentElement.removeAttribute('data-ext-cancel-batal');
    console.log(
      '[CancelBatal] DISABLED or not allowed - attribute removed, enabled:',
      cbCfg?.enabled,
      'isFeatureAllowed:',
      window.ExtensionCore?.isFeatureAllowed('cancelBatal'),
    );
  }

  const trCfg = cfg?.features?.telaahResep;
  if (trCfg?.enabled && window.ExtensionCore.isFeatureAllowed('telaahResep')) {
    document.documentElement.setAttribute('data-ext-telaah', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-telaah');
  }

  const baCfg = cfg?.features?.billingAdjustment;
  if (baCfg?.enabled && window.ExtensionCore.isFeatureAllowed('billingAdjustment')) {
    document.documentElement.setAttribute('data-ext-billing-adj', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-billing-adj');
  }

  const paCfg = cfg?.features?.paLabPrint;
  if (paCfg?.enabled && window.ExtensionCore.isFeatureAllowed('paLabPrint')) {
    document.documentElement.setAttribute('data-ext-pa-print', '1');
  } else {
    document.documentElement.removeAttribute('data-ext-pa-print');
  }

  const ctx: FeatureContext = {
    pathname: normalizePath(window.location.pathname),
    url: new URL(window.location.href),
    document: window.document,
    window: window,
  };

  // Global print CSS: sembunyikan elemen ekstensi (color picker, toolbar, dll)
  // agar tidak ikut tercetak. Pencegahan permanen utk semua halaman.
  {
    const s = document.createElement('style');
    s.id = 'ext-print-css';
    s.textContent = `@media print{
#color_picker,#weStylesheet,aside,.color_ctx_menu,
[data-toolbar],[data-shortcut-buttons],[data-back-to-detail-klaim],
.no-print,.hilang-saat-print,.ext-btn,.ext-badge,
.ext-op-actions,.ext-antrian-tools,.ext-display-tools{
  display:none!important;height:0!important;width:0!important;
  margin:0!important;padding:0!important;overflow:hidden!important;
  visibility:hidden!important;position:absolute!important;
  top:-9999px!important;left:-9999px!important;opacity:0!important;
}
/* APP men-set pointer-events: none (inline, via JS) pada input .autocomplete.
   Klik di form modal tembus ke wrapper -> fokus tak masuk input -> "gak bisa
   input". Fix via CSS <style> tak cukup: APP menghapus style tag ekstensi.
   Inline style + !important menang atas inline APP & stylesheet apa pun. */
#data-modal.in input, #data-modal.in textarea, #data-modal.in select {
  pointer-events: auto !important;
}
}`;
    document.head.appendChild(s);
  }

  for (const [key, module] of Object.entries(window.featureModules)) {
    const featureConfig = cfg?.features?.[key];

    if (
      featureConfig === undefined ||
      !featureConfig.enabled ||
      !window.ExtensionCore.isFeatureAllowed(key)
    ) {
      logUsage(
        key,
        'skip',
        true,
        'disabled or not allowed for role ' + window.ExtensionCore.getCurrentRole(),
      );
      window.log(
        `Feature ${key} skipped: disabled or not allowed for role ${window.ExtensionCore.getCurrentRole()}`,
      );
      continue;
    }

    if (!matchPage(module.match, ctx)) {
      logUsage(key, 'skip', true, 'URL mismatch');
      window.log(`Feature ${key} skipped: URL mismatch`);
      continue;
    }

    if (module.enabledWhen && !module.enabledWhen(ctx)) {
      logUsage(key, 'skip', true, 'enabledWhen returned false');
      window.log(`Feature ${key} skipped: enabledWhen returned false`);
      continue;
    }

    window.log(`Running feature: ${module.name}`);
    logUsage(key, 'run', true, module.name);
    try {
      module.run();
    } catch (error) {
      console.error(`[OpenDetail Extension] Error running feature ${key}:`, error);
      logUsage(key, 'run', false, error instanceof Error ? error : String(error));
    }
  }

  window.log('Extension initialized successfully');

  watchStuckLoadingModal();
  injectFetchWatchdogToMainWorld();
  watchDataModalUnblock();
}

// Watchdog: modal loading MORBIS (swalloading -> swal "Mohon Tunggu") ditutup APP
// via swal.close() setelah SEMUA partial selesai (Promise.all di loadFiles()).
// Kalau satu fetch partial hang (tanpa timeout), modal tak pernah hilang dan
// menutupi halaman -> "gak bisa klik". Tutup dari sisi DOM saja (isolated world
// tak punya akses window.swal milik halaman).
function watchStuckLoadingModal(): void {
  const STUCK_MS = 20000;
  const SELECTOR = '.sweet-overlay, .sweet-alert, .swal-overlay, .swal2-container';
  let firstSeenTs = 0;

  const timer = window.setInterval(() => {
    const modal = document.querySelector<HTMLElement>(SELECTOR);
    if (!modal) {
      firstSeenTs = 0;
      return;
    }
    const text = modal.textContent || '';
    if (!/mohon tunggu|menyiapkan data|sedang memuat/i.test(text)) {
      firstSeenTs = 0;
      return;
    }
    const now = Date.now();
    if (!firstSeenTs) firstSeenTs = now;
    if (now - firstSeenTs < STUCK_MS) return;
    // ponytail: ambang 20s, cukup untuk load normal; naikkan jika APP sah > 20s
    clearInterval(timer);
    hideStuckLoadingModal();
  }, 2000);
}

function hideStuckLoadingModal(): void {
  const SELECTOR = '.sweet-overlay, .sweet-alert, .swal-overlay, .swal2-container';
  // HAPUS total (bukan display:none): elemen swal macet yang cuma disembunyikan
  // masih ketemu document.querySelector → modalVisible() fetchWatchdog salah true
  // → semua GET berikutnya (mis. .load() form revisi) ikut di-wrap/di-abort.
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    el.remove();
  });
  const loadingModal = document.getElementById('loading-baru');
  if (loadingModal) loadingModal.style.display = 'none';
  document.body.style.overflow = '';
}

// Halaman detail m-klaim: selama modal #data-modal terbuka (revisi/upload), partial
// script APP bisa memanggil swalloading() lagi → overlay sweetalert (z-index 10000,
// sama dengan modal, tapi lebih belakangan di DOM → selalu di atas) menutupi modal
// → klik/kursor nyangkut di overlay → "gak bisa input form modal". Interval kecil:
// buang overlay yang teksnya pola loading, dan reset aria-hidden di modal (bootstrap
// 3.3.6 APP hardcode aria-hidden=true permanen → warning console + bingung SR).
function watchDataModalUnblock(): void {
  if (!window.location.pathname.includes('/detail-v2-refaktor')) return;
  const LOADING_RE = /mohon tunggu|menyiapkan data|sedang memuat/i;
  window.setInterval(() => {
    const modal = document.getElementById('data-modal');
    if (!modal || !modal.classList.contains('in')) return;
    if (modal.getAttribute('aria-hidden') === 'true') modal.removeAttribute('aria-hidden');
    // APP set pointer-events:none inline (via JS) pada input .autocomplete →
    // klik tembus ke wrapper, fokus tak masuk → "gak bisa input". Inline
    // + !important mengalahkan inline APP. getComputedStyle → idempoten.
    modal.querySelectorAll<HTMLElement>('input, textarea, select').forEach((el) => {
      if (getComputedStyle(el).pointerEvents === 'none') {
        el.style.setProperty('pointer-events', 'auto', 'important');
      }
    });
    document
      .querySelectorAll<HTMLElement>('.sweet-overlay, .swal-overlay, .swal2-container')
      .forEach((el) => {
        if (LOADING_RE.test(el.textContent || '')) el.remove();
      });
  }, 500);
}

// Inject fetchWatchdog.js ke MAIN world di halaman detail m-klaim: membatasi
// durasi tiap GET partial (abort 15s) + kabari isolated world saat seluruh
// request selesai (__extPartialSettled) agar modal ditutup seketika, bukan
// nunggu ambang 20s watchdog.
function injectFetchWatchdogToMainWorld(): void {
  if (!window.location.pathname.includes('/detail-v2-refaktor')) return;
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('features/fetchWatchdog.js');
  script.onload = () => {
    console.log('[init] fetchWatchdog.js injected to MAIN world');
  };
  script.onerror = (err) => {
    console.error('[init] fetchWatchdog.js injection failed:', err);
  };
  (document.head || document.documentElement).appendChild(script);
}

// Global error handler: tangkap error tak terduga di halaman + bridge log dari
// script world:"MAIN" (yang TIDAK punya akses chrome.storage, mis. antrianTools).
// MAIN world kirim window.postMessage({__extUsageLog: {...}}) -> diteruskan ke logUsage.
window.addEventListener('message', (event: MessageEvent) => {
  // Hanya proses pesan dari konteks halaman itu sendiri (MAIN world: antrianTools,
  // fetchWatchdog). Cek origin + source → skrip asing (iframe/popup/domain lain)
  // tidak bisa memalsukan entry usage-log ke storage extension / menutup modal.
  if (event.origin !== window.location.origin) return;
  if (event.source !== window) return;
  const data = event.data as {
    __extUsageLog?: { feature?: string; event?: string; ok?: boolean; detail?: unknown };
    __extPartialSettled?: boolean;
  } | null;
  // MAIN world (fetchWatchdog): semua GET partial selesai (abort/error/ok) tapi
  // modal masih tampil → tutup seketika, bukan nunggu ambang watchdog.
  if (data?.__extPartialSettled) {
    hideStuckLoadingModal();
    return;
  }
  const entry = data?.__extUsageLog;
  if (!entry || !entry.feature) return;
  logUsage(entry.feature, entry.event ?? 'event', entry.ok ?? true, entry.detail);
});

window.addEventListener('error', (event: ErrorEvent) => {
  logUsage('global', 'error', false, `${event.message} @ ${event.filename}:${event.lineno}`);
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const reason = event.reason;
  logUsage(
    'global',
    'unhandledrejection',
    false,
    reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason ?? 'unknown'),
  );
});

// Workaround: inject antrianTools.js secara programmatic ke MAIN world untuk halaman
// mesin-antrian/view-antrian/counter. Chrome kadang gagal auto-inject MAIN world
// content_script (document_idle) di beberapa environment — inject manual dari ISOLATED
// world (init.ts) yang sudah pasti jalan lebih reliable.
// Aman berjalan berdampingan dgn entry manifest content_scripts: IIFE antrianTools
// punya guard global __extAntrianToolsLoaded → script kedua langsung batal, jadi
// UI/polling/TTS tetap satu instance (tanpa double init).
function injectAntrianToolsToMainWorld(): void {
  const path = window.location.pathname;
  const needsAntrianTools =
    path.includes('/mesin-antrian') ||
    path.includes('/counter-antrian/view-antrian') ||
    path.includes('/counter-antrian/counter');

  if (!needsAntrianTools) return;

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('features/antrianTools.js');
  script.onload = () => {
    console.log('[init] antrianTools.js injected to MAIN world');
  };
  script.onerror = (err) => {
    console.error('[init] antrianTools.js injection failed:', err);
    logUsage('init', 'antrian_tools_inject_failed', false, { error: String(err) });
  };
  (document.head || document.documentElement).appendChild(script);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initExtension();
    injectAntrianToolsToMainWorld();
  });
} else {
  initExtension();
  injectAntrianToolsToMainWorld();
}

window.OpenDetailExtension = {
  getConfig: () => window.currentConfig,
  getFeatures: () => window.featureModules,
  isEnabled: () => window.isExtensionEnabled,
  refresh: async () => {
    await window.loadConfig();
    initExtension();
  },
};
