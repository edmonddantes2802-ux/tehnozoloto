// Telegram-уведомления о заказах.
//
// Настройка (один раз):
//   1. В Telegram написать @BotFather, команда /newbot → получить TOKEN.
//   2. С аккаунта, на который должны приходить уведомления (например,
//      привязанного к +79680952288), написать своему боту /start.
//   3. Открыть в браузере:
//        https://api.telegram.org/bot<TOKEN>/getUpdates
//      Найти "chat":{"id": <число>} — это TELEGRAM_CHAT_ID.
//   4. В Coolify env прописать:
//        TELEGRAM_BOT_TOKEN=<TOKEN>
//        TELEGRAM_CHAT_ID=<число>
//
// Telegram Bot API не позволяет писать по номеру телефона — только в чат,
// где пользователь сам инициировал диалог с ботом. Если нужны уведомления
// нескольким получателям — TELEGRAM_CHAT_ID можно сделать списком через
// запятую: "111111,222222".

const TG_API = 'https://api.telegram.org';

export function isTelegramConfigured(): boolean {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

interface NotifyOrderInput {
  orderId: string | null;
  customer: { full_name: string; phone: string };
  items: { title: string; price: number }[];
  delivery: 'pickup' | 'courier_msk' | 'regions';
  total: number;
  paymentLink?: string;
}

const deliveryLabel: Record<string, string> = {
  pickup: 'Самовывоз',
  courier_msk: 'Доставка по Москве',
  regions: 'Доставка в регионы',
};

function fmtPrice(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildOrderMessage(input: NotifyOrderInput): string {
  const lines: string[] = [];
  lines.push('🛒 <b>Новый заказ</b>');
  if (input.orderId) {
    lines.push(`<b>№</b> <code>${input.orderId.slice(0, 8)}</code>`);
  }
  lines.push('');
  lines.push(`<b>Клиент:</b> ${escapeHtml(input.customer.full_name)}`);
  lines.push(`<b>Телефон:</b> ${escapeHtml(input.customer.phone)}`);
  lines.push(`<b>Доставка:</b> ${deliveryLabel[input.delivery]}`);
  lines.push('');
  lines.push('<b>Товары:</b>');
  for (const item of input.items) {
    lines.push(`• ${escapeHtml(item.title)} — ${fmtPrice(item.price)}`);
  }
  lines.push('');
  lines.push(`<b>Итого: ${fmtPrice(input.total)}</b>`);
  if (input.paymentLink) {
    lines.push('');
    lines.push(`<a href="${input.paymentLink}">Ссылка на оплату ЮKassa</a>`);
  } else {
    lines.push('');
    lines.push('⚠️ ЮKassa не подключена — выставите счёт вручную.');
  }
  return lines.join('\n');
}

// Если в окружении есть прокси (HTTPS_PROXY / HTTP_PROXY) — отправляем через
// undici.fetch с ProxyAgent (глобальный fetch Node 24 кастомные dispatcher не
// принимает). На прод-сервере без прокси используется обычный fetch.
async function sendToChat(
  token: string,
  chatId: string,
  text: string
): Promise<void> {
  const url = `${TG_API}/bot${token}/sendMessage`;
  const body = JSON.stringify({
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
  const headers = { 'Content-Type': 'application/json' };
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

  let res: Response;
  if (proxyUrl) {
    const { ProxyAgent, fetch: undiciFetch } = await import('undici');
    res = (await undiciFetch(url, {
      method: 'POST',
      headers,
      body,
      dispatcher: new ProxyAgent(proxyUrl),
    })) as unknown as Response;
  } else {
    res = await fetch(url, { method: 'POST', headers, body });
  }

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Telegram ${res.status}: ${errBody}`);
  }
}

export async function notifyOrder(input: NotifyOrderInput): Promise<void> {
  if (!isTelegramConfigured()) return;
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatIds = process.env
    .TELEGRAM_CHAT_ID!.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const text = buildOrderMessage(input);

  await Promise.allSettled(
    chatIds.map((chatId) =>
      sendToChat(token, chatId, text).catch((e) => {
        console.error(`[telegram.notify] chat=${chatId}`, e);
      })
    )
  );
}
