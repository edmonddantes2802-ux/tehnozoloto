import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Техно-Золото',
  description:
    'Как мы обрабатываем персональные данные пользователей сайта в соответствии с 152-ФЗ.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-12">
      <div className="container-corp max-w-3xl">
        <h1 className="mb-2">Политика конфиденциальности</h1>
        <p className="mb-8 text-sm text-corporate-muted">
          Редакция от {new Date(LEGAL.offerDate).toLocaleDateString('ru-RU')}
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-corporate-gray">
          <p>
            Настоящая Политика описывает порядок обработки персональных данных
            индивидуальным предпринимателем {LEGAL.fullName}, ИНН {LEGAL.inn} (далее — «Оператор»),
            пользователей сайта (далее — «Пользователь»), в соответствии
            с Федеральным законом № 152-ФЗ «О персональных данных».
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            1. Какие данные собираются
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>имя или обращение (при заполнении форм);</li>
            <li>номер телефона;</li>
            <li>адрес электронной почты (если указали);</li>
            <li>данные о товаре, по которому оставлена заявка;</li>
            <li>
              технические данные: IP-адрес, тип браузера, источник перехода,
              UTM-метки, cookies-идентификаторы;
            </li>
            <li>
              геолокация — только в случае использования картового сервиса
              и с разрешения браузера.
            </li>
          </ul>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            2. Цели обработки
          </h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>обработка заявок на оценку и продажу товаров;</li>
            <li>оформление сделок и выдача документов;</li>
            <li>обратная связь, уведомления о статусе заказа;</li>
            <li>исполнение требований налогового и кассового законодательства;</li>
            <li>веб-аналитика и улучшение работы сайта.</li>
          </ul>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            3. Основания обработки
          </h2>
          <p>
            Согласие субъекта персональных данных (ст. 6 ч. 1 п. 1 152-ФЗ),
            а также заключение и исполнение договора, стороной которого является
            Пользователь (ст. 6 ч. 1 п. 5).
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            4. Передача третьим лицам
          </h2>
          <p>
            Данные могут передаваться: платёжному оператору ЮKassa (АО «ЮMoney»)
            для проведения платежа; перевозчикам (СДЭК, Boxberry, Почта России)
            для доставки; ФНС России — в части кассовых чеков через сервис «Мой
            налог»; сервису Bitrix24 — для управления заявками в CRM. Передача
            иным лицам не производится.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            5. Сроки хранения
          </h2>
          <p>
            Данные хранятся до достижения целей обработки или до отзыва согласия,
            но не более 5 лет — для целей бухгалтерского и налогового учёта.
            После — уничтожаются или обезличиваются.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            6. Права пользователя
          </h2>
          <p>
            Пользователь имеет право: получить информацию об обработке своих
            данных; уточнить, заблокировать или удалить их; отозвать согласие.
            Для реализации — направьте запрос на {LEGAL.email}.
          </p>

          <h2 className="mb-2 mt-6 text-xl font-semibold text-primary">
            7. Контакты Оператора
          </h2>
          <ul className="space-y-1 text-corporate-dark">
            <li>{LEGAL.status}</li>
            <li>{LEGAL.fullName}</li>
            <li>ИНН: {LEGAL.inn}</li>
            <li>Email: {LEGAL.email}</li>
            <li>Телефон: {LEGAL.phone}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
