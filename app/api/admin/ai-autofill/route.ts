import { NextResponse, type NextRequest } from 'next/server';
import { autofillModel, isAutofillConfigured } from '@/lib/ai-autofill';

// Защищён через middleware (matcher включает /api/admin/*).
// Принимает { query: string, categoryHint?: string }.
// Возвращает { title, brand, category, description, specs } или { error }.

export async function POST(req: NextRequest) {
  if (!isAutofillConfigured()) {
    return NextResponse.json(
      { error: 'AI не подключён' },
      { status: 503 }
    );
  }
  try {
    const body = await req.json();
    const query = typeof body?.query === 'string' ? body.query : '';
    const categoryHint =
      typeof body?.categoryHint === 'string' ? body.categoryHint : undefined;
    const result = await autofillModel({ query, categoryHint });
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error('[api/admin/ai-autofill]', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
