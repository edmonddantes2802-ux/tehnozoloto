import { AlertTriangle } from 'lucide-react';

export function TestBanner() {
  return (
    <div className="border-b border-amber-500/40 bg-amber-50 text-amber-900">
      <div className="container-corp flex items-start gap-3 py-2.5 text-sm md:items-center">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 md:mt-0" />
        <div>
          <strong className="font-semibold">Демонстрационная версия сайта.</strong>{' '}
          Сайт является шаблоном для презентации функциональности. Оплата не
          принимается, заявки не обрабатываются, реквизиты и цены — тестовые.
          Никаких договорных обязательств перед посетителями не возникает.
        </div>
      </div>
    </div>
  );
}
