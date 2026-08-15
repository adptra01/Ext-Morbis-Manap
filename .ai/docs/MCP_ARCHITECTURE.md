# Morbis Ext Unofficial — MCP Architecture & Extension Build Strategy

> Engineering-level design document for AI agent orchestration, MCP skill ecosystem, and production-grade extension build pipeline.
>
> **Version:** 1.0.0
> **Date:** 2026-05-21
> **Scope:** Ext-Morbis-Manap browser extension + AI agent development tooling

---

## Table of Contents

1. [Recommended MCP Skills](#1-recommended-mcp-skills)
2. [Architecture Design](#2-architecture-design)
3. [Extension Build Requirements](#3-extension-build-requirements)
4. [Optimization & Reliability](#4-optimization--reliability)
5. [Tradeoff Analysis](#5-tradeoff-analysis)
6. [Implementation Roadmap](#6-implementation-roadmap)

---

## 1. Recommended MCP Skills

### 1.1 `morbis-his-scraper` (Enhanced)

**Tujuan utama:** Scrape data dari Morbis HIS dengan session management otomatis, pagination handling, dan structured data extraction.

**Input schema:**

```typescript
interface ScrapeRequest {
  module: 'rawat-inap' | 'rawat-jalan' | 'billing' | 'konsultasi' | 'admisi';
  idVisit?: string;
  page?: number;
  statusPeriksa?: 'belum' | 'sudah' | 'all';
  cssSelector?: string;
  maxPages?: number;
  timeout?: number;
}
```

**Output schema:**

```typescript
interface ScrapeResponse {
  success: boolean;
  data: Array<Record<string, string>>;
  totalPages: number;
  pageCount: number;
  sessionExpired: boolean;
  error?: string;
  meta: {
    url: string;
    timestamp: string;
    rowCount: number;
  };
}
```

**Dependency:** `scrapling >= 0.4.2`, `python >= 3.10`, session cookie store

**Execution flow:**

```
1. Check cookie store → valid? → use existing session
2. Expired? → auto-login via stored credentials (.env)
3. Navigate to target module URL
4. Parse HTML → extract via CSS selector
5. Detect pagination → loop until maxPages or no more data
6. Structure data → return JSON
7. On session expired → retry login (max 1) → fail if retry fails
```

**Use case spesifik:**

- AI agent debugging batch upload: scrape halaman target → dapatkan HTML terkini → bandingkan dengan expected DOM structure
- Generate test fixtures: scrape real data → anonymize → save sebagai test fixture
- Validate extension behavior: scrape before/after extension injection → diff DOM changes

**Impact terhadap reasoning:** Memberikan ground truth data dari sistem live. Agent tidak perlu hallucinate tentang struktur HTML Morbis — bisa scrape dan lihat langsung. Meningkatkan akurasi code generation untuk DOM manipulation di extension features.

**Latency consideration:**

- Login: ~500ms
- Single page scrape: ~200-800ms (tergantung response time Morbis)
- Multi-page (10 pages): ~3-8s
- **Mitigation:** Cache HTML structure (bukan data) — selector pattern jarang berubah

**Security consideration:**

- Credentials di `.env`, NEVER di code atau commit
- Cookie store encrypted (AES-256)
- Session auto-expire setelah 30 menit idle
- Rate limit: max 1 request/2s untuk menghindari server overload
- Data pasien NEVER disimpan di disk tanpa encryption

---

### 1.2 `playwright-e2e-runner`

**Tujuan utama:** Execute E2E test scenarios untuk extension features dengan Playwright, capture screenshots, console logs, dan DOM snapshots.

**Input schema:**

```typescript
interface TestRequest {
  testFile: string;
  testName?: string;
  role?: 'casemix' | 'kasir' | 'dokter' | 'apotek';
  captureScreenshot?: boolean;
  captureConsole?: boolean;
  captureDomSnapshot?: boolean;
}
```

**Output schema:**

```typescript
interface TestResponse {
  passed: boolean;
  duration: number;
  screenshots?: string[];
  consoleLogs?: string[];
  domSnapshot?: string;
  error?: {
    message: string;
    stack: string;
    screenshot: string;
  };
}
```

**Dependency:** `@playwright/test >= 1.45.0`, browser binary (Chromium)

**Execution flow:**

```
1. Load auth state (storageState.json) → skip login
2. Launch Chromium with extension loaded
3. Navigate to target Morbis page
4. Execute test steps
5. Capture artifacts (screenshot, console, DOM)
6. Assert expectations
7. Return structured result
```

**Use case spesifik:**

- Regression test sebelum deploy: run all features → verify no breakage
- Debug failing feature: run single test → capture screenshot + console → analyze
- Cross-browser test: run di Chromium, Firefox, WebKit → compare behavior

**Impact terhadap reasoning:** Agent bisa verify code changes secara otomatis. Tidak perlu manual testing — agent write code → run test → analyze result → iterate. Mempercepat debug loop dari 10 menit → 30 detik.

**Latency consideration:**

- Cold start (browser launch): ~2s
- Per-test execution: ~3-10s
- **Mitigation:** Reuse browser context, parallel test execution

**Security consideration:**

- Test menggunakan test account (bukan production credentials)
- Screenshot dihapus setelah analysis (no PII retention)
- Browser running dalam isolated environment (no network access ke external)

---

### 1.3 `context-memory`

**Tujuan utama:** Persistent memory layer untuk AI agent — menyimpan dan retrieve facts, patterns, dan decisions antar session.

**Input schema:**

```typescript
interface MemoryWriteRequest {
  namespace: 'bug-patterns' | 'css-selectors' | 'url-patterns' | 'workarounds' | 'decisions';
  key: string;
  value: unknown;
  ttl?: number; // seconds, default: 86400 (24h)
  tags?: string[];
}

interface MemoryReadRequest {
  namespace: string;
  key?: string;
  tags?: string[];
  limit?: number;
}
```

**Output schema:**

```typescript
interface MemoryResponse {
  success: boolean;
  data?: Array<{ key: string; value: unknown; tags: string[]; createdAt: string }>;
  count: number;
}
```

**Dependency:** SQLite (local), file-based fallback

**Execution flow:**

```
1. Write: validate namespace → check TTL → upsert → return
2. Read: filter by namespace/key/tags → sort by recency → apply limit → return
3. Cleanup: background job removes expired entries
```

**Use case spesifik:**

- Agent debug fixJasaPelayanan → store root cause pattern → next time agent sees similar bug, retrieve pattern
- Store CSS selector yang sudah verified untuk setiap halaman Morbis → agent tidak perlu guess
- Store decision log: "kenapa feature X diimplementasikan dengan cara Y" → context preservation

**Impact terhadap reasoning:** Agent tidak mulai dari nol setiap session. Memory memberikan continuity — seperti developer senior yang ingat history project. Meningkatkan response quality 3-5x untuk repetitive tasks.

**Latency consideration:**

- Read: <10ms (SQLite index)
- Write: <5ms
- **Mitigation:** In-memory cache untuk frequently accessed keys

**Security consideration:**

- No PII stored — only technical facts
- Namespaces scoped per project
- Memory file di `.gitignore`

---

### 1.4 `dom-diff-analyzer`

**Tujuan utama:** Compare DOM structure before/after extension injection untuk detect regression, verify feature behavior, dan generate test assertions.

**Input schema:**

```typescript
interface DomDiffRequest {
  baselineFile: string;
  currentFile: string;
  ignoreAttributes?: string[];
  ignoreTextContent?: boolean;
  cssSelector?: string;
}
```

**Output schema:**

```typescript
interface DomDiffResponse {
  identical: boolean;
  added: number;
  removed: number;
  modified: number;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    selector: string;
    detail: string;
  }>;
}
```

**Dependency:** `diff`, DOM parser

**Execution flow:**

```
1. Parse both HTML files → build DOM trees
2. Walk trees simultaneously → detect differences
3. Filter ignored attributes/text
4. Generate structured diff report
5. Return summary + detailed changes
```

**Use case spesifik:**

- Verify extension tidak break existing DOM: scrape baseline → inject extension → scrape → diff
- Debug feature regression: compare DOM snapshot dari version yang bekerja vs yang broken
- Generate test assertion: diff → extract changed selectors → write Playwright assertion

**Impact terhadap reasoning:** Agent bisa objectively verify apakah code change menyebabkan regression. Tidak perlu "rasanya sudah benar" — ada bukti konkret.

**Latency consideration:**

- Small DOM (<1000 nodes): <50ms
- Large DOM (>5000 nodes): <200ms
- **Mitigation:** Scope diff ke specific CSS selector (bukan full page)

**Security consideration:**

- DOM snapshot mungkin contain PII (nama pasien, dll) → auto-strip sebelum diff
- Snapshot files auto-delete setelah analysis

---

### 1.5 `feature-pattern-matcher`

**Tujuan utama:** Analyze existing extension feature code → extract reusable patterns → suggest implementations untuk new features.

**Input schema:**

```typescript
interface PatternMatchRequest {
  description: string;
  targetModule: string;
  existingFeatures?: string[];
  constraints?: string[];
}
```

**Output schema:**

```typescript
interface PatternMatchResponse {
  matchedPatterns: Array<{
    feature: string;
    pattern: string;
    code: string;
    relevance: number;
  }>;
  suggestedImplementation: string;
  risks: string[];
}
```

**Dependency:** File system access, AST parser (optional)

**Execution flow:**

```
1. Parse request description → extract intent
2. Scan existing features (features/*.js) → identify patterns
3. Match patterns against intent → score relevance
4. Generate suggested implementation based on matched patterns
5. Identify risks (e.g., MAIN world requirement, MutationObserver complexity)
```

**Use case spesifik:**

- Agent diminta buat feature baru → pattern matcher suggest: "gunakan MutationObserver seperti di openDetail.js, inject CSS seperti di printOptimization.js"
- Agent refactor feature → pattern matcher identify: "ini pattern yang sama dengan simplifyBilling.js — bisa extract ke shared utility"

**Impact terhadap reasoning:** Agent tidak reinvent the wheel. Pattern matcher memberikan concrete examples dari codebase yang sudah working. Meningkatkan code quality dan consistency.

**Latency consideration:**

- Pattern scan: <100ms (12 files, ~200KB total)
- **Mitigation:** Cache pattern index — rebuild only when files change

**Security consideration:**

- Read-only access ke source files
- No external data exfiltration

---

### 1.6 `session-orchestrator`

**Tujuan utama:** Coordinate multi-step workflows across multiple MCP tools — manage dependencies, handle failures, and maintain workflow state.

**Input schema:**

```typescript
interface WorkflowRequest {
  workflow: 'debug-feature' | 'add-feature' | 'regression-test' | 'deploy';
  params: Record<string, unknown>;
  maxRetries?: number;
}
```

**Output schema:**

```typescript
interface WorkflowResponse {
  status: 'completed' | 'failed' | 'partial';
  steps: Array<{
    name: string;
    tool: string;
    status: 'success' | 'failed' | 'skipped';
    duration: number;
    output?: unknown;
    error?: string;
  }>;
  totalDuration: number;
  summary: string;
}
```

**Dependency:** All other MCP tools

**Execution flow:**

```
1. Parse workflow → build step DAG
2. Execute steps in dependency order
3. On failure: retry (maxRetries) → fallback → continue or abort
4. Aggregate results → generate summary
5. Store workflow state in context-memory
```

**Use case spesifik:**

- `debug-feature`: scrape page → capture DOM → diff → analyze → suggest fix → test fix
- `add-feature`: analyze pattern → generate code → build → test → verify
- `regression-test`: build → run all E2E tests → capture failures → generate report

**Impact terhadap reasoning:** Agent tidak perlu manually chain tool calls. Orchestrator handles the workflow — agent focus pada decision making. Reduces context window usage 40-60%.

**Latency consideration:**

- Overhead: <50ms per step
- Total workflow: depends on steps (debug: ~10s, add-feature: ~30s)
- **Mitigation:** Parallel execution untuk independent steps

**Security consideration:**

- Workflow state stored locally
- No external API calls tanpa explicit permission
- Credential handling via environment variables only

---

### 1.7 `structured-output-validator`

**Tujuan utama:** Validate AI agent output against expected schema — catch hallucination, format errors, dan incomplete responses.

**Input schema:**

```typescript
interface ValidationRequest {
  data: unknown;
  schema: Record<string, unknown>;
  strict?: boolean;
}
```

**Output schema:**

```typescript
interface ValidationResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized?: unknown;
}
```

**Dependency:** JSON Schema validator

**Execution flow:**

```
1. Parse schema → build validation rules
2. Validate data against rules
3. Collect errors and warnings
4. Optionally sanitize (remove extra fields, coerce types)
5. Return validation result
```

**Use case spesifik:**

- Validate scraped data structure before processing
- Validate generated code against expected format
- Validate test results before reporting

**Impact terhadap reasoning:** Prevents downstream errors from invalid data. Agent gets immediate feedback — bisa retry dengan corrected output.

**Latency consideration:**

- Validation: <5ms
- **Mitigation:** Pre-compile schemas

**Security consideration:**

- Input sanitization prevents injection attacks
- Strict mode prevents unexpected data injection

---

### 1.8 `context-summarizer`

**Tujuan utama:** Compress large context (DOM snapshots, scraped data, test results) into concise summaries untuk fit within context window limits.

**Input schema:**

```typescript
interface SummarizeRequest {
  content: string;
  type: 'dom' | 'scraped-data' | 'test-results' | 'code';
  maxTokens: number;
  preserveStructure?: boolean;
}
```

**Output schema:**

```typescript
interface SummarizeResponse {
  summary: string;
  tokenCount: number;
  compressionRatio: number;
  preservedElements: string[];
}
```

**Dependency:** LLM (local or API), HTML parser

**Execution flow:**

```
1. Parse content → identify key elements
2. Remove noise (boilerplate, repeated patterns)
3. Compress while preserving structure
4. Count tokens → trim if exceeds maxTokens
5. Return summary + metadata
```

**Use case spesifik:**

- Compress 50KB DOM snapshot → 2KB summary untuk context window
- Summarize test results → highlight only failures
- Compress scraped data → extract only relevant fields

**Impact terhadap reasoning:** Enables agent to work with large datasets without context window overflow. Compression ratio 10-25x dengan minimal information loss.

**Latency consideration:**

- Rule-based compression: <50ms
- LLM-based compression: ~500ms-2s
- **Mitigation:** Prefer rule-based for structured data, LLM only for unstructured

**Security consideration:**

- PII auto-stripped sebelum summarization
- Summary does not contain sensitive data

---

## 2. Architecture Design

### 2.1 Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI AGENT (Orchestrator)                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ORCHESTRATION LAYER                          │   │
│  │  • session-orchestrator (workflow DAG execution)               │   │
│  │  • context-summarizer (compression)                            │   │
│  │  • structured-output-validator (schema enforcement)           │   │
│  │  • tool router (dynamic tool selection)                        │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                          │
│              ┌──────────────┼──────────────┐                          │
│              ▼              ▼              ▼                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   TOOL LAYER  │  │ MEMORY LAYER │  │  EXEC LAYER  │                │
│  │              │  │              │  │              │                │
│  │ • morbis-his │  │ • context-   │  │ • playwright │                │
│  │   -scraper   │  │   memory     │  │   -e2e       │                │
│  │ • dom-diff   │  │ • pattern    │  │   -runner    │                │
│  │   -analyzer  │  │   cache      │  │ • build      │                │
│  │ • feature-   │  │              │  │   pipeline   │                │
│  │   pattern    │  │              │  │ • deploy     │                │
│  │   -matcher   │  │              │  │   pipeline   │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│                             │                                          │
│              ┌──────────────┼──────────────┐                          │
│              ▼              ▼              ▼                           │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │                  CONTEXT MANAGEMENT LAYER                     │     │
│  │  • Context lifecycle management (create → use → compress →  │     │
│  │    archive → expire)                                         │     │
│  │  • Memory lifecycle (write → index → retrieve → expire)     │     │
│  │  • Session state (workflow progress, tool results, errors)  │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                             │                                          │
│              ┌──────────────┼──────────────┐                          │
│              ▼              ▼              ▼                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   Morbis HIS │  │   Extension  │  │   GitHub     │                │
│  │   (Live)     │  │   (dist/)    │  │   (Repo)     │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Communication Flow

**Request-driven (primary):**

```
Agent → Orchestrator → Tool MCP → Result → Orchestrator → Agent
```

**Event-driven (secondary):**

```
File change → File watcher → Rebuild → Test → Notify Agent
Session expire → Cookie monitor → Auto-relogin → Update cache
Test failure → CI pipeline → Capture artifacts → Store in memory → Alert
```

**Why request-driven primary:**

- Predictable execution order
- Easier debugging (linear flow)
- Better error isolation
- Simpler retry logic

**Why event-driven secondary:**

- Background tasks (rebuild, test, deploy)
- Async notifications
- State synchronization

### 2.3 Orchestration Pattern: Sequential DAG with Parallel Leaves

```
Workflow: debug-feature
                    ┌──────────────┐
                    │   START      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Scrape page  │  ← morbis-his-scraper
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ Capture DOM  │  ← playwright-e2e-runner
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Diff DOM │ │ Analyze  │ │ Retrieve │  ← PARALLEL
       │          │ │ patterns │ │ memory   │
       └────┬─────┘ └────┬─────┘ └────┬─────┘
            │            │            │
            └────────────┼────────────┘
                         │
                  ┌──────▼───────┐
                  │  Synthesize  │  ← context-summarizer
                  │  findings    │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │  Suggest     │  ← feature-pattern-matcher
                  │  fix         │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │  Validate    │  ← structured-output-validator
                  │  output      │
                  └──────┬───────┘
                         │
                    ┌────▼────┐
                    │  END    │
                    └─────────┘
```

### 2.4 Context Lifecycle

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐    ┌─────────┐
│ CREATE  │───►│ USE      │───►│ COMPRESS  │───►│ ARCHIVE  │───►│ EXPIRE  │
│         │    │          │    │           │    │          │    │         │
│ New     │    │ Active   │    │ Summarize │    │ Store in │    │ Delete  │
│ session │    │ context  │    │ to fit    │    │ memory   │    │ old     │
│ starts  │    │ window   │    │ window    │    │ for      │    │ entries │
│         │    │          │    │ limits    │    │ future   │    │         │
└─────────┘    └──────────┘    └───────────┘    └──────────┘    └─────────┘
   │              │               │                │
   │              │               │                │
   ▼              ▼               ▼                ▼
 Load           Track            Trigger           TTL-based
 memory         token            at 75%            cleanup
 facts          usage            capacity
```

**Key decisions:**

- Compress at 75% capacity (not 100%) — buffer for tool responses
- Archive important findings to memory (not all context)
- Expire based on relevance, not just time (frequently accessed facts live longer)

### 2.5 Memory Lifecycle

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌──────────┐
│ WRITE   │───►│ INDEX    │───►│ RETRIEVE  │───►│ EXPIRE   │
│         │    │          │    │           │    │          │
│ Agent   │    │ Build    │    │ Query by  │    │ TTL     │
│ stores  │    │ search   │    │ namespace │    │ access  │
│ fact    │    │ index    │    │ key tags  │    │ count   │
└─────────┘    └──────────┘    └───────────┘    └──────────┘
```

**Index structure:**

```
memory/
├── bug-patterns.db       # SQLite: key, value, tags, created_at, access_count
├── css-selectors.db      # SQLite: page_url, selector, verified_at, working
├── url-patterns.db       # SQLite: module, url_pattern, params
├── workarounds.db        # SQLite: bug_description, workaround, applied_at
└── decisions.db          # SQLite: decision, rationale, alternatives_considered
```

### 2.6 Fallback Strategy

| Tool                    | Primary           | Fallback 1            | Fallback 2                   |
| ----------------------- | ----------------- | --------------------- | ---------------------------- |
| `morbis-his-scraper`    | Scrapling session | Direct HTTP + cookies | Manual input from user       |
| `playwright-e2e-runner` | Headless Chromium | Headless Firefox      | Screenshot-based manual test |
| `context-memory`        | SQLite            | JSON file             | In-memory (ephemeral)        |
| `dom-diff-analyzer`     | Full DOM diff     | Selector-only diff    | Manual comparison            |
| `context-summarizer`    | Rule-based        | LLM-based             | Truncate (last resort)       |

### 2.7 Error Handling Strategy

```
Error detected
    │
    ├── Transient (timeout, network) → Retry with backoff (max 3)
    │       │
    │       ├── Success → Continue
    │       └── Fail → Fallback
    │
    ├── Structural (invalid schema, missing file) → Report + halt
    │       │
    │       └── Agent decides: fix or skip
    │
    └── Semantic (wrong data, unexpected result) → Validate → Report
            │
            ├── Can recover → Retry with corrected input
            └── Cannot recover → Store in memory (lesson learned) → Halt
```

---

## 3. Extension Build Requirements

### 3.1 Tech Stack (Already Implemented — Phase 1)

| Layer     | Technology                   | Rationale                                                 |
| --------- | ---------------------------- | --------------------------------------------------------- |
| Bundler   | esbuild 0.24                 | 100x faster than webpack, zero-config for simple projects |
| Language  | TypeScript 5.7               | Type safety for complex logic, gradual migration          |
| Linter    | ESLint 9 + typescript-eslint | Catch bugs at compile time                                |
| Formatter | Prettier 3.4                 | Consistent code style                                     |
| Testing   | Playwright 1.45              | E2E testing with extension support                        |
| Package   | npm                          | Standard, no lock-in                                      |

### 3.2 TypeScript Architecture (Current State)

```
src/
├── types.ts                    # Shared type definitions
├── core.ts                     # ExtensionCore, config, role management
├── background.ts               # Service worker (message handlers)
├── popup.ts                    # Popup UI logic
├── init.ts                     # Feature initializer
└── features/
    └── shared/
        ├── cookieFilterStorage.ts  # Cookie-based persistence
        └── utils.ts                # Shared batch utilities
```

**Build output:**

```
dist/
├── core.js          ← src/core.ts (IIFE, sets window.ExtensionCore)
├── background.js    ← src/background.ts (IIFE, service worker)
├── popup.js         ← src/popup.ts (IIFE, popup UI)
├── init.js          ← src/init.ts (IIFE, feature initializer)
├── features/        ← Copied from root features/ (vanilla JS)
├── icons/           ← Copied from root icons/
├── popup.html       ← Copied from root
└── manifest.json    ← Copied from root
```

**Type constraints:**

- `strict: true` — no implicit any, strict null checks
- `noUnusedLocals: true` — catch dead code
- `noUnusedParameters: true` — clean function signatures
- `noImplicitReturns: true` — all code paths return
- `types: ["chrome"]` — Chrome extension API types

### 3.3 Folder Structure (Target — Full Migration)

```
Ext-Morbis-Manap/
├── src/                          # TypeScript source
│   ├── types.ts
│   ├── core.ts
│   ├── background.ts
│   ├── popup.ts
│   ├── init.ts
│   └── features/
│       ├── shared/
│       │   ├── cookieFilterStorage.ts
│       │   └── utils.ts
│       ├── openDetail.ts
│       ├── shortcutButtons.ts
│       ├── filterPersistence.ts
│       ├── simplifyBilling.ts
│       ├── scrollButtons.ts
│       ├── printOptimization.ts
│       ├── batchUploadUrl.ts
│       ├── batchDeleteFiles.ts
│       ├── billingFilterPersistence.ts
│       ├── doctorFilterPersistence.ts
│       ├── fixJasaPelayanan.ts
│       ├── consultationEnhancer.ts
│       └── penerimaan_resep/
│           └── main.ts
├── scripts/
│   ├── build.mjs                 # esbuild bundler
│   ├── pack.mjs                  # .crx/.xpi packer
│   └── deploy.mjs                # GitHub Pages deploy
├── tests/
│   ├── e2e/
│   │   ├── fixtures/
│   │   ├── specs/
│   │   └── global-setup.ts
│   └── playwright.config.ts
├── mcp-servers/
│   └── morbis-devtools/
│       ├── server.py
│       └── requirements.txt
├── docs/
├── case/
├── deploy/
├── dist/                         # Build output (gitignored)
├── features/                     # Legacy JS (gitignored after migration)
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
└── .gitignore
```

### 3.4 Dependency Management

**Production (none):**

- Extension runs in browser — zero runtime dependencies
- All code bundled into IIFE

**Development:**

```json
{
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/chrome": "^0.0.270",
    "esbuild": "^0.24.0",
    "eslint": "^9.15.0",
    "globals": "^17.6.0",
    "prettier": "^3.4.0",
    "rimraf": "^6.0.0",
    "typescript": "^5.7.0",
    "typescript-eslint": "^8.59.4"
  }
}
```

**Python (MCP servers):**

```txt
# mcp-servers/morbis-devtools/requirements.txt
mcp>=1.0.0
scrapling[all]>=0.4.2
playwright>=1.45.0
httpx>=0.27.0
python-dotenv>=1.0.0
```

### 3.5 IPC/Transport Strategy

**MCP Server Communication:** stdio (default for local servers)

```
Agent (opencode) ←stdio→ MCP Server (Python/Node)
```

**Why stdio over HTTP:**

- No port management
- No CORS issues
- Process lifecycle tied to parent
- Simpler security (no network exposure)

**Extension Communication:** `chrome.runtime.sendMessage` (already implemented)

```
popup.js ←chrome.runtime→ background.js ←chrome.tabs→ content scripts
```

### 3.6 Configuration System

**Three-tier config:**

| Tier    | Source                            | Scope          | Override |
| ------- | --------------------------------- | -------------- | -------- |
| Default | `DEFAULT_CONFIG` in background.ts | All users      | No       |
| User    | `chrome.storage.sync`             | Per-browser    | Yes      |
| Dev     | `.env` + `opencode.json`          | Developer only | Yes      |

**Environment variables:**

```bash
# .env (gitignored)
MORBIS_BASE_URL=http://103.147.236.140
MORBIS_USERNAME=test_user
MORBIS_PASSWORD=test_pass
PLAYWRIGHT_BROWSER=chromium
```

### 3.7 Logging Strategy

**Extension (browser console):**

```typescript
// Already implemented in core.ts
function log(...args: unknown[]): void {
  console.log('[MORBIS Ext]', ...args);
}
```

**MCP Server (structured):**

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(name)s] %(levelname)s: %(message)s',
)
```

**Build (esbuild):**

```
[build] Building Morbis Ext Unofficial...
  dist\core.js      4.3kb
  dist\core.js.map  5.9kb
Done in 4ms
```

### 3.8 Testing Strategy

**Pyramid:**

```
         ┌──────────┐
         │   E2E    │  ← Playwright: real Morbis + extension
         │  (12)    │
        ┌┴──────────┴┐
        │  Component  │  ← Unit test individual features
        │   (20)      │
       ┌┴────────────┴┐
       │    Lint      │  ← ESLint + TypeScript type check
       │   + Type     │
       │   (always)   │
       └──────────────┘
```

**E2E test structure:**

```typescript
// tests/e2e/specs/batch-upload.spec.ts
test.describe('Batch Upload Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(MORBIS_LOGIN_URL);
    await page.fill('input[name="username"]', process.env.MORBIS_USERNAME!);
    await page.fill('input[name="password"]', process.env.MORBIS_PASS!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/m-klaim*');
  });

  test('upload multiple files via URL', async ({ page }) => {
    // ... test steps
  });
});
```

### 3.9 Observability/Debugging Setup

**Build artifacts:**

- Source maps (`.js.map`) — already generated by esbuild
- Bundle size report — add `esbuild --metafile`

**Runtime debugging:**

- Chrome DevTools: already available for extension debugging
- Console logs: prefixed with `[MORBIS Ext]` for filtering
- Network tab: monitor extension API calls

**MCP server debugging:**

- Log all tool calls with input/output
- Track execution time per tool
- Store error traces for analysis

### 3.10 Deployment Pipeline

```
push to main
    │
    ├── GitHub Actions: test.yml
    │   ├── npm ci
    │   ├── npm run lint
    │   ├── npm run typecheck
    │   └── npx playwright test
    │
    └── On success: deploy.yml
        ├── npm run build
        ├── npm run pack (generate .crx/.xpi)
        ├── Update update.xml / updates.json
        └── Push dist/ to gh-pages branch
```

---

## 4. Optimization & Reliability

### 4.1 Reducing Latency

| Area       | Strategy                                       | Expected Gain                  |
| ---------- | ---------------------------------------------- | ------------------------------ |
| Build      | esbuild (already)                              | <5s cold, <1s warm             |
| TypeScript | Incremental compilation                        | 50% faster recompile           |
| MCP calls  | Parallel execution for independent tools       | 2-3x faster workflows          |
| Scraping   | Cache HTML structure (selectors rarely change) | Skip parse on repeat calls     |
| Memory     | In-memory cache for hot keys                   | <1ms read vs 10ms disk         |
| Context    | Summarize at 75% capacity                      | Prevent context overflow retry |

### 4.2 Minimizing Token Usage

| Technique             | Application                                  | Savings                      |
| --------------------- | -------------------------------------------- | ---------------------------- |
| Structured output     | Tool responses use JSON, not prose           | 30-50% less tokens           |
| Context summarization | Compress DOM snapshots 10-25x                | 90% less tokens for DOM      |
| Pattern matching      | Reference existing code by name, not content | 60% less tokens for code gen |
| Memory retrieval      | Only retrieve relevant facts, not all        | 40% less tokens per session  |
| Selective diff        | Diff only changed selectors, not full DOM    | 80% less tokens for diff     |

### 4.3 Caching Context

**Three-level cache:**

```
L1: In-memory (process lifetime) — hot keys, current session state
L2: SQLite file (persistent) — facts, patterns, decisions
L3: File system (archive) — DOM snapshots, test results, scraped data
```

**Cache invalidation:**

- L1: Clear on session end
- L2: TTL-based (24h default), access-count based (frequently accessed live longer)
- L3: Manual cleanup or disk-space based

### 4.4 Preventing Hallucination

| Guard             | Implementation                                                                      |
| ----------------- | ----------------------------------------------------------------------------------- |
| Ground truth data | Always scrape live Morbis before generating code                                    |
| Schema validation | All tool outputs validated against expected schema                                  |
| Pattern matching  | Suggest implementations based on existing code, not imagination                     |
| DOM diff          | Verify extension doesn't break existing DOM                                         |
| Memory facts      | Store verified facts (CSS selectors, URL patterns) — agent retrieves, doesn't guess |

### 4.5 Improving Context Retention

**Memory-driven continuity:**

```
Session 1: Agent debugs fixJasaPelayanan
    → Stores: "root cause: recursive calculation chain"
    → Stores: "CSS selector for Jasa Pelayanan field: #js_pelayanan"
    → Stores: "Workaround: patch hitungJsPelayananFeatEmbal()"

Session 2: Agent sees similar bug
    → Retrieves: "recursive calculation chain" pattern
    → Applies: same patching strategy
    → Result: faster resolution, no re-discovery
```

### 4.6 Improving Tool Reliability

| Tool                    | Reliability Measure                                       |
| ----------------------- | --------------------------------------------------------- |
| `morbis-his-scraper`    | Auto-relogin on session expire, retry with backoff        |
| `playwright-e2e-runner` | Reuse browser context, parallel test execution            |
| `context-memory`        | SQLite with WAL mode, fallback to JSON file               |
| `dom-diff-analyzer`     | Scope to CSS selector, handle missing elements gracefully |
| `context-summarizer`    | Rule-based primary, LLM fallback, truncate last resort    |

### 4.7 Concurrency Handling

**MCP tool execution:**

```
Independent tools → Parallel execution
Dependent tools → Sequential (DAG order)
Shared resource → Mutex (e.g., cookie store)
```

**Example:**

```
debug-feature workflow:
  Step 1: Scrape page (sequential — needs live data)
  Step 2: Capture DOM (sequential — depends on step 1)
  Step 3: Diff DOM + Analyze patterns + Retrieve memory (PARALLEL — independent)
  Step 4: Synthesize findings (sequential — depends on step 3)
```

### 4.8 Retry Mechanism

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  backoffMs: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = backoffMs * Math.pow(2, i); // Exponential backoff
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}
```

### 4.9 Failover Strategy

| Failure            | Detection         | Failover                                  |
| ------------------ | ----------------- | ----------------------------------------- |
| Morbis server down | HTTP timeout      | Notify user, skip scrape, use cached data |
| Playwright crash   | Process exit code | Restart browser, retry test               |
| Memory DB corrupt  | SQLite error      | Fallback to JSON file                     |
| Build failure      | esbuild error     | Report error, halt deploy                 |
| Tool timeout       | Timeout exceeded  | Retry → fallback → skip                   |

---

## 5. Tradeoff Analysis

### 5.1 TypeScript Migration

| Aspect                 | Analysis                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Kelebihan**          | Type safety catches 60% bugs at compile time, better IDE support, self-documenting code |
| **Kekurangan**         | Migration effort (12 files, ~5000 lines), build step required, larger bundle (minimal)  |
| **Complexity cost**    | Medium — gradual migration, existing JS still works                                     |
| **Scalability impact** | Positive — types make adding features safer                                             |
| **Maintenance cost**   | Low — TypeScript is standard, well-documented                                           |
| **Cocok digunakan**    | Project dengan 3+ developers, frequent feature additions                                |
| **Hindari jika**       | Solo developer, rarely changing codebase, tight deadline                                |

### 5.2 esbuild vs Webpack

| Aspect                 | esbuild                                   | Webpack                               |
| ---------------------- | ----------------------------------------- | ------------------------------------- |
| **Kelebihan**          | 100x faster, zero-config, simple API      | Plugin ecosystem, code splitting, HMR |
| **Kekurangan**         | Limited plugin ecosystem, no HMR          | Slow, complex config                  |
| **Complexity cost**    | Low — 50 line build script                | High — 200+ line config               |
| **Scalability impact** | Neutral — works for any size              | Positive for very large projects      |
| **Maintenance cost**   | Low — minimal config                      | Medium — plugin updates               |
| **Cocok digunakan**    | Extension projects, simple bundling needs | Complex apps with code splitting      |
| **Hindari jika**       | Need HMR, complex code splitting          | Simple projects (overkill)            |

### 5.3 MCP Server Architecture

| Aspect                 | Monolithic MCP                           | Modular MCP (recommended)            |
| ---------------------- | ---------------------------------------- | ------------------------------------ |
| **Kelebihan**          | Simple deployment, shared state          | Independent scaling, fault isolation |
| **Kekurangan**         | Single point of failure, harder to debug | More processes, IPC overhead         |
| **Complexity cost**    | Low                                      | Medium — need orchestration          |
| **Scalability impact** | Negative — all tools share resources     | Positive — scale independently       |
| **Maintenance cost**   | Low                                      | Medium — more moving parts           |
| **Cocok digunakan**    | 1-3 tools, single developer              | 5+ tools, team development           |
| **Hindari jika**       | Simple use case, limited resources       | Need tight coupling between tools    |

### 5.4 SQLite vs JSON for Memory

| Aspect                 | SQLite                                   | JSON file                           |
| ---------------------- | ---------------------------------------- | ----------------------------------- |
| **Kelebihan**          | Fast queries, indexes, concurrent access | Simple, portable, human-readable    |
| **Kekurangan**         | Requires library, binary file            | Slow for large data, no indexes     |
| **Complexity cost**    | Low — SQLite is standard                 | None                                |
| **Scalability impact** | Positive — handles 100K+ entries         | Negative — slow beyond 1000 entries |
| **Maintenance cost**   | Low                                      | Low                                 |
| **Cocok digunakan**    | 100+ memory entries, frequent queries    | <100 entries, infrequent access     |
| **Hindari jika**       | Simple key-value needs                   | Need complex queries                |

### 5.5 Event-driven vs Request-driven

| Aspect                 | Event-driven                            | Request-driven (recommended)    |
| ---------------------- | --------------------------------------- | ------------------------------- |
| **Kelebihan**          | Async, decoupled, scalable              | Predictable, easy to debug      |
| **Kekurangan**         | Hard to trace, race conditions          | Blocking, less flexible         |
| **Complexity cost**    | High — need event bus, state management | Low — linear flow               |
| **Scalability impact** | Positive — async scales well            | Neutral — depends on tool speed |
| **Maintenance cost**   | High — event flow hard to trace         | Low — linear execution          |
| **Cocok digunakan**    | High-throughput, real-time systems      | Agent workflows, debugging      |
| **Hindari jika**       | Need predictable execution              | Need real-time async processing |

---

## 6. Implementation Roadmap

### 6.1 MVP Architecture (Week 1-2) — DONE

**Completed (Phase 1):**

- [x] `package.json` with build scripts
- [x] `tsconfig.json` with strict mode
- [x] ESLint + Prettier configuration
- [x] esbuild build script (`scripts/build.mjs`)
- [x] TypeScript migration: `core.ts`, `background.ts`, `popup.ts`, `init.ts`
- [x] TypeScript migration: `features/shared/cookieFilterStorage.ts`, `utils.ts`
- [x] Build output to `dist/` with source maps
- [x] All checks pass: `npm run build`, `npm run lint`, `npm run typecheck`

**Status:** Build system operational. Extension in `dist/` ready for testing as unpacked extension.

### 6.2 Full TypeScript Migration & Build System — DONE

**Completed (Phase 2-4):**

- [x] All 17 TypeScript feature files migrated (including `openDetail.ts`, `shortcutButtons.ts`)
- [x] `SharedBatchUtils` module (`src/features/shared/batchUtils.ts`)
- [x] Shared types module (`src/features/shared/types.ts`) — `getMorbisGlobals()` pattern
- [x] All original JS files in `features/` removed
- [x] Build script (`scripts/build.mjs`) simplified — pure TS compilation, no fallback copy
- [x] Production minification (`npm run build:prod`, esbuild `--minify`)
- [x] Core bundles: core.js 2.4kb, background.js 5.9kb, popup.js 8.2kb (minified)

**Status:** Extension 100% TypeScript. All 17 features compile via esbuild. Build, lint, typecheck, format:check all pass.

### 6.3 MCP Server & Testing — DONE

**MCP server (`mcp-servers/morbis-devtools/server.py`):**

- [x] `scrape_morbis_page` — scrape Morbis HIS with session management
- [x] `diff_dom` — compare two HTML versions
- [x] `analyze_feature` — suggest implementation based on patterns
- [x] `read_config` — read extension config and features
- [x] `get_feature_source` — read source of specific feature
- [x] `validate_build` — validate TS compilation and checks

**Testing infrastructure:**

- [x] Vitest unit tests (`npm test`) — 47 tests for pure logic (URL generation, ID extraction, storage, config management)
- [x] Playwright E2E build validity tests (`npm run test:e2e`) — validates build output exists
- [x] Chrome extension API mock for unit tests

### 6.4 CI/CD Pipeline — DONE

- [x] `.github/workflows/test.yml` — lint, typecheck, build on push/PR
- [x] `.github/workflows/deploy.yml` — auto-deploy to GitHub Pages on tag
- [x] `scripts/pack.mjs` — pack extension to .crx/.xpi
- [x] `scripts/deploy.mjs` — deploy script

### 6.5 Implementation Checklist

| Priority | Task                                                                         | Status  | Risk                                                      |
| -------- | ---------------------------------------------------------------------------- | ------- | --------------------------------------------------------- |
| P0       | Phase 1 build system                                                         | ✅ Done | None                                                      |
| P0       | Full TypeScript migration (17 features + shared)                             | ✅ Done | Low — all compile and pass typecheck                      |
| P0       | Vitest unit tests (47 tests, pure logic)                                     | ✅ Done | Low — no browser dependency                               |
| P1       | MCP server: 6 tools (scrape, diff, analyze, readConfig, getSource, validate) | ✅ Done | Low                                                       |
| P1       | Production minification                                                      | ✅ Done | Low                                                       |
| P1       | CI/CD pipeline (test + deploy)                                               | ✅ Done | Low                                                       |
| P2       | Playwright build validity E2E                                                | ✅ Done | Low                                                       |
| P2       | .gitignore + .gitattributes updated                                          | ✅ Done | None                                                      |
| P3       | E2E content script testing (requires live Morbis server)                     | Blocked | High — Playwright route() blocks content script injection |
| P3       | MCP server: context-memory, session-orchestrator                             | Future  | Low priority                                              |

### 6.6 Risk Analysis

| Risk                                                      | Probability | Impact | Mitigation                                                   |
| --------------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------ |
| Content script E2E testing impossible without live server | High        | Low    | Unit tests cover pure logic; manual testing for DOM features |
| TypeScript compilation regression                         | Low         | High   | CI runs build + typecheck on every push                      |
| Vitest mock mismatch with real chrome API                 | Medium      | Medium | Keep mocks minimal; integration test via extension popup     |
| Morbis server changes break scraper                       | Medium      | High   | Cache HTML structure, alert on selector mismatch             |
| Build pipeline breaks                                     | Low         | High   | Pin dependency versions, test locally first                  |

### 6.7 Technical Debt Consideration

**Current debt:**

- No DOM-level integration tests (content scripts don't inject in Playwright mock pages)
- No performance benchmarks
- MCP server uses regex-based HTML parsing (fragile)

**Debt repayment plan:**

1. Add Vitest tests for remaining edge cases (P2)
2. Implement MCP server for `context-memory` (P3)
3. Add bundle size reporting to CI (P3)

**Debt to accept:**

- Content script E2E testing requires a live Morbis server or Chrome extension testing API
- Regex-based HTML parsing is sufficient for current scale
- No LLM summarization needed (rule-based works)

---

## Appendix: Quick Reference

### Build Commands

```bash
npm run build        # Build extension to dist/ (dev: sourcemaps, no minify)
npm run build:prod   # Build extension (minified, no sourcemaps)
npm run watch        # Watch mode (auto-rebuild)
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run typecheck    # TypeScript type check
npm run format       # Prettier format
npm run format:check # Prettier check
npm run clean        # Remove dist/
npm run pack         # Build + pack .crx/.xpi
npm run deploy       # Build + pack + deploy
npm test             # Run Vitest unit tests
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Run Playwright build validity tests
```

### MCP Server Commands

```bash
# Start MCP server with 6 tools
python -m mcp run mcp-servers/morbis-devtools/server.py

# Available tools: scrape_morbis_page, diff_dom, analyze_feature,
#                  read_config, get_feature_source, validate_build
```

### Extension Testing

```bash
# Load unpacked extension
# Chrome: chrome://extensions → Load unpacked → select dist/

# Run unit tests (47 tests)
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E build validity tests
npm run test:e2e

# Run specific unit test
npx vitest run tests/unit/shared-types.test.ts
```
