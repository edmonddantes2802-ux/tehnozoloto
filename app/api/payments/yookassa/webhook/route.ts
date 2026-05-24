import { NextResponse, type NextRequest } from 'next/server';
import { adminSelect, adminUpdate, isAdminConfigured } from '@/lib/supabase/rest';
import { isConfigured } from '@/lib/yookassa';

// ЮKassa отправляет уведомления о статусе платежа на этот URL.
// В ЛК ЮKassa: Интеграция → HTTP-уведомления → URL вашего сайта/api/payments/yookassa/webhook
//
// IP-whitelist ЮKassa: https://yookassa.ru/developers/using-api/webhooks#ip
// Проверку IP сейчас не добавлял — добавьте до прода.

interface WebhookEvent {
  event:
    | 'payment.succeeded'
    | 'payment.canceled'
    | 'payment.waiting_for_capture'
    | 'refund.succeeded';
  object: {
    id: string;
    status: string;
    paid: boolean;
    amount: { value: string; currency: string };
    metadata?: Record<string, string>;
  };
}

interface OrderItemRow {
  product_id?: string;
}

interface OrderRow {
  items: OrderItemRow[];
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'yookassa not configured' }, { status: 503 });
  }
  if (!isAdminConfigured()) {
    console.warn('[yookassa.webhook] SUPABASE_SERVICE_ROLE_KEY not set');
    return NextResponse.json({ ok: true });
  }

  try {
    const evt = (await req.json()) as WebhookEvent;
    const orderId = evt.object.metadata?.order_id;
    if (!orderId) {
      console.warn('[yookassa.webhook] no order_id in metadata', evt.object.id);
      return NextResponse.json({ ok: true });
    }

    const status =
      evt.event === 'payment.succeeded'
        ? 'paid'
        : evt.event === 'payment.canceled'
        ? 'cancelled'
        : 'pending';

    // 1. Обновляем сам заказ
    await adminUpdate('orders', `id=eq.${encodeURIComponent(orderId)}`, {
      status,
      payment_id: evt.object.id,
      paid_at: evt.event === 'payment.succeeded' ? new Date().toISOString() : null,
    });

    // 2. Если оплачено — снимаем все товары заказа с витрины
    if (evt.event === 'payment.succeeded') {
      const orders = await adminSelect<OrderRow>(
        'orders',
        `id=eq.${encodeURIComponent(orderId)}&select=items`
      );
      const items = orders[0]?.items ?? [];
      const productIds = items
        .map((i) => i.product_id)
        .filter((id): id is string => !!id);
      if (productIds.length > 0) {
        await adminUpdate(
          'products',
          `id=in.(${productIds.map(encodeURIComponent).join(',')})`,
          { is_sold: true }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[yookassa.webhook]', e);
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
