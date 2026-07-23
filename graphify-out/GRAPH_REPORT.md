# Graph Report - . (2026-07-22)

## Corpus Check

- cluster-only mode — file stats not available

## Summary

- 1022 nodes · 1709 edges · 83 communities (56 shown, 27 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `dcb20f9e`
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
- Role
- core.ts
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

## God Nodes (most connected - your core abstractions)

1. `compilerOptions` - 23 edges
2. `Role` - 22 edges
3. `scripts` - 19 edges
4. `init()` - 17 edges
5. `CustomUrl` - 17 edges
6. `include` - 17 edges
7. `renderToolbar()` - 16 edges
8. `runValidation()` - 13 edges
9. `getMorbisGlobals()` - 12 edges
10. `init()` - 11 edges

## Surprising Connections (you probably didn't know these)

- `ConsEnhancerApp()` --references--> `react` [EXTRACTED]
  src/features/consultationEnhancer/ConsEnhancerApp.tsx → package.json
- `initExtension()` --references--> `ExtensionCore` [EXTRACTED]
  init.js → src/core.ts
- `DiagnosaSection()` --references--> `id` [EXTRACTED]
  src/features/resumeTab/DiagnosaSection.tsx → manifest.json
- `TindakanSection()` --references--> `id` [EXTRACTED]
  src/features/resumeTab/TindakanSection.tsx → manifest.json
- `syncUrlParams()` --indirect_call--> `val()` [INFERRED]
  src/features/cpptSearchFilter.ts → src/features/resumeValidator.ts

## Import Cycles

- None detected.

## Communities (83 total, 27 thin omitted)

### Community 0 - "cpptSearchFilter.ts"

Cohesion: 0.05
Nodes (56): applyFilters(), CpptFilterState, CpptPageType, findCpptTables(), g, getColumnIndex(), getCpptPageType(), getDataRows() (+48 more)

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

Cohesion: 0.05
Nodes (36): allowScripts, esbuild@0.28.1, dependencies, react, react-dom, description, engines, node (+28 more)

### Community 6 - "filterPersistence.ts"

Cohesion: 0.09
Nodes (33): attachFilterListeners(), BILLING_FILTER_CONFIG, BillingFilterConfig, clearFilter(), g, isBillingVerifikasiPage(), restoreFilter(), runBillingFilterPersistence() (+25 more)

### Community 7 - "resumeValidator.ts"

Cohesion: 0.13
Nodes (35): addRequiredAttributes(), attachSaveHandler(), autoExpandTextareas(), buildICD10Fields(), buildICD9Fields(), checkAndLockForm(), checkSession(), clearErrors() (+27 more)

### Community 8 - "legacy.ts"

Cohesion: 0.09
Nodes (25): check, Props, ConsEnhancerApp(), ConsInfoTabs(), Props, TABS, g, addSearchFilter() (+17 more)

### Community 9 - "MorbisSession"

Cohesion: 0.11
Nodes (17): Client, analyze_feature(), diff_dom(), get_feature_source(), MorbisSession, Morbis DevTools MCP Server MCP server untuk development dan debugging Morbis Ex, Scrape halaman Morbis HIS dengan session management otomatis. Args:, Read the current extension configuration and feature list. Returns: (+9 more)

### Community 10 - "sidepanel/App.tsx"

Cohesion: 0.13
Nodes (17): App(), DEFAULT_URLS, FALLBACK_FEATURES, ConsultationDetailPanel(), Props, ConsultationInfoPanel(), Props, TAB_EP (+9 more)

### Community 11 - "button.tsx"

Cohesion: 0.15
Nodes (16): BatchDeletePanel(), BatchDeletePanelProps, DeleteItem, DomainPanel(), DomainPanelProps, isValidUrl(), Footer(), FooterProps (+8 more)

### Community 12 - "toolbar.ts"

Cohesion: 0.22
Nodes (23): anyFeatureEnabled(), BTN_STYLES, buildUrl(), createBtn(), createLink(), dokumenPasienUrl(), editResumeUrl(), extractIdRawatJalan() (+15 more)

### Community 13 - "antrianTools.ts"

Cohesion: 0.19
Nodes (22): addButtonTooltips(), addCallLogTable(), CallLogEntry, cleanupOldLogKeys(), escapeHtml(), fixCounter(), fixResetButton(), getLogStorageKey() (+14 more)

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

Cohesion: 0.20
Nodes (13): Hit, Props, DiagnosaRow, roleOptions, RoleSelectorProps, FeaturesPanelProps, ROLE_LABELS, ROLES (+5 more)

### Community 20 - "components.json"

Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 21 - "include"

Cohesion: 0.12
Nodes (17): src/background.ts, src/core.ts, src/features/billingFilterPersistence.ts, src/features/filterPersistence.ts, src/features/fixJasaPelayanan.ts, src/features/scrollButtons.ts, src/features/shared/_.ts, src/features/sidepanel/\**/_.ts (+9 more)

### Community 22 - "background.ts"

Cohesion: 0.16
Nodes (15): broadcastConfigChange(), DEFAULT_CONFIG, DEFAULT_CUSTOM_URLS, loadConfig(), loadUrls(), log, migrateConfig(), persistOnChange() (+7 more)

### Community 23 - "src/types.ts"

Cohesion: 0.24
Nodes (13): evaluate(), EvaluateResult, Evaluator, EVALUATORS, matchPage(), normalizePath(), FeatureContext, FeatureMatch (+5 more)

### Community 24 - "popup.js"

Cohesion: 0.28
Nodes (15): addNewUrl(), bgMessage(), bgWrite(), customUrls, DOM, init(), isValidUrl(), loadAll() (+7 more)

### Community 25 - "popup/App.tsx"

Cohesion: 0.17
Nodes (12): App(), loadAll(), reloadActiveTab(), FeaturesPanel(), Footer(), FooterProps, MessageHandler, MessageType (+4 more)

### Community 26 - "Role"

Cohesion: 0.25
Nodes (9): Window, PopupState, getConfig(), getConfigWithFallback(), CustomUrl, ExtensionConfig, FeatureModule, Role (+1 more)

### Community 27 - "core.ts"

Cohesion: 0.21
Nodes (11): initExtension(), ExtensionCore, getCurrentRole(), isFeatureAllowed(), loadConfig(), log(), ROLES, saveConfig() (+3 more)

### Community 28 - "audit-features.mjs"

Cohesion: 0.23
Nodes (12): __dirname, evaluateMatch(), evaluateMatchConfig(), EXPECTED_MATRIX, extractBlock(), extractMatchBlock(), FEATURE_FILES, findFunctionBodies() (+4 more)

### Community 29 - "openDetail.ts"

Cohesion: 0.29
Nodes (12): extractIdFromElement(), extractIdFromOnclick(), formatDateOpenDetail(), g, generateUrl(), isModifiedEvent(), OPEN_DETAIL_CONFIG, overrideButtonsByText() (+4 more)

### Community 30 - "sidepanel/StatusCard.tsx"

Cohesion: 0.18
Nodes (10): BatchItem, BatchUploadPanel(), BatchUploadPanelProps, RoleSelector(), StatusCard(), StatusCardProps, Badge(), BadgeProps (+2 more)

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
Nodes (9): autoprefixer, devDependencies, autoprefixer, @playwright/test, postcss, @vitejs/plugin-react, @playwright/test, postcss (+1 more)

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

Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 44 - "TindakanSection.tsx"

Cohesion: 0.40
Nodes (5): Hit, JENIS_OPTIONS, KATEGORI_OPTIONS, Props, TindakanRow

### Community 45 - "audit.mjs"

Cohesion: 0.40
Nodes (3): __dirname, rootDir, scripts

### Community 46 - "lib"

Cohesion: 0.50
Nodes (4): DOM, DOM.Iterable, ES2020, lib

## Knowledge Gaps

- **342 isolated node(s):** `ROLES`, `DEFAULT_CUSTOM_URLS`, `DEFAULT_CONFIG`, `$schema`, `style` (+337 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `id` connect `resumeTab/App.tsx` to `manifest.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `gecko` connect `manifest.json` to `resumeTab/App.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `ROLES`, `DEFAULT_CUSTOM_URLS`, `DEFAULT_CONFIG` to the rest of the system?**
  _342 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cpptSearchFilter.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053821800090456805 - nodes in this community are weakly interconnected._
- **Should `batchUploadUrl.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08248587570621468 - nodes in this community are weakly interconnected._
- **Should `resumeRanapTab/App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05782312925170068 - nodes in this community are weakly interconnected._
- **Should `ponytail-activate.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07342995169082125 - nodes in this community are weakly interconnected._
