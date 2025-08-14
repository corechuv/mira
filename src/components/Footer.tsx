import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container py-6 text-sm text-slate-600 text-center">
        © {new Date().getFullYear()} Mira · Kosmetik Onlineshop
      </div>
    </footer>
  )
}
