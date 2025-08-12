import { Link } from 'react-router-dom'
export default function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="text-sm text-slate-600 mb-3" aria-label="Хлебные крошки">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to} className="hover:underline">{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span className="mx-2 text-slate-400">/</span>}
        </span>
      ))}
    </nav>
  )
}
