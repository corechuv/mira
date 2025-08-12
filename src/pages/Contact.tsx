export default function Contact() {
  return (
    <div className="container-narrow mt-6">
      <h1 className="text-2xl font-semibold">Контакты</h1>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <div>Email: support@mira.shop</div>
        <div>Телефон: +7 (999) 000-00-00</div>
        <div>Часы работы: Пн–Пт, 10:00–19:00</div>
      </div>
      <form className="mt-6 grid gap-3 md:max-w-md">
        <input className="input" placeholder="Ваше имя" />
        <input className="input" placeholder="Email" />
        <textarea className="input min-h-[120px]" placeholder="Сообщение"></textarea>
        <button className="btn btn-primary w-full md:w-auto">Отправить</button>
      </form>
    </div>
  )
}
