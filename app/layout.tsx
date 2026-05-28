import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { TestBanner } from '@/components/layout/TestBanner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { LEGAL } from '@/lib/legal';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Техно-Золото — скупка техники и золота | Оценка онлайн за 5 минут',
  description:
    'Выгодно продайте iPhone, ноутбук или золото. Оценка до 95% от рынка. Выплата наличными сразу. Работаем официально.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Техно-Золото — комиссионный магазин техники и золота',
    description: 'Оценка онлайн, выплата сразу. Скупка и продажа техники и золота.',
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Техно-Золото',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Техно-Золото — скупка техники и золота',
    description: 'Оценка онлайн, выплата сразу.',
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
        <Providers>
          <TestBanner />
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-center" richColors />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: LEGAL.brand,
              url: SITE_URL,
              priceRange: '₽₽',
              telephone: LEGAL.phone,
              email: LEGAL.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: LEGAL.pickupAddress,
                addressCountry: 'RU',
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '10:00',
                closes: '21:00',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
