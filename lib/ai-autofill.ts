// LLM-автозаполнение характеристик по названию модели.
//
// Использование: на сервере (Server Action / API route). Поддерживается
// Anthropic Claude и OpenAI. Активируется env-переменной:
//   ANTHROPIC_API_KEY=sk-ant-...   (приоритет, если задан)
//   OPENAI_API_KEY=sk-...
//
// Один запрос ≈ $0.001–0.005 для топовых моделей. На месяц активной работы
// менеджера хватит $1–5.

export interface AutofillInput {
  query: string; // что ввёл менеджер: "ASUS X550J 8GB 1TB"
  categoryHint?: string; // например, 'laptop' — если уже выбран в форме
}

export interface AutofillOutput {
  title: string;
  brand: string;
  category: string;
  description: string;
  specs: Record<string, string>;
}

export function isAutofillConfigured(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

const SYSTEM_PROMPT = `Ты — помощник для оператора комиссионного магазина б/у техники.
По названию модели (которое может быть неполным или с опечаткой) ты возвращаешь
структурированную информацию для карточки товара. Отвечаешь СТРОГО валидным JSON
без markdown-обёртки, без комментариев.

Структура:
{
  "title": "точное полное название модели, нормализованное (Apple iPhone X 64GB → 'iPhone X 64GB')",
  "brand": "название бренда (Apple, Samsung, Xiaomi, ASUS, Lenovo, Sony, Bose, и т.п.)",
  "category": "одна из категорий: smartphone, tablet, laptop, desktop_pc, monitor, console, console_game, audio_headphones, audio_speaker, tv, camera, camera_lens, ebook, smartwatch, drone, network, gaming_periph, appliance_large, appliance_kitchen, appliance_clean, appliance_care, tool_power, tool_hand, tool_garden, gold, silver, gem, watch_lux, ebike, escooter, skateboard, music_instrument, sports, book, collectibles, other",
  "description": "одно предложение на русском, ёмкое (8-15 слов)",
  "specs": {
    "Параметр1": "Значение1",
    "Параметр2": "Значение2",
    ...
  }
}

Для смартфонов/планшетов в specs обязательно: Чип, RAM, Хранилище, Экран, Камера.
Для ноутбуков: Процессор, RAM, Хранилище, Экран, при наличии Видеокарта.
Для бытовой техники: тип, основные характеристики (вместимость, мощность и т.п.).
Для золота: Проба, Вес, Плетение (если цепь).

Если не уверен в spec — лучше не указывай, чем выдумывать.
Если запрос не похож на товар — верни {"error": "не похоже на технику"}.

ВЕСЬ ОТВЕТ — только JSON, никакого текста до или после.`;

const USER_PROMPT_TEMPLATE = (input: AutofillInput) => {
  const hint = input.categoryHint
    ? `\nВ форме выбрана категория: ${input.categoryHint}.`
    : '';
  return `Заполни карточку товара: "${input.query}".${hint}`;
};

function safeParseJson(text: string): Record<string, unknown> | null {
  // LLM иногда возвращает текст в ```json ... ```; вытащим первую {...} пару.
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

async function callAnthropic(input: AutofillInput): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: USER_PROMPT_TEMPLATE(input) }],
    }),
  });
  if (!res.ok) {
    console.error('[ai-autofill:anthropic]', res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((b) => b.type === 'text')?.text ?? '';
  return safeParseJson(text);
}

async function callOpenAI(input: AutofillInput): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT_TEMPLATE(input) },
      ],
    }),
  });
  if (!res.ok) {
    console.error('[ai-autofill:openai]', res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content ?? '';
  return safeParseJson(text);
}

export async function autofillModel(
  input: AutofillInput
): Promise<AutofillOutput | { error: string }> {
  if (!isAutofillConfigured()) {
    return { error: 'AI не подключён: задайте ANTHROPIC_API_KEY или OPENAI_API_KEY' };
  }
  if (!input.query.trim() || input.query.length < 3) {
    return { error: 'Слишком короткий запрос' };
  }

  // Сначала Anthropic, при ошибке — OpenAI.
  let parsed = await callAnthropic(input);
  if (!parsed) parsed = await callOpenAI(input);
  if (!parsed) return { error: 'Не удалось получить ответ от AI' };
  if (typeof parsed.error === 'string') return { error: parsed.error };

  // Нормализация specs: значения приводим к строкам
  const rawSpecs = (parsed.specs ?? {}) as Record<string, unknown>;
  const specs: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawSpecs)) {
    if (v === null || v === undefined) continue;
    specs[String(k)] = String(v);
  }

  return {
    title: String(parsed.title ?? input.query),
    brand: String(parsed.brand ?? ''),
    category: String(parsed.category ?? 'other'),
    description: String(parsed.description ?? ''),
    specs,
  };
}
