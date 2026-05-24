'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { fetchMyLeads } from '@/services/leads-service';
import { formatRub } from '@/lib/utils';
import { Button } from '@/components/shared/Button';
import { Skeleton } from '@/components/shared/Skeleton';
import type { LeadRow } from '@/types/database';

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'Новая', color: 'bg-warning/10 text-warning' },
  processing: { label: 'В обработке', color: 'bg-gold/10 text-gold-dark' },
  completed: { label: 'Выкуплена', color: 'bg-success/10 text-success' },
  rejected: { label: 'Отклонена', color: 'bg-danger/10 text-danger' },
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchMyLeads()
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLeadsLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="container-corp py-12">
        <Skeleton className="mb-6 h-10 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-corp py-16 text-center">
        <h1 className="mb-4">Личный кабинет</h1>
        <p className="mb-8 text-corporate-gray">
          Войдите по номеру телефона, чтобы увидеть историю заявок.
        </p>
        <Link href="/login">
          <Button>Войти по SMS</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-corp py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-1">Личный кабинет</h1>
          <p className="text-corporate-gray">{user.phone ?? user.email}</p>
        </div>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '79680952288'}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline">Связаться с оценщиком</Button>
        </a>
      </div>

      <h2 className="mb-4 text-xl font-semibold">Мои заявки</h2>
      {leadsLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-card border border-corporate-border bg-white p-8 text-center text-corporate-gray">
          Заявок пока нет.{' '}
          <Link href="/#calculator" className="font-semibold text-gold hover:underline">
            Оценить вещь →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => {
            const s = statusLabels[lead.status] ?? statusLabels.new;
            return (
              <div
                key={lead.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-corporate-border bg-white p-5"
              >
                <div>
                  <div className="mb-1 font-semibold">
                    {lead.category === 'gold' ? 'Золото' : 'Техника'}
                  </div>
                  <div className="text-xs text-corporate-muted">
                    {new Date(lead.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-lg font-bold text-primary">
                    {lead.estimated_value ? formatRub(lead.estimated_value) : '—'}
                  </div>
                  <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
