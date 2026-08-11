# Graph Report - Ext-Morbis-Manap  (2026-08-11)

## Corpus Check
- 151 files · ~106,778 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1742 nodes · 2411 edges · 162 communities (130 shown, 32 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01ad027c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cpptSearchFilter.ts
- batchUploadUrl.ts
- resumeRanapTab/App.tsx
- ponytail-activate.js
- manifest.json
- scripts
- filterPersistence.ts
- resumeValidator.ts
- legacy.ts
- MorbisSession
- sidepanel/App.tsx
- button.tsx
- toolbar.ts
- antrianTools.ts
- resumeTab/App.tsx
- penerimaan_resep/main.ts
- resumeTab/mount.tsx
- compilerOptions
- build.mjs
- popup/StatusCard.tsx
- components.json
- include
- background.ts
- src/types.ts
- popup.js
- popup/App.tsx
- core.ts
- filterPersistence.ts
- audit-features.mjs
- openDetail.ts
- sidepanel/StatusCard.tsx
- cookieFilterStorage.ts
- asset-master.js
- persistence-check.js
- core.js
- exclude
- manifest-auditor.js
- pack.mjs
- devDependencies
- shared/utils.ts
- background.js
- resumeTab/types.ts
- ErrorBoundary
- ErrorBoundary
- TindakanSection.tsx
- audit.mjs
- lib
- deploy.mjs
- Header.tsx
- class-variance-authority
- clsx
- esbuild
- eslint
- @eslint/js
- globals
- husky
- lint-staged
- lucide-react
- prettier
- @radix-ui/react-select
- @radix-ui/react-switch
- rimraf
- tailwind-merge
- tailwindcss
- tailwindcss-animate
- @types/chrome
- @types/react
- @types/react-dom
- typescript
- typescript-eslint
- vite
- vite-plugin-static-copy
- vitest
- types
- Resume Validator
- A. Developer Rules
- Tombol Scroll
- Tombol Shortcut
- Panduan Penggunaan untuk Staf RS
- Persistensi Filter
- Sederhanakan Penagihan
- Mode Open Detail
- MORBIS Extension Rewrite Audit: Migration vs Dev Branch
- Duplikasi Data ICD Diagnosis & Tindakan saat Input/Edit
- Extension Architecture
- <img src="icons/bluemorbis48.png" width="36" style="vertical-align: middle;"> MORBIS Ext Unofficial
- 3. Extension Build Requirements
- scripts
- Optimasi Cetak (Print Optimization)
- 4. Optimization & Reliability
- 1. Recommended MCP Skills
- Ponytail
- Code Review Checklist
- 2. Architecture Design
- 6. Implementation Roadmap
- UI Modernization Analysis — MORBIS Extension
- Morbis Ext Unofficial — MCP Architecture & Extension Build Strategy
- Open Detail in New Tab - Dokumentasi Ekstensi Browser
- Fitur
- 15. Final Recommendation
- agent-browser.json
- 5. Tradeoff Analysis
- 11. Migration Strategy
- 4. Styling System Deep Dive
- cancelButton.ts
- Batch Features Refactor
- Arsitektur Teknis
- Pengembangan & Kustomisasi
- 2. Component Inventory
- 5. State Management Architecture
- Morbis DevTools MCP Server
- ConsultationInfoPanel.tsx
- Verifikasi End-to-End Phase 1–3B (Antrian Global)
- 10. Key Findings by Category
- 11. Risk Assessment
- 12. Recommendations (Priority Order)
- 2. Architecture Comparison
- 3. Storage System Comparison
- 4. Messaging System Comparison
- 5. React Architecture (Migration Only)
- 6. Build System Comparison
- Instalasi & Setup
- Dukungan & Maintenance
- Changelog
- Kompatibilitas
- Keamanan & Privasi
- Panduan Penggunaan
- 12. Component Mapping
- 13. Safe Implementation Plan
- 1. Architecture Overview
- 3. Component Duplication Analysis
- 6. Browser API Integration
- 7. TypeScript & Type Safety
- Opsi Konfigurasi
- 14. Files Impact Report
- 7. Risk Matrix
- 8. Accessibility Review
- 9. Key Constraints & Insights
- VitalSignsSection.tsx
- AGENTS.md
- 14. Dependency Analysis
- icons/README.md
- Role
- shortcutButtons.ts
- scrollButtons.ts
- UsageLogPanel.tsx
- class-variance-authority
- storage.ts
- tryInject
- InfoBanner.tsx
- autoprefixer

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 23 edges
2. `Role` - 22 edges
3. `MORBIS Extension Rewrite Audit: Migration vs Dev Branch` - 20 edges
4. `UI Modernization Analysis — MORBIS Extension` - 20 edges
5. `scripts` - 19 edges
6. `include` - 18 edges
7. `init()` - 17 edges
8. `CustomUrl` - 17 edges
9. `renderToolbar()` - 16 edges
10. `Panduan Deployment MORBIS Ext Unofficial` - 16 edges

## Surprising Connections (you probably didn't know these)
- `initExtension()` --references--> `ExtensionCore`  [EXTRACTED]
  init.js → src/core.ts
- `DiagnosaSection()` --references--> `id`  [EXTRACTED]
  src/features/resumeTab/DiagnosaSection.tsx → manifest.json
- `TindakanSection()` --references--> `id`  [EXTRACTED]
  src/features/resumeTab/TindakanSection.tsx → manifest.json
- `ConsEnhancerApp()` --references--> `react`  [EXTRACTED]
  src/features/consultationEnhancer/ConsEnhancerApp.tsx → package.json
- `syncUrlParams()` --indirect_call--> `val()`  [INFERRED]
  src/features/cpptSearchFilter.ts → src/features/resumeValidator.ts

## Import Cycles
- None detected.

## Communities (162 total, 32 thin omitted)

### Community 0 - "cpptSearchFilter.ts"
Cohesion: 0.17
Nodes (21): applyFilters(), CpptFilterState, CpptPageType, findCpptTables(), g, getColumnIndex(), getCpptPageType(), getDataRows() (+13 more)

### Community 1 - "batchUploadUrl.ts"
Cohesion: 0.08
Nodes (57): BATCH_DELETE_CONFIG, closeBatchDeleteModal(), crawlDokumenPasienDelete(), crawlDokumenPasienDeleteToSidepanel(), deleteDokumen(), DeleteItem, deleteQueue, deleteSingleFromQueue() (+49 more)

### Community 2 - "resumeRanapTab/App.tsx"
Cohesion: 0.06
Nodes (30): App(), CARA_KELUAR, dangerBtn, Hitt, IcdAutocomplete(), inputBase, JENIS_KASUS, KEADAAN_KELUAR (+22 more)

### Community 3 - "ponytail-activate.js"
Cohesion: 0.07
Nodes (41): claudeDir, {
  clearMode,
  isCodex,
  setMode,
  writeHookOutput,
}, fs, { getDefaultMode, getClaudeDir }, { getPonytailInstructions }, mode, output, path (+33 more)

### Community 4 - "manifest.json"
Cohesion: 0.05
Nodes (36): action, default_popup, default_title, author, background, service_worker, browser_specific_settings, gecko (+28 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (34): allowScripts, esbuild@0.28.1, dependencies, react-dom, description, engines, node, lint-staged (+26 more)

### Community 6 - "filterPersistence.ts"
Cohesion: 0.09
Nodes (33): attachFilterListeners(), BILLING_FILTER_CONFIG, BillingFilterConfig, clearFilter(), g, isBillingVerifikasiPage(), restoreFilter(), runBillingFilterPersistence() (+25 more)

### Community 7 - "resumeValidator.ts"
Cohesion: 0.12
Nodes (36): addRequiredAttributes(), attachSaveHandler(), autoExpandTextareas(), buildICD10Fields(), buildICD9Fields(), checkAndLockForm(), checkSession(), clearErrors() (+28 more)

### Community 8 - "legacy.ts"
Cohesion: 0.09
Nodes (27): react, react, check, Props, ConsEnhancerApp(), ConsInfoTabs(), Props, TABS (+19 more)

### Community 9 - "MorbisSession"
Cohesion: 0.11
Nodes (17): Client, analyze_feature(), diff_dom(), get_feature_source(), MorbisSession, Morbis DevTools MCP Server  MCP server untuk development dan debugging Morbis Ex, Scrape halaman Morbis HIS dengan session management otomatis.      Args:, Read the current extension configuration and feature list.      Returns: (+9 more)

### Community 10 - "sidepanel/App.tsx"
Cohesion: 0.15
Nodes (14): App(), DEFAULT_URLS, FALLBACK_FEATURES, ConsultationDetailPanel(), Props, ConsultationInfoPanel(), Props, TAB_EP (+6 more)

### Community 11 - "button.tsx"
Cohesion: 0.15
Nodes (15): BatchDeletePanel(), BatchDeletePanelProps, DeleteItem, BatchItem, BatchUploadPanel(), BatchUploadPanelProps, DomainPanel(), DomainPanelProps (+7 more)

### Community 12 - "toolbar.ts"
Cohesion: 0.04
Nodes (44): 1. manifest.json (Update URLs), 2. update.xml (Chromium Browsers), 3. updates.json (Firefox), 4. Install_Morbis_Ext.reg, Apa yang Perlu Dilakukan Staf RS?, 📞 Bantuan, Browser Firefox, Cara Install Manual (Tanpa Registry) (+36 more)

### Community 13 - "antrianTools.ts"
Cohesion: 0.23
Nodes (19): addFullscreenButton(), bellNote(), buildSpokenText(), buildStrukHtml(), cetakStrukAntrian(), chime(), enterFullscreen(), extLog() (+11 more)

### Community 14 - "resumeTab/App.tsx"
Cohesion: 0.12
Nodes (16): id, App(), validate(), ClinicalNotesSection(), ClinicalNotesSectionProps, DiagnosaSection(), Footer(), FooterProps (+8 more)

### Community 15 - "penerimaan_resep/main.ts"
Cohesion: 0.18
Nodes (21): attachAturanValidators(), attachDosisListeners(), g, getAllTipeDosisIndices(), handleAturanBlur(), handleAturanInput(), hasInvalidInputs(), interceptSimpanwae() (+13 more)

### Community 16 - "resumeTab/mount.tsx"
Cohesion: 0.16
Nodes (18): AUTOCOMPLETE_URLS, closeOverlay(), extractBillingFromDOM(), extractFormData(), fetchAllPrescriptionHistories(), fetchFormState(), findAllResepIdsFromPage(), formatAsList() (+10 more)

### Community 17 - "compilerOptions"
Cohesion: 0.10
Nodes (21): compilerOptions, allowSyntheticDefaultImports, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, jsx, jsxImportSource (+13 more)

### Community 18 - "build.mjs"
Cohesion: 0.18
Nodes (16): build(), buildTailwindCSS(), buildWithReact(), commonOptions, compileFeatureFiles(), copyFeatureFiles(), copyStaticFiles(), __dirname (+8 more)

### Community 19 - "popup/StatusCard.tsx"
Cohesion: 0.15
Nodes (17): Hit, Props, Hit, JENIS_OPTIONS, KATEGORI_OPTIONS, Props, DiagnosaRow, TindakanRow (+9 more)

### Community 20 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 21 - "include"
Cohesion: 0.11
Nodes (18): src/background.ts, src/core.ts, src/features/billingFilterPersistence.ts, src/features/doctorFilterPersistence.ts, src/features/filterPersistence.ts, src/features/fixJasaPelayanan.ts, src/features/scrollButtons.ts, src/features/shared/*.ts (+10 more)

### Community 22 - "background.ts"
Cohesion: 0.16
Nodes (15): broadcastConfigChange(), DEFAULT_CONFIG, DEFAULT_CUSTOM_URLS, loadConfig(), loadUrls(), log, migrateConfig(), persistOnChange() (+7 more)

### Community 23 - "src/types.ts"
Cohesion: 0.21
Nodes (13): evaluate(), EvaluateResult, Evaluator, EVALUATORS, matchPage(), normalizePath(), FeatureContext, FeatureMatch (+5 more)

### Community 24 - "popup.js"
Cohesion: 0.28
Nodes (15): addNewUrl(), bgMessage(), bgWrite(), customUrls, DOM, init(), isValidUrl(), loadAll() (+7 more)

### Community 25 - "popup/App.tsx"
Cohesion: 0.18
Nodes (9): root, App(), loadAll(), reloadActiveTab(), FeaturesPanel(), sendMessage(), ErrorBoundary, Props (+1 more)

### Community 26 - "core.ts"
Cohesion: 0.19
Nodes (12): initExtension(), ExtensionCore, getCurrentRole(), isFeatureAllowed(), loadConfig(), log(), ROLES, saveConfig() (+4 more)

### Community 27 - "filterPersistence.ts"
Cohesion: 0.18
Nodes (13): addTogglePanel(), init(), makeEditable(), validateField(), colors, appendAll(), BtnVariant, createBadge() (+5 more)

### Community 28 - "audit-features.mjs"
Cohesion: 0.23
Nodes (12): __dirname, evaluateMatch(), evaluateMatchConfig(), EXPECTED_MATRIX, extractBlock(), extractMatchBlock(), FEATURE_FILES, findFunctionBodies() (+4 more)

### Community 29 - "openDetail.ts"
Cohesion: 0.06
Nodes (32): 1. **AUDIT_MIGRATION_VS_DEV.md** (26 KB, 830 lines), 2. **AUDIT_QUICK_REFERENCE.txt** (22 KB), Action Items (Priority Order), ✅ APPROVED for production IF:, Architecture Questions:, ❌ Critical Issues (Must Fix), Deployment Recommendation, Feature Questions: (+24 more)

### Community 30 - "sidepanel/StatusCard.tsx"
Cohesion: 0.06
Nodes (32): 1. Akses Fitur, 1. Deteksi dan Parsing URL, 2. Input URL Dokumen, 2. Mekanisme Download File, 3. Analisis dan Preview, 3. Proses Upload Berantai, 4. Error Handling dan Recovery, 4. Mulai Upload Batch (+24 more)

### Community 31 - "cookieFilterStorage.ts"
Cohesion: 0.29
Nodes (8): CookieFilterStorage, CookieFilterStorageAPI, initClearAllFilterButton(), _isFilterPageUrl(), _isLoginPage(), removeClearAllFilterButton(), setupFilterLogoutWatcher(), Window

### Community 32 - "asset-master.js"
Cohesion: 0.18
Nodes (9): __dirname, __filename, ICONS_DIR, MANIFEST, MANIFEST_ICONS, REQUIRED_SIZES, results, ROOT (+1 more)

### Community 33 - "persistence-check.js"
Cohesion: 0.18
Nodes (8): BG_PATH, __dirname, __filename, globalVarPatterns, hasGlobal, results, ROOT, src

### Community 34 - "core.js"
Cohesion: 0.33
Nodes (8): getCurrentRole(), isFeatureAllowed(), loadConfig(), log(), ROLES, saveConfig(), saveCustomUrls(), setCurrentRole()

### Community 35 - "exclude"
Cohesion: 0.20
Nodes (9): case, deploy, dist, docs, node_modules, test-results, tests, tool (+1 more)

### Community 36 - "manifest-auditor.js"
Cohesion: 0.20
Nodes (7): __dirname, __filename, m, MANIFEST_PATH, overlyBroad, results, ROOT

### Community 37 - "pack.mjs"
Cohesion: 0.33
Nodes (9): deployDir, __dirname, distDir, ensureDir(), getManifest(), main(), packChrome(), packFirefox() (+1 more)

### Community 38 - "devDependencies"
Cohesion: 0.22
Nodes (9): globals, devDependencies, globals, @playwright/test, postcss, @vitejs/plugin-react, @playwright/test, postcss (+1 more)

### Community 39 - "shared/utils.ts"
Cohesion: 0.31
Nodes (5): fetchFileFromUrl(), safeFetch(), showInlinePreview(), showInlinePreviewSafe(), Window

### Community 40 - "background.js"
Cohesion: 0.29
Nodes (5): DEFAULT_CONFIG, DEFAULT_CUSTOM_URLS, loadConfig(), migrateConfig(), ROLES

### Community 41 - "resumeTab/types.ts"
Cohesion: 0.29
Nodes (6): AppProps, ClinicalNotes, PatientInfo, ResumeData, ValidationError, VitalSigns

### Community 42 - "ErrorBoundary"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 43 - "ErrorBoundary"
Cohesion: 0.06
Nodes (31): AUDIT_DELIVERY_SUMMARY.md, AUDIT_MIGRATION_VS_DEV.md, AUDIT_QUICK_REFERENCE.txt, 📊 By The Numbers, 🔴 Critical Issues (Must Fix Before Production), 📋 Document Index, 📝 Document Metadata, Documents Provided (+23 more)

### Community 44 - "TindakanSection.tsx"
Cohesion: 0.07
Nodes (26): 1. Data Pasien & Registrasi (System Generated), 2. Diagnosis, 3. Tindakan, 4. TTV / Pemeriksaan Fisik, 5. Kondisi Keluar, 6. Resume Klinis, 7. CPPT (Catatan Perkembangan), 8. Asesmen Awal RI (+18 more)

### Community 45 - "audit.mjs"
Cohesion: 0.40
Nodes (3): __dirname, rootDir, scripts

### Community 46 - "lib"
Cohesion: 0.50
Nodes (4): DOM, DOM.Iterable, ES2020, lib

### Community 49 - "Header.tsx"
Cohesion: 0.05
Nodes (37): A.0 Arsitektur Ekstensi (konteks), A.1.1 Struktur DOM asli (server), A.1.2 Alur ambil tiket (fungsi server `antrian(a)`), A.1.3 Perilaku ekstensi saat ini (antrianTools.ts), A.1 Halaman 1 — Mesin Antrian (`/public/mesin-antrian`), A.2.1 Kondisi akses, A.2.2 Perilaku ekstensi saat ini, A.2 Halaman 2 — Counter (`/counter-antrian/counter`) (+29 more)

### Community 51 - "clsx"
Cohesion: 0.22
Nodes (23): anyFeatureEnabled(), BTN_STYLES, buildUrl(), createBtn(), createLink(), dokumenPasienUrl(), editResumeUrl(), extractIdRawatJalan() (+15 more)

### Community 55 - "globals"
Cohesion: 0.19
Nodes (10): DomainPanel(), DomainPanelProps, isValidUrl(), Footer(), FooterProps, Footer(), FooterProps, Button (+2 more)

### Community 83 - "Resume Validator"
Cohesion: 0.09
Nodes (22): Arsitektur Pertahanan Submit (4 Lapis), Aturan Validasi, Autocomplete Guard, Autosave Draft, Detail Implementasi Teknis, Field Wajib, Field yang Dikecualikan, File Terkait (+14 more)

### Community 84 - "A. Developer Rules"
Cohesion: 0.09
Nodes (21): A. Developer Rules, B. AI Agent Rules, Feature Rules, Rule 10 — Naming convention, Rule 1 — Wajib registrasi via `g.featureModules`, Rule 2 — Wajib punya `id`, `match`, `run`, Rule 3 — Dilarang URL gating di dalam `run()`, Rule 4 — Gunakan Field `match` yang Tepat (+13 more)

### Community 85 - "Tombol Scroll"
Cohesion: 0.10
Nodes (19): Analisis Kode, Contoh Perubahan DOM, Detail Implementasi Teknis, Edge Cases dan Keterbatasan, Edge Cases yang Ditangani, Efek Hover Tombol, Fungsi Utama, Gambaran Fitur dan Tujuan (+11 more)

### Community 86 - "Tombol Shortcut"
Cohesion: 0.10
Nodes (19): Analisis Kode, Contoh Perubahan DOM, Detail Implementasi Teknis, Di Halaman Detail, Di Halaman Eksekusi, Edge Cases dan Keterbatasan, Edge Cases yang Ditangani, Fungsi Utama (+11 more)

### Community 87 - "Panduan Penggunaan untuk Staf RS"
Cohesion: 0.11
Nodes (18): 1. Restart Browser, 2. Cek Internet, 3. Coba Browser Lain, 4. Hubungi IT, ❓ Apa yang Terjadi?, 🚫 Apa yang TIDAK Perlu Anda Lakukan?, 🚀 Cara Install (Sangat Mudah), 🪄 Cara Kerja "Di Balik Layar" (+10 more)

### Community 88 - "Persistensi Filter"
Cohesion: 0.11
Nodes (18): Analisis Kode, Contoh Perubahan DOM, Detail Implementasi Teknis, Edge Cases dan Keterbatasan, Edge Cases yang Ditangani, Fungsi Utama, Gambaran Fitur dan Tujuan, Keterbatasan (+10 more)

### Community 89 - "Sederhanakan Penagihan"
Cohesion: 0.11
Nodes (18): Analisis Kode, Bagian Tabel Detail Asli, Contoh Perubahan DOM, CSS Spesifik Cetak, Detail Implementasi Teknis, Edge Cases dan Keterbatasan, Edge Cases yang Ditangani, Fungsi Utama (+10 more)

### Community 90 - "Mode Open Detail"
Cohesion: 0.11
Nodes (17): Analisis Kode, Contoh Perubahan DOM, Detail Implementasi Teknis, Edge Cases dan Keterbatasan, Edge Cases yang Ditangani, Fungsi Utama, Gambaran Fitur dan Tujuan, Keterbatasan (+9 more)

### Community 91 - "MORBIS Extension Rewrite Audit: Migration vs Dev Branch"
Cohesion: 0.14
Nodes (13): 13. Build Verification, 15. Migration Path Recommendation, 16. Testing Checklist, 1. Feature Parity Analysis, 8. Content Script Features (Unchanged), 9. Manifest.json Comparison, Conclusion, Content Script Registration (+5 more)

### Community 92 - "Duplikasi Data ICD Diagnosis & Tindakan saat Input/Edit"
Cohesion: 0.15
Nodes (12): Deskripsi, Dua Mekanisme Autocomplete Berbeda, Duplikasi Data ICD Diagnosis & Tindakan saat Input/Edit, File Terkait, Harapan User, Hasil Test Langsung (25 Mei 2026), Root Cause #1: `.attr('value')` pada hidden `idicd[]`, Root Cause #2: Global `counter` di `ambildiagnosis` (URL A) (+4 more)

### Community 93 - "Extension Architecture"
Cohesion: 0.15
Nodes (12): Alur, Contoh Feature Yang Benar, Contoh Feature Yang SALAH, Controller Features — Pengecualian, Extension Architecture, FeatureContext, FeatureMatch Contract, Files (+4 more)

### Community 94 - "<img src="icons/bluemorbis48.png" width="36" style="vertical-align: middle;"> MORBIS Ext Unofficial"
Cohesion: 0.15
Nodes (12): Branching Strategy, Browser Didukung, Cara Pasang (3 Langkah), Cek Instalasi, `dev` → `main` (CI/CD), <img src="icons/bluemorbis48.png" width="36" style="vertical-align: middle;"> MORBIS Ext Unofficial, Langkah 1: Download File `.reg`, Langkah 2: Double-Click File (+4 more)

### Community 95 - "3. Extension Build Requirements"
Cohesion: 0.18
Nodes (11): 3.10 Deployment Pipeline, 3.1 Tech Stack (Already Implemented — Phase 1), 3.2 TypeScript Architecture (Current State), 3.3 Folder Structure (Target — Full Migration), 3.4 Dependency Management, 3.5 IPC/Transport Strategy, 3.6 Configuration System, 3.7 Logging Strategy (+3 more)

### Community 96 - "scripts"
Cohesion: 0.18
Nodes (10): description, name, private, scripts, build, format, pack, repack (+2 more)

### Community 97 - "Optimasi Cetak (Print Optimization)"
Cohesion: 0.20
Nodes (9): CSS @media print yang Diinjeksi, Detail Implementasi Teknis, Edge Cases, Gambaran Fitur dan Tujuan, Logika Filter Section, Masalah yang Diselesaikan, Opsi Konfigurasi, Optimasi Cetak (Print Optimization) (+1 more)

### Community 98 - "4. Optimization & Reliability"
Cohesion: 0.20
Nodes (10): 4.1 Reducing Latency, 4.2 Minimizing Token Usage, 4.3 Caching Context, 4.4 Preventing Hallucination, 4.5 Improving Context Retention, 4.6 Improving Tool Reliability, 4.7 Concurrency Handling, 4.8 Retry Mechanism (+2 more)

### Community 99 - "1. Recommended MCP Skills"
Cohesion: 0.22
Nodes (9): 1.1 `morbis-his-scraper` (Enhanced), 1.2 `playwright-e2e-runner`, 1.3 `context-memory`, 1.4 `dom-diff-analyzer`, 1.5 `feature-pattern-matcher`, 1.6 `session-orchestrator`, 1.7 `structured-output-validator`, 1.8 `context-summarizer` (+1 more)

### Community 100 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 101 - "Code Review Checklist"
Cohesion: 0.25
Nodes (7): Build & Test, Code Review Checklist, Dokumentasi, enabledWhen, Feature Registration, Regression, URL Gating

### Community 102 - "2. Architecture Design"
Cohesion: 0.25
Nodes (8): 2.1 Overall Architecture, 2.2 Communication Flow, 2.3 Orchestration Pattern: Sequential DAG with Parallel Leaves, 2.4 Context Lifecycle, 2.5 Memory Lifecycle, 2.6 Fallback Strategy, 2.7 Error Handling Strategy, 2. Architecture Design

### Community 103 - "6. Implementation Roadmap"
Cohesion: 0.25
Nodes (8): 6.1 MVP Architecture (Week 1-2) — DONE, 6.2 Full TypeScript Migration & Build System — DONE, 6.3 MCP Server & Testing — DONE, 6.4 CI/CD Pipeline — DONE, 6.5 Implementation Checklist, 6.6 Risk Analysis, 6.7 Technical Debt Consideration, 6. Implementation Roadmap

### Community 104 - "UI Modernization Analysis — MORBIS Extension"
Cohesion: 0.25
Nodes (7): 10. Library Comparison, Appendix A: React Version, Appendix B: Current Bundle Sizes, Appendix C: CSS Variable Coverage, Executive Summary, UI Modernization Analysis — MORBIS Extension, Winner: **shadcn/ui**

### Community 105 - "Morbis Ext Unofficial — MCP Architecture & Extension Build Strategy"
Cohesion: 0.29
Nodes (6): Appendix: Quick Reference, Build Commands, Extension Testing, MCP Server Commands, Morbis Ext Unofficial — MCP Architecture & Extension Build Strategy, Table of Contents

### Community 106 - "Open Detail in New Tab - Dokumentasi Ekstensi Browser"
Cohesion: 0.29
Nodes (6): Gambaran Umum, Lisensi, Open Detail in New Tab - Dokumentasi Ekstensi Browser, Sistem Target, Tujuan Utama, Ucapan Terima Kasih

### Community 107 - "Fitur"
Cohesion: 0.29
Nodes (7): 1. Mode Open Detail, 2. Tombol Shortcut, 3. Persistensi Filter State, 4. Sederhanakan Penagihan (Ringkas Rincian Biaya), 5. Tombol Scroll (Atas/Bawah), 6. Optimisasi Cetak, Fitur

### Community 108 - "15. Final Recommendation"
Cohesion: 0.29
Nodes (7): 15. Final Recommendation, Alignment with Constraints, Execution Phases Summary, Final Verdict, Recommended Action: ✅ **Proceed with shadcn/ui migration**, Why NOW is the right time, Why WAIT if...

### Community 109 - "agent-browser.json"
Cohesion: 0.33
Nodes (5): headed, hideScrollbars, profile, $schema, sessionName

### Community 110 - "5. Tradeoff Analysis"
Cohesion: 0.33
Nodes (6): 5.1 TypeScript Migration, 5.2 esbuild vs Webpack, 5.3 MCP Server Architecture, 5.4 SQLite vs JSON for Memory, 5.5 Event-driven vs Request-driven, 5. Tradeoff Analysis

### Community 111 - "11. Migration Strategy"
Cohesion: 0.33
Nodes (6): 11. Migration Strategy, Out of Scope (Phase 4+), Phase 0: Setup (30 min), Phase 1: Replace Pure Presentational (LOW RISK — 2 hours), Phase 2: Consolidate Duplicates (MEDIUM RISK — 4 hours), Phase 3: Design Polish (LOW RISK — 2 hours)

### Community 112 - "4. Styling System Deep Dive"
Cohesion: 0.33
Nodes (6): 4.1 CSS Architecture, 4.2 Tailwind Configuration, 4.3 CSS Variables (in `src/ui/globals.css`), 4.4 Styling Pattern Analysis, 4.5 Design Systems Comparison, 4. Styling System Deep Dive

### Community 113 - "cancelButton.ts"
Cohesion: 0.67
Nodes (5): getIdFromOnclick(), injectLab(), injectRadio(), isEnabled(), run()

### Community 114 - "Batch Features Refactor"
Cohesion: 0.40
Nodes (4): Batch Features Refactor, Before/After, Changes Summary, Testing

### Community 115 - "Arsitektur Teknis"
Cohesion: 0.40
Nodes (5): Arsitektur Content Script, Arsitektur Teknis, Konfigurasi Manifest, Sistem Konfigurasi, Struktur Ekstensi

### Community 116 - "Pengembangan & Kustomisasi"
Cohesion: 0.40
Nodes (5): Build & Deployment, Kustomisasi Pola URL, Kustomisasi Selector, Menambahkan Fitur Baru, Pengembangan & Kustomisasi

### Community 117 - "2. Component Inventory"
Cohesion: 0.40
Nodes (5): 2.1 Popup Components (`src/popup/`), 2.2 Sidepanel Components (`src/features/sidepanel/`), 2.3 Shared Components (`src/ui/components/`), 2.4 ResumeTab Components (`src/features/resumeTab/`), 2. Component Inventory

### Community 118 - "5. State Management Architecture"
Cohesion: 0.40
Nodes (5): 5.1 Data Flow, 5.2 Initialization Sequence, 5.3 State Update Pattern, 5.4 Message Types (from `src/shared/messaging.ts`), 5. State Management Architecture

### Community 119 - "Morbis DevTools MCP Server"
Cohesion: 0.40
Nodes (4): Morbis DevTools MCP Server, Setup, Tools, Usage

### Community 120 - "ConsultationInfoPanel.tsx"
Cohesion: 0.24
Nodes (11): Window, PopupState, MessageHandler, MessageType, MessageTypes, RequestMap, ResponseMap, CustomUrl (+3 more)

### Community 121 - "Verifikasi End-to-End Phase 1–3B (Antrian Global)"
Cohesion: 0.40
Nodes (4): Catatan penting, Daftar pencatat, Kriteria lulus, Verifikasi End-to-End Phase 1–3B (Antrian Global)

### Community 122 - "10. Key Findings by Category"
Cohesion: 0.50
Nodes (4): 10. Key Findings by Category, ⚠️ What Changed (Potentially Risky), ❌ What Could Be Broken, ✅ What Improved

### Community 123 - "11. Risk Assessment"
Cohesion: 0.50
Nodes (4): 11. Risk Assessment, 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM

### Community 124 - "12. Recommendations (Priority Order)"
Cohesion: 0.50
Nodes (4): 12. Recommendations (Priority Order), Phase 1: MUST FIX (Before Production), Phase 2: SHOULD FIX (Before Widespread Rollout), Phase 3: NICE TO HAVE (Post-Launch)

### Community 125 - "2. Architecture Comparison"
Cohesion: 0.50
Nodes (4): 2. Architecture Comparison, Dev Branch (Current), Key Architectural Changes, Migration Branch (Rewrite)

### Community 126 - "3. Storage System Comparison"
Cohesion: 0.50
Nodes (4): 3. Storage System Comparison, Dev Branch Storage Keys, Migration Branch Storage Keys - CRITICAL DIFFERENCE, Storage Abstraction (Migration)

### Community 127 - "4. Messaging System Comparison"
Cohesion: 0.50
Nodes (4): 4. Messaging System Comparison, Dev Branch (Untyped), Message Handler Comparison, Migration Branch (Typed)

### Community 128 - "5. React Architecture (Migration Only)"
Cohesion: 0.50
Nodes (4): 5. React Architecture (Migration Only), Component Reuse, Popup Component Tree, Sidepanel Component Tree

### Community 129 - "6. Build System Comparison"
Cohesion: 0.50
Nodes (4): 6. Build System Comparison, Bundle Size Impact, Dev Branch Build, Migration Branch Build

### Community 130 - "Instalasi & Setup"
Cohesion: 0.50
Nodes (4): 1. Instalasi Ekstensi, 2. Konfigurasi Awal, 3. Manajemen URL, Instalasi & Setup

### Community 131 - "Dukungan & Maintenance"
Cohesion: 0.50
Nodes (4): Berkontribusi, Dukungan & Maintenance, Pelaporan Issue, Permintaan Fitur

### Community 132 - "Changelog"
Cohesion: 0.50
Nodes (4): Changelog, Versi 1.0.0, Versi 1.1.0, Versi 1.2.0

### Community 133 - "Kompatibilitas"
Cohesion: 0.50
Nodes (4): Dukungan Browser, Kompatibilitas, Kompatibilitas Versi SIMRS, Persyaratan Sistem

### Community 134 - "Keamanan & Privasi"
Cohesion: 0.50
Nodes (4): Fitur Keamanan, Izin yang Digunakan, Keamanan & Privasi, Penanganan Data

### Community 135 - "Panduan Penggunaan"
Cohesion: 0.50
Nodes (4): Fitur Lanjutan, Operasi Dasar, Panduan Penggunaan, Pemecahan Masalah

### Community 136 - "12. Component Mapping"
Cohesion: 0.50
Nodes (4): 12.1 Proposed Migration Table, 12.2 Unchanged Components, 12.3 Component Transformation Risk Map, 12. Component Mapping

### Community 137 - "13. Safe Implementation Plan"
Cohesion: 0.50
Nodes (4): 13.1 Execution Order, 13.2 Rollback Strategy, 13.3 Testing Protocol, 13. Safe Implementation Plan

### Community 138 - "1. Architecture Overview"
Cohesion: 0.50
Nodes (4): 1.1 Project Structure, 1.2 Entry Points, 1.3 Build System Architecture, 1. Architecture Overview

### Community 139 - "3. Component Duplication Analysis"
Cohesion: 0.50
Nodes (4): 3.1 Popup vs Sidepanel Overlap, 3.2 Why Duplicated?, 3.3 Impact of Duplication, 3. Component Duplication Analysis

### Community 140 - "6. Browser API Integration"
Cohesion: 0.50
Nodes (4): 6.1 Chrome API Surface in UI Components, 6.2 Components SAFE to modernize (NO chrome API), 6.3 Components HIGH RISK (DO NOT TOUCH first), 6. Browser API Integration

### Community 141 - "7. TypeScript & Type Safety"
Cohesion: 0.67
Nodes (3): 7. TypeScript & Type Safety, Dev Branch Type Issues, Migration Branch Improvements

### Community 142 - "Opsi Konfigurasi"
Cohesion: 0.67
Nodes (3): Opsi Konfigurasi, Pengaturan Spesifik Fitur, Pengaturan Tingkat Ekstensi

### Community 143 - "14. Files Impact Report"
Cohesion: 0.67
Nodes (3): 14.1 Files That WILL Be Modified, 14.2 Files That Will NOT Be Modified, 14. Files Impact Report

### Community 144 - "7. Risk Matrix"
Cohesion: 0.67
Nodes (3): 7.1 By Component, 7.2 By Functionality, 7. Risk Matrix

### Community 145 - "8. Accessibility Review"
Cohesion: 0.67
Nodes (3): 8.1 Current State, 8.2 Critical Accessibility Issues, 8. Accessibility Review

### Community 146 - "9. Key Constraints & Insights"
Cohesion: 0.67
Nodes (3): 9.1 Constraints, 9.2 Insights, 9. Key Constraints & Insights

### Community 147 - "VitalSignsSection.tsx"
Cohesion: 0.29
Nodes (12): extractIdFromElement(), extractIdFromOnclick(), formatDateOpenDetail(), g, generateUrl(), isModifiedEvent(), OPEN_DETAIL_CONFIG, overrideButtonsByText() (+4 more)

### Community 152 - "Role"
Cohesion: 0.30
Nodes (8): FeaturesPanel(), FeaturesPanelProps, RoleSelector(), RoleSelectorProps, StatusCard(), StatusCardProps, FeatureConfig, Role

### Community 153 - "shortcutButtons.ts"
Cohesion: 0.25
Nodes (9): injectStyles(), BACK_DETAIL_BTN, extractParam(), formatDate(), g, generateDetailUrl(), isExecutionPage(), renderBackToDetailButton() (+1 more)

### Community 154 - "scrollButtons.ts"
Cohesion: 0.35
Nodes (10): easeInOutCubic(), g, renderScrollButtons(), runScrollButtonsFeature(), SCROLL_CONFIG, scrollButtonsExist(), scrollToBottom(), scrollToTop() (+2 more)

### Community 155 - "UsageLogPanel.tsx"
Cohesion: 0.57
Nodes (5): UsageLogEntry, clearUsageLog(), getUsageLog(), fmtTime(), UsageLogPanel()

## Knowledge Gaps
- **865 isolated node(s):** `$schema`, `sessionName`, `profile`, `headed`, `hideScrollbars` (+860 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getMorbisGlobals()` connect `filterPersistence.ts` to `cpptSearchFilter.ts`, `batchUploadUrl.ts`, `penerimaan_resep/main.ts`, `VitalSignsSection.tsx`, `clsx`, `src/types.ts`, `shortcutButtons.ts`, `scrollButtons.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `id` connect `resumeTab/App.tsx` to `manifest.json`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `Role` connect `Role` to `sidepanel/App.tsx`, `popup/StatusCard.tsx`, `src/types.ts`, `ConsultationInfoPanel.tsx`, `popup/App.tsx`, `core.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `$schema`, `sessionName`, `profile` to the rest of the system?**
  _865 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `batchUploadUrl.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08248587570621468 - nodes in this community are weakly interconnected._
- **Should `resumeRanapTab/App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05782312925170068 - nodes in this community are weakly interconnected._
- **Should `ponytail-activate.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07342995169082125 - nodes in this community are weakly interconnected._