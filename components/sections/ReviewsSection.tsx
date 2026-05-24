import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Ирина К.',
    text: 'Сдала цепочку 585 пробы, оценили быстро и честно — получилось даже больше, чем ожидала. Деньги перевели на карту в тот же час.',
    rating: 5,
  },
  {
    name: 'Артём В.',
    text: 'Продавал MacBook Pro — пришёл, оценщик проверил при мне все модули, через 15 минут уже ехал домой с наличкой. Рекомендую!',
    rating: 5,
  },
  {
    name: 'Елена Д.',
    text: 'Очень понравилось, что всё по документам, с чеком и договором. Никаких тёмных схем как в соседнем ломбарде.',
    rating: 5,
  },
];

export function ReviewsSection() {
  return (
    <section className="section bg-white">
      <div className="container-corp">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4">Что говорят наши клиенты</h2>
          <p className="text-corporate-gray">
            Средняя оценка — 4.9 из 5 по отзывам на Яндекс.Картах и 2GIS.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-card border border-corporate-border bg-corporate-bg p-6"
            >
              <div className="mb-3 flex gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-corporate-gray">
                «{r.text}»
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-shine font-bold text-white">
                  {r.name[0]}
                </div>
                <div className="text-sm font-semibold text-corporate-dark">{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
