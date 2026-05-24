import { Diamond } from 'lucide-react';

type Size = 'sm' | 'md' | 'lg';

const sizeMap: Record<Size, { box: string; text: string; icon: number }> = {
  sm: { box: 'h-7 w-7', text: 'text-sm', icon: 14 },
  md: { box: 'h-9 w-9', text: 'text-lg', icon: 18 },
  lg: { box: 'h-12 w-12', text: 'text-2xl', icon: 24 },
};

export function Logo({ size = 'md' }: { size?: Size }) {
  const s = sizeMap[size];
  return (
    <span className="flex items-center gap-2 font-bold">
      <span
        className={`flex ${s.box} rotate-45 items-center justify-center rounded-md bg-gold-shine text-white`}
        aria-hidden
      >
        <span className="-rotate-45">
          <Diamond size={s.icon} strokeWidth={2.4} />
        </span>
      </span>
      <span className={s.text}>Техно-Золото</span>
    </span>
  );
}
