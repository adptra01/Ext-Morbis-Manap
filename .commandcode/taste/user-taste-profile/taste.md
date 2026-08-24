# User Taste Profile

- Uses `@src` as a path alias for the `src/` directory in TypeScript projects (e.g., `@src/features/antrianTools.ts`). Confidence: 0.7
- Prefers communicating in Indonesian (Bahasa Indonesia). Confidence: 0.9
- Uses casual/informal communication style, mixing Indonesian with English in requests (e.g., "tolong i cek"). Confidence: 0.7
- Expects rigorous verification after code changes, especially deletions/removals — explicitly asks to "pastikan tidak ada masalah pada fitur2 lainnya dan cek secara pasti"; wants all references hunted down (config, manifest, build scripts, docs, dist) and full checks run (typecheck, lint, build, tests, audit scripts) before a change counts as done. Confidence: 0.8
- Verification of fixes goes beyond local checks: prove behavior end-to-end against the live dev environment (scripted curl sequences reproducing the bug and the fix against the real API) and confirm the compiled dist artifact actually contains the change before reporting done. Confidence: 0.6
- Issues terse, single-word imperative commands (e.g., a bare "push") and expects fully autonomous follow-through — inspect git status, separate unrelated pre-existing/uncommitted work into its own commit, commit the actual fix, and push to the working branch (origin/dev) without asking for extra confirmation. Confidence: 0.65
