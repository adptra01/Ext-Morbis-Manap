# Code Review Checklist

Gunakan checklist ini untuk setiap PR yang melibatkan perubahan pada feature extension.

---

## Feature Registration

- [ ] `id` ada dan unik
- [ ] `match` ada (required)
- [ ] `match` menggunakan field yang tepat (`pathname` / `prefix` / `oneOf` / `regex`)
- [ ] `run` ada (required)
- [ ] Registrasi melalui `g.featureModules.xxx = { ... }`
- [ ] `name` diisi (human-readable)
- [ ] `description` diisi (opsional tapi disarankan)

## URL Gating

- [ ] Tidak ada `location.pathname` / `location.href` di dalam `run()`
- [ ] Tidak ada `.includes(` / `.startsWith(` / `.match(` untuk URL checking di `run()`
- [ ] Tidak ada `window.location` di dalam `run()`
- [ ] Tidak ada `ctx.pathname` atau `ctx.url` yang digunakan sebagai gate di `run()`
- [ ] Jika ada `enabledWhen`, tidak mengandung pengecekan pathname/location

## enabledWhen

- [ ] `enabledWhen` hanya untuk kondisi bisnis (query params, DOM state, dll)
- [ ] `enabledWhen` TIDAK mengecek `pathname`/`location`/URL
- [ ] `enabledWhen` dipanggil setelah `matchPage` di `init.ts`

## Regression

- [ ] Regression matrix di-update jika match config berubah
- [ ] `npm run audit` PASS (110/110)
- [ ] Tidak ada dead features (feature yang tidak match URL manapun)

## Build & Test

- [ ] `npm test` PASS
- [ ] `npm run build` PASS
- [ ] `npm run audit` PASS
- [ ] `npx tsc --noEmit` 0 errors

## Dokumentasi

- [ ] Jika feature baru: tambahkan aturan yang relevan di docs
- [ ] Jika mengubah arsitektur: update `docs/extension-architecture.md`
