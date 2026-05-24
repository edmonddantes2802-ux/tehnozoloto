import { MapPin, Phone, Clock } from 'lucide-react';
import { LEGAL } from '@/lib/legal';

const ADDRESS = LEGAL.pickupAddress;
const MAP_QUERY = encodeURIComponent(ADDRESS);

export function LocationSection() {
  return (
    <section id="location" className="section bg-white">
      <div className="container-corp">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="mb-3">Где нас найти</h2>
          <p className="text-corporate-gray">
            Приходите в офис на бесплатную экспертизу — работаем без выходных.
          </p>
        </div>

        <div className="grid gap-8 overflow-hidden rounded-card border border-corporate-border bg-white shadow-card-rest lg:grid-cols-[380px_1fr]">
          <div className="space-y-6 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                <MapPin size={20} />
              </div>
              <div>
                <div className="mb-1 text-sm font-semibold text-corporate-muted">
                  Адрес офиса
                </div>
                <div className="text-base font-semibold text-corporate-dark">
                  {ADDRESS}
                </div>
                <a
                  href={`https://yandex.ru/maps/?text=${MAP_QUERY}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-gold hover:underline"
                >
                  Построить маршрут →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                <Clock size={20} />
              </div>
              <div>
                <div className="mb-1 text-sm font-semibold text-corporate-muted">
                  Режим работы
                </div>
                <div className="text-base font-semibold text-corporate-dark">
                  {LEGAL.workingHours}
                </div>
                <div className="text-sm text-corporate-gray">Без выходных и праздников</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-corp bg-gold/10 text-gold-dark">
                <Phone size={20} />
              </div>
              <div>
                <div className="mb-1 text-sm font-semibold text-corporate-muted">
                  Телефон
                </div>
                <a
                  href={LEGAL.phoneRaw}
                  className="text-base font-semibold text-corporate-dark hover:text-gold"
                >
                  {LEGAL.phone}
                </a>
                <div className="text-sm text-corporate-gray">Звонок бесплатный</div>
              </div>
            </div>

            <div className="rounded-corp bg-corporate-bg p-4 text-sm text-corporate-gray">
              💡 <b>Совет:</b> позвоните перед визитом, если привозите крупный заказ — мы подготовим оценщика и ускорим сделку.
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <iframe
              title="Техно-Золото на Яндекс.Картах"
              src={`https://yandex.ru/map-widget/v1/?text=${MAP_QUERY}&z=16`}
              width="100%"
              height="100%"
              frameBorder={0}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
