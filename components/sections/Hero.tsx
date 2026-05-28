'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Wallet,
  Lock,
  Gem,
  Coins,
  Smartphone,
  Laptop,
  Tv,
  Speaker,
  Tablet,
  Camera,
  Watch,
  Crown,
  Dumbbell,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/shared/Button';

const bullets = [
  { icon: ShieldCheck, text: 'Честная оценка по рыночным курсам' },
  { icon: Wallet, text: 'Выплата наличными или на карту' },
  { icon: Lock, text: 'Полная конфиденциальность сделки' },
];

const accepted = [
  { icon: Gem, label: 'Золото и лом' },
  { icon: Coins, label: 'Серебро' },
  { icon: Smartphone, label: 'Смартфоны' },
  { icon: Laptop, label: 'Ноутбуки и ПК' },
  { icon: Tv, label: 'ТВ и приставки' },
  { icon: Speaker, label: 'Аудиотехника' },
  { icon: Tablet, label: 'Планшеты и гаджеты' },
  { icon: Camera, label: 'Фото и видео' },
  { icon: Watch, label: 'Часы' },
  { icon: Crown, label: 'Антиквариат' },
  { icon: Dumbbell, label: 'Спортинвентарь' },
  { icon: Wrench, label: 'Электроинструмент' },
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
            <div className="mb-1 text-sm uppercase tracking-wider text-gold">
              Что мы принимаем
            </div>
            <div className="mb-6 text-2xl font-bold">
              Техника, золото <span className="gold-text">и ценности</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {accepted.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-medium text-white/90">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 h-px bg-white/10" />
            <p className="mt-4 text-sm text-white/70">
              И другие ценности — оценим индивидуально
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
