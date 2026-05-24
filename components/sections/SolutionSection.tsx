import { Microscope, Cpu, FileText, CreditCard, ShieldCheck, Scale } from 'lucide-react';

const items = [
  {
    icon: Microscope,
    title: 'Высокоточное оборудование',
    text: 'Рентген-флуоресцентный анализатор проб золота без повреждения изделия.',
  },
  {
    icon: Cpu,
    title: 'Диагностика техники за 10 минут',
    text: 'Проверка устройства при вас: аккумулятор, экран, модули связи.',
  },
  {
    icon: FileText,
    title: 'Юридическая чистота',
    text: 'Официальный договор комиссии или купли-продажи, фискальный чек.',
  },
  {
    icon: CreditCard,
    title: 'Любой способ выплаты',
    text: 'Наличные на руки, перевод на карту Сбера/Тинькофф или СБП.',
  },
  {
    icon: ShieldCheck,
    title: 'Полная конфиденциальность',
    text: 'Данные шифруются, передаются только менеджеру по сделке.',
  },
  {
    icon: Scale,
    title: 'Честные коэффициенты',
    text: 'Прозрачные формулы расчёта — вы видите, из чего складывается цена.',
  },
];

export function SolutionSection() {
  return (
    <section className="section bg-gradient-to-b from-white to-gold/5">
      <div className="container-corp">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4">Профессиональный подход к оценке ваших ценностей</h2>
          <p className="text-corporate-gray">
            Мы работаем по банковским стандартам безопасности и прозрачности.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-card border border-corporate-border bg-white p-6 transition-shadow hover:shadow-card-hover"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-corporate-gray">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
