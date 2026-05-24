import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-corporate-border bg-white p-6 shadow-card-rest transition-shadow hover:shadow-card-hover',
        className
      )}
      {...props}
    />
  );
}
