# Feature Rules

Dua jenis aturan: untuk **developer** dan untuk **AI agent**.

---

## A. Developer Rules

### Rule 1 — Wajib registrasi via `g.featureModules`

Setiap feature HARUS diregistrasikan melalui:

```typescript
g.featureModules.featureKey = { ... };
```

### Rule 2 — Wajib punya `id`, `match`, `run`

```typescript
interface FeatureModule {
  id: string; // unique identifier
  match: FeatureMatch; // target halaman
  run: () => void; // eksekusi feature
}
```

Ketiganya mandatory — TypeScript enforce.

### Rule 3 — Dilarang URL gating di dalam `run()`

❌ SALAH:

```typescript
run() {
  if (!location.pathname.includes('/admisi/')) return;
  ...
}
```

✅ BENAR — URL gating via `match`:

```typescript
match: { prefix: '/admisi/' },
run() { ... }
```

### Rule 4 — Gunakan Field `match` yang Tepat

| Kondisi                     | Field               |
| --------------------------- | ------------------- |
| Halaman tepat               | `pathname`          |
| Halaman + turunan           | `prefix`            |
| Pattern kompleks            | `regex`             |
| Beberapa halaman            | `oneOf`             |
| Kecualikan halaman tertentu | `exclude`           |
| Elemen DOM harus ada        | `requiredSelectors` |

### Rule 5 — Feature hanya baca DOM setelah lolos `matchPage()`

Jangan membaca DOM sebelum `init.ts` memutuskan feature boleh jalan. Jika `enabledWhen(ctx)` butuh info DOM, gunakan `ctx.document`.

### Rule 6 — Utility tidak boleh bergantung pada `location.pathname`

Fungsi utility (shared helpers) jangan membaca `window.location.pathname` langsung. Terima pathname sebagai parameter.

### Rule 7 — Feature baru harus lolos

```bash
npm test        # unit test
npm run audit   # static audit + regression
npm run build   # compile
```

### Rule 8 — Gunakan `enabledWhen(ctx)` untuk kondisi di luar URL

Jika butuh kondisi tambahan selain URL (query parameter, state aplikasi, data DOM), gunakan:

```typescript
enabledWhen(ctx) {
  return ctx.url.searchParams.has('mode') ||
         ctx.document.querySelector('#special-section') !== null;
}
```

**`enabledWhen()` tidak boleh mengecek `pathname`, `location`, atau URL.** Gunakan `match` untuk itu.

### Rule 9 — Perbarui regression matrix

Jika menambah/mengubah `match` feature, perbarui `EXPECTED_MATRIX` di `scripts/audit-features.mjs`.

### Rule 10 — Naming convention

- `id`: camelCase, sama dengan key registrasi
- `name`: Human-readable, bahasa Indonesia
- `match.pathname`/`prefix`: string literal, diawali `/`

---

## B. AI Agent Rules

### Rule A1 — Cari registrasi yang sudah ada

Sebelum membuat feature baru, cari pola `g.featureModules` di file lain untuk referensi.

### Rule A2 — Jangan buat URL gate di dalam `run()`

Semua URL matching melalui `match`. Tidak boleh ada `location.pathname.includes(...)` di dalam `run()`.

### Rule A3 — Jangan akses `location`/`window.location` langsung

Gunakan `ctx` dari `FeatureContext`.

### Rule A4 — Jangan ubah `matchPage()` tanpa update audit

Jika menambah field ke `FeatureMatch` atau mengubah pipeline evaluator, perbarui `EXPECTED_MATRIX` dan regression scenarios.

### Rule A5 — Jalankan audit sebelum selesai

```bash
npm run audit
```

Pastikan 110/110 regression PASS dan 0 legacy gates.

### Rule A6 — FeatureMatch fields punya urutan evaluasi

Pipeline: `pathname` → `prefix` → `regex` → `oneOf` → `exclude` → `requiredSelectors`. Jika suatu field tidak dibutuhkan, hapus dari match config.

### Rule A7 — `oneOf` boleh nested

`oneOf` bisa berisi `oneOf` lagi (evaluasi recursive).

### Rule A8 — `exclude` hanya untuk filtering, bukan positive match

`exclude` memfilter hasil dari `pathname`/`prefix`/`regex`/`oneOf`. Jangan pakai `exclude` sebagai satu-satunya match criterion.
