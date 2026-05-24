import { NextResponse, type NextRequest } from 'next/server';
import { sendToBitrix } from '@/services/bitrix-service';
import type { LeadRow } from '@/types/database';

/**
 * Ручной прокси для отладки: принимает LeadRow и пушит в Bitrix24.
 * В проде синхронизация идёт через Supabase Edge Function `sync-bitrix`.
 */
export async function POST(req: NextRequest) {
  const webhook = process.env.BITRIX24_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: 'BITRIX24_WEBHOOK_URL not configured' }, { status: 500 });
  }
  try {
    const lead = (await req.json()) as LeadRow;
    const assigned = process.env.BITRIX24_ASSIGNED_BY_ID
      ? Number(process.env.BITRIX24_ASSIGNED_BY_ID)
      : undefined;
    const id = await sendToBitrix(webhook, lead, assigned);
    return NextResponse.json({ ok: true, bitrix_lead_id: id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
