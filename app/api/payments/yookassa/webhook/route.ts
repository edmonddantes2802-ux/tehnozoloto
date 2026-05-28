import { NextResponse, type NextRequest } from 'next/server';
import { adminSelect, adminUpdate, isAdminConfigured } from '@/lib/supabase/rest';
import { getPayment, isConfigured } from '@/lib/yookassa';

// ЮKassa отправляет уведомления о статусе платежа на этот URL.
// В ЛК ЮKassa: Интеграция → HTTP-уведомления → URL вашего сайта/api/payments/yookassa/webhook
//
// БЕЗОПАСНОСТЬ: тело вебхука НЕ является доверенным (его может подделать кто угодно).
// Поэтому статус платежа перезапрашивается напрямую у ЮKassa через getPayment() по
// payment.id, и только подтверждённый API статус используется для обновления заказа.
// Дополнительно можно ограничить источник по IP-whitelist ЮKassa:
// https://yookassa.ru/developers/using-api/webhooks#ip

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
    const paymentId = evt.object?.id;
    if (!paymentId) {
      console.warn('[yookassa.webhook] no payment id in body');
      return NextResponse.json({ ok: true });
    }

    // Не доверяем телу вебхука — перезапрашиваем платёж напрямую у ЮKassa.
    let payment;
    try {
      payment = await getPayment(paymentId);
    } catch (e) {
      console.error('[yookassa.webhook] getPayment failed', paymentId, e);
      return NextResponse.json({ error: 'verification failed' }, { status: 400 });
    }

    const orderId = payment.metadata?.order_id;
    if (!orderId) {
      console.warn('[yookassa.webhook] no order_id in payment metadata', paymentId);
      return NextResponse.json({ ok: true });
    }

    const succeeded = payment.status === 'succeeded' && payment.paid === true;
    const status = succeeded
      ? 'paid'
      : payment.status === 'canceled'
      ? 'cancelled'
      : 'pending';

    // 1. Обновляем сам заказ (статус — из подтверждённого API-ответа, не из тела)
    await adminUpdate('orders', `id=eq.${encodeURIComponent(orderId)}`, {
      status,
      payment_id: payment.id,
      paid_at: succeeded ? new Date().toISOString() : null,
    });

    // 2. Если оплата реально подтверждена — снимаем товары заказа с витрины
    if (succeeded) {
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
