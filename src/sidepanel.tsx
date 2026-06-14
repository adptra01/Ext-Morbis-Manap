import { createRoot } from 'react-dom/client'
import { App } from './features/sidepanel/App'

const root = document.getElementById('app')
if (root) {
  const reactRoot = createRoot(root)
  reactRoot.render(<App />)
}

export {}
