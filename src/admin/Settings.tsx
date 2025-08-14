import { useEffect, useState } from 'react'
import { supabase, SUPA_INFO } from '@/lib/supabase'

export default function Settings(){
  const env = {
    SITE_URL: import.meta.env.VITE_SITE_URL,
    SUPABASE_URL: SUPA_INFO.url,
    SUPABASE_REF: SUPA_INFO.projectRef || '(n/a)',
    SUPABASE_REGION: SUPA_INFO.region || '(n/a)',
    SUPABASE_IS_LOCAL: SUPA_INFO.isLocal ? 'YES' : 'no',
    CURRENCY: import.meta.env.VITE_CURRENCY || 'EUR',
    LOCALE: import.meta.env.VITE_LOCALE || 'de-DE',
    ADMIN_EMAILS: import.meta.env.VITE_ADMIN_EMAILS || ''
  }

  const [db, setDb] = useState<{ ok:boolean; msg?:string; count?:number }>({ ok:false })

  useEffect(()=>{ (async ()=>{
    try {
      // лёгкий запрос: подсчитать категории (если таблица есть)
      const { count, error } = await supabase.from('categories').select('*', { count: 'exact', head: true })
      if (error) return setDb({ ok:false, msg: error.message })
      setDb({ ok:true, count: count ?? 0 })
    } catch (e:any) {
      setDb({ ok:false, msg: e?.message || String(e) })
    }
  })() },[])

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Настройки / Диагностика</h1>

      <div className="card p-4">
        <h2 className="mb-2 font-semibold">ENV (frontend)</h2>
        <div className="grid gap-2 text-sm">
          {Object.entries(env).map(([k,v])=>(
            <div key={k} className="flex justify-between gap-4">
              <div className="text-slate-500">{k}</div>
              <div className="font-mono break-all">{String(v)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-4 p-4">
        <h2 className="mb-2 font-semibold">Проверка соединения с Supabase</h2>
        {db.ok
          ? <div className="text-sm">OK ✓ · categories: {db.count}</div>
          : <div className="text-sm text-rose-600">Ошибка: {db.msg || 'не удалось подключиться'}</div>
        }
        {SUPA_INFO.isLocal && (
          <p className="mt-2 text-sm text-amber-600">
            ВНИМАНИЕ: SUPABASE_URL указывает на локальный инстанс. Проверь .env.local → VITE_SUPABASE_URL должен быть вида:
            https://&lt;project-ref&gt;.supabase.co
          </p>
        )}
      </div>
    </div>
  )
}
