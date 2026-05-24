import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { TestBanner } from '@/components/layout/TestBanner';
import { PromoBanner } from '@/components/layout/PromoBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Техно-Золото — скупка техники и золота | Оценка онлайн за 5 минут',
  description:
    'Выгодно продайте iPhone, ноутбук или золото. Оценка до 95% от рынка. Выплата наличными сразу. Работаем официально.',
  openGraph: {
    title: 'Техно-Золото — комиссионный магазин техники и золота',
    description: 'Оценка онлайн, выплата за 15 минут',
    type: 'website',
    locale: 'ru_RU',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.className}>
      <body>
        <TestBanner />
        <PromoBanner />
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Техно-Золото',
              priceRange: '$$',
              telephone: '+7 968 095-22-88',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'RU',
              },
              openingHours: 'Mo-Su 10:00-21:00',
            }),
          }}
        />
      </body>
    </html>
  );
}
