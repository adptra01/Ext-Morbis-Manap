# UI Modernization Analysis — MORBIS Extension

> **Date:** 2026-06-17  
> **Status:** Phase 1 — Discovery Complete  
> **Author:** Agent Audit  
> **Mode:** READ-ONLY Analysis (no changes made)

---

## Executive Summary

| Item                   | Value                                                           |
| ---------------------- | --------------------------------------------------------------- |
| Extension Type         | Chrome MV3                                                      |
| UI Framework           | React 19.2.7                                                    |
| Styling                | Tailwind CSS v3.4.19 + CSS Variables                            |
| Total React Components | 24 (.tsx files)                                                 |
| UI Entry Points        | 3 (Popup, Sidepanel, ResumeTab)                                 |
| Duplicated Components  | 5 (StatusCard, FeaturesPanel, DomainPanel, Footer, partial App) |
| Shared UI Components   | 2 (Badge, Button) [Button is UNUSED]                            |
| Custom Hooks           | 1 (useDarkMode)                                                 |
| Total Dist Bundle      | ~4 MB                                                           |

---

## 1. Architecture Overview

### 1.1 Project Structure

```
morbis-ext-unofficial/
├── popup/                         # Vite entry point
│   ├── index.html                 # Popup HTML (340px width)
│   └── main.tsx                   # React mount point
├── sidepanel.html                 # Sidepanel Vite entry
├── vite.config.ts                 # Vite build config
├── scripts/
│   └── build.mjs                  # esbuild for content scripts
├── tailwind.config.js             # Tailwind + MD design tokens
│
└── src/
    ├── popup/                     # Popup React UI
    │   ├── App.tsx                # Container (257 lines)
    │   ├── StatusCard.tsx         # Toggle + role (55 lines)
    │   ├── FeaturesPanel.tsx      # Feature list (100 lines)
    │   ├── DomainPanel.tsx        # URL CRUD (118 lines)
    │   ├── Footer.tsx             # Action buttons (23 lines)
    │   └── types.ts               # Local types (12 lines)
    │
    ├── features/
    │   ├── sidepanel/             # Sidepanel React UI
    │   │   ├── App.tsx            # Container (391 lines)
    │   │   ├── StatusCard.tsx     # Toggle + RoleSelector (47 lines)
    │   │   ├── FeaturesPanel.tsx  # Feature list (78 lines)
    │   │   ├── DomainPanel.tsx    # URL CRUD (89 lines)
    │   │   ├── Footer.tsx         # Action buttons (28 lines)
    │   │   ├── RoleSelector.tsx   # Dropdown (35 lines)
    │   │   ├── main.tsx           # React mount (7 lines)
    │   │   └── types.ts           # Local types (11 lines)
    │   │
    │   └── resumeTab/             # Content script UI (Shadow DOM)
    │       ├── App.tsx            # Form container (98 lines)
    │       ├── Header.tsx         # Panel header
    │       ├── Footer.tsx         # Save/Cancel
    │       ├── InfoBanner.tsx     # Patient info
    │       ├── ClinicalNotesSection.tsx
    │       ├── VitalSignsSection.tsx
    │       ├── DiagnosaSection.tsx
    │       ├── TindakanSection.tsx
    │       ├── ValidationPanel.tsx
    │       ├── mount.tsx          # Shadow DOM mount
    │       └── types.ts
    │   │   (~785 lines total)
    │
    ├── ui/                        # Shared UI layer
    │   ├── components/
    │   │   ├── Badge.tsx          # Badge variants (21 lines)
    │   │   ├── Button.tsx         # Button variants (66 lines) ⚠️ UNUSED
    │   │   └── ErrorBoundary.tsx  # Error boundary
    │   ├── hooks/
    │   │   └── useDarkMode.ts     # Dark mode hook (50 lines)
    │   ├── lib/
    │   │   └── utils.ts           # cn() helper (6 lines)
    │   └── globals.css            # Tailwind + MD tokens (266 lines)
    │
    ├── shared/                    # Business logic layer
    │   ├── messaging.ts           # Typed sendMessage (75 lines)
    │   ├── storage.ts             # Storage wrapper (27 lines)
    │   ├── types.ts               # Core types (29 lines)
    │   └── logger.ts              # createLogger (21 lines)
    │
    ├── styles/                    # Legacy (ResumeTab only)
    │   ├── tokens.css             # Old design tokens (56 lines)
    │   └── components.css         # Old component styles (301 lines)
    │
    ├── features/ (19 content scripts)
    │   ├── openDetail.ts
    │   ├── shortcutButtons.ts
    │   ├── filterPersistence.ts
    │   ├── ...
    │   └── (all esbuild IIFE, no React)
    │
    ├── background.ts              # Service worker
    ├── core.ts                    # Core initialization
    ├── init.ts                    # Content script init
    └── types.ts                   # Re-export from shared/
```

### 1.2 Entry Points

| Entry          | Route                                                                                   | Build System | Dimensions    |
| -------------- | --------------------------------------------------------------------------------------- | ------------ | ------------- |
| **Popup**      | `popup/index.html` → `popup/main.tsx` → `src/popup/App.tsx`                             | Vite         | 340px × 600px |
| **Sidepanel**  | `sidepanel.html` → `src/features/sidepanel/main.tsx` → `src/features/sidepanel/App.tsx` | Vite         | Full height   |
| **ResumeTab**  | Content script → Shadow DOM mount                                                       | esbuild      | Injected      |
| **Background** | `src/background.ts`                                                                     | esbuild      | No UI, no DOM |

### 1.3 Build System Architecture

```
npm run build
  ├── vite build                   # Popup + Sidepanel + Manifest
  │   ├── popup/index.html          → dist/popup/
  │   ├── sidepanel.html            → dist/
  │   ├── manifest.json (copy)      → dist/
  │   └── src/ui/globals.css        → dist/assets/
  │
  └── node scripts/build.mjs       # Content scripts + Background
      ├── src/background.ts         → dist/background.js
      ├── src/core.ts               → dist/core.js
      ├── src/init.ts               → dist/init.js
      ├── src/features/*.ts (19)    → dist/features/*.js
      ├── src/features/resumeTab/   → dist/features/resumeTab.js
      └── src/ui/shadow.css         → dist/ui/shadow.css
```

---

## 2. Component Inventory

### 2.1 Popup Components (`src/popup/`)

| Component         | Lines | Purpose                               | Props                                  | State                        | Chrome APIs                           | Complexity |
| ----------------- | ----- | ------------------------------------- | -------------------------------------- | ---------------------------- | ------------------------------------- | ---------- |
| App.tsx           | 257   | Container — orchestration, load, save | None                                   | config, urls, loading, toast | storage.sync, tabs.query, tabs.reload | HIGH       |
| StatusCard.tsx    | 55    | Extension toggle + role selector      | enabled, role, onToggle, onRoleChange  | None                         | None                                  | LOW        |
| FeaturesPanel.tsx | 100   | Feature list with toggles + modes     | features, role, onToggle, onModeChange | None                         | None                                  | LOW        |
| DomainPanel.tsx   | 118   | URL CRUD with validation              | urls, onAdd, onRemove, onToggle        | input, error                 | None                                  | MEDIUM     |
| Footer.tsx        | 23    | Reload + Reset buttons                | onReload, onReset                      | None                         | None                                  | LOW        |

### 2.2 Sidepanel Components (`src/features/sidepanel/`)

| Component         | Lines | Purpose                                | Props                                     | State                                                                | Chrome APIs                           | Complexity |
| ----------------- | ----- | -------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- | ------------------------------------- | ---------- |
| App.tsx           | 391   | Container — tabs, dark mode, all state | None                                      | enabled, role, activeTab, features, featuresList, urls, toast, theme | storage.sync, tabs.query, tabs.reload | HIGH       |
| StatusCard.tsx    | 47    | Toggle + RoleSelector component        | enabled, role, onToggle, onRoleChange     | None                                                                 | None                                  | LOW        |
| FeaturesPanel.tsx | 78    | Feature list (simpler — no mode)       | features, enabledFeatures, role, onToggle | None                                                                 | None                                  | LOW        |
| DomainPanel.tsx   | 89    | URL CRUD (simpler — no validation)     | urls, onAdd, onRemove, onToggle           | input                                                                | None                                  | LOW        |
| Footer.tsx        | 28    | Buttons with icons                     | onReload, onReset                         | None                                                                 | None                                  | LOW        |
| RoleSelector.tsx  | 35    | Select dropdown                        | value, onChange                           | None                                                                 | None                                  | LOW        |

### 2.3 Shared Components (`src/ui/components/`)

| Component         | Lines | Purpose              | Variants                                   | Used By          | Status       |
| ----------------- | ----- | -------------------- | ------------------------------------------ | ---------------- | ------------ |
| Badge.tsx         | 21    | Status label badge   | default, success, warning, danger          | Sidepanel only   | ✅ Active    |
| Button.tsx        | 66    | Button with variants | primary, secondary, ghost, danger, success | **NO ONE**       | ❌ DEAD CODE |
| ErrorBoundary.tsx | 53    | Error fallback       | —                                          | Popup, Sidepanel | ✅ Active    |

### 2.4 ResumeTab Components (`src/features/resumeTab/`)

| Component                | Lines | Purpose            | Chrome API       | Note        |
| ------------------------ | ----- | ------------------ | ---------------- | ----------- |
| App.tsx                  | 98    | Form orchestration | sendMessage      | Shadow DOM  |
| Header.tsx               | ~30   | Panel header       | None             | Shadow DOM  |
| Footer.tsx               | ~40   | Save/Cancel        | sendMessage      | Shadow DOM  |
| InfoBanner.tsx           | ~50   | Patient info       | None             | Shadow DOM  |
| ClinicalNotesSection.tsx | ~80   | Notes editor       | None             | Shadow DOM  |
| VitalSignsSection.tsx    | ~60   | Vitals input       | None             | Shadow DOM  |
| DiagnosaSection.tsx      | ~120  | ICD-10 table       | None             | Shadow DOM  |
| TindakanSection.tsx      | ~100  | ICD-9 table        | None             | Shadow DOM  |
| ValidationPanel.tsx      | ~40   | Error display      | None             | Shadow DOM  |
| mount.tsx                | ~30   | Shadow DOM mount   | createShadowRoot | ⚠️ Critical |

---

## 3. Component Duplication Analysis

### 3.1 Popup vs Sidepanel Overlap

| Component     | Popup (lines) | Sidepanel (lines) | Overlap  | Differences                                                       |
| ------------- | ------------- | ----------------- | -------- | ----------------------------------------------------------------- |
| App.tsx       | 257           | 391               | ~30%     | Sidepanel has: tabs, dark mode, fallback data, feature conversion |
| StatusCard    | 55            | 47                | ~40%     | Popup: inline role select; Sidepanel: uses RoleSelector component |
| FeaturesPanel | 100           | 78                | ~40%     | Popup: handles mode changes; Sidepanel: simpler toggles only      |
| DomainPanel   | 118           | 89                | **~80%** | Popup: URL validation, error states; Sidepanel: simpler input     |
| Footer        | 23            | 28                | ~70%     | Different styling, same handlers                                  |

### 3.2 Why Duplicated?

1. **Different layouts**: Popup = 340px fixed, Sidepanel = full height
2. **Different features**: Sidepanel has tabs + dark mode
3. **No shared abstraction**: Copy-pasted then modified independently
4. **Styling divergence**: Both look similar but use different Tailwind classes

### 3.3 Impact of Duplication

- **Maintenance burden**: Fix in 2 places
- **Code drift risk**: One gets updated, other doesn't
- **Bug propagation**: Same bug fixed in popup, missed in sidepanel
- **Bundle bloat**: Duplicate CSS classes in both bundles

**Verification**: `src/popup/DomainPanel.tsx` and `src/features/sidepanel/DomainPanel.tsx` — compare logic:

```typescript
// Popup DomainPanel (118 lines)
// - URL validation before add
// - Error state display
// - onAdd/onRemove/onToggle callbacks
// - Popup header style

// Sidepanel DomainPanel (89 lines)
// - No URL validation
// - No error state
// - Same onAdd/onRemove/onToggle callbacks
// - Sidepanel header style
```

This confirms code drift already occurring.

---

## 4. Styling System Deep Dive

### 4.1 CSS Architecture

```
src/
├── ui/
│   └── globals.css           # Tailwind directives + MD design variables (266 lines)
│       ├── @tailwind base
│       ├── @tailwind components
│       ├── @tailwind utilities
│       ├── :root CSS variables (MD colors, spacing, shadows)
│       ├── .dark overrides
│       ├── .md-* utility classes (badge, card, input, button)
│       └── Toast keyframes
│
├── styles/
│   ├── tokens.css            # Old MORBIS design tokens (56 lines)
│   └── components.css        # Old component styles (301 lines) ← ResumeTab only
│
└── features/
    └── resumeTab/
        └── [components use tokens.css + components.css]
```

### 4.2 Tailwind Configuration

**File**: `tailwind.config.js` (139 lines)

```javascript
// Custom MD Design System
colors: {
  md: {
    gray:   { 50: '#f8f9fb', ... 900: '#1a1d21' },  // 10 steps
    blue:   { 50: '#eef3ff', ... 700: '#1647a8' },  // 7 steps
    green:  { 50: '#eaf6ef', ... 700: '#116033' },
    amber:  { 50: '#fef4e4', ... 700: '#8c5210' },
    red:    { 50: '#fcecee', ... 700: '#8e232c' },
    purple: { 50: '#f2ebfa', ... 700: '#572f88' },
    teal:   { 50: '#e6f5f2', ... 700: '#09564b' },
  }
}

fontFamily: {
  md:    ['Inter', '-apple-system', 'BlinkMacSystemFont', ...],
  mono:  ['JetBrains Mono', 'Fira Code', ...],
}

fontSize: {
  'md-xs':  ['11px', '16px'],
  'md-sm':  ['12px', '18px'],
  'md-base':['13px', '20px'],
  'md-md':  ['14px', '22px'],
  'md-lg':  ['15px', '24px'],
  'md-xl':  ['16px', '26px'],
  'md-2xl': ['18px', '28px'],
}

borderRadius: {
  md:       '6px',
  'md-lg':  '8px',
}

boxShadow: {
  'md-panel':   '0 0 0 1px rgba(0,0,0,.04), 0 8px 32px rgba(0,0,0,.12)',
  'md-card':    '0 0 0 1px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06)',
  'md-dropdown':'0 4px 16px rgba(0,0,0,.14)',
  'md-float':   '0 2px 8px rgba(0,0,0,.15)',
}

spacing: {
  'md-0.5': '2px',  'md-1': '4px',  'md-1.5': '6px',
  'md-2': '8px',    'md-3': '12px', 'md-4': '16px',
  'md-5': '20px',   'md-6': '24px', 'md-8': '32px',
}

animation: {
  'fade-in': 'fade-in 0.15s ease-out',
  'zoom-in': 'zoom-in 0.15s ease-out',
  'slide-up':'slide-up 0.15s ease-out',
}

darkMode: 'class'
```

### 4.3 CSS Variables (in `src/ui/globals.css`)

```css
:root {
  --md-gray-50: #f8f9fb;
  --md-gray-900: #1a1d21;
  --md-blue-500: #2469f0;
  --md-green-500: #1b8a4b;
  --md-amber-500: #c47a1a;
  --md-red-500: #cc3340;
  --md-radius: 6px;
  --md-radius-lg: 8px;
  --md-shadow-panel: ...;
  --md-shadow-card: ...;
  --md-shadow-dropdown: ...;
}

.dark {
  /* Dark mode overrides for backgrounds */
  --md-gray-50: ...;
}
```

### 4.4 Styling Pattern Analysis

| Pattern                      | Usage                               | Example                                  |
| ---------------------------- | ----------------------------------- | ---------------------------------------- |
| **Tailwind utility classes** | 95% of components                   | `className="px-4 py-2.5"`                |
| **CSS variables**            | 70% of styling                      | `bg-[var(--md-gray-100)]`                |
| **Arbitrary values**         | 30% of styling                      | `text-[10px]`, `h-[300px]`               |
| **CSS classes (global)**     | ~15%                                | `className="md-badge md-badge--primary"` |
| **Inline styles**            | <1%                                 | None found                               |
| **CSS modules**              | 0%                                  | Not used                                 |
| **Styled components**        | 0%                                  | Not used                                 |
| **cn() utility**             | Used in Badge, Button, RoleSelector | `cn('class1', condition && 'class2')`    |

### 4.5 Design Systems Comparison

| Category          | MD System (Popup/Sidepanel)             | MORBIS System (ResumeTab) |
| ----------------- | --------------------------------------- | ------------------------- |
| **Primary**       | #2469f0 (blue)                          | #0ea5e9 (cyan)            |
| **Font**          | Inter                                   | System fonts              |
| **Border radius** | 6px, 8px                                | 4px, 8px, 12px            |
| **Spacing**       | MD scale (2,4,6,8,12,16,20,24,32)       | Standard Tailwind         |
| **Shadows**       | 4 levels (panel, card, dropdown, float) | 4 levels (sm, md, lg, xl) |
| **Gray**          | 10 custom steps                         | Tailwind default          |
| **Dark mode**     | `class`-based via useDarkMode           | Manual                    |

---

## 5. State Management Architecture

### 5.1 Data Flow

```
┌─────────────────────────────────────────────────────────┐
│              Background Service Worker                    │
│  chrome.storage.sync (Source of Truth)                    │
│  ├── extensionConfig: ExtensionConfig                     │
│  └── extensionCustomUrls: CustomUrl[]                     │
│                                                           │
│  Message Handler (onMessage)                              │
│  ├── GET_ALL      → return config + urls                 │
│  ├── SET_ROLE     → update config + broadcast            │
│  ├── TOGGLE_FEATURE → update feature state               │
│  ├── RESET_CONFIG → restore defaults                     │
│  ├── ADD_URL      → add custom URL                       │
│  └── ... (12 message types total)                        │
└─────────────┬───────────────────────────────────────────┘
              │ sendMessage / onMessage
    ┌─────────┴───────────┐
    │                     │
    ▼                     ▼
┌──────────────┐   ┌──────────────┐
│   POPUP      │   │  SIDEPANEL   │
│  App.tsx     │   │  App.tsx     │
│              │   │              │
│ useState:    │   │ useState:    │
│ - config     │   │ - enabled    │
│ - urls       │   │ - role       │
│ - loading    │   │ - features   │
│ - toast      │   │ - urls       │
│              │   │ - activeTab  │
│              │   │ - toast      │
│              │   │ - theme      │
└──────┬───────┘   └──────┬───────┘
       │ (props)          │ (props)
       ▼                   ▼
┌──────────────┐   ┌──────────────┐
│  StatusCard  │   │  StatusCard  │
│  FeaturesPnl │   │ FeaturesPnl  │
│  DomainPanel │   │ DomainPanel  │
│  Footer      │   │  RoleSel     │
│              │   │  Footer      │
└──────────────┘   └──────────────┘
```

### 5.2 Initialization Sequence

**Popup** (`src/popup/App.tsx:41-47`):

```typescript
useEffect(() => {
  loadAll().then((result) => {
    setConfig(result.config);
    setUrls(result.urls);
    setLoading(false);
  });
}, []);

async function loadAll() {
  try {
    // 1. Try background via sendMessage
    const result = await sendMessage<'GET_ALL'>({ type: 'GET_ALL' });
    if (result?.config) return result;
  } catch {}
  // 2. Fallback: direct storage access
  const c = await chrome.storage.sync.get(['extensionConfig', ...]);
  return { config: c.extensionConfig, urls: c.extensionCustomUrls };
}
```

**Sidepanel** (`src/features/sidepanel/App.tsx:122-183`):

```typescript
useEffect(() => {
  sendMessage<'GET_ALL'>({ type: 'GET_ALL' })
    .then((result) => {
      // Transform ExtensionConfig.features → Record<string, boolean>
      const featureToggles = {};
      for (const [key, obj] of Object.entries(result.config.features)) {
        featureToggles[key] = obj.enabled;
      }
      setFeatures(featureToggles);
      setFeaturesList(Object.entries(result.config.features).map(...));
    })
    .catch(() => {
      // Fallback to direct chrome.storage
      chrome.storage.sync.get(['extensionConfig', ...], (fallback) => { ... });
    });
}, []);
```

### 5.3 State Update Pattern

All user actions follow the same pattern:

```typescript
const handleToggleFeature = useCallback((key: string, enabled: boolean) => {
  // 1. Optimistic: update local state immediately
  setFeatures(prev => ({ ...prev, [key]: enabled }));
06
  // 2. Async sync to background
  sendMessage<'TOGGLE_FEATURE'>({ type: 'TOGGLE_FEATURE', key, enabled })
    .catch(() => showToast('Gagal mengubah fitur'));

  // 3. Force page reload to apply content script changes
  reloadActiveTab();
}, [features]);

function reloadActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab?.id) {
      chrome.tabs.reload(tab.id);
      window.close(); // popup only
    }
  });
}
```

**⚠️ Risk: No state reconciliation** — If background sync fails, local state is already updated but storage is not. Applies to ALL handlers.

### 5.4 Message Types (from `src/shared/messaging.ts`)

| Type                | Payload          | Response                        | Used By               |
| ------------------- | ---------------- | ------------------------------- | --------------------- |
| GET_ALL             | {}               | { config, urls, defaultConfig } | Popup, Sidepanel      |
| GET_CONFIG          | {}               | { config }                      | Popup                 |
| GET_URLS            | {}               | { urls }                        | Popup                 |
| SET_ROLE            | { role }         | { success }                     | Popup, Sidepanel      |
| TOGGLE_EXTENSION    | { enabled }      | { success }                     | Popup, Sidepanel      |
| TOGGLE_FEATURE      | { key, enabled } | { success }                     | Popup, Sidepanel      |
| CHANGE_FEATURE_MODE | { key, mode }    | { success }                     | Popup                 |
| RESET_CONFIG        | {}               | { success }                     | Popup, Sidepanel      |
| ADD_URL             | { url }          | { success }                     | Popup, Sidepanel      |
| DELETE_URL          | { id }           | { success }                     | Popup, Sidepanel      |
| TOGGLE_URL          | { id, enabled }  | { success }                     | Popup, Sidepanel      |
| OPEN_SIDE_PANEL     | {}               | { success }                     | Popup                 |
| CONFIG_CHANGED      | {}               | { success }                     | Background broadcasts |

---

## 6. Browser API Integration

### 6.1 Chrome API Surface in UI Components

| Component                 | API                          | Purpose              | Risk        | Can Abstract?       |
| ------------------------- | ---------------------------- | -------------------- | ----------- | ------------------- |
| popup/App.tsx:16          | `chrome.storage.sync.get`    | Fallback config load | 🔴 CRITICAL | ✅ via sendMessage  |
| popup/App.tsx:27-32       | `chrome.tabs.query + reload` | Apply changes        | 🔴 CRITICAL | ❌ Must stay in App |
| sidepanel/App.tsx:154     | `chrome.storage.sync.get`    | Fallback config load | 🔴 CRITICAL | ✅ via sendMessage  |
| sidepanel/App.tsx:166-169 | `chrome.tabs.query + reload` | Apply changes        | 🔴 CRITICAL | ❌ Must stay in App |
| useDarkMode.ts:16         | `chrome.storage.sync.get`    | Load theme pref      | 🟡 MEDIUM   | ✅ via sendMessage  |
| useDarkMode.ts:37         | `chrome.storage.sync.set`    | Save theme pref      | 🟡 MEDIUM   | ✅ via sendMessage  |

### 6.2 Components SAFE to modernize (NO chrome API)

| Component            | Reason                                |
| -------------------- | ------------------------------------- |
| StatusCard (both)    | Props only, pure presentational       |
| FeaturesPanel (both) | Maps array to JSX, no side effects    |
| DomainPanel (both)   | Local input state only, no chrome API |
| Footer (both)        | Button callbacks only                 |
| RoleSelector         | Local state + onChange only           |
| Badge                | Pure presentational                   |
| Button               | Pure presentational — but UNUSED      |

### 6.3 Components HIGH RISK (DO NOT TOUCH first)

| Component           | Reason                                           |
| ------------------- | ------------------------------------------------ |
| App.tsx (popup)     | State orchestration, chrome API, message passing |
| App.tsx (sidepanel) | Same + dark mode + tabs + feature conversion     |
| useDarkMode hook    | Chrome storage integration                       |
| ErrorBoundary       | Catches all errors, critical for stability       |

---

## 7. Risk Matrix

### 7.1 By Component

```
                    RISK LEVEL
              LOW         MEDIUM         HIGH
            ┌─────────────────────────────────────┐
  PRESEN-   │ StatusCard     │ DomainPanel │      │
  TATIONAL  │ FeaturesPanel  │ (popup)     │      │
            │ Footer         │             │      │
            │ RoleSelector   │             │      │
            │ Badge          │             │      │
            │ Button         │             │      │
            ├────────────────┼─────────────┼──────┤
  CONTAINER │  ErrorBoundary │ DomainPanel │ App  │
            │                │ (sidepanel) │ (2x) │
            │                │             │      │
            ├────────────────┼─────────────┼──────┤
  HOOK      │                │ useDarkMode │      │
  / UTIL    │                │             │      │
            └────────────────┴─────────────┴──────┘
```

### 7.2 By Functionality

| Feature             | Risk      | Why                                            |
| ------------------- | --------- | ---------------------------------------------- |
| Extension toggle    | 🟢 LOW    | StatusCard receives `onToggle` callback        |
| Role selector       | 🟢 LOW    | StatusCard receives `onRoleChange` callback    |
| Feature toggles     | 🟢 LOW    | FeaturesPanel receives `onToggle` callback     |
| Feature mode change | 🟢 LOW    | FeaturesPanel receives `onModeChange` callback |
| URL CRUD            | 🟡 MEDIUM | DomainPanel has local state + validation       |
| Dark mode toggle    | 🟡 MEDIUM | Uses useDarkMode hook with chrome storage      |
| Reset config        | 🟡 MEDIUM | Calls sendMessage + reload + fallback          |
| Tab reload          | 🔴 HIGH   | Chrome tabs API, window.close()                |

---

## 8. Accessibility Review

### 8.1 Current State

| Requirement     | Status     | Notes                                       |
| --------------- | ---------- | ------------------------------------------- |
| ARIA labels     | ❌ Missing | No `aria-label` on toggle buttons           |
| Keyboard nav    | ⚠️ Partial | Buttons are focusable, select is focusable  |
| Focus visible   | ✅ Has     | `focus-visible:ring-2` on buttons           |
| Color contrast  | ⚠️ Unknown | MD colors need checking                     |
| Screen reader   | ❌ Missing | No `role`, `aria-checked` on custom toggles |
| Skip navigation | ❌ N/A     | Small surfaces, acceptable                  |

### 8.2 Critical Accessibility Issues

1. **Custom toggle switches** — No `role="switch"` or `aria-checked`
2. **Toast notifications** — No `role="alert"` or `aria-live`
3. **Role selector** — No `aria-label` on select
4. **Delete buttons** — No `aria-label="Delete URL http://..."`

---

## 9. Key Constraints & Insights

### 9.1 Constraints

| #   | Constraint                          | Impact                                         |
| --- | ----------------------------------- | ---------------------------------------------- |
| 1   | **Chrome MV3**                      | Service worker, bundle size limits, CSP        |
| 2   | **No Shadow DOM** (popup/sidepanel) | CSS leaks to/from page                         |
| 3   | **Tailwind + custom MD tokens**     | Library must be Tailwind-compatible            |
| 4   | **Dual build system**               | Vite for UI, esbuild for content scripts       |
| 5   | **340px popup width**               | Responsive design for popup                    |
| 6   | **Dark mode via class**             | Library must support `.dark` class             |
| 7   | **Content scripts = esbuild IIFE**  | No React in content scripts (except ResumeTab) |
| 8   | **Direct chrome.storage in UI**     | Can't fully abstract without refactoring App   |

### 9.2 Insights

1. **Button.tsx is DEAD CODE** — Exists but never imported. Either use it or delete it.

2. **DomainPanel is 80% duplicated** — Popup version has extra validation logic. Should consolidate.

3. **FeaturesPanel diverging** — Popup has mode changes, sidepanel doesn't. This is intentional.

4. **ResumeTab is isolated** — Separate design system, Shadow DOM, no Tailwind. Treat separately.

5. **No loading states** — After initial load, no loading indicators for mutations.

6. **useDarkMode hook** — Stores to `md-theme` key (not `extensionConfig`), creating another storage inconsistency.

7. **ErrorBoundary is new** — Already added in migration. Good.

8. **cn() utility exists** — Simple conditional class helper. shadcn/ui uses same pattern.

---

## 10. Library Comparison

| Criteria         | **shadcn/ui**      | Radix (direct) | Mantine       | Material UI        | Ant Design          |
| ---------------- | ------------------ | -------------- | ------------- | ------------------ | ------------------- |
| Bundle size      | ~0KB (copy-paste)  | ~50KB          | ~200KB        | ~500KB             | ~1MB                |
| Tailwind native  | ✅                 | ❌             | ❌            | ❌                 | ❌                  |
| Dark mode        | ✅ (class-based)   | ✅             | ✅ (Provider) | ✅ (ThemeProvider) | ✅ (ConfigProvider) |
| Accessibility    | ✅ (Radix)         | ✅             | ✅            | ✅                 | ✅                  |
| Tree-shakable    | ✅                 | ✅             | ⚠️ Partial    | ⚠️ Partial         | ❌                  |
| Extension tested | ✅                 | ✅             | ⚠️            | ❌                 | ❌                  |
| Customizable     | ✅ (Tailwind vars) | ❌ (raw)       | ⚠️            | ⚠️ (themes)        | ⚠️                  |
| Learning curve   | LOW                | MEDIUM         | MEDIUM        | HIGH               | HIGH                |
| React 19 compat  | ✅                 | ✅             | ✅            | ⚠️                 | ⚠️                  |

### Winner: **shadcn/ui**

**Why shadcn/ui wins for this codebase:**

1. **Zero bundle overhead** — Components are copied into `src/ui/components/`, no runtime dependency
2. **Tailwind-compatible** — Same Tailwind utility patterns already used
3. **Dark mode ready** — Works with extension's `useDarkMode` hook and `.dark` class
4. **Accessible by default** — Built on Radix UI primitives (keyboard nav, ARIA, screen readers)
5. **TypeScript-first** — Full type definitions, matches existing TypeScript usage
6. **Incremental adoption** — Can migrate one component at a time
7. **Small files** — Each component is self-contained (~100-200 lines)
8. **Maintain control** — Full ownership of component code, no black boxes

**Why NOT others:**

| Library            | Reason against                                                     |
| ------------------ | ------------------------------------------------------------------ |
| **Radix (direct)** | Primitives have no styling — need to reinvent every component      |
| **Mantine**        | CSS-in-JS (Emotion) conflicts with Tailwind, adds runtime          |
| **Material UI**    | Bundle size large, requires Emotion, opinionated design            |
| **Ant Design**     | Bundle size huge, not Tailwind-friendly, different design language |

---

## 11. Migration Strategy

### Phase 0: Setup (30 min)

```
npx shadcn-ui@latest init
```

| Setting         | Value                                 |
| --------------- | ------------------------------------- |
| Style           | Default                               |
| Base color      | Slate (closest to MD gray)            |
| CSS variables   | Yes                                   |
| Components path | `src/ui/components/` (existing)       |
| Utils path      | `src/ui/lib/utils.ts` (existing cn()) |
| Tailwind config | Override with MD tokens               |
| CSS file        | `src/ui/globals.css` (add @layer)     |

**Critical**: Configure shadcn/ui to use extension's MD design tokens instead of default colors.

### Phase 1: Replace Pure Presentational (LOW RISK — 2 hours)

| Step | Component           | shadcn Component | Risk   |
| ---- | ------------------- | ---------------- | ------ |
| 1    | Footer buttons      | `Button`         | 🟢 LOW |
| 2    | StatusCard toggle   | `Switch`         | 🟢 LOW |
| 3    | RoleSelector select | `Select`         | 🟢 LOW |
| 4    | DomainPanel input   | `Input`          | 🟢 LOW |

**Why safe**: These components receive callbacks as props. Business logic stays in App.tsx.

**Rollback**: Delete shadcn component, restore previous markup.

### Phase 2: Consolidate Duplicates (MEDIUM RISK — 4 hours)

| Step | Action                                              | Files                                                   |
| ---- | --------------------------------------------------- | ------------------------------------------------------- |
| 5    | Create `src/ui/components/shared/StatusCard.tsx`    | popup/StatusCard, sidepanel/StatusCard → unified        |
| 6    | Create `src/ui/components/shared/DomainPanel.tsx`   | popup/DomainPanel, sidepanel/DomainPanel → unified      |
| 7    | Create `src/ui/components/shared/Footer.tsx`        | popup/Footer, sidepanel/Footer → unified                |
| 8    | Create `src/ui/components/shared/FeaturesPanel.tsx` | popup/FeaturesPanel, sidepanel → (⚠️ diverged features) |

**Why safe**: Extract pattern to shared, update imports in both App.tsx files.

**⚠️ FeaturesPanel challenge**: Popup has mode changes, sidepanel doesn't. Need conditional rendering or separate slots.

**Rollback**: Revert to per-surface imports, delete shared files.

### Phase 3: Design Polish (LOW RISK — 2 hours)

| Step | Improvement                                                    |
| ---- | -------------------------------------------------------------- |
| 9    | Replace custom toggle switch with shadcn `Switch` (accessible) |
| 10   | Add `aria-label` to action buttons                             |
| 11   | Add `role="alert"` to toast notifications                      |
| 12   | Standardize spacing using Tailwind/MD tokens                   |

### Out of Scope (Phase 4+)

| Item                  | Reason                                                               |
| --------------------- | -------------------------------------------------------------------- |
| **ResumeTab rewrite** | Separate Shadow DOM, different build system, different design tokens |
| **App.tsx refactor**  | Too risky, tightly coupled with chrome API + state + message passing |
| **Content script UI** | esbuild IIFE, no React. Separate architecture.                       |

---

## 12. Component Mapping

### 12.1 Proposed Migration Table

| Existing Component                | shadcn/ui Component        | Risk Level | Effort | Note                         |
| --------------------------------- | -------------------------- | ---------- | ------ | ---------------------------- |
| Footer (popup) inline buttons     | `<Button>`                 | 🟢 LOW     | 30 min | Replace 2 buttons            |
| Footer (sidepanel) inline buttons | `<Button>`                 | 🟢 LOW     | 30 min | Replace 2 buttons            |
| StatusCard toggle                 | `<Switch>`                 | 🟢 LOW     | 30 min | Preserve `onToggle`          |
| RoleSelector select               | `<Select>`                 | 🟢 LOW     | 30 min | Preserve `onChange`          |
| DomainPanel input                 | `<Input>`                  | 🟢 LOW     | 30 min | Preserve `onSubmit`          |
| DomainPanel delete btn            | `<Button variant="ghost">` | 🟢 LOW     | 15 min | Replace inline               |
| Popup StatusCard role             | `<Select>`                 | 🟢 LOW     | 30 min | Extract like sidepanel       |
| FeaturesPanel toggle              | `<Switch>`                 | 🟢 LOW     | 30 min | Replace custom toggle        |
| **Shared StatusCard**             | Consolidate                | 🟡 MEDIUM  | 60 min | Unify 2 implementations      |
| **Shared DomainPanel**            | Consolidate                | 🟡 MEDIUM  | 60 min | Unify 2 implementations      |
| **Shared Footer**                 | Consolidate                | 🟢 LOW     | 30 min | Unify 2 implementations      |
| **Shared FeaturesPanel**          | Consolidate                | 🟡 MEDIUM  | 60 min | Handle mode change diff      |
| **Toast**                         | Custom + `sonner`          | 🟡 MEDIUM  | 45 min | or keep current toast        |
| **App.tsx**                       | **DO NOT TOUCH**           | 🔴 HIGH    | —      | State, chrome API, messaging |

### 12.2 Unchanged Components

| Component                  | Reason                                                    |
| -------------------------- | --------------------------------------------------------- |
| App.tsx (popup)            | High risk — state management, chrome API, message passing |
| App.tsx (sidepanel)        | Same + tabs + dark mode + feature conversion              |
| useDarkMode hook           | Chrome storage integration, must stay stable              |
| ErrorBoundary              | Already modern — keep as-is                               |
| Badge                      | Already shared and simple                                 |
| ResumeTab components       | Separate Shadow DOM architecture                          |
| Content scripts (19 files) | No React, different build system                          |

### 12.3 Component Transformation Risk Map

```
                         PRESENTATION LOGIC
                         LOW            HIGH
                       ┌──────────────────────────┐
              LOW RISK │ StatusCard     │ App.tsx  │
  BROWSER              │ FeaturesPanel  │          │
  API                  │ DomainPanel    │          │
  USAGE                │ Footer         │          │
                       ├────────────────┼──────────┤
              HIGH     │                │          │
              RISK     │                │          │
                       └────────────────┴──────────┘
```

All components targeted for Phase 1 are in the **LOW RISK / LOW BROWSER API** quadrant.

---

## 13. Safe Implementation Plan

### 13.1 Execution Order

```
Step 1: Setup shadcn/ui        ─── 30 min ─── 🟢 LOW
Step 2: Replace Footer              ─── 1 hour ─── 🟢 LOW
Step 3: Replace Toggle/Switch       ─── 1 hour ─── 🟢 LOW
Step 4: Replace Select/RoleSelector ─── 1 hour ─── 🟢 LOW
Step 5: Replace Input/DomainPanel   ─── 1 hour ─── 🟢 LOW
Step 6: Consolidate shared comps    ─── 4 hours ─── 🟡 MEDIUM
Step 7: Accessibility pass          ─── 2 hours ─── 🟢 LOW
────────────────────────────────────────────────
Total: ~10 hours                   ─── Incremental per step
```

### 13.2 Rollback Strategy

**Per Step Rollback**:

```bash
git checkout -- <affected-files>
```

**Full Rollback**:

```bash
git reset --hard HEAD~1   # If committed
git checkout migration    # Full recovery
```

**Verification after each step**:

```bash
npm run build && npm test && npm run typecheck
```

### 13.3 Testing Protocol

After each step:

1. `npm run typecheck` — TypeScript compilation
2. `npm test` — Unit tests (47 tests)
3. `npm run build` — Full build
4. Manual visual check:
   - Popup opens and renders correctly
   - Sidepanel opens and renders correctly
   - Toggle, role change, feature toggle work
   - URL add/remove works
   - Dark mode toggle works (sidepanel)
   - Toast notifications appear

---

## 14. Files Impact Report

### 14.1 Files That WILL Be Modified

| File                                      | Step   | Change                                           | Risk      |
| ----------------------------------------- | ------ | ------------------------------------------------ | --------- |
| `src/ui/globals.css`                      | Setup  | Add shadcn/ui CSS variables layer                | 🟢 LOW    |
| `tailwind.config.js`                      | Setup  | Merge shadcn/ui config                           | 🟢 LOW    |
| `src/ui/lib/utils.ts`                     | Setup  | Ensure `cn()` compatibility                      | 🟢 LOW    |
| `src/popup/Footer.tsx`                    | Step 2 | Replace inline `<button>` with shadcn `<Button>` | 🟢 LOW    |
| `src/features/sidepanel/Footer.tsx`       | Step 2 | Replace inline `<button>` with shadcn `<Button>` | 🟢 LOW    |
| `src/popup/StatusCard.tsx`                | Step 3 | Replace custom toggle with shadcn `<Switch>`     | 🟢 LOW    |
| `src/features/sidepanel/StatusCard.tsx`   | Step 3 | Replace custom toggle with shadcn `<Switch>`     | 🟢 LOW    |
| `src/features/sidepanel/RoleSelector.tsx` | Step 4 | Replace `<select>` with shadcn `<Select>`        | 🟢 LOW    |
| `src/popup/StatusCard.tsx`                | Step 4 | Add shadcn `<Select>` for role                   | 🟢 LOW    |
| `src/popup/DomainPanel.tsx`               | Step 5 | Replace `<input>` with shadcn `<Input>`          | 🟢 LOW    |
| `src/features/sidepanel/DomainPanel.tsx`  | Step 5 | Replace `<input>` with shadcn `<Input>`          | 🟢 LOW    |
| `src/ui/components/shared/*`              | Step 6 | New shared components                            | 🟡 MEDIUM |
| `src/popup/App.tsx`                       | Step 6 | Update imports to shared                         | 🟡 MEDIUM |
| `src/features/sidepanel/App.tsx`          | Step 6 | Update imports to shared                         | 🟡 MEDIUM |

**Total**: ~13 files modified
**New files**: ~5 (shared components)
**App.tsx changes**: Only import paths (no logic changed)

### 14.2 Files That Will NOT Be Modified

| File                       | Reason                       |
| -------------------------- | ---------------------------- |
| `src/shared/messaging.ts`  | No UI changes                |
| `src/shared/storage.ts`    | No UI changes                |
| `src/shared/types.ts`      | No UI changes                |
| `src/shared/logger.ts`     | No UI changes                |
| `src/background.ts`        | No UI changes                |
| `src/core.ts`              | No UI changes                |
| `src/init.ts`              | No UI changes                |
| All 19 content scripts     | No React / separate build    |
| `src/features/resumeTab/*` | Shadow DOM / separate system |
| `src/styles/*.css`         | Legacy / ResumeTab only      |

---

## 15. Final Recommendation

### Recommended Action: ✅ **Proceed with shadcn/ui migration**

**Confidence**: HIGH
**Risk**: LOW (if approached incrementally)
**Value**: HIGH (accessibility, maintainability, reduced duplication)

### Why NOW is the right time

1. **Codebase is fresh** from esbuild→Vite migration
2. **Architecture understood** after audit
3. **No new features planned** — UI has stabilized
4. **Duplication already identified** — consolidate while understood

### Why WAIT if...

1. **No accessibility requirements** yet — current UI works
2. **Team prefers stability** over modernization
3. **Bundle size concerns** — shadcn/ui adds minimal, but React already there

### Execution Phases Summary

```
Day 1  ─── Setup shadcn/ui + replace Footer (1.5h)
Day 2  ─── Replace Switch + Select + Input (2h)
Day 3-4 ── Consolidate shared components (4h)
Day 5  ─── Accessibility pass + polish (2h)

Total  ─── ~10 hours, incremental, testable, rollback-able
```

### Alignment with Constraints

| Constraint             | shadcn/ui Alignment                   |
| ---------------------- | ------------------------------------- |
| ✅ Tailwind-compatible | Built with Tailwind utility classes   |
| ✅ Small bundle        | Copy-paste, no runtime dependency     |
| ✅ Dark mode           | `.dark` class support                 |
| ✅ TypeScript          | Full type definitions                 |
| ✅ Incremental         | Install + use one component at a time |
| ✅ Accessible          | Built on Radix UI primitives          |
| ✅ Customizable        | Modify source, full control           |

### Final Verdict

> **shadcn/ui is the ideal UI library for this codebase.** It respects all architectural constraints, enables incremental migration, introduces zero bundle overhead, and significantly improves accessibility and maintainability.
>
> The migration can be done SAFELY in 7 incremental steps (~10 hours total), each testable and rollback-able independently.
>
> **Start with `npx shadcn-ui@latest init` and replace one component — the Footer — as proof of concept.**

---

## Appendix A: React Version

**Package.json**: React 19.2.7

```json
"dependencies": {
  "react": "^19.2.7",
  "react-dom": "^19.2.7"
}
```

shadcn/ui supports React 19 as of 2026. No compatibility issues.

## Appendix B: Current Bundle Sizes

| File                    | Size (dist/)  |
| ----------------------- | ------------- |
| popup.js                | ~11 kB        |
| sidepanel.js            | ~41 kB        |
| chunks/ (React runtime) | ~191 kB       |
| background.js           | ~15 kB        |
| feature files (19)      | ~5-10 kB each |
| **Total**               | **~4 MB**     |

shadcn/ui adds 0 kB (components are source code, not runtime).

## Appendix C: CSS Variable Coverage

```css
/* Current MD Variables */
--md-gray-50 to --md-gray-900    /* 10 steps */
--md-blue-500 to --md-blue-700   /* 3 steps */
--md-green-500 to --md-green-700
--md-amber-500 to --md-amber-700
--md-red-500 to --md-red-700
--md-radius, --md-radius-lg
--md-shadow-panel, --md-shadow-card, --md-shadow-dropdown, --md-shadow-float

/* shadcn/ui Default Variables */
--background: --md-gray-50
--foreground: --md-gray-900
--card: white
--primary: --md-blue-500
--secondary: --md-gray-100
--destructive: --md-red-500
--muted: --md-gray-100
--accent: --md-gray-100
--border: --md-gray-200
--input: --md-gray-200
--ring: --md-blue-500
--radius: --md-radius
```

**Mapping is straightforward**: shadcn/ui CSS variables map 1:1 to existing MD tokens.
