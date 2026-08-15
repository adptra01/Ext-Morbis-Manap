# Extension Architecture

## URL Gating Architecture

Semua keputusan "apakah feature boleh berjalan di halaman ini?" dipusatkan di `init.ts`, bukan di masing-masing feature.

### Lifecycle Feature

```
init.ts
  │
  ├─ config.enabled?
  ├─ isFeatureAllowed?
  ├─ matchPage(match, ctx)    ← URL gating
  ├─ enabledWhen?(ctx)        ← kondisi bisnis (opsional)
  └─ run()                    ← eksekusi feature
```

### Alur

1. `init.ts` membaca `window.featureModules` — semua feature diregistrasikan di sini saat runtime
2. Untuk setiap feature, `init.ts` mengecek:
   - Apakah config feature enabled?
   - Apakah role user diizinkan?
   - Apakah `matchPage(module.match, ctx)` return true? (URL cocok?)
   - Apakah `enabledWhen?.(ctx)` return true? (kondisi bisnis terpenuhi?)
3. Jika semua lolos, `module.run()` dipanggil

**Feature tidak pernah memutuskan sendiri apakah boleh jalan.** Cukup deklarasikan target halaman via `match`.

### Kenapa URL gating dipusatkan?

- **Konsistensi**: Semua feature pakai evaluator yang sama
- **Auditability**: Regression matrix bisa diverifikasi otomatis
- **Keamanan**: Tidak ada feature yang "bocor" ke halaman yang tidak seharusnya
- **Extensibility**: Feature baru cukup deklarasi `match`, tidak perlu pikirkan URL logic

## FeatureMatch Contract

```typescript
interface FeatureMatch {
  pathname?: string; // Halaman tepat
  prefix?: string; // Halaman + semua turunan
  regex?: RegExp; // Pattern kompleks
  oneOf?: FeatureMatch[]; // Salah satu dari beberapa kondisi
  exclude?: FeatureMatch[]; // Kecualikan halaman tertentu
  requiredSelectors?: string[]; // CSS selector harus ada di DOM
}
```

### Pipeline Evaluator

Evaluator berjalan berurutan sebagai array. Masing-masing return `null` (lanjut) atau `{ matched: false, reason }` (gagal, short-circuit).

```
[0] pathname  →  exact match
[1] prefix    →  startsWith
[2] regex     →  RegExp test
[3] oneOf     →  any alternative matches → recursive evaluate()
[4] exclude   →  none of the alternatives match
[5] selectors →  all CSS selectors exist in DOM
```

Urutan penting: `oneOf` dievaluasi SEBELUM `exclude`, sehingga exclude bisa memfilter hasil positif.

## FeatureContext

```typescript
interface FeatureContext {
  pathname: string; // window.location.pathname (ternormalisasi)
  url: URL; // window.location.href
  document: Document; // window.document
  window: Window; // global window
}
```

Pathname sudah dinormalisasi oleh `normalizePath()` sebelum dimasukkan ke context:

- `""` → `"/"`
- `"/"` → `"/"`
- `"/admisi/"` → `"/admisi"`
- `"/admisi////"` → `"/admisi"`

## Controller Features — Pengecualian

Feature yang menggunakan `document.documentElement.setAttribute(...)` (controller) tetap dikelola langsung di `init.ts` (lines 48-90). Ini adalah pengecualian karena:

- Mereka hanya inject CSS selector ke `<html>`, bukan render UI
- CSS visibility dikelola oleh stylesheet, bukan oleh logika JavaScript
- Tidak ada risiko "bocor" karena selector hanya mempengaruhi tampilan

## Contoh Feature Yang Benar

```typescript
g.featureModules.scrollButtons = {
  id: 'scrollButtons',
  name: 'Scroll Buttons (Top/Bottom)',
  match: { pathname: '/v2/m-klaim/detail-v2-refaktor' },
  run: runScrollButtonsFeature,
};
```

## Contoh Feature Yang SALAH

```typescript
g.featureModules.badFeature = {
  id: 'badFeature',
  name: 'Bad Feature',
  // ❌ TIDAK ADA match — akan jalan di SEMUA halaman
  run: () => {
    // ❌ URL gating di dalam run()
    if (!location.pathname.includes('/admisi/')) return;
    // ...
  },
};
```

## Files

| File                                  | Role                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| `src/init.ts`                         | Gatekeeper — lifecycle, context, evaluator loop               |
| `src/features/shared/featureMatch.ts` | `normalizePath()`, `evaluate()`, `matchPage()`                |
| `src/features/shared/types.ts`        | Interfaces: `FeatureMatch`, `FeatureContext`, `FeatureModule` |
| `scripts/audit-features.mjs`          | Static audit + regression matrix                              |
