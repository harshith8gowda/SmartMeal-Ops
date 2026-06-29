'use client';

import { ReactNode } from 'react';
import { useMotionPreference } from '@/lib/hooks/use-reduced-motion';
import { useDeviceTier } from '@/lib/hooks/use-device-tier';

export function SceneProvider({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const { reduceMotion } = useMotionPreference();
  const tier = useDeviceTier();

  if (reduceMotion || tier === 'low') return <>{fallback}</>;
  return <>{children}</>;
}
