import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';

export function Footer() {
  return (
    <footer id="contacts" className="bg-corporate-dark text-white">
      <div className="container-corp grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <p className="text-sm text-white/60">
            Комиссионный магазин техники и золота. Честная оценка, быстрая выплата.
          </p>
        </div>
        <div>
          <div className="mb-3 font-semibold text-gold">Навигация</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/#calculator" className="hover:text-gold">Оценка</Link></li>
            <li><Link href="/catalog" className="hover:text-gold">Каталог</Link></li>
            <li><Link href="/delivery" className="hover:text-gold">Доставка и оплата</Link></li>
            <li><Link href="/#faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link href="/profile" className="hover:text-gold">Личный кабинет</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold text-gold">Контакты</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="tel:+79680952288" className="hover:text-gold">
                +7 (968) 095-22-88
              </a>
            </li>
            <li>
              <a href="mailto:edmonddantes2802@gmail.com" className="hover:text-gold">
                edmonddantes2802@gmail.com
              </a>
            </li>
            <li>Ежедневно 10:00 – 21:00</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold text-gold">Реквизиты</div>
          <ul className="space-y-1 text-sm text-white/70">
            <li>Самозанятый</li>
            <li>Рязапов Ильдар Маратович</li>
            <li>ИНН 632406615124</li>
          </ul>
          <div className="mb-2 mt-4 font-semibold text-gold">Документы</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/offer" className="hover:text-gold">Публичная оферта</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Политика конфиденциальности</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-corp py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Техно-Золото. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
