import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createPayment, isConfigured, YookassaError } from '@/lib/yookassa';
import { notifyOrder } from '@/lib/telegram';

const orderSchema = z.object({
  customer: z.object({
    full_name: z.string().trim().min(2),
    phone: z.string().regex(/^\+7\d{10}$/),
    email: z.string().email().optional(),
  }),
  items: z
    .array(
      z.object({
        product_id: z.string(),
        title: z.string(),
        price: z.number().nonnegative(),
      })
    )
    .min(1, 'Корзина пуста'),
  delivery: z.enum(['pickup', 'courier_msk', 'regions']),
  total: z.number().nonnegative(),
});

const deliveryLabel: Record<string, string> = {
  pickup: 'Самовывоз',
  courier_msk: 'Доставка по Москве',
  regions: 'Доставка в регионы',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { customer, items, delivery, total } = parsed.data;

    // Best-effort сохранение заказа в Supabase через admin (service_role)
    // клиента — он обходит RLS, что позволяет и записать, и сразу вернуть id
    // без отдельной SELECT-политики. Если Supabase не настроен или упал —
    // заказ всё равно создаётся в ЮKassa, чтобы клиент мог оплатить.
    let orderId: string | null = null;
    try {
      const admin = createSupabaseAdminClient();
      if (admin) {
        const { data, error } = await admin
          .from('orders' as never)
          .insert({
            customer_name: customer.full_name,
            customer_phone: customer.phone,
            customer_email: customer.email ?? null,
            delivery_method: delivery,
            items: items as unknown,
            total,
            status: 'pending',
          } as never)
          .select('id')
          .single();
        if (error) {
          console.error('[orders.create] supabase insert failed', error);
        } else if (data) {
          orderId = (data as { id: string }).id;
        }
      } else {
        console.warn('[orders.create] SUPABASE_SERVICE_ROLE_KEY not set — order not persisted');
      }
    } catch (e) {
      console.error('[orders.create] supabase unavailable', e);
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

    // Если ЮKassa не настроена — отвечаем 200, фронт покажет «менеджер перезвонит»
    if (!isConfigured()) {
      // Уведомление в Telegram (если настроено) — без ссылки на оплату
      notifyOrder({
        orderId,
        customer,
        items: items.map((i) => ({ title: i.title, price: i.price })),
        delivery,
        total,
      }).catch((e) => console.error('[orders.create:telegram]', e));

      return NextResponse.json({
        ok: true,
        manual: true,
        order_id: orderId,
        message:
          'ЮKassa пока не подключена. Менеджер пришлёт ссылку на оплату вручную.',
      });
    }

    const description = `Заказ${orderId ? ` #${orderId.slice(0, 8)}` : ''}: ${items
      .map((i) => i.title)
      .join(', ')
      .slice(0, 120)} · ${deliveryLabel[delivery]}`;

    const payment = await createPayment({
      amount: total,
      description,
      returnUrl: `${siteUrl}/cart/success${orderId ? `?order=${orderId}` : ''}`,
      metadata: {
        order_id: orderId ?? '',
        delivery,
        phone: customer.phone,
      },
      customerPhone: customer.phone,
      customerEmail: customer.email,
    });

    // Уведомление в Telegram со ссылкой на оплату
    notifyOrder({
      orderId,
      customer,
      items: items.map((i) => ({ title: i.title, price: i.price })),
      delivery,
      total,
      paymentLink: payment.confirmation?.confirmation_url,
    }).catch((e) => console.error('[orders.create:telegram]', e));

    return NextResponse.json({
      ok: true,
      order_id: orderId,
      payment_id: payment.id,
      confirmation_url: payment.confirmation?.confirmation_url,
    });
  } catch (e) {
    if (e instanceof YookassaError) {
      console.error('[orders.create:yookassa]', e.code, e.message, e.details);
      return NextResponse.json(
        { error: 'Не удалось создать платёж. Попробуйте позже или свяжитесь с менеджером.' },
        { status: 502 }
      );
    }
    console.error('[orders.create]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
