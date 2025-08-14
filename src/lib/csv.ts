export function toCSV(rows: any[]): string {
  if (!rows?.length) return ''
  const keys = [...new Set(rows.flatMap((r:any)=>Object.keys(r)))]
  const esc = (v:any) => {
    const s = v==null ? '' : String(v)
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s
  }
  return [keys.join(','), ...rows.map((r:any)=>keys.map(k=>esc(r[k])).join(','))].join('\n')
}

export function parseCSV(text: string): Record<string,string>[] {
  const lines = text.replace(/\r/g,'').split('\n').filter(Boolean)
  if (!lines.length) return []
  const headers = splitLine(lines.shift()!)
  return lines.map(l => {
    const cols = splitLine(l)
    const o: Record<string,string> = {}
    headers.forEach((h, i) => o[h] = cols[i] ?? '')
    return o
  })
}

function splitLine(s: string): string[] {
  const out: string[] = []
  let cur = '', q = false
  for (let i=0;i<s.length;i++){
    const c=s[i]
    if (q) {
      if (c === '"' && s[i+1] === '"') { cur+='"'; i++ }
      else if (c === '"') q=false
      else cur+=c
    } else {
      if (c === ',') { out.push(cur); cur='' }
      else if (c === '"') q=true
      else cur+=c
    }
  }
  out.push(cur)
  return out
}
