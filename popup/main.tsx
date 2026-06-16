import { createRoot } from 'react-dom/client'

function App() {
  return <div>MORBIS Ext Popup</div>
}

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}

export {}
