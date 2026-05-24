import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Оплата принята — Техно-Золото',
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const order = searchParams.order;
  return (
    <div className="bg-corporate-bg py-16">
      <div className="container-corp max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-3xl">
          ✓
        </div>
        <h1 className="mb-3">Спасибо за покупку!</h1>
        <p className="mb-2 text-corporate-gray">
          Оплата прошла успешно. Фискальный чек по 54-ФЗ придёт на ваш телефон
          или email от оператора фискальных данных.
        </p>
        {order && (
          <p className="mb-6 text-sm text-corporate-muted">
            Номер заказа: <code>{order.slice(0, 8)}</code>
          </p>
        )}
        <p className="mb-8 text-corporate-gray">
          Менеджер свяжется в течение 10 минут — согласует время самовывоза или
          адрес доставки.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/catalog">
            <Button variant="outline">Продолжить покупки</Button>
          </Link>
          <a
            href={`https://wa.me/${LEGAL.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button>Написать в WhatsApp</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
