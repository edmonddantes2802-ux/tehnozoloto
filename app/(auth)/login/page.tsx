import type { Metadata } from 'next';
import { PhoneOTPForm } from '@/components/forms/PhoneOTPForm';

export const metadata: Metadata = { title: 'Вход — Техно-Золото' };

export default function LoginPage() {
  return (
    <div className="bg-corporate-bg py-16">
      <PhoneOTPForm />
    </div>
  );
}
