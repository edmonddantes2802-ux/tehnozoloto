import type { LeadRow } from '@/types/database';

interface BitrixLeadPayload {
  TITLE: string;
  NAME: string;
  PHONE: Array<{ VALUE: string; VALUE_TYPE: string }>;
  COMMENTS: string;
  SOURCE_ID?: string;
  UTM_SOURCE?: string;
  UTM_MEDIUM?: string;
  UTM_CAMPAIGN?: string;
  ASSIGNED_BY_ID?: number;
}

export function buildBitrixPayload(lead: LeadRow): BitrixLeadPayload {
  const details = lead.details ?? {};
  const commentLines = [
    `Категория: ${lead.category === 'gold' ? 'Золото' : 'Техника'}`,
    `Ориент. стоимость: ${lead.estimated_value ?? '—'} ₽`,
    `Детали: ${JSON.stringify(details)}`,
  ];
  return {
    TITLE: `Заявка с сайта: ${lead.category === 'gold' ? 'Золото' : 'Техника'}`,
    NAME: lead.full_name,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS: commentLines.join('\n'),
    SOURCE_ID: 'WEB',
    UTM_SOURCE: lead.utm_source ?? undefined,
    UTM_MEDIUM: lead.utm_medium ?? undefined,
    UTM_CAMPAIGN: lead.utm_campaign ?? undefined,
  };
}

export async function sendToBitrix(
  webhookUrl: string,
  lead: LeadRow,
  assignedById?: number
): Promise<string | null> {
  const payload = buildBitrixPayload(lead);
  if (assignedById) payload.ASSIGNED_BY_ID = assignedById;

  const res = await fetch(`${webhookUrl.replace(/\/$/, '')}/crm.lead.add.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: payload }),
  });

  if (!res.ok) throw new Error(`Bitrix24 HTTP ${res.status}`);
  const json = (await res.json()) as { result?: number | string };
  return json.result ? String(json.result) : null;
}
