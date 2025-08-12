import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

function Fallback() { return <div style={{padding:'2rem',textAlign:'center'}}>Загрузка…</div> }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </React.StrictMode>,
)
