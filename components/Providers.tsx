'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

// reducedMotion="user" заставляет framer-motion уважать системную настройку
// «уменьшить движение»: для таких пользователей transform/opacity-анимации гасятся.
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
