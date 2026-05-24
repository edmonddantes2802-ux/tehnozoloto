// ЮKassa REST API клиент.
// Документация: https://yookassa.ru/developers/api
//
// ENV:
//   YOOKASSA_SHOP_ID         — shopId из ЛК ЮKassa
//   YOOKASSA_SECRET_KEY      — секретный ключ
//   YOOKASSA_BASE_URL        — опц., по умолчанию https://api.yookassa.ru/v3
//
// Пока ключи не заданы, isConfigured() возвращает false и createPayment()
// бросает CONFIG_MISSING — позволяет UI показать заглушку «менеджер перезвонит».

const API = process.env.YOOKASSA_BASE_URL ?? 'https://api.yookassa.ru/v3';

export interface YookassaPayment {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  paid: boolean;
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url?: string };
  description?: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentInput {
  amount: number;
  description: string;
  returnUrl: string;
  metadata?: Record<string, string>;
  customerEmail?: string;
  customerPhone?: string;
}

export function isConfigured(): boolean {
  return !!(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

export class YookassaError extends Error {
  constructor(public code: string, message: string, public details?: unknown) {
    super(message);
    this.name = 'YookassaError';
  }
}

function authHeader(): string {
  const shopId = process.env.YOOKASSA_SHOP_ID;
  const secret = process.env.YOOKASSA_SECRET_KEY;
  return 'Basic ' + Buffer.from(`${shopId}:${secret}`).toString('base64');
}

function uuid(): string {
  // Idempotence-Key — должен быть уникальным для каждой попытки оплаты
  return globalThis.crypto?.randomUUID?.() ??
    Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function createPayment(
  input: CreatePaymentInput
): Promise<YookassaPayment> {
  if (!isConfigured()) {
    throw new YookassaError(
      'CONFIG_MISSING',
      'YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY not set'
    );
  }

  const body: Record<string, unknown> = {
    amount: { value: input.amount.toFixed(2), currency: 'RUB' },
    capture: true,
    confirmation: { type: 'redirect', return_url: input.returnUrl },
    description: input.description,
    metadata: input.metadata,
  };

  // Чек самозанятого через ФНС («Мой налог») — формируется ЮKassa автоматически,
  // если в ЛК подключена интеграция «Самозанятость». Здесь мы лишь передаём
  // плательщика, чтобы чек ушёл на его email/телефон.
  if (input.customerEmail || input.customerPhone) {
    body.receipt = {
      customer: {
        ...(input.customerEmail && { email: input.customerEmail }),
        ...(input.customerPhone && { phone: input.customerPhone }),
      },
      items: [
        {
          description: input.description.slice(0, 128),
          quantity: '1.00',
          amount: { value: input.amount.toFixed(2), currency: 'RUB' },
          vat_code: 1, // НДС не облагается (самозанятый)
          payment_subject: 'commodity',
          payment_mode: 'full_payment',
        },
      ],
    };
  }

  const res = await fetch(`${API}/payments`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Idempotence-Key': uuid(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new YookassaError(
      'API_ERROR',
      `ЮKassa API ${res.status}`,
      details
    );
  }

  return (await res.json()) as YookassaPayment;
}

export async function getPayment(paymentId: string): Promise<YookassaPayment> {
  if (!isConfigured()) {
    throw new YookassaError('CONFIG_MISSING', 'YooKassa not configured');
  }
  const res = await fetch(`${API}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) {
    throw new YookassaError('API_ERROR', `ЮKassa API ${res.status}`);
  }
  return (await res.json()) as YookassaPayment;
}
