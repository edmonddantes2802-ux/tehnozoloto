import type { Metadata } from 'next';
import { Truck, MapPin, Package } from 'lucide-react';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Доставка и оплата — Техно-Золото',
  description:
    'Способы получения техники и золота: самовывоз в Москве, доставка по городу и в регионы РФ. Оплата картой через ЮKassa.',
};

export default function DeliveryPage() {
  return (
    <div className="bg-corporate-bg py-12">
      <div className="container-corp max-w-3xl">
        <h1 className="mb-2">Доставка и оплата</h1>
        <p className="mb-10 text-corporate-gray">
          После заявки менеджер свяжется в течение 10 минут и согласует удобный
          способ получения товара. Доставка начинается после подтверждения оплаты.
        </p>

        <div className="space-y-4">
          <article className="flex gap-4 rounded-card border border-corporate-border bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">Самовывоз</h3>
              <p className="text-sm text-corporate-gray">
                {LEGAL.pickupAddress}. Часы работы: {LEGAL.workingHours}.
                Заберите товар после подтверждения оплаты — обычно в день
                обращения.
              </p>
              <p className="mt-2 text-sm font-semibold text-success">Бесплатно</p>
            </div>
          </article>

          <article className="flex gap-4 rounded-card border border-corporate-border bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                Доставка по {LEGAL.courierCity}
              </h3>
              <p className="text-sm text-corporate-gray">
                Привезём в день оплаты при заказе до 17:00, иначе — на следующий
                день. На выбор:
              </p>
              <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-corporate-gray">
                <li>Яндекс Go (Яндекс.Доставка) — курьер на авто или экспресс-курьер;</li>
                <li>Достависта — пеший курьер или авто.</li>
              </ul>
              <p className="mt-2 text-sm font-semibold text-corporate-gray">
                Стоимость рассчитывается сервисом в зависимости от расстояния и
                габаритов
              </p>
            </div>
          </article>

          <article className="flex gap-4 rounded-card border border-corporate-border bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
              <Package size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                Доставка в регионы
              </h3>
              <p className="text-sm text-corporate-gray">
                Отправляем в любой город РФ через одну из служб на ваш выбор:
              </p>
              <ul className="ml-5 mt-2 list-disc space-y-1 text-sm text-corporate-gray">
                <li>Авито Доставка — оформляется через объявление товара на Авито;</li>
                <li>СДЭК — пункт выдачи или курьер до двери;</li>
                <li>Почта России — заказное отправление с трек-номером;</li>
                <li>Яндекс Доставка — межгород.</li>
              </ul>
              <p className="mt-2 text-sm font-semibold text-corporate-gray">
                Стоимость и срок — по тарифам перевозчика. Трек-номер пришлём
                после отправки.
              </p>
            </div>
          </article>
        </div>

        <h2 className="mb-4 mt-10 text-2xl font-semibold">Оплата</h2>
        <div className="space-y-3 rounded-card border border-corporate-border bg-white p-6 text-sm text-corporate-gray">
          <p>
            Принимаем оплату <strong>банковскими картами</strong> Visa, Mastercard,
            МИР через защищённый платёжный сервис ЮKassa (АО «ЮMoney»). Платёж
            обрабатывается на стороне ЮKassa, реквизиты карты не передаются
            продавцу и не хранятся на сайте.
          </p>
          <p>
            После оплаты на ваш email и в чате с менеджером автоматически придёт
            фискальный кассовый чек по 54-ФЗ через оператора
            ФНС России.
          </p>
          <p>
            <strong>Возврат денег</strong> при отказе от покупки или возврате
            товара в течение 14 дней — на ту же карту, с которой произведена
            оплата, в течение 3–10 рабочих дней.
          </p>
        </div>

        <h2 className="mb-4 mt-10 text-2xl font-semibold">Возврат и обмен</h2>
        <div className="space-y-3 rounded-card border border-corporate-border bg-white p-6 text-sm text-corporate-gray">
          <p>
            Все известные особенности и недостатки товара описываются в карточке
            до оплаты. Если вопрос всё-таки возник — напишите нам на{' '}
            {LEGAL.email} с описанием ситуации и фотографиями, разберём
            индивидуально.
          </p>
          <p>
            Возврат и обмен производятся в порядке, установленном действующим
            законодательством Российской Федерации. Деньги возвращаются на ту же
            карту, с которой была произведена оплата, в срок до 10 рабочих дней.
          </p>
        </div>
      </div>
    </div>
  );
}
