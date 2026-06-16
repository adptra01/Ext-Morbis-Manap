import { createRoot } from 'react-dom/client'
import { App } from '../src/popup/App'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}

export {}
