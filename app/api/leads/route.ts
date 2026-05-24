import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { leadSchema } from '@/lib/validators';
import { notifyLead } from '@/lib/telegram';

const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  rateLimitMap.set(ip, arr);
  return arr.length <= MAX_REQUESTS;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // honeypot — silent success
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    // Telegram-уведомление о новой заявке — fire-and-forget, не блокирует
    // ответ клиенту даже при недоступности БД.
    notifyLead({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      category: parsed.data.category,
      estimated_value: parsed.data.estimated_value ?? null,
      details: parsed.data.details ?? null,
    }).catch((e) => console.error('[leads:telegram]', e));

    const admin = createSupabaseAdminClient();
    if (!admin) {
      console.warn('[leads.insert] SUPABASE_SERVICE_ROLE_KEY not set — lead not persisted');
      // Не блокируем пользователя: лид всё равно дойдёт через Telegram
      return NextResponse.json({ ok: true, persisted: false });
    }

    const { error } = await admin.from('leads').insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      category: parsed.data.category,
      details: parsed.data.details ?? null,
      estimated_value: parsed.data.estimated_value ?? null,
      utm_source: parsed.data.utm_source ?? null,
      utm_medium: parsed.data.utm_medium ?? null,
      utm_campaign: parsed.data.utm_campaign ?? null,
      user_id: null,
    } as never);

    if (error) {
      console.error('[leads.insert]', error);
      return NextResponse.json(
        { error: 'Сервис временно недоступен. Мы уже чиним.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[leads.POST]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
