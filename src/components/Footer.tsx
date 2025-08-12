import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container-narrow grid gap-8 py-10 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-semibold">Mira</h4>
          <p className="text-sm text-slate-600">Естественная красота каждый день.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Навигация</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="hover:underline">Каталог</Link></li>
            <li><Link to="/about" className="hover:underline">О нас</Link></li>
            <li><Link to="/contact" className="hover:underline">Контакты</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Документы</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/policy#privacy" className="hover:underline">Политика конфиденциальности</Link></li>
            <li><Link to="/policy#terms" className="hover:underline">Пользовательское соглашение</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Поддержка</h4>
          <p className="text-sm">support@mira.shop</p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Mira</div>
    </footer>
  )
}
