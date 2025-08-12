import { useEffect, useState } from 'react'
export default function RuntimeErrorOverlay(){
  const [err, setErr] = useState<string|null>(null)
  useEffect(()=>{
    const h = (e: ErrorEvent) => setErr((e?.error?.message)||e?.message||'Runtime error')
    const pr = (e: PromiseRejectionEvent) => setErr((e?.reason?.message)||String(e.reason)||'Unhandled rejection')
    window.addEventListener('error', h)
    window.addEventListener('unhandledrejection', pr)
    return ()=>{ window.removeEventListener('error', h); window.removeEventListener('unhandledrejection', pr) }
  },[])
  if(!err) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',color:'#fff',zIndex:9999,padding:'24px',overflow:'auto'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <h2 style={{fontWeight:800, fontSize:20, marginBottom:12}}>Ошибка выполнения</h2>
        <pre style={{whiteSpace:'pre-wrap',fontSize:14,lineHeight:1.4}}>{err}</pre>
        <p style={{opacity:.8,marginTop:12}}>Временно: overlay включён для поиска причины. Уберём после фикса.</p>
      </div>
    </div>
  )
}
