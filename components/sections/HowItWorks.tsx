'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    n: '01',
    title: 'Заявка',
    text: 'Оставьте данные на сайте или напишите в WhatsApp. Займёт минуту.',
  },
  {
    n: '02',
    title: 'Оценка',
    text: 'Приходите в офис или вызовите оценщика на дом. 5–15 минут.',
  },
  {
    n: '03',
    title: 'Деньги',
    text: 'Получите всю сумму сразу удобным способом — наличные или карта.',
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-white">
      <div className="container-corp">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4">Всего 3 шага до получения выплаты</h2>
          <p className="text-corporate-gray">
            Никакой бюрократии и недель ожидания.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-[45px] hidden h-[2px] bg-gradient-to-r from-gold/10 via-gold to-gold/10 md:block"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-5 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gold-shine text-2xl font-bold text-white shadow-gold-glow">
                {s.n}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="max-w-xs text-sm text-corporate-gray">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
