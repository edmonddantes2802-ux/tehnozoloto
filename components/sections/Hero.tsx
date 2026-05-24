'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Wallet, Lock } from 'lucide-react';
import { Button } from '@/components/shared/Button';

const bullets = [
  { icon: ShieldCheck, text: 'Честная оценка по рыночным курсам' },
  { icon: Wallet, text: 'Выплата наличными или на карту' },
  { icon: Lock, text: 'Полная конфиденциальность сделки' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-corporate-bg">
      <div className="container-corp grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-4 inline-block rounded-corp bg-gold/10 px-3 py-1 text-sm font-semibold text-gold-dark">
            🔥 Скидка 10% на комиссию в честь открытия
          </span>
          <h1 className="mb-5">
            Деньги за 15 минут{' '}
            <span className="gold-text">под залог или выкуп</span> техники и золота
          </h1>
          <p className="mb-8 max-w-lg text-lg text-corporate-gray">
            Оцените стоимость онлайн и получите до 95% от рыночной цены сегодня.
            Работаем по банковским стандартам безопасности.
          </p>

          <ul className="mb-8 space-y-3">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-corporate-dark">
                <span className="flex h-8 w-8 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                  <Icon size={18} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <a href="#calculator">
              <Button size="lg">Узнать стоимость</Button>
            </a>
            <a href="/catalog">
              <Button size="lg" variant="outline">
                Смотреть витрину
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-card bg-gradient-to-br from-primary to-corporate-dark p-8 text-white shadow-card-hover">
            <div className="mb-6 text-sm uppercase tracking-wider text-gold">
              Сегодня в 14:00
            </div>
            <div className="mb-2 text-sm text-white/60">Цена золота 585 пробы</div>
            <div className="mb-6 text-5xl font-bold gold-text">3 500 ₽ / грамм</div>
            <div className="mb-6 h-px bg-white/10" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-gold">15</div>
                <div className="text-xs text-white/60">минут на сделку</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold">95%</div>
                <div className="text-xs text-white/60">от рыночной цены</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold">10+</div>
                <div className="text-xs text-white/60">лет опыта</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
