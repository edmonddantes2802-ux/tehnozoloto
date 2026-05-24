import { Award, ClipboardCheck, Banknote, ShieldCheck, Sparkles } from 'lucide-react';

const guarantees = [
  {
    icon: ClipboardCheck,
    title: 'Диагностика техники за 10 минут',
    text: 'Аккумулятор, экран, модули связи, чистота IMEI — всё проверяем при вас, отчёт остаётся у клиента.',
  },
  {
    icon: ShieldCheck,
    title: 'Честная карточка товара',
    text: 'Все известные особенности и недостатки техники заранее указываем в описании — без скрытых сюрпризов.',
  },
  {
    icon: Banknote,
    title: 'Деньги в день обращения',
    text: 'Наличные, перевод на карту или СБП — выбираете сами. Без скрытых комиссий.',
  },
  {
    icon: Award,
    title: 'Лицензия и документы',
    text: 'Договор купли-продажи, фискальный чек, акт оценки. Работаем по 41-ФЗ для операций с золотом.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="section bg-corporate-bg">
      <div className="container-corp">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-dark">
            <Sparkles size={16} />О нас
          </div>
          <h2 className="mb-4">Техника, которой можно доверять</h2>
          <p className="text-corporate-gray">
            «Техно-Золото» — это команда инженеров и мастеров электроники.
            Мы выкупаем и продаём смартфоны, ноутбуки, планшеты, игровые консоли
            и аудиотехнику Apple, Samsung, Sony, ASUS и других брендов. Каждое
            устройство проходит полную диагностику, все известные дефекты честно
            указываем в карточке. Параллельно работаем с золотом 375–999 пробы —
            для тех, кому удобно закрыть оба вопроса в одном месте.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {guarantees.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 rounded-card border border-corporate-border bg-white p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-corporate-gray">{text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
