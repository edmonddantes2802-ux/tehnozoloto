'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Какие документы нужны для сделки?',
    a: 'Достаточно паспорта РФ. Для юрлиц — реквизиты. Для техники с зарядкой и документами оценка может быть выше.',
  },
  {
    q: 'Как хранится золото после приёма?',
    a: 'Все изделия попадают в сертифицированное хранилище с круглосуточной охраной и видеонаблюдением.',
  },
  {
    q: 'Безопасны ли мои персональные данные?',
    a: 'Да. Мы шифруем данные на уровне БД (AES-256), работаем по GDPR и 152-ФЗ. Никому не передаём информацию.',
  },
  {
    q: 'Можно ли выкупить вещь обратно?',
    a: 'Да, если вы оформляли залог. В течение срока договора вы можете выкупить изделие с небольшим процентом.',
  },
  {
    q: 'Сколько ждать деньги?',
    a: 'Сразу после оценки: наличные на месте или перевод на карту в течение 5 минут через СБП.',
  },
  {
    q: 'Что если техника не включается?',
    a: 'Мы всё равно оцениваем: на запчасти цена будет ниже, но мы не откажем. Привозите — оценщик посмотрит.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="section bg-corporate-bg">
      <div className="container-corp max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4">Отвечаем на частые вопросы</h2>
          <p className="text-corporate-gray">
            Если вашего вопроса нет — напишите нам в WhatsApp.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const open = openIdx === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-card border border-corporate-border bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold text-corporate-dark"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={cn(
                      'flex-shrink-0 text-gold transition-transform',
                      open && 'rotate-180'
                    )}
                    size={20}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 text-sm text-corporate-gray">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
