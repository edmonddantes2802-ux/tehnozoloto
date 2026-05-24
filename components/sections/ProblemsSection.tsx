import { PhoneOff, ShieldAlert, Clock } from 'lucide-react';
import { Card } from '@/components/shared/Card';

const problems = [
  {
    icon: PhoneOff,
    title: 'Бесконечные звонки и пустые торги',
    text: 'Десятки покупателей пишут «а можно дешевле?» и пропадают на неделю.',
  },
  {
    icon: ShieldAlert,
    title: 'Риск наткнуться на мошенников',
    text: 'Личные встречи в незнакомых местах небезопасны — особенно при крупной сумме.',
  },
  {
    icon: Clock,
    title: 'Срочно нужны деньги — покупателя нет',
    text: 'Объявления висят неделями, а платёжи по кредитам не ждут.',
  },
];

export function ProblemsSection() {
  return (
    <section className="section bg-white">
      <div className="container-corp">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4">Почему продавать на досках объявлений — это долго и небезопасно?</h2>
          <p className="text-corporate-gray">
            Мы видели эти истории сотни раз. Возможно, одна из них — про вас.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {problems.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-corp bg-danger/10 text-danger">
                <Icon size={28} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-corporate-gray">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
