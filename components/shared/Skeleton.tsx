import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-corp bg-corporate-border/60',
        className
      )}
    />
  );
}
