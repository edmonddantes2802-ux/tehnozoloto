'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';
import { formatRub } from '@/lib/utils';

export function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<number>(0);
  const inView = useInView(ref, { once: false });

  useEffect(() => {
    if (!ref.current) return;
    const from = prevRef.current;
    const to = value;
    const controls = animate(from, to, {
      duration: 0.5,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = formatRub(Math.round(v));
      },
    });
    prevRef.current = to;
    return () => controls.stop();
  }, [value, inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatRub(value)}
    </span>
  );
}
