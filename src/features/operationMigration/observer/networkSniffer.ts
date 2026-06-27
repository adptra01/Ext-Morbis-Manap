import type { NetworkRecord } from '../shared/types.js'

type Unsubscriber = () => void

let isActive = false
const captured: NetworkRecord[] = []

function isRelevant(url: string): boolean {
  const u = url.toLowerCase()
  return u.includes('detail_operasi') || u.includes('input-tindakan-oprasi') || u.includes('pengajuan-operasi')
}

function isBpjs(url: string): boolean {
  const u = url.toLowerCase()
  return u.includes('vclaim') || u.includes('bpjs') || u.includes('trust-mark') || u.includes('bridging')
}

function recordRequest(method: string, url: string, body: string | null, startTime: number): void {
  if (!isRelevant(url)) return
  let payload: Record<string, string> | null = null
  if (body) {
    try {
      const params = new URLSearchParams(body)
      payload = Object.fromEntries(params.entries())
    } catch { /* skip */ }
  }

  captured.push({
    timestamp: new Date().toISOString(),
    method,
    url,
    requestPayload: payload,
    responseStatus: 0,
    responseBody: null,
    duration: Date.now() - startTime,
    isBpjsRequest: isBpjs(url),
  })
}

function recordResponse(url: string, status: number, body: string | null, duration: number): void {
  if (!isRelevant(url)) return
  const existing = captured.find((r) => r.url === url && r.responseStatus === 0)
  if (existing) {
    existing.responseStatus = status
    existing.responseBody = body ? body.substring(0, 5000) : null
    existing.duration = duration
  }
}

export function startNetworkObserver(): Unsubscriber {
  if (isActive) return () => {}
  isActive = true
  captured.length = 0

  const origFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const start = Date.now()
    recordRequest((init?.method || 'GET').toUpperCase(), url, init?.body?.toString() || null, start)

    const response = await origFetch(input, init)
    const clone = response.clone()
    clone.text().then((text) => {
      recordResponse(url, response.status, text, Date.now() - start)
    }).catch(() => {})

    return response
  }

  const origOpen = XMLHttpRequest.prototype.open
  const origSend = XMLHttpRequest.prototype.send
  const xhrMap = new WeakMap<XMLHttpRequest, { url: string; method: string; start: number }>()

  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL) {
    const urlStr = typeof url === 'string' ? url : url.href
    xhrMap.set(this, { url: urlStr, method, start: Date.now() })
    const args = [method, url] as const
    return origOpen.apply(this, args as unknown as [string, string])
  }

  XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const meta = xhrMap.get(this)
    if (meta) {
      const bodyStr = typeof body === 'string' ? body : body instanceof URLSearchParams ? body.toString() : null
      recordRequest(meta.method, meta.url, bodyStr, meta.start)

      this.addEventListener('loadend', () => {
        recordResponse(meta.url, this.status, this.responseText, Date.now() - meta.start)
      })
    }
    const args = body !== undefined ? [body] : []
    return origSend.apply(this, args as unknown as [Document | XMLHttpRequestBodyInit | null | undefined])
  }

  return () => {
    window.fetch = origFetch
    XMLHttpRequest.prototype.open = origOpen
    XMLHttpRequest.prototype.send = origSend
    isActive = false
  }
}

export function getCapturedRequests(): NetworkRecord[] {
  return [...captured]
}
