# Edge Add-ons — teks submission MORBIS Ext Unofficial

> Salin-tempel ke Partner Center. Product ID: `5604cfef-dfb0-4100-864a-23f880550fe2`

## Short description (listing)

Alat bantu kerja SIMRS MORBIS untuk staf rumah sakit: penanda pre-op, riwayat
resume, antrean farmasi/loket dengan panggilan suara, dan sinkronisasi data
antar-PC melalui server RS. Tanpa iklan, tanpa analitik, tanpa pihak ketiga.

## Privacy policy URL

`https://adptra01.github.io/Ext-Morbis-Manap/docs/privacy.html`
_(pastikan GitHub Pages menayangkan folder docs — ikut deploy-to-main)_

## Notes for certification (tempel tiap submit)

```
Product ID: 5604cfef-dfb0-4100-864a-23f880550fe2
Responding to certification report 09/07/2026 (Pass with required fix):

1. Third-party endpoints REMOVED. The extension no longer contacts Telegram
   Bot API, Cloudflare Workers, or Google Translate TTS. Removed code paths:
   remote error logging (deleted), cloud TTS fallback (deleted).
2. Voice synthesis now runs: (a) on-device (OS voices / local Python service),
   or (b) via our own hospital server GET /api/tts (first-party). No
   third-party host remains in code or manifest permissions.
3. Opt-out in UI: popup toggle "Suara Server Cadangan" (default ON,
   first-party) + per-feature toggles. Privacy policy lists all recipients,
   purposes, and controls.
4. Manifest hardened: removed Firefox-only browser_specific_settings,
   added minimum_chrome_version 114, real author name. No hardcoded
   credentials in the bundle (verified by CI secret-scan gate).
```

## Checklist sebelum tekan Publish

- [ ] `manifest.json` version NAIK dari submission terakhir
- [ ] CI hijau: build + tests + secret-scan gate
- [ ] privacy.html tampil di Pages
- [ ] Tidak ada `browser_specific_settings` / `workers.dev` / `translate_tts` /
      `api.telegram.org` di dalam zip (dicek otomatis oleh workflow)
