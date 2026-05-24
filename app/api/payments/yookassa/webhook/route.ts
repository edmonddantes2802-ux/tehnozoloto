import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { isConfigured } from '@/lib/yookassa';

// ЮKassa отправляет уведомления о статусе платежа на этот URL.
// В ЛК ЮKassa: Интеграция → HTTP-уведомления → URL вашего сайта/api/payments/yookassa/webhook
//
// Дополнительно ЮKassa подписывает запросы по IP — белый список IP лежит здесь:
// https://yookassa.ru/developers/using-api/webhooks#ip
// Сейчас IP-проверку не добавлял — добавьте до прода, если нужно.

interface WebhookEvent {
  event: 'payment.succeeded' | 'payment.canceled' | 'payment.waiting_for_capture' | 'refund.succeeded';
  object: {
    id: string;
    status: string;
    paid: boolean;
    amount: { value: string; currency: string };
    metadata?: Record<string, string>;
  };
}

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'yookassa not configured' }, { status: 503 });
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

    const admin = createSupabaseAdminClient();
    if (!admin) {
      console.warn('[yookassa.webhook] SUPABASE_SERVICE_ROLE_KEY not set — skip DB updates');
      return NextResponse.json({ ok: true });
    }

    try {
      // 1. Обновляем сам заказ
      const { data: updated, error: updateErr } = await admin
        .from('orders' as never)
        .update({
          status,
          payment_id: evt.object.id,
          paid_at:
            evt.event === 'payment.succeeded' ? new Date().toISOString() : null,
        } as never)
        .eq('id', orderId)
        .select('items')
        .single();

      if (updateErr) {
        console.error('[yookassa.webhook] order update failed', updateErr);
      }

      // 2. Если оплачено — снимаем все товары заказа с витрины
      if (evt.event === 'payment.succeeded' && updated) {
        const items = (updated as { items: { product_id: string }[] }).items ?? [];
        const productIds = items.map((i) => i.product_id).filter(Boolean);
        if (productIds.length > 0) {
          const { error: soldErr } = await admin
            .from('products' as never)
            .update({ is_sold: true } as never)
            .in('id', productIds);
          if (soldErr) {
            console.error('[yookassa.webhook] mark sold failed', soldErr);
          }
        }
      }
    } catch (e) {
      console.error('[yookassa.webhook] db update failed', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[yookassa.webhook]', e);
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
