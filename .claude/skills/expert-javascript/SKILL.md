# Expert JavaScript

Modern JavaScript patterns for browser extension development.

## Modern JS (ES2020+)

- Use `const`/`let`, no `var`
- Arrow functions for callbacks, named functions for declarations
- Destructuring: `const { foo, bar } = obj`
- Optional chaining: `obj?.prop?.nested`
- Nullish coalescing: `val ?? defaultValue`
- Logical assignment: `x ||= y`, `x &&= y`, `x ??= y`
- Spread: `{...obj}`, `[...arr]`
- Dynamic imports: `const mod = await import('./path.js')`

## Async Patterns

```js
// Prefer async/await over .then()
async function loadData() {
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (err) {
    console.error('Failed:', err)
    return null
  }
}

// Parallel execution
const [a, b] = await Promise.all([fetchA(), fetchB()])
```

## DOM & Content Scripts

- Cache DOM queries: `const $ = (sel, ctx=document) => ctx.querySelector(sel)`
- Use `MutationObserver` instead of polling
- Debounce/throttle frequent events (scroll, resize, input)
- Prefer `event delegation` over individual listeners
- Use `textContent` instead of `innerHTML` (XSS safety)
- For `MAIN` world scripts, use `document.getElementById` etc.

## Chrome Extension Storage

```js
const storage = {
  async get(key) {
    const result = await chrome.storage.local.get(key)
    return result[key]
  },
  async set(key, value) {
    await chrome.storage.local.set({ [key]: value })
  }
}
```

## Messaging (runtime.sendMessage)

- Validate message structure before processing
- Always handle errors in `sendMessage` callback/await
- Use `try/catch` around `chrome.runtime.sendMessage`

## Error Handling

- Always handle promise rejections
- Use `try/catch` around async operations
- Log meaningful context: `console.warn('Action failed:', { action, error })`

## Performance

- Minimize DOM access in loops
- Batch DOM reads/writes
- Use `requestAnimationFrame` for visual updates
- Debounce storage writes
- Lazy-load features not immediately needed
