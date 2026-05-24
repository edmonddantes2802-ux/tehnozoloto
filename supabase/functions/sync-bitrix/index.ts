// Supabase Edge Function (Deno runtime)
// Триггерится Database Webhook на INSERT INTO leads.
// Проверяет дубли по телефону (окно 5 минут), шлёт новый lead в Bitrix24,
// обновляет bitrix_lead_id / is_duplicate в исходной записи.
//
// Deploy:
//   supabase functions deploy sync-bitrix
//   supabase secrets set BITRIX24_WEBHOOK_URL=... BITRIX24_ASSIGNED_BY_ID=1

// @ts-ignore — Deno std
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
// @ts-ignore — Supabase Deno SDK
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface LeadPayload {
  id: string;
  full_name: string;
  phone: string;
  category: 'gold' | 'tech';
  details: Record<string, unknown> | null;
  estimated_value: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

interface WebhookRequest {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: LeadPayload;
  old_record: LeadPayload | null;
}

// @ts-ignore
const BITRIX_URL = Deno.env.get('BITRIX24_WEBHOOK_URL')!;
// @ts-ignore
const ASSIGNED_BY = Deno.env.get('BITRIX24_ASSIGNED_BY_ID') ?? '1';
// @ts-ignore
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// @ts-ignore
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { record, type } = (await req.json()) as WebhookRequest;
    if (type !== 'INSERT' || !record) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    // Duplicate check: same phone in the last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: dups } = await supabase
      .from('leads')
      .select('id, bitrix_lead_id')
      .eq('phone', record.phone)
      .gt('created_at', fiveMinAgo)
      .neq('id', record.id);

    if (dups && dups.length > 0) {
      await supabase
        .from('leads')
        .update({ is_duplicate: true, status: 'processing' })
        .eq('id', record.id);
      return new Response(
        JSON.stringify({ ok: true, duplicate: true }),
        { status: 200 }
      );
    }

    // Build Bitrix payload
    const categoryLabel = record.category === 'gold' ? 'Золото' : 'Техника';
    const comments = [
      `Категория: ${categoryLabel}`,
      `Ориентировочная цена: ${record.estimated_value ?? '—'} ₽`,
      `Детали: ${JSON.stringify(record.details ?? {})}`,
      record.utm_source ? `UTM: ${record.utm_source} / ${record.utm_medium} / ${record.utm_campaign}` : '',
    ].filter(Boolean).join('\n');

    const fields = {
      TITLE: `Заявка с сайта: ${categoryLabel}`,
      NAME: record.full_name,
      PHONE: [{ VALUE: record.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: comments,
      SOURCE_ID: 'WEB',
      ASSIGNED_BY_ID: Number(ASSIGNED_BY),
      UTM_SOURCE: record.utm_source ?? undefined,
      UTM_MEDIUM: record.utm_medium ?? undefined,
      UTM_CAMPAIGN: record.utm_campaign ?? undefined,
    };

    const bxResp = await fetch(`${BITRIX_URL.replace(/\/$/, '')}/crm.lead.add.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });

    if (!bxResp.ok) {
      throw new Error(`Bitrix HTTP ${bxResp.status}`);
    }

    const json = await bxResp.json();
    const bitrixId = json.result ? String(json.result) : null;

    await supabase
      .from('leads')
      .update({ bitrix_lead_id: bitrixId, status: 'processing' })
      .eq('id', record.id);

    return new Response(
      JSON.stringify({ ok: true, bitrix_lead_id: bitrixId }),
      { status: 200 }
    );
  } catch (e) {
    console.error('[sync-bitrix]', e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500 }
    );
  }
});
