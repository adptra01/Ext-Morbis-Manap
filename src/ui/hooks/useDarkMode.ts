import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      return 'system'
    }
    return 'system'
  })

  const [resolved, setResolved] = useState(false)

  useEffect(() => {
    chrome.storage.sync.get('md-theme', (result) => {
      const stored = (result['md-theme'] as Theme) || 'system'
      setTheme(stored)
      applyTheme(stored)
    })
  }, [])

  const applyTheme = useCallback((t: Theme) => {
    let isDark: boolean
    if (t === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark = t === 'dark'
    }
    document.documentElement.classList.toggle('dark', isDark)
    setResolved(isDark)
  }, [])

  const setAndStore = useCallback((t: Theme) => {
    setTheme(t)
    applyTheme(t)
    chrome.storage.sync.set({ 'md-theme': t })
  }, [applyTheme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') applyTheme('system')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, applyTheme])

  return { theme, resolved, setTheme: setAndStore }
}
